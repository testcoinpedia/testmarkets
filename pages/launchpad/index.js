

import React , {useState, useEffect} from 'react';  
import Link from 'next/link'
import Axios from 'axios'; 
import Head from 'next/head';
import cookie from 'cookie'
import moment from 'moment'
import {API_BASE_URL,config,separator, app_coinpedia_url,IMAGE_BASE_URL,market_coinpedia_url,coinpedia_url} from '../../components/constants' 

export default function LaunchPad({userAgent}) 
{ 

  const [user_token] = useState(userAgent.user_token)
  const [image_base_url] = useState(IMAGE_BASE_URL+"/tokens/")
  const [ongoing , set_ongoing] = useState([])
  const [upcoming , set_upcoming] = useState([])
  const [ended , set_ended] = useState([])
  const [apistatus, setapistatus] = useState(false)
  const [watchlist, set_watchlist] = useState([])
  useEffect(()=>{ 
   // GetAllPromotions() 
    launchpadList()
  },[])

  const launchpadList=()=> 
  {
    
    Axios.get(API_BASE_URL+"markets/launchpads/list", config(user_token))
    .then(res=>
    {   
      // console.log(res)
        if(res.data.status)
        {
          setapistatus(true)
          set_ongoing(res.data.message.ongoing)
          set_upcoming(res.data.message.upcoming)
          set_ended(res.data.message.ended)
          set_watchlist(res.data.watchlist)
        }
    })
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
        "name":"Launchpad",
        "url":market_coinpedia_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
}

  return(
    <>
      <Head>
        <title>Up-To-Date List of Complete Launchpad Calendar</title> {/*  Best  ICO and IDO calendar | */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" /> 
        <meta name="description" content="Explore updated Launchpad list. Stay update with Ongoing Top crypto launchpads. Keep Eye on Listed and upcoming launchpads." />
        <meta name="keywords" content="Ongoing Crypto Launchpads, Crypto launchpad list , Crypto launchpad platforms, top launchpad crypto, crypto launchpad projects, IDO launchpads, IEO launchpad." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Up-To-Date List of Complete Launchpad Calendar" />
        <meta property="og:description" content="Stay updated with the List of Ongoing & Upcoming Launchpad on different blockchain platforms. Get plugged in with the upcoming  ICO, IDO’s and more. ICO and IDO calendar" />
        <meta property="og:url" content={market_coinpedia_url+"launchpad"} />
        <meta property="og:site_name" content="Up-To-Date List of Complete Launchpad Calendar" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Up-To-Date List of Complete Launchpad Calendar" />
        <meta name="twitter:description" content="Stay updated with the List of Ongoing & Upcoming Launchpad on different blockchain platforms. Get plugged in with the upcoming  ICO, IDO’s and more. ICO and IDO calendar" />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>

        <link rel="canonical" href={market_coinpedia_url+"launchpad"} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
        <div className="page">
          <div className=" launchpad">
            <div className="container">
              <div className="col-md-12">
              {/* <div className="breadcrumb_block">
              <Link href={coinpedia_url}>Home</Link> <span> &#62; </span> 
              <Link href={market_coinpedia_url}>Live Market</Link><span> &#62; </span>Overview Launchpads
               </div> */}
                <div className="row launchpad_list">
                  <div className="col-md-8 col-12">
                    <h1 className="page_title">List of Complete Launchpad Calendar.</h1>
                    <p>List of ongoing, upcoming and completed launchpads.</p>
                  </div>
                  <div className="col-md-4 col-12">
                    <div className="launchpad-toke-button">
                      <Link href={user_token ? "/token/create-new":app_coinpedia_url+"login"}>
                        <button className="btn_create button_transition">
                          <span className="btn__text">List your Token</span>
                        </button></Link>
                      {/* <Link href="/"><a><button className="btn_createy">
                        <span className="btn__text"><img src="/assets/img/weekly-updates.png" className="weekly_updates" />Get Weekly Updates</span>
                      </button></a></Link> */}
                    </div>
                  </div> 
                </div>

                <div className="row">
                  <div className="tabs_for_navigation">
                    <ul className="nav nav-tabs">
                      <li><Link href="/launchpad" className="active"><span>Overview</span></Link></li>
                      <li><Link href="/launchpad/ongoing"><span>Ongoing</span></Link></li>
                      <li><Link href="/launchpad/upcoming"><span>Upcoming</span></Link></li>
                      <li><Link href="/launchpad/ended"><span>Completed</span></Link></li>
                    </ul>
                  </div>
                </div>
 
                <div className="row">
                  <div className="col-md-6">
                    <div className="ongoing_launchpad">
                      <h4><span>🔥 Ongoing</span> <Link href="/launchpad/ongoing">More <span className="right_caret">›</span></Link></h4> 
                    

                  <div className="table-responsive">
                    <table className="launchpad_table_overview">
                      
                      <tbody>
                        {
                          apistatus
                          ?
                            ongoing.length > 0
                            ?
                            ongoing.map((e, i)=>
                            <tr key={i}>
                              <td className="mobile_hide">
                                {i+1}
                              </td>
                              <td>
                                <Link href={"/"+e.token_id}>
                                    <h5 className="launchpad_title"><img src={image_base_url+(e.token_image ? e.token_image : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt="Logo" className="" /> {e.token_name} <span>{e.symbol}</span></h5>
                                </Link>
                              </td>
                                {/* {moment(e.start_date, 'd m  Y')} */}
                              <td>
                                <Link href={"/"+e.token_id}>
                                    <h5>
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
                                        "-"
                                      } 
                                      <span> ({e.launch_pad_type === 1 ? "ICO" : e.launch_pad_type === 2 ? "IDO" : e.launch_pad_type === 3 ? "IEO" : "-"})</span></h5>
                                  
                                </Link>
                              </td>
                              
                              <td><Link href={"/"+e.token_id} className="table_date"><p>{moment.utc(e.start_date).format("D MMM YYYY")}</p></Link></td>
                              <td><Link href={"/"+e.token_id} className="table_date"><p>{moment.utc(e.end_date).format("D MMM YYYY")}</p></Link></td>
                            </tr>
                            )
                            :
                            <tr>
                              <td colSpan="7"><h5 className="text-lg-center text-md-left no_data_found">No data found</h5></td>
                            </tr>
                          :
                          null
                        }
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
                <div className="col-md-6"> 
                  <div className="upcoming_launchpad">
                    <h4><span>📅 Upcoming </span> <Link href="/launchpad/upcoming">More <span className="right_caret">›</span></Link></h4> 
                    <div className="table-responsive">
                      <table className="launchpad_table_overview">
                        <tbody>
                        {
                          apistatus
                          ?
                            upcoming.length > 0
                            ?
                              upcoming.map((e, i)=>
                          
                              <tr key={i}>
                              <td className="mobile_hide">
                                {i+1}
                              </td>
                              <td>
                                <Link href={"/"+e.token_id}>
                                    <h5 className="launchpad_title"><img src={image_base_url+(e.token_image ? e.token_image : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt="Logo" className="" /> {e.token_name} <span>{e.symbol}</span></h5>
                                    
                                </Link>
                              </td>
                                {/* {moment(e.start_date, 'd m  Y')} */}
                              <td>
                                <Link href={"/"+e.token_id}>
                                    <h5>
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
                                        "-"
                                      } 
                                      <span> ({e.launch_pad_type === 1 ? "ICO" : e.launch_pad_type === 2 ? "IDO" : e.launch_pad_type === 3 ? "IEO" : "-"})</span></h5>
                                </Link>
                              </td>
                              
                              <td><Link href={"/"+e.token_id} className="table_date"><p>{moment.utc(e.start_date).format("D MMM YYYY")}</p></Link></td>
                              <td><Link href={"/"+e.token_id} className="table_date"><p>{moment.utc(e.end_date).format("D MMM YYYY")}</p></Link></td>
                            </tr>
                              )
                            : 
                            <tr>
                              <td colSpan="7"><h5 className="text-center no_data_found">No data found</h5></td>
                            </tr>
                          :
                          null
                        } 
                        </tbody>
                      </table>
                    </div>

                  </div>
                </div>
              </div>

              <div className="completed_events mt-2">
                <div className="row">
                  <div className="col-md-7 col-8 col-sm-8">
                    <div className="title_block">
                      <h2>Completed launchpads</h2>
                      <p className="lauchpad_completed_overview_p">These are the completed launchpads</p>
                    </div>
                  </div>
                  <div className="col-md-5 col-4 col-sm-4">
                    <h6 className="view_all_launchpad"><Link href="/launchpad/ended">View All</Link></h6>
                  </div>
                </div>
                

                <div className="table-responsive">
                  <table className="table table-borderless ">
                    <thead>
                      <tr>
                        <th style={{width: '40px'}} className="mobile_hide"></th>
                        <th style={{width: '40px'}} className="mobile_hide">#</th>
                        <th className="ongoing_token mobile_th_fixed">Name</th>
                        <th className="table_ended_fields">Price</th>
                        <th className="table_ended_fields">Network</th>
                        <th className="table_ended_fields">Token Sold</th>
                        {/* <th className="table_live_price">Total Supply</th> */}
                        <th className="table_pre_sale">Presale Supply(%)</th>
                        <th className="">Type</th>
                        {/* <th style={{minWidth:'80px'}}>Holders</th>
                        <th style={{minWidth:'125px'}}>Trading On</th> */}
                        <th className="table_pre_sale">Completed Date</th>
                      </tr>
                    </thead> 
                   
                    <tbody>
                    {  
                      apistatus
                      ?
                        ended.length > 0
                        ?
                        ended.map((e,i)=>
                        <tr key={i}>
                          <td className="mobile_hide" >
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
                                       <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url+"launchpad"}><img src="/assets/img/star.svg" alt="Watchlist"/></Link>
                                     }
                          </td>
                          <td className="mobile_hide">{i+1}</td>
                          <td className="mobile_td_fixed">
                            <a href={"/"+e.token_id}>
                              <div className="media">
                                <div className='media-lef align-self-center'>
                                <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt="Logo" />
                                </div>
                                <div className="media-body align-self-center">
                                  <h5 className="launchpad_token_title">{e.token_name} <span>{e.symbol}</span></h5>
                                </div>
                              </div>
                            </a>
                          </td>
                          <td className="market_list_price">
                            <a href={"/"+e.token_id}><h5>{e.price ? "$"+parseFloat(e.price) : "-"}</h5></a>
                          </td>
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
                                "-"
                              }
                            
                            </h5></a>
                          </td>
                          <td className="market_list_price"><a href={"/"+e.token_id}><h5>{separator(parseFloat(e.tokens_sold))}</h5></a></td>
                          {/* <td className="market_list_price"><a href={"/"+e.token_id}><h5>{e.token_max_supply ? separator(parseFloat(e.token_max_supply)) : "--"}</h5></a></td> */}
                          <td className="market_list_price"><a href={"/"+e.token_id}><h5>{parseFloat(e.percentage_total_supply)}%</h5></a></td>
                          <td className="market_list_price"><a href={"/"+e.token_id}><h5> 
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
                            }</h5></a>
                          </td>
                          
                          {/* <td className="market_list_price"><a href={"/"+e.token_id}><h5>8578</h5></a></td>
                          <td className="market_list_price networks_type"><a href={"/"+e.token_id}><h5><img src="/assets/img/pancake.jpg" /><img src="/assets/img/sushi.jpg" /> +2 More</h5></a></td> */}
                          <td className="market_list_price"><Link href={"/"+e.token_id} className="table_date"><p>{moment.utc(e.end_date).format("MMM D, YYYY")}</p></Link></td>

                          {/* <td className="market_list_price"><a href={"/"+e.token_id}><h5>{moment(e.end_date).format("MMM DD, YYYY")}</h5></a></td> */}
                        </tr>

                           )
                           :
                           <tr>
                            <td colSpan="10"><h5 className="text-center no_data_found">No data found</h5></td>
                          </tr>
                           :
                           null
                         }
                            
                    </tbody>
                  </table>
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
