import React , {useState, useEffect} from 'react'  
import Link from 'next/link' 
import Axios from 'axios'
import JsCookie from 'js-cookie' 
import cookie from 'cookie'

import { useRouter } from 'next/router'
import moment from 'moment'
import dynamic from 'next/dynamic' 

import { app_coinpedia_url, graphqlApiURL, portfolio_graphql_api_key, separator, market_coinpedia_url} from '../../components/constants' 




export const protocol_types = [
  { 
    _id:1,
    type_name:"ERC-20",
    network_id:"eth",
    protocolType:"token_20",
    network_name:"Ethereum",
    network_image:"eth.svg",
    network_url: "https://etherscan.io/tx/"
  },
  {
    _id:2,
    type_name:"ERC-721",
    network_id:"eth",
    protocolType:"token_721",
    network_name:"Ethereum",
    network_image:"eth.svg",
    network_url: "https://etherscan.io/tx/"
  },
  {
    _id:3,
    type_name:"ERC-1155",
    network_id:"eth",
    protocolType:"token_1155",
    network_name:"Ethereum",
    network_image:"eth.svg",
    network_url: "https://etherscan.io/tx/"
  },
  {
    _id:4,
    type_name:"BEP-20",
    network_id:"bsc",
    protocolType:"token_20",
    network_name:"BSC",
    network_image:"bsc.svg",
    network_url: "https://bscscan.com/tx/"
  }
]

export const crypto_networks_list = [
  {
    _id:1,
    network_id:1,
    network_name:"Ethereum",
    network_image:"eth.svg",
    active_status:1
  },
  {
    _id:2,
    network_id:56,
    network_name:"BSC",
    network_image:"bsc.svg",
    active_status:1
  },
  {
    _id:3,
    network_id:137,
    network_name:"Polygon",
    network_image:"polygon.svg",
    active_status:1
  },
  {
    _id:4,
    network_id:250,
    network_name:"Fantom",
    network_image:"ftm.svg",
    active_status:1
  },
  {
    _id:6,
    network_id:43114,
    network_name:"Avalanche",
    network_image:"avax.svg",
    active_status:1
  },
  {
    _id:7,
    network_id:8217,
    network_name:"Klaytn",
    network_image:"arbitrum.svg",
    active_status:1
  }
  // {
  //   _id:5,
  //   network_name:"Optimism",
  //   network_image:"",
  //   active_status:1
  // },
  
  // {
  //   _id:7,
  //   network_name:"Arbitrum",
  //   network_image:"",
  //   active_status:1
  // }
]

export const cryptoNetworksList = ({ethereum, bsc, polygon, fantom, avalanche}) =>
{
  return [
    {
      _id:1,
      network_id:1,
      network_name:"Ethereum",
      network_image:"eth.svg",
      network_balance:ethereum,
      active_status:1
    },
    {
      _id:2,
      network_id:56,
      network_name:"BSC",
      network_image:"bsc.svg",
      network_balance:bsc,
      active_status:1
    },
    {
      _id:3,
      network_id:137,
      network_name:"Polygon",
      network_image:"polygon.svg",
      network_balance:polygon,
      active_status:1
    },
    {
      _id:4,
      network_id:250,
      network_name:"Fantom",
      network_image:"ftm.svg",
      network_balance:fantom,
      active_status:1
    },
    {
      _id:6,
      network_id:43114,
      network_name:"Avalanche",
      network_image:"avax.svg",
      network_balance:avalanche,
      active_status:1
    },
    // {
    //   _id:5,
    //   network_name:"Klaytn",
    //   network_image:"arbitrum.svg",
    //   active_status:1
    // },
    // {
    //   _id:6,
    //   network_name:"Avalanche",
    //   network_image:"",
    //   active_status:1
    // },
    // {
    //   _id:7,
    //   network_name:"Arbitrum",
    //   network_image:"",
    //   active_status:1
    // }
  ]
}


