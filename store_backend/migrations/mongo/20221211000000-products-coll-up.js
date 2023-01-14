var collName = 'products'
const defaultFunction = async (db) =>{
  const coll = db.collection(collName)
  await db.createCollection(collName) //create new collection
}

module.exports = defaultFunction