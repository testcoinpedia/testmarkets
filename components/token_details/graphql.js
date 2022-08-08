import React from 'react';
import {  graphqlApiKEY } from '../constants'
import { graphQlURL } from '../tokenDetailsFunctions' 
import Axios from 'axios'
import { ethers } from 'ethers'

export const graphql_url = "https://graphql.bitquery.io/"
export const graphql_api_key = "BQY1XNDUiyQLTCiyS2BbBOrOlAhhckt5"

export const dex_trades_volume = (network_type, from_date, present_date) =>
{ 
    var network = "ethereum"
    var baseCurrency = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    var quoteCurrency = "0xdac17f958d2ee523a2206206994597c13d831ec7"
    
    if(network_type == 2)
    {
      network = "bsc"
      baseCurrency = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
      quoteCurrency = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
    }

    const query =  `query {
      ethereum(network: ` + network + `) {
          dexTrades(
            options: {desc: "tradeAmount"}
            date: {since:"` + from_date + `", till: "` + present_date + `"}
            baseCurrency: {is: "` + baseCurrency + `"}
            quoteCurrency: {is: "` + quoteCurrency + `"}
            
          ) {
            count
            tradeAmount(in:USD)
            
      
          }
        }
      }
      ` 

      return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphql_api_key
      },
      body:JSON.stringify({ query })
    }
}
export const dex_trades_volume_change = (dex_trades_volume,dex_trade_change) =>
{ 
 
    return ((dex_trades_volume-dex_trade_change)/(dex_trades_volume))
}
export const getactivedexTrades24h = (network_type, from_date, present_date) =>
{ 


  var network = "ethereum"
  var baseCurrency = "0xdac17f958d2ee523a2206206994597c13d831ec7"
  
  if(network_type == 2)
  {
    network = "bsc"
    baseCurrency = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
  }

  const query =  `query {
    ethereum(network: `+network+`){
      transactions (date: {since: "` + present_date + `"}){
        date {date}
          trades: count
          senders: count(uniq:receivers)
          recievers: count(uniq:senders)
      }
    }
  }
    ` 

    return query 


    
}
export const getAlldexTrades = (network_type, from_date, present_date) =>
{ 


  var network = "ethereum"
  var baseCurrency = "0xdac17f958d2ee523a2206206994597c13d831ec7"
  
  if(network_type == 2)
  {
    network = "bsc"
    baseCurrency = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
  }

  const query =  `query {
    ethereum(network: `+network+`) {
        dexTrades(
          options: {desc: "tradeAmount"}
          date: {since: "` + from_date + `", before: "` + present_date + `"}
          baseCurrency: {is: "` + baseCurrency + `"}
        ) {
          trades: count
          tradeAmount(in:USD)
          exchange {
            fullName
          }
        }
      }
    }
    ` 

    return query 


    // var network = "ethereum"
    // var baseCurrency = "0xdac17f958d2ee523a2206206994597c13d831ec7"
   
    
    // if(network_type == 2)
    // {
    //   network = "bsc"
    //   baseCurrency = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
  
    // }

    // const query =  `query {
    //   ethereum(network: bsc) {
    //       dexTrades(
    //         options: {desc: "tradeAmount"}
    //         date: {since: "` + from_date + `", before: "` + present_date + `"}
    //         baseCurrency: {is: "` + baseCurrency + `"}
    //       ) {
    //         exchange {
    //           fullName
    //         }
    //         trades: count
    //         amount: baseAmount
    //         tradeAmount(in: USD)
    //       }
    //     }
    //   }
    //   ` 

    //   return {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     "X-API-KEY": graphql_api_key
    //   },
    //   body:JSON.stringify({ query })
    // }
}

