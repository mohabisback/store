export let dbName: string = '' //the pure name of database
export let dbResetOrUp: string = '' //is it to reset, to up or not
export let dbDriver: string = '' //the name of migration in database.json file
// dbDrivers = 'pg', 'pg_aws', 'pg_test', pg_aws_test', ''mongo', 'mongo_test'

//dbState reset or default up, in case
//no up for production until completely tested
if ( process.env.ENV?.includes('reset') &&
    !process.env.ENV?.includes('pro')) {
      dbResetOrUp += 'reset'
} else if (process.env.ENV?.includes('dev') ||
    process.env.ENV?.includes('dev')){
      dbResetOrUp += 'up'
}

//dbName store or store_test & dbDriver
if (process.env.ENV?.includes('pro')){
  dbName = 'store'
  dbDriver = 'pg_aws'
} else if (process.env.ENV?.includes('test')){
  dbName = 'store_test'
  if (process.env.ENV?.includes('aws')){
    dbDriver = 'pg_aws_test'
  } else if (process.env.ENV?.includes('pg')){
    dbDriver = 'pg_test'
  } else if (process.env.ENV?.includes('mongo')){
    dbDriver = 'mongo_test'
  } 
} else if (process.env.ENV?.includes('dev')){
  dbName = 'store'
  if (process.env.ENV?.includes('aws')){
    dbDriver = 'pg_aws'
  } else if (process.env.ENV?.includes('pg')){
    dbDriver = 'pg'
  } else if (process.env.ENV?.includes('mongo')){
    dbDriver = 'mongo'
  } 
}
console.log(dbName)
console.log(dbDriver)
console.log(dbResetOrUp)