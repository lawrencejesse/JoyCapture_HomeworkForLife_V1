ALTER TABLE "users" ADD COLUMN "google_uid" text;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_google_uid_unique" UNIQUE("google_uid");