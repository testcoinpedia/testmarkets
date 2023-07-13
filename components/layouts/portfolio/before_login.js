/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import Link from 'next/link' 
import ReactPaginate from "react-paginate"
import moment from 'moment'


export default function BeforeLogin() 
{ 
    return(
        <>
        
      <div class="bg_portfolio_header" style={{filter : "blur(5px)"}}>
        <div class="container">
            <div class="col-md-12">
                <div class="portfolio_header">
                    <div class="row">
                        <div class="col-lg-5 col-md-3 col-sm-4 col-12">
                            <h3>Portfolio</h3>
                            </div>
                                <div class="row">
                                    <div class="col-md-6 col-6">
                                    <div class="cust_filters_dropdown cust_portfolio_network">
                                        <div>
                                            <div class="cust_filter_input">
                                                <div class="input-group">
                                                    <ul></ul>
                                                    <span class="wallet_address_display">Select Accounts</span>
                                                    <span class="input-group-addon lightmode_image">
                                                        <img src="/assets/img/filter_dropdown_white.svg" />
                                                        </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                    <div class="col-md-6 col-6">
                                        <div class="cust_filters_dropdown cust_portfolio_network mobile_network">
                                                <div class="cust_filter_input">
                                                    <div class="input-group">
                                                        <ul>
                                                            <li><img src="/assets/img/portfolio/eth.svg" alt="Ethereum" title="Ethereum" /></li>
                                                            <li><img src="/assets/img/portfolio/bsc.svg" alt="BSC" title="BSC" /></li>
                                                            <li><img src="/assets/img/portfolio/polygon.svg" alt="Polygon" title="Polygon" /></li>
                                                            <li><img src="/assets/img/portfolio/ftm.svg" alt="Fantom" title="Fantom" /></li>
                                                            <li><img src="/assets/img/portfolio/avax.svg" alt="Avalanche" title="Avalanche" /></li>
                                                            </ul>
                                                            <span class="total_networks">Networks</span>
                                                                        </div>
                                                                        </div>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    <div class="wallet_overview_block desktop_wallet_network">
                                                                        <div class="row">
                                                                            <div class="col-md-12">
                                                                                <div class="total_portfolio_balance">
                                                                                    <h5>Net Worth</h5>
                                                                                    <div class="balance_block">
                                                                                        <h6>0</h6>
                                                                                        </div>
                                                                                        <div class="portfolio_growth_status">
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>
                                                                    <div class="row ">
                                                                        <div class="col-md-12">
                                                                            <div class="portolio_watchlist_tabs">
                                                                                <ul>
                                                                                    <li class="active">Portfolio</li>
                                                                                    <li class="">Transactions</li>
                                                                                    <li class="">Analytics</li>
                                                                                    </ul>
                                                                                    </div>
                                                                                    </div>
                                                                                    <div class="col-lg-2 col-md-3 ">

                                                                                    </div>
                                                                                    
      </div>
      </div>
      </div>
      </div>

      <div className="new_profile_tab_block container" style={{filter : "blur(5px)"}}> 
           

            <div style={{filter : "blur(5px)"}}>
            <div className="table-responsive">
            <table className="table table-striped">
                <thead>
                <tr>
                    <th className="coin_name">Name</th>
                    <th>Live Price</th>
                    <th className="percent_change">% Change</th>
                    <th>Balance</th>
                    <th className="total_balance">Total Balance in USD</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td><b><img src="/assets/img/binance.png" alt="BSC" title="BSC"/> BSC</b></td>
                    <td>$26562.25</td>
                    <td><b><span className="positive"><img src="/assets/img/market_up.png" className="market_triangles" alt="Market" title="Market"/>24%</span></b></td>
                    <td>10 BNB</td>
                    <td><b>$ 56424.00</b></td>
                </tr>
                <tr>
                    <td><b><img src="/assets/img/binance.png" alt="BSC" title="BSC"/> BSC</b></td>
                    <td>$26562.25</td>
                    <td><b><span className="negative"><img src="/assets/img/market-down.png" className="market_triangles" alt="Market" title="Market"/>24%</span></b></td>
                    <td>10 BNB</td>
                    <td><b>$ 56424.00</b></td>
                </tr>
                <tr>
                    <td><b><img src="/assets/img/binance.png" alt="BSC" title="BSC"/> BSC</b></td>
                    <td>$26562.25</td>
                    <td><b><span className="positive"><img src="/assets/img/market_up.png" className="market_triangles" alt="Market" title="Market"/>24%</span></b></td>
                    <td>10 BNB</td>
                    <td><b>$ 56424.00</b></td>
                </tr>
                
                </tbody>
            </table>
            </div>
           </div>
           </div>
        </>
   )
}