export const getChartBasePrice = async ({chart_data, price, balance, backend_server_time}) =>
{
    var low_value = 0
    var high_value = 0
    const new_array = []
    // console.log("pass_data", pass_data)
    // console.log("pass_balance", pass_balance)
    var i = 0
    if(balance)
    { 
      if(chart_data.length)
      {
        for(let innerRun of chart_data)
        {   
          var sum = 0
          if((innerRun.price))
          {
            sum = await parseFloat(innerRun.price)*parseFloat(balance)
          }
          else if((price && balance))
          { 
            sum = await parseFloat(price)*parseFloat(balance)
          }

          if(i == 0)
          {
            low_value = await sum
          }
          else
          {
            if(sum < low_value)
            {
              low_value = await sum
            }
          }

          if(sum > high_value)
          {
            high_value = await sum
          }

          const current_country_time = await moment(innerRun.date_n_time).format("YYYY-MM-DDTHH:mm:ss")+".000Z"
          
          await new_array.push({
            value : sum,
            time : Math.floor((new Date(current_country_time)).getTime()/1000)
          })
          i++
        }
      }

      const server_country_time = await moment(backend_server_time).format("YYYY-MM-DDTHH:mm:ss")+".000Z"
      await new_array.push({
        value : parseFloat(price)*parseFloat(balance),
        time : Math.floor((new Date(server_country_time)).getTime()/1000)
      })
      
    }

    const base_price = await (parseFloat(((low_value+high_value)/2).toFixed(2)))
    return {base_price , data_list:new_array}
}



export const getValueShortForm=(labelValue)=> 
{
  return Math.abs(Number(labelValue)) >= 1.0e+9

  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+9*100)/100 + "B"

  : Math.abs(Number(labelValue)) >= 1.0e+6
  
  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+6*100)/100 + "M"

  : Math.abs(Number(labelValue)) >= 1.0e+3

  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+3*100)/100 + "K"

  : Math.abs(Number(labelValue)); 
} 




export const getZeroAppendValues=(pass_value)=>
{
  if(pass_value == 0)
  {
    return 1
  }
  else if(pass_value == 1)
  {
    return 10
  }
  else if(pass_value == 2)
  {
    return 100
  }
  else if(pass_value == 3)
  {
    return 1000
  }
  else if(pass_value == 4)
  {
    return 10000
  }
  else if(pass_value == 5)
  {
    return 100000
  }
  else if(pass_value == 6)
  {
    return 1000000
  }
  else if(pass_value == 7)
  {
    return 10000000
  }
  else if(pass_value == 8)
  {
    return 100000000
  }
  else if(pass_value == 9)
  {
    return 1000000000
  }
  else if(pass_value == 10)
  {
    return 10000000000
  }
  else if(pass_value == 11)
  {
    return 100000000000
  }
  else if(pass_value == 12)
  {
    return 1000000000000
  }
  else if(pass_value == 13)
  {
    return 10000000000000
  }
  else if(pass_value == 14)
  {
    return 100000000000000
  }
  else if(pass_value == 15)
  {
    return 1000000000000000
  }
  else if(pass_value == 16)
  {
    return 10000000000000000
  }
  else if(pass_value == 17)
  {
    return 100000000000000000
  }
  else if(pass_value == 18)
  {
    return 1000000000000000000
  }
  else if(pass_value == 19)
  {
    return 10000000000000000000
  }
  else if(pass_value == 20)
  {
    return 100000000000000000000
  }
  else
  {
    return 1000000000000000000000
  }
}



