
import React, { useState, useEffect,useCallback, useRef } from 'react';  
import Axios from 'axios'
import Link from 'next/link' 
import Web3 from 'web3' 
import { ethers } from 'ethers';
import { useRouter } from 'next/router' 
import Head from 'next/head'
import JsCookie from "js-cookie" 
import cookie from 'cookie'
import "react-datetime/css/react-datetime.css"
import {API_BASE_URL, x_api_key, app_coinpedia_url, website_url,config,graphqlApiKEY,separator} from '../../components/constants'; 
import Popupmodal from '../../components/popupmodal'
  
 
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Editor } from '@tinymce/tinymce-react';
 
export default function Create_token({config}) 
{ 
  const editorRef = useRef(null)
  const router = useRouter()
  const [wallet_address, setWalletAddress] = useState('')
  const [contract_address, setContractAddress] = useState([{network_type: "0", contract_address: ""}])
  const [live_price, setLivePrice] = useState("")
  const [market_cap, set_market_cap] = useState("") 
  const [err_contract_address, setErrContractAddress] = useState("")
   
  const [symbol, setSymbol] = useState('')  
  const [token_name, setTokenName] = useState('')
  const [website_link, setWebsiteLink] = useState('')
  const [whitepaper, setWhitepaper] = useState('')
  const [token_max_supply, setTokenMaxSupply] = useState('')
  const [circulating_supply, setCirculatingSupply] = useState('') 
  const [token_description, setTokenDescription] = useState('')
  const [token_image, setTokenImage] = useState('')
  const [source_code_link, seSourceCodeLink] = useState('')
  const [tokenid , setToken_id] = useState("")

  const [err_symbol, setErrSymbol] = useState('') 
  const [err_token_name, setErrTokenName] = useState('')
  const [err_website_link, setErrWebsiteLink] = useState('')
  const [err_whitepaper, setErrWhitepaper] = useState('')
  const [err_token_max_supply, setErrTokenMaxSupply] = useState('')
  const [err_market_cap, setErr_market_cap] = useState('') 
  const [err_token_description, setErrTokenDescription] = useState('')
  const [err_token_image, setErrTokenImage] = useState('')

  const [err_wallet_network, setErrWalletNetwork] = useState(false)
  const [err_wallet_connection, setErrWalletConnection] = useState(false)
  const [alert_message, setAlertMessage] = useState([])

  const [explorer, setExplorersList] = useState([""])
  const [exchange_link, setExchangesList] = useState([""])
  const [community_address, setCommunitysList] = useState([""])   

   const [imgmodal, setImgmodal] = useState(false) 
   const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
   const [showNav, setShowNav] = useState(false) 
   const [upImg, setUpImg] = useState();
   const imgRef = useRef(null);
   const previewCanvasRef = useRef(null);
   const [crop, setCrop] = useState({ unit: 'px', width: 50, height: 50, aspect: 1 / 1});
   const [completedCrop, setCompletedCrop] = useState(null)
   const [blobFile, set_blobFile] = useState()
  
  const oncCropComplete=()=>
  {  
    document.getElementById("imageUploadForm").reset()
    setTokenImage(blobFile)
    // convertBlobtoBase64(blobFile)
    setImgmodal(false)
  }
  

  const imageCropModalClose = () => 
  {
    document.getElementById("imageUploadForm").reset()
    setImgmodal(false)
  }

  const onCropComplete = (crops) => 
  {  
      setCompletedCrop(crops)
  
      const image = imgRef.current;
      const canvas = document.createElement('canvas')
      const crop = crops;
  
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio;
  
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
  
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';
  
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      
      return new Promise((resolve, reject) => 
      {
        canvas.toBlob(blob => {
          if (!blob) { 
            return;
          }
          blob.name = 'newFile.jpeg';
          window.URL.revokeObjectURL(fileUrl);
          const fileUrl = window.URL.createObjectURL(blob);
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function() 
          {
               console.log(reader.result)
              set_blobFile(reader.result)
          }
          resolve(fileUrl);
        }, 'image/jpeg');
      });

  };  
  
  
const onSelectFile = (e) => 
{ 
  if(e.target.files && e.target.files.length > 0)
  {
    const reader = new FileReader();
    reader.addEventListener('load', () => setUpImg(reader.result));
    reader.readAsDataURL(e.target.files[0]);
    setImgmodal(true)
  }
}



const onLoad = useCallback((img) => {
  imgRef.current = img;
}, []);
  
const clearform = () =>
{   
  setContractAddress([{network_type: "0", contract_address: ""}])
  setSymbol("")
  setTokenName("")
  setWebsiteLink("")
  setWhitepaper("")
  setTokenMaxSupply("")
  set_market_cap("")
  setTokenDescription("")
  setTokenImage("")
  seSourceCodeLink("")
  setExplorersList("")
  setExchangesList("")
  setCommunitysList("")

}

const createNewToken = () =>
{   
    let formValid = true
    if(contract_address.length === 2){ 
      let list = err_contract_address
      list = ""
      setErrContractAddress(list)
    }
    else{
      let list = err_contract_address
      list = ""
      setErrContractAddress(list)    
    } 
  
    setModalData({icon: "", title: "", content:""})
    setErrSymbol('') 
    setErrTokenName('')
    setErrWebsiteLink('')
    setErrWhitepaper('')
    setErrTokenMaxSupply('')
    setErr_market_cap('') 
    setErrTokenDescription('')
    setErrTokenImage('')  

    if(symbol === '')
    {
      setErrSymbol('The Symbol field is required.')
      formValid = false
    }
    else if(symbol.length < 2)
    {
      setErrSymbol('The Symbol must be atleast 2 characters.')
      formValid = false
    } 
    else if(symbol.length > 25)
    {
      setErrSymbol('The Symbol must be less than 25 characters in length.')
      formValid = false
    }   

    if(contract_address.length === 2)
    {   
      let list = err_contract_address

      if(contract_address[0].network_type === "0" || contract_address[0].network_type === 0)
      {  
        list = "The Contract address network type field is required."
        formValid = false
      }     
      else if(contract_address[0].contract_address === ""){   
        list = "The Contract address field is required."
        formValid = false
      }
      else if((contract_address[0].contract_address).length !== 42){  
        list = "The Contract address field must be equal to 42 characters."
        formValid = false
      }
      else if(contract_address[1].network_type === "0" || contract_address[1].network_type === 0){  
        list = "The Contract address network type field is required." 
        formValid = false  
      }  
      else if(contract_address[1].contract_address === ""){ 
        list = "The Contract address field is required."
        formValid = false   
      }
      else if((contract_address[1].contract_address).length !== 42){
        list = "The Contract address field must be equal to 42 characters."
        formValid = false
      }  
      // else if(contract_address[0].contract_address === contract_address[1].contract_address){
      //   list = "Both Contract addresses must not be same."
      //   formValid = false
      // }  
      else if(contract_address[0].network_type === contract_address[1].network_type){
        list = "Both Contract addresses network type must not be same."
        formValid = false
      }   
      else{
        list = ""
      }
      setErrContractAddress(list)
    } 
    else if(contract_address.length === 1){
      
      let list = err_contract_address 

        if(contract_address[0].network_type === "0" && contract_address[0].contract_address === ""){  
          list = "The Contract address and network type field is required."
          formValid = false
        }  
        else if(contract_address[0].network_type === "0"){  
          list = "The  network type field is required."
          formValid = false
        }  
        else if(contract_address[0].contract_address === ""){   
          list = "The Contract address field is required."
          formValid = false
        }
        else if((contract_address[0].contract_address).length !== 42){  
          list = "The Contract address field must be equal to 42 characters."
          formValid = false
        }
        else{ 
          list = ""   
        } 
        setErrContractAddress(list)  
    }  

    if(token_name === '')
    {
        setErrTokenName('The token name field is required.')
        formValid = false
    } 
    else if(token_name.length < 2)
    {
        setErrTokenName('The token name must be atleast 2 characters.')
        formValid = false
    }
    else if(token_name.length > 50)
    {
        setErrTokenName('The token name must be less than 25 characters in length.')
        formValid = false
    }
    

    // if(whitepaper === '')
    // {
    //     setErrWhitepaper('The whitepaper field is required.')
    //     formValid = false
    // }
    // else if(whitepaper.length < 2)
    // {
    //     setErrWhitepaper('The whitepaper must be at least 2 characters.')
    //     formValid = false
    // }
    // else if(whitepaper.length > 100)
    // {
    //     setErrWhitepaper('The whitepaper must be less than 100 characters in length.')
    //     formValid = false
    // }

   let communities_address = []

    if(community_address.length > 0){ 
      community_address.map((e, i)=>{
        if(e !== ""){ 
          communities_address.push(e) 
        }
      })
      setCommunitysList(communities_address) 
    } 

    let explorers = []
    
    if(explorer.length > 0){
      explorer.map((e, i)=>{
        if(e !== ""){
          explorers.push(e) 
        }
      })
      setExplorersList(explorers)
    }  

    let exchanges_link = []
 
    if(exchange_link.length > 0){
      exchange_link.map((e, i)=>{
        if(e !== ""){
          exchanges_link.push(e) 
        }
      })
      setExchangesList(exchanges_link)
    }  

   if(token_description === '')
    {
      setErrTokenDescription('The Coin Description field is required.')
      formValid = false
    }
    else if(token_description.length <= 10)
    {
        setErrTokenDescription('The Coin Description must be atleast 200 characters.')
        formValid = false
    }
    else if(token_description.length > 5000)
    {
        setErrTokenDescription('The Coin Description must be less than 5000 characters in length.')
        formValid = false
    } 
 
    if(!formValid)
    {
      return false
    }
    
    const reqObj = {
      wallet_address: wallet_address, 
      symbol: symbol, 
      token_name: token_name,
      token_image: token_image,
      website_link: website_link,
      whitepaper: whitepaper,
      total_max_supply: token_max_supply,
      price: live_price,
      market_cap: market_cap, 
      token_description: token_description,
      source_code_link: source_code_link,
      explorer:explorer,
      exchange_link:exchange_link,
      community_address:community_address,
      contract_addresses: contract_address
    }  

    console.log(reqObj)
    Axios.post(API_BASE_URL+"markets/listing_tokens/create_new", reqObj, config)
    .then(response=>{ 
      console.log(response)
      if(response.data.status)
      { 
       
        setShowNav(true) 
        setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: response.data.message.alert_message})
        clearform()
        setToken_id(response.data.token_id)
      } 
      else
      {  
        // console.log("error")
        if(response.data.message.contract_address)
        {
         // setErrContractAddress(response.data.message.contract_address)
          setErrContractAddress("This contract address is already in use.")
        }  
        
        if(response.data.message.symbol){
          setErrSymbol(response.data.message.symbol)
        } 

        // if(response.data.message.token_description){  
        //   setErrTokenDescription(response.data.message.token_description)
        // }
        
        if(response.data.message.token_max_supply){  
          setErrTokenMaxSupply(response.data.message.token_max_supply)
        }
        
        if(response.data.message.market_cap){  
          setErr_market_cap(response.data.message.market_cap)
        }
        
        if(response.data.message.token_image){  
          setErrTokenImage(response.data.message.token_image)
        } 
        
        if(response.data.message.token_name)
        {
          setErrTokenName(response.data.message.token_name)
        }  
 
      }
    })

  } 
 
  const getTokenUsdPrice=async(id, networks)=> {  
   
    let query = ""  
    
    const dateSince = ((new Date()).toISOString())
  
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
    await fetch(url, opts)
      .then(res => res.json())
      .then(result => {  
        console.log(result)
        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) 
        { 
         
          if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" || id=== "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
          {
           setLivePrice(result.data.ethereum.dexTrades[0].quote)
          }
          else
          {
            console.log(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote)
             setLivePrice(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote) 
          }
          
        }  
      })
      .catch(console.error);
  }
  const getTotalMaxSupply=(id,decimal,networktype)=>{
    if(networktype==1){
     // https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&apikey=YourApiKeyToken
      Axios.get("https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=E9DBMPJU7N6FK7ZZDK86YR2EZ4K4YTHZJ1")
      .then(response=>{
            if(response.status){ 
              console.log(response) 
              setTokenMaxSupply(response.data.result/10**decimal) 
            }
      })
    }
    else{
      Axios.get("https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=GV79YU5Y66VI43RM7GCBUE52P5UMA3HAA2")
        .then(response=>{
              if(response.status){ 
                console.log(response) 
                setTokenMaxSupply(response.data.result/10**decimal) 
              }
        })
    }
   }
   const getMarketCap =async(id, decval, network_type)=> {  
   
    console.log("gfbkj")
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
      getTokenUsdPrice(id,network_type)
      set_market_cap(supply * live_price)  
      await console.log(supply * live_price)
  }


  const closeNRedirect = () =>
  {
    setAlertMessage('')
    router.push('/token/')
  }
  
  // const getAccount = () =>
  // {
  //     let web3 = new Web3(Web3.givenProvider)
  //     if(window.web3)
  //     { 
  //       web3.eth.net.getNetworkType().then(function(networkName) { 
  //       if(networkName === 'private')
  //       {
  //           web3.eth.getAccounts().then(function(accounts)
  //           { 
  //             if(typeof accounts[0] != 'undefined')
  //             {
  //                 setWalletAddress(accounts[0])
  //                 return true
  //               } 
  //             })
  //         }
  //       })
  //     }
  // }

    
  // const getETHAccount = () =>
  // {
  //     let web3 = new Web3(Web3.givenProvider)
  //     if(window.web3)
  //     { 
  //       web3.eth.net.getNetworkType().then(function(networkName) { 
  //       if(networkName === 'main')
  //       {
  //           web3.eth.getAccounts().then(function(accounts)
  //           { 
  //             if(typeof accounts[0] != 'undefined')
  //             {
  //                 setWalletAddress(accounts[0])
  //                 return true
  //               } 
  //             })
  //         }
  //       })
  //     }
  // }
 
  const addMoreExchange = () =>
  {  
    setExchangesList(prev => [...prev, ""]) 
  }

  const clickOnDelete = (index) =>
  {
    setExchangesList(exchange_link.filter((s, sindex) => index !== sindex))
  } 

  const AddMoreContractAddress = ()=>{  
    setContractAddress(prev => [...prev, {network_type: 0, contract_address: ""}]) 
  }

  const removeContractAddress=(index)=>{ 
    setContractAddress(contract_address.filter((s, sindex) => index !== sindex)) 
  }
  
  const handleExchangeChange = (e, index) => {
    const {value } = e.target
    const list = [...exchange_link]
    list[index] = value
    setExchangesList(list)
  } 

  const addMoreExplorers = () =>
  {  
    setExplorersList(prev => [...prev, ""]) 
  }

  const clickOnExplorerDelete = (index) =>
  {
    setExplorersList(explorer.filter((s, sindex) => index !== sindex))
  }
   
  const handleExplorersChange = (e, index) => 
  {
    const { value } = e.target
    const list = [...explorer] 
    list[index] = value
    setExplorersList(list)
  }
 
  const addMoreCommunity = () =>
  {  
    setCommunitysList(prev => [...prev, ""]) 
  }

  const clickOnCommunityDelete = (index) =>
  {
    setCommunitysList(community_address.filter((s, sindex) => index !== sindex))
  }
  
  
  const handleCommunityChange = (e, index) => 
  {
    const { value } = e.target
    const list = [...community_address] 
    list[index] = value 
    setCommunitysList(list) 
  } 
   
  useEffect(()=>
  { 
    // if(localStorage.getItem("walletconnectedtype") === "1"){
    //   getAccount()
    //   getETHAccount() 
    // }
  },[]) 
     
  const makeJobSchema=()=> 
  {  
    return { 
        "@context":"http://schema.org/",
        "@type":"Organization",
        "name":"Coinpedia",
        "url":"https://markets.coinpedia.org",
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
  } 
  const checkContractAddress=(data, index)=>{ 
          const { name, value } = data.target
          const list = [...contract_address]
          list[index][name] = value.toLowerCase()  
          setContractAddress(list)
  }  

  const getTokenData =(data,type, index, address)=>{  
    checkContractAddress(data, index)
    getTokenDetails(type, address)
    
  }
  
  const getTokenDetails = (type, address) =>{  

      let network_type = ""

      if(type === "1"){ 
        network_type = "ethereum"
      }
      else if(type === "2"){ 
        network_type = "bsc"
      }
      else{
        return null
      }
   
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
            if(result.data.ethereum.address[0].smartContract){
            if (result.data.ethereum.address[0].smartContract.currency) { 
              setErrContractAddress("")
              getTokenUsdPrice(address,type) 
              setSymbol(result.data.ethereum.address[0].smartContract.currency.symbol) 
              setTokenName(result.data.ethereum.address[0].smartContract.currency.name) 
              getTotalMaxSupply(address,result.data.ethereum.address[0].smartContract.currency.decimals,type)
              
              getMarketCap(address,result.data.ethereum.address[0].smartContract.currency.decimals,type)
            } 
            else { 
              setErrContractAddress("Invalid contract address or network type.")
              setSymbol('') 
              setTokenName('')
            } 
          }
          else{
            setErrContractAddress("Invalid contract address or network type.")
            setTokenName('')
          }
        })
        .catch(console.error);
   
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
        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="canonical" href={website_url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
      <div className="page">
        <div className="create_airdrop create_launchpad">
          <div className="container">
            <div className="for_padding">
              <div> 
                <div className="token_form">
                  <div className=" token_steps">
                  <div className="row">
                    <div className="col-lg-9 col-md-9 col-8">
                    <h1>Create Token</h1>
                    <p className="token_form_sub_text">Enter all these fields to create token</p>
                    </div>
                    <div className="col-lg-3 col-md-3 col-4">
                    <div className="quick_block_links main_page_coin_filter create_token_btn">
                      <Link href="/token"><a><i className="la la-arrow-left"></i>Go Back</a></Link>
                      {/* <div class="text-right" onClick={() => router.back()}><a class="btn btn-primary"><i className="la la-arrow-left"></i>Go Back</a></div> */}
                    </div>
                    </div>
                  </div>
                  </div>
                  
{/* 
community_address
explorer
exchange_link 
*/}

                  <div className="row">
                    <div className="col-md-3">
                      <div className="token_steps_list">
                        <ul>
                          <li>Token Basic <img src={"/assets/img/"+(token_name ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/> </li>
                          <li>Token Supply <img src={"/assets/img/"+(token_max_supply ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>Exchange <img src={"/assets/img/"+(exchange_link[0] ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>Explorer <img src={"/assets/img/"+(explorer[0] ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>Community <img src={"/assets/img/"+(community_address[0] ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>About Token <img src={"/assets/img/"+(token_description ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-9">
                      <div className="row">
                      { 
                        contract_address.length > 0
                        ?
                        contract_address.map((e, i)=>
                        <div className="col-md-8" key={i}>
                          <div className="form-custom">
                            <div className="row">
                              <div className="col-md-4">
                                <label htmlFor="email">Contract address<span className="label_star">*</span></label>
                              </div>
                              <div className="col-md-8">
                                <div className="input_block_outline" style={{marginBottom: '0'}}>
                                  <div className="input-group">
                                    <div className="input-group-prepend">
                                      <select name="network_type" placeholder="Eg.,0x0000" value={e.network_type}  onChange={(item)=> getTokenData(item, item.target.value, i, e.contract_address)} >
                                            <option value="0">Type</option> 
                                            <option value="1">ETH</option>
                                            <option value="2">BSC</option>
                                      </select>
                                    </div>
                                    
                                    {
                                      i === 0 && e.network_type !== "0"
                                      ?
                                      <input type="text" className="form-control" placeholder="Enter Address" value={e.contract_address} name="contract_address" onChange={(item)=> getTokenData(item, e.network_type , i, (item.target.value).toLowerCase())}   />
                                      :
                                      <input type="text" className="form-control" placeholder="Enter Address" value={e.contract_address} name="contract_address" onChange={(item)=>checkContractAddress(item, i)} />
                                    }
                                    </div>
            
                                    {
                                      i== 1 ?
                                      <>
                                        <button className="addmore_ico create-token-res" style={{float: "right", marginBottom: "10px"}} onClick={()=> removeContractAddress(i)}><span>- Remove Contract address</span></button>
                                      </>
                                    :
                                    null
                                  } 
                                </div>  
                                <>
                                  {
                                    contract_address.length !== 2 ?
                                    <>
                                      <button className="addmore_ico create-token-res" onClick={()=>AddMoreContractAddress()}><span><img src="/assets/img/add-more.png" /> Add More Contract addresses</span></button>
                                    </>
                                    :
                                    null
                                  }
                                </>
                                <div className="error">{err_contract_address}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        )
                        :
                        null
                        }
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Token Name<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-8">
                            <div className="form-custom"> 
                            
                            <div className="form-group input_block_outline">
                              <input type="text" className="form-control" placeholder="Token Name" value={token_name} readOnly />
                            </div>
                            <div className="error">{err_token_name}</div>
                          </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Symbol<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom"> 
                                <div className="form-group input_block_outline">
                                  <input type="text" className="form-control" placeholder="Symbol" value={symbol}  readOnly/>
                                </div>
                                <div className="error">{err_symbol}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Source code Link</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="text" className="form-control" placeholder="Source code Link" value={source_code_link} onChange={(e)=>seSourceCodeLink(e.target.value)}/>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                  

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Website Link</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="text" className="form-control" placeholder="Website Link" value={website_link} onChange={(e)=>setWebsiteLink(e.target.value)}/>
                                  <div className="error">{err_website_link}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Token Max Supply</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <div className="input-group">
                                    <input type="number" className="form-control" aria-label="Username" aria-describedby="basic-addon1"  value={token_max_supply} onChange={(e)=>setTokenMaxSupply(e.target.value)} readOnly/>
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">{symbol}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                            <label htmlFor="email">Market Cap</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="number" className="form-control" value={market_cap} onChange={(e)=>set_market_cap(e.target.value)} readOnly/> 
                                </div>
                                <div className="error">{err_market_cap}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Whitepaper</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="text" className="form-control" placeholder="Whitepaper" value={whitepaper} onChange={(e)=>setWhitepaper(e.target.value)}/>
                                </div>
                                <div className="error">{err_whitepaper}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Logo</label>
                            </div>
                            <div className="col-md-5">
                              <form id="imageUploadForm" >
                                <div className="choose_file_input">
                                  <div className="form-group">
                                    <label> 
                                        <input className="choose_logo" type="file" accept="image/*" onChange={onSelectFile} />
                                        <span >Choose Logo </span> 
                                      </label> 
                                  </div>
                                  <div className="error">{err_token_image}</div>
                                </div>
                              </form>
                            </div>
                            <div className="col-md-3">
                              {
                                token_image !== '' ?
                                <img src={token_image} alt="token image" id="tokenlogo" width="50" height="50" className="mt-2"/> 
                                :
                                null
                              }
                            </div>
                          </div>
                        </div>
                      </div>
            
                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">About coin/Token <span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-8" style={{marginBottom: '25px'}}>
                              <div className="form-group input_block_outline" style={{marginBottom: '0'}}>
                                <Editor apiKey="s6mr8bfc8y6a2ok76intx4ifoxt3ald11z2o8f23c98lpxnk" 
                                onEditorChange={(e)=>setTokenDescription(e)}
                                value={token_description} 
                                    onInit={(evt, editor) => {editorRef.current = editor}}
                                    initialValue=""
                                    init={{
                                      height: 300,
                                      menubar: false,
                                      plugins: [
                                        'advlist autolink lists link image charmap print preview anchor',
                                        'searchreplace visualblocks code fullscreen',
                                        'insertdatetime media table paste code help wordcount'
                                      ],
                                      toolbar: 'undo redo | formatselect | ' +
                                      'bold italic backcolor | alignleft aligncenter ' +
                                      'alignright alignjustify | bullist numlist outdent indent | ' +
                                      'removeformat | help'
                                    
                                    }}
                                  />
                              </div>
                              <div className="error">{err_token_description}</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Exchange URL</label>
                            </div>
                            <div className="col-md-8">
                            {
                              exchange_link.length > 0 ?
                              exchange_link.map((item, i) => 
                              i == 0 ?
                                <div key={i}>
                                  <div className="form-custom create_token_no_space">
                                    <div className="form-group input_block_outline">
                                      <input autoComplete="off" type="text" className="form-control" placeholder="Exchange URL" name="link" value={item} onChange={e => handleExchangeChange(e, i)} />
                                    </div>
                                    <button className="addmore_ico create-token-res" onClick={addMoreExchange}><span><img src="/assets/img/add-more.png" /> Add More Exchange</span></button>
                                  </div>
                                </div>
                            
                                  : 
                                  
                                    <div >
                                      <div className="form-custom create_token_top_space">
                                        <div className="form-group input_block_outline">
                                          <input autoComplete="off" type="text" className="form-control" placeholder="Exchange URL" name="link" value={item} onChange={e => handleExchangeChange(e, i)} />
                                        </div>
                                        <p className="remove_block"><span onClick={() =>{clickOnDelete(i)}}>Remove</span></p>
                                      </div>
                                    </div> 
                                  
                                )
                                :
                                  <div>
                                  <div className="form-custom create_token_no_space">
                                    <div className="form-group input_block_outline">
                                      <input autoComplete="off" type="text" className="form-control" name="link" placeholder="Exchange URL" value={exchange_link} onChange={e => handleExchangeChange(e, 0)} />
                                    </div>
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Explorer URL</label>
                            </div>
                            <div className="col-md-8">
                            {
                              explorer.length > 0 ?
                              explorer.map((item, i) => 
                              i == 0 ?
                                <div  key={i}>
                                    <div >
                                      <div className="form-custom create_token_no_space">
                                        <div className="form-group input_block_outline">
                                          <input autoComplete="off" className="form-control" type="text" placeholder="Explorer URL" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                        </div>
                                      
                                        <button className="addmore_ico create-token-res" onClick={addMoreExplorers}><span><img src="/assets/img/add-more.png" /> Add More Explorer</span></button>
                                      </div>
                                    </div>
                                </div>
                                : 
                                  <div >
                                    <div className="form-custom create_token_top_space">
                                      <div className="form-group input_block_outline">
                                        <input autoComplete="off" type="text" className="form-control" placeholder="Explorer URL" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                      </div>
                                      <p className="remove_block"><span onClick={() =>{clickOnExplorerDelete(i)}}>Remove</span></p>
                                    </div>
                                  </div>
                                  
                              )
                              :
                              <div >
                                      <div className="form-custom create_token_no_space">
                                        <div className="form-group input_block_outline">
                                          <input autoComplete="off" type="text" className="form-control" placeholder="Explorer URL" name="link" value={explorer} onChange={e => handleExplorersChange(e, 0)} />
                                        </div>
                                      </div>
                                    </div>
                            }
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Community URL</label>
                            </div>
                            <div className="col-md-8">
                            {
                              community_address.length > 0 ?
                              community_address.map((item, i) => 
                              i == 0 ?
                              <div key={i}>
                                  <div >
                                    <div className="form-custom create_token_no_space">
                                      <div className="form-group input_block_outline">
                                        <input autoComplete="off" type="text" className="form-control" placeholder="Community URL" name="link" value={item} onChange={e => handleCommunityChange(e, i)} />
                                      </div>
                                      <button className="addmore_ico create-token-res" onClick={addMoreCommunity}><span><img src="/assets/img/add-more.png" /> Add More Community</span></button>
                                    </div>
                                  </div>
                              </div>
                                : 
                                <div key={i}>
                                  <div>
                                    <div className="form-custom create_token_top_space">
                                      <div className="form-group input_block_outline">
                                        <input autoComplete="off" type="text" className="form-control" placeholder="Community URL" name="link" value={item} onChange={e => handleCommunityChange(e, i)} />
                                      </div>
                                      <p className="remove_block"><span onClick={() =>{clickOnCommunityDelete(i)}}>Remove</span></p>
                                    </div>
                                  </div> 
                                </div>
                              )
                              :
                              <div>
                                <div className="form-custom create_token_no_space">
                                  <div className="form-group input_block_outline">
                                    <input autoComplete="off" type="text" className="form-control" placeholder="Community URL" name="link" value={community_address} onChange={e => handleCommunityChange(e, 0)} />
                                  </div>
                                </div>
                              </div>
                            }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-8">
                          <div className="row">
                            <div className="col-md-4"></div>
                            <div className="col-md-8">
                              <div className="text-left review_upload_token mt-3">
                                <button className="dsaf" onClick={() =>{createNewToken()}}>Review and Upload</button> 
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
          </div>
        </div>
      
       

        <div className={"modal connect_wallet_error_block"+ (imgmodal ? " collapse show" : "")}> 
          <div className="modal-dialog" style={{marginTop:"50px"}}>
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal"  onClick={()=>imageCropModalClose()}>&times;</button>
                <h6 className="mb-3">Select Token Logo</h6>
                <ReactCrop
                  src={upImg}
                  onImageLoaded={onLoad}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => onCropComplete(c)}
                /> 
                <div className="text-center review_upload_token mt-2">
                  <button  className="dsaf" onClick={() =>{oncCropComplete()}}>Set Token Logo</button> 
                </div>
              </div>
            </div> 
          </div>
        </div> 


        {modal_data.title ? <Popupmodal name={modal_data} /> : null}

    </>
  )
}
export async function getServerSideProps({req}) 
{
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    if(userAgent.user_token)
    {
      if(userAgent.user_email_status==1)
      {
        return { props: { userAgent: userAgent, config: config(userAgent.user_token)}} 
      }
      else
      {
        return {
            redirect: {
            destination: app_coinpedia_url+'verify-email',
            permanent: false,
            }
        }
      }
    }
    else
    {
        return {
            redirect: {
            destination: app_coinpedia_url+'login',
            permanent: false,
            }
        }
    }
}

