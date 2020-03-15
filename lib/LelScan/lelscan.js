const jsdom = require('jsdom')
const site = 'LelScan'
const { JSDOM } = jsdom;
//const download = require('image-downloader');
const fs = require('fs');
const Path  = require('path')
const url = 'http://lelscanv.com';
const mangas = [
    {
        name : 'One Piece',
        path: '/scan-one-piece',
        pagePath : '/one-piece'
    },
    {
        name: 'Dr Stone',
        path: '/scan-dr-stone',
        pagePath: '/dr-stone'
    },
    {
        name: 'The Seven Deadly Sins',
        path: '/scan-the-seven-deadly-sins',
        pagePath: '/the-seven-deadly-sins'
    }
]

const Axios = require('axios')

async function downloadImage (manga_index,chapter,page,d) { 
  
  const Url = `${url+'/mangas'+mangas[manga_index].pagePath}/${chapter}/${page<10 ? '0'+page : page}.jpg`
  const path = `${d}/${mangas[manga_index].name}/${chapter}/page-${page<10 ? '0'+page : page}.jpg`
  const writer = fs.createWriteStream(path)

  const response = await Axios({
    url:Url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

async function checkIfChapter(manga_index,chap,d) {


    const dom = d || await JSDOM.fromURL('http://lelscanv.com'+mangas[manga_index].path+'/'+chap,{
        includeNodeLocations: true
    })


    const domChap = dom.window.document.querySelectorAll("#header-image h2 div a span")[2].innerHTML
    
    const bool = chap != domChap


    if(bool) this.emit('chapter-download-error',new Error(`le chapitre ${chap} n'est pas dispo`))

    return bool
}


async function downloadChapter(manga_index,chap) {
    const dom = await JSDOM.fromURL('http://lelscanv.com'+mangas[manga_index].path+'/'+chap,{
        includeNodeLocations: true
    });

    const thatDir = Path.join(this.downloadDir)

    if(await checkIfChapter(manga_index,chap,dom)) return 0 
    const nbPages = Array.from(dom.window.document.querySelectorAll('#navigation a')).map(e=> e.innerHTML).filter(e => parseInt(e)>0).length;
    this.emit('number-of-page', nbPages)

    let dir
    
    if (!fs.existsSync(dir = `${thatDir}`)){
        fs.mkdirSync(dir);
    }

    if (!fs.existsSync(dir = `${thatDir}/${mangas[manga_index].name}`)){
        fs.mkdirSync(dir)
    }

    if (!fs.existsSync(dir = `${thatDir}/${mangas[manga_index].name}/${chap}`)){
        fs.mkdirSync(dir)
    }
    let i
    for (i = 0;i<nbPages;i++) {
        try {
            await downloadImage(manga_index,chap,i,thatDir)
         
            this.emit('page-download-finished',{ page: i+1, nbPages })
        } catch(error) {
            this.emit('page-download-error',{ error, page: i+1 })
            return error
        }
    }
    
    return `${thatDir}/${mangas[manga_index].name}/${chap}`
}

async function getLastChapter(manga_index) {
    
    const dom = await JSDOM.fromURL('http://lelscanv.com/lecture-en-ligne-'+mangas[manga_index].pagePath.slice(1),{
        includeNodeLocations: true
    });
    return parseInt(dom.window.document.querySelectorAll("#header-image h2 div a span")[2].innerHTML)
}
module.exports.mangas = mangas
module.exports.url = url
module.exports.downloadChapter = downloadChapter
module.exports.getLastChapter = getLastChapter
module.exports.checkIfChapter = checkIfChapter
module.exports.site = site