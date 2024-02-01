import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { getLaunchpadType } from '../config/helper' 
import { API_BASE_URL, roundNumericValue, config, separator, getGoodWishOfDay, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, convertvalue, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux'
import Search_token from '../components/search_token'
import CategoriesTab from '../components/categoriesTabs'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'
import JsCookie from "js-cookie"
import LoginModal from '../components/layouts/auth/loginModal'
import Popupmodal from '../components/popupmodal'
// import Select from 'react-select'
import { useRouter } from 'next/navigation'
import Slider from 'react-slick';

export default function MarketsIndex({page, userAgent, list_data, list_count, per_page_limit, final_count, pages_count, first_count, modalprops, unsubscribe, code})
{ 
   
    const router = useRouter()
    const { userData, active_currency } = useSelector(state => state)
  
    const myRef = useRef(null)
    const category_ref = useRef()
    const [is_client, set_is_client] = useState(false)
    // console.log("page", page)
    //const { active_category_tab } = router.query
    const active_category_tab = ''
    const [tokens_list, set_tokens_list] = useState(list_data ? list_data:[]) 
    const [currentPage, setCurrentPage] = useState(page ? page:0)
    const [per_page_count, set_per_page_count] = useState(per_page_limit)
    const [pageCount, setPageCount] = useState(pages_count)
    const [sl_no, set_sl_no]=useState(first_count)
    const [firstcount, setfirstcount] = useState(first_count)
    const [finalcount, setfinalcount] = useState(final_count)
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
    const [count, setCount]=useState(list_count ? list_count:0)
    const [loader_status, set_loader_status] = useState(false)
    const [all_tab_status, set_all_tab_status] = useState((active_category_tab > 0) ? 0 : 1)
    const [watchlist_tab_status, set_watchlist_tab_status] = useState("")
    const [search_title, set_search_title] = useState("")
    const [category_list, set_category_list] = useState([]) 
    const [category_id, set_category_id] = useState("") 
    const [other_category_list, set_other_category_list] = useState([]) 
    const [category_name, set_category_name] = useState("")
    const [search_category_value, set_search_category_value] = useState("")
    const [category_status, set_category_status] = useState(false)
    const [searchParam]=useState(["category_name"])
    const [total_marketcap, set_total_marketcap] = useState("")
    const [total_change_24h, set_total_change_24h] = useState("")

    const [active_airdrops, set_active_airdrops] = useState("")
    const [active_launchpads, set_active_launchpads] = useState("")
    const [upcoming_airdrops, set_upcoming_airdrops] = useState("")
    const [upcoming_launchpads, set_upcoming_launchpads] = useState("")
    const [total_categories, set_total_categories] = useState("")
    const [airdrops_list, set_airdrops_list] = useState([])
    const [launchpads_list, set_launchpads_list] = useState([])
    const [gainers_category_list, set_gainers_category_list] = useState([])
    
    const [modal_data, set_modal_data] = useState({icon:"", title:"", content:""})
    
    const [user_token, set_user_token] = useState(userAgent.user_token? userAgent.user_token:"");
    const [login_modal_status, set_login_modal_status] = useState(false)
    const [request_config, set_request_config] = useState(config(userAgent.user_token ? userAgent.user_token : ""))
    const [action_row_id, set_action_row_id] = useState("")

    const [wish_of_the_day] = useState(getGoodWishOfDay())
    

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
      if(userData.token)
      {
        actionAfterMenuLogin(userData)
      }

      
    }, [userData.token]);

    const actionAfterMenuLogin = async (pass_data) =>
    {
      await tokensList({selected : 0}, 1)
      await set_user_token(pass_data.token)
      await set_request_config(pass_data.token)
    }

    const getDataFromChild = async (pass_object) => 
    {
      await set_login_modal_status(false)
      await set_user_token(JsCookie.get("user_token"))
      await set_request_config(JsCookie.get("user_token"))
        if(action_row_id){
        await addToWatchlist(action_row_id)
        }
        else{
          tokensList({selected : 0}, 1)
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

    useEffect(()=>
    { 
      getCategoryList()
      getMarketsOverview()
      getOverviewDetails()
      if(unsubscribe && code)
      {
        unsubscribeEmail({unsubscribe, code})
      }
    },[]) 

    const unsubscribeEmail = async ({unsubscribe, code}) =>
    {
      set_modal_data({icon:"", title:"", content:""})
      const res = await Axios.get(API_BASE_URL + "markets/subscribe/email_unsubscribe/"+unsubscribe , config(code))
      if(res.data)
      {
        if(res.data.status)
        {
          set_modal_data({icon: "/assets/img/update-successful.png", title: "Thank You!", content: res.data.message.alert_message})
          router.push('/')
        }
        else
        {
          if(res.data.message.alert_message)
          { 
            set_modal_data({icon: "", title: "Already Removed", content: res.data.message.alert_message})
            router.push('/')
          }
        }
      }
    }

    useEffect(()=>
    {  
        if(!is_client)
        {
          set_is_client(true)
        }
        else
        {
        // set_sl_no(0)
        // setfirstcount(1)
        // setCurrentPage(0)
          tokensList({selected : 0}, 1)
          router.push('/')
        }
       
        let handler = (e) => 
        {
          if (!category_ref?.current?.contains(e.target)) {
            set_category_status(false)
          }
        }

        document.addEventListener("mousedown", handler)

          // return () => {
          //     document.removeEventListener("mousedown", handler)
          // }
    },[per_page_count, search_title, category_id]) 


    const getOverviewDetails = () => 
    {
      Axios.get(API_BASE_URL + "markets/cryptocurrency/home_overview/" , request_config)
      .then(res => 
      {
        if(res.data.status) 
        {
          set_total_marketcap(res.data.message.total_marketcap)
          set_total_change_24h(res.data.message.total_change_24h)

          set_active_airdrops(res.data.message.active_airdrops)
          set_active_launchpads(res.data.message.active_launchpads)
          set_upcoming_airdrops(res.data.message.upcoming_airdrops)
          set_upcoming_launchpads(res.data.message.upcoming_launchpads)
          set_total_categories(res.data.message.total_categories)
        }
      })
    }

    
    const getMarketsOverview = () => 
    {
      Axios.get(API_BASE_URL + "markets/cryptocurrency/markets_overview" , request_config).then(res => 
      {
        if(res.data.status) 
        {
          set_airdrops_list(res.data.message.airdrops_list)
          set_launchpads_list(res.data.message.launchpads_list)
          set_gainers_category_list(res.data.message.gainers_category_list)
          
          // console.log("MarketsOverview", res.data)
        }
      })
    }


    const getCategoryList = () =>
    {  
        Axios.get(API_BASE_URL+"markets/cryptocurrency/unique_categories", request_config).then(res=>
        { 
            if(res.data)
            {      
                set_category_list(res.data.message)
                set_other_category_list(res.data.message)
                // otherUniqueCategory(res.data.other_array)
            } 
        })
    }

    const otherUniqueCategory = (res) =>
    {  
        var listData = res
        var list = []
        for(let i of listData)
        {
            list.push({value: i.category_id, label: i.category_name})  
        }
        set_other_category_list(list)
    }

const searchTags = (param_value) => 
{
   set_search_category_value(param_value)
    if (param_value) {
      var searched_list = other_category_list.filter(
        // createFilter(param_value, ["category_name"])
        (item) => {
          return searchParam.some((newItem) => {
               return (
                   item[newItem]
                       .toString()
                       .toLowerCase()
                       .indexOf(param_value) > -1
                       
               )
           })
       }
      );
     set_category_list(searched_list);
     set_category_status(true);
    } else {
      set_category_list(other_category_list);
    }
    // console.log(param_value);
}

    const tokensList = async (page, pass_from) =>
    {  
        let current_pages = 0 
        if(page.selected) 
        {
            current_pages = ((page.selected) * per_page_count) 
        } 
        if(!pass_from)
        {
          myRef.current.scrollIntoView()
        }
        
        
        set_loader_status(true)  
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/list/"+current_pages+'/'+per_page_count+"?search="+search_title+"&category_id="+category_id, config(JsCookie.get('user_token')))
        if(res.data)
        {
            if(res.data.status === true)
            {    
                // console.log("res",res) 
                set_loader_status(false)
                set_tokens_list(res.data.message)
                setPageCount(Math.ceil(res.data.count/per_page_count))
                set_sl_no(current_pages+1)
                setCurrentPage(page.selected)
                setfirstcount(current_pages+1)
                setCount(res.data.count)
                // set_watchlist_status(res.da)
                //setfinalcount(parseInt(current_pages)+parseInt(per_page_count))
                const presentPage = page.selected+1
                const totalcompany = res.data.count
                var sadf = presentPage*per_page_count
                if((presentPage*per_page_count) > totalcompany)
                {
                sadf = totalcompany
                }
                const final_count=sadf
                setfinalcount(final_count)
                
            } 
        }
    }

    const addToWatchlist = async (param_token_id) =>
    {
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/add_to_watchlist/"+param_token_id, config(JsCookie.get('user_token')))
        if(res.data.status)
        {
          var list = []
          for(const i of tokens_list)
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
          set_tokens_list(list)

          
        }
        
        if(action_row_id)
        {
          await tokensList({selected : currentPage}, 1)
          await set_action_row_id("")
        }
    }
    
    const removeFromWatchlist = (param_token_id) =>
    {
      Axios.get(API_BASE_URL+"markets/cryptocurrency/remove_from_watchlist/"+param_token_id, config(JsCookie.get('user_token'))).then(res=>
      {
        if(res.data.status)
        {
          var list = []
          for(const i of tokens_list)
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
          set_tokens_list(list)
        }
      })
    }
        
    const set_all_tab_active=()=>
    {  
        set_watchlist_tab_status("")
        set_all_tab_status(1)
        set_category_id("")
        set_search_title("")
        tokensList({selected : 0})
    } 
    
    
    const closeCategory = () => 
    {
      set_category_id("")
      set_category_name("")
    } 

    const settings = {
      dots: true,
      speed: 500,
      slidesToShow: 3, // Number of items to show at a time
      slidesToScroll: 1,
      infinite: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: false,
            dots: true,
          },
        },
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            infinite: false,
            dots: true,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };

    
 
