import React, { useState, useEffect, useRef } from 'react'
import {  API_BASE_URL, config, separator, getURLWebsiteName, getShortWalletAddress, createValidURL, app_coinpedia_url, market_coinpedia_url, IMAGE_BASE_URL, roundNumericValue, volume_time_list } from '../constants'
import { tokenBasic, otherDetails, volume24Hrs, getHighLow24h, sevenDaysDetails } from '../search_contract_address/live_price'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import dynamic from "next/dynamic";
const AnimatedNumbers = dynamic(() => import("react-animated-numbers"), {
  ssr: false,
})


export default function MyFunction({reqData}) 
{
    const { token_id, contracts_array, token_symbol, token_price, volume } = reqData
    const [volume_active_id, set_volume_active_id] = useState(4)
    const [dex_24h_volume, set_dex_24h_volume] = useState("")
    const [sell_txns, set_sell_txns] = useState("")
    const [total_txns, set_total_txns] = useState("")
    const [buy_txns, set_buy_txns] = useState("")
    const [dex_volume, set_dex_volume] = useState("")
    const [sort_type, set_sort_type] = useState(4)

    
    useEffect(() => 
    {
        getDexVolume(volume_active_id)
    },  [sort_type])

    const getDexVolume = async (pass_id) => 
    {
        await set_volume_active_id(pass_id)
        await set_dex_volume("")
        // await set_sell_txns("")
        // await set_total_txns("")
        // await set_buy_txns("")
        if(contracts_array.length)
        {
            if(contracts_array[0].contract_address)
            {   
                const volume_time = await getVolumeTime(pass_id)
                const response = await volume24Hrs({network_type:contracts_array[0].network_row_id, contract_address:contracts_array[0].contract_address, volume_time})
                //console.log('response_volume', response)
                if(response.status)
                {
                    if(response.message.total_txns)
                    {   
                        if(pass_id == 4)
                        {
                            await set_dex_24h_volume(response.message.tradeAmount)
                            reqData.callback(response.message)
                        }
                        await set_dex_volume(response.message.tradeAmount)
                        await set_sell_txns(response.message.sell_txns)
                        await set_total_txns(response.message.total_txns)
                        if(response.message.total_txns)
                        { 
                            await set_buy_txns(response.message.total_txns-response.message.sell_txns)
                        }
                    }
                }  
            }
        }
    }
    
    const getVolumeTime = (pass_id) =>
    {
        if(pass_id == 1)
        {
            return ((new Date(Date.now() - 60 * 60 * 1000)).toISOString())
        }
        else if(pass_id == 2)
        {
            return ((new Date(Date.now() - 6 * 60 * 60 * 1000)).toISOString())
        }
        else if(pass_id == 3)
        {
            return ((new Date(Date.now() - 12 * 60 * 60 * 1000)).toISOString())
        }
        else if(pass_id == 5)
        {
            return ((new Date(Date.now() - 7*24 * 60 * 60 * 1000)).toISOString())
        }
        else 
        {
            return ((new Date(Date.now() -  24*60 * 60 * 1000)).toISOString())
        }
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
        return roundNumericValue(token_price)
      }
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    
    return (
        <div>
            {
                dex_24h_volume ? 
                <div className="dex-volume">
                    <div className='row'>
                        <div className='col-3'>
                       <div className='dex_filter'>
                       <div className="dropdown">
                <button className="dex_filter_button dropdown-toggle" type="button" id="volumeDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    24 h <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" class="dropdown_arrow_img"></img>
                </button>
                <div className={`dropdown_block badge_dropdown_block dropdown-menu ${isOpen ? 'closed' : 'open'}`} aria-labelledby="volumeDropdown">
                    {volume_time_list.map((item, i) => (
                        <a key={item._id} className="dropdown-item" onClick={() => getDexVolume(item._id)}>
                            {item.name}
                        </a>
                    ))}
                </div>
            </div>
                       {/* <select className="form-control" onChange={(event) => getDexVolume(event.target.value)}>
                            {volume_time_list.map((item) => (
                                <option key={item._id} value={item._id} selected={item._id === volume_active_id}>
                                {item.name}
                                </option>
                            ))}
                            </select> */}
                                </div>
                                
                            </div>
                            <div className='col-9 pl-0'>
                            <h4 className='trading_volume'>Trading volume : <span className='float-right'>$5,548,145,484.19</span> </h4>
                                  
                                </div>
                        </div>
            
                    
                            <div className="token_list_values pb-0">
                                <h4>Cex 24H Volume &nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                    overlay={(props) => (
                                    <Tooltip {...props} className="custom_pophover">
                                        <p>Cex Volume: Total trading volume of the asset on all centralized exchanges (active pools of pairs) in 24 hours.</p>
                                    </Tooltip>
                                    )}
                                    placement="bottom"
                                ><span className='info_col' ><img src="/assets/img/information_token.svg" alt="Info" /></span>
                                </OverlayTrigger>

                                <span className='value_dex'> {(volume && dex_24h_volume) ? convertCurrency(volume-dex_24h_volume):"-"}</span>
                                </h4>
                            </div>
                       
                            <div className="token_list_values pb-0">
                                <h4>Dex 24H Volume &nbsp;
                                <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                    overlay={(props) => (
                                    <Tooltip {...props} className="custom_pophover">
                                        <p>Dex Volume: Total trading volume of the asset on all decentralized exchanges(active pools of pairs) in 24 hours. Adjust timewise view available.</p>
                                    </Tooltip>
                                    )}
                                    placement="bottom"
                                ><span className='info_col' ><img src="/assets/img/information_token.svg" alt="Info" /></span>
                                </OverlayTrigger>

                                <span className='value_dex'> {dex_24h_volume ? convertCurrency(dex_24h_volume):"-"}</span>
                                </h4>

                                <div className='volume-details'>
                        <div className='volume-item'>
                            <div className='volume-value'> Txs 
                            <span className='volume-span'>
                                <AnimatedNumbers
                                    
                                    locale="en-US"
                                    animateToNumber={total_txns ? total_txns:"-"}
                                    configs={[
                                        [
                                            { mass: 1, tension: 220, friction: 100 }
                                        ]
                                    
                                    ]}
                                ></AnimatedNumbers>
                                
                            </span>
                            </div>
                        </div>

                        <div className='volume-item'>
                            <div className='volume-value'> Buys 
                            <span className='volume-span'>
                            <AnimatedNumbers
                                
                                locale="en-US"
                                animateToNumber={buy_txns ? buy_txns:"-"}
                                configs={
                                        [
                                            { mass: 1, tension: 220, friction: 100 },
                                           
                                        ]
                                    }
                            ></AnimatedNumbers>
                                
                                </span>
                            </div>
                        </div>

                        <div className='volume-item'>
                            <div className='volume-value'> Sells 
                            <span className='volume-span'>
                                    <AnimatedNumbers
                                    locale="en-US"
                                    
                                    animateToNumber={sell_txns ? sell_txns:"-"}
                                    configs={[
                                        { mass: 1, tension: 220, friction: 100 },
                                    ]}
                                ></AnimatedNumbers>
                                
                            </span>
                            </div>
                        </div>

                        <div className='volume-item'>
                            <div className='volume-value'> Vol
                            <span className='volume-span'>
                                {dex_volume ? convertCurrency(dex_volume):"-"}
                            </span>
                            </div>
                        </div>
                        </div>
                            </div>
                       
                
                    
                    {/* <div className="token_list_values pb-0">
                    <h4>Dex Overview: &nbsp;</h4>
                    </div>
                    <div className='volume-tabs'>
                        <ul className="nav nav-tabs">
                        {
                            volume_time_list.map((item, i)=>
                            <li className="nav-item" onClick={()=>getDexVolume(item._id)}>
                            <a className={"nav-link "+(item._id == volume_active_id ? "active":"")} data-toggle="tab">
                                <span>{item.name}</span>
                            </a>
                            </li>
                            )
                        }
                        </ul>
                        
                    </div> */}
                   
                    </div>
                :
                ""
            }
            
        </div>
    )
}