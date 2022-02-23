import React, {useState, useRef, useEffect} from 'react';  
import { ethers } from 'ethers';
import Link from 'next/link' 
import Head from 'next/head';
import Error from './404'
import { API_BASE_URL, config, website_url, separator, createValidURL, strLenTrim, getDomainName, app_coinpedia_url, IMAGE_BASE_URL, graphqlApiKEY,count_live_price} from '../components/constants'
import { graphQlURL, fromNToDate } from '../components/tokenDetailsFunctions' 
import moment from 'moment'
import Highcharts from 'highcharts';    
import ReactPaginate from 'react-paginate';
import cookie from "cookie"
import Axios from 'axios'
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css" 
import Popupmodal from '../components/popupmodal'
  
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


export default function tokenDetailsFunction({errorCode, data, token_id, paymentTypes, userAgent, config}) 
{   
   
  console.log("data", data)
  if(errorCode) {return <Error/> }
  const communityRef = useRef(null);
  const explorerRef = useRef(null);
  const contractRef = useRef(null);  
  const [image_base_url] = useState(IMAGE_BASE_URL+"/tokens/")     
  const [symbol] = useState(data.symbol)
  const [watchlist, set_watchlist] = useState(data.watchlist_status)
  const [share_modal_status, set_share_modal_status] = useState(false)
  
  const [user_token]= useState(userAgent.user_token)
  const [perPage] = useState(10);
  
  const [current_url]= useState(website_url+token_id)
  const [exchangelistnew, set_exchange_list_new]= useState([])
  const [exchangelist, set_exchangelist]= useState([])
  const [exchangesPageCount, setExchnagesPageCount] = useState(0)
  const [exchangesCurrentPage , setExchangesCurrentPage] = useState(0)
  const [token_max_supply , settoken_max_supply] = useState(0)
  const [tokentransactions, set_tokentransactions]= useState([])
  const [tokentransactionsData, set_tokentransactionsdata]= useState([])
  const [tokentransactionsPageCount, settokentransactionsPageCount] = useState(0)
  const [tokentransactionsCurrentPage , settokentransactionsCurrentPage] = useState(0)
  const [today_date, set_today_date]= useState(data.today_date)

  const [searchBy, setSearchBy] = useState("")  
  const [err_searchBy, setErrsearchBy] = useState("") 
  const [search_contract_address, set_search_contract_address] = useState("")    
  const [validSearchContract, setvalidContractAddress] = useState("")

  const [decimal,setdecimal]=useState(0)
  
  const [community_links, set_community_links] = useState(false)
  const [explorer_links, set_explorer_links] = useState(false)
  const [handleModalConnections, setHandleModalConnections] = useState(false)
  const [handleModalVote, setHandleModalVote] = useState(false)

  const [customstartdate, setCustomstartdate] = useState("")
  const [customenddate, setCustomenddate] = useState("")

  const [price_change_24h, set_priceChange24H] = useState("") 
  const [live_price, setLivePrice] = useState("")
  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })

  const [otherContract, setOtherContract] = useState(false) 
  const [customDate, setCustomDate] = useState(false)
  const [graphDate , set_graphDate] = useState(1) 
  const [contract_24h_volume,set_contract_24h_volume] = useState(0)  
  const [market_cap, set_market_cap] = useState(0) 
  const [liquidity, set_liquidity] = useState(0) 
  const [contract_copy_status, set_contract_copy_status] = useState("")
  const [desc_read_more, set_desc_read_more] = useState(false)
  const [votes, set_votes] = useState(data.total_voting_count)
  const [voting_status, set_voting_status] = useState(data.voting_status)

  const [launchpad_row_id, set_launchpad_row_id] = useState(data.launch_pads_data.length > 0 ? parseInt(data.launch_pads_data[0]._id) : "")
  const [launchpad_object, set_launchpad_object] = useState(data.launch_pads_data.length > 0 ? data.launch_pads_data[0] : "")
  
  
