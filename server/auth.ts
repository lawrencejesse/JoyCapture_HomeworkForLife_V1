import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser, insertUserSchema } from "@shared/schema";
import admin from 'firebase-admin';
import { z } from 'zod';

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

// Parse and validate service account credentials from environment variable
const serviceAccountString = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!serviceAccountString) {
  throw new Error("FIREBASE_SERVICE_ACCOUNT environment variable not set.");
}
let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountString);
} catch (e) {
  console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", e);
  throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT JSON format.");
}

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  try {
    // console.log("comparePasswords - Supplied (raw - careful logging):", supplied); 
    // console.log("comparePasswords - Stored hash.salt:", stored);
    if (!stored || !stored.includes('.')) {
        console.error("comparePasswords - Stored password format is invalid:", stored);
        return false;
    }
    const [hashed, salt] = stored.split(".");
    // console.log("comparePasswords - Extracted hash:", hashed);
    // console.log("comparePasswords - Extracted salt:", salt);
    
    const hashedBuf = Buffer.from(hashed, "hex");
    const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
    // console.log("comparePasswords - Hashed supplied for comparison:", suppliedBuf.toString('hex'));
    
    // Ensure buffers are the same length for timingSafeEqual
    if (hashedBuf.length !== suppliedBuf.length) {
        console.error("comparePasswords - Hash length mismatch.");
        // To prevent timing attacks, still perform a dummy comparison
        // Create a dummy buffer of the correct length
        const dummySuppliedBuf = Buffer.alloc(hashedBuf.length); 
        timingSafeEqual(hashedBuf, dummySuppliedBuf); 
        return false; 
    }

    const result = timingSafeEqual(hashedBuf, suppliedBuf);
    // console.log("comparePasswords - Comparison result:", result);
    return result;
  } catch (error) {
      console.error("Error during password comparison:", error);
      return false;
  }
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "joy-sparks-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true
    }
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      // console.log("LocalStrategy - Username:", username);
      // Be careful logging raw passwords, even temporarily in development
      // console.log("LocalStrategy - Password supplied:", password); 
      const user = await storage.getUserByUsername(username);
      // console.log("LocalStrategy - User found:", !!user);
      // if (user) {
          // console.log("LocalStrategy - Stored password value:", user.password);
      // }
      if (!user || !user.password || !(await comparePasswords(password, user.password))) {
        // console.log("LocalStrategy - Password comparison failed or user not found.");
        return done(null, false);
      } else {
        // console.log("LocalStrategy - Password comparison succeeded.");
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Validate input against schema - ensure password is provided for local registration
    try {
      insertUserSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation failed", errors: error.errors });
      }
      return res.status(500).send("Internal Server Error");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/auth/google/callback", async (req, res, next) => {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).send("ID token required");
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const googleUid = decodedToken.uid;
      const email = decodedToken.email;
      const name = decodedToken.name; // Contains full name

      if (!email) {
        return res.status(400).send("Email not available from Google profile");
      }

      let user = await storage.getUserByGoogleUid(googleUid);

      if (!user) {
        // User not found by google_uid, try finding by email
        user = await storage.getUserByUsername(email); // Assuming username is email for now

        if (user) {
          // User found by email, link google_uid
          await storage.updateUserGoogleUid(user.id, googleUid);
          user.google_uid = googleUid; // Update user object in memory
        } else {
          // No user found by google_uid or email, create new user
          const username = email; // Use email as username
          const [firstName, ...lastNameParts] = (name || '').split(' ');
          const lastName = lastNameParts.join(' ');

          // Use storage function to create user without password
          user = await storage.createUser({
            username: username,
            password: null, // Set password to null for Google sign-in
            google_uid: googleUid,
            first_name: firstName,
            last_name: lastName,
          });
        }
      }

      // Log the user in using Passport's login function
      req.login(user, (err) => {
        if (err) {
          console.error("Passport login error after Google auth:", err);
          return next(err); // Pass error to Express error handler
        }
        // Send back the user object, client can decide where to redirect
        res.status(200).json(user);
      });

    } catch (error) {
      console.error("--- Google Auth Callback Error ---");
      // Log the full error object, including stack trace if available
      console.error("Error Object:", error);
      if (error instanceof Error) {
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
      }
      console.error("--- End Google Auth Callback Error ---");
      res.status(401).send("Authentication failed. Check server logs for details."); // More informative message
    }
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    res.json(req.user);
  });
}
