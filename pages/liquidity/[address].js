import React, { useEffect, useState } from 'react'
import { API_BASE_URL, config, graphql_headers, getShortWalletAddress, separator, graphqlApiKEY, app_coinpedia_url, IMAGE_BASE_URL } from '../../components/constants'
import { tokenBasic, otherDetails, getVolume24h, getHighLow24h } from '../../components/search_contract_address/live_price'
import { getLiquidityAddresses, getBalanceAddresses } from '../../components/search_contract_address/liquidity_pool'
import Search_token from '../../components/search_token'
import { ethers } from 'ethers'
import Web3 from 'web3'
import Head from 'next/head'
import Axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import News from '../../components/token_details/news'
import Events from '../../components/token_details/events'
import Price_analysis from '../../components/token_details/price_analysis'
import Price_prediction from '../../components/token_details/price_prediction'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import ReactPaginate from 'react-paginate'
import Price_chart from '../../components/search_contract_address/charts/price'
import { bitgquery_graph_ranges } from '../../components/token_details/custom_functions' 

export default function WalletDetails({address}) 
{   
    const [liquidity_pools, set_liquidity_pools] = useState([])
    const [token_basic, set_token_basic] = useState({})
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')

    useEffect(() => 
    {
       getLiquidityDetails()
    }, [])

    const getLiquidityDetails = async () =>
    {
        const response = await getLiquidityAddresses(address)
        const token_response = await tokenBasic(address)
        
        var token_price = 0
        var token_symbol = ""
        var token_name = ""
        if(token_response.message)
        {
            token_price = token_response.message.live_price
            token_symbol  = token_response.message.symbol
            token_name= token_response.message.name
        }

        // console.log("token_response", token_response)

        var final_result = []
        if(response.status)
        {   
            var balances_result = []
            const first_response = await getBalanceAddresses(response.message)
            if(first_response.status)
            {
                balances_result = first_response.message
            }

            const price_list = await priceList(response.message.token_symbols)

            for(let run of response.message.liquidity_list)
            {   
                const filter_data = await balances_result.filter(function (el) { return el.address == run.liquidity_address})
                var pair_token_balance = 0
                var token_balance = 0
                if(filter_data[0])
                {
                    const addr_balance_array = await filter_data[0].balances.filter(function (el) { return el.currency.address == address.toLowerCase()})
                    token_balance = addr_balance_array[0]?.value

                    const pair_balance_array = await filter_data[0].balances.filter(function (el) { return el.currency.address == (run.pair_token_address).toLowerCase()})
                    pair_token_balance = pair_balance_array[0]?.value
                }
                var pair_token_price = 0
                var pair_token_image = ""
                const price_array = await price_list.filter(function (el) { return el.symbol == run.pair_token_symbol})
                if(price_array[0])
                {
                    pair_token_price = price_array[0]?.price
                    pair_token_image = price_array[0]?.token_image
                }

                

                
                await final_result.push({
                    exchange_name : run.exchange_name,
                    liquidity_address : run.liquidity_address,
                    pair_token_address : run.pair_token_address,
                    pair_token_name : run.pair_token_name,
                    pair_token_symbol : run.pair_token_symbol,
                    trade_amount : run.trade_amount,
                    trades : run.trades,
                    pair_token_balance: pair_token_balance,
                    pair_token_price: pair_token_price,
                    token_price:token_price,
                    token_symbol:token_symbol,
                    token_name:token_name,
                    pair_token_image:pair_token_image,
                    token_balance: token_balance
                })
            }
            // console.log("final_result", final_result)
            await set_liquidity_pools(final_result)
           
            

            // const token_symbols = response.message.token_symbols
            // var prices_array = []
            // const prices_res = await Axios.post(API_BASE_URL + "markets/cryptocurrency/get_prices_by_symbols/", {token_symbols}, config())
            // if(prices_res.data.status) 
            // {
            //     prices_array = await prices_res.data.message
            //     console.log("prices_res", prices_res)
            // }
            // var result = []
            // for(let run of token_symbols)
            // {
            //     const filter_data = await prices_array.filter(function (el) { return el.symbol == run})
            //     if(filter_data.length)
            //     {
            //         await result.push(filter_data[0])
            //     }
            //     else
            //     {
            //         tokenBasic
            //     }   
            // }

            // // token_symbols
            
            //
        }


    }

    const priceList = async (token_symbols) =>
    {
         var prices_array = []
        const prices_res = await Axios.post(API_BASE_URL + "markets/cryptocurrency/get_prices_by_symbols/", {token_symbols}, config())
        if(prices_res.data.status) 
        {
            prices_array = await prices_res.data.message
            // console.log("prices_res", prices_res)
        }
        return prices_array
    }

    return (
        <>  
           <div className='container mt-4 mb-4'>
            <div>
            <table className='table table-bordered'>
                <thead>
                    <tr>
                    <th>#</th>
                    <th>Exchange Name</th>
                    <th>Pairs</th>
                    <th>Liquidity Balance</th>
                    <th>Liquidity Price</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        liquidity_pools.length ?
                        liquidity_pools.map((item, i) => 
                        <tr>
                            <td>{++i}</td>
                            <td>
                                {item.exchange_name} <br/>
                                {getShortWalletAddress(item.liquidity_address)}
                            </td>
                            <td>
                            <img style={{width:"25px"}} src={( image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} /> {item.token_symbol} <small>{getShortWalletAddress(address)}</small>
                            <br/><img style={{width:"25px"}} src={(item.pair_token_image ? image_base_url+item.pair_token_image: image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} /> {item.pair_token_symbol} <small>{getShortWalletAddress(item.pair_token_address)}</small>
                               
                                {/* {item.token_name} */}
                            </td>
                            <td>
                                {item.token_balance? (item.token_balance).toFixed(2):0}
                                <br/>
                                {item.pair_token_balance ? (item.pair_token_balance).toFixed(2):0}
                            </td>
                            <td>
                                {
                                ((item.pair_token_balance && item.pair_token_price ? item.pair_token_balance*item.pair_token_price:0)+(item.token_balance && item.token_price ? item.token_price*item.token_balance:0)).toFixed(2)
                                }
                            </td>
                            <td></td>
                        </tr>
                        )
                        :
                        ""
                    }
                </tbody>
            </table>  
            </div>
            </div> 
        </>
    )
}


export async function getServerSideProps({query, req}) 
{
    return { props: { data:{}, address: query.address ? (query.address).toLowerCase():"" } }
}