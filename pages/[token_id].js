import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Error from './404'
import {
  API_BASE_URL, config, separator, createValidURL, strLenTrim, strTrim, getDomainName, app_coinpedia_url, coinpedia_url, market_coinpedia_url, IMAGE_BASE_URL,
  graphqlApiKEY, roundNumericValue, Logout, DomainName
} from '../components/constants'
import { live_price_graphql } from '../components/token_details/graphql'
import { live_price_coingecko } from '../components/token_details/coingecko'
import { graphQlURL, fromNToDate } from '../components/tokenDetailsFunctions'
import moment from 'moment'
import ReactPaginate from 'react-paginate'
import cookie from "cookie"
import JsCookie from "js-cookie"
import Axios from 'axios'
// import Highcharts  from 'highcharts'
// import Datetime from "react-datetime"
// import "react-datetime/css/react-datetime.css" 
import Popupmodal from '../components/popupmodal'
import Exchanges_list from '../components/token_details/exchanges_list'
import BasicTokenInfo from '../components/basicTokenInfo'
import Search_Contract_Address from '../components/searchContractAddress'
// import Graph_Data from '../components/graphData'
import Chart from '../components/lightWeightChart'
import Token_chart from '../components/token_details/token_chart'
import Price_analysis from '../components/token_details/price_analysis'
import News from '../components/token_details/news'
import Events from '../components/token_details/events'
import Airdrops from '../components/token_details/airdrop'
import Price_prediction from '../components/token_details/price_prediction'
import Tokenomics from '../components/token_details/tokenomics'
import MarketCapChart from '../components/token_details/marketcap_chart'
import Airdrop_detail from '../components/token_details/airdrop_details'
import Ico_detail from '../components/token_details/ico_detail'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';

import { cmc_graph_ranges} from '../components/tokenDetailsFunctions' 
// import dynamic from 'next/dynamic';


let inputProps = {
  className: 'market-details-date-search my_input',
  placeholder: 'From date',
  readOnly: true
}

let inputProps2 = {
  className: 'market-details-date-search my_input',
  placeholder: 'To date',
  readOnly: true
}

