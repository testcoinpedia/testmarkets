import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Axios from 'axios'
import JsCookie from "js-cookie"
import { getLaunchpadType } from '../../config/helper' 
import { roundNumericValue, separator } from '../../components/constants' 
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'

export default function MyFunction({launchpads, today_date, token_symbol}) 
{
    // console.log("today_date", today_date)
    // console.log("launchpads", launchpads)
    const [collapse_value, set_collapse_value] = useState(false)

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

    return (
        <>
        {
            launchpads.length ?
            launchpads.map((item, i) =>
            <div className={'ico_details'+(i > 0 ? " mt-3":"")} key={i}>
                <div className='row'>
                    <div className='col-md-7 col-6'>
                    <h4 className='ico_heading' data-toggle="collapse" href={"#data_ico"+item._id} onClick={()=>set_collapse_value(item._id)}>
                    {item.title} 
                    </h4>
                    {/* - Round 1, */}
                    </div>
                    <div className='col-md-5 col-6'>
                        <div className='ico_status_button'>
                            <div className={`dropdown `}>
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
                                <img className='dropdown_ico collapsed ' src="/assets/img/dropdown_icon.png" data-toggle="collapse" href={"#data_ico"+item._id} alt="Dropdown" />
                            </div>
                        </div>
                    </div>
                </div>
                <h5 className="launchpad_type"><span>{ getLaunchpadType(item.launchpad_type) }</span></h5>
                {
                    item.start_date || item.end_date ?
                    <h6 className='ico_dates'>
                        {
                            item.start_date ?
                            <>
                            <img src="/assets/img/calander.png" className="calander_vertical_align" alt="Calendar"/>
                            {moment(item.start_date).utc().format('ll')}
                            </>
                            :
                            ""
                        }

                        {
                            item.end_date ?
                            <>
                            &nbsp;  -  {moment(item.end_date).utc().format('ll')}
                            </>
                            :
                            ""
                        }
                    </h6>
                    :
                    ""
                }
                
                
                
                <div className='ico_prices'>
                    <div className='row'>
                        <div className='col-md-3 col-6'>
                            <div className="ico_detail_block">
                                <p>ICO Price</p>
                                <h5>
                                    {
                                        item.launchpad_price ?
                                        <>
                                            {convertCurrency(item.launchpad_price)}
                                        </>
                                        :
                                        <>
                                            TBA
                                        </>
                                    }
                                </h5>
                            </div>
                        </div>
                        
                        
                        <div className='col-md-3 col-6'>
                            <div className="ico_detail_block">
                                <p>Listing Price</p>
                                <h5 className='values_growth'>
                                    {
                                        item.listing_price ?
                                        <>
                                        {convertCurrency(item.listing_price)} 
                                        {
                                            item.launchpad_price ?
                                                (((item.listing_price-item.launchpad_price)/item.listing_price)*100).toFixed(2)  > 0 ?
                                                <span className="green"><img src="/assets/img/markets/high.png" alt="high price" />{(((item.listing_price-item.launchpad_price)/item.launchpad_price)*100).toFixed(2)} %</span>
                                                :
                                                (((item.listing_price-item.launchpad_price)/item.listing_price)*100).toFixed(2) < 0 ?
                                                <span className="red"><img src="/assets/img/markets/low.png" alt="high price" />{(((item.listing_price-item.launchpad_price)/item.launchpad_price)*100).toFixed(2)} %</span>
                                                :
                                                ""
                                            :
                                            ""
                                        }
                                        </>
                                        :
                                        <>TBA</>
                                    }
                                </h5>
                            </div>
                        </div>
                        
                        
                        <div className='col-md-3 col-6'>
                            <div className="ico_detail_block">
                                <p>Soft Cap</p>
                                <h5>
                                    {
                                        item.soft_cap ?
                                        <>{convertCurrency(item.soft_cap)}</>
                                        :
                                        <>TBA</>
                                    }
                                </h5>
                            </div>
                        </div>

                        <div className='col-md-3 col-6'>
                            <div className="ico_detail_block">
                                <p>Tokens for Sale</p>
                                <h5>
                                    {
                                        item.tokens_for_sale ?
                                        <>
                                            {item.tokens_for_sale} {token_symbol}
                                        </>
                                        :
                                        <>
                                            TBA
                                        </>
                                    }
                                </h5>
                            </div>
                        </div>

                        <div className='col-md-3 col-6'>
                            <div className='ico_detail_block'>
                                <p>Access</p>
                                <h5>
                                   {
                                       item.access_type == 1?
                                       <>
                                           Public 
                                       </>
                                       :
                                       <>
                                           Private
                                       </>
                                   }
                                </h5>
                            </div>
                        </div>
                        {
                            item.percentage_of_total_supply ?
                            <div className='col-md-3 col-6'>
                                <div className='ico_detail_block'>
                                    <p>Total Supply(%)</p>
                                    <h5>{(item.percentage_of_total_supply).toFixed(2)}%</h5>
                                </div>
                            </div>
                            :
                            ""
                        }
                        
                        {
                            item.network_name ?
                            <div className='col-md-3 col-6'>
                                <div className='ico_detail_block'>
                                    <p>Network</p>
                                    <h5>{item.network_name}</h5>
                                </div>
                            </div>
                            :
                            ""
                        }
                        
                        {
                            item.accepts_payments ?
                            item.accepts_payments[0] ?
                            <div className='col-md-3  col-6'>
                                <div className='ico_detail_block'>
                                    <p>Accept payments</p>
                                    <h5>
                                        {
                                            item.accepts_payments.map((inner, i) =>
                                            <>
                                            <span>{inner}{((item.accepts_payments.length-1) != i) ? ', ':""}</span>
                                            </>
                                            )
                                        }
                                    </h5>
                                </div>
                            </div>
                                :
                                ""
                            :
                            ""
                        }
                    </div>
                </div>

                <div className='where_to_buy'>
                    {
                        item.where_to_buy_link ?
                        <a href={item.where_to_buy_link} target="_blank"  className='detail_button button_transition '>Buy Now</a>
                        :
                        ""
                    }
                </div>
                
                <div className={'detail_airdrop_data collapse '+(collapse_value == item._id ? "show":"")} id={"data_ico"+item._id}>
                    <h5>How to Participate?</h5>
                    <div dangerouslySetInnerHTML={{__html:item.description}} />
                </div>
            </div>
            )
            :
            ""
        }
        </>
    )
}