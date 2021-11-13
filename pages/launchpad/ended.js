

import React , {useState, useEffect} from 'react';  
import Link from 'next/link'
import Axios from 'axios'; 
import Head from 'next/head';
import cookie from 'cookie'
import {convertvalue,API_BASE_URL,config,separator,website_url, app_coinpedia_url} from '../../components/constants' 
import TableContentLoader from '../../components/loaders/tableLoader'
 import moment from 'moment'
 
export default function OngoingLaunchPad({userAgent}) { 

  const [user_token] = useState(userAgent.user_token)
  const [ended, setended] = useState([])
  const [apistatus, setapistatus] = useState(false)
  const [image_base_url] = useState(API_BASE_URL+"uploads/tokens/")
  

  useEffect(()=>{ 
    GetAllOngoing()
  },[])

  const GetAllOngoing = ()=>{ 
    Axios.get(API_BASE_URL+"listing_tokens/launchpad_ended", config)
    .then(response=>{
          if(response.data.status){  
            setapistatus(true)
            setended(response.data.message) 
          }
    })
  } 
 
  const makeJobSchema=()=>{  
    return { 
      "@context":"http://schema.org/",
      "@type":"Organization",
      "name":"Ended Launchpads",
      "url":website_url,
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
                    <p>These are the completed launchpads</p>
                  </div>
                  <div className="col-md-4 col-5">
                    <div className="launchpad-toke-button">
                    <Link href={user_token ? "/token/create-new":app_coinpedia_url+"/login"}><a><button className="btn-gradient-primary">
                        <span className="btn__text"><img src="/assets/img/create-token-icon.png" />List your Token</span>
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
                  <div className="table-responsive">
                    <table className="table table-borderless">
                        <thead>
                        <tr>
                            <th className="ongoing_token">Name</th>
                            <th className="table_ended_fields">Price</th>
                            <th className="table_ended_fields">Network</th>
                            <th className="table_ended_fields">Token Sold</th>
                            <th className="table_live_price">Total Supply</th>
                            <th className="table_ended_fields">% of total supply</th>
                            <th className="">Type</th>
                            {/* <th className="">Holders</th>
                            <th className="">Trading On</th> */}
                            <th className="table_ended_fields">Completed Date</th>
                        </tr>
                        </thead> 
                        
                        <tbody>
                        {  

                            ended.length > 0
                            ?
                            ended.map((e,i)=>
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
                                <td className="market_list_price"><a href={"/"+e.token_id}><h5>${parseFloat(e.price)}</h5></a></td>
                                <td className="market_list_price">
                                  <a href={"/"+e.token_id}><h5>
                                    {/* <img src="/assets/img/bnb.svg" />  */}
                                    {
                                      e.network_type_array.length > 0 
                                      ?
                                        e.network_type_array.map((ntwrk,i)=>
                                        {
                                          if(ntwrk == 1)
                                          {
                                            return <>{i>0 ? "," : null} BNB</>
                                          }
                                          else if(ntwrk == 2)
                                          {
                                            return <>{i>0 ? "," : null} ETH</>
                                          }
                                          
                                        }
                                        )
                                      :
                                      "-"
                                    }
                                  </h5></a>
                                </td>
                                <td className="market_list_price"><a href={"/"+e.token_id}><h5>{separator(parseFloat(e.tokens_sold))}</h5></a></td>
                                <td className="market_list_price"><a href={"/"+e.token_id}><h5>{separator(parseFloat(e.token_max_supply))}</h5></a></td>
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
                                <td className="market_list_price"><a href={"/"+e.token_id}><h5>{moment(e.end_date).format("MMM DD, YYYY")}</h5></a></td>
                            </tr>

                           )
                           :
                           <>
                           {
                             apistatus ?
                             <tr key="1">
                               <td className="text-center no_data_found" colSpan="8">
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

                  <div className="launchpad_overview_data">
                    <h3>Completed</h3>
                    <p>A list of Completed ICOs, STOs, IEOs and IDOs. If you are looking for a platform to compare different launchpads in order to make a successful investment, this past event list is what you need. you will get a complete list of most projects in the crypto world.</p>
                    {/* <p><a href="#">Read More</a></p> */}
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