export default function tokenDetailsFunction({ errorCode, data, token_id, userAgent, config, tokenStatus, search_by_category }) {
  console.log("data", data)
  if (errorCode) { return <Error /> }
  const communityRef = useRef(null)
  const [dex_row_id, set_dex_row_id]=useState("")
  const explorerRef = useRef(null)
  const contractRef = useRef(null)
  const [image_base_url] = useState('https://s2.coinmarketcap.com/static/img/coins/128x128/')
  const [symbol] = useState(data.symbol)
  const [watchlist, set_watchlist] = useState(data.watchlist_status ? data.watchlist_status:false)
  const [share_modal_status, set_share_modal_status] = useState(false)
  const [light_dark_mode, set_light_dark_mode] = useState(JsCookie.get('light_dark_mode'))
  const [user_token] = useState((userAgent.user_token) ? userAgent.user_token : "")
  const [perPage] = useState(10)
  const [current_url] = useState(market_coinpedia_url + token_id)
  const [exchange_list_new, set_exchange_list_new] = useState([])
  // console.log("exchange_list_new",exchange_list_new)
  const [exchangelist, set_exchangelist] = useState([])
  const [exchangesPageCount, setExchnagesPageCount] = useState(0)
  const [exchangesCurrentPage, setExchangesCurrentPage] = useState(0)
  const [max_supply, set_max_supply] = useState(data.max_supply ? data.max_supply:"")
  const [tokentransactions, set_tokentransactions] = useState([])
  const [tokentransactionsData, set_tokentransactionsdata] = useState([])
  const [tokentransactionsPageCount, settokentransactionsPageCount] = useState(0)
  const [tokentransactionsCurrentPage, settokentransactionsCurrentPage] = useState(0)
  const [today_date, set_today_date] = useState(data.today_date)
  const [no_data_link, set_no_data_link] = useState("")
  const [graph_data_date, set_graph_data_date] = useState(4)
  const [watchlist_count, set_watchlist_count] = useState(data.total_watchlist_count)
  const [searchApprovalStatusParam] = useState(["pair_two_name"])
  // const [searchBy, setSearchBy] = useState("")  
  // const [err_searchBy, setErrsearchBy] = useState("") 
  // const [search_contract_address, set_search_contract_address] = useState("")    
  // const [validSearchContract, setvalidContractAddress] = useState("")
  const [api_from_type] = useState(data.api_from_type)
console.log("api_from_type",token_id)
  const [decimal, setdecimal] = useState(0)

  const [category_list, set_category_list] = useState(false)
  const [community_links, set_community_links] = useState(false)
  const [explorer_links, set_explorer_links] = useState(false)
  const [handleModalConnections, setHandleModalConnections] = useState(false)
  const [handleModalVote, setHandleModalVote] = useState(false)
  
  const [customstartdate, setCustomstartdate] = useState("")
  const [volume, set_volume] = useState(data.volume ? data.volume:"")
  const [fully_diluted_market_cap, set_fully_diluted_market_cap] = useState(data.fully_diluted_market_cap ? data.fully_diluted_market_cap:"")

  const [price_change_24h, set_price_change_24h] = useState("")
  const [circulating_supply, set_circulating_supply] = useState(data.circulating_supply ? data.circulating_supply:"")
  const [live_price, set_live_price] = useState(data.price ? data.price:"")
  const [market_cap_rank, set_market_cap_rank] = useState("")
  const [market_cap_change_percentage_24h, set_market_cap_change_percentage_24h] = useState("")
  const [fully_diluted_valuation, set_fully_diluted_valuation] = useState("")
  const [show_exchange_links, set_show_exchange_links] = useState("")

  const [low_24h, set_low_24h] = useState("")
  const [total_supply, set_total_supply] = useState("")
  const [high_24h, set_high_24h] = useState("")
  const [categories, set_categories] = useState([])
  const [mcap_to_tvl_ratio, set_mcap_to_tvl_ratio] = useState("")

  const [ath, set_ath] = useState(0)
  const [atl, set_atl] = useState(0)
  const [ath_change_percentage, set_ath_change_percentage] = useState(0)
  const [atl_change_percentage, set_atl_change_percentage] = useState(0)

  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
  const [main_business_model_name, set_main_business_model_name] = useState("")
  const [graph_status, set_graph_status] = useState(false)
  const [other_contract, set_other_contract] = useState(false)
  const [customDate, setCustomDate] = useState(false)
  const [graphDate, set_graphDate] = useState(1)
  const [contract_24h_volume, set_contract_24h_volume] = useState(0)
  const [market_cap, set_market_cap] = useState(0)
  const [liquidity, set_liquidity] = useState(0)
  const [contract_copy_status, set_contract_copy_status] = useState("")
  const [desc_read_more, set_desc_read_more] = useState(false)
  const [votes, set_votes] = useState(data.total_voting_count)
  const [voting_status, set_voting_status] = useState(data.voting_status)
  const [exchange_list, set_exchange_list] = useState([])
  const [launchpad_row_id, set_launchpad_row_id] = useState(data.launch_pads_data.length > 0 ? parseInt(data.launch_pads_data[0]._id) : "")
  const [launchpad_object, set_launchpad_object] = useState(data.launch_pads_data.length > 0 ? data.launch_pads_data[0] : "")
  const [coingecko_status, set_coingecko_status] = useState(false)
  const [category_modal, set_category_modal] = useState(false)
  const [chart_tab, set_chart_tab] = useState(1)

  const [tooltipVisible, setTooltipVisible] = useState(false);


  
  const [time_name, set_time_name] = useState("1D")
  const [intervals, set_intervals] = useState("10m")
  const [count, set_count] = useState("144")
  const change = async (row_id) => {

    await set_dex_row_id("")

    await set_dex_row_id(row_id)
    
  }

  const handleTooltipClick = (data) => {
    setTooltipVisible(true);
    var copyText = document.createElement("input")
    copyText.value = data
    document.body.appendChild(copyText)
    copyText.select()
    document.execCommand("Copy")
    copyText.remove()
    setTimeout(() => {
      setTooltipVisible(false); 
    }, 3000);
  };

  const tooltip = (
    <Tooltip arrowOffsetTop={20} id="tooltip">Copied</Tooltip>
  );
  

  const div = useRef();

  useLayoutEffect(() => {
    console.log(div);
    const divAnimate = div.current.getBoundingClientRect().top;
    console.log(divAnimate);
    const onScroll = () => {
      if (divAnimate < window.scrollY && window.innerWidth >= 1024) {
        console.log("ok");
        div.current.style.position = "fixed";
        div.current.style.top = 0;
        div.current.style.left = 0;
      } else {
        div.current.style.position = "relative";
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  

  const plotGraph = async (pass_time_name, pass_interval, pass_count) =>
  {
    await set_time_name("")
    set_time_name(pass_time_name)
    set_intervals(pass_interval)
    set_count(pass_count)
  }


  
  useEffect( () => 
  {
    //graphAPI()
    // if (parseInt(api_from_type) === 1) {
      if (!coingecko_status) {
        // coingeckoId()
      // }
    }
    else {
      if (!coingecko_status) {
        //graphqldata()
      }
    }
    // categorySearchTokens()
    set_light_dark_mode(JsCookie.get('light_dark_mode'))
    document.addEventListener("click", handleClickOutside, false);
    return () => { document.removeEventListener("click", handleClickOutside, false) }
  }, [])

  const coingeckoId = async () => {
    var coingecko_data = await live_price_coingecko(token_id)


    console.log("coingecko_data",coingecko_data)
    set_coingecko_status(true)
    set_mcap_to_tvl_ratio(coingecko_data.mcap_to_tvl_ratio)
    set_max_supply(coingecko_data.max_supply)
    set_price_change_24h(coingecko_data.price_change_24h)
    set_circulating_supply(coingecko_data.circulating_supply)
    set_live_price(coingecko_data.live_price)
    set_market_cap(coingecko_data.market_cap)
    set_exchange_list_new(coingecko_data.exchanges)
    set_volume(coingecko_data.total_volume)
    set_market_cap_rank(coingecko_data.market_cap_rank)
    set_market_cap_change_percentage_24h(coingecko_data.market_cap_change_percentage_24h)
    set_fully_diluted_valuation(coingecko_data.fully_diluted_valuation)
    set_low_24h(coingecko_data.low_24h)
    set_high_24h(coingecko_data.high_24h)
    set_categories(coingecko_data.categories)
    set_total_supply(coingecko_data.total_supply)
    set_ath(coingecko_data.ath)
    set_atl(coingecko_data.atl)
    set_ath_change_percentage(coingecko_data.ath_change_percentage)
    set_atl_change_percentage(coingecko_data.atl_change_percentage)
    set_exchange_list(coingecko_data.exchanges)

    const reqObj = {
      token_id: token_id,
      live_price: coingecko_data.live_price,
      total_max_supply: coingecko_data.max_supply,
      market_cap: coingecko_data.market_cap
    }
    await Axios.post(API_BASE_URL + 'markets/tokens/save_token_live_price', reqObj, config)

  }

  const graphqldata = async () => {
    if (parseInt(data.list_type) !== 3) {
      const graphql_data = await live_price_graphql(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)
      set_coingecko_status(true)
      set_circulating_supply(graphql_data.circulating_supply)
      set_max_supply(graphql_data.max_supply)
      set_price_change_24h(graphql_data.price_change_24h)
      set_live_price(graphql_data.live_price)
      set_market_cap(graphql_data.market_cap)
      set_contract_24h_volume(graphql_data.contract_24h_volume)
      set_liquidity(graphql_data.liquidity)

      const reqObj = {
        token_id: data.token_id,
        live_price: graphql_data.live_price,
        total_max_supply: graphql_data.max_supply,
        market_cap: graphql_data.market_cap
      }
      await Axios.post(API_BASE_URL + 'markets/tokens/save_token_live_price', reqObj, config)
    }
  }


  const makeJobSchema = () => {
    return {
      "@context": "http://schema.org/",
      "@type": "Organization",
      "name": data.token_name,
      "url": market_coinpedia_url + data.token_id,
      "logo": image_base_url + data.token_image,
      "sameAs": ["", "", "", ""]
    }
  }

  // var yesterday = moment()
  // function valid(current) 
  // {  
  //   return current.isBefore(yesterday)
  // }

  // const valid2=(current)=> 
  // {    
  //   return current.isBefore(yesterday)
  // }

  // const removeTags=(str)=>
  // {
  //   if ((str===null) || (str===''))
  //       return false;
  //   else
  //       str = str.toString();
  //   return str.replace( /(<([^>]+)>)/ig, '');
  // }
  const uniques = exchange_list.map(item => item.pair_two_name).filter((value, index, self) => self.indexOf(value) === index)
  // console.log(uniques)

  const getexchangedata2 = (param) => {
    set_graph_status(true)
    // console.log(param)
    var token_listData = exchange_list
    var fi_tokens = token_listData.filter((item) => searchApprovalStatusParam.some((newItem) => !item[newItem].toString().indexOf(param)))
    // var fi_tokens =  token_listData.filter((item) => searchApprovalStatusParam.some((newItem) =>  item[newItem].indexOf(param)))
    set_exchange_list_new(fi_tokens)
    // console.log("fi_tokens",fi_tokens)
  }

  const exchangecoingecko = () => {
    set_graph_status(true)
    set_exchange_list_new(exchange_list)
  }

  const getTokenTransactions = (id, networktype) => {
    let query = ""
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())

    if (networktype === "1") {
      query = `
        query
        {
              ethereum(network: ethereum) {
                dexTrades(
                  any: [{baseCurrency: {is: "`+ id + `"}}]
                  date: {since: "`+ dateSince + `" }
                  options: {desc: ["tradeIndex", "block.timestamp.time"], limitBy: {each: "baseCurrency.symbol", limit: 100}}
                ) {
                  exchange {
                    name
                  }
                  baseCurrency {
                    symbol
                    address
                  }
                  transaction {
                    hash
                  }
                  block {
                    timestamp {
                      time(format: "%Y-%m-%d %H:%M:%S")
                    }
                    height
                  }
                  tradeIndex
                  buyAmount: baseAmount
                  buyAmountInUsd: baseAmount
                  quoteCurrency {
                    symbol
                    address
                  }
                  sellAmountInUsd: quoteAmount
                  tradeAmountInUsd: tradeAmount(in: USD)          
                }
              }
            }
        ` ;
    }
    else {
      query = `
              query
              {
                ethereum(network: bsc) {
                  dexTrades(
                    any: [{baseCurrency: {is: "`+ id + `"}}]
                    date: {since: "`+ dateSince + `" }
                    options: {desc: ["tradeIndex", "block.timestamp.time"], limitBy: {each: "baseCurrency.symbol", limit: 100}}
                  ) {
                    exchange {
                      name
                    }
                    baseCurrency {
                      symbol
                      address
                    }
                    transaction {
                      hash
                    }
                    block {
                      timestamp {
                        time(format: "%Y-%m-%d %H:%M:%S")
                      }
                      height
                    }
                    tradeIndex
                    buyAmount: baseAmount
                    buyAmountInUsd: baseAmount
                    quoteCurrency {
                      symbol
                      address
                    }
                    sellAmountInUsd: quoteAmount
                    tradeAmountInUsd: tradeAmount(in: USD)          
                  }
                }
              }
        ` ;
    }



    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({ query })
    }
    fetch(graphQlURL, opts).then(res => res.json()).then(result => {
      if (result.data.ethereum != null) {
        set_tokentransactions(result.data.ethereum.dexTrades)
        if (result.data.ethereum.dexTrades) {
          settokentransactionsPageCount(Math.ceil(result.data.ethereum.dexTrades.length / 10))
        }

        tokenTrasactionspagination(result.data.ethereum.dexTrades, 0)
      }
    }).catch(console.error)
  }

  const tokenTrasactionspagination = (data, offset) => {
    if (data) {
      let slice = data.slice(offset, offset + 10)

      const postData = slice.map((e, i) => {
        return <tr key={i}>

          <td>{separator(Number.parseFloat((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd).toFixed(2))} {(e.baseCurrency.symbol === "WBNB") ? e.quoteCurrency.symbol : e.baseCurrency.symbol}</td>
          <td>{moment(e.block.timestamp.time).format("ll")}</td>
          <td>{separator(Number.parseFloat((e.tradeAmountInUsd / ((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd)).toString()).toFixed(7))} USD</td>
          <td>{separator(Number.parseFloat(e.tradeAmountInUsd).toFixed(4))} USD</td>
          <td><a rel="noreferrer" href={"https://bscscan.com/tx/" + e.transaction.hash} target="_blank">{e.exchange.name ? e.exchange.name : "-"}</a></td>
        </tr>
      })
      set_tokentransactionsdata(postData)
    }
  }

  const tokenTrasactionshandlePageClick = (e) => {
    settokentransactionsCurrentPage(e.selected)
    const selectPage = e.selected * 10;
    tokenTrasactionspagination(tokentransactions, selectPage)
  }

  const getWalletDetails = (id, networktype, wallettype) => {
    const query = `
              query
              {
                ethereum(network: `+ networktype + `) {
                  inbound: transfers(
                    options: {desc: "block.timestamp.time", asc: "currency.symbol", limit: 10}
                    date: {since: null, till: null},
                    amount: {gt: 0},
                    receiver: {is: `+ '"' + id + '"' + `}
                  ) {
                    block {
                      timestamp {
                        time(format: "%Y-%m-%d %H:%M:%S")
                      }
                      height
                    }
                    address: sender {
                      address
                      annotation
                    }
                    currency {
                      address
                      symbol
                    }
                    gasValue
                    amount
                    amountInUSD: amount(in: USD)
                    transaction {
                      hash
                      gasPrice
                    }
                    external
                  }
                  outbound: transfers(
                    options: {desc: "block.timestamp.time", asc: "currency.symbol", limit: 10}
                    date: {since: null, till: null},
                    amount: {gt: 0}
                    sender: {is: `+ '"' + id + '"' + `}
                  ) {
                    block {
                      timestamp {
                        time(format: "%Y-%m-%d %H:%M:%S")
                      }
                      height
                    }
                    address: receiver {
                      address
                      annotation
                    }
                    currency {
                      address
                      symbol
                    }
                    amount
                    amountInUSD: amount(in: USD)
                    transaction {
                      hash
                      gasPrice
                    }
                    gasValue
                    external
                  }
                }
              }
        ` ;

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };

    fetch(graphQlURL, opts)
      .then(res => res.json())
      .then(result => {
        let get_inbond_list = []
        let get_outbond_list = []

        if (result.data.ethereum.inbound) {
          result.data.ethereum.inbound.map((e, i) => {
            return get_inbond_list[i] = { e, type: 1 }
          })
        }

        if (result.data.ethereum.outbound) {
          result.data.ethereum.outbound.map((e, i) => {
            return get_outbond_list[i] = { e, type: 2 }
          })
        }

        var all_data = get_inbond_list.concat(get_outbond_list)

        if (all_data.length > 0) {
          all_data = all_data.sort((a, b) => (new Date(b.e.block.timestamp.time).getTime()) - (new Date(a.e.block.timestamp.time).getTime()))

          const slice = all_data.slice(0, 0 + perPage)
          const postData = slice.map((e, i) => {
            return <tr key={i}>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{moment(e.e.block.timestamp.time).format("ll")}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{e.type == 1 ? <div>IN</div> : <div>OUT</div>}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{e.e.currency.symbol}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{separator(parseFloat((e.e.amount).toFixed(6)))}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{separator(parseFloat((e.e.amountInUSD).toFixed(6)))}</a></td>
            </tr>
          })
          setWalletData(postData)
          setWalletsPageCount(all_data.length / perPage)
        }
      })
      .catch(console.error);
  }

  const exchangespagination = (data, offset) => {
    if (data) {
      let slice = data.slice(offset, offset + 10)

      const postData = slice.map((e, i) => {
        return <tr key={i}>
          <td>{e.exchange.fullName}</td>
          <td>{separator(e.trades)}</td>
          <td>{separator(e.takers)}</td>
          <td>{separator(e.makers)}</td>
          <td>{separator(e.amount.toFixed(2))}</td>
        </tr>
      })

      set_exchangelistdata(postData)
    }


  }

  const exchangeshandlePageClick = (e) => {
    setExchangesCurrentPage(e.selected)
    const selectPage = e.selected * 10
    exchangespagination(exchangelist, selectPage)
  }


  const handleClickOutside = event => {
    if (communityRef.current && !communityRef.current.contains(event.target)) {
      set_community_links(false)
    }

    if (explorerRef.current && !explorerRef.current.contains(event.target)) {
      set_explorer_links(false)
    }

    if (contractRef.current && !contractRef.current.contains(event.target)) {
      set_other_contract(false)
    }
  }
  const getexchangedata = async (id, networks) => {
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    let query = ""
    if (networks === "1") {
      query = `
    query {
      ethereum(network: ethereum) {
        dexTrades(
          quoteCurrency: {is: "`+ id + `"}
          options: {desc: ["tradeAmount","trades"] limit: 100}
          date: {after: "`+ dateSince + `"}
        ) {
          poolToken: smartContract {
            address {
              address
            }
          }
          exchange {
            fullName
          }
          pair:baseCurrency {
            symbol
            address
            name
          }
          trades: count
          tradeAmount(in: USD)
        }
      }
    }
        ` ;
    }
    else {
      query = `
    query {
      ethereum(network: bsc) {
        dexTrades(
          quoteCurrency: {is: "`+ id + `"}
          options: {desc: ["tradeAmount","trades"] limit: 100}
          date: {after: "`+ dateSince + `"}
        ) {
          poolToken: smartContract {
            address {
              address
            }
          }
          exchange {
            fullName
          }
          pair:baseCurrency {
            symbol
            address
            name
          }
          trades: count
          tradeAmount(in: USD)
        }
      }
    }
        ` ;
    }

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };

    const resultArray = new Array()
    var response1 = 0
    var pair_two_value_in_Usd = 0
    var pair_one_value_in_usd = 0
    const res = await fetch(graphQlURL, opts)
    const result = await res.json()
    if (result.data.ethereum) {
      var request_API_Status = false
      if (result.data.ethereum.dexTrades) {
        result.data.ethereum.dexTrades.map(async (item, i) => {
          var createObj = {}
          createObj['exchange_name'] = item.exchange.fullName
          createObj['pair_one_name'] = item.pair.name
          createObj['exchange_address'] = item.poolToken.address.address
          createObj['pair_one_token_address'] = item.pair.address
          response1 = await getexchangevalue(item.poolToken.address.address, networks)
          if (response1) {
            response1.map(async (e) => {
              if (item.pair.address == e.currency.address) {
                createObj['pair_one_value'] = e.value
                // console.log("res", res)
                var res = await livePrice(item.pair.address, networks)
                createObj['pair_one_live_price'] = res
                pair_one_value_in_usd = e.value * res

              }
              if (id.toLowerCase() == e.currency.address) {
                createObj['pair_two_value'] = e.value
                pair_two_value_in_Usd = e.value * live_price

              }
              createObj['liquidity_in_pool'] = pair_one_value_in_usd
            })
          }
          await resultArray.push(createObj)
          set_exchange_list_new(resultArray)
          if (networks == 1) {
            var reqObj = {
              contract_address: id,
              network_type: "ethereum",
              exchanges: [createObj]
            }

            const sadfdsf = await Axios.post(API_BASE_URL + "markets/tokens/exchanges_save_data", reqObj, config)


          }
          else {
            var reqObj = {
              contract_address: id,
              network_type: "bsc",
              exchanges: [createObj]
            }
            const sadfdsf = await Axios.post(API_BASE_URL + "markets/tokens/exchanges_save_data", reqObj, config)
          }

        })



      }

    }


  }
  const livePrice = async (id, networks) => {
    const dateSince = ((new Date()).toISOString())
    let query = ""
    if (networks === "1") {

      query = `
    query
    {
      ethereum(network: ethereum) {
        dexTrades(
          date: {since: "` + dateSince + `"}
          any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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
` ;
    }
    else {
      query = `
    query
    {
      ethereum(network: bsc) {
        dexTrades(
          date: {since: "` + dateSince + `"}
          any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
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
` ;
    }

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };
    const res = await fetch(graphQlURL, opts)
    const result = await res.json()

    if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {

      if (id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c") {
        return result.data.ethereum.dexTrades[0].quote
      }
      else {
        if (result.data.ethereum.dexTrades.length == 1) {
          return result.data.ethereum.dexTrades[0].quote
        }
        else if (result.data.ethereum.dexTrades.length == 2) {
          return result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote
        }
        else {
          return 0
        }
      }
    }

  }
  const getexchangevalue = async (pool_token_address, networks) => {
    let query = ""
    if (networks === "1") {
      query = `
    query {
      ethereum(network: ethereum) {
      address(address: {is: "`+ pool_token_address + `"}) {
      balances {
      value
      currency {
      address
      symbol
      tokenType
      }
      }
      }
      }
      }
        ` ;
    }
    else {
      query = `
    query {
      ethereum(network: bsc) {
      address(address: {is: "`+ pool_token_address + `"}) {
      balances {
      value
      currency {
      address
      symbol
      tokenType
      }
      }
      }
      }
      }
        ` ;
    }

    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };
    const res = await fetch(graphQlURL, opts)
    const result = await res.json()
    if (result.data.ethereum) {
      if (result.data.ethereum.address) {
        if (result.data.ethereum.address[0].balances) {
          return result.data.ethereum.address[0].balances
        }
      }
    }

  }


  const getGraphData = async (value) => {
    await set_graph_data_date("")
    await set_graph_data_date(value)
  }
  const myReferrlaLink = () => {
    var copyText = document.getElementById("referral-link");
    copyText.select();
    document.execCommand("Copy");
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied";
  }

  const copyContract = (data, type) => {
    set_contract_copy_status(type)

    var copyText = document.createElement("input")
    copyText.value = data
    document.body.appendChild(copyText)
    copyText.select()
    document.execCommand("Copy")
    copyText.remove()
    // setTimeout(3000)
    setTimeout(() => set_contract_copy_status(""), 3000)
  }

  const LaunchpadDetails = (object) => {
    set_launchpad_row_id(parseInt(object._id))
    set_launchpad_object(object)
  }


  const addToWatchlist = (param_token_id) => 
  {
    Axios.get(API_BASE_URL + "markets/cryptocurrency/add_to_watchlist/" + param_token_id, config).then(res => {
      if (res.data.status) {
        set_watchlist(true)
      }
    })
  }

  const removeFromWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL + "markets/cryptocurrency/remove_from_watchlist/" + param_token_id, config).then(res => {
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

  const vote = (param) => {
    ModalVote()
    setModalData({ icon: "", title: "", content: "" })
    if (param == 1) {
      Axios.get(API_BASE_URL + "markets/listing_tokens/save_voting_details/" + data.token_id, config).then(res => {
        if (res.data.status === true) {
          set_votes(votes + 1)
          set_voting_status(true)
          setModalData({ icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message })
        }
      })
    }
    else {
      Axios.get(API_BASE_URL + "markets/listing_tokens/remove_voting_details/" + data.token_id, config).then(res => {
        if (res.data.status === true) {
          set_votes(votes - 1)
          set_voting_status(false)
          setModalData({ icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message })
        }
      })
    }
  }

  
  
  // https://coinpedia.org/wp-json/wp/v2/posts/?_fields=id,title,featured_image_sizes,author,yoast_head_json,date,tag_names,tags&categories=6&per_page=20&offset=0
//   const Categories=(e)=>{
// set_category_modal(true)
// set_categories(e)
//   }

  return (
    <>
      <Head>
        <title>{data.token_name.toUpperCase()+"("+data.symbol+") Live Price"}</title>
        <meta name="description" content={data.meta_description} />
        <meta name="keywords" content={data.meta_keywords} />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={data.token_name.toUpperCase() + " (" + data.symbol + ")  Live Price" + "  | Coinpedia Market"} />
        <meta property="og:url" content={market_coinpedia_url + data.token_id} />
        <meta property="og:description" content={data.meta_description} />

        <meta property="og:site_name" content={data.token_name.toUpperCase() + " (" + data.symbol + ")  Live Price" + "  | Coinpedia Market"} />
        <meta property="og:image" itemprop="thumbnailUrl" content={image_base_url + data.token_image} />
        <meta property="og:image:secure_url" content={image_base_url + data.token_image} />
        <meta property="og:image:width" content="100" />
        <meta property="og:image:height" content="100" />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:description" content={data.meta_description} />

        <meta name="twitter:title" content={data.token_name.toUpperCase() + " (" + data.symbol + ")  Live Price" + "  | Coinpedia Market"} />
        <meta name="twitter:image" content={image_base_url + data.token_image} />
        <link rel="canonical" href={market_coinpedia_url + data.token_id} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} />
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
                          <img src={image_base_url+(data.coinmarketcap_id ? data.coinmarketcap_id+".png" : "default.png")} onError={(e) => e.target.src = "/assets/img/default_token.png"} className="token_img" alt="logo" width="100%" height="100%" />
                          </div>
                        
                          <div className="media-body align-self-center">
                            <h4 className="media-heading">{data.token_name ? data.token_name : "-"} &nbsp; <span> ({data.symbol ? (data.symbol).toUpperCase() : "-"})</span> 
                              {/* <span><img src="/assets/img/watchlist_token.svg" /></span> */}
                              
                            </h4>
                            <p>Permissionless and non-custodial middleware</p>
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
                            {/* <p>Permissionless and non-custodial middleware</p>
                            <h6>
                            {
                              market_cap_rank ?
                                
                                      <a className="">
                                        {
                                          market_cap_rank != null ?
                                            <span>{market_cap_rank ? "Rank" + "#" + market_cap_rank : null}</span>
                                            :
                                            null
                                        }
                                      </a>
                                :
                                null
                            }
                               <span> &nbsp; <img src="/assets/img/grey_arrow_up.svg" /></span></h6> */}


                            
                            {/* {
                              watchlist_count > 0 ?
                              <h5><span>{watchlist_count ? "Token has " + watchlist_count + (watchlist_count > 1 ? " watchlists" : " watchlist" ) : "-"}</span></h5>
                              :
                              null
                            } */}

                          </div>
                        </div>
                        

                  </div>
                </div>

                <div className="col-lg-3 col-xl-3 col-md-6 order-md-2 order-3">
                        <div className="token_price_block airdrop_data_content">
                          <h5>
                            {live_price > 0 ? roundNumericValue(live_price) : "NA"}
                          </h5>
                          <h6>
                           {roundNumericValue((data.percent_change_24h*live_price)/100)}
                           &nbsp; <span className='timings_price'> &nbsp;&nbsp;24 Hrs</span> <span>{
                              live_price ?
                              data.percent_change_24h
                                  ?
                                  data.percent_change_24h > 0
                                    ?
                                    <span className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />{(data.percent_change_24h).toFixed(2)}%</span></span>
                                    :
                                     <span className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" />{(data.percent_change_24h).toPrecision(3)}%</span></span>
                                  :
                                  null
                                :
                                null
                            }</span> </h6>
{ /*************************************Airdrop section *********************************/ }


                          {/* <div className='airdrop_name'><span></span>Airdrop Live</div>
                          <h6>$ 250 /  Participant </h6> */}


{/* /*************************************Airdrop section *********************************/ }



                            {/*  </h6> */}
                            {/* &nbsp; 0.000145 <span className='symbol_token'>{data.symbol ? (data.symbol).toUpperCase() : "-"}</span></h6> */}

                          {/* <p>{data.token_name ? data.token_name : "-"} Price()</p> */}
                        </div>
                      </div>

                      <div className="col-lg-3 col-xl-3 col-md-6 order-md-3 order-1 ">
                  <div className="row">
                    <div className="col-md-12 ">
                      {
                        <Search_Contract_Address />
                      }

                     


                    </div>
                    {/* <div className="col-md-12">
                      {
                        parseInt(data.list_type) !== 2 ?
                          ""
                          :
                          ((data.contract_addresses) && (data.contract_addresses.length > 0))
                            ?
                            <div className="wallets__inner contract_address">
                              <div className="wallets__details">

                                <span className="token-contract-details h5">
                                  {
                                    data.contract_addresses.length > 1
                                      ?
                                      parseInt(data.contract_addresses[0].network_type) === 1
                                        ?
                                        <>
                                          <a href={"https://etherscan.io/token/" + data.contract_addresses[0].contract_address} target="_blank">
                                            <span >
                                              <img className="token_dropdown_img" src="/assets/img/ETH.svg" alt="Ethereum"></img>
                                              Ethereum : {(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                                            </span>
                                          </a>&nbsp;
                                          <img onClick={() => { copyContract(data.contract_addresses[0].contract_address, 'ETH') }} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                          <img src="/assets/img/down-arrow.png" ref={contractRef} onClick={() => set_other_contract(!other_contract)} className="dropdown_arrow_img" />
                                          {
                                            other_contract
                                              ?
                                              <div className="dropdown_block">
                                                <div className="media">
                                                  <img src="/assets/img/binance.svg" alt="Binance" className="token_dropdown_img" />
                                                  <div className="media-body">
                                                    <p className="wallets__info">Binance smart chain</p>
                                                    <p><a href={"https://bscscan.com/token/" + data.contract_addresses[1].contract_address} target="_blank"> <img className="token_dropdown_img" src="/assets/img/BSC.svg"></img> {(data.contract_addresses[1].contract_address).slice(0, 4) + "..." + (data.contract_addresses[1].contract_address).slice(data.contract_addresses[1].contract_address.length - 4, data.contract_addresses[1].contract_address.length)}
                                                    </a>
                                                      &nbsp;
                                                      {
                                                        contract_copy_status === 'BNB' ?
                                                          <span>Copied</span>
                                                          :
                                                          <img onClick={() => copyContract(data.contract_addresses[1].contract_address, 'BNB')} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              :
                                              null
                                          }
                                        </>
                                        :
                                        parseInt(data.contract_addresses[0].network_type) === 2
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
                                      data.contract_addresses[0].network_type === 1
                                        ?
                                        <span className="wallet_address_token" onClick={() => set_other_contract(!other_contract)}>
                                          <a href={"https://etherscan.io/token/" + data.contract_addresses[0].contract_address} target="_blank">
                                            <img className="token_dropdown_img" src="/assets/img/ETH.svg"></img> Ethereum : {(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                                          </a>
                                          <img onClick={() => copyContract(data.contract_addresses[0].contract_address, "ETH")} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                        </span>
                                        :
                                        <span className="wallet_address_token" onClick={() => set_other_contract(!other_contract)}>
                                          <a href={"https://bscscan.com/token/" + data.contract_addresses[0].contract_address} target="_blank"><img className="token_dropdown_img" src="/assets/img/BSC.svg"></img> Binance Smart Chain : {(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                                          </a>
                                          <img onClick={() => copyContract(data.contract_addresses[0].contract_address, 'BNB')} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                        </span>
                                  }
                                </span>
                              </div>
                            </div>
                            :
                            null
                      }
                      {
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
                      }
                    </div> */}

                  </div>
                </div>
              </div>
              <div className='row token_header_cols'>
                <div className="col-lg-4 col-xl-4 col-md-12 pr-0">
                <ul className="token_share_vote">
                  {/* <li className='airdrop_name'><span></span>Airdrop Live</li> */}
                  <li>#{data.cmc_rank} Rank</li>
                        {
                          user_token
                            ?
                            <>
                              {
                                voting_status == false ?
                                  <li onClick={() => ModalVote()} style={{ cursor: "pointer" }}><img src="/assets/img/coin_vote.svg" />&nbsp; {votes}</li>
                                  :
                                  <li onClick={() => ModalVote()} style={{ cursor: "pointer" }}><img src="/assets/img/coin_vote.svg" />&nbsp; {votes}</li>
                              }
                            </>
                            :
                            <li style={{ cursor: "pointer" }} >
                              <Link href={app_coinpedia_url + "login?prev_url=" + market_coinpedia_url + data.token_id} >
                                <img src="/assets/img/coin_vote.svg" /> {votes}
                              </Link>
                            </li>
                        }
                        {/* <li>{data.list_type == 1 ? "Coin" : "Token"}</li> */}
                        <li onClick={() => set_share_modal_status(true)} style={{ cursor: "pointer" }}><img src="/assets/img/coin_share.svg" /> Share</li>
                        <li>
                        {
                                user_token ?
                                  <>
                                    {
                                      watchlist == true ?
                                        <span onClick={() => removeFromWatchlist(data._id)} ><img src="/assets/img/watchlist_filled.svg" style={{width:"18px"}} /></span>
                                        :
                                        <span onClick={() => addToWatchlist(data._id)} ><img src="/assets/img/watchlist_outline.svg " style={{width:"18px"}} /></span>
                                    }
                                  </>
                                  :
                                  <Link href={app_coinpedia_url + "login?prev_url=" + market_coinpedia_url + data.token_id} >
                                    <img src="/assets/img/watchlist_outline.svg"  style={{width:"18px"}} />
                                  </Link>
                              }
                        </li>
                      </ul>
                </div>
                <div className="col-lg-8 col-xl-8 col-md-12 padding_null">
                  <ul className='d-flex token_list_data'>

                  <li>
                <div className="token_list_content">
                                <h4>Market Cap :  &nbsp;{circulating_supply > 0 ?
                                <span>
                                {
                                   "$ "+separator(((circulating_supply*live_price)).toFixed(0))
                                }
                                 
                                </span>
                                 : "NA"} <span onClick={() => change(1)}><img src='/assets/img/info.png'  />
                                </span>
                                
                                {/* {market_cap_change_percentage_24h ?
                                  market_cap_change_percentage_24h > 0 ?
                                    <span className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />{market_cap_change_percentage_24h.toFixed(2) + "%"}</span></span>
                                    :
                                    <span className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" />{market_cap_change_percentage_24h.toFixed(2) + "%"}</span></span>
                                  :
                                  <span className="values_growth"></span>
                                } */}
                                </h4>
                              </div>
                              </li>
                <li>
                <div className="token_list_content">
                                <h4>Volume :  &nbsp;
                                <span>
                                {volume > 0 ? "$ "+separator((volume).toFixed(0)) : "NA"}
                                </span><span onClick={() => change(5)}><img src='/assets/img/info.png'  /></span>
                                
                                <span className="values_growth"></span>
                                </h4>
                              </div>
                              </li>
                <li>
                <div className="token_list_content">
                                <h4>Circulating Supply :  &nbsp;
                                <span>{circulating_supply ? 
                                <>
                                {separator((circulating_supply).toFixed(0))+" "+(symbol).toUpperCase()}
                                </>
                                
                                : "NA"} </span> <span onClick={() => change(3)}><img src='/assets/img/info.png' /></span>
                                

                                {/* <span className="values_growth"><span className="normal">{circulating_supply ? ((circulating_supply / max_supply) * 100).toFixed(2) + "%" : null}</span></span> */}
                                </h4>
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
                      <div className="col-md-5">
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
                                    <div className="widgets__select links_direct"><a href={createValidURL(data.website_link)} target="_blank"> <img src="/assets/img/website.svg" className="coin_cat_img" />Website</a></div>
                                  </div>
                                </li>
                            }
                            {
                              data.whitepaper
                                ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a href={createValidURL(data.whitepaper)} target="_blank"> <img src="/assets/img/whitepaper.svg" className="coin_cat_img" /> White paper </a></div>
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
                              data.explorer != "" ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" ref={explorerRef} onClick={() => { set_explorer_links(!explorer_links) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Explorer <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> </a></div>
                                  </div>
                                  {
                                    explorer_links ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                            data.explorer?
                                            data.explorer.map((e, i) => {
                                              var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                              let url = ""
                                              if (e != "") {
                                                if (regexp.test(e)) {
                                                  url = new URL(e)
                                                }
                                                else {
                                                  e = "http://" + e
                                                  url = new URL(e)
                                                }
                                                return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).includes("t.me") ? url.hostname : null}{(url.hostname).indexOf(".") !== -1 ? (url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>
                                              }
                                            })
                                            :""
                                          }
                                        </ul>
                                      </div>
                                      :
                                      null
                                  }
                                </li>
                                :
                                // <li className="coin_individual_list">
                                //   <div className="quick_block_links">
                                //     <div className="widgets__select links_direct" > <a className="" data-toggle="modal" data-target="#linksData" onClick={()=> {set_no_data_link("Explorer Not Avaliable")}} ><img src="/assets/img/explorer.svg" className="coin_cat_img" />Explorer <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /></a></div>
                                //   </div>
                                // </li>
                                null
                            }

                            
                        {
                          ((data.contract_addresses))
                            ?
                            <>
                            <li className="coin_individual_list">
                                <div className="quick_block_links">
                                <div className="widgets__select links_direct">
                                  <a>
                                  
                                    
                                   
                                  {

                                    data.contract_addresses.length > 1
                                      ?
                                      parseInt(data.contract_addresses[0].network_type) === 1
                                        ?
                                        <>
                                          <a href={"https://etherscan.io/token/" + data.contract_addresses[0].contract_address} target="_blank">
                                            <span >
                                              <img className="token_dropdown_img" src="/assets/img/ETH.svg" alt="Ethereum"></img>
                                              Ethereum : {(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                                            </span>
                                          </a>&nbsp;
                                          <img onClick={() => { copyContract(data.contract_addresses[0].contract_address, 'ETH') }} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                          <img src="/assets/img/down-arrow.png" ref={contractRef} onClick={() => set_other_contract(!other_contract)} className="dropdown_arrow_img" />
                                          {
                                            other_contract
                                              ?
                                              <div className="dropdown_block">
                                                <div className="media">
                                                  <img src="/assets/img/binance.svg" alt="Binance" className="token_dropdown_img" />
                                                  <div className="media-body">
                                                    <p className="wallets__info">Binance smart chain</p>
                                                    <p><a href={"https://bscscan.com/token/" + data.contract_addresses[1].contract_address} target="_blank"> <img className="token_dropdown_img" src="/assets/img/BSC.svg"></img> {(data.contract_addresses[1].contract_address).slice(0, 4) + "..." + (data.contract_addresses[1].contract_address).slice(data.contract_addresses[1].contract_address.length - 4, data.contract_addresses[1].contract_address.length)}
                                                    </a>
                                                      &nbsp;
                                                      {
                                                        contract_copy_status === 'BNB' ?
                                                          <span>Copied</span>
                                                          :
                                                          <img onClick={() => copyContract(data.contract_addresses[1].contract_address, 'BNB')} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              :
                                              null
                                          }
                                        </>
                                        :
                                        parseInt(data.contract_addresses[0].network_type) === 2
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
                                      data.contract_addresses[0].network_type === 1
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
                                          {/* <img onClick={() => copyContract(data.contract_addresses[0]?.contract_address, 'BNB')} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" /> */}
                                        </span>
                                  }
                                  </a>
                                </div>
                                </div>
                              </li>

                              {
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
                                  }

                                </>
                            :
                            null
                      }
                      
                      
                              

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
                                    <div className="widgets__select links_direct"><a href={createValidURL(data.source_code_link)} target="_blank"><img src="/assets/img/source_code.svg" className="coin_cat_img" /> Source Code </a></div>
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
                              data.community_address != "" ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" ref={communityRef} onClick={() => { set_community_links(!community_links) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Community <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /></a></div>
                                  </div>
                                  {
                                    community_links
                                      ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                             data.community_address?
                                            data.community_address.map((e, i) => {
                                              var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                              let url = ""
                                              if (e != "") {
                                                if (regexp.test(e)) {
                                                  url = new URL(e)
                                                }
                                                else {
                                                  e = "http://" + e
                                                  url = new URL(e)
                                                }
                                                return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).includes("t.me") ? url.hostname : null}{(url.hostname).indexOf(".") !== -1 ? (url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>


                                              }
                                            })
                                            :""
                                          }
                                        </ul>
                                      </div>

                                      :
                                      null
                                  }
                                </li>
                                :
                                // <li className="coin_individual_list">
                                //   <div className="quick_block_links">
                                //     <div className="widgets__select links_direct" ><a className="" data-toggle="modal" data-target="#linksData" onClick={()=> {set_no_data_link("Community address is not avaliable")}} ><img src="/assets/img/explorer.svg" className="coin_cat_img" />Community <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> </a></div>
                                //   </div>
                                // </li>
                                null
                            }

                          
                           

                            

                            {
                              data.exchange_link ?
                                data.exchange_link.length > 0 && data.exchange_link[0] != "" ?
                                  <li className="coin_individual_list">
                                    <div className="quick_block_links">
                                      <div className="widgets__select links_direct" onClick={() => { set_show_exchange_links(!show_exchange_links) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Exchanges  <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> </a></div>
                                    </div>
                                    {
                                      show_exchange_links
                                        ?
                                        <div className="dropdown_block badge_dropdown_block">
                                          <ul>
                                            {
                                              data.exchange_link.map((e, i) => {
                                                var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                                let url = ""
                                                if (e != "") {
                                                  if (regexp.test(e)) {
                                                    url = new URL(e)
                                                  }
                                                  else {
                                                    e = "http://" + e
                                                    url = new URL(e)
                                                  }
                                                  return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).includes("t.me") ? url.hostname : null}{(url.hostname).indexOf(".") !== -1 ? (url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>


                                                }
                                              })
                                            }
                                          </ul>
                                        </div>
                                        :
                                        null
                                    }
                                  </li>
                                  :
                                  // <li className="coin_individual_list">
                                  //   <div className="quick_block_links">
                                  //     <div className="widgets__select links_direct" ><a className="" data-toggle="modal" data-target="#linksData" onClick={()=> {set_no_data_link("Exchanges is not avaliable")}} ><img src="/assets/img/explorer.svg" className="coin_cat_img" />Exchanges<img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /></a></div>
                                  //   </div>
                                  // </li>
                                  null
                                :
                                null
                            }
                            
                            {
                              ((data.category_row_id_array) && (data.category_row_id_array.length > 0)) ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" onClick={() => { set_category_list(!category_list) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Category <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /></a></div>
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

                            
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <div className="row">
                        <div className="col-md-4 col-12">
                         
                            <div className="token_left_border">
                              <div className='row'>
                            <div className='col-md-12 col-6'>
                            <div className="token_list_values">
                                <h4>Max Supply:  &nbsp;</h4>
                                <h5>{max_supply ? separator(max_supply) : data.total_max_supply ? separator(data.total_max_supply.toFixed(4)) : "NA"} &nbsp;<span onClick={() => change(4)}><img src='/assets/img/info.png'  /></span></h5>
                              </div>
                            </div>
                              
                              <div className='col-md-12 col-6'>
                              <div className="token_list_values">
                                <h4>Total Supply: &nbsp;</h4>
                                <h5>{data.total_supply ? separator(data.total_supply.toFixed(2)) : "NA"}</h5>
                              </div>
                            </div>
                            </div>

                             
                            </div>
                          </div>
                          <div className="col-md-4 col-12">
                            <div className="token_left_border">
                            <div className='row'>
                            <div className='col-md-12 col-6'>
                            <div className="token_list_values">
                                <h4>1 hour % change: &nbsp;</h4>
                                {
                                  data.percent_change_1h?data.percent_change_1h>0?
                                  <h5 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{data.percent_change_1h.toFixed(2)+"%"}</span></h5>
                                  :
                                  <h5 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(data.percent_change_1h.toFixed(2)).replace('-', '')+"%"}</span></h5>
                                  :
                                  "--"
                                }
                              </div>
                              </div>
                              <div className='col-md-12 col-6'>
                              <div className="token_list_values">
                                <h4>7 days % change: &nbsp;</h4>
                                {
                                  data.percent_change_7d?data.percent_change_7d>0?
                                  <h5 className="values_growth"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{data.percent_change_7d.toFixed(2)+"%"}</span></h5>
                                  :
                                  <h5 className="values_growth"><span className="red"><img src="/assets/img/markets/low.png" alt="high price"/>{(data.percent_change_7d.toFixed(2)).replace('-', '')+"%"}</span></h5>
                                  :
                                  "--"
                                }
                              </div>
                              </div>
                              </div>
                              

                             
                              
                              {/* <div className="token_list_values">
                                <h4>Liquidity <span onClick={() => change(6)}><img src='/assets/img/info.png'  /></span></h4>
                                <h5>{liquidity ? "$" : null}{liquidity ? separator(liquidity.toFixed(4)) : "NA"}</h5>
                              </div> */}

                            </div>
                          </div>
                          
                          <div className="col-md-4 col-12">
                            <div className="token_left_border">
                            <div className='row'>
                            <div className='col-md-12 col-6'>
                            <div className="token_list_values">
                                <h4>24h Time High: &nbsp;</h4>
                                <h5>
                                  {data.high_price ? '$ '+separator(data.high_price) : 'NA'} &nbsp;
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
                              <div className='col-md-12 col-6'>
                              <div className="token_list_values">
                                    <h4>24h Time Low: &nbsp;</h4>
                                    <h5>{data.low_price ? '$ '+separator(data.low_price) : 'NA'} &nbsp;
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
                              </div>
                             
                            
                            
                           

                             

                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="market_token_tabs">
                  




                    <div className="row">                    
                      <div className="col-md-12 col-sm-12 col-12 col-lg-8 col-xl-8">
                        <div className='token_details_tabs_row'>
                      <ul className="nav nav-tabs">
                      <li className="nav-item">
                                  <a className="nav-link active" data-toggle="tab" href="#charts" ><span>Chart</span></a>
                                </li>

                                <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#airdrop_details" ><span>Airdrop</span></a>
                                </li>
                                <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#ico_details" ><span>ICO</span></a>
                                </li>

                                
                                <li className="nav-item" >
                                  {/* {
                                    api_from_type == 0 ?
                                      <a className="nav-link" data-toggle="tab" href="#home" onClick={() => getexchangedata(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)}><span>Exchange</span></a>
                                      : */}
                                      <a className="nav-link" data-toggle="tab" href="#home" onClick={() => exchangecoingecko()} ><span>Exchange</span></a>
                                  {/* }  */}
                                </li>
                                <li className="nav-item" >
                                  {
                                    api_from_type == 0 ?
                                      <a className="nav-link" data-toggle="tab" href="#menu1" onClick={() => getTokenTransactions(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)} ><span>Transactions</span></a>
                                      :
                                      null
                                  }
                                </li>

                                {/* <li className="nav-item" >
                                      <a className="nav-link" data-toggle="tab" href="#about"><span>About</span></a>
                                      
                                </li> */}
                                {/* <li className="nav-item" >
                                      <a className="nav-link" data-toggle="tab" href="#team"><span>Team</span></a>
                                      
                                </li>
                                <li className="nav-item" >
                                      <a className="nav-link" data-toggle="tab" href="#partners"><span>Partners</span></a>
                                      
                                </li> */}


                                <li className="nav-item" >
                                      <a className="nav-link" data-toggle="tab" href="#priceanalysis"><span>Price Analysis</span></a>
                                </li>
                                <li className="nav-item" >
                                      <a className="nav-link" data-toggle="tab" href="#priceprediction"><span>Price Prediction</span></a>
                                      
                                </li>
                                <li className="nav-item" >
                                      <a className="nav-link" data-toggle="tab" href="#indicators"><span>Indicators</span></a>
                                      
                                </li>
                                <li className="nav-item" >
                                      <a className="nav-link" data-toggle="tab" href="#tokenomics"><span>Tokenomics</span></a>
                                      
                                </li>
                              
                              </ul></div>
                      <div className='charts_tables_content'>
                        
                  <div className="token_details_tabs">
                    <div className="tab-content">
                      <div id="charts" className="tab-pane fade show in active">
                        <div className='tokendetail_charts'>
                        {/* {
                            graph_data_date ?
                            <Graph_Data reqData={data} graph_data_date={graph_data_date} />
                            :
                            ""
                          } */}
                          
                          <div className='row'>
                            <div className='col-md-6 col-6'>
                            {/* <h5 className='price_chart'>{(symbol).toUpperCase()} Price Chart</h5> */}
                            <div className='charts_date_tab float-left charts_price_tabs'>
                                <ul className="nav nav-tabs">
                                        <li className="nav-item" >
                                            <a className={chart_tab==1?"nav-link active":"nav-link"} onClick={()=>set_chart_tab(1)}  data-toggle="tab"><span>Price</span></a>
                                        </li>
                                        <li className="nav-item" >
                                            <a className={chart_tab==2?"nav-link active":"nav-link"} onClick={()=>set_chart_tab(2)} data-toggle="tab"><span>Market Cap</span></a>
                                        </li>
                                </ul>
                            </div>
                            </div>
                            <div className='col-md-6 col-6'>
                            <div className='charts_date_tab'>
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
                            </div>
                        </div>
    
                           {
                            time_name ? 
                            chart_tab==1?
                            <Token_chart reqData={{symbol:symbol.toLowerCase(), time_name, intervals, count,chart_tab}} />
                            :
                            <MarketCapChart reqData={{symbol:symbol.toLowerCase(), time_name, intervals, count,chart_tab}} />
                            :
                            ""
                           }         
                          

                          {
                            graph_data_date ?
                            <Chart reqData={data} graph_data_date={graph_data_date} />
                            :
                            ""
                          }
                          </div>
                      </div>


                      <div id="home" className="tab-pane fade">
                        <Exchanges_list token_id={data.token_id} crypto_type={1}/>

                        {/* <h4 className='tabs_title_token'>Exchange</h4>
                        <div className="table-responsive">
                          <table className="table table-borderless">
                            <thead>
                              {
                                parseInt(api_from_type) === 1 ?
                                  <tr>
                                    <th>Source</th>
                                    <th>Pairs</th>
                                    <th>Price </th>
                                    <th>Volume %</th>
                                    <th>Volume</th>
                                    <th>Last Traded</th>
                                    <th>Trust Score</th>
                                  </tr>
                                  :
                                  <tr>
                                    <th>Exchange</th>
                                    <th>Pairs</th>
                                    <th>Liquidity in Pool</th>
                                    <th>Trades Count</th>
                                    <th>Takers</th>
                                    <th>Makers</th>
                                    <th>Amount</th>
                                  </tr>
                              }
                            </thead>
                            {
                              parseInt(api_from_type) === 1 ?
                                <tbody>
                                  {
                                    exchange_list_new.map((e, i) => {
                                      return <tr key={i}>
                                        <td >{e.exchange_name}</td>
                                        <td >{e.pair_one_name} / {e.pair_two_name}</td>

                                        <td>{e.price ? "$" + e.price : "--"}</td>
                                        <td>{e.volume_percentage ? e.volume_percentage.toFixed(2) + "%" : "--"}</td>
                                        <td>{e.volume ? "$" + e.volume.toFixed(2) : "--"}</td>
                                        <td>{moment(e.last_traded_at).fromNow()}</td>
                                        <td>{e.trust_score ? e.trust_score : "--"}</td>
                                      </tr>
                                    })
                                  }
                                </tbody>
                                :
                                <tbody>
                                  {
                                    exchange_list_new.length > 0
                                      ?
                                      exchange_list_new.map((e, i) => {
                                        return <tr key={i}>
                                          <td title={e.exchange_address}>{e.exchange_name}</td>
                                          <td title={e.pair_one_token_address}>{e.pair_one_name} / {symbol}<br /><span className="pooledvalue">({e.pair_one_value ? separator(e.pair_one_value.toFixed(3)) : null}) / ({e.pair_two_value ? separator((e.pair_two_value).toFixed(3)) : null})</span> </td>
                                          {
                                            e.pair_one_token_address == "0x3ff997eaea488a082fb7efc8e6b9951990d0c3ab" ?
                                              "--"
                                              : <td>${separator(e.liquidity_in_pool + (e.pair_two_value * live_price))} </td>
                                          }
                                          <td>--</td>
                                          <td>--</td>
                                          <td>--</td>
                                          <td>--</td>
                                        </tr>
                                      })
                                      :
                                      <tr>
                                        <td colSpan="7"><h5 className="text-lg-center text-md-left no_data_found">No data found</h5></td>
                                      </tr>
                                  }
                                </tbody>
                            }
                          </table>
                        </div>
                        {
                          exchangelist.length > 10
                            ?
                            <div className="pager__list pagination_element">
                              <ReactPaginate
                                previousLabel={exchangesCurrentPage + 1 !== 1 ? "<-previous" : ""}
                                nextLabel={exchangesCurrentPage + 1 !== exchangesPageCount ? "Next->" : ""}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                forcePage={exchangesCurrentPage}
                                pageCount={exchangesPageCount}
                                marginPagesDisplayed={2}
                                onPageChange={exchangeshandlePageClick}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"} />
                            </div>
                            :
                            null
                        } */}
                      </div>
                      <div id="menu1" className="tab-pane fade in">
                        <h4 className='tabs_title_token'>Transactions</h4>
                        <div className="table-responsive">
                          <table className="table table-borderless">
                            <thead>
                              <tr>
                                <th>Traded</th>
                                <th>Date</th>
                                <th className="market_trades_count">Token Price</th>
                                <th>Value</th>
                                <th>DEX</th>
                              </tr>
                            </thead>
                            <tbody>
                              {
                                tokentransactionsData.length > 0
                                  ?
                                  tokentransactionsData
                                  :
                                  <tr>
                                    <td colSpan="5"><h5 className="text-lg-center text-md-left no_data_found">No data found</h5></td>
                                  </tr>
                              }
                            </tbody>
                          </table>
                        </div>
                        {
                          tokentransactions ?
                            tokentransactions.length > 10
                              ?
                              <div className="pager__list pagination_element">
                                <ReactPaginate
                                  previousLabel={tokentransactionsCurrentPage + 1 !== 1 ? "Previous" : ""}
                                  nextLabel={tokentransactionsCurrentPage + 1 !== tokentransactionsPageCount ? "Next" : ""}
                                  breakLabel={"..."}
                                  breakClassName={"break-me"}
                                  forcePage={tokentransactionsCurrentPage}
                                  pageCount={tokentransactionsPageCount}
                                  marginPagesDisplayed={2}
                                  onPageChange={tokenTrasactionshandlePageClick}
                                  containerClassName={"pagination"}
                                  subContainerClassName={"pages pagination"}
                                  activeClassName={"active"} />
                              </div>
                              :
                              null
                            :
                            null
                        }
                      </div>
                     

                      <div id="team" className="tab-pane fade">
                      <div className='team_detail_token'>
                    <h4 className='tabs_title_token'>Teams</h4>
                    <div className='row'>
                      <div className='col-sm-6 col-md-6 col-lg-2 col-xl-3'>
                        <div className='text-center'>
                          <img src="/assets/img/team1.svg" />
                          <h6>Aeneous Aero</h6>
                          <p>Designer</p>
                        </div>
                      </div>
                      <div className='col-sm-6 col-md-6 col-lg-2 col-xl-3'>
                        <div className='text-center'>
                          <img src="/assets/img/team1.svg" />
                          <h6>Aeneous Aero</h6>
                          <p>Designer</p>
                        </div>
                      </div>
                      <div className='col-sm-6 col-md-6 col-lg-2 col-xl-3'>
                        <div className='text-center'>
                          <img src="/assets/img/team1.svg" />
                          <h6>Aeneous Aero</h6>
                          <p>Designer</p>
                        </div>
                      </div>
                      <div className='col-sm-6 col-md-6 col-lg-2 col-xl-3'>
                        <div className='text-center'>
                          <img src="/assets/img/team1.svg" />
                          <h6>Aeneous Aero</h6>
                          <p>Designer</p>
                        </div>
                      </div>
                    </div>
                  </div>
                      </div>

                      <div id="partners" className="tab-pane fade">
                      <div className='partner_detail_token'>
                    <h4 className='tabs_title_token'>Partners</h4>
                    <div className='row'>
                      <div className='col-sm-6 col-md-6 col-lg-3'>
                        <div className='text-center'>
                          <img src="/assets/img/partner1.svg" />
                        </div>
                      </div>
                      <div className='col-sm-6 col-md-6 col-lg-3'>
                        <div className='text-center'>
                          <img src="/assets/img/partner2.svg" />
                        </div>
                      </div>
                      <div className='col-sm-6 col-md-6 col-lg-3'>
                        <div className='text-center'>
                          <img src="/assets/img/partner3.svg" />
                        </div>
                      </div>
                    </div>
                  </div>
                      </div>

                      <div id="priceanalysis" className="tab-pane fade">
                      <Price_analysis/> 
                      </div>


                      <div id="priceprediction" className="tab-pane fade">
                      <Price_prediction/>
                      </div>
                      <div id="indicators" className="tab-pane fade">
                        <div className='tokendetail_charts'>
                      <h5 className='text-center'>Coming Soon</h5>
                      </div>
                      </div>

                      <div id="tokenomics" className="tab-pane fade">
                      <Tokenomics/>
                      </div>

                      <div id="airdrop_details"  className="tab-pane fade">
                        <Airdrop_detail/>
                        </div>
                        <div id="ico_details"  className="tab-pane fade">
                        <Ico_detail/>
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
                                  
                                  <li className="nav-item" >
                                        <a className="nav-link" data-toggle="tab" href="#airdrop"><span>Airdrop</span></a>
                                        
                                  </li>
                                  </ul>
                                  </div>
                    
                     

                      <div className="tab-content">

                      <div id="news" className="tab-pane fade show in active ">
                          <News/>
                      </div>


                      <div id="events" className="tab-pane fade in">
                      <Events/>
                        </div>
                        

                      <div id="airdrop" className="airdrop_tab_content tab-pane fade  in ">
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

                    <div dangerouslySetInnerHTML={{ __html: data.token_description }}></div>

                  </div>

                  <div className="how_do_you_feel">
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

                  {
                    data.launch_pads_data.length > 0 ?
                      <div className="coin_ico_list">
                        <h4>List of ongoing, upcoming and completed launchpads</h4>
                        <p>Walk through the early and whitelisted launches of new cryptos and NFT's offerings.</p>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="token_launchpad_list">
                              {
                                data.launch_pads_data.map((e, i) =>
                                  // <div className="col-md-12 launchpad_list_content  active_launchpad">
                                  <div className={"col-md-12 launchpad_list_content " + (launchpad_row_id == e._id ? " active_launchpad" : "")}>
                                    <div className="row">
                                      <div className="col-md-4 col-4">
                                        <h5>{e.launch_pad_type == 1 ? "ICO" : e.launch_pad_type == 2 ? "IDO" : e.launch_pad_type == 3 ? "IEO" : null}
                                          &nbsp;
                                          {
                                            moment(today_date).isBefore(moment(e.start_date).format('ll')) ?
                                              <span className="launchpad_upcoming">Upcoming</span>
                                              :
                                              moment(today_date).isAfter(moment(e.start_date).format('ll')) && moment(today_date).isBefore(e.end_date) ?
                                                <span className="launchpad_upcoming">Ongoing</span>
                                                :
                                                moment(moment(e.end_date).format('ll')).isSame(today_date) || moment(moment(e.start_date).format('ll')).isSame(today_date)
                                                  ?
                                                  <span className="launchpad_upcoming">Ongoing</span>
                                                  :
                                                  moment(moment(e.end_date).format('ll')).isBefore(today_date) ?
                                                    <span className="launchpad_completed">Completed</span>
                                                    :
                                                    null
                                          }
                                        </h5>
                                      </div>
                                      <div className="col-md-6 col-6">
                                        <h5 className="res-launchpad"><img src="/assets/img/launchpad_calender.svg" />&nbsp;
                                          {moment.utc(e.start_date).format("MMM DD")} - {moment.utc(e.end_date).format("MMM DD, YYYY")}
                                        </h5>
                                      </div>
                                      <div className="col-md-2 col-2">
                                        {
                                          launchpad_row_id == e._id ?
                                            <img src="/assets/img/launchpad-active.svg" className="active_launchpad_list_icon" />
                                            :
                                            <img src="/assets/img/launchpad.svg" className="launchpad_list_icon" onClick={() => LaunchpadDetails(e)} />
                                        }
                                      </div>
                                    </div>
                                  </div>
                                )}



                            </div>
                          </div>
                          <div className="col-md-6 ">
                            <div className="token_launchpad_details">
                              {
                                launchpad_object ?
                                  <>
                                    <h5>{data.token_name ? data.token_name : "-"} {data.symbol ? "(" + (data.symbol).toUpperCase() + ")" : "-"}
                                      {launchpad_object.launch_pad_type == 1 ? " ICO" : launchpad_object.launch_pad_type == 2 ? " IDO" : launchpad_object.launch_pad_type == 3 ? " IEO" : null}
                                      {
                                        moment(today_date).isBefore(moment(launchpad_object.start_date).format('ll')) ?
                                          " Upcoming"
                                          :
                                          moment(today_date).isAfter(moment(launchpad_object.start_date).format('ll')) && moment(today_date).isBefore(launchpad_object.end_date) ?
                                            " Ongoing"
                                            :
                                            moment(moment(launchpad_object.end_date).format('ll')).isSame(today_date) || moment(moment(launchpad_object.start_date).format('ll')).isSame(today_date)
                                              ?
                                              " Ongoing"
                                              :
                                              moment(moment(launchpad_object.end_date).format('ll')).isBefore(today_date) ?
                                                " Completed"
                                                :
                                                null
                                      }
                                      <span><img src="/assets/img/launchpad_calender.svg" />
                                        {moment.utc(launchpad_object.start_date).format("MMM DD")} - {moment.utc(launchpad_object.end_date).format("MMM DD, YYYY")}
                                      </span>
                                    </h5>
                                    <p>Find a quick review of this event below, helping you get started.</p>

                                    <ul>
                                      <li>{launchpad_object.launch_pad_type == 1 ? " ICO" : launchpad_object.launch_pad_type == 2 ? " IDO" : launchpad_object.launch_pad_type == 3 ? " IEO" : null} Price <span>{launchpad_object.price} USD</span></li>
                                      <li>Softcap <span>{launchpad_object.soft_cap}</span></li>
                                      <li>Tokens Sold <span>{launchpad_object.tokens_sold} {data.symbol ? (data.symbol).toUpperCase() : "-"}</span></li>
                                      <li>Access <span>{launchpad_object.access_type == 1 ? "Public" : "Private"}</span></li>
                                      <li>Where to buy <a href={launchpad_object.where_to_buy_link} target="_blank"><span>{launchpad_object.where_to_buy_title}</span></a></li>
                                      <li>% of Total Supply <span> {launchpad_object.percentage_total_supply}({(max_supply * (launchpad_object.percentage_total_supply / 100))} {data.symbol ? (data.symbol).toUpperCase() : "-"})</span></li>
                                      <li>Accept
                                        <span >{
                                          launchpad_object.accept_payment_type.map((e, i) =>
                                            i < launchpad_object.accept_payment_type.length - 1 ?
                                              <>{e.payment_name + "/"}</>
                                              :
                                              ""
                                          )}

                                          {
                                            launchpad_object.accept_payment_type.map((e, i) =>
                                              i == launchpad_object.accept_payment_type.length - 1 ?
                                                <>{e.payment_name}</>
                                                :
                                                ""
                                            )
                                          }</span>
                                      </li>
                                    </ul>

                                    <div className="how_to_participate">
                                      <h5>How to participate</h5>
                                      <div dangerouslySetInnerHTML={{ __html: launchpad_object.how_to_participate }} />
                                    </div>
                                  </>
                                  :
                                  null
                              }

                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      null
                  }
                 

                  

                

                  {/* <div className='disclaimer_content mb-5'>
                    <h4>Disclaimer</h4>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of lorem ipsum.</p>
                   
                  </div> */}

                  

                </div>

              </div>
            </div>
          </div>

          


          {/***************************          This is the AIRDROP header that has been commented        ****************************/}


          {/* <div className="container-fluid p-0">
            <div className='markets_header_token'>
              <div className='container'>
              <div className="col-md-12">
          <div className="row">
                <div className="col-lg-4 col-xl-4 col-md-12">
                  <div className="token_main_details">
                        <div className="media">
                          <img src={data.token_image ? image_base_url + data.token_image : image_base_url + "default.png"} onError={(e) => e.target.src = "/assets/img/default_token.png"} className="token_img" alt="logo" width="100%" height="100%" />
                          <div className="media-body align-self-center">
                            <h4 className="media-heading">{data.token_name ? data.token_name : "-"} &nbsp; <span> ({data.symbol ? (data.symbol).toUpperCase() : "-"})</span> 
                              
                            </h4>
                            <p>Permissionless and non-custodial middleware</p>
                            <h6>
                            {
                              market_cap_rank ?
                                
                                      <a className="">
                                        {
                                          market_cap_rank != null ?
                                            <span>{market_cap_rank ? "Rank" + "#" + market_cap_rank : null}</span>
                                            :
                                            null
                                        }
                                      </a>
                                :
                                null
                            }
                               <span> &nbsp; <img src="/assets/img/grey_arrow_up.svg" /></span></h6>


                            

                          </div>
                        </div>
                        

                  </div>
                </div>
                <div className="col-lg-8 col-xl-8 col-md-12">
                  <ul className='airdrop_header_token'>
                <li className="token_price_block_airdrop">
                        <div >
                         <h6>Buying Price</h6>
                          <h5>$0.000547851</h5>
                        </div>
                      </li>

                      <li className="token_price_block_airdrop">
                      <h6>Listing Price</h6>
                          <h5>$0.100547851 <span className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />2.19%</span></span> </h5>
                </li>

                      <li >
                  <img src="/assets/img/advertise.svg" />
                </li>
                </ul>
                </div>
              </div>




              <div className='row token_header_cols'>
                <div className="col-lg-4 col-xl-4 col-md-12 pr-0">
                <ul className="token_share_vote">
                <li className='airdrop_ico'>ICO</li>
                  <li>DeFi</li>
                        {
                          user_token
                            ?
                            <>
                              {
                                voting_status == false ?
                                  <li onClick={() => ModalVote()} style={{ cursor: "pointer" }}><img src="/assets/img/coin_vote.svg" />&nbsp; {votes}</li>
                                  :
                                  <li onClick={() => ModalVote()} style={{ cursor: "pointer" }}><img src="/assets/img/coin_vote.svg" />&nbsp; {votes}</li>
                              }
                            </>
                            :
                            <li style={{ cursor: "pointer" }} >
                              <Link href={app_coinpedia_url + "login?prev_url=" + market_coinpedia_url + data.token_id}><a onClick={() => Logout()}>
                                <img src="/assets/img/coin_vote.svg" /> {votes}
                              </a></Link>
                            </li>
                        }
                        <li>{data.list_type == 1 ? "Coin" : "Token"}</li>
                        <li onClick={() => set_share_modal_status(true)} style={{ cursor: "pointer" }}><img src="/assets/img/coin_share.svg" /> Share</li>
                        <li style={{ cursor: "pointer" }}>
                        {
                                user_token ?
                                  <>
                                    {
                                      watchlist == true ?
                                        <span onClick={() => removeFromWatchlist(data._id)} ><img src="/assets/img/watchlist_token.png" style={{width:"18px"}} /></span>
                                        :
                                        <span onClick={() => addToWatchlist(data._id)} ><img src="/assets/img/watchlist_normal.png" style={{width:"18px"}} /></span>
                                    }
                                  </>
                                  :
                                  <Link href={app_coinpedia_url + "login?prev_url=" + market_coinpedia_url + data.token_id}><a onClick={() => Logout()}>
                                    <img src="/assets/img/watchlist_normal.png"  style={{width:"18px"}} />
                                  </a></Link>
                              }
                        </li>
                      </ul>
                </div>
                <div className="col-lg-8 col-xl-8 col-md-12 padding_null">
                  <ul className='token_list_data'>

                                <li>
                                  <div className="token_list_content">
                                  <h4>Start :  3 March 23</h4>
                                </div>
                              </li>
                              <li>
                                <div className="token_list_content">
                                  <h4>End :  3 July 23</h4>
                                </div>
                              </li>

                              <li>
                                <div className="token_list_content">
                                  <h4>Softcap: {launchpad_object.soft_cap} </h4>
                                </div>
                              </li>

                              <li>
                                <div className="token_list_content">
                                  <h4>Hardcap: $8794564564 </h4>
                                </div>
                              </li>
                              <li>
                                <div className="token_list_content airdrop_buy">
                                  <button className='airdrop_button'>Buy Now</button>
                                </div>
                              </li>
                              </ul>
              </div>
              </div>
          </div>
          </div>
          </div></div> */}


          {/* <div className='container'>
            <div className='col-md-12'>
            <div className="coin_details">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="coin_main_links">
                          <ul className="coin_quick_details">
                          {
                              data.website_link == "" ?
                                null
                                :
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a href={createValidURL(data.website_link)} target="_blank"> <img src="/assets/img/website.svg" className="coin_cat_img" />Website</a></div>
                                  </div>
                                </li>
                            }
                            {
                              data.whitepaper
                                ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a href={createValidURL(data.whitepaper)} target="_blank"> <img src="/assets/img/whitepaper.svg" className="coin_cat_img" /> White paper </a></div>
                                  </div>
                                </li>
                                :
                                null
                            }

                            {
                              data.explorer.length > 0 && data.explorer[0] != "" ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" ref={explorerRef} onClick={() => { set_explorer_links(!explorer_links) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Explorer <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> </a></div>
                                  </div>
                                  {
                                    explorer_links ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                            data.explorer.map((e, i) => {
                                              var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                              let url = ""
                                              if (e != "") {
                                                if (regexp.test(e)) {
                                                  url = new URL(e)
                                                }
                                                else {
                                                  e = "http://" + e
                                                  url = new URL(e)
                                                }
                                                return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).includes("t.me") ? url.hostname : null}{(url.hostname).indexOf(".") !== -1 ? (url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>
                                              }
                                            })
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

                            <li className="coin_individual_list">
                                <div className="quick_block_links">
                                <div className="widgets__select links_direct">
                                  <a>
                                  {
                        parseInt(data.list_type) !== 2 ?
                          ""
                          :
                          ((data.contract_addresses) && (data.contract_addresses.length > 0))
                            ?
                            <>
                                  {
                                    data.contract_addresses.length > 1
                                      ?
                                      parseInt(data.contract_addresses[0].network_type) === 1
                                        ?
                                        <>
                                          <a href={"https://etherscan.io/token/" + data.contract_addresses[0].contract_address} target="_blank">
                                            <span >
                                              <img className="token_dropdown_img" src="/assets/img/ETH.svg" alt="Ethereum"></img>
                                              Ethereum : {(data.contract_addresses[0].contract_address).slice(0, 4) + "..." + (data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4, data.contract_addresses[0].contract_address.length)}
                                            </span>
                                          </a>&nbsp;
                                          <img onClick={() => { copyContract(data.contract_addresses[0].contract_address, 'ETH') }} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                          <img src="/assets/img/down-arrow.png" ref={contractRef} onClick={() => set_other_contract(!other_contract)} className="dropdown_arrow_img" />
                                          {
                                            other_contract
                                              ?
                                              <div className="dropdown_block">
                                                <div className="media">
                                                  <img src="/assets/img/binance.svg" alt="Binance" className="token_dropdown_img" />
                                                  <div className="media-body">
                                                    <p className="wallets__info">Binance smart chain</p>
                                                    <p><a href={"https://bscscan.com/token/" + data.contract_addresses[1].contract_address} target="_blank"> <img className="token_dropdown_img" src="/assets/img/BSC.svg"></img> {(data.contract_addresses[1].contract_address).slice(0, 4) + "..." + (data.contract_addresses[1].contract_address).slice(data.contract_addresses[1].contract_address.length - 4, data.contract_addresses[1].contract_address.length)}
                                                    </a>
                                                      &nbsp;
                                                      {
                                                        contract_copy_status === 'BNB' ?
                                                          <span>Copied</span>
                                                          :
                                                          <img onClick={() => copyContract(data.contract_addresses[1].contract_address, 'BNB')} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                                      }
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                              :
                                              null
                                          }
                                        </>
                                        :
                                        parseInt(data.contract_addresses[0].network_type) === 2
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
                                      data.contract_addresses[0].network_type === 1
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
                                          <img onClick={() => copyContract(data.contract_addresses[0].contract_address, 'BNB')} src="/assets/img/copy_img.svg" className="copy_link ml-2 copy-contract-img" width="100%" height="100%" />
                                        </span>
                                  }
                                </>
                            :
                            null
                      }
                      
                      {
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
                      }
                              </a>
                              </div>
                              </div>
                            </li>

                            <li className="coin_individual_list">
                                <div className="quick_block_links">
                                <div className="widgets__select links_direct">
                                  <a>
                                <img src="/assets/img/discuss.svg" className="coin_cat_img" />Discuss <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> 
                              </a>
                              </div>
                              </div>
                            </li>

                            
                            {
                              data.source_code_link
                                ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a href={createValidURL(data.source_code_link)} target="_blank"><img src="/assets/img/source_code.svg" className="coin_cat_img" /> Source Code </a></div>
                                  </div>
                                </li>
                                :
                                null
                            }

                            <li className="coin_individual_list">
                                <div className="quick_block_links">
                                <div className="widgets__select links_direct">
                                  <a>
                                <img src="/assets/img/social_media.svg" className="coin_cat_img" />Social Media <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> 
                              </a>
                              </div>
                              </div>
                            </li>

                            <li>

                            </li>

                           

                            
                            {
                              data.community_address.length > 0 && data.community_address[0] != "" ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" ref={communityRef} onClick={() => { set_community_links(!community_links) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Community <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /></a></div>
                                  </div>
                                  {
                                    community_links
                                      ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                            data.community_address.map((e, i) => {
                                              var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                              let url = ""
                                              if (e != "") {
                                                if (regexp.test(e)) {
                                                  url = new URL(e)
                                                }
                                                else {
                                                  e = "http://" + e
                                                  url = new URL(e)
                                                }
                                                return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).includes("t.me") ? url.hostname : null}{(url.hostname).indexOf(".") !== -1 ? (url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>


                                              }
                                            })
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
                              data.exchange_link ?
                                data.exchange_link.length > 0 && data.exchange_link[0] != "" ?
                                  <li className="coin_individual_list">
                                    <div className="quick_block_links">
                                      <div className="widgets__select links_direct" onClick={() => { set_show_exchange_links(!show_exchange_links) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Exchanges  <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> </a></div>
                                    </div>
                                    {
                                      show_exchange_links
                                        ?
                                        <div className="dropdown_block badge_dropdown_block">
                                          <ul>
                                            {
                                              data.exchange_link.map((e, i) => {
                                                var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                                let url = ""
                                                if (e != "") {
                                                  if (regexp.test(e)) {
                                                    url = new URL(e)
                                                  }
                                                  else {
                                                    e = "http://" + e
                                                    url = new URL(e)
                                                  }
                                                  return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).includes("t.me") ? url.hostname : null}{(url.hostname).indexOf(".") !== -1 ? (url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>


                                                }
                                              })
                                            }
                                          </ul>
                                        </div>
                                        :
                                        null
                                    }
                                  </li>
                                  :
                                  null
                                :
                                null
                            }
                            
                            {
                              ((data.category_row_id_array) && (data.category_row_id_array.length > 0)) ?
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct" onClick={() => { set_category_list(!category_list) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Category <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /></a></div>
                                  </div>
                                  {
                                    category_list
                                      ?
                                      <div className="dropdown_block badge_dropdown_block">
                                        <ul>
                                          {
                                            data.category_row_id_array.map((e, i) =>
                                              <Link href={"/?active_category_tab=" + e._id}><a><li key={i}>{e.business_name}</li></a></Link>
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

                            
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-8">
                        <ul className="airdrop_list_token">
                        <li >
                            <div className="token_left_border">
                            {
                                parseInt(api_from_type) === 1 ?
                                  <div className="token_list_values">
                                    <h4>Total Supply</h4>
                                    <h5>{total_supply ? separator(total_supply) : data.total_supply ? separator(data.total_supply.toFixed(4)) : "NA"}</h5>
                                  </div>
                                  :
                                  ""
                              }



                              <div className="token_list_values">
                                <h4>Presale </h4>
                                <h5>57845566</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Marketing </h4>
                                <h5>45785546</h5>
                              </div>
                              

                               
                            </div>
                          </li>
                          <li>
                            <div className="token_left_border">
                              
                              <div className="token_list_values">
                                <h4>Airdrop </h4>
                                <h5>545214478</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Advertising </h4>
                                <h5>547854</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Community </h4>
                                <h5>5485</h5>
                              </div>
                              

                            </div>
                          </li>

                          <li>
                            <div className="token_left_border">
                              
                              <div className="token_list_values">
                                <h4>Media </h4>
                                <h5>57845566</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Company Reserve </h4>
                                <h5>57845566</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Burning </h4>
                                <h5>87455622</h5>
                              </div>
                              

                            </div>
                          </li>

                          <li>
                            <div className="token_left_border">
                              
                            <div className="token_list_values">
                                <h4>Liquidity <span onClick={() => change(6)}><img src='/assets/img/info.png' style={{ width: "16px", cursor: "pointer" }} /></span></h4>
                                <h5>{liquidity ? "$" : null}{liquidity ? separator(liquidity.toFixed(4)) : "NA"}</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Team </h4>
                                <h5>57845566</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Developers </h4>
                                <h5>45785546</h5>
                              </div>
                              

                            </div>
                          </li>
                          
                          <li >
                            <div className="token_left_border">
                             
                              
                            <div className="token_list_values">
                                <h4>Staking </h4>
                                <h5>545214478</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Lending </h4>
                                <h5>547854</h5>
                              </div>

                              <div className="token_list_values">
                                <h4>Locked </h4>
                                <h5>5485</h5>
                              </div>
                              

                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
            </div>
          </div> */}

          {/***************************          This is the AIRDROP header that has been commented this is the end of it        ****************************/}


          
        </div>
      </div>

      <div className="coming_soon_modal">
        <div className="modal" id="comingSoon">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
                <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" /></span></button>
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
                <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg" /></span></button>
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
              <button type="button" className="close" data-dismiss="modal" onClick={() => set_share_modal_status(false)}><span><img src="/assets/img/close_icon.svg" /></span></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-1" />
                <div className="col-md-10">
                  <div className="input-group">
                    <input type="text" id="referral-link" className="form-control" defaultValue={market_coinpedia_url + data.token_id} readOnly />
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="myTooltip" onClick={() => myReferrlaLink()}>
                        <img src="/assets/img/copy-file.png" className="copy_link ml-2" width="100%" height="100%" />
                      </span>
                    </div>
                  </div>
                  <h6>Share with </h6>
                  <p className="share_social">
                    <a href={"https://www.facebook.com/sharer/sharer.php?u=" + market_coinpedia_url + data.token_id} target="_blank"><img src="/assets/img/facebook.png" width="100%" height="100%" /></a>
                    <a href={"https://www.linkedin.com/shareArticle?mini=true&url=" + market_coinpedia_url + data.token_id} target="_blank"><img src="/assets/img/linkedin.png" width="100%" height="100%" /></a>
                    <a href={"http://twitter.com/share?url=" + market_coinpedia_url + data.token_id+"&text="+ data.token_name} target="_blank"rel="noopener"><img src="/assets/img/twitter.png" width="100%" height="100%" /></a>
                    <a href={"https://wa.me/?text=" + market_coinpedia_url + data.token_id} target="_blank"><img src="/assets/img/whatsapp.png" width="100%" height="100%" /></a>
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
              <button type="button" className="close" data-dismiss="modal" onClick={() => set_category_modal(false)}><span><img src="/assets/img/close_icon.svg" /></span></button>
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
    </>
  )
}


export async function getServerSideProps({ query, req }) 
{
  const token_id = query.token_id
  const search_by_category = query.search ? query.search : ""
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)

  const tokenQuery = await fetch(API_BASE_URL + "markets/cryptocurrency/individual_details/" + token_id, config(userAgent.user_token))
  if(tokenQuery) 
  {
    const tokenQueryRun = await tokenQuery.json()
    return { props: { data: tokenQueryRun.message, errorCode: false, token_id: token_id, userAgent: userAgent, config: config(userAgent.user_token), search_by_category: search_by_category } }
  }
  else {
    return { props: { errorCode: true } }
  }
}
