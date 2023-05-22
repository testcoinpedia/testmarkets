import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'

export default function MyFunction() {
   
    return (
        <>
        <div className='details_airdrop'>
            <div className='media'>
                <div className='media-left align-self-center'>
                    <img src="https://s2.coinmarketcap.com/static/img/coins/128x128/1.png"/>
                </div>
                <div className='media-body align-self-center'>
                    <h4>Polkadot (DOT)  Airdrop</h4>
                    <p>$500 worth of DOT to 1000 Lucky Winners</p>
                </div>
            </div>
            <div className='details_airdrop_card'>
                <div className='row'>
                    <div className='col-md-4'>
                        <p>Amount</p>
                        <h6>$5 of DAO token per winner</h6>
                    </div>
                    <div className='col-md-4 col-6 airdrop_col'>
                        <p>Start Date</p>
                        <h6>May 8 2023</h6>
                    </div>
                    <div className='col-md-4 col-6 airdrop_col'>
                        <p>End Date</p>
                        <h6>June 10 2023</h6>
                    </div>
                </div>
            </div>

            <div className='detail_airdrop_data'>
                <h3>
                Register new for a chance to win DAO tokens
                </h3>
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o</p>
                <h6>To join this airdrop you will need: </h6>
                <ul className='list_numbers'>
                    <li>Polygon Wallet</li>
                    <li>Email Address</li>
                </ul>
                <h3>How to Participate Airdrop </h3>
                <ul>
                    <li>Step 1 :  www.coinpedia.org</li>

                    <li>Step 2 :  Connect Wallet</li>

                    <li>Step 3 : It was popularised in the 1960s with the release of Letraset</li>

                    <li>Step 4 : There are many variations of passages of Lorem Ipsum available, but the majority</li>

                    <li>Step 5 : It was popularised in the 1960s with the release of Letraset</li>

                    <li>Step 6 : There are many variations of passages of Lorem Ipsum available, but the majority</li>

                </ul>
            </div>

            <div className=''>
                <button className=' detail_button button_transition'>Join Now</button>
            </div>
        </div>
      
        </>
      
    )
}