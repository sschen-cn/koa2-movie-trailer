const env = process.env.NODE_ENV === 'development' ? 'dev' : 'prod'

module.exports = require(`./${env}.js`)
