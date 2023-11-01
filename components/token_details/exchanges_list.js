import React, { useState, useRef, useEffect } from 'react'
import { live_price_graphql } from './graphql'
import {  count_live_price, API_BASE_URL, config, roundNumericValue} from '../constants'
import Axios from 'axios'  
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'


export default function Exchange({exchange_list_new, crypto_type, token_id, ath_price_date})
{
    
    const [exchange_list, set_exchange_list] = useState([])
    const [dex_exchange_list, set_dex_exchange_list] = useState([])
    const [exchange_tab_id, set_exchange_tab_id] = useState(1)
    // console.log("exchange_list",exchange_list)
    
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
     
         //console.log("coingecko1",res.data)
         if(!ath_price_date)
         {
            if(res.data.market_data)
            {  
               updateAthNAtlValues(res.data.market_data)
            }
         }
        
         
         var exchange_list = res.data.tickers
         var myArr = []
         var dexMyArr = []
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
             
             if((i.base).length > 20)
             {
                dexMyArr.push(createObj) 
             }
             else
             {
                myArr.push(createObj)
             }
              
         }
         
         //console.log("resObj",myArr)
         set_dex_exchange_list(dexMyArr)
         set_exchange_list(myArr)
         // return res.data
     
 }).catch(console.error)

//  return resObj
  } 

  const updateAthNAtlValues = async (market_data) =>
  { 
        var req_obj = {}
        req_obj['token_id'] = token_id 
        
        if(market_data.ath.usd)
        {
            req_obj['ath'] = market_data.ath.usd
            req_obj['ath_date'] = market_data.ath_date.usd
        }
        if(market_data.ath.usd)
        {
            req_obj['atl'] = market_data.atl.usd
            req_obj['atl_date'] = market_data.atl_date.usd
        }

        const response = await Axios.post(API_BASE_URL + "markets/tokens/update_ath_atl_details", req_obj, config(""))
        console.log("response", response)
  }

  const getGraphQLData = () =>
  {

  }

  const active_currency = useSelector(state => state.active_currency)

  const convertCurrency = (token_price) =>
  {
    if(active_currency.currency_value)
    {
      return active_currency.currency_symbol+" "+roundNumericValue(token_price*(active_currency.currency_value))
    }
    else
    {
      return "$ "+roundNumericValue(token_price)
    }
  }


  return(
    <>
        {/* <h4 className='tabs_title_token'>Exchange</h4> */}
        <div className='tokendetail_charts exchange_page'>
        <div className='volume-tabs exchange-tabs'>
            <ul className="nav nav-tabs">
                <li className="nav-item" onClick={()=>set_exchange_tab_id(1)}>
                    <a className={"nav-link "+(1 == exchange_tab_id ? "active":"")} data-toggle="tab">
                        <span>Cex Exchanges</span>
                    </a>
                </li>

                <li className="nav-item" onClick={()=>set_exchange_tab_id(2)}>
                    <a className={"nav-link "+(2 == exchange_tab_id ? "active":"")} data-toggle="tab">
                        <span>Dex Exchanges</span>
                    </a>
                </li>
            </ul>
        </div>

        
        <div className='market_page_data exchange_table'>
        <div className="table-responsive">
            <table className="table table-borderless">
                <thead>
                    <tr>
                        <th className='mobile_fixed_first'>Exchange</th>
                        <th>Pairs</th>
                        <th>Price</th>
                        <th>24h Volume</th>
                        <th>Volume %</th>
                        <th className="trust_score">Trust Score</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        exchange_tab_id == 1 ?
                        <>
                        {
                            exchange_list.length>0?
                            exchange_list.map((e, i) => {
                            return <tr key={i}>
                                <td className='mobile_fixed_first'>
                                    <div className='media'>
                                    {/* <div className='media-left align-self-center'>
                                        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" />
                                    </div> */}
                                    <div className='media-body align-self-center m-0'>
                                    {e.exchange_name}
                                    </div>
                                    </div></td>
                                <td >{e.pair_one_name}/{e.pair_two_name}</td>
                                <td>{e.price ? convertCurrency(e.price) : "--"}</td>
                                <td>{e.volume ? convertCurrency(e.volume.toFixed(2)) : "--"}</td>
                                <td>{e.volume_percentage ? e.volume_percentage.toFixed(2) + "%" : "--"}</td>
                                {/* <td>{moment(e.last_traded_at).fromNow()}</td> */}
                            {
                                e.trust_score=="green" ?
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
                        </>
                        :
                        exchange_tab_id == 2 ?
                        <>
                        {
                            dex_exchange_list.length>0?
                            dex_exchange_list.map((e, i) => {
                            return <tr key={i}>
                                <td className='mobile_fixed_first'>
                                    <div className='media'>
                                    {/* <div className='media-left align-self-center'>
                                        <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" />
                                    </div> */}
                                    <div className='media-body align-self-center m-0'>
                                    {e.exchange_name}
                                    </div>
                                    </div></td>
                                <td >{e.pair_one_name}/{e.pair_two_name}</td>
                                <td>{e.price ? convertCurrency(e.price) : "--"}</td>
                                <td>{e.volume ? convertCurrency(e.volume.toFixed(2)) : "--"}</td>
                                <td>{e.volume_percentage ? e.volume_percentage.toFixed(2) + "%" : "--"}</td>
                                {/* <td>{moment(e.last_traded_at).fromNow()}</td> */}
                            {
                                e.trust_score=="green" ?
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
                        </>
                        :
                        <>
                        </>
                    }
                </tbody>
                </table>
        </div>
        </div>
        </div>
    </>            
   )
}
