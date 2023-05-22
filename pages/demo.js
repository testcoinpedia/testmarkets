import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import Chart from '../components/lightWeightChart'
import { graphQlURL, fromNToDate, cmcArrageGraphData,cmc_graph_ranges} from '../components/tokenDetailsFunctions' 



export default function Demo({data}) {

    const chartContainerRef = useRef()

    console.log("cmc_graph_ranges",cmc_graph_ranges)

    useEffect( () => {
        plotGraph()
       

    }, [])

    const plotGraph = async () =>
    {
        

        const {final_array,volume_array, base_price, low_value, high_value} = await cmcArrageGraphData(data.data.ETH[0].quotes)


        console.log("low_value", low_value)
        console.log("final_array", final_array)
        console.log("high_value", high_value)
        // const initialData = [
        //     {
        //         "time": 1683799440,
        //         "value": 1820.9087409897747,
        //         "_internal_originalTime": 1683799440
        //     },
        //     {
        //         "time": 1683799740,
        //         "value": 1820.8389634376051,
        //         "_internal_originalTime": 1683799740
        //     },
        //     {
        //         "time": 1683800040,
        //         "value": 1821.372533803982,
        //         "_internal_originalTime": 1683800040
        //     },
        //     {
        //         "time": 1683800340,
        //         "value": 1821.4971115131334,
        //         "_internal_originalTime": 1683800340
        //     },
        //     {
        //         "time": 1683800640,
        //         "value": 1822.306387552131,
        //         "_internal_originalTime": 1683800640
        //     },
        //     {
        //         "time": 1683800940,
        //         "value": 1822.5122819899095,
        //         "_internal_originalTime": 1683800940
        //     },
        //     {
        //         "time": 1683801240,
        //         "value": 1821.7232531232303,
        //         "_internal_originalTime": 1683801240
        //     },
        //     {
        //         "time": 1683801540,
        //         "value": 1823.7775303172766,
        //         "_internal_originalTime": 1683801540
        //     },
        //     {
        //         "time": 1683801840,
        //         "value": 1824.9184608645571,
        //         "_internal_originalTime": 1683801840
        //     },
        //     {
        //         "time": 1683802140,
        //         "value": 1826.2296227176255,
        //         "_internal_originalTime": 1683802140
        //     },
        //     {
        //         "time": 1683802440,
        //         "value": 1825.471658770417,
        //         "_internal_originalTime": 1683802440
        //     },
        //     {
        //         "time": 1683802740,
        //         "value": 1824.4202477834692,
        //         "_internal_originalTime": 1683802740
        //     }
        // ]

        // console.log("initialData",initialData)
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "white" },
            },
            width: chartContainerRef.current.clientWidth,
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
            timeScale: {
            timeVisible: true,
            secondsVisible: false,
            },
        })

        const baselineSeries = chart.addBaselineSeries({
            baseValue: { type: 'price', price: base_price },
            priceLineVisible: false,
            topLineColor: 'rgba( 38, 166, 154, 1)', topFillColor1: 'rgba( 38, 166, 154, 0.68)',
            topFillColor2: 'rgba( 38, 166, 154, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)',
            bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.68)'
        });
        baselineSeries.setData(final_array)
        chart.timeScale().fitContent();

        chart.priceScale("left").applyOptions({
            borderColor: '#ccc4c4 ',
            autoScale: false,

        });

        chart.timeScale().applyOptions({
            borderColor: '#ccc4c4',
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
//      priceLine.applyOptions({
//     price: 90.0,
//     color: 'red',
//     lineWidth: 3,
//     lineStyle: LightweightCharts.LineStyle.Dashed,
//     axisLabelVisible: false,
//     title: 'P/L 600',
// });

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
        });
        volumeSeries.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9, // highest point of the series will be 70% away from the top
                bottom: 0,
            },
        });

        volumeSeries.setData(volume_array)

        console.log("chartContainerRef", chart)
        const toolTipWidth = 80;
        const toolTipHeight = 80;
        const toolTipMargin = 15;

        // Create and style the tooltip html element
        const toolTip = document.createElement('div');
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
                const data2 = param.seriesData.get(volumeSeries);
                console.log("data",data2)
                const volume = data2.value !== undefined ? data2.value : data2.close;
                console.log("data",volume)
                
                const price = data.value !== undefined ? data.value : data.close;
                // const volume = data!== undefined ? data.value : data.close;
                toolTip.innerHTML = `<div style="color: ${'rgba( 38, 166, 154, 1)'}">ABC Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
            ${Math.round(100 * price) / 100}
            </div>
            <div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
            ${volume}
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

        const handleResize=()=>{
            chart.applyOptions({
                width:chartContainerRef.current.clientWidth,
                // height:400
            })
        }

        window.addEventListener('resize', handleResize)
        
        return () => {chart.remove();
            window.removeEventListener('resize', handleResize)
            }

    }

    return (
        <>
            <div ref={chartContainerRef}>

            </div>
            {/* <Chart  /> */}
        </>

    );

}


export async function getServerSideProps({query,req}) 
{
    const req_config = {
        "mode": 'no-cors',
        "method": 'get',
        "headers": {
            "Content-Type": "application/json"
        }
    }
    // cmc_graph_ranges
   const tokenQuery = await fetch("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/historical?CMC_PRO_API_KEY=e671363b-4b20-42d7-80fe-32fb2ee8a88b&symbol=eth&count=96&interval=15m", req_config)
   if(tokenQuery) 
   {    
     const tokenQueryRun = await tokenQuery.json()
     return { props: { data: tokenQueryRun, errorCode: false} }
   }
   else 
   {
    return { props: { errorCode: true, data:{} } }
   }
  // return { props: {userAgent:userAgent, config:config(user_token), user_token:user_token,category_id:category_id}}
}