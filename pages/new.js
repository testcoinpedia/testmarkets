import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import SearchContractAddress from '../components/search_token'
import CategoriesTab from '../components/categoriesTabs'
import TableContentLoader from '../components/loaders/tableLoader'
import LoginModal from '../components/layouts/auth/loginModal'
import moment from 'moment'
import JsCookie from "js-cookie"
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

// import Select from 'react-select'
import { useRouter } from 'next/navigation'

export default function Companies({userAgent})
{ 
    const router = useRouter()
    const myRef = useRef(null)
    //const { active_category_tab } = router.query
    const active_category_tab = ''
    const [tokens_list, set_tokens_list] = useState([]) 
    const [voting_ids, setvoting_ids] = useState([])  // commented
    const [watchlist, set_watchlist] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [per_page_count, set_per_page_count] = useState(100)
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
    
    const [user_token, set_user_token] = useState(userAgent.user_token? userAgent.user_token:"");
    const [login_modal_status, set_login_modal_status] = useState(false)
    const [request_config, set_request_config] = useState(config(userAgent.user_token ? userAgent.user_token : ""))
    const [action_row_id, set_action_row_id] = useState("")
   

    const getDataFromChild = async (pass_object) => 
    {
      await set_login_modal_status(false)
      await set_user_token(JsCookie.get("user_token"))
      await set_request_config(JsCookie.get("user_token"))
      await addToWatchlist(action_row_id)
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
      tokensList({selected : 0}, 1)
    },[per_page_count, search_title]) 

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

        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/new_tokens/"+current_pages+'/'+per_page_count+"?search="+search_title+"&category_row_id="+category_row_id, config(JsCookie.get('user_token')))
        if(res.data)
        {
            if(res.data.status === true)
            {    
                console.log("res",res) 
                set_loader_status(true)
                set_tokens_list(res.data.message)
                setPageCount(Math.ceil(res.data.count/per_page_count))
                set_sl_no(current_pages)
                setCurrentPage(page.selected)
                setfirstcount(current_pages+1)
                setCount(res.data.count)
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

    
   
return (
   <>
      <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>New Coins On CoinPedia Markets</title>
         <meta name="description" content="Discover New crypto projects and dive into the world of new coins listed on Coinpedia Markets. Find news, launch details and more. "/>
         <meta name="keywords" content="new cryptocurrencies, coinpedia markets, bitcoin price, Ethereum price, live prices, top gainers in crypto, top losers crypto, trending coins, meme coins, defi coins, crypto price prediction, crypto price analysis." />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="New Coins On CoinPedia Markets" />
         <meta property="og:description" content="Discover New crypto projects and dive into the world of new coins listed on Coinpedia Markets. Find news, launch details and more. " />
         <meta property="og:url" content={market_coinpedia_url + "new/"} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="New Coins On CoinPedia Markets" />
         <meta name="twitter:description" content="Discover New crypto projects and dive into the world of new coins listed on Coinpedia Markets. Find news, launch details and more. " />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url + "new/"}/>

         <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"New Coins"}`,
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
                  "name": "New Coins",
                  "item": "https://markets.coinpedia.org/new/"
                }
              ]
            }`,
          }}
        />
      </Head>

      <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}>
      <div className="market-page">


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                <h1 className="page_title">New Coins Listed</h1>
                  {/* by Market Cap */}
                  <p>Recently added cryptocurrencies to the Coinpedia Markets price tracking</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4 " >
                  <SearchContractAddress /> 
                </div>
              </div>
             

<div>
<div className="all-categories-list">
  <CategoriesTab  active_tab={5} user_token={user_token}/> 
</div>

  </div>
