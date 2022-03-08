

export const live_price=(id,)=> {
    const resObj = {}
    let query = "" 
    const dateSince = ((new Date()).toISOString())
    if(networks === "1")
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
  ` ;
    } 
         
    
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
    const livePriceQuery =  fetch(graphQlURL, opts)
    const liveQueryRun =  livePriceQuery.json() 
    if(liveQueryRun)
    {
        if(liveQueryRun.data.ethereum != null && liveQueryRun.data.ethereum.dexTrades != null) 
        { 
          
          var cal_live_price = 0
          if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c")
          {
            cal_live_price = liveQueryRun.data.ethereum.dexTrades[0].quote
          }
          else if(liveQueryRun.data.ethereum.dexTrades.length == 2)
          {
            cal_live_price = liveQueryRun.data.ethereum.dexTrades[0].quote*liveQueryRun.data.ethereum.dexTrades[1].quote
          }
         
          resObj['live_price'] = cal_live_price
          get24hChange(cal_live_price, id, networks) 
          getTokendetails(id, cal_live_price, networks)
    
            
            
        } 
         
    }
}

const get24hChange=(fun_live_price, id, networks)=>
{  
 
  let query = ""

  const date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString()) 
  // console.log(date)
  if(networks === "1"){

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
 
  if(networks === "2"){

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
   
  const contract_usdt_price = fun_live_price 
  let change24h = 0
  fetch(graphQlURL, opts)
    .then(res => res.json())
    .then(result => 
      {     
        if(result.data.ethereum != null && result.data.ethereum.dexTrades != null)
        {    
          if(result.data.ethereum.dexTrades[0].baseCurrency.symbol === "WBNB" || id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
          {
            var quote_zero = 0
            if(result.data.ethereum.dexTrades)
            {
              quote_zero = result.data.ethereum.dexTrades[0].quote
            }

            var quote_one = 0
            if(result.data.ethereum.dexTrades.length > 1)
            {
              quote_one = result.data.ethereum.dexTrades[1].quote
            }

            change24h = ((contract_usdt_price - (quote_zero*quote_one)) / (contract_usdt_price) * 100) 
            resObj['price_24change'] = change24h
           
          } 
          else
          {
            change24h = (contract_usdt_price / (quote_zero * quote_one) - 1) * 100
            // change24h = (contract_usdt_price / (result.data.ethereum.dexTrades[0].quote ) - 1) * 100
            resObj['price_24change'] = change24h
          } 
        }
    })
    .catch(console.error);
} 
const get24hVolume=(id, networktype)=> {   
    let query =""
    const dateSince = ((new Date).toISOString())
  
    if(networktype === "1"){
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
  
    fetch(graphQlURL, opts)
      .then(res => res.json())
      .then(result => {  
        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {  
          set_contract_24h_volume(result.data.ethereum.dexTrades[0].tradeAmount) 
        }
      })
      .catch(console.error);
  }
  