import React, {useEffect, useState,useRef} from 'react'
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
    const [per_page_count, set_per_page_count] = useState(100)
    const [top_gainers, set_top_gainers] = useState([])
    const [top_loosers, set_top_loosers] = useState([])
    const [date_type_status, set_date_type_status] = useState(false);
    const [date_type_name, set_date_type_name] = useState("");
    const [coin_type_status, set_coin_type_status] = useState(false);
    const [coin_type_name, set_coin_type_name] = useState("");
    const [cmc_rank, set_cmc_rank] = useState("");
    const [percent_change, set_percent_change] = useState("");
    const [search_value, set_search_value] = useState("");
    
    

    const [date_type_list] = useState([
        { value: 1, label: "1h" },
        { value: 2, label: "24h" },
        { value: 3, label: "7d" }
      ])

    const [coin_type_list] = useState([
        { value: 100, label: "Top 100" },
        { value: 500, label: "Top 500" },
        { value: 9500, label: "ALL" }
      ])
  const date_type_ref = useRef()
  const coin_ref = useRef()


    

 
    useEffect(() => 
    { 
        topGainners()
        topLosers()
        
        let handler = (e) => {
           
              if (!date_type_ref?.current?.contains(e.target)) {
                set_date_type_status(false)
              }
              if (!coin_ref?.current?.contains(e.target)) {
                set_coin_type_status(false)
              }
          }
          document.addEventListener("mousedown", handler)
    
          return () => {
              document.removeEventListener("mousedown", handler)
          }
          
    }, [search_value, watch_list_status,cmc_rank,percent_change])

    const topGainners=  async()=>
    {
      const req_config = { 
        headers : {
          api_key : "234ADSIUDG98669DKLDSFHDASDFLKHSDAFIUUUUS"
        },
        params:
        {
          cmc_rank:cmc_rank,
          percent_change:percent_change,
          search:search_value
        }
      }
        set_loader_status(false)
        Axios.get(API_BASE_URL+"markets/cryptocurrency/gainers/"+per_page_count, req_config).then(response => 
        {
            set_loader_status(true)
            console.log("Gainers",response.data.message)   
            if(response.data.status === true)
            { 
                set_top_gainers(response.data.message)
            }
        })
    }

    const topLosers=  async()=>
    {
        const req_config = { 
          headers : {
            api_key : "234ADSIUDG98669DKLDSFHDASDFLKHSDAFIUUUUS"
          },
          params:
          {
            cmc_rank:cmc_rank,
            percent_change:percent_change,
            search:search_value
          }
        }

        set_loader_status(false)
        Axios.get(API_BASE_URL+"markets/cryptocurrency/losers/"+per_page_count, req_config).then(response => 
        {
            set_loader_status(true)
            console.log("losers",response.data.message)   
            if(response.data.status === true)
            { 
                set_top_loosers(response.data.message)
            }
        })
    }

    const addToWatchlist = async (param_token_id, param_type) =>
    {
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/add_to_watchlist/"+param_token_id, config)
        if(res.data.status)
        {
          if(param_type == 1)
          {
                //gainers
                var list = []
                for(const i of top_gainers)
                {  
                    if(i._id == param_token_id)
                    { 
                        i['watchlist_status'] = true
                        list.push(i)
                    }
                    else
                    {
                        list.push(i)
                    }
                }
                set_top_gainers(list)
          }
          else
          {
                //losers
                var list = []
                for(const i of top_loosers)
                {  
                    if(i._id == param_token_id)
                    { 
                        i['watchlist_status'] = true
                        list.push(i)
                    }
                    else
                    {
                        list.push(i)
                    }
                }
                set_top_loosers(list)
          }
        }
    }
    
    const removeFromWatchlist = (param_token_id, param_type) =>
    {
      Axios.get(API_BASE_URL+"markets/cryptocurrency/remove_from_watchlist/"+param_token_id, config).then(res=>
      {
        if(res.data.status)
        {
            if(param_type == 1)
            {
                  //gainers
                  var list = []
                  for(const i of top_gainers)
                  {  
                      if(i._id == param_token_id)
                      { 
                          i['watchlist_status'] = false
                          list.push(i)
                      }
                      else
                      {
                          list.push(i)
                      }
                  }
                  set_top_gainers(list)
            }
            else
            {
                  //losers
                  var list = []
                  for(const i of top_loosers)
                  {  
                      if(i._id == param_token_id)
                      { 
                          i['watchlist_status'] = false
                          list.push(i)
                      }
                      else
                      {
                          list.push(i)
                      }
                  }
                  set_top_loosers(list)
            }
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
        <title>Today's Crypto Gainers & Losers | Coinpedia </title>
        <meta name="description" content="Coinpedia’s Market bring you with a list of top cryptocurrencies with real timeprices, including percentage change, charts, history, volume and more."/>
        <meta name="keywords" content="crypto market, crypto market tracker, Crypto tracker live, Cryptocurrency market, crypto market insights , Live crypto insights, crypto price alerts, Live crypto alerts." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Today's Crypto Gainers & Losers | Coinpedia" />
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
        <meta name="twitter:title" content="Today's Crypto Gainers & Losers | Coinpedia" />
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
                                <h1 className="page_title">Today's Crypto Gainers & Losers</h1>
                                <p>Which crypto coins and tokens with volume (24h) {">"} US$50,000 have gained or lost the most in the last 24 hours?</p>
                                </div>
                            <div className="col-md-1 col-lg-2"></div>
                            <div className="col-md-5 col-lg-4 ">
                                {
                                    <Search_Contract_Address /> 
                                }
                            </div>
                        </div>
                            <div>
                        <div class="all-categories-list">
                            <CategoriesTab active_tab={2} user_token={user_token}/> 
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
                        <div className="col-md-12 col-lg-6 mb-3 col-12">
                            <ul className="secondary_tabs">
                                <li className={all_tab_status == 0?"secondary_tabs_active ":null}><a onClick={()=>set_all_tab_status(0)}>Gainers </a></li>
                                <span className='tabs_partition'></span>
                                <li className={all_tab_status == 1?"secondary_tabs_active":null}><a onClick={()=>set_all_tab_status(1)}>Losers</a></li>
                            </ul>
                        </div>
                        <div className="col-md-12 col-lg-6 mb-3 col-12 filter-category-section select_category_gainers">
                        <div className="row">
                            
                            <div className="col-md-4 col-lg-6 col-12 col-sm-12 ">
                                <div className="input-group search_filter">
                                    <input value={search_value} onChange={(e)=> set_search_value(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Token" />
                                    <div className="input-group-prepend ">
                                        <span className="input-group-text" ><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                                    </div>
                                </div> 
                            </div>

                            <div className="col-md-4 col-lg-3 col-6 ">
                            <div className="cust_filters_dropdown" ref={date_type_ref}>
                            <div className="cust_filter_input" >
                               
                               {
                                 !percent_change ?
                                 <div className="input-group" onClick={() =>
                                     set_date_type_status(!date_type_status)
                                   }>

                                     <input  autoComplete='off'  type="text" className="form-control " placeholder="Time" />
                                     <span className="input-group-addon lightmode_image">
                                       <img src="/assets/img/filter_dropdown.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                     </span>
                                     <span className="input-group-addon darkmode_image">
                                       <img src="/assets/img/filter_dropdown_grey.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                     </span>
                                 </div>
                                 :
                                 <div className="markets_selected_category">
                                   <p>{date_type_name}</p>

                                   <div className="input-group-addon close_category_icon" onClick={()=> 
                                   {set_percent_change("");
                                    set_date_type_name("")}}>
                                     <img src="/assets/img/close_mark.png" />
                                   </div>
                                 </div>  
                               }
                             </div>
                            
                          {date_type_status ? (
                            <ul className="cust_filter_result">
                              {date_type_list.map((item) => (
                                <li
                                  onClick={() => 
                                    {
                                      set_percent_change(item.value);
                                    set_date_type_name(item.label);
                                    set_date_type_status(false)
                                  }
                                }
                                >
                                  {" "}
                                  {item.label}{" "}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            ""
                          )}
                         

{/* <div class="cust_filter_input">
                                <div class="input-group">
                                <input autocomplete="off" class="form-control " data-bs-toggle="dropdown" autoComplete='off' placeholder="Time" />
                                    <span class="input-group-addon lightmode_image">
                                        <img src="/assets/img/filter_dropdown.svg" title="Filter Dropdown" alt="Filter Dropdown" /></span>
                            </div>
                            </div> */}
                           
                            {/* <ul className="cust_filter_result">
                                 <li>24h</li>
                                 <li>1d</li>
                                 <li>7d</li>
                                 <li>30d</li>
                                </ul> */}
                               
                            </div>
                            </div>

                          <div className="col-md-4 col-lg-3 col-6 ">
                          <div className="cust_filters_dropdown" ref={coin_ref}>
                          <div className="cust_filter_input" >
                               
                               {
                                 !cmc_rank ?
                                 <div className="input-group" onClick={() =>
                                     set_coin_type_status(!coin_type_status)
                                   }>

                                     <input  autoComplete='off'  type="text" className="form-control " placeholder="Coins" />
                                     <span className="input-group-addon lightmode_image">
                                       <img src="/assets/img/filter_dropdown.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                     </span>
                                     <span className="input-group-addon darkmode_image">
                                       <img src="/assets/img/filter_dropdown_grey.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                     </span>
                                 </div>
                                 :
                                 <div className="markets_selected_category">
                                   <p>{coin_type_name}</p>

                                   <div className="input-group-addon close_category_icon" onClick={()=> 
                                   {set_cmc_rank("");
                                    set_coin_type_name("")}}>
                                     <img src="/assets/img/close_mark.png" />
                                   </div>
                                 </div>  
                               }
                             </div>
                          {/* {coin_type_name ? (
                        <div className="dropdown_selected_element">
                          <p>{coin_type_name}{" "}</p>
                          <img
                            src="/assets/img/close_mark.png"
                            className="close_mark lightmode_image"
                            onClick={() => {
                              set_coin_type("");
                              set_coin_type_name("");
                            }}
                            title="Tag Close" alt="Tag Close"
                          />
                           <img src="/assets/img/cancel_icon_dark.png" className="close_mark darkmode_image" title="Tag Close" alt="Tag Close"  onClick={() => {
                              set_coin_type("");
                              set_coin_type_name("");
                            }}
                          />
                        </div>
                      ) : (
                        <> */}
                        {/* <div ref={coin_ref}> */}
                          {/* <div
                            className="cust_filter_input"
                            onClick={() =>
                              set_coin_type_status(!coin_type_status)
                            }
                          >
                            <div class="input-group">
                              <input
                                id="email"
                                type="text"
                                class="form-control "
                                placeholder="Coins"
                                disabled
                              />
                              <span class="input-group-addon lightmode_image">
                                <img src="/assets/img/filter_dropdown.svg" title="Event Type" alt="Event Type" />
                              </span>
                              <span class="input-group-addon darkmode_image">
                              <img src="/assets/img/filter_dropdown_grey.svg" title="Event Type" alt="Event Type" />
                            </span>
                            </div>
                          </div> */}
                          
                          {coin_type_status ? (
                            <ul className="cust_filter_result">
                              {coin_type_list.map((item) => (
                                <li
                                  onClick={() => 
                                    {
                                      set_cmc_rank(item.value);
                                    set_coin_type_name(item.label);
                                    set_coin_type_status(false)
                                  }
                                }
                                >
                                  {" "}
                                  {item.label}{" "}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            ""
                          )}
                          {/* </div>
                        </>
                      )} */}
                            {/* <div class="cust_filter_input">
                                <div class="input-group">
                                <input autocomplete="off" type="text" class="form-control " autoComplete='off' placeholder="Coins" />
                                    <span class="input-group-addon lightmode_image">
                                        <img src="/assets/img/filter_dropdown.svg" title="Filter Dropdown" alt="Filter Dropdown" /></span>
                            </div>
                            </div>

                            <ul className="cust_filter_result">
                                 <li>Top 100</li>
                                 <li>Top 500</li>
                                 <li>All</li>
                                </ul> */}
                               
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
                                          <th className="mobile_fixed_first" style={{minWidth: '35px'}}></th>
                                          <th className="mobile_hide_view "style={{minWidth: '35px'}}>Rank</th>
                                          <th className="mobile_fixed table-cell-shadow-right">Name</th>
                                          <th className="">Price</th>
                                          <th style={{minWidth: 'unset'}}>
                                            {
                                              percent_change == 1 ? 
                                              <>
                                              1h
                                              </>
                                              : 
                                              percent_change == 3 ? 
                                              <>
                                              7d
                                              </>
                                             
                                              :
                                              <>
                                              24h
                                              </>
                                            }
                                          </th>
                                          {/* <th className=" " style={{minWidth: 'unset'}}>24h</th> */}
                                          {/* <th className=" " style={{minWidth: 'unset'}}>7d</th> */}
                                          <th className=" table_circulating_supply">Market Cap</th> 
                                          <th className=" ">Volume(24H)</th>  
                                          <th className=" table_circulating_supply">Circulating Supply</th>  
                                          <th className="last_data">Last 7 Days</th>
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
                                                <td className="mobile_fixed_first">
                                                {
                                                    user_token ?
                                                    <>
                                                    {
                                                        e.watchlist_status== true ?
                                                        <span onClick={()=>removeFromWatchlist(e._id, 1)} ><img src=" /assets/img/wishlist_star_selected.svg" alt="Watchlist" width={17} height={17} /></span>
                                                        :
                                                        <span onClick={()=>addToWatchlist(e._id, 1)} ><img src="/assets/img/star.svg" alt="Watchlist" width={17} height={17} /></span>
                                                        }
                                                    </>
                                                    :
                                                    <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url} onClick={()=> Logout()}><img src="/assets/img/star.svg" alt="Watchlist"/></Link>
                                                }
                                                </td>
                                                <td className=" mobile_hide_view wishlist "> {e.cmc_rank} </td>
                                                <td className="mobile_fixed table-cell-shadow-right">
                                                    <Link href={"/"+e.token_id}>
                                                        <div className="media">
                                                            <div className="media-left align-self-center">
                                                            <img src={image_base_url+(e.coinmarketcap_id ? e.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                                            </div>
                                                            <div className="media-body align-self-center">
                                                                <h4 className="media-heading">{e.token_name} </h4>
                                                                <p>{(e.symbol).toUpperCase()}</p>
                                                            </div>
                                                        </div> 
                                                   
                                                    </Link>
                                                </td> 
                                                <td className="market_list_price"> 
                                                    <Link href={"/"+e.token_id}>
                                                        <span className="block_price">{roundNumericValue(e.price)}</span>
                                                        {e.price_updated_on ? moment(e.price_updated_on).fromNow():null} 
                                                    </Link>
                                                </td>
                                    
                                                {/* <td className="mobile_hide_table_col"> 
                                                    <Link href={"/"+e.token_id}>
                                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                                    </Link>
                                                </td> */}
                                                <td className="mobile_hide_table_col">
                                                <Link href={"/"+e.token_id}>
                                                {
                                                  percent_change == 1 ? 
                                                  <>
                                                  {
                                                    e.percent_change_1h?e.percent_change_1h>0?
                                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_1h.toFixed(2)+"%"}</span></h6>
                                                    :
                                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                    :
                                                    "--"
                                                  }
                                                  </>
                                                  :
                                                  percent_change == 3 ?
                                                  <>
                                                  {
                                                    e.percent_change_7d?e.percent_change_7d>0?
                                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_7d.toFixed(2)+"%"}</span></h6>
                                                    :
                                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                    :
                                                    "--"
                                                  }
                                                  </>
                                                  :
                                                  <>
                                                  {
                                                    e.percent_change_24h?e.percent_change_24h>0?
                                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                                    :
                                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                    :
                                                    "--"
                                                  }
                                                  </>
                                                  
                                                }
                                                </Link>
                                                    
                                                      
                                                        {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>1.05%</span></h6> */}
                                                    
                                                    </td>
                                                <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                    {e.circulating_supply ?"$"+separator((e.circulating_supply*e.price).toFixed(0)) : "-"}
                                                    </Link>
                                                </td>  

                                                <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                        {e.volume ?"$"+separator((e.volume).toFixed(0)) : "-"}
                                                    </Link>
                                                </td>
                                                <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                    {e.circulating_supply ? separator((e.circulating_supply).toFixed(0)) +" "+(e.symbol).toUpperCase(): "-"} 
                                                    </Link>
                                                </td> 
                                                
                                                <td className="mobile_hide_table_col">
                                                  {
                                                    percent_change == 3 ?
                                                    <>
                                                    <img className={e.percent_change_7d>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} style={{width:"170px"}} height="100%"/>
                                                    </>
                                                    :
                                                    percent_change == 1 ? 
                                                    "-"
                                                    :
                                                    <>
                                                    <img className={e.percent_change_24h>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/1d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} style={{width:"170px"}} height="100%"/>
                                                    </>
                                                  }
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
                                                    <td className='mobile_fixed_first'>
                                                    {
                                                        user_token ?
                                                        <>
                                                        {
                                                            e.watchlist_status== true ?
                                                            <span onClick={()=>removeFromWatchlist(e._id, 2)} ><img src=" /assets/img/color.svg" alt="Watchlist" width={17} height={17} /></span>
                                                            :
                                                            <span onClick={()=>addToWatchlist(e._id, 2)} ><img src="/assets/img/star.svg" alt="Watchlist" width={17} height={17} /></span>
                                                            }
                                                        </>
                                                        :
                                                        <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url} onClick={()=> Logout()}><img src="/assets/img/star.svg" alt="Watchlist"/></Link>
                                                    }
                                                    </td>
                                                    <td className="mobile_hide_view wishlist "> {e.cmc_rank} </td>
                                                    <td  className='mobile_fixed'>
                                                        <Link href={"/"+e.token_id}>
                                                            <div className="media">
                                                                <div className="media-left">
                                                            <img src={image_base_url+(e.coinmarketcap_id ? e.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                                                </div>
                                                                <div className="media-body">
                                                                    <h4 className="media-heading">{e.token_name} </h4>
                                                                    <p>{(e.symbol).toUpperCase()}</p>
                                                                </div>
                                                            </div> 
                                                        </Link>
                                                    </td> 
                                                    <td className="market_list_price"> 
                                                        <Link href={"/"+e.token_id}>
                                                            <span className="block_price">{roundNumericValue(e.price)}</span>
                                                            {e.price_updated_on ? moment(e.price_updated_on).fromNow():null}
                                                        </Link>
                                                    </td>
                                                    <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                      {
                                                        percent_change == 1 ? 
                                                        <>
                                                        {
                                                          e.percent_change_1h?e.percent_change_1h>0?
                                                          <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_1h.toFixed(2)+"%"}</span></h6>
                                                          :
                                                          <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                          :
                                                          "--"
                                                        }
                                                        </>
                                                        :
                                                        percent_change == 3 ?
                                                        <>
                                                        {
                                                          e.percent_change_7d?e.percent_change_7d>0?
                                                          <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_7d.toFixed(2)+"%"}</span></h6>
                                                          :
                                                          <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                          :
                                                          "--"
                                                        }
                                                        </>
                                                        :
                                                        <>
                                                        {
                                                          e.percent_change_24h?e.percent_change_24h>0?
                                                          <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                                          :
                                                          <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                          :
                                                          "--"
                                                        }
                                                        </>
                                                      }
                                                      </Link>
                                                    </td>
                                                    <td className="mobile_hide_table_col">
                                                        <Link href={"/"+e.token_id}>
                                                        {e.circulating_supply ?"$"+separator((e.circulating_supply*e.price).toFixed(0)) : "-"}
                                                        </Link>
                                                    </td>
                                                    <td className="mobile_hide_table_col">
                                                        <Link href={"/"+e.token_id}>
                                                        {e.volume ?"$"+separator((e.volume).toFixed(0)) : "-"}
                                                        </Link>
                                                    </td>
                                                    <td className="mobile_hide_table_col">
                                                        <Link href={"/"+e.token_id}>
                                                            {e.circulating_supply ? separator((e.circulating_supply).toFixed(0)) +" "+(e.symbol).toUpperCase(): "-"} 
                                                        </Link>
                                                    </td>  
                                                    <td className="mobile_hide_table_col">
                                                      {
                                                        percent_change == 3 ?
                                                        <>
                                                        <img className={e.percent_change_7d>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} style={{width:"170px"}} height="100%"/>
                                                        </>
                                                        :
                                                        percent_change == 1 ? 
                                                        "-"
                                                        :
                                                        <>
                                                        <img className={e.percent_change_24h>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/1d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} style={{width:"170px"}} height="100%"/>
                                                        </>
                                                      }
                                                    </td>
                                                </tr> 
                                            ) 
                                            :
                                            <tr>
                                                <td className="text-lg-center text-md-left" colSpan="10"> Sorry, No related data found. </td>
                                            </tr>
                                            :
                                            null
                                        }
                                        </>
                                        :
                                        <TableContentLoader row="10" col="10" />  
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
               <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" /></span></button>
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