</div>
</div>
</div>
        
          <div className="container price-tracking-tbl">
          <div className="col-md-12">
         
              <div className="prices transaction_table_block">
                <div className="row">
                  <div className="col-md-12 col-12">
                  <div className="row">
                  
                  <div className="col-md-12 col-lg-9 col-12">
                        <h4 className="markets_subtitle">New Coins</h4>
                      </div>
                      <div className="col-md-12 col-lg-3 col-12 filter-category-section">
                  
                  <div className='row'>
                          <div className='col-md-12 col-lg-12 col-12'>
                          <div className="input-group search_filter">
                              <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Token" />
                              <div className="input-group-prepend ">
                                  <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                                </div>
                              </div> 
                          </div>

                          {/* <div className="col-md-4 col-lg-4 col-4 mobile_hide_view">
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
                          </div>     */}
                        </div>
                        </div>
                 </div>   
                </div>
                   
                  
                </div>
                <div className="market_page_data new_token_page">
                     <div className="table-responsive">
                       <table className="table table-borderless">
                         <thead>
                            <tr>
                                <th className="mobile_fixed_first" style={{minWidth: '35px'}}></th>
                                <th className="mobile_hide_view" style={{minWidth: '35px'}}>#</th>
                                <th className="mobile_fixed table-cell-shadow-right name_col">Name</th>
                                <th className="">Price</th>
                                <th className="" style={{minWidth: 'unset'}}>24h</th>
                                <th className=" table_circulating_supply new_market_cap">Fully Diluted Market Cap&nbsp;
                                  <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>Market capitalization is a measure used to determine the total value of a publicly traded cryptocurrency. It is calculated by multiplying the current market price of a single coin/token X total supply of the coin/token.</p>

                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                  </OverlayTrigger>
                                </th> 
                                <th className="">Blockchain</th>
                                <th className=" " style={{minWidth: 'unset'}}>Total Supply</th>
                                
                                {/* <th className=" table_circulating_supply new_circulating_supply">Circulating Supply&nbsp;
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
                                </th>   */}
                                {/* <th className="last_data new_last_date">Last 7 Days</th> */}
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
                                     <td className="mobile_fixed table-cell-shadow-right name_col">
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
                                     {/* <td>{e.price === null? "-":"$"+ Number(e.price).toFixed(2)}</td> */}
                                     {/* <td>
                                       <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span>
                                     </td> */}
               
                                     <td className="market_list_price"> 
                                       <Link href={"/"+e.token_id}>
                                         {
                                            e.price ?
                                            <>
                                            <span className="block_price">{"$"+roundNumericValue(e.price)}</span>
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
                                        e.percent_change_24h?e.percent_change_24h>0?
                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                        :
                                        "-"
                                        }
                                       </Link>
                                     </td>

                                     <td >
                                      <div className='circulating-supply'>
                                        <Link href={"/"+e.token_id}>
                                        {e.fully_diluted_market_cap ? "$"+separator((e.fully_diluted_market_cap).toFixed(0)) : "-"}
                                        </Link>
                                      </div>
                                     </td>

                                     <td className=" wishlist"> 
                                        {
                                          e.list_type == 1 ?
                                          <p className='new-token-network'>
                                            Coin
                                          </p>
                                          :
                                          <>
                                          {
                                            e.networks ?
                                            <div className="media">
                                            <div className="media-left align-self-center" style={{width:"22px"}}>
                                              <img  style={{width:"22px"}} src={(e.networks.token_image ? image_base_url+e.networks.token_image: image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                            </div>
                                            <div className="media-body align-self-center" style={{marginLeft:"5px"}}>
                                              <p >{e.networks.network_name != 'BNB Smart Chain (BEP20)' ? e.networks.network_name:"BNB"} </p>
                                              
                                            </div>
                                          </div>
                                            :
                                            <p className='new-token-network'>Token</p>
                                          }
                                            
                                          </>
                                        }

                                      </td> 
                                     <td>
                                       <Link href={"/"+e.token_id}>
                                       {
                                          e.total_supply ?
                                          separator((e.total_supply).toFixed(0))
                                          :
                                          "-"
                                        }
                                        {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>1.05%</span></h6> */}
                                       </Link>
                                     </td>

                                      
                                     
                                    
                                   
                                      
                                     {/* <td className="mobile_hide_table_col">
                                        {
                                          e.coinmarketcap_id ?
                                          <img className={e.percent_change_7d>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} width="100%" height="100%"/>
                                          :
                                          "-"
                                        }
                                     </td>  */}
                                      
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
    

          <div className="modal" id="trending-modal">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
              
                <div className="modal-header">
              
                  <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" alt="Close"/></span></button>
                </div>
                
                <div className="modal-body">
          
                  <ul className="trending-tokens">
                    <li><img src="/assets/img/markets/trending.png" alt="trending"/> Trending Coin:</li>
                    <li><img src="/assets/img/markets/bitcoin.png" alt="bitcoin"/> Bitcoin (BTC) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">03.56%</span></li>
                    <li><img src="/assets/img/markets/arbitrum.png" alt="arbitrum"/> Arbitrum (ARB) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">04.06%</span></li>
                    <li><img src="/assets/img/markets/shiba.png" alt="shiba"/> Shiba (INU) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                    <li><img src="/assets/img/markets/ethereum.png" alt="ethereum"/> Ethereum (ETH) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">03.84%</span></li>
                    <li><img src="/assets/img/markets/dogecoin.png" alt="dogecoin"/> Dogecoin (DOGE) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                    <li><img src="/assets/img/markets/dogecoin.png" alt="dogecoin"/> Dogecoin (DOGE) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                  </ul>

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
