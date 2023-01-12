ALTER TABLE "products" DROP CONSTRAINT "user_fk";

ALTER TABLE "orders" DROP CONSTRAINT "user_fk";

ALTER TABLE "orderItems" DROP CONSTRAINT "user_fk";
ALTER TABLE "orderItems" DROP CONSTRAINT "product_fk";
ALTER TABLE "orderItems" DROP CONSTRAINT "order_fk";

ALTER TABLE "packs" DROP CONSTRAINT "order_fk";

ALTER TABLE "addresses" DROP CONSTRAINT "user_fk";

ALTER TABLE "cartItems" DROP CONSTRAINT "user_fk";
ALTER TABLE "cartItems" DROP CONSTRAINT "product_fk";
