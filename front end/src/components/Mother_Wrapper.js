import React, { Component } from 'react'
import NewsGroupWrapper from './News_Group_Wrapper'
import SearchEngine from './Search_Engine'
import Announcement from './Announcement'
import HomeTabWrapper from './HomeTabWrapper'
import SubscribingTabWrapper from './SubscribingTabWrapper'
import AdminTabWrapper from './AdminTabWrapper'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

var dateFormat = require('dateformat');

// const firebase = require("firebase");
const firebase = require('firebase/app');
require('firebase/firestore');

firebase.initializeApp({
    apiKey: "AIzaSyAXi_X5zUczfBRS4N2Jgh1fuiF29b9_r2U",
    authDomain: "fintech-scraping.firebaseapp.com",
    databaseURL: "https://fintech-scraping.firebaseio.com",
    projectId: "fintech-scraping",
});

var db = firebase.firestore();
let newsRef = db.collection('news');
// let newsRef = db.collection('newNews'); // for testing

// ******************* Set news source and keyword *******************
let sourceAllOptions = ['BIS', 'FCA', 'MAS'].sort()
let sourceLink = {
    'BIS': 'https://www.bis.org/list/press_releases/',
    'FCA': 'https://www.fca.org.uk/news/search-results',
    'MAS': 'https://www.mas.gov.sg/news'
}
let keywordAllOptions =
    [
        'api', 'ai',
        'fintech', 'fin tech', 'big data',
        'data', 'data connectivity', 'data centre',
        'data center', '5g', 'cbdc', 'technology', 'artificial intelligence',
        'digital', 'blockchain', 'block chain', 'colocation', 'co location',
        'regtech', 'suptech', 'reg tech', 'sup tech', 'open api', 'open-api', 'open banking'
    ].sort()

// *******************************************************************
keywordAllOptions = keywordAllOptions.map(k => { return k.toLowerCase() })

// ********************  Global function  ***************************

function findWord(word, str) {
    return RegExp('\\b' + word + '\\b').test(str)
}

class MotherWrapper extends Component {

    state = {
    }

    constructor(props) {
        super(props);
        // Initial state
        this.state = {
            sourceAllOptions: sourceAllOptions,
            keywordAllOptions: keywordAllOptions,
            newsList: {},
            newsIsLoading: true,

            // ******************* Config search engine default  *******************
            sourceValue: ['BIS', 'FCA', 'MAS'], // default
            sourceLink: sourceLink,
            dateSpecified: true, // default
            dateValue: [new Date(new Date().setDate(new Date().getDate() - 14)), new Date()], // default

            keywordIsSpecified: true, //default
            keywordValue: [
                'big data', 'data connectivity', 'data centre',
                'data center', '5g', 'cbdc', 'technology', 'digital',
                'regtech', 'suptech', 'reg tech', 'sup tech',
                'open api', 'open-api', 'open banking'], // default
            keywordSearchMode: 'OR',

            // *******************************************************************

        };

        this.updateSourceValue = this.updateSourceValue.bind(this);
        this.updateDateValue = this.updateDateValue.bind(this);
        this.updateKeywordValue = this.updateKeywordValue.bind(this);
        this.updateKeywordMode = this.updateKeywordMode.bind(this);
        this.updateKeywordIsSpecified = this.updateKeywordIsSpecified.bind(this);
    }

    componentDidMount() {
        this.queryUpdate()
    }

    queryUpdate() {
        if (this.state.sourceValue.length) {
            if (this.state.dateSpecified && this.state.dateValue.length) {
                let query = newsRef
                    .where('source', 'in', this.state.sourceValue)
                    .where('date', '>=', Number(this.state.dateValue[0]))
                    .where('date', '<=', Number(this.state.dateValue[1]))
                    .orderBy('date', 'desc')
                this.submitQueryAndRetrieveNewsList(query)
            } else {
                let query = newsRef
                    .where('source', 'in', this.state.sourceValue)
                    .orderBy('date', 'desc')

                this.submitQueryAndRetrieveNewsList(query)
            }
        } else {
            let query = newsRef
                .where('article', 'array-contains', 'Authority')

            this.submitQueryAndRetrieveNewsList(query)
        }
    }

