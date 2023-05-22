import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Axios from 'axios'
import JsCookie from "js-cookie"
import ICO_active from './icos_active_detail'
import ICO_completed from './completed_icos'
import ICO_upcoming from './upcoming_icos'

export default function MyFunction() {
   


    return (
        <>
        <div className="page ico_calendar">
        <div className="container-fluid p-0">
            <div className=''>
                <div className='container header_ico_calendar'>
            <div className='ico_canlendar_headings'>
                <h1>ICO CALENDAR</h1>
                <p>Find Verified and Hot Crypto ICO, IDO,  IEO, and Crypto ICOs</p>
            </div>

            <div className='ico_calendar_tabs'>
            <ul className="nav nav-pills nav-justified">
                    <li  className="nav-item"><a className=" nav-link active" data-toggle="tab" href="#published">
                        <h4>2000</h4>
                        <p>Total Published</p>
                        </a></li>
                    <li  className="nav-item"><a className="nav-link" data-toggle="tab" href="#active">
                        <h4>124</h4>
                        <p>Active</p>
                        </a></li>
                    <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#upcoming">
                        <h4>64</h4>
                        <p>Upcoming</p>
                        </a></li>
                    <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#completed">
                        <h4>26</h4>
                        <p>Completed</p>
                        </a></li>
                    <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#airdrops_tab">
                        <h4>320</h4>
                        <p>Airdrops</p>
                        </a></li>
                </ul>

                
            </div>
            </div>
            </div>
            </div>




            <div className=''>
                <div className='container'>
                <div className="tab-content">
                    <div id="published" className="tab-pane fade show in active">
                        <div className=''>
                        <div className='active_icos'>
            <div className='active_icos_tabs'>
            <ul className="nav nav-pills text-center">
                    <li  className="nav-item"><a className=" nav-link active" data-toggle="tab" href="#active_icos">
                    Active ICOs 
                        </a></li>
                    <li  className="nav-item"><a className="nav-link" data-toggle="tab" href="#upcoming_icos">
                    Upcoming ICOs 
                        </a></li>
                    <li className="nav-item"><a className="nav-link" data-toggle="tab" href="#completed_icos">
                    Completed ICO
                        </a></li>
                   
                </ul>
            </div>
            </div>
                        </div>
                    </div>




                    <div id="active" className="tab-pane fade">
                    
                    </div>


                    
                    <div id="upcoming" className="tab-pane fade">
                   
                    </div>
                    <div id="completed" className="tab-pane fade">
                    </div>
                    <div id="airdrops_tab" className="tab-pane fade">
                    </div>
                </div>


        <div className=' header_tabs_row mt-3'>
                <div className='row'>
                    <div className='col-md-12 col-xl-7 col-lg 12 col-12'>
                        <div className='ico_header_lists'>
                    <ul>
                        <li>All</li>
                        <li className='image_fire'><img src="/assets/img/fire_icon.svg" /></li>
                        <li>AI</li>
                        <li>Memes Coin</li>
                        <li>Defi</li>
                        <li>Web3</li>
                        <li>Gaming</li>
                        <li>Blockchain</li>
                    </ul>
                    </div>
                    </div>
                    <div className='col-md-12 col-lg-12 col-xl-5 col-12'>
                        <div className='row'>
                        <div className='col-md-3'>
                        <button className='button_blue_transition kyc_button'>KYC &nbsp;<span><img src="/assets/img/finger_print.svg" /></span></button>
                        </div>
                        <div className='col-md-5'>
                            <div class="input-group search_filter new_design_serach">
                                <input type="text" class="form-control search-input-box" placeholder="Search " />
                                <div class="input-group-prepend ">
                                    <span class="input-group-text">
                                        <img src="/assets/img/search_large.svg" alt="search-box" width="100%" height="100%" />
                                    </span>
                                </div>
                            </div>   
                        </div>
                        <div className='col-md-2'>
                            =
                        </div>
                        <div className='col-md-2'>
                            =
                        </div>
                        </div>
                    </div>
                   
                   
                </div>
                </div>
                <div className='border_bottom_ico'></div>
                </div>
            </div>
 {/**************************************** Main Details ****************************************************/}
            <div className='container'>
            <div className="tab-content">
                    <div id="active_icos" className="tab-pane fade show in active">
                        <div className=''>
                            <ICO_active />
                        </div>
                    </div>
                    <div id="upcoming_icos" className="tab-pane fade">

                        <ICO_completed />
                    </div>
                    <div id="completed_icos" className="tab-pane fade">
                        <ICO_upcoming />
                    </div>
                   
                </div>
            </div>
            </div>
            </> 
    )
}