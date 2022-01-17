import React, {useState, useRef, useEffect} from 'react';  
import { ethers } from 'ethers';
import Link from 'next/link' 
import Head from 'next/head';
import Error from './404'
import { API_BASE_URL, config, website_url, separator, strLenTrim, getDomainName, app_coinpedia_url, IMAGE_BASE_URL,graphqlApiKEY} from '../components/constants'
import moment from 'moment'  
import Web3 from 'web3'
import Highcharts from 'highcharts';    
import ReactPaginate from 'react-paginate';
import cookie from "cookie"
import Axios from 'axios'
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css" 
  
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


export default function LauchPadDetails({errorCode, data, token_id, paymentTypes, userAgent, config}) 
{   
   console.log("paymentTypes", paymentTypes);
   console.log("data", data);
    
    if(errorCode) {return <Error/> }
    const communityRef = useRef(null);
    const explorerRef = useRef(null);
    const contractRef = useRef(null);  
    const [image_base_url] = useState(IMAGE_BASE_URL+"/tokens/")     
    const [symbol] = useState(data.symbol)
    const [user_token]= useState(userAgent.user_token)
    const [wallet_data, setWalletData] = useState([]); 
    const [perPage] = useState(10);
    const [walletspageCount, setWalletsPageCount] = useState(0) ; 
    const [current_url]= useState(website_url+token_id)
    const [exchangelistnew, set_exchange_list_new]= useState([])
    const [exchangelist, set_exchangelist]= useState([])
    const [exchangelistData, set_exchangelistdata]= useState([])
    const [exchangesPageCount, setExchnagesPageCount] = useState(0)
    const [exchangesCurrentPage , setExchangesCurrentPage] = useState(0)
    const [circulating_supply , setcirculating_supply] = useState(0)
    const [token_max_supply , settoken_max_supply] = useState(0)
    const [tokentransactions, set_tokentransactions]= useState([])
    const [tokentransactionsData, set_tokentransactionsdata]= useState([])
    const [tokentransactionsPageCount, settokentransactionsPageCount] = useState(0)
    const [tokentransactionsCurrentPage , settokentransactionsCurrentPage] = useState(0)
    const [decimal,setdecimal]=useState(0)
    
 
    const [explorer_links, set_explorer_links] = useState(false)
    const [community_links, set_community_links] = useState(false)  
    const [connected_address , set_connected_address]=useState("")
    const [connectedtokenlist, set_connectedtokenlist]=useState([])
    const [walletTokenUsdBal, set_walletTokenUsdBal]=useState(0)
    const [loadmore, set_loadmore]= useState(false) 
    const [handleModalConnections, setHandleModalConnections] = useState(false)
    const [handleModalVote, setHandleModalVote] = useState(false)
    const [handleModalMainNetworks, setHandleModalMainNetworks] = useState(false)
    const [selectedTokenModal, setSelectedTokenModal] = useState(false)
    const [selectedwallettype, setSelectedWalletType] = useState(0)
 
    const [customstartdate, setCustomstartdate] = useState("")
    const [customenddate, setCustomenddate] = useState("")

    const [price_change_24h, set_priceChange24H] = useState("") 
    const [live_price, setLivePrice] = useState("")

    const [otherContract, setOtherContract] = useState(false) 
    const [customDate, setCustomDate] = useState(false)
    const [graphDate , set_graphDate] = useState(1) 
    const [contract_24h_volume,set_contract_24h_volume]=useState(0)  
    const [market_cap, set_market_cap] = useState(0) 
    const [liquidity, set_liquidity] = useState(0) 
    const [contract_copy_status, set_contract_copy_status] = useState("")
    const [read_more, set_read_more] = useState("")
    const [desc_read_more, set_desc_read_more] = useState(false)
    const [voting_message, set_voting_message] = useState("")
    const [votes, set_votes] = useState(data.total_voting_count)
    const [voting_status, set_voting_status] = useState(data.voting_status)
  const makeJobSchema=()=>{  
    return { 
        "@context":"http://schema.org/",
        "@type":"Organization",
        "name": data.token_name,
        "url": website_url+data.token_id,
        "logo": image_base_url+data.token_image,
        "sameAs":["","", "", ""]
      }  
} 
 
var yesterday = moment()
function valid(current) 
{  
  return current.isBefore(yesterday)
}

const valid2=(current)=> 
{    
  return current.isBefore(yesterday)
}

const getTokenTransactions=(id, networktype)=>
{ 
  let query =""
  const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString()) 

  if(networktype === "1"){
        query = `
        query
        {
              ethereum(network: ethereum) {
                dexTrades(
                  any: [{baseCurrency: {is: "`+id+`"}}]
                  date: {since: "`+dateSince+`" }
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
  else{
         query = `
              query
              {
                ethereum(network: bsc) {
                  dexTrades(
                    any: [{baseCurrency: {is: "`+id+`"}}]
                    date: {since: "`+dateSince+`" }
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
            .then(result=>{ 
              
              if (result.data.ethereum != null) {  
                      set_tokentransactions(result.data.ethereum.dexTrades) 
                      if(result.data.ethereum.dexTrades)
                      {
                        settokentransactionsPageCount(Math.ceil(result.data.ethereum.dexTrades.length  / 10 ))
                      }
                      
                      tokenTrasactionspagination(result.data.ethereum.dexTrades , 0) 
              }        
            })
            .catch(console.error);
} 

const tokenTrasactionspagination=(data, offset)=>
{ 
  if(data)
  {
    let slice = data.slice(offset, offset + 10)   

    const postData = slice.map((e,i)=>{
      return <tr key={i}>
                
                <td>{separator(Number.parseFloat((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd).toFixed(2))} {(e.baseCurrency.symbol === "WBNB") ? e.quoteCurrency.symbol : e.baseCurrency.symbol}</td>
                <td>{moment(e.block.timestamp.time).format("ll")}</td>
                <td>{separator(Number.parseFloat((e.tradeAmountInUsd / ((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd)).toString()).toFixed(7))} USD</td>
                <td>{separator(Number.parseFloat(e.tradeAmountInUsd).toFixed(4))} USD</td>
                <td><a rel="noreferrer" href={"https://bscscan.com/tx/"+e.transaction.hash} target="_blank">{e.exchange.name ? e.exchange.name : "-"}</a></td>
              </tr>
    })

    set_tokentransactionsdata(postData) 
  }
   

}

const tokenTrasactionshandlePageClick = (e) => {    
  settokentransactionsCurrentPage(e.selected)
  const selectPage = e.selected * 10;  
  tokenTrasactionspagination(tokentransactions , selectPage)
};

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
                  <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/")+e.e.transaction.hash} target="_blank">{separator(parseFloat((e.e.amount).toFixed(6)))}</a></td>
                  <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/")+e.e.transaction.hash} target="_blank">{separator(parseFloat((e.e.amountInUSD).toFixed(6)))}</a></td>
                </tr>
        })
        setWalletData(postData) 
        setWalletsPageCount(all_data.length / perPage)
      }  
    })
    .catch(console.error);
} 

const getTokenexchange=(id, networktype)=> { 

  let query =""

  if(networktype === "1"){
    query = `
        query{
          ethereum(network: ethereum){
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
  }
  else{
    query = `
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
      if (result.data.ethereum != null) {  
          
          if(result.data.ethereum.dexTrades)
          { 
            set_exchangelist(result.data.ethereum.dexTrades)
            setExchnagesPageCount(Math.ceil(result.data.ethereum.dexTrades.length  / 10 ))
          }  
        
          exchangespagination(result.data.ethereum.dexTrades , 0) 
      }
    })
    .catch(console.error);
} 

  const exchangespagination=(data, offset)=>{ 
    if(data)
    {
      let slice = data.slice(offset, offset + 10)  

      const postData = slice.map((e,i)=>{
        return <tr key={i}>
                  <td>{e.exchange.fullName}</td>
                  <td>{separator(e.trades)}</td>
                  <td>{separator(e.takers)}</td>
                  <td>{separator(e.makers)}</td>
                  <td>{separator(e.amount.toFixed(2)) }</td>
                </tr> 
      })

      set_exchangelistdata(postData)  
    }
    

  }

  const exchangeshandlePageClick = (e) => {   
    setExchangesCurrentPage(e.selected) 
    const selectPage = e.selected * 10;  
    exchangespagination(exchangelist , selectPage)
  };  
 