export const roundNumericValue=(value, pass_type=0) =>
{ 
  if(value)
  {
    if(value > 0)
    {
        if(parseFloat(value) >= 1000000)
        {
          if(pass_type)
          {
            return ((parseFloat(value)).toFixed(0))
          }
          else
          {
            return separator((parseFloat(value)).toFixed(0))
          }
          
        }
        else if(parseFloat(value) >= 20)
        {
          if(pass_type)
          {
            return ((parseFloat(value)).toFixed(2))
          }
          else
          {
            return separator((parseFloat(value)).toFixed(2))
          }
          
        }
        else if(parseFloat(value) >= 0.1)
        {
          if(pass_type)
          {
            return ((parseFloat(value)).toFixed(4))
          }
          else
          {
            return separator((parseFloat(value)).toFixed(4))
          }
          
        }
        else if((parseFloat(value) < 0.1) && (parseFloat(value) >= 0.01))
        {
          return (parseFloat(value)).toFixed(5)
        }
        else if((parseFloat(value) < 0.01) && (parseFloat(value) >= 0.001))
        {
          return (parseFloat(value)).toFixed(6)
        }
        else if((parseFloat(value) < 0.001) && (parseFloat(value) > 0.0001))
        {
          return (parseFloat(value)).toFixed(6)
        }
        else if((parseFloat(value) < 0.0001) && (parseFloat(value) > 0.00001))
        {
          return (parseFloat(value)).toFixed(8)
        }
        else if((parseFloat(value) < 0.00001) && (parseFloat(value) > 0.000001))
        {
          return (parseFloat(value)).toFixed(9)
        }
        else if((parseFloat(value) < 0.000001) && (parseFloat(value) > 0.0000001))
        {
          return (parseFloat(value)).toFixed(10)
        }
        else if((parseFloat(value) < 0.0000001) && (parseFloat(value) > 0.00000001))
        {
          return (parseFloat(value)).toFixed(11)
        }
        else if((parseFloat(value) < 0.00000001) && (parseFloat(value) > 0.000000001))
        {
          return (parseFloat(value)).toFixed(12)
        }
        else if((parseFloat(value) < 0.000000001) && (parseFloat(value) > 0.0000000001))
        {
          return (parseFloat(value)).toFixed(12)
        }
        else
        {
          return ((parseFloat(value)).toFixed(13))
        }
    }
    else
    { 
      if(parseFloat(value) <= -0.1)
      {
        return ((parseFloat(value)).toFixed(2))
      }
      else if((parseFloat(value) > -0.1) && (parseFloat(value) <= -0.01))
      {
        return (parseFloat(value)).toFixed(3)
      }
      else if((parseFloat(value) > -0.01) && (parseFloat(value) <= -0.001))
      {
        return (parseFloat(value)).toFixed(6)
      }
      else if((parseFloat(value) > -0.001) && (parseFloat(value) <= -0.0001))
      {
        return (parseFloat(value)).toFixed(6)
      }
      else if((parseFloat(value) > -0.0001) && (parseFloat(value) <= -0.00001))
      {
        return (parseFloat(value)).toFixed(6)
      }
      else if((parseFloat(value) > -0.00001) && (parseFloat(value) <= -0.000001))
      {
        return (parseFloat(value)).toFixed(7)
      }
      else if((parseFloat(value) > -0.000001) && (parseFloat(value) <= -0.0000001))
      {
        return (parseFloat(value)).toFixed(8)
      }
      else if((parseFloat(value) > -0.0000001) && (parseFloat(value) <= -0.00000001))
      {
        return (parseFloat(value)).toFixed(9)
      }
      else
      {
        return ((parseFloat(value)).toFixed(13))
      }
    }
  }
  else
  {
    return "0"
  }
}


export const getSevenDaysValues = async (sparkline_data, balance) =>
{ 
    var graph_values = []
    var loop_values = [0, 23, 47, 71, 95, 119, 143, 167]
    if(sparkline_data)
    { 
      if(sparkline_data.price)
      {
        if(sparkline_data.price.length)
        {
          for(let l of loop_values)
          { 
            if(sparkline_data.price[l])
            {
              await graph_values.push(sparkline_data.price[l]*balance)
            }
          }
        }
      }
    }

    return graph_values
}
 
//type 1:USD
export const USDFormatValue=(value, type)=>
{
  if(parseFloat(value))
  {
    if(type == 1)
    {
      if(value > 0.0999)
      {
        return (roundNumericValue(value, 1)).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      }
      else
      {
        
        return "$"+roundNumericValue(value, 1)
      }
      
    }
    else
    {
      return new Intl.NumberFormat().format(roundNumericValue(value, 1))
    }
  }
  else
  {
    return ""
  }
  
  
}



