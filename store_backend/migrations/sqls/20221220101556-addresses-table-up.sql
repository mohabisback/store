CREATE TABLE "addresses"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" integer,
  "fullName" VARCHAR(50),
  "phone" VARCHAR(20),
  "state" VARCHAR(20),
  "street" VARCHAR(200),
  "buildingNo" VARCHAR(10),
  "floor" VARCHAR(10),
  "apartment" VARCHAR(10)
  );