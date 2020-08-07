// ------------------ Requiring external library ---------------------------
const express = require('express');
var cors = require('cors')
var crypto = require('crypto');
var dateFormat = require('dateformat');
var schedule = require('node-schedule');
const fs = require('fs');
const app = express();
app.use(cors())

// require function defined in ./function.js
const { getBIS, getFCA, getMAS } = require('./function')

// require secret in ./secret.js
const { gmail_secret, firebase_secret } = require('./secret')

// ---------------- Firebase set up -----------------------------
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(firebase_secret)
});

let db = admin.firestore();

// ---------------- Node Email set up -----------------------------
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: gmail_secret.id,
        pass: gmail_secret.pw
    }
});

// ----------------- Daily system auto task -------------------------------------
// Auto task template
// var <task name> = schedule.scheduleJob('<sec> <min> <hr> * * *', async function () {

//     var date = new Date()
//     console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
//     console.log("This is a system auto task\n")
//     console.log("Task: " + "<task name>\n")
//     console.log("Time: " + date.toString() + "\n")

//     try {
//         // --- the task ---
//         < do your task >
//     } catch (err) {
//         console.log("Err from < task name >:" + err)
//     }
// });

var updateNews = schedule.scheduleJob('0 0 8 * * *', async function () {

    var date = new Date()
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("This is a system auto task\n")
    console.log("Task: " + "updateNews\n")
    console.log("Time: " + date.toString() + "\n")

    try {
        // --- the task ---
        await updateFirebaseAll()
    } catch (err) {
        console.log("Err from updateNews:" + err)
    }
});

var sendEmail = schedule.scheduleJob('0 15 9 * * *', async function () {

    var date = new Date()
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~")
    console.log("This is a system auto task\n")
    console.log("Task: " + "sendEmail\n")
    console.log("Time: " + date.toString() + "\n")

    try {
        // --- the task ---
        await sendTheEmail(null, null);
    } catch (err) {
        console.log("Err from sendEmail:" + err)
    }
});

// ---------------- Cloud Firestore -----------------------------
function deleteQueryBatch(db, query, resolve, reject) {
    query.get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            // Delete documents in a batch
            let batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });

            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }

            // Recurse on the next process tick, to avoid
            // exploding the stack.
            process.nextTick(() => {
                deleteQueryBatch(db, query, resolve, reject);
            });
        })
        .catch(reject);
}

async function updateFirebaseAll() {
    console.log('start function: ', 'updateFirebaseAll')

    await getBIS(db).then(() => { console.log("BIS finished") })
    await getFCA(db).then(() => { console.log("FCA finished") })
    await getMAS(db).then(() => { console.log("MAS finished") })

    console.log("updateFirebaseAll finished")
}

app.get('/updateFirebaseAll', async (req, res) => {
    await updateFirebaseAll()
    res.send('All news updated into firebase');
    return;
})

app.get('/removeAllNewsFromBIS', async (req, res) => {

    deleteQueryBatch(
        db,
        db.collection("news").where('source', '==', 'BIS'),
        () => { res.send("Deleted news from BIS") },
        () => { res.send("Fail deleting news from BIS") }
    )
})

app.get('/removeAllNewsFromFCA', async (req, res) => {

    deleteQueryBatch(
        db,
        db.collection("news").where('source', '==', 'FCA'),
        () => { res.send("Deleted news from FCA") },
        () => { res.send("Fail deleting news from FCA") }
    )
})

app.get('/removeAllNewsFromMAS', async (req, res) => {

    deleteQueryBatch(
        db,
        db.collection("news").where('source', '==', 'MAS'),
        () => { res.send("Deleted news from MAS") },
        () => { res.send("Fail deleting news from MAS") }
    )
})

