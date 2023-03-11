CREATE TABLE IF NOT EXISTS "orderItems"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "product_id" integer,
  "status" VARCHAR(20),
  "user_id" integer,
  "order_id" integer,
  "quantity" integer,
  "price" integer,
  "discount" integer,
  "deliveryDate" timestamp,
  "pack_id" integer,
  "serialNos" VARCHAR(30)[]
  );
ALTER TABLE "orderItems" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "orderItems" ADD CONSTRAINT "product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;
ALTER TABLE "orderItems" ADD CONSTRAINT "order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;
