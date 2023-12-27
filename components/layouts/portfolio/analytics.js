/* eslint-disable */
import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Link from 'next/link'
import moment from 'moment'
import dynamic from 'next/dynamic'
import { roundNumericValue } from '../../../components/config/helper'
import Net_worth_chart from '../../../components/layouts/portfolio/charts/net_worth'
import { cookieDomainExtension, arrayBalanceContractsColumn, API_BASE_URL, MAIN_API_BASE_URL, graphqlApiURL, strLenTrim, separator, currency_object, config, count_live_price, validBalance, getShortWalletAddress, market_coinpedia_url, calling_network, IMAGE_BASE_URL } from '../../../components/constants'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import { useSelector, useDispatch } from 'react-redux'
export default function AnalyticsFun({ data }) 
{
  const { userData, active_currency } = useSelector(state => state)
  const convertCurrency = (token_price) => 
  {
    if (token_price) {
      if (active_currency.currency_value) {
        return active_currency.currency_symbol + " " + roundNumericValue(token_price * active_currency.currency_value)
      }
      else {
        return roundNumericValue(token_price)
      }
    }
    else {
      return '0'
    }
  }
  console.log("Analytics", data)
  
  const { line_graph_values, line_graph_base_price, token_allocation_values, token_allocation_names } = data
  const [network] = useState(data.networks)
  const [image_base_url] = useState(IMAGE_BASE_URL + "/markets/cryptocurrencies/")

  const [addresses] = useState(data.addresses)

  const [pi_chart_values] = useState(data.pi_chart_values)
  const [balance_list] = useState(data.tokens_list ? data.tokens_list : [])
  const [pi_chart_names] = useState(data.pi_chart_names)
  const [loader_status, set_loader_status] = useState(false)
  const [pi_chart_colors] = useState(['#647fe6', '#ffc107', '#6f42c1', '#00bcd4'])
  const [token_allocation_colors] = useState(['#0088FE', '#00C49F', '#FFBB28', '#4b51cb', '#CF61B0', '#909090', '#5D69B1', '#24796C', '#E88310', '#2F8AC4', '#764E9F', '#ED645A', '#CC3A8E', '#C1C1C1', '#66C5CC', '#F89C74', '#DCB0F2', '#87C55F', '#9EB9F3', '#FE88B1', '#8BE0A4', '#B497E7',
    '#D3B484', '#B3B3B3', '#E10B64', '#E92828', '#78B4A4', '#604F00', '#0060E9', '#FF7DE3', '#20c997', '#6f42c1'])

  const [line_graph_days, set_line_graph_days] = useState([])

  const [worth_chart_type, set_worth_chart_type] = useState(2)
  const[worth_chart_profit,set_worth_chart_profit]=useState(2)
  const [profit_loss_values, set_profit_loss_values] = useState([])
  const [profile_loss_graph_days, set_profile_loss_graph_days] = useState([])
  const [top_gainer, set_top_gainer] = useState("")
  const [top_loser, set_top_loser] = useState("")
  const [tokens_list_as_list_view] = useState(data.tokens_list)
  const [net_worth] = useState(data.net_worth)
  const [tokens_balance] = useState(data.tokens_balance)
  // console.log(line_graph_values)

 

  const getHighestNLowestValue = async (myArray) => {
    console.log("myArray",myArray)
    var lowest = Number.POSITIVE_INFINITY
    var highest = Number.NEGATIVE_INFINITY
    var tmp = 0
    var gainer = ""
    var loser = ""

    if (myArray.length > 1) {
      for (var i = myArray.length - 1; i >= 0; i--) {
        tmp = myArray[i].change_24h
        if ((tmp < lowest) && (tmp < 0)) {
          lowest = tmp
          loser = myArray[i]
        }

        if ((tmp > highest) && (tmp > 0)) {
          highest = tmp
          gainer = myArray[i]
        }
      }
    }
    console.log("gainer", gainer)
    console.log("loser", loser)

    await set_top_gainer(gainer)
    await set_top_loser(loser)
  }
  


  const profit_loss_series = [{
    name: "Daily Profits and Loss",
    data: profit_loss_values,

  }]

  // if (profit_loss_values.length > 0) {
  //   var highestValue = Math.max(...profit_loss_values);
  //   var lowestValue = Math.min(...profit_loss_values);
  //   var profitBaseValue = ((highestValue + lowestValue) / 2).toFixed(2);
  //   console.log("profitBaseValue", profitBaseValue)
  // }

  const profit_loss_options = {
    
    chart: {
      type: 'bar',
      toolbar: {
        show: false,
        tools: {
          download: false,
        },
      },
      height: 450
    },
    // theme: {
    //   monochrome: {
    //     enabled: true,
    //     color: '#255aee',
    //     shadeTo: 'light',
    //     shadeIntensity: 0.65
    //   }
    // },
    dataLabels: {
      enabled: false,
    },
    fill: {
      // type: 'gradient',
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
            from: 0,
            to: 1000,
            color: 'rgba(14, 163, 83, 0.7)'
          }, 
          {
            from: -1000,
            to: 0,
            color: 'rgba(223, 96, 96, 0.7)'
          }]
        },
      },
    },
    yaxis: {
      labels: {
        formatter: function (y) 
        {
          return  convertCurrency(y)
        }
      },
      lines: {
        show: true
      },
    },
    xaxis: {
      categories: profile_loss_graph_days,
    }
  }




  // const getSevenDaysValues = async (sparkline_data, pass_data_type) => 
  // {
  //   var graph_values = []
  //   var loop_values = []
  //   // console.log('sparkline_data', sparkline_data.price) 
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


  //   //console.log('graph_values', graph_values)
  //   return graph_values
  // }

  // const getDaysList = async (balance_list, pass_balance, pass_data_type) => {
  //   var array_count = 0
  //   if (pass_data_type == 1) {
  //     array_count = 13
  //   }
  //   // 1 Day
  //   else if (pass_data_type == 2) {
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

  //   //set_line_graph_days(last_seven_days)

  //   var initial_array = []
  //   if (balance_list) {
  //     for (let i of balance_list) {
  //       await initial_array.push({
  //         price: i.price,
  //         balance: i.balance,
  //         sparkline_in_7d: await getSevenDaysValues(i.sparkline_in_7d, pass_data_type)
  //       })
  //     }
  //   }

  //   var sum_array = []
  //   for (let i = 0; i < array_count; i++) {
  //     if (i == 7) {
  //       await sum_array.push(pass_balance)
  //     }
  //     else {
  //       var sumOne = 0
  //       for (let j = 0; j < initial_array.length; j++) {
  //         sumOne += await (initial_array[j].sparkline_in_7d[i] && initial_array[j].balance) ? initial_array[j].sparkline_in_7d[i] * initial_array[j].balance : 0
  //       }
  //       await sum_array.push(parseFloat(sumOne.toFixed(2)))
  //     }
  //   }
  //   //await set_line_graph_values(sum_array)



  //   // console.log("profit_loss_values",profit_loss_array)
  // }


  // const setChartWorth = (pass_type) => {
  //   console.log("pass_type", pass_type)
  //   set_worth_chart_type(pass_type)
  //   getDaysList(tokens_list_as_list_view, tokens_balance, pass_type)
  
  // }
  //  const setChartWorthData=(pass_type)=>{
  //   console.log("pass_type",pass_type)
  //   set_worth_chart_profit(pass_type)
  //   profitLoss(tokens_list_as_list_view,tokens_balance,pass_type)
  // }


  const profitLoss = async (balance_list, pass_balance, pass_data_type) => 
  {
    var low_value = 0
    var high_value = 0
    let j = 0
    for(let run of line_graph_values) 
    {
      if(j > 14)
      {
        if(j == 15)
        {
          low_value = await run.value
        }
        else
        {
          if(run.value < low_value)
          {
            low_value = await run.value
          }
        }

        if(run.value > high_value)
        {
          high_value = await run.value
        }
      }
      j++
    }

    const base_price = await parseFloat(((low_value+high_value)/2).toFixed(2))

    // console.log("low_value", low_value)
    // console.log("high_value", high_value)
    var values_array = []
    var times_array = []
    let i = 0
    for(let run of line_graph_values) 
    {
      if(i > 14)
      {
        if(moment(new Date(run.time*1000)).format("m") == 0)
        { 
          const time = moment(new Date(run.time*1000)).format("ha")
          await values_array.push(parseFloat((run.value - base_price).toFixed(2)))
          await times_array.push(time)
        }
      }
      i++
    }
    // console.log("values_array", values_array)
    // console.log("times_array", times_array)
    
    await set_profile_loss_graph_days(times_array)
    await set_profit_loss_values(values_array)
  }

  useEffect(() => {
    
    getHighestNLowestValue(balance_list)
    profitLoss(tokens_list_as_list_view, tokens_balance, 2)
    // if((network == 1) || (network == 2))
    // {
    //   ethTxnsList()
    // }
    // else if(network == 3) 
    // {
    //   bnbTxnsList()
    // }

  }, [tokens_balance])



  var options = {
    series: pi_chart_values,
    labels: pi_chart_names,
    chart: {
      type: 'donut',
    },
    colors: pi_chart_colors,
    fill: {
      type: 'gradient',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 400
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 400,
      options: {
        chart: {
          width: 350
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 350,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 300,
      options: {
        chart: {
          width: 270
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  var options2 = {
    series: token_allocation_values,
    labels: token_allocation_names,
    chart: {
      type: 'donut',
    },
    colors: token_allocation_colors,
    fill: {
      type: 'gradient',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 400
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 400,
      options: {
        chart: {
          width: 350
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 350,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 300,
      options: {
        chart: {
          width: 270
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  return (
    <>

      <div className="row">
        <div className="col-md-8">
          <div className='row'>
            {
              top_gainer.change_24h ?
              <div className="col-md-6">
                <div className="analytic-gainer">
                  <h6>Top Gainer
                  &nbsp;
                  <OverlayTrigger
                                delay={{ hide: 450, show: 200 }}
                                  overlay={(props) => (
                                    <Tooltip {...props} className="custom_pophover ">
                                      <p>Top Gainer:The token has gained the highest price compared to other tokens in the last 24 hours. </p>
                                    </Tooltip>
                                  )}
                                  placement="bottom"
                                  trigger={['hover', 'focus', 'click', 'touch']}
                                ><span className='info_col'><img src="/assets/img/info.png" alt="Info" /></span>
                              </OverlayTrigger>

                  </h6>
                  <p>Last 24hrs Top Gainer</p>
                    <div className="mt-2">
                      <div className="media">
                        <img className="rounded-circle" title={top_gainer.name} src={image_base_url+top_gainer.image} onError={(e) => { e.target.onerror = null; e.target.src = (item.network == 56 ? "/assets/img/portfolio/bsc.svg" : item.network == 250 ? "/assets/img/portfolio/ftm.svg" : item.network == 137 ? "/assets/img/portfolio/polygon.svg" : item.network == 43114 ? "/assets/img/portfolio/avax.svg" : "/assets/img/portfolio/eth.svg") }} alt="Token" />
                        <div className="media-body align-self-center">
                          <h5 className="mt-0">{top_gainer.name}  <small className='green'>{(top_gainer.change_24h).toFixed(2)}%</small></h5>
                          <p></p>
                        </div>
                      </div>
                    </div>
                </div>
              </div>
              :
              ""
            }

            {
              top_loser.change_24h ?
              <div className="col-md-6">
                <div className="analytic-gainer">
                  <h6>Top Loser
                  &nbsp;
                  <OverlayTrigger
                                      delay={{ hide: 450, show: 200 }}
                                        overlay={(props) => (
                                          <Tooltip {...props} className="custom_pophover ">
                                            <p>Top Loser:The token has Lowest  price compared to other tokens in the last 24 hours.</p>
                                          </Tooltip>
                                        )}
                                        placement="bottom"
                                        trigger={['hover', 'focus', 'click', 'touch']}
                                      ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                                    </OverlayTrigger>
                  </h6>
                  <p>Last 24hrs Top Loser</p>
                      <div className="mt-2">
                        <div className="media">
                          <img className="rounded-circle" title={top_loser.name} src={image_base_url+top_loser.image} onError={(e) => { e.target.onerror = null; e.target.src = (item.network == 56 ? "/assets/img/portfolio/bsc.svg" : item.network == 250 ? "/assets/img/portfolio/ftm.svg" : item.network == 137 ? "/assets/img/portfolio/polygon.svg" : item.network == 43114 ? "/assets/img/portfolio/avax.svg" : "/assets/img/portfolio/eth.svg") }} alt="Token" />
                          <div className="media-body align-self-center">
                            <h5 className="mt-0">{top_loser.name}  <small className='red'>{(top_loser.change_24h).toFixed(2)}%</small></h5>
                            <p></p>
                          </div>
                        </div>
                      </div>
                      
                </div>
              </div>
              :
              ""
            }    
           

          </div>

          <div className="line-chart-asset-worth charts_subtitle dex-donot-pichart">
            <div className='row'>
            <div className='col-12 col-md-12'>

              <h6 className='portfolio-sub-title'>
                <span className="net_worth_title">Net Worth:</span>
                
                <span className="net_worth_value">
                  {
                    tokens_balance ? convertCurrency(tokens_balance, 1) : 0.00
                  }
                   {
                    net_worth > 0 ?
                      <span className="portfolio_growth growth_up">

                        <img src="/assets/img/growth_up.svg" alt="Growth Up" /> +{net_worth}%

                      </span>
                      :
                      net_worth < 0 ?
                        <span className="portfolio_growth growth_down">


                          <img src="/assets/img/growth_down.svg" alt="Growth Down" /> {net_worth}%

                        </span>
                        :
                        ""
                  }
                </span>
              </h6>
              <p className='net_worth_title'>Last 1day net worth based on present token holdings</p>
            </div>
             

            <div className='col-md-6 col-6'>
              {/* <div className="asset_view_tab">
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
              </div> */}

            </div> 
          </div>
            
             <Net_worth_chart
              reqData={{
                line_graph_values,
                line_graph_base_price:line_graph_base_price
              }}
            />
      </div>

          <div className="line-chart-asset-worth charts_subtitle dex-donot-pichart">
            <div className='row'>
            <div className='col-12 col-md-12 col-sm-12'>
                <h6>Daily Profits and Loss</h6>
                <p>Daily profit and loss based on current token holdings</p>
            </div>

            <div className='col-md-6 col-6'>
              {/* <div className="asset_view_tab">
                <ul className="nav nav-tabs">
                  <li className="nav-item" key={1}>
                    <a className={"nav-link " + (worth_chart_profit == 2 ? "active" : "")} onClick={() => setChartWorthData(2)}>
                      <span>1 Day</span>
                    </a>
                  </li>
                  <li className="nav-item" key={1}>
                    <a className={"nav-link " + (worth_chart_profit == 3 ? "active" : "")} onClick={() => setChartWorthData(3)}>
                      <span>1 Week</span>
                    </a>
                  </li>
                </ul>
              </div> */}
              </div> 
            </div>
            <ReactApexChart options={profit_loss_options} series={profit_loss_series} type="bar" height={350} />
          </div>
        </div>

        <div className="col-md-4">
          {
            tokens_balance ?
              <div className="dex-donot-pichart charts_subtitle">
                <h6>Chain Allocation&nbsp;
                  <OverlayTrigger
                    delay={{ hide: 450, show: 200 }}
                      overlay={(props) => (
                        <Tooltip {...props} className="custom_pophover ">
                          <p>Diversify crypto portfolio by allocating across different blockchains. </p>
                        </Tooltip>
                      )}
                      placement="bottom"
                      trigger={['hover', 'focus', 'click', 'touch']}
                    ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                  </OverlayTrigger>
                  </h6>
                {/* <p>Diversify crypto portfolio by allocating across different blockchains. </p> */}

                <div className="donot-pi-chart-section" >
                  <ReactApexChart options={options} series={pi_chart_values} type="donut" />
                </div>
              </div>
              :
              ""
          }

          {
            tokens_balance ?
              <div className="dex-donot-pichart charts_subtitle">
                <h6>Token Allocation&nbsp; 
                  <OverlayTrigger
                  delay={{ hide: 450, show: 300 }}
                  overlay={(props) => (
                    <Tooltip {...props} className="custom_pophover">
                      <p>Minimize risk through diversified asset allocation in investment portfolio.</p>
                    </Tooltip>
                  )}
                  placement="bottom"
                  trigger={['hover', 'focus', 'click', 'touch']}
                ><span className='info_col'><img src="/assets/img/info.png" alt="Info" /></span>
                </OverlayTrigger> </h6>
                {/* <p>Minimize risk through diversified asset allocation in investment portfolio.</p> */}
                <div className="donot-pi-chart-section" >
                  <ReactApexChart options={options2} series={token_allocation_values} type="donut" />
                </div>
              </div>
              :
              ""
          }
        </div>
      </div>

    </>
  )
}