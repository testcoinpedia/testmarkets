
import React, {useEffect, useState} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
// import SearchContractAddress from '../components/searchContractAddress'
import CategoriesTab from '../components/categoriesTabs'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import WatchList from '../components/watchlist'

// import Select from 'react-select'
import { useRouter } from 'next/navigation'

export default function Companies({user_token, config, userAgent})
{ 
    const router = useRouter()
    //const { active_category_tab } = router.query
    const active_category_tab = ''
    const [tokens_list, set_tokens_list] = useState([]) 
    const [currentPage, setCurrentPage] = useState(0)
    const [per_page_count, set_per_page_count] = useState(100)
    const [pageCount, setPageCount] = useState(0)
    const [sl_no, set_sl_no]=useState(0)
    const [firstcount, setfirstcount] = useState(1)
    const [finalcount, setfinalcount] = useState(per_page_count)
    const [image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
    const [count, setCount]=useState(0)
    const [loader_status, set_loader_status] = useState(false)
    const [all_tab_status, set_all_tab_status] = useState((active_category_tab > 0) ? 0 : 1)
    const [watchlist_tab_status, set_watchlist_tab_status] = useState("")
    const [search_title, set_search_title] = useState("")
    const [category_list, set_category_list] = useState([]) 
    const [category_row_id, set_category_row_id] = useState((active_category_tab > 0) ? active_category_tab : "") 
    
    
    useEffect(()=>
    {  
        tokensList({selected : 0})
        getCategoryList()
    },[per_page_count, search_title, category_row_id]) 


    const getCategoryList = () =>
    {  
        Axios.get(API_BASE_URL+"markets/tokens/unique_categories", config).then(res=>
        { 
            if(res.data)
            {      
                set_category_list(res.data.message)
                // otherUniqueCategory(res.data.other_array)
            } 
        })
    }

    // const otherUniqueCategory = (res) =>
    // {  
    //     var listData = res
    //     var list = []
    //     for(let i of listData)
    //     {
    //         list.push({value: i.category_id, label: i.category_name})  
    //     }
    //     set_other_category_list(list)
    // }

    const tokensList = async (page) =>
    {  
        let current_pages = 0 
        if(page.selected) 
        {
            current_pages = ((page.selected) * per_page_count) 
        } 

        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/watchlist/"+current_pages+'/'+per_page_count+"?search="+search_title+"&category_row_id="+category_row_id, config)
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
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/add_to_watchlist/"+param_token_id, config)
        if(res.data.status)
        {
          var list = []
          for(const i of tokens_list)
          {  
              if(i.token_row_id == param_token_id)
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
    }
    
    const removeFromWatchlist = (param_token_id) =>
    {
      Axios.get(API_BASE_URL+"markets/cryptocurrency/remove_from_watchlist/"+param_token_id, config).then(res=>
      {
        if(res.data.status)
        {
          var list = []
          for(const i of tokens_list)
          {  
              if(i.token_row_id == param_token_id)
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
        set_category_row_id("")
        set_search_title("")
        tokensList({selected : 0})
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
         <title>Your Cryptocurrency Watchlist | Coinpedia </title>
         <meta name="description" content="Coinpedia’s Market bring you with a list of top cryptocurrencies with real timeprices, including percentage change, charts, history, volume and more."/>
         <meta name="keywords" content="crypto market, crypto market tracker, Crypto tracker live, Cryptocurrency market, crypto market insights , Live crypto insights, crypto price alerts, Live crypto alerts." />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Your Cryptocurrency Watchlist | Coinpedia" />
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
         <meta name="twitter:title" content="Your Cryptocurrency Watchlist | Coinpedia" />
         <meta name="twitter:description" content="Here's a list of the leading fintech companies in the country across the various sub-sectors.We are extending and updating the list regularly." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url}/>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>

      <div className="page new_markets_index min_height_page markets_new_design">
      <div className="market-page">


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                  <h1 className="page_title">Your Cryptocurrency Watchlist</h1>
                  {/* by Market Cap */}
                  <p>Global market cap today: $ 1.38 trillion <img src="/assets/img/markets/high-value.png" alt="high value"/><span className="color-green">10.02%</span> in 24 hrs.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4" >
                  {/* <SearchContractAddress />  */}
                </div>
              </div>
             

<div>
<div className="all-categories-list">
  <CategoriesTab /> 
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
                         <div className="col-md-12 col-lg-8 col-12">
                          <ul className="category_list">
                            {/* <li>Watchlist</li> */}
                          </ul>
                        </div>
                       <div className="col-md-12 col-lg-4 col-12 filter-category-section">
                  
                      <div className="row">
                      <div className="col-md-3 col-6 ">
                            
                            </div>
                        <div className="col-md-9 col-12 col-sm-6">
                          <div className="input-group search_filter">
                            <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Token By Name" />
                              <div className="input-group-prepend ">
                                  <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                                </div>
                          </div> 
                         
                          </div>

                          
                        </div>
                        </div>     
                 </div>   
                </div>
                   
                  
                </div>
                <div className="market_page_data">
                     <div className="table-responsive">
                       <table className="table table-borderless">
                         <thead>
                            <tr>
                                <th className="" style={{minWidth: '34px'}}></th>
                                <th className="mobile_hide_table_col" style={{minWidth: '34px'}}>#</th>
                                <th className="">Name</th>
                                <th className="">Price</th>
                                <th className=" mobile_hide_table_col" style={{minWidth: 'unset'}}>1h</th>
                                <th className=" mobile_hide_table_col" style={{minWidth: 'unset'}}>24h</th>
                                <th className=" mobile_hide_table_col" style={{minWidth: 'unset'}}>7d</th>
                                <th className="mobile_hide_table_col table_circulating_supply">Market Cap</th> 
                                <th className=" mobile_hide_table_col">Volume(24H)</th>  
                                <th className="mobile_hide_table_col table_circulating_supply">Circulating Supply</th>  
                                <th className="mobile_hide_table_col">Last 7 Days</th>
                               
                            </tr>
                         </thead>
                         
   
                         <tbody>
                           {
                            loader_status ?
                           <>
                           {
                             tokens_list.length > 0 ?
                             tokens_list.map((e, i) => 
                             <tr key={i}>
                                 
                                     <td>
                                        {
                                         e.watchlist_status== true ?
                                         <span onClick={()=>removeFromWatchlist(e.token_row_id)} ><img src=" /assets/img/color.svg" alt="Watchlist" width={17} height={17} /></span>
                                         :
                                         <span onClick={()=>addToWatchlist(e.token_row_id)} ><img src="/assets/img/star.svg" alt="Watchlist" width={17} height={17} /></span>
                                        }
                                     
                                     </td>
                                    <td>
                                        <span className="mobile_hide_table_col wishlist"> {sl_no+i+1}</span>
                                    </td>
                                     <td>
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
                                     {/* <td>{e.price === null? "-":"$"+ Number(e.price).toFixed(2)}</td> */}
                                     {/* <td>
                                       <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span>
                                     </td> */}
               
                                     <td className="market_list_price"> 
                                       <Link href={"/"+e.token_id}>
                                         
                                         <span className="block_price">{roundNumericValue(e.price)}</span>
                                           {/* <span className="block_price">{e.price?"$":null}{e.price?parseFloat((e.price).toFixed(9)):"-"}</span> */}
                                          {/* <br/> {e.price} <br/> */}
                                           {e.updated_on ? moment(e.updated_on).fromNow():null} 
                                         
                                         </Link>
                                    </td>
                                    
                                    {/* <td className="mobile_hide_table_col"> 
                                       <Link href={"/"+e.token_id}>
                                        <a>
                                          {
                                            e.list_type==1?
                                            "Coin"
                                            :
                                            (e.contract_addresses) && ((e.contract_addresses).length ===1)
                                            ?
                                            parseInt(e.contract_addresses[0].network_type) === 1 ? "ERC20" : "BEP20" 
                                            // e.contract_addresses.map((ca)=>
                                            //   parseInt(ca.network_type) === 1 ? "ERC20" : "BEP20" 
                                            //)
                                            :
                                            (e.contract_addresses) && (e.contract_addresses).length === 2
                                            ?
                                            e.contract_addresses.map((ca,i)=>
                                              i==0?
                                              parseInt(ca.network_type) === 1? "ERC20"+","
                                              :
                                              "BEP20" +","
                                              :
                                              parseInt(ca.network_type) === 1? "ERC20"
                                              :
                                              "BEP20" 
                                            )
                                            :
                                            null
                                            
                                          } 
                                        </a>
               
                                         </Link>
                                    </td> */}
                                    
                                    {/* <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                         <a>
                                           {e.total_max_supply ? separator(e.total_max_supply) : "-"} 
                                         </a>
                                       </Link>
                                    </td> */}

                                    <td className="mobile_hide_table_col">
                                       <Link href={"/"+e.token_id}>
                                         {
                                        e.percent_change_1h?e.percent_change_1h>0?
                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.percent_change_1h.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h6>
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
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_24h.toFixed(2)).replace('-', '')+"%"}</span></h6>
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
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(e.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                        :
                                        "--"
                                        }
                                        {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>1.05%</span></h6> */}
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
                                       {e.circulating_supply ? separator((e.circulating_supply).toFixed(0))+" "+(e.symbol).toUpperCase() : "-"}
                                       </Link>
                                     </td>

                                     
                                      
                                     <td className="mobile_hide_table_col">
                                      <img className={e.percent_change_7d>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} style={{width:"170px"}} height="100%"/>
                                     </td> 
                                       {/* <td  className="mobile_hide_table_col text-center">
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
                                     </td> */}
                                     
                                     
                                     {/* <td  className="mobile_hide_table_col text-center">
                                       {
                                         user_token ?
                                         <>
                                         {
                                           voting_ids.includes(e._id) ?
                                           <span className="market_list_price markets_voted"> <button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,true,e._id,i)} >Voted</button></span>
                                           :
                                           <span className="market_list_price"><button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,false,e._id,i)} className="vote_btn">Vote</button></span>
                                          }
                                         </>
                                         :
                                         <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a onClick={()=> Logout()}><span className="market_list_price"><button data-toggle="tooltip" className="vote_btn">Vote</button></span></a></Link>
                                       }
                                       </td>  */}
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
            
                <button type="button" className="close" data-dismiss="modal">&times;</button>
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
</>
)
} 



export async function getServerSideProps({req}) 
{
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  var user_token = userAgent.user_token 
  if(userAgent.user_token)
  {
      if(userAgent.user_email_status)
      {
          return { props: { userAgent: userAgent, config: config(user_token), user_token:user_token}} 
      }
      else
      {
          return {
              redirect: {
              destination: app_coinpedia_url+'verify-email',
              permanent: false,
              }
          }
      }
  }
  else
  {
      return {
          redirect: {
          destination: app_coinpedia_url+'login',
          permanent: false,
          }
      }
  }
}