import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'

export default function MyFunction() {
   


    return (
        <>
        <div className='conatiner'>
        <div className='row'>


        <div className='col-lg-6 col-xl-4 col-md-6 col-12'>
                    
                    <div className='ico_cards'>
                        <div className="card">
                            <div className="card-body">
                               <div className='media'>
                                <div className='media-left align-self-center'>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/52.png" />
                                </div>
                                <div className='media-body align-self-center'>
                                    <h4>Humanode ( HMND )  </h4>
                                    <p>$1.1657</p>
                                </div>
                               </div>

                               <div className='icos_tags_detail'>
                                <ul>
                                    <li><span><img src="/assets/img/ico_verified.svg" /></span>KYC Verified</li>
                                    <li>ICO</li>
                                    <li>Defi</li>
                                </ul>
                               </div>

                            <div className='ico_prices_details'>
                               <div className='row'>
                                <div className='col-md-6'>
                                    <p>Listing Price : $ 450.001</p>
                                </div>
                                <div className='col-md-6'>
                                    <p>Softcap : $ 845756</p>
                                </div>
                               </div>
                               </div>
                            </div>

                            <div className="card-footer ">
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <p>Start :  3 March 23</p>
                                    </div>
                                    <div className='col-md-5'>
                                        <p>End :  3 July 23</p>
                                    </div>
                                    <div className='col-md-2'>
                                        <Link href="#"><img src="/assets/img/ico_view.svg" /></Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>

                <div className='col-lg-6 col-xl-4 col-md-6 col-12'>
                
                    <div className='ico_cards'>
                        <div className="card">
                            <div className="card-body">
                               <div className='media'>
                                <div className='media-left align-self-center'>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/74.png" />
                                </div>
                                <div className='media-body align-self-center'>
                                    <h4>Game Infinity ( GAMEIN )</h4>
                                    <p>$0.000145</p>
                                </div>
                               </div>

                               <div className='icos_tags_detail'>
                                <ul>
                                    <li><span><img src="/assets/img/ico_verified.svg" /></span>KYC Verified</li>
                                    <li>ICO</li>
                                    <li>Defi</li>
                                </ul>
                               </div>

                            <div className='ico_prices_details'>
                               <div className='row'>
                                <div className='col-md-6'>
                                    <p>Listing Price : $ 450.001</p>
                                </div>
                                <div className='col-md-6'>
                                    <p>Softcap : $ 845756</p>
                                </div>
                               </div>
                               </div>
                            </div>

                            <div className="card-footer ">
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <p>Start :  3 March 23</p>
                                    </div>
                                    <div className='col-md-5'>
                                        <p>End :  3 July 23</p>
                                    </div>
                                    <div className='col-md-2'>
                                        <Link href="#"><img src="/assets/img/ico_view.svg" /></Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>

                <div className='col-lg-6 col-xl-4 col-md-6 col-12'>
                
                    <div className='ico_cards'>
                        <div className="card">
                            <div className="card-body">
                               <div className='media'>
                                <div className='media-left align-self-center'>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/52.png" />
                                </div>
                                <div className='media-body align-self-center'>
                                    <h4>Tia Token ( TIA )  </h4>
                                    <p>$1.1245657</p>
                                </div>
                               </div>

                               <div className='icos_tags_detail'>
                                <ul>
                                    <li><span><img src="/assets/img/ico_verified.svg" /></span>KYC Verified</li>
                                    <li>ICO</li>
                                    <li>Defi</li>
                                </ul>
                               </div>

                            <div className='ico_prices_details'>
                               <div className='row'>
                                <div className='col-md-6'>
                                    <p>Listing Price : $ 450.001</p>
                                </div>
                                <div className='col-md-6'>
                                    <p>Softcap : $ 845756</p>
                                </div>
                               </div>
                               </div>
                            </div>

                            <div className="card-footer ">
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <p>Start :  3 March 23</p>
                                    </div>
                                    <div className='col-md-5'>
                                        <p>End :  3 July 23</p>
                                    </div>
                                    <div className='col-md-2'>
                                        <Link href="#"><img src="/assets/img/ico_view.svg" /></Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>


                <div className='col-lg-6 col-xl-4 col-md-6 col-12'>
                    
                    <div className='ico_cards'>
                        <div className="card">
                            <div className="card-body">
                               <div className='media'>
                                <div className='media-left align-self-center'>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png" />
                                </div>
                                <div className='media-body align-self-center'>
                                    <h4>Play It Forward DAO ( PIF ) </h4>
                                    <p>$0.00005</p>
                                </div>
                               </div>

                               <div className='icos_tags_detail'>
                                <ul>
                                    <li><span><img src="/assets/img/ico_verified.svg" /></span>KYC Verified</li>
                                    <li>ICO</li>
                                    <li>Defi</li>
                                </ul>
                               </div>

                            <div className='ico_prices_details'>
                               <div className='row'>
                                <div className='col-md-6'>
                                    <p>Listing Price : $ 450.001</p>
                                </div>
                                <div className='col-md-6'>
                                    <p>Softcap : $ 845756</p>
                                </div>
                               </div>
                               </div>
                            </div>

                            <div className="card-footer ">
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <p>Start :  3 March 23</p>
                                    </div>
                                    <div className='col-md-5'>
                                        <p>End :  3 July 23</p>
                                    </div>
                                    <div className='col-md-2'>
                                        <Link href="#"><img src="/assets/img/ico_view.svg" /></Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>

                <div className='col-lg-6 col-xl-4 col-md-6 col-12'>
                    
                    <div className='ico_cards'>
                        <div className="card">
                            <div className="card-body">
                               <div className='media'>
                                <div className='media-left align-self-center'>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/3717.png" />
                                </div>
                                <div className='media-body align-self-center'>
                                    <h4>Tia Token ( TIA )  </h4>
                                    <p>$1.1245657</p>
                                </div>
                               </div>

                               <div className='icos_tags_detail'>
                                <ul>
                                    <li><span><img src="/assets/img/ico_verified.svg" /></span>KYC Verified</li>
                                    <li>ICO</li>
                                    <li>Defi</li>
                                </ul>
                               </div>

                            <div className='ico_prices_details'>
                               <div className='row'>
                                <div className='col-md-6'>
                                    <p>Listing Price : $ 450.001</p>
                                </div>
                                <div className='col-md-6'>
                                    <p>Softcap : $ 845756</p>
                                </div>
                               </div>
                               </div>
                            </div>

                            <div className="card-footer ">
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <p>Start :  3 March 23</p>
                                    </div>
                                    <div className='col-md-5'>
                                        <p>End :  3 July 23</p>
                                    </div>
                                    <div className='col-md-2'>
                                        <Link href="#"><img src="/assets/img/ico_view.svg" /></Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>

                <div className='col-lg-6 col-xl-4 col-md-6 col-12'>
                    
                    <div className='ico_cards'>
                        <div className="card">
                            <div className="card-body">
                               <div className='media'>
                                <div className='media-left align-self-center'>
                                    <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/2563.png" />
                                </div>
                                <div className='media-body align-self-center'>
                                    <h4>Tia Token ( TIA )  </h4>
                                    <p>$1.1245657</p>
                                </div>
                               </div>

                               <div className='icos_tags_detail'>
                                <ul>
                                    <li><span><img src="/assets/img/ico_verified.svg" /></span>KYC Verified</li>
                                    <li>ICO</li>
                                    <li>Defi</li>
                                </ul>
                               </div>

                            <div className='ico_prices_details'>
                               <div className='row'>
                                <div className='col-md-6'>
                                    <p>Listing Price : $ 450.001</p>
                                </div>
                                <div className='col-md-6'>
                                    <p>Softcap : $ 845756</p>
                                </div>
                               </div>
                               </div>
                            </div>

                            <div className="card-footer ">
                                <div className='row'>
                                    <div className='col-md-5'>
                                        <p>Start :  3 March 23</p>
                                    </div>
                                    <div className='col-md-5'>
                                        <p>End :  3 July 23</p>
                                    </div>
                                    <div className='col-md-2'>
                                        <Link href="#"><img src="/assets/img/ico_view.svg" /></Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        
                    </div>
                </div>

                   

                  
                </div>
        </div>
        </>
    )
}