require('dotenv').config();
const supertest = require('supertest');
const jasmine = require('jasmine');
const app = require('../build/server').default;
//
const request = supertest(app);
const route = '/files/';
describe('Server image:', () => {
  describe('full images: ', () => {
    it('right', async () => {
      await request
        .get(route + 'serverImage.jpg')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
    it('with no extension', async () => {
      await request
        .get(route + 'serverImage')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });

    it('with wrong extension', async () => {
      await request
        .get(route + 'serverImage.whatever')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
  });

  describe('cashed thumb: ', () => {
    it('right', async () => {
      await request
        .get(route + 'serverImage.jpg?width=200&height=200')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
    it('with width only', async () => {
      await request
        .get(route + 'serverImage.jpg?width=200')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
    it('with height only', async () => {
      await request
        .get(route + 'serverImage.jpg?height=200')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
    it('with wrong extension', async () => {
      await request
        .get(route + 'serverImage.something?width=200&height=200')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
  });
  describe('create thumb: ', () => {
    it('right', async () => {
      await request
        .get(route + 'serverImage.jpg?width=250&height=250')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
    it('with width only', async () => {
      await request
        .get(route + 'serverImage.jpg?width=300')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
    it('with height only', async () => {
      await request
        .get(route + 'serverImage.jpg?height=350')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
    it('with wrong extension', async () => {
      await request
        .get(route + 'serverImage.something?width=400&height=400')
        .expect('Content-Type', 'image/jpeg')
        .expect(200);
    });
  });
});
