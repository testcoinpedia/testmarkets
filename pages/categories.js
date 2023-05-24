import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import SearchContractAddress from '../components/searchContractAddress'
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
    const [per_page_count, set_per_page_count] = useState(100)
    const [pageCount, setPageCount] = useState(0)
    const [sl_no, set_sl_no]=useState(0)
    const [firstcount, setfirstcount] = useState(1)
    const [finalcount, setfinalcount] = useState(per_page_count)
    const [selectedPage, setSelectedPage] = useState(0) 
    const [image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
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
        tokensList({selected : 0})
    },[per_page_count, search_title, category_row_id]) 


    const tokensList = async (page) =>
    {  
        let current_pages = 0 
        if(page.selected) 
        {
            current_pages = ((page.selected) * per_page_count) 
        }
        // myRef.current.scrollIntoView()
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

    

    const makeJobSchema=()=>
    {  
        return { 
            "@context":"http://schema.org/",
            "@type":"Organization",
            "name":"Coinpedia",
            "url":"https://pro.coinpedia.org",
            "logo":"http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
            "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        } 
    }
   
 
return (
    
   <>
      <Head>
         <title>Cryptocurrency Categories | Coinpedia </title>
         <meta name="description" content="Coinpedia’s Market bring you with a list of top cryptocurrencies with real timeprices, including percentage change, charts, history, volume and more."/>
         <meta name="keywords" content="crypto market, crypto market tracker, Crypto tracker live, Cryptocurrency market, crypto market insights , Live crypto insights, crypto price alerts, Live crypto alerts." />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Cryptocurrency Categories | Coinpedia" />
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
         <meta name="twitter:title" content="Cryptocurrency Categories | Coinpedia" />
         <meta name="twitter:description" content="Here's a list of the leading fintech companies in the country across the various sub-sectors.We are extending and updating the list regularly." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url}/>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>

      {/* <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}> */}
      <div className="page new_markets_index min_height_page markets_new_design">
      <div className="market-page">


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                  <h1 className="page_title">Cryptocurrency Categories</h1>
                  <p>View the various digital assets present within the category.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4 " >
                  <SearchContractAddress /> 
                </div>
              </div>
            <div>
            <div class="all-categories-list">
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
                         <div className="col-md-12 col-lg-8 col-12">
                        <h4 className="markets_subtitle">Categories</h4>
                      </div>
                       <div className="col-md-12 col-lg-4 col-12 filter-category-section">
                       <div className='row'>
                    <div className='col-md-6 col-lg-8 col-12'>
                          <div className="input-group search_filter">
                            <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Category" />
                              <div className="input-group-prepend ">
                                  <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                                </div>
                          </div> 
                         
                          </div>

                          <div className="col-md-4 col-lg-4 col-4 mobile_hide_view">
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
                          </div>  </div></div>
                 </div>   
                </div>
                   
                  
                </div>
                <div className="market_page_data categories_table new_token_page">
                     <div className="table-responsive">
                       <table className="table table-borderless">
                         <thead>
                            <tr>
                                <th className="mobile_hide_view" style={{minWidth: '35px'}}>#</th>
                                <th className="mobile_fixed_first">Category</th>
                                {/* <th className="">Title</th> */}
                                <th className="">Top Gainers</th>
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
                                     <td className="mobile_fixed_first">
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
                                       <Link href={"/category/"+e.category_id}>
                                         
                                          <div className="media">
                                            <div className="media-left">
                                              <img src={image_base_url+(e.token_gainer.coinmarketcap_id ? e.token_gainer.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_gainer.token_name} width="100%" height="100%" className="media-object" />
                                            </div>
                                            <div className="media-body">
                                              <h4 className="media-heading mt-0">{e.token_gainer.token_name} </h4>
                                              <p>{(e.token_gainer.symbol)?.toUpperCase()}</p>
                                              {
                                            e.token_gainer.percent_change_24h?
                                            e.token_gainer.percent_change_24h>0?
                                            <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price" style={{width:"10px"}}/>{e.token_gainer.percent_change_24h.toFixed(2)+"%"}</span></h6>
                                            :
                                            <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"  style={{width:"10px"}}/>{(e.token_gainer.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                            :
                                            "--"
                                            }
                                            </div>
                                           
                                          </div> 
                                         
                                         
                                       </Link>
                                     </td> 
                                    {/* <td className="mobile_hide_table_col">
                                       <Link href={"/category/"+e.category_id}> 
                                       {e.total_tokens}
                                        </Link>
                                     </td>

                                     <td className="mobile_hide_table_col">
                                       <Link href={"/category/"+e.category_id}> 
                                       {e.gainer_counts}
                                        </Link>
                                     </td> */}
                                     <td className="mobile_hide_table_col">
                                       {/* <Link href={"/category/"+e.category_id}> 
                                       {e.total_tokens-e.gainer_counts}
                                        </Link> */}
                                        <div style={{maxWidth:"177px"}}>
                                        <div className="progress gainer-progress">
                                            <div
                                                className="progress-bar progress-bar-success"
                                                role="progressbar"
                                                style={{ width: ((e.gainer_counts*100)/e.total_tokens)+"%" }}
                                            >
                                                {/* {e.gainer_counts} Gainers */}
                                            </div>
                                            <div
                                                className="progress-bar progress-bar-danger"
                                                role="progressbar"
                                                style={{ width: (100-((e.gainer_counts*100)/e.total_tokens))+"%" }}
                                            >
                                                {/* {e.total_tokens-e.gainer_counts} Losers */}
                                            </div>
                                            </div>
                                        <div>
                                            <span><strong>{e.gainer_counts}</strong> <small>({((e.gainer_counts*100)/e.total_tokens).toFixed(0)}%)</small></span>
                                            <span style={{float:"right"}}><strong>{e.total_tokens-e.gainer_counts}</strong> <small>({(100-((e.gainer_counts*100)/e.total_tokens)).toFixed(0)}%)</small></span>
                                        </div>
                                        </div>
                                     </td>
                                     <td className="mobile_hide_table_col">
                                       <Link href={"/category/"+e.category_id}> 
                                       <span class="market_list_price">
                                        <button class="vote_btn button_blue_transition">View</button>
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
                             <TableContentLoader row="10" col="5" />  
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
      

          <div class="modal" id="trending-modal">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
              
                <div class="modal-header">
              
                  <button type="button" class="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" /></span></button>
                </div>
                
                <div class="modal-body">
          
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
</>
)
} 

export async function getServerSideProps({req}) 
{
   const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
   var user_token = userAgent.user_token ? userAgent.user_token : ""

  return { props: {userAgent:userAgent, config:config(user_token), user_token:user_token}}
}