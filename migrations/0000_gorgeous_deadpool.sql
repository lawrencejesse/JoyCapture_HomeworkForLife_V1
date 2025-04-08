CREATE TABLE "entries" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"category" text,
	"tags" text[],
	"user_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"custom_date" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"mood" text,
	"location" text,
	"media_urls" jsonb,
	"search_vector" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"first_name" text,
	"last_name" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE INDEX "user_id_idx" ON "entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "custom_date_idx" ON "entries" USING btree ("custom_date");--> statement-breakpoint
CREATE INDEX "tags_idx" ON "entries" USING btree ("tags");--> statement-breakpoint
CREATE INDEX "search_vector_idx" ON "entries" USING btree ("search_vector");