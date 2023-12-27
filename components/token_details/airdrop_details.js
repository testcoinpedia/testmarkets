import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"
import { IMAGE_BASE_URL, roundNumericValue, market_coinpedia_url} from '../constants'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { AddToCalendarButton } from 'add-to-calendar-button-react'

export default function MyFunction({airdrops, token_symbol, token_image, coinmarketcap_id, today_date}) 
{   
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/128x128/')
    const [is_client_load, set_is_client_load] = useState(false)

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

                            <div className='token-details-add-to-calender '  >
                                {
                                    item.start_date ?
                                    <AddToCalendarButton
                                        name={item.title+" ("+item.symbol+")"}
                                        startDate={(moment.utc(item.start_date).format("YYYY-MM-DD")).toString()}
                                        endDate={(moment.utc(item.end_date).format("YYYY-MM-DD")).toString()}
                                        description={item.description}
                                        options={['Apple', 'Google', 'iCal']}
                                        buttonStyle="custom"
                                        label="&nbsp;"
                                        listStyle="overlay"
                                        trigger="click"
                                        customCss={market_coinpedia_url+"assets/css/atcb.css"}
                                    />
                                    :
                                    ""
                                }
                            </div>
                        </h4>
                        <p>{convertCurrency(item.winner_price*item.participating_users)} worth of {token_symbol} to {item.participating_users} Lucky Winners</p>
                    </div>
                </div>
                <div className='details_airdrop_card'>
                    <div className='row'>
                        <div className='col-md-4'>
                            <p>Amount</p>
                            <h6>{convertCurrency(item.winner_price)} of {token_symbol}/winner</h6>
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
                    <a href={item.participate_link} target='_blank'><button className='detail_button button_transition'>Join Now</button></a>
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