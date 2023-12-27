import React , {useState, useEffect,useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux'
import { createChart, ColorType } from 'lightweight-charts'
import { cmcArrageGraphData, cmc_graph_ranges} from '../custom_functions' 
import { roundNumericValue, separator } from '../../constants' 
import MarketCapChart from './marketcap'

export default function Tokenchart({reqData}) 
{
   //console.log("active_tab",reqData)
    const chartContainerRef =useRef("")
    const chartMarketCapRef =useRef("")
    const [graph_status, set_graph_status] = useState(true)
    const {symbol, time_name, intervals, count, chart_tab, token_name, volume, percentage_change_24h, circulating_supply, max_supply, live_price} = reqData
    const [show_message_status, set_show_message_status] = useState(false)
    const [is_mobile_view, set_is_mobile_view] = useState(false)
    // const [time_name, set_time_name] = useState("1D")
    // const [intervals, set_intervals] = useState("15m")
    // const [count, set_count] = useState("96")
    
    const active_currency = useSelector(state => state.active_currency)

    const convertCurrency = (token_price) =>
    {
      if(active_currency.currency_value)
      {
        return active_currency.currency_symbol+" "+roundNumericValue(token_price*(active_currency.currency_value))
      }
      else
      {
        return "$ "+roundNumericValue(token_price)
      }
    }

    useEffect(() => 
    {   
        plotGraph()
        // if(!is_mobile_view)
        // {
        //     const handleResize = () => 
        //     {
        //         if(window != undefined)
        //         {
        //             if(window.innerWidth <= 767)
        //             {
        //                 plotGraph(false)
        //                 set_is_mobile_view(true)
        //             }
        //             else
        //             {
                        
        //                 set_is_mobile_view(true)
        //             }
        //         }
        //     }
        
        //     handleResize(); 
        //     window.addEventListener('resize', handleResize);
        
        //     return () => {
        //     window.removeEventListener('resize', handleResize);
        //     }
        // }
        
      }, [true])
    
    useEffect(() => 
    {
        
        // MarketCap()
    }, [, ])

    const plotGraph = async () =>
    {   
        // set_time_name(pass_time_name)
        // set_intervals(pass_interval)
        // set_count(pass_interval)
       
        try
        {  
            // if(chartContainerRef.current)
            // {
            //     await chartContainerRef.current.reset();
            // }

            if(symbol && intervals && count)
            {
                const response = await Axios.get('/api/tokens_graph/'+symbol+'/?intervals='+intervals+"&count="+count)
                // console.log("final_array", final_array)
                if(response.data.message) 
                {
                    const response_message = response.data.message
                    const last_element_details = await response_message[response_message.length - 1]
                    if(last_element_details.quote.USD)
                    {
                        reqData.callback(last_element_details.quote.USD)
                    }
                    const { final_array, volume_array, base_price, low_value, high_value } = await cmcArrageGraphData(response.data.message)
                    // console.log("high_value", high_value)
                    // console.log("final_array", final_array)

                    // console.log("base_price", base_price)
                    let leftPriceScale = true
                    if(chartContainerRef.current)
                    {   
                        set_show_message_status(true)
                        if(chartContainerRef.current.clientWidth<= 767)
                        {
                            leftPriceScale = false
                        }

                        const chart = createChart(chartContainerRef.current, {
                            layout: {
                                background: { type: ColorType.Solid, color: "white",  },
                                textColor: '#8f98aa'
                            },
                            autoSize: false,
                            width: chartContainerRef.current ? chartContainerRef.current.clientWidth:600,
                            height: 350,
                        })
            
                
                        chart.applyOptions({
                            autoSize: false,
                            leftPriceScale: 
                            {
                                visible:leftPriceScale,
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
                                fixLeftEdge: true,
                                fixRightEdge: true,
                            }
                        })
                
                        const baselineSeries = chart.addBaselineSeries({
                            baseValue: { type: 'price', price: base_price },
                            priceLineVisible: false,
                            lineWidth:2,
                            topLineColor: 'rgba( 24, 199, 100, 1)', topFillColor1: 'rgba( 24, 199, 100, 0.68)',
                            topFillColor2: 'rgba( 24, 199, 100, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)',
                            bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.68)'
                        });

                        baselineSeries.setData(final_array)
                        chart.timeScale().fitContent();
                      
                        
                        
                        chart.priceScale("left").applyOptions({
                            borderColor: '#eff2f5'
                        })
                
                        chart.timeScale().applyOptions({
                            borderColor: '#eff2f5',
                        })

                        const avgPriceLine = {
                            price: parseFloat(base_price),
                            color: '#cfd6e3',
                            // lineWidth: 2,
                            // lineStyle: 1, // LineStyle.Dotted
                            axisLabelVisible: true,
                            // title: 'ave price',
                        }
                
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
                
                
                        //console.log("chartContainerRef", chart)
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
                            
                                const price = data.value !== undefined ? data.value : data.close;
                                

                                const graph_final_price = price;
                                // console.log("graph_final_price" , graph_final_price);

                                
            
                                const data2 = param.seriesData.get(volumeSeries)
                                const volume_24h = data2.value !== undefined ? data2.value : data2.close
                                
            
                                toolTip.innerHTML =`
                                <div style="width: 220px; border:1px solid #E6EBEF;padding: 8px; border-radius: 5px;font-family: 'Space Grotesk';">
                                    <h4 style="font-size: 13px;font-family: 'Space Grotesk'; color: ${price>base_price ? "green":"red" }">
                                        ${moment.unix(dateStr).format('DD MMM YYYY')}
                                        <span style="float:right;font-family: 'Space Grotesk';">${moment.unix(dateStr).format('hh:mm a')}</span>
                                    </h4>
                                    <h5 style="font-size: 15px;font-family: 'Space Grotesk';color: ${'black'}; margin-top: 10px;">
                                        ${
                                            price>base_price?
                                            '<div className="tooltip-dot dot-success" style="position: relative; top: 0; width: 10px; height: 10px;"></div>'
                                            :
                                            '<div className="tooltip-dot dot-danger" style="position: relative; top: 0; width: 10px; height: 10px;"></div>'
                                        }  
                                        <strong style="font-family: 'Space Grotesk';">Price:</strong>
                                        $ ${price.toFixed(6)}
                                    </h5>
                                
                                    <h6 style="font-size: 13px;font-family: 'Space Grotesk';color: #666"><strong style="font-family: 'Space Grotesk';">Vol 24h:</strong> $ ${separator(volume_24h.toFixed(0))}</h6>
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

                        if(chartContainerRef.current.clientWidth<= 767)
                        {
                            chart.applyOptions({
                                width:chartContainerRef.current?.clientWidth,
                                leftPriceScale: {
                                    visible:false
                                }
                            }) 
                        }
            
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
        }
        catch(err)
        {
            set_graph_status(false)
        }
        
    }

  

    return (
        <>
        {/* {chart_tab==1? */}
        <div ref={chartContainerRef}>
        </div>
        
        {
            !graph_status ?
            <div className='text-center'> No chart data available</div>
            :
            (live_price > 0) && show_message_status ?
            <div className='price-chart-content mt-2'>
                {/* The live price of {token_name} is at {convertCurrency(live_price)} {volume ? <>, having 24 hours volume of {convertCurrency(volume)}.</>:"."} 
                {
                    percentage_change_24h ?
                    <>
                    &nbsp;The chart above shows {token_name} is currently {percentage_change_24h ? (percentage_change_24h):""}% {percentage_change_24h > 0 ? "up":"down"} since yesterday.
                    </>
                    :
                    ""
                }

                {
                circulating_supply > 0 ?
                <>
                    &nbsp;The total circulating supply of {token_name} is {convertCurrency(circulating_supply.toFixed(0))}
                </>
                :
                ""
                }  

                {max_supply ? <> and the max supply is {separator(max_supply)} {symbol.toUpperCase()}. </>:""} */}
            </div> 
            :
            "" 
        }
      {/* :
      <MarketCapChart reqData={reqData}/>
        } */}
        </>
    );

}