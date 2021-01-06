const { assert } = require('chai');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../main/index');

const { SERVER_API_KEY } = require('../main/constants');
const { WRONG_SERVER_API_KEY, EMPTY_PASSWORD, VALID_PASSWORD, MOCK_FILE_PATH } = require('./constants');

const {
    AUTHORIZATION_HEADER,
    CONTENT_TYPE, FORM_TYPE,
    FILE_FIELD, PASSWORD_FIELD,
    SUCCESS, BAD_REQUEST, UNAUTHORISED
} = require('./http-constants');

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
            .field(CONTENT_TYPE, FORM_TYPE)
            .attach(FILE_FIELD, MOCK_FILE_PATH)
            .end((err, res) => {
                assert.strictEqual(401, res.status);
            });
    });

    it('returns 400 - Bad Request (API key correct but password invalid)', () => {
        chai.request(server)
            .post('/api/encrypt')
            .set({ 'Authorization': SERVER_API_KEY })
            .field(CONTENT_TYPE, FORM_TYPE)
            .attach(FILE_FIELD, MOCK_FILE_PATH)
            .field(PASSWORD_FIELD, EMPTY_PASSWORD)
            .end((err, res) => {
                assert.strictEqual(400, res.status);
            });
    });

    it('returns 200 - Successful (API key and password valid)', () => {
        chai.request(server)
            .post('/api/encrypt')
            .set({ 'Authorization': SERVER_API_KEY })
            .field(CONTENT_TYPE, FORM_TYPE)
            .attach(FILE_FIELD, MOCK_FILE_PATH)
            .field(PASSWORD_FIELD, VALID_PASSWORD)
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
            .field(CONTENT_TYPE, FORM_TYPE)
            .attach(FILE_FIELD, MOCK_FILE_PATH)
            .end((err, res) => {
                assert.strictEqual(401, res.status);
            });
    });

    it('returns 400 - Bad Request (API key valid but file corrupted/wrong password)', () => {
        chai.request(server)
            .post('/api/decrypt')
            .set({'Authorization': SERVER_API_KEY })
            .field(CONTENT_TYPE, FORM_TYPE)
            .attach(FILE_FIELD, MOCK_FILE_PATH)
            .field(PASSWORD_FIELD, EMPTY_PASSWORD)
            .end((err, res) => {
                assert.strictEqual(400, res.status);
            });
    });
});