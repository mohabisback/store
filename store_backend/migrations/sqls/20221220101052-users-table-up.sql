CREATE TABLE IF NOT EXISTS "users"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "firstName" VARCHAR(30),
  "lastName" VARCHAR(30),
  "phone" VARCHAR(20),
  "age" integer, 
  "gender" VARCHAR(20),
  "sendEmails" boolean,
  "role" VARCHAR(30),
  "email" VARCHAR(50),
  "verifiedEmail" boolean, 
  "signInDate" timestamp,
  "signUpDate" timestamp,
  "password" text,
  "verifyToken" text, 
  "passToken" text, 
  "passTokenExp" timestamp
  );