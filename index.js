exports.UI = (downloadDir) => {
    return require('./UIClass')(downloadDir)
}

exports.Sources = require('./sources')