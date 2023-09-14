import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link' 
import cookie from "cookie"
import { API_BASE_URL, roundNumericValue, config, getShortWalletAddress, app_coinpedia_url, separator , market_coinpedia_url, graphqlApiKEY, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'  
import Head from 'next/head'
import { createChart, ColorType } from 'lightweight-charts'
import TableContentLoader from '../components/loaders/tableLoader'
// import Select from 'react-select'
import moment from 'moment'
import { arrangeData } from '../components/token_details/tokenDetailsFunctions' 
import { useRouter } from 'next/navigation'

export default function Companies({user_token, config, userAgent})
{ 
    const router = useRouter()
    const myRef = useRef(null)
    const chartContainerRef =useRef("")
    const [show_message_status, set_show_message_status] = useState(false)
    // const { active_category_tab } = router.query
    const active_category_tab =''
    const [tokens_list, set_tokens_list] = useState([]) 
    const [per_page_count, set_per_page_count] = useState(50)
    const [sl_no, set_sl_no]=useState(0)
    const [loader_status, set_loader_status] = useState(false)
    const [search_title, set_search_title] = useState("")  
    const [category_row_id, set_category_row_id] = useState((active_category_tab > 0) ? active_category_tab : "") 
    
    
    useEffect(()=>
    {  
        plotGraph()
        tokensList()
    },[per_page_count, search_title, category_row_id]) 

   


    const plotGraph = async () =>
    {   
        try
        {  
            const response = await Axios.get('http://localhost:3010/')
            if(response.data.message)
            {
                
              const { final_array, volume_array} = await arrangeData(response.data.message)
            // console.log("low_value", low_value)
            // console.log("high_value", high_value)
                console.log("final_array", final_array)
                console.log("volume_array", volume_array)
                if(chartContainerRef.current)
                {   

                  
                    set_show_message_status(true)
                    const chart = createChart(chartContainerRef.current, {
                        layout: {
                            background: { type: ColorType.Solid, color: "white",  },
                            textColor: '#8f98aa'
                        },
                        autoSize: false,
                        
                        width: chartContainerRef.current ? chartContainerRef.current.clientWidth:600,
                        height: 350,
                    })
                    console.log("chartContainerRef", chart)
            
                    chart.applyOptions({
                        autoSize: false,
                        leftPriceScale: {
                            visible: true,
                        },
                        rightPriceScale: {
                            visible: false,
                        },
                        crosshair:{
                            CrosshairLineOptions:
                            {
                                crosshairMarkerVisible:false
                                
                            }
                        },
                        // handleScroll:{
                        //      mouseWheel:false,
                        //    pressedMouseMove:false,
                        //    horzTouchDrag:true,
                        //    vertTouchDrag:true,
                        // },
                        // handleScale:
                        // {
                        //     mouseWheel:false
                        // },
                        grid: {
                            vertLines: {
                                visible: false,
                            },
                            horzLines:{
                                color:'#eff2f5'
                            }
                        },
                        trackingMode:true,
                        timeScale: {
                        timeVisible: true,
                        secondsVisible: false,
                        },
                    })
            
                    const baselineSeries = chart.addBaselineSeries({
                        baseValue: { type: 'price', price: 5 },
                        priceLineVisible: false,
                        lineWidth:2,
                        topLineColor: 'rgba( 24, 199, 100, 1)', topFillColor1: 'rgba( 24, 199, 100, 0.68)',
                        topFillColor2: 'rgba( 24, 199, 100, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)',
                        bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.68)'
                    });
                    baselineSeries.setData(final_array)
                    chart.timeScale().fitContent();
            
                    chart.priceScale("left").applyOptions({
                        borderColor: '#eff2f5',
            
                    });
                    
            
                    chart.timeScale().applyOptions({
                        borderColor: '#eff2f5',
                    });
        
                    const avgPriceLine = {
                        price: parseFloat(5),
                        color: '#cfd6e3',
                        // lineWidth: 2,
                        // lineStyle: 1, // LineStyle.Dotted
                        axisLabelVisible: true,
                        // title: 'ave price',
                    };
                   
                    baselineSeries.createPriceLine(avgPriceLine);
        
                    const volumeSeries = chart.addHistogramSeries({
                        color: '#cfd6e3',
                        priceFormat: {
                            type: 'volume',
                        },
                        priceScaleId: '', // set as an overlay by setting a blank priceScaleId
                        // set the positioning of the volume series
                        scaleMargins: {
                            top: 0.9, // highest point of the series will be 70% away from the top
                            bottom: 0,
                        },
                        height: 100
                    });
                    volumeSeries.priceScale().applyOptions({
                        scaleMargins: {
                            top: 0.9, // highest point of the series will be 70% away from the top
                            bottom: 0,
                        },
                    });
        
                    volumeSeries.setData(volume_array)
                    
                    
                    // window.addEventListener('resize', () => {
                    //     chart.resize(window.innerWidth, window.innerHeight);
                    // });
            
            
                    
                    const toolTipWidth = 80;
                    const toolTipHeight = 80;
                    const toolTipMargin = 15;
            
                    // Create and style the tooltip html element
                    const toolTip = document.createElement('div');
                    toolTip.style = ` position: absolute; display: none;  box-sizing: border-box; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
                    toolTip.style.background = `white`;
                    toolTip.style.color = 'black';
                    toolTip.style.borderColor = 'white';
                    chartContainerRef.current.appendChild(toolTip);
            
                    // update tooltip
                    chart.subscribeCrosshairMove(param => {
                        if (
                            param.point === undefined ||
                            !param.time ||
                            param.point.x < 0 ||
                            param.point.x > chartContainerRef.current.clientWidth ||
                            param.point.y < 0 ||
                            param.point.y > chartContainerRef.current.clientHeight
                        ) {
                            toolTip.style.display = 'none';
                        } else {
                            // time will be in the same format that we supplied to setData.
                            // thus it will be YYYY-MM-DD
                            // console.log("param", param)
                            const dateStr = param.time;
                            toolTip.style.display = 'block';
                            const data = param.seriesData.get(baselineSeries);
                            const price = data.value !== undefined ? data.value : 6;
        
                            const data2 = param.seriesData.get(volumeSeries)
                            const volume_24h = data2.value !== undefined ? data2.value : 5
                            
        
                            toolTip.innerHTML =`
                            <div style="width: 220px; border:1px solid #E6EBEF;padding: 8px; border-radius: 5px;font-family: 'Space Grotesk';">
                                <h4 style="font-size: 13px;font-family: 'Space Grotesk'; color: ${price>33 ? "green":"red" }">
                                    ${moment.unix(dateStr).format('DD MMM YYYY')}
                                    <span style="float:right;font-family: 'Space Grotesk';">${moment.unix(dateStr).format('hh:mm a')}</span>
                                </h4>
                                <h5 style="font-size: 15px;font-family: 'Space Grotesk';color: ${'black'}; margin-top: 10px;">
                                <div class="tooltip-dot dot-danger" style="position: relative; top: 0; width: 10px; height: 10px;"></div> 
                                    <strong style="font-family: 'Space Grotesk';">Trade Price:</strong>
                                    $ ${price.toFixed(6)}
                                </h5>
                                <br/>
                                <h6 style="font-size: 13px;font-family: 'Space Grotesk';color: #666"><strong style="font-family: 'Space Grotesk';">Trade Value:</strong>  ${separator(volume_24h.toFixed(2))} UNI</h6>
                            </div>`;
            
                            const y = param.point.y;
                            let left = param.point.x + toolTipMargin;
                            if (left > chartContainerRef.current.clientWidth - toolTipWidth) {
                                left = param.point.x - toolTipMargin - toolTipWidth;
                            }
            
                            let top = y + toolTipMargin;
                            if (top > chartContainerRef.current.clientHeight - toolTipHeight) {
                                top = y - toolTipHeight - toolTipMargin;
                            }
                            toolTip.style.left = left + 'px';
                            toolTip.style.top = top + 'px';
                        }
                    });
        
                    const handleResize=()=>
                    {
                        chart.applyOptions({
                            width:chartContainerRef.current?.clientWidth,
                            // height:400
                        })
                    }
                    window.addEventListener('resize', handleResize)
                
                    return () => {chart.remove();
                    window.removeEventListener('resize', handleResize)
                    }
                }
            }
        }
        catch(err)
        {
            // set_graph_status(false)
        }
        
    }

    const tokensList = async () =>
    {  
       set_loader_status(false)  
        const res = await Axios.get("http://localhost:3010/", config)
        if(res.data)
        {
            if(res.data.status === true)
            {     set_loader_status(true)  
                console.log("res",res) 
               
                set_tokens_list(res.data.message)
                //setfinalcount(parseInt(current_pages)+parseInt(per_page_count))
                
            } 
        }
    }
   
 
return (
    
   <>
      <Head>
         <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
         <title>Trending Categories on Coinpedia Markets</title>
         <meta name="description" content="Discover the trending categories today on Coinpedia markets, sorted as per the search volume, most views of the news, and market behavior."/>
         <meta name="keywords" content="Trending categories, top trending crypto categories, trending crypto categories, meme, defi, blockchain, AI, DAO, Dapps, web3 gaming, exchange coinpedia markets, bitcoin price, Ethereum price, live prices, top gainers in crypto, top losers crypto, trending coins, meme coins, defi coins, crypto price prediction, crypto price analysis." />
         <meta property="og:locale" content="en_US" />
         <meta property="og:type" content="website" />
         <meta property="og:title" content="Trending Categories on Coinpedia Markets" />
         <meta property="og:description" content="Discover the trending categories today on Coinpedia markets, sorted as per the search volume, most views of the news, and market behavior." />
         <meta property="og:url" content={market_coinpedia_url + "categories/"} />
         <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
         <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
         <meta property="og:image:width" content="400" />
         <meta property="og:image:height" content="400" />
         <meta property="og:image:type" content="image/png" />
         <meta name="twitter:card" content="summary" />
         <meta name="twitter:site" content="@coinpedia" />
         <meta name="twitter:creator" content="@coinpedia" />
         <meta name="twitter:title" content="Trending Categories on Coinpedia Markets" />
         <meta name="twitter:description" content="Discover the trending categories today on Coinpedia markets, sorted as per the search volume, most views of the news, and market behavior." />
         <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

         <link rel="canonical" href={market_coinpedia_url + "categories/"}/>
         <script type="application/ld+json"  
          dangerouslySetInnerHTML={{
            __html: `{"@context":"http://schema.org","@type":"Table","about":"Categories"}`,
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
                  "name": "Categories",
                  "item": "https://markets.coinpedia.org/categories/"
                }
              ]
            }`,
          }}
        />
      </Head>

      {/* <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}> */}
      <div className="page new_markets_index min_height_page markets_new_design" ref={myRef}>
      <div className="market-page">


        
        
          <div className="container price-tracking-tbl">
          <div className="col-md-12">
          <div className="row">

            

         
            <div className="col-md-3">
            </div> 
          </div>
           
              <div className="prices transaction_table_block">

              
            
               
                <div className="market_page_data categories_table new_token_page">

                <div ref={chartContainerRef}>
                </div>

                     <div className="table-responsive">
                       <table className="table table-borderless">
                         <thead>
                            <tr>
                                <th className="mobile_hide_view" style={{minWidth: '15px'}}>#</th>
                                <th>tx type</th>
                                <th>date_n_time</th>
                                {/* <th>liqidity_row_id</th> */}
                                <th>token_amount</th>
                                <th>token_price</th>
                                {/* <th>token_row_id</th> */}
                                <th>tx_from_address</th>
                                <th>tx_hash</th>
                               
                            </tr>
                        </thead>
                        <tbody>
                           {
                            loader_status ?
                           <>
                           {
                             tokens_list.length > 0
                             ?
                             tokens_list.map((item, i) => 
                             <tr key={i}>
                                    <td className="mobile_hide_view wishlist"> {sl_no+i+1}
                                    </td>
                                    <td>
                                    {
                                    item.tx_type == 1 ? 
                                    <span className='red'>buy</span>
                                    :
                                    <span className='green'>sell</span>
                                    }
                                    </td>
                                    <td>{item.date_n_time}</td>
                                    {/* <td>{item.liqidity_row_id}</td> */}
                                    <td>{roundNumericValue(item.token_amount)} UNI</td>
                                    <td>${roundNumericValue(item.token_price)}</td>
                                    {/* <td>{item.token_row_id}</td> */}
                                    <td>{getShortWalletAddress(item.tx_from_address)}</td>
                                    <td>{getShortWalletAddress(item.tx_hash)}</td>
                                    
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
                             <TableContentLoader row="10" col="6" />  
                          }
                           
                         </tbody>
                       </table>
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
      

          <div class="modal" id="trending-modal">
            <div class="modal-dialog modal-lg">
              <div class="modal-content">
              
                <div class="modal-header">
              
                  <button type="button" class="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" alt="Close" /></span></button>
                </div>
                
                <div class="modal-body">
          
                  <ul className="trending-tokens">
                    <li><img src="/assets/img/markets/trending.png" alt="trending"/> Trending Coin:</li>
                    <li><img src="/assets/img/markets/bitcoin.png" alt="bitcoin"/> Bitcoin (BTC) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">03.56%</span></li>
                    <li><img src="/assets/img/markets/arbitrum.png" alt="arbitrum"/> Arbitrum (ARB) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">04.06%</span></li>
                    <li><img src="/assets/img/markets/shiba.png" alt="shiba"/> Shiba(INU) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                    <li><img src="/assets/img/markets/ethereum.png" alt="ethereum"/> Ethereum(ETH) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">03.84%</span></li>
                    <li><img src="/assets/img/markets/dogecoin.png" alt="dogecoin"/> Dogecoin(DOGE) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
                    <li><img src="/assets/img/markets/dogecoin.png" alt="dogecoin"/> Dogecoin(DOGE) <span><img src="/assets/img/markets/up.png" alt="up" /></span><span className="text-green">0.98%</span></li>
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