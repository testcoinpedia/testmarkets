import React, { useEffect, useState } from 'react'
import Highcharts from 'highcharts';
import { website_url, graphqlApiKEY, API_BASE_URL, separator, config, coinpedia_url, market_coinpedia_url } from '../../components/constants'
import { ethers } from 'ethers';
import Web3 from 'web3'
import Switch from "react-switch";
import Head from 'next/head';
import Axios from 'axios'
import moment from 'moment'
import Link from 'next/link'
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css"
import SideBarExchangeDetails from "../../components/sideBarExchangeBlock"
import Search_Contract_Address from '../../components/searchContractAddress'
import ReactPaginate from 'react-paginate';

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

function TokenDetails(props) {

  console.log("props", props)
  const [checked, set_checked] = useState(false)
  const [symbol] = useState(props.post.smartContract.currency.symbol)
  const [contract_copy_status, set_contract_copy_status] = useState("")
  const [address] = useState(props.address)
  console.log("address", address)
  const [exchangelistnew, set_exchange_list_new] = useState([])
  const [live_price, setLivePrice] = useState("")
  const [price_change_24h, set_priceChange24H] = useState("")
  const [contract_24h_volume, set_contract_24h_volume] = useState(0)
  const [tokentransactions, set_tokentransactions] = useState([])
  const [exchangelist, set_exchangelist] = useState([])
  const [isBNB, set_isBNB] = useState(false)
  const [graphDate, set_graphDate] = useState(1)
  const [market_cap, set_market_cap] = useState(0)
  const [token_max_supply, settoken_max_supply] = useState(0)
  const [search_contract_address, set_search_contract_address] = useState("")

  const [connected_address, set_connected_address] = useState("")

  const [wallet_data, setWalletData] = useState([]);
  const [walletspageCount, setWalletsPageCount] = useState(0);

  const [handleModalConnections, setHandleModalConnections] = useState(false)
  const [handleModalMainNetworks, setHandleModalMainNetworks] = useState(false)

  const [contract_address, setContractAddress] = useState("")

  const [customDate, setCustomDate] = useState(false)
  const [customstartdate, setCustomstartdate] = useState("")
  const [customenddate, setCustomenddate] = useState("")

  const [connectedtokenlist, set_connectedtokenlist] = useState([])
  const [walletTokenUsdBal, set_walletTokenUsdBal] = useState(0)
  const [loadmore, set_loadmore] = useState(false)

  const [metadata] = useState(props.post)

  const [selectedTokenModal, setSelectedTokenModal] = useState(false)
  const [selectedwallettype, setSelectedWalletType] = useState(0)
  const [searchBy, setSearchBy] = useState("0")

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);

  const [validSearchContract, setvalidContractAddress] = useState("")

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
  const getTotalMaxSupply = (id, decimal) => {

    // https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&apikey=YourApiKeyToken
    Axios.get("https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=" + id + "&apikey=E9DBMPJU7N6FK7ZZDK86YR2EZ4K4YTHZJ1")
      .then(response => {
        if (response.status) {
          console.log(response)
          settoken_max_supply(response.data.result / 10 ** decimal)
        }
      })




  }
  const getexchangedata = async (id) => {
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    const query = `
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

    const resultArray = new Array()
    var response1 = 0
    var pair_two_value_in_Usd = 0
    var pair_one_value_in_usd = 0
    const res = await fetch(url, opts)
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
          response1 = await getexchangevalue(item.poolToken.address.address)
          if (response1) {
            response1.map(async (e) => {
              if (item.pair.address == e.currency.address) {
                createObj['pair_one_value'] = e.value
                var res = await livePrice(item.pair.address)
                console.log(item.pair.name, res)
                createObj['pair_one_live_price'] = res
                pair_one_value_in_usd = e.value * res

              }
              if (id.toLowerCase() == e.currency.address) {
                createObj['pair_two_value'] = e.value
                //var res =await livePrice(id)
                // console.log("symbol", res)
                // pair_two_value_in_Usd = e.value*res
                // createObj['pair_two_live_price']=res
                console.log(pair_two_value_in_Usd)
              }
              createObj['liquidity_in_pool'] = pair_one_value_in_usd
            })
          }
          await resultArray.push(createObj)
          set_exchange_list_new(resultArray)
          console.log(resultArray)
          var reqObj = {
            contract_address: id,
            network_type: "ethereum",
            exchanges: [createObj]
          }
          console.log('req Obj', reqObj)
          const config = { headers: { "Content-Type": "application/json" } }
          const sadfdsf = await Axios.post(API_BASE_URL + "markets/tokens/exchanges_save_data", reqObj, config)
          console.log("Api Response", sadfdsf)
        })



      }

    }


  }
  const livePrice = async (id) => {
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
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    const query = `
                query
                {
                  ethereum(network: ethereum) {
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
        if (result.data.ethereum != null) {
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

  const getTokendetails = (id, usd_price) => {

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

  const getMarketCap = async (id, decval, usd_price) => {

    const mainnetUrl = 'https://mainnet.infura.io/v3/5fd436e2291c47fe9b20a17372ad8057'
    const provider = new ethers.providers.JsonRpcProvider(mainnetUrl);
    //    if (tokenType.indexOf('ERC') >= 0 ) {
    //      mainnetUrl = 'https://bsc-dataseed.binance.org/'
    //    } else {
    //      mainnetUrl = 'https://mainnet.infura.io/v3/5fd436e2291c47fe9b20a17372ad8057'
    //    }

    const tokenAbi = ["function totalSupply() view returns (uint256)"];
    const tokenContract = new ethers.Contract(id, tokenAbi, provider);
    const supply = await tokenContract.totalSupply() / (10 ** decval);
    set_market_cap(supply * usd_price)


    // if(id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' || id !== '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'){

    // const pairAbi = ["function getPair(address first, address second) view returns (address)"]
    // const pairContract = new ethers.Contract("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", pairAbi, provider);
    // const pairAddr = await pairContract.getPair(id, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

    //     const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
    //     const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
    //     const reserve = await liqContract.getReserves();
    //     const token0 = await liqContract.token0();
    //     const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decval) * usd_price * 2;
    //     set_liquidity(liquidity) 
    // }

  }

  const get24hVolume = (id) => {
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    const query = `
                query
                {
                  ethereum(network: ethereum) {
                    dexTrades(
                      date: {since: "` + dateSince + `"}
                      baseCurrency: {is: "`+ id + `"}
                      options: {desc: "tradeAmount"}
                    ) {
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

    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {
          set_contract_24h_volume(result.data.ethereum.dexTrades[0].tradeAmount)
        }
      })
      .catch(console.error);
  }

  const get24hChange = (fun_live_price, id) => {
    const date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    const query = `
                query
                {
                  ethereum(network: ethereum) {
                    dexTrades(
                      date: {in: "` + date + `"}
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


    const contract_usdt_price = fun_live_price
    let change24h = 0
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {
          if (contract_address == "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
            change24h = ((contract_usdt_price - (result.data.ethereum.dexTrades[0].quote)) / (contract_usdt_price) * 100)
            set_priceChange24H(change24h)
          }
          else {
            change24h = (contract_usdt_price / (result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote) - 1) * 100
            set_priceChange24H(change24h)
          }
        }
      })
      .catch(console.error);
  }

  const getTokenUsdPrice = async (id) => {
    set_search_contract_address(id)
    setContractAddress(id)

    const dateSince = ((new Date()).toISOString())
    const query = `
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
    await fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {

          if (id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
            getTokendetails(id, result.data.ethereum.dexTrades[0].quote)
            get24hChange(result.data.ethereum.dexTrades[0].quote, id)
            setLivePrice(result.data.ethereum.dexTrades[0].quote)
          }
          else {
            getTokendetails(id, result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote)
            get24hChange(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote, id)
            setLivePrice(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote)
          }

        }
      })
      .catch(console.error);
  }

  const getGraphData = (datetime, isBnbDisplay = undefined, id) => {


    if (datetime === "") {
      datetime = graphDate;
    }
    set_graphDate(datetime)

    let symbolName = ""
    let from_date = ""
    let to_date = ""

    symbolName = symbol;

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
        ` ;
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
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {

        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {
          var prices = [];
          var arr = result.data.ethereum.dexTrades;
          // if (isBnbDisplay === undefined) {
          //   isBnbDisplay = isBNB; 
          // }

          for (let index = 0; index < arr.length; index++) {
            if (arr[index] !== undefined) {
              var rate = 0
              if (isBnbDisplay === false) {
                rate = arr[index].tradeAmountInUsd / arr[index].buyAmount;
              } else {
                rate = arr[index].quote;
              }


              var date = new Date(arr[index].timeInterval.hour)
              var val = []
              val[0] = date.getTime()
              val[1] = rate;


              prices.push(val)
            }
          }

          Highcharts.chart('container', {
            chart: {
              zoomType: 'x'
            },
            title: {
              text: ''
            },
            xAxis: {
              type: 'datetime',
              lineColor: '#f7931a',
              dashStyle: 'Dash',
            },
            yAxis: {
              title: {
                text: (isBnbDisplay ? 'ETH Prices' : 'USD Prices')
              },
              dashStyle: 'Dash',
            },
            colors: ['#f7931a'],
            legend: {
              enabled: false
            },
            tooltip: {
              formatter: function () {
                var point = this.points[0];
                return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
                  '<strong>Price :</strong> ' + (isBnbDisplay ? 'ETH ' : '$ ') + Highcharts.numberFormat(point.y, 10) + '';

                // if(isBnbDisplay){
                //   return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
                //   '<strong>Price :</strong> BNB' + Highcharts.numberFormat(point.y, 10) + '';
                // }
                // else{
                //   return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
                //   '<strong>Price :</strong> $'+ Highcharts.numberFormat(point.y, 10) + '';
                // }

              },
              shared: true
            },
            plotOptions: {
              area: {
                fillColor: {
                  linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                  },
                  stops: [
                    [0, 'rgb(255 248 241 / 59%)'],
                    [1, 'rgb(255 255 255 / 59%)']
                  ]
                },
                marker: {
                  radius: 1
                },
                lineWidth: 3,
                states: {
                  hover: {
                    lineWidth: 3
                  }
                },
                threshold: null
              }
            },

            series: [{
              type: 'area',
              name: '',
              data: prices
            }]
          });
        }

      })
      .catch(console.error);
  }

  useEffect(() => {


    getTokendetails(window.location.pathname.substring(5))
    getTokenTransactions(window.location.pathname.substring(5))
    getexchangedata(window.location.pathname.substring(5))
    getGraphData(4, isBNB, window.location.pathname.substring(5))
    getTokenUsdPrice(window.location.pathname.substring(5))
    get24hVolume(window.location.pathname.substring(5))
    setContractAddress(window.location.pathname.substring(5))

    if (localStorage.getItem("walletconnectedtype") === "1") {
      getBEPAccountDetails(0)
      getETHAccountDetails(0)
    }
  }, [connected_address])



  const getTokensList = (wallet_address, networktype) => {

    let query = ""

    if (networktype === "ethereum") {
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
    else {
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

    if (networktype === "ethereum") {

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
    set_checked(isBNB)
    set_isBNB(isBNB)
    getGraphData("", isBNB, contract_address)
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
  //             window.location.replace(website_url+'eth/'+address) 
  //           }
  //           else{
  //             window.location.replace(website_url+'bsc/'+address) 
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


  return (
    <>
      {
        metadata.smartContract.currency.name.symbol
          ?
          <Head>
            <title>{metadata.smartContract.currency.name.symbol.toUpperCase()}</title>
          </Head>
          :
          null
      }
      <div className="page page-padding">
        <div className=" market_token_details">
          <div className="container">
            <div className="col-md-12">
              <div className="breadcrumb_block">
                <Link href={coinpedia_url}><a >Home</a></Link> <span> &#62; </span>
                <Link href={market_coinpedia_url}><a >Live Market</a></Link> <span> &#62; </span>{metadata.smartContract.currency.name}
              </div>
              <div className="row">
                <div className="col-lg-6 col-md-12 order-md-2">
                  <div className="row">
                    <div className="col-md-6 order-md-2">
                      {
                        <Search_Contract_Address />
                      }
                      <ul className="token_share_vote">

                        <li><img src="/assets/img/coin_vote.svg" /> Vote <span>2</span></li>

                        {/* <li onClick={()=>ModalVote()} style={{cursor:"pointer"}}><img src="/assets/img/coin_vote.svg" /> Voted <span>{votes}</span></li> */}

                        <li>{data.list_type == 1 ? "Coin" : "Token"}</li>
                        <li data-toggle="modal" data-target="#market_share_page"><img src="/assets/img/coin_share.svg" /> Share</li>
                      </ul>
                    </div>
                    <div className="col-md-6 order-md-1">
                      <div className="wallets__inner contract_address">
                        <div className="wallets__details">
                          <span className="token-contract-details h5">
                            <a href={"https://etherscan.io/token/" + address} target="_blank">
                              <span >
                                <img className="token_dropdown_img" src="/assets/img/ETH.svg" alt="Ethereum"></img>
                                Ethereum : {(address).slice(0, 4) + "..." + (address).slice(address.length - 4, address.length)}
                              </span>
                            </a>&nbsp;
                            <img onClick={() => { copyContract(address, 'ETH') }} src="/assets/img/copy.png" className="copy_link copy-contract-img" width="100%" height="100%" />
                          </span>
                        </div>
                      </div>
                      {
                        contract_copy_status === 'ETH' ?
                          <span className="votes_market" >Copied</span>
                          :
                          null
                      }
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 col-md-12  order-md-1">
                  <div className="token_main_details">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="media">
                          <img src="/assets/img/bnb-logo.png" className="token_img" alt="logo" width="100%" height="100%" />
                          <div className="media-body">
                            <h4 className="media-heading">{metadata.smartContract.currency.name}
                              {/* <span><img src="/assets/img/watchlist_token.svg" /></span> */}
                              <span><img src="/assets/img/watchlist_normal.svg" /></span>
                              {/* {
                                user_token ?
                                <>
                                  {
                                  watchlist == true ? */}
                              {/* <span><img src="/assets/img/watchlist_token.svg" /></span> */}
                              {/* :
                                  <span onClick={()=>addToWatchlist(data._id)} ><img src="/assets/img/watchlist_normal.svg" /></span>
                                  }
                                </>
                                :
                                <Link href={app_coinpedia_url+"login?prev_url="+website_url+data.token_id}><a onClick={()=> Logout()}>
                                <img src="/assets/img/watchlist_normal.svg" />
                                </a></Link>
                              } */}
                            </h4>


                            <h5><span>{symbol ? symbol.toUpperCase() : "-"}</span></h5>
                            {/* {
                              watchlist_count > 0 ?
                              <h5><span>{watchlist_count ? "Token has " + watchlist_count + (watchlist_count > 1 ? " watchlists" : " watchlist" ) : "-"}</span></h5>
                              :
                              null
                            } */}

                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="token_price_block">
                          <h5>
                            {live_price ? "$" : null} {live_price > 0 ? separator(parseFloat(live_price.toFixed(8))) : "NA"}
                            {
                              price_change_24h
                                ?
                                price_change_24h > 0
                                  ?
                                  <span className="market_growth market_up"><img src="/assets/img/caret-up.png" />{price_change_24h.toFixed(2)}%</span>
                                  :
                                  <span className="market_growth market_down"><img src="/assets/img/caret-angle-down.png" />{price_change_24h.toFixed(2)}%</span>

                                :
                                null
                            }
                          </h5>
                          <p>{metadata.smartContract.currency.name ? metadata.smartContract.currency.name : "-"} Price({symbol ? (symbol).toUpperCase() : "-"})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="coin_details">
                    <div className="row">
                      <div className="col-md-5">
                        <div className="coin_main_links">
                          <ul className="coin_quick_details">
                            <li className="coin_individual_list">
                              <div className="quick_block_links">
                                <div className="widgets__select links_direct"><a target="_blank"> Rank#1 </a></div>
                              </div>
                            </li>
                            <li className="coin_individual_list dropdown">
                              <div className="quick_block_links dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div className="widgets__select links_direct"><a target="_blank"><img src="/assets/img/explorer.svg" className="coin_cat_img" />Explorer <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> </a></div>
                              </div>
                              <div className="dropdown-menu dropdown_block badge_dropdown_block" aria-labelledby="dropdownMenuButton">
                                <ul>
                                  <li>BTC</li>
                                  <li>ETH</li>
                                  <li>BNB</li>
                                </ul>
                              </div>
                            </li>
                            <li className="coin_individual_list">
                              <div className="quick_block_links">
                                <div className="widgets__select links_direct"><a target="_blank"> <img src="/assets/img/whitepaper.svg" className="coin_cat_img" /> White paper </a></div>
                              </div>
                            </li>
                            <li className="coin_individual_list dropdown">
                              <div className="quick_block_links dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <div className="widgets__select links_direct"><a target="_blank"><img src="/assets/img/explorer.svg" className="coin_cat_img" />Community <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /></a></div>
                              </div>
                              <div className="dropdown-menu dropdown_block badge_dropdown_block" aria-labelledby="dropdownMenuButton">
                                <ul>
                                  <li>Reddit</li>
                                  <li>Twitter</li>
                                  <li>Bitcointalk</li>
                                </ul>
                              </div>
                            </li>
                          </ul>
                          <ul className="coin_quick_details">
                            <li className="coin_individual_list">
                              <div className="quick_block_links">
                                <div className="widgets__select links_direct"><a target="_blank"> <img src="/assets/img/website.svg" className="coin_cat_img" />Website</a></div>
                              </div>
                            </li>
                            {/* <li className="coin_individual_list">
                                    <div className="quick_block_links">
                                      <div className="widgets__select links_direct"><a target="_blank"><img src="/assets/img/explorer.svg" className="coin_cat_img" />Exchanges  <img src="/assets/img/features_dropdown.svg" className="dropdown_arrow_img" /> </a></div>
                                    </div>
                                </li> */}
                            <li className="coin_individual_list">
                              <div className="quick_block_links">
                                <div className="widgets__select links_direct"><a target="_blank"><img src="/assets/img/source_code.svg" className="coin_cat_img" /> Source Code </a></div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="col-md-7">
                        <div className="row">
                          <div className="col-md-4 col-6">
                            <div className="token_left_border">
                              <div className="token_list_values">
                                <h4>Market Cap</h4>
                                <h5>$406,867,622,856.00</h5>
                                <h6 className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />+2.54%</span></h6>
                                {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" />-3.88%</span></h6> */}
                              </div>
                              <div className="token_list_values">
                                <h4>Volume / Market Cap</h4>
                                <h5>NA</h5>
                              </div>
                              <div className="token_list_values">
                                <h4>Fully diluted valuation</h4>
                                <h5>$446,715,005,519</h5>
                              </div>

                            </div>
                          </div>
                          <div className="col-md-4 col-6">
                            <div className="token_left_border">

                              <div className="token_list_values">
                                <h4>Circulating Supply</h4>
                                <h5>19,126,781</h5>
                                <h6 className="values_growth"><span className="normal">91.08%</span></h6>
                              </div>
                              <div className="token_list_values">
                                <h4>Max Supply</h4>
                                <h5>{token_max_supply ? separator(token_max_supply) : "NA"}</h5>
                              </div>
                              <div className="token_list_values">
                                <h4>Total Supply</h4>
                                <h5>21,000,000</h5>
                              </div>
                              {/* <div className="token_list_values">
                                    <h4>Crypto Market Cap</h4>
                                    <h5>{market_cap?"$":null}{market_cap ? separator(market_cap.toFixed(4)): "NA"}</h5>
                                  </div>
                                  <div className="token_list_values">
                                    <h4>24H Volume / Market Cap</h4>
                                    <h5>{contract_24h_volume?"$":null}{contract_24h_volume ? separator(contract_24h_volume.toFixed(4)): "NA"}</h5>
                                  </div> */}
                            </div>
                          </div>
                          <div className="col-md-4 col-sm-12 col-12">
                            <div className="token_left_border">
                              <div className="row">
                                <div className="col-md-12 col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>Volume</h4>
                                    <h5>$30,252,839,262</h5>
                                  </div>
                                </div>
                                <div className="col-md-12  col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>Liquidity</h4>
                                    <h5>$0</h5>
                                  </div>
                                </div>
                                <div className="col-md-12  col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>All Time High</h4>
                                    <h5>$01.55</h5>
                                    <h6 className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />+2.54%</span></h6>
                                    {/* <h6 className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" />-3.88%</span></h6> */}
                                  </div>
                                </div>
                                <div className="col-md-12  col-sm-6 col-6">
                                  <div className="token_list_values">
                                    <h4>All Time Low</h4>
                                    <h5>$0.44</h5>
                                    {/* <h6 className="values_growth"><span className="green"><img src="/assets/img/value_up.svg" />+2.54%</span></h6> */}
                                    <h6 className="values_growth"><span className="red"><img src="/assets/img/value_down.svg" />-3.88%</span></h6>
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
              <div className="market_token_tabs">
                <div className="row">
                  <div className="col-md-6 col-sm-6 col-7">
                    <h5>{(symbol).toUpperCase()} Price Chart</h5>
                    <ul className="nav nav-tabs">
                      <li className="nav-item">
                        <a data-toggle="tab" href="#overview" className="nav-link active" ><span>Overview</span></a>
                      </li>
                      <li className="nav-item">
                        <a data-toggle="tab" href="#home" className="nav-link " ><span>Exchange</span></a>
                      </li>
                      <li className="nav-item">
                        <a data-toggle="tab" href="#menu1" className="nav-link" ><span>Transactions</span></a>
                      </li>
                    </ul>
                  </div>
                  {/* <ul className="chart_tabs">
                              <li><button type="button" onClick={()=> getGraphData(1 , data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 D</button></li>
                              <li><button type="button" onClick={()=> getGraphData(2, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 W</button></li>
                              <li><button type="button" onClick={()=> getGraphData(3, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 M</button></li>
                              <li><button type="button" onClick={()=> getGraphData(4, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 Y</button></li>
                              <li><button onClick={()=> setCustomDate(!customDate)}><img src="/assets/img/table_dropdown_dots.png" className="more_dates" /></button></li> 
                            </ul>  */}
                  <div className="col-md-6 col-sm-6 col-5">
                    <ul className=" chart_tabs_ul nav nav-tabs">
                      <li className="nav-item">
                        <a className="nav-link " data-toggle="tab" href="#one_day" onClick={() => getGraphData(1, isBNB, contract_address)}>1 D</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#one_week" onClick={() => getGraphData(2, isBNB, contract_address)}>1 W</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link" data-toggle="tab" href="#one_month" onClick={() => getGraphData(3, isBNB, contract_address)}>1 M</a>
                      </li>
                      <li className="nav-item">
                        <a className="nav-link active" data-toggle="tab" href="#one_year" onClick={() => getGraphData(4, isBNB, contract_address)}>1 Y</a>
                      </li>
                    </ul>
                  </div>
                  {
                    customDate
                      ?
                      <div className="market-details-custom-search-block">
                        <h5>Filter by Date</h5>
                        <div className="search_by_date">
                          <div className="row">
                            <div className="col-md-5 col-5">
                              <div className="graph_date_table"><Datetime inputProps={inputProps} onClick={() => setCustomDate(true)} isValidDate={valid} dateFormat="YYYY-MM-DD" timeFormat={false} name="start_date" value={customstartdate} onChange={(e) => setCustomstartdate(e)} /></div>
                              {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customstartdate} onChange={(e)=> setCustomstartdate(e.target.value)} placeholder="Start date" type="date" /> */}
                            </div>
                            <div className="col-md-5 col-5">
                              <div className="graph_date_table"><Datetime inputProps={inputProps2} onClick={() => setCustomDate(true)} isValidDate={valid2} dateFormat="YYYY-MM-DD" timeFormat={false} name="end_date" value={customenddate} onChange={(e) => setCustomenddate(e)} /></div>
                              {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customenddate} onChange={(e)=> setCustomenddate(e.target.value)} placeholder="End date" type="date" /> */}
                            </div>
                            <div className="col-md-2 col-2">
                              {
                                customstartdate && customenddate
                                  ?
                                  <button type="button" onClick={() => getGraphData(6, data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)}><img src="/assets/img/search-box-white.png" alt="Search" width="16px" height="16px" /></button>
                                  :
                                  <button type="button"><img src="/assets/img/search-box-white.png" alt="Search" width="16px" height="16px" /></button>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                      :
                      null
                  }
                </div>
              </div>
            </div>

            <div className="token_details_tabs">
              <div className="tab-content">
                <div id="overview" className="tab-pane fade show in active">
                  <figure className="highcharts-figure">
                    <div
                      id="container"
                      style={{ height: 250, overflow: "hidden" }}
                      data-highcharts-chart={0}
                      role="region"
                      aria-label="Chart. Highcharts interactive chart."
                      aria-hidden="false"
                    >
                    </div>
                  </figure>
                </div>
                <div id="home" className="tab-pane fade">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Exchange</th>
                          <th>Pairs</th>
                          <th>Liquidity in Pool</th>
                          <th>Trades Count</th>
                          <th>Takers</th>
                          <th>Makers</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      {

                        <tbody>
                          {
                            exchangelistnew.map((e, i) => {
                              return <tr key={i}>
                                <td title={e.exchange_address}>{e.exchange_name}</td>
                                <td title={e.pair_one_token_address}>{e.pair_one_name} / {symbol}<br /><span className="pooledvalue">({e.pair_one_value ? separator(e.pair_one_value.toFixed(3)) : "0.00"}) / ({e.pair_two_value ? separator(e.pair_two_value.toFixed(3)) : "0.00"})</span> </td>
                                <td>${separator(e.liquidity_in_pool + (e.pair_two_value * live_price))} </td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                                <td>--</td>
                              </tr>
                            })


                          }
                        </tbody>



                      }
                    </table>
                    {
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
                    }
                  </div>
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
              <div className="modal" id="market_share_page">
                <div className="modal-dialog">
                  <div className="modal-content">

                    <div className="modal-header">
                      <h4 className="modal-title">Share</h4>
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                    </div>

                    <div className="modal-body">
                      <div className="row">
                        <div className="col-md-2">

                        </div>
                        <div className="col-md-8">
                          <div className="input-group">

                            <input type="text" id="referral-link" className="form-control" value={website_url + "eth/" + address} readOnly />
                            <div className="input-group-prepend">
                              <span className="input-group-text" id="myTooltip" onClick={() => myReferrlaLink()}><img src="/assets/img/copy-file.png" width="100%" height="100%" className="copy_link" /></span>
                            </div>
                          </div>
                          <h6>Share with </h6>
                          <p className="share_social">
                            <a href={"https://www.facebook.com/sharer/sharer.php?u=" + website_url + "token/" + address} target="_blank"><img src="/assets/img/facebook.png" width="100%" height="100%" /></a>
                            <a href={"https://www.linkedin.com/shareArticle?mini=true&url=" + website_url + "token/" + address} target="_blank"><img src="/assets/img/linkedin.png" width="100%" height="100%" /></a>
                            <a href={"http://twitter.com/share?text=" + website_url + "token/" + address} target="_blank"><img src="/assets/img/twitter.png" width="100%" height="100%" /></a>
                            <a href={"https://wa.me/?text=" + website_url + "token/" + address} target="_blank"><img src="/assets/img/whatsapp.png" width="100%" height="100%" /></a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>



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
    </>
  )
}

export async function getServerSideProps({ query }) {
  const token_address = query.eth
  const query1 = `
    query
    { 
      ethereum(network: ethereum) {
        address(address: {is: "`+ token_address + `"}){

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
      query: query1,
    })
  };

  return fetch(url, opts)
    .then(res => res.json())
    .then(result => {
      if (result.data.ethereum !== null) {
        if (result.data.ethereum.address[0].smartContract) {
          if (result.data.ethereum.address[0].smartContract.currency) {
            return { props: { post: result.data.ethereum.address[0], address: token_address } }
          }
          else {
            return {
              redirect: {
                permanent: false,
                destination: "/Error"
              }
            }
          }
        }
        else {
          return {
            redirect: {
              permanent: false,
              destination: "/Error"
            }
          }
        }
      }
      else {
        return {
          redirect: {
            permanent: false,
            destination: "/Error"
          }
        }
      }
    })
}

export default TokenDetails

// address(address: {is: "`+token_address+`"}){