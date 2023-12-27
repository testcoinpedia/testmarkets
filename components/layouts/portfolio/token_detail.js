/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import moment from 'moment'
// import Link from 'next/link' 
import dynamic from 'next/dynamic' 
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { getTokenInOutDetails, USDFormatValue, calAquisitionCost,roundNumericValue,getDaysList, getNetworkImageNameByID, getNetworkNameByID, getValueShortForm, getShortAddress,fetchAPIQuery,makeJobSchema,graphqlBasicTokenData,getTxnLinkByID, getGraphSparklineValues} from '../../../components/config/helper'
import { IMAGE_BASE_URL, API_BASE_URL, config } from '../../../components/constants'
import Net_worth_chart from '../../../components/layouts/portfolio/charts/net_worth'
import Link from 'next/link'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })


export default function TokenDetail({token}) 
{   
    // console.log("token", token)
   
    const active_currency = useSelector(state => state.active_currency)
    const [line_graph_values, set_line_graph_values] = useState([])
    const [line_graph_base_price, set_line_graph_base_price] = useState([])
    
    const [image_base_url] = useState(IMAGE_BASE_URL + "/markets/cryptocurrencies/")
    // console.log("line_graph_values",line_graph_values)
    const [line_graph_days, set_line_graph_days] = useState([])
    const [tab_type, set_tab_type] = useState(1)
    const [total_aquisition_cost, set_total_aquisition_cost] = useState(0)
    const [aquisition_list, set_aquisition_list] = useState([])
    const [txn_tab_type, set_txn_tab_type] = useState(0)
    const [worth_chart_type, set_worth_chart_type] = useState(2)
    const [balance_list,set_balance_list]=useState([])
    const [tokens_list_as_list_view] = useState(token.tokens_list)
    // new data integration
    const[token_price,set_token_price]=useState([])
    
    const[circuilating_supply,set_circuilating_supply]=useState("")
    const[market_cap,set_market_cap]=useState("")
    const[total_supply,set_total_supply]=useState("")
    const[max_supply,set_max_supply]=useState("")
    const[ath,set_ath]=useState("")
    const[atl,set_atl]=useState("")
    const[volume,set_volume]=useState("")
    const[fully_diluted_market_cap,set_fully_diluted_market_cap]=useState("")
    const[price_change_1hr,set_price_change_1hr]=useState("")
    const[price_change_7d,set_price_change_7d]=useState("")
    const[price_change_24h,set_price_change_24h]=useState("")
    const[token_other_details,set_token_other_details]=useState("")
    console.log("token_other_details",token_other_details)

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
          return '0'
        }
    }

    useEffect(()=>
    {
      if(token)
      {
        getOtherDetails()
        if(token.sparkline_in_7d)
        {
          setNetWorth(token.sparkline_in_7d, token.balance)
        }
        
      }
    },[true])

    const setNetWorth = async (prices_list, balance) =>
    { 
        var low_value = 0
        var high_value = 0
        const new_array = []
        if(prices_list)
        {
          for(let run in prices_list)
          { 
              var sumOne = await prices_list[run].price*balance
              
              if(run == 0)
              {
                low_value = sumOne
              }
              else
              {
                if(sumOne < low_value)
                {
                  low_value = await sumOne
                }
              }

              if(sumOne > high_value)
              {
                high_value = await sumOne
              }

              const current_country_time = await moment(prices_list[run].date_n_time).format("YYYY-MM-DDTHH:mm:ss")+".000Z"

              await new_array.push({
                value : sumOne,
                // counter: counter,
                time : Math.floor((new Date(current_country_time)).getTime()/1000)
              })
          }
        }

        const base_price = await parseFloat(((low_value+high_value)/2).toFixed(2))

        await set_line_graph_values(new_array)
        await set_line_graph_base_price(base_price)
        // console.log("low_value", low_value)
        // console.log("high_value", high_value)
        // console.log("new_array", new_array)
    }


    // const setChartWorth = async (pass_type) => {
    //   console.log("pass_type", pass_type)
    //   set_worth_chart_type(pass_type)
    //   const get_days_res = await getDaysList(token, token.balance, pass_type)
    //   await set_line_graph_days(get_days_res.line_graph_days)
    //   await set_line_graph_values(get_days_res.line_graph_values)
    // }
    const setChartWorth = (pass_type) => {
      // console.log("pass_type", pass_type)
      set_worth_chart_type(pass_type)
      //getDaysList(token, token.balance, pass_type)
    
    }

    // const getSevenDaysValues = async (sparkline_data, pass_data_type) => {
    //   var graph_values = []
    //   var loop_values = []
    //   console.log('sparkline_data', sparkline_data.price) 
    //   // 12 Hrs
    //   if (pass_data_type == 1) {
    //     //loop_values = [156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167]
    //   }
    //   // 1 Day
    //   else if (pass_data_type == 2) {
    //     loop_values = [143, 145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167]
    //   }
    //   // 7 Days
    //   else {
    //     loop_values = [0, 24, 48, 72, 96, 120, 145, 167]
    //   }
    //   for (let l of loop_values) {
    //     //console.log(l)
    //     if (sparkline_data.price) {
    //       if (sparkline_data.price[l]) {
    //         await graph_values.push(sparkline_data.price[l])
    //       }
    //     }
    //   }
    //   console.log("graph_values",graph_values)
    //   return graph_values
    // }

    

    // const getDaysList = async (balance_list,pass_balance,pass_data_type) => {
 
    //   var array_count = 0
    //   if (pass_data_type == 1) {
    //     array_count = 13
    //   }
    //   // 1 Day
    //   else if (pass_data_type == 2) {
    //     console.log("pass_data_type",pass_data_type)
    //     array_count = 13
    //   }
    //   // 7 Days
    //   else if (pass_data_type == 3) {
    //     array_count = 8
    //   }
    //   const past7Days = [...Array(array_count).keys()].map(index => {
    //     const date = new Date();
    //     if (pass_data_type == 1) {
    //       date.setHours(date.getHours() - index)
    //       if (index == 0) {
    //         return moment(date).format("h a")
    //       }
    //       else {
    //         return moment(date).format("h a")
    //       }
  
    //     }
    //     if (pass_data_type == 2) {
    //       date.setHours(date.getHours() - index * 2)
    //       if (index == 0) {
    //         return moment(date).format("h a")
    //       }
    //       else {
    //         return moment(date).format("h a")
    //       }
    //     }
    //     else {
    //       date.setDate(date.getDate() - index)
    //       return moment(date).format("DD MMM")
    //     }
    //   })
    //   const last_seven_days = past7Days.reverse()
    //   console.log("last_seven_days", last_seven_days)
  
    //   set_line_graph_days(last_seven_days)
    //    if(token.sparkline_in_7d)
    //     {
    //       console.log("token.sparkline_in_7d",token.sparkline_in_7d)
          
    //       set_line_graph_values(await getGraphSparklineValues(token.sparkline_in_7d, token.balance,pass_data_type))
    //     }

      
  
     
  
  
  
    //   // console.log("profit_loss_values",profit_loss_array)
    // }
  
    const getOtherDetails = async () =>
    {
      const api_response = await Axios.get(API_BASE_URL+ "markets/portfolio/token_details/"+token._id, config(""))
      if(api_response.data.status)
      {
        // console.log("api_response", api_response.data)
        // set_token_details(api_response.data.message)
        set_token_other_details(api_response.data.message)
        set_token_price(api_response.data.message.price)
        set_circuilating_supply(api_response.data.message.circulating_supply)
        set_market_cap(api_response.data.message.marketcap)
        set_total_supply(api_response.data.message.total_supply)
        set_max_supply(api_response.data.message.max_supply)
        set_ath(api_response.data.message.ath_price)
        set_atl(api_response.data.message.atl_price)
        set_volume(api_response.data.message.volume)
        set_fully_diluted_market_cap(api_response.data.message.fully_diluted_market_cap )
        set_price_change_1hr(api_response.data.message.percent_change_1h)
        set_price_change_7d(api_response.data.message.percent_change_7d)
        set_price_change_24h(api_response.data.message.percent_change_24h)

        
      }
      
      
        // const past7Days = [...Array(8).keys()].map(index => {
        //       const date = new Date();
        //         date.setDate(date.getDate() - index)
        //         return moment(date).format("DD MMM")
        //     })
        // const last_seven_days = past7Days.reverse()
        // set_line_graph_days(last_seven_days)
        // if(token.sparkline_in_7d)
        // {
        //   set_line_graph_values(await getGraphSparklineValues(token.sparkline_in_7d, token.balance))
        // }

      const response = await getTokenInOutDetails(token)
      if(response.total_aquisition_cost)
      {
        set_total_aquisition_cost(response.total_aquisition_cost)
      }
      if(response.data)
      {
        set_aquisition_list(response.data)
      }
      // console.log("response", response)
     
    }

  //  const getAquisition=async()=>{
  //   const response1=await calAquisitionCost()
  //   if(response1.aquisition_cost){
  //     set_total_aquisition_cost(response1.data)
  //   }
  //   console.log("response1",response1)
  //  }

    // const line_chart_series = [{
    //     name: "Asset Worth",
    //     data: line_graph_values
    // }]
  
    // const line_chart_options = {
    //     chart: {
    //       height: 350,
    //       toolbar: {
    //         show: false
    //       },
    //       // type: 'area',
    //       zoom: {
    //         enabled: false
    //       }
    //     },
    //     fill: {
    //       // type: 'gradient',
    //     },
    //     colors:['#2196F3'],
    //     dataLabels: {
    //       enabled: false
    //     },
    //     // stroke: {
    //     //   curve: 'straight'
    //     // },
        
    //     yaxis: {
    //       labels: {
    //         formatter: function (y) {
    //           return convertCurrency(y);
    //         }
    //       },
    //       lines: { 
    //         show: false  //or just here to disable only y axis
    //        },
        
          
    //     },
    //     stroke: {
    //       // curve: 'straight',
    //       width: 2,
    //     },
    //     // title: {
    //     //   text: 'Product Trends by Month',
    //     //   align: 'left'
    //     // },
    //     grid: {
    //       row: {
    //         // colors: ['#f3f3f3', 'transparent'], 
    //         opacity: 0.5
    //       },
    //     },
    //     xaxis: {
    //       categories: line_graph_days,
    //     }
    //   }

      
    return(
    <>
      {/* <h6>Portfolio</h6> */}


        <div className="media">
          <div className="media-left">
            <img title={token.name} src={image_base_url+token.image} onError={(e)=>{e.target.onerror = null; e.target.src=(token.network == 56 ? "/assets/img/portfolio/bsc.svg":token.network == 250 ? "/assets/img/portfolio/ftm.svg":token.network == 137 ? "/assets/img/portfolio/polygon.svg":token.network == 43114 ? "/assets/img/portfolio/avax.svg":"/assets/img/portfolio/eth.svg")}}  className="media-object" />
          </div>
          <div className="media-body">
            <h4 className="media-heading">{token.name} 
            </h4>
            {/* <span >{token.symbol}</span> */}
            <p className='token_balance'>Balance : <span className='token-details-head'>{USDFormatValue(token.balance, 0)} {token.symbol}</span> </p>
            <p className='token_balance mt-1'>In {active_currency.currency_code} :  <span className='token-details-head'>{(token.price) ? 
                <>
                  {convertCurrency(token.price*token.balance) }  </> 
                  : 
                  "-"
                } </span></p>
          </div>
        </div>

        <div className='row text-center'>
        <div className='col-md-6 col-6'>
            <div className="token-details-balance">
            <p>Acquisition Cost
           &nbsp;
           <OverlayTrigger
            delay={{ hide: 450, show: 200 }}
           overlay={(props) => (
          <Tooltip {...props} className="custom_pophover ">
              <p> The acquisition cost refers to the  the total balance in a user's wallet after buying or selling tokens. 
                It takes into account both the buying price and the selling price of the tokens,
                 providing a measure of the overall value of the user's cryptocurrency holdings in their wallet.</p>
           </Tooltip>
          )}
            placement="bottom"
                trigger={['hover', 'focus', 'click', 'touch']}
                 ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                      </OverlayTrigger>
                </p>
                <h6>
                  {
                    total_aquisition_cost?
                 <div>
                   {convertCurrency(total_aquisition_cost)}
                 </div>
                    :
                    ""
                  }
                 </h6>
            </div>
          </div>

          <div className='col-md-6 col-6'>
            <div className="token-details-balance">
                <p>Growth
                &nbsp;
                    <OverlayTrigger
                          delay={{ hide: 450, show: 200 }}
                            overlay={(props) => (
                              <Tooltip {...props} className="custom_pophover ">
                                <p>Total Growth:The difference between the current total balance and the acquisition cost.<br/>Total Growth=Total Token Balance(In USD)-Total Aquisition cost.</p>
                              </Tooltip>
                            )}
                            placement="bottom"
                            trigger={['hover', 'focus', 'click', 'touch']}
                          ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                        </OverlayTrigger>
                
                </p>
                {
                  total_aquisition_cost && token.price && token.balance ?
                  <div>  
                <h6>   
                {
                    (token.price* token.balance )> total_aquisition_cost ?
                  <span className="">{convertCurrency((token.price*token.balance)-total_aquisition_cost)}&nbsp;
  
                </span>
                  :
                  <span className="red">
                  {convertCurrency((token.price*token.balance)-total_aquisition_cost)}  
                  </span>
                }
                </h6>
                </div>
                :
                  ""
                }
                {/* <h6>{convertCurrency((token.price*token.balance)-total_aquisition_cost)}
              
                  ({((((token.price*token.balance)-total_aquisition_cost)/total_aquisition_cost)*100).toFixed(2)})</h6> */}
            </div>
          </div>   
        </div>
  

        <div className="portfolio_token_view_tab">
           <ul className="nav nav-tabs">
              {/* <li className="nav-item" key={0}>
                <a className={"nav-link "+(worth_chart_type == 1 ? "active":"")} onClick={()=>setChartWorth(1)}>
                  <span>12 Hrs</span>
                </a>
              </li> */}
              <li className="nav-item" key={1}>
                <a className={"nav-link "+(tab_type == 1 ? "active":"")} onClick={()=>set_tab_type(1)}>
                  <span>Overview</span>
                </a>
              </li>
              {
                token_price>0.1?
                <div>
<li className="nav-item" key={2}>
                <a className={"nav-link "+(tab_type == 2 ? "active":"")} onClick={()=>set_tab_type(2)}>
                  <span>Chart</span>
                </a>
              </li>
                </div>
                :
                ""
              }
              {/* <li className="nav-item" key={2}>
                <a className={"nav-link "+(tab_type == 2 ? "active":"")} onClick={()=>set_tab_type(2)}>
                  <span>Chart</span>
                </a>
              </li> */}
              <li className="nav-item" key={3}>
                <a className={"nav-link "+(tab_type == 3 ? "active":"")} onClick={()=>set_tab_type(3)}>
                  <span>Transfers</span>
                </a>
              </li>
            </ul>
          </div>
            {
              tab_type == 1 ?
              <>
                {
                  total_aquisition_cost && token.price && token.balance ?
                  <div className="row">
                    <div className='col-md-12 col-lg-12'>
                      
                    </div>
                  </div>
                  :
                  ""
                }

             
             <div className='token-details-growth-values mt-2' >

             <p className='px-2 tex-center'>Growth details based on present token holdings.</p>
                <div className='row'>
                <div className='col-4 col-md-4'>
                  <label className='token-type-name'>1Hr Growth</label>
                  <h6 className="values_growth">
                      {
                        price_change_1hr ? 
                          price_change_1hr > 0 ?
                            <span className="green">
                              {convertCurrency((price_change_1hr*token.price*token.balance)/100)}
                            </span>
                            :
                            <span className="red">
                              {convertCurrency((price_change_1hr*token.price*token.balance)/100)}
                            </span>
                          :
                        "NA"
                    }
                    </h6>
                 
                  
                </div>
              
                <div className='col-4 col-md-4'>
              
                    
                   
                    <label className='token-type-name'>24Hrs Growth</label>
                    <h6 className="values_growth">
                          {
                          price_change_24h?price_change_24h>0?
                            <span className="green">
                            {convertCurrency((price_change_24h*token.price*token.balance)/100)}
                          </span>
                          :
                          <span className="red">
                            {convertCurrency((price_change_24h*token.price*token.balance)/100)}
                          </span>
                          :
                          "NA"
                          }
                          </h6>
                      
                </div>

              <div className='col-4 col-md-4'>
          
                  <label className='token-type-name'>7D Growth</label>
                    <h6 className="values_growth">
                        {
                          price_change_7d?price_change_7d>0?
                            <span className="green">
                              {convertCurrency((price_change_7d*token.price*token.balance)/100)}
                            </span>
                            :
                            <span className="red">
                              {convertCurrency((price_change_7d*token.price*token.balance)/100)}
                            </span>
                          :
                          "NA"
                        }
                    </h6>
                 
              </div>

             
            </div>
            </div>
            
              
            
           
           
              <table className='table token-details-table'>
                <tbody>
                {/* <tr>
            <td className="quick_block_links main_page_coin_filter create_token_btn"> 
              <Link href='https://markets.coinpedia.org/'target="_blank">View more details</Link>
                  </td>
                  </tr> */}
             <tr>
              <td><h6 >Markets Details</h6></td>
             </tr>
                  <tr>
                    
                    <td><label className='token-type-name'>Live Price</label></td>
                    {/* <td className='token-value-details'>{convertCurrency(token.price, 1)}&nbsp;
                      {
                        token.change_24h ? 
                        <>
                            {
                            token.change_24h > 0 ?
                            <span className='green'>{(token.change_24h).toFixed(2)+" %"}</span>
                            :
                            <span className='red'>{(token.change_24h).toFixed(2)+" %"}</span>
                            }
                        </>
                        :
                        "-"
                      }
                    </td> */}
                    <td className='token-value-details'>{convertCurrency(token_price)}&nbsp;
                    {
                        token.change_24h ? 
                        <>
                            {
                            token.change_24h > 0 ?
                            <span className='green'>{(token.change_24h).toFixed(2)+" %"}</span>
                            :
                            <span className='red'>{(token.change_24h).toFixed(2)+" %"}</span>
                            }
                        </>
                        :
                        "-"
                      }
                    </td>
                  </tr>

                 
                  <tr>
                    <td><label className='token-type-name'>N/w</label></td>
                    <td className='token-value-details'>
                      <img className="rounded-circle" src={"/assets/img/portfolio/"+getNetworkImageNameByID(token.network)} alt="Token" title={getNetworkNameByID(token.network)} style={{width:"24px"}}/>
                      
                    </td>
                  </tr>

                  {
                    circuilating_supply ?
                    <tr>
                    <td><label className='token-type-name'>Circulating supply 
                    
                    </label></td>
                    {/* <span className='token-details-head'>{USDFormatValue(token.balance, 0)} {token.symbol}</span> */}
                    <td className='token-value-details'>
                    <span>{(circuilating_supply)?getValueShortForm(circuilating_supply):""} {token.symbol}</span></td>
                      {/* <td className='token-value-details'> {(token.circulating_supply) ? getValueShortForm(token.circulating_supply) : " "} {token.symbol}</td> */}
                    </tr>
                    :
                    ""
                  }
                  
                  {
                    total_supply ?
                    <tr>
                      <td><label className='token-type-name'>Total Supply 
                                        
                      </label></td>
                        <td className='token-value-details'>{(total_supply)?getValueShortForm(total_supply):""}</td>
                      {/* <td className='token-value-details'> {(token.circulating_supply) ? getValueShortForm(token.circulating_supply) : " "} {token.symbol}</td> */}
                    </tr>
                    :
                    ""
                  }

                  {
                    max_supply ?
                    <tr>
                      <td><label className='token-type-name'>Max Supply 
                      </label></td>
                          <td className='token-value-details'>{(max_supply)?getValueShortForm(max_supply):""}</td>
                      {/* <td className='token-value-details'> {(token.circulating_supply) ? getValueShortForm(token.circulating_supply) : " "} {token.symbol}</td> */}
                    </tr>
                    :
                    ""
                  }
                  
                 
                 

                 

                       {
                          ath && atl<0.00000000 ?
                            <tr>
                            <td>
                                <label className='token-type-name'>All-Time High | Low</label>
                             </td>
                             <td className='token-value-details'>
                             {convertCurrency(ath, 1)} | {convertCurrency(atl, 1)} 

                             {/* {atl >0.00000000 ? '' : convertCurrency(parseFloat(atl), 1)} */}
                                </td>
                             </tr>
                                :
                                   ath && atl>0.00000000?
                                   <tr>
                            <td>
                                <label className='token-type-name'>All-Time High </label>
                             </td>
                             <td className='token-value-details'>
                             {convertCurrency(ath, 1)} 

                            
                                </td>
                             </tr>
                             :
                             ""

                               }

  


{/* 
        {
             token.high_24h && token.low_24h ?
                 <tr>
                    <td>
                        <label className='token-type-name'>24Hrs High | Low</label>
                     </td>
                     <td className='token-value-details'>
                        { convertCurrency(token.high_24h, 1)} | {convertCurrency(token.low_24h, 1)}
                      </td>
                    </tr>
                    :
                   ""
                } */}

                 
             
                  


                  {
                    market_cap ?
                    <tr>
                      <td><label className='token-type-name'>Market Cap </label></td>
                      <td className='token-value-details'> 
                      <span>{(market_cap)?getValueShortForm(market_cap):""}</span>
                      </td>
                    </tr>
                    :
                    ""
                  }


                  {
                    volume ?
                    <tr>
                      <td><label className='token-type-name'>24H Volume 
                    </label></td>
                      <td className='token-value-details'>{(volume)?getValueShortForm(volume):""}</td>
                    </tr>
                    :
                    ""
                  }
                  
                  {/* <tr>
                    <td><label className='token-type-name'>Fully-diluted-market-cap</label></td>
                    <td className='token-value-details'>{(fully_diluted_market_cap)?getValueShortForm(fully_diluted_market_cap):""}</td>
                  </tr> */}
           
          
                      <tr>
                     
                      <td className='token-value-details'> 
                  
                      </td>
                    </tr>
                    <tr>
                 
                  </tr>
                </tbody>
               </table> 
               

                  {
                    token_other_details ?
                    <>
                      {
                        token_other_details.active_status && token_other_details.approval_status ?
                        <div className='text-center'>
                          <Link className='btn btn-primary' href ={'/'+token_other_details.token_id} target="_blank">View in Markets</Link>
                        </div>
                        :
                        ""
                      }
                    </>
                    :
                    ""
                  }
               
              
              </>
              :
              tab_type == 2 ?
              <>
              <div>
                <div className='row'>
                  <div className='col-12 col-md-12'>
                  <h6 className='pt-2'>Asset Worth
                  </h6>
                <small > The current value of assets by examining token holdings over the past 24 hours.</small>
                  </div>
                  
                  {/* <div className='col-6 col-md-6'>
                    <div className="asset_view_tab mt-2">
                      <ul className="nav nav-tabs">

                          <li className="nav-item" key={1}>
                            <a className={"nav-link " + (worth_chart_type == 2 ? "active" : "")} onClick={() => setChartWorth(2)}>
                          <span>1 Day</span>
                        </a>
                        </li>
                            <li className="nav-item" key={1}>
                            <a className={"nav-link " + (worth_chart_type == 3 ? "active" : "")} onClick={() => setChartWorth(3)}>
                          <span>1 Week</span>
                        </a>
                      </li>
                    </ul>
                    </div>
                  </div> */}
                </div>
              
                   {/* <p>{token.name} Asset Worth</p>  */}
{
 token.sparkline_in_7d.length ?
  <div className='mt-4'>

  <Net_worth_chart
    reqData={{
      line_graph_values,
      line_graph_base_price:line_graph_base_price
    }}
  />
  
  </div>
  :
  <div className='overveiw-chart-loader'>
  <h6>Chart is empty </h6>
  <p>No data available to display.</p>
</div>


}
                  {/* <div className='mt-4'>

                  <Net_worth_chart
                    reqData={{
                      line_graph_values,
                      line_graph_base_price:line_graph_base_price
                    }}
                  />
                  
                  </div> */}
                  
                 
                  
                                   
              </div>
              </>
              :
              tab_type == 3 ?
              <div className='portfolio-single-token-txns'>
                <ul className="txn_tabs">
                {
                  aquisition_list.length ?
                  aquisition_list.map((item, i) =>
                  <>
                   <li className={(txn_tab_type == i ? "txn_tabs_active":"")} key={i}>
                    <a onClick={()=>set_txn_tab_type(i)}>
                      <span>{getShortAddress(item.wallet_address, 4)}</span>
                    </a>
                   </li>
                   {
                     aquisition_list.length != (1+i) ? <span className="txn_tabs_partition"></span>:""
                   }
                  </>
                  )
                  :
                  ""
                } 
                </ul>
               
                {
                  aquisition_list.length ?
                  aquisition_list.map((item, i) =>
                  txn_tab_type == i ?
                  <>
                  <div className='portfolio-single-token'>
                  <div className="table-responsive single-token-txns">
                  <h6 className='portfolio-sub-title mt-2 '>
                                            Total Transaction{item.transactions.length ? <>({item.transactions.length})</> : ""}
                                          </h6>
                      <table className="table table-borderless">
                          <thead>
                              <tr>
                                  <th>Type</th>
                                  {/* <th>#</th> */}
                                  <th>Date&nbsp;&&nbsp;Time</th>
                                  <th style={{width:"99px"}}>Amount</th>
                                  <th>Hash</th>
                              </tr>
                          </thead>
                          <tbody>
                            {
                              item.transactions.length ?
                              item.transactions.map((innerItem, j) =>
                              <tr>
                               
                               <td>
                                  {
                                    innerItem.type == 3 ?
                                    <span className='date-display'><img src={"/assets/img/received.png"} /> Self</span>
                                    :
                                    innerItem.type == 1 ?
                                    <span className='date-display'><img src={"/assets/img/received.png"} /> In</span>
                                    :
                                    <span className='date-display'><img src="/assets/img/received.png" /> Out</span>
                                  }
                                </td>
                                <td>
                                  <span className='date-display'>{moment(innerItem.date_n_time).format('MMM D YYYY')}</span>
                                  <br/>
                                  <span className='date-display'>{moment(innerItem.date_n_time).format('h:mma')}</span>
                                </td>
                                <td>
                                  <h6>{convertCurrency(innerItem.amount_in_usd)}</h6>
                                  <p>{USDFormatValue(innerItem.amount, 0)} {token.symbol}</p>
                                </td>
                                <td>
                               <a target='_blank' href={getTxnLinkByID(token.network)+innerItem.hash}><span className='date-display' style={{color:"#2196F3"}}> {getShortAddress(innerItem.hash, 3)}</span></a> 
                                </td>
                              </tr>
                              )
                              :
                              ""
                            }
                          </tbody>
                          

                      </table>
                  </div> 
                  </div>
                  </>
                  :
                  ""
                  )
                  :
                  ""
                }
              
              </div>
              :
              <>
              
              </>
            }
        {/* <p className='mb-3'>
          <img className="rounded-circle" title={token.name} src={token.image} 
            onError={(e)=>{e.target.onerror = null; e.target.src=(token.network == 56 ? "/assets/img/portfolio/bsc.svg":token.network == 250 ? "/assets/img/portfolio/ftm.svg":token.network == 137 ?
                      "/assets/img/portfolio/polygon.svg":token.network == 43114 ? "/assets/img/portfolio/avax.svg":"/assets/img/portfolio/eth.svg")}} alt="Token"   style={{width:"35px"}}/>
          <span style={{fontSize:"21px"}}> {token.symbol} </span><span>{token.name}</span>
        </p> */}
        {/*
        */}
      
        </>
   )
}