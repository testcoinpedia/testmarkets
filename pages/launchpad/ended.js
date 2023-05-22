

import React , {useState, useEffect} from 'react';  
import Link from 'next/link'
import Axios from 'axios'; 
import Head from 'next/head';
import cookie from 'cookie'
import ReactPaginate from 'react-paginate'  
import {IMAGE_BASE_URL, API_BASE_URL, config, separator, app_coinpedia_url, market_coinpedia_url, coinpedia_url} from '../../components/constants' 
import TableContentLoader from '../../components/loaders/tableLoader'
import moment from 'moment'
 
export default function OngoingLaunchPad({userAgent}) { 

  const [user_token] = useState(userAgent.user_token)
  const [ended, setended] = useState([])
  const [apistatus, setapistatus] = useState(false)
  const [image_base_url] = useState(IMAGE_BASE_URL+"/tokens/")
  const [watchlist, set_watchlist] = useState([])
 
   const [perPage, set_perPage] = useState(100)
   const [currentPage, setCurrentPage] = useState(0);
   const [pageCount, setPageCount] = useState(0)
   const [count, setCount]=useState()
   const [firstcount, setfirstcount] = useState(1)
   const [finalcount, setfinalcount] = useState(perPage)
   const [selectedPage, setSelectedPage] = useState(0) 
   const [sl_no, set_sl_no]=useState(0)

  useEffect(()=>{ 
    GetAllOngoing({selected : 0})
  },[perPage])

  const GetAllOngoing = async (page)=>{ 

    let current_pages = 0 
      if(page.selected) 
      {
         current_pages = ((page.selected) * perPage) 
      } 

    const response = await Axios.get(API_BASE_URL+"markets/launchpads/ended/"+current_pages+'/'+perPage, config(user_token))
    // console.log("company_list", response)
      if(response.data)
      {
          if(response.data.status == true)
          {  
            setapistatus(true)
            setended(response.data.message)
            set_watchlist(response.data.watchlist) 
            setCount(response.data.count)
            setPageCount(Math.ceil(response.data.count/perPage))
            setCurrentPage(page.selected)
            set_sl_no(current_pages)
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
      "name":"Ended Launchpads",
      "url":market_coinpedia_url,
      "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
      "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
    }

  return(
    <>
      <Head>
        <title>Explore Top blockchain launchpads | Coinpedia Markets.</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Discover updated Launchpad list with Explore and compare Top crypto launchpads. Keep Eye on Latest and upcoming launchpads." />
        <meta name="keywords" content="Upcoming Crypto Launchpads, Crypto launchpad list , Crypto launchpad platforms, top launchpad crypto, crypto launchpad projects." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Explore Top blockchain launchpads | Coinpedia Markets." />
        <meta property="og:description" content="Discover updated Launchpad list with Explore and compare Top crypto launchpads. Keep Eye on Latest and upcoming launchpads." />
        <meta property="og:url" content={market_coinpedia_url+"launchpad/ended"} />
        <meta property="og:site_name" content="Explore Top blockchain launchpads | Coinpedia Markets." />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Explore Top blockchain launchpads | Coinpedia Markets." />
        <meta name="twitter:description" content="Discover updated Launchpad list with Explore and compare Top crypto launchpads. Keep Eye on Latest and upcoming launchpads." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>

        <link rel="canonical" href={market_coinpedia_url+"launchpad/ended"} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
        <div className="page">
          <div className=" launchpad">
            <div className="container">
              <div className="col-md-12">
              <div className="breadcrumb_block">
              <Link href={coinpedia_url}><a >Home</a></Link> <span> &#62; </span> 
              <Link href={market_coinpedia_url}><a >Live Market</a></Link><span> &#62; </span> Completed Launchpads
               </div>
                <div className="row launchpad_list">
                  <div className="col-md-8 col-7">
                    <h1 className="page_title">Previous Listed Launchpads</h1>
                    <p>Here's a list of successful Launchpads that you would want to keep an eye on.</p>
                  </div>
                  <div className="col-md-4 col-5">
                    <div className="launchpad-toke-button">
                    <Link href={user_token ? "/token/create-new":app_coinpedia_url+"login"}><a><button className="btn-gradient-primary">
                        <span className="btn__text">List your Token</span>
                      </button></a></Link>
                    </div>
                  </div> 
                </div>

                <div className="row">
                  <div className="tabs_for_navigation">
                    <ul className="nav nav-tabs">
                      <li><Link href="/launchpad"><a><span>Overview</span></a></Link></li>
                      <li><Link href="/launchpad/ongoing"><a><span>Ongoing</span></a></Link></li>
                      <li><Link href="/launchpad/upcoming"><a><span>Upcoming</span></a></Link></li>
                      <li><Link href="/launchpad/ended"><a className="active"><span>Completed</span></a></Link></li>
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
                              <li><Link href={app_coinpedia_url+"watchlist/?active_watchlist_tab=2"}><a><img src="/assets/img2/Star.svg" alt="Watchlist"/> Watchlist</a></Link></li>
                              :
                              <li>
                              <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url+"launchpad/ended"}><a onClick={()=> Logout()}><img src="/assets/img2/Star.svg" alt="Watchlist"/> Watchlist</a></Link>
                              </li>
                            }
                        {/* <li><Link href={app_coinpedia_url+"?active_watchlist_tab=2"}><a><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/> Watchlist</a></Link></li> */}
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
                          <th style={{width: '40px'}} className="mobile_hide"></th>
                          <th style={{width: '40px'}} className="mobile_hide">#</th>
                          <th className="ongoing_token mobile_th_fixed">Name</th>
                          <th className="table_ended_fields">Price</th>
                          <th className="table_ended_fields">Network</th>
                          <th className="table_ended_fields">Token Sold</th>
                          {/* <th className="table_live_price">Total Supply</th> */}
                          <th className="table_total_supply">% of total supply</th>
                          <th className="table_ended_fields">Type</th>
                          {/* <th className="">Holders</th>
                          <th className="">Trading On</th> */}
                          <th className="table_completed_date">Completed Date</th>
                        </tr>
                        </thead> 
                        
                        <tbody>
                        {  

                            ended.length > 0
                            ?
                            ended.map((e,i)=>
                            <tr key={i}>
                              <td className="mobile_hide">
                              {
                                       user_token ?
                                       <>
                                       {
                                         watchlist.includes(e.token_row_id) ?
                                         <span onClick={()=>removeFromWatchlist(e.token_row_id)} ><img src="/assets/img2/Color.svg" alt="Watchlist"/></span>
                                         :
                                         <span onClick={()=>addToWatchlist(e.token_row_id)} ><img src="/assets/img2/Star.svg" /></span>
                                         }
                                       </>
                                       :
                                       <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url+"launchpad/ended"}><a onClick={()=> Logout()}><img src="/assets/img2/Star.svg" alt="Watchlist"/></a></Link>
                                     }
                              </td>
                              <td className="mobile_hide">{sl_no+i+1}</td>
                              <td className="mobile_td_fixed">
                                <a href={"/"+e.token_id}>
                                  <div className="media">
                                    <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt="Logo" />
                                    <div className="media-body">
                                      <h5 className="launchpad_token_title">{e.token_name} <span>{e.symbol}</span></h5>
                                    </div>
                                  </div>
                                </a>
                              </td>
                              <td className="market_list_price"><a href={"/"+e.token_id}><h5>{e.price ? "$"+parseFloat(e.price) : "-"}</h5></a></td>
                              <td className="market_list_price">
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
                              <td className="market_list_price"><a href={"/"+e.token_id}><h5>{separator(parseFloat(e.tokens_sold))}</h5></a></td>
                              {/* <td className="market_list_price"><a href={"/"+e.token_id}><h5>{e.token_max_supply ? separator(parseFloat(e.token_max_supply)) : "-"}</h5></a></td> */}
                              <td className="market_list_price"><a href={"/"+e.token_id}><h5>{parseFloat(e.percentage_total_supply)}%</h5></a></td>
                              <td className="market_list_price">
                                <a href={"/"+e.token_id}><h5> 
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
                                  }</h5>
                                </a>
                              </td>
                              {/* <td className="market_list_price"><a href={"/"+e.token_id}><h5>88778899</h5></a></td>
                              <td className="market_list_price networks_type"><a href={"/"+e.token_id}><h5><img src="/assets/img/pancake.jpg" /><img src="/assets/img/sushi.jpg" /> +2 More</h5></a></td> */}
                              <td className="table_date"><p>{moment.utc(e.end_date).format("MMM D, YYYY")}</p></td>
                            </tr>

                           )
                           :
                           <>
                           {
                            apistatus ?
                              <tr key="1">
                                <td className="text-lg-center text-md-left no_data_found" colSpan="10">
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

                  </div>

                  <div className="launchpad_overview_data">
                    <h3>Completed</h3>
                    <p>A list of Completed ICOs, STOs, IEOs and IDOs. If you are looking for a platform to compare different launchpads in order to make a successful investment, this past event list is what you need. you will get a complete list of most projects in the crypto world.</p>
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