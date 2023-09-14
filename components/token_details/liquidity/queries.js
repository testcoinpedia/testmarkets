import { graphql_headers, graphqlApiURL } from '../../constants'

const liquidityQuery = (type, pass_address) =>
{   
    const one_month_before_date = ((new Date(Date.now() - 180*24 * 60 * 60 * 1000)).toISOString())
    //1:ETH, 2:BNB
    var network_id = ''
    if(type == 6)
    {
        network_id = 'ethereum'
    }
    else if(type == 14)
    {
        network_id = 'matic'
    }
    else
    {
        network_id = 'bsc'
    }

    return  `
                {
                ethereum(network: `+network_id+`) 
                {
                    dexTrades(
                    quoteCurrency: {is: "`+pass_address+`"}
                    options: {desc: ["tradeAmount", "trades"], limit: 40}
                    date: {after: "`+one_month_before_date+`"}
                    ) {
                    poolToken: smartContract {
                        address {
                        address
                        }
                    }
                    exchange {
                        fullName
                    }
                    pair: baseCurrency {
                        symbol
                        address
                        name
                    }
                    trades: count
                    tradeAmount(in: USD)
                    }
                }
                }
            `
} 

const liquidityFetchQuery = async (type, pass_address) =>
{ 
    const query = liquidityQuery(type, pass_address)
    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()
    
    //console.log("result", result)
    var final_array = {}
    var token_addresses_array = []
    var token_symbol_array = []
    var liquidity_addresses_array = []
    var liquidity_list = []
    if(!result.errors)
    {   
        if(result.data.ethereum) 
        {   
            if(result.data.ethereum.dexTrades) 
            {
                final_array['liquidity_list'] = result.data.ethereum.dexTrades

                for(let innerRun of result.data.ethereum.dexTrades)
                {   
                   
                    if(innerRun.pair.address == '-')
                    {
                        await token_addresses_array.push("0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee") 
                    }
                    else
                    {
                        await token_addresses_array.push(innerRun.pair.address) 
                    }
                    
                    await liquidity_addresses_array.push(innerRun.poolToken.address.address)
                    await token_symbol_array.push(innerRun.pair.symbol)

                    await liquidity_list.push({
                        exchange_name : innerRun.exchange.fullName,
                        liquidity_address : innerRun.poolToken.address.address,
                        pair_token_address : innerRun.pair.address != '-' ? innerRun.pair.address:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                        pair_token_name : innerRun.pair.name,
                        pair_token_symbol : innerRun.pair.symbol,
                        trade_amount : innerRun.tradeAmount,
                        trades : innerRun.trades,
                    })
                }
                await token_addresses_array.push(pass_address)
                final_array['network_type'] = type
                final_array['token_symbols'] = await token_symbol_array
                final_array['token_addresses'] = await token_addresses_array
                final_array['liquidity_addresses'] = await liquidity_addresses_array
                final_array['liquidity_list'] = await liquidity_list
            }
        }
        return {status:true, message:final_array}
    }
    return {status:false, message:{}}
}


