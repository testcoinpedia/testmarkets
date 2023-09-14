import React, { useEffect, useState } from 'react'
import { graphql_headers, graphqlApiURL, separator, graphqlApiKEY, app_coinpedia_url, market_coinpedia_url } from '../../components/constants'
import { tokenBasic, otherDetails, getVolume24h, getHighLow24h } from '../../components/search_contract_address/live_price'
import Search_token from '../../components/search_token'
import { ethers } from 'ethers'
import Web3 from 'web3'
import Head from 'next/head'
import Axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import News from '../../components/token_details/news'
import Events from '../../components/token_details/events'
import Price_analysis from '../../components/token_details/price_analysis'
import Price_prediction from '../../components/token_details/price_prediction'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
// import SideBarExchangeDetails from "../../components/sideBarExchangeBlock"
// import Search_Contract_Address from '../../components/searchContractAddress'
import ReactPaginate from 'react-paginate'
import Price_chart from '../../components/search_contract_address/charts/price'
import { bitgquery_graph_ranges } from '../../components/token_details/tokenDetailsFunctions' 


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

export default function TokenDetails({post, address, tokenData}) 
{
   console.log("tokenData", tokenData)
  
  // post.smartContract.currency.symbol
  const [percentage_change_24h, set_percentage_change_24h] = useState(false)
  const [contract_copy_status, set_contract_copy_status] = useState("")
  const [share_modal_status, set_share_modal_status] = useState(false)
  
  
  const [exchangelistnew, set_exchange_list_new] = useState([])
  const [live_price, set_live_price] = useState(tokenData.live_price ? tokenData.live_price:"")
  const [contract_24h_volume, set_contract_24h_volume] = useState(0)
  const [tokentransactions, set_tokentransactions] = useState([])
  
  const [graphDate, set_graphDate] = useState(1)
  const [market_cap, set_market_cap] = useState(0)
  const [token_supply, set_token_supply] = useState(tokenData.token_supply ? tokenData.token_supply:"")
  const [connected_address, set_connected_address] = useState("")
  const [wallet_data, setWalletData] = useState([]);
  const [walletspageCount, setWalletsPageCount] = useState(0)

  const [handleModalConnections, setHandleModalConnections] = useState(false)
  const [handleModalMainNetworks, setHandleModalMainNetworks] = useState(false)

  const [contract_address, setContractAddress] = useState("")

  const [customDate, setCustomDate] = useState(false)
  const [customstartdate, setCustomstartdate] = useState("")
  const [customenddate, setCustomenddate] = useState("")
  const [liquidity, set_liquidity] = useState(0)
  const [cal_liquidity, set_cal_liquidity] = useState(0)

  const [connectedtokenlist, set_connectedtokenlist] = useState([])
  const [walletTokenUsdBal, set_walletTokenUsdBal] = useState(0)
  const [loadmore, set_loadmore] = useState(false)

  const [main_tab, set_main_tab] = useState("")

  const [selectedTokenModal, setSelectedTokenModal] = useState(false)
  const [selectedwallettype, setSelectedWalletType] = useState(0)
  const [searchBy, setSearchBy] = useState("0")

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0)
  const [graph_date_type, set_graph_date_type] = useState(3)

  const [high_24h, set_high_24h] = useState(0)
  const [low_24h, set_low_24h] = useState(0)
  const [open_24h, set_open_24h] = useState(0)
  const [close_24h, set_close_24h] = useState(0)
  


  useEffect(() => 
  {
    getTokenDetails()
    // getTokendetails(window.location.pathname.substring(5))
    // getTokenTransactions(window.location.pathname.substring(5))
    // getexchangedata(window.location.pathname.substring(5))
    // getGraphData(4, isBNB, window.location.pathname.substring(5))
    // getTokenUsdPrice(window.location.pathname.substring(5))
    // get24hVolume(window.location.pathname.substring(5))
    // setContractAddress(window.location.pathname.substring(5))

    // if (localStorage.getItem("walletconnectedtype") === "1") {
    //   getBEPAccountDetails(0)
    //   getETHAccountDetails(0)
    // }
  }, [address])

 const getTokenDetails = async () =>
 {  
    await set_main_tab("")
    await set_main_tab(1)
    await getexchangedata(address)

    const response2 = await getVolume24h(tokenData.contract_type, address)
    if(response2.status)
    {
      if(response2.message.volume_24h)
      {
        set_contract_24h_volume(response2.message.volume_24h)
      }
    }

    //getMarketCap(address)
    //await getTokenTransactions(address)

    const response3 = await getHighLow24h(tokenData.contract_type, address)
    if(response3.status)
    {
      set_high_24h(response3.message.high)
      set_low_24h(response3.message.low)
      set_open_24h(response3.message.open)
      set_close_24h(response3.message.close)

      console.log("asdf", response3)
    }

    if(tokenData.live_price)
    {
      set_live_price(tokenData.live_price)
      set_token_supply(tokenData.total_supply)
      const response = await otherDetails(tokenData.contract_type, address)
      if(response.status)
      {
        if(response.message.price_24h && tokenData.live_price)
        {
          set_percentage_change_24h((((tokenData.live_price - response.message.price_24h)/tokenData.live_price)* 100).toFixed(2))
        }
      }
    }
    else
    {
      const getData = await tokenBasic(address)
      if(getData)
      {
        if(getData.live_price)
        {
          set_live_price(getData.live_price)
          set_token_supply(getData.total_supply)

          const response = await otherDetails(tokenData.contract_type, address)
          if(response.status)
          {
            if(response.message.price_24h && getData.live_price)
            {
              set_percentage_change_24h((((getData.live_price - response.message.price_24h)/getData.live_price)* 100).toFixed(2))
            }
          }
        }
      }
    }
    
 }

