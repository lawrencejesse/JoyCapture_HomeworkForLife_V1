import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Linkedin, Apple, Flame } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signInWithGoogle } from "@/lib/firebase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { User as SelectUser } from "@shared/schema";

const loginSchema = z.object({
  username: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  username: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  terms: z.boolean().refine(val => val === true, {
    message: "You must accept terms and conditions",
  }),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [_, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const queryClient = useQueryClient();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [pendingGoogleUser, setPendingGoogleUser] = useState<SelectUser | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const wasUserLoggedInBeforeGoogleSignIn = !!user;
  
  const googleLoginMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const res = await fetch("/api/auth/google/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Google login failed: ${res.status} ${errorText}`);
      }
      return res.json() as Promise<SelectUser>;
    },
    onSuccess: (userData) => {
      console.log("Backend Google Login Success:", userData);
      if (!wasUserLoggedInBeforeGoogleSignIn) {
        setPendingGoogleUser(userData);
        setShowTermsModal(true);
      } else {
        queryClient.setQueryData(["/api/user"], userData);
      }
    },
    onError: (error) => {
      console.error("Backend Google Login Error:", error);
    },
  });

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      username: "",
      password: "",
      terms: false,
    },
  });

  function onLoginSubmit(data: LoginFormValues) {
    loginMutation.mutate({
      username: data.username,
      password: data.password,
    });
  }

  function onRegisterSubmit(data: RegisterFormValues) {
    registerMutation.mutate({
      username: data.username,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
    });
  }

  const handleGoogleSignIn = async () => {
    try {
      const { idToken } = await signInWithGoogle();
      googleLoginMutation.mutate(idToken);
    } catch (error) {
      console.error("Google Sign-in Popup Error:", error);
    }
  };

  const handleTermsAcceptance = () => {
    if (termsAccepted && pendingGoogleUser) {
      console.log("Terms accepted for Google user:", pendingGoogleUser);
      queryClient.setQueryData(["/api/user"], pendingGoogleUser);
      setShowTermsModal(false);
      setPendingGoogleUser(null);
      setTermsAccepted(false);
      navigate("/home");
    } else {
      console.warn("Terms must be accepted to continue.");
    }
  };

  useEffect(() => {
    if (user && !showTermsModal) {
      navigate("/home");
    }
  }, [user, navigate, showTermsModal]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" className="mr-4" onClick={() => navigate('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div 
              className="flex items-center cursor-pointer" 
              onClick={() => navigate('/')}
            >
              <Flame className="h-6 w-6 text-primary mr-1" />
              <span className="font-bold text-xl">Joy Sparks</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <Button variant="outline" className="w-full mb-6 flex items-center justify-center gap-2" type="button" onClick={handleGoogleSignIn}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.6402 9.18182C17.6402 8.56364 17.582 7.96364 17.4766 7.38182H9V10.8h4.84388C13.6379 12.0409 12.9084 13.0818 11.8184 13.8091V16.0182H14.4593C16.4852 14.2091 17.6402 11.9 17.6402 9.18182Z" fill="#4285F4"/>
                    <path d="M9.00018 18C11.4302 18 13.4661 17.1909 14.8597 15.8182L12.2188 13.6091C11.4547 14.1 10.4774 14.4 9.00018 14.4C6.65471 14.4 4.67744 12.8364 3.96381 10.7182H1.20471V12.9818C2.56381 15.7909 5.52289 18 9.00018 18Z" fill="#34A853"/>
                    <path d="M3.96381 10.7182C3.78199 10.1727 3.68199 9.59091 3.68199 9C3.68199 8.40909 3.78199 7.82727 3.96381 7.28182V5.01818H1.20471C0.44062 6.45909 0 7.67727 0 9C0 10.3227 0.44062 11.5409 1.20471 12.9818L3.96381 10.7182Z" fill="#FBBC05"/>
                    <path d="M9.00018 3.6C10.3229 3.6 11.5093 4.06364 12.4774 4.99091L14.9184 2.54091C13.4661 1.24091 11.4302 0 9.00018 0C5.52289 0 2.56381 2.20909 1.20471 5.01818L3.96381 7.28182C4.67744 5.16364 6.65471 3.6 9.00018 3.6Z" fill="#EA4335"/>
                  </svg>
                  Sign in or Sign up with Google
                </Button>

                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with email
                    </span>
                  </div>
                </div>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Enter your password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center justify-between">
                        <FormField
                          control={loginForm.control}
                          name="rememberMe"
                          render={({ field }) => (
                            <FormItem className="flex items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                Remember me
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                        <Button variant="link" className="px-0">
                          Forgot password?
                        </Button>
                      </div>

                      <Button type="submit" className="w-full">
                        Login
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={registerForm.control}
                          name="first_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={registerForm.control}
                          name="last_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Create a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={registerForm.control}
                        name="terms"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal">
                              I agree to the{" "}
                              <Link href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary px-0 h-auto inline">
                                Terms of Service
                              </Link>{" "}
                              and{" "}
                              <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary px-0 h-auto inline">
                                Privacy Policy
                              </Link>
                            </FormLabel>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full">
                        Create Account
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Dialog open={showTermsModal} onOpenChange={(open) => { 
        if (!open) { 
          setShowTermsModal(false);
          setPendingGoogleUser(null);
          setTermsAccepted(false);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
              Please review and accept our terms and conditions to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="google-terms" 
                checked={termsAccepted} 
                onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))} 
              />
              <label
                htmlFor="google-terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the{" "}
                <Link href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary px-0 h-auto inline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary px-0 h-auto inline">
                  Privacy Policy
                </Link>
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleTermsAcceptance} disabled={!termsAccepted}>
              Accept and Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
