import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import SearchContractAddress from '../components/search_token'
import CategoriesTab from '../components/categoriesTabs'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import WatchList from '../components/watchlist'
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
        tokensList({selected : 0}, 1)
    },[per_page_count, search_title, category_row_id]) 


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
        set_loader_status(false)  
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/categories/"+current_pages+'/'+per_page_count+"?search="+search_title, config)
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


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                  <h1 className="page_title">Trending Categories on CoinPedia Markets</h1>
                  <p>Find the most viewed and explored categories on Coinpedia markets today.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4 " >
                  <SearchContractAddress /> 
                </div>
              </div>
            <div>
            <div className="all-categories-list">
            <CategoriesTab active_tab={8} user_token={user_token}/> 
            </div>
              </div>
            </div>
          </div>
        </div>
        {/* ................ */}
        
          <div className="container price-tracking-tbl">
          <div className="col-md-12">
          <div className="row">
         
            <div className="col-md-3">
            </div> 
          </div>
           
              <div className="prices transaction_table_block">
                <div className="row">
                  <div className="col-md-12 col-12">
                  <div className="row">
                         <div className="col-md-12 col-lg-9 col-12">
                        <h4 className="markets_subtitle">Categories</h4>
                      </div>
                       <div className="col-md-12 col-lg-3 col-12 filter-category-section">
                       <div className='row'>
                      <div className='col-md-12 col-lg-12 col-12'>
                          <div className="input-group search_filter">
                            <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Category" />
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
                          </div>   */}
                          </div></div>
                 </div>   
                </div>
                   
                  
                </div>
                <div className="market_page_data categories_table new_token_page">
                     <div className="table-responsive">
                       <table className="table table-borderless">
                         <thead>
                            <tr>
                                <th className="mobile_hide_view" style={{minWidth: '15px'}}>#</th>
                                <th className="mobile_fixed_first table-cell-shadow-right">Category</th>
                                {/* <th className="">Title</th> */}
                                <th className="">Top Gainers</th>
                                <th className=""></th>
                                {/* <th className="mobile_hide_table_col" style={{minWidth: 'unset'}}>Tokens</th> */}
                                {/* <th className="mobile_hide_table_col" style={{minWidth: 'unset'}}>Total Gainers</th>
                                <th className="mobile_hide_table_col" style={{minWidth: 'unset'}}>Total losers</th> */}
                                <th className="" style={{minWidth: 'unset'}}>Gainers-Losers Number</th>
                                <th className=" ">Action</th>
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
                                    <td className="mobile_hide_view wishlist"> {sl_no+i+1}
                                    </td>
                                     <td className="mobile_fixed_first table-cell-shadow-right">
                                       <Link href={"/category/"+e.category_id}> 
                                          <div className="media">
                                            
                                            <div className="media-body align-self-center">
                                              <h4 className="media-heading">{e.category_name}</h4>
                                              <p style={{fontSize:"13px", fontWeight:"400"}}>{e.title}</p>
                                            </div>
                                          </div>  
                                       </Link>
                                     </td> 
                                    
                                     {/* <td className=""> 
                                       <Link href={"/category/"+e.category_id}> 
                                            {e.title}
                                        </Link>
                                    </td> */}

                                    <td>
                                      {
                                        e.token_gainer.length ?
                                        <Link href={"/"+e.token_gainer[0].token_id}>
                                            <div className="media">
                                              <div className="media-left">
                                                <img src={(e.token_gainer[0].token_image ? image_base_url+e.token_gainer[0].token_image: e.token_gainer[0].coinmarketcap_id ? cmc_image_base_url+e.token_gainer[0].coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_gainer[0].token_name} width="100%" height="100%" className="media-object" />
                                              </div>
                                              <div className="media-body">
                                                <h4 className="media-heading mt-0">{e.token_gainer[0].token_name} <span>({(e.token_gainer[0].symbol)?.toUpperCase()})</span></h4>
                                                {
                                                  e.token_gainer[0].percent_change_24h?
                                                  e.token_gainer[0].percent_change_24h>0?
                                                  <h6><span className="green"><img src="/assets/img/markets/high.png" alt="high price" style={{width:"10px"}}/>{e.token_gainer[0].percent_change_24h.toFixed(2)+"%"}</span></h6>
                                                  :
                                                  <h6><span className="red"><img src="/assets/img/markets/low.png" alt="Low price"  style={{width:"10px"}}/>{(e.token_gainer[0].percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                                  :
                                                  "--"
                                                }
                                              </div>
                                              </div>
                                        </Link>
                                        :
                                        "-"
                                      }
                                   
                                    </td>
                                    <td className='top_gainers_tab'>
                                      {
                                        e.token_gainer ?
                                          e.token_gainer.length > 1 ?
                                            e.token_gainer.map((item, i) =>
                                              i > 0 ?
                                              <Link href={"/"+item.token_id}>
                                                <img src={(item.token_image ? image_base_url+item.token_image: item.coinmarketcap_id ? cmc_image_base_url+item.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.token_name}  className="category-token-image" />
                                              </Link>
                                              :
                                              ""
                                            )
                                          :
                                          "-"
                                        :
                                        "-"
                                      }
                                     </td> 

                                     
    
                                    {/* <td className="mobile_hide_table_col">
                                       <Link href={"/category/"+e.category_id}> 
                                       {e.total_tokens}
                                        </Link>
                                     </td>

                                     <td className="mobile_hide_table_col">
                                       <Link href={"/category/"+e.category_id}> 
                                       {e.total_gainers}
                                        </Link>
                                     </td> */}
                                     

                                     <td className="mobile_hide_table_col">
                                       {/* <Link href={"/category/"+e.category_id}> 
                                       {e.total_tokens-e.total_gainers}
                                        </Link> */}
                                        <div style={{maxWidth:"177px"}}>
                                        <div className="progress gainer-progress">
                                            <div
                                                className="progress-bar progress-bar-success"
                                                role="progressbar"
                                                style={{ width: ((e.total_gainers*100)/e.total_tokens)+"%" }}
                                            >
                                                {/* {e.total_gainers} Gainers */}
                                            </div>
                                            <div
                                                className="progress-bar progress-bar-danger"
                                                role="progressbar"
                                                style={{ width: (100-((e.total_gainers*100)/e.total_tokens))+"%" }}
                                            >
                                                {/* {e.total_tokens-e.total_gainers} Losers */}
                                            </div>
                                            </div>
                                        <div>
                                            <span><strong>{e.total_gainers}</strong> <small>({((e.total_gainers*100)/e.total_tokens).toFixed(0)}%)</small></span>
                                            <span style={{float:"right"}}><strong>{e.total_tokens-e.total_gainers}</strong> <small>({(100-((e.total_gainers*100)/e.total_tokens)).toFixed(0)}%)</small></span>
                                        </div>
                                        </div>
                                     </td>
                                     <td className="mobile_hide_table_col">
                                       <Link href={"/category/"+e.category_id}> 
                                       <span className="market_list_price">
                                        <button className="vote_btn button_blue_transition">View</button>
                                        </span>
                                        </Link>
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
                             </>
                             :
                             <TableContentLoader row="10" col="6" />  
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
      

          <div className="modal" id="trending-modal">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
              
                <div className="modal-header">
              
                  <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" alt="Close" /></span></button>
                </div>
                
                <div className="modal-body">
          
                  <ul className="trending-tokens">
                    <li><img src="/assets/img/markets/trending.png" alt="trending"/> Trending Coin:</li>
                    <li><img src="/assets/img/markets/bitcoin.png" alt="bitcoin"/> Bitcoin (BTC) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">03.56%</span></li>
                    <li><img src="/assets/img/markets/arbitrum.png" alt="arbitrum"/> Arbitrum (ARB) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">04.06%</span></li>
                    <li><img src="/assets/img/markets/shiba.png" alt="shiba"/> Shiba(INU) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                    <li><img src="/assets/img/markets/ethereum.png" alt="ethereum"/> Ethereum(ETH) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">03.84%</span></li>
                    <li><img src="/assets/img/markets/dogecoin.png" alt="dogecoin"/> Dogecoin(DOGE) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                    <li><img src="/assets/img/markets/dogecoin.png" alt="dogecoin"/> Dogecoin(DOGE) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                  </ul>

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