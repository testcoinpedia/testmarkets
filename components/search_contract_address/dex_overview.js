import React, { useState, useEffect, useRef } from 'react'
import {  API_BASE_URL, config, separator, getURLWebsiteName, getShortWalletAddress, createValidURL, app_coinpedia_url, market_coinpedia_url, IMAGE_BASE_URL, roundNumericValue, volume_time_list } from '../constants'
import { tokenBasic, otherDetails, volume24Hrs, getHighLow24h, sevenDaysDetails } from '../search_contract_address/live_price'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

export default function MyFunction({reqData}) 
{
    const { contract_address, token_symbol, volume, contract_type } = reqData
    const [volume_active_id, set_volume_active_id] = useState(4)
    const [dex_24h_volume, set_dex_24h_volume] = useState("")
    const [sell_txns, set_sell_txns] = useState("")
    const [total_txns, set_total_txns] = useState("")
    const [buy_txns, set_buy_txns] = useState("")
    const [dex_volume, set_dex_volume] = useState("")
    console.log("reqData", reqData)
    
    useEffect(() => 
    {
        getDexVolume(volume_active_id)
    }, [])

    const getDexVolume = async (pass_id) => 
    {
        await set_volume_active_id(pass_id)
        await set_dex_volume("")
        await set_sell_txns("")
        await set_total_txns("")
        await set_buy_txns("")

        var network_type = contract_type
        if(contract_type == 1)
        {
            network_type = 6
        }

        if(contract_address)
        {   
            const volume_time = await getVolumeTime(pass_id)
            const response = await volume24Hrs({network_type:network_type, contract_address:contract_address, volume_time})
            console.log('response_volume', response)
            if(response.status)
            {
                if(response.message.total_txns)
                {   
                    if(pass_id == 4)
                    {
                        await set_dex_24h_volume(response.message.tradeAmount)
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
                <button className="dex_filter_button dropdown-toggle dex_block_bg" type="button" id="volumeDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    24 h <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" class="dropdown_arrow_img" />
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
                    <h4>Dex Overview <span className='info_col' ><img src="/assets/img/information_token.svg" alt="Info" /></span></h4>
                    </div>
                    {/* <div className='volume-tabs'>
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
                     <div className="token_list_values pb-0">
                                <h4>Dex 24H Volume</h4>
                    <div className='volume-details'>
                        <div className='volume-item'>
                            <div className='volume-value'> Txs 
                            <span className='volume-span'>{total_txns ? total_txns:"-"}</span>
                            </div>
                        </div>

                        <div className='volume-item'>
                            <div className='volume-value'> Buys 
                            <span className='volume-span'>{buy_txns ? buy_txns:"-"}</span>
                            </div>
                        </div> 

                        <div className='volume-item'>
                            <div className='volume-value'> Sells 
                            <span className='volume-span'>{sell_txns ? sell_txns:"-"}</span>
                            </div>
                        </div>

                        <div className='volume-item'>
                            <div className='volume-value'> Vol 
                            <span className='volume-span'>{dex_volume ? "$"+roundNumericValue(dex_volume):"-"}</span>
                            </div>
                        </div>
                        </div>
                        </div>
                    </div>
                :
                ""
            }
            
        </div>
    )
}