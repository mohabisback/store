var collName = 'products'
const defaultFunction = async (db) =>{
  const coll = db.collection(collName)
  await coll.drop() //create new collection
}

module.exports = defaultFunction