const lelscan = require('./lelscan')

module.exports = (downloadDir) => {
    const Source = require('../class')(downloadDir)
    const lelscan = require('./lelscan')
    class lelscanSource extends Source {}
    lelscanSource.site = lelscan.site
    lelscanSource.url = lelscan.url
    lelscanSource.mangas = lelscan.mangas
    lelscanSource._downloadChapter = lelscan.downloadChapter
    lelscanSource._getLastChapter = lelscan.getLastChapter
    lelscanSource._chapterIsAvailable = lelscan.chapterIsAvailable
    return lelscanSource
}