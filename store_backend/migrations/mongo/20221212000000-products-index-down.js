var collName = 'products';
const defaultFunction = async (db) => {
  const coll = db.collection(collName);
  const name = 'products_search_index';
  if (await coll.indexExists(name)) {
    await coll.dropIndex(name);
  }
};

module.exports = defaultFunction;
