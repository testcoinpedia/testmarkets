    import { graphql_headers, graphqlApiURL } from '../constants'

    const liquidityQuery = (type, pass_address) =>
    {   
        const one_month_before_date = ((new Date(Date.now() - 30*24 * 60 * 60 * 1000)).toISOString())
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
        
        // console.log("result", result)
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
                        await token_addresses_array.push(innerRun.pair.address) 
                        await liquidity_addresses_array.push(innerRun.poolToken.address.address)
                        await token_symbol_array.push(innerRun.pair.symbol)

                        await liquidity_list.push({
                            exchange_name : innerRun.exchange.fullName,
                            liquidity_address : innerRun.poolToken.address.address,
                            pair_token_address : innerRun.pair.address,
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


    export const getLiquidityAddresses = async (pass_address)=> 
    {
        try
        {  
            // console.log("pass_address", pass_address)
            const check_query = await liquidityFetchQuery(1, pass_address)
            if(!check_query.status)
            {
                const check_query2 = await liquidityFetchQuery(2, pass_address)
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
    //Getting Liquidity Pool addresses ends here
    
    const balanceQuery = ({network_type, token_addresses, liquidity_addresses}) =>
    { 
        var network_id = ''
        if(network_type == 1)
        {
            network_id = 'ethereum'
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

        // console.log("bal result", result)
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