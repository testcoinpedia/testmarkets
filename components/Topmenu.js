'use client';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Axios from 'axios'
import cookie from 'cookie'
import JsCookie from "js-cookie"
import { useSelector, useDispatch } from 'react-redux'
import Currency_search from '../components/layouts/headers/currency_search'
import LoginModal from '../components/layouts/auth/loginModal'
// import $ from 'jquery';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from 'react-slick';
import { API_BASE_URL, events_coinpedia_url, app_coinpedia_url, market_coinpedia_url, coinpedia_url, Logout, separator, logo, config, api_url, cookieDomainExtension, IMAGE_BASE_URL, roundNumericValue, convertvalue } from '../components/constants'

export default function Topmenu() 
{
  const router = useRouter()
  const pathname = router.pathname
  const dispatch = useDispatch()
  const userData = useSelector(state => state.userData)

  const [login_dropdown, set_login_dropdown] = useState(0)
  const [currency_modal_status, set_currency_modal_status] = useState(false)
  const [live_prices_list, set_live_prices_list] = useState({})
  const [light_dark_mode, set_light_dark_mode] = useState("")
  const [image_base_url] = useState(IMAGE_BASE_URL + "/profile/")
  const [display_tokens_balance, set_display_tokens_balance] = useState(0) 
  const [country_currencies, set_country_currencies] = useState([]) 
  const [country_currency] = useState({country_flag:"us.png",currency_code:"USD", currency_value:1, _id: 32, currency_name:"", currency_symbol:"$"}) 
  const [login_modal_status, set_login_modal_status] = useState(false)
  const [request_config, set_request_config] = useState()


  const currencyModalStatus = async () => 
  {
    await set_currency_modal_status(false)
    await set_currency_modal_status(true)
  }

  const currency_props = {
    status : true,
    currency_list:country_currencies
  }


      const convertCurrency = (token_price) =>
      {
        if(token_price)
        {
          if(active_currency.currency_value)
          {
            return active_currency.currency_symbol+" "+roundNumericValue(token_price*active_currency.currency_value)
          }
          else
          {
            return roundNumericValue(token_price)
          }
        }
        else
        {
          return '-'
        }
      }

      const shortConvertCurrency = (token_price) =>
      {
        if(token_price)
        {
          if(active_currency.currency_value)
          {
            return active_currency.currency_symbol+" "+convertvalue(token_price*active_currency.currency_value)
          }
          else
          {
            return roundNumericValue(token_price)
          }
        }
        else
        {
          return '-'
        }
      }
      
  useEffect(() => 
  {
    if(JsCookie.get('active_currency'))
    {
      
      dispatch({
        type: 'currencyConverter', data: JSON.parse(JsCookie.get("active_currency"))
      })
    }
    else
    {
      dispatch({
        type: 'currencyConverter', data: country_currency
      })
    }


  }, [JsCookie.get('display_tokens_balance')])

  useEffect(() => 
  {
    if(JsCookie.get('display_tokens_balance'))
    {
      set_display_tokens_balance(JsCookie.get('display_tokens_balance') ? JsCookie.get('display_tokens_balance'):0)
    }
  }, [JsCookie.get('display_tokens_balance')])

  const active_currency = useSelector(state => state.active_currency)

  useEffect(() => {
    getLivePricesList()
    getCountryCurriencies()
    if (JsCookie.get('user_token') || JsCookie.get('user_full_name')) {
      dispatch({
        type: 'loginAccount', data: {
          token: JsCookie.get('user_token'),
          email_id: JsCookie.get('user_email_id'),
          email_verify_status: JsCookie.get('user_email_status'),
          full_name: JsCookie.get('user_full_name'),
          user_name: JsCookie.get('user_username'),
          profile_image: JsCookie.get('user_profile_image'),
          company_listed_status: JsCookie.get('user_company_listed_status'),
          wallet_address: JsCookie.get('user_wallet_address')
        }
      })
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

  const getCountryCurriencies = async () => 
  {
    const res = await Axios.get(API_BASE_URL + "markets/cryptocurrency/country_currencies", config(""))
    if(res.data) 
    {
      set_country_currencies(res.data.message)
    }
  }

  const getLivePricesList = async () => {
    var my_array = []
    const res = await Axios.get(API_BASE_URL + "markets/tokens/live_prices", config(""))
    if (res.data) {
      if (res.data.status === true) {
        for (var key of res.data.message) {
          var createObj = {}
          createObj['symbol'] = key.symbol
          createObj['price'] = key.price
          createObj['usd_24h_change'] = key.percent_change_24h
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
    // console.log(pass_username)
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



  const logoutFunction = () => 
  {
    Logout()
    customToggle()
    dispatch({type:'logoutAccount', data:[]})
    if(pathname != '/')
    {
      router.push('/')
    }
    else
    {
      window.location= market_coinpedia_url
    }
  }
  const loginModalStatus = async () => {
    await set_login_modal_status(false)
    await set_login_modal_status(true)
    
  }

  const getDataFromChild = async (name) => 
  {
    // await set_login_modal_status(false)
    // await set_user_token(JsCookie.get("user_token"))
    // await set_request_config(JsCookie.get("user_token"))
   
    // router.reload("pass_object",pass_object)
    console.log("name",name)
    // callback(name)
  }

  const login_props = {
    status: true,
    request_config: request_config,
    callback: getDataFromChild
  }

  const setDarkMode = () => {
    // if (JsCookie.get('light_dark_mode') === "dark") {
    //   JsCookie.set("light_dark_mode", "light", { domain: cookieDomainExtension })
    //   set_light_dark_mode("light")
    //   $("body").removeClass("dark_theme")
    // }
    // else {
    //   JsCookie.set("light_dark_mode", "dark", { domain: cookieDomainExtension })
    //   set_light_dark_mode("dark")
    //   $("body").addClass("dark_theme")
    // }

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
                          <img src={logo} className="logo_header" alt="Logo"/>
                        </Link>
                      </div>
                      <div className="col-lg-4 col-md-6 col-xl-5 market_live_price_desktop">
                        <div className="market_live_price">
                          <ul>
                            {
                              live_prices_list.length > 0 ?
                                live_prices_list.map((e,i) =>
                                  i<3?
                                  <li key={i}>
                                    {/* <Link href={market_coinpedia_url+e.token_id}> */}
                                    <a href={market_coinpedia_url + e.token_id+"/"}>
                                      <h4 className="text-uppercase">{e.symbol}</h4>
                                      <h6>{convertCurrency(((parseFloat(e.price))).toFixed(2))} <span className={(parseFloat(e.usd_24h_change) >= 0 ? "green" : "red")}>({(parseFloat(e.usd_24h_change)).toFixed(2)}%)</span></h6>
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
                          {/* <button className='active hiring_btn mbl'>
                            <a href={coinpedia_url + "careers/"}>We Are Hiring</a>
                          </button> */}
                          <button className="country_currency usd_button_mobile">
                      
                      {
                        active_currency._id ?
                        <>
                        <div className="media" onClick={()=>currencyModalStatus()}>
                          <div className="media-left">
                            <img className='country-active-flag' src={"/assets/img/flags/"+active_currency.country_flag}  alt="UserIcon" />
                          </div>
                          <div className="media-body ">
                          <span className="currency-item">{active_currency.currency_code}</span>
                          </div>
                          <div className="media-right ml-1 ">
                            <img src="https://image.coinpedia.org/wp-content/uploads/2022/02/07180108/caret-down.svg" className="currency_caret_down" title="" alt="drop down" />
                          </div>
                        </div>
                        </>
                        
                        : 
                        ""
                      } 
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
                                <a href={market_coinpedia_url + "portfolio/"}>
                                  <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130900/line-chart.png" alt="Growth Icon" title="Growth Icon"/> 
                                  &nbsp;Portfolio: {shortConvertCurrency(display_tokens_balance)}
                                  <img className="portfolio_right" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130902/right-arrow-1.png" alt="Right Arrow" title="Right Arrow"/>
                                </a>
                                :
                                <a href={market_coinpedia_url + "portfolio"}>
                                  <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130900/line-chart.png" alt="Growth Icon" title="Growth Icon"/> Track your Portfolio 
                                  <img className="portfolio_right" src="https://image.coinpedia.org/wp-content/uploads/2023/03/20130902/right-arrow-1.png" alt="Right Arrow" title="Right Arrow"/>
                                </a>
                              }
                            </div>
                          </div>
                          :null}
                          
                       
                        {/* data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" */}


                        {
                           userData.token ?
                            <div className="dropdown connect_wallet_header">
                              <button className="connect_wallet" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17161416/connect-wallet-header.svg" className="login_img" title="login" alt="login" /> {reCreateUserName(userData.full_name)} <img src="https://image.coinpedia.org/wp-content/uploads/2022/02/07180108/caret-down.svg" className="caret_down" title="drop down" alt="drop down" />
                              </button>
                              <div className="dropdown-menu dropdown_wallet_header side-menu-list" aria-labelledby="dropdownMenuButton">
                                <h6>User</h6>
                                <Link href={market_coinpedia_url + "portfolio/"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160228/menu-wallet.svg" title="Portfolio" alt="Portfolio" />Portfolio</Link>
                                <Link href={app_coinpedia_url + "profile/"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130600/menu-user-profile.svg" title=" Manage User Profile" alt=" Manage User Profile" /> Manage User Profile</Link>
                                <Link href={app_coinpedia_url + "referrals/"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130558/menu-referrals.svg" title="Referral List" alt="Referral List" /> Referral List</Link>

                                <h6>Company</h6>
                                <Link href={app_coinpedia_url + "company/profile/"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/02/23104252/menu_company.svg" title="Company Profile" alt="Company Profile" /> Company Profile</Link>
                                <a href={market_coinpedia_url + "token/"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130553/menu-token.svg" title="Manage Tokens" alt="Manage Tokens" /> Manage Tokens</a>
                                {/* <a href={market_coinpedia_url+"create-launchpad/maker"}  className="dropdown-item"><img src="/assets/img/menu-airdrop.png" /> Manage Launchpad/Airdrop</a> */}
                                <a href={market_coinpedia_url + "token/update/"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130550/menu-list-token.svg" title="List a Token" alt="List a Token" /> List a Token</a>
                                {/* <Link href={app_coinpedia_url + "profile/my-nft-collection"} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18130548/menu-nft.svg" title="My NFT Collection" alt="My NFT Collection" /> My NFT Collection</Link> */}
                               
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
                                        <a className="header_reg_btn" href={app_coinpedia_url+"profile/"}> Connect to Wallet </a>
                                        :
                                        null
                                }
                                {/* <a className="header_reg_btn" href="/register">Verify</a> */}
                                {/* <Link href="/connections"><a className="dropdown-item"><img src="/assets/img/drop_referral_list.png" /> Connections</a></Link> */}
                                <h6>Other</h6>
                                <Link href={events_coinpedia_url+"my-events/"} onClick={() => customToggle()} className="dropdown-item"><img src="https://image.coinpedia.org/wp-content/uploads/2023/09/22163647/menu_manage_event.svg" title=" Manage Events" alt=" Manage Events" className="manageevent_icon"/> Manage Events</Link>
                                <a className="dropdown-item" onClick={() => logoutFunction()} style={{ color: '#fe4b4b' }}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160229/sidemenu-logout.svg" title="Logout" alt="Logout" /> Logout</a>

                              </div>
                            </div>
                            :
                            <div className=" connect_wallet_header"onClick={() => loginModalStatus()}>
                              {/* <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}> */}
                              {/* <button className="connect_wallet" type="button" > */}
                              <span  className="btn connect_wallet" role="button">
                                  <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17161416/connect-wallet-header.svg" className="login_img" title="Login" alt="Login" /> Login
                                  </span>
                                {/* </button> */}
                              {/* </Link> */}
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
                          <a href={market_coinpedia_url + "portfolio/"}>
                            <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/10152629/track-portfolio.svg" alt="Growth Icon" title="Growth Icon" /> 
                            Portfolio: {shortConvertCurrency(display_tokens_balance)}
                            <img className="portfolio_right" src="https://image.coinpedia.org/wp-content/uploads/2023/03/10171148/right-arrow.png" alt="Right Arrow" title="Right Arrow" />
                          </a>
                        </h4>
                        :
                        <h4>
                          <a href={market_coinpedia_url + "portfolio/"}>
                          <img className="growth_icon" src="https://image.coinpedia.org/wp-content/uploads/2023/03/10152629/track-portfolio.svg" alt="Growth Icon" title="Growth Icon" /> Track your Portfolio 
                          <img className="portfolio_right" src="https://image.coinpedia.org/wp-content/uploads/2023/03/10171148/right-arrow.png" alt="Right Arrow" title="Right Arrow" />
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
                      <button onClick={() => customToggle()} className="menu_back_btn"><img src="https://image.coinpedia.org/wp-content/uploads/2023/01/19135900/back_menu_arrow.svg" alt="Back Menu"/> Back </button>
                    </div>

                    <div className="col-md-6 col-8 text-right">
                      <ul>
                        {
                          userData.token ?
                            <li><a href={app_coinpedia_url + "?active_watchlist_tab=1"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/watchlist.svg" alt="Watchlist" /></a></li>
                            :
                            <li><a href={app_coinpedia_url + "login?prev_url=/?active_watchlist_tab=1"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/watchlist.svg" alt="Watchlist" /></a></li>
                        }
                        {/* <li><img src="/assets/img/mobile-save.svg"/></li> */}
                        <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160227/mb-notification.svg" alt="Notification" /></li>
                        {
                          light_dark_mode ?
                            light_dark_mode === "dark" ?
                            // <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160225/mb-dark.svg" alt="Dark"  onClick={() => setDarkMode()} /></li>
                            <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160225/mb-dark.svg" alt="Dark"   /></li>
                            :
                              light_dark_mode === "light" ?
                                //<div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="/assets/img/top_menu_sun.svg" /></div>
                                <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/light.svg" alt="Light"  /></li>
                                :
                                null
                            :
                            <li><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/light.svg" alt="Light"  /></li>
                        }
                      </ul>
                    </div>
                    
                  </div>
                </div>

                <ul className="nav navbar-nav">
                  {
                    userData.token ?
                      <li className="dropdown mobile_after_login_block">
                        <a className="nav-link " data-toggle="dropdown" href="#">
                          <div className="media">
                            <div className="media-left align-self-center">
                              <img src={userData.profile_image ? image_base_url + userData.profile_image : image_base_url + "default.png"} className="user_icon" alt="UserIcon" />
                            </div>
                            <div className="media-body align-self-center">
                              <h4>{userData.full_name}</h4>
                              <h5>{userData.email_id}</h5>
                            </div>
                            <div className="media-right align-self-center">
                              {/* <span className="caret"></span> */}
                              <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view mt-0" alt="Caret View" />
                            </div>
                          </div>

                        </a>
                        <ul className="dropdown-menu ">
                          <li className="mobileview_portfolio"><a href={market_coinpedia_url + "portfolio/"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-portfolio.svg" alt="Menu Portfolio"  /> Portfolio</a></li>
                          <li><a href={app_coinpedia_url + "profile"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-user-profile.svg" alt="Menu User" /> Manage User Profile</a></li>
                          <li><a href={app_coinpedia_url + "referrals"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-referral.svg" alt="Menu Referral" /> Referral List</a></li>
                          <li className="menu_company_list">Company</li>
                          <li><a href={app_coinpedia_url + "company/profile"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-company-profile.svg" alt="Menu Company" /> Company Profile</a></li>
                          <li><a href={market_coinpedia_url + "token"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134907/mobile-menu-manage-tokens.svg" alt="Menu Tokens" /> Manage Tokens</a></li>
                          <li><a href={market_coinpedia_url + "token/update"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134908/mobile-menu-list-token.svg" alt="Menu List" /> List a Token</a></li>
                          {/* <li><a href={app_coinpedia_url + "profile/my-nft-collection"}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/17134908/mobile-menu-nft-collections.svg" alt="Menu Collection" /> My NFT Collection</a></li> */}
                          <li className="menu_company_list">Other</li>
                          <li><a href={events_coinpedia_url + "my-events"}><img src="https://image.coinpedia.org/wp-content/uploads/2023/09/22163650/menu_manage_event_white.svg" alt="Menu Company" className="manageevent_icon" /> Manage Events</a></li>
                        </ul>
                      </li>
                      :
                      <li className="dropdown mobile_login_block"onClick={() => loginModalStatus()}>
                        {/* <Link href={app_coinpedia_url + "login?prev_url="+market_coinpedia_url}> */}

                        <a onClick={() => customToggle()}>
                          <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/25180324/footer-logo.svg" alt="Footer Logo"  className="login_icon" /> Login / Create Account
                          {/* <span className="caret"></span> */}
                        </a>
                        {/* </Link> */}
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

                  <li className="res_menu_list top_menu_home portfolio_icon"><Link href={market_coinpedia_url + "portfolio/"} onClick={() => customToggle()}><img src="https://image.coinpedia.org/wp-content/uploads/2022/12/29184911/portfolio.svg" className="mobile_menu_icons" alt="Portfolio" title="Portfolio"  /> Portfolio</Link></li>


                  <li className="res_menu_list top_menu_home"><a href={coinpedia_url}><img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140518/home.svg" alt="Home"  className="mobile_menu_icons" /> Home</a></li>

                  <li className="nav-item dropdown primary_navbar">
                    <a href={coinpedia_url + "news/"} className="nav-link hide_mobile_view">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/news.svg" className="mobile_menu_icons" alt="Information" title="Information" /> News 
                    </a>

                    <a href={coinpedia_url + "news/"} className="nav-link hide_dektop_view">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/news.svg" className="mobile_menu_icons" alt="Information" title="Information" /> News 
                    </a>
                    {/* <div className="dropdown-menu result_hover" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "altcoin/"} className="dropdown-item">Altcoin</a></li>
                        <li><a href={coinpedia_url + "bitcoin/"} className="dropdown-item">Bitcoin</a></li>
                        <li><a href={coinpedia_url + "ethereum/"} className="dropdown-item">Ethereum</a></li>
                        <li><a href={coinpedia_url + "funding/"} className="dropdown-item">Funding</a></li>
                        <li><a href={coinpedia_url + "ripple/"} className="dropdown-item">Ripple</a></li>
                      </ul>
                    </div> */}
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a href={coinpedia_url + "information/"} className="nav-link dropdown-toggle hide_mobile_view"  id="navbarDropdown" >
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140521/information.svg" className="mobile_menu_icons" alt="Information" title="Information" /> Information <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" alt="view" title="view" />
                    </a>

                    <a href={coinpedia_url + "information/"} className="nav-link dropdown-toggle hide_dektop_view"  id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140521/information.svg" className="mobile_menu_icons" alt="Information" title="Information" /> Information <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" className="caret_view" alt="view" title="view" />
                    </a>
                    
                    <div className="dropdown-menu result_hover" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "documentries/"} className="dropdown-item">Documentaries</a></li>
                        <li><a href={coinpedia_url + "research-report/"} className="dropdown-item">Research Report</a></li>
                        <li><a href={coinpedia_url + "press-release/"} className="dropdown-item">Press Release</a></li>
                        <li><a href={coinpedia_url + "guest-post/"} className="dropdown-item">Guest Post</a></li>
                        <li><a href={coinpedia_url + "sponsored/"} className="dropdown-item">Sponsored</a></li>
                        <li><a href={coinpedia_url + "cryptocurrency-regulation/"} className="dropdown-item">Cryptocurrency regulation</a></li>
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle hide_mobile_view" href="#" id="navbarDropdown" >
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160226/mb-markets.svg" alt="Markets" className="mobile_menu_icons" /> Markets <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <a className="nav-link dropdown-toggle hide_dektop_view" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160226/mb-markets.svg" alt="Markets" className="mobile_menu_icons" /> Markets <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>
                    <div className="dropdown-menu result_hover" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={market_coinpedia_url} className="dropdown-item">Live Market</a></li>
                        <li><a href={coinpedia_url + "price-analysis/"} className="dropdown-item">Price Analysis</a></li>
                        <li><a href={coinpedia_url + "price-prediction/"} className="dropdown-item">Cryptocurrency Price Prediction</a></li>

                        <li><a href={market_coinpedia_url + "launchpad/"} className="dropdown-item">Launchpad</a></li>
                        <li><a href={market_coinpedia_url + "airdrops/"} className="dropdown-item">Airdrops</a></li>
                        {/* <li><a href={app_coinpedia_url + "nft"} className="dropdown-item">NFTs</a></li> */}
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle hide_mobile_view" href="#" id="navbarDropdown" >
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/review.svg" alt="Review" className="mobile_menu_icons" /> Product Reviews <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <a className="nav-link dropdown-toggle hide_dektop_view" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/review.svg" alt="Review" className="mobile_menu_icons" /> Product Reviews <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>
                    <div className="dropdown-menu result_hover" aria-labelledby="navbarDropdown">
                      <ul>
                      <li><a href={coinpedia_url + "exchange/"} className="dropdown-item">Centralized Exchanges</a></li>
                        <li><a href={coinpedia_url + "decentralized-exchange/"} className="dropdown-item">Decentralized Exchanges</a></li>
                        <li><a href={coinpedia_url + "crypto-wallet/"} className="dropdown-item">Cryptocurrency Wallets</a></li>
                        <li><a href={coinpedia_url + "crypto-tracking-tools/"} className="dropdown-item">Crypto Tracking Tools</a></li>
                        <li><a href={coinpedia_url + "earning-site/"} className="dropdown-item">Earning Sites</a></li>
                      </ul>
                    </div>
                  </li>
                  
                  <li className="nav-item dropdown primary_navbar">
                    <a href={coinpedia_url + "academy/"} className="nav-link dropdown-toggle hide_mobile_view"  id="navbarDropdown">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/academy.svg" alt="Academy" className="mobile_menu_icons" /> Academy <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <a href={coinpedia_url + "academy/"} className="nav-link dropdown-toggle hide_dektop_view"  id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140520/academy.svg" alt="Academy" className="mobile_menu_icons" /> Academy <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <div className="dropdown-menu result_hover" aria-labelledby="navbarDropdown">
                      <ul>
                      <li><a href={coinpedia_url + "academy/"} className="dropdown-item">Overview</a></li>
                        <li><a href={coinpedia_url + "beginners-guide/"} className="dropdown-item">Beginners Guide</a></li>
                        <li><a href={coinpedia_url + "traders/"} className="dropdown-item">Traders Guide</a></li>
                        <li><a href={coinpedia_url + "checklist/"} className="dropdown-item">Checklist</a></li>
                        <li><a href={coinpedia_url + "contest/"} className="dropdown-item">Contest</a></li>
                        {/* <li><a href={coinpedia_url + "blockchain-developers-guide/"} className="dropdown-item">Developers Guide</a></li> */}
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle hide_mobile_view" href="#" id="navbarDropdown" >
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140519/find.svg" alt="Find" className="mobile_menu_icons" /> Find <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <a className="nav-link dropdown-toggle hide_dektop_view" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140519/find.svg" alt="Find" className="mobile_menu_icons" /> Find <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <div className="dropdown-menu result_hover" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><Link href={app_coinpedia_url + "companies/"} className="dropdown-item">Companies</Link></li>
                        <li><Link href={app_coinpedia_url + "partners/"} className="dropdown-item">Partners</Link></li>
                        <li><Link href={events_coinpedia_url} className="dropdown-item">Events</Link></li>
                        <li><Link href={app_coinpedia_url+ "professionals/"} className="dropdown-item">Professionals</Link></li>
                        {/* <li><Link href={app_coinpedia_url + "jobs"}><a className="dropdown-item">Jobs</a></Link></li> */}
                      </ul>
                    </div>
                  </li>

                  <li className="nav-item dropdown primary_navbar">
                    <a className="nav-link dropdown-toggle hide_mobile_view" href="#" id="navbarDropdown">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140519/contact.svg" alt="Contact" className="mobile_menu_icons" /> Contact <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <a className="nav-link dropdown-toggle hide_dektop_view" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src="https://image.coinpedia.org/wp-content/uploads/2022/11/05140519/contact.svg" alt="Contact" className="mobile_menu_icons" /> Contact <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18131516/caret_view.svg" alt="Caret View" className="caret_view" />
                    </a>

                    <div className="dropdown-menu result_hover" aria-labelledby="navbarDropdown">
                      <ul>
                        <li><a href={coinpedia_url + "write-news-with-us/"} className="dropdown-item">Submit Guest Post</a></li>
                        <li><a href={coinpedia_url + "contact-us/"} className="dropdown-item">Submit Query</a></li>
                        <li><a href={coinpedia_url + "submit-your-press-report/"} className="dropdown-item">Submit PR</a></li>
                        <li><a href={coinpedia_url + "advertising/"} className="dropdown-item">Advertise</a></li>
                        {/* <li><a href={app_coinpedia_url+"feedback/"} >Feedback</a></li> */}
                      </ul>
                    </div>
                  </li>
                  {/* <li className="btn_hiring_li">
                    <button className='active hiring_btn desktop'>
                      <a href={coinpedia_url + "careers/"}>We Are Hiring</a>
                    </button>
                  </li> */}

                  {
                    userData.token ?
                      <li className="res_menu_list hide-desktop logout_img"><a onClick={() => logoutFunction()}><img src="https://image.coinpedia.org/wp-content/uploads/2022/06/21160227/mb-logout.svg" alt="Log Out" className="mobile_menu_icons" /> Logout</a></li>
                      :
                      ""
                  }

                </ul>
                <ul className="nav navbar-nav navbar-right ml-auto markets_new_design ">
                <li>
                <button className="header_button">
                      
                      {
                        active_currency._id ?
                        <>
                        <div className="media" onClick={()=>currencyModalStatus()}>
                          <div className="media-left">
                            <img className='country-active-flag' src={"/assets/img/flags/"+active_currency.country_flag}  alt="UserIcon" />
                          </div>
                          <div className="media-body ">
                          <span className="currency-item">{active_currency.currency_code}</span>
                          </div>
                          <div className="media-right ml-1 ">
                            <img src="https://image.coinpedia.org/wp-content/uploads/2022/02/07180108/caret-down.svg" className="currency_caret_down" title="" alt="drop down" />
                          </div>
                        </div>
                        </>
                        
                        : 
                        ""
                      } 
                    </button>
                </li>
                <li className="dropdown">
                  <a data-toggle="dropdown" href="#">
                   
                  </a>
                </li>
                <li className="dark_theme_toggle" onClick={() => setDarkMode()} id="theme_color">
                    {
                      light_dark_mode ?
                        light_dark_mode === "dark" ?
                          //<div id="light_dark_mode_div" className="top_menu_skin moon" ><img id="light_dark_mode_image" src="/assets/img/top_menu_moon.png" /></div>
                          <div id="light_dark_mode_div" className="top_menu_skin moon" ><img id="light_dark_mode_image" src="https://image.coinpedia.org/wp-content/uploads/2022/06/20131109/top_menu_sun.webp" alt="Light Mode" title="Light Mode" /></div>
                          :
                          light_dark_mode === "light" ?
                            //<div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="/assets/img/top_menu_sun.svg" /></div>
                            <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="https://image.coinpedia.org/wp-content/uploads/2022/06/20131104/top_menu_moon.webp" alt="Light Mode" title="Light Mode" /></div>
                            :
                            null
                        :
                        <div id="light_dark_mode_div" className="top_menu_skin sun" ><img id="light_dark_mode_image" src="https://image.coinpedia.org/wp-content/uploads/2022/06/20131104/top_menu_moon.webp" alt="Dark Mode" title="Dark Mode" /></div>
                    }

                  </li>
                  <li><a href="#"><button className="header_button notification_bell"><img src="https://image.coinpedia.org/wp-content/uploads/2022/02/07181113/notification.svg" alt="Notification"  /></button></a></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {currency_modal_status ? <Currency_search reqData={currency_props}  /> : null}
      {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
      
    </>
  )
} 