import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'

export default function MyFunction() {
   
    return (
        <>
        {/* <h5 className='text-center'>Coming Soon</h5> */}
       <div className='airdrop_page_indi'>
       
       
        <div className='media'>
            <div className='media-left align-self-center'>
                <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png" />
            </div>
            <div className='media-body align-self-center'>
            <h3>Airdrop Spool Token</h3>
            </div>
        </div>

        <div className='airdrop_card'>
        <h6>Amount</h6>
        <h4>$5 of Spool token per winner</h4>
        <p>Total Participance :  52000 </p>
       </div>
       <div className='airdrop_card'>
        <h6>Airdrop Registration Start</h6>
        <h4>May 8 2023</h4>
       </div>
       <div className='airdrop_card'>
        <h6>Airdrop Registration Ends</h6>
        <h4>2 Days</h4>
       </div>

       <div className='airdrop_card_bottom'>
       <h6>You will need</h6>
       <h6><span>1. Polygon Wallet</span><span className='float-right'>2. Email Address</span></h6>
       </div>
       <div className='airdrop_button_bottom'>
        <button className='button_transition_green'>Login to Continue</button>
       </div>
       </div>

       







        {/* <div className='events_detail_score mt-3'>
        
            <h3>Airdrop Spool Token
            <span><button className='float-right'>Active</button></span></h3>
            <div className='media'>
                <div className='media-left'>
                <img src="/assets/img/trophy.svg" />
                </div>
                <div className='media-body align-self-center'>
                <h4>$ 2455441</h4>
                <p>544211544 SPOOL</p>
                </div>
            </div>
            <div className='timing_event_score'>
                <div className='row'>
                <div className='col-md-5'>
                    <p>Start :  3 Mar 23</p>
                </div>
                <div className='col-md-4 padding_null'>
                    <p>End :  3 May 23</p>
                </div>
                <div className='col-md-3'>
                    <p><img src="/assets/img/thumbsup.svg" /> 2256</p>
                </div>
                </div>
            </div>

            </div> */}
        </>
      
    )
}