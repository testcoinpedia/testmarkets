import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'

import { useSelector, useDispatch } from 'react-redux'
import SearchContractAddress from '../components/search_token'
import CategoriesTab from '../components/categoriesTabs'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import JsCookie from "js-cookie"
import LoginModal from '../components/layouts/auth/loginModal'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

// import Select from 'react-select'
import { useRouter } from 'next/navigation'


export default function ETFBitcoin({userAgent , initialData })
{ 
    const { userData, active_currency } = useSelector(state => state)
    const router = useRouter()
    const myRef = useRef(null)
    //const { active_category_tab } = router.query
    const active_category_tab = ''
    const [etf_list, set_etf_list] = useState([]) 
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


    const [data, setData] = useState(initialData);



    useEffect(() => {
      // Fetch data on the client side (optional)
      const fetchData = async () => {
        try {
          const res = await Axios.get('/api/server');
          console.log("res", res)
          if(res)
        {
            if(res)
            {    
                // console.log("res",res) 
                set_loader_status(true)
                set_etf_list(res.data.pageProps.etfs)
                setPageCount(Math.ceil(res.data.count/per_page_count))
                setCurrentPage(page.selected)
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
          const newData = await res.json();
          setData(newData);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);


    const addToWatchlist = async (param_token_id) =>
    {
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/add_to_watchlist/"+param_token_id, config(JsCookie.get('user_token')))
        if(res.data.status)
        {
          var list = []
          for(const i of etf_list)
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
          set_etf_list(list)
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
          for(const i of etf_list)
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
          set_etf_list(list)
        }
      })
    } 


    console.log("etf_list", etf_list)

    
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
    
    
   
return (
   <>
      <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>Discover Latest Bitcoin ETF Trends with Coinpedia Markets </title>
         <meta name="description" content="Stay ahead in the cryptocurrency market with Coinpedia markets – your go-to Bitcoin ETF tracker. Explore real-time trends, trading volume, market capitalization, and fees. Stay informed about the Grayscale Bitcoin Trust (GBTC) ETF, empowering you to track market developments wherever you are."/>
         <meta name="keywords" content="Bitcoin ETF, Bitcoin ETF Tracker, Bitcoin investment, cryptocurrency ETF, Bitcoin price tracking, Bitcoin news, Bitcoin analysis, Bitcoin market trends, best Bitcoin ETFs, compare Bitcoin ETFs, best Bitcoin ETF for India, Bitcoin ETF vs Bitcoin futures, risks of Bitcoin ETFs" />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Discover Latest Bitcoin ETF Trends with Coinpedia Markets" />
         <meta property="og:description" content="Stay ahead in the cryptocurrency market with Coinpedia markets – your go-to Bitcoin ETF tracker. Explore real-time trends, trading volume, market capitalization, and fees. Stay informed about the Grayscale Bitcoin Trust (GBTC) ETF, empowering you to track market developments wherever you are." />
         <meta property="og:url" content={market_coinpedia_url + "ETF/"} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="Discover Latest Bitcoin ETF Trends with Coinpedia Markets" />
         <meta name="twitter:description" content="Stay ahead in the cryptocurrency market with Coinpedia markets – your go-to Bitcoin ETF tracker. Explore real-time trends, trading volume, market capitalization, and fees. Stay informed about the Grayscale Bitcoin Trust (GBTC) ETF, empowering you to track market developments wherever you are." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url + "ETF/"} />

         <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Trending Coins"}`,
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
                  "name": "Trending",
                  "item": "https://markets.coinpedia.org/trending/"
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
                <h1 className="page_title">Bitcoin ETF Tracker</h1>
                  {/* by Market Cap */}
                  <p>A Bitcoin Exchange-Traded Fund (ETF) Tracker is a tool or service designed to monitor and display real-time information regarding Bitcoin Exchange-Traded Funds. </p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4 " >
                  <SearchContractAddress /> 
                </div>
              </div>
             

<div>
<div className="all-categories-list">
  <CategoriesTab active_tab={10} user_token={user_token}/> 
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
                        <h4 className="markets_subtitle">Bitcoin ETF Tracker</h4>
                      </div>
                       <div className="col-md-12 col-lg-3 col-12 filter-category-section">
                       <div className='row'>
                    <div className='col-md-12 col-lg-12 col-12'>
                          <div className="input-group search_filter">
                            <div className="input-group-prepend ">
                              {/* <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                  */}
                            </div>
                            <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Coin/Token" />
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
                          </div>    */}
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
                                <th className="mobile_fixed table-cell-shadow-right name_col">Ticker</th>
                                <th>Issuer</th>
                                <th className='table-cell-shadow-right name_col'>ETF Name</th>
                                
                                <th className=" ">Price</th>
                                {/* <th className=" ">Price Change</th> */}
                                <th className="">Market Cap</th>
                                <th>Fee Waiver</th>
                                <th>Fee</th>
                                <th>AUM</th>
                                <th>24H Volume</th>
                                <th>Custodian</th>
                                <th>Status</th>
                                
                            </tr>
                         </thead>
                         
   
                         <tbody>
                           {
                            loader_status ?
                           <>
                           {
                             etf_list.length > 0
                             ?
                             etf_list.map((e, i) => 
                             <tr key={i}>
                                 
                                     <td className="mobile_fixed_first">
                                     
                                     {
                                        etf_list ?
                                          <>
                                          {
                                            e.watchlist_status== true ?
                                            <span onClick={()=>removeFromWatchlist(e.id)} ><img src=" /assets/img/wishlist_star_selected.svg" alt="Watchlist" width={17} height={17} /></span>
                                            :
                                            <span onClick={()=>addToWatchlist(e.id)} ><img src="/assets/img/star.svg" alt="Watchlist" width={17} height={17} /></span>
                                            }
                                          </>
                                          :
                                          ""
                                        //   <span className='login-watchlist' onClick={()=>loginModalStatus(e.id)}><img src="/assets/img/star.svg" alt="Watchlist"/></span>
                                      }
                                     
                                     </td>
                                    <td className="mobile_hide_view wishlist"> {sl_no+i+1}
                                    </td>


                                     <td className="mobile_fixed table-cell-shadow-right">
                                       <Link href="/">
                                         
                                          <div className="media">
                                            <div className="media-body align-self-center">
                                              <h4 className="media-heading">{e.ticker} </h4>
                                              {/* <p>{("BTC").toUpperCase()}</p> */}
                                            </div>
                                          </div> 
                                         
                                       </Link>
                                     </td> 

                                     <td>
                                        {e.issuer}
                                    </td>
                                    
               
                                     <td className="market_list_price"  style={{whiteSpace:"wrap"}}> 
                                      <Link href="/">
                                     {e.etfName}
                                      </Link>
                                    </td>

                                   
                                    
                                    <td className="btc_links_block">
                                    <Link href="/">
                                       $ {e.price}   <p className='price_change_btc'>
                                       {
                                        e.change?e.change>0?
                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.change.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.change.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                        :
                                        "--"
                                        }
                                       </p>
                                       </Link>
                                     </td>

                                     <td className='btc_links_block'>
                                        {e.marketCap ? convertCurrency(e.marketCap*e.price): "-"}
                                     </td>

                                     <td className='btc_links_block'>{e.feeWaiver}</td>
                                     <td className='btc_links_block'>{(e.fee * 100).toFixed(2)+"%"}</td>
                                     <td> {e.totalAssets ? convertCurrency(e.totalAssets): "-"}</td>
                                    
                                     <td> {e.volume ? convertCurrency(e.volume*e.price): "-"}</td>
                                    
                                     <td>{e.custodian ? e.custodian : "-"}</td>
                                     <td>  <p className='running_btc_market'>{e.status}</p></td>

               
                                    {/* <td className="price_change_btc">
                                    <Link href="/">
                                       +0.72
                                       </Link>
                                     
                                     </td> */}

                                     {/* <td className="mobile_hide_table_col">
                                     <Link href="/">
                                      {e.avgDailyVol}

                                       </Link>
                                     </td>

                                     <td className="mobile_hide_table_col">
                                     <Link href="/">
                                      {e.volume}

                                       </Link>
                                     </td>  
                                     
                                     <td className="mobile_hide_table_col">
                                     <Link href="/">
                                      {e.fee}

                                       </Link>
                                     </td>

                                     <td className="mobile_hide_table_col">
                                      <div className='circulating-supply'>
                                      <Link href="/">
                                        {e.totalAssets}

                                        </Link>
                                      </div>
                                     </td>
                                      
                                     <td >
                                     {e.totalAssets}
                                     </td>
                                     <td className='btc_links_block'>
                                     {e.marketCap}
                                    </td> 
                                     <td >
                                    {e.change}

                                     </td> 
                                     <td >
                                     {e.type}
                                     <p className='running_btc_market'>{e.status}</p>
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
                             <TableContentLoader row="10" col="14" />  
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
              
                  <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg"  alt = " Close"  /></span></button>
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
