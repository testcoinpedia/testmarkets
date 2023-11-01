import React , {useState, useEffect,useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'
import dynamic from 'next/dynamic';
import { createChart, ColorType } from 'lightweight-charts'
import { cmcArrageGraphData, cmc_graph_ranges} from '../../token_details/custom_functions' 
import { graphql_headers, separator, graphqlApiURL } from '../../constants' 


export default function Tokenchart({reqData}) 
{
    console.log("active_tab",reqData)
    const chartContainerRef = useRef("")
    const chartMarketCapRef = useRef("")
    const [graph_status, set_graph_status] = useState(true)
    const [date_type] = useState(reqData.graph_date_type ? reqData.graph_date_type:1)
    const { address, contract_type } = reqData
    const  base_price = 0.7
    // const [time_name, set_time_name] = useState("1D")
    // const [intervals, set_intervals] = useState("15m")
    // const [count, set_count] = useState("96")
    
    useEffect(() => 
    {
        plotGraph()
    }, [date_type])


    const graphDateType = (pass_type) =>
    {
        let from_date = ""
        let to_date = ""
        from_date = new Date()
        from_date = from_date.setDate(from_date.getDate() - 1)
        from_date = Date.parse((new Date(from_date)).toString()) / 1000
        to_date = Date.parse((new Date()).toString()) / 1000
        
        if(pass_type === 2) 
        {
            from_date = new Date()
            from_date = from_date.setDate(from_date.getDate() - 7)
            from_date = Date.parse(new Date(from_date).toString()) / 1000
            to_date = Date.parse((new Date()).toString()) / 1000
        }
        else if(pass_type === 3) 
        {
            from_date = new Date()
            from_date = from_date.setDate(from_date.getDate() - 31)
            from_date = Date.parse((new Date(from_date).toString())) / 1000
            to_date = Date.parse((new Date()).toString()) / 1000
        }
        else if(pass_type === 4) 
        {
            from_date = new Date()
            from_date = from_date.setDate(from_date.getDate() - 91)
            from_date = Date.parse((new Date(from_date).toString())) / 1000
            to_date = Date.parse((new Date()).toString()) / 1000;
        }
        else if(pass_type === 5) 
        {
            from_date = new Date()
            from_date = from_date.setDate(from_date.getDate() - 181)
            from_date = Date.parse((new Date(from_date).toString())) / 1000
            to_date = Date.parse((new Date()).toString()) / 1000
        }
        else if(pass_type === 6) 
        {
            from_date = new Date()
            from_date = from_date.setDate(from_date.getDate() - 365)
            from_date = Date.parse((new Date(from_date).toString())) / 1000
            to_date = Date.parse((new Date()).toString()) / 1000;
        }
        else if(pass_type === 7) 
        {
            from_date = new Date()
            from_date = from_date.setDate(from_date.getDate() - 730)
            from_date = Date.parse((new Date(from_date).toString())) / 1000
            to_date = Date.parse((new Date()).toString()) / 1000
        }

        const dateSince = new Date(from_date * 1000);
        const fromDate = dateSince.toISOString();
        const dateTill = new Date(to_date * 1000);
        const toDate = dateTill.toISOString();

        return { from_date:fromDate, to_date:toDate }
    }

    const setGraphData = async (pass_data, contract_type) =>
    {
        var result = []
        var low_value = 0
        if(pass_data[0])
        {
            if(contract_type == 1) 
            {
                low_value = pass_data[0].tradeAmountInUsd / pass_data[0].buyAmount;
            } 
            else 
            {
                low_value = pass_data[0].quote
            }
        }
        var high_value = 0

        for(let i of pass_data)
        { 
            var rate = 0
            if(contract_type == 1) 
            {
                rate = i.tradeAmountInUsd / i.buyAmount;
            } 
            else 
            {
                rate = i.quote
            }


            if(rate > high_value)
            {
                high_value = rate
            }

            if(rate < low_value)
            {
                low_value = rate
            }

            var create_obj = {}
            //var date = new Date(i.timeInterval.hour)
            
            create_obj['time'] = await  Math.floor((new Date(i.timeInterval.hour)).getTime()/1000)
            create_obj['value'] = rate

            await result.push(create_obj)

        }
        
        console.log("low_value", low_value)
        console.log("high_value", high_value)

        const base_price = await ((low_value+high_value)/2).toFixed(2)

        return {result, base_price}
    }


    const getGraphData = async () => 
    {
        const {from_date, to_date} = await graphDateType(date_type)

        var quoteCurrency = ''
        var network_id = ''
        if(contract_type == 1)
        {
            network_id = 'ethereum'
            quoteCurrency = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
            if(address.toLowerCase() == '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2')
            {
                quoteCurrency = '0xdac17f958d2ee523a2206206994597c13d831ec7'
            }
        }
        else
        {
            network_id = 'bsc'
            quoteCurrency = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
            if(address.toLowerCase() == '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
            {
                quoteCurrency = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
            }
        }
        
        let query = `
            query
            {
                ethereum(network: `+network_id+`) {
                    dexTrades(
                    exchangeName : {is: ""}
                    date: {after: "` + from_date + `" , till: "` + to_date + `"}
                    any: [{baseCurrency: {is: "`+ address + `"}, quoteCurrency: {is: "`+ quoteCurrency + `"}}]
                    options: {asc: "timeInterval.hour"}
                    ) {
                    timeInterval {
                        hour(count: 3)
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
        `

        const opts = {
            method: "POST",
            headers : graphql_headers,
            body: JSON.stringify({query})
        }

        var res_array = {}
        res_array['result'] = []
        res_array['base_price'] = 0

        const res = await fetch(graphqlApiURL, opts)
        const result = await res.json()
        if(result)
        {
            console.log("result.data.ethereum", result.data.ethereum)
            if(result.data.ethereum != null && result.data.ethereum.dexTrades != null) 
            {
                const res_graph_array = await setGraphData(result.data.ethereum.dexTrades, contract_type)
                var res_array = {}
                res_array['result'] = await res_graph_array.result
                res_array['base_price'] = await res_graph_array.base_price

                console.log("res_array", res_array)
            }
        }
        return res_array
    }





    const plotGraph = async () =>
    {   
         try
        {  
        if(address && contract_type)
        {
            const graph_response = await getGraphData()
            if(graph_response.result.length)
            {
                const final_array = graph_response.result
                const base_price = graph_response.base_price
                console.log("final_array", final_array)
                console.log("base_price", base_price)
                // console.log("high_value", high_value)
                // console.log("response", response)
                if(chartContainerRef.current)
                {
                    const chart = createChart(chartContainerRef.current, {
                        layout: {
                            background: { type: ColorType.Solid, color: "white",  },
                            textColor: '#8f98aa'
                        },
                        autoSize: true,
                        width: chartContainerRef.current ? chartContainerRef.current.clientWidth:600,
                        height: 350,
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
                    })
                    baselineSeries.setData(final_array)
                    chart.timeScale().fitContent();
            
                    chart.priceScale("left").applyOptions({
                        borderColor: '#eff2f5',
            
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
            
                    baselineSeries.createPriceLine(avgPriceLine)
        
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
                    chartContainerRef.current.appendChild(toolTip)
            
                    // update tooltip
                    chart.subscribeCrosshairMove(param => 
                    {
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
        
                            
                            
        
                            toolTip.innerHTML =`
                            <div style="width: 220px; border:1px solid #E6EBEF;padding: 8px; border-radius: 5px;font-family: 'Space Grotesk';">
                                <h4 style="font-size: 13px;font-family: 'Space Grotesk'; color: ${price>base_price ? "green":"red" }">
                                    ${moment.unix(dateStr).format('DD MMM YYYY')}
                                    <span style="float:right;font-family: 'Space Grotesk';">${moment.unix(dateStr).format('hh:mm a')}</span>
                                </h4>
                                <h5 style="font-size: 15px;font-family: 'Space Grotesk';color: ${'black'}; margin-top: 10px;">
                                    ${
                                        price>base_price?
                                        '<div class="tooltip-dot dot-success" style="position: relative; top: 0; width: 10px; height: 10px;"></div>'
                                        :
                                        '<div class="tooltip-dot dot-danger" style="position: relative; top: 0; width: 10px; height: 10px;"></div>'
                                    }  
                                    <strong style="font-family: 'Space Grotesk';">Price:</strong>
                                    $ ${price.toFixed(6)}
                                </h5>
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
            else
            {
                set_graph_status(false)
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
        {
            !graph_status ?
            <div className='text-center'> No chart data available</div>
            :
            <div ref={chartContainerRef}></div>
        }
        </>
    );

}