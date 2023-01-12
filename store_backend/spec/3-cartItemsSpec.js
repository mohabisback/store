const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: connectMongoClient } = require('../build/DB/mongoDB/mongoClient');
const app = require('../build/server').default;

const request = supertest(app);

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: cartItems: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await connectMongoClient();
    }

    //add products for testing
    const response = await request.post('/products/add').send({ product: {
      title: 'computer1 RAM',
      price: 10,
      stock: 100,
      maxItems: 1,
      img1: 'url/to/image',}})
    const response2 = await request.post('/products/add').send({ product: {
      title: 'computer2 RAM',
      price: 20,
      stock: 200,
      maxItems: 2,
      img1: 'url/to/image',}})
    const response3 = await request.post('/products/add').send({ product: {
      title: 'computer3 RAM',
      price: 30,
      stock: 3,
      img1: 'url/to/image',}})
      const response4 = await request.post('/products/add').send({ product: {
        title: 'computer4 RAM',
        price: 40,
        stock: 400,
        maxItems: 0,
        img1: 'url/to/image',
      }})
      const response5 = await request.post('/products/add').send({ product: {
        title: 'computer4 RAM',
        price: 50,
        stock: 0,
        maxItems: 0,
        img1: 'url/to/image',}})
  });

  describe('With user_id 3: ', () => {
    it('add first product', async () => {
      const response = await request.get('/cartItems/' + '1/1');
      expect(response.status).toBe(200);
      expect(response.body.cartItems.length).toEqual(1)
      expect(response.body.cartItems[0].product_id).toEqual(1)
      expect(response.body.cartItems[0].quantity).toEqual(1)
      expect(response.body.cartItems[0].price).toEqual(10)
    });
    it('update first product more than max', async () => {
      const response = await request.get('/cartItems/' + '1/2');
      expect(response.status).toBe(400);
      expect(response.body.cartItems.length).toEqual(1)
      expect(response.body.cartItems[0].product_id).toEqual(1)
      expect(response.body.cartItems[0].quantity).toEqual(1)
      expect(response.body.cartItems[0].price).toEqual(10)
    });
    it('add product with id:3', async () => {
      const response = await request.get('/cartItems/' + '3/1');
      expect(response.status).toBe(200);
      expect(response.body.cartItems.length).toEqual(2)
    });
    it('update product3 with more than quantity', async () => {
      const response = await request.get('/cartItems/' + '3/4');
      expect(response.status).toBe(400);
      expect(response.body.cartItems.length).toEqual(2)
      expect(response.body.cartItems[0].product_id).toEqual(1)
      expect(response.body.cartItems[0].quantity).toEqual(1)
      expect(response.body.cartItems[0].price).toEqual(10)
      expect(response.body.cartItems[1].product_id).toEqual(3)
      expect(response.body.cartItems[1].quantity).toEqual(1)
      expect(response.body.cartItems[1].price).toEqual(30)
    });
    
    it('add product4 with maxItems = 0', async () => {
      const response = await request.get('/cartItems/' + '3/4');
      expect(response.status).toBe(400);
      expect(response.body.cartItems.length).toEqual(2)
      expect(response.body.cartItems[0].product_id).toEqual(1)
      expect(response.body.cartItems[0].quantity).toEqual(1)
      expect(response.body.cartItems[0].price).toEqual(10)
      expect(response.body.cartItems[1].product_id).toEqual(3)
      expect(response.body.cartItems[1].quantity).toEqual(1)
      expect(response.body.cartItems[1].price).toEqual(30)
    });
        
    it('add product5 with stock = 0', async () => {
      const response = await request.get('/cartItems/' + '3/4');
      expect(response.status).toBe(400);
      expect(response.body.cartItems.length).toEqual(2)
      expect(response.body.cartItems[0].product_id).toEqual(1)
      expect(response.body.cartItems[0].quantity).toEqual(1)
      expect(response.body.cartItems[0].price).toEqual(10)
      expect(response.body.cartItems[1].product_id).toEqual(3)
      expect(response.body.cartItems[1].quantity).toEqual(1)
      expect(response.body.cartItems[1].price).toEqual(30)
    });
  });

  describe('Register users, with cartItems', () => {
    it('user 6 with one cartItem', async () => {
      const response = await request.post('/users/' + 'register').send({
         user: { email: 'mohab6@email.com', firstName: 'Mohab', lastName:'Mohamed', password: 'mohab' },
         cartItems: [{product_id: 1, quantity: 1}]        
        });
      expect(response.status).toBe(201); //created
      expect(response.body.cartItems.length).toEqual(1)
      expect(response.body.cartItems[0].product_id).toEqual(1)
      expect(response.body.cartItems[0].quantity).toEqual(1)
      expect(response.body.cartItems[0].price).toEqual(10)
    });
    it('user 7 with 2 cartItems', async () => {
      const response = await request.post('/users/' + 'register').send({
         user: { email: 'mohab7@email.com', firstName: 'Mohab', lastName:'Mohamed', password: 'mohab' },
         cartItems: [
          {product_id: 1, quantity: 1, price: 10},
          {product_id: 2, quantity: 2, price: 20}
        ]        
        });
      expect(response.status).toBe(201); //created
      expect(response.body.cartItems.length).toEqual(2)
    });

    it('user 8 with empty cart', async () => {
      const response = await request.post('/users/' + 'register').send({
         user: { email: 'mohab8@email.com', firstName: 'Mohab', lastName:'Mohamed', password: 'mohab' },
         cartItems: []        
        });
      expect(response.status).toBe(201); //created
      expect(response.body.cartItems.length).toEqual(0)
    });

    it('user 9 with undefined cartItems', async () => {
      const response = await request.post('/users/' + 'register').send({
         user: { email: 'mohab9@email.com', firstName: 'Mohab', lastName:'Mohamed', password: 'mohab' }
        });
      expect(response.status).toBe(201); //created
      expect(response.body.cartItems.length).toEqual(0)
    });

    it('user 10 with wrong cartItems object', async () => {
      const response = await request.post('/users/' + 'register').send({
         user: { email: 'mohab10@email.com', firstName: 'Mohab', lastName:'Mohamed', password: 'mohab' },
         cartItems: 'string here'       
        });
      expect(response.status).toBe(201); //created
      expect(response.body.cartItems.length).toEqual(0)
    });

    it('user 11 with 4 cartItems, one with not product_id, other with no quantity, other with no price', async () => {
      const response = await request.post('/users/' + 'register').send({
         user: { email: 'mohab11@email.com', firstName: 'Mohab', lastName:'Mohamed', password: 'mohab' },
         cartItems: [
          {quantity: 1, price: 10},
          {product_id: 2, price: 20},
          {product_id: 3, quantity: 3},
          {product_id: 4, quantity: 4, price: 40}
        ]        
        });
      expect(response.status).toBe(201); //created
      expect(response.body.cartItems.length).toEqual(2)
    });

    it('user 12 with one item and other more than max and other more than stock', async () => {
      const response = await request.post('/users/' + 'register').send({
         user: { email: 'mohab12@email.com', firstName: 'Mohab', lastName:'Mohamed', password: 'mohab' },
         cartItems:[
          {product_id: 3, quantity: 5},
          {product_id: 2, quantity: 5},
          {product_id: 1, quantity: 1},
         ]      
        });
        expect(response.status).toBe(201); //created
        expect(response.body.cartItems.length).toEqual(1)
        expect(response.body.cartItems[0].product_id).toEqual(1)
        expect(response.body.cartItems[0].quantity).toEqual(1)
        expect(response.body.cartItems[0].price).toEqual(10)
    });
  });
  
  describe('Login user: ', () => {
    it('user 6 with no cartItem', async () => {
      const response = await request.post('/users/' + 'login').send({
         user: { email: 'mohab6@email.com', password: 'mohab' }
        });
      expect(response.status).toBe(202); //created
      expect(response.body.cartItems.length).toEqual(1)
      expect(response.body.cartItems[0].product_id).toEqual(1)
      expect(response.body.cartItems[0].quantity).toEqual(1)
      expect(response.body.cartItems[0].price).toEqual(10)
    });
    it('user 7 with one additional cartItems', async () => {
      const response = await request.post('/users/' + 'login').send({
         user: { email: 'mohab7@email.com', password: 'mohab' },
         cartItems: [
          {product_id: 3, quantity: 1}
        ]        
        });
      expect(response.status).toBe(202); //created
      expect(response.body.cartItems.length).toEqual(3)
    });

    it('user 9 with undefined cartItems', async () => {
      const response = await request.post('/users/' + 'login').send({
         user: { email: 'mohab9@email.com', password: 'mohab' }
        });
      expect(response.status).toBe(202); //created
      expect(response.body.cartItems.length).toEqual(0)
    });

    it('user 10 with wrong cartItems object', async () => {
      const response = await request.post('/users/' + 'login').send({
         user: { email: 'mohab10@email.com', password: 'mohab' },
         cartItems: 'string here'       
        });
      expect(response.status).toBe(202); //created
      expect(response.body.cartItems.length).toEqual(0)
    });

    it(`user 11 with 4 cartItems, one with not product_id,
     other with no quantity, other with extra quantity
     one repeated and one new`, async () => {
      const response = await request.post('/users/' + 'login').send({
         user: { email: 'mohab11@email.com', password: 'mohab' },
         cartItems: [
          {quantity: 1, price: 10},
          {product_id: 2, price: 20},
          {product_id: 3, quantity: 3},
          {product_id: 5, quantity: 5, price: 50}
        ]        
      });
      expect(response.status).toBe(202); //created
      expect(response.body.cartItems.length).toEqual(3)
    });

    it('user 12 with one item and other more than max and other more than stock', async () => {
      const response = await request.post('/users/' + 'login').send({
         user: { email: 'mohab12@email.com', password: 'mohab' },
         cartItems:[
          {product_id: 3, quantity: 5},
          {product_id: 2, quantity: 5},
          {product_id: 4, quantity: 4},
         ]      
        });
        expect(response.status).toBe(202); //created
        expect(response.body.cartItems.length).toEqual(2)
        expect(response.body.cartItems[0].product_id).toEqual(1)
        expect(response.body.cartItems[0].quantity).toEqual(1)
        expect(response.body.cartItems[0].price).toEqual(10)
        expect(response.body.cartItems[1].product_id).toEqual(4)
        expect(response.body.cartItems[1].quantity).toEqual(4)
        expect(response.body.cartItems[1].price).toEqual(40)
    });

    it('logout', async () => {
      const response = await request.post('/users/' + 'logout');
      expect(response.status).toBe(200);
      expect(response.body.user).toBeNull
    });
  });

  describe('Remove: ', () => {
    it('first product', async () => {
      const response = await request.get('/cartItems/' + '1/0');
      expect(response.status).toBe(200);
      expect(response.body.cartItems.length).toEqual(1)
      expect(response.body.cartItems[0].product_id).toEqual(3)
      expect(response.body.cartItems[0].quantity).toEqual(1)
    });
    it('not there', async () => {
      const response = await request.get('/cartItems/' + '2/0');
      expect(response.status).toBe(200);
      expect(response.body.cartItems.length).toEqual(1)
      expect(response.body.cartItems[0].product_id).toEqual(3)
      expect(response.body.cartItems[0].quantity).toEqual(1)
    });
    it('second product', async () => {
      const response = await request.get('/cartItems/' + '3/0');
      expect(response.status).toBe(200);
      expect(response.body.cartItems.length).toEqual(0)
    });
   });
});