return (
   <>
      <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>Cryptocurrency Price Tracker | Live Prices, Charts, and News</title>
         <meta name="description" content="Discover real-time cryptocurrency prices and stay updated with the latest market trends. Unlock the potential of crypto market with our intuitive and reliable price tracking index."/>
         <meta name="keywords" content="Crypto price tracking, coinpedia markets, the crypto price today, bitcoin price, Ethereum price, live prices, top gainers in crypto, top losers crypto, trending coins, meme coins, defi coins, crypto price prediction, crypto price analysis." />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Cryptocurrency Price Tracker | Live Prices, Charts, and News" />
         <meta property="og:description" content="Discover real-time cryptocurrency prices and stay updated with the latest market trends. Unlock the potential of crypto market with our intuitive and reliable price tracking index." />
         <meta property="og:url" content={market_coinpedia_url} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="1200" />
         <meta property="og:image:height" content="1200" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="Cryptocurrency Price Tracker | Live Prices, Charts, and News" />
         <meta name="twitter:description" content="Discover real-time cryptocurrency prices and stay updated with the latest market trends. Unlock the potential of crypto market with our intuitive and reliable price tracking index." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url}/>
         
        <script type="application/ld+json"  
            dangerouslySetInnerHTML={{
              __html: `{
                "@context":"http://schema.org/",
                "@type":"Organization",
                "name":"Markets Coinpedia",
                "url":"https://markets.coinpedia.org",
                "logo":"http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
                "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
              }`,
            }}
        />

        <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Cryptocurrency Prices Today"}`,
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
                }
              ]
            }`,
          }}
        />

   
      </Head>

      {/* <div className="page new_markets_index min_height_page markets_new_design"   */}
      <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}>
      <div className="market-page">
       


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className='col-md-12'>
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6 ">
                {/* Live cry­pto­currency prices
                <p>Global market cap today: $ 1.38 trillion high value <img src="/assets/img/markets/high-value.png" alt="high value"/><span className="color-green">10.02%</span> in 24 hrs.</p> */}
                  

                  <h1 className="page_title" style={{textTransform: "capitalize"}}>{wish_of_the_day}, {userData.full_name ? userData.full_name:"Crypto"}</h1>
                  {
                    total_marketcap ? 
                    <p>Total market cap today is {shortConvertCurrency(total_marketcap)} with {
                      total_change_24h > 0 ?
                      <span className="color-green">{total_change_24h}%</span>
                      :
                      <span className="color-red">{total_change_24h}%</span>
                    } in 24 hrs </p>
                    :
                    <p>Total market cap today is __ with __% in 24 hrs</p>
                  }
                 
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4 " >
                  <Search_token /> 
                </div>
              </div>

              <div className='markets_overview_mobile'>
                <Slider {...settings}>
                    <div className='market-overview'>
                      <h5 className='overview-title'>
                        <img src="/assets/img/market_index.svg" className="market_overview_icon" /> 
                        Markets Index
                        
                        <Link href="/categories"><img src="/assets/img/next-dark.svg"  className="media-object arrow-img market-overview-next " /></Link>  
                        {
                          total_categories ?
                          <Link href="/categories"><span className='category'>{total_categories} Categories</span></Link>
                          :
                          ""
                        }
                      </h5>
                    
                      <table class="market_overview_table">
                        <tbody>
                          {
                            gainers_category_list.length ?
                            gainers_category_list.map((item, i) =>
                              <tr>
                                <td>
                                  <div className="media">
                                    <div className="media-left align-self-center mr-4">
                                      <b>{++i}</b>
                                    </div>
                                    <div className="media-body align-self-center">
                                      <h6 className="media-heading token-name"><Link href={"/category/"+item.category_id}>{strLenTrim(item.category_name, 20)}</Link></h6>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="media-right ">
                                    <h6 className="media-heading token-name"><span className='category-percent'>{(((item.total_gainers*100)/item.total_tokens)).toFixed(0)}%</span></h6>
                                  </div>
                                </td>
                                <td>
                                  <div className="media-right ">
                                    <h6 className="media-heading token-name">Gainers</h6>
                                  </div>
                                </td>
                              </tr>
                              // <li>
                              //   <Link href={"/category/"+item.category_id}> 
                                
                              //   </Link>
                              // </li> 
                            )
                            :
                            ""
                          }
                        </tbody>
                      </table>
                    </div>        
                  
                    <div className='market-overview '>
                      
                      <h5 className='overview-title'>
                        <img src="/assets/img/airdrops.svg" className="market_overview_icon" /> 
                        Airdrops
                        <Link href="/airdrops"><img src="/assets/img/next-dark.svg"  className="media-object arrow-img market-overview-next " /></Link>  
                        {
                          active_airdrops ?
                          <Link href="/airdrops"><span className='category'>{active_airdrops} Live</span> </Link>
                          :
                          ""
                        }

                        {
                          upcoming_airdrops ?
                          <Link href="/airdrops/upcoming"><span className='category'>{upcoming_airdrops} Upcoming</span></Link>
                          :
                          ""
                        }

                        
                      </h5>

                      <table class="market_overview_table">
                        <tbody>
                          {
                            airdrops_list.length ?
                            airdrops_list.map((item, i) =>
                            <tr>
                              <td>
                                <Link href={"/"+item.token_id+"?tab=airdrop&tab_id="+item._id}>
                                  <div className="media">
                                    <div className="media-left align-self-center">
                                      <img src={(item.token_image ? image_base_url+item.token_image: item.coinmarketcap_id ? cmc_image_base_url+item.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.token_name}  className="media-object token-img" />
                                    </div>
                                    <div className="media-body align-self-center">
                                      <h6 className="media-heading token-name">{strLenTrim(item.token_name, 20)}</h6>
                                      {/* <p className='token-symbol'>{(item.symbol).toUpperCase()}</p> */}
                                    </div>
                                    <div className="media-right ">
                                    <h6 className="media-heading token-name">{convertCurrency(item.winner_price)}
                                    {/* <img src="/assets/img/right-arrow.png" alt={item.token_name}  className="media-object arrow-img" /> */}
                                  
                                    </h6>
                                    </div>
                                  </div>
                                </Link>  
                              </td>
                            </tr>
                            )
                            :
                            ""
                          } 
                        </tbody>
                      </table>
                      
                    </div>
                  
                    <div className='market-overview'>
                      <h5 className='overview-title'>
                        <img src="/assets/img/launchpads.svg" className="market_overview_icon" /> 
                        Launchpads
                        <Link href="/launchpad"><img src="/assets/img/next-dark.svg"  className="media-object arrow-img market-overview-next " /></Link>
                        {
                          active_launchpads ?
                          <Link href="/launchpad"><span className='category'>{active_launchpads} Live</span></Link>
                          :
                          ""
                        }
                        
                        {
                          upcoming_launchpads ?
                          <Link href="/launchpad/upcoming"><span className='category'>{upcoming_launchpads} Upcoming</span></Link>
                          :
                          ""
                        }

                        
                      </h5>  
                      <table class="market_overview_table">
                        <tbody>
                          {
                            launchpads_list.length ?
                            launchpads_list.map((item, i) =>
                            <tr>
                              <td>
                                <Link href={"/"+item.token_id+"?tab=airdrop&tab_id="+item._id}>
                                  <div className="media">
                                    <div className="media-left align-self-center">
                                      <img src={(item.token_image ? image_base_url+item.token_image: item.coinmarketcap_id ? cmc_image_base_url+item.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.token_name}  className="media-object token-img" />
                                    </div>
                                    <div className="media-body align-self-center">
                                      <h6 className="media-heading token-name">{strLenTrim(item.token_name, 20)}</h6>
                                    </div>
                                  </div>
                                </Link>  
                              </td>
                              <td>
                                <div className="media-right ">
                                  <h6 className="media-heading token-name">{getLaunchpadType(item.launchpad_type)}
                                  {/* <img src="/assets/img/right-arrow.png" onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.token_name}  className="media-object arrow-img" /> */}
                                  
                                  </h6>
                                </div>
                              </td>
                            </tr>
                            // <ul className="airdrops-list">
                            //     <li>
                            //         <Link href={"/"+item.token_id+"?tab=ico&tab_id="+item._id}>
                                      
                            //         </Link>

                                    
                            //     </li>
                            // </ul>
                            )
                            :
                            ""
                          } 
                        </tbody>
                      </table>
                    </div>
                </Slider>
              </div>

              <div>
                <div className="all-categories-list ">
                  <CategoriesTab active_tab={1} user_token={user_token}/>  
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ................ */}
        
        <div className="container price-tracking-tbl">
          <div className="col-md-12">
            <div className="prices transaction_table_block">
              <div className="row">
                <div className="col-md-12 col-12">
                  <div className="row">
                    <div className="col-md-12 col-lg-6 col-12">
                      <h4 className="markets_subtitle">Price Tracking</h4>
                    </div>
                    <div className="col-md-12 col-lg-6 col-12 filter-category-section">
                      <div className="row">
                        <div className="col-md-6 col-6 col-sm-6">
                          <div className="cust_filters_dropdown" ref={category_ref}>
                            <div className="cust_filter_input">
                              {
                                !category_id ?
                                <div className="input-group" onClick={()=>set_category_status(!category_status)} >
                                    <input onChange={(e)=> searchTags(e.target.value)} autoComplete='off'  type="text" className="form-control " placeholder="Select Category" />
                                    <span className="input-group-addon lightmode_image">
                                      <img src="/assets/img/filter_dropdown.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                    </span>
                                    <span className="input-group-addon darkmode_image">
                                      <img src="/assets/img/filter_dropdown_grey.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                    </span>
                                </div>
                                :
                                <div className="markets_selected_category">
                                  <p>{category_name}</p>
                                  <div className="input-group-addon close_category_icon" onClick={()=>closeCategory()}>
                                    <img src="/assets/img/close_mark.png" alt="Close"/>
                                  </div>
                                </div>  
                              }
                            </div>
                            {
                              category_status ?
                              <ul className="cust_filter_result">
                                {
                                  category_list.length ?
                                  category_list.map((item, i) =>
                                    <li onClick={()=>{
                                      set_category_id(item._id)
                                      set_category_name(item.category_name)
                                      set_category_status(false)
                                    }
                                  }> {item.category_name} </li>
                                  )
                                  :
                                  ""
                                }
                              </ul>
                              :
                              ""
                            }
                            
                          </div>
                          


                          {/* <Select
                          onChange={handleChange}
                          options={other_category_list}
                          placeholder={category_name?category_name:'Select  Category'}
                          value={category_name}
                          />  */}
                        </div>
                    
                        <div className="col-md-6 col-6 col-sm-6">
                          <div className="input-group search_filter">
                            <div className="input-group-prepend ">
                              <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                            </div>
                            <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Coin/Token" />
                          </div> 
                        </div>

                        {/* <div className="col-md-2 col-6 mobile_hide_view">
                          <ul className="filter_rows">
                              <li>
                                <select className="form-select" onChange={(e)=>set_per_page_count(e.target.value)} >
                                  <option value="" disabled>Show Rows</option>
                                  <option value={100}>100</option>
                                  <option value={50}>50</option>
                                  <option value={20}>20</option>
                                </select>
                              </li>
                          </ul>
                        </div> */}
                      </div>
                    </div>     
                </div>   
              </div>
                  
                
              </div>
              <div className="market_page_data">
                    <div className="table-responsive">
                          {
                          !loader_status ?
                          <table className="table table-borderless">
                          <thead>
                          <tr>
                              <th className="mobile_fixed_first" style={{minWidth: '35px'}}></th>
                              <th className="mobile_hide_view" style={{minWidth: '35px'}}>#</th>
                              <th className="mobile_fixed rank_class table-cell-shadow-right">Name</th>
                              <th className="">Price</th>
                              <th className="" style={{minWidth: 'unset'}}>1h</th>
                              <th className="" style={{minWidth: 'unset'}}>24h</th>
                              <th className="" style={{minWidth: 'unset'}}>7d</th>
                              <th className="table_circulating_supply">Market Cap&nbsp;
                                <OverlayTrigger
                                  delay={{ hide: 450, show: 300 }}
                                  overlay={(props) => (
                                    <Tooltip {...props} className="custom_pophover">
                                      <p>Market capitalization is a measure used to determine the total value of a publicly traded cryptocurrency. It is calculated by multiplying the current market price of a single coin/token X total supply of the coin/token.</p>
                                    </Tooltip>
                                  )}
                                  placement="bottom"
                                ><span className='info_col' ><img src="/assets/img/info.png"  alt="info"/></span>
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
                                ><span className='info_col' ><img src="/assets/img/info.png"  alt="info"/></span>
                                </OverlayTrigger>
                              </th>  
                              <th className="table_circulating_supply">Circulating Supply&nbsp;
                                <OverlayTrigger
                                  delay={{ hide: 450, show: 300 }}
                                  overlay={(props) => (
                                    <Tooltip {...props} className="custom_pophover">
                                      <p>Circulating supply refers to the total number of coins/tokens that are currently in circulation and available to the public. It represents the portion of the total supply of a cryptocurrency that is actively being traded or held by investors.</p>
                                    </Tooltip>
                                  )}
                                  placement="bottom"
                                ><span className='info_col' ><img src="/assets/img/info.png"  alt="info"/></span>
                                </OverlayTrigger>
                              </th>  
                              <th className="last_data">Last 7 Days</th>
                          </tr>
                        </thead>
                        <tbody>
                          {
                            tokens_list.length > 0 ?
                            tokens_list.map((e, i) => 
                            <tr key={i+12333}>
                                 <td className="mobile_fixed_first">
                                    {
                                      user_token ?
                                      <>
                                      {
                                        e.watchlist_status== true ?
                                        <span onClick={()=>removeFromWatchlist(e._id)} ><img src=" /assets/img/wishlist_star_selected.svg" alt="Watchlist" width={17} height={17} /></span>
                                        :
                                        <span onClick={()=>addToWatchlist(e._id)} ><img src="/assets/img/star.svg" alt="Watchlist" width={17} height={17} /></span>
                                      }
                                      </>
                                      :
                                      <span className='login-watchlist' onClick={()=>loginModalStatus(e._id)}><img src="/assets/img/star.svg" alt="Watchlist"/></span>
                                    }
                                  </td>
                                  <td className="mobile_hide_view mobile_td_fixed wishlist">{sl_no+i}</td>
                                  <td className="mobile_fixed table-cell-shadow-right">
                                    <Link href={"/"+e.token_id}>
                                      <div className="media">
                                        <div className="media-left align-self-center">
                                          <img src={(e.token_image ? image_base_url+e.token_image: e.coinmarketcap_id ? cmc_image_base_url+e.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                        </div>
                                        <div className="media-body align-self-center">
                                          <h4 className="media-heading">{strLenTrim(e.token_name, 14)} </h4>
                                          <p>{(e.symbol).toUpperCase()}</p>
                                        </div>
                                      </div> 
                                    </Link>
                                  </td> 
                                  
                                  <td className='market_list_price'> 
                                    <Link href={"/"+e.token_id}>
                                      
                                        {e.price ? 
                                        <>
                                        <span className="block_price"> {convertCurrency(e.price)}</span>
                                       
                                        {
                                          is_client ? 
                                          moment(e.updated_on).fromNow()
                                          :
                                          ""
                                        }
                                        </>
                                        :
                                        "-"
                                        }
                                        
                                
                                    </Link>
                                  </td>
                                
                                  <td className=" ">
                                    <Link href={"/"+e.token_id}>
                                      {
                                    e.percent_change_1h?e.percent_change_1h>0?
                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_1h.toFixed(2)+"%"}</span></h6>
                                    :
                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                    :
                                    ""
                                    }
                                    {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>1.05%</span></h6> */}
                                    </Link>
                                  </td>
            
                                  <td className=" ">
                                    <Link href={"/"+e.token_id}>
                                    {
                                    e.percent_change_24h?e.percent_change_24h>0?
                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                    :
                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                    :
                                    ""
                                    }
                                    </Link>
                                  </td>

                                  <td className=" ">
                                    <Link href={"/"+e.token_id}>
                                    {
                                    e.percent_change_7d?e.percent_change_7d>0?
                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_7d.toFixed(2)+"%"}</span></h6>
                                    :
                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                    :
                                    ""
                                    }
                                    {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>1.05%</span></h6> */}
                                    </Link>
                                  </td>

                                  <td className=" ">
                                    <Link href={"/"+e.token_id}>
                                    {e.circulating_supply ? convertCurrency(e.circulating_supply*e.price): ""}
                                    </Link>
                                  </td>  
                                  
                                  <td className=" ">
                                    <Link href={"/"+e.token_id}>
                                    {e.volume ?convertCurrency(e.volume) : ""}
                                    </Link>
                                  </td>

                                  <td className=" ">
                                    <div className='circulating-supply'>
                                    <Link href={"/"+e.token_id}>
                                      {e.circulating_supply ? separator((e.circulating_supply).toFixed(0))+" "+(e.symbol).toUpperCase() : ""}
                                      </Link>
                                    </div>
                                  </td> 

                                  <td className=" ">
                                    {
                                      e.coinmarketcap_id ?
                                      <img className={e.percent_change_7d>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} style={{width:"170px"}} height="100%"/>
                                      :
                                      ""
                                    }
                                  </td>
                              </tr> 
                            ) 
                            :
                            <tr >
                              <td className="text-lg-center text-md-left" colSpan="12">
                                  Sorry, No related data found.
                              </td>
                            </tr>
                            }
                           </tbody>
                           </table>
                            :
                            <table className="table table-borderless">
                              <thead>
                                <tr>
                                  <th className="mobile_fixed_first" style={{minWidth: '35px'}}></th>
                                  <th className="mobile_fixed rank_class table-cell-shadow-right">Name</th>
                                  <th className="">Price</th>
                                  <th className="" style={{minWidth: 'unset'}}>1h</th>
                                  <th className="" style={{minWidth: 'unset'}}>24h</th>
                                  <th className="hide_in_mobile" style={{minWidth: 'unset'}}>7d</th>
                                  <th className="table_circulating_supply hide_in_mobile">Market Cap
                                  </th> 
                                  <th className="volume_24h hide_in_mobile">Volume(24H)
                                  </th>  
                                  <th className="table_circulating_supply hide_in_mobile">Circulating Supply&nbsp;
                                    
                                  </th>  
                                    <th className="last_data hide_in_mobile">Last 7 Days</th>
                                      
                                    </tr>
                              </thead>
                              <tbody>
                              <TableContentLoader row="10" col="11" /> 
                              </tbody>
                              </table> 
                        }
                          
                       
                      
                    </div>
                  </div> 
              

              <div className="col-md-12">
                    <div className="pagination_block">
                      <div className="row">
                        <div className="col-lg-3 col-md-3  col-sm-3 col-12">
                            <p className="page_range">{firstcount}-{finalcount} of {pageCount} Pages</p>
                        </div>
                        {
                          count > per_page_count?
                        <div className="col-lg-9 col-md-9 col-sm-9 col-12">
                          <div className="pagination_div">
                            <div className="pagination_element">
                              <div className="pager__list pagination_element"> 
                                <ReactPaginate 
                                  activeClassName={"active"}
                                  previousLabel={currentPage+1 !== 1 ? "←" : ""}
                                  nextLabel={currentPage+1 !== pageCount ? " →" : ""} 
                                  onPageChange={tokensList}
                                  pageCount={pageCount}
                                  renderOnZeroPageCount={null}
                                  breakLabel={"..."}
                                  breakClassName={"break-me"}
                                  marginPagesDisplayed={2} 
                                  containerClassName={"pagination"}
                                  subContainerClassName={"pages pagination"}
                                  hrefBuilder={(page, pageCount) =>
                                    (page > 1 && page <= pageCount) ? market_coinpedia_url+`?page=${page}` : market_coinpedia_url
                                  }
                                  // hrefAllControls
                                  forcePage={currentPage}
                                  onClick={(clickEvent) => 
                                  {
                                    // console.log("clickEvent", clickEvent)
                                    if(clickEvent.nextSelectedPage)
                                    {
                                      if(clickEvent.nextSelectedPage > 0)
                                      {
                                        router.push('/?page='+(clickEvent.nextSelectedPage+1))
                                      }
                                      else
                                      {
                                        router.push('/')  
                                      }
                                    }
                                    else
                                    {
                                      router.push('/')
                                    }
                                  }}
                                  />
                              </div> 
                            </div>
                          </div>
                        </div>
                        :
                        ""
                        }
                      </div>
                    </div>
                  </div>




                {/* {
                  alltokens > 10
                  ? 
                  <div className="pager__list pagination_element"> 
                    <ReactPaginate 
                      previousLabel={selectedPage+1 !== 1 ? "Previous" : ""}
                      nextLabel={selectedPage+1 !== pageCount ? "Next" : ""}
                      breakLabel={"..."}
                      breakClassName={"break-me"}
                      forcePage={selectedPage}
                      pageCount={pageCount}
                      marginPagesDisplayed={2} 
                      onPageChange={handlePageClick}
                      containerClassName={"pagination"}
                      subContainerClassName={"pages pagination"}
                      activeClassName={"active"} />
                  </div> 
                  :
                  null
                }  */}
            </div>
          </div>
        </div>
      </div>

    </div>
    {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
    { modal_data.title ? <Popupmodal name={modal_data} />:null }
</>
)
} 



export async function getServerSideProps({req, query}) 
{
   const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
   var user_token = userAgent.user_token ? userAgent.user_token : ""
   const page = query.page > 0 ? query.page-1 : 0
   const per_page_limit = 100
   var current_page = page ? page*per_page_limit:0
   var pages_count = 0
   var final_count = 0
   var first_count = 0 
   var unsubscribe = query.unsubscribe ? query.unsubscribe:""
   var code = query.code ? query.code:""

   const tokenQuery = await fetch(API_BASE_URL + "markets/cryptocurrency/list/"+current_page+'/'+per_page_limit, config(userAgent.user_token))
   if(tokenQuery) 
   {
    const tokenQueryRun = await tokenQuery.json()
    if(tokenQueryRun.status)
    {
      pages_count = (Math.ceil(tokenQueryRun.count/per_page_limit))
      first_count = (current_page+1)
      
      const presentPage = page+1
      const totalcompany = tokenQueryRun.count
      final_count = presentPage*per_page_limit
      if((presentPage*per_page_limit) > totalcompany)
      {
        final_count = totalcompany
      }
      
      return { props: {list_data: tokenQueryRun.message, list_count: tokenQueryRun.count, final_count, pages_count, first_count, userAgent:userAgent, page:page, per_page_limit:per_page_limit, user_token:user_token, unsubscribe, code}}
    }
    else
    {
      if(current_page)
      {
        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        }
      }
      else
      {
        return { props: {list_data:[], list_count: 0, userAgent:userAgent, final_count, pages_count, first_count, page:page, per_page_limit:per_page_limit, user_token:user_token}}
      }
    }
  }
  else
  {
    return { props: {list_data:[], list_count: 0, userAgent:userAgent, final_count, pages_count, first_count, page:page, per_page_limit:per_page_limit, user_token:user_token}}
  }

}