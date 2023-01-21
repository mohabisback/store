require('dotenv').config();
const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: startMongoClient } = require('../build/DB/mongoDB/mongoClient');
const { default: startPgClient } = require('../build/DB/pgDB/pgClient');
const app = require('../build/server').default;

const request = supertest(app);
const route = '/orders/';

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: Orders: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await startMongoClient();
    } else if (process.env.ENV.includes('pg')) {
      console.log('checking pg connection...');
      await startPgClient();
    }
  }, 1000 * 60);
  describe('Add order: ', () => {
    it('with only required info', async () => {
      const response = await request.post(route + 'add').send({
        order: {
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
        order: {
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
        order: {
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
        order: {
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
        order: {
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
        },
      });
      try{
      expect(response.status).toBe(201);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with empty items', async () => {
      const response = await request.post(route + 'add').send({
        order: {
          payment: 'cash on delivery',
          fullName: 'Mohab Mohamed',
          phone: '01000',
          addressString: 'something',
          itemsCost: 20,
          shipCost: 0,
          user_id: true,
        },
      });
      try{
      expect(response.status).toBe(400);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('without items', async () => {
      const response = await request.post(route + 'add').send({
        order: {
          payment: 'cash on delivery',
          fullName: 'Mohab Mohamed',
          phone: '01000',
          addressString: 'something',
          itemsCost: 20,
          shipCost: 0,
          user_id: true,
        },
      });
      try{
      expect(response.status).toBe(400);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('without payment', async () => {
      const response = await request.post(route + 'add').send({
        order: {
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
        },
      });
      try{
      expect(response.status).toBe(400);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('with empty fullName', async () => {
      const response = await request.post(route + 'add').send({
        order: {
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
        },
      });
      try{
      expect(response.status).toBe(400);
    } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  // describe('get one order: ', () => {
  //   it('by title', async () => {
  //     const response = await request.get(route + 'computer1 RAM');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.title).toBe('computer1 RAM');
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('by id', async () => {
  //     const response = await request.get(route + '1');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.title).toBe('computer1 RAM');
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('by wrong id', async () => {
  //     const response = await request.get(route + '2342');
  //     try{
  //     expect(response.status).toBe(404);
  //     expect(response.body.title).toBeUndefined;
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('by wrong title', async () => {
  //     const response = await request.get(route + 'abcd@efgh.ijk');
  //     try{
  //     expect(response.status).toBe(404);
  //     expect(response.body.title).toBeUndefined;
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  // });

  // describe('Get Orders: ', () => {
  //   it('all', async () => {
  //     const response = await request.get(route + 'index');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBeGreaterThan(1);
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('2 orders', async () => {
  //     const response = await request.get(route + 'index?limit=2');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBeLessThanOrEqual(2);
  //     expect(response.body.orders[0].title).toBe('computer5 RAM');
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('2 orders and page 2', async () => {
  //     const response = await request.get(route + 'index?limit=2&page=2');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBeLessThanOrEqual(2);
  //     expect(response.body.orders[0].title).toBe('computer3 RAM');
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('4 orders and page 2', async () => {
  //     const response = await request.get(route + 'index?limit=4&page=2');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBe(1);
  //     expect(response.body.orders[0].title).toBe('computer1 RAM');
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('sorted by ascending title', async () => {
  //     const response = await request.get(route + 'index?sort[title]=asc');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders[0].title).toBe('computer1 RAM');
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('sorted by descending title', async () => {
  //     const response = await request.get(route + 'index?sort[title]=desc');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders[0].title).toBe('computer5 RAM');
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('desc category then asc id', async () => {
  //     const response = await request.get(route + 'index?sort[category]=desc&sort[id]=asc');
  //     try{
  //     expect(response.status).toBe(200)
  //     expect(response.body.orders[0].title).toBe('computer1 RAM')
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('asc category then desc id', async () => {
  //     const response = await request.get(route + 'index?sort[category]=asc&sort[id]=desc');
  //     try{
  //     expect(response.status).toBe(200)
  //     expect(response.body.orders[0].title).toBe('computer5 RAM')
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('price<50 & price> 25 & price <> 45', async () => {
  //     const response = await request.get(route + 'index?price[lt]=50&price[gt]=25&price[ne]=35');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBe(5);
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  //   it('price in [25, 35, 45] and category in [Mohab,Moh,Mohamed]', async () => {
  //     const response = await request.get(route + 'index?price=20,30,40&category=Mohab,Moh,Mohamed');
  //     try{
  //     expect(response.status).toBe(200);
  //     expect(response.body.orders.length).toBe(5);
  //   } catch (err) {
  //       console.log(response.status, ', ', response.body.message);
  //       throw err;
  //     }
  //   });
  // });
});
