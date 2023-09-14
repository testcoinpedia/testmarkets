import React , {useState, useEffect} from 'react'  
import Link from 'next/link' 
import Axios from 'axios'
import JsCookie from 'js-cookie' 
import cookie from 'cookie'

import { useRouter } from 'next/router'
import moment from 'moment'
import dynamic from 'next/dynamic' 

import { app_coinpedia_url, graphqlApiURL, graphqlApiKEY} from '../../components/constants' 


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
    //   network_name:"Optimism",
    //   network_image:"",
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



export  const roundNumericValue=(value) =>
{
  var return_value = 0
  
  if(value)
  {
    if(parseFloat(value) >= 0.1)
    {
      return_value = parseFloat((parseFloat(value)).toFixed(2))
    }
    else if((parseFloat(value) < 0.1) && (parseFloat(value) >= 0.01))
    {
      return_value = (parseFloat(value)).toFixed(3)
    }
    else if((parseFloat(value) < 0.01) && (parseFloat(value) >= 0.001))
    {
      return_value = (parseFloat(value)).toFixed(4)
    }
    else if((parseFloat(value) < 0.001) && (parseFloat(value) > 0.0001))
    {
      return_value = (parseFloat(value)).toFixed(5)
    }
    else if((parseFloat(value) < 0.0001) && (parseFloat(value) > 0.00001))
    {
      return_value = (parseFloat(value)).toFixed(6)
    }
    else if((parseFloat(value) < 0.00001) && (parseFloat(value) > 0.000001))
    {
      return_value = (parseFloat(value)).toFixed(7)
    }
    else if((parseFloat(value) < 0.000001) && (parseFloat(value) > 0.0000001))
    {
      return_value = (parseFloat(value)).toFixed(8)
    }
    else if((parseFloat(value) < 0.0000001) && (parseFloat(value) > 0.00000001))
    {
      return_value = (parseFloat(value)).toFixed(9)
    }
    else if((parseFloat(value) < 0.00000001) && (parseFloat(value) > 0.000000001))
    {
      return_value = (parseFloat(value)).toFixed(11)
    }
    else if((parseFloat(value) < 0.000000001) && (parseFloat(value) > 0.0000000001))
    {
      return_value = (parseFloat(value)).toFixed(12)
    }
    else
    {
      return_value = ((parseFloat(value)).toFixed(13))
    }
  }
  else
  {
    return_value = 0
  }
  return return_value
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
        return (roundNumericValue(value)).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
        })
      }
      else
      {
        
        return "$"+roundNumericValue(value)
      }
      
    }
    else
    {
      return new Intl.NumberFormat().format(roundNumericValue(value))
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


 export const fetchAPIQuery = (query) => 
  {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
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
        "url":app_coinpedia_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
  }
 
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


  
 

  
  