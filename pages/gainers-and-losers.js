import React, {useEffect, useState} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import CategoriesTab from '../components/categoriesTabs'
import Search_Contract_Address from '../components/searchContractAddress'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import WatchList from '../components/watchlist'
 
export default function GainersLosers({user_token, config, userAgent})
{  
    const [watch_list_status, set_watch_list_status] = useState(false)
    const [watchlist, set_watchlist] = useState([])
    const [image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
    const [loader_status, set_loader_status]=useState(true)
    const [all_tab_status, set_all_tab_status] = useState(0)
    const [top_gainers, set_top_gainers] = useState([])
    const [top_loosers, set_top_loosers] = useState([])
    const [search_title, set_search_title] = useState("")  
    const [currentPage, setCurrentPage] = useState(0)
    const [per_page_count, set_per_page_count] = useState(100)
    const [pageCount, setPageCount] = useState(0)
    const [sl_no, set_sl_no]=useState(0)
    const [firstcount, setfirstcount] = useState(1)
    const [finalcount, setfinalcount] = useState(per_page_count)
    const [count, setCount]=useState(0)

    useEffect(() => 
    { 
        topGainners()
        topLosers()
        watchListIds()
    }, [search_title, watch_list_status])
    //cryptocurrency/gainers/40

    //cryptocurrency/losers/40

    const topGainners=  async()=>
    {
        set_loader_status(false)
        Axios.get(API_BASE_URL+"markets/cryptocurrency/gainers/40", config).then(response => 
        {
            set_loader_status(true)
            console.log("Gainers",response.data.message)   
            if(response.data.status === true)
            { 
                // var gainersArr = []
                // for(var i of response.data.message.order_by_gainer) 
                // {
                //     if(i.usd_24h_change > 0)
                //     {
                //         gainersArr.push(i)
                //     }
                // }
                set_top_gainers(response.data.message)

                // var looserArr = []
                // for(var i of response.data.message.order_by_looser) 
                // {
                //     if(i.usd_24h_change < 0)
                //     {
                //         looserArr.push(i)
                //     }
                // }
                // set_top_loosers(looserArr)
            }
        })
    }

    const topLosers=  async()=>
    {
        set_loader_status(false)
        Axios.get(API_BASE_URL+"markets/cryptocurrency/losers/40", config).then(response => 
        {
            set_loader_status(true)
            console.log("losers",response.data.message)   
            if(response.data.status === true)
            { 
                // var gainersArr = []
                // for(var i of response.data.message.order_by_gainer) 
                // {
                //     if(i.usd_24h_change > 0)
                //     {
                //         gainersArr.push(i)
                //     }
                // }
                // set_top_gainers(gainersArr)

                // var looserArr = []
                // for(var i of response.data.message.order_by_looser) 
                // {
                //     if(i.usd_24h_change < 0)
                //     {
                //         looserArr.push(i)
                //     }
                // }
                set_top_loosers(response.data.message)
            }
        })
    }

    const watchListIds = () =>
    {
        Axios.get(API_BASE_URL+"markets/tokens/watchlist_ids", config).then(res=>
        { 
            if(res.data.status)
            {
                set_watchlist(res.data.message)
            }
        })
    }

    const addToWatchlist = (param_token_id) =>
    {
        Axios.get(API_BASE_URL+"markets/token_watchlist/add_to_watchlist/"+param_token_id, config).then(res=>
        { 
            if(res.data.status)
            {
                var sdawatchlist = watchlist
                set_watchlist([])
                sdawatchlist.push(param_token_id)
                set_watchlist(sdawatchlist)
            }
        })
    }
    
    const removeFromWatchlist = (param_token_id) =>
    {
        Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config).then(res=>
        {
            if(res.data.status)
            {
                var sdawatchlist = watchlist
                set_watchlist([])
                sdawatchlist.splice(sdawatchlist.indexOf(param_token_id), 1)
                set_watchlist(sdawatchlist)
            }
        })
    }

    const makeJobSchema=()=>{  
        return { 
            "@context":"http://schema.org/",
            "@type":"Organization",
            "name":"Coinpedia",
            "url":"https://markets.coinpedia.org",
            "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
            "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        }  
    }

    return (
    
    <>
        <Head>
        <title>Cryptocurrency Market Live Insights | Coinpedia </title>
        <meta name="description" content="Coinpedia’s Market bring you with a list of top cryptocurrencies with real timeprices, including percentage change, charts, history, volume and more."/>
        <meta name="keywords" content="crypto market, crypto market tracker, Crypto tracker live, Cryptocurrency market, crypto market insights , Live crypto insights, crypto price alerts, Live crypto alerts." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Live Insights | Coinpedia" />
        <meta property="og:description" content="Coinpedia company listing page offers quick view of all listed companies of Fintech, Blockchain and Finance category. Get Exchages, Wallets, Coins, Tools, Trading forms and more. " />
        <meta property="og:url" content={market_coinpedia_url} />
        <meta property="og:site_name" content="List of Fintech Companies | CoinPedia Pro Account. " />
        <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Cryptocurrency Market Live Insights | Coinpedia" />
        <meta name="twitter:description" content="Here's a list of the leading fintech companies in the country across the various sub-sectors.We are extending and updating the list regularly." />
        <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="canonical" href={market_coinpedia_url}/>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
        </Head>

        <div className="page new_markets_index min_height_page markets_new_design">
            <div className="market-page">
                <div className="new_page_title_block">
                    <div className="container">
                        <div className="col-md-12">
                            <div className="row market_insights ">
                            <div className="col-md-6 col-lg-6">
                                <h1 className="page_title">Cryptocurrency Live Prices</h1>
                                {/* by Market Cap */}
                                <p>Global market cap today: $ 1.38 trillion <img src="/assets/img/markets/high-value.png" alt="high value"/><span class="color-green">10.02%</span> in 24 hrs.</p>
                                </div>
                            <div className="col-md-1 col-lg-2"></div>
                            <div className="col-md-5 col-lg-4">
                                {
                                    <Search_Contract_Address /> 
                                }
                            </div>
                        </div>
                            <div>
                        <div class="all-categories-list">
                            <CategoriesTab active_tab={2}/> 
                    </div>
                    </div>
                    </div>
                </div>
            </div>
       
         <div className="container price-tracking-tbl">
            <div className="col-md-12">
                {/* {
                   <CategoriesTab /> 
                }  */}
                           

                <div className="prices transaction_table_block">
                    <div className="row">
                        <div className="col-md-9 mb-3 col-7">
                            <ul className="category_list">
                            {
                                    user_token?
                                    <li ><Link href={app_coinpedia_url+"watchlist/?active_watchlist_tab=2"}><a><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/> Watchlist</a></Link></li>
                                    :
                                    <li>
                                    <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a onClick={()=> Logout()}><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/> Watchlist</a></Link>
                                    </li>
                                }
                                <li>
                                    <Link href={app_coinpedia_url}><a><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160228/menu-wallet.svg" alt="Portfolio" width={20} height={20} /> Portfolio</a></Link>
                                </li>
                                <li>|</li>
                                <li className={all_tab_status == 0?"active_tab":null}><a onClick={()=>set_all_tab_status(0)}>Gainers</a></li>
                                <li className={all_tab_status == 1?"active_tab":null}><a onClick={()=>set_all_tab_status(1)}>Losers</a></li>
                               
                            
                            </ul>
                        </div>
                        <div className="col-md-3 mb-3 col-5 filter-category-section">
                        <div className="row">
                            
                            <div className="col-md-12 ">
                                <div className="input-group search_filter">
                                    <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Token By Name" />
                                    <div className="input-group-prepend ">
                                        <span className="input-group-text" ><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                                    </div>
                                </div> 
                            </div>
                           
                        </div>
                         
                        
                       
                        </div>     
                    </div>
                    {
                        watch_list_status?
                        <WatchList config={config} user_token={user_token}/> 
                        :
                        <div className="market_page_data">
                            <div className="table-responsive">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr>

                                        <th className="mobile_hide_table_col" style={{minWidth: '34px'}}></th>
                                        <th className="mobile_hide_table_col"style={{minWidth: '34px'}}>Rank</th>
                                        <th className="">Name</th>
                                        <th className="">Price</th>
                                        <th className="" style={{minWidth: 'unset'}}>24h</th>
                                        <th className=" mobile_hide_table_col">Volume(24H)</th>  
                                        <th className="mobile_hide_table_col table_circulating_supply">Circulating Supply</th>  
                                            {/* <th className="" style={{minWidth: '34px'}}></th>
                                            <th className="mobile_hide_table_col">#</th>
                                            <th className="">Name</th>
                                            <th className="table_token">Live Price</th>
                                            <th className="table_token mobile_hide_table_col">Type</th>
                                            <th className="table_max_supply mobile_hide_table_col">Max Supply</th> 
                                            <th className="mobile_hide_table_col table_circulating_supply">Market Cap</th>  
                                            <th className="table_max_supply mobile_hide_table_col">Change %</th>    */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        loader_status ?
                                        <>
                                        {
                                            all_tab_status == 0 ?

                                            top_gainers.length > 0
                                            ?
                                            top_gainers.map((e, i) => 
                                            <tr key={i}>
                                                <td>
                                                {
                                                    user_token ?
                                                    <>
                                                    {
                                                        watchlist.includes(e._id) ?
                                                        <span onClick={()=>removeFromWatchlist(e._id)} ><img src="/assets/img/wishlist_star_selected.svg" alt="Watchlist" /></span>
                                                        :
                                                        <span onClick={()=>addToWatchlist(e._id)} ><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/></span>
                                                    }
                                                    </>
                                                    :
                                                    <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a onClick={()=> Logout()}><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/></a></Link>
                                                }
                                                </td>
                                                <td className="mobile_hide_table_col"> {e.cmc_rank} </td>
                                                <td>
                                                    <Link href={"/"+e.token_id}>
                                                        <a>
                                                        <div className="media">
                                                            <div className="media-left">
                                                            <img src={image_base_url+(e.coinmarketcap_id ? e.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                                            </div>
                                                            <div className="media-body">
                                                                <h4 className="media-heading">{e.token_name} <span>{(e.symbol).toUpperCase()}</span></h4>
                                                            </div>
                                                        </div> 
                                                        </a>
                                                    </Link>
                                                </td> 
                                                <td className="market_list_price"> 
                                                    <Link href={"/"+e.token_id}>
                                                        <a>
                                                        <span className="block_price">{roundNumericValue(e.price)}</span>
                                                        {e.price_updated_on ? moment(e.price_updated_on).fromNow():null} 
                                                        </a>
                                                    </Link>
                                                </td>
                                    
                                                <td className="mobile_hide_table_col"> 
                                                <Link href={"/"+e.token_id}>
                                                    <a>
                                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                                    </a>
                        
                                                    </Link>
                                                </td>
                                    
                                                <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                        <a>
                                                        {e.volume ?"$"+separator((e.volume).toFixed(0)) : "-"}
                                                        </a>
                                                    </Link>
                                                </td>
                                                <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}><a>
                                                    {e.circulating_supply ? separator((e.circulating_supply).toFixed(0)) +" "+(e.symbol).toUpperCase(): "-"} 
                                                        
                                                    </a></Link>
                                                </td>  
                                               
                                            </tr> 
                                            ) 
                                            :
                                            <tr>
                                                <td className="text-lg-center text-md-left" colSpan="4"> Sorry, No related data found. </td>
                                            </tr>
                                            :
                                            all_tab_status == 1 ? 
                                            top_loosers.length > 0
                                            ?
                                            top_loosers.map((e, i) => 
                                                <tr key={i}>
                                                    <td>
                                                        {
                                                            user_token ?
                                                            <>
                                                            {
                                                                watchlist.includes(e._id) ?
                                                                <span onClick={()=>removeFromWatchlist(e._id)} ><img src="/assets/img/wishlist_star_selected.svg" alt="Watchlist" /></span>
                                                                :
                                                                <span onClick={()=>addToWatchlist(e._id)} ><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/></span>
                                                            }
                                                            </>
                                                            :
                                                            <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a onClick={()=> Logout()}><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/></a></Link>
                                                        }
                                                    </td>
                                                    <td className="mobile_hide_table_col"> {e.cmc_rank} </td>
                                                    <td>
                                                        <Link href={"/"+e.token_id}>
                                                            <a>
                                                            <div className="media">
                                                                <div className="media-left">
                                                            <img src={image_base_url+(e.coinmarketcap_id ? e.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                                                </div>
                                                                <div className="media-body">
                                                                    <h4 className="media-heading">{e.token_name} <span>{(e.symbol).toUpperCase()}</span></h4>
                                                                </div>
                                                            </div> 
                                                            </a>
                                                        </Link>
                                                    </td> 
                                                    <td className="market_list_price"> 
                                                        <Link href={"/"+e.token_id}>
                                                            <a>
                                                            <span className="block_price">{roundNumericValue(e.price)}</span>
                                                            {e.price_updated_on ? moment(e.price_updated_on).fromNow():null} 
                                                            </a>
                                                        </Link>
                                                    </td>
                                        
                                                    <td className="mobile_hide_table_col"> 
                                                        <Link href={"/"+e.token_id}>
                                                            <a>
                                                            <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                                            </a>
                                                        </Link>
                                                    </td>
                                        
                                                    <td className="mobile_hide_table_col">
                                                        <Link href={"/"+e.token_id}>
                                                            <a>
                                                        {e.volume ?"$"+separator((e.volume).toFixed(0)) : "-"}
                                                            </a>
                                                        </Link>
                                                    </td>
                                                    <td className="mobile_hide_table_col">
                                                        <Link href={"/"+e.token_id}>
                                                            <a>
                                                            {e.circulating_supply ? separator((e.circulating_supply).toFixed(0)) +" "+(e.symbol).toUpperCase(): "-"} 
                                                            </a>
                                                        </Link>
                                                    </td>  
                                                    
                                                </tr> 
                                            ) 
                                            :
                                            <tr>
                                                <td className="text-lg-center text-md-left" colSpan="4"> Sorry, No related data found. </td>
                                            </tr>
                                            :
                                            null
                                        }
                                        </>
                                        :
                                        <TableContentLoader row="10" col="8" />  
                                    }
                                    </tbody>
                                </table>
                            </div>
                        </div> 
                    }
               
                </div>
            </div>
        </div>
    </div>
     
     <div className="coming_soon_modal">
       <div className="modal" id="comingSoon">
         <div className="modal-dialog modal-sm">
           <div className="modal-content">
             <div className="modal-header">
               <h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
               <button type="button" className="close" data-dismiss="modal">&times;</button>
             </div>
             <div className="modal-body">
               <p className="coming_soon_subtext">This feature will be available soon</p>
             </div>
           </div>
         </div>
       </div>
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
