const consola = require('consola')
const Event = require('events')
const { zip } = require('zip-a-folder')
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
                this.emit('chapter-download-finished', { manga: this.mangas[manga_index].name, chapter })

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
                manga : this.mangas[manga_index].name,
                chapter
            })
            try {
                await zip(path, `${path}/../${this.site}-${this.mangas[manga_index].name+chapter}.zip`)
                this.emit('chapter-zip-finished', {
                    manga : this.mangas[manga_index].name,
                    chapter
                })
            }
            catch(e) {
                this.emit('chapter-zip-error', {
                    manga : this.mangas[manga_index].name,
                    chapter
                })
            }
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

    return Source
}

