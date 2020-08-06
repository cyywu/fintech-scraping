import React from 'react'

const NewsItem = (props) => {
    const { article, link, date, title, keywordList } = props


    // if (keywordList){
    //     console.log('yes')
    //     console.log(keywordList)
    //     console.log(keywordList.join(', '))
    // } else{
    //     console.log('no')
    //     console.log(keywordList)
    // }

    let keywordDiv = keywordList?(
        <div className="keyword-list">
            [ {keywordList.join(', ')} ]
        </div>
    ):(
        <div>

        </div>
    )

    return (

        <div className='news-item-wrapper'>
            {/* date */}
            <div className='news-item-date'>
                {date}
            </div>

            {/* title */}
            {/* tag */}
            {/* link */}
            <div className='news-item-info'>
                <div style={{textAlign:'left'}}>{title} <br /> {keywordDiv}</div>
                
                <br />
                <a href={link} target="_blank" rel="noopener noreferrer"> link </a>
                
            </div>

            {/* content */}
            <div className='news-item-article'>
                {   
                    article?
                    article.length > 500?article.substr(0,499)+'...':article:""
                }
            </div>
        </div>
    )
}

export default NewsItem