import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'

export default function MyFunction() {
    const [news, set_news] = useState([])

    useEffect(() => {
        News()
    }, [])

    const News = async () => {
        const news = await Axios.get("https://coinpedia.org/wp-json/wp/v2/posts/?_fields=id,title,featured_image_sizes,author,yoast_head_json,date,tag_names,tags&categories=6&per_page=100&offset=0")
        if (news.data) {
            set_news(news.data)
        }
    }
    return (
        <div className='events_tables_content '>
        <div className='news_list_events'>
            {/* <h5>News</h5> */}
            <ul>
                {news.map((item) =>
                    <li>
                        <a href={item.yoast_head_json.canonical} target='_blank' alt="news" title={item.yoast_head_json.title}>
                        <p>{item.date ? moment(item.date).format("DD MMM YYYY") : "-"}</p>
                        <h4 dangerouslySetInnerHTML={{ __html: item.yoast_head_json.title }}></h4>
                        </a>
                    </li>
                )}
                {/* <li>
                              <p>23 Mar 2023</p>
                              <h4>Dogecoin Price Analysis: DOGE Price Dumps After a Short-Lived Rally – What Traders Can Expect Next?</h4>
                            </li> */}
            </ul>
        </div>
        </div>
    )
}