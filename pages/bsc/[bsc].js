import React , {useEffect,  useState} from 'react' 
import Highcharts from 'highcharts';    
import * as constant from '../../components/constants'
import { ethers } from 'ethers';
import Web3 from 'web3'
import Switch from "react-switch";   
import Head from 'next/head'; 
import moment from 'moment'
import Link from 'next/link'
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css" 
import SideBarExchangeDetails from "../../components/sideBarExchangeBlock" 
 
let inputProps = {
  className: 'market-details-date-search my_input', 
  placeholder: 'From date', 
  readOnly:true
}

let inputProps2 = {
  className: 'market-details-date-search my_input',
  placeholder: 'To date', 
  readOnly:true
} 
 
function TokenDetails(props) {     

  const [checked, set_checked] = useState(false) 
  const [live_price, setLivePrice] = useState("")
  const [price_change_24h, set_priceChange24H] = useState("") 
  const [contract_24h_volume,set_contract_24h_volume]=useState(0)  
  const [tokentransactions, set_tokentransactions]= useState([])
  const [exchangelist, set_exchangelist]= useState([])
  const [isBNB, set_isBNB]=useState(false) 
  const [graphDate , set_graphDate] = useState(1)
  const [website_url]=useState(constant.website_url)
  const [market_cap, set_market_cap] = useState(0) 
  const [liquidity, set_liquidity] = useState(0)      
 
  const [connected_address , set_connected_address]=useState("")
 
  const [wallet_data, setWalletData] = useState([]); 
  const [perPage] = useState(10);
  const [walletspageCount, setWalletsPageCount] = useState(0) ;     

  const [dxSale, setDxSale] = useState("Pancake v2")
 
  const [handleModalConnections, setHandleModalConnections] = useState(false)
  const [handleModalMainNetworks, setHandleModalMainNetworks] = useState(false)
 
  const [contract_address, setContractAddress] = useState(props.address) 
  
  const [customDate, setCustomDate] = useState(false)
  const [customstartdate, setCustomstartdate] = useState("")
  const [customenddate, setCustomenddate] = useState("")
       
  const [connectedtokenlist, set_connectedtokenlist]=useState([])
  const [walletTokenUsdBal, set_walletTokenUsdBal]=useState(0)
  const [loadmore, set_loadmore]= useState(false) 

  const [metadata] = useState(props.post)
  
  const [symbol] = useState(props.post.smartContract.currency.symbol)
  
  const [selectedTokenModal, setSelectedTokenModal] = useState(false)
  const [selectedwallettype, setSelectedWalletType] = useState(0)  

  const [searchBy, setSearchBy] = useState("1")    
  const [validSearchContract, setvalidContractAddress] = useState("")
  const [search_contract_address, set_search_contract_address] = useState("")    

 
  var yesterday = moment()
  function valid(current) 
  {  
    return current.isBefore(yesterday)
  }

  const valid2=(current)=> 
  {    
    return current.isBefore(yesterday)
  }
  
  const getTokenTransactions=(id)=>{ 
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString()) 
    const query = `
                query
                {
                  ethereum(network: bsc) {
                    dexTrades(
                      any: [{baseCurrency: {is: "`+id+`"}}]
                      date: {since: "`+dateSince+`" }
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
                "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
              },
              body: JSON.stringify({
                  query
              })
          };
          fetch(url, opts)
              .then(res => res.json())
              .then(result=>{ 
                
                if (result.data.ethereum != null) { 
                        set_tokentransactions(result.data.ethereum.dexTrades)  
                }        
              })
              .catch(console.error);
  } 
  
 
 const getTokenexchange=(id)=> { 
    const query = `
          query{
            ethereum(network: bsc){
              dexTrades(options:{desc: "amount"},
                date: {since: null till: null }
                baseCurrency: {is: "`+id+`"}
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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
      },
      body: JSON.stringify({
        query
      })
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum != null) { 
        set_exchangelist(result.data.ethereum.dexTrades) 
        }
      })
      .catch(console.error);
  }
  
  const getTokendetails=(id, usd_price)=> {  

    const query = `
                query
                { 
                  ethereum(network: bsc) {
                    address(address: {is: `+ '"' +id+ '"' + `}){

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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
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
          // setTokenSymbol(result.data.ethereum.address[0].smartContract.currency.symbol)     
          getMarketCap(contract_address, result.data.ethereum.address[0].smartContract.currency.decimals, usd_price) 
        } 
      })
      .catch(console.error);
  }

  const getMarketCap =async(id, decval, usd_price)=> {  
    const mainnetUrl = "https://bsc-dataseed.binance.org/";
    const provider = new ethers.providers.JsonRpcProvider(mainnetUrl); 

    const tokenAbi = ["function totalSupply() view returns (uint256)"];
    const tokenContract = new ethers.Contract(id, tokenAbi, provider);
    const supply = await tokenContract.totalSupply() / (10 ** decval);  
    set_market_cap(supply * usd_price)

    const pairAbi = ["function getPair(address first, address second) view returns (address)"]
    const pairContract = new ethers.Contract("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", pairAbi, provider);
    const pairAddr = await pairContract.getPair(id, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c');

    if(id !== '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'){
      const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
      const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
      const reserve = await liqContract.getReserves();
      const token0 = await liqContract.token0();
      const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decval) * usd_price * 2;
      set_liquidity(liquidity)
    }
 
  }

  const get24hVolume=(id)=> {   
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    const query = `
                query
                {
                  ethereum(network: bsc) {
                    dexTrades(
                      date: {since: "` + dateSince + `"}
                      baseCurrency: {is: "`+id+`"}
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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
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

  const get24hChange=(fun_live_price)=>
  { 
    const date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
    const query = `
                query
                {
                  ethereum(network: bsc) {
                    dexTrades(
                      date: {in: "` + date + `"}
                      any: [{baseCurrency: {is: "`+contract_address+`"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
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
          if(contract_address === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"){
            change24h = ((contract_usdt_price - (result.data.ethereum.dexTrades[0].quote)) / (contract_usdt_price) * 100) 
              set_priceChange24H(change24h)
          }
          else{
            change24h = (contract_usdt_price / (result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote) - 1) * 100
            set_priceChange24H(change24h) 
          }
        }
      })
      .catch(console.error);
  } 

  const getTokenUsdPrice=async(id)=> { 
    const dateSince = ((new Date()).toISOString()) 

    const query = `
                query
                {
                  ethereum(network: bsc) {
                    dexTrades(
                      date: {since: "` + dateSince + `"}
                      any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
      },
      body: JSON.stringify({
        query
      })
    };
    await fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {   
          // if(metadata.result.data.ethereum === null){
          //   window.location.reload() 
          // }
          getTokenTransactions(id)
          getTokenexchange(id)

          if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"){
            getTokendetails(id, result.data.ethereum.dexTrades[0].quote) 
            get24hChange(result.data.ethereum.dexTrades[0].quote) 
            setLivePrice(result.data.ethereum.dexTrades[0].quote) 
          }
          else{
            getTokendetails(id, result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote) 
            get24hChange(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote) 
            setLivePrice(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote) 

          }
 
        }  
      })
      .catch(console.error);
  }

  const getGraphData=(datetime, isBnbDisplay = undefined, dxSaleplace, id)=> {  
	  
    if (datetime === "") { 
      datetime = graphDate;
    } 
    set_graphDate(datetime)
 
    let from_date= ""
    let to_date= "" 
     

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
      else if(datetime === 6){
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

      const excPlace = (dxSaleplace === "") ? dxSale : dxSaleplace 

      let query = ""

      if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"){
        query = `
                    query
                    {
                      ethereum(network: bsc) {
                        dexTrades(
                          exchangeName : {is: "`+ excPlace + `"}
                          date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                          any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
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
      else{
      query = `
                    query
                    {
                      ethereum(network: bsc) {
                        dexTrades(
                          exchangeName : {is: "`+ excPlace + `"}
                          date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                          any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}]
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
          "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
        },
        body: JSON.stringify({
          query
        })
      };
      fetch(url, opts)
        .then(res => res.json())
        .then(result => {
          
          if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) { 
          var prices= [];
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
                    text: (isBnbDisplay ? 'BNB Prices' : 'USD Prices')
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
                          '<strong>Price :</strong> '+ (isBnbDisplay ? 'BNB ' : '$ ') + Highcharts.numberFormat(point.y, 10) + '';

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
 
  useEffect(()=>{   
    
    set_search_contract_address(contract_address)
    
    getTokenUsdPrice(contract_address)
    get24hVolume(contract_address) 
    getGraphData(4, isBNB, dxSale, contract_address)     
    
    if(localStorage.getItem("walletconnectedtype") === "1"){
      getBEPAccountDetails(0) 
      getETHAccountDetails(0) 
    }  

  },[live_price, connected_address])
  


  const getTokensList=(wallet_address, networktype)=> {  

    let query =""
  
    if(networktype === "ethereum"){
      query = `
      query{
          ethereum(network: ethereum) {
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
        ` ;
    }
    else{
      query = `
      query{
        ethereum(network: bsc) {
        address(address: {is: "`+wallet_address+`"}) {
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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
      },
      body: JSON.stringify({
        query
      })
    }; 
  
    if(networktype === "ethereum"){  
  
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
                            any: [{baseCurrency: {is: "`+ item.currency.address +`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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
                "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
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
                  balance = (balance+item.quotePrice * item.value) 
                } else {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote * tokenBalResult.data.ethereum.dexTrades[1].quote;
                  balance = (balance+item.quotePrice * item.value) 
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
    else{ 
  
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
                "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
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
                  balance = (balance+item.quotePrice * item.value) 
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


  const getWalletDetails=(id, networktype, wallettype)=>{ 
    const query = `
                query
                {
                  ethereum(network: `+networktype+`) {
                    inbound: transfers(
                      options: {desc: "block.timestamp.time", asc: "currency.symbol", limit: 10}
                      date: {since: null, till: null},
                      amount: {gt: 0},
                      receiver: {is: `+'"'+id+'"'+`}
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
                      sender: {is: `+'"'+id+'"'+`}
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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
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

        if(result.data.ethereum.inbound){
          result.data.ethereum.inbound.map((e, i)=>{
            return get_inbond_list[i] = {e, type : 1}
          })
        } 

        if(result.data.ethereum.outbound){
          result.data.ethereum.outbound.map((e, i)=>{
            return get_outbond_list[i] = {e, type : 2}
          })
        } 

        var all_data = get_inbond_list.concat(get_outbond_list) 

        if(all_data.length > 0){ 
          all_data = all_data.sort((a, b) => (new Date(b.e.block.timestamp.time).getTime()) - (new Date(a.e.block.timestamp.time).getTime()))
 
          const slice = all_data.slice(0, 0 + perPage)
          const postData = slice.map((e, i) => {
            return <tr key={i}>
                    <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/")+e.e.transaction.hash} target="_blank">{moment(e.e.block.timestamp.time).format("ll")}</a></td>
                    <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/")+e.e.transaction.hash} target="_blank">{e.type == 1 ? <div>IN</div> : <div>OUT</div>}</a></td>
                    <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/")+e.e.transaction.hash} target="_blank">{e.e.currency.symbol}</a></td>
                    <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/")+e.e.transaction.hash} target="_blank">{constant.separator(parseFloat((e.e.amount).toFixed(6)))}</a></td>
                    <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/")+e.e.transaction.hash} target="_blank">{constant.separator(parseFloat((e.e.amountInUSD).toFixed(6)))}</a></td>
                  </tr>
          })
          setWalletData(postData) 
          setWalletsPageCount(all_data.length / perPage)
        }  
      })
      .catch(console.error);
  } 

    
  const getTokenAddress = (address, type, connecttionType)=>{
    localStorage.setItem("walletconnectedtype", "1")
    setSelectedWalletType(connecttionType)
    set_connected_address(address) 
    setSelectedTokenModal(false)
    
    if(type === 1){
      window.location.reload()
  }
  }
   
  const getBEPAccountDetails=(type)=> {   
    if(window.web3)
    {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function(networkName) 
      {       
        if(networkName === "private")
        { 
          web3.eth.getAccounts().then(function(accounts)
          {   
            var first_address = accounts[0]   
            if((typeof first_address != 'undefined'))
            {     
              getTokenAddress(first_address, type,2) 
              getTokensList(first_address, "bsc")
              getWalletDetails(first_address, "bsc",2) 
            }
            return true
          })
        }
      })
    }
    else if(window.ethereum)
    {
      let web3 = new Web3(window.ethereum)
      web3.eth.net.getNetworkType().then(function(networkName)
      {
        if(networkName === "private")
        { 
          web3.eth.getAccounts().then(function(accounts)
          {  
            var first_address = accounts[0] 
            if((typeof first_address != 'undefined'))
            {      
              getTokenAddress(first_address, type,2) 
              getTokensList(first_address, "bsc")
              getWalletDetails(first_address, "bsc",2)
            }
            return true
          })
        }
      })
    }  
  }  
  
   
const getETHAccountDetails=(type)=> 
{   
  if(window.web3)
  {
    let web3 = new Web3(Web3.givenProvider)
    web3.eth.net.getNetworkType().then(function(networkName)
    { 
      if(networkName === "main")
      {
        web3.eth.getAccounts().then(function(accounts)
        {   
          var first_address = accounts[0]   
          if((typeof first_address != 'undefined'))
          {  
            getTokenAddress(first_address, type,1) 
            getTokensList(first_address, "ethereum")
            getWalletDetails(first_address, "ethereum",1)
          }
          return true
        })
      }
    })
  }
  else if(window.ethereum)
  {
    let web3 = new Web3(window.ethereum)
    web3.eth.net.getNetworkType().then(function(networkName)
    {
      if(networkName === "main")
      {
        web3.eth.getAccounts().then(function(accounts)
        {  
          var first_address = accounts[0] 
          if((typeof first_address != 'undefined'))
          {     
            getTokenAddress(first_address, type,1) 
            getTokensList(first_address, "ethereum")
            getWalletDetails(first_address, "ethereum",1)
          }
          return true
        })
      }
    })
  }  
}  

const connectToEthWallet=()=>
{    
  setSelectedWalletType(1)
  if(window.web3)
  { 
    let web3 = new Web3(Web3.givenProvider)
    web3.eth.net.getNetworkType().then(function(networkName)
    {   
      if(networkName === "main")
      {
        try 
        { 
          window.ethereum.enable().then(function(res) {
            getETHAccountDetails(1)
          })
        } 
        catch(e)
        {
          handleModalConnection();
        } 
      }
      else if(networkName === "private")
      {
        try 
        { 
          window.ethereum.enable().then(function(res) {
            getBEPAccountDetails(1)
          })
        } 
        catch(e)
        { 
          handleModalConnection();
        } 
      }
      else
      {
        handleModalMainNetwork()
      }
     
    })
  }
  else if(window.ethereum)
  {
    let web3 = new Web3(window.ethereum)
    try {
      web3.eth.net.getNetworkType().then(function(networkName)
      {
        if(networkName === "main")
        {
          try 
          { 
            window.ethereum.enable().then(function(res) {
              getETHAccountDetails(1)
            })
          } 
          catch(e)
          {
            handleModalConnection();
          } 
        }
        else if(networkName === "private")
        {
          try 
          { 
            window.ethereum.enable().then(function(res) {
              getBEPAccountDetails(1)
            })
          } 
          catch(e)
          { 
            handleModalConnection();
          } 
        }
        else
        {
          handleModalMainNetwork()
        } 
      })
    }
    catch(error) {
      // console.log('ethereum error, ', error)
    } 
  }
  else
  {
    handleModalConnection()
  }
} 

  const myReferrlaLink=()=> {
    var copyText = document.getElementById("referral-link");
    copyText.select();
    document.execCommand("Copy");
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied";
  }

    
  const handleDxSale =async(event)=> {
    var dxSaleplace = "";
    if (event === "PCSV1") {
      dxSaleplace = "Pancake"
    } else {
      dxSaleplace = "Pancake v2"
    }
    setDxSale(dxSaleplace) 
    getGraphData(1, isBNB, dxSaleplace,contract_address);
  }
 
  const handleChange=(isBNB)=> {  
    set_checked(isBNB) 
    set_isBNB(isBNB)
    getGraphData("", isBNB, dxSale,contract_address) 
  }

    
  const connectToWallet=()=> {    
    setSelectedWalletType(2)
    if(window.web3)
    { 
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function(networkName)
      {     
        if(networkName === "private")
        {
          try 
          { 
            window.ethereum.enable().then(function(res) {
              getBEPAccountDetails(1)
            })
          } 
          catch(e)
          { 
            handleModalConnection();
          } 
        }
        else if(networkName === "main")
        {
          try 
          { 
            window.ethereum.enable().then(function(res) {
              getETHAccountDetails(1)
            })
          } 
          catch(e)
          {
            handleModalConnection();
          } 
        } 
        else
        { 
          handleModalMainNetwork()
        }
       
      })
    }
    else if(window.ethereum)
    {
      let web3 = new Web3(window.ethereum)
      try {
        web3.eth.net.getNetworkType().then(function(networkName)
        { 
          if(networkName === "private")
          {
            try 
            { 
              window.ethereum.enable().then(function(res) {
                getBEPAccountDetails(1)
              })
            } 
            catch(e)
            { 
              handleModalConnection();
            } 
          }if(networkName === "main")
          {
            try 
            { 
              window.ethereum.enable().then(function(res) {
                getETHAccountDetails(1)
              })
            } 
            catch(e)
            {
              handleModalConnection();
            } 
          } 
          else
          { 
            handleModalMainNetwork()
          } 
        })
      }
      catch(error) {
        // console.log('ethereum error, ', error)
      } 
    }
    else
    { 
      handleModalConnection()
    }
  }

    
 const handleModalConnection=()=> 
 {    
   setHandleModalMainNetworks(false)
   setHandleModalConnections(!handleModalConnections) 
 }

 const handleModalMainNetwork=()=> 
 {       
   setHandleModalConnections(false)  
   setHandleModalMainNetworks(!handleModalMainNetworks)  
 } 

 const CheckContractAddress =(address)=>{ 

  setvalidContractAddress("")
  let query = "";

  if(searchBy === "0"){
    query = `
    query
    { 
      ethereum(network: ethereum) {
        address(address: {is: "`+address+`"}){

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
  }
  else{
    query = `
    query
    { 
      ethereum(network: bsc) {
        address(address: {is: "`+address+`"}){

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
  }
 
  const url = "https://graphql.bitquery.io/";
  const opts = {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
  },
  body: JSON.stringify({
    query: query, 
  })
  };

 return fetch(url, opts)
  .then(res => res.json())
  .then(result => {  
    if(result.data.ethereum !== null){
      if(result.data.ethereum.address[0].smartContract){
        if(result.data.ethereum.address[0].smartContract.currency){
          if(searchBy === "0"){ 
            window.location.replace(website_url+'eth/'+address)
          }
          else{
            window.location.replace(website_url+'bsc/'+address) 
          } 
        }
        else{
          setvalidContractAddress("Contract address or network type is invalid.")
        }
      }
      else{
        setvalidContractAddress("Contract address or network type is invalid.")
      }
    } 
    else{
      setvalidContractAddress("Contract address or network type is invalid.")
    } 
  }) 

}


  return (
    <> 
    {
      metadata.smartContract.currency.symbol
      ?
      <Head> 
        <title>{metadata.smartContract.currency.symbol} | Markets Coinpedia</title> 
      </Head> 
      :
      null 
    }
    <div className="page">
      <div className=" market_details_insights">
        <div className="">
          <div className="container">
            <div className="col-md-12">
              <div className="row ">
                <div className="col-md-7">
                  <ul className="token_detail_ext_links">
                    <li>
                    <a href={"https://bscscan.com/token/"+contract_address} target="_blank"><button className="bscscan_btn">BSCscan</button></a>
                    </li>
                    <li> 
                        <select className="select_market_type" value={dxSale} onChange={(e)=> handleDxSale(e.target.value)}>  
                        <option value={dxSale === "Pancake v2" ? "PCSV2" : "PCSV1"}>{dxSale === "Pancake v2" ? "PCSV2" : "PCSV1"}</option>
                        <option value={dxSale !== "Pancake" ? "PCSV1" : "PCSV2"}>{dxSale === "Pancake v2" ? "PCSV1" : "PCSV2"}</option> 
                      </select>
                    </li>
                    <li className="bsc_eth_toggle">
                      <label>
                        <span className="usd_search_toggle">USD</span>
                        <Switch value={checked} onChange={()=>handleChange(!checked)} checked={checked} onColor="#86d3ff"
                          onHandleColor="#2693e6"
                          handleDiameter={30}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                          height={20}
                          width={48}
                          className="react-switch"
                          id="material-switch" />
                        <span className="bsc_search_toggle">BNB</span>
                      </label>
                    </li>
                  </ul>
                </div> 

                <div className="col-md-5">
                  <div className="input-group search_filter">
                    <input className="form-control" value={search_contract_address} onChange={(e)=> set_search_contract_address(e.target.value)} type="text" placeholder="Search token here" />
                    <div className="input-group-prepend">
                      <select className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}>
                        <option value="0">ETH</option>
                        <option value="1">BSC</option>
                      </select>
                    </div>
                    <div className="input-group-prepend">
                      {
                        search_contract_address
                        ?
                        <span className="input-group-text" onClick={()=> CheckContractAddress(search_contract_address)}><img src="/assets/img/search-box.png" width="100%" height="100%" /></span>
                        :
                        <span className="input-group-text"><img src="/assets/img/search-box.png" width="100%" height="100%" /></span>
                      }
                    </div>
                  </div> 
                  {validSearchContract && <div className="error">{validSearchContract}</div>}
                  {/* {!contract_address ? <label>Contract address field is required!</label>: null} */}
                </div>
                
              </div>
            </div>

            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12 market_details_block">
                  <div className="widgets__item">
                    <div className="widgets__head no_pb_widget__head">
                      <div className="row">
                        <div className="col-lg-7 col-sm-6 col-8">
                          <div className="widgets__company">
                            <div className="widgets__logo">
                              <img src="/assets/img/bnb-logo.png" width="100%" height="100%" alt="logo" style={{borderRadius: 50}} /></div>
                              <div className="">
                                <div className="widgets__category">{symbol ? symbol.toUpperCase() : "-"}</div> 
                                <div className="widgets__category widgets__category_token_name">{metadata.smartContract.currency.name}</div> 
                              </div>
                            </div>
                          </div>
                        <div className="col-lg-5 col-sm-6 col-4">
                        <ul className="market_details_share_wishlist">
                            <li>
                              <div className="share_market_detail_page" data-toggle="modal" data-target="#market_share_page">
                                Share
                              </div>
                            </li>
                            {/* <li>
                              <div className="wishlist_market_detail_page">
                                <div className="star-img">
                                  <img src="/assets/img/star.png"  width="100%" height="100%"/>
                                </div>
                              </div>
                            </li> */}
                         </ul>
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
                                      
                                      <input type="text" id="referral-link" className="form-control" value={website_url+"bsc/"+contract_address} readOnly />
                                      <div className="input-group-prepend">
                                        <span className="input-group-text"  id="myTooltip" onClick={()=>myReferrlaLink()}><img src="/assets/img/copy-file.png" width="100%" height="100%" className="copy_link" /></span>
                                      </div>
                                    </div>
                                    <h6>Share with </h6>
                                    <p className="share_social">
                                    <a href={"https://www.facebook.com/sharer/sharer.php?u="+website_url+"token/"+contract_address} target="_blank"><img src="/assets/img/facebook.png" width="100%" height="100%" /></a>
                                    <a href={"https://www.linkedin.com/shareArticle?mini=true&url="+website_url+"token/"+contract_address} target="_blank"><img src="/assets/img/linkedin.png"  width="100%" height="100%"/></a>
                                    <a href={"http://twitter.com/share?text="+website_url+"token/"+contract_address} target="_blank"><img src="/assets/img/twitter.png"  width="100%" height="100%"/></a>
                                    <a href={"https://wa.me/?text="+website_url+"token/"+contract_address} target="_blank"><img src="/assets/img/whatsapp.png"  width="100%" height="100%"/></a>
                                    </p>
                                  </div>
                                </div>
                                
                              </div> 
                            </div>
                          </div>
                        </div>
                        </div> 
                      </div>
                      
                    
                      <div className="widgets__line">
                        <div className="widgets__price">USD {live_price ? constant.separator(live_price.toFixed(8)) : "-"} 
                          {
                            price_change_24h
                            ?
                            price_change_24h > 0
                            ?
                            <span className="market_growth market_up"><img src="/assets/img/caret-up.png" />{price_change_24h.toFixed(4)}%</span>
                            :
                            <span className="market_growth market_down"><img src="/assets/img/caret-angle-down.png" />{price_change_24h.toFixed(4)}%</span>
                            
                            :
                            null
                          }
                        </div>
                      </div>
                      
                    </div> 
                    
                    <div className="wallets__inner wallet_bottom_space">
                      <ul className="overview_ul token_contract_details">
                        <li>
                          <div className="wallets__details">
                            <div className="wallets__info">Crypto Market Cap</div>
                            <div className="wallets__number h5">${market_cap ? constant.separator(market_cap.toFixed(4)) : null}</div>
                          </div>
                        </li>
                        <li>
                          <div className="wallets__details">
                            <div className="wallets__info">24H Volume</div>
                            <div className="wallets__number h5">${contract_24h_volume ? constant.separator(contract_24h_volume.toFixed(4)) : null}</div>
                          </div>
                        </li>
                        <li>
                          <div className="wallets__details">
                            <div className="wallets__info">Liquidity</div>
                            <div className="wallets__number h5">${liquidity ? constant.separator(liquidity.toFixed(4)) : null}</div>
                          </div>
                        </li>
                        <li>
                          <div className="wallets__details">
                            <div className="wallets__info">Token Type</div>
                            <div className="wallets__number h5">BEP20</div>
                          </div>
                        </li>
                      </ul>
                    
                  
                    </div>

                    {/* <div className="wallets__inner">
                        <div className="wallets__list"> 
                          <div className="wallets__item">
                            <div className="wallets__details">
                              <div className="wallets__info">Total volume</div>
                              <div className="wallets__number h5">${total_volume ? total_volume : "-"}</div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                  
  
                  
                  </div> 
 
                  <div className="market">
                    <div className="company_profile_tabs">
                      <ul className="nav nav-tabs">
                        <li className="nav-item"><a data-toggle="tab" href="#menu2" className="nav-link active" ><span>Overview</span></a></li>
                        <li className="nav-item"><a data-toggle="tab" href="#home" className="nav-link "><span>Exchange</span></a></li>
                        <li className="nav-item"><a data-toggle="tab" href="#menu1" className="nav-link" ><span>Transactions</span></a></li>
                      </ul>
                    </div>
                  </div>

                  <div className="exchange_transactions">
                    <div className="tab-content">
                      <div id="menu2" className="tab-pane fade show in active">
                        <div className="price_change_tab">
                          <h3>Price Change</h3>
                        <div className="row">
                          <div className="col-md-5">
                            
                          </div>
                          <div className="col-md-7">
                            {/* <ul className="chart_tabs">
                              <li><button type="button" onClick={()=> getGraphData(1 , isBNB,dxSale,contract_address)}>1 D</button></li>
                              <li><button type="button" onClick={()=> getGraphData(2, isBNB,dxSale,contract_address)}>1 W</button></li>
                              <li><button type="button" onClick={()=> getGraphData(3, isBNB,dxSale,contract_address)}>1 M</button></li>
                              <li><button type="button" onClick={()=> getGraphData(4, isBNB,dxSale,contract_address)}>1 Y</button></li>
                              <li><button onClick={()=> setCustomDate(!customDate)} ><img src="/assets/img/menu-date.png" width="16px" height="16px" /></button></li> 
                            </ul> */}
                            
                            {
                              customDate
                              ?
                              <div className="market-details-custom-search-block"> 
                                <h5>Filter by Date</h5>
                                <div className="search_by_date">
                                  <div className="row">
                                    <div className="col-md-5 col-5">
                                    <Datetime inputProps={ inputProps } isValidDate={valid}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="start_date" value={customstartdate}   onChange={(e)=> setCustomstartdate(e)} />

                                      {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customstartdate} onChange={(e)=> setCustomstartdate(e.target.value)} placeholder="Start date" type="date" /> */}
                                    </div>
                                    <div className="col-md-5 col-5">
                                    <Datetime inputProps={ inputProps2 } isValidDate={valid2}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="end_date" value={customenddate}  onChange={(e)=> setCustomenddate(e)} />

                                      {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customenddate} onChange={(e)=> setCustomenddate(e.target.value)} placeholder="End date" type="date" /> */}
                                    </div>
                                    <div className="col-md-2 col-2">
                                      {
                                        customstartdate && customenddate
                                        ?
                                        <button type="button" onClick={()=> getGraphData(6, isBNB ,dxSale,contract_address)}><img src="/assets/img/search-box-white.png" alt="Search" width="16px" height="16px" /></button>
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

                      <div className="chart_tabs"> 
                            {/* <ul className="chart_tabs">
                              <li><button type="button" onClick={()=> getGraphData(1 , data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 D</button></li>
                              <li><button type="button" onClick={()=> getGraphData(2, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 W</button></li>
                              <li><button type="button" onClick={()=> getGraphData(3, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 M</button></li>
                              <li><button type="button" onClick={()=> getGraphData(4, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 Y</button></li>
                              <li><button onClick={()=> setCustomDate(!customDate)}><img src="/assets/img/table_dropdown_dots.png" className="more_dates" /></button></li> 
                            </ul>  */}

                            <ul className=" chart_tabs_ul nav nav-tabs">
                              <li className="nav-item">
                                <a className="nav-link " data-toggle="tab" href="#one_day" onClick={()=> getGraphData(1 , isBNB,dxSale,contract_address)}>1 D</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab"  href="#one_week" onClick={()=> getGraphData(2, isBNB,dxSale,contract_address)}>1 W</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab"  href="#one_month" onClick={()=> getGraphData(3, isBNB,dxSale,contract_address)}>1 M</a>
                              </li>
                              <li className="nav-item">
                                <a  className="nav-link active" data-toggle="tab"  href="#one_year" onClick={()=> getGraphData(4, isBNB,dxSale,contract_address)}>1 Y</a>
                              </li>
                            </ul>
                            
                            {
                              customDate
                              ?
                              <div className="market-details-custom-search-block"> 
                                <h5>Filter by Date</h5>
                                <div className="search_by_date">
                                  <div className="row">
                                    <div className="col-md-5 col-5">
                                      <div className="graph_date_table"><Datetime inputProps={ inputProps } onClick={()=> setCustomDate(true)} isValidDate={valid}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="start_date" value={customstartdate}   onChange={(e)=> setCustomstartdate(e)} /></div>
                                      {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customstartdate} onChange={(e)=> setCustomstartdate(e.target.value)} placeholder="Start date" type="date" /> */}
                                    </div>
                                    <div className="col-md-5 col-5">
                                      <div className="graph_date_table"><Datetime inputProps={ inputProps2 } onClick={()=> setCustomDate(true)} isValidDate={valid2}  dateFormat="YYYY-MM-DD" timeFormat={false}  name="end_date" value={customenddate}  onChange={(e)=> setCustomenddate(e)} /></div>
                                      {/* <input className="market-details-date-search" max={moment().format('YYYY-MM-DD')} value={customenddate} onChange={(e)=> setCustomenddate(e.target.value)} placeholder="End date" type="date" /> */}
                                    </div>
                                    <div className="col-md-2 col-2">
                                      {
                                        customstartdate && customenddate
                                        ?
                                        <button type="button" onClick={()=> getGraphData(6,data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}><img src="/assets/img/search-box-white.png" alt="Search" width="16px" height="16px" /></button>
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

                      <div id="home" className="tab-pane fade">
                      <div className="table-responsive">
                        <table className="table table-borderless">
                            <thead>
                              <tr>
                                  <th>Exchange</th>
                                  <th>Trades Count</th>
                                  <th>Takers</th>
                                  <th>Makers</th>
                                  <th>Amount</th>
                              </tr>
                            </thead>
                              {
                                exchangelist
                                ?
                                <tbody>
                                  {
                                    exchangelist.map((e, i) => {
                                      return <tr key={i}>
                                        <td>{e.exchange.fullName}</td>
                                        <td>{constant.separator(e.trades)}</td>
                                        <td>{constant.separator(e.takers)}</td>
                                        <td>{constant.separator(e.makers)}</td>
                                        <td>{constant.separator(e.amount.toFixed(2))}</td>
                                      </tr>
                                    } )
                                  }
                                  </tbody>
                                :
                                null
                              }
                        </table>
                      </div>
                      </div>
                      <div id="menu1" className="tab-pane fade in">
                        <div className="table-responsive">
                          <table className="table table-borderless">
                            <thead>
                                <tr>
                                  <th>Time</th>
                                  <th>Traded</th>
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
                                        tokentransactions.map((e,i)=>{
                                        return <tr key={i}>
                                          <td>{moment(e.block.timestamp.time).format("ll")}</td>
                                          <td>{constant.separator(Number.parseFloat((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd).toFixed(2))} {(e.baseCurrency.symbol === "WBNB") ? e.quoteCurrency.symbol : e.baseCurrency.symbol}</td>
                                          <td>{constant.separator(Number.parseFloat((e.tradeAmountInUsd / ((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd)).toString()).toFixed(7))} USD</td>
                                          <td>{constant.separator(Number.parseFloat(e.tradeAmountInUsd).toFixed(4))} USD</td>
                                          <td><a rel="noreferrer" href={"https://bscscan.com/tx/"+e.transaction.hash} target="_blank">{e.exchange.name ? e.exchange.name : "-"}</a></td>
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

                </div>
 
                
                  
                {/* <div className="sidebar_wallet">  
                  <div className="claim_reward_sidebar">
                    <h2>400 UNI</h2>
                    <h4>UNI has arrived</h4>
                    <p>Thanks for being part the Uniswap community</p>
                    <button>Claim your reward</button>
                  </div> */} 
                                  
              <div className={"modal connect_wallet_error_block"+ (handleModalConnections ? " collapse show" : "")}> 
                <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal"  onClick={()=>handleModalConnection()}>&times;</button>
                        <h4>Connection Error</h4>
                        <p>Please connect to wallet.</p>
                      </div>
                    </div> 
                </div>
              </div> 

              
          <div className={"modal connect_wallet_error_block"+ (selectedTokenModal ? " collapse show" : "")}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal" onClick={()=>setSelectedTokenModal(false)}>&times;</button>
               
                  <p>Connect to network</p>
                  <div className="row">

                  <div className="col-md-6 col-6"> 
                    <img className="wallet-buttons" onClick={()=> connectToEthWallet()} src="/assets/img/ETH.svg" />
                    {
                      selectedwallettype === 1
                      ?
                      <img className="wallet-buttons selected-token-img" src="/assets/img/checked.png" />
                      :
                      null
                    }  
                    <p onClick={()=> connectToEthWallet()}>Ethereum</p>
                  </div>

                  <div className="col-md-6 col-6"> 
                    <img className="wallet-buttons" onClick={()=> connectToWallet()} src="/assets/img/binance.svg" />
                    {
                      selectedwallettype === 2
                      ?
                      <img className="wallet-buttons selected-token-img" src="/assets/img/checked.png" />
                      :
                      null
                    }  
                    <p onClick={()=> connectToWallet()}>BNB</p>
                  </div>
                  </div>

                </div>
              </div> 
            </div>
          </div> 

              <div className={"modal connect_wallet_error_block"+ (handleModalMainNetworks ? " collapse show" : "")}>
                <div className="modal-dialog modal-sm">
                  <div className="modal-content">
                    <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" onClick={()=>handleModalMainNetwork()}>&times;</button>
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
  </div>
    </>
  )
} 

export async function getServerSideProps({ resolvedUrl }) {  
  const token_address = resolvedUrl.substring(5)   
    const query = `
    query
    { 
      ethereum(network: bsc) {
        address(address: {is: `+ '"' +token_address+ '"' + `}){

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
    "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
    },
    body: JSON.stringify({
      query: query, 
    })
    };

   return fetch(url, opts)
    .then(res => res.json())
    .then(result => {  
      if(result.data.ethereum !== null){
        if(result.data.ethereum.address[0].smartContract){
          if(result.data.ethereum.address[0].smartContract.currency){
            return { props: {post: result.data.ethereum.address[0], address: token_address}} 
          }
          else{
            return{ redirect:{
              permanent:false,
              destination: "/Error"
            }}
          }
        }
        else{
          return{ redirect:{
            permanent:false,
            destination: "/Error"
          }}
        }
      } 
      else{
        return{ redirect:{
          permanent:false,
          destination: "/Error"
        }}
      } 
    })  
} 
  
export default TokenDetails
