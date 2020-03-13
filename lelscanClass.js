const Source = require('./Classbase')()
const lelscan = require('./lelscan')
class lelscanSource extends Source {}
lelscanSource.site = 'LelScan'
lelscanSource.url = lelscan.url
lelscanSource.mangas = lelscan.mangas
lelscanSource._downloadChapter = lelscan.downloadChapter
lelscanSource._getLastChapter = lelscan.getLastChapter
lelscanSource._checkIfChapter = lelscan.checkIfChapter
module.exports = lelscanSource
