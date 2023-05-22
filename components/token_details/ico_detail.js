import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'

export default function MyFunction() {
   

    const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
    return (
        <>
        <div className='ico_details'>
            <div className='row'>
                <div className='col-md-7'>
                <h4 className='ico_heading' data-toggle="collapse" href="#data_ico">Polkadot (DOT)  ICO - Round 1,</h4>
                </div>
                <div className='col-md-5'>
                <div className='float-right'>
                    <div className={`dropdown ${isOpen ? 'open' : ''}`}>
            <button className='live_button ico_button' >Live</button>
            <img className='dropdown_ico ' onClick={handleToggle} src="/assets/img/dropdown_icon.png" data-toggle="collapse" href="#data_ico" />
            {/* <button className='upcoming_button ico_button' data-toggle="collapse" href="#data_ico" role="button" aria-expanded="false" aria-controls="collapseExample">Upcoming</button> */}
            {/* <button className='completed_button ico_button'>Completed</button> */}
            </div>
            </div>
                </div>
            </div>

            
            
            <h6 className='ico_dates'>Start Date:  05-APR-2022
            <span >End Date:  05-APR-2023</span>
            </h6>
            <div className='ico_prices'>
            <div className='row'>
                <div className='col-md-3'>
                    <p>ICO Price</p>
                    <h5>$ 0.01</h5>
                </div>
                <div className='col-md-3'>
                <p>Listing Price</p>
                    <h5 className='values_growth'>$ 1.05 <span class="green"><img src="/assets/img/markets/high.png" alt="high price" />90.00 %</span></h5>
                    {/* <h5 class="values_growth">$ 1.05 <span class="red"><img src="/assets/img/markets/low.png" alt="high price" />5.04%</span></h5> */}
                </div>
                <div className='col-md-3'>
                <p>Soft Cap</p>
                    <h5>$ 9784511561</h5>
                </div>
                <div className='col-md-3'>
                <p>Hard Cap</p>
                    <h5>$ 561265126513</h5>
                </div>
                </div>
            </div>
            <div className='d-flex'>
            <ul className='token_share_vote'>
            <li>BNB</li>
            <li>Solana</li>
            <li>ETH</li>
           <li className='detail_button_ico button_transition '>Buy Now </li>
           <li><Link href="/ico_calendar/" >Ico Calendar </Link></li>
            </ul>
           
            </div>

            <div className='detail_airdrop_data collapse' id="data_ico">
                <h3>
                Register new for a chance to win DAO tokens
                </h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o</p>               
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o</p>               
            
            </div>
        </div>



        <div className='ico_details mt-3'>
            <div className='row'>
                <div className='col-md-7'>
                <h4 className='ico_heading'  data-toggle="collapse" href="#data_upcoming_ico">Polkadot (DOT)  ICO - Round 1</h4>
                </div>
                <div className='col-md-5'>
                <div className='float-right'>
                <div className={`dropdown ${isOpen ? 'open' : ''}`}>
            {/* <button className='live_button ico_button' data-toggle="collapse" href="#data_ico" role="button" aria-expanded="false" aria-controls="collapseExample">Live</button> */}
            <button className='upcoming_button ico_button'  >Upcoming</button>
            <img className='dropdown_ico' onClick={handleToggle} src="/assets/img/dropdown_icon.png" data-toggle="collapse" href="#data_upcoming_ico"/>
            {/* <button className='completed_button ico_button'>Completed</button> */}
            </div>
            </div>
                </div>
            </div>
            
            <h6 className='ico_dates'>Start Date:  05-APR-2022
            <span >End Date:  05-APR-2023</span>
            </h6>
            <div className='ico_prices'>
            <div className='row'>
                <div className='col-md-3'>
                    <p>ICO Price</p>
                    <h5>$ 0.01</h5>
                </div>
                <div className='col-md-3'>
                <p>Listing Price</p>
                    <h5 className='values_growth'>$ 1.05 <span class="green"><img src="/assets/img/markets/high.png" alt="high price" />90.00 %</span></h5>
                    {/* <h5 class="values_growth">$ 1.05 <span class="red"><img src="/assets/img/markets/low.png" alt="high price" />5.04%</span></h5> */}
                </div>
                <div className='col-md-3'>
                <p>Soft Cap</p>
                    <h5>$ 9784511561</h5>
                </div>
                <div className='col-md-3'>
                <p>Hard Cap</p>
                    <h5>$ 561265126513</h5>
                </div>
                </div>
            </div>
            <div className='d-flex'>
            <ul className='token_share_vote'>
            <li>BNB</li>
            <li>Solana</li>
            <li>ETH</li>
           <li className='detail_button_ico button_transition '>Buy Now </li>
            </ul>
           
            </div>

            <div className='detail_airdrop_data collapse' id="data_upcoming_ico">
                <h3>
               Upcoming details goes here
                </h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o</p>               
            
            </div>
        </div>



        <div className='ico_details mt-3'>
            <div className='row'>
                <div className='col-md-7'>
                <h4 className='ico_heading' data-toggle="collapse" href="#data_completed_ico">Polkadot (DOT)  ICO - Round 1</h4>
                </div>
                <div className='col-md-5'>
                <div className='float-right'>
                <div className={`dropdown ${isOpen ? 'open' : ''}`}>
            {/* <button className='live_button ico_button' data-toggle="collapse" href="#data_ico" role="button" aria-expanded="false" aria-controls="collapseExample">Live</button> */}
            {/* <button className='upcoming_button ico_button' data-toggle="collapse" href="#data_ico" role="button" aria-expanded="false" aria-controls="collapseExample">Upcoming</button> */}
            <button className='completed_button ico_button' data-toggle="toggle" href="#"  >Completed</button>
            <img className='dropdown_ico' onClick={handleToggle} src="/assets/img/dropdown_icon.png" data-toggle="collapse" href="#data_completed_ico"/>
            </div>
                </div>
            </div>
            </div>
            
            
            
            
            <h6 className='ico_dates'>Start Date:  05-APR-2022
            <span >End Date:  05-APR-2023</span>
            </h6>
            <div className='ico_prices'>
            <div className='row'>
                <div className='col-md-3'>
                    <p>ICO Price</p>
                    <h5>$ 0.01</h5>
                </div>
                <div className='col-md-3'>
                <p>Listing Price</p>
                    {/* <h5 className='values_growth'>$ 1.05 <span class="green"><img src="/assets/img/markets/high.png" alt="high price" />90.00 %</span></h5> */}
                    <h5 class="values_growth">$ 1.05 <span class="red"><img src="/assets/img/markets/low.png" alt="high price" />5.04%</span></h5>
                </div>
                <div className='col-md-3'>
                <p>Soft Cap</p>
                    <h5>$ 9784511561</h5>
                </div>
                <div className='col-md-3'>
                <p>Hard Cap</p>
                    <h5>$ 561265126513</h5>
                </div>
                </div>
            </div>
            <div className='d-flex'>
            <ul className='token_share_vote'>
            <li>BNB</li>
            <li>Solana</li>
            <li>ETH</li>
           <li className='detail_button_ico button_transition '>Buy Now </li>
            </ul>
           
            </div>

            <div className='detail_airdrop_data collapse' id="data_completed_ico">
                <h3>
               Completed details goes here
                </h3>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not o</p>               
           
            </div>
        </div>
        </>
    )
}