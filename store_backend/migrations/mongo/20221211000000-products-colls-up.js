var collNames = [
  'users',
  'tokens',
  'categories',
  'products',
  'orders',
  'orderItems',
  'cartItems',
  'packs',
  'addresses'
];
const defaultFunction = async (db) => {
  const existingNames = (await db.collections()).map(coll=>coll.collectionName)
  for (let collName of collNames){
    if (!existingNames.includes(collName)){
      await db.createCollection(collName); //create new collection
    }
  }
};

module.exports = defaultFunction;

