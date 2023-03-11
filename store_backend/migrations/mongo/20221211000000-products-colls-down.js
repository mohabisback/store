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
  const existingCollections = await db.collections()
  for (let coll of existingCollections){
    if (collNames.includes(coll.collectionName)){
      await coll.drop(); //drop Collection
    } 
  }
};

module.exports = defaultFunction;