    // ------------------- Keyword filtering -------------------
    filterByKeyword(newsList) {
        if (this.state.keywordIsSpecified) {
            if (this.state.keywordValue.length) {
                let filteredNewsList = []

                newsList.forEach(news => {
                    let textLow = news.title.toLowerCase() + ' ' + news.article.toLowerCase()
                    let keywordList = []
                    this.state.keywordValue.forEach(key => {
                        if(key.match(/[\u3400-\u9FBF]/)){
                            if (textLow.search(key) != -1) {
                                // old search method, substring in string
                                // use this method when chinese in keyword is recognized
                                keywordList.push(key)
                            }
                        }else{
                            // new search method, word in string
                            if (findWord(key, textLow)) {
                                keywordList.push(key)
                            }
                        }
                    
                    })

                    if (this.state.keywordSearchMode == "OR") {
                        // OR mode
                        if (keywordList.length) {
                            news['keywordList'] = keywordList
                            filteredNewsList.push(news)
                        }
                    } else {
                        // AND mode
                        if (keywordList.length == this.state.keywordValue.length) {
                            news['keywordList'] = keywordList
                            filteredNewsList.push(news)
                        }
                    }
                });

                return filteredNewsList

            } else {
                console.log("No keyword selected")
                return []
            }
        } else {
            console.log("No keyword filtering")
            return newsList
        }

    }
    // ----------------------------------------------------

    submitQueryAndRetrieveNewsList(query) {
        this.setState({
            newsIsLoading: true,
        });

        query.get()
            .then(snapshot => {
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

                newsList = this.filterByKeyword(newsList)

                let processedList = {}

                this.state.sourceValue.map((s, i) => {
                    processedList[s] = []
                })

                newsList.map((n, i) => {
                    processedList[n.source].push(n)
                })

                console.log("Processed news list.")

                this.setState({
                    newsIsLoading: false,
                    newsList: processedList
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);

                this.setState({
                    newsIsLoading: false,
                    newsList: []
                });
            });
    }

    updateSourceValue(value) {
        this.setState({
            sourceValue: value
        }, () => { this.queryUpdate() });
    }

    updateDateValue(value, isSpecified) {
        if (isSpecified) {
            this.setState({
                dateSpecified: isSpecified,
                dateValue: value,
            }, () => { this.queryUpdate() })
        } else {
            this.setState({
                dateSpecified: isSpecified,
                dateValue: value,
            }, () => { this.queryUpdate() });
        }
    }

    updateKeywordValue(value) {
        this.setState({
            keywordValue: value
        }, () => { this.queryUpdate() });
    }

    updateKeywordMode(value) {
        this.setState({
            keywordSearchMode: value
        }, () => { this.queryUpdate() });
    }

    updateKeywordIsSpecified(value) {
        this.setState({
            keywordIsSpecified: value
        }, () => { this.queryUpdate() });
    }

    render() {

        let { } = this.props;
        const { } = this.state;

        return (

            <div className="main-div-wrapper">

                <Switch>

                    <Route path="/admin">

                        <AdminTabWrapper
                
                        />

                    </Route>

                    <Route path="/subscribe">
                        <SubscribingTabWrapper
                            sourceValue={this.state.sourceValue}
                            sourceAllOptions={this.state.sourceAllOptions}

                            keywordIsSpecified={this.state.keywordIsSpecified}
                            keywordValue={this.state.keywordValue}
                            keywordAllOptions={this.state.keywordAllOptions}
                            db={db}
                        />
                    </Route>

                    <Route path="/">

                        <HomeTabWrapper
                            updateSourceValue={this.updateSourceValue}
                            updateDateValue={this.updateDateValue}
                            updateKeywordValue={this.updateKeywordValue}
                            updateKeywordMode={this.updateKeywordMode}
                            updateKeywordIsSpecified={this.updateKeywordIsSpecified}

                            sourceValue={this.state.sourceValue}
                            sourceAllOptions={this.state.sourceAllOptions}

                            keywordIsSpecified={this.state.keywordIsSpecified}
                            keywordValue={this.state.keywordValue}
                            keywordAllOptions={this.state.keywordAllOptions}

                            dateValue={this.state.dateValue}
                            dateSpecified={this.state.dateSpecified}

                            newsIsLoading={this.state.newsIsLoading}
                            sourceLink={this.state.sourceLink}
                            keywordSearchMode={this.state.keywordSearchMode}
                            newsList={this.state.newsList}

                        />

                    </Route>

                </Switch>

            </div >
        )

    }
}

export default MotherWrapper