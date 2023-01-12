const supertest = require('supertest');
const jasmine = require('jasmine');
const app = require('../build/server').default;
const { default: connectMongoClient } = require('../build/DB/mongoDB/mongoClient');
const { default: FilesModel } = require('../build/DB/mongoDB/files/FilesModel');
const request = supertest(app);
const route = '/files/';

describe('Mongo image:', () => {
  beforeAll(async()=>{
    if (process.env.ENV.includes('mongo')) {
      console.log('checking mongo connection...');
      await connectMongoClient();
      console.log('uploading full image to mongodb...');
      await FilesModel.uploadFileFromFile('../backend/src/assets/images/full/mongoImage.jpg','test.jpg', 'image/jpg')
      console.log('uploading 200x200 thumb to mongodb...');
      await FilesModel.uploadFileFromFile('../backend/src/assets/images/thumbs/200x200_mongoImage.jpg','200x200_test.jpg', 'image/jpg')
    }
  }, 1000*60*3)
  describe('after upload it: ', () => {

    it('downloads full image', async () => {
      await request
        .get(route + 'test.jpg')
        .expect('Content-Type', 'image/jpg')
        .expect(200);
    }, 1000 * 60);
  });
  it('downloads thumb', async () => {
    await request
      .get(route + 'test.jpg?width=200&height=200')
      .expect('Content-Type', 'image/jpg')
      .expect(200);
  }, 1000 * 60);
  it('creates thumb from full image', async () => {
    console.log('it takes a along time, one download, 2 sharp clones, one upload, wait...')
    await request
      .get(route + 'test.jpg?width=250&height=250')
      .expect(200);
  }, 1000 * 60 * 10);
  });
