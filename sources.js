const sourceBase = require('./lib/class')
module.exports = {
    'lelscan': require('manladag-lelscan')(sourceBase())
}