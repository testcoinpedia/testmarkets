
import React, { useState, useEffect,useCallback, useRef } from 'react';  
import Axios from 'axios'
import Web3 from 'web3' 
import { useRouter } from 'next/router' 
import Head from 'next/head'
import cookie from 'cookie'
import "react-datetime/css/react-datetime.css"
import {x_api_key, API_BASE_URL, app_coinpedia_url, website_url} from '../../../components/constants'
import Popupmodal from '../../../components/popupmodal' 
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Editor } from '@tinymce/tinymce-react';

export default function UpdateToken({userAgent,config,token_id}) {  

  const editorRef = useRef(null);
  const router = useRouter()
   

  const [wallet_address, setWalletAddress] = useState('') 
  const [contract_address, setContractAddress] = useState([])
  const [err_contract_address, setErrContractAddress] = useState("")
  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
  const [symbol, setSymbol] = useState("") 
  const [token_name, setTokenName] = useState("")
  const [website_link, setWebsiteLink] = useState("")
  const [whitepaper, setWhitepaper] = useState("")
  const [token_max_supply, setTokenMaxSupply] = useState("")
  const [circulating_supply, setCirculatingSupply] = useState("") 
  const [token_description, setTokenDescription] = useState("")
  const [token_image, setTokenImage] = useState("")
  const [source_code_link, seSourceCodeLink] = useState("")
  const [imagebaseurl, setImageUrl] = useState("") 
  const [image_base_url] = useState(API_BASE_URL+"uploads/tokens/") 
  
  const [err_symbol, setErrSymbol] = useState('') 
  const [err_token_name, setErrTokenName] = useState('')
  const [err_website_link, setErrWebsiteLink] = useState('')
  const [err_whitepaper, setErrWhitepaper] = useState('')
  const [err_token_max_supply, setErrTokenMaxSupply] = useState('')
  const [err_circulating_supply, setErrCirculatingSupply] = useState('') 
  const [err_token_description, setErrTokenDescription] = useState('')
  const [err_token_image, setErrTokenImage] = useState('')

  const [err_wallet_network, setErrWalletNetwork] = useState(false)
  const [err_wallet_connection, setErrWalletConnection] = useState(false)
  const [alert_message, setAlertMessage] = useState('')

  const [explorer, setExplorersList] = useState([])
  const [exchange_link, setExchangesList] = useState([])
  const [community_address, setCommunitysList] = useState([]) 
 
  const [imgmodal, setImgmodal] = useState(false) 

  const [upImg, setUpImg] = useState();
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1 });
  const [completedCrop, setCompletedCrop] = useState(null); 
  const [blobFile, set_blobFile] = useState()  
  const [validImg, setValidImg] = useState("")
  
  const oncCropComplete=()=>{  
    document.getElementById("imageUploadForm").reset()
    setTokenImage(blobFile)
    // convertBlobtoBase64(blobFile)
    setImgmodal(false)
  }
  const imageCropModalClose = () => {
    document.getElementById("imageUploadForm").reset()
    setImgmodal(false)
  }
  

  const onCropComplete = (crops) => { 
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
   
  const createNewToken = () =>
  { 
    let formValid = true
    setModalData({ icon: "", title: "", content: "" })
    // if(wallet_address === '')
    // {
    //   formValid = false
    //   setErrWalletConnection(true)
    // }
    setErrContractAddress('')
    setErrSymbol('') 
    setErrTokenName('')
    setErrWebsiteLink('')
    setErrWhitepaper('')
    setErrTokenMaxSupply('')
    setErrCirculatingSupply('') 
    setErrTokenDescription('')
    setErrTokenImage('') 
 
    if(symbol === '')
    {
      setErrSymbol('The symbol field is required.')
      formValid = false
    }
    else if(symbol.length < 2)
    {
      setErrSymbol('The symbol must be at least 2 characters.')
      formValid = false
    } 
    else if(symbol.length > 25)
    {
      setErrSymbol('The symbol must be less than 25 characters in length.')
      formValid = false
    }
 
    if(contract_address.length === 2){   
      let list = err_contract_address

      if(contract_address[0].network_type === "0" || contract_address[0].network_type === 0){  
        list = "Contract address network type field is required"
        formValid = false
      }    
      
      if(contract_address[0].contract_address === ""){   
        list = "Contract address field is required"
        formValid = false
      }
      else if((contract_address[0].contract_address).length !== 42){  
        list = "Contract address field must be equal to 34 digits"
        formValid = false
      }
      else{ 
        list = ""  
      } 
      
      if(contract_address[1].network_type === "0" || contract_address[1].network_type === 0){  
        list = "Contract address network type field is required" 
        formValid = false  
      }
      else{
        list = ""
      }
  
      if(contract_address[1].contract_address === ""){ 
        list = "Contract address field is required"
        formValid = false   
      }
      else if((contract_address[1].contract_address).length !== 42){
        list = "Contract address field must be equal to 34 digits"
        formValid = false
      }
      else{
        list = "" 
      } 
       
      if(contract_address[0].contract_address === contract_address[1].contract_address){
        list = "Both Contract addresses must not be same"
        formValid = false
      } 
  
      if(contract_address[0].network_type === contract_address[1].network_type){
        list = "Both Contract addresses network type must not be same"
        formValid = false
      }  
      setErrContractAddress(list)
    } 
    else if(contract_address.length === 1){
      
      let list = err_contract_address 

        if(contract_address[0].network_type === "0" || contract_address[0].network_type === 0){  
          list = "Contract address network type field is required"
          formValid = false
        } 
        else{  
          list = ""
        }  
        
        if(contract_address[0].contract_address === ""){   
          list = "Contract address field is required"
          formValid = false
        }
        else if((contract_address[0].contract_address).length !== 42){  
          list = "Contract address field must be equal to 34 digits"
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
        setErrTokenName('The token name must be at least 2 characters.')
        formValid = false
    }
    else if(token_name.length > 50)
    {
        setErrTokenName('The token name must be less than 50 characters in length.')
        formValid = false
    }

    if(whitepaper === '')
    {
        setErrWhitepaper('The whitepaper field is required.')
        formValid = false
    }
    else if(whitepaper.length < 2)
    {
        setErrWhitepaper('The whitepaper must be at least 2 characters.')
        formValid = false
    }
    else if(whitepaper.length > 100)
    {
        setErrWhitepaper('The whitepaper must be less than 100 characters in length.')
        formValid = false
    }


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
    
    if(token_max_supply === '')
    {
        setErrTokenMaxSupply('The token max supply field must contain only numbers.')
        formValid = false
    }
    else if(token_max_supply.length < 1)
    {
        setErrTokenMaxSupply('The token max supply must be at least 2 characters.')
        formValid = false
    }
    else if(token_max_supply.length > 24)
    {
        setErrTokenMaxSupply('The token max supply must be less than 24 characters in length.')
        formValid = false
    }

    if(circulating_supply === '')
    {
        setErrCirculatingSupply('The circulating supply field is required.')
        formValid = false
    } 
    else if(circulating_supply.length < 1)
    {
        setErrCirculatingSupply('The circulating supply must be at least 2 characters.')
        formValid = false
    }
    else if(circulating_supply.length > 24)
    {
        setErrCirculatingSupply('The circulating supply must be less than 24 characters in length.')
        formValid = false
    }

    if(token_description === '')
    {
      setErrTokenDescription('The coin description field is required.')
      formValid = false
    }
    else if(token_description.length < 200)
    {
        setErrTokenDescription('The coin description must be at least 200 characters.')
        formValid = false
    }
    else if(token_description.length > 5000)
    {
        setErrTokenDescription('The coin description must be less than 5000 characters in length.')
        formValid = false
    }  

    const reqObj = {
      wallet_address: wallet_address,
      symbol: symbol, 
      token_id: token_id,
      token_name: token_name,
      token_image: token_image,
      website_link: website_link,
      whitepaper: whitepaper,
      token_max_supply: token_max_supply,
      circulating_supply: circulating_supply, 
      token_description: token_description,
      source_code_link: source_code_link,
      explorer: explorer,
      exchange_link: exchange_link,
      community_address: community_address, 
      contract_addresses: contract_address, 
    } 

    if(formValid)
    { 
      Axios.post(API_BASE_URL+"listing_tokens/update_token_details", reqObj, config)
      .then(response=>{ 
        if(response.data.status)
        { 
          console.log(response.data)
          setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: response.data.message.alert_message})
        } 
        { 
  
          if(response.data.message.contract_address)
          {
            setErrContractAddress("Contract address is "+ response.data.message.contract_address+ " already exist")   
          }
          
          if(response.data.message.symbol)
          {
            setErrSymbol(response.data.message.symbol)
          } 
  
          if(response.data.message.token_description)
          {  
            setErrTokenDescription(response.data.message.circulating_supply)
          }
          
          if(response.data.message.token_max_supply)
          {  
            setErrTokenMaxSupply(response.data.message.token_max_supply)
          }
          
          if(response.data.message.circulating_supply)
          {  
            setErrCirculatingSupply(response.data.message.circulating_supply)
          }
          
          if(response.data.message.token_image)
          {  
            setErrTokenImage(response.data.message.token_image)
          } 
          
          if(response.data.message.token_name)
          {
            setErrTokenName(response.data.message.token_name)
          } 
   
        }
      })
    }
    
  }  
  
 
  const getTokenDetails=(wallet_address)=>
  {
  
    Axios.get(API_BASE_URL+"listing_tokens/listed_individual_details/"+token_id, config)
    .then(response=>{
      if(response.data.status){  
        console.log(response.data) 
        setContractAddress(response.data.message.contract_addresses)
        setErrContractAddress("")  
        setSymbol(response.data.message.symbol) 
        setTokenName(response.data.message.token_name)
        setWebsiteLink(response.data.message.website_link)
        setWhitepaper(response.data.message.whitepaper)
        setTokenMaxSupply(response.data.message.token_max_supply)
        setCirculatingSupply(response.data.message.circulating_supply) 
        setTokenDescription(response.data.message.token_description)
        if(response.data.message.token_image)
        {
          setTokenImage(image_base_url+response.data.message.token_image)
        }
        else{
          setTokenImage(image_base_url+"default.png")
        }
        
        seSourceCodeLink(response.data.message.source_code_link) 
        // setToken_id(response.data.message.token_id)

        if(response.data.message.explorer.length < 1)
        {
          setExplorersList([""])
        }
        else
        {
          setExplorersList(response.data.message.explorer)
        }

        if(response.data.message.exchange_link.length < 1){
          setExchangesList([""])
        }
        else{
          setExchangesList(response.data.message.exchange_link)
        }

        if(response.data.message.community_address.length < 1){
          setCommunitysList([""])
        }
        else{
          setCommunitysList (response.data.message.community_address)
        }
 

        setImageUrl(response.data.image_base_url)
      }
      else
      {
        router.push("/token")
      }
    })
  }
 
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
    const { name, value } = e.target
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
   
  const handleExplorersChange = (e, index) => {
    const { name, value } = e.target
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
   
  const handleCommunityChange = (e, index) => {
    const { name, value } = e.target
    const list = [...community_address]
    list[index] = value
    setCommunitysList(list)
  }
   

  useEffect(()=>
  {
    getTokenDetails()
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
    list[index][name] = value  
    setContractAddress(list)
}  

const getTokenData =(data,type, index, address)=>{  
  checkContractAddress(data, index)
  getTokensDetails(type, address)
}

const getTokensDetails = (type, address) =>{  

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
        "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
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
            setSymbol(result.data.ethereum.address[0].smartContract.currency.symbol) 
            setTokenName(result.data.ethereum.address[0].smartContract.currency.name)   
          } 
          else { 
            setErrContractAddress("Invalid contract address or network type.")
            setSymbol('') 
            setTokenName('')
          } 
        }
        else{
          setErrContractAddress("Invalid contract address or network type.")
          setSymbol('') 
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
        <div className="create_airdrop">
          <div className="container">
            <div className="for_padding">
              <div className=" token_steps">
                <h1>Edit Token</h1>
                <p className="token_form_sub_text">Enter all these fields to Edit tokens details</p>
                <p className="panel_title_go_back"><div onClick={() => router.back()}><a><i className="la la-arrow-left"></i>back</a></div></p>
              </div>
              
              <div className="main_create_form"> 
                  <div className="token_form">
                  
                    <div className="row">
                    { 
                      contract_address.length > 0
                      ?
                      contract_address.map((e, i)=>
                       <div className="col-md-6">
                        <div className="form-custom">
                          <label htmlFor="email">
                          Enter Contract address<span className="label_star">*</span></label>
                          <div className="input_block_outline">
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <select name="network_type"  value={e.network_type}  onChange={(item)=> getTokenData(item, item.target.value, i, e.contract_address)} >
                                      <option value="0">Network Type</option> 
                                      <option value="1">Ethereum</option>
                                      <option value="2">BSC</option>
                                </select>
                              </div>
                              
                             {
                                i === 0 && e.network_type !== "0"
                                ?
                                <input type="text" className="form-control" value={e.contract_address} name="contract_address" onChange={(item)=> getTokenData(item, e.network_type , i, item.target.value)} />
                                :
                                <input type="text" className="form-control" value={e.contract_address} name="contract_address" onChange={(item)=>checkContractAddress(item, i)} />
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
                      )
                      :
                      null
                     }
                    </div>
                     
                    {/* { 
                      contract_address.length > 0
                      ?
                      contract_address.map((e, i)=>{
                      return <div className="row" key={i}>
                        <div className="col-md-6">
                          <div className="form-custom">
                            <label htmlFor="email">Token Network Type</label> 
                            <div className="form-group input_block_outline">
                              {
                                i === 0 && (e.contract_address).length === 42
                                ?
                                <select value={e.network_type} name="network_type" onChange={(item)=> getTokenData(item, item.target.value, i, e.contract_address)}>
                                    <option value="0">Select Network Type</option> 
                                    <option value="1">Ethereum</option>
                                    <option value="2">Binance Smart Chain</option>
                                </select>
                                :
                                <select value={e.network_type} name="network_type" onChange={(item)=> checkContractAddress(item, i)}>
                                    <option value="0">Select Network Type</option> 
                                    <option value="1">Ethereum</option>
                                    <option value="2">Binance Smart Chain</option>
                                </select>
                              }
                            </div>  
                            {
                              contract_address.length - 1 === i
                              ?
                              <div className="error">{err_contract_address}</div>
                              : 
                              null
                            } 
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-custom">
                            <label htmlFor="email">Contract Address</label> 
                            <div className="form-group input_block_outline">
                              
                              {
                                i === 0 && e.network_type !== "0"
                                ?
                                <input type="text"  value={e.contract_address} name="contract_address" onChange={(item)=> getTokenData(item, e.network_type , i, item.target.value)} />
                                :
                                <input type="text"  value={e.contract_address} name="contract_address" onChange={(item)=>checkContractAddress(item, i)} />
                              }
                            </div>
                            
                              {
                                contract_address.length !== 2 ?
                                <>
                                  <button className="addmore_ico create-token-res" onClick={()=>AddMoreContractAddress()}><span><img src="/assets/img/add-more.png" /> Add More Contract addresses</span></button>
                                </>
                                :
                                null
                              }
                              {
                                contract_address.length > 1 ?
                                <>
                                  <button className="addmore_ico create-token-res" style={{float: "right", marginBottom: "10px"}} onClick={()=> removeContractAddress(i)}><span>- Remove Contract address</span></button>
                                  </>
                                :
                                null
                              } 
                            </div> 
                          </div> 
                        </div>
                      })  
                      :
                      null
                    }   */}
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-custom"> 
                          <label htmlFor="email">Token Name<span className="label_star">*</span></label>
                          <div className="form-group input_block_outline">
                            <input type="text"  value={token_name} readOnly />
                          </div>
                          <div className="error">{err_token_name}</div>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-custom">
                          <label htmlFor="email">Symbol<span className="label_star">*</span></label>
                          <div className="form-group input_block_outline">
                            <input type="text" value={symbol}  readOnly/>
                          </div>
                          <div className="error">{err_symbol}</div>
                        </div>
                      </div> 
                    </div>  

                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-custom">
                          <label htmlFor="email">Source code Link</label>
                          <div className="form-group input_block_outline">
                            <input type="text" value={source_code_link} onChange={(e)=>seSourceCodeLink(e.target.value)}/>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-custom">
                          <label htmlFor="email">Website Link</label>
                          <div className="form-group input_block_outline">
                            <input type="text" value={website_link} onChange={(e)=>setWebsiteLink(e.target.value)}/>
                            <div className="error">{err_website_link}</div>
                          </div>
                        </div>
                      </div>
                    </div>
            

                    <div className="row">
                       <div className="col-md-6">
                          <form id="imageUploadForm">
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
    
                   <div className="col-md-6 mb-3">
                   {
        
                    token_image 
                    ?
                    <img src={token_image} height="50" alt="token image" width="50"/>  
                    : 
                    null
                  }
                   </div>
                </div>
                    
                    
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <div className="form-custom">
                          <label htmlFor="email">Token Max Supply<span className="label_star">*</span></label>
                          <div className="input_block_outline">
                            <div className="input-group">
                              <input type="number" className="form-control" aria-label="Username" aria-describedby="basic-addon1"  value={token_max_supply} onChange={(e)=>setTokenMaxSupply(e.target.value)}/>
                              <div className="input-group-prepend">
                                <span className="input-group-text">{symbol}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="error">{err_token_max_supply}</div>
                      </div>

                      <div className="col-md-4">
                        <div className="form-custom">
                          <label htmlFor="email">Circulating Supply<span className="label_star">*</span></label>
                          <div className="form-group input_block_outline">
                            <input type="number" value={circulating_supply} onChange={(e)=>setCirculatingSupply(e.target.value)}/> 
                          </div>
                          <div className="error">{err_circulating_supply}</div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="form-custom">
                          <label htmlFor="email">Whitepaper<span className="label_star">*</span></label>
                          <div className="form-group input_block_outline">
                            <input type="text" value={whitepaper} onChange={(e)=>setWhitepaper(e.target.value)}/>
                          </div>
                          <div className="error">{err_whitepaper}</div>
                        </div>
                      </div>
                  
                    </div> 

                    <div className="row">
                      <div className="col-md-12">
                        <div className="form-custom">
                          <label htmlFor="email">About coin/Token<span className="label_star">*</span></label>
                          <div className="form-group input_block_outline">
                            <Editor apiKey="s6mr8bfc8y6a2ok76intx4ifoxt3ald11z2o8f23c98lpxnk" 
                            onEditorChange={(e)=>setTokenDescription(e)}
                            value={token_description} 
                                onInit={(evt, editor) => {editorRef.current = editor}}
                                // initialValue={token_description}
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

                    <div className="row">
                      <div className="col-md-4 create_token_create_space"> 
                      
                          <div className="row" >
                          {
                           exchange_link.length > 0 ?
                           exchange_link.map((item, i) => 
                            i == 0 ?
                              <div className="col-md-12">
                                <div className="form-custom create_token_no_space">
                                  <label htmlFor="email">Exchange URL</label>
                                  <div className="form-group input_block_outline">
                                    <input type="text" name="link" value={item} onChange={e => handleExchangeChange(e, i)} />
                                  </div>
                                </div>
                              </div>
                          
                          : 
                          
                            <div className="col-md-12">
                              <div className="form-custom create_token_top_space">
                                <label htmlFor="email">Exchange URL {i}</label>
                                <div className="form-group input_block_outline">
                                  <input type="text" name="link" value={item} onChange={e => handleExchangeChange(e, i)} />
                                </div>
                                <p className="remove_block"><span onClick={() =>{clickOnDelete(i)}}>Remove</span></p>
                              </div>
                            </div> 
                          
                        )
                        :
                        null
                      }
                      <button className="addmore_ico create-token-res" onClick={addMoreExchange}><span><img src="/assets/img/add-more.png" /> Add More Exchange</span></button>
                      </div>
                      </div>
                      <div className="col-md-4 create_token_create_space">
                      {
                        explorer.length > 0 ?
                        explorer.map((item, i) => 
                        i == 0 ?
                          <div className="row" key={i}>
                              <div className="col-md-12">
                                <div className="form-custom create_token_no_space">
                                  <label htmlFor="email">Explorer URL</label>
                                  <div className="form-group input_block_outline">
                                    <input type="text" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                  </div>
                                </div>
                              </div>
                          </div>
                          : 
                          <div className="row">
                            <div className="col-md-12">
                              <div className="form-custom create_token_top_space">
                                <label htmlFor="email">Explorer URL {i}</label>
                                <div className="form-group input_block_outline">
                                  
                                  <input type="text" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                </div>
                                <p className="remove_block"><span onClick={() =>{clickOnExplorerDelete(i)}}>Remove</span></p>
                              </div>
                            </div>
                            
                          </div>
                        )
                        :
                        null
                      }
                        <button className="addmore_ico create-token-res" onClick={addMoreExplorers}><span><img src="/assets/img/add-more.png" /> Add More Explorer</span></button>
                      </div>
                      <div className="col-md-4 create_token_create_space">
                      {
                        community_address.length > 0 ?
                        community_address.map((item, i) => 
                        i == 0 ?
                          <div className="row" key={i}>
                              <div className="col-md-12">
                                <div className="form-custom create_token_no_space">
                                  <label htmlFor="email">Community URL</label>
                                  <div className="form-group input_block_outline">
                                    <input type="text" name="link" value={item} onChange={e => handleCommunityChange(e, i)} />
                                  </div>
                                </div>
                              </div>
                          </div>
                          : 
                          <div className="row" key={i}>
                            <div className="col-md-12">
                              <div className="form-custom create_token_top_space">
                                <label htmlFor="email">Community URL {i}</label>
                                <div className="form-group input_block_outline">
                                  <input type="text" name="link" value={item} onChange={e => handleCommunityChange(e, i)} />
                                </div>
                                <p className="remove_block"><span onClick={() =>{clickOnCommunityDelete(i)}}>Remove</span></p>
                              </div>
                            </div> 
                          </div>
                        )
                        :
                        null
                      }
                        <button className="addmore_ico create-token-res" onClick={addMoreCommunity}><span><img src="/assets/img/add-more.png" /> Add More Community</span></button>
                      </div>
                    </div>
                    <div className="text-right review_upload_token mt-3">
                      <button className="dsaf" onClick={() =>{createNewToken()}}>Review and Update</button> 
                    </div>
                
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* <div className={"modal connect_wallet_error_block"+ (alert_message ? " collapse show" : "")}> 
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal"  onClick={()=>closeNRedirect()}>&times;</button>
                  <h4>Token Created </h4>
                  <p>{alert_message}</p>
                </div>
              </div> 
          </div>
        </div>  */}

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

        {/* <div className={"modal connect_wallet_error_block"+ (err_wallet_connection ? " collapse show" : "")}> 
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal"  onClick={()=>setErrWalletConnection(false)}>&times;</button>
                  <h4>Connection Error</h4>
                  <p>Please connect to wallet.</p>
                </div>
              </div> 
          </div>
        </div>  */}

        {/* <div className={"modal connect_wallet_error_block"+ (err_wallet_network ? " collapse show" : "")}>
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal" onClick={()=>setErrWalletNetwork(false)}>&times;</button>
                  <h4>Connection Error</h4>
                  <p>You are connected to an unsupported network.</p>
                </div>
              </div> 
          </div>
        </div>  */}
        {modal_data.title ? <Popupmodal name={modal_data} /> : null}

    </>
  )
}

export async function getServerSideProps({ query ,req}) 
{  
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    var user_token = userAgent.user_token 
      const config = {
        headers: {
          "X-API-KEY": x_api_key,
          "token": user_token
        }
      }

    if(userAgent.user_token)
    {
        if(userAgent.user_email_status==1)
        {
            return { props: { userAgent: userAgent, config: config, token_id: query.edit_token_id}} 
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