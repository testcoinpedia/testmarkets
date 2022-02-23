import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
import ReactPaginate from 'react-paginate'; 
import Head from 'next/head';
import cookie from "cookie"
import Axios from 'axios'
import moment from 'moment'
import TableContentLoader from '../components/loaders/tableLoader'
import { API_BASE_URL, config, separator, website_url, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY,count_live_price} from '../components/constants'; 
var $ = require( "jquery" );

export default function Home({config, user_token}) 
{   
  const [watchlist, set_watchlist] = useState([])
  const [api_loader_status, set_api_loader_status] = useState(false)
  const [image_base_url] = useState(IMAGE_BASE_URL + '/tokens/')
  useEffect(()=>
  {  
   getWatchlist()
  }, [])

  const getWatchlist = () =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/list/", config).then(res=>
    { 
      set_api_loader_status(true)
      if(res.data.status)
      {
        set_watchlist(res.data.message)
      }
    })
  }


  const removeFromWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config)
    .then(res=>
    {
      if(res.data.status)
      {
        getWatchlist()
      }
    })
  }

  const makeJobSchema=()=>
  {  
      return { 
          "@context":"http://schema.org/",
          "@type":"Table",
          "name":"Coinpedia",
          "url":website_url,
          "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
          "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        }  
  } 

  return(
    <>
      <Head>
        <title>Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market cap, price charts, historical data and More. Bitcoin, Altcoin, DeFi tokens and NFT tokens. " />
        <meta name="keywords" content="Cryptocurrency Market , cryptocurrency market sentiments ,Crypto market insights , Cryptocurrency Market Analysis , NFT Price today, Defi token Price ,  Top crypto gainers, top crypto losers , Cryptocurrency market, Cryptocurrency Live  market Price, NFT Live Chart , Cryptocurrency analysis tool." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market cap, price charts, historical data and More. Bitcoin, Altcoin, DeFi tokens and NFT tokens. " />
        <meta property="og:url" content={website_url} />
        <meta property="og:site_name" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap" />
        <meta property="og:image" itemprop="thumbnailUrl" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="730" />
        <meta property="og:image:height" content="411" />  
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap" />
        <meta name="twitter:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market cap, price charts, historical data and More. Bitcoin, Altcoin, DeFi tokens and NFT tokens. " />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 
        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="canonical" href={website_url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
    <div className="page new_markets_index min_height_page">
      <div className="market-page">

          <div className="container">
            <div className="col-md-12">
              

              {/* <div className="">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <p className="companies_found">{total_tokens_count} Tokens Found</p>
                </div>
              </div>
              </div> */}



              <div className="prices transaction_table_block">
                <div className="row">
                  <div class="col-md-6 col-7">
                  <ul class="category_list">
                      <li><Link href={'/'}><a> All</a></Link></li>
                      <li  class="active_tab"><Link href={'/watchlist'}><a><img src="/assets/img/wishlist_star.svg"/> Watchlist</a></Link></li>
                    </ul>
                  </div>

                  <div class="col-md-6 col-5">
                  </div>

                </div>
                <div className="market_page_data">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                          <tr>
                            <th className="" style={{minWidth: '34px'}}></th>
                            <th className="">#</th>
                            <th className="">Name</th>
                            <th className="table_token">Live Price</th>
                            <th className="table_token">Token Type</th>
                            <th className="table_max_supply">Max Supply</th> 
                            <th className="mobile_hide table_circulating_supply">Market Cap</th>  
                          </tr>
                      </thead>
                      <tbody>
                        {
                          api_loader_status ?
                          <>
                          {
                          watchlist.length > 0
                          ?
                          watchlist.map((e, i) => 
                          <tr key={i}>
                                <td>
                                {
                                  user_token ?
                                  <>
                                  <span onClick={()=>removeFromWatchlist(e.token_row_id)} ><img src="/assets/img/wishlist_star_selected.svg" /></span>
                                  </>
                                  :
                                  <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a><img src="/assets/img/wishlist_star.svg" /></a></Link>
                                }
                                </td>
                                
                                <td>
                                  {i+1}
                                </td>
                                <td>
                                  <Link href={"/"+e.token_id}>
                                    <a>
                                    <div className="media">
                                      <div className="media-left">
                                        <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                      </div>
                                      <div className="media-body">
                                        <h4 className="media-heading">{e.token_name} <span>{e.symbol.toUpperCase()}</span></h4>
                                      </div>
                                    </div> 
                                    </a>
                                  </Link>
                                </td> 
                                {/* <td>{e.price === null? "-":"$"+ Number(e.price).toFixed(2)}</td> */}
                                {/* <td>
                                  <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span>
                                </td> */}
          
                                <td className="market_list_price"> 
                                  <Link href={"/"+e.token_id}>
                                    <a>
                                    <span className="block_price">{e.price?"$":null}{e.price?count_live_price(e.price):"-"}</span>
                                      {/* <span className="block_price">{e.price?"$":null}{e.price?parseFloat((e.price).toFixed(9)):"-"}</span> */}
                                      <br/>
                                      {e.price_updated_on ? moment(e.price_updated_on).fromNow():null} 
                                    </a>
                                    </Link>
                                </td>
                                <td> 
                                  <Link href={"/"+e.token_id}>
                                    <a>
                                    {
                                        e.contract_addresses.length > 0
                                        ?
                                          e.contract_addresses[0].network_type === "1" ? "ERC20" : "BEP20" 
                                        // e.contract_addresses.map((ca)=>
                                        //   parseInt(ca.network_type) === 1 ? "ERC20" : "BEP20" 
                                        //)
                                        :
                                        null
                                      } 
                                    </a>
          
                                    </Link>
                                </td>
                                <td>
                                  <Link href={"/"+e.token_id}>
                                    <a>
                                      {e.total_max_supply ? separator(e.total_max_supply) : "-"} 
                                    </a>
                                  </Link>
                                </td>
          
                                <td className="mobile_hide">
                                  <Link href={"/"+e.token_id}><a>
                                    {e.market_cap ?separator(e.market_cap.toFixed(2)) : "-"}
                                  </a></Link>
                                </td>  
                          </tr> 
                          ) 
                          :
                          <tr >
                            <td className="text-center" colSpan="7">
                                Sorry, No related data found.
                            </td>
                          </tr>
                        }
                          </>
                          :
                          ""
                        } 
                      </tbody>
                    </table>
                  </div>
                </div> 
              </div>
            </div>
          </div>
      </div>
    </div>
    </>
  )
}



export async function getServerSideProps({query, req}) 
{ 
   const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
   if(userAgent.user_token)
   {
      return { props: {userAgent:userAgent, config:config(userAgent.user_token), user_token:userAgent.user_token}}
   }
   else
   {
      return {
        redirect: {
          destination: app_coinpedia_url+'login',
          permanent: false,
        }
      } 
   }
}
