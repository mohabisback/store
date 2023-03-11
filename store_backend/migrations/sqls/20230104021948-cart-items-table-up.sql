CREATE TABLE IF NOT EXISTS "cartItems"(
  "id" integer,
  "user_id" integer,
  "product_id" integer,
  "quantity" integer,
  "price" integer,
  "discount" integer,
  "date" TIMESTAMP
  );
ALTER TABLE "cartItems" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "cartItems" ADD CONSTRAINT "product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
