
CREATE TABLE IF NOT EXISTS "products"(
  "id" INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user_id" INTEGER,
  "title" VARCHAR(200),
  "description" TEXT,
  "price" INTEGER,
  "discount" INTEGER,
  "stock" INTEGER,
  "viewsCount" INTEGER,
  "ordersCount" INTEGER,
  "used" BOOLEAN,
  "category_id" INTEGER,
  "sizes" VARCHAR(20)[],
  "colors" VARCHAR(20)[],
  "keywords" VARCHAR(300),
  "maxItems" INTEGER,
  "img1" VARCHAR(300),
  "img2" VARCHAR(300),
  "img3" VARCHAR(300),
  "img4" VARCHAR(300),
  "img5" VARCHAR(300),
  "addDate" TIMESTAMP,
  "hidden" BOOLEAN,
  "grams" TEXT,
  "tsv" tsvector
);
ALTER TABLE "products" ADD CONSTRAINT "user_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT;
ALTER TABLE "products" ADD CONSTRAINT "category_fk" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT;

--ALTER TABLE products ADD COLUMN if not exists tsv tsvector;
--
-- UPDATE products SET  
--     tsv = l.tsv
-- FROM (  
--     SELECT "id",
--            setweight(to_tsvector('english', COALESCE("title",'')), 'A') || --text with weight A
--            setweight(to_tsvector('english', COALESCE("keywords",'') || ' ' || COALESCE("category",'')), 'B') || --text with weight B
--            setweight(to_tsvector('english', COALESCE("grams",'') || ' ' || COALESCE("description",'')), 'C') || --text with weight C
--            setweight(to_tsvector('english', COALESCE(array_to_string(("colors" || "sizes"),' ', ''),'')), 'D') --arrays with weight D
--            AS "tsv" FROM products
-- ) AS l
-- WHERE l.id = products.id;

--create function to be triggered
CREATE OR REPLACE FUNCTION products_tsv_trigger() RETURNS trigger
AS $$
    BEGIN
      new.tsv := --new is the new row
         setweight(to_tsvector('english', COALESCE(new.title,'')), 'A') ||
         setweight(to_tsvector('english', COALESCE(new.keywords,'')), 'B') ||
         setweight(to_tsvector('english', COALESCE(new.grams,'') || ' ' || COALESCE(new.description,'')), 'C');
      return new;
    END;
$$ LANGUAGE plpgsql;

--create a trigger to execute the function on every inserted or updated row
CREATE OR REPLACE TRIGGER update_products_tsv
BEFORE INSERT OR UPDATE  
ON "products"  
FOR EACH ROW
EXECUTE PROCEDURE products_tsv_trigger();

--create index on that tsv column
CREATE INDEX IF NOT EXISTS products_search_index ON "products" USING gin ("tsv");
