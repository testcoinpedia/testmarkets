import React , {useState, useEffect,useRef} from 'react';   
import Axios from 'axios';
import Link from 'next/link' 
import Head from 'next/head';
import {x_api_key, API_BASE_URL,separator, app_coinpedia_url, coinpedia_url,market_coinpedia_url, website_url,config} from '../../../components/constants'
import Popupmodal from '../../../components/popupmodal' 
import { useRouter } from 'next/router'
import moment from 'moment' 
import dynamic from 'next/dynamic'; 
import cookie from "cookie"
import JsCookie from "js-cookie"
import { Editor } from '@tinymce/tinymce-react';
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css"

export default function CreateLauchPad() 
{  

  const router = useRouter()
  const {launchpad_token_id}= router.query
  // console.log(launchpad_token_id)

  const Multiselect = dynamic(
    () => import('multiselect-react-dropdown').then(module => module.Multiselect),
    {
        ssr: false
    }
  )
 
var object =  {
  launch_pad_type :"", 
  title: "",
  start_date : "",
  end_date: "",
  tokens_sold: "",
  price: "",
  soft_cap: "", 
  where_to_buy_title: "",
  where_to_buy_link: "", 
  percentage_total_supply: "",
  accept_payment_type: [],
  access_type: "",
  how_to_participate: "",
 
} 

  

  const editorRef = useRef(null) 
  const [loader, set_loader] = useState("")
  const [validError, setValidError] = useState("")
  const [alert_message, setAlertMessage] = useState('')
  const [element,set_element]=useState([])
  const [payment_types,set_payment_types]=useState([])
  const [launch_pad, setLaunchPadList] = useState([])
  const [err_launch_pad, set_err_launch_pad] = useState([])
  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
  const [empty_alert_message, setEmptyAlertMessage]= useState("")
  const [launch_pad_type, set_launch_pad_type]= useState("")

  const [start_date, setStartDate] = useState(new Date())
  const [end_date, setEndDate] = useState(new Date())
  const [tokens_sold, set_tokens_sold]= useState("")
  const [price, set_price]= useState("")
  const [user_token, set_user_token]= useState(JsCookie.get('user_token'))
  const [soft_cap, set_soft_cap]= useState("")
  const [where_to_buy_title, set_where_to_buy_title]= useState("")
  const [where_to_buy_link, set_where_to_buy_link]= useState("")
  const [percentage_total_supply, set_percentage_total_supply]= useState("")
  const [access_type, set_access_type]= useState("")
  const [how_to_participate, set_how_to_participate]= useState("")
  const [accept_payment_type, set_accept_payment_type]= useState([])
  const [accept_payment_type_ids, set_accept_payment_type_ids]= useState([])
  const [accept_payment_names, set_accept_payment_names]= useState([])
  const [confirm_remove_modal, set_confirm_remove_modal]=useState(false)
  const [today_date, set_today_date]= useState("")
  const [active_launchpad_row_id, set_active_launchpad_row_id]= useState("")
  // const [token_id,set_token_id]= useState(launchpad_token_id)
  const [err_launchpad, set_err_launchpad]= useState("")
  const [err_tokenlaunchpa, set_err_tokenlaunchpa]= useState("")
  const [err_start_date, set_err_start_date]= useState("")
  const [err_end_date, set_err_end_date]= useState("")
  const [err_tokens_sale, set_err_tokens_sale]= useState("")
  const [err_price, set_err_price]= useState("")
  const [err_wheretobuy, set_err_wheretobuy]= useState("")
  const [err_wheretobuylink, set_err_wheretobuylink]= useState("")
  const [err_total_supply, set_err_total_supply]= useState("")
  const [err_accept, set_err_accept]= useState("")
  const [err_access_type, set_err_access_type]= useState("")
  const [err_airdrop, set_err_airdrop]= useState("")
 
 
  const [edit_launchpad_row_id, set_edit_launchpad_row_id] = useState('')
  const [edit_launchpad_object, set_edit_launchpad_object] = useState('')

  useEffect(()=>
  { 
    acceptPaymentType()
    getTokenDetails() 
  },[launchpad_token_id])

  var yesterday = moment().subtract( 1, 'day' )
  var valid = function( current ) {
    return current.isAfter( yesterday )
  }

  var valid2 = function( current ) {
    return current.isAfter( yesterday )
  }

  let inputProps = {
    placeholder: 'Complete work within',
    name: 'end_date_n_time',
    className: 'field__input',
    useref: 'end_date_n_time', 
    readOnly:true
  }

  let inputProps2 = {
    placeholder: 'Complete work within',
    name: 'end_date_n_time',
    className: 'field__input',
    useref: 'end_date_n_time', 
    readOnly:true
  }

  const editLaunchpadDetails = (object)=>
  {
    // console.log(object)
    set_edit_launchpad_object(object)
    set_edit_launchpad_row_id(parseInt(object._id))
    set_launch_pad_type(object.launch_pad_type)

    setStartDate(moment.utc(object.start_date).format("YYYY-MM-DD"))
    setEndDate(moment.utc(object.end_date).format("YYYY-MM-DD"))

    set_tokens_sold(parseInt(object.tokens_sold))
    set_access_type(object.access_type)
    set_soft_cap(object.soft_cap)
    set_price(parseFloat(object.price))
    set_where_to_buy_title(object.where_to_buy_title)
    set_where_to_buy_link(object.where_to_buy_link)
    set_percentage_total_supply(parseFloat(object.percentage_total_supply))
    set_how_to_participate(object.how_to_participate)
    set_accept_payment_type_ids(object.accept_payment_type)
    set_accept_payment_type(object.accept_payment_names)
  }
  
  const removeLaunchpad = (id)=>
  {
    const reqObj = {
      token_id : launchpad_token_id,
      launchpad_row_id:id
      } 
      setModalData({icon: "", title: "", content: ""})
      if(edit_launchpad_row_id == id){
        createLaunchpad()
      }
    Axios.post(API_BASE_URL+"markets/listing_tokens/remove_launch_pad", reqObj, config(user_token))
    .then(res=>
    {
      // console.log(res.data)
        if(res.data.status)
        {
          getTokenDetails()
          setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message})
         
        }
    })

  }
  
  const btnremove=(id)=>
  { 
    let ele= <div className="remove_modal">
      <div className="modal" id="removeConnection" data-backdrop="static" data-keyboard="false">
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close"   data-dismiss="modal">&times;</button>
              <div className="text-center">
                <img src="/assets/img/cancel.png" />
                <h4 className="modal-title mb-2">Launch Pad!</h4>
                <p>Do you really want to remove this Launchpad ?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" onClick={() => removeLaunchpad(id)} data-dismiss="modal"> Remove </button>
            </div>

          </div>
        </div>
      </div> 
    </div>
    set_element(ele)
  }   
  
  const getTokenDetails = ()=>
  {
    //console.log(launchpad_token_id)
    Axios.get(API_BASE_URL+"markets/listing_tokens/individual_details/"+launchpad_token_id, config(user_token)).then(res=>
    {
      //  console.log(res.data)
        if(res.data.status)
        {
          set_today_date(res.data.message.today_date)
          //set_payment_types(res.data.message.payment_types)
          if(res.data.message.launch_pads_data.length)
          {
            setLaunchPadList(res.data.message.launch_pads_data)
            
          }
          else
          {
            setLaunchPadList([])
          }
        }
    })
  }

    const acceptPaymentType = ()=>
    {
        Axios.get("https://markets-nodejs-api-l9lg8.ondigitalocean.app/app/payment_type", config(user_token)).then(res=>
        {
            if(res.data.status)
            {
            set_payment_types(res.data.message)
            }
        })
    }
  
  const createLaunchpad = () =>
  {   
    set_edit_launchpad_object([])
    set_edit_launchpad_row_id("")
    set_launch_pad_type([])
    setStartDate(new Date())
    setEndDate(new Date())
    set_tokens_sold("")
    set_access_type([])
    set_soft_cap("")
    set_price("")
    set_where_to_buy_title("")
    set_where_to_buy_link("")
    set_percentage_total_supply("")
    set_how_to_participate("")
    set_accept_payment_type_ids([])
    set_accept_payment_type([])
    document.getElementById("myForm").reset() 
  }

  const OnSubmitData = ()=>
  {
    
    setModalData({ icon: "", title: "", content: "" })
    let formIsValid = true  
    
    if(launch_pad_type=="" && tokens_sold=="")
    {
      formIsValid=false
      set_err_launchpad("The Launchpad Type and Tokens for sale field is required. ")
    }
    else if(launch_pad_type=="")
    {
      formIsValid=false
      set_err_launchpad("The Launch Type field is required. ")
    }
    else if(tokens_sold=="")
    {
      formIsValid=false
      set_err_launchpad("The Tokens for sale field is required.")
    }
    else{
      set_err_launchpad("")
    }

    // if(launch_pad_type=="" && tokens_sold=="")
    // {
    //   formIsValid=false
    //   set_err_tokenlaunchpa("The Launchpad Type and Tokens for sale field is required. ")
    // }
    // else if(tokens_sold=="")
    // {
    //   formIsValid=false
    //   set_err_tokens_sale("The Tokens for sale field is required.")
    // }
    // else{
    //   set_err_tokens_sale("")
    // }
    
    if(access_type=="")
    {
      formIsValid=false
      set_err_access_type("The Access type field is required.")
    }
    else{
      set_err_access_type("")
    }
    if(start_date=="")
    {
      formIsValid=false
      set_err_start_date("The Start date field is required.")
    }
    else{
      set_err_start_date("")
    }
    if(end_date=="")
    {
      formIsValid=false
      set_err_end_date("The End date field is required.")
    }
    else{
      set_err_end_date("")
    }
    if(price=="")
    {
      formIsValid=false
      set_err_price("The Price field is required.")
    }
    else if(price <=0 )
    {
      formIsValid=false
      set_err_price("The Price field should not be zero")
    }
    else{
      set_err_price("")
    }

    if(where_to_buy_title=="")
    {
      formIsValid=false
      set_err_wheretobuy("The Where to buy title field is required.")
    }
    else if(where_to_buy_title.length < 4) 
    {
      formIsValid=false
      set_err_wheretobuy("The Where to buy title field must be atleast 4 characters in length.")
    }
    else
    {
      set_err_wheretobuy("")
    }

    if(where_to_buy_link=="")
    {
      formIsValid=false
      set_err_wheretobuylink("The Where to buy link field is required.")
    }
    else if(!where_to_buy_link.includes('.')) 
    {
      formIsValid = false
      set_err_wheretobuylink("The Where to buy link field must be contain valid link.")
    }
    else
    {
      set_err_wheretobuylink("")
    }
    
    if(percentage_total_supply=="")
    {
      formIsValid=false
      set_err_total_supply("The Percentage total supply field is required.")
    }
    else if(percentage_total_supply <=0 || percentage_total_supply > 100)
    {
      formIsValid=false
      set_err_total_supply("The total supply percentage must be greater than 0 and less than 100.")
    }
    else 
    {
      set_err_total_supply("")
    }
    if(accept_payment_type=="")
    {
      formIsValid=false
      set_err_accept("The Accept payment type field is required.")
    }
    else
    {
      set_err_accept("")
    }
    if(how_to_participate=="")
    {
      formIsValid=false
      set_err_airdrop("The About airdrop field is required.")
    }
    else if(how_to_participate.length < 11) 
    {
      formIsValid=false
      set_err_airdrop("The About airdrop field must be atleast 4 character.")
    }
    else{
      set_err_airdrop("")
    }
    
    if(!formIsValid)
    {
      return
    }

    if(edit_launchpad_row_id)
    {
      var req_end_date = moment(end_date).add(1, 'days')
      var req_start_date = moment(start_date).add(1, 'days')
    }
    else
    {
      var req_end_date = end_date
      var req_start_date = start_date
    }

    setValidError("") 
    set_loader(true)
    const reqObj = {
      token_id : launchpad_token_id,
      launchpad_row_id:edit_launchpad_row_id, 
      launch_pad_type:launch_pad_type,
      start_date: req_start_date,
      end_date: req_end_date,
      tokens_sold:tokens_sold,
      price:price,
      where_to_buy_title:where_to_buy_title,
      where_to_buy_link:where_to_buy_link,
      soft_cap:soft_cap,
      percentage_total_supply:percentage_total_supply,
      accept_payment_type:accept_payment_type_ids,
      access_type:access_type,
      how_to_participate:how_to_participate

    } 
    
    Axios.post(API_BASE_URL+'markets/listing_tokens/update_launch_pad', reqObj, config(user_token)).then(res=>
    { 
      set_loader(false)
        if(res.data.status)
        { 
            setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message}) 
            getTokenDetails()
            if(edit_launchpad_row_id=="")
            {
                createLaunchpad()
            }
        }
        else
        { 
          setModalData({icon: "/assets/img/close_error.png", title: "Something went wrong ", content: res.data.message.alert_message})
          
          if(res.data.message.innerErr)
          {
            if(res.data.message.innerErr.launch_pad_type){
              setValidError(res.data.message.innerErr.launch_pad_type) 
            }
            if(res.data.message.innerErr.accept_payment_type){
              setValidError(res.data.message.innerErr.accept_payment_type)
            }
            if(res.data.message.innerErr.launch_pad_type){
              setValidError(res.data.message.innerErr.launch_pad_type)
            }
            if(res.data.message.innerErr.title){
              setValidError(res.data.message.innerErr.title)
            }  
            if(res.data.message.innerErr.start_date){
              setValidError(res.data.message.innerErr.start_date)
            }  
            if(res.data.message.innerErr.end_date){
              setValidError(res.data.message.innerErr.end_date)
            }  
            if(res.data.message.innerErr.tokens_sold){
              setValidError(response.data.message.innerErr.tokens_sold)
            }  
            if(res.data.message.innerErr.price){
              setValidError(res.data.message.innerErr.price)
            }  
            if(res.data.message.innerErr.soft_cap){
              setValidError(res.data.message.innerErr.soft_cap)
            }   
            if(response.data.message.innerErr.where_to_buy_title){
              setValidError(res.data.message.innerErr.where_to_buy_title)
            }  
            if(res.data.message.innerErr.where_to_buy_link){
              setValidError(res.data.message.innerErr.where_to_buy_link)
            }  
            if(res.data.message.innerErr.percentage_total_supply){
              setValidError(res.data.message.innerErr.percentage_total_supply)
            }  
          
            if(res.data.message.innerErr.access_type){
              setValidError(res.data.message.innerErr.access_type)
            }  
            if(res.data.message.innerErr.how_to_participate){
              setValidError(res.data.message.innerErr.how_to_participate)
            }
          }
        }
    }) 

  }
 
    const makeJobSchema=()=>{  
        return { 
            "@context":"http://schema.org/",
            "@type":"Organization",
            "name":"Create or Edit Launchpad",
            "url":"https://markets.coinpedia.org",
            "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
            "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        }  
    } 


    const onSelect =(selectedList, selectedItem)=> {  
        accept_payment_type_ids.push(selectedItem._id)
        accept_payment_type.push(selectedItem) 
    }

    const onRemove = (selectedList, removedItem) => {
        accept_payment_type_ids.splice(accept_payment_type_ids.indexOf(removedItem._id), 1)
        accept_payment_type.splice(accept_payment_type.indexOf(removedItem), 1)
    }


 
  return(
    <>
      <Head>
        <title>Create Update Launchpad</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="keywords" content="Cryptocurrency Market, cryptocurrency market sentiments, crypto market insights, cryptocurrency Market Analysis, NFT Price today, DeFi Token price, Top crypto gainers, top crypto loosers, Cryptocurrency market, Cryptocurrency Live market Price, NFT Live Chart, Cryptocurrency analysis tool." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta property="og:url" content={website_url}/>
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
        <div>
          <div className="container">
            <div className="col-md-12">
              <div className="breadcrumb_block">
              <Link href={coinpedia_url}><a >Home</a></Link> <span> &#62; </span> 
              <Link href={market_coinpedia_url}><a >Live Market</a></Link> <span> &#62; </span>
              <Link href="/token/"><a>Tokens</a></Link><span> &#62; </span>Launchpad
                  </div>
                 
              <div className="row">
                <div className="col-lg-5 col-md-12">
                  <div className="main_create_form">
                    <h1 className="create-token-res">Launchpad List</h1>
                    <p className="token_form_sub_text">List of Ongoing, Upcoming and Completed launchpads</p>
                    <div className="col-md-12 launchpad_list_title">
                      <div className="row">
                        <div className="col-md-4 col-4">
                          <h4>Sale Tokens</h4>
                        </div>
                        <div className="col-md-4 col-4">
                          <h4>Start-End</h4>
                        </div>
                        <div className="col-md-4 col-4">
                          <h4>Action</h4>
                        </div>
                      </div>
                    </div>

                      {
                        launch_pad.length > 0 ?
                        launch_pad.map((e, i)=> 
                        <div className={"col-md-12 launchpad_list_content "+(edit_launchpad_row_id == e._id ? " active_launchpad":"")}>
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
                          <div className="col-md-2 col-2">
                            {
                              edit_launchpad_row_id == e._id ? 
                              <img src="/assets/img/launchpad-active.svg" className="active_launchpad_list_icon" />
                              :
                              <img src="/assets/img/launchpad.svg" className="launchpad_list_icon" onClick={()=>editLaunchpadDetails(e)}/>
                            }
                            
                            
                          </div>
                        </div>
                        </div>
                      )                                       
                      :
                      <div className="col-md-12 launchpad_list_content active_launchpad">
                          Sorry, No data found
                      </div>
                      }   
                  </div>
                </div>
              
              <div className="col-lg-7 col-md-12">
                <form id="myForm" >
                <div>
                  <div className="token_steps">
                    <div className="row">
                      <div className="col-md-6">
                        {
                          !edit_launchpad_row_id ? 
                          <>
                          <h1 className="create-token-res">Create New Launch Pad</h1>
                          <p className="token_form_sub_text">Enter all these fields to create Launchpad</p>
                          </>
                          :
                          <>
                          <h1 className="create-token-res">Update Launch Pad</h1>
                            <p className="token_form_sub_text">Enter all these fields to update Launchpad</p>
                          </>
                        }
                      </div>
                      <div className="col-md-6 text-right">
                        {
                            edit_launchpad_row_id ? 
                            <>
                            <button type="button" onClick={()=>btnremove(edit_launchpad_row_id)} className="edit_launchpad" data-toggle="modal" data-target="#removeConnection">Remove</button>
                            <button type="button" onClick={()=> createLaunchpad()} className="edit_launchpad" >Go Back</button>
                            </>
                            :
                            <Link href="/token" ><a className="edit_launchpad"><i className="la la-arrow-left"></i>Go Back</a></Link>
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="token_list_table">
                    <div className="row">
                        <div className="col-md-4">
                          <label htmlFor="email">Tokens For sale<span className="label_star">*</span></label>
                        </div>
                        <div className="col-md-7 mb-4">
                          <div className="input-group">
                            <div className="input-group-append">
                            <select  name="launch_pad_type" className="form-control select_launchpad_type" value={launch_pad_type} onChange={(e)=>set_launch_pad_type(e.target.value)}>
                                    <option value="">Type</option>
                                    <option value="1">ICO</option>
                                    <option value="2">IDO</option>
                                    <option value="3">IEO</option>
                                  </select>
                            </div>
                            <input type="number" className="form-control" placeholder="Number of Tokens for Sale" value={tokens_sold} onChange={(e)=>set_tokens_sold(e.target.value)}/>
                           </div>
                           <div className="error">{err_launchpad} </div>
                           <div className="error">{err_tokenlaunchpa}</div>
                        </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="access_type">Enter Access Type<span className="label_star">*</span></label>
                      </div>
                      <div className="col-md-7 mb-4">
                        <div className="form-group input_block_outline">
                          <select name="access_type"  value={access_type} onChange={(e)=>set_access_type(e.target.value)} >
                            <option value="">Select Access Type</option>
                            <option value="1">Public</option>
                            <option value="2">Private</option> 
                          </select>
                        </div>
                        <div className="error">{err_access_type}</div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="email">Start Date<span className="label_star">*</span></label> 
                      </div>
                      <div className="col-md-7 mb-4">
                        <div className="form-group input_block_outline">
                           {/* <input type="date"  className="form-control" value={start_date} onChange={(e) => setStartDate(e.target.value)} /> */}
                           <Datetime inputProps={ inputProps }  dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={ valid }   name="end_date_n_time" value={start_date} onChange={(e) => setStartDate(e)}/>
                        </div>
                        <div className="error">{err_start_date}</div>
                      </div>
                    </div> 
                    {/* isValidDate={ valid } inputProps={ inputProps2 } */}
                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="email">End Date<span className="label_star">*</span></label>
                      </div>
                      <div className="col-md-7 mb-4">
                        <div className="form-group input_block_outline">
                          {/* <input type="date"  className="form-control" value={end_date} onChange={(e) => setEndDate(e.target.value)} /> */}
                          <Datetime inputProps={ inputProps2 }  dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={ valid2 }  name="end_date_n_time" value={end_date} onChange={(e) => setEndDate(e)}/>
                        </div>
                        <div className="error">{err_end_date}</div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="price"> Enter Price<span className="label_star">*</span></label>
                      </div>
                      <div className="col-md-7 mb-4">
                        <div className="form-group input_block_outline">
                          <input type="number" placeholder="Eg.,$00.00"  value={price} onChange={(e)=>set_price(e.target.value)}  />
                        </div>
                        <div className="error">{err_price}</div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="price">Soft Cap</label>
                      </div>
                      <div className="col-md-7 mb-4">
                        <div className="form-group input_block_outline">
                          <input type="number" placeholder="Soft cap"  value={soft_cap} onChange={(e)=>set_soft_cap(e.target.value)}  />
                        </div>
                        <div className="error"></div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                        <label htmlFor="where_to_buy_title">Enter Where to Buy Title<span className="label_star">*</span></label>
                      </div>
                      <div className="col-md-7 mb-4">
                        <div className="form-group input_block_outline">
                          <input autoComplete="off" type="text" placeholder="Where to Buy Title"   value={where_to_buy_title} onChange={(e)=>set_where_to_buy_title(e.target.value)} />
                        </div>
                        <div className="error">{err_wheretobuy}</div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4">
                      <label htmlFor="where_to_buy_link">Enter Where to Buy Link<span className="label_star">*</span></label>
                      </div>
                      <div className="col-md-7 mb-4">
                        <div className="form-group input_block_outline">
                          <input autoComplete="off" type="text" placeholder="Where to Buy Link" name="where_to_buy_link"  value={where_to_buy_link} onChange={(e)=>set_where_to_buy_link(e.target.value)}  />
                        </div>
                        <div className="error">{err_wheretobuylink}</div>
                      </div>
                    </div>

                        <div className="row">
                          <div className="col-md-4">
                          <label htmlFor="percentage_total_supply">Enter % of Total Supply<span className="label_star">*</span></label>
                          </div>
                          <div className="col-md-7 mb-4">
                            <div className="form-group input_block_outline">
                              <input type="number" placeholder="% of Total Supply"  value={percentage_total_supply} onChange={(e)=>set_percentage_total_supply(e.target.value)} />
                            </div>
                            <div className="error">{err_total_supply}</div>
                          </div>
                        </div>
                
                        <div className="row">
                          <div className="col-md-4">
                            <label htmlFor="accept_payment_type">Accept<span className="label_star">*</span></label>
                          </div>
                          <div className="col-md-7 mb-4">
                            <div className="form-group input_block_outline multi-select-dropdown-input" style={{padding: '0 10px'}}>
                              <Multiselect  className="form-control" 
                                selectedValues={accept_payment_type}
                                options={payment_types} // Options to display in the dropdown
                                onSelect={onSelect} // Function will trigger on select event
                                onRemove={onRemove} // Function will trigger on remove event
                                displayValue="payment_name" // Property name to display in the dropdown options
                                /> 
                            </div>
                            <div className="error">{err_accept}</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            <label htmlFor="how_to_participate">Enter About Airdrop<span className="label_star">*</span></label>
                          </div>
                          <div className="col-md-7 mb-4">
                            <div className="form-group input_block_outline">
                              <Editor apiKey="s6mr8bfc8y6a2ok76intx4ifoxt3ald11z2o8f23c98lpxnk" 
                              onEditorChange={(e)=>set_how_to_participate(e)}
                              value={how_to_participate} 
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
                            <div className="error">{err_airdrop}</div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-4">
                            
                          </div>
                          <div className="col-md-7">
                            <div className="review_upload_token create-launchpad-submit-button mt-3">
                            {
                              !edit_launchpad_row_id ? 
                                <button type="button" onClick={()=> OnSubmitData()}>
                                  {loader ? (
                                        <div className="loader"><span className="spinner-border spinner-border-sm "></span>Create Launch pad</div>
                                        ) : (
                                            <>Create Launch pad</>
                                        )}
                                </button>
                              :
                              <button type="button" onClick={()=> OnSubmitData()}>
                                {loader ? (
                                        <div className="loader"><span className="spinner-border spinner-border-sm "></span>Update Launch pad</div>
                                        ) : (
                                            <>Update Launch pad</>
                                        )}
                              </button>
                            }
                            
                          </div> 
                          </div>
                        </div>
                  
                  
                        
                      </div> 
                    </div>
                  </form>
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
              <h4>Updated launchpad for this token </h4>
              <p>{alert_message}</p>
            </div>
          </div> 
        </div>
      </div>  */}

      {/* <div className={"modal connect_wallet_error_block"+ (empty_alert_message ? " collapse show" : "")}> 
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal"  onClick={()=>redirectToPage()}>&times;</button>
              <h4>Please add new launchpads, Thankyou!! </h4>
              <p>{empty_alert_message}</p>
            </div>
          </div> 
        </div>
      </div> */}

      {element}
      {modal_data.title ? <Popupmodal name={modal_data} /> : null}
    </>
  )
}

export async function getServerSideProps({query, req}) 
{ 
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  if(!userAgent.user_token) 
  {
      return {
          redirect: {
              destination: app_coinpedia_url+'login',
              permanent: false,
          }
      }
  }
  else 
  {
      if(userAgent.user_email_status)
      { 
          return { props: { userAgent: userAgent, config: config(userAgent.user_token) } }
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
}