export const dex_trades_aggregator_volume = (network_type, from_date, present_date) =>
{ 
    var network = "ethereum"
    if(network_type == 2)
    {
      network = "bsc"
     
    }

    const query =  `query {
      ethereum(network:  ` + network + `) {
        dexTrades(
          options: {desc: "tradeAmount"}
          date: {since: "` + from_date + `", till: "` + present_date + `"}
        ) {
          trades: count
          tradeAmount(in: USD)
          currencies: count(uniq: buy_currency)
          contracts: count(uniq: smart_contracts)
          date {
            date(format: "%y-%m-%d")
          }
        }
      }
    }
      ` 
      return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphql_api_key
      },
      body:JSON.stringify({ query })
    }
}
export const dexMonthWiseData = (network_type, from_date, present_date) =>
{
  var network = "ethereum"
  var baseCurrency = "0xdac17f958d2ee523a2206206994597c13d831ec7"
  
  if(network_type == 2)
  {
    network = "bsc"
    baseCurrency = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
  }

  const query =  `query {
    ethereum(network: ` + network + `) {
        dexTrades(
          options: {asc: ["exchange.fullName", "timeInterval.month"]}
          date: {since:"` + from_date + `", till: "` + present_date + `"}
          baseCurrency: {is: "` + baseCurrency + `"}
        ) {
          exchange: exchange {
            fullName
          }
          timeInterval {
            month(format: "%Y-%m-%d")
          }
          tradeAmount(in: USD)
        }
      }
    }
    ` 

    return query 
}


