import React , {useState, useEffect,useRef} from 'react'  
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
import dynamic from 'next/dynamic' 
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import Transactions from '../components/layouts/portfolio/transactions'
import TokenDetail from '../components/layouts/portfolio/token_detail'
import Analytics from '../components/layouts/portfolio/analytics'
import Feed from '../components/layouts/portfolio/feed'
import { tokenLoader } from '../components/loaders/contentLoader'
import Before_login from '../components/layouts/portfolio/before_login'
import Popupmodal from '../components/popupmodal'
import { ethereum_list } from '../components/config/ethereum'
import { binance_list } from '../components/config/binance'
import { polygon_list } from '../components/config/polygon'

import { fantom_list } from '../components/config/fantom'
import { avanlanche_list } from '../components/config/avalanche'
import Metamask from '../components/layouts/social_crypto_login/metamask'
// import { ethereum_list, binance_list, polygon_list,fantom_list } from '../components/config/constants' 
import { USDFormatValue, roundNumericValue, getNetworkImageNameByID, getNetworkNameByID, addRemoveActiveAddresses, setActiveNetworksArray, getShortAddress,fetchAPIQuery,makeJobSchema,graphqlBasicTokenData,graphqlPricingTokenData, cryptoNetworksList} from '../components/config/helper'
import { cookieDomainExtension, app_coinpedia_url, API_BASE_URL, graphqlApiURL, graphqlApiKEY, strLenTrim, separator, currency_object,config,count_live_price,validBalance, getShortWalletAddress, market_coinpedia_url} from '../components/constants' 

