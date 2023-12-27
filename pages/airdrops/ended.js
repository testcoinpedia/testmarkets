import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Axios from 'axios'
import { useRouter } from 'next/navigation'
import { API_BASE_URL, market_coinpedia_url, config, IMAGE_BASE_URL, roundNumericValue} from '../../components/constants'; 
import cookie from 'cookie'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import JsCookie from "js-cookie"
import Airdrops_header from '../../components/airdrops/header'
import LoginModal from '../../components/layouts/auth/loginModal'
import { AddToCalendarButton } from 'add-to-calendar-button-react';

export default function MyFunction({user_token}) 
{
   
    const router = useRouter() 
  const [ico_list, set_ico_list] = useState([]) 
  const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
  const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/64x64/')
  const [category_modal, set_category_modal] = useState({status:false, message:[]}) 
  const [search_value, set_search_value] = useState("")
  const [search_networks, set_search_networks] = useState("")
  const [category_id, set_category_id] = useState("")
  const [content_loader_status, set_content_loader_status] = useState(true)
  const [overview_counts, set_overview_counts] = useState({}) 
  const [crypto_networks, set_crypto_networks] = useState([])

  const [tab_user_token, set_tab_user_token] = useState(user_token? user_token:"");
  const [login_modal_status, set_login_modal_status] = useState(false)
  const [request_config, set_request_config] = useState(config(user_token ? user_token : ""))
  const [is_client_load, set_is_client_load] = useState(false)

  useEffect(() => 
  {
    getICOList()
    set_is_client_load(true)
  } , [search_value, search_networks])

  const getICOList = async () => 
  {
    set_content_loader_status(true)
    const res = await Axios.get(API_BASE_URL+"markets/airdrops/ended/0/100"+"?search="+search_value+"&search_networks="+search_networks, config(""))
    if(res.data.status) 
    {   
        set_content_loader_status(false)
        set_ico_list(res.data.message) 
    }
  }

  useEffect(() => 
  {
    getOverviewCounts()
  } , [])

  const getOverviewCounts = async () => 
  {
        const res = await Axios.get(API_BASE_URL+"markets/airdrops/overview", config(""))
        if(res.data.status) 
        {   
            set_crypto_networks(res.data.message.crypto_networks) 
            set_overview_counts(res.data.message) 
        }
  }

  const resetFilter = async () => 
  {
    set_search_networks("")
    set_search_value("")
  }

  const active_currency = useSelector(state => state.active_currency)

  const convertCurrency = (token_price) =>
  {
    if(token_price)
    {
      if(active_currency.currency_value)
      {
        return active_currency.currency_symbol+" "+roundNumericValue(token_price*active_currency.currency_value)
      }
      else
      {
        return roundNumericValue(token_price)
      }
    }
    else
    {
      return '-'
    }
  }


  const getDataFromChild = async () => 
  {
    await set_login_modal_status(false)
    await set_tab_user_token(JsCookie.get("user_token"))
    router.push('/token')  
  }

  const login_props = {
    status: true,
    request_config: request_config,
    callback: getDataFromChild
  }

  const loginModalStatus = async () => 
  {
    await set_login_modal_status(false)
    await set_login_modal_status(true)
  }

  
  return (
        <>
        <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>Completed Crypto Airdrops</title>
         <meta name="description" content="List of verified and completed crypto airdrops and NFT Airdrops, listed on Coinpedia. Find Airdrop details with direct participation links."/>
         <meta name="keywords" content={"Airdrop, crypto airdrops "+moment().format('MMMM YYYY')+", completed airdrop,airdrops,  crypto airdrop, crypto airdrops, best crypto airdrops, latest airdrops, latest crypto airdrop, NFT airdrops. "} />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Active ICO's" />
         <meta property="og:description" content="List of verified and completed crypto airdrops and NFT Airdrops, listed on Coinpedia. Find Airdrop details with direct participation links." />
         <meta property="og:url" content={market_coinpedia_url+"airdrops/ended/"} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="Active ICO's" />
         <meta name="twitter:description" content="List of verified and completed crypto airdrops and NFT Airdrops, listed on Coinpedia. Find Airdrop details with direct participation links." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url+"airdrops/ended/"}/>
         <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Completed Crypto Airdrops"}`,
          }}
        />

        <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "http://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Cryptocurrencies",
                  "item": "https://markets.coinpedia.org/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Completed Crypto Airdrops",
                  "item": "https://markets.coinpedia.org/airdrops/ended/"
                }
              ]
            }`,
          }}
        />
      </Head>
    <div className="page airdrop_page ico_calendar">
        <Airdrops_header active_tab={3} overview_counts={overview_counts}/>

        <div className=''>
            <div className='container'>
            <div className=' header_tabs_row mt-3'>
                <div className='row'>
                    <div className='col-md-7 col-xl-7 col-lg-7 col-12'>
                        {/* <div className='ico_header_lists'>
                            <ul>
                                <li onClick={()=>set_search_networks("")}  className={search_networks == "" ? " active":""}>All</li>
                               
                            </ul>
                        </div> */}
                    </div>
                    {/* <li className='image_fire'><img src="/assets/img/fire_icon.svg" /></li> */}
                    {/* <button className='button_blue_transition kyc_button'>KYC &nbsp;<span><img src="/assets/img/finger_print.svg" /></span></button> */}

                    <div className='col-md-2 col-xl-2 col-lg-2 col-4'>
                        {
                          tab_user_token ?
                          <div className='launchpad-button-section'>
                            <Link href="/token" className='create-launchpad button_transition'>Create Airdrop</Link>
                          </div>
                          :
                          <div className='launchpad-button-section'>
                          <a  className='create-launchpad button_transition' onClick={()=>loginModalStatus()}>Create Airdrop</a>
                          </div>
                        }
                     
                    </div>    
                    <div className='col-md-4 col-xl-3 col-lg-3 col-12'>
                        <div className="input-group search_filter new_design_serach">
                            <input value={search_value} onChange={(e)=> set_search_value(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search" />
                            <div className="input-group-prepend ">
                                <span className="input-group-text">
                                    <img src="/assets/img/search_large.svg" alt="search-box" width="100%" height="100%" />
                                </span>
                                <span className="input-group-text" onClick={()=>resetFilter()}>
                                    <img src="/assets/img/reset.svg" alt="search-box" width="100%" height="100%" />
                                </span>
                            </div>
                        </div>  
                    </div>

                    {/* <div className='col-md-12 col-lg-12 col-xl-1 col-12'>
                        <button className='btn btn-secondary' onClick={()=>resetFilter()}>Reset</button>
                    </div> */}
                </div>
                </div>
                <div className='border_bottom_ico'></div>
                </div>
            </div>
            
            <div className='container'>

            <div className='conatiner'>
            <div className=''>
                <div className='row'>
                {
                        !content_loader_status ?
                        ico_list.length ?
                        ico_list.map((item, i) =>
                        <div className="col-md-4">
                            <div className="airdrop_block">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="media">
                                        <img style={{width:"45px", marginRight:"10px"}} src={(item.token_image ? image_base_url+item.token_image: item.coinmarketcap_id ? cmc_image_base_url+item.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.token_name}  />
                                            <div className="media-body">
                                                <h4 style={{textTransform:"capitalize"}}>{item.title} ({item.symbol})</h4>
                                                <p style={{fontSize:"13px"}}>{convertCurrency(item.winner_price*item.participating_users)} worth of {item.symbol} to {item.participating_users} Lucky Winners</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4 text-right">
                                    {/* <p><img src="/assets/img/medal.svg" /> {item.winner_price ? "$"+item.winner_price:""}</p> */}
                                        {/* <button className="airdrop_category">Defi</button> */}
                                    </div>
                                </div>

                                <div className='icos_tags_detail'>
                                    <ul>
                                        {/* <li><span><img src="/assets/img/ico_verified.svg" /></span>KYC Verified</li> */}
                                        {/*  */}
                                        
                                        {
                                                item.categories_names ?
                                            <>
                                                {
                                                item.categories_names.map((innerItem, i) => 
                                                i < 2 ?
                                                <li key={i}><Link href={"/category/"+innerItem.category_id}>{innerItem.category_name}</Link></li>
                                                :
                                                ""
                                                )
                                                }
                                                {
                                                item.categories_names.length > 2 ?
                                                <li onClick={()=>set_category_modal({status:true, message:(item.categories_names ? item.categories_names:[])})}>+{item.categories_names.length-2} More</li>
                                                :
                                                ""
                                                }
                                            </>
                                                :
                                                ""
                                        }

                                        
                                    </ul>
                                </div>

                                <div className="row mt-4">
                                    <div className="col-md-6 col-6">
                                        <p>Participates</p>
                                        <h6>{item.participating_users} users</h6>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <p><img src="/assets/img/medal.svg" alt="Medal" style={{width:"15px"}}  /> Winner </p>
                                        <h6>{convertCurrency(item.winner_price)}</h6>
                                    </div>
                                </div>

                                

                                <div className="row airdrop_basic_info">
                                    <div className='col-md-10 col-10'>
                                    {
                                        is_client_load ?
                                        <AddToCalendarButton
                                            name={item.title+" ("+item.symbol+")"}
                                            startDate={(moment.utc(item.start_date).format("YYYY-MM-DD")).toString()}
                                            endDate={(moment.utc(item.end_date).format("YYYY-MM-DD")).toString()}
                                            description={item.description}
                                            options={['Apple', 'Google', 'iCal']}
                                            buttonStyle="custom"
                                            label={" "+(item.start_date ? moment(item.start_date).utc().format('YYYY') == moment(item.start_date).utc().format('YYYY') ? moment(item.start_date).utc().format('MMM D')+" - "+moment(item.end_date).utc().format('MMM D YYYY'):moment(item.start_date).utc().format('MMM D YYYY')+" - "+moment(item.end_date).utc().format('MMM D YYYY'):"TBA")}
                                            listStyle="overlay"
                                            trigger="click"
                                            customCss={market_coinpedia_url+"assets/css/atcb.css"}
                                            />  
                                        :
                                        ""
                                    } 
                                    </div>
                                    <div className="col-md-2 col-2 text-right">
                                        <Link href={"/"+item.token_id+"?tab=airdrop&tab_id="+item._id}><img src="/assets/img/airdrop_arrow_right.svg" alt="Arrow Right"  /></Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ) 
                        :
                        <>
                        <div className='col-md-12 text-center'>
                            Currently, We don't have any Ended Airdrops in our Listing..
                        </div>
                        </>
                         :
                        <>
                        <div className='col-md-12 text-center'>
                           Please Wait...
                        </div>
                        </>
                    }
                    
                </div>
            </div>
        </div>

            {/* <div className="tab-content">
                    <div id="active_icos" className="tab-pane fade show in active">
                        <div className=''>
                            <ICO_active />
                        </div>
                    </div>
                    <div id="upcoming_icos" className="tab-pane fade">

                        <ICO_completed />
                    </div>
                    <div id="completed_icos" className="tab-pane fade">
                        <ICO_upcoming />
                    </div>
                   
                </div> */}
            </div>
            </div>

            <div className={"modal " + (category_modal.status ? " modal_show" : " ")} >
                <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h4 className="modal-title">Categories</h4>
                    <button type="button" className="close" data-dismiss="modal" onClick={() => set_category_modal({status:false, message:[]})}><span><img src="/assets/img/close_icon.svg" alt="Close" /></span></button>
                    </div>
                    <div className="modal-body">
                    
                    <ul className='category-ul '>
                        {
                        category_modal.message.map((item, i) => 
                        
                        <li key={i} className='mb-2'><Link href={"/category/"+item.category_id}>{item.category_name}</Link></li>
                        
                        )
                        }
                    </ul>
                
                    </div>
                </div>
                </div>
            </div>
            {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}           
            </> 
    )
}

export async function getServerSideProps({req, query}) 
{
   const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
   const user_token = userAgent.user_token ? userAgent.user_token : ""

   return { props: { userAgent:userAgent, user_token:user_token }}
}