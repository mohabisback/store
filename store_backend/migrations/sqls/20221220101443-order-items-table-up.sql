CREATE TABLE "orderItems"(
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