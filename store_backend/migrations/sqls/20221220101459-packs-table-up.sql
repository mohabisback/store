CREATE TABLE IF NOT EXISTS "packs"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "order_id" integer,
  "status" VARCHAR(20),
  "weight" integer,
  "ship_code" VARCHAR(30)
  );
ALTER TABLE "packs" ADD CONSTRAINT "order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;
