import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Axios from 'axios'
import cookie from 'cookie'
import JsCookie from "js-cookie"
import $ from 'jquery';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from 'react-slick';
import { API_BASE_URL, events_coinpedia_url, app_coinpedia_url, market_coinpedia_url, coinpedia_url, Logout, separator, logo, config, api_url, cookieDomainExtension, IMAGE_BASE_URL } from '../components/constants'
import Popupmodal from './popupmodal'



export default function Topmenu() {
  const router = useRouter()
  const [current_page_url] = useState(market_coinpedia_url+((router.pathname).substring(1)))
  const [login_dropdown, set_login_dropdown] = useState(0)
  const [live_prices_list, set_live_prices_list] = useState({});
  const [light_dark_mode, set_light_dark_mode] = useState("")
  const [image_base_url] = useState(IMAGE_BASE_URL + "/profile/")
  const check_in_array = ['BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SCUSDT', 'XRPUSDT']

  useEffect(() => {
    getLivePricesList()
    $(".primary_navbar").hover(
      function () {
        $(this).children("div").addClass("result_hover");
      }

    );

    if (JsCookie.get('user_username')) {
      //console.log(JsCookie.get('user_username'))
      set_login_dropdown(1)
    }

    if (JsCookie.get('light_dark_mode') === "dark") {
      set_light_dark_mode(JsCookie.get('light_dark_mode'))
      $("body").addClass("dark_theme")
    }
    else {
      set_light_dark_mode(JsCookie.get('light_dark_mode'))
      $("body").removeClass("dark_theme")
    }
  }, [login_dropdown, JsCookie.get('light_dark_mode')])

  const customToggle = () => {
    $(".main_menu_header").toggleClass("fixed_toggle_navbar");
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




  const logoutFunction = () => {
    Logout()
    router.push(app_coinpedia_url + "login")
  }

  const setDarkMode = () => {
    if (JsCookie.get('light_dark_mode') === "dark") {
      JsCookie.set("light_dark_mode", "light", { domain: cookieDomainExtension })
      set_light_dark_mode("light")
      $("body").removeClass("dark_theme")
      location.reload()
    }
    else {
      JsCookie.set("light_dark_mode", "dark", { domain: cookieDomainExtension })
      set_light_dark_mode("dark")
      $("body").addClass("dark_theme")
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
                      <div className="col-md-6 col-lg-3 col-6">
                        <Link href={coinpedia_url}>
                          <a className="navbar-brand"><img src={logo} className="logo_header" /></a>
                        </Link>
                      </div>
                      <div className="col-lg-7 market_live_price_desktop">
                        <div className="market_live_price">
                          <ul>
                            {
                              live_prices_list.length > 0 ?
                                live_prices_list.map((e) =>
                                  <li key="101">
                                    {/* <Link href={market_coinpedia_url+e.token_id}> */}
                                    <a href={market_coinpedia_url + e.token_id}>
                                      <h4 className="text-uppercase">{e.symbol}</h4>
                                      <h6>${separator(((parseFloat(e.price))).toFixed(2))} <span className={(parseFloat(e.usd_24h_change) >= 0 ? "green" : "red")}>({(parseFloat(e.usd_24h_change)).toFixed(2)}%)</span></h6>
                                    </a>
                                    {/* </Link> */}
                                  </li>
                                )
                                :
                                null
                            }
                          </ul>
                        </div>

                      </div>
                      <div className="col-md-6 col-lg-2 col-6">
                        <div className='d-flex justify-content-end'>
                          <button className='active hiring_btn mbl'>
                            <a href={coinpedia_url + "careers"}>We Are Hiring</a>
                          </button>
                          <button className="navbar-toggler" onClick={() => customToggle()} type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                          <span className="navbar_toggler_icon"><img src="/assets/img/toggle_menu.svg" title="Toggle Menu" alt="Toggle Menu"/></span>
                          </button>
                        </div>


                        {
                          login_dropdown == 1
                            ?
                            <div className="dropdown connect_wallet_header">
                              <button className="btn connect_wallet" type="button" id="1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="/assets/img/connectwallet-header.svg" className="login_img" /> {JsCookie.get('user_username')} <img src="/assets/img/caret-down.svg" className="caret_down" />
                              </button>
                              <div className="dropdown-menu dropdown_wallet_header side-menu-list" aria-labelledby="1">
                                <h6>User</h6>
                                <a href={app_coinpedia_url} className="dropdown-item"><img src="/assets/img/menu-wallet.svg" />Portfolio</a>
                                <a href={app_coinpedia_url + "profile"} className="dropdown-item"><img src="/assets/img/menu-user-profile.svg" /> Manage User Profile</a>
                                <a href={app_coinpedia_url + "referrals"} className="dropdown-item"> <img src="/assets/img/menu-referrals.svg" /> Referral List</a>

                                <h6>Company</h6>
                                <Link href={app_coinpedia_url + "company/profile"} ><a className="dropdown-item"> <img src="/assets/img/sidemenu-company.svg" /> Company Profile</a></Link>
                                <a href={market_coinpedia_url + "token"} className="dropdown-item"><img src="/assets/img/sidemenu-token.svg" /> Manage Tokens</a>
                                {/* <a href={market_coinpedia_url+"create-launchpad/maker"}  className="dropdown-item"><img src="/assets/img/menu-airdrop.png" /> Manage Launchpad/Airdrop</a> */}
                                <a href={market_coinpedia_url + "token/create-new"} className="dropdown-item"><img src="/assets/img/sidemenu-list-token.svg" /> List a Token</a>
                                <a href={app_coinpedia_url + "profile/my-nft-collection"} className="dropdown-item"><img src="/assets/img/sidemenu-nft.svg" /> My NFT Collection</a>

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
                                    <a className="header_reg_btn" href={app_coinpedia_url + "verify-email"}> Verify </a>
                                    :
                                    parseInt(JsCookie.get('user_email_status')) === 0 ?
                                      <a className="header_reg_btn" href={app_coinpedia_url + "verify-email"}> Verify Email</a>
                                      :
                                      !JsCookie.get('user_wallet_address') ?
                                        <a className="header_reg_btn" href={app_coinpedia_url + "profile"}> Connect to Wallet </a>
                                        :
                                        null
                                }
                                <h6>Other</h6>
                                <Link href={events_coinpedia_url + "my-events"} ><a className="dropdown-item"><img src="/assets/img/menu-company.svg" /> Manage Events</a></Link>
                                <a className="dropdown-item " onClick={() => logoutFunction()} style={{ color: '#fe4b4b' }}><img src="/assets/img/sidemenu-logout.svg" /> Logout</a>

                              </div>
                            </div>
                            :
                            <div className="dropdown connect_wallet_header">
                              <button className="btn connect_wallet" type="button" id="2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="/assets/img/connectwallet-header.svg" className="login_img" /> Login<span className="hide_connnect_wallet"></span> <img src="/assets/img/caret-down.svg" className="caret_down" />
                              </button>
                              <div className="dropdown-menu dropdown_wallet_header" aria-labelledby="2">
                                {/* <a className="dropdown-item" href={app_coinpedia_url+"login"}><img src="/assets/img/menu-wallet.png" className="dark-menu-img" /><img src="/assets/img/menu-wallet.png" className="light-menu-img"/> Login via Wallet<br/><span>Connect wallet here</span></a> */}
                                {/* <a className="dropdown-item manual_login_reg" href={app_coinpedia_url + "login?prev_url="+current_page_url}><img src="/assets/img/menu-login-img.svg" className="light-menu-img" /> Manual Login</a>
                                <div className="register_now">
                                  <p>Don't have your own account? click below link to register </p>
                                  <a className="header_reg_btn" href={app_coinpedia_url + "login?prev_url="+current_page_url}><img src="/assets/img/menu-reg-img.svg" alt="register" />Create Account</a>
                                </div> */}

<Link href={app_coinpedia_url}><a className="dropdown-item manual_login_reg" ><img src="/assets/img/menu-wallet.svg" title="Portfolio" alt="Portfolio" />  Portfolio </a></Link>
                                <div className="register_now">
                                  <p>Don't have your own account? click below link to register </p>
                                  <Link href={app_coinpedia_url + "login"}><a className="header_reg_btn">Sign in / sign up</a></Link>
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
                  
                <Slider {...settings} >

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
               
                
                        
                                          
                </div>
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
                      <button onClick={() => customToggle()} className="menu_back_btn"><img src="/assets/img/back_menu_arrow.svg" /> Back </button>
                    </div>

                    <div className="col-md-6 col-8 text-right">
                      <ul>
                        {
                          login_dropdown == 1
                            ?
                            <li><a href={app_coinpedia_url + "?active_watchlist_tab=1"}><img src="https://coinpedia.org/wp-content/uploads/2022/11/watchlist.svg" /></a></li>
                            :
                            <li><a href={app_coinpedia_url + "login?prev_url=/?active_watchlist_tab=1"}><img src="https://coinpedia.org/wp-content/uploads/2022/11/watchlist.svg" /></a></li>
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
                                <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17133230/light.svg" onClick={() => setDarkMode()} /></li>
                                :
                                null
                            :
                            <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17133230/light.svg" onClick={() => setDarkMode()} /></li>
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
                              <h5>{JsCookie.get('user_username')}</h5>
                            </div>
                            <div className="media-right align-self-center">
                              {/* <span className="caret"></span> */}
                              <img src="/assets/img/caret_view.svg" className="caret_view" />
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
                          <li><a href={market_coinpedia_url + "token/create-new"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134908/mobile-menu-list-token.svg" /> List a Token</a></li>
                          <li><a href={app_coinpedia_url + "profile/my-nft-collection"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134908/mobile-menu-nft-collections.svg" /> My NFT Collection</a></li>
                          <li className="menu_company_list">Other</li>
                          <li><a href={events_coinpedia_url + "my-events"}><img src="/assets/img/menu-company.svg" /> Manage Events</a></li>
                        </ul>
                      </li>
                      :
                      <li className="dropdown mobile_login_block">
                        <Link href={app_coinpedia_url + "login?prev_url="+market_coinpedia_url}>

                        <a >
                          <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180324/footer-logo.svg" className="login_icon" /> Login / Create Account
                          {/* <span className="caret"></span> */}
                        </a>
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

                  <li className="res_menu_list top_menu_home portfolio_icon"><Link href={app_coinpedia_url}><a onClick={() => customToggle()}><img src="https://image.coinpedia.org/wp-content/uploads/2022/12/29184911/portfolio.svg" className="mobile_menu_icons" alt="Portfolio" title="Portfolio"  /> Portfolio</a></Link></li>


                  <li className="res_menu_list top_menu_home"><a href={coinpedia_url}><img src="https://coinpedia.org/wp-content/uploads/2022/11/home.svg" className="mobile_menu_icons" /> Home</a></li>

                  <li className="res_menu_list top_menu_news"><a href={coinpedia_url + "news/"}><img src="https://coinpedia.org/wp-content/uploads/2022/11/news.svg" className="mobile_menu_icons" /> News</a></li>

                  <li className="nav-item dropdown primary_navbar" >
                    <a className="nav-link dropdown-toggle" href="information" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://coinpedia.org/wp-content/uploads/2022/11/information.svg" className="mobile_menu_icons" /> Information <img src="/assets/img/caret_view.svg" className="caret_view" />
                    </a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "stocks-shares/"} className="dropdown-item">Stocks &amp; Shares</a></li>
                        <li><a href={coinpedia_url + "press-release/"} className="dropdown-item">Press Release</a></li>
                        <li><a href={coinpedia_url + "guest-post/"} className="dropdown-item">Guest Post</a></li>
                        <li><a href="https://coinpedia.org/sponsored/" className="dropdown-item">Sponsored</a></li>
                        <li><a href={coinpedia_url + "top-10/"} className="dropdown-item">Top 10's</a></li>
                        <li><a href={coinpedia_url + "cryptocurrency-regulation/"} className="dropdown-item">Cryptocurrency regulation</a></li>
                        <li><a href={coinpedia_url + "interesting-crypto-stories/"} className="dropdown-item">Interesting Crypto Stories</a></li>
                      </ul>

                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="markets" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160226/mb-markets.svg" className="mobile_menu_icons" /> Markets <img src="/assets/img/caret_view.svg" className="caret_view" />
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
                      <img src="https://coinpedia.org/wp-content/uploads/2022/11/review.svg" className="mobile_menu_icons" /> Product Reviews <img src="/assets/img/caret_view.svg" className="caret_view" />
                    </a>
                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "decentralized-exchange/"} className="dropdown-item">Decentralized Exchange</a></li>
                        <li><a href={coinpedia_url + "crypto-wallet/"} className="dropdown-item">Cryptocurrency Wallet</a></li>
                        <li><a href={coinpedia_url + "crypto-tracking-tools/"} className="dropdown-item">Crypto Tracking Tools</a></li>
                        <li><a href={coinpedia_url + "dapplist/"} className="dropdown-item">DApp</a></li>
                        <li><a href={coinpedia_url + "earning-site/"} className="dropdown-item">Earning sites</a></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="academy" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://coinpedia.org/wp-content/uploads/2022/11/academy.svg" className="mobile_menu_icons" /> Academy <img src="/assets/img/caret_view.svg" className="caret_view" />
                    </a>

                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "crypto-beginners/"} className="dropdown-item">Beginners Guide</a></li>
                        <li><a href={coinpedia_url + "crypto-traders/"} className="dropdown-item">Trading Guide</a></li>
                        <li><a href={coinpedia_url + "blockchain-developers-guide/"} className="dropdown-item">Developers Guide</a></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="find" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://coinpedia.org/wp-content/uploads/2022/11/find.svg" className="mobile_menu_icons" /> Find <img src="/assets/img/caret_view.svg" className="caret_view" />
                    </a>

                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><Link href={app_coinpedia_url + "companies"}><a className="dropdown-item">Companies</a></Link></li>
                        <li><Link href={app_coinpedia_url + "partners"}><a className="dropdown-item">Partners</a></Link></li>
                        <li><Link href={events_coinpedia_url}><a className="dropdown-item">Events</a></Link></li>
                        <li><Link href={app_coinpedia_url + "jobs"}><a className="dropdown-item">Jobs</a></Link></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle" href="contact" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://coinpedia.org/wp-content/uploads/2022/11/contact.svg" className="mobile_menu_icons" /> Contact <img src="/assets/img/caret_view.svg" className="caret_view" />
                    </a>

                    <div className="dropdown-menu " aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "write-news-with-us/"} >Submit Guest Post</a></li>
                        <li><a href={coinpedia_url + "contact-us/"} >Submit Query</a></li>
                        <li><a href={coinpedia_url + "submit-your-press-report/"} >Submit PR</a></li>
                        <li><a href={coinpedia_url + "advertising/"} >Advertise</a></li>
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
                      <li className="res_menu_list hide-desktop logout_img"><a onClick={() => logoutFunction()}><img src="/assets/img/mb-logout.svg" className="mobile_menu_icons" /> Logout</a></li>
                      :
                      ""
                  }

                </ul>
                <ul className="nav navbar-nav navbar-right ml-auto ">
                  {/* <li className="active hiring_btn"><a href={coinpedia_url+"careers"}>We Are Hiring</a></li> */}
                  <li className="dark_theme_toggle" onClick={() => setDarkMode()} id="theme_color">
                    {/* <img src="https://api.coinpedia.org/uploads/tokens/1636636942618d190eb91f9.png" /> */}
                    {
                      light_dark_mode ?
                        light_dark_mode === "dark" ?
                          <div id="light_dark_mode_div" className="top_menu_skin moon" ><img id="light_dark_mode_image" src="/assets/img/top_menu_sun.svg" /></div>
                          // <div id="light_dark_mode_div" className="top_menu_skin moon" ><img id="light_dark_mode_image" src="/assets/img/top_menu_moon.png" /></div>
                          :
                          light_dark_mode === "light" ?
                            <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="/assets/img/top_menu_moon.png" /></div>
                            // <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="/assets/img/top_menu_sun.svg" /></div>
                            :
                            null
                        :
                        <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="/assets/img/top_menu_moon.png" /></div>
                    }

                  </li>
                  <li><a href="#"><button className="header_button notification_bell"><img src="/assets/img/notification.svg" /></button></a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </>
  )
} 