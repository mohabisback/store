const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: connectMongoClient } = require('../build/DB/mongoDB/mongoClient');
const app = require('../build/server').default;

const request = supertest(app);
const route = '/orders/';

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: Orders: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await connectMongoClient();
    }
  });
  describe('Add order: ', () => {
    it('with only required info', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        items: [
          {
            product_id: 1,
            price: 20,
            quantity: 2,
          },
        ],
      }});
      expect(response.status).toBe(201);
    });

    it('with uneditable info', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 30,
        shipCost: 0,
        id: 33,
        items: [
          {
            id: 33,
            product_id: 1,
            price: 20,
            quantity: 2,
          },
          {
            id: 33,
            product_id: 2,
            price: 30,
            quantity: 4,
          },
        ],
      }});
      expect(response.status).toBe(201);
    });

    it('with extra properties', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        something: 22,
        items: [
          {
            product_id: 1,
            price: 20,
            quantity: 2,
            wrongprop: '',
          },
        ],
      }});
      expect(response.status).toBe(201);
    });

    it('with empty props', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        items: [
          {
            product_id: 1,
            price: 20,
            quantity: 2,
            status: '',
            user_id: '',
          },
        ],
    }});
      expect(response.status).toBe(201);
    });

    it('with wrong data types', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        user_id: true,
        items: [
          {
            product_id: 1,
            price: 20,
            quantity: 2,
            status: '',
            user_id: '',
          },
        ],
      }});
      expect(response.status).toBe(201);
    });

    it('with empty items', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        user_id: true,
      }});
      expect(response.status).toBe(400);
    });
    it('without items', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        user_id: true,
      }});
      expect(response.status).toBe(400);
    });
    it('without payment', async () => {
      const response = await request.post(route + 'add').send({ order: {
        fullName: 'Mohab Mohamed',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        items: [
          {
            product_id: 1,
            price: 20,
            quantity: 2,
          },
        ],
      }});
      expect(response.status).toBe(400);
    });
    it('with empty fullName', async () => {
      const response = await request.post(route + 'add').send({ order: {
        payment: 'cash on delivery',
        fullName: '',
        phone: '01000',
        addressString: 'something',
        itemsCost: 20,
        shipCost: 0,
        items: [
          {
            product_id: 1,
            price: 20,
            quantity: 2,
          },
        ],
      }});
      expect(response.status).toBe(400);
    });
  });

  // describe('get one order: ', () => {
  //   it('by title', async () => {
  //     const response = await request.get(route + 'computer1 RAM');
  //     expect(response.status).toBe(200);
  //     expect(response.body.title).toBe('computer1 RAM');
  //   });
  //   it('by id', async () => {
  //     const response = await request.get(route + '1');
  //     expect(response.status).toBe(200);
  //     expect(response.body.title).toBe('computer1 RAM');
  //   });
  //   it('by wrong id', async () => {
  //     const response = await request.get(route + '2342');
  //     expect(response.status).toBe(404);
  //     expect(response.body.title).toBeUndefined;
  //   });
  //   it('by wrong title', async () => {
  //     const response = await request.get(route + 'abcd@efgh.ijk');
  //     expect(response.status).toBe(404);
  //     expect(response.body.title).toBeUndefined;
  //   });
  // });

  // describe('Get Orders: ', () => {
  //   it('all', async () => {
  //     const response = await request.get(route + 'index');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBeGreaterThan(1);
  //   });
  //   it('2 orders', async () => {
  //     const response = await request.get(route + 'index?limit=2');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBeLessThanOrEqual(2);
  //     expect(response.body.orders[0].title).toBe('computer5 RAM');
  //   });
  //   it('2 orders and page 2', async () => {
  //     const response = await request.get(route + 'index?limit=2&page=2');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBeLessThanOrEqual(2);
  //     expect(response.body.orders[0].title).toBe('computer3 RAM');
  //   });
  //   it('4 orders and page 2', async () => {
  //     const response = await request.get(route + 'index?limit=4&page=2');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBe(1);
  //     expect(response.body.orders[0].title).toBe('computer1 RAM');
  //   });
  //   it('sorted by ascending title', async () => {
  //     const response = await request.get(route + 'index?sort[title]=asc');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders[0].title).toBe('computer1 RAM');
  //   });
  //   it('sorted by descending title', async () => {
  //     const response = await request.get(route + 'index?sort[title]=desc');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders[0].title).toBe('computer5 RAM');
  //   });
  //   // it('desc category then asc id', async () => {
  //   //   const response = await request.get(route + 'index?sort[category]=desc&sort[id]=asc')
  //   //   expect(response.status).toBe(200)
  //   //   expect(response.body.orders[0].title).toBe('computer1 RAM')
  //   // });
  //   // it('asc category then desc id', async () => {
  //   //   const response = await request.get(route + 'index?sort[category]=asc&sort[id]=desc')
  //   //   expect(response.status).toBe(200)
  //   //   expect(response.body.orders[0].title).toBe('computer5 RAM')
  //   // });
  //   it('price<50 & price> 25 & price <> 45', async () => {
  //     const response = await request.get(route + 'index?price[lt]=50&price[gt]=25&price[ne]=35');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBe(5);
  //   });
  //   it('price in [25, 35, 45] and category in [Mohab,Moh,Mohamed]', async () => {
  //     const response = await request.get(route + 'index?price=20,30,40&category=Mohab,Moh,Mohamed');
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBe(5);
  //   });
  // });
});
