import React , {useState, useEffect,useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'
import dynamic from 'next/dynamic';
import { createChart, ColorType } from 'lightweight-charts'
import { cmcArrageGraphData, cmc_graph_ranges} from '../../components/tokenDetailsFunctions' 
import { roundNumericValue, separator } from '../../components/constants' 
import MarketCapChart from './marketcap_chart'

export default function Tokenchart({reqData}) 
{
    console.log("active_tab",reqData)
    const chartContainerRef =useRef(null)
    const chartMarketCapRef =useRef(null)
    const {symbol, time_name, intervals, count,chart_tab} = reqData
    // const [time_name, set_time_name] = useState("1D")
    // const [intervals, set_intervals] = useState("15m")
    // const [count, set_count] = useState("96")
    
    useEffect(() => 
    {
            plotGraph()
        // MarketCap()
    }, [])

    const plotGraph = async () =>
    {   
        // set_time_name(pass_time_name)
        // set_intervals(pass_interval)
        // set_count(pass_interval)
        // if(chartContainerRef.current)
        // {
        //     chartContainerRef.current.reset();
        // }
       
        const response = await Axios.get('/api/tokens_graph/'+symbol+'/?intervals='+intervals+"&count="+count)
        if(response.data.message)
        {
            const { final_array, volume_array, base_price, low_value, high_value} = await cmcArrageGraphData(response.data.message)
            console.log("low_value", low_value)
            console.log("high_value", high_value)
            console.log("response", response)
            
            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: { type: ColorType.Solid, color: "white",  },
                    textColor: '#8f98aa'
                },
                width: chartContainerRef.current ? chartContainerRef.current.clientWidth:600,
                height: 400,
              
            })

    
            chart.applyOptions({
                leftPriceScale: {
                    visible: true,
                },
                rightPriceScale: {
                    visible: false,
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
                borderColor: '#eff2f5',
    
            });
            
    
            chart.timeScale().applyOptions({
                borderColor: '#eff2f5',
            });

            const avgPriceLine = {
                price: parseFloat(base_price),
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
    
    
            console.log("chartContainerRef", chart)
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
                    console.log("param", param)
                    const dateStr = param.time;
                    toolTip.style.display = 'block';
                    const data = param.seriesData.get(baselineSeries);
                    const price = data.value !== undefined ? data.value : data.close;

                    const data2 = param.seriesData.get(volumeSeries)
                    const volume_24h = data2.value !== undefined ? data2.value : data2.close
                    

                    toolTip.innerHTML =`
                    <div style="width: 220px; height: 100px;border:1px solid #E6EBEF;padding: 8px; border-radius: 5px;"><div style="font-size: 13px; color: ${price>base_price ? "green":"red" }">
                    ${moment.unix(dateStr).format('DD MMM YYYY')}
                    <span style="float:right">${moment.unix(dateStr).format('hh:mm a')}</span>
                    
                    </div>
                    <div style="font-size: 15px;color: ${'black'}">
                    ${
                        price>base_price?
                        '<div class="tooltip-dot dot-success"></div>'
                        :
                        '<div class="tooltip-dot dot-danger"></div>'
                    }  <strong>Price:</strong> ${roundNumericValue(price)}</div>
                    <div style="font-size: 13px;color: ${'black'}"><strong>Vol 24h:</strong> $ ${separator(volume_24h.toFixed(0))}</div></div>`;
    
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

  

    return (
        <>
        {/* {chart_tab==1? */}
        <div ref={chartContainerRef}>

        </div>
      {/* :
      <MarketCapChart reqData={reqData}/>
        } */}
        </>
    );

}