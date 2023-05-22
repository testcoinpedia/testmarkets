

import React , {useState, useEffect} from 'react';  
import Link from 'next/link'
import Axios from 'axios'; 
import Head from 'next/head';
import cookie from 'cookie'
import ReactPaginate from 'react-paginate' 
import {API_BASE_URL,config, app_coinpedia_url, separator,IMAGE_BASE_URL,market_coinpedia_url,coinpedia_url} from '../../components/constants' 
import TableContentLoader from '../../components/loaders/tableLoader'
import moment from 'moment'
 
export default function OngoingLaunchPad({userAgent}) { 

  const [user_token] = useState(userAgent.user_token)
  const [ongoing, setOngoing] = useState([])
  const [watchlist, set_watchlist] = useState([])
  const [apistatus, setapistatus] = useState(false)
  const [image_base_url] = useState(IMAGE_BASE_URL+"/tokens/")
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
  const [sl_no, set_sl_no]=useState(0)

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
        console.log(response)
          if(response.data.status == true)
          {  
            // console.log(response)
            setapistatus(true)
            setOngoing(response.data.message) 
            set_watchlist(response.data.watchlist)
            setCount(response.data.count)
            set_sl_no(current_pages)
            setSelectedPage(page.selected)
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
      // console.log("add", res.data)
      if(res.data.status)
      {
        var sdawatchlist = watchlist
        set_watchlist([])
        sdawatchlist.push(param_token_id)
        set_watchlist(sdawatchlist)
        // console.log("watchlist", watchlist)
      }
    })
  }
  
  const removeFromWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config(user_token))
    .then(res=>
    {
      // console.log("remove", res.data)
      if(res.data.status)
      {
        var sdawatchlist = watchlist
        set_watchlist([])
        sdawatchlist.splice(sdawatchlist.indexOf(param_token_id), 1)
        set_watchlist(sdawatchlist)
        // console.log("watchlist", watchlist)
      }
    })
  }
  const makeJobSchema=()=>{  
    return { 
        "@context":"http://schema.org/",
        "@type":"Organization",
        "name":"Ongoing Launchpads",
        "url": market_coinpedia_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
}

  return(
    <>
      <Head>
        <title>List Of Ongoing Crypto Launchpads | Coinpedia Markets</title>
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" /> 
        <meta name="description" content="Discover updated Launchpad list. Explore Ongoing Top crypto launchpads. Keep Eye on Listed and upcoming launchpads." />
        <meta name="keywords" content="Ongoing Crypto Launchpads, Crypto launchpad list , Crypto launchpad platforms, top launchpad crypto, crypto launchpad projects, IDO launchpads, IEO launchpad." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="List Of Ongoing Crypto Launchpads | Coinpedia Markets" />
        <meta property="og:description" content="Ongoing Crypto Launchpads, Crypto launchpad list , Crypto launchpad platforms, top launchpad crypto, crypto launchpad projects, IDO launchpads, IEO launchpad." />
        <meta property="og:url" content={market_coinpedia_url+"launchpad/ongoing"} />
        <meta property="og:site_name" content="List Of Ongoing Crypto Launchpads | Coinpedia Markets" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="List Of Ongoing Crypto Launchpads | Coinpedia Markets" />
        <meta name="twitter:description" content="Ongoing Crypto Launchpads, Crypto launchpad list , Crypto launchpad platforms, top launchpad crypto, crypto launchpad projects, IDO launchpads, IEO launchpad." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>

        <link rel="canonical" href={market_coinpedia_url+"launchpad/ongoing"} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
        <div className="page">
          <div className=" launchpad">
            <div className="container">
              <div className="col-md-12">
              {/* <div className="breadcrumb_block">
              <Link href={coinpedia_url}>Home</Link> <span> &#62; </span> 
              <Link href={market_coinpedia_url}>Live Market</Link><span> &#62; </span> Ongoing Launchpads
               </div> */}
                <div className="row launchpad_list">
                  <div className="col-md-8 col-12">
                    <h1 className="page_title">Now Live ! Ongoing Crypto Launchpads List</h1>
                    <p>All current and ongoing launchpads, listed in date order.</p>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="launchpad-toke-button">
                    <Link href={user_token ? "/token/create-new":app_coinpedia_url+"login"}>
                     <button className="btn_create button_transition">
                        <span className="btn__text">List your Token</span>
                      </button></Link>
                    </div>
                  </div> 
                </div>

                <div className="row">
                  <div className="tabs_for_navigation">
                    <ul className="nav nav-tabs">
                      <li><Link href="/launchpad"> <span>Overview</span> </Link></li>
                      <li><Link href="/launchpad/ongoing" className="active"><span >Ongoing</span> </Link></li>
                      <li><Link href="/launchpad/upcoming"> <span>Upcoming</span> </Link></li>
                      <li><Link href="/launchpad/ended"> <span>Completed</span></Link></li>
                    </ul>
                  </div>
                </div> 

                <div className="completed_events">
                  <div className="row">
                    <div className="col-md-9 col-6">
                      <ul className="category_list">
                        <li className="active_tab">All</li>
                        {
                              user_token?
                              <li className={watchlist_tab_status===2?"active_tab":null}><Link href="/watchlist"><img src="/assets/img/star.svg" alt="Watchlist"/> Watchlist</Link></li>
                              :
                              <li>
                              <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url+"launchpad/ongoing"} onClick={()=> Logout()}><img src="/assets/img/star.svg" alt="Watchlist"/> Watchlist</Link>
                              </li>
                            }
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
                          <th style={{width: '40px'}} ></th>
                          <th style={{width: '40px'}} >#</th>
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
                            
                             ongoing.length ?
                            
                              ongoing.map((e,i)=>
                        <tr key={i}>
                          <td>
                          {
                            user_token ?
                            <>
                            {
                              watchlist.includes(e.token_row_id) ?
                              <span onClick={()=>removeFromWatchlist(e.token_row_id)} ><img src="/assets/img/color.svg" alt="Watchlist"/></span>
                              :
                              <span onClick={()=>addToWatchlist(e.token_row_id)} ><img src="/assets/img/star.svg" alt="Watchlist"/></span>
                              }
                            </>
                            :
                            <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url+"launchpad/ongoing"} onClick={()=> Logout()}><img src="/assets/img/star.svg" alt="Watchlist"/></Link>
                          }
                          </td>
                          
                          <td>{sl_no+i+1}</td>
                          <td>
                            <a href={"/"+e.token_id}>
                              <div className="media">
                              <div className='media-left align-self-center'>
                                <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt="Logo" />
                                </div>
                                <div className="media-body align-self-center">
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
                          
                          <td className="table_date"><p>{moment.utc(e.start_date).format("MMM D, YYYY")}</p></td>
                          <td className="table_date"><p>{moment.utc(e.end_date).format("MMM D, YYYY")}</p></td>
                        </tr>
                         )
                         :
                         <>
                         {
                           apistatus ?
                            <tr key="1">
                              <td className="text-lg-center text-md-left no_data_found" colSpan="9">
                                Sorry, No related data found.
                              </td>
                            </tr>
                            :
                            <TableContentLoader row="5" col="8" />
                                               
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
                                  previousLabel={currentPage+1 !== 1 ? "←" : ""}
                                  nextLabel={currentPage+1 !== pageCount ? " →" : ""}
                                  breakLabel={<span className="gap">...</span>}
                                  pageCount={pageCount}
                                  onPageChange={GetAllOngoing}
                                  breakClassName={"break-me"}
                                  forcePage={selectedPage}
                                  marginPagesDisplayed={2} 
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