const PORT = 8000
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

const app = express()
const mainUrl = 'https://www.x-kom.pl'
const urlXkom = mainUrl+'/goracy_strzal'

axios(urlXkom)
    .then(response => {
        const html = response.data
        const $ = cheerio.load(html)
        let theDeal = class {
            constructor(){
            }
        }
        $('div.sc-8c7p9j-4.gVWBce', html).each(function(){
            theDeal.lower = parseFloat($(this).find('span.sc-8c7p9j-2').text().replace(',','.').replace(' ',''))
            theDeal.regular = parseFloat($(this).find('span.sc-8c7p9j-3').text().replace(',','.').replace(' ',''))
            theDeal.discount = theDeal.regular - theDeal.lower
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
        console.log(theDeal)
    }).catch(err => console.log(err))

app.listen(PORT)