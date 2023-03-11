CREATE TABLE IF NOT EXISTS "categories" (
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "title" varchar(30),
  "forbidden" boolean,
  "hidden" boolean
  );