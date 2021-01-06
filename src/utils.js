const isAuthorised = (apiKey) => {
    const SERVER_API_KEY = 'eb53a0d3-8fb2-4f25-bb89-a4dfb7a64fc6'; // mock API key
    return apiKey === SERVER_API_KEY;
}

const isPasswordValid = (password) => {
    return password.length > 0;
}

const parsePassword = (password) => {
    const INITIALS = '*+-/aA11'; // to pass password requirements
    return INITIALS + password;
}

module.exports = {
    isAuthorised,
    isPasswordValid,
    parsePassword
};