const { assert } = require('chai');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../main/index');

const { SERVER_API_KEY } = require('../main/constants');
const { WRONG_SERVER_API_KEY, EMPTY_PASSWORD, VALID_PASSWORD } = require('./constants');

chai.use(chaiHttp);

describe('server - GET /api/test', () => {
    it('returns true - server is up and running', () => {
        chai.request(server)
            .get('/api/test')
            .end((err, res) => {
                assert(200, res.status);
                assert({ isWorking: true }, res.body);
            });
    });
});

describe('server - POST /api/encrypt', () => {
    it('returns 401 - Unauthorised (wrong API access key)', () => {
        chai.request(server)
            .post('/api/encrypt')
            .set({ 'Authorization': WRONG_SERVER_API_KEY })
            .field('Content-Type', 'multipart/form-data')
            .attach('file', './src/test/mock-file.in')
            .end((err, res) => {
                assert.strictEqual(401, res.status);
            });
    });

    it('returns 400 - Bad Request (API key correct but password invalid)', () => {
        chai.request(server)
            .post('/api/encrypt')
            .set({ 'Authorization': SERVER_API_KEY })
            .field('Content-Type', 'multipart/form-data')
            .attach('file', './src/test/mock-file.in')
            .field('password', EMPTY_PASSWORD)
            .end((err, res) => {
                assert.strictEqual(400, res.status);
            });
    });

    it('returns 200 - Successful (API key and password valid)', () => {
        chai.request(server)
            .post('/api/encrypt')
            .set({ 'Authorization': SERVER_API_KEY })
            .field('Content-Type', 'multipart/form-data')
            .attach('file', './src/test/mock-file.in')
            .field('password', VALID_PASSWORD)
            .end((err, res) => {
                assert.strictEqual(200, res.status);
            });
    });
});

describe('server - POST /api/decrypt', () => {
    it('returns 401 - Unauthorised (wrong API access key)', () => {
        chai.request(server)
            .post('/api/decrypt')
            .set({ 'Authorization': WRONG_SERVER_API_KEY })
            .field('Content-Type', 'multipart/form-data')
            .attach('file', './src/test/mock-file.in')
            .end((err, res) => {
                assert.strictEqual(401, res.status);
            });
    });

    it('returns 400 - Bad Request (API key valid but file corrupted/wrong password)', () => {
        chai.request(server)
            .post('/api/decrypt')
            .set({ 'Authorization': SERVER_API_KEY })
            .field('Content-Type', 'multipart/form-data')
            .attach('file', './src/test/mock-file.in')
            .field('password', EMPTY_PASSWORD)
            .end((err, res) => {
                assert.strictEqual(400, res.status);
            });
    });
});