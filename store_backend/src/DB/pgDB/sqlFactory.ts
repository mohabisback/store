import { ErrAPI } from '../../ErrAPI';
import { TyFacets, TyRef } from '../../types/general';

//one and many
export const sqlInsert = (table: string, props: any[], startValues: any[] = []): { sql: string; values: any[] } => {
  const query = { sql: '', values: startValues };
  table = `"${table}"`;
  let cols = Object.keys(props[0])
    .map((k) => {
      return ` "${k}"`;
    })
    .toString();
  let values = props.map((one) => {
    let keys = Object.keys(one);
    return (
      '\n(' +
      keys
        .map((k) => {
          query.values.push(one[k]);
          return ` $${query.values.length.toString()}`;
        })
        .toString() +
      ')'
    );
  });

  query.sql = 'INSERT INTO ' + table + '\n(' + cols + ')' + '\nVALUES' + values + '\nRETURNING id';
  //console.log('insert query: ', query);
  return query;
};

export const sqlDelete = (
  table: string,
  findProps: any,
  limit?: number,
  startValues: any[] = [],
): { sql: string; values: any[] } => {
  const query = { sql: '', values: startValues };
  table = `"${table}"`;
  if (!findProps) return query;
  let top = '';
  if (limit) top = ' TOP(' + limit + ')';
  const where = whereFactory(findProps, query.values);
  query.sql = 'DELETE FROM' + top + ' ' + table + where.sql + '\nRETURNING id';
  //console.log(query);
  return query;
};

//special sql string can be supplied instead of setProps object
export const sqlUpdate = (
  table: string,
  findProps: any,
  setProps: object | string,
  limit?: number,
  sortProps?: any,
  startValues: any[] = [],
): { sql: string; values: any[] } => {
  const query = { sql: '', values: startValues };
  table = `"${table}"`;
  if (!findProps || !setProps) return query;
  let set = '\nSET ';
  if (typeof setProps === 'string') {
    set += setProps;
  } else {
    //@ts-ignore
    set += Object.keys(setProps)
      .map((k) => {
        //@ts-ignore
        query.values.push(setProps[k]);
        return ` "${k}" = $${query.values.length.toString()}`;
      })
      .toString();
  }
  let where = whereFactory(findProps, query.values);
  let sort = '';
  if (sortProps) {
    sort =
      '\nORDER BY' +
      Object.keys(sortProps)
        .map((k) => ` "${k}"` + (sortProps[k] < 1 ? ' DESC' : ' ASC'))
        .toString();
  }
  let ctid = '';
  if (limit)
    ctid = `\n${where ? 'AND' : ' WHERE'} (CTID IN (SELECT CTID FROM ${table}${where.sql}${sort}\nLIMIT ${limit}))`;

  query.sql = 'UPDATE ' + table + set + where.sql + ctid + '\nRETURNING id';
  return query;
};

// SELECT COUNT(CustomerID), Country
// FROM Customers
// WHERE
// GROUP BY Country
// HAVING COUNT(CustomerID) > 5
// ORDER BY COUNT(CustomerID) DESC;

//grouped are first projected
//sorted are first counted if true
export const sqlCount = (
  table: string,
  findProps?: any,
  groupProps?: any,
  sortProps?: any,
  countOnlySorted = false,
  startValues: any[] = [],
): { sql: string; values: any[] } => {
  const query = { sql: '', values: startValues };
  table = `"${table}"`;
  let count = '*';
  let proj = '';
  let group = '';
  let sort = '';
  let comma = '';
  const where = whereFactory(findProps, query.values);
  if (groupProps) {
    proj = Object.keys(groupProps)
      .filter((k) => groupProps[k] > 0)
      .map((k) => ` "${k}"`)
      .toString();
    group = '\nGROUP BY' + proj;
    comma = ',';
  }
  if (sortProps && countOnlySorted) {
    count = Object.keys(sortProps)
      .map((k) => ` "${k}"`)
      .toString();
  }
  if (sortProps) {
    sort =
      '\nORDER BY' +
      Object.keys(sortProps)
        .map((k) => ` "${k}"` + (sortProps[k] < 0 ? ' DESC' : ' ASC'))
        .toString();
  }
  query.sql = 'SELECT COUNT(' + count + ') as "count"' + comma + proj + '\nFROM ' + table + where.sql + group + sort;
  //console.log(query);
  return query;
};

