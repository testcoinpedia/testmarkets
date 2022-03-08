

import React , {useState, useEffect} from 'react';  
import Link from 'next/link'
import Axios from 'axios'; 
import Head from 'next/head';
import cookie from 'cookie'
import ReactPaginate from 'react-paginate' 
import {API_BASE_URL,config,website_url, app_coinpedia_url, separator,IMAGE_BASE_URL,market_coinpedia_url} from '../../components/constants' 
import TableContentLoader from '../../components/loaders/tableLoader'
import moment from 'moment'
 
export default function OngoingLaunchPad({userAgent}) { 

  const [user_token] = useState(userAgent.user_token)
  const [ongoing, setOngoing] = useState([])
  const [watchlist, set_watchlist] = useState([])
  const [apistatus, setapistatus] = useState(false)
  const [image_base_url] = useState(IMAGE_BASE_URL+"/tokens/")
  const [tokenStatus,set_tokenStatus] = useState("")
  const [watch_list_status, set_watch_list_status] = useState(false)
  const [watchlist_tab_status, set_watchlist_tab_status] = useState("")
  const [all_tab_status, set_all_tab_status] = useState(true)
  
  const [perPage, set_perPage] = useState(100)
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0)
  const [count, setCount]=useState()
  const [firstcount, setfirstcount] = useState(1)
  const [finalcount, setfinalcount] = useState(perPage)
  const [selectedPage, setSelectedPage] = useState(0) 

  useEffect(()=>{ 
    GetAllOngoing({selected:0})
  },[perPage])

  const GetAllOngoing = async (page)=>{ 

    let current_pages = 0 
      if(page.selected) 
      {
         current_pages = ((page.selected) * perPage) 
      } 

    const response = await  Axios.get(API_BASE_URL+"markets/launchpads/ongoing/"+current_pages+'/'+perPage, config(user_token))
    if(response.data)
      {
          if(response.data.status == true)
          {  
            console.log(response)
            setapistatus(true)
            setOngoing(response.data.message) 
            set_watchlist(response.data.watchlist)
            set_tokenStatus(response.data.tokenStatus)
            setCount(response.data.count)
            setPageCount(Math.ceil(response.data.count/perPage))
            setCurrentPage(page.selected)
            setfirstcount(current_pages+1)
            const presentPage = page.selected+1
            const totalcompany = response.data.count
            var sadf = presentPage*perPage
            if((presentPage*perPage) > totalcompany)
            {
            sadf = totalcompany
            }
            const final_count=sadf
            setfinalcount(final_count)
          }
      }
  } 
  const addToWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/add_to_watchlist/"+param_token_id, config(user_token))
    .then(res=>
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
    Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config(user_token))
    .then(res=>
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
  const makeJobSchema=()=>{  
    return { 
        "@context":"http://schema.org/",
        "@type":"Organization",
        "name":"Ongoing Launchpads",
        "url": website_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
}

  return(
    <>
      <Head>
        <title>Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="keywords" content="Cryptocurrency Market, cryptocurrency market sentiments, crypto market insights, cryptocurrency Market Analysis, NFT Price today, DeFi Token price, Top crypto gainers, top crypto loosers, Cryptocurrency market, Cryptocurrency Live market Price, NFT Live Chart, Cryptocurrency analysis tool." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta property="og:url" content={website_url} />
        <meta property="og:site_name" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta name="twitter:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>

        <link rel="canonical" href={website_url} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
        <div className="page">
          <div className=" launchpad">
            <div className="container">
              <div className="col-md-12">
                <div className="row launchpad_list">
                  <div className="col-md-8 col-7">
                    <h1 className="page_title">Launchpad List</h1>
                    <p>These are the ongoing launchpads</p>
                  </div>
                  <div className="col-md-4 col-5">
                    <div className="launchpad-toke-button">
                    <Link href={user_token ? "/token/create-new":app_coinpedia_url+"login"}>
                      <a><button className="btn-gradient-primary">
                        <span className="btn__text">List your Token</span>
                      </button></a></Link>
                    </div>
                  </div> 
                </div>

                <div className="row">
                  <div className="tabs_for_navigation">
                    <ul className="nav nav-tabs">
                      <li><Link href="/launchpad"><a><span>Overview</span></a></Link></li>
                      <li><Link href="/launchpad/ongoing"><a className="active"><span>Ongoing</span></a></Link></li>
                      <li><Link href="/launchpad/upcoming"><a><span>Upcoming</span></a></Link></li>
                      <li><Link href="/launchpad/ended"><a><span>Completed</span></a></Link></li>
                    </ul>
                  </div>
                </div> 

                <div className="completed_events">
                  <div className="row">
                    <div className="col-md-9 col-6">
                      <ul className="category_list">
                        <li className="active_tab">All</li>
                        <li><Link href={app_coinpedia_url+"watchlist?tokens=true"}><a><img src="/assets/img/wishlist_star.svg"/> Watchlist</a></Link></li>
                        <li className="inactive"  data-toggle="modal" data-target="#comingSoon">DeFi</li>
                        <li className="inactive" data-toggle="modal" data-target="#comingSoon">NFT</li>
                        <li className="inactive" data-toggle="modal" data-target="#comingSoon">Metaverse</li>
                        <li className="inactive" data-toggle="modal" data-target="#comingSoon">Polkadot</li>
                        <li className="inactive" data-toggle="modal" data-target="#comingSoon">BSC</li>
                        <li className="inactive" data-toggle="modal" data-target="#comingSoon">Solana</li>
                        <li className="inactive" data-toggle="modal" data-target="#comingSoon">Avalanche</li>
                      </ul>
                    </div>

                    {
                    <div className="col-md-3 col-6">
                      <ul className="filter_rows">
                        <li>
                          Show rows 
                          <select onChange={(e)=>set_perPage(e.target.value)}>
                          <option value={100}>100</option>
                          <option value={50}>50</option>
                          <option value={20}>20</option>
                          </select>
                        </li>
                      </ul>
                    </div>
                   }
                  </div>

                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th style={{minWidth:'40px'}}></th>
                          <th>#</th>
                          <th style={{minWidth:'150px'}}>Project</th>
                          <th>Price</th>
                          <th>Network</th>
                          <th>Type</th>
                          <th style={{minWidth:'100px'}}>Start Date</th>
                          <th style={{minWidth:'100px'}}>End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                            
                            ongoing.length > 0
                            ?
                              ongoing.map((e,i)=>
                        <tr key={i}>
                          <td>
                          {
                                       tokenStatus ?
                                       <>
                                       {
                                         watchlist.includes(e.token_row_id) ?
                                         <span onClick={()=>removeFromWatchlist(e.token_row_id)} ><img src="/assets/img/wishlist_star_selected.svg" /></span>
                                         :
                                         <span onClick={()=>addToWatchlist(e.token_row_id)} ><img src="/assets/img/wishlist_star.svg" /></span>
                                         }
                                       </>
                                       :
                                       <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a onClick={()=> Logout()}><img src="/assets/img/wishlist_star.svg" /></a></Link>
                                     }
                          </td>
                          <td>{i+1}</td>
                          <td>
                            <a href={"/"+e.token_id}>
                              <div class="media">
                                <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt="Logo" />
                                <div class="media-body">
                                  <h5 className="launchpad_token_title">{e.token_name} <span>{e.symbol}</span></h5>
                                </div>
                              </div>
                              </a>
                          </td>
                          <td>
                            <a href={"/"+e.token_id}><h5>{e.price ? "$"+parseFloat(e.price) : "-"}</h5></a>
                          </td>
                          <td>
                                  <a href={"/"+e.token_id}><h5>
                                    {/* <img src="/assets/img/bnb.svg" />  */}
                                    {
                                      e.network_type.length > 0 
                                      ?
                                        e.network_type.map((ntwrk,i)=>
                                        {
                                          if(ntwrk.network_type == 1)
                                          {
                                            return <>{i>0 ? "," : null} ETH</>
                                          }
                                          else if(ntwrk.network_type == 2)
                                          {
                                            return <>{i>0 ? "," : null} BSC</>
                                          }
                                          
                                        }
                                        )
                                      :
                                      "--"
                                    }
                                  </h5></a>
                                </td>
                          
                          <td>
                            <a href={"/"+e.token_id}>
                              <h5>
                                  {
                                  e.launch_pad_type==1
                                  ?
                                  "ICO"
                                  :
                                  e.launch_pad_type==2
                                  ?
                                  "IDO"
                                  :
                                  e.launch_pad_type==3
                                  ?
                                  "IEO"
                                  :
                                  null
                                  }
                              </h5>
                            </a>
                          </td>
                          
                          <td><p>{moment.utc(e.start_date).format("MMM D, YYYY")}</p></td>
                          <td><p>{moment.utc(e.end_date).format("MMM D, YYYY")}</p></td>
                        </tr>
                         )
                         :
                         <>
                         {
                          apistatus ?
                            <tr key="1">
                              <td className="text-center no_data_found" colSpan="9">
                                Sorry, No related data found.
                              </td>
                            </tr>
                            :
                            <TableContentLoader row="5" col="9" />
                                               
                         }
                         </>
                       }
                      </tbody>
                      
                    </table>
                  </div>

                  {
                   
                   <div className="col-md-12">
                    <div className="pagination_block">
                      <div className="row">
                        <div className="col-lg-3 col-md-3  col-sm-3 col-12">
                            <p className="page_range">{firstcount}-{finalcount} of {pageCount} Pages</p>
                        </div>
                        {
                          count > perPage?
                        <div className="col-lg-9 col-md-9 col-sm-9 col-12">
                          <div className="pagination_div">
                            <div className="pagination_element">
                              <div className="pager__list pagination_element"> 
                                <ReactPaginate 
                                  previousLabel={currentPage+1 !== 1 ? "Prev" : ""}
                                  nextLabel={currentPage+1 !== pageCount ? "Next" : ""}
                                  breakLabel={"..."}
                                  breakClassName={"break-me"}
                                  forcePage={selectedPage}
                                  pageCount={pageCount}
                                  marginPagesDisplayed={2} 
                                  onPageChange={GetAllOngoing}
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
                   
                }

                  <div className="launchpad_overview_data">
                    <h3>Ongoing</h3>
                    <p>The latest and updated list of ongoing ICOs, STOs, IEOs, and IDOs. You can easily discover, select and track top launchpads with our revised database. We build this unique platform to help you make informed investment decisions. These launchpads are offered for a limited time only, so you have to hurry before the period ends.</p>
                    {/* <p><a href="#">Read More</a></p> */}
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
export async function getServerSideProps({req}) 
{
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    if(userAgent.user_token) 
    {
        return { props: { userAgent: userAgent } }
    }
    else 
    {
      return { props: { userAgent: {} } }
    }
  }