const totalLiquidity = async () =>
{
  const pairAbi = ["function totalSupply() view returns (uint256)"]
  let web3 = new Web3(Web3.givenProvider)
  var pair = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'
  const contract = new web3.eth.Contract(pairAbi, address)
  console("contract", contract)

  // reserves = contract.functions.getReserves().call()
  // reserve_usdc = reserves[0]
  // total_supply = contract.functions.totalSupply().call()

  // var lp_address = '0x76E2E2D4d655b83545D4c50D9521F5bc63bC5329' 
  // lp_balance = contract.functions.balanceOf(lp_address).call()
  // lp_usdc = reserve_usdc * lp_balance / total_supply   
  // usdc_decimals = 6
  // lp_usdc_adjusted = lp_usdc / 10 ** usdc_decimals
}

const getMarketCap = async (id, decval, usd_price) => 
{
 
  //    if (tokenType.indexOf('ERC') >= 0 ) {
  //      mainnetUrl = 'https://bsc-dataseed.binance.org/'
  //    } else {
  //      mainnetUrl = 'https://mainnet.infura.io/v3/5fd436e2291c47fe9b20a17372ad8057'
  //    }

  // const tokenAbi = ["function totalSupply() view returns (uint256)"];
  // const tokenContract = new ethers.Contract(id, tokenAbi, provider);
  // const supply = await tokenContract.totalSupply() / (10 ** decval);
  // set_market_cap(supply * usd_price)


  if(id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' || id !== '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984')
  {
      const pairAbi = ["function getPair(address first, address second) view returns (address)"]
      const pairContract = new ethers.Contract("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", pairAbi, provider);
      const pairAddr = await pairContract.getPair(id, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

      const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
      const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
      const reserve = await liqContract.getReserves();
      console.log("reserve", reserve)
      const token0 = await liqContract.token0();
      console.log("token0", token0)
      // const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decval) * usd_price * 2;
      // console.log("liquidity", liquidity)
  }

}


  var yesterday = moment()
  function valid(current) {
    return current.isBefore(yesterday)
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


  const valid2 = (current) => {
    return current.isBefore(yesterday)
  }
  const getTotalMaxSupply = (id, decimal) => 
  {
    // https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&apikey=YourApiKeyToken
    Axios.get("https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=" + id + "&apikey=E9DBMPJU7N6FK7ZZDK86YR2EZ4K4YTHZJ1")
      .then(response => {
        if (response.status) {
          console.log(response)
         // settoken_max_supply(response.data.result / 10 ** decimal)
        }
      })
  }
  const getexchangedata = async (id) => {
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())

    var network_id = "ethereum"
    if(tokenData.contract_type == 2)
    {
      network_id = "bsc"
    }
    const query = `
    query {
      ethereum(network: `+ network_id +`) {
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

    const url = "https://graphql.bitquery.io/";
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

    
    var calculated_liquidity = 0
    var mul_liquidity = 0
    const resultArray = new Array()
    var response1 = 0
    var pair_two_value_in_Usd = 0
    var pair_one_value_in_usd = 0
    const res = await fetch(url, opts)
    const result = await res.json()
    if (result.data.ethereum) 
    {
      var request_API_Status = false
      if (result.data.ethereum.dexTrades) 
      {
        console.log("exchanges result", result.data.ethereum.dexTrades)
       
        for(let item of result.data.ethereum.dexTrades)
        {
          var createObj = {}
          createObj['exchange_name'] = item.exchange.fullName
          createObj['pair_one_name'] = item.pair.name
          createObj['exchange_address'] = item.poolToken.address.address
          createObj['pair_one_token_address'] = item.pair.address
          createObj['trades'] = item.trades
          createObj['tradeAmount'] = item.tradeAmount
          calculated_liquidity += await item.tradeAmount ? parseFloat(item.tradeAmount):0
          mul_liquidity += await (item.tradeAmount ? parseFloat(item.tradeAmount):1)*(item.trades ? parseFloat(item.trades):1)
          
          await resultArray.push(createObj)
        }
        await set_liquidity(calculated_liquidity)
        await set_cal_liquidity(mul_liquidity)
        set_exchange_list_new(resultArray)
        
        // result.data.ethereum.dexTrades.map(async (item, i) => 
        // {
        //   response1 = await getexchangevalue(item.poolToken.address.address)
        //   if(response1) 
        //   {
        //     response1.map(async (e) => {
        //       if (item.pair.address == e.currency.address) {
        //         createObj['pair_one_value'] = e.value
        //         var res = await livePrice(item.pair.address)
        //         console.log(item.pair.name, res)
        //         createObj['pair_one_live_price'] = res
        //         pair_one_value_in_usd = e.value * res

        //       }
              
        //       if (id.toLowerCase() == e.currency.address) {
        //         createObj['pair_two_value'] = e.value
        //         //var res =await livePrice(id)
        //         // console.log("symbol", res)
        //         // pair_two_value_in_Usd = e.value*res
        //         // createObj['pair_two_live_price']=res
        //         console.log(pair_two_value_in_Usd)
        //       }
        //       createObj['liquidity_in_pool'] = pair_one_value_in_usd
        //     })
        //   }
        // })



      }

    }
  }


  const livePrice = async (id) => 
  {
    const dateSince = ((new Date()).toISOString())
    const query = `
        query
        {
        ethereum(network:ethereum ) {
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
    `
    const url = "https://graphql.bitquery.io/";
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
    const res = await fetch(url, opts)
    const result = await res.json()

    if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {
      console.log(result.data.ethereum.dexTrades)

      if (id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
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


  const livePriceB = async (id) => {
    const dateSince = ((new Date()).toISOString())
    const query = `
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
    const url = "https://graphql.bitquery.io/";
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
    const res = await fetch(url, opts)
    const result = await res.json()

    if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {
      console.log(result.data.ethereum.dexTrades)

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

  
  const getexchangevalue = async (pool_token_address) => {
    const query = `
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

    const url = "https://graphql.bitquery.io/";
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

    const res = await fetch(url, opts)
    const result = await res.json()
    if (result.data.ethereum) {
      if (result.data.ethereum.address) {

        if (result.data.ethereum.address[0].balances) {
          return result.data.ethereum.address[0].balances
        }
      }
    }




  }
  const getTokenTransactions = (id) => {
    const dateSince = ((new Date(Date.now() - 900*24 * 60 * 60 * 1000)).toISOString())
    const query = `
                query
                {
                  ethereum(network: bsc) {
                    dexTrades(
                      any: [{baseCurrency: {is: `+ '"' + id + '"' + `}}]
                      date: {since: `+ '"' + dateSince + '"' + ` }
                      options: {desc: ["tradeIndex", "block.timestamp.time"], limitBy: {each: "baseCurrency.symbol", limit: 10}}
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

    const url = "https://graphql.bitquery.io/";
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
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        console.log("txns", result.data.ethereum)
        if (result.data.ethereum != null) 
        {
          
          set_tokentransactions(result.data.ethereum.dexTrades)
        }
      })
      .catch(console.error);
  }


  const getTokenexchange = (id, pageoffset) => {
    const query = `
          query{
            ethereum(network: ethereum){
              dexTrades(options:{desc: "amount"},
                date: {since: null till: null }
                baseCurrency: {is: "`+ id + `"}
                ) {

                  exchange {
                    fullName
                  }

                  trades: count
                  takers: count(uniq: takers)
                  makers: count(uniq: makers)

                  amount: baseAmount
                  baseCurrency{symbol}
              }
            }
          }
          ` ;

    const url = "https://graphql.bitquery.io/";
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
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum != null) {
          const slice = result.data.ethereum.dexTrades.slice(pageoffset, pageoffset + 10)
          const postData = slice.map((e, i) => {
            return <tr key={i}>
              <td>{e.exchange.fullName}</td>
              <td>{separator(e.trades)}</td>
              <td>{separator(e.takers)}</td>
              <td>{separator(e.makers)}</td>
              <td>{separator(e.amount.toFixed(2))}</td>
            </tr>
          })
          setData(postData)
          setPageCount(result.data.ethereum.dexTrades.length / 10)
        }
      })
      .catch(console.error);
  }


  const handlePageClick = (e) => {
    setSelectedPage(e.selected)
    getTokenexchange(contract_address, (e.selected * 10))
  };

  const getTokendetails = (id, usd_price) => 
  {
    const query = `
                query
                { 
                  ethereum(network: ethereum) {
                    address(address: {is: "`+ id + `"}){

                      annotation
                      address

                      smartContract {
                        contractType
                        currency{
                          symbol
                          name
                          decimals
                          tokenType
                        }
                      }
                      balance
                    }
                  } 
              }
          ` ;

    const url = "https://graphql.bitquery.io/";
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
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum === null) {
          setContractAddress("")
        }
        else {
          getTotalMaxSupply(id, result.data.ethereum.address[0].smartContract.currency.decimals)
          getMarketCap(window.location.pathname.substring(5), result.data.ethereum.address[0].smartContract.currency.decimals, usd_price)

        }
      })
      .catch(console.error);
  }

 


  

  const getGraphData = async (datetime, id) => 
  {


    if(datetime === "") 
    {
      datetime = graphDate;
    }
    set_graphDate(datetime)

    var symbolName = ""
    let from_date = ""
    let to_date = ""

    symbolName = tokenData.symbol ? tokenData.symbol : "-"

    from_date = new Date();
    from_date = from_date.setDate(from_date.getDate() - 1);
    from_date = Date.parse((new Date(from_date)).toString()) / 1000;
    to_date = Date.parse((new Date()).toString()) / 1000;

    if (datetime === 1) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1);
      from_date = Date.parse((new Date(from_date)).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 2) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 7);
      from_date = Date.parse(new Date(from_date).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 3) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 31);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 4) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 365);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 5) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 730);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 6) {
      setCustomDate(!customDate)
      from_date = Date.parse(customstartdate)
      to_date = Date.parse(customenddate)

      from_date = from_date / 1000
      to_date = to_date / 1000
    }

    const dateSince = new Date(from_date * 1000);
    const fromDate = dateSince.toISOString();
    const dateTill = new Date(to_date * 1000);
    const toDate = dateTill.toISOString();

    let query = ""

    if (id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
      query = `
          query
          {
            ethereum(network: ethereum) {
              dexTrades(
                exchangeName : {is: ""}
                date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
                options: {asc: "timeInterval.hour"}
              ) {
                timeInterval {
                  hour(count: 3)
                }
                baseCurrency {
                  symbol
                }        
                quoteCurrency {
                  symbol
                }
                quote: quotePrice
                buyAmount: baseAmount
                sellAmount: quoteAmount
                tradeAmountInUsd: tradeAmount(in: USD)
              }
            }
          }
        `
    }
    else {
      query = `
        query
        {
          ethereum(network: ethereum) {
            dexTrades(
              exchangeName : {is: ""}
              date: {after: "` + fromDate + `" , till: "` + toDate + `"}
              any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]
              options: {asc: "timeInterval.hour"}
            ) {
              timeInterval {
                hour(count: 3)
              }
              baseCurrency {
                symbol
              }        
              quoteCurrency {
                symbol
              }
              quote: quotePrice
              buyAmount: baseAmount
              sellAmount: quoteAmount
              tradeAmountInUsd: tradeAmount(in: USD)
            }
          }
        }
      `
    }

    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()
    if(result)
    {
      if(result.data.ethereum != null && result.data.ethereum.dexTrades != null) 
      {
        const res_array = await setGraphData(result.data.ethereum.dexTrades, tokenData.contract_type)
        console.log(res_array)
      }
    }
  }

  const getDetails = async () =>
  {
    const get_live_price = await getLivePrice(address)
    console.log("Address ", get_live_price)
  }

  const setGraphData = async (pass_data, contract_type) =>
  {
    var result = []
    for(let i of pass_data)
    { 
      
      var rate = 0
      if(contract_type == 1) 
      {
        rate = i.tradeAmountInUsd / i.buyAmount;
      } 
      else 
      {
        rate = i.quote
      }

      var create_obj = {}
      var date = new Date(i.timeInterval.hour)
      create_obj['time'] = date.getTime()
      create_obj['value'] = rate

      await result.push(create_obj)

    }

    return { result:result }
  }



  const getTokensList = (wallet_address, networktype) => 
  {

    let query = ""

    if(networktype === "ethereum") 
    {
      query = `
      query{
          ethereum(network: ethereum) {
            address(address: {is: "`+ wallet_address + `"}) {
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
        ` ;
    }
    else 
    {
      query = `
      query{
        ethereum(network: bsc) {
        address(address: {is: "`+ wallet_address + `"}) {
          address
          balances(height: {lteq: 10814942}) {
            currency {
              symbol
              address
              name
              decimals
              }
              value
            }
          }             
        }
      }
        ` ;
    }

    const url = "https://graphql.bitquery.io/";
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

    if (networktype === "ethereum") 
    {

      let balance = 0

      fetch(url, opts)
        .then(res => res.json())
        .then(result => {

          result.data.ethereum.address[0].balances.map((item) => {
            if (item.currency.address === "-") {
              item.currency.address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            }

            var dateSince = ((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString())
            query = `
                      query
                      {
                        ethereum(network: ethereum) {
                          dexTrades(
                            date: {since: "` + dateSince + `"}
                            any: [{baseCurrency: {is: "`+ item.currency.address + `"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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

            const tokenBalOpts = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-API-KEY": graphqlApiKEY
              },
              body: JSON.stringify({
                query
              })
            };

            fetch(url, tokenBalOpts)
              .then(tokenBalRes => tokenBalRes.json())
              .then(tokenBalResult => {
                if (item.currency.address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote;
                } else {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote * tokenBalResult.data.ethereum.dexTrades[1].quote;
                  balance = (balance + item.quotePrice * item.value)
                }
                set_connectedtokenlist(result.data.ethereum.address[0].balances)
                set_walletTokenUsdBal(balance)

              })
              .catch(console.error);
            return null;
          })


        })
        .catch(console.error);

    }
    else {

      let balance = 0

      fetch(url, opts)
        .then(res => res.json())
        .then(result => {
          result.data.ethereum.address[0].balances.map((item) => {
            if (item.currency.address === "-") {
              item.currency.address = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
            }

            var dateSince = ((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString())
            query = `
                                  query
                                  {
                                    ethereum(network: bsc) {
                                      dexTrades(
                                        date: {since: "` + dateSince + `"}
                                        any: [{baseCurrency: {is: `+ '"' + item.currency.address + '"' + `}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
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

            const tokenBalOpts = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-API-KEY": graphqlApiKEY
              },
              body: JSON.stringify({
                query
              })
            };

            fetch(url, tokenBalOpts)
              .then(tokenBalRes => tokenBalRes.json())
              .then(tokenBalResult => {
                if (item.currency.address === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c") {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote;
                } else {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote * tokenBalResult.data.ethereum.dexTrades[1].quote;
                  balance = (balance + item.quotePrice * item.value)
                }
                set_connectedtokenlist(result.data.ethereum.address[0].balances)
                set_walletTokenUsdBal(balance)

              })
              .catch(console.error);
            return null;
          })

        })
        .catch(console.error);
    }

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
    const url = "https://graphql.bitquery.io/";
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

    fetch(url, opts)
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

          const slice = all_data.slice(0, 0 + 10)
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
          setWalletsPageCount(all_data.length / 10)
        }
      })
      .catch(console.error);
  }


  const getTokenAddress = (address, type, connecttionType) => {
    localStorage.setItem("walletconnectedtype", "1")
    setSelectedWalletType(connecttionType)
    set_connected_address(address)
    setSelectedTokenModal(false)

    if (type === 1) {
      window.location.reload()
    }
  }

  const getBEPAccountDetails = (type) => {
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "private") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 2)
              getTokensList(first_address, "bsc")
              getWalletDetails(first_address, "bsc", 2)
            }
            return true
          })
        }
      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "private") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 2)
              getTokensList(first_address, "bsc")
              getWalletDetails(first_address, "bsc", 2)
            }
            return true
          })
        }
      })
    }
  }


  const getETHAccountDetails = (type) => {
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "main") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 1)
              getTokensList(first_address, "ethereum")
              getWalletDetails(first_address, "ethereum", 1)
            }
            return true
          })
        }
      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "main") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 1)
              getTokensList(first_address, "ethereum")
              getWalletDetails(first_address, "ethereum", 1)
            }
            return true
          })
        }
      })
    }
  }

  const connectToEthWallet = () => {
    setSelectedWalletType(1)
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "main") {
          try {
            window.ethereum.enable().then(function (res) {
              getETHAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else if (networkName === "private") {
          try {
            window.ethereum.enable().then(function (res) {
              getBEPAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else {
          handleModalMainNetwork()
        }

      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      try {
        web3.eth.net.getNetworkType().then(function (networkName) {
          if (networkName === "main") {
            try {
              window.ethereum.enable().then(function (res) {
                getETHAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else if (networkName === "private") {
            try {
              window.ethereum.enable().then(function (res) {
                getBEPAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else {
            handleModalMainNetwork()
          }
        })
      }
      catch (error) {
        // console.log('ethereum error, ', error)
      }
    }
    else {
      handleModalConnection()
    }
  }

  const myReferrlaLink = () => {
    var copyText = document.getElementById("referral-link");
    copyText.select();
    document.execCommand("Copy");
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied";
  }

  const handleChange = (isBNB) => {
    // set_checked(isBNB)
    // set_isBNB(isBNB)
    // getGraphData("", isBNB, contract_address)
  }


  const connectToWallet = () => {
    setSelectedWalletType(2)
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "private") {
          try {
            window.ethereum.enable().then(function (res) {
              getBEPAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else if (networkName === "main") {
          try {
            window.ethereum.enable().then(function (res) {
              getETHAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else {
          handleModalMainNetwork()
        }

      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      try {
        web3.eth.net.getNetworkType().then(function (networkName) {
          if (networkName === "private") {
            try {
              window.ethereum.enable().then(function (res) {
                getBEPAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else if (networkName === "main") {
            try {
              window.ethereum.enable().then(function (res) {
                getETHAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else {
            handleModalMainNetwork()
          }
        })
      }
      catch (error) {
        // console.log('ethereum error, ', error)
      }
    }
    else {
      handleModalConnection()
    }
  }


  const handleModalConnection = () => {
    setHandleModalMainNetworks(false)
    setHandleModalConnections(!handleModalConnections)
  }

  const handleModalMainNetwork = () => {
    setHandleModalConnections(false)
    setHandleModalMainNetworks(!handleModalMainNetworks)
  }


  // const CheckContractAddress =(address)=>{

  //   setvalidContractAddress("")
  //   let query = "";

  //   if(searchBy === "0"){
  //     query = `
  //     query
  //     { 
  //       ethereum(network: ethereum) {
  //         address(address: {is: "`+address+`"}){

  //           annotation
  //           address

  //           smartContract {
  //             contractType
  //             currency{
  //               symbol
  //               name
  //               decimals
  //               tokenType
  //             }
  //           }
  //           balance
  //         }
  //       } 
  //   }
  //   ` ;
  //   }
  //   else{
  //     query = `
  //     query
  //     { 
  //       ethereum(network: bsc) {
  //         address(address: {is: "`+address+`"}){

  //           annotation
  //           address

  //           smartContract {
  //             contractType
  //             currency{
  //               symbol
  //               name
  //               decimals
  //               tokenType
  //             }
  //           }
  //           balance
  //         }
  //       } 
  //   }
  //   ` ;
  //   }


  //   const url = "https://graphql.bitquery.io/";
  //   const opts = {
  //   method: "POST",
  //   headers: {
  //   "Content-Type": "application/json",
  //   "X-API-KEY": graphqlApiKEY
  //   },
  //   body: JSON.stringify({
  //     query: query, 
  //   })
  //   };

  //  return fetch(url, opts)
  //   .then(res => res.json())
  //   .then(result => {  
  //     if(result.data.ethereum !== null){
  //       if(result.data.ethereum.address[0].smartContract){
  //         if(result.data.ethereum.address[0].smartContract.currency){ 
  //           if(searchBy === "0"){
  //             window.location.replace(market_coinpedia_url+'eth/'+address) 
  //           }
  //           else{
  //             window.location.replace(market_coinpedia_url+'bsc/'+address) 
  //           } 
  //         }
  //         else{
  //           setvalidContractAddress("Contract address or network type is invalid.")
  //         }
  //       }
  //       else{
  //         setvalidContractAddress("Contract address or network type is invalid.")
  //       }
  //     } 
  //     else{
  //       setvalidContractAddress("Contract address or network type is invalid.")
  //     } 
  //   }) 

  // }

  const plotGraph = async (pass_date_type) =>
  {
    await set_graph_date_type("")
    await set_graph_date_type(pass_date_type)
  }

  const setMainTab = async (pass_type) =>
  {
    await set_main_tab("")
    await set_main_tab(pass_type)
  }

  

  return (
    <>
      {/* {
        metadata.smartContract.currency.name.symbol
          ?
          <Head>
            <title>{metadata.smartContract.currency.name.symbol.toUpperCase()}</title>
          </Head>
          :
          null
      } */}

    <div className="page">
    <div className="market_token_details">
        <div className="container-fluid p-0">
            <div className="markets_header_token">
            <div className="container">
                <div className="col-md-12">
                <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-12 order-md-1 order-2">
                        <div className="token_main_details">
                            <div className="media">
                              <div className="media-left align-self-center">
                                <img src={"/assets/img/"+(tokenData.contract_type == 1 ? "ethereum.svg": "binance.svg")} className="token_img" alt={tokenData.contract_type == 1 ? "Ethereum": "BSC"} width="100%" height="100%" />
                              </div>

                              <div className="media-body align-self-center">
                                  <h4 className="media-heading">
                                  {tokenData.name}
                                  &nbsp; <span> ({tokenData.symbol ? tokenData.symbol.toUpperCase() : "-"})</span>
                                  </h4>
                                  <p>{tokenData.contract_type == 1 ? "Ethereum (ERC20)": "BNB Smart Chain (BEP20)"} : {(address).slice(0, 8) + "..." + (address).slice(address.length - 8, address.length)}  <img onClick={() => { copyContract(address, 'ETH') }} src="/assets/img/copy.png" alt="copy" className="copy_link" style={{width:"14px"}} height="100%" />   
                                      {
                                          contract_copy_status === 'ETH' ?
                                          <>Copied</>
                                          :
                                          null
                                      }
                                  </p>
                              </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-3 col-xl-3 col-md-6 order-md-2 order-3">
                      <div className="token_price_block airdrop_data_content">
                          <h5>{live_price ? "$" : null} {live_price > 0 ? separator(parseFloat(live_price.toFixed(8))) : "NA"}
                              </h5>
                          <h6>
                          <span className="timings_price">&nbsp;24h</span>{" "}
                          <span>
                              
                              <span className="values_growth">
                                  {
                                  percentage_change_24h ?
                                  percentage_change_24h > 0 ?
                                      <span className="green"> <img src="/assets/img/value_up.svg" alt="value up"/> {percentage_change_24h}%</span>
                                      :
                                      <span className="red"><img src="/assets/img/value_down.svg" alt="value down"/> {percentage_change_24h}% </span>

                                      :
                                      null
                                  }
                              </span>
                          </span>
                          </h6>
                      </div>
                    </div>
                    <div className="col-lg-3 col-xl-3 col-md-6 order-md-3 order-1 ">
                    <Search_token />
                    </div>
                </div>
                <div className="row token_header_cols">
                    <div className="col-lg-3 col-xl-3 col-md-12 pr-0">
                    <ul className="token_share_vote">
                        {/* <li>#3 Rank</li> */}
                        {/* <li style={{ cursor: "pointer" }}>
                        <a href="https://app.coinpedia.org/login?prev_url=https://markets.coinpedia.org/tether">
                            <img src="/assets/img/coin_vote.svg" /> 1
                        </a>
                        </li> */}
                        <li onClick={() => set_share_modal_status(true)} style={{ cursor: "pointer" }}><img src="/assets/img/coin_share.svg" alt="Share"/> Share</li>
                        {/* <li>
                         <Link href={app_coinpedia_url + "login?prev_url=" + market_coinpedia_url + "address/"+address} >
                          <img src="/assets/img/watchlist_outline.svg"  style={{width:"18px"}} alt="watchlist" />
                          </Link>
                        </li> */}
                    </ul>
                    </div>

                     {/* <div className="token_list_values">
                                    <h4>Crypto Market Cap</h4>
                                    <h5>{market_cap?"$":null}{market_cap ? separator(market_cap.toFixed(4)): "NA"}</h5>
                                  </div>
                                  <div className="token_list_values">
                                    <h4>24H Volume / Market Cap</h4>
                                    <h5>{contract_24h_volume?"$":null}{contract_24h_volume ? separator(contract_24h_volume.toFixed(4)): "NA"}</h5>
                                  </div> */}
                    <div className="col-lg-9 col-xl-9 col-md-12">
                    <ul className="token_list_data">
                        <li>
                        <div className="token_list_content">
                            <h4>
                            Market Cap : &nbsp;
                            <span className="responsive_value_display">
                                {market_cap?"$":null}{market_cap ? separator(market_cap.toFixed(4)): "NA"}
                            </span>
                              <OverlayTrigger
                                delay={{ hide: 450, show: 300 }}
                                  overlay={(props) => (
                                    <Tooltip {...props} className="custom_pophover">
                                      <p>Market capitalization is a measure used to determine the total value of a publicly traded cryptocurrency. It is calculated by multiplying the current market price of a single coin/token X total supply of the coin/token.</p>
                                    </Tooltip>
                                  )}
                                  placement="bottom"
                                ><span className='info_col' ><img src="/assets/img/info.png"   alt="info"/></span>
                              </OverlayTrigger>
                            </h4>
                        </div>
                        </li>
                        <li>
                        <div className="token_list_content">
                            <h4>
                            24h Volume : &nbsp;
                            <span className="responsive_value_display">
                                 {contract_24h_volume?"$":null}{contract_24h_volume ? separator(contract_24h_volume.toFixed(4)): "NA"}
                            </span>
                            <OverlayTrigger
                              delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                  <Tooltip {...props} className="custom_pophover">
                                    <p>The 24-hour volume, also known as trading volume or trading activity, refers to the total amount of a specific coin/token that has been bought and sold within a 24-hour period. It represents the total number of coins/tokens traded during that time frame.</p>
                                  </Tooltip>
                                )}
                                placement="bottom"
                              ><span className='info_col' ><img src="/assets/img/info.png"  alt="info"/></span>
                            </OverlayTrigger>
                            <span className="values_growth" />
                            </h4>
                        </div>
                        </li>
                        
                    </ul>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
  


          <div className="container">
          

            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="coin_details">
                    <div className="row">
                      <div className="col-md-5">
                       
                      </div>
                      <div className="col-md-7">
                        <div className="row">
                          <div className="col-md-4 col-6">
                            <div className="token_left_border">
                              <div className="token_list_values">
                                <h4>Total Supply</h4>
                                <h5>
                                {
                                  token_supply ? 
                                  <>
                                  {separator(token_supply.toFixed(0))} {tokenData.symbol ? tokenData.symbol.toUpperCase() : ""}
                                  </>
                                  :
                                  "NA"
                                } 
                                </h5>
                              </div>
                              <div className="token_list_values">
                                <h4>Liquidity</h4>
                                <h5>${separator((liquidity).toFixed(2))}</h5>
                              </div>

                              {/* <div className="token_list_values">
                                <h4>Liquidity*Trades</h4>
                                <h5>${separator((cal_liquidity).toFixed(2))}</h5>
                              </div> */}

                              
                              {/* <div className="token_list_values">
                                <h4>Volume / Market Cap</h4>
                                <h5>NA</h5>
                              </div>
                               */}

                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="token_left_border">

                              <div className="col-md-12  col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>Open 24h</h4>
                                    <h5>${parseFloat(open_24h) ? (parseFloat(open_24h)).toFixed(4):"NA" }</h5>
                                  </div>
                                </div>
                                <div className="col-md-12  col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>Close 24h</h4>
                                    <h5>${parseFloat(close_24h) ? (parseFloat(close_24h)).toFixed(4):"NA" }</h5>
                                  </div>
                                </div>
                            </div>
                          </div>
                                  

                          <div className="col-md-4 col-sm-12 col-12">
                            <div className="token_left_border">
                              <div className="row">
                                <div className="col-md-12 col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>High 24h</h4>
                                    <h5>${high_24h ?(parseFloat(high_24h)).toFixed(4):"NA"}</h5>
                                  </div>
                                </div>
                                <div className="col-md-12  col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>Low 24h</h4>
                                    <h5>${low_24h ? (parseFloat(low_24h)).toFixed(4):"NA"}</h5>
                                  </div>
                                </div>
                                

                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="market_token_tabs ">
                <div className="row">
                  <div className="col-md-8 col-sm-12 col-12">
                    <div className='token_details_tabs_row'>
                      <ul className="nav nav-tabs ">
                        <li className="nav-item">
                          <a data-toggle="tab" onClick={()=>setMainTab(1)} className={"nav-link "+(main_tab == 1? " active":"")} ><span>Chart</span></a>
                        </li>
                        <li className="nav-item">
                          <a data-toggle="tab" onClick={()=>set_main_tab(2)} className={"nav-link "+(main_tab == 2 ? " active":"")} ><span>Exchange</span></a>
                        </li>
                        {/* <li className="nav-item">
                          <a data-toggle="tab" onClick={()=>set_main_tab(3)} className={"nav-link "+(main_tab == 3 ? " active":"")} ><span>Transactions</span></a>
                        </li> */}

                        <li className="nav-item" >
                           <a className={"nav-link "+(main_tab == 7 ? "active":"")} onClick={()=>set_main_tab(4)}>Price Analysis</a>
                        </li>
                        <li className="nav-item" >
                          <a className={"nav-link "+(main_tab == 8 ? "active":"")} onClick={()=>set_main_tab(5)}>Price Prediction</a>
                        </li>
                      </ul>            
                    </div>
                   
              <div className="tab-content">
                <div className={"tab-pane fade "+(main_tab == 1 ? " show active":"")}>
                
                  <div className="tokendetail_charts" style={{minHeight:"456px", marginBottom:"30px"}}>
                      <div className="row">
                          <div className="col-md-6 col-12">
                              <div className="charts_date_tab float-left charts_price_tabs">
                              <ul className="nav nav-tabs">
                                  <li className="nav-item">
                                  <a className="nav-link active" data-toggle="tab">
                                      <span>Price</span>
                                  </a>
                                  </li>
                              </ul>
                              </div>
                          </div>
                          
                          <div className="col-md-6 col-12">
                              <div className="charts_date_tab date_chart_interval">
                                <ul className="nav nav-tabs">
                                  {
                                    bitgquery_graph_ranges.length > 0 ?
                                      bitgquery_graph_ranges.map((item) =>
                                      <li className="nav-item" key={0} onClick={()=>plotGraph(item._id)}>
                                        <a className={"nav-link "+(item._id == graph_date_type ? " active":"")}>
                                            <span>{item.range_name}</span>
                                        </a>
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
                          main_tab ?
                            graph_date_type ?
                            <Price_chart reqData={{address:address, contract_type:tokenData.contract_type, graph_date_type:graph_date_type}}/>
                            :
                            ""
                          :
                          ""
                        }          
                  </div>

                 
                                   
                </div>

                <div className={"tab-pane fade "+(main_tab == 2 ? " show active":"")}>
                <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Exchange</th>
                          <th>Pairs</th>
                          <th>Trades Count</th>
                          <th>Amount</th>
                          {/* 
                          <th>Liquidity in Pool</th>
                          <th>Takers</th>
                          <th>Makers</th>
                          */}
                          

                        </tr>
                      </thead>
                      {

                        <tbody>
                          {
                            exchangelistnew.map((e, i) => {
                              return <tr key={i}>
                                <td title={e.exchange_address}>{e.exchange_name}</td>
                                <td title={e.pair_one_token_address}>{e.pair_one_name ? e.pair_one_name:e.exchange_name}  <span  style={{fontSize:"14px",fontWeight: "500", color:"#938f8f"}}>/ {tokenData.symbol ? tokenData.symbol.toUpperCase() : ""}</span>

                                  {
                                    (e.pair_one_value && e.pair_two_value) ?
                                    <span className="pooledvalue">
                                      ({e.pair_one_value ? separator(e.pair_one_value.toFixed(3)) : "0.00"}) /
                                      ({e.pair_two_value ? separator(e.pair_two_value.toFixed(3)) : "0.00"})
                                  </span>
                                    :
                                    ""
                                  }
                                 </td>
                                {/* <td>
                                  <>
                                  {
                                    e.liquidity_in_pool ?
                                    <>
                                    ${separator(e.liquidity_in_pool + (e.pair_two_value * live_price))} 
                                    </>
                                    :
                                    "-"
                                  }
                                  </>
                                  
                                </td> */}
                                <td>{e.trades}</td>
                                <td>${(parseFloat(e.tradeAmount)).toFixed(2)}</td>
                                {/* <td>--</td> */}
                                {/* <td>--</td>
                                <td>--</td> */}
                              </tr>
                            })


                          }
                        </tbody>



                      }
                    </table>
                    {/* {
                      exchangelistnew.length > 10
                        ?
                        <div className="pager__list pagination_element">
                          <ReactPaginate
                            previousLabel={selectedPage + 1 !== 1 ? "Previous" : ""}
                            nextLabel={selectedPage + 1 !== pageCount ? "Next" : ""}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            forcePage={selectedPage}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                        </div>
                        :
                        null
                    } */}
                  </div>
                </div>

                <div className={"tab-pane fade "+(main_tab == 3 ? " show active":"")}>
                    c
                </div>


                <div id="priceanalysis" className={"tab-pane fade "+(main_tab == 4 ? "show active":"")}>
                    <Price_analysis/> 
                </div>

                <div id="priceprediction" className={"tab-pane fade "+(main_tab == 5 ? "show active":"")}>
                    <Price_prediction/>
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
                        </ul>
                      </div>
                      <div className="tab-content">
                          <div id="news" className="tab-pane fade show in active ">
                            <News/>
                          </div>

                          <div id="events" className="tab-pane fade in">
                            <Events/>
                          </div>
                      </div>
                    </div>

                </div>
              </div>
            </div>

            <div className="token_details_tabs">
           
            


              <div className="tab-content">
                
                <div id="home" className="tab-pane fade">
                  
                </div>

                {/* <tbody>
                      {
                        exchangelistnew.map((e, i) => {
                          return <tr key={i}>
                            <td>{e.exchange.fullName}</td>
                            <td>{constant.separator(e.trades)}</td>
                            <td>{constant.separator(e.takers)}</td>
                            <td>{constant.separator(e.makers)}</td>
                            <td>{constant.separator(e.amount.toFixed(2))}</td>
                          </tr>
                        } )
                      }
                      </tbody> */}
                <div id="menu1" className="tab-pane fade in">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Traded</th>
                          <th>Time</th>
                          <th className="market_trades_count">Token Price</th>
                          <th>Value</th>
                          <th>DEX</th>
                        </tr>
                      </thead>
                      {
                        tokentransactions
                          ?
                          <tbody>
                            {
                              tokentransactions.map((e, i) => {
                                return <tr key={i}>
                                  <td>{separator(Number.parseFloat((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd).toFixed(2))} {(e.baseCurrency.symbol === "WBNB") ? e.quoteCurrency.symbol : e.baseCurrency.symbol}</td>
                                  <td>{moment(e.block.timestamp.time).format("ll")}</td>
                                  <td>{separator(Number.parseFloat((e.tradeAmountInUsd / ((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd)).toString()).toFixed(7))} USD</td>
                                  <td>{separator(Number.parseFloat(e.tradeAmountInUsd).toFixed(4))} USD</td>
                                  <td><a rel="noreferrer" href={"https://bscscan.com/tx/" + e.transaction.hash} target="_blank">{e.exchange.name ? e.exchange.name : "-"}</a></td>
                                </tr>
                              }
                              )
                            }
                          </tbody>
                          :
                          null
                      }
                    </table>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-lg-5 col-sm-6 col-4">
              <div >
                {/* <div className="sidebar_wallet">  
                  <div className="claim_reward_sidebar">
                    <h2>400 UNI</h2>
                    <h4>UNI has arrived</h4>
                    <p>Thanks for being part the Uniswap community</p>
                    <button>Claim your reward</button>
                  </div> */}

                <div className={"modal connect_wallet_error_block" + (handleModalConnections ? " collapse show" : "")}>
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => handleModalConnection()}>&times;</button>
                        <h4>Connection Error</h4>
                        <p>Please connect to wallet.</p>
                      </div>
                    </div>
                  </div>
                </div>


                <div className={"modal connect_wallet_error_block" + (selectedTokenModal ? " collapse show" : "")}>
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => setSelectedTokenModal(false)}>&times;</button>

                        <p>Connect to network</p>
                        <div className="row">

                          <div className="col-md-6 col-6">
                            <img className="wallet-buttons" onClick={() => connectToEthWallet()} src="/assets/img/ETH.svg" />
                            {
                              selectedwallettype === 1
                                ?
                                <img className="wallet-buttons selected-token-img" src="/assets/img/checked.png" />
                                :
                                null
                            }
                            <p onClick={() => connectToEthWallet()}>Ethereum</p>
                          </div>

                          <div className="col-md-6 col-6">
                            <img className="wallet-buttons" onClick={() => connectToWallet()} src="/assets/img/binance.svg" />
                            {
                              selectedwallettype === 2
                                ?
                                <img className="wallet-buttons selected-token-img" src="/assets/img/checked.png" />
                                :
                                null
                            }
                            <p onClick={() => connectToWallet()}>BNB</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <div className={"modal connect_wallet_error_block" + (handleModalMainNetworks ? " collapse show" : "")}>
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => handleModalMainNetwork()}>&times;</button>
                        <h4>Connection Error</h4>
                        <p>You are connected to an unsupported network.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal connect_wallet_error_block" id="myModal">
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">

                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4>Coming Soon!</h4>
                      </div>

                    </div>
                  </div>
                </div>

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
                    <input type="text" id="referral-link" className="form-control" defaultValue={market_coinpedia_url + "address/"+address} readOnly />
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="myTooltip" onClick={() => myReferrlaLink()}>
                        <img src="/assets/img/copy-file.png" className="copy_link ml-2" width="100%" height="100%" />
                      </span>
                    </div>
                  </div>
                  <h6>Share with </h6>
                  <p className="share_social">
                    <a rel="nofollow" href={"https://www.facebook.com/sharer/sharer.php?u=" + market_coinpedia_url + "address/"+address} target="_blank"><img src="/assets/img/facebook.png" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"https://www.linkedin.com/shareArticle?mini=true&url=" + market_coinpedia_url + "address/"+address} target="_blank"><img src="/assets/img/linkedin.png" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"http://twitter.com/share?url=" + market_coinpedia_url + "address/"+address+"&text="+ data.token_name} target="_blank" ><img src="/assets/img/twitter.png" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"https://wa.me/?text=" + market_coinpedia_url + "address/"+address} target="_blank"><img src="/assets/img/whatsapp.png" width="100%" height="100%" /></a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export async function getServerSideProps({ query }) 
{
  const token_address = query.contract_address
  
  const getData = await tokenBasic(token_address)

  return { props: { post: {}, address: token_address, tokenData:getData.message} }

  // if(getData.status)
  // {
    
  // }
  // else
  // {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/error"
  //     }
  //   }
  // }
 
  // const query1 = `
  //   query
  //   { 
  //     ethereum(network: ethereum) {
  //       address(address: {is: "`+ token_address + `"}){

  //         annotation
  //         address

  //         smartContract {
  //           contractType
  //           currency{
  //             symbol
  //             name
  //             decimals
  //             tokenType
  //           }
  //         }
  //         balance
  //       }
  //     } 
  // }
  // ` ;

  // const url = "https://graphql.bitquery.io/";
  // const opts = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-API-KEY": graphqlApiKEY
  //   },
  //   body: JSON.stringify({
  //     query: query1,
  //   })
  // };

  // return fetch(url, opts)
  //   .then(res => res.json())
  //   .then(result => {
  //     if (result.data.ethereum !== null) 
  //     {
  //       if(result.data.ethereum)
  //       {
  //           if(result.data.ethereum.address[0].smartContract) 
  //           {
  //           if (result.data.ethereum.address[0].smartContract.currency) 
  //           {
                
  //           }
  //           else {
  //               return {
  //               redirect: {
  //                   permanent: false,
  //                   destination: "/Error"
  //               }
  //               }
  //           }
  //           }
  //           else {
  //           return {
  //               redirect: {
  //               permanent: false,
  //               destination: "/Error"
  //               }
  //           }
  //           }
  //       }
  //     }
  //     else {
  //       return {
  //         redirect: {
  //           permanent: false,
  //           destination: "/Error"
  //         }
  //       }
  //     }
  //   })
}
