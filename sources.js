module.exports = (downloadDir) =>  {    
    const lelScanClass = require('./lib/LelScan/class')(downloadDir)
    return [
        lelScanClass
    ]
}