import React , {useState, useEffect,useRef} from 'react';   
import Axios from 'axios';
import Link from 'next/link' 
import Head from 'next/head';
import { launchpads_types_list, getLaunchpadType } from '../../../config/helper' 
import {x_api_key, API_BASE_URL,separator, app_coinpedia_url, coinpedia_url,market_coinpedia_url,config} from '../../../components/constants'
import Popupmodal from '../../../components/popupmodal' 
import Top_header from '../../../components/manage_token/top_header'
import { useRouter } from 'next/router'
import moment from 'moment' 
import cookie from "cookie"
import JsCookie from "js-cookie"
import { Editor } from '@tinymce/tinymce-react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; 
// import Datetime from "react-datetime"
// import "react-datetime/css/react-datetime.css"

export default function CreateLauchPad({config,token_id}) 
{  

  const editorRef = useRef(null) 
  const [loader, set_loader] = useState("")
  const [validError, setValidError] = useState("")
  const [alert_message, setAlertMessage] = useState('')
  const [element,set_element]=useState([])
  const [payment_types,set_payment_types]=useState([])
  const [accept_payment_type_ids, set_accept_payment_type_ids]= useState([])
  const [payment_types_list,set_payment_types_list]=useState([])
  const [launch_pad, setLaunchPadList] = useState([])
  const [approval_status, set_approval_status] = useState("")
  const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
  const [empty_alert_message, setEmptyAlertMessage]= useState("")
  const [launchpad_type, set_launchpad_type]= useState("")
  const [supply, set_supply ] = useState('')
  const [api_loader, set_api_loader] = useState(false)
  const [network_row_id, set_network_row_id] = useState('')
  

  const [start_date, setStartDate] = useState("")
  const [end_date, setEndDate] = useState("")
  const [tokens_for_sale, set_tokens_for_sale]= useState("")
  const [launchpad_price, set_launchpad_price]= useState("")
  const [listing_price, set_listing_price]= useState("")
  const [launchpad_list, set_launchpad_list]= useState("")
  const [percentage,set_percentage]=useState(0)
  const [elements, set_elements] = useState([]);
  const [crypto_networks, set_crypto_networks] = useState([])
  const [token_symbol, set_token_symbol]= useState("")
  
  const [user_token, set_user_token]= useState(JsCookie.get('user_token'))
  const [soft_cap, set_soft_cap]= useState("")
  const [title, set_title]= useState("")
  const [where_to_buy_link, set_where_to_buy_link]= useState("")
  const [percentage_of_total_supply, set_percentage_of_total_supply]= useState("")
  const [access_type, set_access_type]= useState("")
  const [description, set_description]= useState("")
  const [accept_payment_type, set_accept_payment_type]= useState([])
  const [err_launchpad_price, set_err_launchpad_price]= useState("")
  const [err_listing_price, set_err_listing_price]=useState("")
  const [today_date, set_today_date]= useState("")
  const [active_launchpad_row_id, set_active_launchpad_row_id]= useState("")
  // const [token_id,set_token_id]= useState(token_id)
  const [err_launchpad, set_err_launchpad]= useState("")
  const [err_title, set_err_title]= useState("")

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


  const [accepts_payments, set_accepts_payments] = useState([""])
  
  const addAcceptPayments = () => 
  {
    set_accepts_payments(prev => [...prev, ""])
  }

  const removeAcceptPayments = (index) => {
    set_accepts_payments(accepts_payments.filter((s, sindex) => index !== sindex))
  }

  const saveAcceptPaymentDetails = (e, index) => 
  {
    const { value } = e.target
    const list = [...accepts_payments]
    list[index] = value.toUpperCase()
    set_accepts_payments(list)
  }


  useEffect(()=>
  { 
    getTokenDetail()
    getCryptoNetworks()
    lanchpadList()
  },[token_id])


  
  const removeLaunchpad = (id)=>
  {
    const reqObj = {
      token_id : token_id,
      launchpad_row_id:id
      } 
      setModalData({icon: "", title: "", content: ""})
      if(edit_launchpad_row_id == id){
        createLaunchpad()
      }
    Axios.post(API_BASE_URL+"markets/listing_tokens/remove_launch_pad", reqObj, config)
    .then(res=>
    {
      // console.log(res.data)
        if(res.data.status)
        {
          gatLaunchpadDetails()
          setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message})
         
        }
    })

  }

  const getTokenDetail=()=>
  {
  
    Axios.get(API_BASE_URL+"markets/users/manage_crypto/individual_details/"+token_id, config)
    .then(response=>{
      if(response.data.status){ 
        // console.log(response.data) 
        set_supply(response.data.message.total_supply)
        set_token_symbol(response.data.message.symbol)
        set_approval_status((response.data.message.approval_status) ? parseInt(response.data.message.approval_status):0)
      }
  
    })
  }
  
  const gatLaunchpadDetails = ()=>
  {
    //console.log(token_id)
    Axios.get(API_BASE_URL+"markets/users/manage_launchpads/individual_details/"+token_id, config).then(res=>
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

  const lanchpadList = () => 
  {
    Axios.get(API_BASE_URL + "markets/users/manage_launchpads/list/"+token_id, config).then(
      (response) => 
      {
        // console.log("dfgf",response);
        if(response.data.status) 
        {
          set_api_loader(false)
          set_launchpad_list(response.data.message);
        }
      }
    );
  };

  const getLaunchpad = (row_id) => 
  {
    Axios.get(API_BASE_URL + "markets/users/manage_launchpads/individual_details/"+row_id, config).then((response) => 
    {
        if(response.data.status) 
        {
            // console.log("indi",response.data.message)
            set_launchpad_type(response.data.message.launchpad_type)
            setStartDate(moment(response.data.message.start_date).utc().format("YYYY-MM-DD"))
            setEndDate(moment(response.data.message.end_date).utc().format("YYYY-MM-DD"))
            set_tokens_for_sale(response.data.message.tokens_for_sale)
            set_launchpad_price(response.data.message.launchpad_price)
            set_listing_price(response.data.message.listing_price)
            set_soft_cap(response.data.message.soft_cap)
            set_title(response.data.message.title)
            set_where_to_buy_link(response.data.message.where_to_buy_link)
            set_percentage_of_total_supply(response.data.message.percentage_of_total_supply)
            set_access_type(response.data.message.access_type)
            set_description(response.data.message.description)
            set_edit_launchpad_row_id(response.data.message._id)
            set_network_row_id(response.data.message.network_row_id)
            if(response.data.message.accepts_payments)
            {
              set_accepts_payments(response.data.message.accepts_payments)
            }
            
           
        }
      })
  };


  const btndelete = (row_id) => {
    let ele= <div className="remove_modal">
    <div className="modal" id="removeConnection">
        <div className="modal-dialog modal-sm">
        <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close"  data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="Close" /></button>
            <div className="text-center">
            <div className=""><img src="/assets/img/cancel.png" alt="Cancel" className="prop_modal_img"/></div>
                <h4 className="">Delete Launchpad!</h4>
                <p>Do you really want to delete this Launchpad detail?</p>
            </div>  
            </div>
            <div className="modal-footer">
            <button type="button" className="tn btn-danger btn-sm" onClick={() => Delete(row_id)} data-dismiss="modal"> Delete </button>
            </div>
        </div>
        </div>
    </div> 
    </div>
    set_elements(ele);
  };

  const Delete = (row_id) => {
    setModalData({ icon: "", title: "", content: "" });

    Axios.get(
      API_BASE_URL+"markets/users/manage_launchpads/delete_launchpad/"+row_id,
      config
    ).then((response) => {
      if (response.data.status === true) {
        setModalData({
          icon: "/assets/img/update-successful.png",
          title: "Thank You!",
          content: response.data.message.alert_message,})
          lanchpadList();
        clearForm();
        set_edit_launchpad_row_id("");
      } else {
        setModalData({
          icon: "/assets/img/cancel.png",
          title: "Oops!",
          content: response.data.message.alert_message,
        });
      }
    });
  };

    
    const getCryptoNetworks = async () => 
    {
      const res = await Axios.get(API_BASE_URL + "static/crypto_networks", config)
      if(res.data.status) 
      {
        set_crypto_networks(res.data.message)
      }
    }
  
    const clearForm = () => 
    {     
          set_err_launchpad_price("")
          set_err_listing_price("")
          set_err_title("")
          set_edit_launchpad_object([])
          set_edit_launchpad_row_id("")
          set_launchpad_type("")
          setStartDate("")
          setEndDate("")
          set_tokens_for_sale("")
          set_launchpad_price("")
          set_listing_price("")
          set_soft_cap("")
          set_title("")
          set_where_to_buy_link("")
          set_percentage_of_total_supply("")
          set_access_type("")
          set_description("")
          set_network_row_id("")
          set_accepts_payments([""])
          document.getElementById("myForm").reset() 
    }
  
  const createLaunchpad = () =>
  {   
    set_err_launchpad_price("")
    set_err_listing_price("")
    set_err_title("")
    set_launchpad_type([])
    setStartDate(new Date())
    setEndDate(new Date())
    set_tokens_for_sale("")
    set_access_type([])
    set_soft_cap("")
    set_price("")
    set_title("")
    set_where_to_buy_link("")
    set_percentage_of_total_supply("")
    set_description("")
    set_accept_payment_type_ids([])
    set_accept_payment_type([])
  }

  const OnSubmitData = ()=>
  {
    
    setModalData({ icon: "", title: "", content: "" })
    let formIsValid = true  
    set_err_launchpad("")
    set_err_start_date("")
    set_err_end_date("")
    set_err_tokens_sale("")
    set_err_price("")
    set_err_wheretobuylink("")
    set_err_total_supply("")
    set_err_accept("")
    set_err_access_type("")
    set_err_airdrop("")
    set_err_launchpad_price("")
    set_err_listing_price("")
    set_err_title("")
   
     if(launchpad_type==="")
    {
      formIsValid=false
      set_err_launchpad("The Launchpad Type field is required. ")
    }
    
    
    if(title === '')
    {
      set_err_title('The title field is required.')
      formIsValid = false
    }
    else if(title.length < 4)
    {
      set_err_title('The title must be atleast 4 characters.')
      formIsValid = false
    } 
   
     if(tokens_for_sale=="")
    {
      formIsValid=false
      set_err_tokens_sale("The Tokens for sale field is required.")
    }
     

    if(access_type=="")
    {
      formIsValid=false
      set_err_access_type("The Access type field is required.")
    }
    
    if(start_date === '')
    {
      set_err_start_date('The start date field is required.')
      formIsValid = false
    }
    if(end_date === '')
    {
      set_err_end_date('The end date field is required.')
      formIsValid = false
    }
    else if (start_date > end_date) {
      formIsValid = false;
      set_err_end_date("Please select valid End date .");
    }

    if(launchpad_price=="")
    {
      formIsValid=false
      set_err_launchpad_price("The ICO Price field is required.")
    }
    else if(launchpad_price <=0 )
    {
      formIsValid=false
      set_err_launchpad_price("The ICO Price field should not be zero")
    }

    if(listing_price=="")
    {
      formIsValid=false
      set_err_listing_price("The Listing Price field is required.")
    }
    else if(listing_price <=0 )
    {
      formIsValid=false
      set_err_listing_price("The Listing Price field should not be zero")
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
    
    
    if(percentage_of_total_supply=="")
    {
      formIsValid=false
      set_err_total_supply("The Percentage total supply field is required.")
    }
    else if(percentage_of_total_supply <=0 || percentage_of_total_supply > 100)
    {
      formIsValid=false
      set_err_total_supply("The total supply percentage must be greater than 0 and less than 100.")
    }
    else 
    {
      set_err_total_supply("")
    }
    // if(payment_types=="")
    // {
    //   formIsValid=false
    //   set_err_accept("The Accept payment type field is required.")
    // }
   
    if(!description)
    {
      formIsValid=false
      set_err_airdrop("The About launchpad field is required.")
    }
    else if(description.length<4) 
    {
      formIsValid=false
      set_err_airdrop("The About launchpad field must be atleast 4 character.")
    }
  
    
    if(!formIsValid)
    {
      return
    }

    // if(edit_launchpad_row_id)
    // {
    //   var req_end_date = moment(end_date).add(1, 'days')
    //   var req_start_date = moment(start_date).add(1, 'days')
    // }
    // else
    // {
    //   var req_end_date = end_date
    //   var req_start_date = start_date
    // }

    // setValidError("") 
    set_loader(true)
    const reqObj = {
      token_row_id : token_id,
      launchpad_row_id:edit_launchpad_row_id, 
      title:title,
      launchpad_type: launchpad_type,
      tokens_for_sale: tokens_for_sale,
      percentage_of_total_supply:percentage_of_total_supply,
      start_date:start_date ? moment(start_date).format("YYYY-MM-DD"):"",
      end_date:end_date ? moment(end_date).format("YYYY-MM-DD"):"",
      launchpad_price:launchpad_price,
      listing_price:listing_price,
      where_to_buy_link:where_to_buy_link,
      soft_cap:soft_cap,
      accepts_payments:accepts_payments,
      network_row_id:network_row_id,
      access_type:access_type,
      description:description
    } 
    
    Axios.post(API_BASE_URL+'markets/users/manage_launchpads/update_n_save_details', reqObj, config).then(res=>
    { 
      set_loader(false)
        if(res.data.status)
        { 
            setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message}) 
            lanchpadList()
            clearForm()
            // gatLaunchpadDetails()
            // if(edit_launchpad_row_id=="")
            // {
            //     createLaunchpad()
            // }
        }
        else
        { 
          setModalData({icon: "/assets/img/close_error.png", title: "Something went wrong ", content: res.data.message.alert_message})
          
          if(res.data.message.innerErr)
          {
            if(res.data.message.innerErr.launchpad_type){
              setValidError(res.data.message.innerErr.launchpad_type) 
            }
            if(res.data.message.innerErr.accept_payment_type){
              setValidError(res.data.message.innerErr.accept_payment_type)
            }
            if(res.data.message.innerErr.launchpad_type){
              setValidError(res.data.message.innerErr.launchpad_type)
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
            if(res.data.message.innerErr.tokens_for_sale){
              setValidError(response.data.message.innerErr.tokens_for_sale)
            }  
            if(res.data.message.innerErr.price){
              setValidError(res.data.message.innerErr.price)
            }  
            if(res.data.message.innerErr.soft_cap){
              setValidError(res.data.message.innerErr.soft_cap)
            }   
            if(response.data.message.innerErr.title){
              setValidError(res.data.message.innerErr.title)
            }  
            if(res.data.message.innerErr.where_to_buy_link){
              setValidError(res.data.message.innerErr.where_to_buy_link)
            }  
            if(res.data.message.innerErr.percentage_of_total_supply){
              setValidError(res.data.message.innerErr.percentage_of_total_supply)
            }  
          
            if(res.data.message.innerErr.access_type){
              setValidError(res.data.message.innerErr.access_type)
            }  
            if(res.data.message.innerErr.description){
              setValidError(res.data.message.innerErr.description)
            }
          }
        }
    }) 

  }
  
  const tokenSale=(e)=>
  {
    set_tokens_for_sale(e)
    set_err_tokens_sale("")
    set_percentage_of_total_supply(null)
    if(e>supply)
    {
    
      set_err_tokens_sale("The Tokens for sale field should be less than or equal to total supply.")
      set_percentage_of_total_supply(null)
    }
    else{
    set_percentage_of_total_supply(((e/supply)*100).toFixed(2))
  }
  }
 
    const makeJobSchema=()=>{  
        return { 
            "@context":"http://schema.org/",
            "@type":"Organization",
            "name":"Manage Launchpads Details",
            "url":market_coinpedia_url+"token/launchpads/"+token_id,
            "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
            "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        }  
    } 


   

 
  return(
    <>
      <Head>
        <title>Manage Launchpads Details</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Manage all your coin launch events of your token." />
        <meta name="keywords" content="Mange coin/token launch , ICO, IGO, IEO, IPO, Presale of your coin/token" />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Manage Launchpads Details" />
        <meta property="og:description" content="Manage all your coin launch events of your token." />
        <meta property="og:url" content={market_coinpedia_url+"token/launchpads/"+token_id}/>
        <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Manage Launchpads Details" />
        <meta name="twitter:description" content="Manage all your coin launch events of your token." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>

        <link rel="canonical" href={market_coinpedia_url+"token/launchpads/"+token_id} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
      <div className="page">
      <div className="create_airdrop create_launchpad">
          <div className="container">
          <div className="for_padding">
          <div className='market_token_tabs'>
              <h1 className='page_main_heading'>Manage Coin Launchpads</h1>
              <p>Create, Edit, or Remove the launchpad of your token from here.</p>
              <Top_header active_tab={2} token_id={token_id} approval_status={approval_status}/>
              <div className="row">
                  <div className="col-lg-3 col-md-4">
                  </div>  
                  <div className="col-lg-12 col-md-6">
                      
                  </div>
              </div>
          </div>
                
            <div className="col-md-12">
              <div className="row">
              <div className="col-lg-5 col-md-12">
                <div className='form_headings'>
              {
                  !edit_launchpad_row_id ? 
                  <>
                  <h5 >Create Launchpad</h5>
                  <p>Submit details of your upcoming or live details, made live after admin approval</p>
                  </>
                  :
                  <>
                  <h5 className="create-token-res">Update Launchpad
                  <span style={{float:"right"}} className='text-right pull-right' onClick={()=>clearForm()}><button className='btn btn-primary btn-sm'>Go Back</button></span>
                  </h5>
                  <p className="token_form_sub_text">Edit launchpad details for your tokens.</p>
                  </>
                }
                </div>
                

                        {/* {
                            edit_launchpad_row_id ? 
                            <>
                            <button type="button" onClick={()=>btnremove(edit_launchpad_row_id)} className="edit_launchpad" data-toggle="modal" data-target="#removeConnection">Remove</button>
                            <button type="button" onClick={()=> createLaunchpad()} className="edit_launchpad" >Go Back</button>
                            </>
                            :
                            <Link href="/token" className="edit_launchpad"><i className="la la-arrow-left"></i>Go Back</Link>
                        } */}

                <form id="myForm" >
                <div>
                  <div className="create_token_details">
                    <div className="row">
                      <div className="col-md-6">
                          <div className="form-custom">
                            <label htmlFor="email">Type<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                            <select name="launchpad_type" className="form-control " value={launchpad_type} onChange={(e)=>set_launchpad_type(e.target.value)}>
                              <option value="">Type</option>
                              {
                                launchpads_types_list.length ?
                                launchpads_types_list.map((item, i) =>
                                <option value={item._id}>{item.type_name}</option>
                                )
                                :
                                ""
                              }
                            </select>
                            </div>
                            <div className="error">{err_launchpad} </div>
                          </div>
                      </div>
                      <div className="col-md-6">
                          <div className="form-custom">
                            <label htmlFor="email">Title<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                            <input className='form-control' autoComplete="off" type="text" placeholder="Title" value={title} onChange={(e)=>set_title(e.target.value)} />
                            </div>
                            <div className="error">{err_title} </div>
                          </div>
                      </div>
                    </div>  
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-custom">
                          <label htmlFor="access_type">Access Type<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                              <select className='form-control' name="access_type"  value={access_type} onChange={(e)=>set_access_type(e.target.value)} >
                                <option value="">Select Access Type</option>
                                <option value="1" selected={access_type==1}>Public</option>
                                <option value="2" selected={access_type==2}>Private</option> 
                              </select>
                            </div>
                            <div className="error">{err_access_type}</div>
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-custom">
                          <label htmlFor="price">Network</label>
                          <div className="form-group input_block_outline">
                            <select className="form-control" onChange={(e)=>set_network_row_id(e.target.value)}>
                                <option value="">Select Network</option>
                                  {
                                    crypto_networks.length ?
                                    crypto_networks.map((item) =>
                                    <>
                                    <option value={item._id} selected={item._id==network_row_id}>{item.network_name}</option>
                                    </>
                                    )
                                    :
                                    ""
                                  }
                            </select>
                          </div>
                        </div>
                      </div>
                    </div> 

                    <div className="row">
                      <div className="col-md-6"> 
                        <div className="form-custom">
                          <label htmlFor="email">Tokens For sale<span className="label_star">*</span></label>
                          <div className="form-group input_block_outline">
                            <input type="number" min="0" className="form-control" placeholder="Number of Tokens(Hardcap)" value={tokens_for_sale} onChange={(e)=>tokenSale(e.target.value)}/>
                          </div>
                          <div className="error">{err_tokens_sale}</div>
                          {
                            supply ?
                            <div>
                              <span className='total_supply'>{percentage_of_total_supply?percentage_of_total_supply:0} % of Total Supply</span>
                            </div>
                            :
                            ""
                          }
                          
                        </div>
                      </div>

                      <div className="col-md-6">
                          <div className="form-custom">
                          <label htmlFor="price">Soft Cap($)</label>
                            <div className="form-group input_block_outline">
                              <input className='form-control' type="number" min="0" placeholder="Soft cap"  value={soft_cap} onChange={(e)=>set_soft_cap(e.target.value)}  />
                            </div>
                            <div className="error"></div>
                          </div>
                      </div>

                      {/* <div className="col-md-6">
                          <div className="form-custom">
                            <label htmlFor="title">Title<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                             
                            </div>
                            <div className="error">{err_wheretobuy}</div>
                          </div>
                      </div> */}
                      
                    </div>

                    <div className='row'>
                      <div className="col-md-6">
                          <div className="form-custom">
                            <label htmlFor="email">Start Date<span className="label_star">*</span></label> 
                            <div className="form-group input_block_outline">
                            <input type="date"  className="form-control" value={start_date} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <div className="error">{err_start_date}</div>
                          </div>
                      </div>
                      <div className="col-md-6">
                          <div className="form-custom">
                            <label htmlFor="email">End Date<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                              <input type="date"  className="form-control" value={end_date} onChange={(e) => setEndDate(e.target.value)} />
                              {/* <Datetime inputProps={ inputProps2 }  dateFormat="YYYY-MM-DD" timeFormat={false} isValidDate={ valid2 }  name="end_date_n_time" value={end_date} onChange={(e) => setEndDate(e)}/> */}
                            </div>
                            <div className="error">{err_end_date}</div>
                           </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className="col-md-6">
                          <div className="form-custom">
                          <label htmlFor="price">ICO Price<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                              <input type="number" className='form-control' min="0" placeholder="Eg.,$00.00"  value={launchpad_price} onChange={(e)=>set_launchpad_price(e.target.value)}  />
                            </div>
                            <div className="error">{err_launchpad_price}</div>
                          </div>
                      </div>
                      <div className="col-md-6">
                      <div className="form-custom">
                          <label htmlFor="price">Listing Price<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                              <input type="number" className='form-control' min="0" placeholder="Eg.,$00.00"  value={listing_price} onChange={(e)=>set_listing_price(e.target.value)}  />
                            </div>
                            <div className="error">{err_listing_price}</div>
                            {/* <div>
                              <span style={{float:"right"}}>13% Change</span>
                            </div> */}
                          </div>
                      </div>
                    </div>

                   

                    <div className='row'>
                      
                      <div className="col-md-12">
                          <div className="form-custom">
                          <label htmlFor="where_to_buy_link">Where to Buy Link<span className="label_star">*</span></label>
                          <div className="form-group input_block_outline">
                            <input className='form-control' autoComplete="off" type="text" placeholder="Where to Buy Link" name="where_to_buy_link"  value={where_to_buy_link} onChange={(e)=>set_where_to_buy_link(e.target.value)}  />
                          </div>
                          <div className="error">{err_wheretobuylink}</div>
                          </div>
                      </div>
                    </div>

                    <div className='row'>
                    <div className="col-md-12">
                      <label htmlFor="where_to_buy_link">Accept Payments</label>
                      <table className="table table-borderedless" >
                        
                        <tbody>
                          {
                            accepts_payments.length > 0 ?
                            accepts_payments.map((item, i) =>
                            <tr id="attribute-explorer">
                              <td>
                                <input type="text" autoComplete="off" placeHolder='Ex: BUSD, USDT, ETH, BTC, BNB' className="form-control " name="explorer[]" value={item} onChange={e => saveAcceptPaymentDetails(e, i)} />
                              </td>
                              <td>
                               
                                {
                                  i == 0 ?
                                  <>
                                    <span onClick={addAcceptPayments} className="token_accept_payments_add">Add</span>
                                  </>
                                  :
                                  <>
                                    <span onClick={() =>removeAcceptPayments(i)} className="token_accept_payments_add">Remove</span>
                                  </>
                                }
                              </td>
                            </tr>
                            )
                            :
                            ""
                          }
                        </tbody>
                      </table>           
                    </div>
                    </div>

                    <div className='row'>
                      <div className="col-md-12">
                          <div className="form-custom">
                          <label htmlFor="description">About Launchpad<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                              <Editor apiKey="s6mr8bfc8y6a2ok76intx4ifoxt3ald11z2o8f23c98lpxnk" 
                              onEditorChange={(e)=>set_description(e)}
                              value={description} 
                                  onInit={(evt, editor) => {editorRef.current = editor}}
                               
                                  init={{
                                    height: 220,
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
                      <div className="col-md-6">
                          <div className="form-custom">
                            
                          </div>
                      </div>
                    </div>


                    <div className="row">
                        <div className="col-md-12">
                        <div className="review_upload_token create-launchpad-submit-button mt-3">
                            {
                              !edit_launchpad_row_id ? 
                                <button type="button" className="button_transition" onClick={()=> OnSubmitData()}>
                                  {loader ? (
                                        <div className="loader"><span className="spinner-border spinner-border-sm "></span> Create Launchpad</div>
                                        ) : (
                                            <> Create Launchpad</>
                                        )}
                                </button>
                              :
                              <button type="button" className="button_transition" onClick={()=> OnSubmitData()}>
                                {loader ? (
                                        <div className="loader"><span className="spinner-border spinner-border-sm "></span> Update Launchpad</div>
                                        ) : (
                                            <> Update Launchpad</>
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
               


                <div className="col-lg-7 col-md-12">
                <div className='form_headings'>
                <h5 className="create-token-res">Launchpad List ({launchpad_list.length})</h5>
                    <p>Manage your launch events, edit, remove, or add new ones.</p> 
                    </div> 
                        <div className='market_page_data token_tables'>      
                          <div className="table-responsive">
                            <table className="table">
                                <thead>
                                <tr>
                                <th >#</th>
                                    <th >Type/Network</th>
                                    <th >Sale Tokens(%) 
                                    </th>
                                    <th>Start-End</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>

                                {
                                  !api_loader?
                                  launchpad_list.length>0?
                                  launchpad_list.map((e, i) =>
                                    <tr key={i}>
                                        <td>{i+1}</td>
                                        <td>
                                          {getLaunchpadType(e.launchpad_type)}
                                          /
                                          {
                                            e.network_name ?
                                            e.network_name
                                            :
                                            "-"
                                          }
                                        </td>
                                        <td>{e.tokens_for_sale}  <br/> <small>{e.percentage_of_total_supply ? (e.percentage_of_total_supply).toFixed(2)+"%":""}</small></td>
                                        <td>{e.start_date
                                                ? moment(e.start_date).utc().format(
                                                    "ll"
                                                  )
                                                : "-"}
                                                <br/>
                                                {e.end_date
                                                  ? moment(e.end_date).utc().format(
                                                      "ll"
                                                    )
                                                  : "-"}
                                          </td>

                                        <td>
                                          {
                                            e.approval_status == 0 ?
                                            <span className="badge_pending">
                                              Pending
                                            </span>
                                            :
                                            e.approval_status == 1 ?
                                            <span className="badge_approved">
                                              Approved
                                            </span>
                                            :
                                            e.approval_status == 2 ?
                                            <>
                                            <span className="badge_rejected">
                                              Rejected
                                              
                                            </span>

                                            

                                              <OverlayTrigger
                                                // delay={{ hide: 450, show: 300 }}
                                                overlay={(props) => (
                                                  <Tooltip {...props} className="custom_pophover ">
                                                    <p className="rejected_reason"><b>Rejected On:</b> {moment(e.rejected_on).utc().format("ll")} </p>
                                                    <p className="rejected_reason"><b>Reason:</b> {e.rejected_reason}</p>
                                                  </Tooltip>
                                                )}
                                                placement="bottom"
                                              ><span className='info_col ml-2' ><img src="/assets/img/info.png" alt="Info" /></span>
                                              </OverlayTrigger>
                                            </>
                                            :
                                            ""
                                          }
                                        </td>
                                        <td>
                                        <button type="submit" title="Edit" onClick={() => getLaunchpad(e._id)} className="tn btn-primary btn-sm" name="disable_job"  >Edit</button>
                                        <button type="submit" title="delete" onClick={() => btndelete(e._id)} className="tn btn-danger btn-sm ml-1" name="delete" data-toggle="modal" data-target="#removeConnection" >Delete</button>
                                        </td> 
                                    </tr>
                                    )
                                    :
                                    <tr>
                                        <td colSpan="6"  className="text-lg-center text-md-left">No Records Found</td>
                                    </tr>
                                    :
                                    ""
                                }
                                {/* <td>1</td>
                                     
                                    <td>erdfs</td>
                                    <td>erdfs</td>
                                        <td>
                                            <button type="submit" title="Edit" onClick={() => getFundingDetails(e._id)} className="tn btn-info btn-sm" name="disable_job"  >Edit</button>
                                    </td> 
                                    </tr> */}
                                </tbody> 
                            </table>
                          </div>
                      </div>
                     

                  {/* <div className="main_create_form">
                    
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
                            <h5>{ e.launchpad_type == 1 ? "ICO": e.launchpad_type==2 ? "IDO" : e.launchpad_type==3 ? "IEO" : null }
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
                      <div className="col-md-12 launchpad_list_content active_launchpad text-lg-center text-md-left">
                          Sorry, No data found
                      </div>
                      }   
                  </div> */}
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

      {elements}
      {modal_data.title ? <Popupmodal name={modal_data} /> : null}
    </>
  )
}

export async function getServerSideProps({query, req}) 
{ 
  const token_id = query.token_id
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
          return { props: { userAgent: userAgent, config: config(userAgent.user_token), token_id:token_id } }
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