export const sqlSelectOne = (
  table: string,
  findProps: any,
  projProps?: any,
  refs?: TyRef[],
): { sql: string; values: any[] } => {
  const query = { sql: '', values: <any[]>[] };
  table = `"${table}"`;
  let proj: string = ' *';
  if (projProps && Object.keys(projProps).length > 0 && Object.keys(projProps)[0] != '0') {
    proj = Object.keys(projProps)
      .filter((k) => projProps[k] > 0)
      .map((k) => ` "${k}"`)
      .toString();
  }
  const where = whereFactory(findProps, query.values);

  let refSelects = '';
  let refColumns = '';
  let refTables = '';
  if (refs) {
    for (let ref of refs) {
      let refProj = ' *';
      if (ref.projProps && Object.keys(ref.projProps).length > 0 && Object.keys(ref.projProps)[0] != '0') {
        refProj = Object.keys(ref.projProps)
          .filter((k) => ref.projProps[k] > 0)
          .map((k) => ` "${k}"`)
          .toString();
      }

      const refToColumn = ref.toColumn ? ref.toColumn : 'id';
      //must include every refToColumn in main projProps
      if (!(proj.trim() == '*') && !proj.includes(`"${refToColumn}"`)) {
        proj += `, "${refToColumn}"`;
      }
      refSelects += `
    , "${ref.table}1" AS (SELECT ${refProj} FROM "main" m, "${ref.table}" s WHERE s."${ref.column}"=m."${refToColumn}")
    , "${ref.table}2" AS (SELECT jsonb_agg(row_to_json("${ref.table}1")) as "${ref.table}" from "${ref.table}1")`;

      refColumns += `, "${ref.table}2".*`;
      refTables += `, "${ref.table}2"`;
    }
  }

  query.sql = `WITH main as (SELECT ${proj} FROM  ${table} ${where.sql} LIMIT 1)
  ${refSelects}
  Select main.* ${refColumns} from main ${refTables};
  `;
  //console.log(query)
  return query;
};

export const sqlSelectSome = (
  table: string,
  findProps?: any,
  projProps?: any,
  limit?: number,
  skip?: number,
  sortProps?: any,
  startValues: any[] = [],
): { sql: string; values: any[] } => {
  const query = { sql: '', values: startValues };
  const t = `"${table}"`;

  let proj: string = ' *';
  let sort: string = '';
  let lim: string = '';
  let offset: string = '';
  //@ts-ignore
  if (projProps && Object.keys(projProps).length > 0 && Object.keys(projProps)[0] != '0') {
    proj = Object.keys(projProps)
      .filter((k) => projProps[k] > 0)
      .map((k) => ` "${k}"`)
      .toString();
  }
  const where = whereFactory(findProps, query.values);

  //@ts-ignore
  if (sortProps && Object.keys(sortProps).length > 0 && Object.keys(sortProps)[0] != '0') {
    sort =
      '\nORDER BY' +
      Object.keys(sortProps)
        .map((k) => ` "${k}"` + (sortProps[k] < 1 ? ' DESC' : ' ASC') + ' NULLS LAST')
        .toString();
  } else {
    sort = '\nORDER BY "id" DESC';
  }
  if (limit) {
    lim = '\nLIMIT ' + limit.toString();
  }
  if (skip) {
    offset = `\nOFFSET ${skip.toString()}`;
  }
  query.sql = `SELECT ${proj} FROM ${t} ${where.sql} ${sort} ${lim} ${offset}`;

  //console.log('selectSome query: ', query)
  return query;
};