const getTokenData =(type, address)=>
{ 
    setvalidContractAddress("")
    setErrsearchBy("")
    let formValid=true 
    if(searchBy == "")
    {
      setErrsearchBy("Please Select Network Type")
      formValid=false
    }

    if(searchBy == "0")
    {
      setErrsearchBy("Please Select Network Type")
      formValid=false
    }

    if(search_contract_address == "")
    {
      setErrsearchBy("Please Enter Contract Address")
      formValid=false
    }
    
    if(!formValid){
      return
    }
    let network_type = ""
    
    if(type === "1"){ 
      network_type = "ethereum"
    }
    else if(type === "2"){ 
      network_type = "bsc"
    }
    else
    {
      return null
    }
    
    getTokenDetails(network_type, address)

}

  
const getTokenDetails = (network_type, address) =>{  

  // let network_type = ""

  // if(type === "1"){ 
  //   network_type = "ethereum"
  // }
  // else if(type === "2"){ 
  //   network_type = "bsc"
  // }
  // else{
  //   return null
  // }

  const query = `
              query
              { 
                ethereum(network: `+network_type+`) {
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

  const url = "https://graphql.bitquery.io/";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY":graphqlApiKEY
    },
    body: JSON.stringify({
      query
    })
  }; 
  fetch(url, opts)
    .then(res => res.json())
    .then(result => {  
      if(result.data.ethereum) 
        if(result.data.ethereum.address[0].smartContract){
        if (result.data.ethereum.address[0].smartContract.currency) { 
          setvalidContractAddress("")
          CheckContractAddress(address)
        } 
        else { 
          setvalidContractAddress("Invalid contract address or network type.")
        
          
        } 
      }
      else{
        setvalidContractAddress("Invalid contract address or network type.")
        
      }
      else{
        setvalidContractAddress("Invalid contract address or network type.")
        
      }
    })
    .catch(console.error);

}


const CheckContractAddress =(address)=>{
  // for(const i of listData)
  //   {
  //     list.push({value: i.country_id, label: i.country_name})  
  //   }
    
  setvalidContractAddress("")
  var status=true
//   tokenslist.map((e)=>
//   {
//     e.contract_addresses.map((item)=>
//     {
//       if(address==item.contract_address)
//       {
//         status=false
//         window.location.replace(website_url+e.token_id)
//       }
//    })
//  })
for(const i of tokenslist)
{
  if(i.contract_addresses.length>0  ){
  if(address==i.contract_addresses[0].contract_address) {
    status=false
      window.location.replace(website_url+i.token_id)
      break
  }
  }
}
 if(!status){
   return
 }
  let query = "";

  if(searchBy === "1"){
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
  "X-API-KEY": graphqlApiKEY
  },
  body: JSON.stringify({
    query: query, 
  })
  };
 
 return fetch(url, opts)
  .then(res => res.json())
  .then(result => {  
    if(result.data.ethereum !== null)
    {
      if(result.data.ethereum.address[0].smartContract){
        if(result.data.ethereum.address[0].smartContract.currency){
        if(searchBy === "1"){
          window.location.replace(website_url+'eth/'+address)
          // router.push('/eth/'+address)
        }
        else{
          window.location.replace(website_url+'bsc/'+address)
          // router.push('/bsc/'+address)
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

  const removeTags=(str)=>
  {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
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
      console.log("wallet_details",result)
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
  const dateSince = ((new Date).toISOString())

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
      if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {  
        set_contract_24h_volume(result.data.ethereum.dexTrades[0].tradeAmount) 
      }
    })
    .catch(console.error);
}


useEffect(()=>
{ 
 
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
  const res=await fetch(graphQlURL, opts)
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
  const res=await fetch(graphQlURL, opts)
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
  const res=await fetch(graphQlURL, opts)
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
  const livePriceQuery = await fetch(graphQlURL, opts)
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
  const liveDecimalQuery = await fetch(graphQlURL, opts)
  const liveDecimalRun = await liveDecimalQuery.json()
  if(liveDecimalRun.data.ethereum !== null) 
  { 
    console.log("usd price",usd_price)
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
  fetch(graphQlURL, opts)
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

const getGraphData=(datetime, id, networks)=> 
{   
 
  let query =""
  if(datetime === "") 
  { 
    datetime = graphDate;
  } 
  set_graphDate(datetime)
  
  var from_n_to_date = fromNToDate(datetime)
  let fromDate= from_n_to_date.fromDate
  let toDate= from_n_to_date.toDate 

    if(networks === "1")
    {
      if(id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
      {
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
      else
      {
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
                        '<strong>Price :</strong> '+ ('$ ') + count_live_price(Highcharts.numberFormat(point.y, 10)) + '';  
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

  const LaunchpadDetails = (object)=>
  {
    set_launchpad_row_id(parseInt(object._id))

    set_launchpad_object(object)
  
  }
 

  const addToWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/add_to_watchlist/"+param_token_id, config)
    .then(res=>
    { 
      if(res.data.status)
      {
        set_watchlist(true)
      }
    })
  }

const removeFromWatchlist = (param_token_id) =>
{
  Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config)
  .then(res=>
  {
    if(res.data.status)
    {
      set_watchlist(false)
    }
  })
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
    setModalData({icon: "", title: "", content:""})
    if(param == 1)
    {   
      Axios.get(API_BASE_URL+"markets/listing_tokens/save_voting_details/"+data.token_id, config)
      .then(res=>{ 
      console.log(res)
      if(res.data.status === true) 
      {
        set_votes(votes+1)
        set_voting_status(true)
        setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message})
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
        setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message})
      }
    })
    }
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
      <div className="market_token_details">
          <div className="container">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-6">
                  <div className="token_main_details">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="media">
                          <img src={data.token_image ? image_base_url+data.token_image : image_base_url+"default.png"} className="token_img" alt="logo" width="100%" height="100%" />
                          <div className="media-body">
                            <h4 className="media-heading">{data.token_name ? data.token_name : "-"} 
                              {/* <span><img src="/assets/img/watchlist_token.svg" /></span> */}
                              {
                              watchlist == true ?
                              <span onClick={()=>removeFromWatchlist(data._id)} ><img src="/assets/img/watchlist_token.svg" /></span>
                              :
                              <span onClick={()=>addToWatchlist(data._id)} ><img src="/assets/img/watchlist_normal.svg" /></span>
                              }

                            </h4>
                            <h5><span>{data.symbol ? (data.symbol).toUpperCase() : "-"}</span></h5>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="token_price_block">
                          <h5>
                            {live_price?"$":null} {live_price > 0 ? separator(live_price.toFixed(10)) : "NA"} 
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
                          </h5>
                          <p>{data.token_name ? data.token_name : "-"} Price({data.symbol ? (data.symbol).toUpperCase() : "-"})</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row">
                    <div className="col-md-6">
                      { 
                        data.contract_addresses.length > 0
                        ?
                        <div className="wallets__inner contract_address">
                          <div className="wallets__details">
                            
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
                                          <p><a  href={"https://bscscan.com/token/"+data.contract_addresses[1].contract_address} target="_blank"> <img  className="token_dropdown_img" src="/assets/img/BSC.svg"></img> {(data.contract_addresses[1].contract_address).slice(0,4)+"..."+(data.contract_addresses[1].contract_address).slice(data.contract_addresses[1].contract_address.length - 4 , data.contract_addresses[1].contract_address.length)}
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
                                  <img  className="token_dropdown_img" src="/assets/img/ETH.svg"></img> Ethereum : {(data.contract_addresses[0].contract_address).slice(0,4)+"..."+(data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4 , data.contract_addresses[0].contract_address.length)} 
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
                                  <a href={"https://bscscan.com/token/"+data.contract_addresses[0].contract_address} target="_blank"><img  className="token_dropdown_img" src="/assets/img/BSC.svg"></img> Binance Smart Chain : {(data.contract_addresses[0].contract_address).slice(0,4)+"..."+(data.contract_addresses[0].contract_address).slice(data.contract_addresses[0].contract_address.length - 4 , data.contract_addresses[0].contract_address.length)} 
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
                    <div className="col-md-6">

                    <div className="input-group search_filter">
                    <div className="input-group-prepend markets_index">
                      {/* <select  className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}>*/}
                        <select  className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}> 
                      <option value="0">Type</option>
                        <option value="1">ETH</option>
                        <option value="2">BSC</option>
                      </select>
                    </div>
                    <input value={search_contract_address} onChange={(e)=> set_search_contract_address(e.target.value)} type="text" placeholder="Search token here" className="form-control search-input-box" placeholder="Search by contract address" />
                  <div className="input-group-prepend ">
                    <span className="input-group-text" onClick={()=> getTokenData(searchBy, search_contract_address)}><img src="/assets/img/search-box.png" alt="search-box"  width="100%" height="100%"/></span>                 
                    </div>
                  </div> 
                  <div className="error">  {err_searchBy}</div>
                  {validSearchContract && <div className="error">{validSearchContract}</div>}
                  
                      <ul className="token_share_vote">
                      {
                        user_token ?
                          voting_status === false ?
                          <li onClick={()=>ModalVote()} style={{cursor:"pointer"}}><img src="/assets/img/coin_vote.svg" /> Vote <span>{votes}</span></li>
                          :
                          <li onClick={()=>ModalVote()} style={{cursor:"pointer"}}><img src="/assets/img/coin_vote.svg" /> Voted <span>{votes}</span></li>
                          :
                          <li onClick={()=>ModalVote()} style={{cursor:"pointer"}}>
                            <Link href={app_coinpedia_url+"login?ref="+current_url}><img src="/assets/img/coin_vote.svg" /> Vote <span>{votes}</span></Link>
                          </li>
                      }
                        <li>Token</li>
                        <li onClick={()=>set_share_modal_status(true)} style={{cursor:"pointer"}}><img src="/assets/img/coin_share.svg" /> Share</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

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
                            <div class="col-4 text-right token_share_block token_share_for_left">
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
                                  data.website_link==""?
                                  null
                                  :
                                  <li className="coin_individual_list">
                                  <div className="quick_block_links">
                                    <div className="widgets__select links_direct"><a href={createValidURL(data.website_link)} target="_blank"> <img src="/assets/img/website.svg" className="coin_cat_img" />Website </a></div>
                                  </div>
                                </li>
                                }

                                {
                                  data.explorer.length > 0
                                  ?
                                  <li className="coin_individual_list">
                                    <div className="quick_block_links">
                                      <div className="widgets__select links_direct" ref={explorerRef} onClick={()=> {set_explorer_links(!explorer_links)}}><a><img src="/assets/img/explorer.svg" className="coin_cat_img" />Explorer {data.explorer.length > 0 ? <img src="/assets/img/down-arrow.png" className="dropdown_arrow_img" /> : null} </a></div>
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
                                      <div className="widgets__select links_direct"><a href={createValidURL(data.source_code_link)} target="_blank"><img src="/assets/img/source_code.svg" className="coin_cat_img" /> Source Code </a></div>
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
                                      <div className="widgets__select links_direct"><a href={createValidURL(data.whitepaper)} target="_blank"> <img src="/assets/img/whitepaper.svg" className="coin_cat_img" /> White paper </a></div>
                                    </div>
                                  </li>
                                  :
                                  null 
                                }
                              </ul>
                            </div>
                          </div>
                          <div className="col-md-7">
                            <div className="row">
                              <div className="col-md-4">
                                <div className="token_left_border">
                                  <div className="token_list_values">
                                    <h4>Market Cap</h4>
                                    <h5>{market_cap?"$":null}{market_cap ? separator(market_cap.toFixed(4)) : data.market_cap ? separator(data.market_cap.toFixed(4)) : "NA"}</h5>
                                  </div>
                                  <div className="token_list_values">
                                    <h4>Max Supply</h4>
                                    <h5>{token_max_supply ? separator(token_max_supply) : data.total_max_supply ? separator(data.total_max_supply.toFixed(4)) : "NA"}</h5>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="token_left_border">
                                  <div className="token_list_values">
                                    <h4>Circulating Supply</h4>
                                    <h5>NA</h5>
                                  </div>
                                  <div className="token_list_values">
                                    <h4>Liquidity</h4>
                                    <h5>{liquidity?"$":null}{liquidity ? separator(liquidity.toFixed(4)) : "NA"}</h5>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-4">
                                <div className="token_left_border">
                                  <div className="token_list_values">
                                    <h4>Volume 24H</h4>
                                    <h5>{contract_24h_volume?"$":null}{contract_24h_volume?separator(contract_24h_volume.toFixed(2)): "NA"}</h5>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                        </div>
                    </div>

                    <div className="market_token_tabs">
                      <div className="row">
                        <div className="col-md-6">
                          <h5>{(data.symbol).toUpperCase()} Price Chart</h5>
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
                        
                        <div className="col-md-6">
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
                          </ul>
                        </div>

                      </div>
                    </div>

                    
 
                    {/* <div className="exchange_transactions_tabs">
                      <ul className="nav nav-tabs">
                        <li><a data-toggle="tab" href="#home" className="active">Exchange</a></li>
                        <li><a data-toggle="tab" href="#menu1">Transactions</a></li>
                        <li><a data-toggle="tab" href="#menu2">Wallet Transactions</a></li>
                      </ul>
                    </div> */}

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
                          <div className="chart_tabs"> 
                            {/* <ul className="chart_tabs">
                              <li><button type="button" onClick={()=> getGraphData(1 , data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 D</button></li>
                              <li><button type="button" onClick={()=> getGraphData(2, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 W</button></li>
                              <li><button type="button" onClick={()=> getGraphData(3, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 M</button></li>
                              <li><button type="button" onClick={()=> getGraphData(4, data.contract_addresses[0].contract_address ,data.contract_addresses[0].network_type)}>1 Y</button></li>
                              <li><button onClick={()=> setCustomDate(!customDate)}><img src="/assets/img/table_dropdown_dots.png" className="more_dates" /></button></li> 
                            </ul>  */}

                            
                            
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
                                        <td title= {e.exchange_address}>{e.exchange_name}</td>
                                        <td title={e.pair_one_token_address}>{e.pair_one_name} / {symbol}<br/><span className="pooledvalue">({e.pair_one_value?separator(e.pair_one_value.toFixed(3)):null}) / ({e.pair_two_value?separator(e.pair_two_value.toFixed(3)):null})</span> </td>
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
                                   {/* {
                                        tokentransactionsData.length > 0
                                        ?
                                        tokentransactionsData
                                        :
                                        <tr>
                                          <td colSpan="5"><h5 className="text-center no_data_found">No data found</h5></td>
                                        </tr>
                                      }  */}
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

                

                    <div className="coin_ico_list">
                      <h4>List of ongoing, upcoming and completed launchpads</h4>
                      <p>This feature is in beta testing. Place your estimates for next 6 months and see what other’s are thinking about it. Data displayed are based on user CoinMarketCap. The cut-off for estimates for each month-end is on the 21st of each month.</p>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="token_launchpad_list">

                            {
                              data.launch_pads_data.length > 0 ?
                              data.launch_pads_data.map((e, i)=> 
                              // <div className="col-md-12 launchpad_list_content  active_launchpad">
                              <div className={"col-md-12 launchpad_list_content "+(launchpad_row_id == e._id ? " active_launchpad":"")}>
                                <div className="row">
                                  <div className="col-md-4 col-4">
                                    <h5>{ e.launch_pad_type == 1 ? "ICO": e.launch_pad_type==2 ? "IDO" : e.launch_pad_type==3 ? "IEO" : null }
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
                                    <h5><img src="/assets/img/launchpad_calender.svg" />&nbsp;
                                      {moment.utc(e.start_date).format("MMM DD")} - {moment.utc(e.end_date).format("MMM DD, YYYY")}
                                    </h5>
                                  </div>
                                  <div className="col-md-2 col-3">
                                    {
                                      launchpad_row_id == e._id ? 
                                      <img src="/assets/img/launchpad-active.svg" className="active_launchpad_list_icon" />
                                      :
                                      <img src="/assets/img/launchpad.svg" className="launchpad_list_icon" onClick={()=>LaunchpadDetails(e)}/>
                                    }
                                  </div>
                                </div>
                              </div> 
                              )
                              :
                              null
                            }
                            

                          </div>
                        </div>
                        <div className="col-md-6 ">
                          <div className="token_launchpad_details">
                            {
                              launchpad_object ? 
                              <>
                              <h5>{data.token_name ? data.token_name : "-"} {data.symbol ? "("+(data.symbol).toUpperCase()+")" : "-"}
                              { launchpad_object.launch_pad_type == 1 ? " ICO": launchpad_object.launch_pad_type==2 ? " IDO" : launchpad_object.launch_pad_type==3 ? " IEO" : null } 
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
                                </span></h5>
                              <p>Your vote is for 24Hrs. Inorder to update how you feel about bitcoin, come back tomorrow</p>

                              <ul>
                                <li>ICO Price <span>{launchpad_object.price} USD</span></li>
                                <li>Softcap <span>{launchpad_object.soft_cap}</span></li>
                                <li>Tokens Sold <span>{launchpad_object.tokens_sold} {data.symbol ? (data.symbol).toUpperCase() : "-"}</span></li>
                                <li>Access <span>{launchpad_object.access_type == 1 ? "Public" : "Private"}</span></li>
                                <li>Where to buy <span>{launchpad_object.where_to_buy_link}</span></li>
                                <li>% of Total Supply <span> 34% (547554 {data.symbol ? (data.symbol).toUpperCase() : "-"})</span></li>
                                <li>Accept <span>{launchpad_object.accept_payment_type}</span></li>
                              </ul>

                              <h5>How to participate</h5>
                              <div dangerouslySetInnerHTML={{ __html: launchpad_object.how_to_participate }}/>
                              </>
                              :
                              null
                            }
                            
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="about_token_details">
                    {
                      data.token_description ?
                      <h4>About {data.token_name ? data.token_name : "-"}</h4>
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
                          <p className="about_token_view_more">
                          <a onClick={() =>set_desc_read_more(false)}><span>Read Less</span></a>
                          </p>
                        </>
                        :
                        <>
                        <div className="promotion__text" style={{wordBreak: "break-all"}} dangerouslySetInnerHTML={{ __html: strLenTrim(data.token_description, 900)}}></div>
                        <p className="about_token_view_more">
                        <a onClick={() =>set_desc_read_more(true)} className="about_token_view_more"><span>View More &gt;&gt; </span></a>
                        </p>
                        </>
                      }
                        
                      </>
                      :
                      <div dangerouslySetInnerHTML={{ __html:data.token_description}}></div> 
                    }
                      
                    </div>

                    {/* {
                    data.launch_pads_data.length > 0
                    ?
                    <div className="promotion launchpads">
                      <div className="">
                        <div className="panel-group ico_plans" id="accordion" role="tablist" aria-multiselectable="true"> 
                          { 
                            data.launch_pads_data.map((e, i)=>
                              <div className="panel panel-default" key={i}>
                                  <div className="panel-heading active" role="tab" id="headingOne">
                                    <div className="row">
                                      <div className="col-lg-4 col-5 col-sm-4 col-md-4">
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
                                      <div className="col-lg-8 col-7 col-sm-8 col-md-8">
                                        <a role="button" data-toggle="collapse" data-parent="#accordion"  href={"#upComing"+i} aria-expanded="true" aria-controls="collapseOne">
                                          <span className="start-end-date"><img src="/assets/img/calander.png" className="ico_calender" />
                                          {e.start_date !== "0000-00-00" ? moment.utc(e.start_date).format("MMM D, YYYY") : "-"} - {e.start_date !== "0000-00-00" ? moment.utc(e.end_date).format("MMM D, YYYY") : "-"}
                                          
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
                                            <p>Tokens Sold <b>{e.tokens_sold ? e.tokens_sold : "--"}</b></p>
                                          </div>
                                          <div className="col-md-6">
                                            <p>Where to buy<a href={e.where_to_buy_link} target="_blank"><b>{e.where_to_buy_title ? e.where_to_buy_title : "-"} </b></a></p>
                                            <p>% of Total Supply <b>{e.percentage_total_supply ? e.percentage_total_supply+"%" : "--"}</b></p>
                                           
                                            { 
                                                e.accept_payment_type.length > 0 ?
                                                <>
                                                 <p>Accept <b> 
                                                  {
                                                   paymentTypes.map((inner)=>
                                                   <>{e.accept_payment_type.includes(inner._id) ?
                                                    <>{inner.payment_name } <span>/</span></>
                                                    
                                                  :
                                                  null
                                                   }</> 
                                                 )
                                                 }
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
                                       
                                        </p>
                                       
                                        <p className="participate_para_two">
                                        {e.how_to_participate} 
                                        </p>
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
                    }  */}

                  </div>
                   
                </div>
              </div>  
            </div>
          </div>
        </div>
        
      <div className={"modal "+(share_modal_status ? " modal_show":" ")} id="market_share_page">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Share</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={()=>set_share_modal_status(false)}>×</button>
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

      {modal_data.title ? <Popupmodal name={modal_data} /> : null} 
    </>
  )
}


export async function getServerSideProps({ query, req}) 
{ 
  const token_id = query.token_id
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
 
  const tokenQuery = await fetch(API_BASE_URL+"markets/tokens/individual_details/"+token_id, config(userAgent.user_token))
  const tokenQueryRun = await tokenQuery.json() 
  if(tokenQueryRun.status)
  {
    return { props: {data:tokenQueryRun.message, paymentTypes:tokenQueryRun.payment_types, errorCode:false, token_id:token_id, userAgent:userAgent, config:config(userAgent.user_token)}}
  }
  else
  {
    return  { props: { errorCode:true } }
  }

}
