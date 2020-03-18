const Path = require('path')
const Event = require('events')
const fs = require('fs')
const { zip } = require('zip-a-folder')
const { ImagesToPDF } = require('images-pdf')

function normalize(name) {
    return name.toLowerCase().replace(/\ /gi,'-')
}

module.exports = function(downloadDir) {
    class Source {
	//downloadChapter need to return path of the images folder
        static async downloadChapter(manga_index,chapter) {
            let error, path
            if(typeof(this._downloadChapter) != 'function') {
                error = new Error(`The download chapter Strategie of ${this.site} is missing`)
                this.emit('strategie-missing', error)
                throw error
            }
            else {
                this.emit('chapter-download-started',{ manga: this.mangas[manga_index].name, chapter })
                
                try {
                    path = await this._downloadChapter(manga_index,chapter)
                    this.emit('chapter-download-finished', { manga: this.mangas[manga_index].name, chapter })
                } catch(e) {
                    this.emit('chapter-download-error')
                    throw e
                }

                return path
            }
        }
        static async downloadLastChapter(manga_index) {
            return this.downloadChapter(manga_index, await this.getLastChapter(manga_index))
        }
        
        static async getLastChapter(manga_index) {
            let error
            if(typeof(this._getLastChapter) != 'function'){
                error = new Error(`The get Last chapter Strategie of ${this.site} is missing`)
                this.emit('strategie-missing', error)
                throw error
            }else {
                try {
                    return await this._getLastChapter(manga_index)
                } catch(e) {
                    this.emit('get-last-chapter-error', e)
                    throw e
                }
            }
        }
        static async chapterIsAvailable(manga_index,chapter) {
            let error
            if(typeof(this._chapterIsAvailable) != 'function'){
                error = new Error(`The check chapter Strategie of ${this.site} is missing`)
                this.emit('strategie-missing', error)
                throw error
            }else {
                try {
                    return await this._chapterIsAvailable(manga_index,chapter)
                } catch(e) {
                    this.emit('chapter-is-available-error', e)
                    throw e
                }
            }
        }
        
        static async zipChapter(manga_index,chapter,path) {
            this.emit('chapter-zip-started', {
                source: this.site,
                manga : this.mangas[manga_index].name,
                chapter
            })
            try {
                await zip(path, Path.join(path, '..', `${this.site}-${normalize(this.mangas[manga_index].name)+chapter}.zip`))
                this.emit('chapter-zip-finished', {
                    source: this.site,
                    manga : this.mangas[manga_index].name,
                    chapter
                })
            }
            catch(error) {
                this.emit('chapter-zip-error', {
                    source: this.site,
                    manga : this.mangas[manga_index].name,
                    chapter,
                    error
                    
                })
            }
        }

        static async pdfChapter(manga_index,chapter,path) {
            this.emit('chapter-pdf-started', {
                source: this.site,
                manga : this.mangas[manga_index].name,
                chapter
            })
            try {
                const dir = Path.join(path, '..', `${this.site+'-'+normalize(this.mangas[manga_index].name)+chapter}.pdf`)
                new ImagesToPDF().convertFolderToPDF(path, dir);
                this.emit('chapter-pdf-finished', {
                    source: this.site,
                    manga : this.mangas[manga_index].name,
                    chapter
                })
            }
            catch(error) {
                this.emit('chapter-pdf-error', {
                    source: this.site,
                    manga : this.mangas[manga_index].name,
                    chapter,
                    error
                })
            }
        }

        static async processChapter(path, manga_index, chapter, { pdf = false, zip = false, jpg = true }) {
            if(zip) await this.zipChapter(manga_index, chapter, path);
            if(zip) await this.pdfChapter(manga_index, chapter, path);

        }

        static on(string, func) {
            return this.event.on(string, func)
        }

        static emit(string, payload) {
            return this.event.emit(string, payload)
        }
            
    }
    Source.event = new Event()
    Source.site =''
    Source.url = ''
    Source.mangas = []
    Source.downloadDir = downloadDir
    return Source
}