export const sqlSelect = (
  table: string,
  search?: string,
  findProps?: any,
  projProps?: any,
  limit?: number,
  skip?: number,
  sortProps?: any,
  facets?: TyFacets,
  startValues: any[] = [],
): { sql: string; values: any[] } => {
  //testing
  // findProps = {id:3, category:{'$in':[1,'2',true, false]},
  // name:'mohab',phone:{'$ne':'01000'},
  // age:{'$gt':20,'$lte':50, '$in':[25,'30', true]},
  // price:{'lt':'35','$gt':'15', '$nin': ['20',false, 30]},}
  // projProps = {id:1, category:-3, name:1, phone:0, age:5, price:2}
  // sortProps = {category:-1, id:2, name:0, age:2}
  // limit = 5
  const query = { sql: '', values: startValues };
  const t = `"${table}"`;
  if (search) {
    query.values.push(search.replace(/ /g, ' | '));
    search = ` $${query.values.length.toString()}`;
  }

  let proj: string = ' *';
  let sort: string = '';
  let lim: string = '';
  let offset: string = '';
  //@ts-ignore
  if (projProps && Object.keys(projProps).length > 0 && Object.keys(projProps)[0] != '0') {
    proj = Object.keys(projProps)
      .filter((k) => projProps[k] > 0)
      .map((k) => ` "${k}"`)
      .toString();
  }
  const where = whereFactory(findProps, query.values);
  const searchWhere = `${where.sql} ${where.sql ? ' AND' : ' WHERE' + ' tsv@@query'}`;
  //@ts-ignore
  if (sortProps && Object.keys(sortProps).length > 0 && Object.keys(sortProps)[0] != '0') {
    sort =
      '\nORDER BY' +
      Object.keys(sortProps)
        .map((k) => ` "${k}"` + (sortProps[k] < 1 ? ' DESC' : ' ASC') + ' NULLS LAST')
        .toString();
  } else if (search) {
    sort = '\nORDER BY "rank"';
  } else {
    sort = '\nORDER BY "id" DESC';
  }
  if (limit) {
    lim = '\nLIMIT ' + limit.toString();
  }
  if (skip) {
    offset = `\nOFFSET ${skip.toString()}`;
  }

  const facetsSqlArray = [`(SELECT 'total' as facet, 'count' as value, COUNT(*) FROM results_first)`];
  if (facets) {
    if (facets.singles) {
      for (let column of Object.keys(facets.singles)) {
        facetsSqlArray.push(
          `(SELECT '${column}' as facet, "${column}"::text as value, COUNT(*) FROM results_first GROUP BY 2)`,
        );
      }
    }
    if (facets.arrays) {
      for (let column of Object.keys(facets.arrays)) {
        facetsSqlArray.push(
          `(SELECT '${column}' as facet, "oneof${column}"::text as value, COUNT(*) FROM results_first, LATERAL unnest("${column}") "oneof${column}" GROUP BY 2)`,
        );
      }
    }
    if (facets.dateTrunks) {
      for (let column of Object.keys(facets.dateTrunks)) {
        //@ts-ignore
        const trunk = facets.dateTrunks[column];
        facetsSqlArray.push(
          `(SELECT '${column}' as facet, date_trunc('${trunk}', "${column}")::text, COUNT(*) FROM results_first GROUP BY 2)`,
        );
      }
    }
    if (facets.buckets) {
      for (let column of Object.keys(facets.buckets)) {
        //@ts-ignore
        const buckets = facets.buckets[column];
        facetsSqlArray.push(
          `(SELECT '${column}' as facet, (ARRAY[${buckets.toString()}])[width_bucket("${column}", ARRAY[${buckets.toString()}])]::TEXT as value, COUNT(*) FROM results_first GROUP BY 2)`,
        );
      }
    }
  }

  const facetsSql = facetsSqlArray.join(' UNION ');

  const sqlChest = search
    ? `
 WITH results_first AS (SELECT ${proj}, tsv, ts_rank_cd(tsv, query) as rank 
   FROM ${t}, to_tsquery(${search}) query ${searchWhere})
 , results2 AS (SELECT ${proj} FROM results_first ${sort} ${lim} ${offset})
 , results_last AS (SELECT jsonb_agg(row_to_json(results2)) as results FROM results2)
 `
    : `
 WITH results_first AS (SELECT ${proj} FROM ${t} ${where.sql} ${sort} ${lim} ${offset})
 , results_last AS (SELECT jsonb_agg(row_to_json(results_first)) as results FROM results_first)
 `;
  query.sql = `
${sqlChest}
, meta1 AS(${facetsSql})
, meta2 as (SELECT facet, jsonb_object_agg(value, count) AS pairs FROM meta1 WHERE value IS NOT NULL GROUP BY facet)
, meta3 as (SELECT jsonb_object_agg(facet, pairs) as meta from meta2)
select results as ${t}, meta as "${table}Meta" from results_last, meta3;`;
  //console.log('query: ', query)
  return query;
};

