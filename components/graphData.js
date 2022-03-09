/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import Highcharts from 'highcharts';
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css" 
import JsCookie from "js-cookie"   
import moment from 'moment'
import {count_live_price,graphqlApiKEY, headers,createValidURL, IMAGE_BASE_URL} from '../components/constants'
import { graphQlURL, fromNToDate } from '../components/tokenDetailsFunctions' 
import Popupmodal from '../components/popupmodal'


export default function Details({reqData,graph_data_date}) 
{   
    
    const [api_from_type, set_api_from_type] = useState(reqData.api_from_type)
    const [customDate, setCustomDate] = useState(false)
    const [graphDate , set_graphDate] = useState(1) 
    const [light_dark_mode, set_light_dark_mode]=useState(JsCookie.get('light_dark_mode')) 
    const [Err_api_from_id, setErr_api_from_id] = useState()
    const [token_row_id, set_token_row_id] = useState(reqData.token_row_id)
    const [coingecko, set_coingecko] = useState("")
    const [modal_data, setModalData] = useState({ icon: "", title: "", description: "" })
  
useEffect(()=>
{ 
 if(reqData.api_from_type===0)
    {
        getGraphData(graph_data_date, reqData.contract_addresses[0].contract_address, reqData.contract_addresses[0].network_type)
    }
    else
    {
        coingeckoGraph(graph_data_date,reqData.api_from_id)
    }

    if(JsCookie.get('light_dark_mode') === "dark")
    { 
      set_light_dark_mode("dark")
     
    }
},[light_dark_mode])
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
      console.log("fromDate",fromDate)

        if(parseInt(networks) === 1)
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
     
        if(parseInt(networks) === 2){ 
    
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
                console.log(prices)
              }
            }  
        if(light_dark_mode=="dark"){
          console.log("dark")
        Highcharts.chart('container', {
          chart: {
            backgroundColor: {
                stops: [
                    [0, 'rgb(23, 23, 26)'],
                    [1, 'rgb(23, 23, 26)']
                ]
            },
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
                        [0, 'rgb(23 23 26 / 1%)'],
                        [1, 'rgb(23 23 26 / 1%)']
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
        else{
          console.log("light")
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
                        [0, 'rgb(255 248 241 / 1%)'],
                        [1, 'rgb(255 255 255 / 1%)']
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
             
        }
    
          })
          .catch(console.error);  
    } 
    
    const coingeckoGraph = async (datetime,token_id) =>
    {   
      
      var from_n_to_date = fromNToDate(datetime)
      let fromDate= new Date(from_n_to_date.fromDate).getTime()/1000
      let toDate=new Date(from_n_to_date.toDate).getTime()/1000
      console.log("Graph from coingecko") 
        Axios.get("https://api.coingecko.com/api/v3/coins/"+token_id+"/market_chart/range?vs_currency=usd&from="+fromDate+"&to="+toDate)
          .then(response=>{ 
            if (response!= null && response.data.prices != null) { 
              var prices= [];
              var arr = response.data.prices; 
      
              for (let index = 0; index < arr.length; index++) {
                if (arr[index] !== undefined) {
                  var rate = 0 
                  rate = arr[index]
                  var val = []
                  val[0] =rate[0]
                  val[1] =rate[1]
                   prices.push(val)
                   console.log("prices",prices)
                }
              }  

            console.log("graphcoingeckodata",response)
            
            if(light_dark_mode=="dark"){
              console.log("dark")
              Highcharts.chart('container', {
                chart: {
                  backgroundColor: {
                      stops: [
                          [0, 'rgb(23, 23, 26)'],
                          [1, 'rgb(23, 23, 26)']
                      ]
                  },
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
                              '<strong>Price :</strong> '+ ('$ ') + Highcharts.numberFormat(point.y, 10) + '';  
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
                              [0, 'rgb(23 23 26 / 1%)'],
                              [1, 'rgb(23 23 26 / 1%)']
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
            else
            {
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
                              '<strong>Price :</strong> '+ ('$ ') + Highcharts.numberFormat(point.y, 10) + '';  
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
             })
            }
         }
         })
         
           
        
   
        

       
         
    }
      

    return (
      <>
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
     
      
      
      {
        customDate
        ?
        <div className="market-details-custom-search-block"> 
          <h5>Filter by Date</h5>
          <div className="search_by_date">
            <div className="row">
              <div className="col-md-5 col-5">
                <div className="graph_date_table"><Datetime inputProps={ inputProps } onClick={()=> setCustomDate(true)} isValidDate={valid}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="start_date" value={customstartdate}   onChange={(e)=> setCustomstartdate(e)} /></div>
                {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customstartdate} onChange={(e)=> setCustomstartdate(e.target.value)} placeholder="Start date" type="date" /> */}
              </div>
              <div className="col-md-5 col-5">
                <div className="graph_date_table"><Datetime inputProps={ inputProps2 } onClick={()=> setCustomDate(true)} isValidDate={valid2}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="end_date" value={customenddate}  onChange={(e)=> setCustomenddate(e)} /></div>
                {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customenddate} onChange={(e)=> setCustomenddate(e.target.value)} placeholder="End date" type="date" /> */}
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
    </>

    )
}         

  