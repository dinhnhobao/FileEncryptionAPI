const constants = require('./constants');

const isAuthorised = (apiKey) => {
    return apiKey === constants.SERVER_API_KEY;
}

const isPasswordValid = (password) => {
    return password.length > 0;
}

const parsePassword = (password) => {
    // add PASSWORD_INITIALS to pass the password requirements of cryptfy, 
    // https://www.npmjs.com/package/cryptify#password-req
    return constants.PASSWORD_INITIALS + password;
}

module.exports = {
    isAuthorised,
    isPasswordValid,
    parsePassword
};