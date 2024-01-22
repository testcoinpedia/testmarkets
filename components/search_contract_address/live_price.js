
import { graphql_headers, graphqlApiURL } from '../constants'
import { tradeHistory } from '../token_details/liquidity/queries'

//price ,token name, symbol, total supply, 
const getLivePriceQuery = (type, pass_address) =>
{   
    //console.log("type", type)
    const dateSince = ((new Date()).toISOString())
    //1:ETH, 2:BNB
    var quoteCurrency = ''
    var quoteCurrency2 = ''
    var network_id = ''
    if(type == 1)
    {
        network_id = 'ethereum'
        quoteCurrency = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        quoteCurrency2 = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
    else if(type == 14)
    {
        network_id = 'matic'
        quoteCurrency = '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270'
        quoteCurrency2 = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    }
    else
    {
        network_id = 'bsc'
        quoteCurrency = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        quoteCurrency2 = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    }

    return {
        address:quoteCurrency,
        query: `
                query
                {
                    ethereum(network: `+network_id+` ) {
                        dexTrades(
                        date: {since: "`+dateSince+`"}
                        any: [{baseCurrency: {is: "`+ pass_address + `"},  quoteCurrency: {is:  "`+ quoteCurrency + `"}}, {baseCurrency: {is:  "`+ quoteCurrency + `"}, quoteCurrency: {is:  "`+ quoteCurrency2 + `"}}]
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
                        mint: transfers(
                            currency: {is:"`+ pass_address + `"}
                            sender: {is: "0x0000000000000000000000000000000000000000"}
                          ) 
                        {
                        amount(calculate: sum)
                        }

                        address(address: {in: "`+ pass_address + `"}) {
                            smartContract {
                              currency {
                                name
                                symbol
                                tokenType
                                decimals
                              }
                            }
                          }
                    }
                }
        `
    } 
}   



const fetchQuery = async (type, pass_address) =>
{ 
    const { address, query } = getLivePriceQuery(type, pass_address)
    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()

    // console.log("result", result)

    if(!result.errors)
    {   
        var final_array = {}
        final_array['contract_type'] = type
        
        if(type == 1)
        {
            final_array['network_row_id'] = 6
        }
        else if(type == 14)
        {
            
            final_array['network_row_id'] = 14
        }
        else
        {
            final_array['network_row_id'] = 2
        }
        if(result.data.ethereum) 
        {
            if(result.data.ethereum.address)
            {
                if(result.data.ethereum.address[0])
                {
                    if(result.data.ethereum.address[0].smartContract)
                    {
                        final_array['decimals'] = result.data.ethereum.address[0].smartContract.currency.decimals
                        final_array['name'] = result.data.ethereum.address[0].smartContract.currency.name
                        final_array['symbol'] = result.data.ethereum.address[0].smartContract.currency.symbol
                        final_array['tokenType'] = result.data.ethereum.address[0].smartContract.currency.tokenType
                    }
                }
            }

            if(result.data.ethereum.mint)
            {
                if(result.data.ethereum.mint[0])
                {
                    final_array['total_supply'] = result.data.ethereum.mint[0].amount
                }
            }

            var valid_status = false
            if(result.data.ethereum.dexTrades)
            {
                // console.log("dex trades", result.data.ethereum.dexTrades)
                if(pass_address === address) 
                {
                    final_array['live_price'] = result.data.ethereum.dexTrades[0].quote
                    valid_status = true
                }
                else 
                {
                    if(result.data.ethereum.dexTrades.length == 1) 
                    {   

                        const get_last_details = await tradeHistory({
                                                    sort_type:1, 
                                                    network_type:type, 
                                                    liquidity_address:pass_address, 
                                                    limit:1, 
                                                    offset:0
                                                })
                        var last_trade_price = 0
                        if(get_last_details.status[0])
                        {
                            if((get_last_details.message[0].sellCurrency.address).toLowerCase() == pass_address.toLowerCase())
                            {
                                last_trade_price = await get_last_details.message[0].buyAmountUSD / get_last_details.message[0].sellAmount
                            }
                            else
                            {
                                last_trade_price = await get_last_details.message[0].sellAmountUSD / get_last_details.message[0].buyAmount
                            }
                        } 
                       
                        // console.log("last_trade_price", last_trade_price)
                        final_array['live_price'] = last_trade_price
                    }
                    else if (result.data.ethereum.dexTrades.length == 2) 
                    {
                        final_array['live_price'] = result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote
                        valid_status = true
                    }
                }
                
            }
            final_array['valid_status'] = valid_status
            
        }
        return {status:true, message:final_array}
    }
    return {status:false, message:{}}
    //get type 
    
}

export const tokenBasic = async (pass_address, pass_network)=> 
{
    try
    {   
        var first_network = 1
        if(pass_network)
        {
            first_network = pass_network
        }
        const check_query = await fetchQuery(first_network, pass_address)
        if(!check_query.status)
        {
            const check_query2 = await fetchQuery(2, pass_address)
            if(!check_query2.status)
            {
                const check_query3 = await fetchQuery(9, pass_address)
                return check_query3
            }
            else
            {
                return check_query2
            }
        }
        else
        {
            return check_query
        }
    }
    catch(err)
    {
        return {status:false, message:{}}    
    }
}


//other details query starts here


const yesterdayPriceQuery = (type, pass_address) =>
{ 
    const yesterday_date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
   
    //1:ETH, 2:BNB
    var quoteCurrency = ''
    var quoteCurrency2 = ''
    var network_id = ''
    if(type == 1)
    {
        network_id = 'ethereum'
        quoteCurrency = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        quoteCurrency2 = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
    else
    {
        network_id = 'bsc'
        quoteCurrency = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        quoteCurrency2 = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    }
   
    return {
        address:quoteCurrency,
        network_id:network_id,
        query: `
        query
           {
                ethereum(network: `+network_id+`) 
                {
                    dexTrades(
                    date: {in: "` + yesterday_date + `"}
                    any: [{baseCurrency: {is: "`+ pass_address + `"},  quoteCurrency: {is:  "`+ quoteCurrency + `"}}, {baseCurrency: {is:  "`+ quoteCurrency + `"}, quoteCurrency: {is:  "`+ quoteCurrency2 + `"}}]
                    options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
                    ) 
                    {
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
}


const fetchOtherDetails = async (type, pass_address)=> 
{   
    const { address, query, network_id } = yesterdayPriceQuery(type, pass_address)

    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()

    var final_array = {}
    var valid_status = false
    if(!result.errors)
    {
        if(result.data.ethereum)
        {
            if(result.data.ethereum.dexTrades)
            {
                if(pass_address === address) 
                {
                    final_array['price_24h'] = result.data.ethereum.dexTrades[0].quote
                    valid_status = true
                }
                else 
                {
                    if (result.data.ethereum.dexTrades.length == 1) 
                    {
                        final_array['price_24h'] = result.data.ethereum.dexTrades[0].quote
                    }
                    else if (result.data.ethereum.dexTrades.length == 2) 
                    {   
                        valid_status = true
                        final_array['price_24h'] = result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote
                    }
                }
            }
            final_array['valid_status'] = valid_status

            return {status:true, message:final_array} 
           
        }
    }

    return {status:false, message:{}}
}


export const otherDetails = async (contract_type, pass_address)=> 
{
    try
    {   
        const check_in_array = [1,2]
        if(check_in_array.includes(contract_type))
        {
            return await fetchOtherDetails(contract_type, pass_address)
        }
        return {status:false, message:{}}
    }
    catch(err)
    {
        return {status:false, message:{}}    
    }
}



const volume24hQuery = (type, pass_address) =>
{ 
    const yesterday_date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
   
    //1:ETH, 2:BNB
    var network_id = ''
    if(type == 1)
    {
        network_id = 'ethereum'
    }
    else
    {
        network_id = 'bsc'
    }
   
    return {
        query: `
            query
            {
                ethereum(network: `+network_id+`) {
                dexTrades(
                    date: {since: "` + yesterday_date + `"}
                    baseCurrency: {is: "`+ pass_address + `"}
                    options: {desc: "tradeAmount"}
                ) {
                    tradeAmount(in: USD)
                }
                }
            }
       `
    } 
}



const fetchVolume24h = async (type, pass_address)=> 
{   
    const { query } = volume24hQuery(type, pass_address)

    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()

    var final_array = {}
    
    if(!result.errors)
    {
        if(result.data.ethereum)
        {
            if(result.data.ethereum.dexTrades)
            {   
                final_array['volume_24h'] = result.data.ethereum.dexTrades[0].tradeAmount
                return { status:true, message:final_array } 
            }
        }
    }

    return {status:false, message:{}}
}

export const getVolume24h = async (contract_type, pass_address)=> 
{
    try
    {   
        const check_in_array = [1,2]
        if(check_in_array.includes(contract_type))
        {
            return await fetchVolume24h(contract_type, pass_address)
        }
        return {status:false, message:{}}
    }
    catch(err)
    {
        return {status:false, message:{}}    
    }
}


const highLow24hQuery = (type, pass_address) =>
{   
    const present_date_n_time = ((new Date()).toISOString())
    const yesterday_date_n_time = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
   
    //1:ETH, 2:BNB
    var quoteCurrency = ''
    var quoteCurrency2 = ''
    var network_id = ''
    if(type == 1)
    {
        network_id = 'ethereum'
        quoteCurrency = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        quoteCurrency2 = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
    else
    {
        network_id = 'bsc'
        quoteCurrency = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        quoteCurrency2 = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    }
   
    return {
        query: `
            query
            {
                ethereum(network: `+network_id+`) 
                {
                    dexTrades(
                    baseCurrency: {is: "`+ pass_address + `"} quoteCurrency: {is: "`+ quoteCurrency2 + `"}
                    time: {since: "`+ yesterday_date_n_time + `", till: "`+ present_date_n_time + `"}
                    ) 
                    {
                        high: quotePrice(calculate: maximum)
                        low: quotePrice(calculate: minimum)
                        open: minimum(of: block, get: quote_price)
                        close: maximum(of: block, get: quote_price)
                    }
                }
            }
       `
    } 
}



const fetchHighLow24hPrice = async (type, pass_address)=> 
{   
    const { query } = highLow24hQuery(type, pass_address)

    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()
    if(!result.errors)
    {
        if(result.data.ethereum)
        {
            if(result.data.ethereum.dexTrades)
            {   
                return { status:true, message:result.data.ethereum.dexTrades[0] } 
            }
        }
    }

    return {status:false, message:{}}
}



export const getHighLow24h = async (contract_type, pass_address)=> 
{   
    try
    {   
        const check_in_array = [1,2]
        if(check_in_array.includes(contract_type))
        {
            return await fetchHighLow24hPrice(contract_type, pass_address)
        }
        return {status:false, message:{}}
    }
    catch(err)
    {
        return {status:false, message:{}}    
    }
}




// In search check contract address - Starts Here
const checkContractQuery = (type, pass_address) =>
{   
    const dateSince = ((new Date()).toISOString())
    //1:ETH, 2:BNB
    var quoteCurrency = ''
    var quoteCurrency2 = ''
    var network_id = ''
    if(type == 1)
    {
        network_id = 'ethereum'
        quoteCurrency = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        quoteCurrency2 = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
    else
    {
        network_id = 'bsc'
        quoteCurrency = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        quoteCurrency2 = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    }

    return {
        address:quoteCurrency,
        query: `
                query
                {
                    ethereum(network: `+network_id+` ) 
                    {
                        dexTrades(
                            date: {since: "`+dateSince+`"}
                            any: [{baseCurrency: {is: "`+ pass_address + `"}, quoteCurrency: {is:  "`+ quoteCurrency + `"}}, {baseCurrency: {is:  "`+ quoteCurrency + `"}, quoteCurrency: {is:  "`+ quoteCurrency2 + `"}}]
                            options: {limitBy: {each: "baseCurrency.symbol", limit: 1}}
                        )
                        {
                            baseCurrency {
                                symbol
                            }
                            quoteCurrency {
                                symbol
                            }
                            quote: quotePrice
                        }

                        address(address: {in: "`+ pass_address + `"}) 
                        {
                            smartContract {
                              currency {
                                name
                                symbol
                                tokenType
                              }
                            }
                          }
                    }
                }
        `
    }  
}


const checkContractFetchFun = async (type, pass_address) =>
{ 
    const { query } = checkContractQuery(type, pass_address)

    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()
    //console.log("result", result)

    if(!result.errors)
    {   
        var final_array = {}
        final_array['contract_type'] = type
        if(result.data.ethereum) 
        {
            if(result.data.ethereum.address)
            {
                if(result.data.ethereum.address[0])
                {
                    if(result.data.ethereum.address[0].smartContract)
                    {
                        final_array['contract_address'] = pass_address
                        final_array['name'] = result.data.ethereum.address[0].smartContract.currency.name
                        final_array['symbol'] = result.data.ethereum.address[0].smartContract.currency.symbol
                        final_array['tokenType'] = result.data.ethereum.address[0].smartContract.currency.tokenType
                    }
                }
            }
        }
        return {status:true, message:final_array}
    }
    return {status:false, message:{}}
    //get type 
}

export const checkContractAddress = async (pass_address)=> 
{
    try
    {  
        const check_query = await checkContractFetchFun(1, pass_address)
        if(!check_query.status)
        {
            const check_query2 = await checkContractFetchFun(2, pass_address)
            return check_query2
        }
        else
        {
            return check_query
        }
    }
    catch(err)
    {
        return {status:false, message:{}}    
    }
}
//In search check contract address - Ends Here

// 7 days % change - Starts Here


const sevenDaysQuery = (type, pass_address) =>
{ 
    const date_n_time = ((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString())
   
    //1:ETH, 2:BNB
    var quoteCurrency = ''
    var quoteCurrency2 = ''
    var network_id = ''
    if(type == 1)
    {
        network_id = 'ethereum'
        quoteCurrency = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
        quoteCurrency2 = '0xdac17f958d2ee523a2206206994597c13d831ec7'
    }
    else
    {
        network_id = 'bsc'
        quoteCurrency = '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
        quoteCurrency2 = '0xe9e7cea3dedca5984780bafc599bd69add087d56'
    }
   
    return {
        address:quoteCurrency,
        network_id:network_id,
        query: `
        query
           {
                ethereum(network: `+network_id+`) 
                {
                    dexTrades(
                    date: {in: "` + date_n_time + `"}
                    any: [{baseCurrency: {is: "`+ pass_address + `"},  quoteCurrency: {is:  "`+ quoteCurrency + `"}}, {baseCurrency: {is:  "`+ quoteCurrency + `"}, quoteCurrency: {is:  "`+ quoteCurrency2 + `"}}]
                    options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
                    ) 
                    {
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
}


const fetechSevenDaysQuery = async (type, pass_address)=> 
{   
    const { address, query, network_id } = sevenDaysQuery(type, pass_address)

    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()

    var final_array = {}
    var valid_status = false
    if(!result.errors)
    {
        if(result.data.ethereum)
        {
            if(result.data.ethereum.dexTrades)
            {
                if(pass_address === address) 
                {
                    final_array['price_24h'] = result.data.ethereum.dexTrades[0].quote
                    valid_status = true
                }
                else 
                {
                    if (result.data.ethereum.dexTrades.length == 1) 
                    {
                        final_array['price_24h'] = result.data.ethereum.dexTrades[0].quote
                    }
                    else if (result.data.ethereum.dexTrades.length == 2) 
                    {   
                        valid_status = true
                        final_array['price_24h'] = result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote
                    }
                }
            }
            final_array['valid_status'] = valid_status

            return {status:true, message:final_array} 
           
        }
    }

    return {status:false, message:{}}
}


export const sevenDaysDetails = async (contract_type, pass_address)=> 
{
    try
    {   
        const check_in_array = [1,2]
        if(check_in_array.includes(contract_type))
        {
            return await fetechSevenDaysQuery(contract_type, pass_address)
        }
        return {status:false, message:{}}
    }
    catch(err)
    {
        return {status:false, message:{}}    
    }
}
// 7 Days % change - Ends Here




//24hrs Volume Starts Here
const volume24HrsQuery = ({network_type, contract_address, volume_time}) =>
{   
    var network_id = ''
    if(network_type == 6)
    {
        network_id = 'ethereum'
    }
    else if(network_type == 14)
    {
        network_id = 'matic'
    }
    else
    {
        network_id = 'bsc'
    }
      
    return  `   
                {
                    ethereum(network: `+network_id+`) {
                    dexTrades(
                        options: {limit: 2, desc: "timeInterval.month"}
                        time: {since: "`+volume_time+`"}
                        baseCurrency: {is: "`+contract_address+`"}
                    ) {
                        total_txns : count
                        sell_txns: count(buyCurrency: {is: "`+contract_address+`"})
                        tradeAmount(in: USD)
                        timeInterval {
                        month(count: 2)
                        }
                    }
                    }
                }
            `
} 



const volume24HrsFetchQuery = async (pass_array) =>
{   
    const query = volume24HrsQuery(pass_array)
    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()

    //console.log("trade", result)
    var final_array = {}
    if(!result.errors)
    {   
        if(result.data.ethereum) 
        {   
            if(result.data.ethereum.dexTrades)
            {   
                if(result.data.ethereum.dexTrades[0])
                {
                    return {status:true, message:result.data.ethereum.dexTrades[0]}
                }
                
            }
        }
    }
    return {status:false, message:{}}
}

export const volume24Hrs = async (pass_array)=> 
{
    try
    {  
        const check_query = await volume24HrsFetchQuery(pass_array)
        if(check_query.status)
        {   
            return check_query
        }
        else
        {
            return {status:false, message:{}}  
        }
    }
    catch(err)
    {
        return {status:false, message:{}}    
    }
}
//24hrs Volume Ends Here


export const getNetworkId = (network_name) =>
{
    if(network_name == 'ethereum')
    {
        return 1
    }
    else if(network_name == 'bsc')
    {
        return 2
    }
    else if(network_name == 'matic')
    {
        return 14
    }
    else
    {   
        return 0
    }
}

// //get Last Trade price starts here
// const getLastTradeValues = (type, pass_address) =>
// {
    
// }
// //get Last Trade price ends here
