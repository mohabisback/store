require('dotenv').config();
const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: startMongoClient } = require('../build/DB/mongoDB/mongoClient');
const { default: startPgClient } = require('../build/DB/pgDB/pgClient');
const app = require('../build/server').default;

const request = supertest(app);
const route = '/products/';

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: Products: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await startMongoClient();
    } else if (process.env.ENV.includes('pg')) {
      console.log('checking pg connection...');
      await startPgClient();
    }
  },1000 * 60);
  describe('Add product: ', () => {
    it('with only required info', async () => {
      const response = await request.post(route + 'add').send({
        product: {
          title: 'computer1 RAM',
          price: 10,
          stock: 100,
          img1: 'url/to/image',
          maxItems: 1,
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
        product: {
          id: 123,
          title: 'computer2 RAM',
          description: 'this is a computer, its number is 2',
          price: 20,
          discount: 40,
          stock: 200, //number of pieces available
          viewsCount: 150, //number of views
          ordersCount: 7, //number of orders
          used: false, //is it new or used
          category_id: 1,
          size: 'min',
          color: 'green',
          maxItems: 2, //max number of items to be bought in one order
          img1: 'url/to/image', //external url or local title
          img2: 'url/to/image',
          img3: 'url/to/image',
          img4: 'url/to/image',
          img5: 'url/to/image',
          hidden: false,
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
        product: {
          title: 'computer3 RAM',
          size: '4',
          description: '',
          category_id: 1,
          discount: 13,
          price: 30,
          stock: 3,
          img1: 'url/to/image',
          ordersCount: 15,
          wrongProperty1: true,
          wrongProperty2: 'any',
          wrongProperty3: 33,
        },
      });
      try{
      expect(response.status).toBe(201);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with empty props', async () => {
      const response = await request.post(route + 'add').send({
        product: {
          title: 'computer4 RAM',
          size: 'max',
          description: 'Mohab',
          category_id: 2,
          discount: '01000',
          price: 40,
          stock: 4,
          ordersCount: 'male',
          viewsCount: null,
          hidden: '', //uneditable
          used: null,
          maxItems: '', //uneditable
          color: '', //uneditable
          img1: 'url/to/image', //uneditable
          img2: undefined, //uneditable
          img3: [],
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
        product: {
          title: 'computer5 RAM',
          size: '3',
          description: '',
          category_id: 1,
          salePrice: { number: 'a', string: 33, false: [3, 'a', false] },
          price: 50,
          stock: 0,
          ordersCount: [3, 'a', true, false],
          viewsCount: { project: 33, not: '44' },
          hidden: 'admin', //uneditable
          used: 'yes and no',
          stock: new Date(), //uneditable
          maxItems: new Date(), //uneditable
          color: 22, //uneditable
          img1: 'url/to/image', //uneditable
          img2: new Date(), //uneditable
          img3: [3],
        },
      });
      try{
      expect(response.status).toBe(201);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('added before', async () => {
      const response = await request
        .post(route + 'add')
        .send({ product: { title: 'computer1 RAM', price: 30, img1: 'url/to/image' } });
        try{
      expect(response.status).toBe(409);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without title', async () => {
      const response = await request
        .post(route + 'add')
        .send({ product: { title: '', price: 10, img1: 'url/to/image' } });
        try{
      expect(response.status).toBe(400);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without price', async () => {
      const response = await request
        .post(route + 'add')
        .send({ product: { title: 'Computer1 RAM', img1: 'url/to/image' } });
        try{
      expect(response.status).toBe(400);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without img1', async () => {
      const response = await request
        .post(route + 'add')
        .send({ product: { title: 'Computer1 RAM', price: 25, img1: '' } });
        try{
      expect(response.status).toBe(400);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('update product: ', () => {
    it('by title', async () => {
      const response = await request.post(route + 'computer1 RAM').send({ product: { price: 15 } });
      try{
      expect(response.status).toBe(200);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by id', async () => {
      const response = await request.post(route + '1').send({ product: { price: 20 } });
      try{
      expect(response.status).toBe(200);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by wrong credentials', async () => {
      const response = await request.post(route + 'asd2').send({ product: { price: 25 } });
      try{
      expect(response.status).toBe(404);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('with uneditable properties', async () => {
      const response = await request.post(route + '1').send({ product: { price: 10, viewsCount: 20 } });
      try{
      expect(response.status).toBe(200);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('uneditable only', async () => {
      const response = await request.post(route + '1').send({ product: { viewsCount: 20, id: 33 } });
      try{
      expect(response.status).toBe(405);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('get one product: ', () => {
    it('by title', async () => {
      const response = await request.get(route + 'computer1 RAM');
      try{
      expect(response.status).toBe(200);
      expect(response.body.product.title).toBe('computer1 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by id', async () => {
      const response = await request.get(route + '1');
      try{
      expect(response.status).toBe(200);
      expect(response.body.product.title).toBe('computer1 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by wrong id', async () => {
      const response = await request.get(route + '2342');
      try{
      expect(response.status).toBe(404);
      expect(response.body.product).toBeUndefined;
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by wrong title', async () => {
      const response = await request.get(route + 'abcd@efgh.ijk');
      try{
      expect(response.status).toBe(404);
      expect(response.body.product).toBeUndefined;
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('Get Products: ', () => {
    it('all', async () => {
      const response = await request.get(route + 'index');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeGreaterThan(1);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('2 products', async () => {
      const response = await request.get(route + 'index?limit=2');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeLessThanOrEqual(2);
      expect(response.body.products[0].title).toBe('computer5 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('2 products and page 2', async () => {
      const response = await request.get(route + 'index?limit=2&page=2');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeLessThanOrEqual(2);
      expect(response.body.products[0].title).toBe('computer3 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('4 products and page 2', async () => {
      const response = await request.get(route + 'index?limit=4&page=2');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].title).toBe('computer1 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('sorted by ascending title', async () => {
      const response = await request.get(route + 'index?sort[title]=asc');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products[0].title).toBe('computer1 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('sorted by descending title', async () => {
      const response = await request.get(route + 'index?sort[title]=desc');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products[0].title).toBe('computer5 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('desc category then asc id', async () => {
      const response = await request.get(route + 'index?sort[category_id]=desc&sort[id]=asc');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products[0].title).toBe('computer4 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('asc category then desc id', async () => {
      const response = await request.get(route + 'index?sort[category_id]=asc&sort[id]=desc');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products[0].title).toBe('computer5 RAM');
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('price<50 & price> 25 & price <> 35', async () => {
      const response = await request.get(route + 'index?price[lt]=50&price[gt]=25&price[ne]=35');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(2);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('price in [20, 30, 45] and category in [Electronics,Pants]', async () => {
      const response = await request.get(route + 'index?price=20,30,45&category_id=1,2');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(2);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('searches for computers', async () => {
      const response = await request.get(route + 'index?search=computers');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(5);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('searches for compoters', async () => {
      const response = await request.get(route + 'index?search=cmpters');
      try{
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeGreaterThan(0);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });
});
