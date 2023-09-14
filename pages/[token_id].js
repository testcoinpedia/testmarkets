import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import cookie from "cookie"
import JsCookie from "js-cookie"
import LoginModal from '../components/layouts/auth/loginModal'
import Axios from 'axios'
import Error from './404'
import {  API_BASE_URL, config, separator, getURLWebsiteName, getShortWalletAddress, createValidURL, app_coinpedia_url, market_coinpedia_url, IMAGE_BASE_URL, roundNumericValue, volume_time_list } from '../components/constants'
import { tokenBasic, otherDetails, volume24Hrs, getHighLow24h, sevenDaysDetails } from '../components/search_contract_address/live_price'
// import Highcharts  from 'highcharts'
// import Datetime from "react-datetime"
// import "react-datetime/css/react-datetime.css" 
import moment from 'moment'
import dynamic from "next/dynamic"
import Popupmodal from '../components/popupmodal'
import Exchanges_list from '../components/token_details/exchanges_list'
import Liquidity_pool from '../components/token_details/liquidity/liquidity_pool'
import BasicTokenInfo from '../components/basicTokenInfo'
import Search_token from '../components/search_token'
// import Graph_Data from '../components/graphData'
// import Chart from '../components/lightWeightChart'
import Price_chart from '../components/token_details/charts/price'
import Tradingview_chart from '../components/token_details/charts/tradingview'
import Marketcap_Chart from '../components/token_details/charts/marketcap'
import Price_analysis from '../components/token_details/price_analysis'
import News from '../components/token_details/news'
import Events from '../components/token_details/events'
import Airdrops from '../components/token_details/airdrop'
import Price_prediction from '../components/token_details/price_prediction'
import Tokenomics from '../components/token_details/tokenomics'
import Trade_history from '../components/token_details/trade_history'
import Airdrop_detail from '../components/token_details/airdrop_details'
import Ico_detail from '../components/token_details/ico_detail'
import Dex_volume from '../components/token_details/dex_volume'
import Dex_pairs from '../components/token_details/charts/dex_pairs_tv/dex_pairs'
// import Dex_pairs from '../index'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import { cmc_graph_ranges, updateTradeDetails } from '../components/token_details/tokenDetailsFunctions' 
// import dynamic from 'next/dynamic';

// const TVChartContainer = dynamic(
// 	() =>
// 		import('../components/token_details/charts/dex_pairs_tv').then(mod => mod.TVChartContainer),
// 	{ ssr: false },
// )

