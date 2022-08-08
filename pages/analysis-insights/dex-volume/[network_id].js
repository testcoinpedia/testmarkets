import React , {useEffect,  useState,useRef} from 'react' 
import {graphqlApiKEY, roundNumericValue, convertvalue, separator} from '../../../components/constants'
import { dex_trades_volume, graphql_url, graphql_api_key, dexMonthWiseData,getAlldexTrades,dex_trades_volume_change,getactivedexTrades24h} from '../../../components/token_details/graphql'
import CategoriesTab from '../../../components/categoriesTabs'
import Search_Contract_Address from '../../../components/searchContractAddress'
import AnalysisInsightsMenu from '../../../components/analysisInsightsmenu'
import Popupmodal from '../../../components/dextradespopupmodal'
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,PieChart, Pie,  } from 'recharts'
import Axios from 'axios'
import Head from 'next/head'
import cookie from "cookie"
import moment from 'moment'
import Highcharts from 'highcharts';
import Link from 'next/link' 
import dynamic from 'next/dynamic' 
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

function TokenDetails({network_id}) 
{ 
  const [dex_row_id, set_dex_row_id]=useState("")
  const [tab, set_tab]= useState(network_id == "ethereum" ? 1 :network_id == "bsc" ? 2 : 0)  
  const [highchart_status , set_highcharts_status]=useState(false)
  const [all_dex_trades, set_all_dextrades]= useState([])
  const [dex_trades, set_dex_trades]= useState([])
  const [all_dextrades_7days, set_all_dextrades_7days]= useState([])
  const [all_dextrades_24h, set_all_dextrades_24h]= useState([])
  const [dextrades_24h_volume , set_dextrades_24h_volume]=useState(0)
  const [dextrades_12months_volume , set_dextrades_12months_volume]=useState(0)
  const [dextrades_30day_volume , set_dextrades_30day_volume]=useState(0)
  const [dextrades_24h_change_volume , set_dextrades_24h_change_volume]=useState(0)
  const [dextrades_7day_change_volume , set_dextrades_7day_change_volume]=useState(0)
  const [dextrades_volume , set_dextrades_volume]=useState(0)
  const [unique_traders , set_unique_traders]=useState(0)
  const [dextrades_7days_volume , set_dextrades_7days_volume]=useState(0)
  const [exchanges_list, set_exchanges_list]= useState([])
  const [exchange_names, set_exchange_names]= useState([])
  const [pie_chart_data, set_pie_chart_data]= useState([])
  
  const [pi_chart_24h_values, set_pi_chart_24h_values]= useState([])
  const [pi_chart_24h_names, set_pi_chart_24h_names]= useState([])
  const [exchange_colors]= useState(['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#CF61B0','#909090','#5D69B1','#24796C','#E88310','#2F8AC4','#764E9F','#ED645A','#CC3A8E','#C1C1C1','#66C5CC','#F89C74','#DCB0F2','#87C55F','#9EB9F3','#FE88B1','#8BE0A4','#B497E7',
  '#D3B484','#B3B3B3','#E10B64','#E92828','#78B4A4','#604F00','#0060E9','#FF7DE3','#20c997','#6f42c1'])
  const change = async (row_id) =>
    { 
     // console.log("row_id",row_id)
        await set_dex_row_id("") 
        
        await set_dex_row_id(row_id) 
                                                                                              
    }
  const COLORS = ["#FF7DE3", "#00C49F","#24796C","#2F8AC4", "#FFBB28", "#FF8042","#8884d8" ,"#823a9d","#f4603e","#d93025","#31c7ed"]
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.4;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        // x={x<575?x:""}
        x={x}
        y={y}
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
       {`${(percent * 100).toFixed(2)}%`}
      </text>
    );
  };

  const [series]= useState([])
  var options = {
    series: pi_chart_24h_values,
    labels: pi_chart_24h_names,
    chart: {
    type: 'donut',
  },
  colors: exchange_colors,
  responsive: [{
    breakpoint: 480,
    
    options: {
      chart: {
        width: 200
      },
      legend: {
        position: 'bottom'
      }
    }
  }]
  }
  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <div style={{top: 25, right:30, backgroundColor: '#FFECEB', borderRadius: 10, lineHeight: '30px'}}>
          <p>{`${payload[0].name}`}</p>
          {/* <p className="intro">{getIntroOfPage(label)}</p> */}
          <p>1 year Volume   {`${"  $"+payload[0].value }`} </p>
        </div>
      );
    }
  
    return null;
  }



  const getdexTrades=async()=> 
  { 
   
    set_all_dextrades([])
    const present_date1 = ((new Date()).toISOString())
    const from_date1 = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    query = getAlldexTrades(tab, from_date1, present_date1)
    const res_data_24 =  await Axios.post(graphql_url,JSON.stringify({query}), {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphql_api_key
      }
    })

    // if(res_data_24.data.ethereum) 
    // {
    //   set_all_dextrades_status(true)
    //   set_all_dextrades_24h(res_data_24.data.data.ethereum.dexTrades) 
      
    // } 
    


    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date(Date.now() - 7*24 * 60 * 60 * 1000)).toISOString())
    var query = getAlldexTrades(tab, from_date, present_date)
    const res_data_7days =  await Axios.post(graphql_url,JSON.stringify({query}), {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphql_api_key
      }
    })
    
    // if(res_data_7days.data.ethereum) 
    // {
    //   set_all_dextrades_status(true)
    //   set_all_dextrades_7days(res_data_7days.data.data.ethereum.dexTrades) 
    // }
  
    var pi_chart_24h_value =[] 
    var pi_chart_24h_names =[] 
    var m =0
    for(let u of res_data_7days.data.data.ethereum.dexTrades) 
    {
        for(let x of res_data_24.data.data.ethereum.dexTrades) 
        { 
          
            let dexTradesObj={}
            if(u.exchange.fullName === x.exchange.fullName)
            {
                dexTradesObj["exchange_name"]=x.exchange.fullName.replace(/([<>])/g, '')
                dexTradesObj["dex_trade_24volume"]=x.tradeAmount
                dexTradesObj["dex_trade_24count"]=x.trades
                dexTradesObj["dex_trade_7dayvolume"]=u.tradeAmount
                dexTradesObj["dex_trade_7daycount"]=u.trades
                
                await all_dex_trades.push(dexTradesObj)
                if(m < 7)
                {
                    if(!isNaN((parseFloat(x.tradeAmount)).toFixed(2)))
                    {
                    
                    }
                    await pi_chart_24h_names.push(x.exchange.fullName.replace(/([<>])/g, ''))
                    await pi_chart_24h_value.push(x.tradeAmount)
                    
                    
                    
                }
                m++
            }
        }
    }
    
    let ordered_dex_trades=await orderByVolume(all_dex_trades)
    set_pi_chart_24h_values(pi_chart_24h_value)
    set_pi_chart_24h_names(pi_chart_24h_names)
    set_dex_trades(ordered_dex_trades)  
    console.log(ordered_dex_trades)
  }
 

  const orderByVolume = (getQuery)=>
  {
    return (getQuery.sort(function (a, b) {
      return (a.dex_trade_7daycount < b.dex_trade_7daycount) ? 1 : -1
    })).slice(0,10)
  }
 
  const getactivedexTrades =async ()=> 
  {
    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    var query = getactivedexTrades24h(tab, from_date, present_date)
    const res_data_7days =  await Axios.post(graphql_url,JSON.stringify({query}), {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphql_api_key
      }
    })
      if(res_data_7days) 
      { 
        console.log(res_data_7days)
        if(res_data_7days.data.data.ethereum.transactions[0])
        {
          let total=res_data_7days.data.data.ethereum.transactions[0].senders+res_data_7days.data.data.ethereum.transactions[0].recievers
          set_unique_traders(total)
          
        }
      }  
    
  }

  const getdexTrades24h = (dextrades_volume)=> 
  {
    let change24h=0
    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    const opts = dex_trades_volume(tab, from_date, present_date)
    fetch(graphql_url, opts).then(res => res.json()).then(result => 
    {
      if(result.data.ethereum) 
      { 
        
        if(result.data.ethereum.dexTrades[0].tradeAmount)
        {
          set_dextrades_24h_volume(result.data.ethereum.dexTrades[0].tradeAmount)
          change24h=dex_trades_volume_change(dextrades_volume,result.data.ethereum.dexTrades[0].tradeAmount)
          set_dextrades_24h_change_volume(change24h)
        }
      }  
    }).catch(console.error)
  }

  const getdexTrades12months = (dextrades_volume)=> 
  {
    let change24h=0
    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date(Date.now() - 365*24 * 60 * 60 * 1000)).toISOString())
    const opts = dex_trades_volume(tab, from_date, present_date)
    fetch(graphql_url, opts).then(res => res.json()).then(result => 
    {
      if(result.data.ethereum) 
      { 
        
        if(result.data.ethereum.dexTrades[0].tradeAmount)
        {
          set_dextrades_12months_volume(result.data.ethereum.dexTrades[0].tradeAmount)
          change24h=dex_trades_volume_change(dextrades_volume,result.data.ethereum.dexTrades[0].tradeAmount)
          
        }
      }  
    }).catch(console.error)
  }
  
  const getdexTrades30days = (dextrades_volume)=> 
  {
    let change24h=0
    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date(Date.now() - 30*24 * 60 * 60 * 1000)).toISOString())
    const opts = dex_trades_volume(tab, from_date, present_date)
    fetch(graphql_url, opts).then(res => res.json()).then(result => 
    {
      if(result.data.ethereum) 
      { 
        
        if(result.data.ethereum.dexTrades[0].tradeAmount)
        {
          set_dextrades_30day_volume(result.data.ethereum.dexTrades[0].tradeAmount)
          change24h=dex_trades_volume_change(dextrades_volume,result.data.ethereum.dexTrades[0].tradeAmount)
        }
      }  
    }).catch(console.error)
  }
  const getdexTradevolume = ()=> 
  {
    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date()).toISOString())
    const opts = dex_trades_volume(tab, from_date, present_date)
    fetch(graphql_url, opts).then(res => res.json()).then(result => 
    {
      if(result.data.ethereum) 
      { 
        
        if(result.data.ethereum.dexTrades[0].tradeAmount)
        {
          set_dextrades_volume(result.data.ethereum.dexTrades[0].tradeAmount)
          getdexTrades24h(result.data.ethereum.dexTrades[0].tradeAmount)
          getdexTrades7days(result.data.ethereum.dexTrades[0].tradeAmount)
          getdexTrades12months(result.data.ethereum.dexTrades[0].tradeAmount)
          getdexTrades30days(result.data.ethereum.dexTrades[0].tradeAmount)
        }
      }  
    }).catch(console.error)
    
    
    
  }

  
  const getdexTrades7days=(dextrades_volume)=> 
  {
    let change7days=0
    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date(Date.now() - 7*24 * 60 * 60 * 1000)).toISOString())
    const opts = dex_trades_volume(tab, from_date, present_date)
    fetch(graphql_url, opts).then(res => res.json()).then(result => 
    {
      if(result.data.ethereum) 
      {
        if(result.data.ethereum.dexTrades[0].tradeAmount)
        {
          set_dextrades_7days_volume(result.data.ethereum.dexTrades[0].tradeAmount)
          change7days=dex_trades_volume_change(dextrades_volume,result.data.ethereum.dexTrades[0].tradeAmount)
          set_dextrades_7day_change_volume(change7days)
        }
      }  
    }).catch(console.error)
  }
 
  const getdexTrades1year=async()=> 
  {
    const present_date = ((new Date()).toISOString())
    const from_date = ((new Date(Date.now() - 365*24 * 60 * 60 * 1000)).toISOString())
    const query = getAlldexTrades(tab, from_date, present_date)
    const result =  await Axios.post(graphql_url,JSON.stringify({query}), {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphql_api_key
      }
    })
    let result_array = []
     if(result.data.data.ethereum) 
      { 
        if(result.data.data.ethereum.dexTrades)
        {
            var res_data = result.data.data.ethereum.dexTrades
            for(let x of res_data) 
            {  
                if(x.trades>5000)
                {
                    result_array.push({ name:x.exchange.fullName, value:x.tradeAmount} )
                }
               
            }
            set_pie_chart_data(result_array)
        }
      }  
    
  }


    const exchangesMonthWiseList= async ()=> 
    {
       set_highcharts_status(false)
        const present_date = ((new Date()).toISOString())
        const from_date = ((new Date(Date.now() - 365*24 * 60 * 60 * 1000)).toISOString())
        const query = dexMonthWiseData(tab, from_date, present_date)

        const response_array =  await Axios.post(graphql_url, JSON.stringify({ query }), {
            headers: {
            "Content-Type": "application/json",
            "X-API-KEY": graphql_api_key
            }
        })

        //console.log("bar chart",response_array)
        let exchange_array = []
        let month_array = []
        if(response_array.data)
        {
            if(response_array.data.data.ethereum)
            {
              if(response_array.data.data.ethereum.dexTrades != null)
              {
                var res_data = response_array.data.data.ethereum.dexTrades
                set_highcharts_status(true)
                for(let x of res_data) 
                {  
                    var date_conv = moment(x.timeInterval.month).format('MMM, YYYY')
                    if(!month_array.includes(date_conv))
                    {
                        await month_array.push(date_conv)
                    }

                    var abc = x.exchange.fullName.replace(/([<>])/g, '_')
                    if(!exchange_array.includes(abc))
                    {
                        await exchange_array.push(abc)
                    }
                }

                let final_result_array = []
                for(let u of exchange_array) 
                {
                    var v_text = []

                    
                    for(let x of res_data) 
                    { 
                        if(u == x.exchange.fullName.replace(/([<>])/g, '_'))
                        {
                            v_text.push(x.tradeAmount)
                        }
                    }
                    var result_data = {}
                    
                    result_data['name'] = u
                    result_data['data'] = v_text
                   
                    await final_result_array.push(result_data)
                }
                //console.log(final_result_array)
                set_exchanges_list(final_result_array)
                set_exchange_names(month_array)
                
                Highcharts.setOptions({
                    lang: {
                      numericSymbols: ['K', ' M', 'B', 'T']
                    }
                  })

                Highcharts.chart('container', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: '1 year Dex Volume'
                    },
                    xAxis: {
                        categories: month_array
                    },
                    yAxis: {
                        min: 0,
                        title: {
                            text: 'Dex Volume'
                        },
                    },
                    legend: {
                        align: 'right',
                        x: -30,
                        layout: 'vertical',
                        verticalAlign: 'top',
                        y: 25,
                        floating: false,
                        backgroundColor: Highcharts.defaultOptions.legend.backgroundColor || 'white',
                        borderColor: '#CCC',
                        borderWidth: 1,
                        shadow: false
                    },
                    tooltip: {
                        headerFormat: '<b>{point.x}</b><br/>',
                        pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
                    },
                    plotOptions: {
                        column: {
                            stacking: 'normal'
                        }
                    },
                    series: final_result_array
                });
              } 
            }
        }
    }

