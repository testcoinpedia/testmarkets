import React , {useState, useEffect,useRef} from 'react'
import Axios from 'axios'
// import Highcharts from 'highcharts';

import JsCookie from "js-cookie"   
import moment from 'moment'
import { count_live_price, graphqlApiKEY} from '../components/constants'
import { graphQlURL, fromNToDate } from './token_details/tokenDetailsFunctions' 
import dynamic from 'next/dynamic';
import { createChart, ColorType } from 'lightweight-charts';

export default function Chart({reqData,graph_data_date}) {

    const chartContainerRef =useRef()
    // const [api_from_type, set_api_from_type] = useState(reqData.api_from_type)
    const [customDate, setCustomDate] = useState(false)
    const [graphDate , set_graphDate] = useState(1) 
    const [light_dark_mode, set_light_dark_mode] = useState(JsCookie.get('light_dark_mode')) 
    const [Err_api_from_id, setErr_api_from_id] = useState()
    // const [token_row_id, set_token_row_id] = useState(reqData.token_row_id)
    const [coingecko, set_coingecko] = useState("")
    const [modal_data, setModalData] = useState({ icon: "", title: "", description: "" })
    // const [graph_data_date, set_graph_data_date] = useState(1)
    console.log("graph_data_date",graph_data_date)
  
    const id="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    useEffect(()=>
    { 
        // if(reqData.api_from_type===0)
        // {
        //     getGraphData(graph_data_date, reqData.contract_addresses[0].contract_address, reqData.contract_addresses[0].network_type)
        // }
        // else
        // {
        //     coingeckoGraph(graph_data_date, reqData.api_from_id)
        // }

        if(JsCookie.get('light_dark_mode') === "dark")
        { 
            set_light_dark_mode("dark")
        }
    },[])

    // useEffect(()=>
    // { 
    const getGraphData=(datetime,id, networks)=> 
    {    
        let query =""
        if(datetime === "") 
        { 
          datetime = graphDate;
        } 
        set_graphDate(datetime)
        
        var from_n_to_date = fromNToDate(datetime)
        let fromDate= from_n_to_date.fromDate
        let toDate= from_n_to_date.toDate 
        
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
            body: JSON.stringify({ query })
        }

        fetch(graphQlURL, opts) .then(res => res.json()) .then(result => 
        { 
            console.log("ethereum",result.data)

            if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) 
            { 
                var prices= [];
                var arr = result.data.ethereum.dexTrades; 
                for (let index = 0; index < arr.length; index++) 
                {
                    if (arr[index] !== undefined) 
                    {
                        var rate = 0 
                        rate = arr[index].tradeAmountInUsd / arr[index].buyAmount; 
                        
                        var date = new Date(arr[index].timeInterval.hour)
                        var val = {}
                        val["time"] =  date.getTime() 
                        val["value"] = rate; 
            
            
                        prices.push(val)
                        console.log(prices)
                        // const base_value= prices.slice(-1)

                        // console.log("base_value",base_value)

                    }
                }
                const base_value= prices.slice(-1)  
                const value=  Object.assign({},base_value[0])
                console.log("base_value",value)
                // if(light_dark_mode=="dark"){
   
        const  chart= createChart(chartContainerRef.current,{
            layout: {
                background: { type: ColorType.Solid, color: "white" },
            },
            width: 1000,
            height: 400,
        })
    
        chart.applyOptions({
            leftPriceScale: {
                visible: true,
                // borderVisible: false,
            },
            rightPriceScale: {
                visible: false,
            },
    
            // hide the grid lines
            grid: {
              vertLines: {
                visible: false,
              },
              
            },
        })
    
                const baselineSeries = chart.addBaselineSeries({ baseValue: { type: 'price', price: value.value }, 
                topLineColor: 'rgba( 38, 166, 154, 1)', topFillColor1: 'rgba( 38, 166, 154, 0.68)', 
                topFillColor2: 'rgba( 38, 166, 154, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)',
                 bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.68)' });
                 baselineSeries.setData(prices)
                 chart.timeScale().fitContent();
    
                 chart.priceScale("left").applyOptions({
                    borderColor: '#ccc4c4 ',
                  
                });
    
                chart.timeScale().applyOptions({
                    borderColor: '#ccc4c4',
                });
                
                window.addEventListener('resize', () => {
                    chart.resize(window.innerWidth, window.innerHeight);
                });
    
    
            console.log("chartContainerRef" ,chart)
            const toolTipWidth = 80;
            const toolTipHeight = 80;
            const toolTipMargin = 15;
            
            // Create and style the tooltip html element
            const toolTip =  document.createElement('div');
            toolTip.style = `width: 206px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
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
                    const dateStr = param.time;
                    toolTip.style.display = 'block';
                    const data = param.seriesData.get(baselineSeries);
                    const price = data.value !== undefined ? data.value : data.close;
                    toolTip.innerHTML = `<div style="color: ${'rgba( 38, 166, 154, 1)'}">ABC Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
                        ${Math.round(100 * price) / 100}
                        </div><div style="color: ${'black'}">
                        ${dateStr}
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
            return ()=>[chart.remove()]
        // }
    }})
        .catch(console.error);  
  } 


  const coingeckoGraph = async (datetime,token_id) =>
  {   
    
    var from_n_to_date = fromNToDate(datetime)
    let fromDate= new Date(from_n_to_date.fromDate).getTime()/1000
    let toDate=new Date(from_n_to_date.toDate).getTime()/1000
    // console.log("Graph from coingecko") 
      Axios.get("https://api.coingecko.com/api/v3/coins/"+token_id+"/market_chart/range?vs_currency=usd&from="+fromDate+"&to="+toDate)
        .then(response=>{ 
          if (response!= null && response.data.prices != null) { 
            var prices= [];
            var arr = response.data.prices; 
    
            for (let index = 0; index < arr.length; index++) {
              if (arr[index] !== undefined) {
                var rate = 0 
                rate = arr[index]
                var val = {}
                val["time"] =rate[0]
                val["value"] =rate[1]
                 prices.push(val)
                 console.log("prices",prices)
            
              }
            }  

            const base_value= prices.slice(-1)  
                // const value=  Object.assign({},base_value[0])
                // console.log("second_value",value)
           if(light_dark_mode=="dark"){
            const  chart= createChart(chartContainerRef.current,{
                layout: {
                    background: { type: ColorType.Solid, color: "white" },
                },
                width: 1000,
                height: 400,
            })
        
            chart.applyOptions({
                leftPriceScale: {
                    visible: true,
                    // borderVisible: false,
                },
                rightPriceScale: {
                    visible: false,
                },
        
                // hide the grid lines
                grid: {
                  vertLines: {
                    visible: false,
                  },
                  
                },
            })
        
                    const baselineSeries = chart.addBaselineSeries({ baseValue: { type: 'price', price: base_value.value }, 
                    topLineColor: 'rgba( 38, 166, 154, 1)', topFillColor1: 'rgba( 38, 166, 154, 0.68)', 
                    topFillColor2: 'rgba( 38, 166, 154, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)',
                     bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.68)' });
                     baselineSeries.setData(prices)
                     chart.timeScale().fitContent();
        
                     chart.priceScale("left").applyOptions({
                        borderColor: '#ccc4c4 ',
                      
                    });
        
                    chart.timeScale().applyOptions({
                        borderColor: '#ccc4c4',
                    });
                    
                    window.addEventListener('resize', () => {
                        chart.resize(window.innerWidth, window.innerHeight);
                    });
        
        
                console.log("chartContainerRef" ,chart)
                const toolTipWidth = 80;
                const toolTipHeight = 80;
                const toolTipMargin = 15;
                
                // Create and style the tooltip html element
                const toolTip =  document.createElement('div');
                toolTip.style = `width: 206px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
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
                        const dateStr = param.time;
                        toolTip.style.display = 'block';
                        const data = param.seriesData.get(baselineSeries);
                        const price = data.value !== undefined ? data.value : data.close;
                        toolTip.innerHTML = `<div style="color: ${'rgba( 38, 166, 154, 1)'}">ABC Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
                            ${ priceMath.round(100 * price) / 100}
                            </div><div style="color: ${'black'}">
                            ${dateStr}
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
                return ()=>[chart.remove()]
            }
        
          //  }
        }
        })
    }
// },[])
    

        // },[])
        return (
    <div ref={chartContainerRef}>
    
    </div>  );
    
    }
