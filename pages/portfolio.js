import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Axios from 'axios'
import JsCookie from 'js-cookie'
import cookie from 'cookie'
import Web3 from 'web3'
// import Slider from "react-slick"
// import ReactPaginate from "react-paginate"
import { useRouter } from 'next/router'
// import { useDispatch } from 'react-redux'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import dynamic from 'next/dynamic'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import Transactions from '../components/layouts/portfolio/transactions'
import TokenDetail from '../components/layouts/portfolio/token_detail'
import NFT_detail from '../components/layouts/portfolio/nft_detail'
import Token_Approvals from '../components/layouts/portfolio/approvals'
import Analytics from '../components/layouts/portfolio/analytics'
import Feed from '../components/layouts/portfolio/feed'
import { tokenLoader } from '../components/loaders/contentLoader'
import Before_login from '../components/layouts/portfolio/before_login'
import Popupmodal from '../components/popupmodal'
import { ethereum_list } from '../components/config/ethereum'
import { binance_list } from '../components/config/binance'
import { polygon_list } from '../components/config/polygon'
import CategoriesTab from '../components/categoriesTabs'
import LoginModal from '../components/layouts/auth/loginModal'
import { fantom_list } from '../components/config/fantom'
import { avanlanche_list } from '../components/config/avalanche'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import SearchContractAddress from '../components/search_token'
import Metamask from '../components/layouts/social_crypto_login/metamask'
// import { ethereum_list, binance_list, polygon_list,fantom_list } from '../components/config/constants' 
import { USDFormatValue, getNetworkImageNameByID, getNetworkNameByID, addRemoveActiveAddresses, setActiveNetworksArray, getShortAddress, fetchAPIQuery, addActiveNickname, graphqlBasicTokenData, getNameByUsingWalletAddress, cryptoNetworksList, getGraphSparklineValues, makeJobSchema, getDaysList, updateAddedWallet } from '../components/config/helper'
import { cookieDomainExtension, roundNumericValue, arrayBalanceContractsColumn, API_BASE_URL, MAIN_API_BASE_URL, graphqlApiURL, strLenTrim, separator, currency_object, config, count_live_price, validBalance, getShortWalletAddress, market_coinpedia_url, calling_network, IMAGE_BASE_URL, arrayContractsColumn } from '../components/constants'
import InfiniteScroll from "react-infinite-scroll-component";
import Nft_loader from '../components/loaders/nft_loader'
import Net_worth_chart from '../components/layouts/portfolio/charts/net_worth'