const getCirculatingSupply=(id,decimal,networktype)=>{
if(networktype==1){

}
else{
  Axios.get("https://api.bscscan.com/api?module=stats&action=tokenCsupply&contractaddress="+id+"&apikey=GV79YU5Y66VI43RM7GCBUE52P5UMA3HAA2")
    .then(response=>{
          if(response.status){ 
            // console.log(response)
            setcirculating_supply(response.data.result/10**decimal) 
          }
    })
}


}

const get24hVolume=(id, networktype)=> {   
  let query =""
  const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())

  if(networktype === "1"){
      query = `
      query
      {
        ethereum(network: ethereum) {
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
  }
  else{
    query = `
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
        set_contract_24h_volume(result.data.ethereum.dexTrades[0].tradeAmount) 
      }
    })
    .catch(console.error);
}


useEffect(()=>
{ 
  if(localStorage.getItem("walletconnectedtype") === "1"){
    getBEPAccountDetails(0) 
    getETHAccountDetails(0) 
  }  

  if(data.contract_addresses.length > 0)
  { 
    getexchangedata(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)  
    get24hVolume(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)  
    getTokenTransactions(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)
    //getTokenexchange(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)
    getGraphData(4, data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)     
    getTokenUsdPrice(data.contract_addresses[0].contract_address, data.contract_addresses[0].network_type)
    // console.log(data.contract_addresses[0].contract_address)
    
  } 

  
  document.addEventListener("click", handleClickOutside, false);
  return () => {
    document.removeEventListener("click", handleClickOutside, false);
  };
 
},[])


