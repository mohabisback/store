const supertest = require('supertest');
const jasmine = require('jasmine');
const { default: connectMongoClient } = require('../build/DB/mongoDB/mongoClient');
const app = require('../build/server').default;
const request = supertest(app);
const route = '/users/';

describe(`${process.env.ENV.includes('mongo') ? 'MongoDB' : 'Postgresql'}: Users: `, () => {
  beforeAll(async () => {
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await connectMongoClient();
    }
  });
  describe('Register: ', () => {
    it('with only required info', async () => {
      const response = await request.post(route + 'register').send({ user: {
        email: 'mohab1@email.com',
        password: 'mohab',
        firstName: 'Mohab',
        lastName: 'Moh',
        age: 45,
      }});
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('mohab1@email.com');
      expect(response.body.user.id).toBe(1);
      expect(response.body.user.role).toBe('user');
    });

    it('with uneditable info', async () => {
      const response = await request.post(route + 'register').send({ user: {
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
      }});
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('mohab2@email.com');
      expect(response.body.user.id).toBeTrue;
      expect(response.body.user.role).toBe('user');
    });

    it('with extra properties', async () => {
      const response = await request.post(route + 'register').send({ user: {
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
      }});
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('mohab3@email.com');
      expect(response.body.user.id).toBeTrue;
    });

    it('with empty props', async () => {
      const response = await request.post(route + 'register').send({ user: {
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
      }});
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('mohab4@email.com');
      expect(response.body.user.id).toBeTrue;
    });

    it('with wrong data types', async () => {
      const response = await request.post(route + 'register').send({ user: {
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
      }});
      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('mohab5@email.com');
      expect(response.body.user.id).toBeTrue;
      expect(response.body.user.role).toBe('user');
    });

    it('registered before', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: 'Mohab', lastName: 'Moh' }});
      expect(response.status).toBe(409);
    });

    it('without password', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: '', firstName: 'Mohab', lastName: 'Moh' }});
      expect(response.status).toBe(400);
    });

    it('without firstName', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: '', lastName: 'Moh' }});
      expect(response.status).toBe(400);
    });

    it('without lastName', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: 'Mohab', lastName: '' }});
      expect(response.status).toBe(400);
    });

    it('without right email format', async () => {
      const response = await request
        .post(route + 'register')
        .send({ user: { email: 'mohab1@email.com', password: 'mohab', firstName: 'Mohab', lastName: '' }});
      expect(response.status).toBe(400);
    });
  });

  describe('Login: ', () => {
    it('with email', async () => {
      const response = await request.post(route + 'login').send({ user: { email: 'mohab1@email.com', password: 'mohab' }});
      expect(response.status).toBe(202);
      expect(response.body.user.id).toBe(1);
      expect(response.body.user.email).toBe('mohab1@email.com');
      expect(response.body.user.role).toBe('user');
    });

    it('with id', async () => {
      const response = await request.post(route + 'login').send({ user: { id: '1', password: 'mohab' }});
      expect(response.status).toBe(202);
      expect(response.body.user.id).toBe(1);
      expect(response.body.user.email).toBe('mohab1@email.com');
      expect(response.body.user.role).toBe('user');
    });

    it('without password', async () => {
      const response = await request.post(route + 'login').send({ user: { email: 'mohab1@email.com', password: '' }});
      expect(response.status).toBe(400);
    });

    it('without email or id', async () => {
      const response = await request.post(route + 'login').send({ user: { password: 'any' }});
      expect(response.status).toBe(400);
    });

    it('with wrong password', async () => {
      const response = await request.post(route + 'login').send({ user: { email: 'mohab1@email.com', password: 'mo' }});
      expect(response.status).toBe(406);
    });

    it('logout', async () => {
      const response = await request.post(route + 'logout');
      expect(response.status).toBe(200);
      expect(response.body.user).toBe(null);
    });
  });

  describe('update user no password: ', () => {
    it('by email', async () => {
      const response = await request.post(route + 'mohab1@email.com').send({ user: { sendEmails: true }});
      expect(response.status).toBe(200);
    });
    it('by id', async () => {
      const response = await request.post(route + '1').send({ user: { sendEmails: true }});
      expect(response.status).toBe(200);
    });
    it('by wrong credentials', async () => {
      const response = await request.post(route + 'asd2').send({ user: { sendEmails: true }});
      expect(response.status).toBe(400);
    });
    it('try to change password', async () => {
      const response = await request.post(route + 'mohab1@email.com').send({ user: { password: 'new' }});
      expect(response.status).toBe(405);
    });
    it('uneditable only', async () => {
      const response = await request.post(route + '1').send({ user: { id: 33 }});
      expect(response.status).toBe(405);
    });
  });

  describe('Change password: ', () => {
    it('by email', async () => {
      const response = await request
        .post(route + 'change-password/' + 'mohab1@email.com')
        .send({ user: { oldPassword: 'mohab', newPassword: 'moh' }});
      expect(response.status).toBe(201);
    });
    it('by id', async () => {
      const response = await request
        .post(route + 'change-password/' + '1')
        .send({ user: { oldPassword: 'moh', newPassword: 'mohab' }});
      expect(response.status).toBe(201);
    });
    it('with wrong email', async () => {
      const response = await request
        .post(route + 'change-password/' + 'm@email.com')
        .send({ user: { oldPassword: 'mohab', newPassword: 'moh' }});
      expect(response.status).toBe(404);
    });
    it('with wrong id', async () => {
      const response = await request
        .post(route + 'change-password/' + '2545')
        .send({ user: { oldPassword: 'moh', newPassword: 'mohab' }});
      expect(response.status).toBe(404);
    });
    it('with wrong password', async () => {
      const response = await request
        .post(route + 'change-password/' + 'mohab1@email.com')
        .send({ user: { oldPassword: 'abcd', newPassword: 'mohab' }});
      expect(response.status).toBe(406);
    });
    it('with no new password', async () => {
      const response = await request
        .post(route + 'change-password/' + 'mohab1@email.com')
        .send({ user: { oldPassword: 'abcd', newPassword: '' }});
      expect(response.status).toBe(400);
    });
  });

  describe('Reset Password Quest: ', () => {
    it('by email', async () => {
      const response = await request.post(route + 'reset-password-quest/').send({ user: { email: 'mohab1@email.com' }});
      expect(response.status).toBe(200);
    });
    it('by wrong email', async () => {
      const response = await request.post(route + 'reset-password-quest/').send({ user: { email: 'mo@email.com' }});
      expect(response.status).toBe(200);
    });
  });

  describe('check user: ', () => {
    it('by email', async () => {
      const response = await request.get(route + 'check/' + 'mohab1@email.com');
      expect(response.status).toBe(200);
    });
    it('by id', async () => {
      const response = await request.get(route + 'check/' + '1');
      expect(response.status).toBe(200);
    });
    it('wrong email', async () => {
      const response = await request.get(route + 'check/' + '2342');
      expect(response.status).toBe(204);
    });
  });

  describe('get one user: ', () => {
    it('by email', async () => {
      const response = await request.get(route + 'mohab1@email.com');
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Mohab');
    });
    it('by id', async () => {
      const response = await request.get(route + '1');
      expect(response.status).toBe(200);
      expect(response.body.firstName).toBe('Mohab');
    });
    it('by wrong id', async () => {
      const response = await request.get(route + '2342');
      expect(response.status).toBe(404);
      expect(response.body.firstName).toBeUndefined;
    });
    it('by wrong email', async () => {
      const response = await request.get(route + 'abcd@efgh.ijk');
      expect(response.status).toBe(404);
      expect(response.body.firstName).toBeUndefined;
    });
  });

  describe('Get Users: ', () => {
    it('all', async () => {
      const response = await request.get(route + 'index');
      expect(response.status).toBe(200);
      expect(response.body.users.length).toBeGreaterThan(1);
    });
    it('2 users', async () => {
      const response = await request.get(route + 'index?limit=2');
      expect(response.status).toBe(200);
      expect(response.body.users.length).toBeLessThanOrEqual(2);
      expect(response.body.users[0].email).toBe('mohab5@email.com');
    });
    it('2 users and page 2', async () => {
      const response = await request.get(route + 'index?limit=2&page=2');
      expect(response.status).toBe(200);
      expect(response.body.users.length).toBeLessThanOrEqual(2);
      expect(response.body.users[0].email).toBe('mohab3@email.com');
    });
    it('4 users and page 2', async () => {
      const response = await request.get(route + 'index?limit=4&page=2');
      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(1);
      expect(response.body.users[0].email).toBe('mohab1@email.com');
    });
    it('sorted by ascending email', async () => {
      const response = await request.get(route + 'index?sort[email]=asc');
      expect(response.status).toBe(200);
      expect(response.body.users[0].email).toBe('mohab1@email.com');
    });
    it('sorted by descending email', async () => {
      const response = await request.get(route + 'index?sort[email]=desc');
      expect(response.status).toBe(200);
      expect(response.body.users[0].email).toBe('mohab5@email.com');
    });
    it('desc lastName then asc id', async () => {
      const response = await request.get(route + 'index?sort[lastName]=desc&sort[id]=asc');
      expect(response.status).toBe(200);
      expect(response.body.users[0].email).toBe('mohab4@email.com');
    });
    it('asc lastName then desc id', async () => {
      const response = await request.get(route + 'index?sort[lastName]=asc&sort[id]=desc');
      expect(response.status).toBe(200);
      expect(response.body.users[0].email).toBe('mohab5@email.com');
    });
    it('firstName and lastName', async () => {
      const response = await request.get(route + 'index?firstName=Mohab&lastName[eq]=Moh');
      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(3);
      expect(response.body.users[0].email).toBe('mohab3@email.com');
    });
    it('age<50 & age> 25 & age <> 45', async () => {
      const response = await request.get(route + 'index?age[lt]=50&age[gt]=25&age[ne]=35');
      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(3);
    });
    it('age in [25, 35, 45] and lastName in [Mohab,Moh,Mohamed]', async () => {
      const response = await request.get(route + 'index?age=20,30,40&lastName=Mohab,Moh,Mohamed');
      expect(response.status).toBe(200);
      expect(response.body.users.length).toBe(2);
    });
  });
});