export const getShortAddress=(wallet_address, length)=>
  {
      var res1 = wallet_address.substr(0, length)
      var res2 = wallet_address.substr(wallet_address.length - length)
      return res1+'..'+res2
  }

  export const evmConfig = (query) => 
  {
    return {
        method: 'post',
        url: 'https://streaming.bitquery.io/graphql',
        headers: { 
          'Content-Type': 'application/json', 
          'X-API-KEY': portfolio_graphql_api_key
        },
        data : JSON.stringify({query})
    }
  }

 export const fetchAPIQuery = (query) => 
  {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": portfolio_graphql_api_key
      },
      body: JSON.stringify({
        query
      })
    }
  }
  
 export const makeJobSchema=()=>
  {  
    return { 
        "@context":"http://schema.org/",
        "@type":"Organization",
        "name":"Portfolio",
        "url":market_coinpedia_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
  }

    // const makeJobSchema=()=>
  // {  
  //   return { 
  //       "@context":"http://schema.org/",
  //       "@type":"Organization",
  //       "name":"Portfolio",
  //       "url":market_coinpedia_url,
  //       "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
  //       "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
  //     }  
  // }
 
 export const graphqlBasicTokenData = (wallet_address, network) => 
  {
    return `
      query{
        ethereum(network: `+network+`) {
          address(address: {is: "`+wallet_address+`"}) {
            balances {
              currency {
                address
                name
                symbol
              }
              value
            }
          }
        }
      }
        ` 
  }

  export const getNetworkByID = (id) =>
  {
    if(id == 1)
    {
      return {
        network:"ethereum"
      }
    }
    else if(id == 56)
    {
      return {
        network:"bsc"
      }
    }
    else if(id == 137)
    {
      return {
        network:"matic"
      }
    }
    else if(id == 250)
    {
      return {
        network:"fantom"
      }
    }
    else if(id == 43114)
    {
      return {
        network:"avalanche"
      }
    }
    else
    {
      return {
        network:""
      }
    }
  }

  const tokenInOutQuery = ({network, address, wallet_address}) =>
  {
    return `query
    {
      ethereum(network:  ` + network + `) {
        inbound: transfers(
          options: {asc: "block.timestamp.time"}
          amount: {gt: 0}
          receiver: {is: "`+wallet_address+`"}
        ) {
          block {
            timestamp {
              time(format: "%Y-%m-%dT%H:%M:%SZ")
              dayOfWeek
            }
            height
          }
          address: sender {
            address
            annotation
          }
          currency(currency: {is: "`+ address +`"}) {
            address
            decimals
          }
          gasValue
          amount
          amountInUSD: amount (in:USD)
          transaction {
            hash
            txFrom {
              address
              annotation
            }
          }
          external
        }
        outbound: transfers(
          options: {asc: "block.timestamp.time"}
          amount: {gt: 0}
          sender: {is: "`+wallet_address+`"}
        ) {
          block {
            timestamp {
              time(format: "%Y-%m-%dT%H:%M:%SZ")
              dayOfWeek
            }
            height
          }
          address: receiver {
            address
            annotation
          }
          currency(currency: {is: "`+ address +`"}) {
            address
            decimals
          }
          gasValue
          amount
          amountInUSD: amount (in:USD)
          transaction {
            hash
            txFrom {
              address
              annotation
            }
          }
          external
        }
      }
    }
    `
  }

  
export const updateAddedWallet = async (pass_data, new_wallet_address) =>
{ 
  const final_array = []
  if(pass_data.length)
  {
    for(let run of pass_data)
    {   
      if(run.default_type == true)
      {
        await final_array.push({
          _id : run._id,
          default_type : run.default_type,
          nick_name : run.nick_name,
          wallet_address : new_wallet_address
        })
      }
      else
      {
        await final_array.push(run)
      }
    }
  }
  return final_array
}



  const arrangeInOutData = async (pass_data, wallet_address) =>
  {
    const arrange_result = []
    const data_list_hash = []
    if(pass_data.ethereum)
    {
      if(pass_data.ethereum.inbound)
      {
        for(let run of pass_data.ethereum.inbound)
        {
          if(!data_list_hash.includes(run.transaction.hash))
          {
            let type = 1
            if((run.transaction.txFrom.address).toLowerCase() == wallet_address)
            {
              type = 3
            }
            
            await arrange_result.push({
              amount : run.amount,
              gas_value : run.gasValue,
              amount_in_usd : run.amountInUSD,
              amount : run.amount,
              date_n_time : run.block.timestamp.time,
              hash : run.transaction.hash,
              tx_from :run.transaction.txFrom.address,
              type : type
            })
            await data_list_hash.push(run.transaction.hash)
          }
          
        }
      }

      if(pass_data.ethereum.outbound)
      {
        for(let run of pass_data.ethereum.outbound)
        {
          if(!data_list_hash.includes(run.transaction.hash))
          {
            let type = 2
            if((run.address.address).toLowerCase() == wallet_address)
            {
              type = 3
            }
            
            await arrange_result.push({
              amount : run.amount,
              gas_value : run.gasValue,
              amount_in_usd : run.amountInUSD,
              amount : run.amount,
              date_n_time : run.block.timestamp.time,
              hash : run.transaction.hash,
              tx_from :run.address.address,
              type : type
            })
            await data_list_hash.push(run.transaction.hash)
          }
         
        }
      }

      if(arrange_result.length)
      {
        arrange_result.sort(function(a,b)
        {
          return new Date(a.date_n_time) - new Date(b.date_n_time)
        })
      }
    }
    return arrange_result
  }
  const calAquisitionCost = async (pass_data, pass_address) =>
  {
    var token_worth = 0 
    var token_balance = 0
    var gas_value = 0 
    var aquisition_cost = 0
    var i = 0
    for(let run of pass_data)
    {
      
      if(!isNaN(parseFloat(run.gas_value)))
      {
        gas_value += parseFloat(run.gas_value)
      }

      if(run.type == 1)
      { 
        token_balance += await (run.amount)
        aquisition_cost += await run.amount_in_usd
      //  if((run.tx_from).toLowerCase() != pass_address)
      //  {
       
      //  }
      //  else
      //  {
      //   console.log("working", i)
      //  }
      }
      else if(run.type == 2)
      {
        token_balance = await token_balance-(run.amount)
        aquisition_cost = await aquisition_cost-run.amount_in_usd

        // if((run.tx_from).toLowerCase() != pass_address)
        // {
          
        // }
        // else
        // {
        //  console.log("working", i)
        // }

        
      }
      i++
    }
    console.log("pass_address", pass_address)
    console.log("pass_data", pass_data)
    console.log("aquisition_cost", aquisition_cost)


    return {token_balance:token_balance, aquisition_cost}
  }

  const getNativeTokenQuery = async ({network, wallet_address, symbol}) =>
  {
    return `query 
    {
      ethereum(network: `+network+`) {
        inbound: transfers(
          options: {asc: "block.timestamp.time", limit: 1000}
          receiver: {is: "`+wallet_address+`"}
        ) {
          currency(currency: {is: "`+symbol+`"}) {
            symbol
            address
            decimals
          }
          block {
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
              dayOfWeek
            }
            height
          }
          address: sender {
            address
            annotation
          }
          gasValue
          amount
          amountInUSD: amount(in: USD)
          transaction {
            hash
            txFrom {
              address
              annotation
            }
          }
          external
        }
        outbound: transfers(
          options: {asc: "block.timestamp.time", limit: 1000}
          sender: {is: "`+wallet_address+`"}
        ) {
          currency(currency: {is: "`+symbol+`"}) {
            symbol
            address
            decimals
          }
          block {
            timestamp {
              time(format: "%Y-%m-%d %H:%M:%S")
              dayOfWeek
            }
            height
          }
          address: receiver {
            address
            annotation
          }
          gasValue
          amount
          amountInUSD: amount(in: USD)
          transaction {
            hash
            txFrom {
              address
              annotation
            }
          }
          external
        }
      }
    }`
  }
  

  export const getTokenInOutDetails = async (pass_data, wallets) =>
  {
    // console.log("pass_data", pass_data)
    const final_array = []
    const networkRes = getNetworkByID(pass_data.network)
    var total_aquisition_cost = 0
    if(pass_data.address)
    {
      if(pass_data.wallets)
      {
        for(let run of pass_data.wallets)
        {
            // console.log("first fetch bal", run.balance)

            const query = await tokenInOutQuery({
              network : networkRes.network, 
              address : pass_data.address, 
              wallet_address : run.wallet_address
            })
            const opts = fetchAPIQuery(query)
            const res = await fetch(graphqlApiURL, opts)
            const result = await res.json()
            if(result.data)
            {
              const arranged_data = await arrangeInOutData(result.data, (run.wallet_address).toLowerCase())
              // console.log("arranged_data", arranged_data)
              if(arranged_data.length)
              {
                const recent_transactions = arranged_data.reverse()
                const token_worth_data = await calAquisitionCost(arranged_data, (run.wallet_address).toLowerCase())

                var aquisition_cost = 0
                if(token_worth_data.token_balance == run.balance)
                {
                  aquisition_cost = await token_worth_data.aquisition_cost
                  total_aquisition_cost += await aquisition_cost
                }
              
                console.log("cal balance", token_worth_data.token_balance)
                console.log("fetch bal", run.balance)

                await final_array.push({
                  wallet_address : run.wallet_address,
                  transactions : recent_transactions,
                  aquisition_cost : aquisition_cost
                })
              }
            }
        }
      }


      return {total_aquisition_cost, data:final_array}
    }
    else if(pass_data.symbol)
    { 
      
      if(pass_data.wallets)
      {
        for(let run of pass_data.wallets)
        {
          
          const query = await getNativeTokenQuery({
            network : networkRes.network, 
            wallet_address : run.wallet_address, 
            symbol : pass_data.symbol
          })
          const opts = fetchAPIQuery(query)
          const res = await fetch(graphqlApiURL, opts)
          const result = await res.json()
          if(result.data)
          {
            const arranged_data = await arrangeInOutData(result.data, (run.wallet_address).toLowerCase())
            // console.log("arranged_data", arranged_data)
            if(arranged_data.length)
            {
              const recent_transactions = arranged_data.reverse()
              const token_worth_data = await calAquisitionCost(arranged_data, (run.wallet_address).toLowerCase())
              var aquisition_cost = 0
              if(token_worth_data.token_balance == run.balance)
              {
                aquisition_cost = await token_worth_data.aquisition_cost

                total_aquisition_cost += await aquisition_cost
              }

              console.log("cal balance", token_worth_data.token_balance)
              console.log("fetch bal", run.balance)

              await final_array.push({
                wallet_address : run.wallet_address,
                transactions : recent_transactions,
                aquisition_cost : aquisition_cost
              })
            }
          }
        }
      }
      
      return {total_aquisition_cost, data:final_array}
    }
    return {total_aquisition_cost:0, data:final_array}
  }

  export const getEvmNetwork = (pass_network_id) => 
  {
    if(pass_network_id == 1)
    {
        return {
          network:"eth",
          network_name:"Ethereum Network",
          network_image:"eth.svg"
        }
    }
    // else if(pass_network_id == 56)
    // {
    //     return {
    //       network:"bsc",
    //       network_name:"Binance Smart Chain",
    //       network_image:"bsc.svg"
    //     }
    // }
    else
    {
      return ""
    }
  }


  


  export const nftByWalletAddress = ({wallet_addresses, network, limit, offset}) => 
  {
    var addresses_str = ""
    for(let run of wallet_addresses)
    {   
      addresses_str += '"'+run+'", '
    }
    //
    //  limit: {count: 100}
    //, ProtocolName: {is: "erc721"}
    return `{
        EVM(network: `+network+`, dataset: combined) {
          BalanceUpdates(
            orderBy: {descending: Block_Date}
            limit: {count: `+limit+`, offset: `+offset+`}
            where: {BalanceUpdate: {Address: {in: [`+addresses_str+`]}}, Currency: {Fungible: false}}
          ) {
            Currency {
              Fungible
              Symbol
              SmartContract
              Name
              HasURI
              Delegated
              Decimals
              ProtocolName
              Native
            }
            BalanceUpdate {
              Id
              Amount
              Address
              URI
            }
            Block {
              Date
            }
          }
        }
      }
    `
  }

export  const graphqlPricingTokenData = (address, network) => 
  {
    var dateSince = ((new Date(Date.now())).toISOString())
    if(network == 'ethereum')
    {
      var addr1 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
      var addr2 = "0xdac17f958d2ee523a2206206994597c13d831ec7"
    }
    else
    {
      var addr1 = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
      var addr2 = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    }

    return `
          query
          {
            ethereum(network: ` + network + `) {
              dexTrades(
                date: {since: "` + dateSince + `"}
                any: [{baseCurrency: {is: "`+ address +`"}, quoteCurrency: {is:"`+addr1+`"}}, {baseCurrency: {is: "`+addr1+`"}, quoteCurrency: {is: "`+addr2+`"}}]
                options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
              ) {
                baseCurrency {
                  symbol
                }
                block {
                  height
                }
                transaction {
                  index
                }
          
                quoteCurrency {
                  symbol
                }
                quote: quotePrice
              }
            }
          }
      ` 
  }

  

  
  //action_type 1:add wallet, 2:remove wallet 
  export const addRemoveActiveAddresses = async (pass_address, active_addresses, action_type) =>
  {
    var my_active_addresses = active_addresses
    if(action_type == 1)
    {
      if(!active_addresses.includes(pass_address)) 
      {
        my_active_addresses.push(pass_address)
        return my_active_addresses
      }
    }
    else if(action_type == 2)
    {
      if(active_addresses.includes(pass_address)) 
      {
        const array_index_value = my_active_addresses.indexOf(pass_address);
        if(array_index_value > -1) 
        { 
          my_active_addresses.splice(array_index_value, 1) 
          return my_active_addresses
        }
      }
    }
    return my_active_addresses
  }

  export const setActiveNetworksArray = (pass_network, active_networks) =>
  { 
    var my_active_networks = active_networks
    if(active_networks.includes(pass_network)) 
    {
      const array_index_value = my_active_networks.indexOf(pass_network)
      if(array_index_value > -1) 
      { 
        my_active_networks.splice(array_index_value, 1)
        return my_active_networks
      }
    }
    else
    {
      my_active_networks.push(pass_network)
      return my_active_networks
    }
  }
  
  export const getNetworkImageNameByID = (pass_network_id) =>
  {
    if(pass_network_id == 1)
    {
      return "eth.svg"
    }
    else if(pass_network_id == 56)
    {
      return "bsc.svg"
    }
    else if(pass_network_id == 137)
    {
      return "polygon.svg"
    }
    else if(pass_network_id == 250)
    {
      return "ftm.svg"
    }
    else if(pass_network_id == 43114)
    {
      return "avax.svg"
    }
  }


  export const getNetworkNameByID = (pass_network_id) =>
  {
    if(pass_network_id == 1)
    {
      return "Ethereum"
    }
    else if(pass_network_id == 56)
    {
      return "Binance"
    }
    else if(pass_network_id == 137)
    {
      return "Polygon"
    }
    else if(pass_network_id == 250)
    {
      return "Fantom"
    }
    else if(pass_network_id == 43114)
    {
      return "Avalanche"
    }
  }


  
  export const getTxnLinkByID = (pass_network_id) =>
  {
    if(pass_network_id == 1)
    {
      return "https://etherscan.io/tx/"
    }
    else if(pass_network_id == 56)
    {
      return "https://bscscan.com/tx/"
    }
    else if(pass_network_id == 137)
    {
      return "https://polygonscan.com/tx/"
    }
    else if(pass_network_id == 250)
    {
      return "https://ftmscan.com/tx/"
    }
    else if(pass_network_id == 43114)
    {
      return "https://avascan.info/blockchain/dfk/tx/"
    }
  }


  
 //used in portfolio main page


export const getGraphSparklineValues = async (sparkline_data, pass_data_type) =>
{
    var graph_values = []
    var loop_values = []
    // console.log('sparkline_data', sparkline_data.price) 
    // 12 Hrs
    if(pass_data_type == 1)
    {
      //loop_values = [156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167]
    }
    // 1 Day
    else if(pass_data_type == 2)
    {
      loop_values = [143, 145, 147, 149, 151, 153, 155, 157, 159, 161, 163, 165, 167]
      for(let l of loop_values)
      {
          //console.log(l)
          if(sparkline_data.price)
          {
            if(sparkline_data.price[l])
            {
                await graph_values.push(sparkline_data.price[l])
            }
  
          }
      }
    } 
    // 7 Days
    else
    {
      loop_values = [0, 24, 48, 72, 96, 120, 145, 167]
    }
    for(let l of loop_values)
    {
        //console.log(l)
        if(sparkline_data.price)
        {
          if(sparkline_data.price[l])
          {
              await graph_values.push(sparkline_data.price[l])
          }

        }
    }
    
    
    console.log('graph_values', graph_values)
    return graph_values
}

  

export const addActiveNickname =  (pass_nicknames, pass_wallet_address, pass_nickname) =>
{ 
  var my_pass_nicknames = pass_nicknames
  if(!pass_nicknames[pass_wallet_address]) 
  {
    my_pass_nicknames[pass_wallet_address] = pass_nickname
  }
  return my_pass_nicknames
}
  


export const getNameByUsingWalletAddress=(pass_nicknames, pass_address)=>
{
  if(pass_nicknames[pass_address])
  {
    return pass_nicknames[pass_address]
  }
  else
  {
    return ""
  }
}



export const getDaysList = async (balance_list, pass_balance, pass_data_type) =>
{   
      var array_count = 0
      if(pass_data_type == 1)
      {
        array_count = 13
      }
      // 1 Day
      else if(pass_data_type == 2)
      {
        array_count = 13
      }
      // 7 Days
      else if(pass_data_type == 3)
      {
        array_count = 8
      }
      const past7Days = [...Array(array_count).keys()].map(index => 
      {
          const date = new Date();
          
          if(pass_data_type == 1)
          {
            date.setHours(date.getHours() - index)
            if(index == 0)
            {
              return moment(date).format("h a")
            }
            else
            {
              return moment(date).format("h a")
            }
            
          }
          if(pass_data_type == 2)
          {
            date.setHours(date.getHours() - index*2)
            if(index == 0)
            {
              return moment(date).format("h a")
            }
            else
            {
              return moment(date).format("h a")
            }
          }
          else
          {
            date.setDate(date.getDate() - index)
            return moment(date).format("DD MMM")
          }
      })
      const last_seven_days = past7Days.reverse()
    
      
     // set_line_graph_days(last_seven_days)
      var initial_array = []
      if(balance_list)
      {
          for(let i of balance_list)
          {   
             await initial_array.push({
                  price : i.price,
                  balance : i.balance,
                  sparkline_in_7d : await getGraphSparklineValues(i.sparkline_in_7d, pass_data_type)
             })
          }
      }

      var sum_array = []
      for(let i=0; i<array_count; i++)
      {
        if(i == (array_count-1))
        {
          await sum_array.push(pass_balance)
        }
        else
        {
          var sumOne = 0
          for(let j=0; j<initial_array.length; j++)
          {
              sumOne += await (initial_array[j].sparkline_in_7d[i] && initial_array[j].balance) ? initial_array[j].sparkline_in_7d[i]*initial_array[j].balance:0
          }
          await sum_array.push(parseFloat(sumOne.toFixed(2)))
        }
      }
      // console.log("balance_list", balance_list)
      // console.log("sum_array", sum_array)
      //await set_line_graph_values(sum_array)

      return {line_graph_days:last_seven_days, line_graph_values:sum_array}
  }