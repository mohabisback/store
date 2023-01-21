require('dotenv').config();
const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: startMongoClient } = require('../build/DB/mongoDB/mongoClient');
const { default: startPgClient } = require('../build/DB/pgDB/pgClient');
const app = require('../build/server').default;
const request = supertest(app);
const route = '/users/';

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: Users: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await startMongoClient();
    } else if (process.env.ENV.includes('pg')) {
      console.log('checking pg connection...');
      await startPgClient();
    }
  },1000 * 60);
  describe('Register: ', () => {
    it('with only required info', async () => {
      const response = await request.post(route + 'register').send({
        user: {
          email: 'mohab1@email.com',
          password: 'mohab',
          firstName: 'Mohab',
          lastName: 'Moh',
          age: 45,
        },
      });
      try {
        expect(response.status).toBe(201);
        expect(response.body.signedUser.email).toBe('mohab1@email.com');
        expect(response.body.signedUser.id).toBe(1);
        expect(response.body.signedUser.role).toBe('user');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with uneditable info', async () => {
      const response = await request.post(route + 'register').send({
        user: {
          email: 'mohab2@email.com',
          password: 'mohab',
          firstName: 'Mohab',
          lastName: 'Moh',
          phone: '01000',
          age: 30,
          gender: 'male',
          sendEmails: true,
          role: 'admin', //uneditable
          id: 123, //uneditable
          verifiedEmail: true,
          signInDate: new Date(), //uneditable
          signUpDate: new Date(), //uneditable
          verifyToken: 'a', //uneditable
          passToken: 'a', //uneditable
          passTokenExp: new Date(), //uneditable
        },
      });
      try {
        expect(response.status).toBe(201);
        expect(response.body.signedUser.email).toBe('mohab2@email.com');
        expect(response.body.signedUser.id).toBeTrue;
        expect(response.body.signedUser.role).toBe('user');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with extra properties', async () => {
      const response = await request.post(route + 'register').send({
        user: {
          email: 'mohab3@email.com',
          password: 'mohab',
          firstName: 'Mohab',
          lastName: 'Moh',
          phone: '01000',
          age: 40,
          gender: 'male',
          wrongProperty1: true,
          wrongProperty2: 'any',
          wrongProperty3: 33,
        },
      });
      try {
        expect(response.status).toBe(201);
        expect(response.body.signedUser.email).toBe('mohab3@email.com');
        expect(response.body.signedUser.id).toBeTrue;
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with empty props', async () => {
      const response = await request.post(route + 'register').send({
        user: {
          email: 'mohab4@email.com',
          password: 'mohab',
          firstName: 'Mohab',
          lastName: 'Mohamed',
          phone: '01000',
          age: 50,
          gender: 'male',
          sendEmails: null,
          role: '', //uneditable
          verifiedEmail: null,
          signInDate: '', //uneditable
          signUpDate: '', //uneditable
          verifyToken: '', //uneditable
          passToken: null, //uneditable
          passTokenExp: undefined, //uneditable
        },
      });
      try {
        expect(response.status).toBe(201);
        expect(response.body.signedUser.email).toBe('mohab4@email.com');
        expect(response.body.signedUser.id).toBeTrue;
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with wrong data types', async () => {
      const response = await request.post(route + 'register').send({
        user: {
          email: 'mohab5@email.com',
          password: 'mohab',
          firstName: 'Mohamed',
          lastName: 'Moh',
          phone: { number: 'a', strin: 33, false: [3, 'a', false] },
          age: 25,
          gender: [3, 'a', true, false],
          sendEmails: { project: 33, not: '44' },
          role: 'admin', //uneditable
          verifiedEmail: 'yes and no',
          signInDate: new Date(), //uneditable
          signUpDate: new Date(), //uneditable
          verifyToken: 22, //uneditable
          passToken: 'a', //uneditable
          passTokenExp: new Date(), //uneditable
        },
      });
      try {
        expect(response.status).toBe(201);
        expect(response.body.signedUser.email).toBe('mohab5@email.com');
        expect(response.body.signedUser.id).toBeTrue;
        expect(response.body.signedUser.role).toBe('user');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('registered before', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: 'Mohab', lastName: 'Moh' } });
      try {
        expect(response.status).toBe(409);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without password', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: '', firstName: 'Mohab', lastName: 'Moh' } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without firstName', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: '', lastName: 'Moh' } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without lastName', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: 'Mohab', lastName: '' } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without right email format', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: 'Mohab', lastName: '' } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('Login: ', () => {
    it('with email', async () => {
      const response = await request
        .post(route + 'login-email')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab' } });
      try {
        expect(response.status).toBe(202);
        expect(response.body.signedUser.id).toBe(1);
        expect(response.body.signedUser.email).toBe('mohab1@email.com');
        expect(response.body.signedUser.role).toBe('user');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with id', async () => {
      const response = await request.post(route + 'login-email').send({ user: { id: '1', password: 'mohab' } });
      try {
        expect(response.status).toBe(202);
        expect(response.body.signedUser.id).toBe(1);
        expect(response.body.signedUser.email).toBe('mohab1@email.com');
        expect(response.body.signedUser.role).toBe('user');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without password', async () => {
      const response = await request.post(route + 'login-email').send({ user: { email: 'mohab1@email.com', password: '' } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('without email or id', async () => {
      const response = await request.post(route + 'login-email').send({ user: { password: 'any' } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('with wrong password', async () => {
      const response = await request
        .post(route + 'login-email')
        .send({ user: { email: 'mohab1@email.com', password: 'mo' } });
      try {
        expect(response.status).toBe(406);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });

    it('logout', async () => {
      const response = await request.post(route + 'logout');
      try {
        expect(response.status).toBe(200);
        expect(response.body.signedUser).toBe(null);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('update user no password: ', () => {
    it('by email', async () => {
      const response = await request.post(route + 'mohab1@email.com').send({ user: { sendEmails: true } });
      try {
        expect(response.status).toBe(200);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by id', async () => {
      const response = await request.post(route + '1').send({ user: { sendEmails: true } });
      try {
        expect(response.status).toBe(200);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by wrong credentials', async () => {
      const response = await request.post(route + 'asd2').send({ user: { sendEmails: true } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('try to change password', async () => {
      const response = await request.post(route + 'mohab1@email.com').send({ user: { password: 'new' } });
      try {
        expect(response.status).toBe(405);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('uneditable only', async () => {
      const response = await request.post(route + '1').send({ user: { id: 33 } });
      try {
        expect(response.status).toBe(405);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('Change password: ', () => {
    it('by email', async () => {
      const response = await request
        .post(route + 'change-password/' + 'mohab1@email.com')
        .send({ user: { oldPassword: 'mohab', newPassword: 'moh' } });
      try {
        expect(response.status).toBe(201);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by id', async () => {
      const response = await request
        .post(route + 'change-password/' + '1')
        .send({ user: { oldPassword: 'moh', newPassword: 'mohab' } });
      try {
        expect(response.status).toBe(201);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('with wrong email', async () => {
      const response = await request
        .post(route + 'change-password/' + 'm@email.com')
        .send({ user: { oldPassword: 'mohab', newPassword: 'moh' } });
      try {
        expect(response.status).toBe(404);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('with wrong id', async () => {
      const response = await request
        .post(route + 'change-password/' + '2545')
        .send({ user: { oldPassword: 'moh', newPassword: 'mohab' } });
      try {
        expect(response.status).toBe(404);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('with wrong password', async () => {
      const response = await request
        .post(route + 'change-password/' + 'mohab1@email.com')
        .send({ user: { oldPassword: 'abcd', newPassword: 'mohab' } });
      try {
        expect(response.status).toBe(406);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('with no new password', async () => {
      const response = await request
        .post(route + 'change-password/' + 'mohab1@email.com')
        .send({ user: { oldPassword: 'abcd', newPassword: '' } });
      try {
        expect(response.status).toBe(400);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('Reset Password Quest: ', () => {
    it('by email', async () => {
      const response = await request
        .post(route + 'reset-password-quest/')
        .send({ user: { email: 'mohab1@email.com' } });
      try {
        expect(response.status).toBe(200);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by wrong email', async () => {
      const response = await request.post(route + 'reset-password-quest/').send({ user: { email: 'mo@email.com' } });
      try {
        expect(response.status).toBe(200);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('check user: ', () => {
    it('by email', async () => {
      const response = await request.get(route + 'check/' + 'mohab1@email.com');
      try {
        expect(response.status).toBe(200);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by id', async () => {
      const response = await request.get(route + 'check/' + '1');
      try {
        expect(response.status).toBe(200);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('wrong email', async () => {
      const response = await request.get(route + 'check/' + '2342');
      try {
        expect(response.status).toBe(204);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('get one user: ', () => {
    it('by email', async () => {
      const response = await request.get(route + 'mohab1@email.com');
      try {
        expect(response.status).toBe(200);
        expect(response.body.user.firstName).toBe('Mohab');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by id', async () => {
      const response = await request.get(route + '1');
      try {
        expect(response.status).toBe(200);
        expect(response.body.user.firstName).toBe('Mohab');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by wrong id', async () => {
      const response = await request.get(route + '2342');
      try {
        expect(response.status).toBe(404);
        expect(response.body.user).toBeUndefined;
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('by wrong email', async () => {
      const response = await request.get(route + 'abcd@efgh.ijk');
      try {
        expect(response.status).toBe(404);
        expect(response.body.user).toBeUndefined;
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });

  describe('Get Users: ', () => {
    it('all', async () => {
      const response = await request.get(route + 'index');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBeGreaterThan(1);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('2 users', async () => {
      const response = await request.get(route + 'index?limit=2');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBeLessThanOrEqual(2);
        expect(response.body.users[0].email).toBe('mohab5@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('2 users and page 2', async () => {
      const response = await request.get(route + 'index?limit=2&page=2');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBeLessThanOrEqual(2);
        expect(response.body.users[0].email).toBe('mohab3@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('4 users and page 2', async () => {
      const response = await request.get(route + 'index?limit=4&page=2');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(1);
        expect(response.body.users[0].email).toBe('mohab1@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('sorted by ascending email', async () => {
      const response = await request.get(route + 'index?sort[email]=asc');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users[0].email).toBe('mohab1@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('sorted by descending email', async () => {
      const response = await request.get(route + 'index?sort[email]=desc');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users[0].email).toBe('mohab5@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('desc lastName then asc id', async () => {
      const response = await request.get(route + 'index?sort[lastName]=desc&sort[id]=asc');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users[0].email).toBe('mohab4@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('asc lastName then desc id', async () => {
      const response = await request.get(route + 'index?sort[lastName]=asc&sort[id]=desc');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users[0].email).toBe('mohab5@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('firstName and lastName', async () => {
      const response = await request.get(route + 'index?firstName=Mohab&lastName[eq]=Moh');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(3);
        expect(response.body.users[0].email).toBe('mohab3@email.com');
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('age<50 & age> 25 & age <> 45', async () => {
      const response = await request.get(route + 'index?age[lt]=50&age[gt]=25&age[ne]=35');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(3);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
    it('age in [25, 35, 45] and lastName in [Mohab,Moh,Mohamed]', async () => {
      const response = await request.get(route + 'index?age=20,30,40&lastName=Mohab,Moh,Mohamed');
      try {
        expect(response.status).toBe(200);
        expect(response.body.users.length).toBe(2);
      } catch (err) {
        console.log(response.status, ', ', response.body.message);
        throw err;
      }
    });
  });
});
