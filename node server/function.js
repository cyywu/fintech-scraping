const puppeteer = require('puppeteer');
var crypto = require('crypto');

const testingMode = false
const newsCollection = testingMode ? "newNews" : "news"

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// 40 news a page, need to click next page button to see more news
const getBIS = async (db) => {
    try {
        var touchedNewsCount = 0;
        var loadingNewsCount = 0;

        // var pagesToScrape = 2;
        var pagesToScrape = 1;
        var currentPage = 1;

        var browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        var newsPage = await browser.newPage();
        var contentViewer = await browser.newPage();

        // Open News page
        await newsPage.goto('https://www.bis.org/list/press_releases/');  // set
        await newsPage.waitForSelector("tbody");   // set

        // the resulting list of news
        var resultJson = []

        // Getting news's title, link and date info
        while (currentPage <= pagesToScrape) {

            resultJson = resultJson.concat(
                await newsPage.evaluate(() => {
                    var newsArr = document.querySelectorAll('tbody>tr')   // set

                    var titles = document.querySelectorAll('tbody>tr .title>a');  // set
                    var links = document.querySelectorAll('tbody>tr .title>a');   // set
                    var dates = document.querySelectorAll('tbody>tr>.item_date')    // set

                    var newsArrJson = [];

                    for (var i = 0; i < newsArr.length; i++) {
                        newsArrJson.push({
                            title: titles[i].innerText.trim(),  // set
                            link: 'https://www.bis.org' + links[i].getAttribute("href"),  // set
                            date: dates[i].innerText.trim()  // set
                        });
                    }
                    return newsArrJson
                })
            )
            await newsPage.click('li.next')   // set
            await newsPage.waitForSelector("tbody");   // set
            currentPage++;
        }

        var article;
        var theArticle;

        // fill the article field for each news in the result json
        for (var i = 0; i < resultJson.length; i++) {
            console.log(++loadingNewsCount, '. loading: ', resultJson[i]['link'])
            await contentViewer.goto(resultJson[i]['link']);
            await contentViewer.waitForSelector("#cmsContent");    // set
            article = await contentViewer.evaluate(() => {
                theArticle = document.querySelectorAll('#cmsContent')  // set
                return theArticle[0].innerText.trim()
            })
            resultJson[i]['article'] = article
        }

        await browser.close();

        try {
            for (var i = 0; i < resultJson.length; i++) {

                let rawDate = resultJson[i].date
                let dateDate = new Date(new Date(rawDate + " 08:00:00").toString())

                // console.log(rawDate) // 27 Mar 2020
                // console.log(dateDate) // 2020-03-27T00:00:00.000Z
                // console.log('\n')

                await db.collection(newsCollection).doc(crypto.createHash('md5').update(resultJson[i].link).digest('hex')).set({
                    title: resultJson[i].title,
                    date: Date.parse(dateDate),
                    dateStr: dateDate.toDateString(),
                    article: resultJson[i].article,
                    link: resultJson[i].link,
                    source: "BIS"
                })
                    .then(function () {
                        touchedNewsCount++
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }
            console.log("BIS: updated ", touchedNewsCount, " news" )
            return touchedNewsCount
        } catch (err) {
            console.log('retrieve BIS news fail')
            console.log(err)
            return 0
        }

    } catch (err) {
        // Catch and display errors
        console.log(err);

        await browser.close();
        console.log("Browser Closed");
        return 0;
    }
}

// 10 news a page, need to click next page button to see more news
const getFCA = async (db) => {
    try {
        var touchedNewsCount = 0;
        var loadingNewsCount = 0;

        // var pagesToScrape = 20;
        var pagesToScrape = 5;
        var currentPage = 1;

        var browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        var newsPage = await browser.newPage();
        var contentViewer = await browser.newPage();

        // Open News page
        await newsPage.goto('https://www.fca.org.uk/news/search-results');  // set
        await newsPage.waitForSelector("ol.search-list");   // set

        // the resulting list of news
        var resultJson = []

        // Getting news's title, link and date info
        while (currentPage <= pagesToScrape) {

            resultJson = resultJson.concat(
                await newsPage.evaluate(() => {
                    var newsArr = document.querySelectorAll('li.search-item')   // set

                    var titles = document.querySelectorAll('a.search-item__clickthrough');  // set
                    var links = document.querySelectorAll('a.search-item__clickthrough');   // set
                    var dates = document.querySelectorAll('span.published-date')    // set

                    var newsArrJson = [];

                    for (var i = 0; i < newsArr.length; i++) {
                        newsArrJson.push({
                            title: titles[i].innerText.trim(),  // set
                            link: links[i].getAttribute("href"),    // set
                            date: dates[i].innerText.substring(11)  // set
                        });
                    }
                    return newsArrJson
                })
            )
            await newsPage.click('ul.pagination > li > a[aria-label="Next"]')   // set
            await newsPage.waitForSelector("ol.search-list");   // set
            currentPage++;
        }

        var article;
        var theArticle;

        // fill the article field for each news in the result json
        for (var i = 0; i < resultJson.length; i++) {
            console.log(++loadingNewsCount, '. loading: ', resultJson[i]['link'])
            await contentViewer.goto(resultJson[i]['link']);
            await contentViewer.waitForSelector("div.paragraphs-items");    // set
            article = await contentViewer.evaluate(() => {
                theArticle = document.querySelectorAll('div.paragraphs-items')  // set
                return theArticle[0].innerText.trim()
            })
            resultJson[i]['article'] = article
        }

        await browser.close();

        try {
            for (var i = 0; i < resultJson.length; i++) {

                let rawDate = resultJson[i].date
                let mm = rawDate.substr(3, 2)
                let dd = rawDate.substr(0, 2)
                let yyyy = rawDate.substr(6, 4)
                let dateDate = new Date(new Date(Date.UTC(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd))).toString())

                // console.log(rawDate)
                // console.log(dateDate)
                // console.log('\n')

                await db.collection(newsCollection).doc(crypto.createHash('md5').update(resultJson[i].link).digest('hex')).set({
                    title: resultJson[i].title,
                    date: Date.parse(dateDate),
                    dateStr: dateDate.toDateString(),
                    article: resultJson[i].article,
                    link: resultJson[i].link,
                    source: "FCA"
                })
                    .then(function () {
                        touchedNewsCount++
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }

            console.log("FCA: updated ", touchedNewsCount, " news" )
            return touchedNewsCount
        } catch (err) {
            console.log('retrieve FCA news fail')
            console.log(err)
            return 0;
        }

    } catch (err) {
        // Catch and display errors
        console.log(err);

        await browser.close();
        console.log("Browser Closed");
        return 0;
    }
}

// 10 news a page, need to click next page button to see more news
const getMAS = async (db) => {

    try {
        var touchedNewsCount = 0;
        var loadingNewsCount = 0;

        // var pagesToScrape = 20;
        var pagesToScrape = 1;
        var currentPage = 1;

        var browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
        var newsPage = await browser.newPage();
        var contentViewer = await browser.newPage();

        // Open MAS News page
        await newsPage.goto('https://www.mas.gov.sg/news');
        await newsPage.waitForSelector("li.mas-search-page__result");

        // the resulting list of news
        var resultJson = []

        // Getting news's title, link and date info
        while (currentPage <= pagesToScrape) {

            resultJson = resultJson.concat(
                await newsPage.evaluate(() => {
                    var newsArr = document.querySelectorAll('li.mas-search-page__result')

                    var titles = document.querySelectorAll('span.mas-link__text');
                    var links = document.querySelectorAll('a.ola-btn.ola-link.mas-link.mas-link--no-underline');
                    var dates = document.getElementsByClassName('mas-search-page__results-list')[0].getElementsByClassName("ts:xs");

                    var newsArrJson = [];

                    for (var i = 0; i < newsArr.length; i++) {
                        newsArrJson.push({
                            title: titles[i].innerText.trim(),
                            link: 'https://www.mas.gov.sg' + links[i].getAttribute("href"),
                            date: dates[i].innerText.substring(16)
                        });
                    }
                    return newsArrJson
                })
            )
            await newsPage.click('.ola-page.ola-page-next > a')
            await newsPage.waitForSelector("li.mas-search-page__result");
            currentPage++;
        }

        var article;
        var theArticle;

        // fill the article field for each news in the result json
        for (var i = 0; i < resultJson.length; i++) {
            console.log(++loadingNewsCount, '. loading: ', resultJson[i]['link'])

            await contentViewer.goto(resultJson[i]['link']);
            await contentViewer.waitForSelector("div.mas-section--items-container");
            article = await contentViewer.evaluate(() => {
                theArticle = document.querySelectorAll('div._mas-typeset.contain')
                return theArticle[0].innerText.trim()
            })
            resultJson[i]['article'] = article
        }

        await browser.close();

        try {

            for (var i = 0; i < resultJson.length; i++) {

                let rawDate = resultJson[i].date
                let dateDate = new Date(new Date(rawDate + " 08:00:00").toString())

                // console.log(rawDate)
                // console.log(dateDate)
                // console.log('\n')

                await db.collection(newsCollection).doc(crypto.createHash('md5').update(resultJson[i].link).digest('hex')).set({
                    title: resultJson[i].title,
                    date: Date.parse(dateDate),
                    dateStr: dateDate.toDateString(),
                    article: resultJson[i].article,
                    link: resultJson[i].link,
                    source: "MAS"
                })
                    .then(function () {
                        touchedNewsCount++
                    })
                    .catch(function (error) {
                        console.error("Error writing document: ", error);
                    });
            }

            console.log("MAS: updated ", touchedNewsCount, " news" )
            return touchedNewsCount;
        } catch (err) {
            console.log('retrieve MAS news fail')
            console.log(err)
            return 0;
        }

    } catch (err) {
        // Catch and display errors
        console.log(err);

        await browser.close();
        console.log("Browser Closed");

        return 0;
    }

}

module.exports = { getBIS, getFCA, getMAS }