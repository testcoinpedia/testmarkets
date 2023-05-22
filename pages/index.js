
import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import SearchContractAddress from '../components/searchContractAddress'
import CategoriesTab from '../components/categoriesTabs'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import WatchList from '../components/watchlist'
import Select from 'react-select'

// import Select from 'react-select'
import { useRouter } from 'next/navigation'

export default function Companies({user_token, config, userAgent})
{ 
    const router = useRouter()
    const myRef = useRef(null)
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
    const [category_id, set_category_id] = useState("") 
    const [other_category_list, set_other_category_list] = useState([]) 
    const [category_name, set_category_name] = useState("")
    const [search_category_value, set_search_category_value] = useState("")
    const [category_status, set_category_status] = useState(false)

    const category_ref = useRef()
    
    

    useEffect(()=>
    {  
        tokensList({selected : 0})
        getCategoryList()

        let handler = (e) => {
          if (!category_ref?.current?.contains(e.target)) {
            set_category_status(false)
          }
        }

        document.addEventListener("mousedown", handler)

          return () => {
              document.removeEventListener("mousedown", handler)
          }
    },[per_page_count, search_title, category_id]) 


    const getCategoryList = () =>
    {  
        Axios.get(API_BASE_URL+"markets/cryptocurrency/unique_categories", config).then(res=>
        { 
            if(res.data)
            {      
                set_category_list(res.data.message)
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

    const tokensList = async (page) =>
    {  
        let current_pages = 0 
        if(page.selected) 
        {
            current_pages = ((page.selected) * per_page_count) 
        } 
        myRef.current.scrollIntoView()
        set_loader_status(false)  
        const res = await Axios.get(API_BASE_URL+"markets/cryptocurrency/list/"+current_pages+'/'+per_page_count+"?search="+search_title+"&category_id="+category_id, config)
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
         <title>Cryptocurrency Market Live Insights | Coinpedia </title>
         <meta name="description" content="Coinpedia’s Market bring you with a list of top cryptocurrencies with real timeprices, including percentage change, charts, history, volume and more."/>
         <meta name="keywords" content="crypto market, crypto market tracker, Crypto tracker live, Cryptocurrency market, crypto market insights , Live crypto insights, crypto price alerts, Live crypto alerts." />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Cryptocurrency Market Live Insights | Coinpedia" />
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
         <meta name="twitter:title" content="Cryptocurrency Market Live Insights | Coinpedia" />
         <meta name="twitter:description" content="Here's a list of the leading fintech companies in the country across the various sub-sectors.We are extending and updating the list regularly." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url}/>
         <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>

      <div className="page new_markets_index min_height_page markets_new_design"  ref={myRef}>
      <div className="market-page">


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-12 col-lg-6">
                  <h1 className="page_title">Cryptocurrency Live Prices</h1>
                  {/* by Market Cap */}
                  <p>Global market cap today: $ 1.38 trillion <img src="/assets/img/markets/high-value.png" alt="high value"/><span className="color-green">10.02%</span> in 24 hrs.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4" >
                  <SearchContractAddress /> 
                </div>
              </div>
              <div>
                <div className="all-categories-list">
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
                      <div className="col-md-12 col-lg-5 col-12">
                        <h4 className="markets_subtitle">Price Tracking</h4>
                      </div>
                      <div className="col-md-12 col-lg-7 col-12 filter-category-section">
                        <div className="row">
                          <div className="col-md-5 col-12 col-sm-6 ">
                            <div className="cust_filters_dropdown" ref={category_ref}>
                              <div className="cust_filter_input" >
                               
                                {
                                  !category_id ?
                                  <div className="input-group" onClick={() =>
                                      set_category_status(!category_status)
                                    }>
                                      <input value={search_category_value} onChange={(e)=> set_search_category_value(e.target.value)} autoComplete='off' type="text" className="form-control " placeholder="Select Category" />
                                      <span className="input-group-addon lightmode_image">
                                        <img src="/assets/img/filter_dropdown.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                      </span>
                                      <span className="input-group-addon darkmode_image">
                                        <img src="/assets/img/filter_dropdown_grey.svg" title="Filter Dropdown" alt="Filter Dropdown" />
                                      </span>
                                  </div>
                                  :
                                  <div className="markets_selected_category">
                                    {category_name}

                                    <span className="input-group-addon close_category_icon" onClick={()=>closeCategory()}>
                                      <img src="/assets/img/close_mark.png" />
                                    </span>
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
                      
                          <div className="col-md-5 col-12 col-sm-6">
                            <div className="input-group search_filter">
                              <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Token By Name" />
                              <div className="input-group-prepend ">
                                <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                              </div>
                            </div> 
                          </div>

                          <div className="col-md-2 col-6 ">
                            <ul className="filter_rows">
                                <li>
                                  <select className="show-num" onChange={(e)=>set_per_page_count(e.target.value)} >
                                    <option value="" disabled>Show Rows</option>
                                    <option value={100}>100</option>
                                    <option value={50}>50</option>
                                    <option value={20}>20</option>
                                  </select>
                                </li>
                            </ul>
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
                                <th className="" style={{minWidth: 'unset'}}>24h</th>
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
                                        user_token ?
                                          <>
                                          {
                                            e.watchlist_status== true ?
                                            <span onClick={()=>removeFromWatchlist(e._id)} ><img src=" /assets/img/watchlist_filled.svg" alt="Watchlist" width={17} height={17} /></span>
                                            :
                                            <span onClick={()=>addToWatchlist(e._id)} ><img src="/assets/img/watchlist_outline.svg" alt="Watchlist" width={17} height={17} /></span>
                                            }
                                          </>
                                          :
                                          <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url} onClick={()=> Logout()}><img src="/assets/img/watchlist_outline.svg" alt="Watchlist"/></Link>
                                      }
                                     </td>
                                    <td>
                                        <span className="mobile_hide_table_col wishlist"> {sl_no+i+1}</span>
                                    </td>
                                     <td>
                                       <Link href={"/"+e.token_id}>
                                         
                                          <div className="media">
                                            <div className="media-left">
                                              <img src={image_base_url+(e.coinmarketcap_id ? e.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                            </div>
                                            <div className="media-body">
                                              <h4 className="media-heading">{strLenTrim(e.token_name, 14)} <span>{(e.symbol).toUpperCase()}</span></h4>
                                            </div>
                                          </div> 
                                         
                                       </Link>
                                     </td> 
                                     <td className="market_list_price"> 
                                       <Link href={"/"+e.token_id}>
                                         
                                         <span className="block_price">{roundNumericValue(e.price)}</span>
                                          
                                           {e.updated_on ? moment(e.updated_on).fromNow():null} 
                                         
                                         </Link>
                                    </td>
                                    
                                    

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
                                     <div className='circulating-supply'>
                                      <Link href={"/"+e.token_id}>
                                       {e.circulating_supply ? separator((e.circulating_supply).toFixed(0))+" "+(e.symbol).toUpperCase() : "-"}
                                       </Link>
                                      </div>
                                     </td> 

                                     
                                      
                                     <td className="mobile_hide_table_col">
                                      <img className={e.percent_change_7d>0 ? "saturated-up":"saturated-down"} src={"https://s3.coinmarketcap.com/generated/sparklines/web/7d/2781/"+(e.coinmarketcap_id ? e.coinmarketcap_id+".svg":"")} onError={(e) =>e.target.src = ""} alt={e.token_name} style={{width:"170px"}} height="100%"/>
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
   var user_token = userAgent.user_token ? userAgent.user_token : ""

  return { props: {userAgent:userAgent, config:config(user_token), user_token:user_token}}
}