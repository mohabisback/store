CREATE TABLE "tokens"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "secret" VARCHAR(200),
  "email" VARCHAR(50),
  "ip" VARCHAR(20),
  "date" timestamp,
  "expired" boolean
  );