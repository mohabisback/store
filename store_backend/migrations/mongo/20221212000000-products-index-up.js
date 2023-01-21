var collName = 'products';
const defaultFunction = async (db) => {
  const coll = db.collection(collName);
  //await coll.dropIndex(name) //do only when you change the index

  const name = 'products_search_index';
  if (!(await coll.indexExists(name))) {
    //create index if not exists
    const indexSpecs = {
      title: 'text',
      keywords: 'text',
      grams: 'text',
      description: 'text',
    };
    const options = {
      name,
      weights: {
        title: 10,
        keywords: 8,
        grams: 5,
        description: 5
      },
    };
    await coll.createIndex(indexSpecs, options);
  }
};

module.exports = defaultFunction;
