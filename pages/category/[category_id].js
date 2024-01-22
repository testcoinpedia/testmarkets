import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import { useSelector, useDispatch } from 'react-redux'
import SearchContractAddress from '../../components/search_token'
import CategoriesTab from '../../components/categoriesTabs'
import TableContentLoader from '../../components/loaders/tableLoader'
import moment from 'moment'
import LoginModal from '../../components/layouts/auth/loginModal'
import JsCookie from "js-cookie"
import WatchList from '../../components/watchlist'
import Select from 'react-select'
import { useRouter } from 'next/router'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function Companies({data, userAgent, category_id, errorCode})
{ 
   const { userData, active_currency } = useSelector(state => state)

    if(errorCode) { return <Error /> }
    const router = useRouter()
    const myRef = useRef(null)
    const { active_category_tab } = router.query
    const [tokens_list, set_tokens_list] = useState([]) 
    const [voting_ids, setvoting_ids] = useState([])
    const [watchlist, set_watchlist] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [per_page_count, set_per_page_count] = useState(100)
    const [pageCount, setPageCount] = useState(0)
    const [sl_no, set_sl_no]=useState(0)
    const [category, set_category]=useState(category_id)
    const [firstcount, setfirstcount] = useState(1)
    const [finalcount, setfinalcount] = useState(per_page_count)
    const [selectedPage, setSelectedPage] = useState(0) 
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
    const [count, setCount]=useState(0)
    const [loader_status, set_loader_status] = useState(false)
    const [watchlist_tab_status, set_watchlist_tab_status] = useState("")
    const [search_title, set_search_title] = useState("")  
    const [category_row_id] = useState(data._id)
    // console.log("data",data)

    const [user_token, set_user_token] = useState(userAgent.user_token? userAgent.user_token:"");
    const [login_modal_status, set_login_modal_status] = useState(false)
    const [request_config, set_request_config] = useState(config(userAgent.user_token ? userAgent.user_token : ""))
    const [action_row_id, set_action_row_id] = useState("")
   
   
    useEffect(() => 
    {
      if(userData.token)
      {
        actionAfterMenuLogin(userData)
      }
    }, [userData.token]);

    const actionAfterMenuLogin = async (pass_data) =>
    {
      await tokensList({selected : 0}, 1, data._id)
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
           tokensList({selected : 0}, 1, data._id)
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

   
    const convertCurrency = (token_price) =>
    {
      if(active_currency.currency_value)
      {
        return active_currency.currency_symbol+" "+roundNumericValue(token_price*(active_currency.currency_value))
      }
      else
      {
        return "$ "+roundNumericValue(token_price)
      }
    }


    useEffect(()=>
    {  
        tokensList({selected : 0}, 1, data._id)
    },[per_page_count, search_title, category, category_id]) 


    const tokensList = async (page, pass_from, pass_category_row_id) =>
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

        
        // myRef.current.scrollIntoView()
        set_loader_status(false)  
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/category_tokens/"+current_pages+'/'+per_page_count+"?search="+search_title+"&category_id="+pass_category_row_id, config(JsCookie.get('user_token')))
        if(res.data)
        { 
            if(res.data.status)
            {   
              set_loader_status(true)
              // console.log("res",res) 
              set_tokens_list(res.data.message)
              setPageCount(Math.ceil(res.data.count/per_page_count))
              set_sl_no(current_pages)
              setCurrentPage(page.selected)
              setfirstcount(current_pages+1)
              setCount(res.data.count)
              // set_category()
              // console.log(categ)
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
          await tokensList({selected : currentPage}, 1, data._id)
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



    const makeJobSchema=()=>
    {  
        return { 
            "@context":"http://schema.org/",
            "@type":"Organization",
            "name":data.category_name,
            "url":market_coinpedia_url+"category/"+category_id+"/",
            "logo":"http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
            "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        } 
    }
   
   
 
return (
    
   <>
      <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
         <title>{"See " + data.category_name + " Assets By Marketcap"}</title>
         <meta name="description" content={ "Discover the exciting world of "+ data.category_name +" Coins and tokens on CoinPedia Markets. Find new and trending "+ data.category_name +" coins."} />
         <meta name="keywords" content={data.category_name + "," + data.category_name + "tokens," + data.category_name +" coins, categories in crypto, crypto price tracking, coinpedia markets, bitcoin price, Ethereum price, live prices, top gainers in crypto, top losers crypto, trending coins, meme coins, defi coins, crypto price prediction, crypto price analysis." }/>
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content={"See " + data.category_name + " Assets By Marketcap"} />
         <meta property="og:description" content={ "Discover the exciting world of "+ data.category_name +" Coins and tokens on CoinPedia Markets. Find new and trending "+ data.category_name +" coins."} />
         <meta property="og:url" content={market_coinpedia_url+"category/"+category_id+"/"} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content={"See " + data.category_name + " Assets By Marketcap"} />
         <meta name="twitter:description" content={ "Discover the exciting world of "+ data.category_name +" Coins and tokens on CoinPedia Markets. Find new and trending "+ data.category_name +" coins."} />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url+"category/"+category_id+"/"}/>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
      {/* <div className="page new_markets_index min_height_page markets_new_design"> */}
      <div className="page new_markets_index min_height_page markets_new_design"  ref={myRef}>
      <div className="market-page">


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                  <h1 className="page_title">Explore {data.category_name} </h1>
                  <p>Track assets of this category as per market cap and volume.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4 " >
                  <SearchContractAddress /> 
                </div>
              </div>

              <div>
              <div className="all-categories-list">
                <CategoriesTab active_tab={category=="bnb-chain"?9:category=="defi"?10:""} user_token={user_token}/> 
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
                  <div className="col-md-12 col-lg-9 col-12">
                        <h4 className="markets_subtitle">Category</h4>
                      </div>
                      <div className="col-md-12 col-lg-3 col-12 filter-category-section">
                       <div className='row'>
                    <div className='col-md-12 col-lg-12 col-12'>
                          <div className="input-group search_filter">
                            <div className="input-group-prepend ">
                              <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                            </div>
                            <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Token" />
                          </div> 
                         
                          </div>

                          {/* <div className="col-md-4 col-lg-4 col-4 mobile_hide_view">
                            <ul className="filter_rows">
                                <li>
                                  <select className="form-select" onChange={(e)=>set_per_page_count(e.target.value)} >
                                  <option value={100}>100</option>
                                  <option value={50}>50</option>
                                  <option value={20}>20</option>
                                  </select>
                                </li>
                            </ul>
                          </div>      */}
                        </div></div>
                 </div>   
                </div>
                   
                  
                </div>
                <div className="market_page_data">
                     <div className="table-responsive">
                       <table className="table table-borderless">
                         <thead>
                            <tr>
                              
                            <th className="mobile_fixed_first" style={{minWidth: '35px'}}></th>
                                <th className="mobile_hide_view" style={{minWidth: '35px'}}>#</th>
                                <th className="mobile_fixed name_col table-cell-shadow-right">Name</th>
                                <th className="">Price</th>
                                <th className=" mobile_hide_table_col" style={{minWidth: 'unset'}}>1h</th>
                                <th className=" mobile_hide_table_col" style={{minWidth: 'unset'}}>24h</th>
                                <th className=" mobile_hide_table_col" style={{minWidth: 'unset'}}>7d</th>
                                <th className="mobile_hide_table_col table_circulating_supply">Market Cap&nbsp;
                                  <OverlayTrigger
                                   delay={{ hide: 450, show: 300 }}
                                    overlay={(props) => (
                                      <Tooltip {...props} className="custom_pophover">
                                        <p>Market capitalization is a measure used to determine the total value of a publicly traded cryptocurrency. It is calculated by multiplying the current market price of a single coin/token X total supply of the coin/token.</p>
                                      </Tooltip>
                                    )}
                                    placement="bottom"
                                  ><span className='info_col' ><img src="/assets/img/info.png" alt = "info" /></span>
                                  </OverlayTrigger>
                                </th> 
                                <th className="">Volume(24H)&nbsp;
                                  <OverlayTrigger
                                    // delay={{ hide: 450, show: 300 }}
                                    overlay={(props) => (
                                      <Tooltip {...props} className="custom_pophover">
                                       <p>The 24-hour volume, also known as trading volume or trading activity, refers to the total amount of a specific coin/token that has been bought and sold within a 24-hour period. It represents the total number of coins/tokens traded during that time frame.</p>
                                      </Tooltip>
                                    )}
                                    placement="bottom"
                                  ><span className='info_col' ><img src="/assets/img/info.png" alt = "info"  /></span>
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
                                  ><span className='info_col' ><img src="/assets/img/info.png"  alt = "info" /></span>
                                  </OverlayTrigger>
                                </th>  
                                <th className="last_data">Last 7 Days</th>
                            </tr>
                         </thead>
                         
   
                         <tbody>
                           {
                            loader_status ?
                           <>
                           {
                             tokens_list.length > 0
                             ?
                             tokens_list.map((e, i) => 
                             <tr key={i}>
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
                                    <td className="mobile_hide_view wishlist"> {sl_no+i+1}
                                    </td>
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
                                    
               
                                     <td className="market_list_price"> 
                                       <Link href={"/"+e.token_id}>
                                         <span className="block_price">{e.price ? convertCurrency(e.price) : ""}</span>
                                           {e.updated_on ? moment(e.updated_on).fromNow():null} 
                                         
                                         </Link>
                                    </td>
                                    
                                  
                                    <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                         {
                                        e.percent_change_1h?e.percent_change_1h>0?
                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_1h.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                        :
                                        "--"
                                        }
                                        {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>1.05%</span></h6> */}
                                       </Link>
                                     </td>
               
                                    <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                       {
                                        e.percent_change_24h?e.percent_change_24h>0?
                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                        :
                                        "--"
                                        }
                                       </Link>
                                     </td>

                                     <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                       {
                                        e.percent_change_7d?e.percent_change_7d>0?
                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_7d.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                        :
                                        "--"
                                        }
                                        {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>1.05%</span></h6> */}
                                       </Link>
                                     </td>

                                     <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                       {/* {e.circulating_supply ?"$"+separator((e.circulating_supply*e.price).toFixed(0)) : "-"} */}
                                       {e.circulating_supply ? convertCurrency(e.circulating_supply*e.price): " "}
                                       </Link>
                                     </td>  
                                     
                                     <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                        {e.volume ? convertCurrency(e.volume): " "}
                                       </Link>
                                     </td>

                                     <td className="mobile_hide_table_col">
                                      <div className='circulating-supply'>
                                      <Link href={"/"+e.token_id}>
                                       {e.circulating_supply ? separator((e.circulating_supply).toFixed(0))+" "+(e.symbol).toUpperCase() : "-"}
                                       {/* {e.circulating_supply ? convertCurrency(e.circulating_supply * e.price) : ` ${e.symbol.toUpperCase()}`} */}

                                       </Link>
                                      </div>
                                     </td>

                                     
                                      
                                     <td className="mobile_hide_table_col">
                                      <img className={e.percent_change_7d>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} width="100%" height="100%"/>
                                     </td> 
                               </tr> 
                             ) 
                             :
                             <tr >
                               <td className="text-lg-center text-md-left" colSpan="11">
                                   Sorry, No related data found.
                               </td>
                             </tr>
                           }
                             </>
                             :
                             <TableContentLoader row="10" col="11" />  
                          }
                           
                         </tbody>
                       </table>
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
                                    previousLabel={currentPage+1 !== 1 ? "←" : ""}
                                    nextLabel={currentPage+1 !== pageCount ? " →" : ""} 
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    forcePage={currentPage}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2} 
                                    onPageChange={tokensList}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"} />
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

                  
              </div>
            </div>
          </div>
      
      
      </div>
    </div>

    {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
</>
)
} 

//markets/cryptocurrency/individual_category/category_id
export async function getServerSideProps({query,req}) 
{
  const category_id = query.category_id
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  const user_token = userAgent.user_token ? userAgent.user_token : ""
  const tokenQuery = await fetch(API_BASE_URL + "markets/cryptocurrency/individual_category/" + category_id, config(userAgent.user_token))
  const tokenQueryRun = await tokenQuery.json()
  if(tokenQueryRun.status) 
  {
    return { props: { data: tokenQueryRun.message, user_token:user_token, errorCode: false, category_id: category_id, userAgent: userAgent, config: config(userAgent.user_token)} }
  }
  else 
  {
    return { props: { errorCode: true } }
  }
}