useEffect(()=>
{  
  getdexTradevolume() 
  getdexTrades7days()
  getdexTrades()
  getdexTrades1year()
  getactivedexTrades()
  exchangesMonthWiseList()
 },[network_id])

 

return (
    <> 
     <Head> 
        <title>Dex Trades</title> 
      </Head> 
     
    
<div className="page new_markets_index min_height_page" >
<div className="market-page">
<div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                  <h1 className="page_title">Cryptocurrency Market Insights</h1>
                  <p>Check the latest Price before you buy.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4">
                    {
                      <Search_Contract_Address /> 
                    }
                </div>
              </div>
            </div>
          </div>
        </div>
    <div className="container"> 
    <div className="col-md-12">
    <div className="categories categories_list_display"> 
          <div className="categories__container">
              <div className="row">
                  <div className="markets_list_quick_links">
                  {
                    <CategoriesTab active_tab={2}/> 
                  } 
                  </div>
              </div>
          </div> 
      <div className="row mb-4 mt-4">
      {
        <AnalysisInsightsMenu /> 
      }
     
        <div className="col-md-10">
            <div className="categories categories_list_display">
                <div className="categories__container">
                  <div className="row">
                    <div className="markets_list_quick_links">
                      <ul>
                        <li>
                            <Link href={"/analysis-insights/dex-volume/ethereum"}>
                                <a className={"categories__item "+(tab == 1 ? " active_category" : null)} onClick={()=>set_tab(1)}>
                                    <div className="categories__text">Ethereum</div>
                                </a>
                            </Link> 
                        </li>
                        <li>
                            <Link href="/analysis-insights/dex-volume/bsc">
                            <a className={"categories__item "+(tab == 2 ? " active_category" : null)} onClick={()=>set_tab(2)}>
                                <div className="categories__text">Binance</div>
                            </a>
                           </Link> 
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
            </div>
          <div className="row ">
              <div className="col-md-6">
                <div className="dex-section">
                  <div className="row ">
                    <div className="col-md-6">
                    <p>DEX 24 hours volume</p>
                    </div>
                    <div className="col-md-6">
                    <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                  </div>
                    <div className="text-center mt-2">
                      <div style={{fontSize:"35px"}}>{dextrades_24h_volume ? "$ "+convertvalue(dextrades_24h_volume): "$ 00"}</div>
                      <p style={{fontSize:"18px"}}>Volume last 24 hours</p>
                    <br/>
                    </div>
                    
                    <div className='col-md-12 pull-right text-right'>
                    <button onClick={() => change(1)}>
                      <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                      </button>
                    </div>
                </div>
                
              </div>

              <div className="col-md-6">
                <div className="dex-section">
                  <div className="row ">
                    <div className="col-md-6">
                    <p>DEX 7 days volume</p>
                    </div>
                    <div className="col-md-6">
                    <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                      <div style={{fontSize:"35px"}}>{dextrades_7days_volume ? "$ "+convertvalue(dextrades_7days_volume): "$ 00"}</div>
                      <p style={{fontSize:"18px"}}>Volume last 7 days</p>
                    <br/>
                </div> 
                
                <div className='col-md-12 pull-right text-right'>
                  <button onClick={() => change(2)}>
                        <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                  </button>
                </div>
              </div>
              </div>
              {/* <div className="col-md-4">
                <div className="dex-section">
                  <p>1 Month Trade volume</p>
                  <h6>{dextrades_1month_volume ? "$ "+convertvalue(dextrades_1month_volume): "$ 00"}</h6>
                  <br/>
                    <div className='col-md-12 p-0'>
                      <div className='col-md-8 p-0 text-left'>
                        <p>Source : <a target={"_blank"} href="https://graphql.bitquery.io/ide">GraphQl Bitquery</a></p>
                      </div>
                      <div className='col-md-6'>
                        
                      </div>
                    </div>
                </div> 
              </div> */}
          </div>
          <div className="row  mt-4">
              <div className="col-md-6">
                <div className="dex-section">
                  <div className="row ">
                    <div className="col-md-6">
                    <p>DEX 24 hours change % volume</p>
                    </div>
                    <div className="col-md-6">
                    <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                  </div>

                  <div className="text-center mt-2">
                      <div style={{fontSize:"35px"}}>{dextrades_24h_change_volume ? dextrades_24h_change_volume.toFixed(2)+"%": "NA"}</div>
                      <p style={{fontSize:"18px"}}>Changes 24 hours</p>
                    <br/>
                 </div>

                  <div className='col-md-12 pull-right text-right'>
                  <button onClick={() => change(3)}>
                    <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="dex-section">
                  <div className="row ">
                    <div className="col-md-6">
                    <p>DEX 7 days change % volume</p>
                    </div>
                    <div className="col-md-6">
                    <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                  </div>

                  <div className="text-center mt-2">
                      <div style={{fontSize:"35px"}}>{dextrades_7day_change_volume ? dextrades_7day_change_volume.toFixed(2)+"%": "NA"}</div>
                      <p style={{fontSize:"18px"}}>Change last 7 days</p>
                    <br/>
                  </div>

                  
                  <div className='col-md-12 pull-right text-right'>
                  <button onClick={() => change(4)}>
                    <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                    </button>
                  </div>
                  
                </div> 
              </div>

              
          </div>
          

          <div className="row mt-4">
          <div className="col-md-6">
              <div className="dex-donot-pichart">
                  <h6 className="mb-3">Ranked 🥇DEX by volume</h6>
                  <div className="dex-table">
                      <div className="table-responsive">
                        <table className="table table-borderless">
                            <thead>
                                <tr>
                                  <th className='dex-rank '>Rank</th>
                                  <th>Exchange</th>
                                  {/* <th>24h Trades</th> */}
                                  <th>24h Volume</th>
                                  {/* <th>7days Trades</th> */}
                                  <th>7days Volume</th>
                                </tr>
                            </thead>
                            <tbody  >
                              {
                                dex_trades.length>0 ?
                                dex_trades.map((e, i) => 
                                    <tr key={i}>
                                      <td  className='dex-rank '>{++i}</td>
                                      <td >{e.exchange_name?e.exchange_name:"--"}</td>
                                      {/* <td>{e.dex_trade_24count}</td> */}
                                      <td>$ { ((parseFloat(e.dex_trade_24volume)).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                      {/* <td>{e.dex_trade_7daycount}</td> */}
                                      <td>$ {((parseFloat(e.dex_trade_7dayvolume)).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                    </tr>
                                )
                                :
                                ""
                              }
                          </tbody>
                        </table>
                      </div>
                  </div> 

                  <div className="row mt-4 ">
                    <div className="col-md-6">
                    <p >Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                    <div className='col-md-6 pull-right text-right'>
                    <button onClick={() => change(5)}>
                    <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                    </button>
                  </div>
                  </div>
              </div> 
            </div>  
            <div className="col-md-6">
              {
                ((pi_chart_24h_values.length > 0) && (pi_chart_24h_names.length > 0)) ?
                <div className="dex-donot-pichart">
                  <h6 className="mb-3">24H Market share 🍰DEX by volume 🏦</h6>
                    <div className="donot-pi-chart-section" id="chart">
                      <ReactApexChart options={options} series={pi_chart_24h_values} type="donut" />
                    </div>
                    

                      <div className="row  mt-4 ">
                        <div className="col-md-6">
                        <p >Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                        </div>
                        <div className='col-md-6 pull-right text-right'>
                        <button onClick={() => change(6)}>
                          <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                        </button>
                      </div>
                      </div>
                  </div>
                :
                ""
              }
             
              </div>
            </div>



            <div className="row mt-4">
              <div className="col-md-6">
                <div className="dex-donot-pichart">
                  <h6 className="mb-3">Ranked 🥇DEX by number of traders</h6>
                  <div className="dex-table">
                    <div className="table-responsive">
                      <table className="table table-borderless">
                        <thead>
                          <tr>
                            <th className='dex-rank '>Rank</th>
                            <th>Exchange</th>
                            <th>24h Traders</th>
                            <th>7days Traders</th>
                          </tr>
                        </thead>
                        <tbody  className="dex-table">
                          {
                            dex_trades.length>0 ?
                            dex_trades.map((e, i) => 
                                <tr key={i}>
                                  <td  className='dex-rank '>{++i}</td>
                                  <td >{e.exchange_name?e.exchange_name:"--"}</td>
                                  <td> { ((parseFloat(e.dex_trade_24count)).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                  <td> {((parseFloat(e.dex_trade_7daycount)).toFixed(2)).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</td>
                                </tr>
                            )
                            :
                            ""
                          }
                        </tbody>
                      </table>
                    </div>
                  </div> 
                  <div className="row  mt-4 ">
                    <div className="col-md-6">
                      <p >Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                    <div className='col-md-6 pull-right text-right'>
                      <button onClick={() => change(7)}>
                        <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                      </button>
                    </div>
                  </div>
                </div> 
              </div>  
              <div className="col-md-6">
            
            
              </div>
            </div>
            
            
           
      <div>
        </div> 
        { 
            highchart_status?
            <div className="mt-4">
            <h6 className="mb-3">1 Year DEX volume</h6>
            <div className="row">
              <div className="col-md-12" style={{minHeight:"500px"}}> 
            
                <figure class="highcharts-figure">
                    <div id="container"></div>
                </figure>
                {/* <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={exchanges_list}
                    >
                    <CartesianGrid strokeDasharray="20 20" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {
                      exchange_names.map((item, i) =>
                      <Bar dataKey={item.replace(/([<>])/g, '')} stackId="a" fill={exchange_colors[i]} />
                      )
                    }
                  </BarChart>
                </ResponsiveContainer> */}
              </div>  
            </div>
          </div>  
          :
          ""     
        }
            <div className="row mt-2">
            <div className="col-md-6">
                <div className="dex-section">
                  <div className="row ">
                    <div className="col-md-6">
                    <p>DEX 30 days volume</p>
                    </div>
                    <div className="col-md-6">
                    <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                      <div style={{fontSize:"35px"}}>{dextrades_30day_volume ? "$ "+convertvalue(dextrades_30day_volume): "$ 00"}</div>
                      <p style={{fontSize:"18px"}}>Volume last 30 days</p>
                    <br/>
                </div> 
                
                <div className='col-md-12 pull-right text-right'>
                  <button onClick={() => change(9)}>
                        <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                  </button>
                </div>
              </div>
              </div>


              <div className="col-md-6">
                <div className="dex-section">
                  <div className="row ">
                    <div className="col-md-6">
                    <p>DEX 12 Months volume</p>
                    </div>
                    <div className="col-md-6">
                    <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                  </div>
                    <div className="text-center mt-2">
                      <div style={{fontSize:"35px"}}>{dextrades_12months_volume ? "$ "+convertvalue(dextrades_12months_volume): "$ 00"}</div>
                      <p style={{fontSize:"18px"}}>Volume last 12 Months</p>
                    <br/>
                    </div>
                    
                    <div className='col-md-12 pull-right text-right'>
                    <button onClick={() => change(8)}>
                      <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                      </button>
                    </div>
                </div>
              </div>
              
          </div> 
          <div className="row mt-4">
          <div className="col-md-6">
                <div className="dex-section">
                  <div className="row">
                    <div className="col-md-6">
                    <p>Today's Number of DEX traders</p>
                    </div>
                    <div className="col-md-6">
                    <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                    </div>
                  </div>
                  <div className="text-center mt-2">
                      <div style={{fontSize:"35px"}}>{unique_traders ? separator(unique_traders): "NA"}</div>
                      <p style={{fontSize:"18px"}}>Total unique trading addresses</p>
                    <br/>
                </div> 
                
                <div className='col-md-12 pull-right text-right'>
                  <button onClick={() => change(10)}>
                        <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                  </button>
                </div>
              </div>
              </div>
          </div>         
       
        </div>
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
  {
        dex_row_id ?
        <Popupmodal dex_row_id={dex_row_id} /> 
          :
        null
    } 
    </>
  )
} 

export async function getServerSideProps({ req, query }) 
{  
    const network_id = query.network_id
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
     
    return { props: {userAgent:userAgent, network_id:network_id}} 
} 
  
export default TokenDetails
