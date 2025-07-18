ALTER TABLE "appointments" ALTER COLUMN "appointment_status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "appointment_status" SET DEFAULT 'Pending'::text;--> statement-breakpoint
DROP TYPE "public"."appointment_status";--> statement-breakpoint
CREATE TYPE "public"."appointment_status" AS ENUM('Pending', 'Confirmed');--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "appointment_status" SET DEFAULT 'Pending'::"public"."appointment_status";--> statement-breakpoint
ALTER TABLE "appointments" ALTER COLUMN "appointment_status" SET DATA TYPE "public"."appointment_status" USING "appointment_status"::"public"."appointment_status";