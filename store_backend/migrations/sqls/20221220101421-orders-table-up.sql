CREATE TABLE "orders"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" integer, 
  "payment" VARCHAR(50),
  "fullName" VARCHAR(50),
  "phone" VARCHAR(20), 
  "addressString" VARCHAR(100),
  "itemsCost" integer,
  "shipCost" integer,
  "date" timestamp
  );
  ALTER TABLE "orders" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;