export const live_price_graphql= async (id,networks)=> 
{ 
    var resObj = {}
    const dateSince = ((new Date()).toISOString())
    let query = ''
    // live price query starts here
    if(parseInt(networks) === 1)
    {
      query = `
      query
      {
        ethereum(network: ethereum) {
          dexTrades(
            date: {since: "` + dateSince + `"}
            any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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
  ` ;
    } 
    else{
      query = `
      query
      {
        ethereum(network: bsc) {
          dexTrades(
            date: {since: "` + dateSince + `"}
            any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
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
    const graphConfig = {  
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      }
    }
    resObj['live_price'] = 0
    const liveQueryRun = await Axios.post(graphQlURL, JSON.stringify({query}), graphConfig)
   // console.log(liveQueryRun)
    if(liveQueryRun.data.data.ethereum != null && liveQueryRun.data.data.ethereum.dexTrades != null) 
    { 
      
      var cal_live_price = 0
      if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c")
      {
        cal_live_price = liveQueryRun.data.data.ethereum.dexTrades[0].quote
      }
      else if(liveQueryRun.data.data.ethereum.dexTrades.length == 2)
      {
        cal_live_price = liveQueryRun.data.data.ethereum.dexTrades[0].quote*liveQueryRun.data.data.ethereum.dexTrades[1].quote
      }
     
      resObj['live_price'] = await cal_live_price
    }
    // live price query ends here
  

    // 24h Change query starts here

    const date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString()) 
    if(parseInt(networks) === 1){
     
      query = `
                query
                {
                  ethereum(network: ethereum) {
                    dexTrades(
                      date: {in: "` + date + `"}
                      any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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
          ` ; 
      }
   
    if(parseInt(networks) === 2){
  
      query = `
      query
      {
        ethereum(network: bsc) {
          dexTrades(
            date: {in: "` + date + `"}
            any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
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
  ` ;
    }
    
    
    resObj['price_change_24h'] = 0
    const change24hQueryRun = await Axios.post(graphQlURL, JSON.stringify({query}), graphConfig)
    //console.log(change24hQueryRun)
     
    const contract_usdt_price = cal_live_price 
    let change24h = 0
     if(change24hQueryRun.data.data.ethereum != null && change24hQueryRun.data.data.ethereum.dexTrades != null)
          {    
            if(change24hQueryRun.data.data.ethereum.dexTrades[0].baseCurrency.symbol === "WBNB" || id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
            {
              var quote_zero = 0
              if(change24hQueryRun.data.data.ethereum.dexTrades)
              {
                quote_zero = change24hQueryRun.data.data.ethereum.dexTrades[0].quote
              }
  
              var quote_one = 0
              if(change24hQueryRun.data.data.ethereum.dexTrades.length > 1)
              {
                quote_one = change24hQueryRun.data.data.ethereum.dexTrades[1].quote
              }
  
              change24h = ((contract_usdt_price - (quote_zero*quote_one)) / (contract_usdt_price) * 100) 
              resObj['price_change_24h'] = await change24h
             
            } 
            else
            {
              change24h = (contract_usdt_price / (quote_zero * quote_one) - 1) * 100
              // change24h = (contract_usdt_price / (result.data.ethereum.dexTrades[0].quote ) - 1) * 100
              resObj['price_change_24h'] = await change24h
            } 
          }
     
  // 24h Change query ends here
   

  // 24h volume query starts here

  if(parseInt(networks) === 1){
    query = `
    query
    {
      ethereum(network: ethereum) {
        dexTrades(
          date: {since: "` + dateSince + `"}
          baseCurrency: {is: "`+id+`"}
          options: {desc: "tradeAmount"}
        ) {
          tradeAmount(in: USD)
        }
      }
    }
  ` ;
}
else{
  query = `
  query
  {
    ethereum(network: bsc) {
      dexTrades(
        date: {since: "` + dateSince + `"}
        baseCurrency: {is: "`+id+`"}
        options: {desc: "tradeAmount"}
      ) {
        tradeAmount(in: USD)
      }
    }
  }
` ;
}

const volume24hQueryRun = await Axios.post(graphQlURL, JSON.stringify({query}), graphConfig)
//console.log(volume24hQueryRun)
if (volume24hQueryRun.data.data.ethereum != null && volume24hQueryRun.data.data.ethereum.dexTrades != null) {  
      resObj['contract_24h_volume']=volume24hQueryRun.data.data.ethereum.dexTrades[0].tradeAmount
  }
     
  //24h volume query ends here
   

  // token details starts here
  if(parseInt(networks) === 1)
  {
    query = `
        query
        { 
          ethereum(network: ethereum) {
            address(address: {is: `+ '"' +id+ '"' + `}){

              annotation
              address

              smartContract {
                contractType
                currency{
                  symbol
                  name
                  decimals
                  tokenType
                }
              }
              balance
            }
          } 
        }
      ` ;
  }
  else{
    query = `
        query
        { 
          ethereum(network: bsc) {
            address(address: {is: `+ '"' +id+ '"' + `}){

              annotation
              address

              smartContract {
                contractType
                currency{
                  symbol
                  name
                  decimals
                  tokenType
                }
              }
              balance
            }
          } 
        }
      ` ;
  }
 
  const liveDecimalQuery = await Axios.post(graphQlURL, JSON.stringify({query}), graphConfig)
  if(liveDecimalQuery.data.ethereum !== null) 
  { 
   
    const decimal =  liveDecimalQuery.data.data.ethereum.address[0].smartContract.currency.decimals
    var req_url = "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=E9DBMPJU7N6FK7ZZDK86YR2EZ4K4YTHZJ1"
  if(parseInt(networks) === 2)
  {
    req_url = "https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=GV79YU5Y66VI43RM7GCBUE52P5UMA3HAA2"
  }
  const value = await Axios.get(req_url)
  if(value.status)
  { 
    var get_total_supply_value=value.data.result
  }
  else
  {
    var get_total_supply_value=  0
  }
    var cal_total_supply_value = get_total_supply_value/10**decimal
    resObj['token_max_supply']= await cal_total_supply_value   
    var cal_market_cap = cal_total_supply_value * cal_live_price
    resObj['market_cap']= await cal_market_cap  
    
   

  }
  
 // token details ends here

 // Liquidity starts here

  let mainnetUrl = ""
  
    if(parseInt(networks) === 1 ){
      mainnetUrl = 'https://mainnet.infura.io/v3/5fd436e2291c47fe9b20a17372ad8057'
    }
    else{
      mainnetUrl = "https://bsc-dataseed.binance.org/";
    }
   
   
      const provider = new ethers.providers.JsonRpcProvider(mainnetUrl); 
  
      const tokenAbi = ["function totalSupply() view returns (uint256)"];
      const tokenContract = new ethers.Contract(id, tokenAbi, provider);
      const supply = await tokenContract.totalSupply() / (10 ** liveDecimalQuery.data.data.ethereum.address[0].smartContract.currency.decimals);  
      
    
    if(parseInt(networks) === 1)
    {
      // if(id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' || id !== '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'){
        
      //       const pairAbi = ["function getPair(address first, address second) view returns (address)"]
      //       const pairContract = new ethers.Contract("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", pairAbi, provider);
      //       const pairAddr = await pairContract.getPair(id, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
    
      //       const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
      //       const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
      //       const reserve = await liqContract.getReserves();
      //       const token0 = await liqContract.token0();
      //       const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decimal) * usd_price * 2;
      //       set_liquidity(liquidity) 
      //       console.log(liquidity)
       // } 
    }
    else
    {
      resObj['liquidity'] = 0
      if(id !== '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
      {
        
        const pairAbi = ["function getPair(address first, address second) view returns (address)"]
        const pairContract = new ethers.Contract("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", pairAbi, provider);
        const pairAddr = await pairContract.getPair(id, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c');
       
        const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
        const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
        const reserve = await liqContract.getReserves();
        const token0 = await liqContract.token0();
        var liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** liveDecimalQuery.data.data.ethereum.address[0].smartContract.currency.decimals) * cal_live_price * 2;
        resObj['liquidity'] = await liquidity
      
        }
        else
        {
          const pairAbi = ["function getPair(address first, address second) view returns (address)"]
          const pairContract = new ethers.Contract("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", pairAbi, provider);
          const pairAddr = await pairContract.getPair(id, '0xe9e7cea3dedca5984780bafc599bd69add087d56');
         
            const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
            const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
            const reserve = await liqContract.getReserves();
            const token0 = await liqContract.token0();
            var liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** liveDecimalQuery.data.data.ethereum.address[0].smartContract.currency.decimals) * usd_price * 2;
            resObj['liquidity'] = await liquidity
      
        }
  
    } 
  // Liquidity ends here


  if(parseInt(networks) === 1){

  }
  else{
    const circulating = await Axios.get("https://api.bscscan.com/api?module=stats&action=tokenCsupply&contractaddress="+id+"&apikey=GV79YU5Y66VI43RM7GCBUE52P5UMA3HAA2")
       if(circulating.status){ 
              resObj['circulating_supply'] =  await circulating.data.result/10**liveDecimalQuery.data.data.ethereum.address[0].smartContract.currency.decimals
             
            }
          }
  
         
     
       return resObj
}

export const getTokenUsdPrice=async(network,dateFrom,dateTo)=> {
  var dexTrades={}
  let query =""
  if(network==1)
  {
     query = `
    ethereum(network: bsc) {
      dexTrades(
        options: {desc: "tradeAmount"}
        date: {since: `+ '"' +dateFrom+ '"' + `, till: `+ '"' +dateTo+ '"' + `}
        baseCurrency: {is: 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2}
      ) {
        exchange {
          fullName
        }
        trades: count
        amount: baseAmount
        tradeAmount(in: USD)
      }
    } 
   ` ;
  }
  else
  {
     query = `
    ethereum(network: ethereum) {
      dexTrades(
        options: {desc: "tradeAmount"}
        date: {since: `+ '"' +dateFrom+ '"' + `, till: `+ '"' +dateTo+ '"' + `}
        baseCurrency: {is: 0xdac17f958d2ee523a2206206994597c13d831ec7}
      ) {
        exchange {
          fullName
        }
        trades: count
        amount: baseAmount
        tradeAmount(in: USD)
      }
    } 
   ` ;

  }
 
  
        
  const url = "https://graphql.bitquery.io/";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": graphqlApiKEY
    },
    body: JSON.stringify({
      query
    })
  };
  await fetch(url, opts)
    .then(res => res.json())
    .then(result => {
      console.log(result)
      if (result.data.ethereum.dexTrades != null) { 
          dexTrades.push(result.data.ethereum.dexTrades)
          
     }  
     return dexTrades
    })
    .catch(console.error);
}

 


  
  

    
  