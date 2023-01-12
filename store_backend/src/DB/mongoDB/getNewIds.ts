import { Collection, WithId, Document } from 'mongodb';
import { Status, ErrAPI } from '../../ErrAPI';

//A type representing the document
type Serial = { _id?: any; id?: number; serial: number; desc?: string };

//returns an Integer or throws an error
//works with any collection
//creates if not existed a document with id:-1
//this document contains serial: number representing last inserted id
//it is updated before every new insertOne
const getNewId = async (coll: Collection, incBy = 1): Promise<number[]> => {
  let result: WithId<Document> | null;
  let serial: number;
  try {
    //increase the serial in serial document by one, get the updated document
    result = (
      await coll.findOneAndUpdate({ id: -1 }, { $inc: { serial: incBy } }, { returnDocument: 'after', upsert: false })
    ).value;
  } catch (err) {
    throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't get serial document.`);
  }
  if (result && result.serial && Number.isInteger(result.serial)) {
    //if succeeded, get new id from the retrieved updated document
    serial = result.serial;
  } else {
    //No document found, create new one
    let arr: Document[];
    try {
      //get the document with highest id in the collection
      arr = await coll.find({}).sort({ id: -1 }).limit(1).project({ id: 1, _id: 0 }).toArray();
    } catch (err) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't Create latest document.`);
    }
    //get the id of that document, and add incBy to it
    serial = arr.length ? parseInt(arr[0]['id']) + incBy : incBy;
    if (!Number.isInteger(serial)) {
      throw new ErrAPI(Status.BAD_GATEWAY, `Database Error, Can't get serial Number .`);
    }
    try {
      //insert the serial document, with the new serial
      await coll.updateOne({ id: -1}, {$set:{serial, serial_id_document: 'This document is for counting serial id' }},{upsert: true});
    } catch (err) {}
  }
  const serials: number[] = [];
  //return the created serial
  for (let i = incBy - 1; i >= 0; i--) {
    serials.push(serial - i);
  }
  return serials;
};

export default getNewId;
