import Axios from 'axios' 
import { arrangeData } from '../token_details/custom_functions' 
import moment from 'moment'

const configurationData = {
    supported_resolutions: ['1', '3','5', '10','15', '30', '60','1D', '1W', '1M']
}; 
export const Datafeed = (props) =>
{
    console.log("props", props)
    return {
        onReady: (callback) => 
        {
            console.log('[onReady]: Method called!!');
            setTimeout(() => callback(configurationData))
        },
        resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback, extension) => 
        {
            console.log("symbolName", symbolName)
            try {
                const symbolInfo = {
                    ticker: props.symbol,
                    name:  props.symbol,
                    interval: '15',
                    session: '24x7',
                    // timezone: 'Asia/Kolkata',
                    minmov: 1,
                    pricescale: 100000,
                    has_intraday: true,
                    // intraday_multipliers: ['1', '5', '15', '30', '60'],
                    has_empty_bars: true,
                    has_weekly_and_monthly: false,
                    supported_resolutions: configurationData.supported_resolutions, 
                    volume_precision: 1,
                    data_status: 'streaming',
                }
                
                //const symbolInfo = await getSymbolInfoFromBackend(symbolName, extension);
                console.log("symbolInfo", symbolInfo)
                onSymbolResolvedCallback(symbolInfo);
            } catch (err) {
                onResolveErrorCallback(err.message);
            }
        },
        getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback, onErrorCallback) =>
        {   
            if(resolution != '1D')
            {
                console.log("resolution", resolution)
                const response = await Axios.get('http://localhost:3010/?duration='+resolution)
                if(response.data.status)
                {   
                    const bars = new Array(periodParams.countBack)
                    const data_response = response.data.message
                    var data_count = data_response.length
                    var required_count = data_count > bars.length ? data_count:bars.length
                    if(data_count < required_count)
                    {   
                        const cal_count = required_count-data_count
                        for(let i=0; i < cal_count; i++) 
                        {
                            bars[i] = await {
                                time: (new Date(new Date(data_response[0].date_n_time).toISOString())).getTime(),
                                isLastBar: false,
                                isBarClosed: true
                            }
                        }  
                        
                        
                        var m = cal_count
                        for(let run of data_response)
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
                        for(let run of data_response)
                        {   
                            bars[m] = await {
                                    open: run.token_price,
                                    high: run.token_price,
                                    low: run.token_price,
                                    close: run.token_price,
                                    volume: run.token_price*run.token_amount,
                                    time:  (new Date(new Date(run.date_n_time).toISOString())).getTime(),
                                    isLastBar: false,
                                    isBarClosed: true
                                }
                                m++
                        }
                    }
                    console.log("bars", bars)
                    await onHistoryCallback(bars)
                    // console.log("bars", bars.length)
                    // console.log("message", response.data.message)
                    // console.log("periodParams", periodParams)

                    
                // console.log("bars2", bars)
                    //const { final_array, volume_array} = await arrangeData(response.data.message)
                }
                else
                {
                    await onHistoryCallback([],{ noData: true})
                }
            }
            else
            {
                await onHistoryCallback([],{ noData: true})
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
        }
    }
}