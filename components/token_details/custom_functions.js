import moment from 'moment'
const graphQlURL = "https://graphql.bitquery.io/"
import Axios from 'axios'
import { API_BASE_URL, config, roundNumericValue } from '../constants'
import { tradeHistory } from './liquidity/queries'

 const updateTradeDetails = async ({ token_row_id, network_type, contract_address }) =>
{ 
    const res_query = await tradeHistory({
        sort_type:4, 
        network_type:network_type, 
        liquidity_address:contract_address, 
        limit:1, 
        offset:0
    })

    console.log("res_query", res_query)

    if(res_query.status)
    {
      var first_trade_price = 0
      if(res_query.message[0])
      {
        if((res_query.message[0].sellCurrency.address).toLowerCase() == contract_address.toLowerCase())
        {
          first_trade_price = res_query.message[0].buyAmountUSD / res_query.message[0].sellAmount
        }
        else
        {
          first_trade_price = res_query.message[0].sellAmountUSD / res_query.message[0].buyAmount
        }
      }

      const req_obj = {
        token_row_id:token_row_id,
        first_trade_on : res_query.message[0]?.block.timestamp.time,
        first_trade_price : first_trade_price
      }

      const response = await Axios.post(API_BASE_URL + "markets/tokens/update_first_trade_details", req_obj, config(""))
      console.log("response", response)
    }
}


const cmc_graph_ranges = [
  {
    time_name : "1D",
    intervals: "10m",
    count:"144"
  },
  {
    time_name : "1W",
    intervals: "1h",
    count:"168"
  },
  {
    time_name : "1M",
    intervals: "4h",
    count:"180"
  },
  {
    time_name : "3M",
    intervals: "1d",
    count:"90"
  },
  {
    time_name : "6M",
    intervals: "1d",
    count:"180"
  },
  {
    time_name : "1Y",
    intervals: "2d",
    count:"183"
  },
  {
    time_name : "All",
    intervals: "3d",
    count:"243"
  }  
]


const bitgquery_graph_ranges = [
  {
    _id : 1,
    range_name: "1D"
  },
  {
    _id : 2,
    range_name: "1W"
  },
  {
    _id : 3,
    range_name: "1M"
  },
  {
    _id : 4,
    range_name: "3M"
  },
  {
    _id : 5,
    range_name: "6M"
  },
  {
    _id : 6,
    range_name: "1Y"
  } 
]

const cmcArrageGraphData = async (data)=>
{
  var final_array  = []
  var volume_array  = []
  var market_cap_array  = []
  
  var low_value = data[0].quote.USD.price
  var high_value = 0
  for(let run of data)
  { 
      var create_obj = {}
      create_obj['time'] = await  Math.floor((new Date(run.timestamp)).getTime()/1000)
      create_obj['value'] = run.quote.USD.price

      var create_obj2 = {}
      create_obj2['time'] = await  Math.floor((new Date(run.timestamp)).getTime()/1000)
      create_obj2['value'] = run.quote.USD.volume_24h

      var create_obj3 = {}
      create_obj3['time'] = await  Math.floor((new Date(run.timestamp)).getTime()/1000)
      create_obj3['value'] = run.quote.USD.market_cap

      if(run.quote.USD.price > high_value)
      {
        high_value = run.quote.USD.price
      }

      if(run.quote.USD.price < low_value)
      {
        low_value = run.quote.USD.price
      }

      await final_array.push(create_obj)
      await volume_array.push(create_obj2)
      await market_cap_array.push(create_obj3)
  }
  const base_price = await ((low_value+high_value)/2).toFixed(0)
  

  

  return {final_array, volume_array,market_cap_array, base_price, low_value, high_value}
}



const arrangeData = async (pass_data) =>
{
    var final_array  = []
    var volume_array  = []

    for(let run of pass_data)
    { 
        var create_obj = {}
        create_obj['time'] = await  Math.floor((new Date(run.date_n_time)).getTime()/1000)
        create_obj['value'] = run.token_price
        create_obj['_internal_originalTime'] = await  Math.floor((new Date(run.date_n_time)).getTime()/1000)
        

        var create_obj2 = {}
        create_obj2['time'] = await  Math.floor((new Date(run.date_n_time)).getTime()/1000)
        create_obj2['value'] = run.token_amount

        await final_array.push(create_obj)
        await volume_array.push(create_obj2)
    }

    return {final_array, volume_array }
}


const fromNToDate = (datetime,customstartdate,customenddate)=>
{
    var from_date = new Date();
    from_date = from_date.setDate(from_date.getDate() - 1);
    from_date = Date.parse((new Date(from_date)).toString()) / 1000;
    var to_date = Date.parse((new Date()).toString()) / 1000;

    if (datetime === 1) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1);
      from_date = Date.parse((new Date(from_date)).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 2) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 7);
      from_date = Date.parse(new Date(from_date).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 3) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 31);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 4) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 365);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 5) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 730);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if(datetime === 6){
     // setCustomDate(!customDate)
      from_date = Date.parse(customstartdate)
      to_date = Date.parse(customenddate)

      from_date = from_date / 1000
      to_date = to_date / 1000
    }
    else if (datetime === 7) {
      // 6 months
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 182);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 8) {
      // 3 year
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1095);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 
    else if (datetime === 9) {
      // 5 year
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1825);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    } 

    const dateSince = new Date(from_date * 1000);
    const fromDate = dateSince.toISOString();
    const dateTill = new Date(to_date * 1000);
    const toDate = dateTill.toISOString();
    return {fromDate:fromDate, toDate:toDate}
}

module.exports = { graphQlURL, fromNToDate, cmcArrageGraphData, cmc_graph_ranges, bitgquery_graph_ranges, arrangeData, updateTradeDetails}