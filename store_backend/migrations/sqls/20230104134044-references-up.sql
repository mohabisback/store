ALTER TABLE "products" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;

ALTER TABLE "orders" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;

ALTER TABLE "orderItems" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "orderItems" ADD CONSTRAINT "product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT;
ALTER TABLE "orderItems" ADD CONSTRAINT "order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;

ALTER TABLE "packs" ADD CONSTRAINT "order_fk" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT;

ALTER TABLE "addresses" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;

ALTER TABLE "cartItems" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "cartItems" ADD CONSTRAINT "product_fk" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE;
