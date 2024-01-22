import { tradeHistoryForSTV } from '../../../token_details/liquidity/queries'



const configurationData = {
    supported_resolutions: ['1', '3','5', '10','15', '30', '60','24H', '7D', '30D']
}

export const Datafeed = (props) =>
{    
    const { symbol, network_row_id, contract_address } = props
    var per_page_count = 1000
    var page_offset = 0
    var data_add_status = true
    var graphql_data_status = true
    var data_end_status = false
    
    var resolution_value = 30
    var pair_token_symbol = "USD"
    var trading_history = []

    //liquidity_address network_row_id, liquidity_address
    const getGraphQLData = async ({offset}) =>
    {   
        var graphql_array = []
        const response = await tradeHistoryForSTV({network_type:network_row_id, contract_address, limit:per_page_count, offset:offset})
        //const response = await tradeHistoryForTV({network_type:network_row_id, liquidity_address:contract_address})
        //console.log("res_output", response)
        if(response.status)
        {
            if(response.message[0])
            {
                for(let run of response.message)
                {   
                    var token_price = ((run.sellCurrency.address).toLowerCase() == contract_address.toLowerCase()) ? (run.buyAmountUSD / run.sellAmount):(run.sellAmountUSD / run.buyAmount)
                    var token_amount = ((run.sellCurrency.address).toLowerCase() == contract_address.toLowerCase()) ? run.sellAmount:run.buyAmount
                    await graphql_array.push({
                        token_price : token_price,
                        token_amount : token_amount,
                        date_n_time : run.block.timestamp.time
                    })
                }
                //await trading_history.push(graphql_array)
                return await { status:true, message:graphql_array }
            }
            else
            {
                return {status:false, message:{alert_message:"Sorry, contract address not found."}}
            }
        }
        else
        {   
            return {status:false, message:{alert_message:"Sorry, contract address not found."}}
        }
        
    }

    return {
        onReady: (callback) => 
        {
           // console.log('[onReady]: Method called!!');
            setTimeout(() => callback(configurationData))
        },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => 
        {
            //console.log("symbolName", symbolName)
            try {
                const symbolInfo = {
                    ticker : symbol,
                    name :  symbol+"/"+pair_token_symbol+" - Markets Coinpedia",
                    interval: '15',
                    session: '24x7',
                    // timezone: 'Asia/Kolkata',
                    minmov: 1,
                    pricescale: 100000,
                    has_intraday: true,
                    // intraday_multipliers: ['1', '5', '15', '30', '60'],
                    has_empty_bars: true,
                    secondary_series_extend_time_scale: true,
                    // clear_price_scale_on_error_or_empty_bars: true,
                    has_weekly_and_monthly: false,
                    supported_resolutions: configurationData.supported_resolutions, 
                    volume_precision: 1,
                    data_status: 'streaming',
                }
                onSymbolResolvedCallback(symbolInfo);
            } catch (err) {
                onResolveErrorCallback(err.message);
            }
        },
        getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) =>
        {   
            // console.log("resolution", resolution)
            if(resolution != '1D')
            {   
                
                if(resolution != resolution_value)
                {   
                    resolution_value = resolution
                    data_add_status = true
                }

                if(graphql_data_status)
                {   
                    const response = await getGraphQLData({offset:trading_history.length})
                    if(response.status)
                    {
                        trading_history = response.message
                    }
                    graphql_data_status = false
                }
                if(!data_end_status)
                {
                    if(resolution > 1)
                    {   
                        const response = await getGraphQLData({offset:trading_history.length})

                        // var cal_trading_history = trading_history
                        // const last_trade_object = cal_trading_history.pop()
                       
                        if(response.status)
                        {   
                            if(!response.message.length)
                            {
                                data_end_status = true
                            }
                            // console.log("my_store_response 1", trading_history)
                            trading_history = await (response.message).concat(trading_history)
                            data_add_status = true
                            // console.log("my_store_response 2", my_store_response.message)
                            // console.log("my_store_response 3", trading_history)
                        }
                    }
                }
                

                if(data_add_status)
                {   
                    data_add_status = false
                    if(trading_history.length)
                    {   
                        const bars = new Array(periodParams.countBack)
                        var data_count = trading_history.length
                        var required_count = data_count > bars.length ? data_count:bars.length
                        if(data_count < required_count)
                        {   
                            const cal_count = required_count-data_count
                            for(let i=0; i < cal_count; i++) 
                            {
                                bars[i] = await {
                                    time:(new Date(new Date(trading_history[0].date_n_time).toISOString())).getTime(),
                                    isLastBar: false,
                                    isBarClosed: true
                                }
                            }  
                            
                            var m = cal_count
                            for(let run of trading_history)
                            {   
                                bars[m] = await {
                                        open: run.token_price,
                                        high: run.token_price,
                                        low: run.token_price,
                                        close: run.token_price,
                                        volume: run.token_price*run.token_amount,
                                        time: (new Date(new Date(run.date_n_time).toISOString())).getTime(),
                                        isLastBar: false,
                                        isBarClosed: true
                                    }
                                    m++
                            }
                        }
                        else
                        {
                            var m = 0
                            for(let run of trading_history)
                            {   
                                bars[m] = await {
                                        open: run.token_price,
                                        high: run.token_price,
                                        low: run.token_price,
                                        close: run.token_price,
                                        volume: run.token_price*run.token_amount,
                                        time: (new Date(new Date(run.date_n_time).toISOString())).getTime(),
                                        isLastBar: false,
                                        isBarClosed: true
                                    }
                                    m++
                            }
                        }
                        
                        // await bars.sort(function (a, b) {
                        //     return new Date(b.time) - new Date(a.time)
                        // });

                        // console.log("bars", bars)
                        await onHistoryCallback(bars)
                    }
                    else
                    {
                        await onHistoryCallback([], { noData: true})
                    }
                
                // console.log("onHistoryCallback", onHistoryCallback)
                
                // let contract_details = await contracts_array.filter((item, index) =>  
                // network_row_id == item.network_row_id)
                // if(contract_details[0])
                // {

                // }

                // const res_output = await getGraphQLData()
                // console.log("res_output", res_output)

                
                    // console.log("bars", bars.length)
                    // console.log("message", response.data.message)
                    // console.log("periodParams", periodParams)

                    
                    // console.log("bars2", bars)
                    //const { final_array, volume_array} = await arrangeData(response.data.message)
                }
                else
                {
                    await onHistoryCallback([], { noData: true})
                }
            }
            else
            {
                await onHistoryCallback([], { noData: true})
            }
            


            // We are constructing an array for a given size = countBack + 1
        //     const bars = new Array(periodParams.countBack + 1);
            
        //     console.log("bars", bars)
        //     // For constructing the bars we are starting from the `to` and working out backwards until we reach `countBack`.
        //     let time = new Date(periodParams.to * 1000);
        //     time.setUTCHours(0);
        //     time.setUTCMinutes(0);
        //     time.setUTCMilliseconds(0);

        //     // Fake price
        //     let price = 100;

        //     for (let i = periodParams.countBack; i > -1; i--) {
        //         bars[i] = {
        //             open: price,
        //             high: price,
        //             low: 75,
        //             close: price,
        //             time: time.getTime(),
        //         }

        //         // Working out a random value for changing the fake price
        //         const volatility = 0.1;
        //         const x = Math.random() - 0.5;
        //         const changePercent = 2 * volatility * x;
        //         const changeAmount = price * changePercent;
        //         price = price + changeAmount;

        //         time.setUTCDate(time.getUTCDate() - 1);
        //     }
             
            
            
        //     // // Once all the bars (usually countBack is around 300 bars) the array of candles is returned to the library
        //    onHistoryCallback(demo_data);

            // // For this piece of code only we are pretending to only return results for AAPL
            // if(symbolInfo.name === 'AAPL' && resolution === '1D') 
            // {
                
            // } else {
            //     // If no result, return an empty array and specify it to the library by changing the value of `noData` to true.
            //     onHistoryCallback([], {
            //         noData: true
            //     });
            // }
        },
        subscribeBars: (
            symbolInfo,
            resolution,
            onRealtimeCallback,
            subscribeUID,
            onResetCacheNeededCallback
          ) => 
          {
            console.log(
              "[subscribeBars]: Method call with subscribeUID:",
              subscribeUID
            );
          },
          unsubscribeBars: (subscriberUID) => {
            console.log(
              "[unsubscribeBars]: Method call with subscriberUID:",
              subscriberUID
            );
          },
    }

   
        
}