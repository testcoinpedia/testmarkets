
import React , {useState, useEffect,useRef} from 'react';   
import Axios from 'axios';
import Link from 'next/link' 
import Head from 'next/head';
import {x_api_key, API_BASE_URL,separator, app_coinpedia_url, website_url,config} from '../../../components/constants'
import Popupmodal from '../../../components/popupmodal' 
import { useRouter } from 'next/router'
import moment from 'moment' 
import Datetime from "react-datetime"
import "react-datetime/css/react-datetime.css"
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import dynamic from 'next/dynamic'; 
import cookie from "cookie"
import JsCookie from "js-cookie"
import { Editor } from '@tinymce/tinymce-react';

export default function CreateLauchPad({config, token_id}) {  
  const Multiselect = dynamic(
    () => import('multiselect-react-dropdown').then(module => module.Multiselect),
    {
        ssr: false
    }
)

let inputProps = {
  className: 'my_input', 
  readOnly:true
}

let inputProps2 = {
  className: 'my_input',
  readOnly:true
} 
 
var object =  {
  launch_pad_type :"", 
  title: "",
  startDate : "",
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
  err_launch_pad_type :"" 
} 

  

  const editorRef = useRef(null)
  
  const router = useRouter()
  const [validError, setValidError] = useState("")
  const [alert_message, setAlertMessage] = useState('')
  const [element,set_element]=useState([])
  const [payment_types,set_payment_types]=useState([])
  const [launch_pad, setLaunchPadList] = useState([])
  const [err_launch_pad, set_err_launch_pad] = useState([])
  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
  const [empty_alert_message, setEmptyAlertMessage]= useState("")
  const [launch_pad_type, set_launch_pad_type]= useState("")
  const [start_date, set_start_date]= useState("")
  const [end_date, set_end_date]= useState("")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [tokens_sold, set_tokens_sold]= useState("")
  const [price, set_price]= useState("")
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
  
  const [err_launchpad, set_err_launchpad]= useState("")
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
    getTokenDetails() 
  },[])

  const editLaunchpadDetails = (object)=>
  {
     console.log(object)
    set_edit_launchpad_object(object)
    set_edit_launchpad_row_id(parseInt(object._id))
    set_launch_pad_type(object.launch_pad_type)
    setStartDate(new Date(object.start_date))
    setEndDate(new Date(new Date(object.end_date)))
    set_tokens_sold(parseInt(object.tokens_sold))
    set_access_type(object.access_type)
    set_soft_cap(object.soft_cap)
    set_price(parseFloat(object.price))
    set_where_to_buy_title(object.where_to_buy_title)
    set_where_to_buy_link(object.where_to_buy_link)
    set_percentage_total_supply(parseFloat(object.percentage_total_supply))
    set_how_to_participate(object.how_to_participate)
    set_accept_payment_type_ids(object.accept_payment_type)
    set_accept_payment_type(object.accept_payment_type)
   
  }
  
  const removeLaunchpad = (id)=>
  {
    const reqObj = {
      token_id : token_id,
      launchpad_row_id:id
      } 
      setModalData({icon: "", title: "", content: ""})
      if(edit_launchpad_row_id==id){
        createLaunchpad()
      }
    Axios.post(API_BASE_URL+"markets/listing_tokens/remove_launch_pad", reqObj, config)
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
                <p>Do you want to really remove this Launchpad ?</p>
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
    Axios.get(API_BASE_URL+"markets/listing_tokens/individual_details/"+token_id, config)
    .then(res=>
    {
      // console.log(res.data)
        if(res.data.status)
        {
          if(res.data.message.launch_pads_data.length)
          {
            setLaunchPadList(res.data.message.launch_pads_data)
            set_payment_types(res.data.message.payment_types)
          }
          else
          {
            setLaunchPadList([])
          }
        }
    })
  }
  
  var yesterday = moment().subtract(1, "day")
  function valid(current) 
  {  
    return current.isAfter(yesterday)
  }
  
  const valid2=(current)=> 
  {    
    return current.isAfter(yesterday)
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
    if(launch_pad_type=="")
    {
      formIsValid=false
      set_err_launchpad("Launch Type field is required.")
    }
    else{
      set_err_launchpad("")
    }
    if(tokens_sold=="")
    {
      formIsValid=false
      set_err_tokens_sale("Tokens for sale field is required.")
    }
    else{
      set_err_tokens_sale("")
    }
    if(access_type=="")
    {
      formIsValid=false
      set_err_access_type("Access type field is required.")
    }
    else{
      set_err_access_type("")
    }
    if(startDate=="")
    {
      formIsValid=false
      set_err_start_date("Start date field is required.")
    }
    else{
      set_err_start_date("")
    }
    if(endDate=="")
    {
      formIsValid=false
      set_err_end_date("End date field is required.")
    }
    else{
      set_err_end_date("")
    }
    if(price=="")
    {
      formIsValid=false
      set_err_price("Price field is required.")
    }
    else if(price <=0 )
    {
      formIsValid=false
      set_err_price("Price field should not be zero")
    }
    else{
      set_err_price("")
    }

    if(where_to_buy_title=="")
    {
      formIsValid=false
      set_err_wheretobuy("Where to buy title field is required.")
    }
    else if(where_to_buy_title.length < 4) 
    {
      formIsValid=false
      set_err_wheretobuy("Where to buy title field must be atleast 4 chars.")
    }
    else
    {
      set_err_wheretobuy("")
    }

    if(where_to_buy_link=="")
    {
      formIsValid=false
      set_err_wheretobuylink("where to buy link field is required.")
    }
    else{
      set_err_wheretobuylink("")
    }
    if(percentage_total_supply=="")
    {
      formIsValid=false
      set_err_total_supply("Percentage total supply field is required.")
    }
    else if(percentage_total_supply <=0 || percentage_total_supply > 100)
    {
      formIsValid=false
      set_err_total_supply("The total supply percentage must be greater than 0 and  less than 100.")
    }
    else {
      set_err_total_supply("")
    }
    if(accept_payment_type=="")
    {
      formIsValid=false
      set_err_accept("Accept payment type field is required.")
    }
    else{
      set_err_accept("")
    }
    if(how_to_participate=="")
    {
      formIsValid=false
      set_err_airdrop("About airdrop field is required.")
    }
    else if(how_to_participate.length < 4) 
    {
      formIsValid=false
      set_err_airdrop("About airdrop field must be atleast 4 chars.")
    }
    else{
      set_err_airdrop("")
    }
    
    if(!formIsValid)
    {
      return
    }
    setValidError("") 
    const reqObj = {
      token_id : token_id,
      launchpad_row_id:edit_launchpad_row_id, 
      launch_pad_type:launch_pad_type,
      start_date:startDate,
      end_date:endDate,
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
    // console.log("reqObj",reqObj);
   
    Axios.post(API_BASE_URL+'markets/listing_tokens/update_launch_pad', reqObj, config  )
    .then(res=>{ 
      // console.log(res.data)
      if(res.data.status)
      { 
        
        setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message}) 
        getTokenDetails()
        if(edit_launchpad_row_id==""){
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
          if(res.data.message.innerErr.accept_payment_type){
            setValidError(res.data.message.innerErr.accept_payment_type)
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

const handleChange2=(value , name , i)=>  {
  const list = [...launch_pad]
  list[i][name] = value.format("YYYY-MM-DD HH:mm:ss")
  setLaunchPadList(list) 
}


const closeNRedirect = () =>
{
  setAlertMessage('')
  router.push('/token')
}

const redirectToPage = () =>
{
  setEmptyAlertMessage('')
  router.push('/token/launchpad/'+token_id)
}

const onSelect =(selectedList, selectedItem)=> {  
   console.log(selectedItem)
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
        <title>Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap</title>
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
        <div className="create_airdrop">
          <div className="container">
            <div className="row">
            <div className="col-md-5">
              <div className="main_create_form">
                <div className=" token_steps">
                  <h1 className="create-token-res">Launch Pad List</h1>
                  <p className="token_form_sub_text">Enter all these fields to create token</p>
                  <div className="table-responsive">
                  <table className="table table-borderless token-list-tbl">
                  <thead>
                        <tr>
                            <th>Sale Tokens</th>
                            <th>Start-End</th>
                            <th>Action</th> 
                        </tr> 
                  </thead>
                  <tbody>
                  {
                          launch_pad.length > 0 ?
                          launch_pad.map((e, i)=>{
                          return <tr>
                            <td>{separator(parseFloat(e.tokens_sold))} { e.launch_pad_type==1
                                                  ?
                                                  "ICO"
                                                  :
                                                  e.launch_pad_type==2
                                                  ?
                                                  "IDO"
                                                  :
                                                  e.launch_pad_type==3
                                                  ?
                                                  "IEO"
                                                  :
                                                  null
                            }
                            </td>
                            <td>{moment(e.start_date).format("MMM DD, YYYY")}<br/>{moment(e.end_date).format("MMM DD, YYYY")}</td>
                            
                            <td>
                              <button className="edit_launchpad" onClick={()=>editLaunchpadDetails(e)}>Edit</button>
                              <button className="edit_launchpad" onClick={()=>btnremove(e._id)} data-toggle="modal" data-target="#removeConnection">Remove</button>
                            </td>
                        

                        </tr> 
                          })
                       
                        :
                       <tr><td colSpan="5" className="text-center" >Sorry, No data found</td></tr>
                  }



{/* {
                          launch_pad.length > 0 ?
                          launch_pad.map((e, i)=>{
                          return <tr>
                            <th>{separator(parseFloat(e.tokens_sold))} { e.launch_pad_type==1
                                                  ?
                                                  "ICO"
                                                  :
                                                  e.launch_pad_type==2
                                                  ?
                                                  "IDO"
                                                  :
                                                  e.launch_pad_type==3
                                                  ?
                                                  "IEO"
                                                  :
                                                  null
                            }
                            </th>
                            <th>{moment(e.start_date).format("MMM DD, YYYY")}<br/>{moment(e.end_date).format("MMM DD, YYYY")}</th>
                            <div className="btn btn-sm">
                            <th><button className="edit_launchpad" onClick={()=>editLaunchpadDetails(e)}>Edit</button></th> 
                            <th><button className="edit_launchpad" onClick={()=>btnremove(e.id)} data-toggle="modal" data-target="#removeConnection">Remove</button></th>
                            </div>

                        </tr> 
                          })
                       
                        :
                       <tr><td colSpan="5" className="text-center" >Sorry, No data found</td></tr>
                  } */}

                  </tbody>
                  </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-7">
              <form id="myForm" >
              <div className="main_create_form">
                <div className="token_steps">
                   <div className="row">
                    <div className="col-md-6">
                      {
                        !edit_launchpad_row_id ? 
                        <>
                        <h1 className="create-token-res">Create New Launch Pad</h1>
                        <p className="token_form_sub_text">Enter all these fields to create token</p>
                        </>
                        :
                        <>
                        <h1 className="create-token-res">Update Launch Pad</h1>
                          <p className="token_form_sub_text">Enter all these fields to create token</p>
                        </>
                      }
                    </div>
                    <div className="col-md-6 text-right">
                        {
                            edit_launchpad_row_id ? 
                            <button type="button" onClick={()=> createLaunchpad()} className="edit_launchpad" >Create Launchpad</button>
                            :
                            null
                        }
                         <Link href="/token" ><a className="edit_launchpad"><i className="la la-arrow-left"></i>Go Back</a></Link></div>
                      
                  </div>
                </div>
                
                <div className="token_list_table">
                <div className="row">
                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-custom">
                      <label htmlFor="email">Tokens For sale<span className="label_star">*</span></label>
                      <div class="input-group mb-3">
                        <div class="input-group-append">
                        <select  name="launch_pad_type" className="form-control"  id="exampleFormControlSelect1" value={launch_pad_type} onChange={(e)=>set_launch_pad_type(e.target.value)}>
                                <option value="">Type</option>
                                <option value="1">ICO</option>
                                <option value="2">IDO</option>
                                <option value="3">IEO</option>
                              </select>
                        </div>
                        <input type="number" className="form-control" placeholder="Number of Tokens for Sale" value={tokens_sold} onChange={(e)=>set_tokens_sold(e.target.value)}/>
                        
                      </div>

                      {/* <div className="form-group input_block_outline">
                        <div className="input-group">
                          <div className="input-group-prepend">
                             <select  name="launch_pad_type" className="form-control"  id="exampleFormControlSelect1" value={launch_pad_type} onChange={(e)=>set_launch_pad_type(e.target.value)}>
                                <option value="">Launchpad Type</option>
                                <option value="1">ICO</option>
                                <option value="2">IDO</option>
                                <option value="3">IEO</option>
                              </select>
                       
                        <input type="number" className="form-control" placeholder="Number of Tokens for Sale" value={tokens_sold} onChange={(e)=>set_tokens_sold(e.target.value)}/>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className="error">{err_launchpad} {err_tokens_sale}</div>
                 </div>
                 
                  <div className="col-xl-6 col-lg-12 col-md-12">
                    <div className="form-custom">
                    <label htmlFor="access_type">Enter Access Type<span className="label_star">*</span></label>
                      <div className="form-group input_block_outline">
                         <select name="access_type"  value={access_type} onChange={(e)=>set_access_type(e.target.value)} >
                            <option value="">Select Access Type</option>
                            <option value="1">Public</option>
                            <option value="2">Private</option> 
                          </select>
                        </div>
                    </div>
                    <div className="error">{err_access_type}</div>
                  </div>
                  
                </div>
               
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="email">Start Date<span className="label_star">*</span></label> 
                      <div className="form-group input_block_outline">
                      {/* <input type="date" placeholder=""  value={start_date} onChange={(e)=>set_start_date(e.target.value)} /> */}
                      <DatePicker
                        selected={startDate}
                        dateFormat="yyyy/MM/dd"
                        onChange={(date) => setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                      />
                        
                      </div>
                    </div>
                    <div className="error">{err_start_date}</div>
                  </div>
                  

                  <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="email">End Date<span className="label_star">*</span></label>
                      <div className="form-group input_block_outline">
                      {/* <input type="date" placeholder=""  value={end_date} onChange={(e)=>set_end_date(e.target.value)} /> */}
                      <DatePicker
                        selected={endDate}
                        dateFormat="yyyy/MM/dd"
                        onChange={(date) => setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                      />
                      </div>
                    </div>
                    <div className="error">{err_end_date}</div>
                  </div>
                  
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="price"> Enter Price<span className="label_star">*</span></label>
                        <div className="form-group input_block_outline">
                          <input type="number" placeholder="Eg.,$00.00"  value={price} onChange={(e)=>set_price(e.target.value)}  />
                      </div>
                    </div>
                    <div className="error">{err_price}</div>
                  </div>
                   <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="soft_cap">Enter Soft Cap</label>
                        <div className="form-group input_block_outline">
                          <input type="number" placeholder="Soft Cap"  value={soft_cap} onChange={(e)=>set_soft_cap(e.target.value)}  />
                        
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="where_to_buy_title">Enter Where to Buy Title<span className="label_star">*</span></label>
                        <div className="form-group input_block_outline">
                            <input autoComplete="off" type="text" placeholder="Where to Buy Title"   value={where_to_buy_title} onChange={(e)=>set_where_to_buy_title(e.target.value)} />
                        
                      </div>
                    </div>
                    <div className="error">{err_wheretobuy}</div>
                  </div>


                  <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="where_to_buy_link">Enter Where to Buy Link<span className="label_star">*</span></label>
                        <div className="form-group input_block_outline">
                          <input autoComplete="off" type="text" placeholder="Where to Buy Link" name="where_to_buy_link"  value={where_to_buy_link} onChange={(e)=>set_where_to_buy_link(e.target.value)}  />
                        
                      </div>
                    </div>
                    <div className="error">{err_wheretobuylink}</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="percentage_total_supply">Enter % of Total Supply<span className="label_star">*</span></label>
                        <div className="form-group input_block_outline">
                           <input type="number" placeholder="% of Total Supply"  value={percentage_total_supply} onChange={(e)=>set_percentage_total_supply(e.target.value)} />
                        
                      </div>
                    </div>
                    <div className="error">{err_total_supply}</div>
                  </div>


                  <div className="col-md-6">
                    <div className="form-custom">
                    <label htmlFor="accept_payment_type">Accept<span className="label_star">*</span></label>
                      <div className="form-group input_block_outline multi-select-dropdown-input" style={{padding: '0 10px'}}>
                        
                          <Multiselect  className="form-control" 
                            selectedValues={accept_payment_type}
                            options={payment_types} // Options to display in the dropdown
                            onSelect={onSelect} // Function will trigger on select event
                            onRemove={onRemove} // Function will trigger on remove event
                            displayValue="payment_name" // Property name to display in the dropdown options
                            /> 
                           
                       </div>
                    </div>
                    <div className="error">{err_accept}</div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="form-custom">
                    <label htmlFor="how_to_participate">Enter About Airdrop<span className="label_star">*</span></label>
                      {/* <div className="form-group input_block_outline ">
                       <textarea type="text" placeholder="About Airdrop"  rows="3" value={how_to_participate} onChange={(e)=>set_how_to_participate(e.target.value)}/>
                       </div> */}
                       <div className="form-group input_block_outline">
                            <Editor apiKey="s6mr8bfc8y6a2ok76intx4ifoxt3ald11z2o8f23c98lpxnk" 
                            onEditorChange={(e)=>set_how_to_participate(e)}
                            value={how_to_participate} 
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
                      </div>
                     </div>
                    
                </div>
                <div className="error">{err_airdrop}</div>
                
                <div className="review_upload_token create-launchpad-submit-button mt-3">
                  {
                    !edit_launchpad_row_id ? 
                    <button type="button" onClick={()=> OnSubmitData()}>Create Launch pad</button>
                    :
                    <button type="button" onClick={()=> OnSubmitData()}>Update Launch pad</button>
                  }
                  
                </div> 
                      
                </div> 
 
 
              </div>
              </form>
            </div>
            </div>
          </div>
        </div>
      </div>

      <div className={"modal connect_wallet_error_block"+ (alert_message ? " collapse show" : "")}> 
        <div className="modal-dialog modal-sm">
          <div className="modal-content">
            <div className="modal-body">
              <button type="button" className="close" data-dismiss="modal"  onClick={()=>closeNRedirect()}>&times;</button>
              <h4>Updated launchpad for this token </h4>
              <p>{alert_message}</p>
            </div>
          </div> 
        </div>
      </div> 

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
      if(parseInt(userAgent.user_email_status)==1)
      { 
          return { props: { userAgent: userAgent, config: config(userAgent.user_token), token_id:query.launchpad_token_id } }
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
