type Query = { search?: string; page?: number; limit?: number; sort?: {}; props?: {} };

export const getQuery = (reqQuery: any, temp: any): Query => {
  const query: Query = {};
  let { search, page, limit, sort, ...props } = reqQuery;
  if (search) {
    query.search = search + ' ' + gramIt(search);
  }
  if (page) {
    query.page = parseInt(page);
  }
  if (limit) {
    query.limit = parseInt(limit);
  }
  if (sort) {
    for (const key of Object.keys(sort)) {
      //@ts-ignore
      sort[key] = sort[key] == 'asc' ? 1 : -1;
    }
    query.sort = sort;
  }
  if (props) {
    query.props = getQueryProps(props, temp);
  }
  return query;
};

// clean extra props and cast types according to template
export const getQueryProps = (obj: object, temp: object): any => {
  const objStr = JSON.stringify(obj).replace(/\b(gt|gte|lt|lte|eq|ne)\b/g, (match) => `$${match}`);
  obj = JSON.parse(objStr);
  //  {
  //   id: '3',
  //   price: {'eq':'1,2,3'}
  //   age: {
  //         '$gt': '20',
  //         '$lt': '50',
  //         '$ne': '4,5,6'
  //        }
  //  }
  const keys1 = Object.keys(obj); //['id','age']
  for (const k1 of keys1) {
    //@ts-ignore
    const keys2 = Object.keys(obj[k1]);
    //@ts-ignore
    const propTemp = temp[k1]; //number
    //@ts-ignore
    if (keys2.length == 0 || keys2[0] == '0') {
      // id: '3'
      //@ts-ignore
      obj[k1] = castValue(obj[k1], propTemp, true); // 3
    } else {
      // age: {'$gt':'20','$lt':'50'}
      for (const k2 of keys2) {
        // ['$gt','$lt']
        //@ts-ignore
        obj[k1][k2] = castValue(obj[k1][k2], propTemp); //20 or 30
      }
    }
  }
  return obj;
};

//return a casted value according to template value
//optional add$ turns id:'1' to id: {'$eq':1}
//and turns addresses:'1,2,3' to addresses: {'$in':[1,2,3]}
export const castValue = (val: any, temp: any, add$: boolean = false): any => {
  if (typeof val === 'string' && val.includes(',')) {
    //array
    const arr: string[] = (val as string).split(',').map((a: string) => a.trim());
    const t = Array.isArray(temp) ? temp[0] : temp;
    val = arr.map((v) => castValue(v, t));
    if (add$) {
      val = { $in: val };
    }
  } else {
    if (typeof temp === typeof 3) {
      //number
      val = Number(val);
    } else if (typeof temp === typeof false) {
      //boolean
      if (['false', 'null', 'undefined', '0', '', 0].includes(val)) {
        val = false;
      } else {
        //true
        val = true;
      }
    } else if (temp instanceof Date) {
      //date (object)
      val = Date.parse(val);
    } else {
      //string or object
    }
    if (add$) {
      val = { $eq: val };
    }
  }
  return val;
};

export const cleanObject = (obj: object, temp: any = null, noKeys: string[] = []): any => {
  const obj2 = {};
  for (const k of Object.keys(obj)) {
    //@ts-ignore
    if (!noKeys.includes(k)) {
      if (temp && Object.keys(temp).includes(k)) {
        //@ts-ignore
        const casted = castValue(obj[k], temp[k]);
        //@ts-ignore
        if (
          typeof casted !== typeof temp[k] ||
          (typeof casted === 'number' && Number.isNaN(casted)) ||
          casted === null ||
          casted === undefined
        ) {
          //pass
        } else {
          //@ts-ignore
          obj2[k] = casted;
        }
      } else if (!temp) {
        //@ts-ignore
        obj2[k] = obj[k];
      }
    }
  }
  return obj2;
};

//returns array of trigrams
export const gramIt = (sentence: string) => {
  let grams: string[] = [];
  let input = sentence.toLowerCase();
  let words = input.split(' ');
  for (let word of words) {
    let chars = word.split('');
    if (chars.length < 3) continue; //no bigrams allowed
    chars.forEach((char, index) => {
      if (index < chars.length - 2) {
        grams.push(chars.slice(index, index + 3).join(''));
      }
    });
  }
  //to remove duplicate elements from the array
  return grams.filter((item, ind, arr) => ind === arr.indexOf(item)).join(' ');
};
