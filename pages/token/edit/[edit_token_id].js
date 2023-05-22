
import React, { useState, useEffect,useCallback, useRef } from 'react';  
import Axios from 'axios'
import Link from 'next/link' 
import Web3 from 'web3' 
import { useRouter } from 'next/router' 
import Head from 'next/head'
import cookie from 'cookie'
import dynamic from 'next/dynamic'
import "react-datetime/css/react-datetime.css"
import {x_api_key, API_BASE_URL, app_coinpedia_url,config,graphqlApiKEY,IMAGE_BASE_URL,coinpedia_url,market_coinpedia_url} from '../../../components/constants'
import Popupmodal from '../../../components/popupmodal' 
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Editor } from '@tinymce/tinymce-react';
import Select from 'react-select'
 
export default function UpdateToken({userAgent, config, token_id}) 
{  
  const Multiselect = dynamic( () => import('multiselect-react-dropdown').then(module => module.Multiselect),
    {
      ssr: false
    }
  )
  const editorRef = useRef(null);
  const router = useRouter()
   
  
  const [wallet_address, setWalletAddress] = useState('') 
  const [contract_address, setContractAddress] = useState([{network_type: "0", contract_address: ""}])
  const [err_contract_address, setErrContractAddress] = useState("")
  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
  const [symbol, setSymbol] = useState("") 
  const [token_name, setTokenName] = useState("")
  const [website_link, setWebsiteLink] = useState("")
  const [whitepaper, setWhitepaper] = useState("")
  const [token_max_supply, setTokenMaxSupply] = useState("")
  const [market_cap, setmarket_cap] = useState("") 
  const [token_description, setTokenDescription] = useState("")
  const [token_image, setTokenImage] = useState("")
  const [disply_token_image, set_disply_token_image] = useState("")
  const [source_code_link, seSourceCodeLink] = useState("")
  const [imagebaseurl, setImageUrl] = useState("") 
  const [image_base_url] = useState(IMAGE_BASE_URL+"/tokens/") 
  const [meta_keywords, set_meta_keywords] = useState("")
  const [meta_description, set_meta_description] = useState("")
  // const [category_row_id, set_category_row_id] = useState("")
  // const [category_name, set_category_name] = useState("")
  const [with_contract_address, set_with_contract_address] = useState(true)
  const [list_type, set_list_type] = useState(2)
  const [categories, set_categories] = useState([])
  const [category_name, set_category_name]= useState([])
  const [category_name_ids, set_category_name_ids]= useState([])  

  const [loader, set_loader] = useState("")
  const [err_symbol, setErrSymbol] = useState('') 
  const [err_token_name, setErrTokenName] = useState('')
  const [err_website_link, setErrWebsiteLink] = useState('')
  const [err_whitepaper, setErrWhitepaper] = useState('')
  const [err_token_max_supply, setErrTokenMaxSupply] = useState('')
  const [err_market_cap, setErrmarket_cap] = useState('') 
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

  const onSelect =(selectedList, selectedItem)=> { 
    category_name_ids.push(selectedItem._id)
    category_name.push(selectedItem)  
  }
 
  const onRemove = (selectedList, removedItem) => {
    category_name_ids.splice(category_name_ids.indexOf(removedItem._id), 1)
    category_name.splice(category_name.indexOf(removedItem), 1)
  }

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
  
  const getBusinessModels = () => 
  { 
    Axios.get(API_BASE_URL+"app/company_business_models", config).then(res => 
    {
      if (res.data.status) 
      {
        set_categories(res.data.message)
      }
    })
  }
 
    // const handleChange = selectedOption => 
    // {
    //    //console.log(selectedOption)
    //     set_category_row_id(selectedOption.value)
    //     set_category_name(selectedOption.label)
    // }
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
              // console.log(reader.result)
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
    setErrmarket_cap('') 
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
 
    if(with_contract_address === true)
    {
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
      else if(contract_address.length === 1)
      {
        
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
      setErrTokenDescription('The description field is required.')
      formValid = false
    }
    else if(token_description.length <= 10)
    {
        setErrTokenDescription('The description must be at least 4 characters.')
        formValid = false
    }
    else if(token_description.length > 5000)
    {
        setErrTokenDescription('The description must be less than 5000 characters in length.')
        formValid = false
    }  
    set_loader(true)
    const reqObj = {
      list_type : with_contract_address === false ? 3 : 2,
      wallet_address: wallet_address,
      symbol: symbol, 
      token_id: token_id,
      token_name: token_name,
      token_image: token_image,
      website_link: website_link,
      whitepaper: whitepaper,
      total_max_supply: token_max_supply,
      market_cap: market_cap, 
      token_description: token_description,
      source_code_link: source_code_link,
      explorer: explorer,
      exchange_link: exchange_link,
      community_address: community_address, 
      contract_addresses: with_contract_address === false ? [] : contract_address,
      meta_keywords : meta_keywords,
      meta_description : meta_description,
      category_row_id:category_name_ids
    } 

    if(formValid)
    { 
      
      Axios.post(API_BASE_URL+"markets/listing_tokens/update_token_details/", reqObj, config).then(response=> { 
        set_loader(false)
        // console.log(response)
        if(response.data.status)
        { 
          setTokenImage("")
          getTokenDetails() 
          // console.log(response.data)
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
            setErrTokenDescription(response.data.message.market_cap)
          }
          
          if(response.data.message.total_max_supply)
          {  
            setErrTokenMaxSupply(response.data.message.total_max_supply)
          }
          
          if(response.data.message.market_cap)
          {  
            setErrmarket_cap(response.data.message.market_cap)
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
  
 
  const getTokenDetails=()=>
  {
  
    Axios.get(API_BASE_URL+"markets/listing_tokens/individual_details/"+token_id, config)
    .then(response=>{
      if(response.data.status){ 
      
        console.log(response.data) 
        if(response.data.message.list_type !== 3)
          setContractAddress(response.data.message.contract_addresses)
        else
          setContractAddress([{network_type: "0", contract_address: ""}])
        
        setErrContractAddress("")  
        setSymbol(response.data.message.symbol) 
        setTokenName(response.data.message.token_name)
        setWebsiteLink(response.data.message.website_link)
        setWhitepaper(response.data.message.whitepaper) 
        setTokenMaxSupply(response.data.message.total_max_supply)
        setmarket_cap(response.data.message.market_cap) 
        setTokenDescription(response.data.message.token_description)
        set_meta_keywords(response.data.message.meta_keywords)
        set_meta_description(response.data.message.meta_description)
        set_category_name(response.data.message.category_row_id_array)
        set_category_name_ids(response.data.message.category_row_id)
        if(response.data.message.list_type == 3)
        {
          set_with_contract_address(false)
        }
        set_list_type(response.data.message.list_type)

        if(response.data.message.token_image)
        {
          set_disply_token_image(image_base_url+response.data.message.token_image)
        }
        else
        {
          set_disply_token_image(image_base_url+"default.png")
        }
        
        // set_category_row_id(response.data.message.category_row_id)
        // set_category_name(response.data.message.category_name)
        seSourceCodeLink(response.data.message.source_code_link) 

        if(response.data.message.explorer)
        {
          if(response.data.message.explorer.length < 1)
          {
            setExplorersList([""])
          }
          else
          {
            setExplorersList(response.data.message.explorer)
          }
        }
        

        if(response.data.message.exchange_link){
          if(response.data.message.exchange_link.length < 1){
            setExchangesList([""])
          }
          else{
            setExchangesList(response.data.message.exchange_link)
          }
          
        }
        

        if(response.data.message.community_address){
          if(response.data.message.community_address.length < 1){ 
            setCommunitysList([""])
          }
          else{
            setCommunitysList (response.data.message.community_address)
          }
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
    getBusinessModels() 
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
        "X-API-KEY": graphqlApiKEY
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
        <title>Edit Token</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="keywords" content="Cryptocurrency Market, cryptocurrency market sentiments, crypto market insights, cryptocurrency Market Analysis, NFT Price today, DeFi Token price, Top crypto gainers, top crypto loosers, Cryptocurrency market, Cryptocurrency Live market Price, NFT Live Chart, Cryptocurrency analysis tool." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta property="og:url" content={market_coinpedia_url} />
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

        <link rel="canonical" href={market_coinpedia_url} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>

      <div className="page">
        <div className="create_airdrop">
          <div className="container">
            <div className="for_padding">
              <div className=" token_steps">
               <div className="breadcrumb_block">
              <Link href={coinpedia_url}><a >Home</a></Link> <span> &#62; </span> 
              <Link href={market_coinpedia_url}><a >Live Market</a></Link><span> &#62; </span> Edit Token
               </div>
                <div className="row">
                  <div className="col-lg-9 col-md-9 col-8">
                  <h1>Edit Token</h1>
                <p className="token_form_sub_text">Enter all these fields to Edit tokens details</p>
                  </div>
                  <div className="col-lg-3 col-md-3 col-4">
                  <div className="quick_block_links main_page_coin_filter create_token_btn">
                      <Link href="/token"><a ><i className="la la-arrow-left"></i>Go Back</a></Link>
                      {/* <div class="text-right" onClick={() => router.back()}><a class="btn btn-primary"><i className="la la-arrow-left"></i>Go Back</a></div> */}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="row">
                    <div className="col-lg-3 col-md-4">
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
                    <div className="col-lg-9 col-md-8">
                          <div className="row">
                            <div className="col-lg-8 col-md-12">
                              <div className="row">
                                <div className="col-md-4">
                                </div>
                                <div className="col-md-8">
                                  <div className="input-appearance">
                                    {
                                      list_type == 3 ? 
                                      <>
                                      <label ><input type="radio" value={with_contract_address} checked={with_contract_address === true} onChange={()=>set_with_contract_address(true)} style={{appearance:'auto'}} />With Contract Address</label> &nbsp;
                                      <label ><input type="radio" value={with_contract_address} checked={with_contract_address === false} onChange={()=>set_with_contract_address(false)} style={{appearance:'auto'}} />Without Contract Address</label> <br/>
                                      </>
                                      :
                                      <>
                                      <label ><input type="radio" value={with_contract_address} checked={with_contract_address === true} onChange={()=>set_with_contract_address(true)} style={{appearance:'auto'}} disabled />With Contract Address</label> &nbsp;
                                      <label ><input type="radio" value={with_contract_address} checked={with_contract_address === false} onChange={()=>set_with_contract_address(false)} style={{appearance:'auto'}} disabled/>Without Contract Address</label> <br/>
                                      </>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <br/>
                      {
                        with_contract_address === true ?
                        <div className="row">
                        { 
                         contract_address.length > 0
                          ?
                          contract_address.map((e, i)=>
                          <div className="col-lg-8 col-md-12" key={i}>
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
                                        <input type="text" className="form-control" placeholder="Enter Address" value={e.contract_address} name="contract_address" onChange={(item)=> getTokenData(item, e.network_type , i, (item.target.value).toLowerCase())} />
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
                                        <button className="addmore_ico create-token-res" onClick={()=>AddMoreContractAddress()}><span><img src="/assets/img/add-more.svg" /> Add More Contract addresses</span></button>
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
                        :
                        null
                      }
                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Token Name<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-8">
                            <div className="form-custom"> 
                            
                            <div className="form-group input_block_outline">
                              {
                                with_contract_address === true ?
                                <input type="text" placeholder="Token Name" className="form-control" value={token_name} readOnly />
                                :
                                <input type="text" placeholder="Token Name" className="form-control" value={token_name} onChange={(e)=>setTokenName(e.target.value)} />
                              }
                              
                            </div>
                            <div className="error">{err_token_name}</div>
                          </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Symbol<span className="label_star">*</span></label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom"> 
                                <div className="form-group input_block_outline">
                                  {
                                    with_contract_address === true ?
                                    <input type="text" placeholder="Symbol" className="form-control" value={symbol} readOnly/>
                                    :
                                    <input type="text" placeholder="Symbol" className="form-control" value={symbol} onChange={(e)=>setSymbol(e.target.value)}/>
                                  }
                                  
                                </div>
                                <div className="error">{err_symbol}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Select Category</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                <Multiselect  className="form-control" placeholder="Select Event Tags"
                                    selectedValues={category_name}
                                    options={categories} // Options to display in the dropdown
                                    onSelect={onSelect} // Function will trigger on select event
                                    onRemove={onRemove} // Function will trigger on remove event
                                    displayValue="business_name" // Property name to display in the dropdown options
                                /> 
                                </div>
                                 <div className="error">{err_website_link}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Source code Link</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="text" placeholder="Source code Link" className="form-control" value={source_code_link} onChange={(e)=>seSourceCodeLink(e.target.value)}/>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                  

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Website Link</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="text" placeholder="Website Link" className="form-control" value={website_link} onChange={(e)=>setWebsiteLink(e.target.value)}/>
                                  <div className="error">{err_website_link}</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Token Max Supply</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <div className="input-group">
                                    {
                                      with_contract_address === true ?
                                      <input type="number" placeholder="Token Max Supply" className="form-control" aria-label="Username" aria-describedby="basic-addon1"  value={token_max_supply} onChange={(e)=>setTokenMaxSupply(e.target.value)} readOnly/>
                                      :
                                      <input type="number" placeholder="Token Max Supply" className="form-control" aria-label="Username" aria-describedby="basic-addon1"  value={token_max_supply} onChange={(e)=>setTokenMaxSupply(e.target.value)}/>
                                    }
                                    
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
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                            <label htmlFor="email">Market Cap</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  {
                                    with_contract_address === true ?
                                    <input type="number" placeholder="Market Cap" value={market_cap} className="form-control" onChange={(e)=>setmarket_cap(e.target.value)} readOnly/> 
                                    :
                                    <input type="number" placeholder="Market Cap" value={market_cap} className="form-control" onChange={(e)=>setmarket_cap(e.target.value)} /> 
                                  }
                                </div>
                                <div className="error">{err_market_cap}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label htmlFor="email">Whitepaper</label>
                            </div>
                            <div className="col-md-8">
                              <div className="form-custom">
                                <div className="form-group input_block_outline">
                                  <input type="text" placeholder="Whitepaper" className="form-control" value={whitepaper} onChange={(e)=>setWhitepaper(e.target.value)}/>
                                </div>
                                <div className="error">{err_whitepaper}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                       
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
                                token_image  ?
                                <img src={token_image} height="30" alt="token image" width="30"/>  
                                : 
                                disply_token_image  ?
                                <img src={disply_token_image} height="50" alt="token image" width="50"/>  
                                : 
                                null
                              }
                            </div>
                          </div>
                        </div>
                      </div>
            
                      <div className="row">
                        <div className="col-lg-8 col-md-12">
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
                        <div className="col-lg-8 col-md-12">
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
                                    <button className="addmore_ico create-token-res" onClick={addMoreExchange}><span><img src="/assets/img/add-more.svg" /> Add More Exchange</span></button>
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
                                      <input autoComplete="off" type="text" name="link" className="form-control" placeholder="Exchange URL" value={exchange_link} onChange={e => handleExchangeChange(e, 0)} />
                                    </div>
                                  </div>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
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
                                          <input autoComplete="off" type="text" placeholder="Explorer URL" className="form-control" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                        </div>
                                      
                                        <button className="addmore_ico create-token-res" onClick={addMoreExplorers}><span><img src="/assets/img/add-more.svg" /> Add More Explorer</span></button>
                                      </div>
                                    </div>
                                </div>
                                : 
                                  <div >
                                    <div className="form-custom create_token_top_space">
                                      <div className="form-group input_block_outline">
                                        <input autoComplete="off" type="text" placeholder="Explorer URL" className="form-control" name="link" value={item} onChange={e => handleExplorersChange(e, i)} />
                                      </div>
                                      <p className="remove_block"><span onClick={() =>{clickOnExplorerDelete(i)}}>Remove</span></p>
                                    </div>
                                  </div>
                                  
                              )
                              :
                              <div >
                                      <div className="form-custom create_token_no_space">
                                        <div className="form-group input_block_outline">
                                          <input autoComplete="off" type="text" placeholder="Explorer URL" className="form-control" name="link" value={explorer} onChange={e => handleExplorersChange(e, 0)} />
                                        </div>
                                      </div>
                                    </div>
                            }
                            </div>
                          </div>
                        </div>
                      </div>


                      <div className="row">
                        <div className="col-lg-8 col-md-12">
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
                                      <button className="addmore_ico create-token-res" onClick={addMoreCommunity}><span><img src="/assets/img/add-more.svg" /> Add More Community</span></button>
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
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label>Meta Keywords</label>
                            </div>
                            <div className="col-md-8">
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
                      </div>
                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4">
                              <label>Meta Description</label>
                            </div>
                            <div className="col-md-8">
                              <div>
                                  <div className="form-custom create_token_no_space">
                                    <div className="form-group input_block_outline">
                                      <input autoComplete="off" type="text" className="form-control" placeholder="Meta Description"  value={meta_description} onChange={(e) => set_meta_description(e.target.value)}/>
                                    </div>
                                  </div>
                                </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-8 col-md-12">
                          <div className="row">
                            <div className="col-md-4"></div>
                            <div className="col-md-8">
                              <div className="text-left review_upload_token mt-3">
                                 <button className="dsaf" onClick={() =>{createNewToken()}}>
                                    {loader ? (
                                      <div className="loader"><span className="spinner-border spinner-border-sm "></span>Review and Update</div>
                                      ) : (
                                          <>Review and Update</>
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
      

    if(userAgent.user_token)
    {
        if(userAgent.user_email_status)
        {
            return { props: { userAgent: userAgent, config: config(user_token), token_id: query.edit_token_id}} 
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