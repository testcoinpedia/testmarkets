
import React, { useState, useEffect,useCallback, useRef } from 'react';  
import Axios from 'axios'
import Link from 'next/link' 
import Web3 from 'web3' 
// import { ethers } from 'ethers'
import { useRouter } from 'next/router' 
import Head from 'next/head'
import JsCookie from "js-cookie" 
import cookie from 'cookie'
import dynamic from 'next/dynamic'
// import "react-datetime/css/react-datetime.css"
import {API_BASE_URL, x_api_key, app_coinpedia_url, coinpedia_url,IMAGE_BASE_URL,  market_coinpedia_url,config,graphqlApiKEY,separator} from '../../components/constants'; 
import Select from 'react-select'
import Popupmodal from '../../components/popupmodal'
import Top_header from '../../components/manage_token/top_header' 
 
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { Editor } from '@tinymce/tinymce-react';
 
export default function Create_token({config}) 
{ 
    const Multiselect = dynamic( () => import('multiselect-react-dropdown').then(module => module.Multiselect),
        {
        ssr: false
        }
    )
    const editorRef = useRef(null)
    const router = useRouter()
    const { token_id } = router.query
    // console.log("token_id",token_id)    
    const [token_row_id] = useState(token_id ? token_id:"")
    const [wallet_address, setWalletAddress] = useState('')
    const [contract_addresses, set_contract_addresses] = useState([{ contract_address: "", network_name: "", network_row_id: "", token_row_id: "" }])
    const [live_price, setLivePrice] = useState("")
    const [market_cap, set_market_cap] = useState("") 
    const [err_contract_address, setErrContractAddress] = useState("")
    const [loader, set_loader] = useState("")
    const [image_base_url] = useState(IMAGE_BASE_URL+"/markets/cryptocurrencies/") 
    const [display_image, set_display_image] = useState("")
    const [list_type, set_list_type] = useState("")
    
    const [symbol, setSymbol] = useState('')  
    const [token_name, setTokenName] = useState('')
    const [website_link, setWebsiteLink] = useState('')
    const [whitepaper, setWhitepaper] = useState('')
    const [token_supply, setTokenMaxSupply] = useState('')
    const [circulating_supply, setCirculatingSupply] = useState('') 
    const [token_description, setTokenDescription] = useState('')
    const [token_image, setTokenImage] = useState('')
    const [source_code_link, seSourceCodeLink] = useState('')
    const [tokenid , setToken_id] = useState("")
    const [meta_keywords, set_meta_keywords] = useState("")
    const [meta_description, set_meta_description] = useState("")
    const [err_symbol, setErrSymbol] = useState('') 
    const [err_token_name, setErrTokenName] = useState('')
    const [err_website_link, setErrWebsiteLink] = useState('')
    const [err_whitepaper, setErrWhitepaper] = useState('')
    const [err_total_supply, set_err_total_supply] = useState('')
    const [err_market_cap, setErr_market_cap] = useState('') 
    const [err_token_description, setErrTokenDescription] = useState('')
    const [err_token_image, setErrTokenImage] = useState('')
    const [categories, set_categories] = useState([])
    const [category_name, set_category_name]= useState([])
    const [category_name_ids, set_category_name_ids]= useState([])  
    const [crypto_networks, set_crypto_networks] = useState([])

    const [err_list_type, set_err_list_type] = useState(false)
    const [approval_status, set_approval_status] = useState("")
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
    const [with_contract_address, set_with_contract_address] = useState(true)

    const onSelect =(selectedList, selectedItem)=> { 
        category_name_ids?.push(selectedItem._id)
        category_name?.push(selectedItem)  
    }
    
    const onRemove = (selectedList, removedItem) => {
        category_name_ids.splice(category_name_ids.indexOf(removedItem._id), 1)
        category_name.splice(category_name.indexOf(removedItem), 1)
    }

    const oncCropComplete=()=>
    {  
        document.getElementById("imageUploadForm").reset()
        setTokenImage(blobFile)
        setImgmodal(false)
    }
  
    const getBusinessModels = () => 
    { 
        Axios.get(API_BASE_URL+"markets/cryptocurrency/unique_categories", config).then(res => 
        {
            if (res.data.status) 
            {
                set_categories(res.data.message)
            }
        })
    }

    const getCryptoNetworks = async () => 
    {
      const res = await Axios.get(API_BASE_URL + "static/crypto_networks", config)
      if(res.data.status) 
      {
        set_crypto_networks(res.data.message)
      }
    }
 
    const imageCropModalClose = () => 
    {
        document.getElementById("imageUploadForm").reset()
        setImgmodal(false)
    }

    const onCropComplete = (crops) => 
    {  
        setCompletedCrop(crops)
    
        const image = imgRef.current
        const canvas = document.createElement('canvas')
        const crop = crops
    
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const ctx = canvas.getContext('2d')
        const pixelRatio = window.devicePixelRatio
    
        canvas.width = crop.width * pixelRatio
        canvas.height = crop.height * pixelRatio
    
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'high'
    
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
        )
        
        return new Promise((resolve, reject) => 
        {
            canvas.toBlob(blob => 
            {
                if (!blob) {  return }
                blob.name = 'newFile.jpeg'
                // window.URL.revokeObjectURL(fileUrl)
                const fileUrl = window.URL.createObjectURL(blob)
                var reader = new FileReader()
                reader.readAsDataURL(blob)
                reader.onloadend = function()  { set_blobFile(reader.result) }
                resolve(fileUrl)
            }, 'image/jpeg')
        })
    }
  
  
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


    function onImageLoad(e) {
      imgRef.current = e.currentTarget
      const width = 50
      const height = 50
      const crop = centerCrop(makeAspectCrop(
          {
              unit: '%',
              width: 50,
          },
          1 / 1,
          width,
          height,
      ),
          width,
          height,
      )
      setCrop({ unit: 'px', width: 50, height: 50, aspect: 1 / 1 })
  }

    const onLoad = useCallback((img) => 
    {
        imgRef.current = img
    }, [])
  
    const clearform = () =>
    {   
        set_contract_addresses([{ contract_address: "", network_name: "", network_row_id: "", token_row_id: "" }])
        setSymbol("")
        set_list_type("")
        setTokenName("")
        setWebsiteLink("")
        setWhitepaper("")
        setTokenMaxSupply("")
        set_market_cap("")
        setTokenDescription("")
        setTokenImage("")
        set_category_name("")
        seSourceCodeLink("")
        setExplorersList("")
        setExchangesList("")
        setCommunitysList("")
        set_err_list_type("")
        set_err_total_supply("")
    }

