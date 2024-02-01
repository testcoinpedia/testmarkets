import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import ReactPaginate from 'react-paginate'  
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../components/constants'; 
import Axios from 'axios'  
import Head from 'next/head'

import { useSelector, useDispatch } from 'react-redux'
import SearchContractAddress from '../components/search_token'
import CategoriesTab from '../components/categoriesTabs'
import TableContentLoader from '../components/loaders/tableLoader'
import moment from 'moment'
import JsCookie from "js-cookie"
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Slider from 'react-slick';
import TopRankedEtf from '../components/etf-tracker/top-ranked-etf';
import HighestEtf from '../components/etf-tracker/highest-etf';


// import Select from 'react-select'
import { useRouter } from 'next/navigation'


export default function ETFTracker({userAgent , initialData, data  })
{ 
    const { userData, active_currency } = useSelector(state => state)
    const router = useRouter()
    const myRef = useRef(null)
    //const { active_category_tab } = router.query
    const active_category_tab = ''
    const [etf_list, set_etf_list] = useState([]) 
    const [overview_list, set_overview_list] = useState([]) 
    const [per_page_count, set_per_page_count] = useState(100)
    const [sl_no, set_sl_no]=useState(0)
    
    const [loader_status, set_loader_status] = useState(false)

    const [user_token, set_user_token] = useState(userAgent.user_token? userAgent.user_token:"");
   

    const [repeater, set_repeater] = useState(0)
    console.log("repeater",repeater)

    const [filteredOverviewList, setFilteredOverviewList] = useState([]);
    const [selectedType, setSelectedType] = useState('All');

    const [isMobileView, setIsMobileView] = useState(false);


    const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [filteredData, setFilteredData] = useState(data); 



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


      const fetchData = async () => 
      {
        try 
        {
            const res = await Axios.get(API_BASE_URL + "markets/exchange_traded_funds/list/0/50", config(""));
             if(res.data)
            {   
                set_loader_status(false)
                if(res.data.status)
                {    
                  await set_overview_list(res.data.message)
                } 
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

      useEffect(() =>  
      { 
          fetchData()
          setTimeout(() => set_repeater(prevState=>prevState+1), 10000)
      }, [repeater])


  
    const handleTypeChange = (type) => {
      setSelectedType(type);
  }
  
  const filterOverviewList = () => {
      if (selectedType === 'All') {
          setFilteredOverviewList(overview_list);
      } else {
          const filteredList = overview_list.filter(item => item.type === selectedType);
          setFilteredOverviewList(filteredList);
      }
  }



      const total_marketcap = overview_list.reduce((total, etf) => total + (etf.market_cap || 0), 0);
      const total_volume = overview_list.reduce((total, etf) => total + (etf.volume * etf.price || 0), 0);

      const settings = {
        dots: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: false,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: false,
              dots: true,
            },
          },
          {
            breakpoint: 991,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: false,
              dots: true,
            },
          },
          {
            breakpoint: 767,
            settings: {
              dots: true,
              autoplay: true,
              autoplaySpeed: 5000,
              infinite: true,
              slidesToShow: 1,
              slidesToScroll: 1,
              // adaptiveHeight: true,
            },
          },
        ],
    };

  let countType1 = 0;
  let countType2 = 0;


  overview_list.forEach((e) => {
    if (e.network_types[0] === 1) {
      countType1++;
    } else if (e.network_types[0] === 2) {
      countType2++;
    }
  })
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    handleResize(); // Check initial viewport width
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])





useEffect(() => {
  filterOverviewList();
}, [overview_list, selectedType]);
   
