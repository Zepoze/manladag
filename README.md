# Add Your Source strategie here

Example: add the source Lelscan

##1. Create folder
    $ mkdir LelScan
    $ cd LelScan
##2. Create Source subClass

lib/LelScan/class.js

    const SourceClass = require('../class')()
    class LelScan extends SourceClass {}

##3. Redefine static  members of Source
*Please follows Source class logic*

lib/LelScan/lelscan.js
    
    const axios = require('axios')
    const url = 'http://lelscanv.com'
    const site = 'LelScan'
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
    }]
    function downloadChapter(manga_index,chapter) {
         
         //Your logic here
         
    }
    // definition of others startegies
    
    module.exports.url = url
    module.exports.mangas = mangas
    module.exports.site = site    

    module.exports.downloadChatpter = downloadChapter
    //export the other strategies

lib/LelScan/class.js

    const SourceClass = require('../class')()
    const lelscan = require('./lelscan')
    class LelScan extends SourceClass {}
    LelScan.url = lelscan.url
    LelScan.mangas = lelscan.mangas
    LelScan.site = lelscan.site
    LelScan._downloadChapter = lelscan.downloadChapter
    module.exports = LelScan

 