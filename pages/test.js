import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import moment from 'moment'
import Web3 from 'web3'  
// import Select from 'react-select'
import { useRouter } from 'next/navigation'

export default function Companies({user_token, config, userAgent})
{ 
    const router = useRouter()
    const myRef = useRef(null)
    // const { active_category_tab } = router.query
    const active_category_tab =''
    const [tokens_list, set_tokens_list] = useState([]) 
    const [voting_ids, setvoting_ids] = useState([])  // commented
    const [watchlist, set_watchlist] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [per_page_count, set_per_page_count] = useState(50)
    const [pageCount, setPageCount] = useState(0)
    const [sl_no, set_sl_no]=useState(0)
    const [firstcount, setfirstcount] = useState(1)
    const [finalcount, setfinalcount] = useState(per_page_count)
    const [selectedPage, setSelectedPage] = useState(0) 
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
    const [count, setCount]=useState(0)
    const [voting_status, set_voting_status] = useState(false)
    const [loader_status, set_loader_status] = useState(false)
    const [handleModalVote, setHandleModalVote] = useState(false)
    const [total_votes, set_total_votes] = useState()
    const [token_id, set_Token_id] = useState("")
    const [vote_id, set_vote_id] = useState("")
    const [item, set_item] = useState("")
    const [voting_message, set_voting_message] = useState("")
    const [all_tab_status, set_all_tab_status] = useState((active_category_tab > 0) ? 0 : 1)
    const [watchlist_tab_status, set_watchlist_tab_status] = useState("")
    const [search_title, set_search_title] = useState("")  

    const [category_list, set_category_list] = useState([]) 
    const [other_category_list, set_other_category_list] = useState([])
    const [category_name, set_category_name] = useState("")
    const [category_row_id, set_category_row_id] = useState((active_category_tab > 0) ? active_category_tab : "") 
    
    const [business_tab_status, set_business_tab_status] = useState((active_category_tab > 0) ? 2 :"")
    
    useEffect(()=>
    {  
        tokensList()
    },[]) 


    const tokensList = async () =>
    {  

    }
   
 
return (
    
   <>
      <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>Trending Categories on Coinpedia Markets</title>
         <meta name="description" content="Discover the trending categories today on Coinpedia markets, sorted as per the search volume, most views of the news, and market behavior."/>
         <meta name="keywords" content="Trending categories, top trending crypto categories, trending crypto categories, meme, defi, blockchain, AI, DAO, Dapps, web3 gaming, exchange coinpedia markets, bitcoin price, Ethereum price, live prices, top gainers in crypto, top losers crypto, trending coins, meme coins, defi coins, crypto price prediction, crypto price analysis." />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Trending Categories on Coinpedia Markets" />
         <meta property="og:description" content="Discover the trending categories today on Coinpedia markets, sorted as per the search volume, most views of the news, and market behavior." />
         <meta property="og:url" content={market_coinpedia_url + "categories/"} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="Trending Categories on Coinpedia Markets" />
         <meta name="twitter:description" content="Discover the trending categories today on Coinpedia markets, sorted as per the search volume, most views of the news, and market behavior." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url + "categories/"}/>
         <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Categories"}`,
          }}
        />

        <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "http://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Cryptocurrencies",
                  "item": "https://markets.coinpedia.org/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Categories",
                  "item": "https://markets.coinpedia.org/categories/"
                }
              ]
            }`,
          }}
        />
      </Head>

      {/* <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}> */}
      <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}>
      <div className="market-page">


   
            asfasdf
          </div>
    </div>
</>
)
} 

export async function getServerSideProps({req}) 
{
   const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
   var user_token = userAgent.user_token ? userAgent.user_token : ""

  return { props: {userAgent:userAgent, config:config(user_token), user_token:user_token}}
}