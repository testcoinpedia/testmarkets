/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import Highcharts from 'highcharts';
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css"   
import moment from 'moment'
import {count_live_price,graphqlApiKEY, headers,createValidURL, IMAGE_BASE_URL} from '../components/constants'
import { graphQlURL, fromNToDate } from '../components/tokenDetailsFunctions' 
import Popupmodal from '../components/popupmodal'


export default function Details({reqData}) 
{   
    
    console.log("reqDatagraphql",reqData)
    const [api_from_type, set_api_from_type] = useState(reqData.api_from_type)
    const [customDate, setCustomDate] = useState(false)
    const [graphDate , set_graphDate] = useState(1) 
    const [config] = useState(reqData.config)
    const [Err_api_from_id, setErr_api_from_id] = useState()
    const [token_row_id, set_token_row_id] = useState(reqData.token_row_id)
    const [modal_data, setModalData] = useState({ icon: "", title: "", description: "" })
  
useEffect(()=>
{ 
 if(reqData.api_from_type===0)
    {
        getGraphData(4, reqData.contract_addresses[0].contract_address, reqData.contract_addresses[0].network_type)
    }
    else
    {
        coingeckoGraph(4,reqData.token_id)
    }
},[])
    const getGraphData=(datetime, id, networks)=> 
    {   
      
      console.log("Graph from graphqldata")
      let query =""
      if(datetime === "") 
      { 
        datetime = graphDate;
      } 
      set_graphDate(datetime)
      
      var from_n_to_date = fromNToDate(datetime)
      let fromDate= from_n_to_date.fromDate
      let toDate= from_n_to_date.toDate 
    
        if(networks === "1")
        {
          if(id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
          {
            query = `
              query
                    {
                      ethereum(network: ethereum) {
                        dexTrades(
                          exchangeName : {is: ""}
                          date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                          any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
                          options: {asc: "timeInterval.hour"}
                        ) {
                          timeInterval {
                            hour(count: 1)
                          }
                          baseCurrency {
                            symbol
                          }        
                          quoteCurrency {
                            symbol
                          }
                          quote: quotePrice
                          buyAmount: baseAmount
                          sellAmount: quoteAmount
                          tradeAmountInUsd: tradeAmount(in: USD)
                        }
                      }
                    }
              ` ;  
          }
          else
          {
            query = `
            query
                  {
                    ethereum(network: ethereum) {
                      dexTrades(
                        exchangeName : {is: ""}
                        date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                        any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]
                        options: {asc: "timeInterval.hour"}
                      ) {
                        timeInterval {
                          hour(count: 1)
                        }
                        baseCurrency {
                          symbol
                        }        
                        quoteCurrency {
                          symbol
                        }
                        quote: quotePrice
                        buyAmount: baseAmount
                        sellAmount: quoteAmount
                        tradeAmountInUsd: tradeAmount(in: USD)
                      }
                    }
                  }
            ` ;  
          }
        }
     
        if(networks === "2"){ 
    
          if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"){
    
            query = `
            query
                  {
                    ethereum(network: bsc) {
                      dexTrades(
                        exchangeName : {is: "Pancake v2"}
                        date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                        any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
                        options: {asc: "timeInterval.hour"}
                      ) {
                        timeInterval {
                          hour(count: 1)
                        }
                        baseCurrency {
                          symbol
                        }        
                        quoteCurrency {
                          symbol
                        }
                        quote: quotePrice
                        buyAmount: baseAmount
                        sellAmount: quoteAmount
                        tradeAmountInUsd: tradeAmount(in: USD)
                      }
                    }
                  }
            ` ; 
    
          }
          else{
            
            query = `
            query
                  {
                    ethereum(network: bsc) {
                      dexTrades(
                        exchangeName : {is: "Pancake v2"}
                        date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                        any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}]
                        options: {asc: "timeInterval.hour"}
                      ) {
                        timeInterval {
                          hour(count: 1)
                        }
                        baseCurrency {
                          symbol
                        }        
                        quoteCurrency {
                          symbol
                        }
                        quote: quotePrice
                        buyAmount: baseAmount
                        sellAmount: quoteAmount
                        tradeAmountInUsd: tradeAmount(in: USD)
                      }
                    }
                  }
            ` ;
    
          } 
        }  
     
    
        
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY": graphqlApiKEY
          },
          body: JSON.stringify({
            query
          })
        };
        fetch(graphQlURL, opts)
          .then(res => res.json())
          .then(result => { 
            
            if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) { 
            var prices= [];
            var arr = result.data.ethereum.dexTrades; 
    
            for (let index = 0; index < arr.length; index++) {
              if (arr[index] !== undefined) {
                var rate = 0 
                rate = arr[index].tradeAmountInUsd / arr[index].buyAmount; 
                 
                var date = new Date(arr[index].timeInterval.hour)
                var val = []
                val[0] = date.getTime()
                val[1] = rate; 
    
    
                prices.push(val)
                // console.log(prices)
              }
            }  
    
            Highcharts.chart('container', {
              chart: {
                  zoomType: 'x'
              },
              title: {
                  text: ''
              },
              xAxis: {
                  type: 'datetime',
                  lineColor: '#f7931a',
                  dashStyle: 'Dash',
              },
              yAxis: {
                  title: {
                      text: ('USD Prices')
                  },
                  dashStyle: 'Dash',
              },
              colors: ['#f7931a'],
              legend: {
                  enabled: false
              },
              tooltip: {
                        formatter: function () {
                            var point = this.points[0];
                            return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
                            '<strong>Price :</strong> '+ ('$ ') + count_live_price(Highcharts.numberFormat(point.y, 10)) + '';  
                        },
          shared: true
             },
              plotOptions: {
                  area: {
                      fillColor: {
                          linearGradient: {
                              x1: 0,
                              y1: 0,
                              x2: 0,
                              y2: 1
                          },
                          stops: [
                              [0, 'rgb(255 248 241 / 59%)'],
                              [1, 'rgb(255 255 255 / 59%)']
                          ]
                      },
                      marker: {
                          radius: 1
                      },
                      lineWidth: 3,
                      states: {
                          hover: {
                              lineWidth: 3
                          }
                      },
                      threshold: null
                  }
              },
        
              series: [{
                  type: 'area',
                  name: '',
                  data: prices
              }]
          }); 
        }
    
          })
          .catch(console.error);  
    } 
    
    const coingeckoGraph = async (datetime,token_id) =>
    {   
      
      var from_n_to_date = fromNToDate(datetime)
      let fromDate= new Date(from_n_to_date.fromDate).getTime()
      let toDate=new Date(from_n_to_date.toDate).getTime()
      // console.log(from_n_to_date)
      // console.log(new Date(1627004950))
      console.log("Graph from coingecko")
        Axios.get("https://api.coingecko.com/api/v3/coins/"+token_id+"/market_chart/range?vs_currency=usd&from="+1627004950+"&to="+1645580950+"")
          .then(response=>{ 
            console.log("graphcoingeckodata",response.data.prices)
        //     var prices= [];
        // var arr = result.data.ethereum.dexTrades; 

        // for (let index = 0; index < arr.length; index++) {
        //   if (arr[index] !== undefined) {
        //     var rate = 0 
        //     rate = arr[index].tradeAmountInUsd / arr[index].buyAmount; 
             
        //     var date = new Date(arr[index].timeInterval.hour)
        //     var val = []
        //     val[0] = date.getTime()
        //     val[1] = rate; 


        //     prices.push(val)
        //   }
        // }
            
        })
      //   Highcharts.chart('container', {
      //     chart: {
      //         zoomType: 'x'
      //     },
      //     title: {
      //         text: ''
      //     },
      //     xAxis: {
      //         type: 'datetime',
      //         lineColor: '#f7931a',
      //         dashStyle: 'Dash',
      //     },
      //     yAxis: {
      //         title: {
      //             text: ('USD Prices')
      //         },
      //         dashStyle: 'Dash',
      //     },
      //     colors: ['#f7931a'],
      //     legend: {
      //         enabled: false
      //     },
      //     tooltip: {
      //               formatter: function () {
      //                   var point = this.points[0];
      //                   return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
      //                   '<strong>Price :</strong> '+ ('$ ') + count_live_price(Highcharts.numberFormat(point.y, 10)) + '';  
      //               },
      // shared: true
      //    },
      //     plotOptions: {
      //         area: {
      //             fillColor: {
      //                 linearGradient: {
      //                     x1: 0,
      //                     y1: 0,
      //                     x2: 0,
      //                     y2: 1
      //                 },
      //                 stops: [
      //                     [0, 'rgb(255 248 241 / 59%)'],
      //                     [1, 'rgb(255 255 255 / 59%)']
      //                 ]
      //             },
      //             marker: {
      //                 radius: 1
      //             },
      //             lineWidth: 3,
      //             states: {
      //                 hover: {
      //                     lineWidth: 3
      //                 }
      //             },
      //             threshold: null
      //         }
      //     },
    
      //     series: [{
      //         type: 'area',
      //         name: '',
      //         data: prices
      //     }]
      // }); 
    
    }


    return (
        <div id="view_individual_details">
           
             <figure className="highcharts-figure">
                            <div
                              id="container"
                              style={{ height: 250, overflow: "hidden" }}
                              data-highcharts-chart={0}
                              role="region"
                              aria-label="Chart. Highcharts interactive chart."
                              aria-hidden="false"
                            >  
                            </div>
                          </figure>
                          <div className="chart_tabs"> 
                         < ul className=" chart_tabs_ul nav nav-tabs">
                              <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#one_day" onClick={()=> getGraphData(1 , reqData.contract_addresses[0].contract_address ,reqData.contract_addresses[0].network_type)}>1 D</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab"  href="#one_week" onClick={()=> getGraphData(2, reqData.contract_addresses[0].contract_address ,reqData.contract_addresses[0].network_type)}>1 W</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab"  href="#one_month" onClick={()=> getGraphData(3, reqData.contract_addresses[0].contract_address ,reqData.contract_addresses[0].network_type)}>1 M</a>
                              </li>
                              <li className="nav-item">
                                <a  className="nav-link active" data-toggle="tab"  href="#one_year" onClick={()=> getGraphData(4, reqData.contract_addresses[0].contract_address ,reqData.contract_addresses[0].network_type)}>1 Y</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#more_dates"  onClick={()=> setCustomDate(!customDate)}><img src="/assets/img/table_dropdown_dots.png" className="more_dates" /></a>
                              </li> 
                            </ul>
                            </div> 
                             {
                              customDate
                              ?
                              <div className="market-details-custom-search-block"> 
                                <h5>Filter by Date</h5>
                                <div className="search_by_date">
                                  <div className="row">
                                    <div className="col-md-5 col-5">
                                      <div className="graph_date_table"><Datetime inputProps={ inputProps } onClick={()=> setCustomDate(true)} isValidDate={valid}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="start_date" value={customstartdate}   onChange={(e)=> setCustomstartdate(e)} /></div>
                                       {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customstartdate} onChange={(e)=> setCustomstartdate(e.target.value)} placeholder="Start date" type="date" />  */}
                                    </div>
                                    <div className="col-md-5 col-5">
                                      <div className="graph_date_table"><Datetime inputProps={ inputProps2 } onClick={()=> setCustomDate(true)} isValidDate={valid2}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="end_date" value={customenddate}  onChange={(e)=> setCustomenddate(e)} /></div>
                                       {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customenddate} onChange={(e)=> setCustomenddate(e.target.value)} placeholder="End date" type="date" />  */}
                                    </div>
                                    <div className="col-md-2 col-2">
                                      {
                                        customstartdate && customenddate
                                        ?
                                        <button type="button" onClick={()=> getGraphData(6,data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}><img src="/assets/img/search-box-white.png" alt="Search" width="16px" height="16px" /></button>
                                        :
                                        <button type="button"><img src="/assets/img/search-box-white.png" alt="Search" width="16px" height="16px" /></button>
                                      }
                                    </div>
                                  </div>
                                </div>  
                              </div>
                              
                              :
                              null
                            }
        </div>
    )
}         

  