const Path = require('path')
const Event = require('events')
const fs = require('fs')
const { zip } = require('zip-a-folder')
const { ImagesToPDF } = require('images-pdf')
const theDir = Path.join(process.mainModule.filename,'..','Mangas')
if (!fs.existsSync(theDir)){
    fs.mkdirSync(theDir)
}

function normalize(name) {
    return name.toLowerCase().replace(/\ /gi,'-')
}

module.exports = function() {
    class Source {
	//downloadChapter need to return path of the images folder
        static async downloadChapter(manga_index,chapter) {
            if(typeof(this._downloadChapter) != 'function') {
                this.emit('strategie-missing',new Error(`The download chapter Strategie of ${this.site} is missing`))
                return 0
            }
            else {
		        if(await this.checkIfChapter(manga_index,chapter)) return 0;
                this.emit('chapter-download-started',{ manga: this.mangas[manga_index].name, chapter })
                const path = await this._downloadChapter(manga_index,chapter)
                if(typeof(path) == 'string')
                    this.emit('chapter-download-finished', { manga: this.mangas[manga_index].name, chapter });
                else this.emit('chapter-download-error');

                return path
            }
        }
        static async downloadLastChapter(manga_index) {
            return this.downloadChapter(manga_index, await this.getLastChapter(manga_index))
        }
        
        static async getLastChapter(manga_index) {
            if(typeof(this._getLastChapter) != 'function'){
                this.emit('strategie-missing',new Error(`The get Last chapter Strategie of ${this.site} is missing`))
                return 0
            }else {
                return await this._getLastChapter(manga_index)
            }
        }
        static async checkIfChapter(manga_index,chapter) {
	    
            if(typeof(this._checkIfChapter) != 'function'){
                this.emit('strategie-missing',new Error(`The check chapter Strategie of ${this.site} is missing`))
                return false
            }else {
                return await this._checkIfChapter(manga_index,chapter)
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
    Source.downloadDir = theDir 
    return Source
}

