
import React , {useState, useEffect,useRef} from 'react';   
import Axios from 'axios';
import Link from 'next/link' 
import Head from 'next/head';
import {x_api_key, API_BASE_URL,separator, app_coinpedia_url, website_url,config} from '../../components/constants'
import Popupmodal from '../../components/popupmodal' 
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

export default function CreateLauchPad({config}) {  


  const router = useRouter()
  const {launchpad_token_id}= router.query
   console.log(launchpad_token_id)

  const Multiselect = dynamic(
    () => import('multiselect-react-dropdown').then(module => module.Multiselect),
    {
        ssr: false
    }
)



  

  const editorRef = useRef(null) 

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

//   useEffect(()=>
//   { 
    
//     acceptPaymentType()
//     getTokenDetails() 
//   },[launchpad_token_id])

  const editLaunchpadDetails = (object)=>
  {
     console.log(object)
    set_edit_launchpad_object(object)
    set_edit_launchpad_row_id(parseInt(object._id))
    set_launch_pad_type(object.launch_pad_type)
    setStartDate(new Date(object.start_date))
    setEndDate(new Date((moment.utc(object.end_date).format("YYYY-MM-DD"))+" 00:00:00"))
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
    //console.log(launchpad_token_id)
    Axios.get(API_BASE_URL+"markets/listing_tokens/individual_details/"+launchpad_token_id, config).then(res=>
    {
       console.log(res.data)
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
   
      // setModalData({icon: "", title: "", content: ""})
      Axios.get("https://markets-nodejs-api-l9lg8.ondigitalocean.app/app/payment_type", config)
    // Axios.get(API_BASE_URL+"app/payment_type", config)
    .then(res=>
    {
      console.log(res)
        if(res.data.status)
        {
          set_payment_types(res.data.message)
         
         
          
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
    if(startDate=="")
    {
      formIsValid=false
      set_err_start_date("The Start date field is required.")
    }
    else{
      set_err_start_date("")
    }
    if(endDate=="")
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
    else{
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
    else {
      set_err_total_supply("")
    }
    if(accept_payment_type=="")
    {
      formIsValid=false
      set_err_accept("The Accept payment type field is required.")
    }
    else{
      set_err_accept("")
    }
    if(how_to_participate=="")
    {
      formIsValid=false
      set_err_airdrop("The About airdrop field is required.")
    }
    else if(how_to_participate.length < 4) 
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
      var req_end_date = moment(endDate).add(1, 'days')
    }
    else
    {
      var req_end_date = endDate
    }

    setValidError("") 
    const reqObj = {
      token_id : launchpad_token_id,
      launchpad_row_id:edit_launchpad_row_id, 
      launch_pad_type:launch_pad_type,
      start_date: startDate,
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
    console.log("reqObj", reqObj)
   
    Axios.post(API_BASE_URL+'markets/listing_tokens/update_launch_pad', reqObj, config)
    .then(res=>{ 
       console.log(res.data)
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




const onSelect =(selectedList, selectedItem)=> {  
  console.log(selectedItem)
  accept_payment_type_ids.push(selectedItem._id)
  accept_payment_type.push(selectedItem) 
  console.log(accept_payment_type_ids) 
}

const onRemove = (selectedList, removedItem) => {
  accept_payment_type_ids.splice(accept_payment_type_ids.indexOf(removedItem._id), 1)
  accept_payment_type.splice(accept_payment_type.indexOf(removedItem), 1)
}


 
  return(
   <>fdghsf</>
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