app.get('/checkNewsCount', async (req, res) => {

    var count = {}
    var returnMsg = ""
    db.collection("news").get()
        .then((snapshot) => {
            // When there are no documents left, we are done
            if (snapshot.size === 0) {
                return 0;
            }

            snapshot.docs.forEach((doc) => {
                if (doc.data().source in count) {
                    count[doc.data().source] += 1
                } else {
                    count[doc.data().source] = 1
                }
            });

        }).then(() => {
            Object.keys(count).forEach(function (source) {
                returnMsg = returnMsg + "<h3>" + source + ':\t' + count[source] + '</h3>'
            });
            res.send(returnMsg);
        })
        .catch((err) => {
            console.log(err);
        });
})
// ---------------- Send Email -----------------------------

function findWord(word, str) {
    // findWord('api', 'capital')     false
    // findWord('api', 'xxxx api xxxx') true
    // findWord('api', 'xxxx api, xxx') true
    // findWord('api', 'xxxx .api xxx') true
    // findWord('api', 'xxxx-api-xxx xxx') true
    return RegExp('\\b' + word + '\\b').test(str)
}

function filterAndCategorizeBySource(newsList, sourceList, sourceIsSpecified) {

    let processedList = {}
    let newsToSendCount = 0

    if (sourceIsSpecified) {
        // if specified what source to look for
        sourceList.forEach(source => {
            // make the processedList be in structure like {'MAS':[], 'CNN':[] }
            processedList[source] = []
        })

        newsList.map((n, i) => {
            if (sourceList.includes(n.source)) {
                // push news into processedList only when the source matched user's interest
                processedList[n.source].push(n);
                newsToSendCount++;
            }
        })
    } else {
        // if not specified what souce to look for, see all the source 
        newsList.map((n, i) => {

            if (!(processedList[n.source])) {
                // make the processedList be in structure like {'MAS':[], 'CNN':[], ... }
                processedList[n.source] = []
            }

            processedList[n.source].push(n);
            newsToSendCount++;

        })
    }

    // return number of news pushed as well as the list itself
    return { newsToSendCount, processedList }
}

function filterByKeyword(newsList, keywordList, keywordSearchMode) {

    let filteredNewsList = []

    newsList.forEach(news => {
        // make the whole text to lower case first
        let textLow = news.title.toLowerCase() + ' ' + news.article.toLowerCase()
        let keywordMatchList = []

        keywordList.forEach(key => {

            if (key.match(/[\u3400-\u9FBF]/)) {
                // when the keyword contain chinese

                // old search method, substring in string, we need to match '人工智能' to 'xxx使用人工智能xxx'
                if (textLow.search(key) != -1) {
                    keywordMatchList.push(key)
                }
            } else {
                // when the keyword contain only english

                // new search method, word in string, we do not want to match 'ai' to 'paid'
                if (findWord(key, textLow)) {
                    keywordMatchList.push(key)
                }
            }

        })
        if (keywordSearchMode == 'AND') {
            // AND moden require match all the keyword
            if (keywordMatchList.length == keywordList.length) {
                news['keywordList'] = keywordMatchList
                filteredNewsList.push(news)
            }
        } else {
            // OR node, require match at least one keyword 
            if (keywordMatchList.length) {
                news['keywordList'] = keywordMatchList
                filteredNewsList.push(news)
            }
        }

    });

    return filteredNewsList
}

