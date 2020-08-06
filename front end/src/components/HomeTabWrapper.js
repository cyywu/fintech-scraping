import React from 'react'
import Announcement from './Announcement'
import SearchEngine from './Search_Engine'
import NewsGroupWrapper from './News_Group_Wrapper'

const HomeTabWrapper = (props) => {

    return (
        <div>
            
            {/* <Announcement /> */}


            <SearchEngine
                updateSourceValue={props.updateSourceValue}
                updateDateValue={props.updateDateValue}
                updateKeywordValue={props.updateKeywordValue}
                updateKeywordMode={props.updateKeywordMode}
                updateKeywordIsSpecified={props.updateKeywordIsSpecified}

                sourceValue={props.sourceValue}
                sourceAllOptions={props.sourceAllOptions}

                keywordIsSpecified={props.keywordIsSpecified}
                keywordValue={props.keywordValue}
                keywordAllOptions={props.keywordAllOptions}

                dateValue={props.dateValue}
                dateSpecified={props.dateSpecified}
            />

            {
                props.sourceValue.map((n, i) => (
                    <NewsGroupWrapper
                        key={'newsGroupWrapper_' + i}
                        newsIsLoading={props.newsIsLoading}
                        source={n}
                        sourceLink={props.sourceLink[n]}
                        keywordValue={props.keywordValue}
                        keywordSearchMode={props.keywordSearchMode}

                        newsList={props.newsList[n]}
                    />

                ))
            }

        </div>
    )
}

export default HomeTabWrapper