export default function tokenDetailsFunction({ errorCode, data, token_id, userAgent, switch_tab, search_by_category }) 
{
  console.log("data", data)
  if (errorCode) { return <Error /> }
  const communityRef = useRef(null)
  const [dex_row_id, set_dex_row_id]=useState("")
  const explorerRef = useRef(null)
  const contractRef = useRef(null)
  const dexPairsRef = useRef(null)
  const icoRef = useRef(null)
  
  var website_title = data.token_name.toUpperCase()+" | " + data.symbol + " Live Price, Chart & News"
  if(website_title.length > 60)
  {
    website_title = data.token_name.toUpperCase()+" | " + data.symbol + " Live Price"
  }
  else if((website_title.length >= 48))
  {
    website_title +=" | Coinpedia"
  }
  else if((website_title.length >= 34))
  {
    website_title +=" | Coinpedia Markets"
  }
  
  const share_text = "Checkout the best price tracking for "+data.token_name+"("+data.symbol+") on " +market_coinpedia_url+data.token_id+ ". Explore charts, ICO's, News and events."
  const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
  const [cmc_image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/128x128/')
  const [symbol] = useState(data.symbol)
  const [watchlist, set_watchlist] = useState(data.watchlist_status ? data.watchlist_status:false)
  const [share_modal_status, set_share_modal_status] = useState(false)
  const [light_dark_mode, set_light_dark_mode] = useState(JsCookie.get('light_dark_mode'))
  const [is_client, set_is_client] = useState(false)
  const [max_supply] = useState(data.max_supply ? data.max_supply:"")
  const [exchanges] = useState(data.exchanges ? data.exchanges:[])
  const [explorers] = useState(data.explorers ? data.explorers:[])
  const [communities] = useState(data.communities ? data.communities:[])
  
  const [no_data_link] = useState("")
  
  const [category_list, set_category_list] = useState(false)
  const [community_links, set_community_links] = useState(false)
  const [explorer_links, set_explorer_links] = useState(false)
  const [handleModalConnections, setHandleModalConnections] = useState(false)
  const [handleModalVote, setHandleModalVote] = useState(false)
  const [contracts_addr_details, set_contracts_addr_details] = useState(false)
  const [volume, set_volume] = useState(data.volume ? data.volume:"")
  const [main_tab,set_main_tab] = useState(1)
  // data.fully_diluted_market_cap ? data.fully_diluted_market_cap:""
  // data.api_from_type

  const [circulating_supply] = useState(data.circulating_supply ? data.circulating_supply:"")
  const [live_price, set_live_price] = useState(data.price ? data.price:"")
  const [percentage_change_24h, set_percentage_change_24h] = useState(data.percent_change_24h ? (data.percent_change_24h).toFixed(2):"")
  const [percentage_change_7d, set_percentage_change_7d] = useState(data.percent_change_7d ? data.percent_change_7d:0)
  
  const [ath_price, set_ath_price] = useState(data.ath_price ? data.ath_price:"")
  const [ath_price_date, set_ath_price_date] = useState(data.ath_price_date ? data.ath_price_date:"")
  const [atl_price, set_atl_price] = useState(data.atl_price ? data.atl_price:"")
  const [atl_price_date, set_atl_price_date] = useState(data.atl_price_date ? data.atl_price_date:"")

  const [high_24h, set_high_24h] = useState(data.high_price ? data.high_price:"")
  const [low_24h, set_low_24h] = useState(data.low_price ? data.low_price:"")
  const [open_24h, set_open_24h] = useState("")
  const [close_24h, set_close_24h] = useState("")
  const [dex_circulating_supply, set_dex_circulating_supply] = useState(0)
  const [count_liquidity_pools, set_count_liquidity_pools] = useState(0)
  
  const [fetch_data_type, set_fetch_data_type] = useState(data.fetch_data_type ? data.fetch_data_type:0)
  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
 
  const [total_supply, set_total_supply] = useState(data.total_supply ?data.total_supply:0)
  const [other_contract, set_other_contract] = useState(false)
  const [contract_copy_status, set_contract_copy_status] = useState("")
 
  const [votes, set_votes] = useState(data.total_voting_count)
  const [voting_status, set_voting_status] = useState(data.voting_status)
  const [exchange_list, set_exchange_list] = useState([])
  
  const [coingecko_status, set_coingecko_status] = useState(false)
  const [category_modal, set_category_modal] = useState(false)
  const [chart_tab, set_chart_tab] = useState(1)
  //console.log("chart_tab", chart_tab)
  const [tooltipVisible, setTooltipVisible] = useState(false)
 
  const [time_name, set_time_name] = useState("1D")
  const [intervals, set_intervals] = useState("10m")
  const [count, set_count] = useState("144")

  const [user_token, set_user_token] = useState(userAgent.user_token? userAgent.user_token:"");
  const [login_modal_status, set_login_modal_status] = useState(false)
  const [request_config, set_request_config] = useState(config(userAgent.user_token ? userAgent.user_token : ""))
  const [action_row_id, set_action_row_id] = useState("")
  const [action_type, set_action_type] = useState("")
  const [dex_pair_details, set_dex_pair_details] = useState(false)
  

  const [token_converter_value, set_token_converter_value] = useState("")
  const [usd_converter_value, set_usd_converter_value] = useState("")
  const [dex_pair_object, set_dex_pair_object] = useState(data.liquidity_addresses[0] ? data.liquidity_addresses[0]:{})

  const dexPairGraph = async (pass_object) =>
  { 
    //console.log("adsfasdff")
    await set_dex_pair_details(false)
    await set_dex_pair_object({})
    await set_dex_pair_object(pass_object)
  }


  //pass_type 1:token value, 2:usd value
  const tokenConverter = async (pass_value, pass_type) =>
  { 
   
    if(pass_value > 0)
    {
      if(pass_type == 1)
      {
        await set_token_converter_value(pass_value)
        if((live_price*pass_value) >= 0.1)
        {
          await set_usd_converter_value((live_price*pass_value).toFixed(2))
        }
        else 
        {
          await set_usd_converter_value(roundNumericValue(live_price*pass_value))
        }
        
      }
      else
      { 
        await set_usd_converter_value(pass_value)
        if((pass_value/live_price) >= 0.1)
        {
          await set_token_converter_value((pass_value/live_price).toFixed(2))
        }
        else 
        {
          await set_token_converter_value(roundNumericValue(pass_value/live_price))
        }
      }
    }
    else
    {
      await set_token_converter_value("")
      await set_usd_converter_value("")
    }
   
  }

  const getDataFromChild = async (pass_object) => 
  {
    await set_login_modal_status(false)
    await set_user_token(JsCookie.get("user_token"))
    await set_request_config(JsCookie.get("user_token"))
    if(action_type == 1)
    {
      await addToWatchlist(action_row_id)
    }
    else if(action_type == 2)
    {
      await setHandleModalVote(false)
      await vote(1)
    }
  }
  

  const getLiquidityDataFromChild = async (pass_data) => 
  {
    console.log("price 3", pass_data.price)
    //console.log("pass_data", pass_data)
    if(!live_price)
    { 
      if(pass_data.price)
      {
        
        set_live_price(pass_data.price)
      }
    }

    if(!percentage_change_24h)
    {
      if(pass_data.percent_change_24h)
      {
        set_percentage_change_24h((pass_data.percent_change_24h).toFixed(2))
      }
    }
    
    if(pass_data.total_balance_in_token)
    {
      set_dex_circulating_supply(pass_data.total_balance_in_token)
    }

    if(pass_data.count_liquidity_pools)
    {
      set_count_liquidity_pools(pass_data.count_liquidity_pools)
    }

   
    if(pass_data.price >= 0.0000000001)
    {
      const save_obj = {
        token_id:token_id,
        price : pass_data.price, 
        percent_change_24h: pass_data.percent_change_24h
      }
      await saveLivePriceDetails(save_obj)

      const response_volume = await volume24Hrs({network_type:data.contract_addresses[0].network_row_id, contract_address:data.contract_addresses[0].contract_address})
      //console.log('response_volume', response_volume)
      if(response_volume.status)
      {
        set_volume(response_volume.message)
      }
    }
  }

  

  const login_props = {
    status: true,
    request_config: request_config,
    callback: getDataFromChild
  }

  //1:add to watchlist, 2:remove from watchlist
  const loginModalStatus = async (pass_id, pass_type) => 
  {
    await set_login_modal_status(false)
    await set_login_modal_status(true)
    await set_action_row_id(pass_id)
    await set_action_type(pass_type)
    
  }



  const handleTooltipClick = (data) => 
  {
    setTooltipVisible(true);
    var copyText = document.createElement("input")
    copyText.value = data
    document.body.appendChild(copyText)
    copyText.select()
    document.execCommand("Copy")
    copyText.remove()
    setTimeout(() => 
    {
      setTooltipVisible(false)
    }, 3000)
  }

  const tooltip = (
    <Tooltip arrowOffsetTop={20} id="tooltip">Copied</Tooltip>
  )
  
  
  
  const div = useRef()
  useLayoutEffect(() => {
    // console.log(div)
    // const divAnimate = div.current.getBoundingClientRect().top;
    // console.log(divAnimate)
    // const onScroll = () => 
    // {
    //   if(divAnimate < window.scrollY && window.innerWidth >= 1024) 
    //   {
    //     console.log("ok");
    //     div.current.style.position = "fixed";
    //     div.current.style.top = 0
    //     div.current.style.left = 0
    //   }
    //   else 
    //   {
    //     div.current.style.position = "relative";
    //   }
    // }
    // window.addEventListener("scroll", onScroll)
    // return () => window.removeEventListener("scroll", onScroll);
  }, [])
  

  const plotGraph = async (pass_time_name, pass_interval, pass_count) =>
  {
    await set_time_name("")
    set_time_name(pass_time_name)
    set_intervals(pass_interval)
    set_count(pass_count)
  }
  
  useEffect(() => 
  {
    if(!is_client)
    {
      set_is_client(true)
    }
    
    if(switch_tab == 'ico')
    {
      icoRef.current.scrollIntoView()
      set_main_tab(2)
    }

    if(switch_tab == 'airdrop')
    {
      icoRef.current.scrollIntoView()
      set_main_tab(3)
    }

    if(data.list_type == 2)
    {
      if(!data.first_trade_price)
      {
        if(data.contracts_array[0])
        {
          updateTradeDetails({
            token_row_id:data._id, 
            network_type:data.contracts_array[0].network_row_id, 
            contract_address:data.contracts_array[0].contract_address
          })
        }
      }
    } 
      
      

    if(data.fetch_data_type == 2)
    {
      getPricingDetails()
    }
    
    
    //graphAPI()
    //if(parseInt(api_from_type) === 1) {
      if (!coingecko_status) 
      {
        // coingeckoId()
      // }
      }
      else 
      {
        if (!coingecko_status) {
          //graphqldata()
        }
      }
    // categorySearchTokens()
    set_light_dark_mode(JsCookie.get('light_dark_mode'))
    document.addEventListener("click", handleClickOutside, false);
    return () => { document.removeEventListener("click", handleClickOutside, false) }
  }, [])

 

  const getPricingDetails = async () =>
  {
    if(data.contract_addresses[0])
    {
      if(data.contract_addresses[0].contract_address)
      {
        const token_basic_res = await tokenBasic(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_row_id)
        //console.log('token_basic_res', token_basic_res)
        if(token_basic_res.status)
        {
          if(!total_supply)
          {
            set_total_supply(token_basic_res.message.total_supply)
          }
          
          if(token_basic_res.message.valid_status)
          {
            set_live_price(token_basic_res.message.live_price)

            var network_row_id = await data.contract_addresses[0].network_row_id
            if(data.contract_addresses[0].network_row_id == 6)
            {
              network_row_id = 1
            }

            var save_percentage_change_24h = 0
            const token_other_res = await otherDetails(network_row_id, data.contract_addresses[0].contract_address)
            if(token_other_res.message.valid_status)
            {
              if(token_other_res.message.price_24h && token_basic_res.message.live_price)
              {
                save_percentage_change_24h = (((token_basic_res.message.live_price - token_other_res.message.price_24h)/token_basic_res.message.live_price)* 100).toFixed(2)
                set_percentage_change_24h(save_percentage_change_24h)
              }
            }


            var save_percentage_change_7d = 0
            const seven_days_res = await sevenDaysDetails(network_row_id, data.contract_addresses[0].contract_address)
            if(seven_days_res.message.valid_status)
            {
              if(seven_days_res.message.price_24h && token_basic_res.message.live_price)
              {
                save_percentage_change_7d = (((token_basic_res.message.live_price - seven_days_res.message.price_24h)/token_basic_res.message.live_price)* 100).toFixed(2)
                set_percentage_change_7d(save_percentage_change_7d)
              }
            }

            
           // console.log('token_other_res', token_other_res)

            var save_high_24h = 0
            var save_low_24h = 0

            const response3 = await getHighLow24h(network_row_id, data.contract_addresses[0].contract_address)
            if(response3.status)
            {
              set_high_24h(response3.message.high)
              set_low_24h(response3.message.low)
              set_open_24h(response3.message.open)
              set_close_24h(response3.message.close)
              
              save_high_24h = response3.message.high
              save_low_24h = response3.message.low
        
              //console.log("high low", response3)
            }
          }
          

          if(token_basic_res.message.valid_status)
          {
            const save_obj = {
              token_id:token_id,
              price : token_basic_res.message.live_price, 
              total_supply : token_basic_res.message.total_supply,
              percent_change_24h: save_percentage_change_24h,
              high_24h : save_high_24h,
              low_24h : save_low_24h
            }
            await saveLivePriceDetails(save_obj)
          }
         
        }
      }
    }
  }

  const saveLivePriceDetails = async (pass_obj) =>
  {
   // console.log("pass_obj", pass_obj)
    const response = await Axios.post(API_BASE_URL + "markets/cryptocurrency/update_pricing_details/", pass_obj, config(""))
    //console.log('response.data', response.data)
    // if(response.data.status) 
    // {
        
    // }
  }
  
  const BreadcrumbList = () => {
    return {
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Cryptocurrencies",
          "item": "https://markets.coinpedia.org/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": data.token_name ? data.token_name+" Price" : "-",
          "item": "https://markets.coinpedia.org/"+token_id
        }
      ]
    }
  }

  const ExchangeList = () => {
    return {
      "@context": "https://schema.org",
      "@type": "ExchangeRateSpecification",
      "url": "https://markets.coinpedia.org/"+token_id,
      "name": data.token_name ? data.token_name : "-",
      "currency": data.symbol ? (data.symbol).toUpperCase() : "-",
      "currentExchangeRate": { 
        "@type":"UnitPriceSpecification",
        "price": (roundNumericValue(live_price)).replace("$", ""),
        "priceCurrency": "USD"
      }
    }
  }

  // const uniques = exchange_list.map(item => item.pair_two_name).filter((value, index, self) => self.indexOf(value) === index)
  // // console.log(uniques)


  const handleClickOutside = event => {
    if(communityRef.current && !communityRef.current.contains(event.target)) 
    {
      set_community_links(false)
    }

    if(explorerRef.current && !explorerRef.current.contains(event.target)) 
    {
      set_explorer_links(false)
    }
    
    if(contractRef.current && !contractRef.current.contains(event.target)) 
    {
      set_contracts_addr_details(false)
    }

    if(dexPairsRef.current && !dexPairsRef.current.contains(event.target)) 
    {
      set_dex_pair_details(false)
    }
    
  }

 
  const myReferrlaLink = () => {
    var copyText = document.getElementById("referral-link");
    copyText.select();
    document.execCommand("Copy");
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied";
  }

  const copyContract = (data) => 
  {
    set_contract_copy_status(data)
    var copyText = document.createElement("input")
    copyText.value = data
    document.body.appendChild(copyText)
    copyText.select()
    document.execCommand("Copy")
    copyText.remove()
    setTimeout(() => set_contract_copy_status(""), 3000)
  }

  const LaunchpadDetails = (object) => {
    // set_launchpad_row_id(parseInt(object._id))
    // set_launchpad_object(object)
  }

  

  const addToWatchlist = (param_token_id) => 
  {
    Axios.get(API_BASE_URL + "markets/cryptocurrency/add_to_watchlist/" + param_token_id, config(JsCookie.get('user_token'))).then(res => {
      if (res.data.status) 
      {
        set_watchlist(true)
      }
    })
  }

  const removeFromWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL + "markets/cryptocurrency/remove_from_watchlist/" + param_token_id, config(JsCookie.get('user_token'))).then(res => {
      if (res.data.status) 
      {
        set_watchlist(false)
      }
    })
  }



  const handleModalConnection = () => {
    setHandleModalMainNetworks(false)
    setHandleModalConnections(!handleModalConnections)
  }

  const ModalVote = () => {
    setHandleModalVote(!handleModalVote)
  }

  
  const vote = async (param) => 
  {
    await setHandleModalVote(false)
    await setModalData({ icon: "", title: "", content: "" })
    if(param == 1) 
    {
      const res = await Axios.get(API_BASE_URL + "markets/cryptocurrency/save_voting_details/" + data._id, config(JsCookie.get('user_token')))
      if(res.data.status) 
      {
        await set_votes(votes + 1)
        await set_voting_status(true)
        await setModalData({ icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message })
      }
    }
    else 
    {
      const res2 = await Axios.get(API_BASE_URL + "markets/cryptocurrency/remove_voting_details/" + data._id, config(JsCookie.get('user_token')))
      if(res2.data.status) 
      {
        await set_votes(votes - 1)
        await set_voting_status(false)
        await setModalData({ icon: "/assets/img/update-successful.png", title: "Thank you ", content: res2.data.message.alert_message })
      }
    }

    if(action_row_id)
    {
      await set_action_row_id("")
      await set_action_type("")
    }
  }


  const setMainTab = async (pass_main_tab) =>
  {
    await set_main_tab(pass_main_tab)
    await set_time_name("")
    await set_chart_tab("")
    
    await set_time_name("1D")
    await set_chart_tab(1)
  }
  
  
  // https://coinpedia.org/wp-json/wp/v2/posts/?_fields=id,title,featured_image_sizes,author,yoast_head_json,date,tag_names,tags&categories=6&per_page=20&offset=0
