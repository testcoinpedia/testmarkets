import React,{useEffect, useState} from 'react';  
import Web3 from 'web3'
import Link from 'next/link'
import { useRouter } from 'next/router' 
import Axios from 'axios'
import cookie from 'cookie'
import JsCookie from "js-cookie" 
import $ from 'jquery';
import {website_url,app_coinpedia_url,market_coinpedia_url,coinpedia_url, Logout, separator,logo, config, api_url, cookieDomainExtension} from '../components/constants'    
import Popupmodal from './popupmodal'  



export default function Topmenu()
{ 
  const router = useRouter()
  const [login_dropdown, set_login_dropdown] = useState(0)
  const [live_prices_list, set_live_prices_list] = useState({});
  const [dark_mode, set_dark_mode]=useState(JsCookie.get('dark_mode')) 
  const check_in_array = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SCUSDT', 'XRPUSDT']

  useEffect(()=>
  {
    getLivePricesList()
    $(".primary_navbar").hover(
      function () {
        $(this).children("div").addClass("result_hover");
      }
      
    );

    if(JsCookie.get('user_username'))
    {
      set_login_dropdown(1)
    }

    if(JsCookie.get('dark_mode') === "dark")
    { 
      $("body").addClass("dark_theme")
    }
    else
    {
      $("body").removeClass("dark_theme")
    }
  },[login_dropdown, JsCookie.get('dark_mode')])

  const customToggle=()=>{
    $(".main_menu_header").toggleClass("fixed_toggle_navbar");
  }


  const getLivePricesList = async ()=>
  {
    var my_array = []
    const resOutput = await Axios.get("https://api.binance.com/api/v3/ticker/24hr")
    if(resOutput.data)
    {
      for(var key in resOutput.data) 
      {  
        if(check_in_array.includes(resOutput.data[key].symbol))
        {  
            var createObj = {} 
            createObj['price'] =  resOutput.data[key].lastPrice 
            createObj['usd_24h_change'] = resOutput.data[key].priceChangePercent
            createObj['symbol'] =  resOutput.data[key].symbol.replace('USDT', '')
            await my_array.push(createObj)
        }
      }
      await set_live_prices_list(my_array)
    }
  }

  // const getLivePricesList=()=>
  // {
  //   Axios.get("https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbitcoin%2Cbinancecoin%2Ctether%2Csiacoin&vs_currencies=usd&include_24hr_change=true", config)
  //       .then(response => {  
          
  //         if(response.status) 
  //         {
  //           set_live_prices_list(response.data)
  //         }
  //       })
  // }

 

  
  const logoutFunction=()=>
  {
    Logout()
    router.push(app_coinpedia_url+"login")
  }
   
  const setDarkMode=()=>{
    if(JsCookie.get('dark_mode') === "dark")
    {
      JsCookie.set("dark_mode", "light", {domain:cookieDomainExtension})
      set_dark_mode("light")
      $("body").removeClass("dark_theme")
    }
    else
    {
      JsCookie.set("dark_mode", "dark", {domain:cookieDomainExtension})
      set_dark_mode("dark")
      $("body").addClass("dark_theme")
    }
  }
  
  return(
          <>
          <div className="market_top_header">
            <nav className="navbar navbar-expand-lg  navbar-dark navbar_border_bottom">
              <div className="container">
                <div className="col-md-12 ">
                  <div className="row ">
                    <div className="col-md-12">
                      {/* .......... */}
                        <div className="navbar-header">
                        <div className="row">
                            <div className="col-md-6 col-lg-3 col-6">
                              <Link href={coinpedia_url}>
                                <a className="navbar-brand"><img src={logo} className="logo_header" /></a>
                              </Link>
                            </div>
                            <div className="col-lg-6 market_live_price_desktop">
                              <div className="market_live_price">
                              <ul>
                              {    
                                   live_prices_list.length > 0 ?
                                   live_prices_list.map((e)=>
                                   <li key="101">
                                        <a>
                                          <h4 className="text-uppercase">{e.symbol}</h4>
                                          <h6>$ {separator(((parseFloat(e.price))).toFixed(2))} <span className={(parseFloat(e.usd_24h_change) >= 0 ? "green":"red")}>({(parseFloat(e.usd_24h_change)).toFixed(2)}%)</span></h6>
                                        </a>
                                    </li>
                                    )
                                    :
                                    null
                               }
                               </ul>
                              </div>
                              
                            </div>
                            <div className="col-md-6 col-lg-3 col-6">
                              <button  className="navbar-toggler" onClick={() => customToggle()}  type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span className="navbar-toggler-icon"></span>
                              </button>
                         
                                {
                                  login_dropdown == 1 
                                  ?
                                  <div className="dropdown connect_wallet_header">
                                    <button  className="btn connect_wallet" type="button" id="1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <img src="/assets/img/connect-wallet-header.png" className="login_img" /> {JsCookie.get('user_username')} <img src="/assets/img/caret-down.png" className="caret_down" />
                                    </button>
                                    <div className="dropdown-menu dropdown_wallet_header" aria-labelledby="1"> 
                                      <h6>User</h6>
                                      <a href={app_coinpedia_url} className="dropdown-item"><img src="/assets/img/menu-wallet.png" />Portfolio</a>
                                      <a href={app_coinpedia_url+"profile"} className="dropdown-item"><img src="/assets/img/menu-user-profile.png" /> Manage User Profile</a>
                                      <a href={app_coinpedia_url+"referrals"} className="dropdown-item"><img src="/assets/img/menu-referrals.png" /> Referral List</a>

                                      <h6>Company</h6>
                                      <Link href={app_coinpedia_url+"company/profile"} ><a className="dropdown-item"><img src="/assets/img/menu-company.png" /> Company Profile</a></Link>
                                      <a href={market_coinpedia_url+"token"}  className="dropdown-item"><img src="/assets/img/menu-token.png" /> Manage Token</a>
                                      {/* <a href={market_coinpedia_url+"create-launchpad/maker"}  className="dropdown-item"><img src="/assets/img/menu-airdrop.png" /> Manage Launchpad/Airdrop</a> */}
                                      <a href={market_coinpedia_url+"token/create-new"}  className="dropdown-item"><img src="/assets/img/menu-list-token.png" /> List a Token</a>

                                      
                                      {
                                        parseInt(JsCookie.get('user_email_status')) === 0 && JsCookie.get('user_wallet_address') == ""?
                                        <p className="email_notification_verify">Please verify your email and wallet address</p>
                                        :
                                        parseInt(JsCookie.get('user_email_status')) == 0 ?
                                        <p className="email_notification_verify">Please verify your email id</p>
                                        :
                                        !JsCookie.get('user_wallet_address') ?
                                        <p className="email_notification_verify">Please verify your wallet address</p>
                                        :
                                        null
                                      }
                        
                                      {
                                        parseInt(JsCookie.get('user_email_status')) === 0 && JsCookie.get('user_wallet_address') == "" ?
                                        <a className="header_reg_btn" href={app_coinpedia_url+"verify-email"}> Verify </a>
                                        :
                                        parseInt(JsCookie.get('user_email_status'))=== 0 ?
                                        <a className="header_reg_btn" href={app_coinpedia_url+"verify-email"}> Verify Email</a>
                                        :
                                        !JsCookie.get('user_wallet_address')?
                                        <a className="header_reg_btn" href={app_coinpedia_url+"profile"}> Connect to Wallet </a>
                                        :
                                        null
                                      }
                                      <h6>Other</h6>
                                      <a className="dropdown-item" onClick={()=> logoutFunction()}><img src="/assets/img/menu-logout.png" /> Logout</a>
                                      
                                    </div>
                                  </div>
                                  :
                                  <div className="dropdown connect_wallet_header">
                                    <button className="btn connect_wallet" type="button" id="2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <img src="/assets/img/connect-wallet-header.png" className="login_img" /> Login<span className="hide_connnect_wallet">/Connect Wallet</span> <img src="/assets/img/caret-down.png" className="caret_down" />
                                    </button>
                                    <div className="dropdown-menu dropdown_wallet_header" aria-labelledby="2">
                                      <a className="dropdown-item" href={app_coinpedia_url+"login"}><img src="/assets/img/menu-wallet.png" /> Login via Wallet<br/><span>Connect wallet here</span></a>
                                      <a className="dropdown-item" href={app_coinpedia_url+"login"}><img src="/assets/img/menu-login.png"  /> Manual Login</a>
                                      <div className="register_now">
                                        <p>Don't have your own account? click below link to register </p>
                                        <Link href={app_coinpedia_url+"register"}><a className="header_reg_btn">Register</a></Link>
                                      </div>
                                    </div>
                                  </div>
                                  
                                }
                            </div>
                          </div>


                          
                          
                        </div>
                      {/* ........... */}
                    </div>
                    <div className="mobile_view_crypto"> 
                      <marquee width="100%" direction="left">
                      {    
                          live_prices_list.length > 0 ?
                          live_prices_list.map((e)=>
                          <div className="block_crypto">
                            <h6 className="text-uppercase">[{e.symbol} <span className="crypto_value">${separator(((parseFloat(e.price))).toFixed(2))}</span> <span className={(parseFloat(e.usd_24h_change) >= 0 ? "green":"red")}>{(parseFloat(e.usd_24h_change)).toFixed(2)}%</span>]</h6>
                          </div>
                          )
                          :
                          null
                      }    
                      </marquee>
                  </div>
                  </div>
                </div>
              </div>
            </nav>

            <nav className="navbar navbar-expand-lg  navbar-transparent navbar_border_bottom">
                <div className="container">
                  
                  <div className="col-md-12 ">
                    <div className="collapse navbar-collapse main_menu_header click_to_close" id="navbarSupportedContent">
                      <div onClick={() => customToggle()} className="text-center close_navbar" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <img className="" src="/assets/img/close_btn.png"></img>
                      </div>
                      <ul className="nav navbar-nav">
                        <li className=""><a href={coinpedia_url}>Home</a></li>

                        <li className=""><a href={coinpedia_url + "news/"}>News</a></li>
                        
                        <li className="nav-item dropdown primary_navbar" >
                          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Information 
                          </a>
                          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                            <ul>
                              <li><a href={coinpedia_url+"stocks-shares/"}  className="dropdown-item">Stocks &amp; Shares</a></li> 
                              <li><a href={coinpedia_url+"press-release/"}  className="dropdown-item">Press Release</a></li>
                              <li><a href={coinpedia_url+"guest-post/"}  className="dropdown-item">Guest Post</a></li>
                              <li><a href="https://coinpedia.org/sponsored/"  className="dropdown-item">Sponsored</a></li>
                              <li><a href={coinpedia_url+"top-10/"}  className="dropdown-item">Top 10's</a></li> 
                              <li><a href={coinpedia_url+"cryptocurrency-regulation/"}  className="dropdown-item">Press Release</a></li>
                              <li><a href={coinpedia_url+"interesting-crypto-stories/"}  className="dropdown-item">Guest Post</a></li>
                            </ul>
                            
                          </div>
                        </li>
                        
                        <li className="nav-item dropdown primary_navbar">
                          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Markets
                          </a>
                          <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                          <ul>
                            <li><a href={website_url} className="dropdown-item">Live Market</a></li>
                            <li><a href={coinpedia_url+"price-analysis/"}   className="dropdown-item">Price Analysis</a></li>
                            <li><a href={coinpedia_url+"price-prediction/"}  className="dropdown-item">Price Prediction</a></li>
                            
                            <li><a href={market_coinpedia_url+"launchpad"}  className="dropdown-item">Launchpad</a></li> 
                            <li><a href={app_coinpedia_url+"nft"}  className="dropdown-item">NFTs</a></li> 
                          </ul>
                          </div>
                        </li>

                        <li className="nav-item dropdown primary_navbar">
                          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Products Review
                          </a>
                          <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                            <ul>
                              <li><a href={coinpedia_url+"decentralized-exchange/"}  className="dropdown-item">Decentralized Exchange</a></li>
                              <li><a href={coinpedia_url+"crypto-wallet/"}  className="dropdown-item">Cryptocurrency Wallet</a></li>
                              <li><a href={coinpedia_url+"crypto-tracking-tools/"}  className="dropdown-item">Crypto Tracking Tools</a></li>
                              <li><a href={coinpedia_url+"dapplist/"}  className="dropdown-item">DApp</a></li>
                              <li><a href={coinpedia_url+"earning-site/"}  className="dropdown-item">Earning sites</a></li>
                            </ul>
                          </div>
                        </li>
                        
                        <li className="nav-item dropdown primary_navbar">
                          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Academy 
                          </a>
                          
                          <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                            <ul>
                              <li><a href={coinpedia_url+"crypto-beginners/"}  className="dropdown-item">Beginners Guide</a></li>
                              <li><a href={coinpedia_url+"crypto-traders/"}  className="dropdown-item">Trading Guide</a></li>
                              <li><a href={coinpedia_url+"blockchain-developers-guide/"}  className="dropdown-item">Developers Guide</a></li>
                            </ul>
                          </div>
                        </li>
                        
                        <li className="nav-item dropdown primary_navbar">
                          <a className="nav-link dropdown-toggle"  href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Find 
                          </a>
                          
                          <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                            <ul>
                            <li><Link href={app_coinpedia_url+"companies"}><a className="dropdown-item">Companies</a></Link></li>
                            <li><Link href={app_coinpedia_url+"partners"}><a className="dropdown-item">Partners</a></Link></li>
                            {/* <li><Link href="#"><a className="dropdown-item">Person</a></Link></li> */}
                            </ul>
                          </div>
                        </li>

                        <li className="nav-item dropdown primary_navbar">
                          <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          Contact 
                          </a>
                          
                          <div className="dropdown-menu "  aria-labelledby="navbarDropdown">
                            <ul>
                              <li><a href={coinpedia_url+"write-news-with-us/"} >Submit Guest Post</a></li>
                              <li><a href={coinpedia_url+"contact-us/"} >Submit Query</a></li>
                              <li><a href={coinpedia_url+"submit-your-press-report/"} >Submit PR</a></li>
                              <li><a href={coinpedia_url+"advertising/"} >Advertise</a></li>
                              {/* <li><a href={app_coinpedia_url+"feedback/"} >Feedback</a></li> */}
                            </ul>
                          </div>
                        </li>

                        <li className="active hiring_btn"><a href={coinpedia_url+"careers"}>We Are Hiring</a></li>
 
                      </ul>
                      <ul className="nav navbar-nav navbar-right ml-auto ">
                        <li className="dark_theme_toggle" onClick={()=>setDarkMode()} id="theme_color">
                          {/* <img src="https://api.coinpedia.org/uploads/tokens/1636636942618d190eb91f9.png" /> */}
                          {
                            JsCookie.get('dark_mode') ?
                              JsCookie.get('dark_mode') === "dark" ?
                              <div id="dark_mode_div" className="top_menu_skin moon" ><img id="dark_mode_image" src="/assets/img/top_menu_moon.png" /></div>
                              :
                              JsCookie.get('dark_mode') === "light" ?
                              <div id="dark_mode_div" className="top_menu_skin sun" ><img id="dark_mode_image" src="/assets/img/top_menu_sun.png" /></div>
                              :
                              null
                            :
                            <div id="dark_mode_div" className="top_menu_skin sun" ><img id="dark_mode_image" src="/assets/img/top_menu_sun.png" /></div>
                          }

                        </li>
                        <li><a href="#"><button className="header_button notification_bell"><img src="/assets/img/notification.png" /></button></a></li> 
                      </ul>
                    </div>
                  </div>
                </div>
              </nav> 
          </div> 
        </>
      ) 
} 