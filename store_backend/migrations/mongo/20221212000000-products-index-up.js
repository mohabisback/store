var collName = 'products'
const defaultFunction = async (db) =>{
  const coll = db.collection(collName)
  //await coll.dropIndex(name) //do only when you change the index
  
  const name = "products_search_index"
  if(!(await coll.indexExists(name))){
    //create index if not exists
    const indexSpecs = {
      title: "text",
      keywords: "text",
      category: "text",
      grams: "text",
      description: "text",
      colors: "text",
      sizes: "text"
    }
    const options = {
      name,
      weights: {
        title: 10,
        keywords: 8,
        category: 8,
        grams: 5,
        description: 5,
        colors: 3,
        sizes: 3
      }
    }   
    await coll.createIndex(indexSpecs, options)
  }
}

module.exports = defaultFunction