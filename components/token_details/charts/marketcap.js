import React , {useState, useEffect,useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'
import dynamic from 'next/dynamic';
import { createChart, ColorType } from 'lightweight-charts'
import { cmcArrageGraphData, cmc_graph_ranges} from '../custom_functions' 
import { roundNumericValue, separator } from '../../constants' 
import Price from './price'

export default function Tokenchart({reqData}) 
{
    // console.log("active_tab",reqData)
    const chartMarketCapRef =useRef("")
    const [graph_status, set_graph_status] = useState(true)
    const {symbol, time_name, intervals, count,chart_tab} = reqData
    // const [time_name, set_time_name] = useState("1D")
    // const [intervals, set_intervals] = useState("15m")
    // const [count, set_count] = useState("96")
    
    useEffect(() => 
    {
        MarketCap()
    }, [])

    
    const MarketCap = async () =>
    {   
        try
        {  
            const response = await Axios.get('/api/tokens_graph/'+symbol+'/?intervals='+intervals+"&count="+count)
            if(response.data.message)
            {
                const { market_cap_array, volume_array, base_price, low_value, high_value} = await cmcArrageGraphData(response.data.message)
                // console.log("low_value", low_value)
                // console.log("high_value", high_value)
                // console.log("response", response)
                if(chartMarketCapRef.current)
                {
                    const chart = createChart(chartMarketCapRef.current, {
                        layout: {
                            background: { type: ColorType.Solid, color: "white",  },
                            textColor: '#8f98aa'
                        },
                        width: chartMarketCapRef.current ? chartMarketCapRef.current.clientWidth:600,
                        height: 350,
                    
                    })
        
            
                    chart.applyOptions({
                        leftPriceScale: {
                            visible: true,
                        },
                        rightPriceScale: {
                            visible: false,
                        },
                        handleScroll:{
                            mouseWheel:false,
                            pressedMouseMove:false
                        },
                        handleScale:
                        {
                            mouseWheel:false
                        },
                        grid: {
                            vertLines: {
                                visible: false,
                            },
                            horzLines:{
                                color:'#eff2f5'
                            }
                        },
                        timeScale: {
                        timeVisible: true,
                        secondsVisible: false,
                        },
                    })
            
                    const baselineSeries = chart.addLineSeries({
                        priceLineVisible: false,
                        lineWidth:2.5,
                        priceFormat:{
                            type: 'volume',
                        },
                        color: 'rgba( 88,80,249, 1)', 
                        // bottomFillColor1: 'rgba( 97, 77, 201, 0.05)', 
                    });
                    baselineSeries.setData(market_cap_array)
                    chart.timeScale().fitContent();
            
                    chart.priceScale("left").applyOptions({
                        borderColor: '#eff2f5',
            
                    });
                    
            
                    chart.timeScale().applyOptions({
                        borderColor: '#eff2f5',
                    });
        
                
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
            
                    // console.log("chartContainerRef", chart)
                    const toolTipWidth = 80;
                    const toolTipHeight = 80;
                    const toolTipMargin = 15;
            
                    // Create and style the tooltip html element
                    const toolTip = document.createElement('div');
                    toolTip.style = ` position: absolute; display: none;  box-sizing: border-box; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
                    toolTip.style.background = `white`;
                    toolTip.style.color = 'black';
                    toolTip.style.borderColor = 'white';
                    chartMarketCapRef.current.appendChild(toolTip);
            
                    // update tooltip
                    chart.subscribeCrosshairMove(param => {
                        if (
                            param.point === undefined ||
                            !param.time ||
                            param.point.x < 0 ||
                            param.point.x > chartMarketCapRef.current.clientWidth ||
                            param.point.y < 0 ||
                            param.point.y > chartMarketCapRef.current.clientHeight
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
        
                            const data2 = param.seriesData.get(volumeSeries)
                            const volume_24h = data2.value !== undefined ? data2.value : data2.close
                            
        
                            toolTip.innerHTML =`
                            <div style="width: 220px; height: 100px;border:1px solid #E6EBEF;padding: 8px; border-radius: 5px;"><div style="font-size: 13px; color: "black"">
                            ${moment.unix(dateStr).format('DD MMM YYYY')}
                            <span style="float:right">${moment.unix(dateStr).format('hh:mm a')}</span>
                            
                            </div>
                            <div style="font-size: 13px;color: ${'black'}">
                                <div class="tooltip-dot dot-info"></div>
                        <strong>Market Cap</strong>: ${roundNumericValue(price)}</div>
                            <div style="font-size: 13px;color: ${'black'}"><strong>Vol 24h:</strong> $ ${separator(volume_24h.toFixed(0))}</div></div>`;
            
                            const y = param.point.y;
                            let left = param.point.x + toolTipMargin;
                            if (left > chartMarketCapRef.current.clientWidth - toolTipWidth) {
                                left = param.point.x - toolTipMargin - toolTipWidth;
                            }
            
                            let top = y + toolTipMargin;
                            if (top > chartMarketCapRef.current.clientHeight - toolTipHeight) {
                                top = y - toolTipHeight - toolTipMargin;
                            }
                            toolTip.style.left = left + 'px';
                            toolTip.style.top = top + 'px';
                        }
                    });
        
                    const handleResize=()=>
                    {
                        chart.applyOptions({
                            width:chartMarketCapRef.current?.clientWidth,
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
            set_graph_status(false)
        }
    }

    return (
        <>
        <div ref={chartMarketCapRef}>

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