//   const Categories=(e)=>{
// set_category_modal(true)
// set_categories(e)
//   }

  return (
    <>
      <Head>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
        <title>{website_title}</title>
        <meta name="description" content={data.token_name +", "+ data.symbol +" price, marketcap, charts, news and prorejct infotmation with "+ data.symbol +" price analysis and prediction too."} />
        <meta name="keywords" content={data.token_name +" price, " + data.symbol + " price, " + data.symbol + " chart, " + data.symbol + " news, " + data.symbol + " analysis, " + data.symbol + " prediction, " + data.symbol + ", " + data.symbol + " total supply, " + data.symbol + " Airdrop, " + data.symbol + " Exchange, " + data.symbol + " Live price tracking, crypto prices, bitcoin price, coinpedia markets."} />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content= {website_title} />
        <meta property="og:url" content={market_coinpedia_url + data.token_id+"/"} />
        <meta property="og:description" content={"Tracking live price of "+ data.token_name +" (" + data.symbol + "), explore price movements, charts, news, supply details, and more in one page. See " + data.symbol + " price analysis and prediction too."} />

        <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
        <meta property="og:image" itemprop="thumbnailUrl" content={(data.token_image ? image_base_url+data.token_image: data.coinmarketcap_id ? cmc_image_base_url+data.coinmarketcap_id+".png" : "default.png")} />
        <meta property="og:image:secure_url" content={(data.token_image ? image_base_url+data.token_image: data.coinmarketcap_id ? cmc_image_base_url+data.coinmarketcap_id+".png" : "default.png")} />
        <meta property="og:image:width" content="100" />
        <meta property="og:image:height" content="100" />
        <meta property="og:image:type" content="image/svg" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:description" content={"Tracking live price of "+ data.token_name +" (" + data.symbol + "), explore price movements, charts, news, supply details, and more in one page. See " + data.symbol + " price analysis and prediction too."} />

        <meta name="twitter:title" content= {website_title} />
        <meta name="twitter:image" content={(data.token_image ? image_base_url+data.token_image: data.coinmarketcap_id ? cmc_image_base_url+data.coinmarketcap_id+".png" : "default.png")} />
        <link rel="canonical" href={market_coinpedia_url + data.token_id+"/"} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbList()) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ExchangeList()) }} />
      </Head>

      <div className="page">
        <div className="market_token_details">
          <div className="container-fluid p-0">
            <div ref={div} className='markets_header_token'>
              <div className='container'>
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-12 order-md-1 order-2">
                      <div className="token_main_details">
                        <div className="media">
                          <div className='media-left align-self-center'>
                            <img src={(data.token_image ? image_base_url+data.token_image: data.coinmarketcap_id ? cmc_image_base_url+data.coinmarketcap_id+".png" : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} className="token_img" alt={data.token_name} width="100%" height="100%" />
                          </div>
                        
                          <div className="media-body align-self-center">
                            <h1 className="media-heading">{data.token_name ? data.token_name : "-"} &nbsp; <span> ({data.symbol ? (data.symbol).toUpperCase() : "-"})</span> 
                              {/* <span><img src="/assets/img/watchlist_token.svg" /></span> */}
                            </h1>
                            <p>
                            {
                              data.token_title ?
                              <>
                              {data.token_title}
                              </>
                              :
                              <>
                              Stay ahead by tracking {data.symbol ? (data.symbol).toUpperCase() : "-"} cryptocurrency trends and analyzing data.
                              </>
                            }
                            </p>
                            <div>
                          
                              <ul className='category-ul'>
                                {
                                  data.categories ?
                                  <>
                                    {
                                      data.categories.map((item, i) => 
                                      i < 2 ?
                                      <li key={i}><Link href={"/category/"+item.category_id}>{item.category_name}</Link></li>
                                      :
                                      ""
                                      )
                                    }
                                    {
                                      data.categories.length > 2 ?
                                      <li onClick={()=>set_category_modal(true)}>+{data.categories.length-2} More</li>
                                      :
                                      ""
                                    }
                                  </>
                                  :
                                  ""
                                }
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-3 col-xl-3 col-md-6 order-md-2 order-3">
                      <div className="token_price_block airdrop_data_content">
                        <h5 title={live_price}>
                          {live_price > 0 ? "$"+roundNumericValue(live_price) : "NA"}
                        </h5>
                       
                          
                         
                          {
                            live_price ?
                            percentage_change_24h ?
                                <>
                                 <h6>
                                 <span className='timings_price'>&nbsp;24h</span>
                                {
                                  percentage_change_24h > 0 ?
                                    <span className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" alt="Value Up" />{percentage_change_24h ? (percentage_change_24h):""}%</span></span>
                                    :
                                  <span className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" alt="Value Down" />{percentage_change_24h ? percentage_change_24h:"0"}%</span></span>
                                  
                                }
                                 &nbsp;({roundNumericValue(((percentage_change_24h*live_price)/100))})
                                </h6>
                                </>
                                :
                                null
                              :
                              null
                          }
                         
                         
                      </div>
                    </div>

                    <div className="col-lg-3 col-xl-3 col-md-6 order-md-3 order-1 ">
                      <div className="row">
                        <div className="col-md-12 ">
                          <Search_token />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='row token_header_cols'>
                    <div className="col-lg-3 col-xl-3 col-md-12 pr-0">
                    <ul className="token_share_vote">
                      {/* <li className='airdrop_name'><span></span>Airdrop Live</li> */}
                            {
                              data.cp_rank ?
                              <li>#{data.cp_rank} Rank</li>
                              :
                              ""
                            }
                      
                            {
                              user_token
                                ?
                                <>
                                  {
                                    voting_status == false ?
                                      <li onClick={() => ModalVote()} style={{ cursor: "pointer" }}><img src="/assets/img/coin_vote.svg" alt="Votes" />&nbsp; {votes}</li>
                                      :
                                      <li onClick={() => ModalVote()} style={{ cursor: "pointer" }}><img src="/assets/img/coin_vote.svg" alt="Votes" />&nbsp; {votes}</li>
                                  }
                                </>
                                :
                                <li style={{ cursor: "pointer" }} >
                                  <a onClick={() => ModalVote()} >
                                    <img src="/assets/img/coin_vote.svg" alt="Votes"/> {votes}
                                  </a>
                                </li>
                            }
                            
                            {/* <li>{data.list_type == 1 ? "Coin" : "Token"}</li> */}
                            <li onClick={() => set_share_modal_status(true)} style={{ cursor: "pointer" }}><img src="/assets/img/coin_share.svg" alt="Share" /> Share</li>
                            <li>
                              {
                                user_token ?
                                <>
                                  {
                                    watchlist == true ?
                                      <span onClick={() => removeFromWatchlist(data._id)} ><img src="/assets/img/watchlist_filled.svg" alt="Watchlist" style={{width:"18px"}} /></span>
                                      :
                                      <span onClick={() => addToWatchlist(data._id)} ><img src="/assets/img/watchlist_outline.svg" alt="Watchlist" style={{width:"18px"}} /></span>
                                  }
                                </>
                                :
                                <a onClick={()=>loginModalStatus(data._id, 1)} >
                                  <img src="/assets/img/watchlist_outline.svg" alt="Watchlist" style={{width:"18px"}} />
                                </a>
                              }
                            </li>
                            
                          </ul>
                    </div>
                    <div className="col-lg-9 col-xl-9 col-md-12">
                      <ul className='token_list_data'>
                      <li>
                          <div className="token_list_content">
                            <h4> Market Cap <OverlayTrigger
                              delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                  <Tooltip {...props} className="custom_pophover">
                                    <p>Market capitalization is a measure used to determine the total value of a publicly traded cryptocurrency. It is calculated by multiplying the current market price of a single coin/token X total supply of the coin/token.</p>
                                  </Tooltip>
                                )}
                                placement="bottom"
                              ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                              </OverlayTrigger> :  &nbsp;
                              {
                                circulating_supply > 0 ?
                                <span className="responsive_value_display">
                                  {
                                    "$ "+separator(((circulating_supply*live_price)).toFixed(0))
                                  }
                                </span>
                                :
                                "NA"
                              } 
                            </h4>
                            {/* <h4>Dex Market Cap <OverlayTrigger
                                delay={{ hide: 450, show: 300 }}
                                  overlay={(props) => (
                                    <Tooltip {...props} className="custom_pophover">
                                      <p>Market capitalization is a measure used to determine the total value of a publicly traded cryptocurrency. It is calculated by multiplying the current market price of a single coin/token X total supply of the coin/token.</p>
                                    </Tooltip>
                                  )}
                                  placement="bottom"
                                ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                                </OverlayTrigger> :  &nbsp;
                                {
                                  dex_circulating_supply && live_price ?
                                  <span className="responsive_value_display">
                                    {
                                      "$ "+separator(((dex_circulating_supply*live_price)).toFixed(0))
                                    }
                                  </span>
                                  :
                                  "NA"
                                } 
                              </h4> */}
                            </div>
                        </li>


                                  <li>
                                  <div className="token_list_content">
                                    <h4>24H Volume <OverlayTrigger
                                      delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                          <Tooltip {...props} className="custom_pophover">
                                            <p>Trading Volume is the Total vlaue of tokens bought and sold in both centralized and decentralized exchanges in 24 hours, multiplied with number tokens traded, and price in respective platforms, and added together.</p>
                                          </Tooltip>
                                        )}
                                        placement="bottom"
                                      ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                                    </OverlayTrigger> :  &nbsp;
                                    <span className="responsive_value_display">
                                    {volume > 0 ? "$"+roundNumericValue(volume) : "NA"}
                                    </span>

                                    
                                    
                                    <span className="values_growth"></span>
                                    </h4>
                                  </div>
                                  </li>
                                <li>
                                  <div className="token_list_content">
                                    <h4>Circulating Supply <OverlayTrigger
                                      delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>Circulating supply refers to the total number of coins/tokens that are currently in circulation and available to the public. It represents the portion of the total supply of a cryptocurrency that is actively being traded or held by investors.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom">
                                      <span className='info_col' ><img src="/assets/img/info.png" alt="Info"/></span>
                                    </OverlayTrigger> :&nbsp;
                                      <span className="responsive_value_display">
                                        {
                                        circulating_supply ? 
                                          <>
                                          {separator((circulating_supply).toFixed(0))+" "+(symbol).toUpperCase()}
                                          </>
                                          : 
                                          "NA"
                                        } 
                                      </span>
                                      {
                                        circulating_supply && data.max_supply ?
                                        <small>
                                        ({((circulating_supply/data.max_supply)*100).toFixed(2)}%)
                                        </small>
                                        :
                                        ""
                                      }
                                      
                                    </h4>

                                    {/* <h4>Dex Circulating Supply <OverlayTrigger
                                      delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip {...props} className="custom_pophover">
                                          <p>Circulating supply refers to the total number of coins/tokens that are currently in circulation and available to the public. It represents the portion of the total supply of a cryptocurrency that is actively being traded or held by investors.</p>
                                        </Tooltip>
                                      )}
                                      placement="bottom">
                                      <span className='info_col' ><img src="/assets/img/info.png" alt="Info"/></span>
                                    </OverlayTrigger> :&nbsp;
                                    <span className="responsive_value_display">
                                    {dex_circulating_supply ? 
                                    <>
                                    {separator((dex_circulating_supply).toFixed(0))+" "+(symbol).toUpperCase()}
                                    </>
                                    
                                    : "NA"} </span>
                                    </h4> */}
                                  </div>
                                </li>
                              </ul>
                  </div>
                  </div>
          </div>
          </div>
          </div></div>

          
          <div className="container">
            <div className="col-md-12">
              {/* <div className="breadcrumb_block">
                <Link href={coinpedia_url}><a >Home</a></Link> <span> &#62; </span>
                <Link href={market_coinpedia_url}><a >Live Market</a></Link> <span> &#62; </span>{data.token_name}
              </div> */}
             

              <div className="row">
                <div className="col-md-12">
                  {/* <div className="market_details_block">
                      <div className="widgets__item">
                        <div className="widgets__head">
                          <div className="">
                            <div className="media">
                              <div className="widgets__logo"><img src={data.token_image ? image_base_url+data.token_image : image_base_url+"default.png"} alt="logo" width="100%" height="100%" /></div>
                              <div className="media-body">
                                <div className="row ">
                                  <div className="col-lg-7 col-sm-6 col-8">
                                    <div className="widgets__details">
                                      <div className="widgets__category">{data.symbol ? (data.symbol).toUpperCase() : "-"}</div>
                                      <div className="widgets__info">{data.token_name ? data.token_name : "-"}</div>
                                    </div>
                                    
                                  </div>
                                  <div className="col-lg-5 col-sm-6 col-4 display_vote_share">
                                    <ul className="vote_section">
                                      <li>
                                        
                                      </li>
                                      <li>
                                        {
                                          user_token ?
                                            voting_status === false ?
                                            <button className="market_vote" onClick={()=>ModalVote()} >Vote</button>
                                            :
                                            <button className="market_vote" onClick={()=>ModalVote()} >Voted</button>
                                            :
                                          <Link href={app_coinpedia_url+"login?ref="+current_url}><button className="market_vote">Vote</button></Link>
                                        }
                                        <p className="votes_market"><span className="votes">Votes: <span className="total_votes">{votes}</span></span></p>
                                      </li>
                                    </ul>

                                    <ul className="market_details_share_wishlist desktop_view">
                                      <li>
                                        <div className="share_market_detail_page" data-toggle="modal" onClick={()=>set_share_modal_status(true)}>Share</div>
                                      </li>
                                      
                                    </ul>

                                    
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>


                      



                          

                          <div className="row">
                            <div className="col-4 text-right token_share_block token_share_for_left">
                              <ul className="market_details_share_wishlist mobile_view">
                                <li>
                                  <div className="share_market_detail_page" data-toggle="modal" onClick={()=>set_share_modal_status(true)}>Share</div>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        
                        <div className="wallets__inner">
                          <div className="wallets__list" />
                        </div>
                      </div>
                    </div> */}

                
                  <div className="coin_details">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="coin_main_links">
                          <ul className="coin_quick_details">
                          {
                              data.website_link == "" ?
                                // <>
                                //   <li className="coin_individual_list">
                                //     <div className="quick_block_links">
                                //       <div className="widgets__select links_direct"> <a className="" data-toggle="modal" data-target="#linksData" onClick={()=> {set_no_data_link("Website link is not avaliable")}} ><img src="/assets/img/website.svg" className="coin_cat_img" />Website</a></div>
                                //     </div>
                                //   </li>
                                // </>
                                null
                                :
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a rel="nofollow" href={createValidURL(data.website_link)} target="_blank"> <img src="/assets/img/website.svg" alt="Website" className="coin_cat_img" />Website</a></div>
                                  </div>
                                </li>
                            }
                            {
                              data.whitepaper
                                ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a rel="nofollow" href={createValidURL(data.whitepaper)} target="_blank"> <img src="/assets/img/whitepaper.svg" alt="Website" className="coin_cat_img" /> White paper </a></div>
                                  </div>
                                </li>
                                :
                                // <li className="coin_individual_list">
                                //   <div className="quick_block_links">
                                //     <div className="widgets__select links_direct"><a className="" data-toggle="modal" data-target="#linksData" onClick={()=> {set_no_data_link("White paper is not avaliable")}} ><img src="/assets/img/whitepaper.svg" className="coin_cat_img" /> White paper </a></div>
                                //   </div>
                                // </li>
                                null
                            }

                            {
                              (data.list_type == 1) ?
                                explorers.length ?
                                (explorers[0] != '') || ((explorers[1] != '') && (explorers[1] != undefined)) ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" ref={explorerRef} onClick={() => { set_explorer_links(!explorer_links) }}><a><img src="/assets/img/explorer.svg" alt="Explorer" className="coin_cat_img" />Explorers <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown"className="dropdown_arrow_img" /> </a></div>
                                  </div>
                                  {
                                    explorer_links ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                            explorers.map((e, i) => 
                                            <li key={i}><a href={e ? e : ""} rel="nofollow" target="_blank">{getURLWebsiteName(e)}</a></li>
                                            )
                                          }
                                        </ul>
                                      </div>
                                      :
                                      null
                                  }
                                </li>
                                :
                                ""
                              :
                              ""
                              :
                              ""
                            }



