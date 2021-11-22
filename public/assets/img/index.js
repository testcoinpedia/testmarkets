import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
import Head from 'next/head'; 
import Axios from 'axios';
import JsCookie from 'js-cookie'; 
import cookie from 'cookie'
import Popupmodal from '../components/popupmodal'
import Slider from "react-slick";
import { website_url, x_api_key, api_url, graphqlApiURL, graphqlApiKEY, strLenTrim, separator, currency_object} from '../components/constants' 
import TableContentLoader from '../components/loaders/tableLoader' 
var $ = require( "jquery" );

export default function WalletDetails({userAgent, config}) 
{  
  if(userAgent.alert_message) 
   {
      var alertObj = {icon: "/assets/img/update-successful.png", title: "Thank You!", content: userAgent.alert_message}
   }
   else
   {
      var alertObj = {icon:"", title:"", content:""}
   }
  var settings = {
    slidesToShow: 3,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 1500,
    arrows: true,
    dots: false,
    cssEase: 'linear',
    responsive:[{
      breakpoint:520,
      settings:{
        slidesToShow:1
      }
    }]
  }
  
  const [user_token] = useState(userAgent.user_token) 
  const [user_email_status] = useState(userAgent.user_email_status) 
  const [nickName, setnickName] = useState() 
  const [pastAddress, setpastAddress] = useState() 
  const [errnickName, seterrnickName] = useState("") 
  const [errpastAddress, seterrpastAddress] = useState("") 
  const [add_new_wallet_modal, set_add_new_wallet_modal] = useState(false)
  const [modal_data, set_modal_data] = useState(alertObj)
  const [added_wallet_list, set_added_wallet_list]=useState([])
  const [wallet_active_class, set_wallet_active_class]=useState(0)
  const [image_base_url]=useState(api_url+"uploads/tokens/")
  
  const [wallet_active_address, set_wallet_active_address]=useState("")
  const [eth_wallet_balance, set_eth_wallet_balance]=useState(0)
  const [eth_wallet_list, set_eth_wallet_list]=useState([])
  const [total_wallet_balance, set_total_wallet_balance]=useState(0)

  const [bnb_wallet_balance, set_bnb_wallet_balance]=useState(0)
  const [bnb_wallet_list, set_bnb_wallet_list]=useState([])
  const [network_tab, set_network_tab]=useState(1)
  const [apistatus, setapistatus]=useState(false)
  const [wallet_confirm_remove_modal, set_wallet_confirm_remove_modal]=useState(false)
  const [wallet_row_id, set_wallet_row_id]=useState('')
  
  
  const set_active_wallet_details =(item_number, wallet_address)=>
  { 
    // console.log(wallet_address)
    set_network_tab(1)
    set_wallet_active_class(item_number)
    set_wallet_active_address(wallet_address)
    getEthereumTokensList(wallet_address)
    getBnbWalletTokensList(wallet_address)
  }

  const fetchAPIQuery = (query) => 
  {
    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    }
  }

  
  

  
  

  const graphqlBasicTokenData = (wallet_address, network) => 
  {
    return `
      query{
        ethereum(network: `+network+`) {
          address(address: {is: "`+wallet_address+`"}) {
            balances(height: {gteq: 100}) {
              currency {
                address
                name
                symbol
              }
              value
            }
          }
        }
      }
        ` 
  }
  const graphqlPricingTokenData = (address, network) => 
  {
    var dateSince = ((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString())
    if(network == 'ethereum')
    {
      var addr1 = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
      var addr2 = "0xdac17f958d2ee523a2206206994597c13d831ec7"
    }
    else
    {
      var addr1 = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
      var addr2 = "0xe9e7cea3dedca5984780bafc599bd69add087d56"
    }

    return `
          query
          {
            ethereum(network: ` + network + `) {
              dexTrades(
                date: {since: "` + dateSince + `"}
                any: [{baseCurrency: {is: "`+ address +`"}, quoteCurrency: {is:"`+addr1+`"}}, {baseCurrency: {is: "`+addr1+`"}, quoteCurrency: {is: "`+addr2+`"}}]
                options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
              ) {
                baseCurrency {
                  symbol
                }
                block {
                  height
                }
                transaction {
                  index
                }
          
                quoteCurrency {
                  symbol
                }
                quote: quotePrice
              }
            }
          }
      ` 
  }

  const closeaddwallet=()=>
  {
    
    seterrpastAddress("")
    seterrnickName("")
    set_add_new_wallet_modal(false)
    

  }


  const getEthereumTokensList = async (wallet_address)=>
  { 
      // console.log(wallet_address)
      let balance =  0
      var innnerResult = new Array()
      const query = await graphqlBasicTokenData(wallet_address, "ethereum")
      const opts = await fetchAPIQuery(query)

        

      const res = await fetch(graphqlApiURL, opts)
      const result = await res.json()
      if(!result.error)
      {
        if(result.data.ethereum.address[0].balances.length > 0)
        {
          result.data.ethereum.address[0].balances.map(async (item) => 
          {
            var createObj = {}
            createObj['value'] = item.value
            createObj['address'] = item.currency.address
            createObj['name'] = item.currency.name
            createObj['symbol'] = item.currency.symbol

            var address = item.currency.address
            if(item.currency.address === "-") 
            {
              address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            }
            var  quotePrice = 0
            createObj['quotePrice'] =  0
            if((currency_object[(item.currency.symbol).toLowerCase()]) !== undefined)
            {
              const response = await fetch("https://api.coingecko.com/api/v3/coins/"+currency_object[(item.currency.symbol).toLowerCase()])
              const json = await response.json()
              if(!json.error)
              { 
                  createObj['quotePrice'] = quotePrice = await json.market_data.current_price.usd
                  
              }
            }
            balance += await (quotePrice*item.value)
            await set_eth_wallet_balance(balance)
            await set_total_wallet_balance(balance)
            await innnerResult.push(createObj)
            setapistatus(true)
            await set_eth_wallet_list(innnerResult)  
          })
        }
        else
        {
          await set_eth_wallet_list([]) 
        }
      }
      else
      {
        await set_eth_wallet_list([])
      }
      // console.log('innerResult', innnerResult)
  }


  const getBnbWalletTokensList = (wallet_address)=>
  {
    let balance =  0
    var highest_value = 0
    let array = []
    const query = graphqlBasicTokenData(wallet_address, "bsc")
    const opts = fetchAPIQuery(query)
    fetch(graphqlApiURL, opts).then(res => res.json())
    .then(result => 
    {     
        if(result.data)
        {

          if(result.data.ethereum.address[0].balances.length > 0)
          { 
              for(const item of result.data.ethereum.address[0].balances)
              {
                if(item.currency.address === "-") 
                {
                  item.currency.address = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
                }

                let query =   graphqlPricingTokenData(item.currency.address, "bsc")
                const tokenBalOpts =  fetchAPIQuery(query) 

                fetch(graphqlApiURL, tokenBalOpts).then(tokenBalRes => tokenBalRes.json())
                .then(tokenBalResult => 
                { 
                  //console.log("tokenBalResult", tokenBalResult) 
                  
                  if (item.currency.address === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c")
                  {
                    item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote
                  } 
                  else 
                  {

                    if(tokenBalResult.data.ethereum.dexTrades.length > 1)
                    {
                      item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote * tokenBalResult.data.ethereum.dexTrades[1].quote;
                    }
                    else
                    {
                      item.quotePrice = 0
                    }
                  }  
                 
                  balance = (balance+item.quotePrice * item.value) 
                  item.totalPrice =  item.quotePrice * item.value
                  array.push(item) 
                  set_bnb_wallet_balance(balance)
                  setapistatus(true)
                  set_bnb_wallet_list(array)
                })
              }
              // console.log(array)
          }
          else
          {
            set_bnb_wallet_list([])
            set_bnb_wallet_balance(0)
          }
        }
    }).catch(
      set_bnb_wallet_list([])
    );
  }
  
 

  useEffect(() => 
  {
    if(user_token)
    {
      getportfolio()
    }
    if(userAgent.alert_message)
    {
        JsCookie.remove('alert_message')
    }

    var $j = jQuery.noConflict();

    $j(document).ready(function() {
      $j('[data-toggle="tooltip"]').tooltip();
    })
  }, [])

  const saveWallet =()=>
  {     
    let formIsValid = true 
    seterrpastAddress("")
    seterrnickName("")
    set_modal_data({  icon: "", title: "", content:""})

    if(!pastAddress)
    {
      formIsValid = false
      seterrpastAddress("Wallet Address field is required")
    } 
    else if(pastAddress.length < 4)
    {
      formIsValid = false
      seterrpastAddress("Wallet Address should have 4 length")
    }
    
    if(!nickName)
    {
      formIsValid = false
      seterrnickName("NickName field is required")
      
    } 
    else if(nickName.length < 4)
    {
      formIsValid = false
      seterrnickName("The user name field must be at least 4 characters in length.")
    }

    if(!formIsValid)
    {
      return
    }
    var reqObj = {
      wallet_network_type:"1",
      wallet_address: pastAddress,
      nick_name: nickName
    }

    Axios.post(api_url+"portfolio/add_new", reqObj, config).then(res => 
    {
      console.log(res)
      setnickName("")
      setpastAddress("")
      set_add_new_wallet_modal(false)
      if(res.data.status==true) 
      {
          console.log("Added succesfully")
          set_modal_data({icon: "/assets/img/update-successful.png", title: " Thank you !", content: res.data.message.alert_message})
          getportfolio()
      }
      else
      {
          set_modal_data({icon: "/assets/img/close_error.png", title: "OOPS!", content: res.data.message.alert_message})
      }
    }) 
  }
  
  const getportfolio=()=>
  {
    
    (user_token && (parseInt(user_email_status) === 1)) ? 
    Axios.get(api_url+'portfolio/portfolio_list', config).then(res =>
    {
        if(res.data.status==true)
        {     
          set_added_wallet_list(res.data.message)
          if(res.data.message.length > 0)
          {
            getBnbWalletTokensList(res.data.message[0].wallet_address)
            set_wallet_active_address(res.data.message[0].wallet_address)
            getEthereumTokensList(res.data.message[0].wallet_address)
          }
        }
    })
    :
    null
  }

  const walletConfirmRemove=(remove_id) =>
  {
    set_wallet_confirm_remove_modal(true)
    set_wallet_row_id(remove_id)
  }

  
  const removeWallet=()=>
  { 
    set_modal_data({  icon: "", title: "", content:""})
    Axios.get(api_url+'portfolio/remove_wallet/'+wallet_row_id, config).then(res =>
    {
      set_wallet_confirm_remove_modal(false)
        if(res.data.status==true)
        {     
          set_modal_data({icon: "/assets/img/update-successful.png", title: " Thank you !", content: res.data.message.alert_message})
          getportfolio()
        } 
    })
  }
    
  const makeJobSchema=()=>
  {  
    return { 
        "@context":"http://schema.org/",
        "@type":"Organization",
        "name":"Portfolio",
        "url":website_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
  }

  return(
    <>
      <Head>
        <title>Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="keywords" content="Cryptocurrency Market, cryptocurrency market sentiments, crypto market insights, cryptocurrency Market Analysis, NFT Price today, DeFi Token price, Top crypto gainers, top crypto loosers, Cryptocurrency market, Cryptocurrency Live market Price, NFT Live Chart, Cryptocurrency analysis tool." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta property="og:url" content={website_url} />
        <meta property="og:site_name" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta name="twitter:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        {/* <link rel="shortcut icon" type="image/x-icon" href={favicon}/> */}
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>

        <link rel="canonical" href={website_url} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head> 
    <div className="page">
      {
        (!user_token) ?
        <div className="login_overlay">
            <div className="login_overlay_block">
              <img src="/assets/img/login_overlay.png" />
              <p>Login to continue</p>
              <Link href={"/login"}><a className="btn-gradient-primary access_login">Login</a></Link>
            </div>
        </div>
        :
        (user_token && (parseInt(user_email_status) === 0)) ? 
          <div className="login_overlay">
            <div className="login_overlay_block">
              <img src="/assets/img/login_overlay.png" />
              <p>Please verify your email to continue</p>
              <Link href={"/verify-email"}><a className="btn-gradient-primary access_login">Verify</a></Link>
            </div>
          </div>
        :
        null
      }
      
      <div className="wallet_page">
        <div className="container">
          <div className="padding_div_for_web homepage_minheight">
            <div className="portfolio_header">
              <div className="row">
                <div className="col-md-7 col-sm-7 col-8">
                  <h3>Welcome To Dashboard</h3>
                  <p className="portfolio_sub_title">Update your wallets and manage them in powerful way</p>
                </div>

                <div className="col-md-5 col-sm-5 col-4 add_wallet_mobile_view">
                  {
                    (user_token && (parseInt(user_email_status) === 1)) ?
                    <div className="add_wallet">
                      <button type="button" className="addnewwallet"  onClick={()=>set_add_new_wallet_modal(true)}>
                        Add New Wallet
                      </button>
                    </div>
                    :
                    null
                  }



                <div className="add_wallet_modal">
                  <div className={"modal "+(add_new_wallet_modal ? " modal-show" : "")} id="walletModal">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h4 className="modal-title">Add Wallet</h4>
                        <button type="button" className="close" onClick={()=>closeaddwallet()}>&times;</button>
                      </div>
                      <div className="modal-body">
                        <div className=" connect_with_block">
                          <div className="row">
                            <div className="col-md-4 col-4 padding_less">
                              <div className="connect_with">
                                <img src="/assets/img/metamask.png" />Metamask
                              </div>
                            </div>

                          <div className="col-md-4 col-4 padding_less">
                              <div className="connect_with"><img src="/assets/img/mew.png" />MyEtherWallet </div>
                          </div>

                          <div className="col-md-4 col-4 padding_less">
                              <div className="connect_with"><img src="/assets/img/binance.png" />Binance</div>                                    
                          </div>
                          </div>
                        </div>
                        <div className="modal_input_block">
                            <input className="text" type="text" placeholder="Past Wallet Add Address"   value={pastAddress} onChange={(e)=> setpastAddress(e.target.value)} />
                            <div className="err_message">{errpastAddress}</div>
                        </div>
                        <div className="modal_input_block">
                            <input className="text" type="text" placeholder="Nick Name" value={nickName} onChange={(e)=> setnickName(e.target.value)} />
                            <div className="err_message">{errnickName}</div>
                        </div>
                        </div>
                        <div className="modal-footer">
                        <button type="submit" className="add_wallet_btn" onClick={saveWallet} >Save</button>
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="new_profile_tab_block">
          <div className="row">
            <div className="col-md-4 col-lg-5  col-5 ">
              <div className="total_portfolio_balance">
                <h5>Total Balance</h5>
                <div className="balance_block">
                  {
                    (user_token && (parseInt(user_email_status) === 1))  ?
                      network_tab == 1?
                      <h6 >$ {(eth_wallet_balance+bnb_wallet_balance).toFixed(2)}</h6>
                      :
                      network_tab == 2?
                      <h6 >$ {eth_wallet_balance.toFixed(2)}</h6>
                      :
                      network_tab == 3?
                      <h6 >$ {bnb_wallet_balance.toFixed(2)}</h6>
                      :
                      null
                    :
                    <h6 style={{filter : "blur(4px)"}}>$ 3078,888,011.45</h6>
                  }
                  <div className="market_up">
                    {/* <img src="/assets/img/market-down.png" />7.20 (0.29%) */}
                    {/* {
                    !user_token ?
                    <div style={{filter : "blur(4px)"}}><img  src="/assets/img/market_up.png" />7.20 (0.29%)</div>
                    :
                    <><img src="/assets/img/market_up.png" />7.20 (0.29%)</>
                    } */}



                  </div>
                </div>
              </div>
            </div>
            
          
            <div className="col-md-8 col-lg-7  col-7 ">
              {
                added_wallet_list.length > 2 ?
                <div className="sliders_block">
                  <Slider {...settings}>
                    {
                      added_wallet_list.map((e,i) =>
                        <div className="each_slider" key={i}>
                          
                            <div className={"nav-link "+(wallet_active_class == i? " active":"")} >
                            <span className="wallet_close" onClick={()=>walletConfirmRemove(e.id)} >&times;</span>
                              <div onClick={() => set_active_wallet_details(i, e.wallet_address)}>
                              
                              <h5>{e.nick_name} </h5>
                              <h6>{e.wallet_address.slice(0,4)+"..."+e.wallet_address.slice(e.wallet_address.length-4, e.wallet_address.length)}</h6>
                            </div>
                          </div>
                        </div>
                    )
                    }
                  </Slider>
                </div>
                :
                added_wallet_list.length == 1 ?
                <div className="row each_slider cust_block_wallt">
                <div className="col-md-4 padding_less"></div>
                <div className="col-md-4 padding_less"></div>
                {
                  added_wallet_list.map((e,i) =>
                  <div className="col-md-4 col-6 padding_less" key={i}>
                    <div className={"nav-link "+(wallet_active_class == i? " active":"")}>
                      <span className="wallet_close" onClick={()=>walletConfirmRemove(e.id)} >&times;</span>
                      <div onClick={() => set_active_wallet_details(i, e.wallet_address)}>
                        <h5>{e.nick_name} </h5>
                        <h6>{e.wallet_address.slice(0,4)+"..."+e.wallet_address.slice(e.wallet_address.length-4, e.wallet_address.length)}</h6>
                      </div>
                    </div>
                  </div>
                  
                  )
                }
              </div>

                :
                <div className="row each_slider cust_block_wallt">
                  <div className="col-md-4"></div>
                  {
                    added_wallet_list.map((e,i) =>
                    <div className="col-md-4 col-6 padding_less" key={i}>
                      <div className={"nav-link "+(wallet_active_class == i? " active":"")}>
                        <span className="wallet_close" onClick={()=>walletConfirmRemove(e.id)} >&times;</span>
                        <div onClick={() => set_active_wallet_details(i, e.wallet_address)}>
                          <h5>{e.nick_name} </h5>
                          <h6>{e.wallet_address.slice(0,4)+"..."+e.wallet_address.slice(e.wallet_address.length-4, e.wallet_address.length)}</h6>
                        </div>
                      </div>
                    </div>
                    
                    )
                  }
                </div>
              }
              
              

              {/* <div className="each_slider ">
                    <a className="nav-link" id="nav-contact-tab" data-toggle="tab" href="#nav-contact" role="tab" aria-controls="nav-contact" aria-selected="false">
                      <h5>Laptop Wallet</h5>
                      <h6>0x5f...e762</h6>
                    </a>  
                  </div> */}
            </div>
          </div>
          
        </div>
                  
            <div className="tab-content" id="nav-tabContent">
              <div className="tab-pane fade show active" id="nav-home" role="tabpanel" aria-labelledby="nav-home-tab">
                <div className="inner_filter_tabs">
                  Network : 
                  <nav className="portfolio_tabs">
                    <ul className="nav nav-tabs" id="nav-tab" role="tablist">
                      <li className="nav-item" onClick={()=>set_network_tab(1)}>
                        <a className={"nav-link "+(network_tab == 1 ? " active":"")}  role="tab">
                          <span>All</span>
                        </a>
                      </li>

                      <li className="nav-item" onClick={()=>set_network_tab(2)}>
                        <a className={"nav-link "+(network_tab == 2 ? " active":"")} role="tab" >
                          <span><img src="/assets/img/portfolio_icons/eth.png" /> Ethereum</span>
                        </a>
                      </li>

                      <li className="nav-item" onClick={()=>set_network_tab(3)}>
                        <a className={"nav-link "+(network_tab == 3 ? " active":"")} role="tab" >
                          <span><img src="/assets/img/portfolio_icons/bnb.png" /> BSC</span>
                        </a>
                      </li>

                      <li className="nav-item" data-toggle="modal" data-target="#comingSoon">
                        <a className="nav-link">
                        <span><img src="/assets/img/portfolio_icons/dai.png" /> xDai</span>
                        </a>
                      </li>

                      <li className="nav-item" data-toggle="modal" data-target="#comingSoon">
                        <a className="nav-link">
                          <span><img src="/assets/img/portfolio_icons/polygon.png" /> Polygon</span>
                        </a>
                      </li>

                      <li className="nav-item" data-toggle="modal" data-target="#comingSoon">
                        <a className="nav-link">
                          <span><img src="/assets/img/portfolio_icons/fantom.png" /> Fantom</span>
                        </a>
                      </li>

                      <li className="nav-item" data-toggle="modal" data-target="#comingSoon">
                        <a className="nav-link">
                          <span><img src="/assets/img/portfolio_icons/okex.png" /> OKExChain</span>
                        </a>
                      </li>

                      <li className="nav-item" data-toggle="modal" data-target="#comingSoon">
                        <a className="nav-link">
                          <span><img src="/assets/img/portfolio_icons/avalanche.png" /> Avalanche</span>
                        </a>
                      </li>

                      <li className="nav-item" data-toggle="modal" data-target="#comingSoon">
                        <a className="nav-link">
                          <span><img src="/assets/img/portfolio_icons/arbitrum.png" /> Arbitrum</span>
                        </a>
                      </li>

                      <li className="nav-item" data-toggle="modal" data-target="#comingSoon">
                        <a className="nav-link">
                          <span><img src="/assets/img/portfolio_icons/celo.png" /> Celo</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>

                            
            <div className="profile_page_table">
                <h5><span>Your Asset</span></h5>
                {
                  (user_token && (parseInt(user_email_status) === 1))  ?
                  <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="coin_name">Name</th>
                        <th>Live Price</th>
                        <th className="percent_change">Symbol</th>
                        <th className="portolio_balance">Balance</th>
                        <th className="total_balance">Total Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                    
                    {/* /assets/img/binance.png */}
                        {
                          (eth_wallet_list.length && ((network_tab == 1) || (network_tab == 2))) ?
                          eth_wallet_list.map((e, i) => 
                            <tr key={i}>
                              <td  className="portfolio_table_balance">
                              <img className="rounded-circle" src={image_base_url+e.address+".png"} onError={(e)=>{e.target.onerror = null; e.target.src="/assets/img/portfolio/ethereum.png"}} />
                              <b>{strLenTrim(e.name, 20)}</b>
                              </td>
                              <td className="portfolio_table_balance">{e.quotePrice ? "$"+separator((parseFloat(e.quotePrice).toFixed(4))) : "-"}</td>
                              <td>{e.symbol}</td>
                              <td className="portfolio_table_balance">{e.value ? e.value : "-"} {e.symbol}</td>
                              <td className="portfolio_table_balance"><b>{(e.quotePrice * e.value) ? "$"+parseFloat((separator((e.quotePrice * e.value).toFixed(4)))) : "-"}</b></td>
                              </tr>
                            )
                            :
                            null
                        }
                        {
                          ((network_tab==2) && !eth_wallet_list.length) ?
                          <tr>
                            <td colSpan="5" className="text-center">Sorry, No related data found</td>
                          </tr>
                          :
                          null
                        }
                        
                        {
                          ((network_tab==3) && !bnb_wallet_list.length ) ?
                            <tr>
                              <td colSpan="5" className="text-center">Sorry, No related data found</td>
                            </tr>
                          :
                          null
                        }
                        
                        {/* "/assets/img/binance.png" */}
                        {
                          (bnb_wallet_list.length && ((network_tab == 1) || (network_tab == 3))) ?
                          bnb_wallet_list.map((e, i) => 
                            <tr key={i}>
                              <td  className="portfolio_table_balance">
                              <img className="rounded-circle" src={image_base_url+e.currency.address+".png"} onError={(e)=>{e.target.onerror = null; e.target.src="/assets/img/binance.png"}} />
                              <b>{strLenTrim(e.currency.name, 20)}</b>
                              </td>
                              <td  className="portfolio_table_balance">{e.quotePrice ? "$"+separator((parseFloat(e.quotePrice).toFixed(4))) : "-"}</td>
                              <td>{e.currency.symbol}</td>
                              <td  className="portfolio_table_balance">{e.value ? e.value : "-"} {e.currency.symbol}</td>
                              <td className="portfolio_table_balance"><b>{(e.totalPrice) ? "$"+separator((parseFloat((e.totalPrice)).toFixed(4))) : "-"}</b></td>
                              </tr>
                            )
                            :
                            null
                        }

                        {
                          ((network_tab==1) && !bnb_wallet_list.length && !eth_wallet_list.length)
                          ?
                         
                          <tr>
                          <td colSpan="5" className="text-center">Sorry, No related data found</td>
                          </tr>
                          
                          :
                          null
                        } 
                    </tbody>
                  </table>
                </div>
                  :
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
                            <td><b><img src="/assets/img/binance.png" /> BSC</b></td>
                            <td>$26562.25</td>
                            <td><b><span className="positive"><img src="/assets/img/market_up.png" className="market_triangles" />24%</span></b></td>
                            <td>10 BNB</td>
                            <td><b>$ 56424.00</b></td>
                          </tr>
                          <tr>
                            <td><b><img src="/assets/img/binance.png" /> BSC</b></td>
                            <td>$26562.25</td>
                            <td><b><span className="negative"><img src="/assets/img/market-down.png" className="market_triangles" />24%</span></b></td>
                            <td>10 BNB</td>
                            <td><b>$ 56424.00</b></td>
                          </tr>
                          <tr>
                            <td><b><img src="/assets/img/binance.png" /> BSC</b></td>
                            <td>$26562.25</td>
                            <td><b><span className="positive"><img src="/assets/img/market_up.png" className="market_triangles" />24%</span></b></td>
                            <td>10 BNB</td>
                            <td><b>$ 56424.00</b></td>
                          </tr>
                          
                        </tbody>
                      </table>
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
      </div>
    </div>
    
    <div className="remove_wallet_modal">
      <div className={"modal "+(wallet_confirm_remove_modal ? " modal-show":"")}>
        <div className="modal-dialog modal-sm modal_small">
          <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close" onClick={()=>   set_wallet_confirm_remove_modal(false)} data-dismiss="modal">&times;</button>
              <div className="text-center">
                <img src="/assets/img/cancel.png" />
                <h4 className="modal-title mb-2">Remove wallet!</h4>
                <h5 className="invalidcredential">Do you want to really remove this wallet ?</h5>
                <button type="button" className="btn-gradient-primary confirm_button"  data-dismiss="modal"> <span onClick={()=>removeWallet()}>Remove</span>  </button>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>

      
      {/* ...........coming soon modal starts here........ */}
        <div className="coming_soon_modal">
          <div className="modal" id="comingSoon">
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
                  
                  <button type="button" className="close" data-dismiss="modal">&times;</button>
                </div>
                <div className="modal-body">
                  <p className="coming_soon_subtext">This feature will be available soon</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ...........coming soon modal ends here........ */} 
    
      {
        modal_data.title ?
        <Popupmodal name={modal_data} />
        :
        null
      }
    </>
  )
}

export async function getServerSideProps({req}) 
{
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    if(userAgent.user_token) 
    {
        const config = {
          headers : {
            "X-API-KEY": x_api_key,
            "token":userAgent.user_token
          }
        }

        return { props: { userAgent: userAgent, config:config } }
    }
    else 
    {
      return { props: { userAgent: {} } }
    }
}