const handleClickOutside = event => {  
  if (communityRef.current && !communityRef.current.contains(event.target)) { 
    set_community_links(false)
  }

  if (explorerRef.current && !explorerRef.current.contains(event.target)) {
    set_explorer_links(false);
  }

  if (contractRef.current && !contractRef.current.contains(event.target)) {
    setOtherContract(false);
  }
 
  
};
const getexchangedata= async (id,networks)=> { 
  const dateSince =((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
  let query = "" 
  if(networks === "1"){
   query = `
    query {
      ethereum(network: ethereum) {
        dexTrades(
          quoteCurrency: {is: "`+id+`"}
          options: {desc: ["tradeAmount","trades"] limit: 100}
          date: {after: "`+dateSince+`"}
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
  else{
     query = `
    query {
      ethereum(network: bsc) {
        dexTrades(
          quoteCurrency: {is: "`+id+`"}
          options: {desc: ["tradeAmount","trades"] limit: 100}
          date: {after: "`+dateSince+`"}
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
  var pair_two_value_in_Usd=0
  var pair_one_value_in_usd=0
  const res=await fetch(url, opts)
   const result = await res.json()
      if (result.data.ethereum) { 
       // console.log(result.data.ethereum)
       // set_exchange_list_new(result.data.ethereum.dexTrades)
       var request_API_Status = false
        if(result.data.ethereum.dexTrades)
        {
          result.data.ethereum.dexTrades.map(async (item,i) => 
          {
            var createObj = {}
            createObj['exchange_name'] = item.exchange.fullName
            createObj['pair_one_name'] = item.pair.name
            createObj['exchange_address']=item.poolToken.address.address
            createObj['pair_one_token_address']=item.pair.address
            response1 = await getexchangevalue( item.poolToken.address.address,networks)
             if(response1)
            {
              response1.map(async (e)=>{
                     if(item.pair.address==e.currency.address){
                      createObj['pair_one_value']=e.value
                      var res =await livePrice(item.pair.address,networks)
                        console.log(item.pair.name, res)
                        createObj['pair_one_live_price']=res
                        pair_one_value_in_usd = e.value*res
                        
                     }
                     if(id.toLowerCase() ==e.currency.address){
                      createObj['pair_two_value']=e.value
                      pair_two_value_in_Usd = e.value*live_price
                      
                    }
                    createObj['liquidity_in_pool']=pair_one_value_in_usd
              })
            }
            await resultArray.push(createObj) 
            set_exchange_list_new(resultArray)
            if(networks==1){
              var reqObj = {
                contract_address:id,
                network_type:"ethereum",
                exchanges: [createObj]
              }
              console.log('req Obj',reqObj)
              const config = { headers: { "Content-Type": "application/json" } }
              const sadfdsf = await Axios.post(API_BASE_URL+"markets/tokens/exchanges_save_data", reqObj, config) 
              console.log("Api Response", sadfdsf)
            
           }
           else
           {
            var reqObj = {
              contract_address:id,
              network_type:"bsc",
              exchanges: [createObj]
            }
            console.log('req Obj',reqObj)
            const config = { headers: { "Content-Type": "application/json" } }
            const sadfdsf = await Axios.post(API_BASE_URL+"markets/tokens/exchanges_save_data", reqObj, config) 
            console.log("Api Response", sadfdsf)
           }
            
          })
            
            
            
        }

      }
    
    
}
const livePrice =async(id,networks)=>
  { 
    const dateSince = ((new Date()).toISOString())
    let query = "" 
   if(networks === "1"){
    
     query = `
    query
    {
      ethereum(network: ethereum) {
        dexTrades(
          date: {since: "` + dateSince + `"}
          any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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
  else{
    query = `
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
  const res=await fetch(url, opts)
     const result = await res.json()
     
      if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) 
      { 
        console.log(result.data.ethereum.dexTrades)
        
        if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c")
        {
          return result.data.ethereum.dexTrades[0].quote
        }
        else
        {
          if(result.data.ethereum.dexTrades.length == 1)
          {
            return result.data.ethereum.dexTrades[0].quote
          }
          else if(result.data.ethereum.dexTrades.length == 2)
          {
            return result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote
          }
          else
          {
            return 0
          }
        }
      } 

  } 
const getexchangevalue = async (pool_token_address,networks)=>
{ 
  let query = "" 
  if(networks === "1"){
   query = `
    query {
      ethereum(network: ethereum) {
      address(address: {is: "`+pool_token_address+`"}) {
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
    else{
       query = `
    query {
      ethereum(network: bsc) {
      address(address: {is: "`+pool_token_address+`"}) {
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
  var valuePairAddress=0
  var valueAddress=0
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
  const res=await fetch(url, opts)
   const result = await res.json()
      if (result.data.ethereum) {
       if(result.data.ethereum.address)
        {
         if(result.data.ethereum.address[0].balances)
          {
            return result.data.ethereum.address[0].balances
          }
        }
      }
  
} 

const getTokenUsdPrice=async(id, networks)=>
{  
  let query = "" 
  const dateSince = ((new Date()).toISOString())
  if(networks === "1")
  {
    query = `
    query
    {
      ethereum(network: ethereum) {
        dexTrades(
          date: {since: "` + dateSince + `"}
          any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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
  else{
    query = `
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
  const livePriceQuery = await fetch(url, opts)
  const liveQueryRun = await livePriceQuery.json() 
  if(liveQueryRun)
  {
      if(liveQueryRun.data.ethereum != null && liveQueryRun.data.ethereum.dexTrades != null) 
      { 
        console.log("Live Price",liveQueryRun.data)   
        var cal_live_price = 0
        if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c")
        {
          cal_live_price = liveQueryRun.data.ethereum.dexTrades[0].quote
        }
        else if(liveQueryRun.data.ethereum.dexTrades.length == 2)
        {
          cal_live_price = liveQueryRun.data.ethereum.dexTrades[0].quote*liveQueryRun.data.ethereum.dexTrades[1].quote
        }
        getTokendetails(id, cal_live_price, networks)
        setLivePrice(cal_live_price) 
        get24hChange(cal_live_price, id, networks) 
          // getTotalMaxSupply(id,decimal, networks)
          // getMarketCap(id, decimal, result.data.ethereum.dexTrades[0].quote, networks) 
          
          
      } 
       
  }
}



const getTokendetails=async (id, usd_price, network_type)=> 
{  
  let query =""
  if(network_type === "1")
  {
    query = `
        query
        { 
          ethereum(network: ethereum) {
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
  }
  else{
    query = `
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
  }
  const liveDecimalQuery = await fetch(url, opts)
  const liveDecimalRun = await liveDecimalQuery.json()
  if(liveDecimalRun.data.ethereum !== null) 
  { 
    setdecimal(liveDecimalRun.data.ethereum.address[0].smartContract.currency.decimals)
    var get_total_supply_value = await getTotalMaxSupply(id, network_type)
    var cal_total_supply_value = get_total_supply_value/10**liveDecimalRun.data.ethereum.address[0].smartContract.currency.decimals
    settoken_max_supply(cal_total_supply_value) 
    var cal_market_cap = cal_total_supply_value * usd_price
    set_market_cap(cal_market_cap)
    getMarketCap(id, liveDecimalRun.data.ethereum.address[0].smartContract.currency.decimals, usd_price, network_type) 
    //getCirculatingSupply(id,liveDecimalRun.data.ethereum.address[0].smartContract.currency.decimals, network_type)
    const reqObj = {
      network_type : network_type,
      contract_address: id,
      live_price: usd_price,
      total_max_supply:cal_total_supply_value,
      market_cap:cal_market_cap
    } 

    await Axios.post(API_BASE_URL+'markets/tokens/save_token_live_price', reqObj, config)
  }  
}


const getTotalMaxSupply= async (id, networktype)=>
{
  var req_url = "https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=E9DBMPJU7N6FK7ZZDK86YR2EZ4K4YTHZJ1"
  if(networktype==2)
  {
    req_url = "https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=GV79YU5Y66VI43RM7GCBUE52P5UMA3HAA2"
  }
  const resObj = await Axios.get(req_url)
  if(resObj.status)
  { 
    return resObj.data.result
  }
  else
  {
    return 0
  }
}
const getMarketCap =async(id, decval, usd_price, network_type)=> {  

  let mainnetUrl = ""

  if(network_type === "1" ){
    mainnetUrl = 'https://mainnet.infura.io/v3/5fd436e2291c47fe9b20a17372ad8057'
  }
  else{
    mainnetUrl = "https://bsc-dataseed.binance.org/";
  }
 
 
    const provider = new ethers.providers.JsonRpcProvider(mainnetUrl); 

    const tokenAbi = ["function totalSupply() view returns (uint256)"];
    const tokenContract = new ethers.Contract(id, tokenAbi, provider);
    const supply = await tokenContract.totalSupply() / (10 ** decval);  
    console.log("supply", supply)
    // set_market_cap(supply * usd_price) 
    console.log(market_cap) 

  if(network_type === "1")
  {
    // if(id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' || id !== '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'){
      
    //       const pairAbi = ["function getPair(address first, address second) view returns (address)"]
    //       const pairContract = new ethers.Contract("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", pairAbi, provider);
    //       const pairAddr = await pairContract.getPair(id, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
  
    //       const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
    //       const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
    //       const reserve = await liqContract.getReserves();
    //       const token0 = await liqContract.token0();
    //       const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decval) * usd_price * 2;
    //       set_liquidity(liquidity) 
    //       console.log(liquidity)
     // } 
  }
  else
  {
    if(id !== '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c')
    {
      
      const pairAbi = ["function getPair(address first, address second) view returns (address)"]
      const pairContract = new ethers.Contract("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", pairAbi, provider);
      const pairAddr = await pairContract.getPair(id, '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c');
     
      const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
      const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
      const reserve = await liqContract.getReserves();
      const token0 = await liqContract.token0();
      const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decval) * usd_price * 2;
      set_liquidity(liquidity)
      console.log(liquidity)
      }
      else
      {
        const pairAbi = ["function getPair(address first, address second) view returns (address)"]
        const pairContract = new ethers.Contract("0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", pairAbi, provider);
        const pairAddr = await pairContract.getPair(id, '0xe9e7cea3dedca5984780bafc599bd69add087d56');
       
          const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
          const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
          const reserve = await liqContract.getReserves();
          const token0 = await liqContract.token0();
          const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decval) * usd_price * 2;
          set_liquidity(liquidity)
    
      }

  } 
}


const saveLivePricingDetails=(network_type, contract_address, live_price) =>
{ 
    const reqObj = {
      network_type : network_type,
      contract_address: contract_address,
      live_price: live_price,
      total_max_supply:token_max_supply,
      market_cap:market_cap
     
    } 
    // total_max_supply:
    // market_cap:

    Axios.post(API_BASE_URL+'markets/tokens/save_token_live_price', reqObj,config).then(res => 
    {  
        console.log(res)   
    })
}

const get24hChange=(fun_live_price, id, networks)=>
{  
 
  let query = ""

  const date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString()) 
  // console.log(date)
  if(networks === "1"){

  query = `
              query
              {
                ethereum(network: ethereum) {
                  dexTrades(
                    date: {in: "` + date + `"}
                    any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
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
 
  if(networks === "2"){

    query = `
    query
    {
      ethereum(network: bsc) {
        dexTrades(
          date: {in: "` + date + `"}
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
   
  const contract_usdt_price = fun_live_price 
  let change24h = 0
  fetch(url, opts)
    .then(res => res.json())
    .then(result => 
      {     
        if(result.data.ethereum != null && result.data.ethereum.dexTrades != null)
        {    
          if(result.data.ethereum.dexTrades[0].baseCurrency.symbol === "WBNB" || id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
          {
            var quote_zero = 0
            if(result.data.ethereum.dexTrades)
            {
              quote_zero = result.data.ethereum.dexTrades[0].quote
            }

            var quote_one = 0
            if(result.data.ethereum.dexTrades.length > 1)
            {
              quote_one = result.data.ethereum.dexTrades[1].quote
            }

            change24h = ((contract_usdt_price - (quote_zero*quote_one)) / (contract_usdt_price) * 100) 
            set_priceChange24H(change24h)
            console.log(change24h)
          } 
          else
          {
            change24h = (contract_usdt_price / (quote_zero * quote_one) - 1) * 100
            // change24h = (contract_usdt_price / (result.data.ethereum.dexTrades[0].quote ) - 1) * 100
            set_priceChange24H(change24h) 
          } 
        }
    })
    .catch(console.error);
} 

const getGraphData=(datetime, id,networks  )=> 
{   
 
  let query =""
  if(datetime === "") 
  { 
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

    if(networks === "1"){
      
      if(id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"){
        query = `
          query
                {
                  ethereum(network: ethereum) {
                    dexTrades(
                      exchangeName : {is: ""}
                      date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                      any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
                      options: {asc: "timeInterval.hour"}
                    ) {
                      timeInterval {
                        hour(count: 1)
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
                ethereum(network: ethereum) {
                  dexTrades(
                    exchangeName : {is: ""}
                    date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                    any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]
                    options: {asc: "timeInterval.hour"}
                  ) {
                    timeInterval {
                      hour(count: 1)
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
      
    }
 
    if(networks === "2"){ 

      if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"){

        query = `
        query
              {
                ethereum(network: bsc) {
                  dexTrades(
                    exchangeName : {is: "Pancake v2"}
                    date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                    any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
                    options: {asc: "timeInterval.hour"}
                  ) {
                    timeInterval {
                      hour(count: 1)
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
                    exchangeName : {is: "Pancake v2"}
                    date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                    any: [{baseCurrency: {is: "`+id+`"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}]
                    options: {asc: "timeInterval.hour"}
                  ) {
                    timeInterval {
                      hour(count: 1)
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
        var prices= [];
        var arr = result.data.ethereum.dexTrades; 

        for (let index = 0; index < arr.length; index++) {
          if (arr[index] !== undefined) {
            var rate = 0 
            rate = arr[index].tradeAmountInUsd / arr[index].buyAmount; 
             
            var date = new Date(arr[index].timeInterval.hour)
            var val = []
            val[0] = date.getTime()
            val[1] = rate; 


            prices.push(val)
            // console.log(prices)
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
                  text: ('USD Prices')
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
                        '<strong>Price :</strong> '+ ('$ ') + Highcharts.numberFormat(point.y, 10) + '';  
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
 
const getBEPAccountDetails=(type)=> {  
        
  let parentThis = this 
  if(window.web3)
  {
    let web3 = new Web3(Web3.givenProvider || parentThis.state.givenProvider)
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
      "X-API-KEY": graphqlApiKEY
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
              } 
              else 
              {
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
 
const getTokenAddress = (address, type, connecttionType)=>{
  setSelectedWalletType(connecttionType)
  set_connected_address(address) 
  setSelectedTokenModal(false)
 
  if(type === 1){
    localStorage.setItem("walletconnectedtype", "1")
      window.location.reload()
  }
}

const myReferrlaLink=()=> {
    var copyText = document.getElementById("referral-link");
    copyText.select();
    document.execCommand("Copy");
    var tooltip = document.getElementById("myTooltip");
    tooltip.innerHTML = "Copied";
  }

  const copyContract=(data, type)=>
  {
    // var copytext = document.createElement("input");
    // copytext.value = data;
    // document.body.appendChild(copytext)
    
    // copytext.select();
    // document.execCommand("Copy"); 
    // copytext.remove()
    set_contract_copy_status(type)
     console.log(type)
   

    var copyText = document.createElement("input")
    copyText.value = data;
    document.body.appendChild(copyText)
    copyText.select();
    document.execCommand("Copy");
    copyText.remove()
    // setTimeout(3000)
    setTimeout(() => set_contract_copy_status(""), 3000)
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
      catch(error) {
        // console.log('ethereum error, ', error)
      } 
    }
    else
    { 
      handleModalConnection()
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
            getTokenAddress(first_address, type, 1) 
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
            getTokenAddress(first_address, type, 1) 
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
            getETHAccountDetails(0)
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
              getETHAccountDetails(0)
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
 
 const handleModalConnection=()=> 
  {    
    setHandleModalMainNetworks(false)
    setHandleModalConnections(!handleModalConnections) 
  }

  const ModalVote=()=> 
  {    
    setHandleModalVote(!handleModalVote) 
  }

  const vote = (param) =>
  {
    ModalVote()
    if(param == 1)
    {   
      Axios.get(API_BASE_URL+"markets/listing_tokens/save_voting_details/"+data.token_id, config)
      .then(res=>{ 
      console.log(res)
      if(res.data.status === true) 
      {
        set_votes(votes+1)
        set_voting_status(true)
        set_voting_message(res.data.message)
      }
    })
    }
    else
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/remove_voting_details/"+data.token_id, config)
      .then(res=>{ 
      console.log(res)
      if(res.data.status === true) 
      {
        set_votes(votes-1)
        set_voting_status(false)
        set_voting_message(res.data.message)
      }
    })
    }
  }

  const handleModalMainNetwork=()=> 
  {       
    setHandleModalConnections(false)  
    setHandleModalMainNetworks(!handleModalMainNetworks)  
  } 

  return(
    <>
      <Head>
         <title>{data.token_name.toUpperCase()} ({data.symbol}) Live Price | Coinpedia Market</title>  
         <meta name="description" content={data.meta_description} />
        <meta name="keywords" content={data.meta_keywords} />
 
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={data.token_name.toUpperCase()+ " ("+data.symbol+")  Live Price" + "  | Coinpedia Market" } />
        <meta property="og:url" content={website_url+data.token_id} />
        <meta property="og:description" content={data.meta_description} />

        <meta property="og:site_name" content={data.token_name.toUpperCase()+ " ("+data.symbol+")  Live Price" + "  | Coinpedia Market" } />
        <meta property="og:image" itemprop="thumbnailUrl" content={image_base_url+data.token_image} />
        <meta property="og:image:secure_url" content={image_base_url+data.token_image} />
        <meta property="og:image:width" content="100" />
        <meta property="og:image:height" content="100" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:description" content={data.meta_description} />

        <meta name="twitter:title" content={data.token_name.toUpperCase()+ " ("+data.symbol+")  Live Price" + "  | Coinpedia Market" } />
        <meta name="twitter:image" content={image_base_url+data.token_image} />  
        <link rel="canonical" href={website_url+data.token_id} />
 
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
    <div className="page">
      <div className="airdrop_single_page">
          <div className="container">
            <div className="col-md-12">
                {/* <div className="row">
                  <div className="col-md-12">
                    <div className="slider_promotions">
                      <div className="slider__item">
                          <div className="slider__wrap">
                          <div className="slider__date">Oct 26th - Nov 25th</div>
                          <div className="slider__title">Bitcoin x TRON Net Deposit Campaign</div>
                          <div className="slider__info">To celebrate our new multi-chain deposit and withdrawal support for Bitcoin on TRON (BTCTRON), we’re beginning a 30-day net deposit…</div>
                          <button className="slider__btn btn btn_white">Connect your Wallet</button>
                          </div>
                          <div className="slider__preview"><img src="/assets/img/figures-2.png" alt="" /></div>
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="row">
                  <div className="col-md-12"> 
                  {
                    data.launch_pads_data.length > 0
                    ?
                    <div className="promotion launchpads">
                      <div className="">
                        {/* <div className="promotion__category">🔥 Launchpad's</div> */}
                        <div className="panel-group ico_plans" id="accordion" role="tablist" aria-multiselectable="true"> 
                          { 
                            data.launch_pads_data.map((e, i)=>
                              <div className="panel panel-default" key={i}>
                                  <div className="panel-heading active" role="tab" id="headingOne">
                                    <div className="row">
                                      <div className="col-lg-4 col-3 col-sm-4 col-md-4">
                                        <h4 className="panel-title">
                                          <a role="button" data-toggle="collapse" data-parent="#accordion"  href={"#upComing"+i} aria-expanded="true" aria-controls="collapseOne">
                                            {
                                            e.launch_pad_type === 1 ? 
                                              "ICO" 
                                            : 
                                            e.launch_pad_type === 2 ?
                                            "IDO" : "IEO" 
                                            }

                                            {
                                              moment(data.today_date).isBefore(moment(e.start_date).format('ll')) ?
                                              <span className="badge ico_upcoming_badge ongoing_ico">Upcoming</span> 
                                              :
                                              moment(data.today_date).isAfter(moment(e.start_date).format('ll')) && moment(data.today_date).isBefore(e.end_date) ?
                                              <span className="badge ico_ongoing_badge ongoing_ico">Ongoing</span>
                                              :
                                              moment(moment(e.end_date).format('ll')).isSame(data.today_date) || moment(moment(e.start_date).format('ll')).isSame(data.today_date)
                                              ?
                                              <span className="badge ico_ongoing_badge ongoing_ico">Ongoing</span>
                                              :
                                              moment(moment(e.end_date).format('ll')).isBefore(data.today_date) ?
                                              <span className="badge ico_completed_badge  ongoing_ico">Completed</span> 
                                              : 
                                              null
                                            }

                                            </a>
                                          </h4>
                                      </div>
                                      <div className="col-lg-8 col-9 col-sm-8 col-md-8">
                                        <a role="button" data-toggle="collapse" data-parent="#accordion"  href={"#upComing"+i} aria-expanded="true" aria-controls="collapseOne">
                                          <span className="start-end-date"><img src="/assets/img/calander.png" className="ico_calender" />
                                          {e.start_date !== "0000-00-00" ? moment(e.start_date).format("MMM D, YYYY") : "-"} - {e.start_date !== "0000-00-00" ? moment(e.end_date).format("MMM D, YYYY") : "-"}
                                          
                                          {/* {
                                            moment(data.today_date).isBefore(e.start_date) ?
                                            <>, starts in 24 hours </>
                                            :
                                            null
                                          }  */}
                                          <img src="/assets/img/down-arrow.png" className="dropdown_arrow_img ico_dropdown"></img></span>
                                        </a>
                                      </div>
                                    </div>
                                    
                                  </div>
                                  <div id={"upComing"+i} className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                                    <div className="panel-body">
                                      <div className="col-md-12 ico_block_details">
                                        <div className="row">
                                          <div className="col-md-6"> 
                                            <p>ICO Price <b>${e.price ? e.price : "-"}</b></p>
                                            <p>Soft Cap <b>{e.soft_cap ? "$"+e.soft_cap : "-"}</b></p>
                                            {/* <p>Fundraising Goal <b>${e.fundraising_goal ? e.fundraising_goal : "-"}</b></p> */}
                                            <p>Tokens Sold <b>{e.tokens_sold ? e.tokens_sold : "-"}</b></p>
                                          </div>
                                          <div className="col-md-6">
                                            <p>Where to buy<a href={e.where_to_buy_link} target="_blank"><b>{e.where_to_buy_title ? e.where_to_buy_title : "-"} </b></a></p>
                                            <p>% of Total Supply <b>{e.percentage_total_supply ? e.percentage_total_supply : "-"}%</b></p>
                                           
                                            { 
                                                e.accept_payment_type.length > 0 ?
                                                <>
                                                 <p>Accept <b> 
                                                  {
                                                    e.accept_payment_type.map((inner)=>
                                                    <>{inner.payment_name}<span>/</span></>
                                                   )}
                                                  </b></p>
                                                </>
                                                :
                                                ""
                                             }
                                            
                                            <p>Access <b>{e.access_type === 1 ? "Public" : "Private"}</b></p>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="how_to_participate">
                                        <h4>How to participate ?</h4>
                                        <p className="participate_para_one">
                                        {
                                          ((e.how_to_participate != null) && ((e.how_to_participate).length > 800)) ?
                                          <>
                                          {
                                            read_more == e.id ? 
                                            <p className="participate_link">
                                            {e.how_to_participate}
                                            <br />
                                            <a onClick={() =>set_read_more("")}><span>Read Less</span></a>
                                            </p>
                                            :
                                            <p className="participate_link">
                                            {strLenTrim(e.how_to_participate, 800)}
                                            <br />
                                            <a onClick={() =>set_read_more(e.id)}><span>Read More</span></a>
                                            </p>
                                          }
                                            
                                          </>
                                          :
                                          e.how_to_participate
                                        }
                                        </p>
                                       
                                        {/* <p className="participate_para_two">
                                        {e.how_to_participate}
                                        </p> */}
                                      </div>
                                    </div>
                                  </div>
                              </div>
                             )
                            }
                        </div> 
                      </div>
                    </div> 
                    :
                    null 
                    } 

                    <div className="market_details_block">
                      <div className="widgets__item">
                        <div className="widgets__head">
                          <div className="">
                            <div className="media">
                              <div className="widgets__logo"><img src={data.token_image ? image_base_url+data.token_image : "https://assets.coingecko.com/coins/images/1/small/bitcoin.png?1547033579"} alt="logo" width="100%" height="100%" /></div>
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
                                        {/* <div className="share_market_detail_page" data-toggle="modal" data-target="#market_share_page"><img src="/assets/img/share-icon.png"  width="100%" height="100%" /> Share</div> */}
                                        <div className="share_market_detail_page" data-toggle="modal" data-target="#market_share_page">Share</div>
                                      </li>
                                      {/* <li>
                                        <div className="wishlist_market_detail_page">
                                          <div className="star-img"><img src="/assets/img/star.png" width="100%" height="100%" />
                                          </div>
                                        </div>
                                      </li> */}
                                      
                                    </ul>

                                    
                                  </div>
                                </div>
                              </div>
                            </div>


                            <div>
                              <div className="widgets__price">{live_price?"$":null}{live_price ? separator(live_price.toFixed(8)) : "NA"} 
                                {
                                  price_change_24h
                                  ?
                                  price_change_24h > 0
                                  ?
                                  <span className="market_growth market_up"><img src="/assets/img/caret-up.png" />{price_change_24h.toFixed(2)}%</span>
                                  :
                                  <span className="market_growth market_down"><img src="/assets/img/caret-angle-down.png" />{price_change_24h.toPrecision(3)}%</span>
                                  :
                                  null
                                }
                              </div>
                            </div>
                          </div>


                          <div >
                            <div className="coin_main_links">
                              <ul className="coin_quick_details">
                                {/* <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a href="#" target="_blank"> # Rank -07 </a></div>
                                  </div>
                                </li> */}
                                <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a href={data.website_link ? data.website_link :"#"} target="_blank"> <img src="/assets/img/website.svg" className="coin_cat_img" />Website </a></div>
                                  </div>
                                </li>

                                
                                {/* { 
                                  data.community_address.length > 0
                                  ?
                                  <li className="coin_individual_list">
                                    <div className="quick_block_links">
                                      <div className="widgets__select links_direct"  ref={communityRef} onClick={()=> {set_community_links(!community_links); set_explorer_links(false) }}><a><img src="/assets/img/community.svg" className="coin_cat_img" />Community {data.community_address.length > 0 ? <img src="/assets/img/down-arrow.png" className="dropdown_arrow_img" /> : null}</a></div>
                                    </div> 
                                    {
                                      community_links
                                      ?
                                        <div className="dropdown_block badge_dropdown_block">
                                            <ul>
                                                { 
                                                  // http:// ,https://, https://www, http://www,
                                                    data.community_address.map((e, i)=>{
                                                      // var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                                      // let url = ""
                                                      // if(regexp.test(e)){
                                                      //     url = new URL(e);
                                                      // }
                                                      // else{
                                                      //     e = "http://"+e
                                                      //     url = new URL(e);
                                                      // }  
                                                      //   return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).indexOf(".") !== -1 ?(url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>
                                                      return <li key={i}><a href={e ? e : ""} target="_blank">{getDomainName(e)}</a></li>
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
                                } */}



                                {
                                  
                                  data.explorer.length > 0
                                  ?
                                  <li className="coin_individual_list">
                                    <div className="quick_block_links">
                                      <div className="widgets__select links_direct" ref={explorerRef} onClick={()=> {set_explorer_links(!explorer_links); set_community_links(false) }}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Explorer {data.explorer.length > 0 ? <img src="/assets/img/down-arrow.png" className="dropdown_arrow_img" /> : null} </a></div>
                                    </div> 
                                    { 
                                      explorer_links
                                      ? 
                                      <div className="dropdown_block badge_dropdown_block">
                                          <ul>
                                              {
                                                  data.explorer.map((e, i)=>{
                                                    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
                                                    let url = ""
                                                    if(regexp.test(e)){
                                                        url = new URL(e);
                                                    }
                                                    else{
                                                        e = "http://"+e
                                                        url = new URL(e);
                                                    }  
                                                      return <li key={i}><a href={e ? e : ""} target="_blank">{(url.hostname).indexOf(".") !== -1 ?(url.hostname).slice(0, (url.hostname).indexOf(".")) : url.hostname}</a></li>
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
                                    data.source_code_link
                                    ?
                                    <li className="coin_individual_list">
                                      <div className="quick_block_links">
                                        <div className="widgets__select links_direct"><a href={data.source_code_link} target="_blank"><img src="/assets/img/source_code.svg" className="coin_cat_img" /> Source Code </a></div>
                                      </div>
                                    </li>
                                    :
                                    null
                                }
                                {
                                    data.whitepaper
                                    ?
                                    <li className="coin_individual_list">
                                      <div className="quick_block_links">
                                        <div className="widgets__select links_direct"><a href={data.whitepaper} target="_blank"> <img src="/assets/img/whitepaper.png" className="coin_cat_img" /> White paper </a></div>
                                      </div>
                                    </li>
                                    :
                                    null 
                                }
                              </ul>
                            </div>
                          </div>



                          <div className="wallets__inner token_overview_block">
                            <ul className="overview_ul">
                              <li>
                                <div className="wallets__details">
                                  <div className="wallets__info">Circulating Supply</div>
                                  <div className="wallets__number h5">NA</div>
                                  {/* <div className="wallets__number h5">{circulating_supply ? separator(circulating_supply) : "-"}</div> */}
                                  {/* <div className="circulating_progress">
                                    <div className="progress">
                                      <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width:"60%"}}></div>
                                    </div>
                                    <p className="progress_bar_status">75%</p>
                                  </div> */}
                                </div>
                              </li>
                              <li>
                                <div className="wallets__details">
                                  <div className="wallets__info">Total Max Supply</div>
                                  <div className="wallets__number h5">{token_max_supply ? separator(token_max_supply) : data.total_max_supply ? separator(data.total_max_supply.toFixed(4)) : "NA"}</div>
                                </div>
                              </li>
                              <li>
                                <div className="wallets__details">
                                  <div className="wallets__info">24h volume</div>
                                  <div className="wallets__number h5">{contract_24h_volume?"$":null}{contract_24h_volume?separator(contract_24h_volume.toFixed(2)): "NA"}</div>
                                  <div className="twenty_block">
                                    {/* {
                                      price_change_24h
                                      ?
                                      price_change_24h > 0
                                      ?
                                      <span className="twenty_high"><img src="/assets/img/green-up.png" />{price_change_24h}%</span>
                                      :
                                      <span className="twenty_low"><img src="/assets/img/red-down.png" />{price_change_24h}%</span>
                                      :
                                      null
                                    } */}
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="wallets__details">
                                  <div className="wallets__info">Market cap</div>
                                  <div className="wallets__number h5">{market_cap?"$":null}{market_cap ? separator(market_cap.toFixed(4)) : data.market_cap ? separator(data.market_cap.toFixed(4)) : "NA"}</div>
                                  <div className="twenty_block">
                                    {/* <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span> */}
                                    {/* <span className="twenty_high"><img src="/assets/img/red-down.png" />2.79%</span> */}
                                  </div>
                                </div>
                              </li>
                              <li>
                                <div className="wallets__details">
                                  <div className="wallets__info">Liquidity</div>
                                  <div className="wallets__number h5">{liquidity?"$":null}{liquidity ? separator(liquidity.toFixed(4)) : "NA"}</div>
                                </div>
                              </li>

                              <li>
                                <div className="wallets__details">
                                  <div className="wallets__info">Social</div>
                                    <div className="market_details_community">
                                      <h6 class="social_icons">
                                      {
                                        data.community_address.map((e, i)=>{
                                          // return <a href={e} target="_blank">
                                          //       <img src={"/assets/img/social-icons/"+(getDomainName(e) != "medium" || getDomainName(e) != "linkedin" || getDomainName(e) != "reddit" || getDomainName(e) != "twitter"|| getDomainName(e) != "youtube" || getDomainName(e) != "facebook" || getDomainName(e) != "instagram") ? "default" : getDomainName(e) +".png"} class="1" alt={getDomainName(e)} title={getDomainName(e)}/>
                                          //     </a>
                                          if(getDomainName(e)  === "medium")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/medium.png" class="1" alt="Medium" title="Medium"/>
                                              </a>
                                          }
                                          else if(getDomainName(e)  === "linkedin")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/linkedin.png" class="1" alt="Linked" title="Linked"/>
                                              </a>
                                          }
                                          else if(getDomainName(e)  === "reddit")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/reddit.png" class="1" alt="Reddit" title="Reddit"/>
                                              </a>
                                          }
                                          else if(getDomainName(e)  === "twitter")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/twitter.png" class="1" alt="Twitter" title="Twitter"/>
                                              </a>
                                          }
                                          else if(getDomainName(e)  === "youtube")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/youtube.png" class="1" alt="Youtube" title="Youtube"/>
                                              </a>
                                          }
                                          else if(getDomainName(e)  === "facebook")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/facebook.png" class="1" alt="Facebook" title="Facebook"/>
                                              </a>
                                          }
                                          else if(getDomainName(e)  === "instagram")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/instagram.png" class="1" alt="Instagram" title="Instagram"/>
                                              </a>
                                          }
                                          else if(getDomainName(e)  === "t")
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/telegram.png" class="1" alt="Telegram" title="Telegram"/>
                                              </a>
                                          }
                                          else
                                          {
                                            return <a href={e} target="_blank">
                                                <img src="/assets/img/social-icons/default.png" class="1" alt={getDomainName(e)} title={getDomainName(e)}/>
                                              </a>
                                          }
                                          
                                        }) 
                                      }
                                      </h6>
                                    </div>
                                  </div>
                              </li>

                            </ul>


                            {/* <div className="row">
                              <div className="col-md-3 col-4">
                                <div className="wallets__details">
                                  <div className="wallets__info">Market Cap</div>
                                  <div className="wallets__number h5">$621.22B</div>
                                </div>
                              </div>
                              <div className="col-md-3 col-4">
                                <div className="wallets__details">
                                  <div className="wallets__info">Max Supply</div>
                                  <div className="wallets__number h5">$21M</div>
                                </div>
                              </div>
                              




                              <div className="col-md-2 col-6">
                                <div className="wallets__details">
                                  <div className="wallets__info">Circulating Supply</div>
                                  <div className="wallets__number h5">{data.circulating_supply ? separator(data.circulating_supply) : "-"}</div>
                                  <div className="circulating_progress">
                                    <div className="progress">
                                      <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{width:"60%"}}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>


                              <div className="col-md-2 col-6">
                                <div className="wallets__details">
                                  <div className="wallets__info">Total Max Supply</div>
                                  <div className="wallets__number h5">{data.token_max_supply ? separator(data.token_max_supply) : "-"}</div>
                                </div>
                              </div> 

                              
                              <div className="col-md-2 col-6">
                                <div className="wallets__details">
                                  <div className="wallets__info">24h volume</div>
                                  <div className="wallets__number h5">${separator(contract_24h_volume.toFixed(2))}</div>
                                  <div className="twenty_block">
                                    {
                                      price_change_24h
                                      ?
                                      price_change_24h > 0
                                      ?
                                      <span className="twenty_high"><img src="/assets/img/green-up.png" />{price_change_24h.toFixed(4)}%</span>
                                      :
                                      <span className="twenty_low"><img src="/assets/img/red-down.png" />{price_change_24h.toFixed(4)}%</span>
                                      :
                                      null
                                    }
                                  </div>
                                </div>
                              </div>  
                              
                              <div className="col-md-2 col-6">
                                <div className="wallets__details">
                                  <div className="wallets__info">Crypto Market cap</div>
                                  <div className="wallets__number h5">${separator(market_cap.toFixed(2))}</div>
                                  <div className="twenty_block">
                                    <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span>
                                    
                                  </div>
                                </div>
                              </div> 

                              <div className="col-md-2 col-6">
                                <div className="wallets__details">
                                  <div className="wallets__info">Liquidity</div>
                                  <div className="wallets__number h5">${separator(liquidity.toFixed(2))}</div>
                                </div>
                              </div> 
                            </div> */}
                          </div>

                          <div className="row">
                            <div className="col-md-12 col-8 token_share_block">
                              { 
                                data.contract_addresses.length > 0
                                ?
                                <div className="wallets__inner contract_address">
                                  <div className="wallets__details">
                                    <div className="wallets__info">Contracts:</div>
                                    <span className="token-contract-details h5"> 
                                      { 
                                        data.contract_addresses.length > 1
                                        ?
                                          data.contract_addresses[0].network_type === "1"
                                          ?
                                          <>  
                                          {/* src="/assets/img/copy.png" */}
                                          <a href={"https://etherscan.io/token/"+data.contract_addresses[0].contract_address} target="_blank">
                                            <span >
                                              <img  className="token_dropdown_img" src="/assets/img/ETH.svg"></img>
                                              Ethereum : {(data.contract_addresses[0].contract_address).slice(0,4)+"..."+(data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4 , data.contract_addresses[0].contract_address.length)}
                                            </span>
                                          </a>&nbsp;
                                          {
                                            contract_copy_status === 'ETH' ? 
                                            <span>Copied</span>
                                            :
                                            <img  onClick={()=> {copyContract(data.contract_addresses[0].contract_address, 'ETH')}} src="/assets/img/copy.png" className="copy_link copy-contract-img" width="100%" height="100%" />
                                          }
                                          
                                          <img src="/assets/img/down-arrow.png" ref={contractRef}  onClick={()=> setOtherContract(!otherContract)} className="dropdown_arrow_img" />
                                          {
                                            otherContract
                                            ?
                                            <div className="dropdown_block"> 
                                              <div className="media">
                                                <img src="/assets/img/binance.svg" alt="Binance" className="token_dropdown_img" />
                                                <div className="media-body">
                                                  <p className="wallets__info">Binance smart chain</p> 
                                                  <p><a  href={"https://bscscan.com/token/"+data.contract_addresses[1].contract_address} target="_blank">{(data.contract_addresses[1].contract_address).slice(0,4)+"..."+(data.contract_addresses[1].contract_address).slice(data.contract_addresses[1].contract_address.length - 4 , data.contract_addresses[1].contract_address.length)}
                                                  </a>
                                                  &nbsp; 
                                                  {
                                                    contract_copy_status === 'BNB'?
                                                    <span>Copied</span>
                                                    :
                                                    <img onClick={()=> copyContract(data.contract_addresses[1].contract_address, 'BNB')} src="/assets/img/copy.png" className="copy_link copy-contract-img" width="100%" height="100%" />
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
                                          data.contract_addresses[0].network_type === "2"
                                          ?
                                          <> 
                                          <a href={"https://bscscan.com/token/" + data.contract_addresses[0].contract_address} target="_blank">
                                            <span >Binance smart chain : {(data.contract_addresses[0].contract_address).slice(0,4)+"..."+(data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4 , data.contract_addresses[0].contract_address.length)}
                                            </span>
                                          </a>
                                          {
                                             contract_copy_status === 'BNB'?
                                             <span  className="votes_market">Copied</span>
                                             :
                                             <span id="copyTooltip">
                                             <img onClick={()=> copyContract(data.contract_addresses[0].contract_address,'BNB')} src="/assets/img/copy.png" className="copy_link copy-contract-img" width="100%" height="100%" /> 
                                             </span>
                                          }
                                         
                                          
                                          <img  ref={contractRef} onClick={()=> setOtherContract(!otherContract)} src="/assets/img/down-arrow.png" className="dropdown_arrow_img" />
                                          {
                                            otherContract
                                            ?
                                            <div className="dropdown_block">
                                              <p>Ethereum</p> 
                                              <p>
                                                <a  href={"https://etherscan.io/token/"+data.contract_addresses[1].contract_address} target="_blank">{(data.contract_addresses[1].contract_address).slice(0,4)+"..."+(data.contract_addresses[1].contract_address).slice(data.contract_addresses[1].contract_address.length - 4 , data.contract_addresses[1].contract_address.length)}</a>
                                                {
                                                  
                                            contract_copy_status === 'ETH' ? 
                                            <span className="votes_market" >Copied</span>
                                            :
                                            <span id="copyTooltip">
                                                <img  onClick={()=> copyContract(data.contract_addresses[1].contract_address,"ETH")} src="/assets/img/copy.png" className="copy_link copy-contract-img" width="100%" height="100%" />
                                                </span>
                                                } 
                                                
                                              </p>
                                            </div>
                                            :
                                            null
                                          }
                                          </> 
                                          :
                                          null
                                        :
                                        data.contract_addresses[0].network_type === "1"
                                        ? 
                                        <span  onClick={()=> setOtherContract(!otherContract)}>
                                          <a href={"https://etherscan.io/token/"+data.contract_addresses[0].contract_address} target="_blank">
                                            Ethereum : {(data.contract_addresses[0].contract_address).slice(0,4)+"..."+(data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4 , data.contract_addresses[0].contract_address.length)} 
                                          </a> 
                                          {
                                              contract_copy_status === 'ETH' ? 
                                              <span className="votes_market" >Copied</span>
                                              :
                                            <span id="copyTooltip">
                                            <img onClick={()=> copyContract(data.contract_addresses[0].contract_address,"ETH")} src="/assets/img/copy.png"  className="copy_link copy-contract-img" width="100%" height="100%" />
                                            </span>
                                          }
                                          
                                        </span>
                                        : 
                                        <span  onClick={()=> setOtherContract(!otherContract)}>
                                          <a href={"https://bscscan.com/token/"+data.contract_addresses[0].contract_address} target="_blank">Binance Smart Chain : {(data.contract_addresses[0].contract_address).slice(0,4)+"..."+(data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4 , data.contract_addresses[0].contract_address.length)} 
                                          </a> 
                                          {
                                             contract_copy_status === 'BNB'?
                                             <span  className="votes_market">Copied</span>
                                             :
                                            <span id="copyTooltip">
                                          <img onClick={()=> copyContract(data.contract_addresses[0].contract_address,'BNB')} src="/assets/img/copy.png"  className="copy_link copy-contract-img" width="100%" height="100%" />
                                          </span>
                                          }
                                          
                                        </span>
                                      } 
                                    </span> 
                                    {/* <span className="votes_market">Copied</span> */}
                                  </div>
                                </div>
                                :
                                null
                              } 
                            </div>

                            <div class="col-4 text-right token_share_block token_share_for_left">
                              <ul className="market_details_share_wishlist mobile_view">
                                <li>
                                  <div className="share_market_detail_page" data-toggle="modal" data-target="#market_share_page">Share</div>
                                </li>
                                {/* <li>
                                  <div className="wishlist_market_detail_page">
                                    <div className="star-img"><img src="/assets/img/star.png" width="100%" height="100%" />
                                    </div>
                                  </div>
                                </li> */}
                                
                              </ul>
                            </div>
                            
                          </div>

                          

                        </div>

                        {/* <div className="widgets__body">
                          <div className="widgets__line">
                            <div className="widgets__price">USD 33152</div>
                            <div className="status negative">-3.66499%</div>
                          </div>
                        </div> */}
                        <div className="wallets__inner">
                          <div className="wallets__list" />
                        </div>
                      </div>
                    </div>

                    <div className="market">
                      <div className="company_profile_tabs">
                        <ul className="nav nav-tabs">
                          <li className="nav-item">
                            <a className="nav-link active" data-toggle="tab" href="#overview"><span>Overview</span></a>
                          </li>
                          <li className="nav-item" >
                            <a className="nav-link" data-toggle="tab" href="#home"><span>Exchange</span></a>
                          </li>
                          <li className="nav-item" >
                            <a className="nav-link" data-toggle="tab" href="#menu1"><span>Transactions</span></a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    
 
                    {/* <div className="exchange_transactions_tabs">
                      <ul className="nav nav-tabs">
                        <li><a data-toggle="tab" href="#home" className="active">Exchange</a></li>
                        <li><a data-toggle="tab" href="#menu1">Transactions</a></li>
                        <li><a data-toggle="tab" href="#menu2">Wallet Transactions</a></li>
                      </ul>
                    </div> */}

                    <div className="exchange_transactions">
                      <div className="tab-content">
                        <div id="overview" className="tab-pane fade show in active">
                          <h5 className="price_change">{(data.symbol).toUpperCase()} Price Change</h5>
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
                                <a className="nav-link " data-toggle="tab" href="#one_day" onClick={()=> getGraphData(1 , data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 D</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab"  href="#one_week" onClick={()=> getGraphData(2, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 W</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab"  href="#one_month" onClick={()=> getGraphData(3, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 M</a>
                              </li>
                              <li className="nav-item">
                                <a  className="nav-link active" data-toggle="tab"  href="#one_year" onClick={()=> getGraphData(4, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 Y</a>
                              </li>
                              <li className="nav-item">
                                <a className="nav-link" data-toggle="tab" href="#more_dates"  onClick={()=> setCustomDate(!customDate)}><img src="/assets/img/table_dropdown_dots.png" className="more_dates" /></a>
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



                          <div className="token_content">
                            <div className="">
                              <div className="row">
                                <div className="col-md-12">
                                  {/* <h1>{data.symbol} Price Live Data</h1>
                                  <p className="">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of 
                                    type and scrambled it to make a type specimen book. It has survived not only five centuries,
                                  </p> */}
                                  {
                                    data.token_description ?
                                    <h1>About {data.token_name ? data.token_name : "-"}</h1>
                                    :
                                    null
                                  }
                                  
                                  {
                                    ((data.token_description != null) && ((data.token_description).length > 900)) ?
                                    <>
                                    {
                                      desc_read_more ? 
                                      <>
                                       <div className="promotion__text" style={{wordBreak: "break-all"}} dangerouslySetInnerHTML={{ __html: data.token_description }}></div>
                                       <p className="participate_link">
                                       <a onClick={() =>set_desc_read_more(false)}><span>Read Less</span></a>
                                       </p>
                                      </>
                                      :
                                      <>
                                      <div className="promotion__text" style={{wordBreak: "break-all"}} dangerouslySetInnerHTML={{ __html:strLenTrim(data.token_description, 900)}}></div>
                                      <p className="participate_link">
                                      <a onClick={() =>set_desc_read_more(true)}><span>Read More</span></a>
                                      </p>
                                     </>
                                    }
                                      
                                    </>
                                    :
                                    <div dangerouslySetInnerHTML={{ __html:data.token_description}}>
                                     </div> 
                                  }
                                </div>
                              </div> 
                            </div>
                          </div>   
                        </div>

                        <div id="home" className="tab-pane fade">
                          {/* <h4>Exchange</h4>
                          <div className="table-responsive">
                            <table className="table table-borderless">
                                <thead>
                                  <tr>
                                      <th>Exchange</th>
                                      <th className="market_trades_count">Trades Count</th>
                                      <th>Takers</th>
                                      <th>Makers</th>
                                      <th>Amount</th>
                                  </tr>
                                </thead> 
                                
                                    <tbody>
                                      {
                                          exchangelistData.length > 0
                                          ?
                                          exchangelistData
                                          :
                                          <tr>
                                            <td colSpan="5"><h5 className="text-center no_data_found">No data found</h5></td>
                                          </tr>
                                        } 
                                      </tbody>
                            </table>
                          </div> */}
                       
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
                                        <td title= {e.exchange_address}>{e.exchange_name}</td>
                                        <td title={e.pair_one_token_address}>{e.pair_one_name} / {symbol}<br/><span className="pooledvalue">({separator(e.pair_one_value.toFixed(3))}) / ({separator(e.pair_two_value.toFixed(3))})</span> </td>
                                        {
                                          e.pair_one_token_address== "0x3ff997eaea488a082fb7efc8e6b9951990d0c3ab"?
                                          "--"
                                          :<td>${separator(e.liquidity_in_pool+(e.pair_two_value*live_price))} </td>
                                        }
                                        <td>--</td>
                                        <td>--</td>
                                        <td>--</td>
                                        <td>--</td>
                                      </tr>
                                    } )
                                    
                                    
                                  }
                                   {
                                        tokentransactionsData.length > 0
                                        ?
                                        tokentransactionsData
                                        :
                                        <tr>
                                          <td colSpan="5"><h5 className="text-center no_data_found">No data found</h5></td>
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
                                // previousLabel={exchangesCurrentPage+1 !== 1 ? "Previous" : ""}
                                previousLabel={exchangesCurrentPage+1 !== 1 ?"<-previous" : ""}
                                // nextLabel={exchangesCurrentPage+1 !== exchangesPageCount ? "Next" : ""}
                                nextLabel={exchangesCurrentPage+1 !== exchangesPageCount ? "Next->" : ""}
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
                          }

                        </div>
                        <div id="menu1" className="tab-pane fade in">
                          <h4>Transactions</h4>
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
                              <tbody>
                                    {
                                        tokentransactionsData.length > 0
                                        ?
                                        tokentransactionsData
                                        :
                                        <tr>
                                          <td colSpan="5"><h5 className="text-center no_data_found">No data found</h5></td>
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
                                previousLabel={tokentransactionsCurrentPage+1 !== 1 ? "Previous" : ""}
                                nextLabel={tokentransactionsCurrentPage+1 !== tokentransactionsPageCount ? "Next" : ""}
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

                        

                      </div>
                    </div>
                  </div>

                    {/* <div className="col-md-4"> 
                      {
                        connected_address
                        ? 
                        <div className="sidebar_wallet">
                                <h6>Total Balance</h6> 
                                  <h2>${separator(Number.parseFloat(walletTokenUsdBal).toFixed(4))}</h2>
                                  <div className="row">
                                    <div className={loadmore ? "col-md-12 assets_balance loadmore" : "col-md-12 assets_balance"} >
                                      <table>
                                        <thead>
                                          <tr>
                                          <th>Token</th>
                                          <th>Live Price</th>
                                          <th>Balance</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            connectedtokenlist.length > 0
                                            ?
                                            connectedtokenlist.map((e, i) => {
                                              return <tr key={i}>
                                                        <td><Link href="/profile"><a><h5>{e.currency.symbol}</h5></a></Link></td>
                                                        <td><Link href="/profile"><a><h6>${separator(Number.parseFloat(e.quotePrice).toFixed(4)) }</h6></a></Link></td>
                                                        <td><Link href="/profile"><a><h6>{separator(Number.parseFloat(e.value).toFixed(4))}<span>${(e.quotePrice * e.value).toFixed(4)}</span></h6></a></Link></td>
                                                      </tr> 
                                            })
                                            :
                                            <tr>
                                             <td colSpan="3"><h4>No tokens found</h4></td> 
                                            </tr>
                                          } 
                                        </tbody>
                                      </table>
                        
                                      
                                    </div>
                                    
                                  </div>
                                  {
                                      connectedtokenlist.length > 2
                                      ?
                                      <h4 onClick={()=> set_loadmore(!loadmore)} >{loadmore ? "Load Less" : "Load More"}</h4>
                                      :
                                      null
                                    } 
                              </div>  
                        :
                        <div className="sidebar_wallet">
                          <h4 onClick={()=> setSelectedTokenModal(true)} >Connect Wallet</h4>
                        </div>
                      }

                        <SideBarExchangeDetails /> 
 
                  </div>  */}
                </div>
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

          <div className="modal" id="market_share_page">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title">Share</h4>
                    <button type="button" className="close" data-dismiss="modal">×</button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-1" />
                      <div className="col-md-10">
                        <div className="input-group">
                          <input type="text" id="referral-link" className="form-control" defaultValue={website_url+data.token_id} readOnly />
                          <div className="input-group-prepend">
                            <span className="input-group-text" id="myTooltip" onClick={()=>myReferrlaLink()}>
                              <img src="/assets/img/copy-file.png" className="copy_link" width="100%" height="100%" />
                            </span>
                          </div>
                        </div>
                        <h6>Share with </h6>
                        <p className="share_social">
                          <a href={"https://www.facebook.com/sharer/sharer.php?u="+website_url+data.token_id} target="_blank"><img src="/assets/img/facebook.png" width="100%" height="100%" /></a>
                          <a href={"https://www.linkedin.com/shareArticle?mini=true&url="+website_url+data.token_id} target="_blank"><img src="/assets/img/linkedin.png" width="100%" height="100%" /></a>
                          <a href={"http://twitter.com/share?text="+website_url+data.token_id} target="_blank"><img src="/assets/img/twitter.png" width="100%" height="100%" /></a>
                          <a href={"https://wa.me/?text="+website_url+data.token_id} target="_blank"><img src="/assets/img/whatsapp.png" width="100%" height="100%" /></a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          <div className={"modal connect_wallet_error_block"+ (handleModalVote ? " collapse show" : "")}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal" onClick={()=>ModalVote()}>&times;</button>
                  {
                    voting_status == false ?
                    <h4> Do you want to support this token ? </h4>
                    :
                    <h4> Do not support this token ? </h4>
                  }
                  
                  <div className="vote_yes_no">
                    {/* className={voting_status == 1 ? "vote_yes" : "vote_no"} */}
                    {
                      voting_status == false ?
                      <>
                      <button onClick={()=>vote(1)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                      :
                      <>
                      <button onClick={()=>vote(0)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                    }
                    
                  </div>
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
    </>
  )
}


export async function getServerSideProps({ query, req}) 
{ 
  const token_id = query.token_id
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
 
 
  const paymentQuery = await fetch(API_BASE_URL+"markets/listing_tokens/payment_types", config(userAgent.user_token))
  const paymentQueryRun = await paymentQuery.json() 

  const tokenQuery = await fetch(API_BASE_URL+"markets/tokens/individual_details/"+token_id, config(userAgent.user_token))
  const tokenQueryRun = await tokenQuery.json() 
  if(tokenQueryRun.status)
  {
    return { props: {data: tokenQueryRun.message, paymentTypes:paymentQueryRun.message, errorCode:false, token_id, userAgent:userAgent, config:config(userAgent.user_token)}}
  }
  else
  {
    const errorCode = true
    // {redirect:{ permanent:false, destination: "/" }}
    return  {props: { errorCode }}
  }

}