export default function WalletDetails({ userAgent, prev_url, search_address }) 
{
  const { userData, active_currency } = useSelector(state => state)
  if (userAgent.alert_message) {
    var alertObj = { icon: "/assets/img/update-successful.png", title: "Thank You!", content: userAgent.alert_message }
  }
  else {
    var alertObj = { icon: "", title: "", content: "" }
  }

  const router = useRouter()
  var sl_num = 0
  const { active_watchlist_tab, address } = router.query

  // const dispatch = useDispatch()
  //Multiple Wallet Address Code Starts Here
  const [active_addresses, set_active_addresses] = useState(!userAgent.user_token ? userAgent.active_addresses ? JSON.parse(userAgent.active_addresses) : [] : [])
  const [active_nicknames, set_active_nicknames] = useState(userAgent.active_nicknames ? JSON.parse(userAgent.active_nicknames) : {})
  const [tokens_list_as_account_view, set_tokens_list_as_account_view] = useState([])
  const [tokens_list_as_list_view, set_tokens_list_as_list_view] = useState([])
  const [tokens_grand_total, set_tokens_grand_total] = useState(0)
  const [wallet_listing_limit] = useState(4)
  const [active_networks, set_active_networks] = useState([1, 56, 137, 250, 43114])
  const [image_base_url] = useState(IMAGE_BASE_URL + "/markets/cryptocurrencies/")
  const [wallet_menu_show_status, set_wallet_menu_show_status] = useState("")
  const [copy_wallet_address, set_copy_wallet_address] = useState("")
  const [crypto_networks_list, set_crypto_networks_list] = useState(cryptoNetworksList({ ethereum: 0, bsc: 0, polygon: 0, fantom: 0, avalanche: 0 }))
  const [display_tokens_balance, set_display_tokens_balance] = useState(0)
  const [tokens_view_type, set_tokens_view_type] = useState(1)
  const [filter_tokens_list_as_account_view, set_filter_tokens_list_as_account_view] = useState([])
  console.log("filter_tokens_list_as_account_view",filter_tokens_list_as_account_view)
  const [all_tokens, set_all_tokens] = useState([])
  const [token_minimum_balance] = useState(0.000000001)
  const [token_maximum_balance] = useState(10000000000 * 10000000000 * 1000)
  //Multiple Wallet Address Code Ends Here
  // console.log("address", address)


  const [tab_active, set_tab_active] = useState((active_watchlist_tab > 0) ? 2 : 1)

  const [user_email_status, set_user_email_status] = useState(userAgent.user_email_status)
  const [nickName, setnickName] = useState()
  const [pastAddress, setpastAddress] = useState()
  const [errnickName, seterrnickName] = useState("")
  const [errpastAddress, seterrpastAddress] = useState("")
  const [add_new_wallet_modal, set_add_new_wallet_modal] = useState(false)
  const [modal_data, set_modal_data] = useState(alertObj)
  const [added_wallet_list, set_added_wallet_list] = useState([])
  const [net_worth_24h_change, set_net_worth_24h_change] = useState(0)

  const [loader_status, set_loader_status] = useState(false)
  const [loader, set_loader] = useState("")

  const [network_list_show_status, set_network_list_show_status] = useState(false)
  const [wallet_list_show_status, set_wallet_list_show_status] = useState(false)
  const [search_wallet_address, set_search_wallet_address] = useState("")
  const [err_search_wallet_address, set_err_search_wallet_address] = useState("")
  const [url_wallet_address, set_url_wallet_address] = useState("")
  const [change_address_modal_status, set_change_address_modal_status] = useState(false)
  const [token_details_modal_status, set_token_details_modal_status] = useState(false)
  const [token_detail, set_token_detail] = useState("")
  const [default_wallet_loader_status, set_default_wallet_loader_status] = useState(false)
  

  const [pi_chart_values, set_pi_chart_values] = useState([])
  const [pi_chart_names, set_pi_chart_names] = useState(['Ethereum', 'Binance', 'Polygon', 'Fantom', 'Avalanche'])
  const [pi_chart_colors] = useState(['#647fe6', '#ffc107', '#6f42c1', '#00bcd4', '#f44336'])


  const [token_allocation_values, set_token_allocation_values] = useState([])
  const [token_allocation_names, set_token_allocation_names] = useState([])
  const [token_allocation_colors, set_token_allocation_colors] = useState(['#0088FE', '#00C49F', '#FFBB28', '#4b51cb', '#CF61B0', '#909090', '#5D69B1', '#24796C', '#E88310', '#2F8AC4', '#764E9F', '#ED645A', '#CC3A8E', '#C1C1C1', '#66C5CC', '#F89C74', '#DCB0F2', '#87C55F', '#9EB9F3', '#FE88B1', '#8BE0A4', '#B497E7',
    '#D3B484', '#B3B3B3', '#E10B64', '#E92828', '#78B4A4', '#604F00', '#0060E9', '#FF7DE3', '#20c997', '#6f42c1'])

  //Remove Wallet Account Starts Here
  const [wallet_confirm_remove_modal, set_wallet_confirm_remove_modal] = useState(false)
  const [wallet_row_id, set_wallet_row_id] = useState('')
  const [remove_wallet_address, set_remove_wallet_address] = useState('')
  //Remove Wallet Account Ends Here


  //GAS Fees starts here
  const [gas_fees_show_status, set_gas_fees_show_status] = useState("")
  // const [url_wallet_address, set_url_wallet_address] =useState("")
  //GAS Fees ends here

  const tokens_count_length = tokens_list_as_list_view.filter((e) => active_networks.includes(e.network))

  console.log("tokens_count_length",tokens_count_length)
  // console.log("tokens_grand_total",tokens_grand_total)


  const [user_token, set_user_token] = useState(userAgent.user_token ? userAgent.user_token : "");
  const [login_modal_status, set_login_modal_status] = useState(false)
  const [request_config, set_request_config] = useState(config(userAgent.user_token ? userAgent.user_token : ""))
  const [line_graph_base_price, set_line_graph_base_price] = useState(0)

  const [unsubscribe_status, set_unsubscribe_status] = useState(false)
  const [line_graph_days, set_line_graph_days] = useState([])
  const [line_graph_values, set_line_graph_values] = useState([])
  const [worth_chart_type, set_worth_chart_type] = useState(2)
  
  
  const line_chart_series = [{
    name: "Asset Worth",
    data: line_graph_values
  }]

  const line_chart_options = {
    chart: {
      height: 350,
      toolbar: {
        show: false
      },
      // type: 'area',
      zoom: {
        enabled: false
      }
    },
    
    fill: {
      // type: 'gradient',
    },
    colors: ['#24c6d8'],
    dataLabels: {
      enabled: false
    },
    yaxis: {
      labels: {
        formatter: function (y) {
          return convertCurrency(y);
        }
      },
      lines: {
        show: false
      }
    },
    stroke: {

      width: 2,
    },
    grid: {
      row: {
        opacity: 0.5
      },
    },
    xaxis: {
      categories: line_graph_days
    }
  }


  // const getDaysList = async (balance_list, pass_balance, pass_data_type) =>
  // {   
  //       var array_count = 0
  //       if(pass_data_type == 1)
  //       {
  //         array_count = 13 
  //       }
  //       // 1 Day
  //       else if(pass_data_type == 2)
  //       {
  //         array_count = 13
  //       }
  //       // 7 Days
  //       else if(pass_data_type == 3)
  //       {
  //         array_count = 8
  //       }
  //       const past7Days = [...Array(array_count).keys()].map(index => 
  //       {
  //           const date = new Date();

  //           if(pass_data_type == 1)
  //           {
  //             date.setHours(date.getHours() - index)
  //             if(index == 0)
  //             {
  //               return moment(date).format("h a")
  //             }
  //             else
  //             {
  //               return moment(date).format("h a")
  //             }

  //           }
  //           if(pass_data_type == 2)
  //           {
  //             date.setHours(date.getHours() - index*2)
  //             if(index == 0)
  //             {
  //               return moment(date).format("h a")
  //             }
  //             else
  //             {
  //               return moment(date).format("h a")
  //             }
  //           }
  //           else
  //           {
  //             date.setDate(date.getDate() - index)
  //             return moment(date).format("DD MMM")
  //           }
  //       })
  //       const last_seven_days = past7Days.reverse()


  //       set_line_graph_days(last_seven_days)
  //       var initial_array = []
  //       if(balance_list)
  //       {
  //           for(let i of balance_list)
  //           {   
  //              await initial_array.push({
  //                   price : i.price,
  //                   balance : i.balance,
  //                   sparkline_in_7d : await getGraphSparklineValues(i.sparkline_in_7d, pass_data_type)
  //              })
  //           }
  //       }

  //       var sum_array = []
  //       for(let i=0; i<array_count; i++)
  //       {
  //         if(i == (array_count-1))
  //         {
  //           await sum_array.push(pass_balance)
  //         }
  //         else
  //         {
  //           var sumOne = 0
  //           for(let j=0; j<initial_array.length; j++)
  //           {
  //               sumOne += await (initial_array[j].sparkline_in_7d[i] && initial_array[j].balance) ? initial_array[j].sparkline_in_7d[i]*initial_array[j].balance:0
  //           }
  //           await sum_array.push(parseFloat(sumOne.toFixed(2)))
  //         }
  //       }
  //       // console.log("balance_list", balance_list)
  //       // console.log("sum_array", sum_array)
  //       await set_line_graph_values(sum_array)
  //   }


  const setChartWorth = async (pass_type) => 
  {
    set_loader_status(true)
    console.log("pass_type", pass_type)
    set_worth_chart_type(pass_type)
    const get_days_res = await getDaysList(tokens_list_as_list_view, display_tokens_balance, pass_type)
    await set_line_graph_days(get_days_res.line_graph_days)
    await set_line_graph_values(get_days_res.line_graph_values)
  }

  const getDataFromChild = async (pass_object) => 
  {
    console.log("pass_object", pass_object)
    await set_login_modal_status(false)
    await set_user_token(JsCookie.get("user_token"))
    await set_request_config(JsCookie.get("user_token"))
    await set_user_email_status(JsCookie.get("user_email_status"))
    await set_change_address_modal_status(false)
    await getportfolio()
  }

  const login_props = {
    status: true,
    request_config: request_config,
    callback: getDataFromChild
  }

  //1:add to watchlist, 2:remove from watchlist
  const loginModalStatus = async () => {
    await set_login_modal_status(false)
    await set_login_modal_status(true)
  }


  const getSinglePortfolioDetails = (pass_item) => {
    set_wallet_list_show_status(false)
    set_wallet_menu_show_status(false)
    set_add_new_wallet_modal(true)
    setnickName(pass_item.nick_name)
    setpastAddress(pass_item.wallet_address)
    set_wallet_row_id(pass_item._id)
  }

  const withoutLoginRemoveWallet = () => {
    JsCookie.remove('recent_used_wallet', { domain: cookieDomainExtension })
    JsCookie.remove('display_tokens_balance', { domain: cookieDomainExtension })
    set_url_wallet_address("")
    set_display_tokens_balance("")
    //   dispatch({
    //     type: 'portfolioWalletBalance', data:{balance:0}
    // })
    router.push("/portfolio")
  }

  const gas_ref = useRef()
  const wallet_ref = useRef()
  const account_type_ref = useRef()
  const wallet_menu_ref = useRef()




  const subscribeToPortfolio = async () => {
    set_modal_data({ icon: "", title: "", content: "" })
    const res = await Axios.get(API_BASE_URL + "markets/subscribe/email_subscribe/2", config(JsCookie.get('user_token')))
    if (res.data) {
      if (res.data.status) {
        set_modal_data({ icon: "/assets/img/update-successful.png", title: "Thank You!", content: res.data.message.alert_message })
        set_unsubscribe_status(false)
      }
    }
  }

  const copyAddress = (pass_address) => {
    set_copy_wallet_address(pass_address)
    var copyText = document.createElement("input")
    copyText.value = pass_address
    document.body.appendChild(copyText)
    copyText.select()
    document.execCommand("Copy")
    copyText.remove()
    // setTimeout(3000)
    setTimeout(() =>
      set_copy_wallet_address(""), 3000)
  }



  const convertCurrency = (token_price) => 
  {
    if (token_price) {
      if (active_currency.currency_value) {
        return active_currency.currency_symbol + " " + roundNumericValue(token_price * active_currency.currency_value)
      }
      else {
        return roundNumericValue(token_price)
      }
    }
    else {
      return '0'
    }
  }



  // Multiple Wallet Select Code Starts Here
  const multipleAddressList = async (pass_address, pass_nickname, pass_action_type, refresh_status) => 
  {
    // console.log("pass_action_type", pass_action_type)
    set_tab_active(1)
    set_loader_status(false)
    var my_active_nicknames = active_nicknames
    if(pass_action_type == 1) 
    {
      my_active_nicknames = await addActiveNickname(active_nicknames, pass_address, pass_nickname)
    }

    // else if(pass_action_type == 1)
    // {
    //   my_active_nicknames = await removeActiveNickname(active_nicknames, pass_address)
    // }
    // console.log("my_active_nicknames", my_active_nicknames)
    set_active_nicknames([])
    set_active_nicknames(my_active_nicknames)
    await JsCookie.set('active_nicknames', JSON.stringify(my_active_nicknames), { domain: cookieDomainExtension })

    const my_active_addresses = await addRemoveActiveAddresses(pass_address, active_addresses, pass_action_type)

    //console.log("my_active_addresses", my_active_addresses)
    await set_active_addresses([])
    await set_active_addresses(my_active_addresses)
    await JsCookie.set('active_addresses', JSON.stringify(my_active_addresses), { domain: cookieDomainExtension })

    const portfolio_wallets = localStorage.getItem("users_wallets") ? JSON.parse(localStorage.getItem("users_wallets")) : {}
    var tokens_list = []
    var tokens = []
    var not_fetched_array = []
    var users_wallets_tokens = { wallet_address:"", tokens:[] }
    for(let run of my_active_addresses) 
    {
      var fetch_status = false
      if(!refresh_status)
      {
        if(portfolio_wallets[run]) 
        {
          var { list, sub_total_balance, expire_at } = portfolio_wallets[run]
          var present_time = new Date().getTime()

          // console.log("expire_at1", present_time)
          // console.log("expire_at2", expire_at)

          if(list) 
          {
            if(list.length > 0) 
            {
              if(expire_at >= present_time) 
              {
                const updated_token_list = await updateTokensPricing(list) 

                fetch_status = true
                var inner_tokens_list = {
                  wallet_address: run,
                  networks: list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
                  tokens: updated_token_list.arrange_result,
                  nick_name: await getNameByUsingWalletAddress(my_active_nicknames, run),
                  sub_total_balance: updated_token_list.total_balance
                }

                await tokens_list.push(inner_tokens_list)
                // console.log("qwerty",tokens_list)
                list.map((e) => tokens.push(e.name))
                
              }
            }
          }
        }
      }
     
      if(!fetch_status) 
      {
        console.log("asdfasdf")
        var { wallet_tokens_list, total_balance, not_fetch_array } = await fetchNewWalletTokens(run)
        console.log(not_fetch_array)
        await savePortfolioInLocalStorage({ wallet_address: run, final_array: wallet_tokens_list, total_balance: total_balance })

        var inner_tokens_list = {
          wallet_address: run,
          networks: wallet_tokens_list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
          nick_name: await getNameByUsingWalletAddress(my_active_nicknames, run),
          tokens: wallet_tokens_list,
          sub_total_balance: total_balance
        }

        await tokens_list.push(inner_tokens_list)
        // console.log("qwerty1",tokens_list)

        wallet_tokens_list.map((e) => tokens.push(e.name))
        
        if(not_fetch_array.length)
        {
          not_fetched_array = await not_fetch_array
        }

        if(wallet_tokens_list.length)
        {
          users_wallets_tokens = await {wallet_address:run, tokens:wallet_tokens_list}
        }
      }
    }
    set_all_tokens(tokens)
    console.log("tokens1", tokens_list)
    console.log("Alltokens", tokens)
    await arrangeListViewTokens(tokens_list)
    await set_tokens_list_as_account_view(tokens_list)

    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(active_networks, tokens_list)
    if(account_view_result) 
    {
      // console.log("account_view_result",account_view_result)
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_net_worth_24h_change(final_24h_change)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, { domain: cookieDomainExtension })
    }
    
    if(not_fetched_array.length)
    {
      await updateFetchedTokens(not_fetched_array)
      console.log("not_fetched_array", not_fetched_array)
    }

    if(users_wallets_tokens.wallet_address)
    { 
      await updateUsersAssets(users_wallets_tokens)
      console.log("users_wallets_tokens", users_wallets_tokens)
    }
    
  }
  
  const updateFetchedTokens = async (pass_array) =>
  {
    //const response = 
    await Axios.post(API_BASE_URL + 'markets/portfolio/not_fetched_tokens', { assets: pass_array }, config(""))
    //console.log("not_fetched_tokens", response)
  }
  
  const updateTokensPricing = async (token_list) =>
  { 
    const array_arranged = await arrayContractsColumn(token_list, 'address')
    const { price_list, history_list } = await getBalancesLivePrices(array_arranged)
    console.log("token_list", token_list)
    // console.log("price_list", price_list)
    // console.log("history_list", history_list)

    const arrange_result = []
    var total_balance = 0
    if(token_list.length) 
    {
      for(let run of token_list) 
      {
          let inner_object = {}
          inner_object['wallets'] = run.wallets
          inner_object['name'] = run.name
          inner_object['network'] = run.network
          inner_object['symbol'] = run.symbol
          inner_object['address'] = run.address
          inner_object['balance'] = run.balance
        
          let token_type = 2
          let type_value = run.address
          if(run.address == '-') 
          {
            token_type = 1
            type_value  = run.symbol
          }

          const cp_single_data = await getCpSingleData(price_list, token_type, type_value)
          if(cp_single_data)
          {
            if(cp_single_data.token_name)
            {
              inner_object['name'] = cp_single_data.token_name
            }
            inner_object['price'] = cp_single_data.price ? cp_single_data.price:0 
            inner_object['high_24h'] = cp_single_data.high_24h ? cp_single_data.high_24h:0
            inner_object['low_24h'] = cp_single_data.low_24h ? cp_single_data.high_24h:0
            inner_object['circulating_supply'] = cp_single_data.circulating_supply ? cp_single_data.circulating_supply:0
            inner_object['image'] = cp_single_data.token_image ? cp_single_data.token_image:""
            inner_object['change_24h'] = cp_single_data.percent_change_24h ? cp_single_data.percent_change_24h:0
            inner_object['token_id'] = cp_single_data.token_id ? cp_single_data.token_id:""
            inner_object['volume'] = cp_single_data.volume ? cp_single_data.volume:""
            inner_object['_id'] = cp_single_data._id ? cp_single_data._id:""
            
            const index = await history_list.findIndex(item => item._id === cp_single_data._id)
            if(index != -1)
            {
              inner_object['sparkline_in_7d'] = history_list[index].data
            }
            else
            {
              inner_object['sparkline_in_7d'] = []
            }
            await arrange_result.push(inner_object)

            if(run.balance && cp_single_data.price) 
            {
              total_balance += await cp_single_data.price*run.balance
            }
          }
        }
      }

    console.log("arrange_result", arrange_result)
    return await {total_balance, arrange_result}
  } 

  const arrangeListViewTokens = async (pass_tokens_list) => 
  {
    // console.log("pass_address",pass_address)
    var tokens_final_array = []
    var grand_total_balance = 0
    if(pass_tokens_list.length) 
    {
      for(let run of pass_tokens_list) 
      {
        // console.log("test", run)
        var inner_tokens = await run.tokens
        if(inner_tokens.length) 
        {
          for(let inner_run of inner_tokens) 
          {
            var inner_id = await inner_run._id + inner_run.network
            var new_object = {}
            new_object['circulating_supply'] = inner_run.circulating_supply
            new_object['address'] = inner_run.address
            new_object['change_24h'] = inner_run.change_24h
            new_object['network'] = inner_run.network
            new_object['price'] = inner_run.price
            new_object['sparkline_in_7d'] = inner_run.sparkline_in_7d
            new_object['symbol'] = inner_run.symbol
            new_object['high_24h'] = inner_run.high_24h
            new_object['low_24h'] = inner_run.low_24h
            new_object['_id'] = inner_run._id
            new_object['image'] = inner_run.image
            new_object['name'] = inner_run.name


            if(tokens_final_array[inner_id]) 
            {
              if(tokens_final_array[inner_id].network == inner_run.network) 
              {
                // console.log("inner array", tokens_final_array[inner_id])
                var balance = await parseFloat(tokens_final_array[inner_id].balance) + parseFloat(inner_run.balance)
                var wallets_array = []
                if(tokens_final_array[inner_id].wallets) 
                {
                  wallets_array = await tokens_final_array[inner_id].wallets
                }

                await wallets_array.push({
                  wallet_address: run.wallet_address,
                  balance: inner_run.balance
                })

                new_object['balance'] = balance
                new_object['wallets'] = wallets_array

                tokens_final_array[inner_id] = await new_object
              }
              else 
              {
                new_object['balance'] = inner_run.balance
                new_object['wallets'] = [{
                  wallet_address: run.wallet_address,
                  balance: inner_run.balance
                }]

                tokens_final_array[inner_id] = await new_object
              }
            }
            else 
            {
              new_object['balance'] = inner_run.balance
              new_object['wallets'] = [{
                wallet_address: run.wallet_address,
                balance: inner_run.balance
              }]

              tokens_final_array[inner_id] = await new_object
            }
          }
        }
        grand_total_balance += await parseFloat(run.sub_total_balance)
      }
    }


    set_loader_status(true)
    await set_tokens_grand_total(0)
    await set_tokens_grand_total(grand_total_balance)

    // console.log("tokens_final_array",tokens_final_array)
    await set_display_tokens_balance(0)
    await JsCookie.set('display_tokens_balance', 0, { domain: cookieDomainExtension })

    var ethereum = 0
    var bsc = 0
    var polygon = 0
    var fantom = 0
    var avalanche = 0
    var obj2 = []
    var total_24h_change = 0
    for (var prop in tokens_final_array) {
      total_24h_change += tokens_final_array[prop].change_24h ? parseFloat(tokens_final_array[prop].change_24h) : 0
      await obj2.push(tokens_final_array[prop])
    }
    for(let run of pass_tokens_list) 
    {
      var inner_tokens = await run.tokens
      if(inner_tokens.length) 
      {
        for(let inner_run of inner_tokens) 
        {
          if(inner_run.network == 1) 
          {
            ethereum += !isNaN(parseFloat(inner_run.balance) * parseFloat(inner_run.price)) ? parseFloat(inner_run.balance) * parseFloat(inner_run.price) : 0
          }
          else if (inner_run.network == 56) {
            bsc += !isNaN(parseFloat(inner_run.balance) * parseFloat(inner_run.price)) ? parseFloat(inner_run.balance) * parseFloat(inner_run.price) : 0
          }
          else if (inner_run.network == 137) {
            polygon += !isNaN(parseFloat(inner_run.balance) * parseFloat(inner_run.price)) ? parseFloat(inner_run.balance) * parseFloat(inner_run.price) : 0
          }
          else if (inner_run.network == 250) {
            fantom += !isNaN(parseFloat(inner_run.balance) * parseFloat(inner_run.price)) ? parseFloat(inner_run.balance) * parseFloat(inner_run.price) : 0
          }
          else if (inner_run.network == 43114) {
            avalanche += !isNaN(parseFloat(inner_run.balance) * parseFloat(inner_run.price)) ? parseFloat(inner_run.balance) * parseFloat(inner_run.price) : 0
          }
        }
      }
    }
    //   total_24h_change += tokens_final_array[prop].change_24h ? parseFloat(tokens_final_array[prop].change_24h):0

    //   await obj2.push(tokens_final_array[prop])
    // }


    // await set_net_worth_24h_change(0)
    // if(grand_total_balance > 0)
    // {
    //   await set_net_worth_24h_change((total_24h_change/obj2.length).toFixed(2))
    // }


    const network_balances_list = await cryptoNetworksList({ ethereum, bsc, polygon, fantom, avalanche })
    await set_crypto_networks_list(network_balances_list)
    // console.log("network_balances_list", network_balances_list)


    var total_balances = 0

    for (let run of network_balances_list) {
      if (active_networks.includes(run.network_id)) {
        total_balances += !isNaN(parseFloat(run.network_balance)) ? parseFloat(run.network_balance) : 0
      }
    }

    await set_display_tokens_balance(total_balances)
    await JsCookie.set('display_tokens_balance', total_balances, { domain: cookieDomainExtension })

    const tokens_list_view = await obj2.sort((a, b) => (a.price * a.balance * 100) < (b.price * b.balance * 100) ? 1 : -1)

    await set_tokens_list_as_list_view(tokens_list_view)
    const get_days_res = await setNetWorth(tokens_list_view, total_balances, 2)
    // await set_line_graph_days(get_days_res.line_graph_days)
    // await set_line_graph_values(get_days_res.line_graph_values)
    setChartsData({ final_array: tokens_list_view, total_balance: total_balances })
  }

  
  const setNetWorth = async (balance_list, balance, data_type) =>
  { 
    await set_loader_status(false)
    var date_array = []
    var low_value = 0
    var high_value = 0
    for(let run of balance_list)
    { 
      if(run.sparkline_in_7d)
      {
        if(run.sparkline_in_7d.length)
        {
         
          date_array = await run.sparkline_in_7d
          break;
        }
        
      }
    }
    const new_array = []
    
      if(date_array)
      {
        for(let run in date_array)
        { 
            var sumOne = 0
            var counter = 0
            for(let innerRun of balance_list)
            {   
              if((innerRun.sparkline_in_7d[run] && innerRun.balance))
              {
                sumOne += await innerRun.sparkline_in_7d[run].price*innerRun.balance
                counter++
              }
              else if((innerRun.price && innerRun.balance))
              { 
                sumOne += await innerRun.price*innerRun.balance
                counter++
              }
            }

            if(run == 0)
            {
              low_value = await sumOne
            }
            else
            {
              if(sumOne < low_value)
              {
                low_value = await sumOne
              }
            }

            if(sumOne > high_value)
            {
              high_value = await sumOne
            }
            const current_country_time = await moment(date_array[run].date_n_time).format("YYYY-MM-DDTHH:mm:ss")+".000Z"
            await new_array.push({
              value : sumOne,
              // counter: counter,
              time : Math.floor((new Date(current_country_time)).getTime()/1000)
            })
        }
      }

      const base_price = await parseFloat(((low_value+high_value)/2).toFixed(2))

      await set_line_graph_values(new_array)
      await set_line_graph_base_price(base_price)
      await set_loader_status(true)
      console.log("low_value", low_value)
      
      console.log("high_value", high_value)
   

    // var initial_array = []
    // const past7Days = [...Array(47).keys()].map(index => 
    // {   
    //     let min_value = "30"
    //     if(index % 2 == 0)
    //     {
    //       min_value = "00"
    //     }
    //     const date = new Date()
    //     date.setHours(date.getHours() - index*0.5)
    //     return moment(date).format("DD-MM-YYYYTH:")+min_value+":00z"
    // })
    // const last_seven_days = past7Days.reverse()

   
  }


  const fetchNewWalletTokens = async (pass_address) => 
  {
    var merge_array = []
    const ethereum_query = graphqlBasicTokenData(pass_address, "ethereum")
    const ethereum_opts = fetchAPIQuery(ethereum_query)

    const binance_query = graphqlBasicTokenData(pass_address, "bsc")
    const binance_opts = fetchAPIQuery(binance_query)

    const polygon_query = graphqlBasicTokenData(pass_address, "matic")
    const polygon_opts = fetchAPIQuery(polygon_query)

    const fantom_query = graphqlBasicTokenData(pass_address, "fantom")
    const fantom_opts = fetchAPIQuery(fantom_query)

    const avalanche_query = graphqlBasicTokenData(pass_address, "avalanche")
    const avalanche_opts = fetchAPIQuery(avalanche_query)

    const bal_req = await Promise.all([
      fetch(graphqlApiURL, ethereum_opts),
      fetch(graphqlApiURL, binance_opts),
      fetch(graphqlApiURL, polygon_opts),
      fetch(graphqlApiURL, fantom_opts),
      fetch(graphqlApiURL, avalanche_opts)
    ])
   
    const balance_array = []
    const bal_res = await Promise.all(bal_req.map(r => r.json()))
    if(bal_res)
    { 
      let i=0
      for(let run of bal_res)
      {
        if(!run.error && run.data.ethereum) 
        {
          if(run.data.ethereum.address[0].balances) 
          {
            merge_array = await [...merge_array,...(run.data.ethereum.address[0].balances)]
            await balance_array.push({
              id : calling_network[i].id,
              network : calling_network[i].network,
              data : run.data.ethereum.address[0].balances
            })
          }
        }
        i++
      }
    }

    const array_arranged = await arrayBalanceContractsColumn(merge_array)
    const { price_list, history_list } = await getBalancesLivePrices(array_arranged)
    
    var tokens = []
    var final_array = []
    var not_fetch_array = []
    var total_balance = 0
    // var arranged_balance_array = []
    for(let run of balance_array)
    {
      // var arranged_data = []
      if(run.data)
      {
        const { arrange_result, network_balance, not_fetching_data } = await getArrangeBalanceData(pass_address, run.data, price_list, history_list, run.id)
        
       
        if(!isNaN(network_balance))
        {
          total_balance += network_balance
        }
        
        if(arrange_result)
        {
          for(let innerRun of arrange_result)
          {
            await final_array.push(innerRun)

            await tokens.push(innerRun.name)
          }
        }

        if(not_fetching_data.length)
        {
          not_fetch_array = await [...not_fetch_array,...not_fetching_data]
          //await not_fetch_array.push(not_fetching_data)
        }
      }
    }
    
    await set_all_tokens(tokens)
  
    console.log("not_fetch_array", not_fetch_array)

    console.log("final_array", final_array)
    console.log("total_balance", total_balance)

    return { wallet_tokens_list: final_array, total_balance: total_balance, not_fetch_array }

    // console.log("final_array", final_array)
    // console.log("Alltokens", tokens)
  }


   // pass_type 1: native token, 2:other token
   const getCpSingleData = async (pass_data, pass_type, pass_type_data) =>
   {
      
     var return_object = ""
     if(pass_data.length)
     { 
       if(pass_type == 1)
       {
         const index = await (pass_data).findIndex(item => item.symbol === pass_type_data)
         return_object = await pass_data[index]
       }
       else
       {
         for(let run of pass_data)
         { 
           if(run.contract_addresses)
           { 
             const index = await ( run.contract_addresses).findIndex(item => (item.contract_address).toLowerCase() == pass_type_data.toLowerCase())
             if(index != -1)
             {
               return_object = await run
             }
           }
         }
       }
     }
     return return_object
   }
   
   
   const getArrangeBalanceData = async (pass_address, pass_data, pass_prices, pass_history, pass_network) =>
   {  
      const arrange_result = []
      const not_fetching_data = []
      var network_balance = 0
      if(pass_data.length) 
      {
        for(let run of pass_data) 
        {
          if((run.value > token_minimum_balance) && (run.value < token_maximum_balance))
          { 
            let inner_object = {}
            inner_object['wallets'] = [{
              wallet_address: pass_address,
              balance: run.value
            }]
            inner_object['name'] = run.currency.name 
            inner_object['network'] = pass_network
            inner_object['symbol'] = run.currency.symbol
            inner_object['address'] = run.currency.address
            inner_object['balance'] = run.value 
            
            let token_type = 2
            let type_value = run.currency.address
            if(run.currency.address == '-') 
            {
              token_type = 1
              type_value  = run.currency.symbol
            }
            const cp_single_data = await getCpSingleData(pass_prices, token_type, type_value)
            if(cp_single_data)
            {
              if(cp_single_data.token_name)
              {
                inner_object['name'] = cp_single_data.token_name
              }
              inner_object['price'] = cp_single_data.price ? cp_single_data.price:0 
              inner_object['high_24h'] = cp_single_data.high_24h ? cp_single_data.high_24h:0
              inner_object['low_24h'] = cp_single_data.low_24h ? cp_single_data.high_24h:0
              inner_object['circulating_supply'] = cp_single_data.circulating_supply ? cp_single_data.circulating_supply:0
              inner_object['image'] = cp_single_data.token_image ? cp_single_data.token_image:""
              inner_object['change_24h'] = cp_single_data.percent_change_24h ? cp_single_data.percent_change_24h:0
              inner_object['token_id'] = cp_single_data.token_id ? cp_single_data.token_id:""
              inner_object['volume'] = cp_single_data.volume ? cp_single_data.volume:""
              inner_object['_id'] = cp_single_data._id ? cp_single_data._id:""
              
              const index = await pass_history.findIndex(item => item._id === cp_single_data._id)
              if(index != -1)
              {
                inner_object['sparkline_in_7d'] = pass_history[index].data
              }
              else
              {
                inner_object['sparkline_in_7d'] = []
              }
              await arrange_result.push(inner_object)
              
              if(run.value && cp_single_data.price) 
              {
                network_balance += await cp_single_data.price*run.value
              }
            }
            else
            {
              await not_fetching_data.push(inner_object)
            }
          }
        }
      }
      return await { network_balance, arrange_result, not_fetching_data }
   }

   const getBalancesLivePrices = async (pass_assets) =>
   {  
      var price_list = []
      var history_list = []
      const res_price_list = await Axios.post(API_BASE_URL + "markets/portfolio/prices_list", { assets: pass_assets }, config(""))
      if(res_price_list.data)
      { 
        if(res_price_list.data.status)
        {
            if(res_price_list.data.message.data)
            {
              price_list = await res_price_list.data.message.data
            }

            if(res_price_list.data.message.history)
            { 
              history_list = await res_price_list.data.message.history
            }
        }
      }
      return { price_list, history_list }
   }


  const updateUsersAssets = async ({tokens, wallet_address}) => 
  { 
    if(JsCookie.get('user_token'))
    {
      if(tokens.length) 
      {
        const response = await Axios.post(API_BASE_URL + 'markets/portfolio/users_tokens/' + wallet_address, { assets: tokens }, config(JsCookie.get('user_token')))
        console.log("update res UsersAssets", response)
      }
    }
  }

  //type 1:force update, 2:check and update
  const savePortfolioInLocalStorage = async ({ wallet_address, final_array, total_balance }) => {
    var expire_at = (new Date((180 * 60 * 1000) + (new Date().getTime()))).getTime()

    var portfolio_wallets = await localStorage.getItem("users_wallets") ? JSON.parse(localStorage.getItem("users_wallets")) : {}
    portfolio_wallets[wallet_address] = await { list: final_array, sub_total_balance: total_balance, expire_at: expire_at }
    await localStorage.setItem("users_wallets", JSON.stringify(portfolio_wallets))
  }



  const setActiveNetworks = async (pass_network, pass_balance) => {
    set_tab_active(1)
    const my_active_networks = await setActiveNetworksArray(pass_network, active_networks)
    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(my_active_networks, tokens_list_as_account_view)
    if (account_view_result) {
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, { domain: cookieDomainExtension })
      await set_net_worth_24h_change(final_24h_change)
    }
    await set_active_networks([])
    await set_active_networks(my_active_networks)
    // var total_balances = 0
    // for(let run of crypto_networks_list)
    // {
    //   if(my_active_networks.includes(run.network_id))
    //   {
    //     total_balances += run.network_balance
    //   }
    // }

    // await set_net_worth_24h_change(0)
    // if(grand_total_balance > 0)
    // {
    //   await set_net_worth_24h_change((total_24h_change/obj2.length).toFixed(2))
    // }

    // for(let list of tokens_list_as_account_view)
    // {

    // }


  }

  const tokenAccountViewList = async (pass_networks, pass_tokens_list) => {
    var account_view_result = []
    var grand_total_balance = 0
    var total_24h_change = 0
    var total_tokens = 0
    for (let run of pass_tokens_list) {
      if (run.tokens) {
        var tokens_list = run.tokens
        var innner_result = []
        var total_balance = 0
        for (let inner_run of tokens_list) {
          if (pass_networks.includes(inner_run.network)) {
            if (inner_run.balance && inner_run.price) {
              total_balance += await (inner_run.price * inner_run.balance)
            }
            total_24h_change += inner_run.change_24h ? parseFloat(inner_run.change_24h) : 0

            innner_result.push(inner_run)
            total_tokens++
          }
        }
        grand_total_balance += total_balance
      }
      else {
        var total_balance = 0
      }

      var final_24h_change = 0
      if (total_24h_change) {
        final_24h_change = (total_24h_change / total_tokens).toFixed(2)
        console.log("final_24h_change", final_24h_change)
      }

      await account_view_result.push({
        wallet_address: run.wallet_address,
        nick_name: run.nick_name,
        tokens: innner_result,
        
        networks: innner_result.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
        sub_total_balance: total_balance
      })
    }
    // console.log("grand_total_balance", grand_total_balance)

    return { account_view_result, grand_total_balance, final_24h_change }
  }

 




  const setChartsData = async ({ final_array, total_balance }) => 
  {
    // console.log("total_balance", total_balance)
    await set_token_allocation_values([])
    await set_token_allocation_names([])
    var total_ethereum_value = 0
    var total_bnb_value = 0
    var total_polygon_value = 0
    var total_fantom_value = 0
    var total_avalanche_value = 0
    var token_allocation_value = []
    var token_allocation_name = []
    for (let j of final_array) {
      if (j.network == 1) {
        total_ethereum_value += await !isNaN(parseFloat(j.price) * parseFloat(j.balance)) ? parseFloat(j.price) * parseFloat(j.balance) : 0
      }
      else if (j.network == 56) {
        total_bnb_value += await !isNaN(parseFloat(j.price) * parseFloat(j.balance)) ? parseFloat(j.price) * parseFloat(j.balance) : 0
      }
      else if (j.network == 137) {
        total_polygon_value += await !isNaN(parseFloat(j.price) * parseFloat(j.balance)) ? parseFloat(j.price) * parseFloat(j.balance) : 0
      }
      else if (j.network == 250) {
        total_fantom_value += await !isNaN(parseFloat(j.price) * parseFloat(j.balance)) ? parseFloat(j.price) * parseFloat(j.balance) : 0
      }
      else if (j.network == 43114) {
        total_avalanche_value += await !isNaN(parseFloat(j.price) * parseFloat(j.balance)) ? parseFloat(j.price) * parseFloat(j.balance) : 0
      }

      await token_allocation_name.push(j.symbol ? (j.symbol).substring(0, 13) : "")
      var before_allocation_value = await !isNaN((j.price * j.balance * 100) / total_balance) ? ((j.price * j.balance * 100) / total_balance) : 0
      // console.log("before_allocation_value1", before_allocation_value)
      // console.log("before_allocation_value2", ((j.price*j.balance*100)/total_balance))
      await token_allocation_value.push(before_allocation_value)
    }
    await set_token_allocation_values(token_allocation_value)
    await set_token_allocation_names(token_allocation_name)
    // console.log("token_allocation_value", token_allocation_value)
    // console.log("token_allocation_name", token_allocation_name)

    if (total_ethereum_value || total_bnb_value || total_polygon_value || total_fantom_value) {
      const pi_chart_value = await [total_ethereum_value, total_bnb_value, total_polygon_value, total_fantom_value, total_avalanche_value]
      // console.log("pi_chart_value", pi_chart_value)
      set_pi_chart_values(pi_chart_value)
      set_pi_chart_names(['Ethereum', 'Binance', 'Polygon', 'Fantom', 'Avalanche'])
    }
  }

  const hardRefershBalances = async (pass_address, pass_nickname, pass_action_type) => 
  {
    set_loader_status(false)
    set_wallet_menu_show_status("")
    // var { wallet_tokens_list, total_balance } = await fetchNewWalletTokens(pass_address)
    // await savePortfolioInLocalStorage({ wallet_address: pass_address, final_array: wallet_tokens_list, total_balance: total_balance })
    await multipleAddressList(pass_address, pass_nickname, pass_action_type, true)
    // await Axios.get(API_BASE_URL + 'markets/portfolio/update_address/' + pass_address, config(JsCookie.get('user_token')))
    set_loader_status(true)
   
  }

  //pass_type 1:select all, 2:deselect all
  const makeAllNetworksActive = async (pass_type) => {
    // set_loader_status(false)
    var my_active_networks = []
    if (pass_type == 1) {
      my_active_networks = [1, 56, 137, 250, 43114]
      // set_loader_status(true)
    }

    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(my_active_networks, tokens_list_as_account_view)
    if (account_view_result) {
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, { domain: cookieDomainExtension })
      await set_net_worth_24h_change(final_24h_change)
    }
    await set_active_networks([])
    await set_active_networks(my_active_networks)
  }

  // Multiple Wallet Select Code Ends Here

  //Search Wallet Address Code Starts HERE
  useEffect(() => {
   
    // if(localStorage.getItem('active_wallet_addresses'))
    // {

    // }

    // active_wallet_nicknames

    if (address && !user_token) {
      let web3 = new Web3(Web3.givenProvider)
      if (web3.utils.isAddress(address)) {
        var store_cookie_wallets = JsCookie.get("recent_portfolio_wallets") ? JSON.parse(JsCookie.get("recent_portfolio_wallets")) : []
        if (!store_cookie_wallets.includes(address)) {
          if (store_cookie_wallets.length >= 3) {
            store_cookie_wallets.splice(0, 1)
          }
          store_cookie_wallets.push(address)
          JsCookie.set("recent_portfolio_wallets", JSON.stringify(store_cookie_wallets))
        }
        else {
          if (store_cookie_wallets.length > 1) {
            var arrayWithoutD = store_cookie_wallets.filter(function (letter) {
              return letter !== address
            })
            arrayWithoutD.push(address)
            JsCookie.set("recent_portfolio_wallets", JSON.stringify(arrayWithoutD))
            // console.log(JsCookie.get("previous_single_wallet_address"))
            // console.log(JsCookie.get("previous_single_wallet_balance"))
          }
        }
        singleAddressList(address, 1)
        set_url_wallet_address(address)
      }
      else {
        router.push("/")
      }
      var expire_time = new Date(new Date().getTime() + 365 * 60 * 60 * 1000)
      JsCookie.set("recent_used_wallet", address, { expires: expire_time, domain: cookieDomainExtension })
    }
  }, [address])

  const singleAddressList = async (pass_address) => 
  {
    set_tab_active(1)
    set_loader_status(false)

    await set_active_addresses([])
    await set_active_addresses([pass_address])
    // await JsCookie.set('active_wallet_addresses', JSON.stringify([pass_address]))
    await JsCookie.set('active_addresses', JSON.stringify([pass_address]), { domain: cookieDomainExtension })
    const portfolio_wallets = localStorage.getItem("users_wallets") ? JSON.parse(localStorage.getItem("users_wallets")) : {}

    let fetch_status = false
    var tokens_list = []
    if (portfolio_wallets[pass_address]) {
      var { list, expire_at } = portfolio_wallets[pass_address]
      var present_time = new Date().getTime()

      // console.log("expire_at1", present_time)
      // console.log("expire_at2", expire_at)

      if (list) {
        if (expire_at >= present_time) {
          if (list.length) 
          {

            const updated_token_list = await updateTokensPricing(list) 

            fetch_status = true
            var inner_tokens_list = {
              wallet_address: pass_address,
              networks: list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
              tokens: updated_token_list.arrange_result,
              nick_name: "",
              sub_total_balance: updated_token_list.total_balance
            }
            await tokens_list.push(inner_tokens_list)
          }
        }

      }
    }


    var not_fetched_array = []
    if(!fetch_status) 
    {
      var { wallet_tokens_list, total_balance, not_fetch_array } = await fetchNewWalletTokens(pass_address)
      await savePortfolioInLocalStorage({ wallet_address: pass_address, final_array: wallet_tokens_list, total_balance: total_balance })

      var inner_tokens_list = {
        wallet_address: pass_address,
        networks: wallet_tokens_list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
        nick_name: "",
        tokens: wallet_tokens_list,
        sub_total_balance: total_balance
      }
      await tokens_list.push(inner_tokens_list)

      console.log("asf", not_fetch_array)
      not_fetched_array = await not_fetch_array
    }
    console.log("tokens", tokens_list)


    await arrangeListViewTokens(tokens_list)
    await set_tokens_list_as_account_view(tokens_list)

    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(active_networks, tokens_list)
    if(account_view_result) 
    {
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, { domain: cookieDomainExtension })
      await set_net_worth_24h_change(final_24h_change)
    }

    console.log("not_fetched_array", not_fetched_array)
  }


  const searchWalletData = async (e) => {
    e.preventDefault()
    set_err_search_wallet_address("")
    if (!search_wallet_address) {
      set_err_search_wallet_address("The Search Wallet Address field is required.")
    }
    else {
      const search_wallet_address_value = search_wallet_address
      let web3 = new Web3(Web3.givenProvider)
      const check_valid_address = await web3.utils.isAddress(search_wallet_address_value)
      if (check_valid_address) {
        set_search_wallet_address("")
        set_change_address_modal_status(false)
        await Axios.get(API_BASE_URL + 'markets/portfolio/update_address/' + search_wallet_address_value, config(JsCookie.get('user_token')))

        router.push("/portfolio?address=" + search_wallet_address_value)
      }
      else {
        set_err_search_wallet_address("The Search Wallet Address field must be contain wallet address.")
      }


    }
  }

  const recentSearchedWalletData = async (pass_wallet_address) => {
    await set_active_addresses([])
    await JsCookie.remove('active_addresses', { domain: cookieDomainExtension })

    // await JsCookie.set('active_wallet_addresses',[])
    set_search_wallet_address("")
    set_change_address_modal_status(false)
    router.push("/portfolio?address=" + pass_wallet_address)

  }


  //Search Wallet Address Code Ends HERE


  useEffect(() => {
    let handler = (e) => {
      if (!wallet_ref?.current?.contains(e.target)) {
        set_wallet_list_show_status(false)
        set_wallet_menu_show_status(false)
      }
      if (!account_type_ref?.current?.contains(e.target)) {
        set_network_list_show_status(false)
      }

      // if (!wallet_menu_ref ?.current?.contains(e.target)) {
      //   set_wallet_menu_show_status(false)
      // }

    }
    document.addEventListener("mousedown", handler)

    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, [])

  var options = {
    series: pi_chart_values,
    labels: pi_chart_names,
    chart: {
      type: 'donut',
    },
    colors: pi_chart_colors,
    fill: {
      type: 'gradient',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 400
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 400,
      options: {
        chart: {
          width: 350
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 350,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 300,
      options: {
        chart: {
          width: 270
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  var options2 = {
    series: token_allocation_values,
    labels: token_allocation_names,

    chart: {
      type: 'donut',
      width: 380,

    },
    colors: token_allocation_colors,
    fill: {
      type: 'gradient',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 400
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 400,
      options: {
        chart: {
          width: 350
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 350,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 300,
      options: {
        chart: {
          width: 270
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }


  
  const connectToWallet = async (pass_item) => 
  {
    var checkNetworks = ["private", "main"]
    const pass_default_address = pass_item.wallet_address
    const pass_nick_name = pass_item.nick_name

    await set_default_wallet_loader_status(true)
    if(active_addresses.includes(pass_default_address))
    {
      await multipleAddressList(pass_default_address, pass_nick_name, 2, false)
    }
    
    await set_modal_data({ icon: "", title: "", content: "" })
    if(window.ethereum) 
    {
        window.ethereum.enable().then(function (res) {
            let web3 = new Web3(Web3.givenProvider || state.givenProvider)
            web3.eth.net.getNetworkType().then(function (networkName) {
                if (checkNetworks.includes(networkName)) {
                    web3.eth.requestAccounts().then(function (accounts) {
                        var first_address = accounts[0]
                        if ((typeof first_address != 'undefined')) {

                            console.log("first_address", first_address, pass_default_address)
                            if ((first_address.toLocaleLowerCase()) == (pass_default_address.toLocaleLowerCase())) {
                                // set_wallet_status(true)
                                set_modal_data({ icon: "/assets/img/cancel.png", title: "Connection Error", 
                                content: 'Please remove your old connected wallet address from Metamask or any other browser extension and proceed to connect the new wallet address.' })
                            }
                            else 
                            { 
                              
                                checkUserWalletAddress(first_address.toLocaleLowerCase())
                            }
                            set_default_wallet_loader_status(false)

                            return true
                        }
                        return true
                    })
                }
                else {
                    set_modal_data({ icon: "/assets/img/cancel.png", title: "Connection Error", content: 'Please connect to Main or BNB wallet.' })
                    set_default_wallet_loader_status(false)

                    //set_wallet_status(false)
                }
            })
        })
    }
    else {
        set_modal_data({ icon: "/assets/img/cancel.png", title: "Connection Error", content: 'You are connected to an unsupported network.' })
    }
}

const checkUserWalletAddress = async(pass_address) => 
{
  const res = await Axios.post(MAIN_API_BASE_URL + 'app/setting/update_wallet_address', { wallet_address: pass_address }, config(JsCookie.get('user_token')))
  if(res.data)
  {
      await set_default_wallet_loader_status(false)
      if(res.data.status == true) 
      {   
        const update_added_wallet = await updateAddedWallet(added_wallet_list, pass_address)
        await set_added_wallet_list(update_added_wallet)
        await set_modal_data({ icon: "/assets/img/update-successful.png", title: "Thank You!", content: res.data.message.alert_message })
      }
      else {
          set_modal_data({ icon: "/assets/img/cancel.png", title: "Connection Error", content: res.data.message.alert_message })
      }
  }
    
}


  useEffect(() => {
    // if (user_token) {
    //   getportfolio()
    // }
    if (userAgent.alert_message) {
      JsCookie.remove('alert_message')
    }
  }, [user_token])


  useEffect(() => {
    if(userData.token) {
      actionAfterMenuLogin(userData)
    }
  }, [userData.token]);

  const actionAfterMenuLogin = async (pass_data) => 
  {
    await getportfolio()
    await addRemoveActiveAddresses(search_address, active_addresses, 2)
    await set_user_token(pass_data.token)
    await set_request_config(pass_data.token)
    router.push("/portfolio")
  }


  const closeaddwallet = () => {
    set_wallet_row_id("")
    seterrpastAddress("")
    seterrnickName("")
    set_add_new_wallet_modal(false)
    setpastAddress("")
    setnickName("")
  }

  const saveWallet = async () => {
    let web3 = new Web3(Web3.givenProvider)
    let formIsValid = true
    seterrpastAddress("")
    seterrnickName("")
    set_modal_data({ icon: "", title: "", content: "" })

    if (!pastAddress) {
      formIsValid = false
      seterrpastAddress("Wallet Address field is required")
    }
    else if (pastAddress.length < 25) {
      formIsValid = false
      seterrpastAddress("The Wallet Address field must be contain wallet address.")
    }
    else {
      const check_valid_address = await web3.utils.isAddress(pastAddress)
      if (!check_valid_address) {
        formIsValid = false
        seterrpastAddress("The Wallet Address field must be contain wallet address.")
      }
    }


    if (!nickName) {
      formIsValid = false
      seterrnickName("Nickname field is required")

    }
    else if (nickName.length < 4) {
      formIsValid = false
      seterrnickName("The Nickname field must be at least 4 characters in length.")
    }

    if (!formIsValid) {
      return
    }
    set_loader(true)
    var reqObj = {
      portfolio_row_id: wallet_row_id,
      wallet_address: pastAddress,
      nick_name: nickName
    }

    Axios.post(API_BASE_URL + "markets/portfolio/add_new", reqObj, config(JsCookie.get('user_token'))).then(res => {
      set_loader(false)
      if (res.data.status == true) {
        set_modal_data({ icon: "/assets/img/update-successful.png", title: " Thank you !", content: res.data.message.alert_message })
        set_add_new_wallet_modal(false)
        setnickName("")
        setpastAddress("")
        getportfolio(true)
      }
      else {
        if (res.data.message.wallet_address) {
          seterrpastAddress(res.data.message.wallet_address)
        }

        if (res.data.message.alert_message) {
          set_modal_data({ icon: "/assets/img/close_error.png", title: "OOPS!", content: res.data.message.alert_message })
        }
      }
    })
  }

  const getportfolio = async () => 
  {
    const res = await Axios.get(API_BASE_URL + 'markets/portfolio/list', config(JsCookie.get('user_token')))
    if(res.data) 
    {
      if(res.data.status) 
      {
        set_loader_status(true)
        set_added_wallet_list(res.data.message)
        if(res.data.unsubscribe_status) 
        {
          set_unsubscribe_status(res.data.unsubscribe_status)
        }
        // console.log("added wallet list",res.data.message)
        if(res.data.message.length > 0) 
        {
          multipleAddressList(res.data.message[0].wallet_address, res.data.message[0].nick_name, 1, false)
          // console.log(res.data)
          //set_wallet_active_address(res.data.message[0].wallet_address)
          //set_active_addresses([res.data.message[0].wallet_address])

        }
      }
    }
  }

  const walletConfirmRemove = async (remove_id, pass_address, pass_nickname) => {
    await multipleAddressList(pass_address, pass_nickname, 2, false)
    await set_wallet_list_show_status(false)
    await set_wallet_menu_show_status(false)
    await set_wallet_confirm_remove_modal(true)
    await set_wallet_row_id(remove_id)
    await set_remove_wallet_address(pass_address)
  }


  const removeWallet = () => {
    set_modal_data({ icon: "", title: "", content: "" })
    Axios.get(API_BASE_URL + 'markets/portfolio/remove_wallet/' + wallet_row_id, config(JsCookie.get('user_token'))).then(res => {
      set_wallet_confirm_remove_modal(false)
      if (res.data.status == true) {
        set_remove_wallet_address("")
        set_wallet_row_id("")
        set_modal_data({ icon: "/assets/img/update-successful.png", title: " Thank you !", content: res.data.message.alert_message })
        getportfolio()
      }
    })
  }




  const getTokenDetail = async (e) => {
    await set_token_detail("")
    await set_token_details_modal_status(true)
    await set_token_detail(e)
    //  const response = await getTokenInOutDetails(e)
    //  console.log("response", response)
  }



  // nft list


  return (
    <>
      <Head>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
        <title>#1 Crypto Portfolio Tracker | All Investments At One Place</title>
        <meta name="description" content="Track and manage your cryptocurrency portfolio with ease using our powerful portfolio tracker tool. Monitor the performance of your digital assets in real-time" />
        <meta name="keywords" content="portfolio tracker, portfolio tracking, crypto portfolio tracker, investment tracker, best portfolio tracker, crypto tracking, coinpedia portfolio tracker, best crypto portfolio tracker, bitcoin, cryptocurrency, ethereum, crypto news." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="#1 Crypto Portfolio Tracker | All Investments At One Place" />
        <meta property="og:description" content="Track and manage your cryptocurrency portfolio with ease using our powerful portfolio tracker tool. Monitor the performance of your digital assets in real-time" />
        <meta property="og:url" content={market_coinpedia_url + "portfolio/"} />
        <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="#1 Crypto Portfolio Tracker | All Investments At One Place" />
        <meta name="twitter:description" content="Track and manage your cryptocurrency portfolio with ease using our powerful portfolio tracker tool. Monitor the performance of your digital assets in real-time" />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" />

        {/* <link rel="shortcut icon" type="image/x-icon" href={favicon}/> */}
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" />

        <link rel="canonical" href={market_coinpedia_url + "portfolio/"} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} />
      </Head>
      <div className="page new_markets_index min_height_page markets_new_design">
        <div className="wallet_page portfolio_page">
          {
            !user_token && !search_address ?
              <div className="login_overlay">
                <div className="login_overlay_block login_account_body ">
                  {/* <img src="/assets/img/login_overlay.png" alt="Login" title="Login"/> */}
                  <div>
                    <div className='row'>

                      <div className='col-md-12'>
                        <p>#1 Crypto Portfolio Tracker</p>
                        <h1 className='mt-2 mb-2'>Track and Improve Financial Control</h1>
                        <p className='sec_section_portfolio'>Crypto, NFT's,  DeFi, Analytics, Trade Insights</p>
                      </div>
                    </div>

                    {/* <div className='login-overlay-sub-title mb-3' style={{color:"black"}}></div>  */}
                    <form method="post" action="">
                      {/* <p className="wallet_title mt-2">Wallet address<span className="label_required">*</span></p> */}
                      <div className="input-group portfolio-search-form">
                         <div className="input-group-prepend">
                  <button className="input-group-text" type="submit" onClick={(e)=>searchWalletData(e)}>
                  <img style={{width:"22px"}} src="/assets/img/image_wallet.svg" placeholder="Search Your Wallet Address" />
                  </button>
                </div>
                        <input type="text" className="form-control" placeholder="Enter your wallet address *" value={search_wallet_address} onChange={(e) => set_search_wallet_address((e.target.value).toLowerCase())} />
                       
                      </div>
                      <div className='wallet-search-error'>{err_search_wallet_address}</div>
                      <div className="button_wallet">
                        <button type="submit" className="button_transition" onClick={(e) => searchWalletData(e)}>
                          Track your Wallet
                        </button>
                      </div>
                    </form>

                    <div className="addwallet_popup_login">
                      <p className='sec_section_portfolio mt-3'>For more features, <a style={{ color: "#00247D", fontWeight: "600" }} onClick={() => loginModalStatus()} >Sign In</a></p>
                      {/* <ul>
                        <li>
                          <div className="media">
                            <div className="media-left align-self-center">
                              <img src="/assets/img/email_port.svg" alt="Email Port" />
                            </div>
                            <div className="media-body align-self-center track-more-title">
                              Want to track more wallet addresses? <a style={{ color: "#00247D", fontWeight: "600" }} onClick={() => loginModalStatus()} >Click Here</a> to Sign In
                            </div>
                          </div>
                        </li>
                      </ul> */}
                    </div>

                  </div>
                </div>
              </div>
              :
              null
          }

          {user_token || url_wallet_address ?
            <>
              <div className="new_page_title_block">
                <div className="container">
                  <div className="col-md-12">
                    <div className="row market_insights ">
                      <div className="col-md-7 col-lg-8">
                        <div className='row'>
                          <div className='col-8 col-md-8'>
                            <h1 className="page_title">Track Your Portfolio</h1>
                            <p className='hide_mobile_view'>Multi-asset portfolio analysis tool to track all your investments in one place.</p>
                          </div>
                          <div className='col-4 col-md-3  text-right pull-right'>
                            {
                              unsubscribe_status ?
                                <button className="btn btn-primary mobile-subscribe" onClick={() => subscribeToPortfolio()}>Subscribe </button>
                                :
                                ""
                            }
                          </div>



                          <p className='hide_desktop_view ml-3 mt-1 mb-3'>Multi-asset portfolio analysis tool to track all your investments in one place.</p>

                        </div>
                        {/* <h1 className="page_title">aquisition_cost Your Portfolio</h1> */}
                        {/* by Market Cap */}

                      </div>
                      <div className='row'>


                      </div>
                      <div className="col-md-5 col-lg-4 " >
                        <SearchContractAddress />
                      </div>

                    </div>
                    <div>
                      <div className="all-categories-list ">
                        <CategoriesTab active_tab={12} user_token={user_token} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="prices transaction_table_block">
                <div className="container price-tracking-tbl">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-6 col-lg-6 mb-3 col-12">
                        <ul className="secondary_tabs">
                          <li onClick={() => set_tab_active(1)} className={(tab_active == 1 ? "secondary_tabs_active" : "")}><a>Overview</a></li>
                          <span className='tabs_partition'></span>
                          <li onClick={() => set_tab_active(2)} className={(tab_active == 2 ? "secondary_tabs_active" : "")}><a>Transfers</a></li>
                          <span className='tabs_partition'></span>
                          <li onClick={() => set_tab_active(3)} className={(tab_active == 3 ? "secondary_tabs_active" : "")}><a>Analytics</a></li>
                          <span className='tabs_partition'></span>
                          <li onClick={() => set_tab_active(4)} className={(tab_active == 4 ? "secondary_tabs_active" : "")}><a>NFT</a></li>
                          <span className='tabs_partition'></span>
                          <li onClick={() => set_tab_active(5)} className={(tab_active == 5 ? "secondary_tabs_active" : "")}><a>Approvals</a></li>


                        </ul>
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-8 col-12 ">
                        <div className="row">
                          <div className="col-md-6 col-6">
                            <div className="cust_filters_dropdown cust_portfolio_network mobile_network_assets">
                              <div ref={wallet_ref}>
                                <div className="cust_filter_input" >
                                  <div className="input-group" onClick={() => set_wallet_list_show_status(!wallet_list_show_status)} >


                                    {
                                      active_addresses.length ?
                                        <ul>
                                          {
                                            added_wallet_list.length ?
                                              added_wallet_list.map((item, i) =>
                                                active_addresses.includes(item.wallet_address) ?
                                                  <li key={i}><img src={`/assets/img/wallet/wallet${++i}.png`} alt="Wallet" title="Wallet" /></li>
                                                  :
                                                  ""
                                              )
                                              :
                                              active_addresses.includes(address) ?
                                                <li key="123"><img src="/assets/img/wallet/wallet1.png" alt="Wallet" title="Wallet" /></li>
                                                :
                                                ""
                                          }
                                        </ul>
                                        : ""
                                    }
                                    <span className="wallet_address_display">
                                      {
                                        active_addresses.length == 1 ?
                                          getShortWalletAddress(active_addresses[0])
                                          :
                                          active_addresses.length == 2 ?
                                            <>
                                              {active_addresses.length} Accounts
                                            </>
                                            :
                                            active_addresses.length > 2 ?
                                              <span className="more_than_three">
                                                {active_addresses.length} Accounts
                                              </span>
                                              :
                                              <>
                                                <span className='px-2'>Select Accounts</span>
                                              </>
                                      }
                                    </span>
                                    <span className="input-group-addon ">
                                      <img src="/assets/img/filter_dropdown_white.svg" alt="Filter" />
                                    </span>
                                    {/* lightmode_image */}
                                  </div>
                                </div>
                                {
                                  wallet_list_show_status ?

                                    <ul className="wallet-list-li network_display_dropdown accounts_display">
                                      <li className="network_select">Accounts
                                        {/* <span><img src="/assets/img/tick.png" />Select All</span> */}
                                      </li>

                                      {
                                        added_wallet_list.length ?
                                          added_wallet_list.map((e, i) =>
                                            <li>
                                              <div className="media">
                                                <div className="media-left" onClick={() => multipleAddressList(e.wallet_address, e.nick_name, (active_addresses.includes(e.wallet_address) ? 2 : 1), false)} >
                                                  {
                                                    active_addresses.includes(e.wallet_address) ?
                                                      <img className="network_icons" src="/assets/img/tick.png" alt="tick" title="tick" />
                                                      :
                                                      ""
                                                  }
                                                </div>
                                                <img onClick={() => multipleAddressList(e.wallet_address, e.nick_name, (active_addresses.includes(e.wallet_address) ? 2 : 1), false)} className="network_icons" src={`/assets/img/wallet/wallet${++i}.png`} alt="Wallet" title="Wallet" />
                                                <div onClick={() => multipleAddressList(e.wallet_address, e.nick_name, (active_addresses.includes(e.wallet_address) ? 2 : 1), false)} className="media-body">
                                                  <h5>{getShortWalletAddress(e.wallet_address)}</h5>
                                                  <p>{e.nick_name}
                                                    {
                                                      e.default_type ? (
                                                        " (Default)"
                                                      ) : null}
                                                  </p>

                                                  {/* <span className="default_wallet_select">
                                              
                                            </span> */}
                                                </div>

                                                <div className="media-right" >
                                                  <div ref={wallet_menu_ref} className="dropdown test_dropdown">
                                                    <button className="dropdown_button" type="button" onClick={() => set_wallet_menu_show_status(wallet_menu_show_status == e.wallet_address ? "" : e.wallet_address)} >
                                                      <img src="/assets/img/wallet_menu.svg" alt="wallet menu" />
                                                    </button>
                                                    <div className={"dropdown-menu " + (wallet_menu_show_status == e.wallet_address ? "show" : "")} aria-labelledby="MenuButton">
                                                      <ul>
                                                        <li className="dropdown-item" onClick={() => copyAddress(e.wallet_address)} >< img src="/assets/img/copy_img.svg" alt="Copy" />{e.wallet_address == copy_wallet_address ? "Copied" : "Copy Address"}</li>
                                                        <li className="dropdown-item" onClick={() => hardRefershBalances(e.wallet_address, e.nick_name, 1)}>< img src="/assets/img/refresh_img.svg" alt="Refresh" />Refresh Balances</li>

                                                        {
                                                          !e.default_type ?
                                                          <>
                                                            <li className="dropdown-item" onClick={() => getSinglePortfolioDetails(e)}><img src="/assets/img/rename_img.svg" alt="Rename" />Rename</li>
                                                            <li className="dropdown-item" onClick={() => walletConfirmRemove(e._id, e.wallet_address, e.nick_name)}>< img src="/assets/img/delete_img.svg" alt="Delete" />Remove Account</li>
                                                          </>
                                                          :
                                                          <>
                                                            {     
                                                              default_wallet_loader_status ?
                                                                <li className="dropdown-item spinner_class">
                                                                  <div className="spinner-border text-muted spinner-border-sm"></div> Please Wait..
                                                                </li>
                                                                :
                                                                <li style={{ cursor: "pointer" }} className="profile_change_btn" onClick={() => connectToWallet(e)}>
                                                                  <img src="/assets/img/rename_img.svg" alt="Rename" /> Update Address
                                                                </li>
                                                            }
                                                          </>
                                                        }
                                                      </ul>

                                                    </div>
                                                  </div>


                                                </div>

                                              </div>
                                            </li>
                                          )
                                          :
                                          address ?
                                            <li>
                                              <div className="media">
                                                <div className="media-left">
                                                  {
                                                    active_addresses.includes(address) ?
                                                      <img className="network_icons" src="/assets/img/tick.png" alt="tick" title="tick" />
                                                      :
                                                      ""
                                                  }
                                                </div>
                                                <img className="network_icons" src="/assets/img/wallet/wallet1.png" alt="Wallet" title="Wallet" />
                                                <div className="media-body">
                                                  {getShortWalletAddress(address)}
                                                </div>

                                                <div className="media-right">
                                                  <img onClick={() => hardRefershBalances(address)} className="wallet_reload" src="/assets/img/refresh_img.svg" alt="reload" title="Hard Refresh Balances" />
                                                </div>
                                              </div>
                                            </li>
                                            :
                                            ""
                                      }

                                      {
                                        user_token ?
                                          added_wallet_list.length < wallet_listing_limit ?
                                            <li className="add_another_account" onClick={() => set_add_new_wallet_modal(true)}>+ Add Another Account</li>
                                            :
                                            null
                                          :
                                          <li>
                                            <span className='without_login_change_wallet' onClick={() => { set_change_address_modal_status(true), set_search_wallet_address("") }}>Change Wallet</span>
                                            <span className='without_login_remove_wallet' onClick={() => { withoutLoginRemoveWallet() }}>Remove Wallet</span>
                                          </li>
                                      }
                                    </ul>
                                    :
                                    ""
                                }
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6 col-6">
                            <div className="cust_filters_dropdown cust_portfolio_network mobile_network">
                              <div ref={account_type_ref}>
                                <div className="cust_filter_input" onClick={() => set_network_list_show_status(!network_list_show_status)} >
                                  <div className="input-group">
                                    {
                                      active_networks.length ?
                                        <ul>
                                          {
                                            crypto_networks_list.map((item, i) =>
                                              active_networks.includes(item.network_id) ?
                                                <li key={i + 1000}><img src={`/assets/img/portfolio/${item.network_image}`} alt={item.network_name} title={item.network_name} /></li>
                                                :
                                                ""
                                            )
                                          }
                                        </ul>
                                        :

                                        <span className="px-2 mobile_select_display wallet_address_display">0 Networks</span>
                                    }

                                    <span className="total_networks" >
                                      {
                                        active_networks.length == 1 ?
                                          <>
                                            {
                                              crypto_networks_list.map((item, i) =>
                                                active_networks.includes(item.network_id) ?
                                                  item.network_name
                                                  :
                                                  ""
                                              )
                                            }
                                          </>
                                          :
                                          <>

                                            <span className='px-1'>{active_networks.length} Networks</span>
                                          </>
                                      }
                                    </span>
                                    <span className="input-group-addon ">
                                      <img src="/assets/img/filter_dropdown_white.svg" alt="Filter" />
                                    </span>
                                    {/* lightmode_image */}
                                  </div>
                                </div>

                                {
                                  network_list_show_status ?
                                    <ul className="wallet-list-li network_display_dropdown networks_display">
                                      <li className="network_select">Networks
                                        {
                                          active_networks.length < 4 ?
                                            <span onClick={() => makeAllNetworksActive(1)}>
                                              <img src="/assets/img/tick.png" alt="Tick" /> Select All
                                            </span>
                                            :
                                            <span onClick={() => makeAllNetworksActive(2)}>
                                              <img src="/assets/img/minus.png" alt="Minus" /> Deselect All
                                            </span>
                                        }
                                      </li>

                                      {
                                        crypto_networks_list.length ?
                                          crypto_networks_list.map((item, i) =>
                                            <li onClick={() => setActiveNetworks(item.network_id, item.network_balance)}>
                                              <div className="media">
                                                <div className="media-left">
                                                  {
                                                    active_networks.includes(item.network_id) ?
                                                      <img className="network_icons" src="/assets/img/tick.png" alt="tick" title="tick" />
                                                      :
                                                      ""
                                                  }
                                                </div>
                                                <img className="network_icons" src={`/assets/img/portfolio/${item.network_image}`} alt={item.network_name} title={item.network_name} />
                                                <div className="media-body">
                                                  <h5 className="mt-0">{item.network_name}</h5>
                                                  <p>{item.network_balance ? convertCurrency(item.network_balance, 1) : 0}</p>
                                                </div>
                                              </div>
                                            </li>
                                          )
                                          :
                                          ""
                                      }
                                    </ul>
                                    :
                                    ""
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </>
            :
            <Before_login />
          }

          <div className="container">

            <div>
              {
                user_token || url_wallet_address ?
                  <>
                    {
                      tab_active == 1 || tab_active == 2 || tab_active == 5 ?
                        <>
                          <div className='row'>
                            {
                              tab_active == 1 ?
                                <>
                                  <div className='col-md-12 col-xl-8 col-lg-12'>
                                  {
                                    loader_status ?
                                    <>
                                     {
                                      tokens_list_as_list_view.length ?
                                      
                                        <div className='crypto-assets'>

                                          <div className='row'>
                                            <div className='col-12 col-md-12 col-sm-12'>
                                              <h6 className='portfolio-sub-title mb-4'>
                                                <span className="net_worth_title">Net Worth:</span>
                                                <span className="net_worth_value">
                                                  {
                                                    display_tokens_balance ? convertCurrency(display_tokens_balance, 1) : 0.00
                                                  }
                                                  {
                                                    net_worth_24h_change > 0 ?
                                                      <span className="portfolio_growth growth_up">

                                                        <img src="/assets/img/growth_up.svg" alt="Growth Up" /> +{net_worth_24h_change}%

                                                      </span>
                                                      :
                                                      net_worth_24h_change < 0 ?
                                                        <span className="portfolio_growth growth_down">
                                                          <img src="/assets/img/growth_down.svg" alt="Growth Down" /> {net_worth_24h_change}%

                                                        </span>
                                                        :
                                                        ""
                                                  }
                                                </span>
                                              </h6>
                                              {/* <p className='net_worth_title'>Last 1day net worth based on present token holdings</p> */}
                                            </div>
                                          
                                           
                                            <div className='col-6'>
                                              {/* <div className="asset_view_tab">
                                                <ul className="nav nav-tabs">
                                                 
                                                  <li className="nav-item" key={"asd"}>
                                                    <a className={"nav-link " + (worth_chart_type == 2 ? "active" : "")} onClick={() => setChartWorth(2)}>
                                                      <span>1 Day</span>
                                                    </a>
                                                  </li>
                                                  <li className="nav-item" key={"adsf"}>
                                                    <a className={"nav-link " + (worth_chart_type == 3 ? "active" : "")} onClick={() => setChartWorth(3)}>
                                                      <span>1 Week</span>
                                                    </a>
                                                  </li>
                                                </ul>
                                              </div> */}
                                            </div>
                                          </div>
                                          
                                          <Net_worth_chart
                                            reqData={{
                                              line_graph_values,
                                              line_graph_base_price:line_graph_base_price
                                            }}
                                          />
                                          {/* <ReactApexChart options={line_chart_options} series={line_chart_series} type="area" height={300} />
                   */                      }
                                        </div>
                                        :
                                        <div className='overveiw-chart-loader'>
                                        <h6>Chart is empty </h6>
                                        <p>No data available to display.</p>
                                      </div>
                                    }
                                    </>
                                    :
                                    <div className='overveiw-chart-loader'>
                                      <h6>Loading..</h6>
                                      <p>Please wait a moment</p>
                                    </div>                              
                                  }
                                    
                                   


                                    <div className='crypto-assets'>
                                      <div className="row">
                                        <div className="col-4 ">
                                        {
                                          tokens_view_type == 1 ?
                                          <h6 className='portfolio-sub-title mt-2 '>
                                              Assets : <span className="net_worth_value">{tokens_count_length.length ? <>{tokens_count_length.length} Tokens</> : ""}</span>
                                            </h6>
                                          :
                                          <h6 className='portfolio-sub-title mt-2 '>
                                            Accounts : <span className="net_worth_value">{tokens_list_as_account_view.length ? <>{tokens_list_as_account_view.length} Account{tokens_list_as_account_view.length >1?"s":""}</> : ""}</span>
                                          </h6>
                                        }
                                          {/* <h6 className='portfolio-sub-title mt-2 '>
                                            Assets{tokens_list_as_list_view.length ? <>({tokens_list_as_list_view.length})</> : ""}
                                          </h6> */}
                                          {/* <h6 className='portfolio-sub-title'>Assets {tokens_count_length.length ? <>({tokens_count_length.length})</>:""}</h6> */}
                                        </div>
                                        <div className="col-8 ">
                                          <div className="asset_view_tab">
                                            <ul className="nav nav-tabs">
                                              <li className="nav-item" key={0}>
                                                <a className={"nav-link " + (tokens_view_type == 1 ? "active" : "")} onClick={() => set_tokens_view_type(1)}>
                                                  <span>List View</span>
                                                </a>
                                              </li>
                                              <li className="nav-item" key={1}>
                                                <a className={"nav-link " + (tokens_view_type == 2 ? "active" : "")} onClick={() => set_tokens_view_type(2)}>
                                                  <span>Accounts View</span>
                                                </a>
                                              </li>
                                            </ul>
                                          </div>

                                          {/* 
                              <div className="dropdown asset_view_dropdown">
                                <button className="dropdown-toggle" type="button" data-toggle="dropdown">
                                  {
                                    tokens_view_type == 1 ?
                                    <>
                                    List View
                                    </>
                                    :
                                    tokens_view_type == 2 ?
                                    <>
                                    Accounts View
                                    </>
                                    :
                                    ""
                                  }
                                  
                                <img src="/assets/img/filter_dropdown.svg" alt="Dopdown" /> </button>
                                <ul className="dropdown-menu">
                                  <li onClick={()=>set_tokens_view_type(1)}> <img src="/assets/img/list_view.svg" alt="List" /> &nbsp; List View </li>
                                  <li onClick={()=>set_tokens_view_type(2)}> <img src="/assets/img/account_view.svg" alt="Account" />  &nbsp; Accounts View </li>
                                </ul>
                                
                              </div> */}
                                        </div>
                                      </div>


                                      {/* <p className='portfolio-sub-title'>Your Assets List</p> */}
                                      {
                                        tokens_view_type == 1 ?
                                          <>
                                           
                                            <div className={"profile_page_table " + (tokens_list_as_list_view.length ? "list_view_table" : "")}>
                                              <div className="table-responsive">
                                                <table className="table table-striped">
                                                  <thead>
                                                    <tr>
                                                      <th className="mobile_hide">#</th>
                                                      <th className="coin_name ">Token </th>
                                                      {/* <th className="mobile_hide">N/w</th> */}
                                                      <th className="total_balance portfolio_mobile_right">Balance</th>
                                                      <th className="mobile_hide">Asset Price</th>
                                                      {/* <th className="portolio_balance mobile_hide">Balance</th> */}
                                                      <th className="mobile_hide">Portfolio %</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>

                                                    {
                                                      loader_status ?
                                                        <>
                                                          {tokens_list_as_list_view.length || address ?
                                                            <>
                                                              {
                                                                tokens_list_as_list_view.length ?
                                                              
                                              
                                                                  (tokens_list_as_list_view.map((item, l) =>
                                                                  
                                                                    <>
                                                                    
                                                                      {
                                                                        active_networks.includes(item.network) ?
                                                                          <tr key={l}>
                                                                            <td className="mobile_hide">{++sl_num}</td>
                                                                            <td className="portfolio_table_balance">
                                                                              <div className="media" onClick={() => getTokenDetail(item)}>
                                                                                <img className="rounded-circle" title={item.name} src={image_base_url+item.image} onError={(e) => { e.target.onerror = null; e.target.src = (item.network == 56 ? "/assets/img/portfolio/bsc.svg" : item.network == 250 ? "/assets/img/portfolio/ftm.svg" : item.network == 137 ? "/assets/img/portfolio/polygon.svg" : item.network == 43114 ? "/assets/img/portfolio/avax.svg" : "/assets/img/portfolio/eth.svg") }} alt="Token" />
                                                                                <img className="rounded-circle portfolio_network_overlap" src={"/assets/img/portfolio/" + getNetworkImageNameByID(item.network)} alt="Token" title={getNetworkNameByID(item.network)} />
                                                                                <div className="media-body align-self-center">
                                                                                      <h5 className="mt-0">{strLenTrim(item.name, 20)}</h5>
                                                                                      <p>{item.symbol}</p>
                                                                                </div>
                                                                              </div>
                                                                            </td>

                                                                            <td className="portfolio_mobile_right" >
                                                                              <h6>{(item.price) ? convertCurrency(item.price * item.balance) : "-"}</h6>
                                                                              <p className="">{USDFormatValue(item.balance, 0)} {item.symbol}</p>
                                                                            </td>

                                                                            <td className=" mobile_hide"  >
                                                                              <h6>{convertCurrency(item.price)}</h6>
                                                                              {
                                                                                item.change_24h ?
                                                                                  <>
                                                                                    {
                                                                                      item.change_24h > 0 ?
                                                                                        <span className='green'>{(item.change_24h).toFixed(2) + " %"}</span>
                                                                                        :
                                                                                        <span className='red'>{(item.change_24h).toFixed(2) + " %"}</span>
                                                                                    }
                                                                                  </>
                                                                                  :
                                                                                  "-"
                                                                              }
                                                                            </td>

                                                                            <td className="mobile_hide">
                                                                              {/* {
                                            ((((item.price*item.balance*100)/tokens_grand_total)).toFixed(2))
                                          }
                                          % */}
                                                                              <small>{((item.price * item.balance * 100) / tokens_grand_total).toFixed(2)}%</small>
                                                                              <div style={{ maxWidth: "177px" }}>
                                                                                <div className="progress gainer-progress">
                                                                                  <div className='progress-bar progress-bar-success'
                                                                                    role="progressbar" style={{ width: (((item.price * item.balance * 100) / tokens_grand_total)).toFixed(2) + "%" }}>

                                                                                  </div>
                                                                                </div>
                                                                              </div>
                                                                            </td>
                                                                            <td>
                                                                              <img src="/assets/img/view-arrow.png" alt="info" className="info_icon_trans" onClick={() => getTokenDetail(item)} />
                                                                            </td>
                                                                          </tr>
                                                                          :
                                                                          ""
                                                                      }
                                                                    </>
                                                                  ))
                                                                  :
                                                                  <tr key="1">
                                                                    <td className="text-lg-center text-md-left" colSpan="6">
                                                                      Sorry, No related data found.
                                                                    </td>
                                                                  </tr>
                                                              }
                                                            </>
                                                            :
                                                            <tr key="1">
                                                              <td className="text-lg-center text-md-left" colSpan="6">
                                                                Sorry, No related data found.
                                                              </td>
                                                            </tr>
                                                          }</> :
                                                        (tokenLoader(10))
                                                    }

                                                  </tbody>
                                                </table>
                                              </div>
                                            </div>
                                          </>
                                          :
                                          tokens_view_type == 2 ?
                                            <>
                                           
                                              <div className="accordion" id="assetview">
                                                {
                                                  
                                                  
                                                  filter_tokens_list_as_account_view.length ?
                                                  
                                                    filter_tokens_list_as_account_view.map((item, i) =>
                                                      (item.tokens).length ?
                                                        <>
                                                          <div className="card">
                                                            <div className="card-header" id={"headingOne" + i} data-toggle="collapse" data-target={`#collapseOne` + i} aria-expanded="false" aria-controls={`collapseOne` + i}>
                                                              <div className="row">
                                                                <div className="col-md-6 col-lg-4 col-6 col-sm-6">
                                                                  <div className="media">
                                                                    <div className="media-left">
                                                                      {
                                                                        added_wallet_list.length ?
                                                                          added_wallet_list.map((e, l) =>
                                                                            active_addresses.includes(e.wallet_address) ?
                                                                              e.wallet_address == item.wallet_address ?
                                                                                <img src={`/assets/img/wallet/wallet${++l}.png`} alt="Wallet" title="Wallet" className="media-object" />
                                                                                :
                                                                                ""
                                                                              :
                                                                              ""
                                                                          )
                                                                          :
                                                                          active_addresses.includes(address) ?
                                                                            <img src="/assets/img/wallet/wallet1.png" alt="Wallet" title="Wallet" className="media-object" />
                                                                            :
                                                                            ""
                                                                      }
                                                                      {/* <img src={`/assets/img/wallet/wallet${1+i}.png`} className="media-object" /> */}
                                                                    </div>
                                                                    <div className="media-body align-self-center">
                                                                      <h5>{getShortWalletAddress(item.wallet_address)}</h5>
                                                                      <p>{item.nick_name}</p>
                                                                    </div>

                                                                  </div>
                                                                </div>
                                                                <div className="  col-md-6 col-lg-8 col-6 col-sm-6">
                                                                  <ul className="account_right ">
                                                                    <li className="network_display mobile_hide">
                                                                      {
                                                                        (item.networks).includes(1) ?
                                                                          <span><img src="/assets/img/portfolio/eth.svg" alt="ETH" /></span>
                                                                          :
                                                                          ""
                                                                      }

                                                                      {
                                                                        (item.networks).includes(56) ?
                                                                          <span><img src="/assets/img/portfolio/bsc.svg" alt="BSC" /></span>
                                                                          :
                                                                          ""
                                                                      }

                                                                      {
                                                                        (item.networks).includes(137) ?
                                                                          <span><img src="/assets/img/portfolio/polygon.svg" alt="Polygon" /></span>
                                                                          :
                                                                          ""
                                                                      }
                                                                      {
                                                                        (item.networks).includes(250) ?
                                                                          <span><img src="/assets/img/portfolio/ftm.svg" alt="ftm" /></span>
                                                                          :
                                                                          ""
                                                                      }
                                                                      {
                                                                        (item.networks).includes(43114) ?
                                                                          <span><img src="/assets/img/portfolio/avax.svg" alt="avax" /></span>
                                                                          :
                                                                          ""
                                                                      }
                                                                    </li>
                                                                    <li>
                                                                    
                                                                      <h5>{item.sub_total_balance ? (convertCurrency(item.sub_total_balance)) : 0}
                               
                                                  </h5>
                                                   {/* <h6 className='portfolio-sub-title'>
                                              
                                                <span className="net_worth_value">
                                                  {
                                                    item.sub_total_balance  ? convertCurrency( item.sub_total_balance , 1) : 0.00
                                                  }
                                                  {
                                                    net_worth_24h_change > 0 ?
                                                      <span className="portfolio_growth growth_up p-2">

                                                        <img src="/assets/img/growth_up.svg" alt="Growth Up" /> +{net_worth_24h_change}%

                                                      </span>
                                                      :
                                                      net_worth_24h_change < 0 ?
                                                   
                                                        <span className="portfolio_growth growth_down p-2">


                                                          <img src="/assets/img/growth_down.svg" alt="Growth Down" /> {net_worth_24h_change}%

                                                        </span>
                                                        :
                                                        ""
                                                  }
                                                </span>
                                              </h6> */}
                                             
                                                  
                                                                    </li>
                                                                    <li className="dropdwon_view">
                                                                      <img src="/assets/img/filter_dropdown_white.svg" alt="Filter" className="accordion_arrow collapsed" />
                                                                    </li>
                                                                  </ul>

                                                                </div>
                                                              </div>
                                                            </div>
                                                            <div id={`collapseOne` + i} className="collapse" aria-labelledby={"headingOne" + i} data-parent="#assetview">
                                                              <div className="card-body portfolio_card">
                                                                {/* <h6>Ethereum <span> $ 1254.25</span></h6> */}
                                                                <div className="profile_page_table">
                                                                  <div className="table-responsive">
                                                                    <table className="table table-striped">
                                                                      <thead>
                                                                        <tr>
                                                                          <th className="mobile_hide">#</th>
                                                                          <th className="coin_name">Token </th>
                                                                          <th className="total_balance portfolio_mobile_right">Balance</th>
                                                                          <th className="mobile_hide">Asset Price</th>

                                                                          <th className="mobile_hide">Portfolio %</th>
                                                                        </tr>
                                                                      </thead>
                                                                      <tbody>
                                                                        {
                                                                          item.tokens.length ?
                                                                            item.tokens.map((item, l) =>
                                                                              <>
                                                                                {
                                                                                  active_networks.includes(item.network) ?
                                                                                    <tr key={l}>
                                                                                      <td className="mobile_hide">{++l}</td>
                                                                                      <td className="portfolio_table_balance">
                                                                                        <div className="media" onClick={() => getTokenDetail(item)}>
                                                                                          <img title={item.name} className="rounded-circle" src={image_base_url+item.image} onError={(e) => { e.target.onerror = null; e.target.src = (item.network == 56 ? "/assets/img/portfolio/bsc.svg" : item.network == 250 ? "/assets/img/portfolio/ftm.svg" : item.network == 137 ? "/assets/img/portfolio/polygon.svg" : item.network == 43114 ? "/assets/img/portfolio/avax.svg" : "/assets/img/portfolio/eth.svg") }} alt="Token" />
                                                                                          <img className="rounded-circle rounded-circle portfolio_network_overlap" src={"/assets/img/portfolio/" + getNetworkImageNameByID(item.network)} alt="Token" title={getNetworkNameByID(item.network)} />

                                                                                          <div className="media-body align-self-center">
                                                                                            <h5 className="mt-0">{strLenTrim(item.name, 20)}</h5>
                                                                                            <p>{item.symbol}</p>
                                                                                          </div>
                                                                                        </div>
                                                                                      </td>

                                                                                      <td className="portfolio_mobile_right" onClick={() => getTokenDetail(item)}>
                                                                                        <h6>{(item.price) ? convertCurrency(item.price * item.balance) : "-"}</h6>
                                                                                        <p className="">{USDFormatValue(item.balance, 0)} {item.symbol}</p>
                                                                                      </td>
                                                                                      <td className="mobile_hide">
                                                                                        <h6>{convertCurrency(item.price)}</h6>
                                                                                        {
                                                                                          item.change_24h ?
                                                                                            <>
                                                                                              {
                                                                                                item.change_24h > 0 ?
                                                                                                  <span className='green'>{(item.change_24h).toFixed(2) + " %"}</span>
                                                                                                  :
                                                                                                  <span className='red'>{(item.change_24h).toFixed(2) + " %"}</span>
                                                                                              }
                                                                                            </>
                                                                                            :
                                                                                            "-"
                                                                                        }
                                                                                      </td>
                                                                                      <td className="mobile_hide">
                                                                                        {/* {
                                                        (((item.price*item.balance*100)/tokens_grand_total)).toFixed(2)
                                                      }
                                                      % */}
                                                                                        <small>{((item.price * item.balance * 100) / tokens_grand_total).toFixed(2)}%</small>
                                                                                        <div style={{ maxWidth: "177px" }}>
                                                                                          <div className="progress gainer-progress">
                                                                                            <div className='progress-bar progress-bar-success'
                                                                                              role="progressbar" style={{ width: (((item.price * item.balance * 100) / tokens_grand_total)).toFixed(2) + "%" }}>

                                                                                            </div>
                                                                                          </div>
                                                                                        </div>
                                                                                      </td>

                                                                                      <td>
                                                                                        <img src="/assets/img/view-arrow.png" alt="info" className="info_icon_trans" onClick={() => getTokenDetail(item)} />
                                                                                      </td>
                                                                                    </tr>
                                                                                    :
                                                                                    ""
                                                                                }
                                                                              </>
                                                                            )
                                                                            :
                                                                            ""
                                                                        }
                                                                      </tbody>
                                                                    </table>
                                                                  </div>
                                                                </div>



                                                              </div>
                                                            </div>

                                                          </div>
                                                        </>
                                                        :
                                                        <>
                                                        
                                                       
                                                        </>
                                                    )
                                                    :
                                                    ""
                                                }

                                              </div>
                                            </>
                                            :
                                            ""
                                      }
                                    </div>

                                    {/* nft deatils */}
                                    
                                   </div>
                                </>
                                :
                                tab_active == 2 ?
                                  <div className='col-md-12 col-xl-8 col-lg-12'>
                                    {
                                      active_networks.length && active_addresses.length ?
                                        <Transactions networks={active_networks} addresses={active_addresses} />
                                        :
                                        ""
                                    }
                                  </div>
                                  :
                                  tab_active == 5 ?
                                    <div className='col-md-12 col-xl-8 col-lg-12'>
                                      <Token_Approvals networks={active_networks} addresses={active_addresses} />
                                    </div>
                                    :
                                    <>
                                    </>
                            }

                            <div className='col-xl-4 col-md-6 col-lg-6 d-none d-md-none d-sm-none d-lg-block'>
                              {
                                unsubscribe_status ?
                                  <div className="text-right pull-right mb-2  ">
                                    <button className="btn btn-primary desktop-hide" style={{ padding: "0px 9px" }} onClick={() => subscribeToPortfolio()}>Subscribe Portfolio</button>
                                  </div>
                                  :
                                  ""
                              }
                              {
                                display_tokens_balance ?
                                  <div>
                                    {
                                      ((pi_chart_values.length > 0) && (pi_chart_names.length > 0)) ?
                                        <div>
                                          <div className="dex-donot-pichart charts_subtitle">
                                            <h6 >Chain Allocation &nbsp;<OverlayTrigger
                                              delay={{ hide: 450, show: 200 }}
                                              trigger={['hover', 'focus', 'click', 'touch']}
                                              overlay={(props) => (
                                                <Tooltip {...props} className="custom_pophover ">
                                                  <p>Diversify crypto portfolio by allocating across different blockchains. </p>
                                                </Tooltip>
                                              )}
                                              placement="bottom"
                                            ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                                            </OverlayTrigger> </h6>
                                            {/* <p>Diversify crypto portfolio by allocating across different blockchains.</p> */}
                                            <div className="donot-pi-chart-section" id="chart">
                                              <ReactApexChart options={options} series={pi_chart_values} type="donut" />
                                            </div>
                                          </div>
                                        </div>
                                        :
                                        ""
                                    }


                                    {
                                      ((token_allocation_values.length > 0) && (token_allocation_names.length > 0)) ?
                                        <div>
                                          <div className="dex-donot-pichart charts_subtitle">
                                            <h6 >Token Allocation <OverlayTrigger
                                              delay={{ hide: 450, show: 300 }}
                                              trigger={['hover', 'focus', 'click', 'touch']}
                                              overlay={(props) => (
                                                <Tooltip {...props} className="custom_pophover">
                                                  <p>Minimize risk through diversified asset allocation in investment portfolio.</p>
                                                </Tooltip>
                                              )}
                                              placement="bottom"
                                            ><span className='info_col' ><img src="/assets/img/info.png" alt="Info" /></span>
                                            </OverlayTrigger>   &nbsp;</h6>
                                            {/* <p>Minimize risk through diversified asset allocation in investment portfolio.</p> */}
                                            <div className="donot-pi-chart-section" id="chart">
                                              <ReactApexChart options={options2} series={token_allocation_values} type="donut" />
                                            </div>
                                          </div>
                                        </div>
                                        :
                                        ""
                                    }
                                  </div>
                                  :
                                  ""
                              }
                            </div>

                          </div>
                        </>
                        :
                        tab_active == 3 ?
                          <>
                            {
                              tokens_grand_total ?
                                <Analytics data={{ 
                                  options2: options2, 
                                  tokens_list: tokens_list_as_list_view, 
                                  tokens_balance: display_tokens_balance,
                                   net_worth:net_worth_24h_change,
                                   networks: active_networks, 
                                   addresses: active_addresses, 
                                   token_allocation_values: token_allocation_values, 
                                   token_allocation_names: token_allocation_names, 
                                   pi_chart_values: pi_chart_values, 
                                   pi_chart_names: pi_chart_names, 
                                   net_worth: net_worth_24h_change,
                                   line_graph_values,
                                   line_graph_base_price:line_graph_base_price
                                  }} />
                                :
                                ""
                            }
                          </>
                          :
                          tab_active == 4 ?
                            active_networks.length && active_addresses.length ?
                            <>

                            
{/* nft details */}
 {/* <div className='row'>
<div className='col-12 col-md-12 col-lg-12'>

<div className='nft_assets'>
<h6 className="portfolio-sub-title ml-4 mb-4">
  <span className="net_worth_value">NFT's List {nft_list.length ? <>({nft_list.length})</> : ""}</span>
</h6>
<div id="scrollableDivasd" className='nft-content' >
<InfiniteScroll
  dataLength={10000}
  style={{ overflow: "unset" }}
  next={getNFTHistory}
  hasMore={nft_has_more}
  loader={<SpinnerLoader />}
  endMessage={<EndMessage />}
  scrollableTarget="scrollableDivasd"
>
  
{
  nft_list.length ?
    <div className="row mr-2 ml-2 mb-4">
      {
        nft_list.map((item, i) =>
          <div className="col-md-3 mb-3">
            <div className='nft-section'>
              <div className=''>
                {
                  item.network_image ?
                    <img src={"/assets/img/portfolio/" + item.network_image} className="nft-network" />
                    :
                    ""
                }
              </div>
              <span className='nft-type'>{(item.ProtocolName).replace("erc", "erc-")}</span>
              <div className='nft-details'>
                <div className='nft-media' style={{ backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundImage: `url(${(item.nft_image ? item.nft_image : "/assets/img/nft-default.png")})` }} >

                </div>



                <h6 className='mb-2'>{strLenTrim(item.Symbol, 18)} <span className='nft-span'>#{strLenTrim(item.Id, 10)}</span></h6>
                <p>{item.Name}</p>

                <div className="btn-section">
                  <button className='btn btn-primary btn-block mt-2 nft-btn'onClick={()=>singleDetails(item)} >View More <img src="/assets/img/next.png" className="nft-next-image  "></img></button>
                </div>

              </div>
            </div>
          </div>
        )
      }
    </div>
    :
    ""
}
{
  data_loader_status ?
  <Nft_loader row="2" col="4" /> 
  :
  !nft_list.length ?
  <div className="row ">
  <div className="col-md-3 mb-3">
  <h6>No related data found.</h6>
  </div>
  </div>
:
""
}
</InfiniteScroll>

</div> 

</div>


</div>

</div>  */}
                            <NFT_detail networks={active_networks} addresses={active_addresses} />
                            </>
                            :
                            ""
                          :
                          tab_active == 6 ?
                            <>
                              <Feed tokens={all_tokens} />
                            </>
                            :
                            null
                    }
                    <div className="add_wallet_modal">
                      <div className={"modal " + (add_new_wallet_modal ? " modal-show" : "")} id="walletModal" style={add_new_wallet_modal ? { display: 'block' } : { display: 'none' }} role="dialog">
                        <div className="modal-dialog modal_small" style={{ maxWidth: "580px" }}>
                          <div className="modal-content">
                            <button type="button" className="close close_wallet" onClick={() => closeaddwallet()}><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="Close" /></button>
                            <h2 style={{ fontSize: "20px" }} className="text-center">{wallet_row_id ? "Update" : "Add New"} Wallet</h2>
                            <p className="wallet-p text-center mb-2">{wallet_row_id ? "Update" : "Add"} wallet to explore experience multiple wallets and networks</p>
                            <div className="modal-body addwallet_popup">

                              <div className="modal_input_block">
                                <label>Wallet address <span className="red">*</span></label>
                                <input className="text" type="text" placeholder="Type Your Wallet Address" value={pastAddress} onChange={(e) => setpastAddress(e.target.value)} />
                                <div className="err_message">{errpastAddress}</div>
                              </div>
                              <div className="modal_input_block">
                                <label>Nickname <span className="red">*</span></label>
                                <input className="text" type="text" placeholder="Type Your Nickname" value={nickName} onChange={(e) => setnickName(e.target.value)} />
                                <div className="err_message">{errnickName}</div>
                              </div>


                              <div className='button_wallet '>
                                <button type="submit" className="add_wallet_btn button_transition" onClick={saveWallet} >
                                  {loader ? (
                                    <div className="loader"><span className="spinner-border spinner-border-sm "></span>  {wallet_row_id ? "Update" : "Add"} Wallet</div>
                                  ) : (
                                    <>{wallet_row_id ? "Update" : "Add"} Wallet</>
                                  )}</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                  :
                  ""
              }
            </div>

          </div>
        </div>
      </div>


      <div className="remove_wallet_modal">
        <div className={"modal " + (wallet_confirm_remove_modal ? " modal-show" : "")} style={wallet_confirm_remove_modal ? { display: 'block' } : { display: 'none' }} role="dialog">
          <div className="modal-dialog modal-sm modal_small">
            <div className="modal-content">
              <div className="modal-body">

                <div className="text-center">
                  <div className='row'>
                    <div className='col-md-12'>
                      <button type="button" className="close" onClick={() => set_wallet_confirm_remove_modal(false)} data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="Close" /></button>
                      <img src="/assets/img/cancel.png" alt="Cancel" title="Cancel" />
                    </div>
                    <div className='col-md-12'>
                      <h4 className="modal-title">Remove Wallet </h4>
                    </div>
                    <div className='col-md-12'>
                      <p className="invalidcredential">Are you sure you want to remove {remove_wallet_address ? <strong>{getShortWalletAddress(remove_wallet_address)}</strong> : ""} from your Portfolio?</p>
                    </div>
                    <div className='col-md-12'>
                      <button type="button" className="btn-gradient-primary button_transition confirm_button" data-dismiss="modal"> <span onClick={() => removeWallet()}> Remove</span>  </button>
                    </div>
                  </div>




                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      {
        change_address_modal_status ?
          <div className="remove_wallet_modal change_wallet">
            <div className={"modal " + (change_address_modal_status ? " modal-show" : "")} style={change_address_modal_status ? { display: 'block' } : { display: 'none' }}>
              <div className="modal-dialog modal_small">
                <div className="modal-content modal_registration_success modal-create-acc">
                  <div className="modal-body login_account_body ">
                    <button type="button" className="close close_wallet" onClick={() => set_change_address_modal_status(false)} data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="Close" /></button>
                    <h4 className='title'>Change Your Wallet</h4>
                    <p>Track Your All Wallet Holding & Performance </p>
                    <form method="post" action="">
                      {/* <label className="wallet_title">Wallet address<span className="label_required">*</span></label> */}
                      <div className="input-group portfolio-search-form">
                        <input type="text" className="form-control" placeholder="Wallet address *" value={search_wallet_address} onChange={(e) => set_search_wallet_address((e.target.value).toLowerCase())} />

                      </div>
                      <div className='wallet-search-error text-left' >{err_search_wallet_address}</div>
                      <div className="button_wallet">
                        <button className='btn btn-primary-gradient button_transition btn-block mt-3 mb-2' type="submit" onClick={(e) => searchWalletData(e)}>
                          Track your Wallet
                        </button>
                      </div>
                    </form>
                    <div className="addwallet_popup_login mt-2">
                      <ul>
                        <li>
                          <div className="media">
                            <div className="media-left align-self-center">
                              <img src="/assets/img/email_port.svg" alt="Email Port" />
                            </div>
                            <div className="media-body align-self-center track-more-title">
                              Want to track more wallet addresses? <a style={{ color: "#00247D", fontWeight: "600" }} onClick={() => loginModalStatus()} >Click Here</a> to Sign In
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <h6 className="recent-search-title">Recent Searches</h6>
                    <div>
                      {
                        ((JsCookie.get('recent_portfolio_wallets')) && (JSON.parse(JsCookie.get('recent_portfolio_wallets')).length > 0)) ?
                          JSON.parse(JsCookie.get('recent_portfolio_wallets')).reverse().map((e, i) =>
                            i > 0 ?
                              <p className="recent-search-value" style={{ cursor: "pointer", textAlign: 'left' }} onClick={() => recentSearchedWalletData(e)}><span><i className="fa fa-history recent-search-icon" aria-hidden="true"></i>   {e}</span></p>
                              :
                              <p className="recent-search-value" style={{ textAlign: 'left' }}><span><i className="fa fa-history recent-search-icon" aria-hidden="true"></i> {e}</span></p>
                          )
                          :
                          url_wallet_address ?
                            <>
                              <div className="recent-search-value"><span><i className="fa fa-history recent-search-icon" aria-hidden="true"></i> {url_wallet_address}</span></div>
                            </>
                            :
                            null
                      }
                    </div>


                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          ""
      }




      <div className="remove_wallet_modal token-details-popup">
        <div className={"modal " + (token_details_modal_status ? " modal-show" : "")} style={token_details_modal_status ? { display: 'block' } : { display: "none" }}>
          <div className="modal-dialog " >
            <div className="modal-content">
              <div className="modal-body portfolio-token-view-body">
                <button type="button" className="close close_wallet" onClick={() => set_token_details_modal_status(false)} data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="Close" /></button>
                {
                  token_detail ?
                    <TokenDetail tokens_balance= {tokens_grand_total} token={token_detail} total_balance={tokens_grand_total}  tokens_list= {tokens_list_as_list_view} net_worth={net_worth_24h_change} networks={active_networks} addresses={active_addresses}/>
                    :
                    ""
                }
              </div>
            </div>
          </div>
        </div>
      </div>



      {/* ...........coming soon modal ends here........ */}
      {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
      {
        modal_data.title ?
          <Popupmodal name={modal_data} />
          :
          null
      }
    </>
  )
}

export async function getServerSideProps({ req, query }) {
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  if (userAgent.user_token) {
    return { props: { userAgent: userAgent, config: config(userAgent.user_token) } }
  }
  else {
    if (userAgent.recent_used_wallet && (!query.address) && (!userAgent.user_token)) {
      return {
        redirect: {
          destination: "/portfolio?address=" + userAgent.recent_used_wallet,
          permanent: false,
        }
      }
    }
    else {
      return { props: { userAgent: userAgent, config: config(""), search_address: query.address ? query.address : "" } }
    }
  }
}
