module.exports = (downloadDir) => {
    const _sources = require('./sources')(downloadDir)
    class UI {

        constructor(childClass) {
            (childClass || UI)._initEvent()
        }
        
        static _initEvent() {
            this.sources.forEach(element => {
                element
                .on('number-of-page', this.onNumberOfPage || ((nbPages ) => {
                    console.log(`contain ${nbPages} pages`)
                }))
                .on('page-download-error', this.onPageDownloadError ||(({ error, page }) => {
                    console.log(error.message)
                    console.log(`error in page ${page} download`)
                }))
                .on('page-download-finished', this.onPageDownloadFinished ||(({ page, nbPages }) => {
                    console.log(`Page ${page}/${nbPages} downloaded !`)
                }))
                .on('chapter-download-started', this.onChapterDownloadStarted || (({ manga, chapter }) => {
                    console.log('---------------------')
                    console.log(`The download of ${manga} ${chapter} start!`)
                }))
                .on('chapter-download-finished', this.onChapterDownloadFinished || (({ manga, chapter }) => {
                    console.log(`${manga} ${chapter} downloaded !`)
                    console.log('----------------------')
                }))
                .on('chapter-download-error', this.onChapterDownloadError || (() => {
                    console.log('chapter download failed !')
                }))
                .on('strategie-missing', this.onStrategieMissing || ((e) => {
                    console.log(e)
                }))
                .on('chapter-zip-started', this.onChapterZipStarted || (({ source, manga, chapter }) => {
                    console.log('zip started')
                }))
                .on('chapter-zip-finished', this.onChapterZipFinished || (({ source, manga, chapter }) => {
                    console.log('zip finished')
                }))
                .on('chapter-zip-error', this.onChapterZipError || (({ source, manga, chapter, error }) => {
                    console.log(error)
                    console.log('zip failed')
                }))
                .on('chapter-pdf-started', this.onChapterPdfStarted || (({ source, manga, chapter }) => {
                    console.log('pdf started')
                }))
                .on('chapter-pdf-finished', this.onChapterPdfFinished || (({ source, manga, chapter }) => {
                    console.log('pdf finished')
                }))
                .on('chapter-pdf-error', this.onChapterPdfError || (({ source, manga, chapter, error }) => {
                    console.log(error)
                    console.log('pdf failed')
                }))
                .on('get-last-chapter-error', this.onGetLastChapterError || ((error) => {
                    console.log('error get last')
                }))
                .on('chapter-is-available-error', this.onChapterIsAvailaleError || ((error) => {
                    console.log('error get last')
                }))
            })
        }

    }
    UI.sources = _sources;
    return  UI
}