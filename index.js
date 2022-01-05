const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()
const mainUrl = 'https://www.x-kom.pl'
const urlXkom = mainUrl+'/goracy_strzal'
const ceneoUrl = 'https://www.ceneo.pl/szukaj-'
let Deal = class {
    constructor(){
    }
}

let theDeal = new Deal()

const priceList = []


axios(urlXkom)
    .then(response => {
        let html = response.data
        let $ = cheerio.load(html)
        
        $('div.sc-8c7p9j-4.gVWBce', html).each(function(){
            theDeal.lower = parseFloat($(this).find('span.sc-8c7p9j-2').text().replace(',','.').replace(' ',''))
            theDeal.regular = parseFloat($(this).find('span.sc-8c7p9j-3').text().replace(',','.').replace(' ',''))
            theDeal.discount = `${theDeal.regular - theDeal.lower}zł => ${(theDeal.regular - theDeal.lower)/theDeal.regular*100} %`
        })
        
        theDeal.status = $('div.ikk4le-8').text()
        if(theDeal.status.length === 0)
            theDeal.status = 'Dostępny'

        const productId = $('span.sc-1bker4h-9').text()
        const lastIndex = productId.lastIndexOf(' ')
        $('link').each(function(){
            const productUrl = $(this).attr('href')
            if(typeof productUrl !== 'undefined'){
                if(productUrl.includes(productId.substring(lastIndex, productId.length).trim())){
                    theDeal.url = productUrl
                }
            }
        })

        theDeal.productName = $('h1.sc-1bker4h-4.hPFRuA').text()
        theDeal.itemsLeft = $('div.ed26tz-2.boBMhu').length
        theDeal.ceneoSearchString = ceneoUrl+theDeal.productName.replaceAll(' ', '+')
        console.log(theDeal)
        //console.log(theDeal.ceneoSearchString)
        // axios(ceneoUrl+theDeal.ceneoSearchString)
        //     .then(response => {
        //         let html = response.data
                
        //         let $ = cheerio.load(html)
        //         let bestHitMark = '***'
        //         $('div.cat-prod-row__body', html).each(function(){
        //             const name = bestHitMark+$(this).find('a.js_seoUrl.js_clickHash.go-to-product').attr('title')
        //             const price = parseInt($(this).find('span.value').text())
        //             bestHitMark = ''
        //             //console.log({name, price})
        //         })
                
                
                
        //     }).catch(err => console.log(err))



    }).catch(err => console.log(err))

    
    





app.listen(PORT)