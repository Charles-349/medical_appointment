CREATE TABLE "contacts" (
	"contactID" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50) NOT NULL,
	"message" varchar(1000) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
