import React, { Component } from 'react'
import NewsItem from './News_Item'
import SyncLoader from "react-spinners/SyncLoader";

class NewsGroupWrapper extends Component {

    state = {

    }

    constructor(props) {
        super(props);

        // Initial state
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {

        let { newsIsLoading, newsList, source, sourceLink, keywordValue, keywordSearchMode } = this.props;

        let listOfNews = !newsIsLoading && newsList ?
            (
                <div className="news-items-wrapper">
                    {
                        newsList.map((n, i) => (
                            <NewsItem
                                key={"newsitem_" + source + '_' + i}
                                article={n.article}
                                link={n.link}
                                date={n.date}
                                title={n.title}
                                keywordList={n.keywordList}
                            />
                        ))
                    }
                </div>
            ) : (
                <div className="loading">
                    <SyncLoader
                        size={15}
                        margin={2}
                        color={"#36D7B7"}
                        loading={this.state.loading}
                    />
                </div>

            );

        return (
            <div className="news-mother-cell">

                <div className="wrapper">

                    {/* source */}
                    <div className="source">
                        <a href={sourceLink} target="_blank">
                            <h3>{source}</h3>
                        </a>
                    </div>

                    {listOfNews}

                </div>

            </div>
        )

    }
}

export default NewsGroupWrapper