export const getLiquidityAddresses = async (network_type, pass_address)=> 
{
    try
    {  
        const check_query = await liquidityFetchQuery(network_type, pass_address)
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
//Getting Liquidity Pool addresses ends here

const balanceQuery = ({network_type, token_addresses, liquidity_addresses}) =>
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

    var liquidity_addresses_str = ""
    for(let run of liquidity_addresses)
    {   
        liquidity_addresses_str += '"'+run+'"'
    }

    var token_addresses_str = ""
    for(let run of token_addresses)
    {   
        token_addresses_str += '"'+run+'", '
    }

    
    return  `   
                {
                    ethereum(network: `+network_id+`) {
                    address(address: {in: [`+liquidity_addresses_str+`] }) {
                        balances(currency: {in: [`+token_addresses_str+`] }) {
                        currency {
                            symbol
                            address
                        }
                        value
                        }
                        address
                    }
                    }
                }
            `
} 

const balanceFetchQuery = async ({network_type, token_addresses, liquidity_addresses}) =>
{   
    const query = balanceQuery({network_type, token_addresses, liquidity_addresses})
    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()

    //console.log("bal result", result)
    var final_array = {}
    if(!result.errors)
    {   
        if(result.data.ethereum) 
        {   
            if(result.data.ethereum.address)
            {   
                return {status:true, message:result.data.ethereum.address}
            }
        }
    }
    return {status:false, message:{}}
}


export const getBalanceAddresses = async (pass_array)=> 
{
    try
    {  
        const check_query = await balanceFetchQuery(pass_array)
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

//Getting Liquidity Balances ends here




//Getting Liquidity Address Trade History Starts Here
const tradeHistoryQuery = ({sort_type, network_type, liquidity_address, limit, offset}) =>
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
    
    var sort_type_string = `desc: "block.timestamp.time"`
    if(sort_type == 2)
    {
        sort_type_string = `desc: ["baseAmount", "quoteAmount"]`
    }
    else if(sort_type == 3)
    {
        sort_type_string = `asc: ["baseAmount", "quoteAmount"]`
    }
    else if(sort_type == 4)
    {
        sort_type_string = `asc: "block.timestamp.time"`
    }

    // {
    //     (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
    //         <span>
    //         {separator((innerItem.sellAmount).toFixed(2))}
    //         </span>
    //         :
    //         <span>
    //         {separator((innerItem.buyAmount).toFixed(2))}
    //         </span>
    // } 
      
    return  `   
            {
                ethereum(network: `+network_id+`) 
                {
                    dexTrades(
                        options: {`+sort_type_string+`, limit:`+limit+`, offset:`+offset+`}
                        any: {buyAmount:{gt: 0}, sellAmount:{gt: 0}, baseCurrency: {is: "`+liquidity_address+`"}}
                    ) 
                    {
                        buyCurrency {
                        address
                        }
                        sellCurrency {
                        address
                        }
                        baseCurrency {
                        address
                        }
                        quoteCurrency {
                        address
                        }
                        block {
                        timestamp {
                            time(format: "%Y-%m-%dT%H:%M:%SZ")
                        }
                        }
                        price(calculate: average)
                        quotePrice(calculate: average)
                        buyAmount(calculate: sum)
                        sellAmount(calculate: sum)
                        baseAmount(calculate: sum)
                        quoteAmount(calculate: sum)
                        buyAmountUSD: buyAmount(calculate: sum, in: USD)
                        sellAmountUSD: sellAmount(calculate: sum, in: USD)
                        baseAmountUSD: baseAmount(calculate: sum, in: USD)
                        quoteAmountUSD: quoteAmount(calculate: sum, in: USD)
                        sell_rate: expression(get: "sellAmountUSD / buyAmount")
                        buy_rate: expression(get: "buyAmountUSD / sellAmount")
                        transaction {
                        hash
                        txFrom {
                            address
                        }
                        }
                    }
                }
            }
            `


            // {
            //     ethereum(network: `+network_id+`) 
            //     {
            //         transfers(
            //             options: {desc: "block.timestamp.time", limit:`+limit+`, offset:`+offset+`}
            //             currency: {is: "`+liquidity_address+`" }
            //         ) 
            //         {
            //             currency {
            //             name
            //             symbol
            //             }
            //             block {
            //             timestamp {
            //                 time(format: "%Y-%m-%dT%H:%M:%SZ")
            //             }
            //             }
            //             transaction {
            //             hash
            //             txFrom {
            //                 address
            //             }
            //             }
            //             receiver (receiver: {not: "`+liquidity_address+`"}) {
            //             address
            //             annotation
            //             }
            //             success
            //             amount
                        
            //         }
            //     }
            // }
} 



const tradeHistoryFetchQuery = async ({network_type, liquidity_address, sort_type, limit, offset}) =>
{   
    const query = tradeHistoryQuery({network_type, liquidity_address, sort_type, limit, offset})
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
                return {status:true, message:result.data.ethereum.dexTrades}
            }
        }
    }
    return {status:false, message:{}}
}


export const tradeHistory = async (pass_array)=> 
{
    try
    {  
        const check_query = await tradeHistoryFetchQuery(pass_array)
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

const tradeHistoryQueryForTV = ({network_type, liquidity_address}) =>
{   
    const start_date = ((new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)).toISOString())

    var network_id = ''
    if(network_type == 6)
    {
        network_id = 'ethereum'
    }
    else if(network_type == 14)
    {
        network_id = 'matic'
    }
    else if(network_type == 2)
    {
        network_id = 'bsc'
    }

    if(network_id)
    {
        return  `   
            {
                ethereum(network: `+network_id+`) 
                {
                    dexTrades(
                        options: {asc: "block.timestamp.time"}
                        any: {smartContractAddress: {is: "`+liquidity_address+`"}}
                    ) 
                    {
                        buyCurrency {
                        address
                        }
                        sellCurrency {
                        address
                        }
                        baseCurrency {
                        address
                        }
                        quoteCurrency {
                        address
                        }
                        block(time: {since: "`+start_date+`"}) {
                            timestamp {
                                time(format: "%Y-%m-%dT%H:%M:%SZ")
                            }
                        }
                        price(calculate: average)
                        quotePrice(calculate: average)
                        buyAmount(calculate: sum)
                        sellAmount(calculate: sum)
                        baseAmount(calculate: sum)
                        quoteAmount(calculate: sum)
                        buyAmountUSD: buyAmount(calculate: sum, in: USD)
                        sellAmountUSD: sellAmount(calculate: sum, in: USD)
                        baseAmountUSD: baseAmount(calculate: sum, in: USD)
                        quoteAmountUSD: quoteAmount(calculate: sum, in: USD)
                        sell_rate: expression(get: "sellAmountUSD / buyAmount")
                        buy_rate: expression(get: "buyAmountUSD / sellAmount")
                        transaction {
                        hash
                        txFrom {
                            address
                        }
                        }
                    }
                }
            }
            `
    }

}


const tradeHistoryFetchQueryForTV = async ({network_type, liquidity_address}) =>
{   
    const query = tradeHistoryQueryForTV({network_type, liquidity_address})
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
                return {status:true, message:result.data.ethereum.dexTrades}
            }
        }
    }
    return {status:false, message:{}}
}


export const tradeHistoryForTV = async (pass_array)=> 
{
    try
    {  
        const check_query = await tradeHistoryFetchQueryForTV(pass_array)
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


//Getting Liquidity Address Trade History Ends Here

