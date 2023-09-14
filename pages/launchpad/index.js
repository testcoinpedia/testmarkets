import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Axios from 'axios'
import { getLaunchpadType } from '../../config/helper' 
import { API_BASE_URL, market_coinpedia_url, config, IMAGE_BASE_URL} from '../../components/constants'; 
import cookie from 'cookie'
import moment from 'moment'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import JsCookie from "js-cookie"
import ICO_header from '../../components/ico_calender/header'

export default function MyFunction() 
{
   
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

  useEffect(() => 
  {
    getICOList()
  } , [search_value, search_networks])

  const getICOList = async () => 
  {
    set_content_loader_status(true)
    const res = await Axios.get(API_BASE_URL+"markets/launchpads/active/0/100"+"?search="+search_value+"&search_networks="+search_networks, config(""))
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
        const res = await Axios.get(API_BASE_URL+"markets/launchpads/overview", config(""))
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

  return (
        <>
        <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>Crypto Launchpad - Find List of Upcoming ICO, IDO, IEO, IGO, and More</title>
         <meta name="description" content="Find the latest projects launching on Top crypto launchpads. Discover the next big crypto opportunities like ICOs, IDOs, and IEOs. Stay tuned for exciting launches!"/>
         <meta name="keywords" content={"Coinpedia coin launch calendar, coin launch, ico calendar, best crypto icos,  ICO, IDE, IEO, IGO, Presales, crypt "+moment().format('MMMM YYYY')+", crypto news, crypto launchpad, best crypto to buy, new presales."} />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Crypto Launchpad - Find List of Upcoming ICO, IDO, IEO, IGO, and More" />
         <meta property="og:description" content="Find the latest projects launching on Top crypto launchpads. Discover the next big crypto opportunities like ICOs, IDOs, and IEOs. Stay tuned for exciting launches!" />
         <meta property="og:url" content={market_coinpedia_url+"launchpad/"} />
         <link rel="canonical" href={market_coinpedia_url+"launchpad/"}/>
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="Crypto Launchpad - Find List of Upcoming ICO, IDO, IEO, IGO, and More" />
         <meta name="twitter:description" content="Find the latest projects launching on Top crypto launchpads. Discover the next big crypto opportunities like ICOs, IDOs, and IEOs. Stay tuned for exciting launches!" />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        
         <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Coin Launch Calendar"}`,
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
                  "name": "Coin Launch Calendar",
                  "item": "https://markets.coinpedia.org/launchpad/"
                }
              ]
            }`,
          }}
        />
      </Head>
    <div className="page ico_calendar">
        <ICO_header active_tab={1} overview_counts={overview_counts}/>

        <div className=''>
            <div className='container'>
            <div className=' header_tabs_row mt-3'>
                <div className='row'>
                    <div className='col-md-8 col-xl-9 col-lg-9 col-12'>
                        <div className='ico_header_lists'>
                            <ul>
                                <li onClick={()=>set_search_networks("")}  className={search_networks == "" ? " active":""}>All</li>
                                {
                                    crypto_networks.length ?
                                    crypto_networks.map((item, i) =>
                                    <li onClick={()=>set_search_networks(item._id)} key={i} className={search_networks == item._id ? " active":""}>{item.network_name}</li>
                                    )
                                    :
                                    ""
                                }
                            </ul>
                        </div>
                    </div>
                    {/* <li className='image_fire'><img src="/assets/img/fire_icon.svg" /></li> */}
                    {/* <button className='button_blue_transition kyc_button'>KYC &nbsp;<span><img src="/assets/img/finger_print.svg" /></span></button> */}

                    <div className='col-md-4 col-xl-3 col-lg-3 col-12'>
                        <div class="input-group search_filter new_design_serach">
                            <input value={search_value} onChange={(e)=> set_search_value(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search" />
                            <div class="input-group-prepend ">
                                <span class="input-group-text">
                                    <img src="/assets/img/search_large.svg" alt="search-box" width="100%" height="100%" />
                                </span>
                            
                                <span class="input-group-text" onClick={()=>resetFilter()}>
                                    <img src="/assets/img/reset.svg" alt="search-box" width="100%" height="100%" />
                                </span>
                            </div>
                        </div>  
                    </div>

                    {/* <div className='col-md-12 col-lg-12 col-xl-1 col-12'>
                        <button className='btn btn-secondary' >Reset</button>
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
                        <div className='col-lg-6 col-xl-4 col-md-6 col-12'>
                            <div className='ico_cards'>
                                <div className="card">
                                    <div className="card-body">
                                    <div className='media'>
                                        <div className='media-left align-self-center'>
                                        <img src={(item.token_image ? image_base_url+item.token_image: item.coinmarketcap_id ? cmc_image_base_url+item.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.token_name}  />
                                        </div>
                                        <div className='media-body align-self-center'>
                                            <h4 style={{textTransform:"capitalize"}}>{item.title}
                                                <span className='launchpad-type'>
                                                    {getLaunchpadType(item.launchpad_type)}
                                                </span>
                                            </h4>
                                            <p>{item.launchpad_price ? "$"+item.launchpad_price:""}</p>
                                        </div>
                                    </div>
                                    
                                    {
                                        item.categories_names ?
                                        item.categories_names[0] != "" ?
                                        <div className='icos_tags_detail'>
                                        <ul>
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
                                                    <li onClick={()=>set_category_modal({status:true, message:(item.categories_names ? item.categories_names:[])})}>+{item.categories_names.length-2}</li>
                                                    :
                                                    ""
                                                    }
                                                </>
                                                    :
                                                    ""
                                            }
    
                                           
                                        </ul>
                                        </div>
                                        :
                                        ""
                                        :
                                        ""
                                    }
                                   
                                    
                                    <div className='ico_prices_details'>
                                    <div className='row'>
                                        <div className='col-md-6 col-6'>
                                            <p>Listing Price:</p>
                                            <h6>{item.listing_price ? "$"+item.listing_price:"TBA"}</h6>
                                        </div>
                                        <div className='col-md-6 col-6'>
                                            <p>Sale Tokens: </p> 
                                            <h6>
                                                {item.tokens_for_sale ? 
                                                <>
                                            
                                                {"$"+item.tokens_for_sale}
                                                ({item.percentage_of_total_supply ? +(item.percentage_of_total_supply).toFixed(2)+"%":""})
                                                </>:"TBA"}
                                            </h6>
                                        </div>
                                    </div>
                                    </div>
                                    
                                    <div className='ico_prices_details'>
                                    <div className='row'>
                                        {
                                            item.network_name ?
                                            <div className='col-md-6 col-6'>
                                                <p>Network: </p>
                                                <h6>{item.network_name}</h6>
                                            </div>
                                            :
                                            ""
                                        }



                                            <div className='col-md-6 col-6'>
                                                <p>Accept Payment: </p>
                                                <h6>
                                                    {
                                                        item.accepts_payments ?
                                                        item.accepts_payments[0] ?
                                                        item.accepts_payments.map((inner, i) =>
                                                        <>
                                                        {
                                                            i < 2 ?
                                                            <span>{inner}{((item.accepts_payments.length-1) != i) ? ', ':""}</span>
                                                            :
                                                            ""
                                                        }
                                                        </>
                                                        )
                                                        :
                                                        "TBA"
                                                        :
                                                        "TBA"
                                                    }

                                                    {
                                                        item.accepts_payments.length > 2 ?
                                                        <>
                                                        
                                                        <OverlayTrigger
                                                            delay={{ hide: 450, show: 300 }}
                                                                overlay={(props) => (
                                                                <Tooltip {...props} className="custom_pophover">
                                                                    <div>
                                                                    {
                                                                            item.accepts_payments ?
                                                                            item.accepts_payments[0] ?
                                                                            item.accepts_payments.map((inner, i) =>
                                                                            <span>{inner}{((item.accepts_payments.length-1) != i) ? ', ':""}</span>
                                                                            )
                                                                            :
                                                                            "TBA"
                                                                            :
                                                                            "TBA"
                                                                        }
                                                                    </div>
                                                                </Tooltip>
                                                                )}
                                                                placement="bottom"
                                                            ><span>+{item.accepts_payments.length-2} Other</span>
                                                            </OverlayTrigger>
                                                        </>
                                                        
                                                        :
                                                        ""
                                                    }   
                                                </h6>
                                            </div>
                                        </div>
                                    </div>
                                    </div>

                                    <div className="card-footer">
                                        <div className='row'>
                                            <div className='col-md-11 col-10'>
                                                {
                                                   item.start_date ?
                                                   <p><img src="/assets/img/calander-ico.svg" alt="Calander" className="ico_calander_icon" />  
                                                   {
                                                     moment(item.start_date).utc().format('YYYY') == moment(item.start_date).utc().format('YYYY') ?
                                                     <>
                                                     {moment(item.start_date).utc().format('MMM D')} - {moment(item.end_date).utc().format('MMM D YYYY')}
                                                     </>
                                                     :
                                                     <>
                                                     {moment(item.start_date).utc().format('MMM D YYYY')} - {moment(item.end_date).utc().format('MMM D YYYY')}
                                                     </>
                                                   }
                                                   </p>
                                                   :
                                                   <p><img src="/assets/img/calander-ico.svg" alt="Calander" className="ico_calander_icon" />  TBA</p> 
                                                }
                                                
                                            </div>
                                            {/* <div className='col-md-5'>
                                                {
                                                   item.end_date ?
                                                   <p>End:  </p>
                                                   :
                                                   <></> 
                                                }
                                            </div> */}
                                            <div className='col-md-1 text-right p-0 col-2'>
                                                <Link href={"/"+item.token_id+"?tab=ico&tab_id="+item._id}><img src="/assets/img/ico_view.svg" alt="View"  className="ico_airdrop_arrow" /></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        ) 
                        :
                        <>
                        <div className='col-md-12 text-center'>
                            Currently, We don't have any Active ICO's in our Listing..
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

            </> 
    )
}