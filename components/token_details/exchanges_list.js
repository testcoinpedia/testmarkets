import React, { useState, useRef, useEffect } from 'react'
import { live_price_graphql } from './graphql'
import {  count_live_price} from '../constants'
import Axios from 'axios'  
import moment from 'moment'


export default function Exchange({exchange_list_new, crypto_type, token_id})
{
    
    const [exchange_list, set_exchange_list] = useState([])
    console.log("exchange_list",exchange_list)
 
    //crypto_type -> 1:coin, 2:token
    useEffect( () => 
  {
    if(crypto_type == 1) 
    {
        getCoingeckoData(token_id)
    }
    else if(crypto_type == 2)
    {
        getGraphQLData(token_id)
    }
  }, [])


  const getCoingeckoData = async(token_id) =>
  { 
    var req_token_id = token_id
    if(token_id == "bnb")
    {
        req_token_id = 'binancecoin'
    }
    // var resObj = {}
    await Axios.get("https://api.coingecko.com/api/v3/coins/"+req_token_id).then(res=>{
     if(res.data)
     
         console.log("coingecko1",res.data)
         var exchange_list = res.data.tickers
         var myArr = []
         for(var i of exchange_list)
         {
             var createObj = {}
             createObj['exchange_name'] = i.market.name
             createObj['pair_one_name'] = i.base
             if((i.base).length > 6)
             {
                 createObj['pair_one_name'] = (i.base).slice(0,4)+"..."+(i.base).slice((i.base).length - 4 , (i.base).length)
             }
             createObj['pair_two_name'] = i.target
 
             if((i.target).length > 6)
             {
                 createObj['pair_two_name'] = (i.target).slice(0,4)+"..."+(i.target).slice((i.target).length - 4 , (i.target).length)
             }
 
             createObj['price'] = count_live_price(i.last)
             createObj['volume_percentage'] = i.bid_ask_spread_percentage
             createObj['volume'] = i.volume
             createObj['last_traded_at'] = i.last_traded_at
             createObj['trust_score'] = i.trust_score
             
              myArr.push(createObj) 
         }
 
         console.log("resObj",myArr)
         set_exchange_list(myArr)
         // return res.data
     
 }).catch(console.error)

//  return resObj
  } 


  const getGraphQLData = () =>
  {
    
  }


  return(
    <>
        {/* <h4 className='tabs_title_token'>Exchange</h4> */}
        <div className='tokendetail_charts exchange_page'>
        <div className='market_page_data exchange_table'>
        <div className="table-responsive">
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th className='mobile_fixed_first'>Exchange</th>
                        <th>Pairs</th>
                        <th>Liquidity in Pool</th>
                        <th>Trades Count</th>
                        <th>Takers</th>
                        <th>Makers</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        exchange_list.length>0?
                        exchange_list.map((e, i) => {
                        return <tr key={i}>
                            <td className='mobile_fixed_first'>
                                <div className='media'>
                                <div className='media-left align-self-center'>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" />
                                </div>
                                <div className='media-body align-self-center m-0'>
                                {e.exchange_name}
                                </div>
                                </div></td>
                            <td >{e.pair_one_name} / {e.pair_two_name}</td>

                            <td>{e.price ? "$" + e.price : "--"}</td>
                            <td>{e.volume_percentage ? e.volume_percentage.toFixed(2) + "%" : "--"}</td>
                            <td>{e.volume ? "$" + e.volume.toFixed(2) : "--"}</td>
                            <td>{moment(e.last_traded_at).fromNow()}</td>
                           {e.trust_score=="green"?
                            <td className='green_dot'>
                                <div></div>
                            </td>
                            :
                            e.trust_score=="red"?
                            <td className='red_dot'>
                                <div></div>
                            </td> 
                            :
                            e.trust_score=="yellow"?
                            <td className='yellow_dot'>
                                <div></div>
                            </td> 
                            :
                            ""
                        }
                        </tr>
                        })
                        :
                        <tr>
                            <td colSpan={7} className='text-center'>
                                Sorry, No related data found
                            </td>
                        </tr>
                    }
                </tbody>
                </table>
        </div>
        </div>
        </div>
    </>            
   )
}
