require('babel-register')({
    presets: ['env']
})
// Import the rest of our application.
module.exports = require('./src/main/index.js')