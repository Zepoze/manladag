'use strict';
const consola = require('consola')
const sources = require('./sources').sources
var inquirer = require('inquirer');

sources.forEach((e) => {
    e
        .on('number-of-page', (nbPages ) => {
            consola.info(`contain ${nbPages} pages`)
        })
        .on('page-download-finished', ({ page, nbPages }) => {
            consola.success(`Page ${page}/${nbPages} downloaded !`)
        })
        .on('chapter-download-started', ({ manga, chapter }) => {
            consola.log('---------------------')
            consola.info(`The download of ${manga} ${chapter} start!`)
        })
        .on('chapter-download-finished', ({ manga, chapter }) => {
            consola.success(`${manga} ${chapter} downloaded !`)
            consola.log('----------------------')
        })
        .on('chapter-download-error', e => {
            consola.error(e)
        })
	.on('strategie-missing',(e) => {
            consola.error(e)
	})
})

async function startUI() {
    let a = await inquirer
    .prompt([
        {
        type: 'list',
        name: 'source',
        message: 'Which Source?',
        choices: sources.map((e,i) => { return { name: e.site, value: i }})
        }
    ])
    
    selectManga(sources[a.source])


}

async function selectManga(source) {
    let a = await inquirer
    .prompt([
        {
        type: 'list',
        name: 'manga',
        message: `${source.site} Mangas`,
        choices: [
            ...source.mangas.map((e,i) => { return { name: e.name, value: i }}),
            new inquirer.Separator(),
            { name: 'Select an other Source', value: -1}
        ]}
    ])

    if(a.manga == -1) startUI()
    else selectChapter(source,a.manga)
}


async function selectChapter(source,manga_index) {
    let a = await inquirer
    .prompt([
        {
        type: 'list',
        name: 'action',
        message: 'Select an Action',
        choices: [
            {name: 'Download Last Chapter', value: 0},
            { name: 'Download a chapter', value: 1},
            new inquirer.Separator(),
            {name: 'Select an Other Manga', value: -1}
        ]}
    ])

    switch(a.action) {
        case 0:
            let chap = await source.getLastChapter(manga_index)
            consola.info(`The last chapter : ${chap}`)

            await source.downloadChapter(manga_index,chap)
            selectManga(source)
            break
        case 1:
            let b = await inquirer
            .prompt([
                {
                type: 'input',
                name: 'chapter',
                message: 'type a chapter',
                validate: (value) => (parseInt(value) >=0) ? true : 'Come on bro it should be a number'
                }
            ])
            const path = await source.downloadChapter(manga_index,parseInt(b.chapter))
            if(path != 0) {
                //source.zip(path)
            }
            selectManga(source)
            

            break
        case -1:
            selectManga(source) 
            break
    }

}

startUI()
