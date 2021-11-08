

import React , {useState, useEffect} from 'react';  
import Link from 'next/link'
import Axios from 'axios'; 
import Head from 'next/head';
import cookie from 'cookie'
import {API_BASE_URL,config,website_url, app_coinpedia_url} from '../../components/constants' 
import TableContentLoader from '../../components/loaders/tableLoader'
import moment from 'moment'
 
export default function OngoingLaunchPad({userAgent}) { 

  const [user_token] = useState(userAgent.user_token)
  const [ongoing, setOngoing] = useState([])
  const [apistatus, setapistatus] = useState(false)
  const [image_base_url] = useState(API_BASE_URL+"uploads/tokens/")
 

  useEffect(()=>{ 
    GetAllOngoing()
  },[])

  const GetAllOngoing = ()=>{ 
    Axios.get(API_BASE_URL+"listing_tokens/launchpad_ongoing", config)
    .then(response=>{
          if(response.data.status){  
            setapistatus(true)
            setOngoing(response.data.message) 
            console.log(response.data.message)
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
                    <p>These are the ongoing launchpad's</p>
                  </div>
                  <div className="col-md-4 col-5">
                    <div className="launchpad-toke-button">
                    <Link href={user_token ? "/token/create-new":app_coinpedia_url+"login"}>
                      <a><button className="btn-gradient-primary">
                        <span className="btn__text"><img src="/assets/img/create-token-icon.png" />Create Token</span>
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
                      <li><Link href="/launchpad/ended"><a><span>Ended</span></a></Link></li>
                    </ul>
                  </div>
                </div> 

                <div className="completed_events">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th className="ongoing_token">Project</th>
                          <th className="">Type</th>
                          <th className="ongoing_date">Start Date</th>
                          <th className="ongoing_date">End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                            
                            ongoing.length > 0
                            ?
                              ongoing.map((e,i)=>
                        <tr key={i}>
                          <td>
                            <a href={"/"+e.token_id}>
                              <div className="media">
                                <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt="Logo" className="mr-1rounded-circle" />
                                <div className="media-body">
                                  <h5 className="launchpad_title">{e.token_name}</h5>
                                  <p className="launchpad_value">{e.symbol}</p>
                                </div>
                              </div>
                            </a>
                          </td>
                         
                          <td className="market_list_price">
                            <a href={"/"+e.token_id}>
                              <h5>
                                {/* <a> */}
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
                                {/* </a> */}
                              </h5>
                            </a>
                          </td>
                          
                          <td className="market_list_price"><a href={"/"+e.token_id}><h5>{moment(e.start_date).format("MMM DD, YYYY")}</h5></a></td>
                          <td className="market_list_price"><a href={"/"+e.token_id}><h5>{moment(e.end_date).format("MMM DD, YYYY")}</h5></a></td>
                        </tr>
                         )
                         :
                         <>
                         {
                           apistatus ?
                           <tr key="1">
                             <td className="text-center" colSpan="6">
                                 Sorry, No related data found.
                             </td>
                           </tr>
                           :
                          <TableContentLoader row="5" col="4" />
                                               
                         }
                         </>
                       }
                      </tbody>
                      
                    </table>
                  </div>

                  <div className="launchpad_overview_data">
                    <h3>Ongoing</h3>
                    <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                    <p><a href="#">Read More</a></p>
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