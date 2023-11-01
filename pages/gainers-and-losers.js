import React, {useEffect, useState,useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY, count_live_price, Logout, convertvalue} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux'
import CategoriesTab from '../components/categoriesTabs'
import Search_Contract_Address from '../components/search_token'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import WatchList from '../components/watchlist'
import JsCookie from "js-cookie"
import LoginModal from '../components/layouts/auth/loginModal'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
 
export default function GainersLosers({userAgent,modalprops})
{  
  console.log("modalprops",modalprops)
    const [watch_list_status, set_watch_list_status] = useState(false)
    const [watchlist, set_watchlist] = useState([])
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
    const [loader_status, set_loader_status]=useState(true)
    const [all_tab_status, set_all_tab_status] = useState(0)
    const [per_page_count, set_per_page_count] = useState(100)
    const [top_gainers, set_top_gainers] = useState([])
    const [top_loosers, set_top_loosers] = useState([])
    const [date_type_status, set_date_type_status] = useState(false);
    const [percent_change, set_percent_change] = useState(2);
    const [date_type_name, set_date_type_name] = useState("24h");

    const [coin_type_status, set_coin_type_status] = useState(false);
    const [cmc_rank, set_cmc_rank] = useState("100");
    const [coin_type_name, set_coin_type_name] = useState("Top 100");
  
   
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

    const [user_token, set_user_token] = useState(userAgent.user_token? userAgent.user_token:"");
    const [login_modal_status, set_login_modal_status] = useState(false)
    const [request_config, set_request_config] = useState(config(userAgent.user_token ? userAgent.user_token : ""))
    const [action_row_id, set_action_row_id] = useState("")
   
    useEffect(() => {
   
      if(modalprops.login_data){
        getDataFromChild(modalprops)
      }
    
    }, [modalprops]);
    const getDataFromChild = async (pass_object) => 
    {
      await set_login_modal_status(false)
      await set_user_token(JsCookie.get("user_token"))
      await set_request_config(JsCookie.get("user_token"))
        if(action_row_id){
        await addToWatchlist(action_row_id)
        }
        else{
          topGainners()
          topLosers()
        }
    }

    const login_props = {
      status: true,
      request_config: request_config,
      callback: getDataFromChild
    }

    //1:add to watchlist, 2:remove from watchlist
    const loginModalStatus = async (pass_id) => 
    {
      await set_login_modal_status(false)
      await set_login_modal_status(true)
      await set_action_row_id(pass_id)
    }

    const active_currency = useSelector(state => state.active_currency)

const convertCurrency = (token_price) =>
    {
      if(token_price)
      {
        if(active_currency.currency_value)
        {
          return active_currency.currency_symbol+" "+roundNumericValue(token_price*active_currency.currency_value)
        }
        else
        {
          return roundNumericValue(token_price)
        }
      }
      else
      {
        return '-'
      }
    }

    const shortConvertCurrency = (token_price) =>
    {
      if(token_price)
      {
        if(active_currency.currency_value)
        {
          return active_currency.currency_symbol+" "+convertvalue(token_price*active_currency.currency_value)
        }
        else
        {
          return roundNumericValue(token_price)
        }
      }
      else
      {
        return '-'
      }
    }
    

 
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
      const old_config = config(JsCookie.get('user_token'))
      const req_config = { 
        headers : old_config.headers,
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
      const old_config = config(JsCookie.get('user_token'))
      const req_config = { 
        headers : old_config.headers,
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
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/add_to_watchlist/"+param_token_id, config(JsCookie.get('user_token')))
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

        if(action_row_id)
        {
          topGainners()
          topLosers()
          await set_action_row_id("")
        }

    }
    
    const removeFromWatchlist = (param_token_id, param_type) =>
    {
      Axios.get(API_BASE_URL+"markets/cryptocurrency/remove_from_watchlist/"+param_token_id, config(JsCookie.get('user_token'))).then(res=>
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
    

    
    return (
    
    <>
        <Head>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
        <title>Today's Top Crypto Gainers and Losers | Live Price Update</title>
        <meta name="description" content="List of today's top gainers and losers of crypto market, listed by trading volume of $50,000+ gain or loss in 24 hours. "/>
        <meta name="keywords" content="crypto gainers and losers, top gainers and losers, top gainer in crypto today, top looser crypto today, crypto price, coinpedia markets" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Today’s Top Crypto Gainers and Losers | Live Price Update" />
        <meta property="og:description" content="List of today's top gainers and losers of crypto market, listed by trading volume of $50,000+ gain or loss in 24 hours. " />
        <meta property="og:url" content={market_coinpedia_url + "gainers-and-losers/"} />
        <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
        <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Today’s Top Crypto Gainers and Losers | Live Price Update" />
        <meta name="twitter:description" content="List of today's top gainers and losers of crypto market, listed by trading volume of $50,000+ gain or loss in 24 hours. " />
        <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="canonical" href={market_coinpedia_url + "gainers-and-losers/"}/>
        <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Gainers and Losers"}`,
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
                  "name": "Gainers and Losers",
                  "item": "https://markets.coinpedia.org/gainers-and-losers/"
                }
              ]
            }`,
          }}
        />
        </Head>

        <div className="page new_markets_index min_height_page markets_new_design">
            <div className="market-page">
                <div className="new_page_title_block">
                    <div className="container">
                        <div className="col-md-12">
                            <div className="row market_insights ">
                            <div className="col-md-6 col-lg-6">
                                <h1 className="page_title">Top Gainers and Losers</h1>
                                <p>Today's List of coins with significant volume movement of {shortConvertCurrency(500000)}+ gain or loss in 24 hours.</p>
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
                                     <img src="/assets/img/close_mark.png" alt="Close" />
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

                            

                          <div className="col-md-4 mb-2 col-lg-3 col-6 ">
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
                                     <img src="/assets/img/close_mark.png" alt="Close"/>
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

                          <div className="col-md-4 col-lg-6 col-12 col-sm-12 ">
                                <div className="input-group search_filter">
                                    <input value={search_value} onChange={(e)=> set_search_value(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Token" />
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
                                          <th className="">Market Cap&nbsp;
                                            <OverlayTrigger
                                              delay={{ hide: 450, show: 300 }}
                                                overlay={(props) => (
                                                  <Tooltip {...props} className="custom_pophover">
                                                    <p>Market capitalization is a measure used to determine the total value of a publicly traded cryptocurrency. It is calculated by multiplying the current market price of a single coin/token X total supply of the coin/token.</p>
                                                  </Tooltip>
                                                )}
                                                placement="bottom"
                                              ><span className='info_col' ><img src="/assets/img/info.png" alt="info"  /></span>
                                            </OverlayTrigger>
                                          </th> 
                                          <th className="volume_24h">Volume(24H)&nbsp;
                                            <OverlayTrigger
                                              // delay={{ hide: 450, show: 300 }}
                                              overlay={(props) => (
                                                <Tooltip {...props} className="custom_pophover">
                                                <p>The 24-hour volume, also known as trading volume or trading activity, refers to the total amount of a specific coin/token that has been bought and sold within a 24-hour period. It represents the total number of coins/tokens traded during that time frame.</p>
                                                </Tooltip>
                                              )}
                                              placement="bottom"
                                            ><span className='info_col' ><img src="/assets/img/info.png" alt="info"/></span>
                                            </OverlayTrigger>
                                          </th>  
                                          <th className=" table_circulating_supply">Circulating Supply&nbsp;
                                            <OverlayTrigger
                                              delay={{ hide: 450, show: 300 }}
                                              overlay={(props) => (
                                                <Tooltip {...props} className="custom_pophover">
                                                  <p>Circulating supply refers to the total number of coins/tokens that are currently in circulation and available to the public. It represents the portion of the total supply of a cryptocurrency that is actively being traded or held by investors.</p>
                                                </Tooltip>
                                              )}
                                              placement="bottom"
                                            ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                            </OverlayTrigger>
                                          </th>  
                                          <th className="last_data">
                                            {
                                              percent_change == 1 ? 
                                              <>
                                              Last 7 Days
                                              </>
                                              :
                                              percent_change == 3 ?
                                              <>
                                              Last 7 Days
                                              </>
                                              :
                                              <>
                                              Last 24 Hours
                                              </>
                                              
                                            }
                                            
                                          </th>
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
                                                    <span className='login-watchlist' onClick={()=>loginModalStatus(e._id)}><img src="/assets/img/star.svg" alt="Watchlist"/></span>
                                                }
                                                </td>
                                                <td className=" mobile_hide_view wishlist "> {e.cmc_rank} </td>
                                                <td className="mobile_fixed table-cell-shadow-right">
                                                    <Link href={"/"+e.token_id}>
                                                        <div className="media">
                                                            <div className="media-left align-self-center">
                                                            <img src={(e.token_image ? image_base_url+e.token_image: e.coinmarketcap_id ? cmc_image_base_url+e.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
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
                                                        {
                                                            e.price ?
                                                            <>
                                                           <span className="block_price"> {convertCurrency(e.price)}</span>
                                                            {e.updated_on ? moment(e.updated_on).fromNow():null} 
                                                            </>
                                                            :
                                                            "-"
                                                        }
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
                                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h6>
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
                                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h6>
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
                                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
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
                                                    {/* {e.circulating_supply ?"$"+separator((e.circulating_supply*e.price).toFixed(0)) : "-"} */}
                                                    {e.circulating_supply ? convertCurrency(e.circulating_supply*e.price): ""}
                                                    </Link>
                                                </td>  

                                                <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                        {/* {e.volume ?"$"+separator((e.volume).toFixed(0)) : "-"} */}
                                                        {e.volume ? convertCurrency(e.volume): "-"}
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
                                                            <span onClick={()=>removeFromWatchlist(e._id, 2)} ><img src=" /assets/img/wishlist_star_selected.svg" alt="Watchlist" width={17} height={17} /></span>
                                                            :
                                                            <span onClick={()=>addToWatchlist(e._id, 2)} ><img src="/assets/img/star.svg" alt="Watchlist" width={17} height={17} /></span>
                                                            }
                                                        </>
                                                        :
                                                        <span className='login-watchlist' onClick={()=>loginModalStatus(e._id)}><img src="/assets/img/star.svg" alt="Watchlist"/></span>
                                                    }
                                                    </td>
                                                    <td className="mobile_hide_view wishlist "> {e.cmc_rank} </td>
                                                    <td  className='mobile_fixed table-cell-shadow-right'>
                                                        <Link href={"/"+e.token_id}>
                                                            <div className="media">
                                                                <div className="media-left">
                                                                <img src={(e.token_image ? image_base_url+e.token_image: e.coinmarketcap_id ? cmc_image_base_url+e.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
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
                                                        {
                                                            e.price ?
                                                            <>
                                                            <span className="block_price">{convertCurrency(e.price)}</span>
                                                            {e.updated_on ? moment(e.updated_on).fromNow():null} 
                                                            </>
                                                            :
                                                            "-"
                                                        }
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
                                                          <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="Low price"/>{(e.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h6>
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
                                                          <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="Low price"/>{(e.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h6>
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
                                                          <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="Low price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                          :
                                                          "--"
                                                        }
                                                        </>
                                                      }
                                                      </Link>
                                                    </td>
                                                    <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                    {/* {e.circulating_supply ?"$"+separator((e.circulating_supply*e.price).toFixed(0)) : "-"} */}
                                                    {e.circulating_supply ? convertCurrency(e.circulating_supply*e.price): ""}
                                                    </Link>
                                                </td>  

                                                <td className="mobile_hide_table_col">
                                                    <Link href={"/"+e.token_id}>
                                                        {/* {e.volume ?"$"+separator((e.volume).toFixed(0)) : "-"} */}
                                                        {e.volume ? convertCurrency(e.volume): "-"}
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
               <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" alt="Close"/></span></button>
             </div>
             <div className="modal-body">
               <p className="coming_soon_subtext">This feature will be available soon</p>
             </div>
           </div>
         </div>
       </div>
     </div>
   </div>

   {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
</>
)
} 

export async function getServerSideProps({req}) 
{
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  var user_token = userAgent.user_token ? userAgent.user_token : ""

 return { props: {userAgent:userAgent, config:config(user_token), user_token:user_token}}
}