{/* {
              
              data.contract_addresses.length > 1
                ?
                parseInt(data.contract_addresses[0].contract_address) === 1
                  ?
                  
                  :
                  parseInt(data.contract_addresses[0].contract_address) === 2
                    ?
                    <>
                      <a href={"https://bscscan.com/token/" + data.contract_addresses[0].contract_address} target="_blank">
                        <span >Binance smart chain : {(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                        </span>
                      </a>
                      {
                        contract_copy_status === 'BNB' ?
                          <span className="votes_market">Copied</span>
                          :
                          <img onClick={() => copyContract(data.contract_addresses[0].contract_address, 'BNB')} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />

                      }


                      <img ref={contractRef} onClick={() => set_other_contract(!other_contract)} src="/assets/img/down-arrow.png" className="dropdown_arrow_img" />
                      {
                        other_contract
                          ?
                          <div className="dropdown_block">
                            <p>Ethereum</p>
                            <p>
                              <a href={"https://etherscan.io/token/" + data.contract_addresses[1].contract_address} target="_blank">{(data.contract_addresses[1].contract_address).slice(0, 4) + "..." + (data.contract_addresses[1].contract_address).slice(data.contract_addresses[1].contract_address.length - 4, data.contract_addresses[1].contract_address.length)}</a>
                              <img onClick={() => copyContract(data.contract_addresses[1].contract_address, "ETH")} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                            </p>
                          </div>
                          :
                          null
                      }
                    </>
                    :
                    null
                :
                data.contract_addresses[0].contract_address === 1
                  ?
                  <span className="wallet_address_token" onClick={() => set_other_contract(!other_contract)}>
                    <a href={"https://etherscan.io/token/" + data.contract_addresses[0].contract_address} target="_blank">
                      <img className="token_dropdown_img" src="/assets/img/ETH.svg"></img>{(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                    </a>
                    <img onClick={() => copyContract(data.contract_addresses[0].contract_address, "ETH")} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                  </span>
                  :
                  <span className="wallet_address_token" onClick={() => set_other_contract(!other_contract)}>
                    <a href={"https://bscscan.com/token/" + data.contract_addresses[0].contract_address} target="_blank"><img className="token_dropdown_img" src="/assets/img/BSC.svg"></img>{(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                    </a>
                    <OverlayTrigger
                      placement="top"
                      delay={{ show: 200, hide: 200 }}
                      overlay={tooltip}
                      show={tooltipVisible}
                      onExited={() => setTooltipVisible(false)}
                    >
              <span onClick={()=>handleTooltipClick(data.contract_addresses[0]?.contract_address, 'BNB')} >
                <img src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%"  />  
            </span>
            </OverlayTrigger>
                  
                  </span>
            } */}


                          
     {/* {
              contract_copy_status === 'ETH' ?
                <span className="votes_market" >Copied</span>
                :
                null
            }
          {
            contract_copy_status === 'BNB' ?
              <span className="votes_market">Copied</span>
              :
              null
          } */}                  
                      
                              

                            {/* <li className="coin_individual_list">
                                <div className="quick_block_links">
                                <div className="widgets__select links_direct">
                                  <a>
                                <img src="/assets/img/discuss.svg" className="coin_cat_img" />Discuss <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> 
                              </a>
                              </div>
                              </div>
                            </li> */}

                            
                            {
                              data.source_code_link
                                ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a rel="nofollow" href={createValidURL(data.source_code_link)} target="_blank"><img src="/assets/img/source_code.svg" alt="Website" className="coin_cat_img" /> Source Code </a></div>
                                  </div>
                                </li>
                                :
                                // <li className="coin_individual_list">
                                //   <div className="quick_block_links">
                                //     <div className="widgets__select links_direct"> <a className="" data-toggle="modal" data-target="#linksData" onClick={()=> {set_no_data_link("Source code is not avaliable")}} ><img src="/assets/img/source_code.svg" className="coin_cat_img" /> Source Code </a></div>
                                //   </div>
                                // </li>
                                null
                            }

                            {/* <li className="coin_individual_list">
                                <div className="quick_block_links">
                                <div className="widgets__select links_direct">
                                  <a>
                                <img src="/assets/img/social_media.svg" className="coin_cat_img" />Social Media <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> 
                              </a>
                              </div>
                              </div>
                            </li> */}


                            {/* {
                              market_cap_rank ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" >
                                      <a className="">
                                        {
                                          market_cap_rank != null ?
                                            <span>{market_cap_rank ? "Rank" + "#" + market_cap_rank : null}</span>
                                            :
                                            null
                                        }
                                      </a>
                                    </div>
                                  </div>
                                </li>
                                :
                                null
                            } */}

                           
                            
                            {
                              communities.length  ?
                              (communities[0] != '') || ((communities[1] != '') && (communities[1] != undefined)) ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" ref={communityRef} onClick={() => { set_community_links(!community_links) }}><a><img src="/assets/img/community.svg" alt="Community" className="coin_cat_img" />Community <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown"className="dropdown_arrow_img" /></a></div>
                                  </div>
                                  {
                                    community_links ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                            communities.map((e, i) =>
                                            <li key={i}><a rel="nofollow" href={e ? e : ""} target="_blank">{getURLWebsiteName(e)}</a></li> 
                                            )
                                          }
                                        </ul>
                                      </div>
                                      :
                                      null
                                  }
                                </li>
                                :
                                ""
                              :
                              ""
                            }


                            {/* {
                              exchanges.length > 0 ?
                              (exchanges[0] != '') || ((exchanges[1] != '') && (exchanges[1] != undefined)) ?
                                  <li className="coin_individual_list">
                                      <div className="quick_block_links">
                                        <div className="widgets__select links_direct" onClick={() => { set_show_exchange_links(!show_exchange_links) }}><a><img src="/assets/img/exchange.svg" alt="Exchange" className="coin_cat_img" />Exchanges  <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" className="dropdown_arrow_img" /> </a></div>
                                      </div>
                                      {
                                        show_exchange_links ?
                                          <div className="dropdown_block badge_dropdown_block">
                                            <ul>
                                            {
                                              exchanges.map((e, i) =>
                                              <li key={i}><a href={e ? e : ""} target="_blank">{getURLWebsiteName(e)}</a></li> 
                                              )
                                            }
                                            </ul>
                                          </div>
                                          :
                                          null
                                      }
                                  </li>
                                  :
                                  ""
                                :
                                ""
                            } */}
                            
                            {
                              ((data.category_row_id_array) && (data.category_row_id_array.length > 0)) ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" onClick={() => { set_category_list(!category_list) }}><a><img src="/assets/img/explorer.svg" alt="Explorer" className="coin_cat_img" />Category <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" className="dropdown_arrow_img" /></a></div>
                                  </div>
                                  {
                                    category_list
                                      ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                            data.category_row_id_array.map((e, i) =>
                                              // <li key={i}>{e.business_name}</li>   
                                              <Link href={"/?active_category_tab=" + e._id}><li key={i}>{e.business_name}</li></Link>
                                            )
                                          }
                                        </ul>
                                      </div>
                                      :
                                      null
                                  }
                                </li>
                                :
                                null
                            }

                            {
                              (data.list_type == 2) && data.contract_addresses ?
                              <>
                              {
                                data.contracts_array.length ?
                                <>
                                  <li className="coin_individual_list"  ref={contractRef}>
                                    <div className="quick_block_links">
                                      <div className="widgets__select links_direct" onClick={() => { set_contracts_addr_details(!contracts_addr_details) }}>
                                      <img src="/assets/img/contract.svg" className="coin_cat_img" alt="contract" /> Contracts <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" className="dropdown_arrow_img" />
                                      </div>
                                    </div>
                                    {
                                      contracts_addr_details ? 
                                      <div className="dropdown_block badge_dropdown_block contracts_list">
                                        <ul>
                                        {
                                          data.contracts_array.map((innerItem, i) =>
                                          <>
                                          <li key={i} className='mb-2'>
                                            <div className="media contracts_dropdown">
                                              <div className="media-left">
                                                <img src={(innerItem.token_image ? image_base_url+innerItem.token_image : image_base_url+"default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={innerItem.network_name} className="media-object" />
                                              </div>
                                              <div className="media-body">
                                                
                                                {
                                                  innerItem.network_link ?
                                                  <>
                                                  <h4 className="media-heading"><a rel="nofollow" href={innerItem.network_link+innerItem.contract_address} target="_blank">{innerItem.network_name}</a></h4>
                                                  <p><a rel="nofollow" href={innerItem.network_link+innerItem.contract_address} target="_blank">{getShortWalletAddress(innerItem.contract_address)} </a></p>
                                                  </>
                                                  :
                                                  <>
                                                  <h4 className="media-heading">{innerItem.network_name}</h4>
                                                  <p>{getShortWalletAddress(innerItem.contract_address)}</p>
                                                  </>
                                                }
                                               
                                              </div>
                                              <div className="media-right">
                                                <OverlayTrigger
                                                  delay={{ hide: 450, show: 300 }}
                                                  overlay={(props) => (
                                                    <Tooltip {...props}>
                                                      {
                                                        contract_copy_status == innerItem.contract_address ?
                                                        <>
                                                        Copied
                                                        </>
                                                        :
                                                        <>
                                                        Copy
                                                        </>
                                                      }
                                                    </Tooltip>
                                                  )}
                                                  placement="bottom"
                                                ><img src="/assets/img/copy.png" alt="Copy" className='contract_copy' onClick={()=>copyContract(innerItem.contract_address)} />
                                                </OverlayTrigger>
                                              </div>
                                            </div>
                                            
                                          </li>
                                          </>
                                          )
                                        }
                                        </ul>
                                      </div>
                                      :
                                      ""
                                    }
                                    
                                    </li>
                                  </>
                                :
                                null
                              }
                              
                              </>
                              :
                              ""
                            } 
                            
                          </ul>
                        </div>

                        <div>
                          <div className='row'>
                            <div className='col-12'>
                              <h5 className='converter-title mt-2 mb-2'>{symbol} to USD Converter</h5>
                              <div className="input-group">
                                <div className="input-group-prepend converter-label">
                                  <span className="input-group-text">{symbol}</span>
                                </div>
                                <input type="number" value={token_converter_value} onChange={(e)=>tokenConverter(e.target.value, 1)} step="0.000001" min="0.000001" className="form-control converter-input" placeholder="0"  />
                                <div className="input-group-append converter-label">
                                  <span className="input-group-text converter-second-span">USD</span>
                                </div>
                                <input type="number" value={usd_converter_value}  onChange={(e)=>tokenConverter(e.target.value, 2)} step="0.000001" min="0.000001" className="form-control converter-input" placeholder="0"  />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="token_list_values mt-2">
                            <h4>Summary of {data.token_name}:</h4>
                            {
                              data.marketcap > 0 ?
                              <h5 className='mb-2'><b>{data.token_name}</b> holds a market dominance of <b>{((data.marketcap/data.total_marketcap)*100).toFixed(2)}%</b> on Coinpedia.</h5>
                              :
                              ""
                            } 



                            {
                              data.first_trade_price > 0 ?
                              <h5>First trade occurred on <b>{moment(data.first_trade_on).format('ll')}</b> with a price of <b>${roundNumericValue(data.first_trade_price)}</b> and Growth since <span className={((live_price-data.first_trade_price)/data.first_trade_price) > 0 ? "green":"red"}>{(((live_price-data.first_trade_price)/data.first_trade_price)*100).toFixed(2)}%</span>
                           
                              </h5>
                              :
                              ""
                            } 
                        </div>
                        
                        {/* total_marketcap */}

                        <div className="coin_main_links">
                          <ul className="coin_quick_details">
                          </ul>
                        </div>

                      </div>
                      <div className="col-md-4">
                        <div className="row">
                        <div className="col-md-6 col-12">
                            <div className="token_left_border">
                              <div className='row'>
                                <div className='col-md-12 col-6 mobile_padding_right'>
                                  <div className="token_list_values">
                                    <h4>Max Supply <OverlayTrigger
                                        delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                          <Tooltip {...props} className="custom_pophover">
                                            <p>The maximum supply, refers to the maximum number of coins or tokens that can ever exist for a specific cryptocurrency. It represents an upper limit or cap on the total supply that will ever be reached. The max supply defines the absolute ceiling for the number of coins that can be created or minted.</p>
                                          </Tooltip>
                                        )}
                                        placement="bottom">
                                        <span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                                      </OverlayTrigger> :  &nbsp;</h4>
                                    <h5>
                                      {data.max_supply ? separator(((data.max_supply).toFixed(2))) : "NA"}&nbsp;
                                      
                                    </h5>
                                  </div>
                                </div>
                              
                                <div className='col-md-12 col-6 mobile_padding_left'>
                                  <div className="token_list_values">
                                    <h4>Total Supply <OverlayTrigger
                                      delay={{ hide: 450, show: 300 }}
                                        overlay={(props) => (
                                          <Tooltip {...props} className="custom_pophover">
                                            <p>The total supply refers to the current and total number of coins or tokens that have been created and are available in the cryptocurrency's ecosystem. It includes both the circulating supply (coins in circulation) and any locked, reserved, or unissued coins. The total supply represents the maximum number of coins that can be found within the cryptocurrency's network.</p>
                                          </Tooltip>
                                        )}
                                        placement="bottom"
                                      ><span className='info_col' ><img src="/assets/img/info.png" alt="Info"  /></span>
                                    </OverlayTrigger> : &nbsp;</h4>
                                    <h5>{total_supply ? separator(total_supply.toFixed(2)) : "NA"}&nbsp;
                                    
                                    </h5>
                                  </div>
                                </div>

                                <div className='col-md-12 col-6 mobile_padding_right'>
                                <div className="token_list_values">
                                  <h4>24h Time High : &nbsp;</h4>
                                  <h5>
                                    {high_24h ? '$ '+separator(high_24h) : 'NA'} &nbsp;
                                    {high_24h ? <span className="values_growth"><span className="red">{(((live_price-high_24h)/high_24h)*100).toFixed(2)}%</span></span> : ''}
                                    {/* {
                                      ath_change_percentage ?
                                        ath_change_percentage > 0 ?
                                          <span className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />{ath_change_percentage.toFixed(2) + "%"}</span></span>
                                          :
                                          <span className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" />{ath_change_percentage.toFixed(2) + "%"}</span></span>
                                        :
                                        <span className="values_growth"></span>
                                    } */}
                                  </h5>
                                </div>
                                </div>

                                {
                                  ath_price ? 
                                  <div className='col-md-12 col-6 mobile_padding_right'>
                                    <div className="token_list_values">
                                      <h4 title='All Time High'>All time high : &nbsp;</h4>
                                      <h5>
                                        ${roundNumericValue(ath_price)} &nbsp; <span className="values_growth"><span className="red">{(((live_price-ath_price)/ath_price)*100).toFixed(2)}%</span></span><br/>
                                        {
                                          ath_price_date && is_client?
                                          <span className='alh-date'>{moment(ath_price_date).format('ll')} ({moment(ath_price_date).fromNow()})</span>
                                          :
                                          ""
                                        }
                                      </h5>
                                      
                                    </div>
                                  </div>
                                  :
                                  ""
                                }    
                               

                                
                                
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <div className="token_left_border">
                            <div className='row'>
                            <div className='col-md-12 col-6 mobile_padding_right'>
                            <div className="token_list_values">
                                <h4>1 hour % change : &nbsp;</h4>
                                {
                                  data.percent_change_1h?data.percent_change_1h>0?
                                  <h5 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="High price"/>{data.percent_change_1h.toFixed(2)+"%"}</span></h5>
                                  :
                                  <h5 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="Low price"/>{(data.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h5>
                                  :
                                  "-"
                                }
                              </div>
                              </div>
                              <div className='col-md-12 col-6 mobile_padding_left'>
                              <div className="token_list_values">
                                <h4>7 days % change : &nbsp;</h4>
                                {
                                  percentage_change_7d?percentage_change_7d>0?
                                  <h5 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="High price"/>{roundNumericValue(percentage_change_7d)+"%"}</span></h5>
                                  :
                                  <h5 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="Low price"/>{roundNumericValue(percentage_change_7d)+"%"}</span></h5>
                                  :
                                  "-"
                                }
                              </div>
                              </div>

                              <div className='col-md-12 col-6 mobile_padding_left'>
                              <div className="token_list_values">
                                    <h4>24h Time Low: &nbsp;</h4>
                                    <h5>{low_24h ? '$ '+separator(low_24h) : 'NA'} &nbsp;
                                    {low_24h ? <span className="values_growth"><span className="green">{(((live_price-low_24h)/low_24h)*100).toFixed(2)}%</span></span>: ''}
                                      {/* {atl_change_percentage ?
                                        atl_change_percentage > 0 ?
                                          <span className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />{atl_change_percentage.toFixed(2) + "%"}</span></span>
                                          :
                                          <span className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" />{atl_change_percentage.toFixed(2) + "%"}</span></span>
                                        :
                                        <span className="values_growth"></span>
                                      } */}
                                      </h5>
                                  </div>
                              </div>

                              {
                                atl_price ? 
                                <div className='col-md-12 col-6 mobile_padding_right'>
                                  <div className="token_list_values">
                                    <h4 title='All Time Low'>All time low: &nbsp;</h4>
                                    <h5>
                                      ${roundNumericValue(atl_price)} &nbsp;
                                     
                                      <span className="values_growth"><span className="green">{(((live_price-atl_price)/atl_price)*100).toFixed(2)}%</span></span>
                                      <br/>{
                                      atl_price_date  && is_client ?
                                        <span className='alh-date'>{moment(atl_price_date).format('ll')} ({moment(atl_price_date).fromNow()})</span>
                                        :
                                        ""
                                      }
                                    </h5>
                                    
                                  </div>
                                </div>
                                :
                                ""
                              } 

                              </div>
                              

                             
                              
                              {/* <div className="token_list_values">
                                <h4>Liquidity <span onClick={() => change(6)}><img src='/assets/img/info.png'  /></span></h4>
                                <h5>{liquidity ? "$" : null}{liquidity ? separator(liquidity.toFixed(4)) : "NA"}</h5>
                              </div> */}

                            </div>
                          </div>
                          

{/* open_24h
close_24h */}
                          
                        </div>
                      </div>

                      <div className="col-md-4 col-12">
                          <Dex_volume reqData={{token_id:data.token_id, contracts_array:data.contracts_array, token_symbol:data.symbol, token_price:live_price, volume:volume}}/>
                      </div>
                    </div>
                  </div>

                  <div className="market_token_tabs" ref={icoRef}>
                    <div className="row">                    
                      <div className="col-md-12 col-sm-12 col-12 col-lg-8 col-xl-8">
                        <div className='token_details_tabs_row'>
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <a className={"nav-link "+(main_tab == 1 ? "active":"")} onClick={()=>setMainTab(1)}  >Charts</a>
                        </li>
                        
                        {
                          data.launchpads.length ?
                          <li className="nav-item">
                            <a className={"nav-link "+(main_tab == 2 ? "active":"")} onClick={()=>set_main_tab(2)}>ICO <img src="/assets/img/ico_icon.svg" alt="ICO" className="rocket_launch blink_me" /></a>
                          </li>  
                          :
                          ""
                        }
                          
                        {
                          data.airdrops.length ?
                          <li className="nav-item">
                          <a className={"nav-link "+(main_tab == 3 ? "active":"")} onClick={()=>set_main_tab(3)}>Airdrops <img src="/assets/img/airdrop.svg" alt="Airdrop" className="rocket_launch blink_me" /></a>
                          </li>
                          :
                          ""
                        }  


                        <li className="nav-item" >
                        <a className={"nav-link "+(main_tab == 4 ? "active":"")} onClick={()=>set_main_tab(4)}>Exchanges</a>
                        </li>

                        {
                          data.list_type == 2 ?
                          <>
                          <li className="nav-item" >
                            <a className={"nav-link "+(main_tab == 9 ? "active":"")} onClick={()=>set_main_tab(9)}>Liquidity Pools</a>
                          </li>

                          <li className="nav-item" >
                            <a className={"nav-link "+(main_tab == 10 ? "active":"")} onClick={()=>set_main_tab(10)}>Trade History</a>
                          </li>
                          </>
                          :
                          ""
                        }
                       

                        {
                          data.registered_members.length ?
                          <li className="nav-item" >
                            <a className={"nav-link "+(main_tab == 5 ? "active":"")} onClick={()=>set_main_tab(5)}>Team</a>
                          </li>
                          :
                          ""
                        }

                        {
                          data.tokenomics.length ?
                          <li className="nav-item">
                            <a className={"nav-link "+(main_tab == 6 ? "active":"")} onClick={()=>set_main_tab(6)}>Tokenomics</a>
                          </li>
                          :
                          ""
                        }
                        
                        <li className="nav-item" >
                           <a className={"nav-link "+(main_tab == 7 ? "active":"")} onClick={()=>set_main_tab(7)}>Price Analysis</a>
                        </li>
                        <li className="nav-item" >
                          <a className={"nav-link "+(main_tab == 8 ? "active":"")} onClick={()=>set_main_tab(8)}>Price Prediction</a>
                        </li>
                       
                        
                        
                        {/* <li className="nav-item" >
                          {
                            api_from_type == 0 ?
                              <a className="nav-link" data-toggle="tab" href="#menu1" onClick={() => getTokenTransactions(data.contract_addresses[0].contract_address, data.contract_addresses[0].contract_address)} ><span>Transactions</span></a>
                              :
                              null
                          }
                        </li> */}

                        {/* <li className="nav-item" >
                              <a className="nav-link" data-toggle="tab" href="#about"><span>About</span></a>
                              
                        </li> */}
                      
                        {/* <li className="nav-item" >
                              <a className="nav-link" data-toggle="tab" href="#partners"><span>Partners</span></a>
                              
                        </li> */}


                       
                        {/* <li className="nav-item" >
                              <a className="nav-link" data-toggle="tab" href="#indicators"><span>Indicators</span></a>
                        </li> */}
                        
                       
                      </ul>
                    </div>
                
                <div className='charts_tables_content'>
                  <div className="token_details_tabs">
                    <div className="tab-content">
                      <div id="charts" className={"tab-pane fade "+(main_tab == 1 ? "show active":"")}>
                        <div className='tokendetail_charts' style={{minHeight:"456px"}}>
                          <div className='row'>
                            <div className='col-md-6 col-12'>
                            {/* <h5 className='price_chart'>{(symbol).toUpperCase()} Price Chart</h5> */}
                            <div className='charts_date_tab float-left charts_price_tabs'>
                                <ul className="nav nav-tabs">
                                  <li className="nav-item">
                                      <a className={chart_tab == 1 ? "nav-link active":"nav-link"} onClick={()=>set_chart_tab(1)}  data-toggle="tab"><span>Price</span></a>
                                  </li>
                                  <li className="nav-item" >
                                      <a className={chart_tab == 2 ? "nav-link active":"nav-link"} onClick={()=>set_chart_tab(2)} data-toggle="tab"><span>Market Cap</span></a>
                                  </li>
                                  {
                                    data.tradingview_id ?
                                    <li className="nav-item">
                                      <a className={chart_tab == 3 ? "nav-link active":"nav-link"} onClick={()=>set_chart_tab(3)} data-toggle="tab"><span>TradingView</span></a>
                                    </li>
                                    :
                                    ""
                                  }
                                  
                                  {
                                     data.liquidity_data_status == 1 ?
                                      <li className="nav-item">
                                        <a className={chart_tab == 4? "nav-link active":"nav-link"} onClick={()=>set_chart_tab(4)} data-toggle="tab"><span>Dex pairs</span></a>
                                      </li>
                                      :
                                      ""  
                                  }
                                </ul>
                            </div>
                            </div>
                            <div className='col-md-6 col-12'>
                              {
                                ((chart_tab == 1)|| (chart_tab == 2)) ?
                                <div className='charts_date_tab date_chart_interval'>
                                    <ul className="nav nav-tabs">
                                        {
                                            cmc_graph_ranges.length ?
                                            cmc_graph_ranges.map((item, i) =>
                                            <li className="nav-item" KEY={i}>
                                                <a className={"nav-link "+(time_name==item.time_name ? "active":"")} onClick={()=>plotGraph(item.time_name, item.intervals, item.count)}><span>{item.time_name}</span></a>
                                            </li>
                                            )
                                            :
                                            ""
                                        }
                                    </ul>
                                </div>
                                :
                                chart_tab == 4 ?
                                <>
                                <div className='dex_pair_dropdown'>
                                <ul>
                                <li className="coin_individual_list" ref={dexPairsRef}>
                                  <div>
                                    {
                                      dex_pair_object._id ?
                                      <div className="widgets__select dex_pair_select" onClick={() =>set_dex_pair_details(!dex_pair_details)}>
                                        <div className="media contracts_dropdown mb-0">
                                          <div className="media-left mt-1">
                                            <img src={(data.token_image ? image_base_url+data.token_image: data.coinmarketcap_id ? cmc_image_base_url+data.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={data.symbol} className="network-image" />
                                          </div>
                                          {/* (innerItem.network_image ? image_base_url+innerItem.network_image : image_base_url+"default.png") */}
                                          
                                          <div className="media-body">
                                              <h6 className='dex-h6 mt-2 mb-2'>{data.symbol} / <span className='dex-pair-currency'>{dex_pair_object.pair_token_symbol}</span> - {getShortWalletAddress(dex_pair_object.liquidity_address, 4)}</h6>
                                            </div>

                                          <div className='media-right mt-2'>
                                            <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" className="dropdown_arrow_img" />
                                          </div>
                                        </div>
                                      </div>
                                      :
                                      <div className="widgets__select dex_pair_select" onClick={() =>set_dex_pair_details(!dex_pair_details)}>
                                        Select Dex Pairs <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" className="dropdown_arrow_img" />
                                      </div>
                                    }
                                  </div>
                                    
                                    {
                                      dex_pair_details ? 
                                      <div className="dropdown_block badge_dropdown_block dex_pairs_list mt-2">
                                        <ul>
                                        {
                                          data.liquidity_addresses.map((innerItem, i) =>
                                          <>
                                          <li key={i} className='mb-2' onClick={() =>dexPairGraph(innerItem)}>
                                            <div className="media contracts_dropdown">
                                              <div className="media-left">
                                                <img src={(data.token_image ? image_base_url+data.token_image: data.coinmarketcap_id ? cmc_image_base_url+data.coinmarketcap_id+".png" : "default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={innerItem.network_name} className="network-image" />
                                              </div>
                                              {/* (innerItem.network_image ? image_base_url+innerItem.network_image : image_base_url+"default.png") */}
                                              
                                              <div className="media-body">
                                                  <h6 className='dex-h6'>{data.symbol} / <span className='dex-pair-currency'>{innerItem.pair_token_symbol}</span> - {innerItem.exchange_name}</h6>
                                                  <p>{getShortWalletAddress(innerItem.liquidity_address, 10)}</p>
                                              </div>
                                              <div className='media-right'>
                                                  {
                                                    dex_pair_object._id == innerItem._id ?
                                                    <>
                                                    <img className="dex-pair-selected" src="/assets/img/tick.png" alt="Tick"/>
                                                    </>
                                                    :
                                                    ""
                                                  }
                                              </div>
                                            </div>
                                            
                                          </li>
                                          </>
                                          )
                                        }
                                        </ul>
                                      </div>
                                      :
                                      ""
                                    }
                                </li>
                                </ul>
                                </div>
                                </>
                                :
                                ""
                              }
                            
                           
                            </div>
                        </div>
    
                           {
                            time_name ? 
                              chart_tab==1?
                              <>
                              <Price_chart reqData={{symbol:symbol.toLowerCase(), time_name, intervals, count,chart_tab, token_name:data.token_name, volume, percentage_change_24h, circulating_supply, max_supply:data.max_supply, live_price}} />
                              </>
                              :
                              chart_tab==2 ?
                              <Marketcap_Chart reqData={{symbol:symbol.toLowerCase(), time_name, intervals, count,chart_tab}} />
                              :
                              chart_tab==3 && data.tradingview_id ?
                              <>
                                <Tradingview_chart reqData={{tradingview_id:data.tradingview_id}} />
                                <div className='trading-view-message mt-2'>
                                  <span>{data.symbol}/USD charts by <a href="https://in.tradingview.com/" target="_blank">Tradingview</a></span>
                                </div> 
                              </>
                              :
                              ""
                            :
                            ""
                           }

                           {
                             dex_pair_object._id ?
                             chart_tab == 4 ? 
                             <>
                             <Dex_pairs reqData={{symbol:symbol.toLowerCase(), dex_pair_object:dex_pair_object, contracts_array:data.contracts_array}} />
                                <div className='trading-view-message mt-2'>
                                  <span>{data.symbol}/{dex_pair_object.pair_token_symbol} charts by <a href="https://in.tradingview.com/" target="_blank">Tradingview</a></span>
                                </div> 
                             </>
                             
                             :
                             ""
                             :
                             ""
                           }
                          </div>
                      </div>
                      
                       <div id="ico_details"  className={"tab-pane fade "+(main_tab == 2 ? "show active":"")} >
                        <div>
                          <Ico_detail launchpads={data.launchpads ? data.launchpads:[]} token_symbol={symbol} today_date={data.today_date}/>
                        </div>
                      </div>

                      <div id="airdrop_details"  className={"tab-pane fade "+(main_tab == 3 ? "show active":"")}>
                        <Airdrop_detail airdrops={data.airdrops ? data.airdrops:[]} token_image={data.token_image ? data.token_image:""} coinmarketcap_id={data.coinmarketcap_id ? data.coinmarketcap_id:""} token_symbol={symbol} today_date={data.today_date} />
                      </div>
                     


                      <div id="home" className={"tab-pane fade "+(main_tab == 4 ? "show active":"")}>
                        <Exchanges_list token_id={data.token_id} crypto_type={1} ath_price_date={data.ath_price_date ? data.ath_price_date:""}/>
                      </div>

                      <div id="home" className={"tab-pane fade "+(main_tab == 9 ? "show active":"")}>
                        <Liquidity_pool sendDataToParent={getLiquidityDataFromChild} reqData={{fetch_data_type:data.fetch_data_type ? data.fetch_data_type:1, token_id:data.token_id, contracts_array:data.contracts_array, token_image:data.token_image ? data.token_image:"", token_name:data.token_name, token_symbol:data.symbol, token_price:data.price, callback: getLiquidityDataFromChild}} crypto_type={1}/>
                      </div>
                      
                      <div id="home" className={"tab-pane fade "+(main_tab == 10 ? "show active":"")}>
                        <Trade_history reqData={{token_id:data.token_id, contracts_array:data.contracts_array, token_symbol:data.symbol, token_price:live_price}} />
                      </div>
                      
                      
                    <div id="team" className={"tab-pane fade "+(main_tab == 5 ? "show active":"")}>
                      <div className='team_detail_token'>
                        <h4 className='tabs_title_token'>Team</h4>
                        <div className='row'>
                          {
                            data.registered_members.length ?
                            data.registered_members.map((item, i) =>
                            <div className='col-sm-6 col-md-6 col-lg-4 col-xl-3 col-6'>
                              <div className='text-center team_market_block'>
                                <img src={IMAGE_BASE_URL+"/profile/"+(item.profile_image ? item.profile_image:"default.png")} alt={item.full_name} onError={(e) =>e.target.src = IMAGE_BASE_URL+"/profile/default.png"}/>
                                <h6>{item.full_name}</h6>
                                <p><span dangerouslySetInnerHTML={{__html:item.work_position}} /></p>
                              </div>
                            </div>
                            )
                            :
                            ""
                          }
                        </div>
                      </div>
                    </div>

                    <div id="tokenomics" className={"tab-pane fade "+(main_tab == 6 ? "show active":"")}>
                      <Tokenomics tokenomics_list={data.tokenomics ? data.tokenomics:[]} tokenomics_percentage_value={data.tokenomics_percentage_value} total_supply={data.total_supply}/>
                    </div>

                    <div id="priceanalysis" className={"tab-pane fade "+(main_tab == 7 ? "show active":"")}>
                      <Price_analysis/> 
                    </div>

                    <div id="priceprediction" className={"tab-pane fade "+(main_tab == 8 ? "show active":"")}>
                      <Price_prediction/>
                    </div>

                    <div id="indicators" className="tab-pane fade">
                      <div className='tokendetail_charts'>
                        <h5 className='text-center'>Coming Soon</h5>
                      </div>
                    </div>

                    </div>
                  
                  </div>
                  </div>

                  
                      </div>
                      <div className="col-md-12 col-sm-12 col-12 col-lg-4 col-xl-4">
                      <div className='token_details_tabs_row'>
                      <ul className="nav nav-tabs token_events_tabs">
                            <li className="nav-item" >
                                  <a className="nav-link active" data-toggle="tab" href="#news"><span>News</span></a>
                            </li>

                            <li className="nav-item">                            
                              <a className="nav-link " data-toggle="tab" href="#events" ><span>Events</span></a>
                            </li>
                            
                            {/* <li className="nav-item" >
                                  <a className="nav-link" data-toggle="tab" href="#airdrop"><span>Airdrop</span></a>
                            </li> */}
                        </ul>
                      </div>
                    
                     

                      <div className="tab-content">

                      <div id="news" className="tab-pane fade show in active ">
                          <News/>
                      </div>


                      <div id="events" className="tab-pane fade in">
                      <Events/>
                        </div>
                        

                      <div id="airdrop" className="tab-pane fade in">
                      <Airdrops/>
                      
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>

                  
                  
                  <div className="about_token_details">
                    {
                      data.token_description ?
                        <h4 className='tabs_title_token'>About {data.token_name ? data.token_name : "-"}</h4>
                        :
                        null
                    }

                    <div dangerouslySetInnerHTML={{ __html: data.description }}></div>

                  </div>

                  <div className="how_do_you_feel" >
                    <div className="row">
                      <div className="col-md-6">
                        <h4>How do you feel about {data.token_name} today?</h4>
                        <p>Market sentiments, at your quick watch! we're working hard on this new feature, Follow us on <a href={"https://twitter.com/Coinpedianews"} target="_blank">Twitter</a>,to be the first to know when it's ready!</p>
                      </div>
                      <div className="col-md-6">
                        <button className="" data-toggle="modal" data-target="#comingSoon">😪 Bad</button>
                        <button className="" data-toggle="modal" data-target="#comingSoon">🙂 Good</button>
                      </div>
                    </div>
                  </div>

                 
                  

                </div>

              </div>
            </div>
          </div>
          
          
        </div>
      </div>

      <div className="coming_soon_modal">
        <div className="modal" id="comingSoon">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
                <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" alt="Close" /></span></button>
              </div>
              <div className="modal-body">
                <p className="coming_soon_subtext">This feature will be available soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="coming_soon_modal">
        <div className="modal" id="linksData">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title coming_soon_title">Oops!</h4>
                <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" alt="Close" /></span></button>
              </div>
              <div className="modal-body">
                <p className="coming_soon_subtext">{no_data_link}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={"modal " + (share_modal_status ? " modal_show" : " ")} id="market_share_page">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Share</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={() => set_share_modal_status(false)}><span><img src="/assets/img/close_icon.svg" alt="Close" /></span></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-1" />
                <div className="col-md-10">
                  <div className="input-group">
                    <input type="text" id="referral-link" className="form-control" defaultValue={market_coinpedia_url + data.token_id} readOnly />
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="myTooltip" onClick={() => myReferrlaLink()}>
                        <img src="/assets/img/copy-file.png" alt="Copy" className="copy_link ml-2" width="100%" height="100%" />
                      </span>
                    </div>
                  </div>
                  

                  <h6>Share with </h6>
                  <p className="share_social">
                    <a rel="nofollow" href={"https://www.facebook.com/sharer/sharer.php?u=" + market_coinpedia_url + data.token_id} target="_blank"><img src="/assets/img/facebook.png" alt="Facebook" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"https://www.linkedin.com/shareArticle?mini=true&url=" + market_coinpedia_url + data.token_id} target="_blank"><img src="/assets/img/linkedin.png" alt="Linkedin" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"http://twitter.com/share?url=" + market_coinpedia_url + data.token_id+"&text="+ share_text} target="_blank"><img src="/assets/img/twitter.png" alt="Twitter" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"https://wa.me/?text="+share_text} target="_blank"><img src="/assets/img/whatsapp.png"  width="100%" height="100%" alt="Whatsapp" /></a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={"modal " + (category_modal ? " modal_show" : " ")} >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Categories</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={() => set_category_modal(false)}><span><img src="/assets/img/close_icon.svg" alt="Close" /></span></button>
            </div>
            <div className="modal-body">
            
              <ul className='category-ul '>
                {
                  data.categories.map((item, i) => 
                  
                  <li key={i} className='mb-2'><Link href={"/category/"+item.category_id}>{item.category_name}</Link></li>
                  
                  )
                }
              </ul>
           
            </div>
          </div>
        </div>
      </div>

      <div className={"modal connect_wallet_error_block" + (handleModalVote ? " collapse show" : "")}>
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              {/* <button type="button" className="close" data-dismiss="modal" onClick={() => ModalVote()}><span><img src="/assets/img/close_icon.svg" /></span></button> */}
              {
                voting_status == false ?
                  <h4> Do you want to support this token? </h4>
                  :
                  <h4> Do not support this token? </h4>
              }



              <div className="vote_yes_no">
                {
                  user_token ?
                  <>
                  {
                      voting_status == false ?
                        <>
                          <button onClick={() => vote(1)}>Confirm</button>
                          <button onClick={() => ModalVote()}>Cancel</button>
                        </>
                        :
                        <>
                          <button onClick={() => vote(0)}>Confirm</button>
                          <button onClick={() => ModalVote()}>Cancel</button>
                        </>
                    }
                  </>
                  :
                  <>
                   <button onClick={()=>loginModalStatus(data._id, 2)}>Confirm</button>
                   <button onClick={() => ModalVote()}>Cancel</button>
                  </>
                }
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {modal_data.title ? <Popupmodal name={modal_data} /> : null}
      {
        dex_row_id ?
          <BasicTokenInfo dex_row_id={dex_row_id} />
          :
          null
      }

      {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
    </>
  )
}


export async function getServerSideProps({ query, req }) 
{
  const token_id = query.token_id
  const search_by_category = query.search ? query.search : ""
  const switch_tab = query.tab ? query.tab : ""
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)

  const tokenQuery = await fetch(API_BASE_URL + "markets/cryptocurrency/individual_details/" + token_id, config(userAgent.user_token))
  if(tokenQuery) 
  {
    const tokenQueryRun = await tokenQuery.json()
    if(tokenQueryRun.status)
    {
      return { props: { data: tokenQueryRun.message, errorCode: false, token_id: token_id, userAgent: userAgent, config: config(userAgent.user_token), search_by_category: search_by_category, switch_tab:switch_tab } }
    }
    else
    {
      return { props: { errorCode: true } }
    }
  }
  else 
  {
    return { props: { errorCode: true } }
  }
}
