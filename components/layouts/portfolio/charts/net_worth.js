import React , {useState, useEffect,useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux'
import { createChart, ColorType } from 'lightweight-charts'
import { roundNumericValue, separator } from '../../../constants' 

export default function Tokenchart({reqData}) 
{   
    console.log("reqData", reqData)

    const chartContainerRef = useRef("")
    const [graph_status, set_graph_status] = useState(true)
    const [show_message_status, set_show_message_status] = useState(false)
    const [is_mobile_view, set_is_mobile_view] = useState(false)
    const active_currency = useSelector(state => state.active_currency)
    const { line_graph_values, line_graph_base_price } = reqData

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
            var base_price = 400
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
                        textColor: '#676767'
                    },
                    autoSize: false,
                    width: chartContainerRef.current ? chartContainerRef.current.clientWidth:600,
                    height: 300,
                    // localization: {
                    //     timeFormatter : "hh:mm"
                    //     //dateFormat: 'yyyy-MM-dd'
                    // },
                })
    
        
                chart.applyOptions({
                    autoSize: false,
                    leftPriceScale: 
                    {
                        visible:leftPriceScale,
                        scaleMargins: {
                            top: 0,
                            bottom: 0,
                        },
                    },
                    rightPriceScale: {
                        visible: false,
                    },
                    crosshair:{
                        CrosshairLineOptions:
                        {
                            crosshairMarkerVisible:false
                            
                        },
                        // vertLine: {
                        //     visible: true,
                        //     style: 0,
                        //     width: 1,
                        //     color: 'rgb(0 118 55)'
                        // }
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
               
                const baselineSeries = chart.addAreaSeries({
                    priceLineVisible: false,
                    lineWidth:2,
                    
                    priceFormat:{
                        type: 'price',
                    },
                   
                        topColor: 'rgba(14, 163, 83, 1)',
                        bottomColor: 'rgba(14, 163, 83, 0.2)',
                        lineColor: 'rgba(33, 179, 101, 0)',
                    // color: 'rgba( 88,80,249, 1)', 
                    // lineColor: '#2196F3', topColor: '#2196f3cf', bottomColor: '#2196f31c'
                    
                    // topLineColor: 'rgba( 88,80,249, 1)'
                    // , topFillColor1: 'rgba( 88,80,249, 1)',
                    // bottomLineColor: 'green',
                    // bottomFillColor1: 'red', bottomFillColor2: 'rgba( 239, 83, 80, 0.68)'
                });

                baselineSeries.setData(line_graph_values)
                chart.timeScale().fitContent()
                
                chart.priceScale("left").applyOptions({
                    borderColor: '#eff2f5'
                })
                chart.timeScale().applyOptions({
                    borderColor: '#eff2f5',
                })
                //parseFloat(base_price)
                const avgPriceLine = {
                    price: line_graph_base_price,
                    color: 'green',
                    // lineWidth: 2,
                    // lineStyle: 1, // LineStyle.Dotted
                    axisLabelVisible: true,
                    // title: 'ave price',
                }
        
                baselineSeries.createPriceLine(avgPriceLine);
    
                // const volumeSeries = chart.addHistogramSeries({
                //     color: '#cfd6e3',
                //     priceFormat: {
                //         type: 'volume',
                //     },
                //     priceScaleId: '', // set as an overlay by setting a blank priceScaleId
                //     // set the positioning of the volume series
                //     scaleMargins: {
                //         top: 0.9, // highest point of the series will be 70% away from the top
                //         bottom: 0,
                //     },
                //     height: 100
                // });
                // volumeSeries.priceScale().applyOptions({
                //     scaleMargins: {
                //         top: 0.9, // highest point of the series will be 70% away from the top
                //         bottom: 0,
                //     },
                // });
    
                // volumeSeries.setData(volume_array)
                
        
                // window.addEventListener('resize', () => {
                //     chart.resize(window.innerWidth, window.innerHeight);
                // });
        
        
                //console.log("chartContainerRef", chart)
                const toolTipWidth = 80;
                const toolTipHeight = 80;
                const toolTipMargin = 0;
        
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
                    
                        const price = data.value !== undefined ? data.value : 0;
                        

                        const graph_final_price = price;
                        

                        var old_date = new Date(dateStr*1000)
                       // console.log("old_date" , old_date);
                        // const data2 = param.seriesData.get(volumeSeries)
                        // const volume_24h = data2.value !== undefined ? data2.value : data2.close
                        
                        // color:#2196F3
                        toolTip.innerHTML =`
                        <div style="width: 220px; border:1px solid #E6EBEF;padding: 8px; border-radius: 5px;font-family: 'Space Grotesk';">
                           
                            <h4 style="font-size: 13px;font-family: 'Space Grotesk'; color:green ">
                                ${moment.utc(old_date).format('DD MMM YYYY')}
                                <span style="float:right;font-family: 'Space Grotesk';">${moment.utc(old_date).format('hh:mm a')}</span>
                            </h4>
                            <div style="font-weight:500; font-size: 14px;font-family: 'Space Grotesk';color: ${'black'}; margin-top: 5px;">
                                Net worth: <span style="font-weight:600; font-size: 16px;font-family: 'Space Grotesk';">$ ${price.toFixed(6)}</span>
                            </div>
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
        catch(err)
        {
            set_graph_status(false)
        }
        
    }

    // function toTimeZone(time) {
    //     var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    //     return moment(time).format(format);
    // }

    return (
        <>
            <div ref={chartContainerRef}>
            </div>
            {
                !graph_status ?
                <div className='text-center'> No chart data available</div>
                :
                "" 
            }
        </>
    );

}