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
        
      <div className="bg_portfolio_header" style={{filter : "blur(5px)"}}>
        <div className="container">
            <div className="col-md-12">
                <div className="portfolio_header">
                    <div className="row">
                        <div className="col-lg-5 col-md-3 col-sm-4 col-12">
                            <h3>Portfolio</h3>
                            </div>
                                <div className="row">
                                    <div className="col-md-6 col-6">
                                    <div className="cust_filters_dropdown cust_portfolio_network">
                                        <div>
                                            <div className="cust_filter_input">
                                                <div className="input-group">
                                                    <ul></ul>
                                                    <span className="wallet_address_display">Select Accounts</span>
                                                    <span className="input-group-addon lightmode_image">
                                                        <img src="/assets/img/filter_dropdown_white.svg" alt="filter" />
                                                        </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                    </div>
                                    <div className="col-md-6 col-6">
                                        <div className="cust_filters_dropdown cust_portfolio_network mobile_network">
                                                <div className="cust_filter_input">
                                                    <div className="input-group">
                                                        <ul>
                                                            <li><img src="/assets/img/portfolio/eth.svg" alt="Ethereum" title="Ethereum" /></li>
                                                            <li><img src="/assets/img/portfolio/bsc.svg" alt="BSC" title="BSC" /></li>
                                                            <li><img src="/assets/img/portfolio/polygon.svg" alt="Polygon" title="Polygon" /></li>
                                                            <li><img src="/assets/img/portfolio/ftm.svg" alt="Fantom" title="Fantom" /></li>
                                                            <li><img src="/assets/img/portfolio/avax.svg" alt="Avalanche" title="Avalanche" /></li>
                                                            </ul>
                                                            <span className="total_networks">Networks</span>
                                                                        </div>
                                                                        </div>
                                                                        </div>
                                                                        </div>
                                                                    </div>
                                                                    </div>
                                                                    </div>
                                                                    <div className="wallet_overview_block desktop_wallet_network">
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div className="total_portfolio_balance">
                                                                                    <h5>Net Worth</h5>
                                                                                    <div className="balance_block">
                                                                                        <h6>0</h6>
                                                                                        </div>
                                                                                        <div className="portfolio_growth_status">
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>
                                                                                            </div>
                                                                    <div className="row ">
                                                                        <div className="col-md-12">
                                                                            <div className="portolio_watchlist_tabs">
                                                                                <ul>
                                                                                    <li className="active">Portfolio</li>
                                                                                    <li className="">Transactions</li>
                                                                                    <li className="">Analytics</li>
                                                                                    </ul>
                                                                                    </div>
                                                                                    </div>
                                                                                    <div className="col-lg-2 col-md-3 ">

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
                    <td><b><span className="positive">24%</span></b></td>
                    <td>10 BNB</td>
                    <td><b>$ 56424.00</b></td>
                </tr>
                <tr>
                    <td><b><img src="/assets/img/binance.png" alt="BSC" title="BSC"/> BSC</b></td>
                    <td>$26562.25</td>
                    <td><b><span className="negative">24%</span></b></td>
                    <td>10 BNB</td>
                    <td><b>$ 56424.00</b></td>
                </tr>
                <tr>
                    <td><b><img src="/assets/img/binance.png" alt="BSC" title="BSC"/> BSC</b></td>
                    <td>$26562.25</td>
                    <td><b><span className="positive">24%</span></b></td>
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