export default function WalletDetails({userAgent, config, prev_url, search_address}) 
{  
  if(userAgent.alert_message) 
  {
    var alertObj = {icon: "/assets/img/update-successful.png", title: "Thank You!", content: userAgent.alert_message}
  }
  else
  {
    var alertObj = {icon:"", title:"", content:""}
  }
  
  const router = useRouter()
  var sl_num = 0
  const { active_watchlist_tab, address } = router.query
  
  // const dispatch = useDispatch()
  //Multiple Wallet Address Code Starts Here
  const [active_addresses, set_active_addresses]=useState(userAgent.active_addresses ? JSON.parse(userAgent.active_addresses):[])
  const [active_nicknames, set_active_nicknames]=useState(userAgent.active_nicknames ? JSON.parse(userAgent.active_nicknames):{})
  const [tokens_list_as_account_view, set_tokens_list_as_account_view]=useState([])
  const [tokens_list_as_list_view, set_tokens_list_as_list_view]=useState([])
  const [tokens_grand_total, set_tokens_grand_total] = useState(0)
  const [wallet_listing_limit] = useState(4)
  const [active_networks, set_active_networks]=useState([1,56, 137, 250, 43114])
  const [wallet_menu_show_status,set_wallet_menu_show_status] =useState("")
  const [copy_wallet_address, set_copy_wallet_address]=useState("")
  const [crypto_networks_list, set_crypto_networks_list]=useState(cryptoNetworksList({ethereum:0, bsc:0, polygon:0, fantom:0, avalanche:0}))
  const [display_tokens_balance, set_display_tokens_balance] = useState(0)
  const [tokens_view_type, set_tokens_view_type] = useState(1)
  const [filter_tokens_list_as_account_view, set_filter_tokens_list_as_account_view]=useState([])
  const [all_tokens, set_all_tokens] = useState([])
  const [token_minimum_balance] = useState(0.000000001)
  const [token_maximum_balance] = useState(10000000000*10000000000*1000)
  //Multiple Wallet Address Code Ends Here
  // console.log("address", address)

  
  const [tab_active, set_tab_active] = useState((active_watchlist_tab > 0) ? 2 : 1)
  const [user_token] = useState(userAgent.user_token ? userAgent.user_token:"") 
  const [user_email_status] = useState(userAgent.user_email_status) 
  const [nickName, setnickName] = useState() 
  const [pastAddress, setpastAddress] = useState() 
  const [errnickName, seterrnickName] = useState("") 
  const [errpastAddress, seterrpastAddress] = useState("") 
  const [add_new_wallet_modal, set_add_new_wallet_modal] = useState(false)
  const [modal_data, set_modal_data] = useState(alertObj)
  const [added_wallet_list, set_added_wallet_list]=useState([])
  const [net_worth_24h_change, set_net_worth_24h_change]=useState(0)
 
  const [loader_status, set_loader_status]=useState(false)
  const [loader, set_loader] = useState("")

  const [network_list_show_status,set_network_list_show_status] =useState(false)
  const [wallet_list_show_status,set_wallet_list_show_status] =useState(false)
  const [search_wallet_address, set_search_wallet_address] =useState("")
  const [err_search_wallet_address, set_err_search_wallet_address] =useState("")
  const [url_wallet_address, set_url_wallet_address] =useState("")
  const [change_address_modal_status, set_change_address_modal_status] =useState(false)
  const [token_details_modal_status, set_token_details_modal_status] =useState(false)
  const [token_detail, set_token_detail] = useState("")
  
  const [pi_chart_values, set_pi_chart_values]=useState([])
  const [pi_chart_names, set_pi_chart_names]=useState(['Ethereum', 'Binance', 'Polygon', 'Fantom', 'Avalanche'])
  const [pi_chart_colors]= useState(['#647fe6', '#ffc107', '#6f42c1', '#00bcd4', '#f44336'])
  
  
  const [token_allocation_values, set_token_allocation_values]=useState([])
  const [token_allocation_names, set_token_allocation_names]=useState([])
  const [token_allocation_colors, set_token_allocation_colors]= useState(['#0088FE', '#00C49F', '#FFBB28', '#4b51cb', '#CF61B0','#909090','#5D69B1','#24796C','#E88310','#2F8AC4','#764E9F','#ED645A','#CC3A8E','#C1C1C1','#66C5CC','#F89C74','#DCB0F2','#87C55F','#9EB9F3','#FE88B1','#8BE0A4','#B497E7',
  '#D3B484','#B3B3B3','#E10B64','#E92828','#78B4A4','#604F00','#0060E9','#FF7DE3','#20c997','#6f42c1'])

  //Remove Wallet Account Starts Here
  const [wallet_confirm_remove_modal, set_wallet_confirm_remove_modal]=useState(false)
  const [wallet_row_id, set_wallet_row_id]=useState('')
  const [remove_wallet_address, set_remove_wallet_address]=useState('')
  //Remove Wallet Account Ends Here


  //GAS Fees starts here
  const [gas_fees_show_status, set_gas_fees_show_status] =useState("")
  // const [url_wallet_address, set_url_wallet_address] =useState("")
  //GAS Fees ends here

  const  tokens_count_length = tokens_list_as_list_view.filter((e)=>active_networks.includes(e.network))
  
  // console.log("tokens_list_as_list_view",tokens_list_as_list_view)
  // console.log("tokens_grand_total",tokens_grand_total)

  const getSinglePortfolioDetails =(pass_item) =>
  {
    set_wallet_list_show_status(false)
    set_wallet_menu_show_status(false)
    set_add_new_wallet_modal(true)
    setnickName(pass_item.nick_name)
    setpastAddress(pass_item.wallet_address)
    set_wallet_row_id(pass_item._id)
  }

  const withoutLoginRemoveWallet = () =>
  {
    JsCookie.remove('recent_used_wallet', {domain:cookieDomainExtension})
    JsCookie.remove('display_tokens_balance', {domain:cookieDomainExtension})
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
  

  const copyAddress=(pass_address)=>
  {
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

  const addActiveNickname =  (pass_nicknames, pass_wallet_address, pass_nickname) =>
  { 
    var my_pass_nicknames = pass_nicknames
    if(!pass_nicknames[pass_wallet_address]) 
    {
      my_pass_nicknames[pass_wallet_address] = pass_nickname
    }
    return my_pass_nicknames
  }

  const removeActiveNickname =  (pass_nicknames, pass_wallet_address) =>
  {
    var my_pass_nicknames = pass_nicknames
    if(pass_nicknames[pass_wallet_address]) 
    {
      delete my_pass_nicknames[pass_wallet_address]
    }
  }
  

  // Multiple Wallet Select Code Starts Here
  const multipleAddressList = async (pass_address, pass_nickname, pass_action_type) =>
  {
    // console.log("pass_action_type", pass_action_type)
    set_tab_active(1)
    set_loader_status(false)
    var my_active_nicknames = active_nicknames
    if(pass_action_type == 1)
    {
      my_active_nicknames = await addActiveNickname(active_nicknames, pass_address,  pass_nickname)
      
    }
    
    // else if(pass_action_type == 1)
    // {
    //   my_active_nicknames = await removeActiveNickname(active_nicknames, pass_address)
    // }
    // console.log("my_active_nicknames", my_active_nicknames)
    set_active_nicknames([])
    set_active_nicknames(my_active_nicknames)
    await JsCookie.set('active_nicknames', JSON.stringify(my_active_nicknames), {domain:cookieDomainExtension})
  
    const my_active_addresses = await addRemoveActiveAddresses(pass_address, active_addresses, pass_action_type)
    
    //console.log("my_active_addresses", my_active_addresses)
    await set_active_addresses([])
    await set_active_addresses(my_active_addresses)
    await JsCookie.set('active_addresses', JSON.stringify(my_active_addresses), {domain:cookieDomainExtension})

    const portfolio_wallets = localStorage.getItem("users_wallets") ? JSON.parse(localStorage.getItem("users_wallets")):{}
    var tokens_list = []
    var tokens = []
    for(let run of my_active_addresses) 
    {
       var fetch_status = false
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
                fetch_status = true
                var inner_tokens_list = {
                  wallet_address : run,
                  networks: list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
                  tokens : list,
                  nick_name : await getNameByUsingWalletAddress(my_active_nicknames, run),
                  sub_total_balance:sub_total_balance
                }
  
                await tokens_list.push(inner_tokens_list)
                // console.log("qwerty",tokens_list)
                list.map((e) =>tokens.push(e.name))
              }
            }  
          }
       }

       if(!fetch_status)
       {
          var { wallet_tokens_list, total_balance } = await fetchNewWalletTokens(run)
          await savePortfolioInLocalStorage({wallet_address:run, final_array:wallet_tokens_list, total_balance:total_balance})

          var inner_tokens_list = {
            wallet_address : run,
            networks: wallet_tokens_list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
            nick_name : await getNameByUsingWalletAddress(my_active_nicknames, run),
            tokens : wallet_tokens_list,
            sub_total_balance:total_balance
          }

          await tokens_list.push(inner_tokens_list)
          // console.log("qwerty1",tokens_list)

          wallet_tokens_list.map((e) => tokens.push(e.name))
       }
    }
    set_all_tokens(tokens)
    // console.log("tokens1", tokens_list)
    // console.log("Alltokens", tokens)
    await arrangeListViewTokens(tokens_list)
    await set_tokens_list_as_account_view(tokens_list)

    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(active_networks, tokens_list)
    if(account_view_result)
    {
      // console.log("account_view_result",account_view_result)
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_net_worth_24h_change(final_24h_change)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, {domain:cookieDomainExtension})
      
    }

  }


  const getNameByUsingWalletAddress=(pass_nicknames, pass_address)=>
  {
    if(pass_nicknames[pass_address])
    {
      return pass_nicknames[pass_address]
    }
    else
    {
      return ""
    }
  }
  
  const arrangeListViewTokens = async (pass_tokens_list)=>
  {
    // console.log("zxcv",pass_tokens_list)
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
            var inner_id = await inner_run.id+inner_run.network
            if(tokens_final_array[inner_id])
            {
              if(tokens_final_array[inner_id].network == inner_run.network)
              {
                // console.log("inner array", tokens_final_array[inner_id])
                var balance = await parseFloat(tokens_final_array[inner_id].balance)+parseFloat(inner_run.balance)
                
                var new_object = {
                  change_24h : inner_run.change_24h,
                  id : inner_run.id,
                  image : inner_run.image,
                  name : inner_run.name,
                  network : inner_run.network,
                  price : inner_run.price,
                  sparkline_in_7d : inner_run.sparkline_in_7d,
                  symbol : inner_run.symbol,
                  balance : balance
                }
                tokens_final_array[inner_id] = await new_object
              }
              else
              {
                tokens_final_array[inner_id] = await inner_run
              }
            }
            else
            {
              tokens_final_array[inner_id] = await inner_run
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
    await JsCookie.set('display_tokens_balance', 0, {domain:cookieDomainExtension})

    var ethereum = 0
    var bsc = 0
    var polygon = 0
    var fantom = 0
    var avalanche = 0
    var obj2 = []
    var total_24h_change = 0
    for(var prop in tokens_final_array) 
    {
      total_24h_change += tokens_final_array[prop].change_24h ? parseFloat(tokens_final_array[prop].change_24h):0
      await obj2.push(tokens_final_array[prop])
    }
     for(let run of pass_tokens_list)
      {
        var inner_tokens = await run.tokens
        if(inner_tokens.length)
        {
          for(let inner_run of inner_tokens)
          {
   
            if(inner_run.network == 1 )
            {
                ethereum += !isNaN(parseFloat(inner_run.balance)*parseFloat(inner_run.price)) ? parseFloat(inner_run.balance)*parseFloat(inner_run.price):0
            }
            else if(inner_run.network == 56)
            {
                bsc += !isNaN(parseFloat(inner_run.balance)*parseFloat(inner_run.price)) ? parseFloat(inner_run.balance)*parseFloat(inner_run.price):0
            }
            else if(inner_run.network == 137)
            {
                polygon += !isNaN(parseFloat(inner_run.balance)*parseFloat(inner_run.price)) ? parseFloat(inner_run.balance)*parseFloat(inner_run.price):0
            }
            else if(inner_run.network == 250)
            {
                fantom += !isNaN(parseFloat(inner_run.balance)*parseFloat(inner_run.price)) ? parseFloat(inner_run.balance)*parseFloat(inner_run.price):0
            }
            else if(inner_run.network == 43114)
            {
              avalanche += !isNaN(parseFloat(inner_run.balance)*parseFloat(inner_run.price)) ? parseFloat(inner_run.balance)*parseFloat(inner_run.price):0
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
    

    const network_balances_list = await cryptoNetworksList({ethereum, bsc, polygon, fantom, avalanche})
    await set_crypto_networks_list(network_balances_list)
    // console.log("network_balances_list", network_balances_list)

    
    var total_balances = 0
    
    for(let run of network_balances_list)
    {
      if(active_networks.includes(run.network_id))
      {
        total_balances += !isNaN(parseFloat(run.network_balance)) ? parseFloat(run.network_balance):0
      }
    }
    
    await set_display_tokens_balance(total_balances)
    await JsCookie.set('display_tokens_balance', total_balances, {domain:cookieDomainExtension})

    const tokens_list_view = await obj2.sort((a,b)=>(a.price*a.balance*100)<(b.price*b.balance*100)?1:-1)
    
    await set_tokens_list_as_list_view(tokens_list_view)
    setChartsData({final_array:tokens_list_view, total_balance:total_balances})
  }
  
  

  const fetchNewWalletTokens = async (pass_address)=>
  {   
      var eth_result =[]
      const query = graphqlBasicTokenData(pass_address, "ethereum")
      const opts = fetchAPIQuery(query)
      const res = await fetch(graphqlApiURL, opts)
      const result = await res.json()
      console.log("result",result)
      if(!result.error && result.data.ethereum)
      {
        if(result.data.ethereum.address[0].balances)
        {
          eth_result = result.data.ethereum.address[0].balances
        }
      }

      var bnb_result =[]
      const binance_query = graphqlBasicTokenData(pass_address, "bsc")
      const binance_opts = fetchAPIQuery(binance_query)
      const binance_res = await fetch(graphqlApiURL, binance_opts)
      const binance_result = await binance_res.json()
      console.log(binance_result)
      if(!binance_result.error && binance_result.data.ethereum)
      {
        if(binance_result.data.ethereum.address[0].balances)
        {
          console.log("binance_result", binance_result.data.ethereum.address[0].balances)
          bnb_result = binance_result.data.ethereum.address[0].balances
        }
      }

      var ftm_result =[]
      const fantom_query = graphqlBasicTokenData(pass_address, "fantom")
      const fantom_opts = fetchAPIQuery(fantom_query)
      const fantom_res = await fetch(graphqlApiURL, fantom_opts)
      const fantom_result = await fantom_res.json()
      console.log("fantom_result",fantom_result)
      if(!fantom_result.error && fantom_result.data.ethereum)
      {
        if(fantom_result.data.ethereum.address[0].balances)
        {
          ftm_result = fantom_result.data.ethereum.address[0].balances
        }
      }

      var plygon_result =[]
      const polygon_query = graphqlBasicTokenData(pass_address, "matic")
      const polygon_opts = fetchAPIQuery(polygon_query)
      const polygon_res = await fetch(graphqlApiURL, polygon_opts)
      const polygon_result = await polygon_res.json()
      console.log("polygon_result",polygon_result)
      if(!polygon_result.error && polygon_result.data.ethereum)
      {
        if(polygon_result.data.ethereum.address[0].balances)
        {
          plygon_result = polygon_result.data.ethereum.address[0].balances
        }
      }

      var aval_result = [];
      const avalanche_query = graphqlBasicTokenData(pass_address, "avalanche");
      const avalanche_opts = fetchAPIQuery(avalanche_query);
      const avalanche_res = await fetch(graphqlApiURL, avalanche_opts);
      const avalanche_result = await avalanche_res.json();
      console.log("avalanche_result", avalanche_result);
      if (!avalanche_result.error && avalanche_result.data.ethereum) {
        if (avalanche_result.data.ethereum.address[0].balances) {
          aval_result = avalanche_result.data.ethereum.address[0].balances;
        }
      }

      var req_url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=binancecoin%2Cethereum%2Cfantom%2Cmatic-network%2Cavalanche-2%2C'
      var initial_result = []
      var tokens = []
      if(bnb_result.length)
      {
        for(let run of bnb_result)
        {
          if(run.currency.address != '-')
          {
            if(binance_list[run.currency.address])
            {
              if(binance_list[run.currency.address].coingeckoId)
              {
                if(run.value > token_minimum_balance && run.value < token_maximum_balance)
                {
                  req_url += binance_list[run.currency.address].coingeckoId+"%2C"

                  await initial_result.push({
                    id:binance_list[run.currency.address].coingeckoId,
                    balance:run.value,
                    name:run.currency.name,
                    network:56,
                    symbol:run.currency.symbol
                  })
                }
              }
              
            }
          }
          else if(run.currency.address == '-')
          {
            if(run.value > token_minimum_balance && run.value < token_maximum_balance)
            {
              await initial_result.push({
                id:"binancecoin",
                name:"Binance",
                symbol:"BNB",
                network:56,
                balance:run.value
              })
            }
           
          }
        }
      }
      
      
      if(eth_result.length)
      {
        for(let run of eth_result)
        {
          if(run.currency.address != '-')
          {
            if(ethereum_list[run.currency.address])
            {
              if(ethereum_list[run.currency.address].coingeckoId)
              {
                if(run.value > token_minimum_balance && run.value < token_maximum_balance)
                {
                  // console.log(ethereum_list[run.currency.address].coingeckoId)
                  req_url += ethereum_list[run.currency.address].coingeckoId+"%2C"

                  await initial_result.push({
                    id:ethereum_list[run.currency.address].coingeckoId,
                    balance:run.value,
                    name:run.currency.name,
                    network:1,
                    symbol:run.currency.symbol
                  })
                }
              }
            }
          }
          else if(run.currency.address == '-')
          {
            if(run.value > token_minimum_balance && run.value < token_maximum_balance)
            {
              await initial_result.push({
                id:"ethereum",
                name:"Ethereum",
                symbol:"ETH",
                network:1,
                balance:run.value
              })
            }
           
          }
        }
      }

      if(ftm_result.length)
      {
        for(let run of ftm_result)
        {
          if(run.currency.address != '-')
          {
            if(fantom_list[run.currency.address])
            {
              if(fantom_list[run.currency.address].coingeckoId)
              {
                if(run.value > token_minimum_balance && run.value < token_maximum_balance)
                {
                  req_url += fantom_list[run.currency.address].coingeckoId+"%2C"

                  await initial_result.push({
                    id:fantom_list[run.currency.address].coingeckoId,
                    balance:run.value,
                    name:run.currency.name,
                    network:250,
                    symbol:run.currency.symbol
                  })
                }
                
              } 
            }
          }
          else if(run.currency.address == '-')
          {
            if(run.value > token_minimum_balance && run.value < token_maximum_balance)
            {
              await initial_result.push({
                id:"fantom",
                name:"Fantom",
                symbol:"FTM",
                network:250,
                balance:run.value
              })
            }
           
          }
        }
      }

      if(plygon_result.length)
      {
        for(let run of plygon_result)
        {
          if(run.currency.address != '-')
          {
            if(polygon_list[run.currency.address])
            {
              if(polygon_list[run.currency.address].coingeckoId)
              {
                if(run.value > token_minimum_balance && run.value < token_maximum_balance)
                {
                  // console.log(ethereum_list[run.currency.address].coingeckoId)
                  req_url += polygon_list[run.currency.address].coingeckoId+"%2C"

                  await initial_result.push({
                    id:polygon_list[run.currency.address].coingeckoId,
                    balance:run.value,
                    name:run.currency.name,
                    network:137,
                    symbol:run.currency.symbol
                  })
                }
              }
            }
          }
          else if(run.currency.address == '-')
          {
            if(run.value > token_minimum_balance && run.value < token_maximum_balance)
            {
              await initial_result.push({
                id:"matic-network",
                name:"Matic",
                symbol:"MATIC",
                network:137,
                balance:run.value
              })
            }
          }
        }
      }


      //avalanche_list
      if(aval_result.length)
      {
        for(let run of aval_result) 
        {
          if(run.currency.address != "-") 
          {
            if(avanlanche_list[run.currency.address]) 
            {
              if(avanlanche_list[run.currency.address].coingeckoId)
              {
                if(run.value > token_minimum_balance && run.value < token_maximum_balance)
                {
                    // console.log(ethereum_list[run.currency.address].coingeckoId)
                    req_url += avanlanche_list[run.currency.address].coingeckoId + "%2C"

                    await initial_result.push({
                      id: avanlanche_list[run.currency.address].coingeckoId,
                      balance: run.value,
                      name: run.currency.name,
                      network: 43114,
                      symbol: run.currency.symbol,
                    })
                }
              }
            }
          } 
          else if(run.currency.address == "-") 
          { 
            if(run.value > token_minimum_balance && run.value < token_maximum_balance)
            {
              await initial_result.push({
                id: "avalanche-2",
                name: "Avalanche",
                symbol: "AVAX",
                network: 43114,
                balance: run.value
              })
            }
          }
        }
      }
       
    // console.log("initial_result",initial_result)
    
    var final_array = []
    var tokens = []
    var total_balance = 0
    const response = await Axios.get(req_url+"&sparkline=true")
    if(response.data)
    { 
      console.log("sparkline", response)
      var target = response.data
      for(let i of initial_result)
      {
        var index = target.findIndex(img => img.id === i.id);
        await final_array.push({
          price:target[index]? target[index].current_price:0,
          id:i.id,
          ath:target[index] ? target[index].ath:0,
          atl:target[index] ? target[index].atl:0,
          circulating_supply:target[index] ? target[index].circulating_supply:0,
          network:i.network,
          symbol:i.symbol,
          image:target[index] ? target[index].image:"",
          name:i.name,
          change_24h:target[index]?target[index].price_change_percentage_24h:0,
          balance:i.balance,
          sparkline_in_7d:target[index] ? target[index].sparkline_in_7d:"",
        })
        await tokens.push(i.name)
        if(i.balance && target[index])
        {
          total_balance += await (target[index].current_price*i.balance)
        }
      }
      set_all_tokens(tokens)
    }
    // console.log("final_array", final_array)
    // console.log("Alltokens", tokens)
    return {wallet_tokens_list:final_array, total_balance:total_balance}
  }

  //type 1:force update, 2:check and update
  const savePortfolioInLocalStorage = async ({wallet_address, final_array, total_balance}) =>
  {
    var expire_at = (new Date((180 * 60 * 1000)+(new Date().getTime()))).getTime()

    var portfolio_wallets = await localStorage.getItem("users_wallets") ? JSON.parse(localStorage.getItem("users_wallets")):{}
    portfolio_wallets[wallet_address] = await {list:final_array, sub_total_balance:total_balance, expire_at:expire_at}
    await localStorage.setItem("users_wallets", JSON.stringify(portfolio_wallets))
  }

  
  
  const setActiveNetworks = async (pass_network, pass_balance) =>
  {
    set_tab_active(1)
    const my_active_networks = await setActiveNetworksArray(pass_network, active_networks)
    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(my_active_networks, tokens_list_as_account_view)
    if(account_view_result)
    {
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, {domain:cookieDomainExtension})
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

  const tokenAccountViewList = async (pass_networks, pass_tokens_list) =>
  {
    var account_view_result = []
    var grand_total_balance = 0
    var total_24h_change = 0
    var total_tokens = 0
    for(let run of pass_tokens_list)
    { 
      if(run.tokens)
      {
        var tokens_list = run.tokens
        var innner_result = []
        var total_balance = 0
        for(let inner_run of tokens_list)
        {
          if(pass_networks.includes(inner_run.network))
          { 
            if(inner_run.balance && inner_run.price)
            {
              total_balance += await (inner_run.price*inner_run.balance)
            }
            total_24h_change += inner_run.change_24h ? parseFloat(inner_run.change_24h):0

            innner_result.push(inner_run)
            total_tokens++
          }
        }
        grand_total_balance += total_balance
      }
      else
      {
        var total_balance = 0
      }
      
      var final_24h_change = 0
      if(total_24h_change)
      {
        final_24h_change = (total_24h_change/total_tokens).toFixed(2)
      }
      
      await account_view_result.push({
        wallet_address : run.wallet_address,
        nick_name : run.nick_name,
        tokens : innner_result,
        networks : innner_result.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
        sub_total_balance : total_balance
      })
    } 
    // console.log("grand_total_balance", grand_total_balance)
      
    return { account_view_result, grand_total_balance, final_24h_change }
  }

  
  
  
    

  const setChartsData = async ({final_array, total_balance}) =>
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
    for(let j of final_array)
    {   
      if(j.network == 1)
      { 
        total_ethereum_value += await !isNaN(parseFloat(j.price)*parseFloat(j.balance)) ? parseFloat(j.price)*parseFloat(j.balance):0
      }
      else if(j.network == 56)
      { 
        total_bnb_value += await !isNaN(parseFloat(j.price)*parseFloat(j.balance)) ? parseFloat(j.price)*parseFloat(j.balance):0
      }
      else if(j.network == 137)
      { 
        total_polygon_value += await !isNaN(parseFloat(j.price)*parseFloat(j.balance)) ? parseFloat(j.price)*parseFloat(j.balance):0
      }
      else if(j.network == 250)
      {
        total_fantom_value += await !isNaN(parseFloat(j.price)*parseFloat(j.balance)) ? parseFloat(j.price)*parseFloat(j.balance):0
      }
      else if(j.network == 43114)
      {
        total_avalanche_value += await !isNaN(parseFloat(j.price)*parseFloat(j.balance)) ? parseFloat(j.price)*parseFloat(j.balance):0
      }

      await token_allocation_name.push(j.symbol ? (j.symbol).substring(0, 13):"")
      var before_allocation_value = await !isNaN((j.price*j.balance*100)/total_balance) ? ((j.price*j.balance*100)/total_balance):0
      // console.log("before_allocation_value1", before_allocation_value)
      // console.log("before_allocation_value2", ((j.price*j.balance*100)/total_balance))
      await token_allocation_value.push(before_allocation_value)
    }
    await set_token_allocation_values(token_allocation_value)
    await set_token_allocation_names(token_allocation_name)
    // console.log("token_allocation_value", token_allocation_value)
    // console.log("token_allocation_name", token_allocation_name)

    if(total_ethereum_value || total_bnb_value || total_polygon_value || total_fantom_value)
    {
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
    var { wallet_tokens_list, total_balance } = await fetchNewWalletTokens(pass_address)
    await savePortfolioInLocalStorage({wallet_address:pass_address, final_array:wallet_tokens_list, total_balance:total_balance})
    await multipleAddressList(pass_address, pass_nickname, pass_action_type)
    await Axios.get(API_BASE_URL+'app/portfolio/update_address/'+pass_address, config)
    set_loader_status(true)
  }

  //pass_type 1:select all, 2:deselect all
  const makeAllNetworksActive = async (pass_type) =>
  {
    var my_active_networks = [] 
    if(pass_type == 1)
    {
      my_active_networks = [1,56, 137, 250, 43114]
    }
    
    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(my_active_networks, tokens_list_as_account_view)
    if(account_view_result)
    {
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, {domain:cookieDomainExtension})
      await set_net_worth_24h_change(final_24h_change)
    }
    await set_active_networks([])
    await set_active_networks(my_active_networks)
  }

  // Multiple Wallet Select Code Ends Here

  //Search Wallet Address Code Starts HERE
  useEffect(  ()=>
  {
    // if(localStorage.getItem('active_wallet_addresses'))
    // {
      
    // }
    
    // active_wallet_nicknames
    
    if(address && !user_token)
    {
        let web3 = new Web3(Web3.givenProvider)
        if(web3.utils.isAddress(address))
        {
          var store_cookie_wallets = JsCookie.get("recent_portfolio_wallets") ? JSON.parse(JsCookie.get("recent_portfolio_wallets")):[]
          if(!store_cookie_wallets.includes(address)) 
          {
              if(store_cookie_wallets.length >= 3) 
              {
              store_cookie_wallets.splice(0, 1)
              }
              store_cookie_wallets.push(address)
              JsCookie.set("recent_portfolio_wallets", JSON.stringify(store_cookie_wallets))
          }
          else
          {
              if(store_cookie_wallets.length > 1) 
              {
                  var arrayWithoutD = store_cookie_wallets.filter(function (letter) 
                  {
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
        else
        {
            router.push("/")
        }
        var expire_time = new Date(new Date().getTime() + 365*60*60*1000)
        JsCookie.set("recent_used_wallet", address, { expires:expire_time, domain: cookieDomainExtension })
    }
  },[address])

  const singleAddressList = async (pass_address) =>
  {
    set_tab_active(1)
    set_loader_status(false)
   
    await set_active_addresses([])
    await set_active_addresses([pass_address])
    // await JsCookie.set('active_wallet_addresses', JSON.stringify([pass_address]))
    await JsCookie.set('active_addresses', JSON.stringify([pass_address]), {domain:cookieDomainExtension})
    const portfolio_wallets = localStorage.getItem("users_wallets") ? JSON.parse(localStorage.getItem("users_wallets")):{}
    
    let fetch_status = false
    var tokens_list = []
    if(portfolio_wallets[pass_address])
    {
      var { list, sub_total_balance, expire_at } = portfolio_wallets[pass_address]
      var present_time = new Date().getTime()

      // console.log("expire_at1", present_time)
      // console.log("expire_at2", expire_at)

      if(list)
      {
        if(expire_at >= present_time)
        {
          if(list.length)
          {
            fetch_status = true
            var inner_tokens_list = {
              wallet_address : pass_address,
              networks: list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
              tokens : list,
              nick_name : "",
              sub_total_balance:sub_total_balance
            }
            await tokens_list.push(inner_tokens_list)
          }
        }
        
      }
    }
    
    if(!fetch_status)
    {
      var { wallet_tokens_list, total_balance } = await fetchNewWalletTokens(pass_address)
      await savePortfolioInLocalStorage({wallet_address:pass_address, final_array:wallet_tokens_list, total_balance:total_balance})

      var inner_tokens_list = {
        wallet_address : pass_address,
        networks: wallet_tokens_list.map(item => item.network).filter((value, index, self) => self.indexOf(value) === index),
        nick_name : "",
        tokens : wallet_tokens_list,
        sub_total_balance:total_balance
      }
      await tokens_list.push(inner_tokens_list)
    }
    // console.log("tokens", tokens_list)
    

    await arrangeListViewTokens(tokens_list)
    await set_tokens_list_as_account_view(tokens_list)
    
    const { account_view_result, grand_total_balance, final_24h_change } = await tokenAccountViewList(active_networks, tokens_list)
    if(account_view_result)
    {
      await set_filter_tokens_list_as_account_view(account_view_result)
      await set_display_tokens_balance(grand_total_balance)
      await JsCookie.set('display_tokens_balance', grand_total_balance, {domain:cookieDomainExtension})
      await set_net_worth_24h_change(final_24h_change)
    }
  }


    const searchWalletData = async(e) =>
    {
      e.preventDefault()
      set_err_search_wallet_address("")
      if(!search_wallet_address)
      {
        set_err_search_wallet_address("The Search Wallet Address field is required.")
      }
      else
      {
        const search_wallet_address_value = search_wallet_address
        let web3 = new Web3(Web3.givenProvider)
        const check_valid_address = await web3.utils.isAddress(search_wallet_address_value)
        if(check_valid_address)
        {
            set_search_wallet_address("")
            set_change_address_modal_status(false)
            await Axios.get(API_BASE_URL+'app/portfolio/update_address/'+search_wallet_address_value, config)

            router.push("/portfolio?address="+search_wallet_address_value)
        }
        else
        {
            set_err_search_wallet_address("The Search Wallet Address field must be contain wallet address.")
        }

        
      }
    }

    const recentSearchedWalletData = async (pass_wallet_address) =>
    {
      await set_active_addresses([])
      await JsCookie.remove('active_addresses', {domain:cookieDomainExtension})
     
      // await JsCookie.set('active_wallet_addresses',[])
      set_search_wallet_address("")
      set_change_address_modal_status(false)
      router.push("/portfolio?address="+pass_wallet_address)
      
    }

  
  //Search Wallet Address Code Ends HERE
 

  useEffect(() => 
  {
    let handler = (e) => {
        if (!wallet_ref ?.current?.contains(e.target)) {
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
  }, [])
  

  const closeaddwallet=()=>
  {
    set_wallet_row_id("")
    seterrpastAddress("")
    seterrnickName("")
    set_add_new_wallet_modal(false)
    setpastAddress("")
    setnickName("")
  }

  const saveWallet = async ()=>
  {    
    let web3 = new Web3(Web3.givenProvider) 
    let formIsValid = true 
    seterrpastAddress("")
    seterrnickName("")
    set_modal_data({  icon: "", title: "", content:""})

    if(!pastAddress)
    {
      formIsValid = false
      seterrpastAddress("Wallet Address field is required")
    } 
    else if(pastAddress.length < 25)
    {
      formIsValid = false
      seterrpastAddress("The Wallet Address field must be contain wallet address.")
    }
    else
    {
        const check_valid_address = await web3.utils.isAddress(pastAddress)
        if(!check_valid_address)
        {
          formIsValid = false
          seterrpastAddress("The Wallet Address field must be contain wallet address.")
        }
    }
    
    
    if(!nickName)
    {
      formIsValid = false
      seterrnickName("Nickname field is required")
      
    } 
    else if(nickName.length < 4)
    {
      formIsValid = false
      seterrnickName("The Nickname field must be at least 4 characters in length.")
    }

    if(!formIsValid)
    {
      return
    }
    set_loader(true)
    var reqObj = {
      portfolio_row_id:wallet_row_id,
      wallet_address: pastAddress,
      nick_name: nickName
    }

    Axios.post(API_BASE_URL+"app/portfolio/add_new", reqObj, config).then(res => 
    {
      set_loader(false)
      if(res.data.status==true) 
      {
          set_modal_data({icon: "/assets/img/update-successful.png", title: " Thank you !", content: res.data.message.alert_message})
          set_add_new_wallet_modal(false)
          setnickName("")
          setpastAddress("")
          getportfolio()
      }
      else
      {   
          if(res.data.message.wallet_address)
          { 
            seterrpastAddress(res.data.message.wallet_address)
          }
          
          if(res.data.message.alert_message)
          {
            set_modal_data({icon: "/assets/img/close_error.png", title: "OOPS!", content: res.data.message.alert_message})
          }
      }
    }) 
  }
  
  const getportfolio=()=>
  {
    (user_token && user_email_status) 
    ? 
    Axios.get(API_BASE_URL+'app/portfolio/list', config).then(res =>
    {
    //  console.log(res)

      if(res.data.status==true)
      {     
        set_loader_status(true)
        set_added_wallet_list(res.data.message)
        // console.log("added wallet list",res.data.message)
        if(res.data.message.length > 0)
        {
          multipleAddressList(res.data.message[0].wallet_address, res.data.message[0].nick_name, 1)
          // console.log(res.data)
          //set_wallet_active_address(res.data.message[0].wallet_address)
          //set_active_addresses([res.data.message[0].wallet_address])
         
        }
      }
    })
    :
    null
  }

  const walletConfirmRemove= async (remove_id, pass_address, pass_nickname) =>
  {
    await multipleAddressList(pass_address, pass_nickname, 2)
    await set_wallet_list_show_status(false)
    await set_wallet_menu_show_status(false)
    await set_wallet_confirm_remove_modal(true)
    await set_wallet_row_id(remove_id)
    await set_remove_wallet_address(pass_address)
  }

  
  const removeWallet=()=>
  { 
    set_modal_data({  icon: "", title: "", content:""})
    Axios.get(API_BASE_URL+'app/portfolio/remove_wallet/'+wallet_row_id, config).then(res =>
    {
      set_wallet_confirm_remove_modal(false)
      if(res.data.status==true)
      {    
        set_remove_wallet_address("")
        set_wallet_row_id("") 
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
        "url":app_coinpedia_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
  }

const getTokenDetail=  (e)=>
{
  // console.log("token_detail",token_detail)

   set_token_detail("")
   set_token_details_modal_status(true)
   set_token_detail(e)
}



  const connectToWallet= async ()=>
  { 
        await set_modal_data({icon: "",title: "",content:""})
        var checkNetworks = ["private", "main"]
       
         if(window.ethereum)
        {   
            window.ethereum.enable().then(function(res) { 
            let web3 = new Web3(Web3.givenProvider)
            web3.eth.net.getNetworkType().then(function(networkName) 
            {       
                if(checkNetworks.includes(networkName))
                { 
                    web3.eth.requestAccounts().then(function(accounts)
                    {   
                        var first_address = (accounts[0]).toLowerCase() 
                        if((typeof first_address != 'undefined'))
                        {   
                            router.push("/portfolio?address="+first_address)
                            return true
                        }
                        return true
                    })
                }
                else
                {
                    set_modal_data({icon: "/assets/img/close_error.png",title:"Connection Error",content:'Please connect to Main or BNB wallet.'}) 
                }  
            })
            })
        } 
        else
        {
            
            set_modal_data({icon:"/assets/img/close_error.png", title:"Connection Error", content:'You are connected to an unsupported network.'})
        }
    }


    
  

  return(
    <>
      <Head>
        <title>Crypto Portfolio Tracker - Manage & Track Your Crypto Investments | Coinpedia </title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' /> 
        <meta name="description" content="Keep track of your cryptocurrency investments with Coinpedia's Crypto Portfolio Tracker. Add Your Wallet Address and get real-time updates on your portfolio's performance to make informed decisions. Sign up now !" />
        <meta name="keywords" content="Coipedia Protfolio management, Coinpedia market account, manage crypto portfolio, Crypto portfolio tracker, Crypto Portfolio Management." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Crypto Portfolio Tracker - Manage & Track Your Crypto Investments | Coinpedia " />
        <meta property="og:description" content="Keep track of your cryptocurrency investments with Coinpedia's Crypto Portfolio Tracker. Add Your Wallet Address and get real-time updates on your portfolio's performance to make informed decisions. Sign up now !" />
        <meta property="og:url" content={app_coinpedia_url} />
        <meta property="og:site_name" content="Crypto Portfolio Tracker - Manage & Track Your Crypto Investments | Coinpedia " />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Crypto Portfolio Tracker - Manage & Track Your Crypto Investments | Coinpedia " />
        <meta name="twitter:description" content="Keep track of your cryptocurrency investments with Coinpedia's Crypto Portfolio Tracker. Add Your Wallet Address and get real-time updates on your portfolio's performance to make informed decisions. Sign up now !" />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" /> 

        {/* <link rel="shortcut icon" type="image/x-icon" href={favicon}/> */}
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2022/08/18141301/coinpedia-logo.png" />

        <link rel="canonical" href={app_coinpedia_url} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head> 
    <div className="page">
      <div className="wallet_page portfolio_page">
        {
          !user_token && !search_address  ?
          <div className="login_overlay">
            <div className="login_overlay_block">
              {/* <img src="/assets/img/login_overlay.png" alt="Login" title="Login"/> */}
              <div className="row">
              <div className="col-md-1">
              </div>
              <div className="col-md-10">
              <h2 >Add Your Wallet</h2>
              <div className='login-overlay-sub-title mb-3' style={{color:"black"}}>Track your Crypto Holdings with our all-in-one wallet tracking solution</div> 
              <form method="post" action="">
              <p className="wallet_title mt-2">Wallet address<span className="label_required">*</span></p>
              <div className="input-group portfolio-search-form">
                <input type="text" className="form-control" placeholder="Enter your wallet address " value={search_wallet_address} onChange={(e)=>set_search_wallet_address((e.target.value).toLowerCase())} />
                {/* <div className="input-group-append">
                  <button className="input-group-text" type="submit" onClick={(e)=>searchWalletData(e)}>
                  <img style={{width:"24px"}} src="/assets/img/portfolio-search.svg" placeholder="Search Your Wallet Address" />
                  </button>
                </div> */}
              </div>
              <div className='wallet-search-error'>{err_search_wallet_address}</div>
              <div className="button_wallet">
              <button  type="submit"  className="button_transition" onClick={(e)=>searchWalletData(e)}>
              Track your Wallet
              </button>
              </div>
              </form>

              <div className="addwallet_popup_login">
              <h6>Try another way to Explore Wallets</h6>
              <ul>
                  <li>
                    <h5>
                      <div className="media">
                        <div className="media-left align-self-center">
                        <img src="/assets/img/email_port.svg" />
                        </div>
                        <div className="media-body align-self-center track-more-title">
                          Want to track more wallet addresses? <a href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url+"portfolio"}>Click Here</a> to Sign In
                        </div>
                      </div>
                      </h5>
                  </li>
                  
                </ul>
              {/* <h5>
                <div class="media">
                  <div class="media-left align-self-center">
                    <img src="/assets/img/email_port.svg" /></div>
                    <div className='media-body align-self-center track-more-title'>
                      If you want to track more wallet addresses, <Link href="/login"><a className='link'>Click Here</a></Link> to sign in 
                    </div>
                  </div>
              </h5> */}
              
                                     
                                    </div>

              {/* <div className='track-more-title'>
              Want to track more wallet addresses? <Link href="/login"><a className='link'>Click Here</a></Link> to Sign In
              </div> */}

             
              {/* {
                (
                  (JsCookie.get('recent_portfolio_wallets')) && 
                  (JSON.parse(JsCookie.get('recent_portfolio_wallets')).length > 0)
                ) ?
                <>
                   <h6 className="recent-search-title">Recent Searches</h6>
                   {
                     JSON.parse(JsCookie.get('recent_portfolio_wallets')).reverse().map((e,i) =>
                     i > 0 ?
                     <div key={i++} className="recent-search-value" style={{cursor:"pointer"}} onClick={()=>recentSearchedWalletData(e)}><i className="fa fa-history recent-search-icon" aria-hidden="true"></i> <span>{e}</span></div>
                     :
                     <div key={i++} className="recent-search-value" style={{cursor:"pointer"}} onClick={()=>recentSearchedWalletData(e)}><i className="fa fa-history recent-search-icon" aria-hidden="true"></i> <span>{e}</span></div>
                     )
                  }
                </>
                :
                null
              } */}
              {/* <h2>OR</h2>
               
              <div className='row mb-3 app_login_buttons'>
                <div className='col-md-6 col-sm-6'>
                <div className="portfolio-connect-wallet">
                  <div className="media"  onClick={()=> connectToWallet()}>
                      <div className="media-left">
                          <img  src="/assets/img/login-metamask.svg" className="media-object" alt="Metamask" />
                      </div>
                      <div className="media-body align-self-center">
                          <h4>Connect Wallet</h4>
                      </div>
                  </div> 
                  </div>
                </div>   
               
                <div className='col-md-6 col-sm-6 text-md-right'>
                  <Link href={"/login"}><a className="portfolio_login_btn">
                  <img src="/assets/img/portfolio-login.svg" style={{width:"18px"}} /> Login</a></Link>
                </div>   
               </div>  */}
             
              </div>
              <div className="col-md-1">
              </div>
              </div> 
            </div>
          </div>
          :
          null
        }

{user_token || url_wallet_address ?
<>
        <div className="bg_portfolio_header">
          <div className="container">
            <div className="col-md-12">

              <div className="wallet_overview_block mobile_wallet_network">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="total_portfolio_balance">
                        <h5>Net Worth</h5>
                        <div className="balance_block">
                          <h6>
                            {
                              display_tokens_balance ? USDFormatValue(display_tokens_balance, 1):0.00
                            }

                            {
                              net_worth_24h_change > 0 ?
                              <span className="growth_up">
                                <span>
                                  <img src="/assets/img/growth_up.svg" /> +{net_worth_24h_change}%
                                </span>
                              </span>
                              :
                              net_worth_24h_change < 0 ?
                              <span className="growth_down">
                                <span>
                                  
                                <img src="/assets/img/growth_down.svg" /> {net_worth_24h_change}%
                                </span>
                              </span>
                              :
                              ""
                            }

                          </h6>
                        </div>
                        <div className="portfolio_growth_status">
                          
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-8 col-lg-8 col-12">
                    <div className="add_wallet">
                      <span onClick={()=>hardRefershBalances(address)}>Hard Refresh Balances</span>

                      {
                        user_token ? 
                          added_wallet_list.length < 3 ? 
                            <button type="button"  onClick={() => set_add_new_wallet_modal(true)} >
                              <img src="/assets/img/add-wallet.svg" alt="Wallet" title="Wallet" />
                              Add Another Wallet
                            </button>
                          : 
                          null
                        : 
                          <button type="button" onClick={()=>{set_change_address_modal_status(true), set_search_wallet_address("")}} >
                          Change Wallet Address </button>
                      }
                      </div>    
                      
                      {
                        user_token ? 
                        <>
                          <div className="mobile_view">
                            {
                              added_wallet_list.length > 1 ? 
                              <DesignSliderWallets />
                              :
                              <DesignWallets />  
                            }
                          </div>

                          <div className="desktop_view">
                            <DesignWallets />
                          </div>
                        </>
                        :
                        address ?
                        <div>
                          <ul className="without-slider-block cust_block_wallt first-wallet-active">
                            <li className="">
                              <div className={"nav-link"} >
                                <div title={address}>
                                  <h5> Wallet Address</h5>
                                  <p>{address.slice(0, 8)+ "..."+address.slice(address.length-8, address.length)}</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>  
                        :
                        ""  
                      }
                    </div> */}

                  
                  </div>
                </div>

              <div className="portfolio_header">
                <div className="row">
                  <div className="col-lg-5 col-md-3 col-sm-4 col-12">
                    <h1>My Portfolio</h1>
                    {/* {
                      user_token ?
                      <p className="portfolio_sub_title">Update your wallets and manage them in powerful way.</p>
                      :
                      <p className="portfolio_sub_title">Search your wallets and manage them in powerful way.</p>
                    } */}
                  </div>
                    

                    
                    <div className="col-lg-7 col-md-9 col-sm-8 col-12 ">
                      <div className="row">
                        <div className="col-md-6 col-6">
                        <div className="cust_filters_dropdown cust_portfolio_network">
                            <div ref={wallet_ref}>
                                <div className="cust_filter_input" >
                                  <div className="input-group" onClick={()=>set_wallet_list_show_status(!wallet_list_show_status)} >
                                      {/* <ul>
                                        <li><img src="/assets/img/portfolio/eth.svg" alt="Ethereum" title="Ethereum" /></li>
                                        <li><img src="/assets/img/portfolio/bsc.svg" alt="BSC" title="BSC" /></li>
                                        <li><img src="/assets/img/portfolio/polygon.svg" alt="Polygon" title="Polygon" /></li>
                                        <li>+2</li>
                                      </ul> */}

                                      
                                    
                                    {active_addresses.length?
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
                                      :""
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
                                      <span className="input-group-addon lightmode_image">
                                        <img src="/assets/img/filter_dropdown_white.svg" />
                                      </span>
                                  </div>
                                </div>
                              {
                                wallet_list_show_status ? 
                                
                                <ul className="wallet-list-li network_display_dropdown">
                                  <li className="network_select">Accounts 
                                  {/* <span><img src="/assets/img/tick.png" />Select All</span> */}
                                  </li>
                                  
                                  {
                                    added_wallet_list.length  ?
                                    added_wallet_list.map((e,i) =>
                                    <li>
                                        <div className="media">
                                          <div className="media-left" onClick={()=>multipleAddressList(e.wallet_address, e.nick_name, active_addresses.includes(e.wallet_address) ? 2:1)} >
                                            {
                                              active_addresses.includes(e.wallet_address)  ? 
                                              <img className="network_icons" src="/assets/img/tick.png" alt="tick" title="tick" />
                                              : 
                                              ""
                                            }
                                          </div>
                                          <img onClick={()=>multipleAddressList(e.wallet_address, e.nick_name, active_addresses.includes(e.wallet_address) ? 2:1)} className="network_icons" src={`/assets/img/wallet/wallet${++i}.png`} alt="Wallet" title="Wallet" />
                                          <div onClick={()=>multipleAddressList(e.wallet_address, e.nick_name, active_addresses.includes(e.wallet_address) ? 2:1)} className="media-body">
                                              <h5>{ getShortWalletAddress(e.wallet_address) }</h5>
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
                                            <button className="dropdown_button" type="button" onClick={()=>set_wallet_menu_show_status(wallet_menu_show_status == e.wallet_address ? "":e.wallet_address)} >
                                            < img src="/assets/img/wallet_menu.svg" />
                                            </button>
                                            <div className={"dropdown-menu "+(wallet_menu_show_status == e.wallet_address ? "show":"")} aria-labelledby="MenuButton">
                                              <ul>
                                              <li className="dropdown-item" onClick={()=>copyAddress(e.wallet_address)} >< img src="/assets/img/copy_img.svg" />{e.wallet_address == copy_wallet_address ? "Copied":"Copy Address"}</li>
                                              <li className="dropdown-item" onClick={()=>hardRefershBalances(e.wallet_address, e.nick_name, 1)}>< img src="/assets/img/refresh_img.svg" />Refresh Balances</li>
                                            
                                              {
                                                !e.default_type ? 
                                                <>
                                                <li className="dropdown-item" onClick={()=>getSinglePortfolioDetails(e)}><img src="/assets/img/rename_img.svg" />Rename</li>
                                                <li className="dropdown-item" onClick={() =>walletConfirmRemove(e._id, e.wallet_address, e.nick_name)}>< img src="/assets/img/delete_img.svg" />Remove Account</li>
                                                </>
                                                : 
                                                null
                                              }
                                              </ul>

                                            </div>
                                          </div>

                                          {/* {
                                            !e.default_type ? 
                                            <img onClick={() =>walletConfirmRemove(e._id)} className="wallet_delete" src="/assets/img/delete.png" alt="delete" title="Remove Wallet" />
                                            : 
                                            null
                                          } */}
                                            
                                          </div>
                                          {/* <div className="media-right">
                                            <img  className="wallet_reload" src="/assets/img/reload.png" alt="reload" title="Hard Refresh Balances" />
                                          </div> */}
                                        </div>
                                    </li>
                                  )
                                  :
                                  address ?
                                  <li>
                                      <div className="media">
                                          <div className="media-left">
                                            {
                                              active_addresses.includes(address)  ? 
                                              <img className="network_icons" src="/assets/img/tick.png" alt="tick" title="tick" />
                                              : 
                                              ""
                                            }
                                          </div>
                                          <img  className="network_icons" src="/assets/img/wallet/wallet1.png" alt="Wallet" title="Wallet" />
                                          <div  className="media-body">
                                            {getShortWalletAddress(address)}
                                          </div>
                                          
                                          <div className="media-right">
                                            <img onClick={()=>hardRefershBalances(address)} className="wallet_reload" src="/assets/img/reload.png" alt="reload" title="Hard Refresh Balances" />
                                           

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
                                      <span className='without_login_change_wallet' onClick={()=>{set_change_address_modal_status(true), set_search_wallet_address("")}}>Change Wallet</span>
                                      <span className='without_login_remove_wallet' onClick={()=>{withoutLoginRemoveWallet()}}>Remove Wallet</span>
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
                            <div className="cust_filter_input" onClick={() =>set_network_list_show_status(!network_list_show_status)} >
                              <div className="input-group">
                                {
                                  active_networks.length ?
                                  <ul>
                                  {
                                    crypto_networks_list.map((item, i)=>
                                    active_networks.includes(item.network_id)  ? 
                                      <li key={i}><img src={`/assets/img/portfolio/${item.network_image}`} alt={item.network_name} title={item.network_name} /></li>
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
                                      crypto_networks_list.map((item, i)=>
                                        active_networks.includes(item.network_id)  ? 
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
                                <span className="input-group-addon lightmode_image">
                                  <img src="/assets/img/filter_dropdown_white.svg" />
                                </span>
                              </div>
                            </div>
                                
                            {
                              network_list_show_status ? 
                              <ul className="wallet-list-li network_display_dropdown">
                                <li className="network_select">Networks 
                                  {
                                    active_networks.length < 4 ? 
                                    <span onClick={()=>makeAllNetworksActive(1)}>
                                      <img src="/assets/img/tick.png" /> Select All
                                    </span>
                                    :
                                    <span onClick={()=>makeAllNetworksActive(2)}>
                                      <img src="/assets/img/minus.png" /> Deselect All
                                    </span>
                                  }
                                </li>
                                
                                    {
                                      crypto_networks_list.length ?
                                      crypto_networks_list.map((item, i)=>
                                        <li onClick={()=>setActiveNetworks(item.network_id, item.network_balance)}>
                                        <div className="media">
                                          <div className="media-left">
                                            {
                                              active_networks.includes(item.network_id)  ? 
                                              <img className="network_icons" src="/assets/img/tick.png" alt="tick" title="tick" />
                                              : 
                                              ""
                                            }
                                          </div>
                                          <img className="network_icons" src={`/assets/img/portfolio/${item.network_image}`} alt={item.network_name} title={item.network_name} />
                                          <div className="media-body">
                                            <h5 className="mt-0">{item.network_name}</h5>
                                            <p>{item.network_balance ? USDFormatValue(item.network_balance, 1):0}</p>
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

              
                <div className="wallet_overview_block desktop_wallet_network">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="total_portfolio_balance">
                        <h5>Net Worth</h5>
                        <div className="balance_block">
                          <h6>
                            {
                              display_tokens_balance ? USDFormatValue(display_tokens_balance, 1):0.00
                            }

                            {
                              net_worth_24h_change > 0 ?
                              <span className="growth_up">
                                <span>
                                  <img src="/assets/img/growth_up.svg" /> +{net_worth_24h_change}%
                                </span>
                              </span>
                              :
                              net_worth_24h_change < 0 ?
                              <span className="growth_down">
                                <span>
                                  
                                <img src="/assets/img/growth_down.svg" /> {net_worth_24h_change}%
                                </span>
                              </span>
                              :
                              ""
                            }

                          </h6>
                        </div>
                        <div className="portfolio_growth_status">
                          
                        </div>
                      </div>
                    </div>
                    {/* <div className="col-md-8 col-lg-8 col-12">
                    <div className="add_wallet">
                      <span onClick={()=>hardRefershBalances(address)}>Hard Refresh Balances</span>

                      {
                        user_token ? 
                          added_wallet_list.length < 3 ? 
                            <button type="button"  onClick={() => set_add_new_wallet_modal(true)} >
                              <img src="/assets/img/add-wallet.svg" alt="Wallet" title="Wallet" />
                              Add Another Wallet
                            </button>
                          : 
                          null
                        : 
                          <button type="button" onClick={()=>{set_change_address_modal_status(true), set_search_wallet_address("")}} >
                          Change Wallet Address </button>
                      }
                      </div>    
                      
                      {
                        user_token ? 
                        <>
                          <div className="mobile_view">
                            {
                              added_wallet_list.length > 1 ? 
                              <DesignSliderWallets />
                              :
                              <DesignWallets />  
                            }
                          </div>

                          <div className="desktop_view">
                            <DesignWallets />
                          </div>
                        </>
                        :
                        address ?
                        <div>
                          <ul className="without-slider-block cust_block_wallt first-wallet-active">
                            <li className="">
                              <div className={"nav-link"} >
                                <div title={address}>
                                  <h5> Wallet Address</h5>
                                  <p>{address.slice(0, 8)+ "..."+address.slice(address.length-8, address.length)}</p>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>  
                        :
                        ""  
                      }
                    </div> */}

                  
                  </div>
                </div>

              
                <div className="row ">
                  <div className="col-md-12">
                    <div className="portolio_watchlist_tabs">
                      <ul>
                        <li onClick={()=>set_tab_active(1)} className={(tab_active == 1 ? "active":"")}>Portfolio</li>
                        <li onClick={()=>set_tab_active(2)} className={(tab_active == 2 ? "active":"")}>Transactions</li>
                        {
                          active_networks.length  ?
                          <li onClick={()=>set_tab_active(3)} className={(tab_active == 3 ? "active":"")}>Analytics</li>
                          :
                          <li style={{opacity:"0.5"}}>Analytics</li>
                        }
                        {/* <li onClick={()=>set_tab_active(4)} className={(tab_active == 4 ? "active":"")}>Feed</li> */}
                      </ul>
                    </div>
                  </div>
                    
                  <div className="col-lg-2 col-md-3 ">
                  </div>

                  <div className="col-lg-8 col-xl-8 col-md-12">
                    <div className="row ">
                      <div className="col-md-4">  
                      </div>
                      
                      <div className="col-md-5">
                      </div>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        </>
        :
        <Before_login/>
        }

        <div className="container">
          <div className="padding_div_for_web homepage_minheight col-md-12">
            

                  

                  
           
            

{
user_token || url_wallet_address ?
<>
  {
    tab_active == 1 ||  tab_active == 2?
    <>
        <div className='row'>
          {
            tab_active == 1 ?
            <>
            <div className='col-md-12 col-xl-8 col-lg-12'>
            <div className="row">
              <div className="col-md-8 col-xl-8 col-lg-8 col-5">
                <h6 className='portfolio-sub-title'>Assets {tokens_count_length.length ? <>({tokens_count_length.length})</>:""}</h6>
              </div>
              <div className="col-md-4 col-xl-4 col-lg-4 col-7">
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
                    
                  <img src="/assets/img/filter_dropdown.svg" /> </button>
                  <ul className="dropdown-menu">
                    <li onClick={()=>set_tokens_view_type(1)}> <img src="/assets/img/list_view.svg" /> &nbsp; List View </li>
                    <li onClick={()=>set_tokens_view_type(2)}> <img src="/assets/img/account_view.svg" />  &nbsp; Accounts View </li>
                  </ul>
                  
                </div>
              </div>
            </div>

            {/* <p className='portfolio-sub-title'>Your Assets List</p> */}
            {
              tokens_view_type == 1 ?
              <>
                <div className="profile_page_table list_view_table">
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th className="mobile_hide">#</th>
                        <th className="coin_name mobile_hide">Token </th>
                        {/* <th className="mobile_hide">N/w</th> */}
                        <th className="mobile_hide">Price(24h %)</th>
                        {/* <th className="portolio_balance mobile_hide">Balance</th> */}
                        <th className="total_balance portfolio_mobile_right mobile_hide">Balance</th>
                        <th className="mobile_hide">Portfolio %</th>
                      </tr>
                    </thead>
                    <tbody>
                      
                    {
                      loader_status ?
                      <>
                      {  tokens_list_as_list_view.length || address ?
                      <>
                      {
                        tokens_list_as_list_view.length ?
                        (tokens_list_as_list_view.map((item, l) =>
                        <>
                        {
                          active_networks.includes(item.network)  ?
                          <tr key={l}>
                            <td className="mobile_hide">{++sl_num}</td>
                            <td  className="portfolio_table_balance">
                                <div className="media"  onClick={()=>getTokenDetail(item)}>
                                  <img className="rounded-circle"  title={item.name} src={item.image} onError={(e)=>{e.target.onerror = null; e.target.src=(item.network == 56 ? "/assets/img/portfolio/bsc.svg":item.network == 250 ? "/assets/img/portfolio/ftm.svg":item.network == 137 ? "/assets/img/portfolio/polygon.svg":item.network == 43114 ? "/assets/img/portfolio/avax.svg":"/assets/img/portfolio/eth.svg")}} alt="Token"  />
                                  <img className="rounded-circle portfolio_network_overlap" src={"/assets/img/portfolio/"+getNetworkImageNameByID(item.network)} alt="Token" title={getNetworkNameByID(item.network)} />
                                  <div className="media-body align-self-center">
                                    <h5 className="mt-0">{item.symbol}</h5>
                                    <p>{item.name}</p>
                                  </div>
                                </div>
                              </td>
                              
                            {/* <td className=" mobile_hide">
                              <img className="rounded-circle" src={"/assets/img/portfolio/"+getNetworkImageNameByID(item.network)} alt="Token" title={getNetworkNameByID(item.network)} style={{width:"24px"}}/>
                            </td> */}
                            <td className=" mobile_hide"  >
                              <h6>{USDFormatValue(item.price, 1)}</h6>
                              {
                                item.change_24h ? 
                                <>
                                  {
                                    item.change_24h > 0 ?
                                    <span className='green'>{(item.change_24h).toFixed(2)+" %"}</span>
                                    :
                                    <span className='red'>{(item.change_24h).toFixed(2)+" %"}</span>
                                  }
                                </>
                                :
                                "-"
                              }
                            </td>
                            <td className="portfolio_mobile_right" onClick={()=>getTokenDetail(item)}>
                                <h6>{(item.price) ? USDFormatValue(item.price*item.balance, 1) : "-"}</h6>
                                <p className="">{USDFormatValue(item.balance, 0)} {item.symbol}</p>
                            </td>
                            <td className="mobile_hide">
                            {
                              (((item.price*item.balance*100)/tokens_grand_total)).toFixed(2)
                            }
                            %
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
                                }</>:
                            (tokenLoader(5))
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
                    <div className="card-header" id={"headingOne"+i} data-toggle="collapse" data-target={`#collapseOne`+i} aria-expanded="false" aria-controls={`collapseOne`+i}>
                        <div className="row">
                          <div className="col-md-4 col-6">
                            <div className="media">
                              <div className="media-left">
                              {
                                added_wallet_list.length ?
                                  added_wallet_list.map((e, l) =>
                                  active_addresses.includes(e.wallet_address) ?
                                    e.wallet_address==item.wallet_address?
                                    <img src={`/assets/img/wallet/wallet${++l}.png`} alt="Wallet" title="Wallet"  className="media-object"/>
                                    :
                                    ""
                                  :
                                  ""
                                  )
                                  :
                                  active_addresses.includes(address) ? 
                                  <img src="/assets/img/wallet/wallet1.png" alt="Wallet" title="Wallet"  className="media-object" />
                                :
                                ""
                              }
                              {/* <img src={`/assets/img/wallet/wallet${1+i}.png`} className="media-object" /> */}
                              </div>
                              <div className="media-body align-self-center">
                                <h5>{getShortWalletAddress(item.wallet_address)}</h5>
                                <p>{item.nick_name}</p>
                              </div>
                              {/* <div className="media-right"> */}
                              
                                {/* <img src="/assets/img/dots.png" className="account_icon" /> */}
                                {/* <div className="dropdown  test_dropdown">
                                            <button className="btn dropdown_button" type="button" data-toggle="dropdown" >
                                            < img src="/assets/img/wallet_menu.svg" />
                                            </button>
                                            <div className="dropdown-menu show" >
                                              <ul>
                                              <li className="dropdown-item"  >< img src="/assets/img/copy_img.svg" />Copy Address</li>
                                              <li className="dropdown-item" >< img src="/assets/img/refresh_img.svg" />Refresh Balances</li>
                                                <li className="dropdown-item" ><img src="/assets/img/rename_img.svg" />Rename</li>
                                                <li className="dropdown-item" >< img src="/assets/img/delete_img.svg" />Remove Account</li>
                                              
                                              </ul>

                                            </div>
                                          </div> */}
                              {/* </div> */}
                            </div>
                          </div>
                          <div className="col-md-8 col-6">
                            <ul className="account_right">
                              <li className="network_display">
                                {
                                  (item.networks).includes(1) ?
                                  <span><img src="/assets/img/portfolio/eth.svg" /></span>
                                  :
                                  ""
                                }

                                {
                                  (item.networks).includes(56) ?
                                  <span><img src="/assets/img/portfolio/bsc.svg" /></span>
                                  :
                                  ""
                                }

                                {
                                  (item.networks).includes(137) ?
                                  <span><img src="/assets/img/portfolio/polygon.svg" /></span>
                                  :
                                  ""
                                }
                                {
                                  (item.networks).includes(250) ?
                                  <span><img src="/assets/img/portfolio/ftm.svg" /></span>
                                  :
                                  ""
                                }
                                {
                                  (item.networks).includes(43114) ?
                                  <span><img src="/assets/img/portfolio/avax.svg" /></span>
                                  :
                                  ""
                                }
                              </li>
                              <li>
                                <h5>{item.sub_total_balance ? (USDFormatValue(item.sub_total_balance, 1)):0}</h5>
                              </li>
                              <li>
                                <img src="/assets/img/filter_dropdown_white.svg"   className="accordion_arrow collapsed" />
                              </li>
                            </ul>
                            
                          </div>
                        </div>
                      </div>
                      <div id={`collapseOne`+i} className="collapse" aria-labelledby={"headingOne"+i} data-parent="#assetview">
                      <div className="card-body portfolio_card">
                        {/* <h6>Ethereum <span> $ 1254.25</span></h6> */}
                        <div className="profile_page_table">
                          <div className="table-responsive">
                              <table className="table table-striped">
                                <thead>
                                  <tr>
                                    <th className="mobile_hide">#</th>
                                    <th className="coin_name">Token </th>
                                    {/* <th className="mobile_hide">N/w</th> */}
                                    <th className="mobile_hide">Price(24h %)</th>
                                    <th className="total_balance portfolio_mobile_right">Balance</th>
                                    <th className="mobile_hide">Portfolio %</th>
                                  </tr>
                                </thead>
                                <tbody>
                                {
                                  item.tokens.length ?
                                  item.tokens.map((item, l) =>
                                  <>
                                    {
                                      active_networks.includes(item.network)  ?
                                      <tr key={l}>
                                        <td className="mobile_hide">{++l}</td>
                                        <td  className="portfolio_table_balance">
                                            <div className="media" onClick={()=>getTokenDetail(item)}>
                                              <img title={item.name} className="rounded-circle" src={item.image} onError={(e)=>{e.target.onerror = null; e.target.src=(item.network == 56 ? "/assets/img/portfolio/bsc.svg":item.network == 250 ? "/assets/img/portfolio/ftm.svg":item.network == 137 ? "/assets/img/portfolio/polygon.svg":item.network == 43114 ? "/assets/img/portfolio/avax.svg":"/assets/img/portfolio/eth.svg")}} alt="Token"  />
                                              <img className="rounded-circle rounded-circle portfolio_network_overlap" src={"/assets/img/portfolio/"+getNetworkImageNameByID(item.network)} alt="Token" title={getNetworkNameByID(item.network)} />

                                              <div className="media-body align-self-center">
                                                <h5 className="mt-0">{item.symbol}</h5>
                                                <p>{item.name}</p>
                                              </div>
                                            </div>
                                          </td>
                                          {/* <td className=" mobile_hide">
                                            <img className="rounded-circle rounded-circle portfolio_network_overlap" src={"/assets/img/portfolio/"+getNetworkImageNameByID(item.network)} alt="Token" title={getNetworkNameByID(item.network)} style={{width:"24px"}}/>
                                          </td>  */}
                                        {/* <td className=" mobile_hide">
                                          <img className="rounded-circle" src={"/assets/img/portfolio/"+getNetworkImageNameByID(item.network)} alt="Token" title="Token" style={{width:"24px"}}/>
                                        </td> */}
                                        <td className="mobile_hide">
                                          <h6>{USDFormatValue(item.price, 1)}</h6>
                                        
                                          {
                                            item.change_24h ? 
                                            <>
                                              {
                                                item.change_24h > 0 ?
                                                <span className='green'>{(item.change_24h).toFixed(2)+" %"}</span>
                                                :
                                                <span className='red'>{(item.change_24h).toFixed(2)+" %"}</span>
                                              }
                                            </>
                                            :
                                            "-"
                                          }
                                        </td>
                                        <td className="portfolio_mobile_right" onClick={()=>getTokenDetail(item)}>
                                            <h6>{(item.price) ? USDFormatValue(item.price*item.balance, 1) : "-"}</h6>
                                            <p className="">{USDFormatValue(item.balance, 0)} {item.symbol}</p>
                                        </td>
                                        <td className="mobile_hide">
                                        {
                                          (((item.price*item.balance*100)/tokens_grand_total)).toFixed(2)
                                        }
                                        %
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

                        {/* <h6>BSC <span> $ 1254.25</span></h6>
                        <div className="profile_page_table">
                          <div className="table-responsive">
                              <table className="table table-striped">
                                <thead>
                                    <tr>
                                      <th>#</th>
                                      <th className="coin_name">Token </th>
                                      <th className="mobile_hide">Price(24h %)</th>
                                      <th className="total_balance portfolio_mobile_right">Balance</th>
                                      <th className="mobile_hide">Portfolio %</th>
                                    </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>1</td>
                                    <td className="portfolio_table_balance">
                                        <div className="media">
                                          <img className="rounded-circle" src="https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1644979850" alt="Token" title="Token" />
                                          <div className="media-body align-self-center">
                                              <h5 className="mt-0">BNB</h5>
                                              <p>Binance</p>
                                          </div>
                                        </div>
                                    </td>
                                    <td className=" mobile_hide"><b>$ 304.29</b><span className="red">-0.62 %</span></td>
                                    <td className="portfolio_mobile_right">
                                      <h6>$ 20.57</h6>
                                      <p className="">0.068 BNB</p>
                                    </td>
                                    <td className="mobile_hide">57.82%</td>
                                  </tr>
                                  <tr>
                                    <td>2</td>
                                    <td className="portfolio_table_balance">
                                        <div className="media">
                                          <img className="rounded-circle" src="https://assets.coingecko.com/coins/images/9576/large/BUSD.png?1568947766" alt="Token" title="Token" />
                                          <div className="media-body align-self-center">
                                              <h5 className="mt-0">BUSD</h5>
                                              <p>BUSD Token</p>
                                          </div>
                                        </div>
                                    </td>
                                    
                                    <td className=" mobile_hide"><b>$ 1.00</b><span className="green">0.04 %</span></td>
                                    <td className="portfolio_mobile_right">
                                        <h6>$ 15.00</h6>
                                        <p className="">15.01 BUSD</p>
                                    </td>
                                    <td className="mobile_hide">42.18%</td>
                                  </tr>
                                </tbody>
                              </table>
                          </div>
                        </div> */}
                        
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
            </>
            :
            tab_active == 2 ?
            <div className='col-md-12 col-xl-8 col-lg-12'>
              {
                active_networks.length && active_addresses.length ?
                <Transactions networks={active_networks} addresses={active_addresses}/>
                :
                ""
              }
            </div>
            :
            <>
            </>
          }
          
          <div className='col-xl-4 col-md-6 col-lg-6 d-none d-md-block d-lg-block'>
              {
                display_tokens_balance ?
                <div>
                  {
                    ((pi_chart_values.length > 0) && (pi_chart_names.length > 0)) ?
                      <div>
                        <div className="dex-donot-pichart charts_subtitle">
                          <h6 >Chain Allocation</h6>
                          <p>Diversify crypto portfolio by allocating across different blockchains.</p>
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
                        <div >
                          <div className="dex-donot-pichart charts_subtitle">
                            <h6 >Token Allocation </h6>
                            <p>Minimize risk through diversified asset allocation in investment portfolio.</p>
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
      <Analytics data={{options2:options2, tokens_list:tokens_list_as_list_view, tokens_balance:tokens_grand_total, networks:active_networks, addresses:active_addresses, token_allocation_values:token_allocation_values, token_allocation_names:token_allocation_names, pi_chart_values:pi_chart_values, pi_chart_names:pi_chart_names}} />
      :
      ""
    }
    </>
    :
    tab_active == 4 ?
    <>
    <Feed tokens={all_tokens}/>
    </>
    :
    null
  }

<div className="add_wallet_modal">
  <div className={"modal "+(add_new_wallet_modal ? " modal-show" : "")} id="walletModal" style={add_new_wallet_modal ? { display: 'block' } : { display: 'none' }} role="dialog">
  <div className="modal-dialog modal_small" style={{maxWidth:"580px"}}>
    <div className="modal-content">
    <button type="button" className="close close_wallet" onClick={()=>closeaddwallet()}><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" /></button>
        <h2 style={{fontSize:"20px"}} className="modal-title text-center">{wallet_row_id ? "Update":"Add New"} Wallet</h2>
      
      
      <div className="modal-body addwallet_popup">
      <p className="wallet-p text-center mb-2">{wallet_row_id ? "Update":"Add"} wallet to explore experience multiple wallets and networks</p>
        {/* <div className=" connect_with_block">
          <div className="row">
            <div className="col-md-4 col-4 pr-1 padding_less">
              <div className="connect_with metamask-wallet">
                <img src="/assets/img/metamask.png" alt="Metamask" title="Metamask"/>Metamask
              </div>
            </div>

          <div className="col-md-4 col-4 pl-1 pr-1 padding_less">
              <div className="connect_with myether-wallet"><img src="/assets/img/mew.png" alt="My Wallet" title="My Wallet"/>MyEtherWallet </div>
          </div>

          <div className="col-md-4 col-4 pl-1 padding_less">
              <div className="connect_with binance-wallet"><img src="/assets/img/binance.png" alt="Binance" title="Binance" />Binance</div>                                    
          </div>
          </div>
        </div> */}
        <div className="modal_input_block">
          <label>Wallet address <span className="red">*</span></label>
            <input className="text" type="text" placeholder="Type Your Wallet Address"   value={pastAddress} onChange={(e)=> setpastAddress(e.target.value)} />
            <div className="err_message">{errpastAddress}</div>
        </div>
        <div className="modal_input_block">
          <label>Nickname <span className="red">*</span></label>
            <input className="text" type="text" placeholder="Type Your Nickname" value={nickName} onChange={(e)=> setnickName(e.target.value)} />
            <div className="err_message">{errnickName}</div>
        </div>
        </div>
      
          <div className='button_wallet '>
          <button type="submit" className="add_wallet_btn button_transition" onClick={saveWallet} >
        {loader ? (
                <div className="loader"><span className="spinner-border spinner-border-sm "></span>  {wallet_row_id ? "Update":"Add"} Wallet</div>
                ) : (
                    <>{wallet_row_id ? "Update":"Add"} Wallet</>
            )}</button>
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
      <div className={"modal "+(wallet_confirm_remove_modal ? " modal-show":"")} style={wallet_confirm_remove_modal ? { display: 'block' } : { display: 'none' }} role="dialog">
       <div className="modal-dialog modal-sm modal_small">
          <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close" onClick={()=>set_wallet_confirm_remove_modal(false)} data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" /></button>
              <div className="text-center">
                <img src="/assets/img/cancel.png" alt="Cancel" title="Cancel"/>
                <h4 className="modal-title">Remove Wallet </h4>
                <h5 className="invalidcredential">Are you sure you want to remove {remove_wallet_address? <strong>{getShortWalletAddress(remove_wallet_address)}</strong>:""} from your Portfolio?</h5>
                <button type="button" className="btn-gradient-primary button_transition confirm_button"  data-dismiss="modal"> <span onClick={()=>removeWallet()}>Remove</span>  </button>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
    


    <div className="remove_wallet_modal">
      <div className={"modal "+(change_address_modal_status ? " modal-show":"")} style={change_address_modal_status ?{ display: 'block' } : { display: 'none' }}>
        <div className="modal-dialog modal_small">
          <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close close_wallet" onClick={()=> set_change_address_modal_status(false)} data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" /></button>
             <h2 style={{fontSize:"20px"}}>Change Your Wallet</h2>
              <p>Track Your All Wallet Holding & Performance </p> 
             <form method="post" action="">
             <p className="wallet_title">Wallet address<span className="label_required">*</span></p>
              <div className="input-group portfolio-search-form">
                <input type="text" className="form-control" placeholder="Wallet address" value={search_wallet_address} onChange={(e)=>set_search_wallet_address((e.target.value).toLowerCase())} />
                {/* <div className="input-group-append">
                  <button className="input-group-text"  type="submit" onClick={(e)=>searchWalletData(e)}>
                  <img  style={{width:"24px"}} src="/assets/img/portfolio-search.svg" placeholder="Search Your Wallet Address" />
                  </button>
                </div> */}
              </div>
              <div className='wallet-search-error text-left' >{err_search_wallet_address}</div>
              <div className="button_wallet">
              <button className='btn btn-primary-gradient button_transition btn-block mt-3 mb-2' type="submit" onClick={(e)=>searchWalletData(e)}>
              Track your Wallet
              </button>
              </div>

              <div className="addwallet_popup_login mt-2">
              <ul>
                  <li>
                    <h5>
                      <div className="media">
                        <div className="media-left align-self-center">
                        <img src="assets/img/email_port.svg" />
                        </div>
                        <div className="media-body align-self-center track-more-title">
                          Want to track more wallet addresses? <a href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url+"/portfolio"}>Click Here</a> to Sign In
                        </div>
                      </div>
                      </h5>
                  </li>
                  
                </ul>
              </div>

              <h6 className="recent-search-title">Recent Searches</h6>
              {
                (
                  (JsCookie.get('recent_portfolio_wallets')) && 
                  (JSON.parse(JsCookie.get('recent_portfolio_wallets')).length > 0)
                ) ?
                JSON.parse(JsCookie.get('recent_portfolio_wallets')).reverse().map((e,i) =>
                i > 0 ?
                <p key={i++} className="recent-search-value" style={{cursor:"pointer"}} onClick={()=>recentSearchedWalletData(e)}><i className="fa fa-history recent-search-icon" aria-hidden="true"></i>  <span> {e}</span></p>
                :
                <p key={i++} className="recent-search-value"><i className="fa fa-history recent-search-icon" aria-hidden="true"></i> <span> {e}</span></p>
                )
                :
                url_wallet_address ?
                <p className="recent-search-value"><i className="fa fa-history recent-search-icon" aria-hidden="true"></i> <span>{url_wallet_address}</span></p>
                :
                null
              }
              
             </form>
            </div>
          </div>
        </div>
      </div> 
    </div>



    <div className="remove_wallet_modal token-details-popup">
      <div className={"modal "+(token_details_modal_status ? " modal-show":"")} style={token_details_modal_status?{display:'block'}:{display:"none"}}>
        <div className="modal-dialog " >
          <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close close_wallet" onClick={()=> set_token_details_modal_status(false)} data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" /></button>
             {
                token_detail.balance ?
                <TokenDetail token={token_detail} total_balance={tokens_grand_total}/>
                :
                ""
             }
             
             {/* <h2 style={{fontSize:"20px"}}>Token Detail</h2>
             
             <p> Name -<img className="rounded-circle"   title={token_detail.name} src={token_detail.image} onError={(e)=>{e.target.onerror = null; e.target.src=(token_detail.network == 56 ? "/assets/img/portfolio/bsc.svg":token_detail.network == 250 ? "/assets/img/portfolio/ftm.svg":token_detail.network == 137 ?
              "/assets/img/portfolio/polygon.svg":token_detail.network == 43114 ? "/assets/img/portfolio/avax.svg":"/assets/img/portfolio/eth.svg")}} alt="Token"  />{token_detail.name} </p> 
             <p> Network -<img className="rounded-circle" src={"/assets/img/portfolio/"+getNetworkImageNameByID(token_detail.network)} alt="Token" title={getNetworkNameByID(token_detail.network)} style={{width:"24px"}}/> </p> 
             <p> Price - {USDFormatValue(token_detail.price, 1)} </p> 
             <p> Balance - {(token_detail.price) ? USDFormatValue(token_detail.price*token_detail.balance, 1) : "-"}</p> 
             <p> Portfolio -  {(((token_detail.price*token_detail.balance*100)/tokens_grand_total)).toFixed(2)}%</p>  */}
             
            </div>
          </div>
        </div>
      </div> 
    </div>

      
      
      {/* ...........coming soon modal starts here........ */}
      {/* {
        network_tab == 4?
        <><h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
           <p className="coming_soon_subtext">This feature will be available soon</p></>
              
        :
        null

      } */}
        
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

export async function getServerSideProps({req,query}) 
{
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    if(userAgent.user_token) 
    {
      return { props: { userAgent: userAgent, config:config(userAgent.user_token)} }
    }
    else 
    {
      if(userAgent.recent_used_wallet && (!query.address))
      {
        return {
          redirect: {
              destination: "/portfolio?address="+userAgent.recent_used_wallet,
              permanent: false,
          }
        }
      }
      else
      {
        return { props: { userAgent:userAgent, config:config(""), search_address:query.address ? query.address:"" } }
      }
    }
}