return (
   <>
      <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>Crypto ETF Tracker : Real Time Price, Market Cap, Fee, Volume & More</title>
         <meta name="description" content=" Discover real-time data on Crypto ETFs including tickers, prices, market caps, and volumes. Our tracker provides all the essential information for Bitcoin ETF tracker and Ethereum ETF tracker.  "/>
         <meta name="keywords" content="Crypto ETF Tracker , Crypto ETF Data , Crypto ETF Insights , Crypto ETF Scanner , Crypto ETF Explorer.  " />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Crypto ETF Tracker : Real Time Price, Market Cap, Fee, Volume & More" />
         <meta property="og:description" content=" Discover real-time data on Crypto ETFs including tickers, prices, market caps, and volumes. Our tracker provides all the essential information for Bitcoin ETF tracker and Ethereum ETF tracker.  " />
         <meta property="og:url" content={market_coinpedia_url + "crypto-etf/"} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="Crypto ETF Tracker : Real Time Price, Market Cap, Fee, Volume & More" />
         <meta name="twitter:description" content=" Discover real-time data on Crypto ETFs including tickers, prices, market caps, and volumes. Our tracker provides all the essential information for Bitcoin ETF tracker and Ethereum ETF tracker.  " />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url + "crypto-etf/"} />

         <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Crypto ETF Tracker"}`,
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
                  "name": "Crypto ETF Tracker",
                  "item": "https://markets.coinpedia.org/crypto-etf/"
                }
              ]
            }`,
          }}
        />
      </Head>

      <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}>
      <div className="market-page">
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                <h1 className="page_title">Crypto ETF Tracker </h1>
                  <p>Crypto ETF Tracker provides live market data on Bitcoin and Ethereum ETFs.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4 " >
                  <SearchContractAddress /> 
                </div>
              </div>

              <Slider {...settings}>
          <div>
          <div className="etf_overview_block">
                <div className="row">
                  <div className='col-4 col-md-4'>
                    <div className='total_etfs_count'>
                      <h4>{overview_list.length}</h4>
                    </div>
                  </div>

                  <div className='col-8 col-md-8'>
                    <div className='parted_list_etf'>
                    <ul>
                        <li>
                          <p><span>
                          <img src="/assets/img/bitcoin_etf.svg" alt="Bitcoin" title="Bitcoin" /></span> &nbsp; {countType1}
                          </p>
                        </li>
                        <li>
                        <p><span>
                          <img src="/assets/img/ethereum_etf.svg" alt="Ethereum" title="Ethereum" /></span> &nbsp; {countType2}
                          </p>
                        </li>
                  </ul>
                    </div>
                    </div>
                </div>
                <div className='total_etfs_count'>
                      <p>Total Running ETF</p>
                    </div>
             </div>

                          
                <div className='market-overview '>

                <table className="market_overview_table mt-0">
                  <tbody>

                    <tr>
                      <td>
                        <h6 className="media-heading token-name"> Total Marketcap</h6>
                      </td>
                      <td>
                        <h6 className="media-heading token-name text-right"> {convertCurrency(total_marketcap)}</h6>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <h6 className="media-heading token-name"> Total 24H Volume</h6>
                      </td>
                      <td>
                        <h6 className="media-heading token-name text-right"> {convertCurrency(total_volume)}</h6>
                      </td>
                    </tr>
                  </tbody>
              </table>
            </div>
          </div>
          <div>
                {
                  overview_list.length > 0 ?
                  <TopRankedEtf 
                  overview_list={overview_list}
                  />
                  :
                  ""
                }
                </div>

                <div>
                {
                  overview_list.length > 0 ?
                  <HighestEtf 
                  overview_list={overview_list}
                  />
                  :
                  ""
                }
                </div>
             
        
        </Slider>


            <div>
            <div className="all-categories-list">
            <CategoriesTab active_tab={10} user_token={user_token}/> 
            </div>

    </div>

    

    </div>
</div>
</div>


        
          <div className="container price-tracking-tbl etf_tracker_table">
          <div className="col-md-12">
         
              <div className="prices transaction_table_block">
              <div className='row'>
             <div className="col-md-12 col-lg-6 col-12">
                        <h4 className="markets_subtitle">
                        Crypto ETF Tracker
                        </h4>
                      </div>
                       <div className="col-md-12 col-lg-6 col-12 filter-category-section">
                      <ul className='etf_tabs_track'>
                        {isMobileView ?
                        <>
                        <div className='row'>
                          <div className='col-10 pr-1'>
                          <nav className="etf_tracker_tabs">
                      <div className="nav-pill active">
                                <Link href="/crypto-etf/">Overview</Link>
                              </div>
                            <div className="nav-pill ">
                                <Link href="/bitcoin-etf">Bitcoin ETF</Link>
                              </div>
                              <span className="tabs_partition mx-1"></span>
                              <div className="nav-pill">
                                <Link href="/ethereum-etf">Ethereum ETF</Link>
                              </div>
                            </nav>
                          </div>
                          <div className='col-2 pl-1'>
                          <div className='etf_filter_block'>
                                <div className='etf_dropdown'>
                                    <button className="etf_tracker_tabs" type="button" data-toggle="dropdown" aria-expanded="false">
                                       <img src="/assets/img/etf_filter.svg" alt="Filter" />                                        
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <span className="dropdown-item" onClick={() => handleTypeChange('All')}>All</span>
                                        <span className="dropdown-item" onClick={() => handleTypeChange('Spot')}>Spot</span>
                                        <span className="dropdown-item" onClick={() => handleTypeChange('Futures')}>Futures</span>
                                    </div>
                                </div>
                            </div>
                          </div>
                        </div>
                        </>
                        :
                        <>
                        <li>
                      <nav className="etf_tracker_tabs">
                      <div className="nav-pill active">
                                <Link href="/crypto-etf/">Overview</Link>
                              </div>
                            <div className="nav-pill ">
                                <Link href="/bitcoin-etf">Bitcoin ETF</Link>
                              </div>
                              <span className="tabs_partition mx-1"></span>
                              <div className="nav-pill">
                                <Link href="/ethereum-etf">Ethereum ETF</Link>
                              </div>
                            </nav>
                            </li>

                            <li className='etf_filter_block '>
                                <div className='etf_dropdown'>
                                    <button className="etf_tracker_tabs" type="button" data-toggle="dropdown" aria-expanded="false">
                                        {selectedType} <span className="filter_icon"><img src="/assets/img/fliter_etf.svg" alt="Filter" /></span>
                                        
                                    </button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        <span className="dropdown-item" onClick={() => handleTypeChange('All')}>All</span>
                                        <span className="dropdown-item" onClick={() => handleTypeChange('Spot')}>Spot</span>
                                        <span className="dropdown-item" onClick={() => handleTypeChange('Futures')}>Futures</span>
                                    </div>
                                </div>
                            </li>
                            </>
                        }
                        

                            <li className='last_updated'>
                              <h6>Last Update:  <span>
                                {moment(overview_list.update_time).format('MMM DD YYYY - hh:mm a')}                                
                              </span></h6>
                              
                            </li>
                          </ul> 
                          </div>
             </div>
                <div className="row">
                  <div className="col-md-12 col-12">
                  
                            <div className="market_page_data">
                     <div className="table-responsive">
                       <table className="table table-borderless">
                         <thead>
                            <tr>


                                <th className="mobile_fixed_first" style={{minWidth: '35px'}}>#</th>
                                <th className="mobile_fixed table-cell-shadow-right name_col">
                                Ticker</th>
                                  <th>
                                  Issuer
                                  </th>
                                  <th>Type
                                  </th>
                                <th className='table-cell-shadow-right name_col' style={{width: '150px'}}>ETF Name</th>
                                
                                <th className=" ">Price </th>
                                <th className="etf_table_width">                               
                                  Price Change&nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p> This indicates the percentage change in the ETF's price since the previous measurement period.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                  </OverlayTrigger>
                                </th>
                                <th className="etf_table_width">Market Cap&nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>Marketcap in the context of a Bitcoin ETF tracker usually refers to the total market value of all the underlying Bitcoin holdings of the ETF.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                  </OverlayTrigger>
                                </th>
                                <th className='etf_table_width'>Fee&nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>A charge or payment for a service or privilege.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                  </OverlayTrigger>
                                </th>
                                <th className='etf_table_width'>AUM&nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>Assets Under Management (AUM) indicates the total market value of all outstanding shares of the ETF.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                  </OverlayTrigger>
                                </th>
                                <th className='etf_table_width'>Volume(24)&nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>Refers to the total amount of Bitcoin ETF shares traded within the past 24 hours.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                  </OverlayTrigger>
                                </th>
                                <th className='etf_table_width'>Custodian&nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>Specifies the financial institution responsible for holding and safeguarding the physical Bitcoin assets underlying the ETF.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    ><span className='info_col' ><img src="/assets/img/info.png" alt="info" /></span>
                                  </OverlayTrigger>
                                </th>
                                
                                
                            </tr>
                         </thead>
                         
   
                         <tbody>
                           {
                            !loader_status ?
                           <>
                           {
                             filteredOverviewList.length > 0
                             ?
                             filteredOverviewList.map((e, i) => 
                             <tr key={i}>
                                    <td className=" mobile_fixed_first"> {sl_no+i+1}
                                    </td>
                                     <td className="mobile_fixed table-cell-shadow-right">
                                        <div className="media">
                                          <div className="media-body align-self-center m-0">
                                            {e.etf_symbol}
                                          <>
                                            {e.network_types [0] == 1 ?
                                            <p>(BTC)</p>
                                            :
                                            <p>(ETH)</p>
                                            }
                                            </>
                                          </div>
                                        </div>
                                     </td> 
                                     
                                     <td>{e.issuer} </td>

                                     <td> 
                                     
                                     {e.status == "Running" ? 
                                     <p className='running_status'>{e.status}</p> 
                                      : <p className='pending_status'>{e.status}</p> }


                                      
                                      {e.type}</td>

                                     <td className="btc_links_block"  style={{whiteSpace:"wrap"}}> 
                                     {e.etf_name}
                                      </td>

                                   
                                    
                                    <td className="btc_links_block">
                                    
                                       $ {e.price}   <p className='price_change_btc'>
                                      
                                       </p>
                                      
                                     </td>

                                     <td>
                                     {
                                        e.price_change?e.price_change>0?
                                        <h6 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{e.price_change.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(e.price_change.toFixed(2)).replace('-', '')+"%"}</span></h6>
                                        :
                                        "--"
                                        }
                                     </td>

                                     <td className='btc_links_block'>
                                        {e.market_cap ? convertCurrency(e.market_cap): "-"}
                                     </td>

                                     {/* <td className='btc_links_block'>{e.feeWaiver}</td> */}

                                     <td className='btc_links_block'>{e.fee ? (e.fee)+"%" : "-" }</td>

                                     <td> {e.aum ? convertCurrency(e.aum): "-"}</td>
                                    
                                     <td> {e.volume_usd ? convertCurrency(e.volume_usd): "-"}</td>
                                    
                                     <td>{e.custodian ? e.custodian : "-"}</td>

                                    
                               </tr> 
                             ) 
                             :
                             <tr >
                               <td className="text-lg-center text-md-left" colSpan="11">
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
                </div>
                   
                  
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
   var user_token = userAgent.user_token ? userAgent.user_token : ""

  return { props: {userAgent:userAgent, config:config(user_token), user_token:user_token}}
}
