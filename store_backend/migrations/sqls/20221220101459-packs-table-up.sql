CREATE TABLE "packs"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "order_id" integer,
  "status" VARCHAR(20),
  "weight" integer,
  "ship_code" VARCHAR(30)
  );