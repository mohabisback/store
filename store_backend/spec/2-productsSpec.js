const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: connectMongoClient } = require('../build/DB/mongoDB/mongoClient');
const app = require('../build/server').default;

const request = supertest(app);
const route = '/products/';

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: Products: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await connectMongoClient();
    }
  });
  describe('Add product: ', () => {
    it('with only required info', async () => {
      const response = await request.post(route + 'add').send({ product: {
        title: 'computer1 RAM',
        price: 10,
        stock: 100,
        img1: 'url/to/image',
        maxItems: 1
      }});
      expect(response.status).toBe(201);
    });

    it('with uneditable info', async () => {
      const response = await request.post(route + 'add').send({ product: {
        id: 123,
        title: 'computer2 RAM',
        description: 'this is a computer, its number is 2',
        price: 20,
        discount: 40,
        stock: 200, //number of pieces available
        viewsCount: 150, //number of views
        ordersCount: 7, //number of orders
        used: false, //is it new or used
        category: 'Electronics',
        size: 'min',
        color: 'green',
        maxItems: 2, //max number of items to be bought in one order
        img1: 'url/to/image', //external url or local title
        img2: 'url/to/image',
        img3: 'url/to/image',
        img4: 'url/to/image',
        img5: 'url/to/image',
        hidden: false,
      }});
      expect(response.status).toBe(201);
    });

    it('with extra properties', async () => {
      const response = await request.post(route + 'add').send({ product: {
        title: 'computer3 RAM',
        size: '4',
        description: '',
        category: 'Electronics',
        discount: 13,
        price: 30,
        stock: 3,
        img1: 'url/to/image',
        ordersCount: 15,
        wrongProperty1: true,
        wrongProperty2: 'any',
        wrongProperty3: 33,
      }});
      expect(response.status).toBe(201);
    });

    it('with empty props', async () => {
      const response = await request.post(route + 'add').send({ product: {
        title: 'computer4 RAM',
        size: 'max',
        description: 'Mohab',
        category: 'Mohamed',
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
      }});
      expect(response.status).toBe(201);
    });

    it('with wrong data types', async () => {
      const response = await request.post(route + 'add').send({ product: {
        title: 'computer5 RAM',
        size: '3',
        description: '',
        category: 'Electronics',
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
      }});
      expect(response.status).toBe(201);
    });

    it('added before', async () => {
      const response = await request
        .post(route + 'add')
        .send({ product: { title: 'computer1 RAM', price: 30, img1: 'url/to/image' }});
      expect(response.status).toBe(409);
    });

    it('without title', async () => {
      const response = await request.post(route + 'add').send({ product: { title: '', price: 10, img1: 'url/to/image' }});
      expect(response.status).toBe(400);
    });

    it('without price', async () => {
      const response = await request.post(route + 'add').send({ product: { title: 'Computer1 RAM', img1: 'url/to/image' }});
      expect(response.status).toBe(400);
    });

    it('without img1', async () => {
      const response = await request.post(route + 'add').send({ product: { title: 'Computer1 RAM', price: 25, img1: '' }});
      expect(response.status).toBe(400);
    });
  });

  describe('update product: ', () => {
    it('by title', async () => {
      const response = await request.post(route + 'computer1 RAM').send({ product: { price: 15 }});
      expect(response.status).toBe(200);
    });
    it('by id', async () => {
      const response = await request.post(route + '1').send({ product: { price: 20 }});
      expect(response.status).toBe(200);
    });
    it('by wrong credentials', async () => {
      const response = await request.post(route + 'asd2').send({ product: { price: 25 }});
      expect(response.status).toBe(404);
    });
    it('with uneditable properties', async () => {
      const response = await request.post(route + '1').send({ product: { price: 10, viewsCount: 20 }});
      expect(response.status).toBe(200);
    });
    it('uneditable only', async () => {
      const response = await request.post(route + '1').send({ product: { viewsCount: 20, id: 33 }});
      expect(response.status).toBe(405);
    });
  });

  describe('get one product: ', () => {
    it('by title', async () => {
      const response = await request.get(route + 'computer1 RAM');
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('computer1 RAM');
    });
    it('by id', async () => {
      const response = await request.get(route + '1');
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('computer1 RAM');
    });
    it('by wrong id', async () => {
      const response = await request.get(route + '2342');
      expect(response.status).toBe(404);
      expect(response.body.title).toBeUndefined;
    });
    it('by wrong title', async () => {
      const response = await request.get(route + 'abcd@efgh.ijk');
      expect(response.status).toBe(404);
      expect(response.body.title).toBeUndefined;
    });
  });

  describe('Get Products: ', () => {
    it('all', async () => {
      const response = await request.get(route + 'index');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeGreaterThan(1);
    });
    it('2 products', async () => {
      const response = await request.get(route + 'index?limit=2');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeLessThanOrEqual(2);
      expect(response.body.products[0].title).toBe('computer5 RAM');
    });
    it('2 products and page 2', async () => {
      const response = await request.get(route + 'index?limit=2&page=2');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeLessThanOrEqual(2);
      expect(response.body.products[0].title).toBe('computer3 RAM');
    });
    it('4 products and page 2', async () => {
      const response = await request.get(route + 'index?limit=4&page=2');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(1);
      expect(response.body.products[0].title).toBe('computer1 RAM');
    });
    it('sorted by ascending title', async () => {
      const response = await request.get(route + 'index?sort[title]=asc');
      expect(response.status).toBe(200);
      expect(response.body.products[0].title).toBe('computer1 RAM');
    });
    it('sorted by descending title', async () => {
      const response = await request.get(route + 'index?sort[title]=desc');
      expect(response.status).toBe(200);
      expect(response.body.products[0].title).toBe('computer5 RAM');
    });
    it('desc category then asc id', async () => {
      const response = await request.get(route + 'index?sort[category]=desc&sort[id]=asc')
      expect(response.status).toBe(200)
      expect(response.body.products[0].title).toBe('computer4 RAM')
    });
    it('asc category then desc id', async () => {
      const response = await request.get(route + 'index?sort[category]=asc&sort[id]=desc')
      expect(response.status).toBe(200)
      expect(response.body.products[0].title).toBe('computer5 RAM')
    });
    it('price<50 & price> 25 & price <> 35', async () => {
      const response = await request.get(route + 'index?price[lt]=50&price[gt]=25&price[ne]=35');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(2);
    });
    it('price in [20, 30, 45] and category in [Electronics,Mohamed]', async () => {
      const response = await request.get(route + 'index?price=20,30,45&category=Electronics,Mohamed');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(2);
    });
    it('searches for computers', async () => {
      const response = await request.get(route + 'index?search=computers');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBe(5);
    });
    it('searches for compoters', async () => {
      const response = await request.get(route + 'index?search=cmpters');
      expect(response.status).toBe(200);
      expect(response.body.products.length).toBeGreaterThan(0);
    });
  });
});