const createNewToken = () =>
{   
    let formValid = true
    // console.log("asdf", contract_addresses)
    // if(contract_address.length === 2)
    // { 
    //   let list = err_contract_address
    //   list = ""
    //   setErrContractAddress(list)
    // }
    // else
    // {
    //   let list = err_contract_address
    //   list = ""
    //   setErrContractAddress(list)    
    // } 
  
    setModalData({icon: "", title: "", content:""})
    setErrSymbol('') 
    setErrTokenName('')
    setErrWebsiteLink('')
    setErrWhitepaper('')
    
    setErr_market_cap('') 
    setErrTokenDescription('')
    setErrTokenImage('')  
    set_err_list_type("")
    set_err_total_supply("")

    if(!list_type)
    {
        set_err_list_type('The List Type field is required.')
        formValid = false
    } 
    
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
    
    if(!token_supply)
    {
      set_err_total_supply('The Total Supply field is required.')
      formValid = false
    }

    // if(with_contract_address === true)
    // {
    // if(contract_address.length === 2)
    // {   
    //   let list = err_contract_address

    //   if(contract_address[0].network_type === "0" && contract_address[0].contract_address === "")
    //   {  
    //     list = "The Contract address network type field is required."
    //     formValid = false
    //   }   
    //   else if(contract_address[0].network_type === "0"){  
    //     list = "The  network type field is required."
    //     formValid = false
    //   }   
    //   else if(contract_address[0].contract_address === ""){   
    //     list = "The Contract address field is required."
    //     formValid = false
    //   }
    //   else if((contract_address[0].contract_address).length !== 42){  
    //     list = "The Contract address field must be equal to 42 characters."
    //     formValid = false
    //   }
    //   else if(contract_address[1].network_type === "0" || contract_address[1].network_type === 0){  
    //     list = "The Contract address network type field is required." 
    //     formValid = false  
    //   }  
    //   else if(contract_address[1].contract_address === ""){ 
    //     list = "The Contract address field is required."
    //     formValid = false   
    //   }
    //   else if((contract_address[1].contract_address).length !== 42){
    //     list = "The Contract address field must be equal to 42 characters."
    //     formValid = false
    //   }  
    //   // else if(contract_address[0].contract_address === contract_address[1].contract_address){
    //   //   list = "Both Contract addresses must not be same."
    //   //   formValid = false
    //   // }  
    //   else if(contract_address[0].network_type === contract_address[1].network_type){
    //     list = "Both Contract addresses network type must not be same."
    //     formValid = false
    //   }   
    //   else{
    //     list = ""
    //   }
    //   setErrContractAddress(list)
    // } 
    // else if(contract_address.length === 1){
      
    //   let list = err_contract_address 

    //     if(contract_address[0].network_type === "0" && contract_address[0].contract_address === ""){  
    //       list = "The Contract address and network type field is required."
    //       formValid = false
    //     }  
    //     else if(contract_address[0].network_type === "0"){  
    //       list = "The  network type field is required."
    //       formValid = false
    //     }  
    //     else if(contract_address[0].contract_address === ""){   
    //       list = "The Contract address field is required."
    //       formValid = false
    //     }
    //     else if((contract_address[0].contract_address).length !== 42){  
    //       list = "The Contract address field must be equal to 42 characters."
    //       formValid = false
    //     }
    //     else{ 
    //       list = ""   
    //     } 
    //     setErrContractAddress(list)  
    //   }
    // }  

    if(website_link)
    {
        if((/\s/g).test(website_link))
        {
          formValid = false
          setErrWebsiteLink("The Website Link field must not contain whitespace.")
        }
    }

    if(token_name === '')
    {
        setErrTokenName('The Token Name field is required.')
        formValid = false
    } 
    else if(token_name.length < 2)
    {
        setErrTokenName('The Token Name must be atleast 2 characters.')
        formValid = false
    }
    else if(token_name.length > 50)
    {
        setErrTokenName('The Token Name must be less than 25 characters in length.')
        formValid = false
    }
    
    let communities_address = [""]
    if(community_address.length > 0)
    { 
      community_address.map((e, i)=>{
        if(e !== ""){ 
          communities_address.push(e) 
        }
      })
      setCommunitysList(communities_address) 
    } 

    let explorers = [""]
    if(explorer.length > 0){
      explorer.map((e, i)=>{
        if(e !== ""){
          explorers.push(e) 
        }
      })
      setExplorersList(explorers)
    }  

    let exchanges_link = [""]
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
      setErrTokenDescription('The Description field is required.')
      formValid = false
    }
    // else if(token_description?.length <= 10)
    // {
    //     setErrTokenDescription('The Description must be atleast 4 characters.')
    //     formValid = false
    // }
    // else if(token_description?.length > 5000)
    // {
    //     setErrTokenDescription('The Description must be less than 5000 characters in length.')
    //     formValid = false
    // } 
 
    if(!formValid)
    {
      return false
    }
    set_loader(true)
    const reqObj = {
      list_type : list_type,
      wallet_address : wallet_address, 
      symbol : symbol, 
      token_row_id:token_row_id,
      token_name : token_name,
      token_image : token_image,
      website_link : website_link,
      whitepaper : whitepaper,
      total_supply : token_supply,
      description : token_description,
      source_code_link : source_code_link,
      explorers : explorer,
      exchanges : exchange_link,
      communities : community_address,
      contract_addresses : parseInt(list_type) == 2 ? contract_addresses : [],
      meta_keywords : meta_keywords,
      meta_description : meta_description,
      categories:category_name_ids,
      market_cap:market_cap
    }
    
    // console.log(reqObj)
    Axios.post(API_BASE_URL+"markets/users/manage_crypto/update_n_save_details", reqObj, config).then(response=>
    { 
      set_loader(false)
      // console.log(response)
      if(response.data.status)
      { 
        setShowNav(true) 
        setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: response.data.message.alert_message})
        if(!token_row_id){
        clearform()}
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
        
        if(response.data.message.token_supply){  
          set_err_total_supply(response.data.message.token_supply)
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
        // console.log(result)
        if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) 
        { 
         
          if(id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c" || id=== "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2")
          {
           setLivePrice(result.data.ethereum.dexTrades[0].quote)
          }
          else
          {
            // console.log(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote)
             setLivePrice(result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote) 
          }
          
        }  
      })
      .catch(console.error);
  }

    const getTotalMaxSupply=(id,decimal,networktype)=>
    {
        if(networktype==1)
        {
            // https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&apikey=YourApiKeyToken
            Axios.get("https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=E9DBMPJU7N6FK7ZZDK86YR2EZ4K4YTHZJ1").then(response=>
            {
                if(response.status)
                { 
                  console.log(response) 
                  setTokenMaxSupply(response.data.result/10**decimal) 
                }
            })
        }
        else
        {
            Axios.get("https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress="+id+"&apikey=GV79YU5Y66VI43RM7GCBUE52P5UMA3HAA2").then(response=>
            {
                if(response.status)
                { 
                  // console.log(response) 
                  setTokenMaxSupply(response.data.result/10**decimal) 
                }
            })
        }
    }

    const getMarketCap =async(id, decval, network_type)=> 
    {  
        let mainnetUrl = ""
        if(network_type === "1" )
        {
            mainnetUrl = 'https://mainnet.infura.io/v3/5fd436e2291c47fe9b20a17372ad8057'
        }
        else
        {
            mainnetUrl = "https://bsc-dataseed.binance.org/";
        }
   
        const provider = new ethers.providers.JsonRpcProvider(mainnetUrl); 
        const tokenAbi = ["function totalSupply() view returns (uint256)"];
        const tokenContract = new ethers.Contract(id, tokenAbi, provider);
        
        const supply = await tokenContract.totalSupply() / (10 ** decval);  
        getTokenUsdPrice(id,network_type)
        // console.log("supply", live_price)
        set_market_cap(supply * live_price)
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
    getBusinessModels() 
    getCryptoNetworks() 
    if(token_row_id){
      getTokenDetails()
    }
    // if(localStorage.getItem("walletconnectedtype") === "1"){
    //   getAccount()
    //   getETHAccount() 
    // }
  },[]) 
  

  const makeJobSchema=()=> 
  {  
    return { 
        "@context" : "http://schema.org/",
        "@type" : "Organization",
        "name" : "Update Coin/Token",
        "url" : market_coinpedia_url + "token/update/",
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs" :["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
  } 
  const checkContractAddress=(data, index)=>{ 
          const { name, value } = data.target
          const list = [...contract_address]
          list[index][name] = value.toLowerCase()  
          set_contract_addresses(list)
  }  

  const getTokenDetails=()=>
  {
    Axios.get(API_BASE_URL+"markets/users/manage_crypto/individual_details/"+token_row_id, config).then(response=>
    {
      if(response.data.status)
      { 
        // console.log(response.data) 
        if(response.data.message.list_type == 2)
        {
          if(response.data.message.contract_addresses.length)
          {
            set_contract_addresses(response.data.message.contract_addresses)
          }
          else
          {
            set_contract_addresses([{ contract_address: "", network_name: "", network_row_id: "", token_row_id: "" }])
          }
        }
        else
        {
          set_contract_addresses([{ contract_address: "", network_name: "", network_row_id: "", token_row_id: "" }])
        }

        
        setErrContractAddress("")  
        setSymbol(response.data.message.symbol) 
        setTokenName(response.data.message.token_name)
        setWebsiteLink(response.data.message.website_link)
        setWhitepaper(response.data.message.whitepaper) 
        setTokenMaxSupply(response.data.message.total_supply)
        set_market_cap(response.data.message.market_cap) 
        setTokenDescription(response.data.message.description)
        set_meta_keywords(response.data.message.meta_keywords)
        set_meta_description(response.data.message.meta_description)
        set_category_name(response.data.message.categories_array)
        set_category_name_ids(response.data.message.categories)
        set_approval_status((response.data.message.approval_status) ? parseInt(response.data.message.approval_status):0)
        if(response.data.message.token_image)
        {
            set_display_image(response.data.message.token_image)
        }
        set_list_type(response.data.message.list_type)

        // if(response.data.message.token_image)
        // {
        //   setTokenImage(image_base_url+response.data.message.token_image)
        // }
        // else
        // {
        //   setTokenImage(image_base_url+"default.png")
        // }
        
        // set_category_row_id(response.data.message.category_row_id)
        // set_category_name(response.data.message.category_name)
        seSourceCodeLink(response.data.message.source_code_link) 


        
        if(response.data.message.explorers)
        {
          if(response.data.message.explorers.length < 1)
          {
            setExplorersList([""])
          }
          else
          {
            setExplorersList(response.data.message.explorers)
          }
        }
        

        if(response.data.message.exchanges){
          if(response.data.message.exchanges.length < 1){
            setExchangesList([""])
          }
          else{
            setExchangesList(response.data.message.exchanges)
          }
          
        }
        

        if(response.data.message.communities){
          if(response.data.message.communities.length < 1){ 
            setCommunitysList([""])
          }
          else{
            setCommunitysList (response.data.message.communities)
          }
        }
        
 

        // setImageUrl(response.data.image_base_url)
      }
      // else
      // {
      //   router.push("/token")
      // }
    })
  }

  //type 1:network , 2:contract address
  const getTokenData = (type, index, pass_value) => 
  { 
    const list = [...contract_addresses]
    if(type == 1)
    {
      const { network_name, token_row_id, _id } = crypto_networks[pass_value]
      
      list[index] = {
        contract_address : list[index].contract_address,
        network_name : network_name,
        network_row_id :_id,
        token_row_id:token_row_id
      }
      set_contract_addresses(list)
    }
    else if(type == 2)
    {
      list[index] = {
        contract_address : pass_value,
        network_name : list[index].network_name,
        network_row_id :list[index].network_row_id,
        token_row_id:list[index].token_row_id
      }
      set_contract_addresses(list)
    }
  }


  const AddMoreContractAddress = () => 
  {
    set_contract_addresses(prev => [...prev, { contract_address: "", network_name: "", network_row_id: "", token_row_id:"" }])
  }

  const removeContractAddress = (index) => {
    set_contract_addresses(contract_addresses.filter((s, sindex) => index !== sindex))
  }

  // const getTokenData =(data,type, index, address)=>{  
  //   checkContractAddress(data, index)
  //   getTokenAddress(type, address)
    
  // }
  
  
  // const getTokenAddress = (type, address) =>{  

  //     let network_type = ""

  //     if(type === "1"){ 
  //       network_type = "ethereum"
  //     }
  //     else if(type === "2"){ 
  //       network_type = "bsc"
  //     }
  //     else{
  //       return null
  //     }
   
  //     const query = `
  //                 query
  //                 { 
  //                   ethereum(network: `+network_type+`) {
  //                     address(address: {is: "`+address+`"}){
  
  //                       annotation
  //                       address
  
  //                       smartContract {
  //                         contractType
  //                         currency{
  //                           symbol
  //                           name
  //                           decimals
  //                           tokenType
  //                         }
  //                       }
  //                       balance
  //                     }
  //                   } 
  //               }
  //           ` ;
  
  //     const url = "https://graphql.bitquery.io/";
  //     const opts = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "X-API-KEY":graphqlApiKEY
  //       },
  //       body: JSON.stringify({
  //         query
  //       })
  //     }; 
  //     fetch(url, opts)
  //       .then(res => res.json())
  //       .then(result => {    
  //           if(result.data.ethereum.address[0].smartContract){
  //           if (result.data.ethereum.address[0].smartContract.currency) { 
  //             setErrContractAddress("")
  //             getTokenUsdPrice(address,type) 
  //             setSymbol(result.data.ethereum.address[0].smartContract.currency.symbol) 
  //             setTokenName(result.data.ethereum.address[0].smartContract.currency.name) 
  //             getTotalMaxSupply(address,result.data.ethereum.address[0].smartContract.currency.decimals,type)
              
  //             // getMarketCap(address,result.data.ethereum.address[0].smartContract.currency.decimals,type)
  //           } 
  //           else { 
  //             setErrContractAddress("Invalid contract address or network type.")
  //             setSymbol('') 
  //             setTokenName('')
  //           } 
  //         }
  //         else{
  //           setErrContractAddress("Invalid contract address or network type.")
  //           setTokenName('')
  //         }
  //       })
  //       .catch(console.error);
   
  // }


  return(
    <>
      { 
        token_row_id ?
        <Head>
          <title>Update Coin/Token Details | Coinpedia markets</title>
          <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
          <meta name="description" content="Update coin details is your page to edit, update any details to your listed coin/token detail page." />
          <meta name="keywords" content="List token, List token on coinpedia markets, list token, token listing, listing on coinmarketcap, token listing." />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Update Coin/Token Details | Coinpedia markets" />
          <meta property="og:description" content="Update coin details is your page to edit, update any details to your listed coin/token detail page. " />
          <meta property="og:url" content={market_coinpedia_url + "token/update/"} />
          <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
          <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
          <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="400" />  
          <meta property="og:image:type" content="image/png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@coinpedia" />
          <meta name="twitter:creator" content="@coinpedia" />
          <meta name="twitter:title" content="Update Coin/Token Details | Coinpedia markets" />
          <meta name="twitter:description" content="Update coin details is your page to edit, update any details to your listed coin/token detail page." />
          <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 
          <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
          <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
          <link rel="canonical" href={market_coinpedia_url + "token/update/"} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
        </Head>
        :
        <Head>
          <title>List Your Coin/Token | CoinPedia Markets</title>
          <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
          <meta name="description" content="Token listing on Coinpedia markets can be done by submitting your details in this form, followed by team verification and listing." />
          <meta name="keywords" content="List token on coinpedia markets, list token, token listing, listing on coinmarketcap, token listing." />
          <meta property="og:locale" content="en_US" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="List Your Coin/Token | CoinPedia Markets" />
          <meta property="og:description" content="Token listing on Coinpedia markets can be done by submitting your details in this form, followed by team verification and listing." />
          <meta property="og:url" content={market_coinpedia_url + "token/update/"} />
          <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
          <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
          <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
          <meta property="og:image:width" content="400" />
          <meta property="og:image:height" content="400" />  
          <meta property="og:image:type" content="image/png" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:site" content="@coinpedia" />
          <meta name="twitter:creator" content="@coinpedia" />
          <meta name="twitter:title" content="List Your Coin/Token | CoinPedia Markets" />
          <meta name="twitter:description" content="Token listing on Coinpedia markets can be done by submitting your details in this form, followed by team verification and listing." />
          <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 
          <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
          <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
          <link rel="canonical" href={market_coinpedia_url + "token/update/"} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
        </Head>
      }
      
      <div className="page">
        <div className="create_airdrop create_launchpad">
          <div className="container">
            <div className="for_padding">
              <div> 
                <div className="token_form">
                  <div className='market_token_tabs'>
                  <div className='row'>
                    <div className='col-md-10'>
                      <div className='prices__title h5'>
                        { 
                          token_row_id ?
                          <>
                            <h1 className=''>Update Coin/Token Details</h1>
                            <p className='token_form_sub_text' >Edit details of your coins/tokens listed on Coinpedia markets</p>
                          </>
                          :
                          <>
                          
                            <h1 className=' '> List Your Coin/Token On CoinPedia Markets </h1>
                            <p className='token_form_sub_text mb-4'>Submit your coin/token details in the form below, we will verify and list it on the markets page. </p>
                            <br/>
                          </>
                        }
                      </div>
                     
                    </div>
                    <div className='col-md-2 text-right'>
                    <div className="quick_block_links main_page_coin_filter create_token_btn">
                      <Link href="/token">Manage Tokens</Link>
                    </div>
                    </div>
                  </div>
                 


                    
                    {
                      token_row_id?
                      <Top_header active_tab={1} token_id={token_row_id} approval_status={approval_status}/>
                      :
                      ""
                    }


                        {/* <h5>Create Token</h5>
                        <p>Enter all these fields to create token</p> */}

                    {/* <div className="row">
                      <div className="col-lg-3 col-md-4">
                      </div>  
                      <div className="col-lg-6 col-md-6">
                          
                      </div>
                    </div> */}
                  
                  </div>
                  
{/* 
community_address
explorer
exchange_link 
*/}
                <div className='create_token_details'>
                  <div className="row">
                    {/* <div className="col-lg-3 col-md-4">
                      <div className="token_steps_list">
                        <ul>
                          <li>Token Basic <img src={"/assets/img/"+(token_name ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/> </li>
                          <li>Token Supply <img src={"/assets/img/"+(token_supply ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>Exchange <img src={"/assets/img/"+(exchange_link[0] ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>Explorer <img src={"/assets/img/"+(explorer[0] ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>Community <img src={"/assets/img/"+(community_address[0] ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                          <li>About Token <img src={"/assets/img/"+(token_description.length > 10 ? "create_token_check_completed.svg":"create_token_check_pending.svg")}/></li>
                        </ul>
                      </div> 
                    </div> */}
                   
                    <div className="col-lg-8 col-md-10">
                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                            <div className="form-custom">
                          <div className="row">
                            <div className="col-md-5">
                            <label htmlFor="email">List Type<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-7">
                            <div className="form-group input_block_outline">
                            <select className="form-control" value={list_type} onChange={(e) => set_list_type(e.target.value)} >
                              <option value="" disabled>Select Type</option>
                              <option value={1} >Coin</option>
                              <option value={2} >Token</option>
                            </select>
                            </div>
                            <div className="error">{err_list_type}</div>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>
              
                      {
                          parseInt(list_type) == 2 ?
                          <div className="row">
                          { 
                            contract_addresses.length > 0 ?
                            contract_addresses.map((e, i)=>
                            <div className="col-lg-10 col-md-12" key={i}>
                              <div className="form-custom">
                                <div className="row contract_address">
                                  <div className="col-md-5">
                                    <label htmlFor="email">Contract address<span className="label_star">*</span></label>
                                  </div>
                                  <div className="col-md-7">
                                    <div className="input_block_outline" style={{marginBottom: '0'}}>
                                      <div className="input-group">
                                        <div className="input-group-prepend">
                                          <select name="network_type" placeholder="Eg.,0x0000" value={e.network_type}   onChange={(item) => getTokenData(1, i, item.target.value)} >
                                                <option value="">Type</option> 
                                                {
                                                    crypto_networks.length ?
                                                    crypto_networks.map((item, inner_i) =>
                                                    <>
                                                    <option value={inner_i} selected={item._id==e.network_row_id}>{item.network_name}</option>
                                                    </>
                                                    )
                                                    :
                                                    ""
                                                  }
                                          </select>
                                        </div>
                                        <input type="text" className="form-control" placeholder="Enter Address" value={e.contract_address} name="contract_address" onChange={(item) => getTokenData(2, i, (item.target.value).toLowerCase())}   />
                                        </div>
                
                                       
                                    </div>  
                                    <>
                                      {
                                        i== 0 ?
                                        <>
                                         <button className="addmore_ico create-token-res" onClick={()=>AddMoreContractAddress()}><span><img src="/assets/img/add-more.svg" alt="Add" /> Add More </span></button>  
                                        </>
                                        :
                                        <>
                                        <button className="addmore_ico create-token-res" style={{ marginBottom: "10px"}} onClick={()=> removeContractAddress(i)}><span> <img src="/assets/img/circle-minus.svg" alt="Remove"></img> Remove </span></button>
                                        </>
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
                      :
                      null
                  }
                

                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Token Name<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-7">
                            <div className="form-custom"> 
                            
                            <div className="form-group input_block_outline">
                            <input type="text" className="form-control" placeholder="Token Name" value={token_name} onChange={(e)=>setTokenName(e.target.value)}/>
                            </div>
                            <div className="error">{err_token_name}</div>
                          </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Symbol<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-7">
                              <div className="form-custom"> 
                                <div className="form-group input_block_outline">
                                <input type="text" className="form-control" placeholder="Symbol" value={symbol}  onChange={(e)=>setSymbol((e.target.value).toUpperCase())}/>
                                  
                                </div>
                                <div className="error">{err_symbol}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Select Category</label>
                            </div>
                            <div className="col-md-7">
                              <div className='input_multiselector'>
                              <div className="form-custom">
                                <div className="form-group input_block_outline ">
                                <Multiselect   placeholder="Select Category"
                                    selectedValues={category_name}
                                    options={categories} // Options to display in the dropdown
                                    onSelect={onSelect} // Function will trigger on select event
                                    onRemove={onRemove} // Function will trigger on remove event
                                    displayValue="category_name" // Property name to display in the dropdown options
                                /> 
                                </div>
                                 <div className="error">{err_website_link}</div>
                              </div>
                            </div>
                          </div>
                          </div>
                        </div>
                      </div>
    
                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Source code Link</label>
                            </div>
                            <div className="col-md-7">
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
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Website Link</label>
                            </div>
                            <div className="col-md-7">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="text" className="form-control" placeholder="Website Link" value={website_link} onChange={(e)=>setWebsiteLink(e.target.value)}/>
                                </div>
                                 <div className="error">{err_website_link}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Token Supply<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-7">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <div className="input-group">
                                    <input type="number" placeholder="Token Supply" className="form-control" aria-label="Username" aria-describedby="basic-addon1"  value={token_supply} onChange={(e)=>setTokenMaxSupply(e.target.value)}/>
                                    <div className="input-group-prepend">
                                      <span className="input-group-text">{symbol}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="error">{err_total_supply}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                            <label htmlFor="email">Market Cap</label>
                            </div>
                            <div className="col-md-7">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                {
                                    with_contract_address === true ?
                                    <input type="number" placeholder="Market Cap"  className="form-control" value={market_cap} onChange={(e)=>set_market_cap(e.target.value)} readOnly/>
                                    :
                                    <input type="number" placeholder="Market Cap"  className="form-control" value={market_cap} onChange={(e)=>set_market_cap(e.target.value)}/>
                                }
                                </div>
                                <div className="error">{err_market_cap}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}

                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Whitepaper</label>
                            </div>
                            <div className="col-md-7">
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
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Token Image</label>
                            </div>
                            <div className="col-md-7">
                              <form id="imageUploadForm" >
                                <div className="choose_file_input form-custom">
                                  <div className="form-group input_block_outline">
                                    <label className='m-0'> 
                                        <input className="choose_logo form-control" type="file" accept="image/*" onChange={onSelectFile} />
                                        <span >Choose Image </span> 
                                      </label> 
                                  </div>
                                  <div className="error">{err_token_image}</div>
                                </div>
                              </form>
                            {/* </div>
                            <div className="col-md-3"> */}
                              {
                                token_image !== '' ?
                                <img src={token_image} alt="token image" id="tokenlogo" width="50" height="50" className="mb-4 mt-0"/> 
                                :
                                display_image ?
                                <img  src={image_base_url+display_image} alt="token image" width="50" height="50" className="mb-4 mt-0" />
                                :
                              
                                null
                              }
                            </div>
                          </div>
                        </div>
                      </div>
            
                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">About coin/Token <span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-7" style={{marginBottom: '25px'}}>
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

                      <div className="row" >
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Exchanges</label>
                            </div>
                            <div className="col-md-7 mr_bottom">
                            {
                              exchange_link.length > 0 ?
                              exchange_link.map((item, i) => 
                              i == 0 ?
                                <div key={i}>
                                  <div className="form-custom create_token_no_space">
                                    <div className="form-group input_block_outline">
                                      <input autoComplete="off" type="text" className="form-control" placeholder="Exchange Link" name="link" value={item} onChange={e => handleExchangeChange(e, i)} />
                                    </div>
                                    <button className="addmore_ico create-token-res" onClick={addMoreExchange}><span><img src="/assets/img/add-more.svg" alt="Add"/> Add More Exchange</span></button>
                                  </div>
                                </div>
                            
                                  : 
                                  
                                    <div >
                                      <div className="form-custom create_token_top_space">
                                        <div className="form-group input_block_outline">
                                          <input autoComplete="off" type="text" className="form-control" placeholder="Exchange Link" name="link" value={item} onChange={e => handleExchangeChange(e, i)} />
                                        </div>
                                        <p className="remove_block"><span onClick={() =>{clickOnDelete(i)}}> <img src="/assets/img/circle-minus.svg" alt="Remove"></img>Remove</span></p>
                                      </div>
                                    </div> 
                                  
                                )
                                :
                                  <div>
                                  <div className="form-custom create_token_no_space">
                                    <div className="form-group input_block_outline">
                                      <input autoComplete="off" type="text" className="form-control" name="link" placeholder="Exchange Link" value={exchange_link} onChange={e => handleExchangeChange(e, 0)} />
                                    </div>
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Explorers</label>
                            </div>
                            <div className="col-md-7 mr_bottom">
                            {
                              explorer.length > 0 ?
                              explorer.map((item, i) => 
                              i == 0 ?
                                <div  key={i}>
                                    <div >
                                      <div className="form-custom create_token_no_space">
                                        <div className="form-group input_block_outline">
                                          <input autoComplete="off" className="form-control" type="text" placeholder="Explorer Link" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                        </div>
                                      
                                        <button className="addmore_ico create-token-res" onClick={addMoreExplorers}><span><img src="/assets/img/add-more.svg" alt="Add"/> Add More Explorer</span></button>
                                      </div>
                                    </div>
                                </div>
                                : 
                                  <div >
                                    <div className="form-custom create_token_top_space">
                                      <div className="form-group input_block_outline">
                                        <input autoComplete="off" type="text" className="form-control" placeholder="Explorer Link" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                      </div>
                                      <p className="remove_block"><span onClick={() =>{clickOnExplorerDelete(i)}}> <img src="/assets/img/circle-minus.svg" alt="Remove"></img>Remove</span></p>
                                    </div>
                                  </div>
                                  
                              )
                              :
                              <div >
                                      <div className="form-custom create_token_no_space">
                                        <div className="form-group input_block_outline">
                                          <input autoComplete="off" type="text" className="form-control" placeholder="Explorer Link" name="link" value={explorer} onChange={e => handleExplorersChange(e, 0)} />
                                        </div>
                                      </div>
                                    </div>
                            }
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label htmlFor="email">Communities</label>
                            </div>
                            <div className="col-md-7 mr_bottom">
                            {
                              community_address.length > 0 ?
                              community_address.map((item, i) => 
                              i == 0 ?
                              <div key={i}>
                                  <div >
                                    <div className="form-custom create_token_no_space">
                                      <div className="form-group input_block_outline">
                                        <input autoComplete="off" type="text" className="form-control" placeholder="Community Link" name="link" value={item} onChange={e => handleCommunityChange(e, i)} />
                                      </div>
                                      <button className="addmore_ico create-token-res" onClick={addMoreCommunity}><span><img src="/assets/img/add-more.svg" alt="Add"/> Add More Community</span></button>
                                    </div>
                                  </div>
                              </div>
                                : 
                                <div key={i}>
                                  <div>
                                    <div className="form-custom create_token_top_space">
                                      <div className="form-group input_block_outline">
                                        <input autoComplete="off" type="text" className="form-control" placeholder="Community Link" name="link" value={item} onChange={e => handleCommunityChange(e, i)} />
                                      </div>
                                      <p className="remove_block"><span onClick={() =>{clickOnCommunityDelete(i)}}> <img src="/assets/img/circle-minus.svg" alt="Remove"></img>Remove</span></p>
                                    </div>
                                  </div> 
                                </div>
                              )
                              :
                              <div>
                                <div className="form-custom create_token_no_space">
                                  <div className="form-group input_block_outline">
                                    <input autoComplete="off" type="text" className="form-control" placeholder="Community Link" name="link" value={community_address} onChange={e => handleCommunityChange(e, 0)} />
                                  </div>
                                </div>
                              </div>
                            }
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label>Meta Keywords</label>
                            </div>
                            <div className="col-md-7">
                              <div>
                                <div className="form-custom create_token_no_space">
                                  <div className="form-group input_block_outline">
                                    <input autoComplete="off" type="text" className="form-control" placeholder="Meta Keywords" value={meta_keywords} onChange={(e) => set_meta_keywords(e.target.value)}/>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div> */}
                      {/* <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5">
                              <label>Meta Description</label>
                            </div>
                            <div className="col-md-7">
                            <div>
                                <div className="form-custom create_token_no_space">
                                  <div className="form-group input_block_outline">
                                      <textarea type="text" className="form-control" placeholder="Enter Meta Description"  onChange={(e) => set_meta_description(e.target.value)}>{meta_description}</textarea>
                                  </div>
                                </div>
                             </div>
                             
                            </div>
                          </div>
                        </div>
                      </div> */}

                      <div className="row">
                        <div className="col-lg-10 col-md-12">
                          <div className="row">
                            <div className="col-md-5"></div>
                            <div className="col-md-7">
                              <div className="text-left review_upload_token mt-3">
                                <button className="dsaf button_transition" onClick={() =>{createNewToken()}}>
                                 {loader ? (
                                      <div className="loader"><span className="spinner-border spinner-border-sm "></span> Review and Upload</div>
                                      ) : (
                                          <> Review and Upload</>
                                      )}
                                </button> 
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
        </div>
      
       

        <div className={"modal connect_wallet_error_block"+ (imgmodal ? " collapse show" : "")}> 
          <div className="modal-dialog" style={{marginTop:"50px"}}>
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="close" data-dismiss="modal"  onClick={()=>imageCropModalClose()}>&times;</button>
                <h6 className="mb-3">Select Token Logo</h6>
                <ReactCrop
                  // src={upImg}
                  // onImageLoaded={onLoad}
                  crop={crop}
                  onChange={(c) => setCrop(c)}
                  onComplete={(c) => onCropComplete(c)}
                  aspect={1 / 1} ><img
                  alt="Crop me"
                  src={upImg}
                  onLoad={onImageLoad}
                  style={{ width: "100%" }}
              />
          </ReactCrop>

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
      if(userAgent.user_email_status)
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

