import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
import ReactPaginate from 'react-paginate'; 
import Head from 'next/head';
import cookie from "cookie"
import Axios from 'axios'
import moment from 'moment'
import TableContentLoader from '../components/loaders/tableLoader'
import Search_Contract_Address from '../components/searchContractAddress'
import WatchList from '../components/watchlist'
import { API_BASE_URL, config, separator, website_url, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY,count_live_price} from '../components/constants'; 
var $ = require( "jquery" );

export default function Home({resData, userAgent, config, user_token}) 
{ 

  const [tokenStatus] = useState(resData.tokenStatus)
  const [tokenslist,set_tokenslist] = useState(resData.message)
  const [total_tokens_count, set_total_tokens_count] = useState(resData.message.length)  
  const [current_page_token_list, set_current_page_token_list] = useState([]); 
  const [voting_ids, setvoting_ids] = useState([])  // commented
  const [watchlist, set_watchlist] = useState([])
 
  const [watch_list_status, set_watch_list_status] = useState(false)
  const [err_searchBy, setErrsearchBy] = useState("")
  const [per_page_count, set_per_page_count] = useState(100)
  const [sl_no, set_sl_no]=useState(0)
  const [firstcount, setfirstcount] = useState(1)
  const [finalcount, setfinalcount] = useState(per_page_count)
  const [selectedPage, setSelectedPage] = useState(0) ;
  const [image_base_url] = useState(IMAGE_BASE_URL + '/tokens/')
  const [searchBy, setSearchBy] = useState("")   
  const [search_contract_address, set_search_contract_address] = useState("")    
  const [validSearchContract, setvalidContractAddress] = useState("")
  const [dataLoaderStatus, setDataLoaderStatus] = useState(true)
  const [voting_status, set_voting_status] = useState(false)
  const [filteredTokens, setFilteredTokens] = useState([])  
  const [searchTokens, setsearchTokens] = useState("")
  const [searchParam] = useState(["token_name"])
  const [current_url]= useState(website_url)
  const [handleModalVote, setHandleModalVote] = useState(false)
  const [total_votes, set_total_votes] = useState()
  const [token_id, set_Token_id] = useState("")
  const [vote_id, set_vote_id] = useState("")
  const [item, set_item] = useState("")
  const [voting_message, set_voting_message] = useState("")
  const [tokens] = useState(resData.message)
  const [all_tab_status, set_all_tab_status] = useState(true)
  const [watchlist_tab_status, set_watchlist_tab_status] = useState("")

  useEffect(()=>
  {  
    getTokensList(tokenslist , 0) 
    Pages_Counts(0 , per_page_count)
    setPageCount(Math.ceil(tokenslist.length / per_page_count))
    setSelectedPage(0) 
    voteIds()
    watchListIds()
    var $j = jQuery.noConflict()
    $j(document).ready(function() { $j('[data-toggle="tooltip"]').tooltip() })

  },[per_page_count,watch_list_status,tokenslist])
 
  const handlePageClick = (e) => 
  {  
    console.log("e.selected", e.selected)
    setSelectedPage(e.selected)
    const selectPage = e.selected; 
    Pages_Counts(selectPage, tokenslist.length)
    getTokensList(tokenslist, selectPage * per_page_count)
  }

  const addToWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/add_to_watchlist/"+param_token_id, config).then(res=>
    { 
      console.log("add", res.data)
      if(res.data.status)
      {
        var sdawatchlist = watchlist
        set_watchlist([])
        sdawatchlist.push(param_token_id)
        set_watchlist(sdawatchlist)
        console.log("watchlist", watchlist)
      }
    })
  }

  const removeFromWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config).then(res=>
    {
      console.log("remove", res.data)
      if(res.data.status)
      {
        var sdawatchlist = watchlist
        set_watchlist([])
        sdawatchlist.splice(sdawatchlist.indexOf(param_token_id), 1)
        set_watchlist(sdawatchlist)
        console.log("watchlist", watchlist)
      }
    })
  }

  const ModalVote=(token_id,status,_id,item)=> 
  { 
    console.log(item)   
    setHandleModalVote(!handleModalVote) 
    set_voting_status(status)
    set_Token_id(token_id)
    set_vote_id(_id)
    set_item(item)
  }

  const vote = (param) =>
  {
    if(param == 1)
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/save_voting_details/"+token_id, config).then(res=>
      { 
        console.log(res)
        if(res.data.status === true) 
        {
          
          var testList = tokenslist
          var result = testList.filter(obj => {
            return obj._id === vote_id
          })
          var testObj = result ? result[0] : "" 
          console.log("testObj",testObj)
          var test_total_votes = testObj.total_votes+1
          testObj['total_votes'] = test_total_votes
          testList[item] = testObj
          set_tokenslist(testList)
          voting_ids.push(vote_id)
          set_voting_message(res.data.message) 
          setHandleModalVote(!handleModalVote)
        }
      })
    }
    else
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/remove_voting_details/"+token_id, config).then(res=>
      { 
        console.log(res)
        if(res.data.status === true) 
        {
          var testList = tokenslist
          var result = testList.filter(obj => {
            return obj._id === vote_id
          })
          var testObj = result ? result[0] : "" 
          var test_total_votes = 0
          test_total_votes = testObj.total_votes-1
          testObj['total_votes'] = test_total_votes
          testList[item] = testObj
          console.log(testObj)
          set_tokenslist(testList)
          voting_ids.splice(voting_ids.indexOf(vote_id), 1) 
          set_voting_message(res.data.message)
          setHandleModalVote(!handleModalVote) 
        }
      })
    }
  }

  const voteIds = () =>
  {
    Axios.get(API_BASE_URL+"markets/tokens/voting_ids", config).then(res=>
    { 
      if(res.data.status)
      {
        setvoting_ids(res.data.voting_ids)
        console.log(res.data.voting_ids)
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
    
  const set_all_tab_active=()=>
  {  
    set_watch_list_status(false)
    set_watchlist_tab_status("")
    set_all_tab_status(true)
  }  
  
  const set_watch_list=()=>
  {  
    set_watch_list_status(true)
    set_watchlist_tab_status(2)
    set_all_tab_status(false)
  } 

  const Pages_Counts = (page_selected, length_value) => 
  {
    const presentPage = page_selected+1
    const first_count=(presentPage-1)*per_page_count+1
    const totalcompany = length_value
    var sadf = presentPage*per_page_count
    if((presentPage*per_page_count) > totalcompany)
    {
      sadf = totalcompany
    }
    const final_count=sadf
    setfirstcount(first_count)
    setfinalcount(final_count)
  }

  const getTokensList=(tokenslist, offset)=>
  {  
    let slice = tokenslist.slice(offset, offset + per_page_count) 
    set_current_page_token_list(slice)
    console.log(current_page_token_list)
    set_sl_no(offset) 
  }  
 
  const makeJobSchema=()=>{  
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


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                  <h1 className="page_title">Cryptocurrency Market Insights</h1>
                  <p>Companies with tech innovation into finance and technology, Globally.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4">
                    {
                      <Search_Contract_Address /> 
                    }
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ................ */}
        
          <div className="container">
            <div className="col-md-12">
              <div className="categories categories_list_display">
                <div className="categories__container">
                  <div className="row">
                    <div className="markets_list_quick_links">
                      <ul>
                        <li>
                          <Link href="/">
                            <a className="categories__item active_category">
                              <div className="categories__text">All</div>
                            </a>
                          </Link> 
                        </li>
                        <li data-toggle="modal" data-target="#comingSoon">
                        
                            <a className="categories__item">
                              <div className="categories__text">Gainers & Losers</div>
                            </a>
                        
                        </li>
                        <li data-toggle="modal" data-target="#comingSoon">
                          {/* <Link href="#"> */}
                            <a className="categories__item ">
                              <div className="categories__text">Stable Coins</div>
                            </a>
                          {/* </Link> */}
                        </li>
                        <li data-toggle="modal" data-target="#comingSoon">
                          {/* <Link href="#"> */}
                            <a className="categories__item ">
                              <div className="categories__text">Trending Coins</div>
                            </a>
                          {/* </Link> */}
                        </li>
                        <li data-toggle="modal" data-target="#comingSoon">
                          {/* <Link href="#"> */}
                            <a className="categories__item ">
                              <div className="categories__text">NFT Marketplace</div>
                            </a>
                          {/* </Link> */}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

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
                      <li class={all_tab_status?"active_tab":null}><a onClick={()=>set_all_tab_active()}>All</a></li>
                      {
                      tokenStatus?
                      <li class={watchlist_tab_status===2?"active_tab":null}><a onClick={()=>set_watch_list()}><img src="/assets/img/wishlist_star.svg"/> Watchlist</a></li>
                      :
                      <li>
                      <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a><img src="/assets/img/wishlist_star.svg"/> Watchlist</a></Link>
                      </li>
                      }
                    </ul>
                  </div>

                  <div class="col-md-6 col-5">
                    <ul class="filter_rows">
                      <li>
                        Show rows
                        <select onChange={(e)=>set_per_page_count(e.target.value)} >
                          <option value={100}>100</option>
                          <option value={50}>50</option>
                          <option value={20}>20</option>
                        </select>
                      </li>
                    </ul>
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
                               <th className="" style={{minWidth: '34px'}}></th>
                               <th className="mobile_hide_table_col">#</th>
                               <th className="">Name</th>
                               <th className="table_token">Live Price</th>
                               <th className="table_token mobile_hide_table_col">Token Type</th>
                               <th className="table_max_supply mobile_hide_table_col">Max Supply</th> 
                               <th className="mobile_hide_table_col table_circulating_supply">Market Cap</th>  
                               <th className="table_circulating_supply mobile_hide_table_col">Votes</th>  
                               <th className="table_circulating_supply mobile_hide_table_col"></th>  
                              
                             </tr>
                         </thead>
                         
   
                         <tbody>
                           {
                             current_page_token_list.length > 0
                             ?
                             current_page_token_list.map((e, i) => 
                             <tr key={i}>
                                     <td>
                                     {
                                       tokenStatus ?
                                       <>
                                       {
                                         watchlist.includes(e._id) ?
                                         <span onClick={()=>removeFromWatchlist(e._id)} ><img src="/assets/img/wishlist_star_selected.svg" /></span>
                                         :
                                         <span onClick={()=>addToWatchlist(e._id)} ><img src="/assets/img/wishlist_star.svg" /></span>
                                         }
                                       </>
                                       :
                                       <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a><img src="/assets/img/wishlist_star.svg" /></a></Link>
                                     }
                                     
                                     </td>
                                     
                                     <td className="mobile_hide_table_col">
                                       {sl_no+i+1}
                                     </td>
                                     <td>
                                       <Link href={"/"+e.token_id}>
                                         <a>
                                          <div className="media">
                                            <div className="media-left">
                                              <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                            </div>
                                            <div className="media-body">
                                              <h4 className="media-heading">{e.token_name} <span>{(e.symbol).toUpperCase()}</span></h4>
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
                                     <td className="mobile_hide_table_col"> 
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
                                     <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                         <a>
                                           {e.total_max_supply ? separator(e.total_max_supply) : "-"} 
                                         </a>
                                       </Link>
                                     </td>
               
                                     <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}><a>
                                         {e.market_cap ?separator(e.market_cap.toFixed(2)) : "-"}
                                       </a></Link>
                                     </td>  
                                     
                                       <td  className="mobile_hide_table_col">
                                       {
                                       e.total_votes == 0 ?
                                       voting_ids.includes(e._id) ? <span className="vote_value">1</span> : "--"
                                       :
                                       <Link href={"/"+e.token_id}>
                                         <a>
                                           <span className="vote_value">{e.total_votes}</span>
                                         </a>
                                       </Link>
                                       }
                                     </td>
                                     
                                     
                                     <td  className="mobile_hide_table_col">
                                       {
                                         tokenStatus ?
                                         <>
                                         {
                                           voting_ids.includes(e._id) ?
                                           <span className="market_list_price markets_voted"> <button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,true,e._id,i)} >Voted</button></span>
                                           :
                                           <span className="market_list_price"><button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,false,e._id,i)} className="vote_btn">Vote</button></span>
                                           }
                                         </>
                                         :
                                         <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a><span className="market_list_price"><button data-toggle="tooltip" className="vote_btn">Vote</button></span></a></Link>
                                       }
                                       </td> 
                               </tr> 
                             ) 
                             :
                             <tr >
                               <td className="text-center" colSpan="4">
                                   Sorry, No related data found.
                               </td>
                             </tr>
                           }
                         </tbody>
                       </table>
                     </div>
                   </div> 
                }
                

                  {
                    !watch_list_status?
                    total_tokens_count > per_page_count
                    ? 
                    <div className="col-md-12">
                      <div className="pagination_block">
                        <div className="row">
                          <div className="col-lg-3 col-md-3  col-sm-3 col-12">
                              <p className="page_range">{firstcount}-{finalcount} of {pageCount} Pages</p>
                          </div>
                          <div className="col-lg-9 col-md-9 col-sm-9 col-12">
                            <div className="pagination_div">
                              <div className="pagination_element">
                                <div className="pager__list pagination_element"> 
                                  <ReactPaginate 
                                    previousLabel={selectedPage+1 !== 1 ? "Prev" : ""}
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  :
                  null
                  :
                  null
                } 




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
      <div className={"modal connect_wallet_error_block"+ (handleModalVote ? " collapse show" : "")}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal" onClick={()=>ModalVote()}>&times;</button>
                  {
                    voting_status == false ?
                    <h4> Do you want to support this token ? </h4>
                    :
                    <h4> Do not support this token ? </h4>
                  }
                  
                  <div className="vote_yes_no">
                    {/* className={voting_status == 1 ? "vote_yes" : "vote_no"} */}
                    {
                      voting_status == false ?
                      <>
                      <button onClick={()=>vote(1)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                      :
                      <>
                      <button onClick={()=>vote(0)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                    }
                    
                  </div>
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

export async function getServerSideProps({query, req}) 
{ 
   const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
   var user_token = ''
   if(userAgent.user_token)
   {
     user_token = userAgent.user_token
   }
   
   const link = await fetch(API_BASE_URL+"markets/tokens/list", config(user_token))
   const result = await link.json()
   if(result.status)
    {  
      return { props: {resData:result, userAgent:userAgent, config:config(user_token), user_token:user_token}}
    }
    else
    {
      return { props: {resData: [], user_token:user_token}}
    }
}


