import {Collection, Document, InsertOneResult, UpdateResult,
  WithId, InsertManyResult, DeleteResult} from 'mongodb';
import { Status, ErrAPI } from '../../ErrAPI';
import { Facets, Ref } from '../../interfaces/general';
import getNewIds from './getNewIds';

export default class CommonModel {
  //Get Count of Documents with specific props
  static async getCount(coll: Collection, props: {}): Promise<number> {
    try {
      return await coll.countDocuments(props);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't count ${coll.collectionName} documents.`);
    }
  }

  //optionally checks props already exists then adds a document, returns id
  static async AddOne(coll: Collection, doc: any, props?: {}): Promise<number> {
    //if props supplied and already exists, throw error
    if (props) {
      const checkDuple = await this.getCount(coll, props);
      if (checkDuple) {
        throw new ErrAPI(Status.CONFLICT, `Duplicate ${coll.collectionName} document.`);
      }
    }
    let result: InsertOneResult<Document>;
    const ids: number[] = await getNewIds(coll);
    const id: number = ids[0];
    try {
      result = await coll.insertOne({ id, ...doc });
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't insert ${coll.collectionName} document.`);
    }
    if (result.insertedId) {
      return id;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `${coll.collectionName} document insertion failed.`);
    }
  }

  //adds documents, returns ids
  static async AddMany(coll: Collection, props: any[]): Promise<number[]> {
    let result: InsertManyResult<Document>;
    const ids = await getNewIds(coll, props.length);
    for (let i = 0; i < props.length; i++) {
      props[i] = { id: ids[i], ...props[i] };
    }
    try {
      result = await coll.insertMany(props);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't insert ${coll.collectionName} documents.`);
    }
    if (result.insertedIds) {
      return ids;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `${coll.collectionName} document insertion failed.`);
    }
  }

  static async updateOne(coll: Collection, findProps: {}, updateProps: {}): Promise<boolean> {
    let result: UpdateResult;
    try {
      result = await coll.updateOne(findProps, { $set: updateProps });
    } catch (err) {
      console.log(err)
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't update ${coll.collectionName} document.`);
    }
    if (result.acknowledged) {
      return true;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't update ${coll.collectionName} document.`);
    }
  }

  static async updateAll(coll: Collection, findProps: {}, updateProps: {}): Promise<number> {
    let result: Document | UpdateResult;
    try {
      result = await coll.updateMany(findProps, { $set: updateProps });
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't update ${coll.collectionName} documents.`);
    }
    if (result.acknowledged) {
      return result.modifiedCount;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't update ${coll.collectionName} documents.`);
    }
  }

  static async deleteOne(coll: Collection, props: {}): Promise<boolean> {
    let result: DeleteResult;
    try {
      result = await coll.deleteOne(props);
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't update ${coll.collectionName} document.`);
    }
    if (result.deletedCount) {
      return true;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't delete ${coll.collectionName} document.`);
    }
  }

  static async getOne(coll: Collection, findProps: {}, projProps:any = {}, refs?:Ref[]): Promise<Document | null> {
    let doc: Document | null;
    let refsPipeline = []
    if(refs){
      for (let ref of refs){
        //make sure ref toColumn is set
        const refToColumn = ref.toColumn ? ref.toColumn : 'id'
        //if there is projection, force include refToColumn,
        if(projProps && Object.keys(projProps).length > 0 && Object.keys(projProps)[0] != '0'){
          projProps[refToColumn] = 1
        }

        refsPipeline.push(
          {$lookup: {
            from: ref.table,
            let: { field: `$${refToColumn}`},
            pipeline: [
              {$match: {
                $expr: { $eq: [`$${ref.column}`, "$$field"]}
              }},
              {$project:{
                _id:0,
                ...ref.projProps
              }}
            ],
            as: `${ref.table}`
          }}, 
          {$addFields: {
            [`${ref.table}`]: `$${ref.table}`
          }}
        )
      }
    }
    const pipeline = [
      {$match: {
        ...findProps
      }},
      {$project:{
        _id:0,
        ...projProps
      }},
      {$limit: 1},
      ...refsPipeline
    ]
    
    try {
      doc = (await coll.aggregate(pipeline).toArray())[0];
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't find ${coll.collectionName} document.`);
    }
    return doc;
  }

  
  static async getSome(coll: Collection, findProps: {}, projProps = {}, limit?: number, page?: number, sort?: any): Promise<Document[]> {
    limit = limit ? limit : 30;
    page = page ? page - 1 : 0;
    sort = sort ? sort : { id: -1 };

    let docs: WithId<Document>[];
    try {
      docs = await coll.find(findProps, { projection: { _id: 0, ...projProps } })
      .sort(sort)
      .skip(page*limit)
      .limit(limit)
      .toArray();
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't find ${coll.collectionName} documents.`);
    }
    if (docs) {
      return docs;
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't find ${coll.collectionName} documents.`);
    }
  }

  //get all docs, with conditions
  // 1 based pages, default limit = 30
  // sorting example {{email: 1}, {title: -1}} // 1=ascending, -1=descending
  //default is newest docs first
  static async getAll(coll: Collection, search = '', findProps = {}, projProps = {}, limit?: number, page?: number, sort?: any, facets?: Facets): Promise<Document[]> {
    limit = limit ? limit : 30;
    page = page ? page - 1 : 0;
    sort = sort ? sort : (search ? {score: { $meta: "textScore" }} : { id: -1 });

    let sortNullsLast:any = {}
    let fieldsNullsLast:any = {}
    let projNullsLast:any = {}
    const keys = Object.keys(sort)
    for (let k of keys){
      fieldsNullsLast[`has${k}`] = { $cond: [ {$ifNull: [`$${k}`, false]}, 1, 2 ] }
      sortNullsLast[`has${k}`] = 1
      sortNullsLast[k] = sort[k]
      projNullsLast[`has${k}`] = 0
    }
    const skip = limit * page
    let results: any;
    try {
      // results = await coll
      //   .find({ ...props, serial_id_document: { $exists: false } })
      //   .sort(sort)
      //   .skip(limit * page)
      //   .limit(limit)
      //   .project({ _id: 0, ...proj1sNoProj0s })
      //   .toArray();
      const text = !search ? {} : {
        $text: {
        $search: search,
        $language: 'en',
        $caseSensitive: false,
        $diacriticSensitive: false //sensitive to L'accents
      }}

      const facetsAgg = {}
      const facetsProj = {}

      const addFacetProj = (facet:string):void=>{
        
        //@ts-ignore
        facetsProj[facet] = {"$arrayToObject":{"$map":{
          "input": `$${facet}`, "as": "f",
          "in": {"k": {"$toString": "$$f._id"},"v": "$$f.count"}
        }}}  
      }

      if (facets){
        if (facets.singles){
          for (let column of Object.keys(facets.singles)){
            //@ts-ignore
            facetsAgg[column] = [ //single value facet
              {$match: { [column]: { $exists: 1, $ne: null } } },
              {$sortByCount: `$${column}` }
            ]
            addFacetProj(column)
          }
        }
        if (facets.arrays){
          for (let column of Object.keys(facets.arrays)){
            //@ts-ignore
            facetsAgg[column] = [ // multiple (array) values facet
              {$match: { [column]: { $exists: 1, $ne: null } } },
              {$unwind: `$${column}` },
              {$sortByCount: `$${column}` }
            ]
            addFacetProj(column)
          }
        }
        if (facets.dateTrunks){
          for (let column of Object.keys(facets.dateTrunks)){
              //@ts-ignore
              const trunk = facets.dateTrunks[column]
              //@ts-ignore
              facetsAgg[column] = [
              {$match: { [column]: { $exists: 1, $ne: null } } },
              {$sortByCount:{
                $dateTrunc: {
                  unit: trunk,
                  binSize: 1,
                  timezone: "America/Los_Angeles",
                  startOfWeek: "Monday",
                  date: `$${column}`
                }
              }}
            ]
            addFacetProj(column)
          }
        }
        if (facets.buckets){
          for (let column of Object.keys(facets.buckets)){
            //@ts-ignore
            const buckets = facets.buckets[column]
            //@ts-ignore
            facetsAgg[column] = [ //bucket facet
              // Filter out documents without a price e.g., _id: 7
              {$match: { [column]: { $exists: 1, $ne: null } } },
              {$bucket: {
                groupBy: `$${column}`,
                boundaries: buckets,
                default: "Other",
                output: {
                  "count": { $sum: 1 }//,
                  //"titles": { $push: "$title" }
                }
              }},
              {$match: {
                count: {$gt: 0} } //return only buckets with more than 0
              }
            ]
            addFacetProj(column)
          }
        }
      }

      const pipeline = [
        {$match : {
          ...text,
          ...findProps, //my props
          id: {$gt: 0} //to avoid meta docs
        }},
        {$facet: {
          "results": [
            {$project: {
               _id: 0, //id of mongo
               ...projProps //my projection
            }},
            {$addFields: fieldsNullsLast}, //for nulls last
            {$sort:{ 
              ...sortNullsLast //ranking of the search result
            }},
            {$project: projNullsLast}, //removing nulls last fields
            {$skip: skip}, //my skipped
            {$limit: limit} //my limit
          ], 
          "total":[
            {$count: "count" }
          ],
          ...facetsAgg
        }},
        {$project: {
          [coll.collectionName]: '$results',
          [`${coll.collectionName}Meta`]:{
            total: { $arrayElemAt: [ '$total', 0] },
            ...facetsProj
          }
        }}
      ]

      results = await coll.aggregate(pipeline, { allowDiskUse: true }).toArray()
      
    } catch (err) {
      console.log(err)
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't find ${coll.collectionName} documents.`);
    }
    if (results[0]) {
      return results[0]
    } else {
      throw new ErrAPI(Status.BAD_GATEWAY, `Can't get any ${coll.collectionName} document.`);
    }
  }
}