function sendTheEmail(specifiedPeriod, specifiedEmail) {
    let fromDate = new Date()

    if (!(specifiedPeriod == null)) {
        fromDate.setDate(fromDate.getDate() - specifiedPeriod)
    } else {
        fromDate.setDate(fromDate.getDate() - 2)
    }

    fromDate.setMilliseconds(0)
    fromDate.setSeconds(0)
    fromDate.setMinutes(0)
    fromDate.setHours(0)

    // retrieve all news that published later than 'fromDate' from Cloud Firestore
    db.collection("news")
        .where('date', '>', Number(fromDate))
        .orderBy('date', 'desc')
        .get().then((snapshot) => {

            var newsList = []
            snapshot.forEach(doc => {
                newsList.push({
                    'source': doc.data().source,
                    'title': doc.data().title,
                    'date': doc.data().dateStr,
                    'article': doc.data().article,
                    'link': doc.data().link,
                })
            });

            console.log("Retrieved news list.")

            // if html url specific which email to send, send only to that email
            let subscriptionRef = null
            if (!(specifiedEmail == null)) {
                subscriptionRef = db.collection('subscriptions').where('email', '==', specifiedEmail)
            } else {
                subscriptionRef = db.collection('subscriptions')
            }

            // retrieve the list of subscription order
            subscriptionRef.get()
                .then(snapshot => {
                    var subscriptionList = []
                    snapshot.forEach(doc => {
                        subscriptionList.push({
                            'email': doc.data().email,
                            'keywordList': doc.data().keywordList,
                            'sourceList': doc.data().sourceList,
                            'keywordSearchMode': doc.data().keywordSearchMode,
                            'keywordIsSpecified': doc.data().keywordIsSpecified,
                            'sourceIsSpecified': doc.data().sourceIsSpecified,
                            'option': doc.data().option
                        })
                    });

                    console.log("Retrieved subscriptionList list.")

                    // for each subscription
                    subscriptionList.forEach(subscription => {

                        if (subscription.option == "Subscribe") {
                            // opt in case

                            // filter the news list by keyword
                            let thisNewsList = subscription.keywordIsSpecified ? filterByKeyword(newsList, subscription.keywordList, subscription.keywordSearchMode) : newsList

                            // filter and categorize those news by source name
                            let { newsToSendCount, processedList } = filterAndCategorizeBySource(thisNewsList, subscription.sourceList, subscription.sourceIsSpecified)

                            // send an email only when there are latest news that match user's interested
                            if (newsToSendCount) {

                                // make a json file store all the news that are about to be sent to this particular user,
                                // dailyBriefEmailHtml will read this json file later
                                var jsonContent = JSON.stringify(processedList);
                                fs.writeFile("./dailyBriefJson/dailyBrief_" + subscription.email + ".json", jsonContent, 'utf8', function (err) {
                                    if (err) {
                                        console.log("An error occured while writing JSON Object to File.");
                                        console.log("\n" + err);
                                        return

                                    }
                                });

                                // set the email option
                                let mailOptions = {
                                    from: 'Web Scraping <ffo201920@gmail.com>',
                                    to: subscription.email,
                                    subject: 'Daily brief',
                                    // we send the email in a HTML format. 
                                    // Pass all the parameter to http://localhost:4000/dailyBriefEmailHtml ,
                                    // it will generate the HTML that you need
                                    html: ({
                                        path: 'http://localhost:4000/dailyBriefEmailHtml?'
                                            + 'email='
                                            + subscription.email
                                            + '&keywordIsSpecified='
                                            + subscription.keywordIsSpecified.toString()
                                            + '&sourceIsSpecified='
                                            + subscription.sourceIsSpecified.toString()
                                            + '&sourceList='
                                            + (subscription.sourceList.length ? subscription.sourceList.join(', ') : "You are not subscribing to any news source")
                                            + '&keywordList='
                                            + subscription.keywordList.join(', ')
                                            + '&period='
                                            + fromDate.toString().slice(4, 15)
                                            + '&keywordSearchMode='
                                            + subscription.keywordSearchMode
                                    })
                                };

                                // send out the email
                                transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {
                                        console.log("Error, search \"transporter.sendMail\" :", error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });

                                console.log(subscription.email, " subscribed, email sent.")

                            } else {
                                console.log(subscription.email, " subscribed, but nothing new.")
                            }

                        } else {
                            // opt out case
                            console.log(subscription.email, " unsubscribed.")
                        }

                    })

                })
                .catch(err => {
                    console.log(err)

                });

            return

        })
        .catch(function (error) {
            console.error("send email fail");
            console.error("\n" + error);
            return
        });

    return

}

