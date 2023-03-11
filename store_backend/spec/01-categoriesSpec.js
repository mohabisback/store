require('dotenv').config();
const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: startMongoClient } = require('../build/DB/mongoDB/mongoClient');
const { default: startPgClient } = require('../build/DB/pgDB/pgClient');
const app = require('../build/server').default;

const request = supertest(app);
const route = '/categories/';

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: Categories: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await startMongoClient();
    } else if (process.env.ENV.includes('pg')) {
      console.log('checking pg connection...');
      await startPgClient();
    }
  }, 1000 * 60);

  describe('Add category: ', () => {
    it('with only required info', async () => {
      const response = await request.post(route + 'add').send({
        category: {
          title:'Electronics'
        },
      });
      try{
      expect(response.status).toBe(201);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with uneditable info', async () => {
      const response = await request.post(route + 'add').send({
        category: {
          id: 16,
          title: 'Pants'
        },
      });
      try{
      expect(response.status).toBe(201);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with extra properties', async () => {
      const response = await request.post(route + 'add').send({
        category: {
          title: 'Shoes',
          something: 33,
          somewhat: '44'
        },
      });
      try{
      expect(response.status).toBe(201);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with wrong data types', async () => {
      const response = await request.post(route + 'add').send({
        category: {
          title: 'Hats',
          hidden: 'string',
          forbidden: 33
        },
      });
      try{
      expect(response.status).toBe(201);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

  });
  
  
  describe('Get categories: ', () => {
    it('all', async () => {
      const response = await request.get(route + 'index')
      try{
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body.categories.length).toBe(4);
        expect(response.body.categories[0].title).toBe('Hats');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  
  describe('Update Category: ', () => {
    it('all', async () => {
      const response = await request.post(route + 'Electronics').send({category:{hidden:true, forbidden:true}})
      try{
        console.log(response.body)
        expect(response.status).toBe(200);
        expect(response.body.categories[3].hidden).toBe(true);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });
  
});
