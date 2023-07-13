'use client';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Axios from 'axios'
import cookie from 'cookie'
import JsCookie from "js-cookie"
import SearchContractAddress from './searchContractAddress'
// import { useSelector, useDispatch } from 'react-redux'
// import $ from 'jquery';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from 'react-slick';
import { USDFormatValue } from '../config/helper'
import { API_BASE_URL, events_coinpedia_url, app_coinpedia_url, market_coinpedia_url, coinpedia_url, Logout, separator, logo, config, api_url, cookieDomainExtension, IMAGE_BASE_URL } from '../components/constants'
import Popupmodal from './popupmodal'



export default function Topmenu() {
  const router = useRouter()
  const pathname=router.pathname
// +((router.pathname).substring(1))
  const [current_page_url] = useState(market_coinpedia_url+"/portfolio")
  console.log("current_page_url", pathname)
  const [login_dropdown, set_login_dropdown] = useState(0)
  const [live_prices_list, set_live_prices_list] = useState({});
  const [light_dark_mode, set_light_dark_mode] = useState("")
  // const userData = useSelector(state => state.userData)
  const [image_base_url] = useState(IMAGE_BASE_URL + "/profile/")
  const check_in_array = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SCUSDT', 'XRPUSDT']
  const [display_tokens_balance, set_display_tokens_balance] = useState(0) 

  useEffect(() => 
  {
    if(JsCookie.get('display_tokens_balance'))
    {
      set_display_tokens_balance(JsCookie.get('display_tokens_balance') ? JsCookie.get('display_tokens_balance'):0)
    }
  }, [JsCookie.get('display_tokens_balance')])


  

  useEffect(() => {
    getLivePricesList()
    // $(".primary_navbar").hover(
    //   function () {
    //     $(this).children("div").addClass("result_hover");
    //   }

    // );

    if (JsCookie.get('user_full_name')) {
      //console.log(JsCookie.get('user_full_name'))
      set_login_dropdown(1)
    }

    // if (JsCookie.get('light_dark_mode') === "dark") {
    //   set_light_dark_mode(JsCookie.get('light_dark_mode'))
    //   $("body").addClass("dark_theme")
    // }
    // else {
    //   set_light_dark_mode(JsCookie.get('light_dark_mode'))
    //   $("body").removeClass("dark_theme")
    // }
  }, [login_dropdown, JsCookie.get('light_dark_mode')])

  const customToggle = () => {
   // $(".main_menu_header").toggleClass("fixed_toggle_navbar");
  }

  const settings = {
    speed: 5000,
    autoplay: true,
    autoplaySpeed: 0,
    centerMode: true,
    cssEase: 'linear',
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: true,
    infinite: true,
    initialSlide: 1,
    arrows: false,
    buttons: false
  };

  
  // const getLivePricesList = async ()=>
  // {
  //   var my_array = []
  //   const resOutput = await Axios.get("https://api.binance.com/api/v3/ticker/24hr")
  //   if(resOutput.data)
  //   {
  //     for(var key in resOutput.data) 
  //     {  
  //       if(check_in_array.includes(resOutput.data[key].symbol))
  //       {  
  //           var createObj = {} 
  //           createObj['price'] =  resOutput.data[key].lastPrice 
  //           createObj['usd_24h_change'] = resOutput.data[key].priceChangePercent
  //           createObj['symbol'] =  resOutput.data[key].symbol.replace('USDT', '')
  //           await my_array.push(createObj)
  //       }
  //     }
  //     await set_live_prices_list(my_array)
  //   }
  // }


  const getLivePricesList = async () => {
    var my_array = []
    const res = await Axios.get(API_BASE_URL + "main/tokens/live_prices", config(""))
    if (res.data) {
      if (res.data.status === true) {
        for (var key of res.data.message) {
          var createObj = {}
          createObj['symbol'] = key.symbol
          createObj['price'] = key.price
          createObj['usd_24h_change'] = key.usd_24h_change
          createObj['token_id'] = key.token_id
          createObj['token_name'] = key.token_name

          await my_array.push(createObj)
        }


        await set_live_prices_list(my_array)
      }
    }
  }

  
  const reCreateUserName=(pass_username) =>
  {
    console.log(pass_username)
    if(pass_username)
    {
      if(pass_username.length > 14)
      {
        var pass_array = pass_username.split(" ")
        if(pass_array.length == 1)
        {
          return pass_username.substring(0, 12)+".."
        }
        else if(pass_array.length == 2)
        {
          if(pass_array[0].length > 3)
          {
          	return checkInnerValue(pass_array[0])
          }
          else if((pass_array[1].length > 3))
          {
         
          	return checkInnerValue(pass_array[1])
          }
          else
          {
            return pass_username.substring(0, 12)+".."
          }
        }
        else if(pass_array.length == 3)
        {
          if(pass_array[0].length > 3)
          {
          	return checkInnerValue(pass_array[0])
          }
          else if((pass_array[1].length > 3))
          {
         
          	return checkInnerValue(pass_array[1])
          }
          else if((pass_array[2].length > 3))
          {
            return checkInnerValue(pass_array[2])
          }
          else
          {
            return pass_username.substring(0, 12)+".."
          }
        }
        else
        {
          return pass_username.substring(0, 10)
        }
      }
      else
      {
        return pass_username
      }
    }
    else
    {
      return "User"
    }
  }

  const checkInnerValue=(inner_value) =>
  {
    if(inner_value.length > 14)	
    {
      return inner_value.substring(0, 12)+".."
    }
    else
    {
    return inner_value
    }
  }



  const logoutFunction = () => {
    Logout()
    router.push(app_coinpedia_url + "login")
  }

  const setDarkMode = () => {
    if (JsCookie.get('light_dark_mode') === "dark") {
      JsCookie.set("light_dark_mode", "light", { domain: cookieDomainExtension })
      set_light_dark_mode("light")
      // $("body").removeClass("dark_theme")
      location.reload()
    }
    else {
      JsCookie.set("light_dark_mode", "dark", { domain: cookieDomainExtension })
      set_light_dark_mode("dark")
      // $("body").addClass("dark_theme")
      location.reload()
    }
  }

  return (
    <>
      <div className="market_top_header">
        <nav className="navbar navbar-expand-lg  navbar-dark navbar_border_bottom">
          <div className="container header_responsive_section padding_header">
            <div className="col-md-12 ">
              <div className="row ">
                <div className="col-md-12">
                  {/* .......... */}
                  <div className="navbar-header">
                    <div className="row">
                      <div className="col-md-6 col-lg-3 col-xl-3 col-6">
                        <Link href={coinpedia_url} className="navbar-brand">
                          <img src={logo} className="logo_header" />
                        </Link>
                      </div>
                      <div className="col-lg-4 col-md-6 col-xl-5 market_live_price_desktop">
                        <div className="market_live_price">
                          <ul>
                            {
                              live_prices_list.length > 0 ?
                                live_prices_list.map((e,i) =>
                                  i<3?
                                  <li key="101">
                                    {/* <Link href={market_coinpedia_url+e.token_id}> */}
                                    <a href={market_coinpedia_url + e.token_id}>
                                      <h4 className="text-uppercase">{e.symbol}</h4>
                                      <h6>${separator(((parseFloat(e.price))).toFixed(2))} <span className={(parseFloat(e.usd_24h_change) >= 0 ? "green" : "red")}>({(parseFloat(e.usd_24h_change)).toFixed(2)}%)</span></h6>
                                    </a>
                                    {/* </Link> */}
                                  </li>
                                  :""
                                )
                                :
                                null
                            }
                          </ul>
                        </div>

                      </div>
                      <div className="col-md-6 col-xl-4 col-lg-5 col-6 portfolio_data_display">
                        
                        <div className='d-flex justify-content-end'>
                          <button className='active hiring_btn mbl'>
                            <a href={coinpedia_url + "careers"}>We Are Hiring</a>
                          </button>
                          <button className="navbar-toggler" onClick={() => customToggle()} type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                          <span className="navbar_toggler_icon"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18142420/toggle_menu.svg" title="Toggle Menu" alt="Toggle Menu"/></span>
                          </button>
                        </div>

                        <div className="login_portfolio">
                          {!pathname.includes("portfolio")?
                         <div className="desktop_view_crypto">
                            <div className="track_your_portfolio_desktop">
                              {
                                display_tokens_balance > 0 ?
                                  <a href={market_coinpedia_url + "portfolio"}>
                                    <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130900/line-chart.png" /> 
                                    &nbsp;Portfolio: {USDFormatValue(display_tokens_balance)}
                                    <img className="portfolio_right" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130902/right-arrow-1.png" />
                                  </a>
                                :
                                <a href={app_coinpedia_url + "login"}>
                                  <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130900/line-chart.png" /> Track your Portfolio 
                                  <img className="portfolio_right" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130902/right-arrow-1.png" />
                                </a>
                              }
                            </div>
                          </div>
                          :null}
                          
                       
                        {/* data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" */}


                        {
                           login_dropdown == 1
                            ?
                            <div className="dropdown connect_wallet_header">
                              <button className="btn connect_wallet" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17161416/connect-wallet-header.svg" className="login_img" title="login" alt="login" /> {reCreateUserName(JsCookie.get('user_full_name'))} <img src="https://image.coinpedia.org/wp-content/uploads/2022/02/07180108/caret-down.svg" className="caret_down" title="drop down" alt="drop down" />
                              </button>
                              <div className="dropdown-menu dropdown_wallet_header side-menu-list" aria-labelledby="dropdownMenuButton">
                                <h6>User</h6>
                                <Link href={market_coinpedia_url + "portfolio"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160228/menu-wallet.svg" title="Portfolio" alt="Portfolio" />Portfolio</Link>
                                <Link href={app_coinpedia_url + "profile"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130600/menu-user-profile.svg" title=" Manage User Profile" alt=" Manage User Profile" /> Manage User Profile</Link>
                                <Link href={app_coinpedia_url + "referrals"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130558/menu-referrals.svg" title="Referral List" alt="Referral List" /> Referral List</Link>

                                <h6>Company</h6>
                                <Link href={app_coinpedia_url + "company/profile"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/02/23104252/menu_company.svg" title="Company Profile" alt="Company Profile" /> Company Profile</Link>
                                <a href={market_coinpedia_url + "token"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130553/menu-token.svg" title="Manage Tokens" alt="Manage Tokens" /> Manage Tokens</a>
                                {/* <a href={market_coinpedia_url+"create-launchpad/maker"}  className="dropdown-item"><img src="/assets/img/menu-airdrop.png" /> Manage Launchpad/Airdrop</a> */}
                                <a href={market_coinpedia_url + "token/update"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130550/menu-list-token.svg" title="List a Token" alt="List a Token" /> List a Token</a>
                               
                                {/* <Link href={app_coinpedia_url + "profile/my-nft-collection"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130548/menu-nft.svg" title="My NFT Collection" alt="My NFT Collection" /> My NFT Collection</Link> */}

                                {
                                  parseInt(JsCookie.get('user_email_status')) === 0 && JsCookie.get('user_wallet_address') == "" ?
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
                                    parseInt(JsCookie.get('user_email_status')) === 0 ?
                                      <a className="header_reg_btn" href={app_coinpedia_url+"verify-email"}> Verify Email</a>
                                      :
                                      !JsCookie.get('user_wallet_address') ?
                                        <a className="header_reg_btn" href={app_coinpedia_url+"profile"}> Connect to Wallet </a>
                                        :
                                        null
                                }
                                {/* <a className="header_reg_btn" href="/register">Verify</a> */}
                                {/* <Link href="/connections"><a className="dropdown-item"><img src="/assets/img/drop_referral_list.png" /> Connections</a></Link> */}
                                <h6>Other</h6>
                                <Link href={events_coinpedia_url+"my-events"} onClick={() => customToggle()} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2022/12/30183750/desk-manage.svg" title=" Manage Events" alt=" Manage Events" className="manageevent_icon"/> Manage Events</Link>
                                <a className="dropdown-item" onClick={() => logoutFunction()} style={{ color: '#fe4b4b' }}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160229/sidemenu-logout.svg" title="Logout" alt="Logout" /> Logout</a>

                              </div>
                            </div>
                            :
                            <div className=" connect_wallet_header">
                              <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}>
                                <button className="btn connect_wallet" type="button">
                                  <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17161416/connect-wallet-header.svg" className="login_img" title="Login" alt="Login" /> Login
                                </button>
                              </Link>
                            </div>
                          }
                        </div>


                        
                      </div>
                    </div>




                  </div>
                  {/* ........... */}
                </div>
                {!pathname.includes("portfolio")?
                <div className="mobile_view_crypto">
                <div className="track_your_portfolio">
                     {
                        display_tokens_balance > 0 ?
                        <h4>
                          <a href={market_coinpedia_url + "portfolio"}>
                           
                          <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/10152629/track-portfolio.svg" /> 
                          Portfolio: $  {USDFormatValue(display_tokens_balance)}
                          <img className="portfolio_right" src="https://image.coinpedia.org/wp-content/uploads/2023/03/10171148/right-arrow.png" />
                          
                          </a>
                        </h4>
                        :
                        <h4>
                          <a href={app_coinpedia_url + "login"}>
                          <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/10152629/track-portfolio.svg" /> Track your Portfolio 
                          </a>
                        </h4>
                      }
                   </div>
                  
                  
                {/* <Slider {...settings} >

                {
                  live_prices_list.length > 0 ?
                    live_prices_list.map((e) =>
                      <div className="block_crypto">
                        <h6 className="text-uppercase">{e.symbol} <span className="crypto_value">${e.symbol == 'SC' ? separator(((parseFloat(e.price))).toFixed(4)) : separator(((parseFloat(e.price))).toFixed(2))}</span> <span className={(parseFloat(e.usd_24h_change) >= 0 ? "green" : "red")}>({(parseFloat(e.usd_24h_change)).toFixed(2)}%)</span></h6>
                      </div>
                    )
                    :
                    null
                }

                </Slider>
                */}
                
                        
                                          
                </div>
                 :null}
              </div>
            </div>
          </div>
        </nav>

        <nav className="navbar navbar-expand-lg  navbar-transparent navbar_border_bottom navbar_menu_items">
          <div className="container container_nav_pad padding_header">

            <div className="col-md-12 ">
              <div className="collapse navbar-collapse main_menu_header click_to_close" id="navbarSupportedContent">
                <div className="mobile_menu_top_header">
                  <div className="row">

                  <div className="col-md-6 col-4 back_menu_col ">
                      <button onClick={() => customToggle()} className="menu_back_btn"><img src="https://image.coinpedia.org/wp-content/uploads/2023/01/19135900/back_menu_arrow.svg" /> Back </button>
                    </div>

                    <div className="col-md-6 col-8 text-right">
                      <ul>
                        {
                          login_dropdown == 1
                            ?
                            <li><a href={app_coinpedia_url + "?active_watchlist_tab=1"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/watchlist.svg" /></a></li>
                            :
                            <li><a href={app_coinpedia_url + "login?prev_url=/?active_watchlist_tab=1"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/watchlist.svg" /></a></li>
                        }
                        {/* <li><img src="/assets/img/mobile-save.svg"/></li> */}
                        <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160227/mb-notification.svg" /></li>
                        {
                          light_dark_mode ?
                            light_dark_mode === "dark" ?
                              <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160225/mb-dark.svg" onClick={() => setDarkMode()} /></li>
                              :
                              light_dark_mode === "light" ?
                                //<div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="/assets/img/top_menu_sun.svg" /></div>
                                <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/light.svg" onClick={() => setDarkMode()} /></li>
                                :
                                null
                            :
                            <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/light.svg" onClick={() => setDarkMode()} /></li>
                        }
                      </ul>
                    </div>
                    
                  </div>
                </div>

                <ul className="nav navbar-nav">
                  {
                    login_dropdown == 1
                      ?
                      <li className="dropdown mobile_after_login_block">
                        <a className="nav-link " data-toggle="dropdown" href="#">
                          <div className="media">
                            <div className="media-left align-self-center">
                              <img src={JsCookie.get('user_profile_image') ? image_base_url + JsCookie.get('user_profile_image') : image_base_url + "default.png"} className="user_icon" />
                            </div>
                            <div className="media-body align-self-center">
                              <h4>{JsCookie.get('user_full_name')}</h4>
                              <h5>{JsCookie.get('user_email_id')}</h5>
                            </div>
                            <div className="media-right align-self-center">
                              {/* <span className="caret"></span> */}
                              <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view mt-0" />
                            </div>
                          </div>

                        </a>
                        <ul className="dropdown-menu">
                          <li className="mobileview_portfolio"><a href={app_coinpedia_url}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-portfolio.svg" /> Portfolio</a></li>
                          <li><a href={app_coinpedia_url + "profile"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-user-profile.svg" /> Manage User Profile</a></li>
                          <li><a href={app_coinpedia_url + "referrals"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-referral.svg" /> Referral List</a></li>
                          <li className="menu_company_list">Company</li>
                          <li><a href={app_coinpedia_url + "company/profile"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-company-profile.svg" /> Company Profile</a></li>
                          <li><a href={market_coinpedia_url + "token"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-manage-tokens.svg" /> Manage Tokens</a></li>
                          <li><a href={market_coinpedia_url + "token/update"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134908/mobile-menu-list-token.svg" /> List a Token</a></li>
                          <li><a href={app_coinpedia_url + "profile/my-nft-collection"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134908/mobile-menu-nft-collections.svg" /> My NFT Collection</a></li>
                          <li className="menu_company_list">Other</li>
                          <li><a href={events_coinpedia_url + "my-events"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/12/30183750/menu-company-1.svg" className="manageevent_icon" /> Manage Events</a></li>
                        </ul>
                      </li>
                      :
                      <li className="dropdown mobile_login_block">
                        <Link href={app_coinpedia_url + "login?prev_url="+market_coinpedia_url}>

                       
                          <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180324/footer-logo.svg" className="login_icon" /> Login / Create Account
                          {/* <span className="caret"></span> */}
                        
                        </Link>
                        <ul className="dropdown-menu">
                        </ul>
                      </li>
                  }

                  {/* <li className="dropdown mobile_login_block">
                          <a className="nav-link " data-toggle="dropdown" href="#">
                            <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180324/footer-logo.svg" className="login_icon" /> Login / Create Account
                            <span className="caret"></span>
                          </a>
                          <ul className="dropdown-menu">
                            <li><a href="#"><img src="/assets/img/mobile-menu-login.svg" /> Login</a></li>
                            <li><a href="#"><img src="/assets/img/mobile-menu-create.svg" /> Register</a></li>
                          </ul>
                        </li> */}

                  <li className="res_menu_list top_menu_home portfolio_icon"><Link href={app_coinpedia_url} onClick={() => customToggle()}><img src="https://image.coinpedia.org/wp-content/uploads/2022/12/29184911/portfolio.svg" className="mobile_menu_icons" alt="Portfolio" title="Portfolio"  /> Portfolio</Link></li>


                  <li className="res_menu_list top_menu_home"><a href={coinpedia_url}><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/home.svg" className="mobile_menu_icons" /> Home</a></li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/news.svg" className="mobile_menu_icons" alt="Information" title="Information" /> News <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" alt="view" title="view" />
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "altcoin/"} className="dropdown-item">Altcoin</a></li>
                        <li><a href={coinpedia_url + "bitcoin/"} className="dropdown-item">Bitcoin</a></li>
                        <li><a href={coinpedia_url + "ethereum/"} className="dropdown-item">Ethereum</a></li>
                        <li><a href={coinpedia_url + "funding/"} className="dropdown-item">Funding</a></li>
                        <li><a href={coinpedia_url + "ripple/"} className="dropdown-item">Ripple</a></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140521/information.svg" className="mobile_menu_icons" alt="Information" title="Information" /> Information <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" alt="view" title="view" />
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "documentries/"} className="dropdown-item">Documentaries</a></li>
                        <li><a href={coinpedia_url + "press-release/"} className="dropdown-item">Press Release</a></li>
                        <li><a href={coinpedia_url + "guest-post/"} className="dropdown-item">Guest Post</a></li>
                        <li><a href="https://coinpedia.org/sponsored/" className="dropdown-item">Sponsored</a></li>
                        <li><a href={coinpedia_url + "cryptocurrency-regulation/"} className="dropdown-item">Cryptocurrency regulation</a></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="markets" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160226/mb-markets.svg" className="mobile_menu_icons" /> Markets <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" />
                    </a>
                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={market_coinpedia_url} className="dropdown-item">Live Market</a></li>
                        <li><a href={coinpedia_url + "price-analysis/"} className="dropdown-item">Price Analysis</a></li>
                        <li><a href={coinpedia_url + "price-prediction/"} className="dropdown-item">Price Prediction</a></li>

                        <li><a href={market_coinpedia_url + "launchpad"} className="dropdown-item">Launchpad</a></li>
                        <li><a href={app_coinpedia_url + "nft"} className="dropdown-item">NFTs</a></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="products_review" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/review.svg" className="mobile_menu_icons" /> Product Reviews <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" />
                    </a>
                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "decentralized-exchange/"} className="dropdown-item">Decentralized Exchange</a></li>
                        <li><a href={coinpedia_url + "crypto-wallet/"} className="dropdown-item">Cryptocurrency Wallet</a></li>
                        <li><a href={coinpedia_url + "crypto-tracking-tools/"} className="dropdown-item">Crypto Tracking Tools</a></li>
                        <li><a href={coinpedia_url + "earning-site/"} className="dropdown-item">Earning sites</a></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="academy" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/academy.svg" className="mobile_menu_icons" /> Academy <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" />
                    </a>

                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "crypto-beginners/"} className="dropdown-item">Beginners Guide</a></li>
                        <li><a href={coinpedia_url + "crypto-traders/"} className="dropdown-item">Trading Guide</a></li>
                        {/* <li><a href={coinpedia_url + "blockchain-developers-guide/"} className="dropdown-item">Developers Guide</a></li> */}
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="find" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140519/find.svg" className="mobile_menu_icons" /> Find <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" />
                    </a>

                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><Link href={app_coinpedia_url + "companies"} className="dropdown-item">Companies</Link></li>
                        <li><Link href={app_coinpedia_url + "partners"} className="dropdown-item">Partners</Link></li>
                        <li><Link href={events_coinpedia_url} className="dropdown-item">Events</Link></li>
                        {/* <li><Link href={app_coinpedia_url + "jobs"}><a className="dropdown-item">Jobs</a></Link></li> */}
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="contact" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140519/contact.svg" className="mobile_menu_icons" /> Contact <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" />
                    </a>

                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "write-news-with-us/"} className="dropdown-item">Submit Guest Post</a></li>
                        <li><a href={coinpedia_url + "contact-us/"} className="dropdown-item">Submit Query</a></li>
                        <li><a href={coinpedia_url + "submit-your-press-report/"} className="dropdown-item">Submit PR</a></li>
                        <li><a href={coinpedia_url + "advertising/"} className="dropdown-item">Advertise</a></li>
                        {/* <li><a href={app_coinpedia_url+"feedback/"} >Feedback</a></li> */}
                      </ul>
                    </div>
                  </li>
                  <li className="btn_hiring_li">
                    <button className='active hiring_btn desktop'>
                      <a href={coinpedia_url + "careers"}>We Are Hiring</a>
                    </button>
                  </li>

                  {
                    login_dropdown == 1
                      ?
                      <li className="res_menu_list hide-desktop logout_img"><a onClick={() => logoutFunction()}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160227/mb-logout.svg" className="mobile_menu_icons" /> Logout</a></li>
                      :
                      ""
                  }

                </ul>
                <ul className="nav navbar-nav navbar-right ml-auto markets_new_design ">
                 <li>
                 {/* <SearchContractAddress /> */}
                </li> 
                  <li className="dark_theme_toggle" onClick={() => setDarkMode()} id="theme_color">
                    {/* <img src="https://api.coinpedia.org/uploads/tokens/1636636942618d190eb91f9.png" /> */}
                    {
                      light_dark_mode ?
                        light_dark_mode === "dark" ?
                          <div id="light_dark_mode_div" className="top_menu_skin moon" ><img id="light_dark_mode_image" src="https://image.coinpedia.org/wp-content/uploads/2022/06/20131109/top_menu_sun.webp" /></div>
                          // <div id="light_dark_mode_div" className="top_menu_skin moon" ><img id="light_dark_mode_image" src="/assets/img/top_menu_moon.png" /></div>
                          :
                          light_dark_mode === "light" ?
                            <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="https://image.coinpedia.org/wp-content/uploads/2022/06/20131104/top_menu_moon.webp" /></div>
                            // <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="/assets/img/top_menu_sun.svg" /></div>
                            :
                            null
                        :
                        <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="https://image.coinpedia.org/wp-content/uploads/2022/06/20131104/top_menu_moon.webp" /></div>
                    }

                  </li>
                  <li><a href="#"><button className="header_button notification_bell"><img src="https://image.coinpedia.org/wp-content/uploads/2022/02/07181113/notification.svg" /></button></a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
} 