const whereFactory = (props: any, startValue: any[] = []): { sql: string; values: any[] } => {
  const query = { sql: '', values: startValue };
  if (!props || Object.keys(props).length < 1 || Object.keys(props)[0] == '0') return query;

  const keys1 = Object.keys(props);
  for (const k1 of keys1) {
    let w1: string = '';
    //@ts-ignore
    const keys2 = Object.keys(props[k1]);
    //@ts-ignore
    if (keys2.length === 0 || keys2[0] === '0') {
      //id:3, name='mohab'
      query.values.push(props[k1]);
      w1 = ` "${k1}" = $${query.values.length.toString()}`;
    } else {
      //'$eq': '01000'
      for (let k2 of keys2) {
        //@ts-ignore
        const value = props[k1][k2];
        if (Array.isArray(value) && k2.includes('in')) {
          //@ts-ignore
          w1 +=
            (w1 ? '\nAND' : '') +
            //@ts-ignore
            ` "${k1}" ${signs[k2]} ` +
            '(' +
            value
              .map((val) => {
                query.values.push(val);
                return '$' + query.values.length.toString();
              })
              .toString() +
            ')';
        } else {
          query.values.push(value);
          //@ts-ignore
          w1 += (w1 ? '\nAND' : '') + ` "${k1}" ${signs[k2]} $${query.values.length.toString()}`;
        }
      }
    }
    query.sql += !w1 ? '' : '\n' + (query.sql ? 'AND' : 'WHERE') + w1;
  }
  return query;
};

const signs = {
  $eq: '=',
  eq: '=',
  $ne: '<>',
  ne: '<>',
  $gt: '>',
  gt: '>',
  $lt: '<',
  lt: '<',
  $gte: '>=',
  gte: '>=',
  $lte: '<=',
  lte: '<=',
  $in: 'IN',
  in: 'IN',
  $nin: 'NOT IN',
  nin: 'NOT IN',
};

//out of order
const signValue = (key: string, sign: string, value: any, startValues: any[] = []): string => {
  let final = '';
  if (Array.isArray(value) && sign == '$in') {
    final = ' (';
    for (let item of value) {
      final += (final == ' (' ? '' : ' OR') + signValue(key, '$eq', item);
    }
    final = final === '(' ? '' : final + ' )';
  } else if (Array.isArray(value) && sign == '$nin') {
    final = ' (';
    for (let item of value) {
      final += (final == ' (' ? '' : ' AND') + signValue(key, '$ne', item);
    }
    final = final === '(' ? '' : final + ' )';
  } else {
    //@ts-ignore
    sign = signs[sign]; //convert '$eg' to '='
    final = key && sign && value ? ' ("' + key + '" ' + sign + ' ' + value + ')' : '';
  }
  return final;
};

//not usable for now
const cast = (value: any): string => {
  if (Array.isArray(value)) {
    return 'ARRAY[' + value.map((item) => ' ' + cast(item)).toString() + ']';
  } else if (typeof value === 'string') {
    return `'${value}'`;
  } else if (value instanceof Date) {
    return "'" + value.toISOString().slice(0, 19).replace('T', ' ') + "'";
  } else if (typeof value === 'boolean' || value === null) {
    return value.toString().toUpperCase();
  } else if (typeof value === 'number') {
    return value.toString();
  } else if (Object.keys(value).length > 0) {
    return JSON.stringify(value);
  } else {
    return value;
  }
};
