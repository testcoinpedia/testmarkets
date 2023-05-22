import moment from 'moment'

const graphQlURL = "https://graphql.bitquery.io/"

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

const cmcArrageGraphData = async (data)=>
{
  var final_array  = []
  var volume_array  = []
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
  }
  const base_price = await ((low_value+high_value)/2).toFixed(0)

  return {final_array, volume_array, base_price, low_value, high_value}
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

module.exports = { graphQlURL, fromNToDate, cmcArrageGraphData, cmc_graph_ranges}