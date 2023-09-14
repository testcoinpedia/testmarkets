import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"
import { IMAGE_BASE_URL} from '../constants'
import moment from 'moment'

export default function MyFunction({airdrops, token_symbol, token_image, coinmarketcap_id, today_date}) 
{   
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/128x128/')
   
    return (
        <>
        {
            airdrops.length ?
            airdrops.map((item, i) =>
            <div className={'details_airdrop'+(i > 0 ? " mt-3":"")}  key={i}>
                <div className='media'>
                    <div className='media-left align-self-center'>
                    <img src={(token_image ? image_base_url+token_image: coinmarketcap_id ? cmc_image_base_url+coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.title} />
                    </div>
                    <div className='media-body align-self-center'>
                        <h4>{item.title} 

                                {
                                    moment(today_date).isBefore(moment(item.start_date).format('ll')) ?
                                    <button className='upcoming_button ico_button'  >Upcoming</button>
                                    :
                                    moment(today_date).isAfter(moment(item.start_date).format('ll')) && moment(today_date).isBefore(item.end_date) ?
                                    <button className='live_button ico_button' >Live</button>
                                    :
                                    moment(moment(item.end_date).format('ll')).isSame(today_date) || moment(moment(item.start_date).format('ll')).isSame(today_date) ?
                                    <button className='live_button ico_button' >Live</button>
                                    :
                                    moment(moment(item.end_date).format('ll')).isBefore(today_date) ?
                                    <button className='completed_button ico_button'>Ended</button>
                                    :
                                    null
                                }
                        </h4>
                        <p>${(item.winner_price*item.participating_users).toFixed(0)} worth of {token_symbol} to {item.participating_users} Lucky Winners</p>
                    </div>
                </div>
                <div className='details_airdrop_card'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <p>Amount</p>
                            <h6>${item.winner_price} of {token_symbol}/winner</h6>
                        </div>
                        <div className='col-md-4 col-6 airdrop_col'>
                            <p>Start Date</p>
                            <h6>{moment(item.start_date).utc().format("MMM DD, YYYY")}</h6>
                        </div>
                        <div className='col-md-4 col-6 airdrop_col'>
                            <p>End Date</p>
                            <h6>{moment(item.end_date).utc().format("MMM DD, YYYY")}</h6>
                        </div>
                    </div>
                </div>
                <div className='detail_airdrop_data'>
                    <h5> Airdrop Info </h5>
                    <p>
                        {
                            item.description
                        }
                    </p>

                    {
                        item.how_to_participate ?
                        <>
                            <h5>How to Participate Airdrop </h5>
                            <div dangerouslySetInnerHTML={{__html:item.how_to_participate}} />
                        </>
                        :
                        ""
                    }
                </div>
                 {
                    item.participate_link ?
                    <div className=''>
                    <a href={item.participate_link} target='_blank'><button className='detail_button button_transition'>Join Now</button></a>
                    </div>
                    :
                    ""
                 }           
                
            </div>
            )
            :
            ""
        }
        
        </>
      
    )
}