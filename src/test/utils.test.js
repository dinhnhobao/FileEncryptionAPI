const assert = require('chai').assert;

const { isAuthorised, isPasswordValid, parsePassword } = require('../main/utils');

const { SERVER_API_KEY, PASSWORD_INITIALS } = require('../main/constants');
const { RUBBISH, EMPTY_PASSWORD, VALID_PASSWORD, 
    PASSWORD_WITH_SPECIAL_CHARS } = require('./constants');

describe('utils - API access key check', () => {
    it('returns true if the key is valid', () => {
        assert.isTrue(isAuthorised(SERVER_API_KEY + ' .'));
    });

    it('returns false if the key is incorrect', () => {
        assert.isFalse(isAuthorised(SERVER_API_KEY + RUBBISH));
    });
});

describe('utils - Password valid check', () => {
    it('returns true if the password is valid', () => {
        assert.isTrue(isPasswordValid(VALID_PASSWORD));
    });

    it('returns false if the password is invalid', () => {
        assert.isTrue(isPasswordValid(EMPTY_PASSWORD));
    });
});

describe('utils - Parse password check', () => {
    it('password is parsed successfully for valid passwords', () => {
        assert.strictEqual(PASSWORD_INITIALS + VALID_PASSWORD,
            parsePassword(VALID_PASSWORD));
    });

    it('password is parsed successfully for passwords with special chars', () => {
        assert.strictEqual(PASSWORD_INITIALS + PASSWORD_WITH_SPECIAL_CHARS,
            parsePassword(PASSWORD_WITH_SPECIAL_CHARS));
    });

})