app.get('/dailyBriefEmailHtml', async (req, res) => {

    let email = req.query.email
    let keywordList = req.query.keywordList
    let period = req.query.period
    let keywordIsSpecified = req.query.keywordIsSpecified
    let sourceIsSpecified = req.query.sourceIsSpecified
    let sourceList = req.query.sourceList
    let keywordSearchMode = req.query.keywordSearchMode
    let jsonContent = req.query.jsonContent

    res.write('<html><head></head><body>');

    var today = dateFormat(new Date(), "dd mmm, yyyy");

    // header part of the email
    res.write('<h2>' + today + '</h2>');
    res.write('<h2>Web Scraper Daily Report</h2>');
    res.write('<span>According to the topics you have subscribed to <a href=\"https://fintechscraper.firebaseapp.com/\">fintechscraper</a>,</span><br>');
    res.write('<span>please find latest news highlights for your information attached below.</span><br>');

    // display user's options: source
    res.write('<span><h4 style="margin-bottom: 0px">Source:</h4>');
    if (sourceIsSpecified == 'true') {
        res.write(sourceList)
    } else {
        res.write('Not specified')
    }
    res.write('</span>');

    // display user's options: topic
    res.write('<span><h4 style="margin-bottom: 0px">Topic subscribed:</h4> ');
    if (keywordIsSpecified == 'true') {
        res.write('[');
        res.write(keywordSearchMode)
        res.write('] ');
        res.write(keywordList)
    } else {
        res.write('Not specified')
    }
    res.write('</span>');

    // display period
    res.write('<span><h4 style="margin-bottom: 0px">Period:</h4>From ' + period + '</span>')
    res.write('<hr>');

    // display latest news
    let dailyBriefRaw = fs.readFileSync('./dailyBriefJson/dailyBrief_' + email + '.json');
    let dailyBriefJson = JSON.parse(dailyBriefRaw);

    Object.keys(dailyBriefJson).forEach(function (source) {

        // will display thpse news source by souce
        if (dailyBriefJson[source].length) {
            res.write("<h3 id='" + source + "'>" + source + "</h3><ul>");

            dailyBriefJson[source].forEach((news, index) => {
                res.write(
                    "<li id='"
                    + source
                    + index.toString()
                    + "'>"
                    + news.date
                    + " <span style='margin-right:10px;'></span> ")

                if (news.keywordList && news.keywordList.length) {
                    res.write("[")
                    res.write(news.keywordList.join(', '))
                    res.write("]<span style='margin-right:10px;'></span>")
                }

                res.write(
                    "<a href=\""
                    + news.link
                    + "\">"
                    + "link"
                    + "</a>"
                    + "<br />"
                    + news.title);
                res.write("</li><br />")
            })

            res.write("</ul><hr>")
        }
    });
    res.end('</body></html>');
})

app.get('/sendDailyBriefEmail', async (req, res) => {

    // url parameter
    // req.query.specifiedEmail: if not specified, will send email to all subsription found in the database
    // req.query.specifiedPeriod: if not specified, will look for news published from 2 days ago

    if (!(req.query.specifiedPeriod == null)) {
        console.log('Send Email with specified period: ' + req.query.specifiedPeriod)
    }

    if (!(req.query.specifiedEmail == null)) {
        console.log('Send Email with specified address: ' + req.query.specifiedEmail)
    }

    sendTheEmail(req.query.specifiedPeriod, req.query.specifiedEmail)
    res.send('sendDailyBriefEmail done');

})

// ---------------- Debug -----------------------------
app.get('/debug', async (req, res) => {
    if (req.query.email != null) {
        console.log(req.query.email)
        console.log()
    } else {
        console.log('no para')
    }

    res.send(req.query.email)
})

app.listen(4000);

// 07 Aug 2020, trying to delete all the HK01 news from the data base
db.collection("news").where('source', '==', 'HK01').get()
    .then((snapshot) => {
        // When there are no documents left, we are done
        console.log('snapshot.size: ', snapshot.size)
        
        snapshot.docs.forEach((doc) => {
            db.collection("news").doc(doc.id).delete().then(function () {
                console.log("Document successfully deleted!");
            }).catch(function (error) {
                console.error("Error removing document: ", error);
            });
        });
    })