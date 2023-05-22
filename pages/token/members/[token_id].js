
import React, { useState, useEffect,useCallback, useRef } from 'react';  
import Axios from 'axios'
// import Link from 'next/link' 
import Web3 from 'web3' 
import { ethers } from 'ethers'
import { useRouter } from 'next/router' 
import Head from 'next/head'
import JsCookie from "js-cookie" 
import cookie from 'cookie'
import dynamic from 'next/dynamic'
// import "react-datetime/css/react-datetime.css"
import {API_BASE_URL, x_api_key, app_coinpedia_url, coinpedia_url,IMAGE_BASE_URL,  market_coinpedia_url,config,graphqlApiKEY,separator} from '../../../components/constants'; 
import Select from 'react-select'
import Popupmodal from '../../../components/popupmodal'
import Top_header from '../../../components/manage_token/top_header' 
  
 
// import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

// import { Editor } from '@tinymce/tinymce-react';
 
export default function Create_token({config, token_id}) 
{ 
    const Multiselect = dynamic( () => import('multiselect-react-dropdown').then(module => module.Multiselect),
        {
        ssr: false
        }
    )
    const editorRef = useRef(null)
    const router = useRouter()
    const [user_name, set_user_name] = useState("")

    const [wallet_address, setWalletAddress] = useState('')
    const [contract_address, setContractAddress] = useState([{network_type: "0", contract_address: ""}])
    const [live_price, setLivePrice] = useState("")
    const [market_cap, set_market_cap] = useState("") 
    const [err_contract_address, setErrContractAddress] = useState("")
    const [loader, set_loader] = useState("")
    const [add_manually_status, set_add_manually_status] = useState(false)
    const [gender, setgender] = useState(1)
    const [suggested_users, set_suggested_users] = useState([])
    const [suggested_user_status, set_suggested_user_status] = useState(false)
    const [image_base_url] = useState(IMAGE_BASE_URL+"/profile/")
    const [event_speaker, set_event_speaker] = useState([])
    const [event_speaker_array, set_event_speaker_array] = useState([])
    const [manual_event_speaker_array, set_manual_event_speaker_array] = useState([])
    const [unique_email_array, set_unique_email_array] = useState([])
    const [speakers, set_speakers] = useState([])

    const [add_manual_full_name, set_add_manual_full_name] = useState('')
    const [add_manual_email_id, set_add_manual_email_id] = useState('')
    const [add_manual_designation, set_add_manual_designation] = useState('')
    const [add_manual_company_name, set_add_manual_company_name] = useState('')
    const [err_add_manual_full_name, set_err_add_manual_full_name] = useState('')
    const [err_add_manual_email_id, set_err_add_manual_email_id] = useState('')
    const [err_add_manual_designation, set_err_add_manual_designation] = useState('')
    const [err_add_manual_company_name, set_err_add_manual_company_name] = useState("");
    const [err_user_name, set_err_user_name] = useState("")


    const SuggestedListUser=(e)=> 
    {   
        
        set_user_name("")
        set_user_name(e.target.value)
        if(!add_manually_status)
        {
           
        set_add_manual_full_name(e.target.value)

        }
        set_err_user_name("")
        if(e.target.value)
        {
           Axios.get(API_BASE_URL+"app/user_suggestions/"+e.target.value, config).then((response)=>
            {
                if(response.data.status === true)
                { 

                    set_suggested_user_status(true)
                    set_suggested_users(response.data.message) 
                }
                else
                {
                    set_suggested_users([]) 
                }
            })
        }
        else
        {
            set_suggested_user_status(false) 
        }
    }
      const closeAddSpeaker=()=>
      {
        set_user_name("")
        set_add_manually_status(false)
      }

      const addSpeakerManually = () => 
      { 
          
        let formIsValid = true
        //   setModalData({ icon: "", title: "", content: "" })
        set_err_add_manual_full_name("")
        set_err_add_manual_email_id("")
        set_err_add_manual_designation("")
        set_err_add_manual_company_name("")
          
        if (!add_manual_full_name) 
        {
            formIsValid = false
            set_err_add_manual_full_name("The Full Name field is required.")
        }
        else if (add_manual_full_name.length < 4) 
        {
            formIsValid = false
            set_err_add_manual_full_name("The Full Name field must be at least 4 characters in length.")
        }
        else if (add_manual_full_name.length > 100) 
        {
            formIsValid = false
            set_err_add_manual_full_name("The Full Name field must be less than 100 characters in length.")
        }
        
        if (!add_manual_email_id) 
        {
            formIsValid = false
            set_err_add_manual_email_id("The Email Id field is required.")
        }
        else if (!add_manual_email_id.includes('@')) 
        {
            formIsValid = false
            set_err_add_manual_email_id("Invalid Email Id format.")
        }
        else if(!add_manual_email_id.includes('.'))
        {
            formIsValid = false
            set_err_add_manual_email_id("Invalid Email Id format.")
        }
        else if((/\s/g).test(add_manual_email_id))
        {
            formIsValid = false
            set_err_add_manual_email_id('The Email id field must not contain whitespace.')
        }
          
        if(add_manual_company_name) 
        {
            if(add_manual_company_name.length < 4) 
            {
                formIsValid = false
                set_err_add_manual_company_name("The Company name field must be atleast 4 characters.")
            }
        }
        if(add_manual_designation)
        {
            if (add_manual_designation.length < 2) 
            {
                set_err_add_manual_designation("The Designation field must be atleast 2 characters.")
                formIsValid = false
            }
        }
        if(unique_email_array.includes(add_manual_email_id.toLowerCase()))
        {
            formIsValid = false
            set_err_add_manual_email_id("The Email Id is already added in the list.")
        }
           
        if(!formIsValid) 
        {
            return true
        }
        
        var reqObj = {
            email_id: add_manual_email_id,
        }
          
        Axios.post(API_BASE_URL + "app/auth/check_email_id/", reqObj, config).then(res => 
        {
            if(res.data.status) 
            {
                set_add_manually_status(false)
                var insertArray = {}
                
                insertArray["gender"]=gender
                insertArray["email_id"]=add_manual_email_id
                insertArray["full_name"]=add_manual_full_name
                insertArray["work_position"]=add_manual_designation
                insertArray["company_name"]=add_manual_company_name
                manual_event_speaker_array.push(insertArray)
                unique_email_array.push(add_manual_email_id.toLowerCase())
                set_add_manual_email_id("")
                set_add_manual_full_name("")
                set_add_manual_company_name("")
                set_add_manual_designation("")
                set_user_name("")
            }
            else 
            {
                if(res.data.message.email_id)
                {  
                    set_err_add_manual_email_id(res.data.message.email_id)
                }
            }
        })

      }

      const  removeUser = (index) =>
      {
          set_event_speaker_array(event_speaker_array.filter((s, sindex) => index !== sindex))
          set_event_speaker(event_speaker.filter((s, sindex) => index !== sindex))
      }
      const  removeManualUser = (index) =>
      {
          set_manual_event_speaker_array(manual_event_speaker_array.filter((s, sindex) => index !== sindex))
      }
  
      
      const  openAddManuallyPopup=() =>
      {
          set_add_manually_status(true)
          set_err_add_manual_full_name("")
          set_err_add_manual_email_id("")
          set_err_add_manual_designation("")
          set_err_add_manual_company_name("")
      }
      const  validUserName=(speaker) =>
      {
          set_user_name("")
          set_user_name(speaker.user_name)
          set_speakers(speaker)
          set_suggested_user_status(false)
          let formIsValid = true
          set_err_user_name("")
          if (!user_name) 
          {
              formIsValid = false
              set_err_user_name("The event speaker field is required.")
          }
          if(event_speaker.includes(speaker.user_name))
          {
              formIsValid = false
              set_err_user_name("The event speaker is already added in the list.")
          }
          
          if(!formIsValid)
          {
              return
          }
          Axios.get(API_BASE_URL+"app/event/check_username/"+speaker.user_name, config).then((response)=>
          {
          // console.log("cvcvfgds",response)
              if(response.data.status === true)
              { 
                  set_event_speaker_array(prevState => [...prevState, speaker])
                  set_user_name("")
                  event_speaker.push(speaker.user_name)
              }
              else
              {
                  set_err_user_name(response.data.message.alert_message) 
              }
          })
      }
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


  return(
    <>
      <Head>
        <title>Create New Token</title>
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
        <div className="create_airdrop create_launchpad">
          <div className="container">
            <div className="for_padding">
              <div> 
                <div className="token_form">
                <div className='market_token_tabs'>
                <h4>Manage Team Members</h4>
                <Top_header active_tab={5} token_id={token_id}/>
                    {/* <div className="row">
                        <div className="col-lg-3 col-md-4">
                        </div>  
                        <div className="col-lg-6 col-md-6">
                            
                        </div>
                    </div> */}
                </div>

                  <div className=" token_steps">
                  <div className="row">
                    <div className="col-lg-5 col-md-5">
                    <h1>Create Team members</h1>
                    {/* <p >Enter all these fields to create tokenomics</p> */}
            
                    <div className='create_token_details'>
                        <div className="form-custom">
                            <label htmlFor="email">Team Member <span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                            <input type="text" className="form-control" placeholder="User name"  value={user_name} autoFocus=""  onChange={(e)=>SuggestedListUser(e)}/>
                            </div>
                            <div className="error">{err_user_name}</div>
                        </div>

                        {
                            add_manually_status?
                            <>
                            <div className="manual_add_speakers">
                                    <div className="row">
                                        <div className="col-md-10 col-9">
                                            <p>Add Team Members Manually</p>
                                        </div>
                                        <div className="col-md-2 col-3">
                                        <h6><span onClick={()=>closeAddSpeaker()}><button type="button" class="close"><img src="/assets/img/pop-cancel.svg" alt="Close" title="Close" /></button></span></h6>
                                        </div> 
                                    </div>
                                <div className="form-group">
                                <div className="input-group">
                                    <div className="input-group-append country_select" >
                                        <select name="cars" id="cars" className="input-group-text text-left" onChange={(e) => setgender(e.target.value)}>
                                            <option value="1">M</option>
                                            <option value="2">F</option>
                                        </select>   
                                    </div>
                                    <input type="text" className="form-control" value={add_manual_full_name} onChange={(e)=>set_add_manual_full_name(e.target.value)} id="email" placeholder="Full Name"/>
                                </div>
                                {err_add_manual_full_name && <div  className="error">{err_add_manual_full_name}</div>}
                                </div>
                                <div className="form-group">
                                    <input type="email" className="form-control" value={add_manual_email_id} onChange={(e)=>set_add_manual_email_id(e.target.value)} id="pwd" placeholder="Email ID"/>
                                    {err_add_manual_email_id && <div  className="error">{err_add_manual_email_id}</div>}
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" value={add_manual_company_name} onChange={(e)=>set_add_manual_company_name(e.target.value)} id="pwd" placeholder="Company"/>
                                    {err_add_manual_company_name && <div  className="error">{err_add_manual_company_name}</div>}
                                </div>
                                <div className="form-group">
                                    <input type="text" className="form-control" value={add_manual_designation} onChange={(e)=>set_add_manual_designation(e.target.value)} id="pwd" placeholder="Designation"/>
                                    {err_add_manual_designation && <div  className="error">{err_add_manual_designation}</div>}
                                </div>
                                <button type="submit" className="btn btn-default submit_button button_transition" onClick={()=>addSpeakerManually()}>Add Speaker</button>
                            </div></>
                            :
                            ""

                        }
                        
                        {
                                    !add_manually_status?
                                    suggested_user_status && user_name ?
                                    suggested_users.length > 0
                                    ?
                                    <ul className="employees-list">
                                        {
                                            suggested_users.map((e,i)=>
                                            <li key={i} className="employee-suggestions-list" >  
                                                <div className="media">
                                                    <div className="media-left">
                                                        <img src={e.profile_image?image_base_url+e.profile_image:image_base_url+"default.png"} className="media-object"  alt={e.full_name} title={e.full_name} style={{width:"34px"}}/>
                                                    </div>
                                                    <div className="media-body align-self-center create_events_speakers"  onClick={()=> validUserName(e)}>
                                                        <h5 className="media-heading">{e.full_name} <span>@{e.user_name}</span></h5>
                                                        {
                                                            e.work_position && e.company_name ?
                                                            <h6>{e.work_position.replace(/\&amp;/g,'and')} at {e.company_name}</h6>
                                                            :
                                                            ""
                                                        }
                                                
                                                        {
                                                            e.email_id ?
                                                            <h6 className="speakers-suggestions-list_h6 " input type="email">{e.email_id}</h6>
                                                            :
                                                            ""
                                                        }
                                                        
                                                    </div>
                                                    <div className="media-right align-self-center">
                                                        <button type="button" onClick={()=> validUserName(e)}>+ Add</button>
                                                    </div>
                                                </div>

                                                </li>
                                            
                                            )
                                        
                                        } 
                                        <li key="22222" className="employee-suggestions-list">  
                                        <button type="button" className="color-link" onClick={()=> openAddManuallyPopup()}>Add Manually</button>
                                    </li>
                                    </ul> 
                                    :
                                    <>
                                    {
                                        !add_manually_status?
                                        <ul className="employees-list">
                                            <li key="22222" className="employee-suggestions-list">  
                                                Oops, No user found for -  {user_name}  <button type="button" className="color-link" onClick={()=> openAddManuallyPopup()}>Add Manually</button>
                                            </li> 
                                        </ul>
                                        :
                                        ""
                                    }
                                    </> 
                                    :
                                    null
                                    :
                                    null 
                                    }

{
                                        event_speaker_array.length > 0 ?
                                        <div>
                                            <div className="speakers_of_events">
                                                {/* <h4></h4> */}
                                                {
                                                    event_speaker_array.map((item,i) => 
                                                        <div className="media">
                                                            <div className="media-left">
                                                                <img src={item.profile_image?image_base_url+item.profile_image:image_base_url+"default.png"} className="media-object"  alt={item.full_name} title={item.full_name} style={{width:"34px"}}/>
                                                            </div>
                                                            <div className="media-body align-self-center">
                                                                <h5 className="media-heading">{item.full_name} <span>({item.user_name})</span></h5>
                                                                <h6 className="speakers-suggestions-list_h6">{item.work_position} {item.work_position && item.company_name?" @ ":""} {item.company_name}</h6>
                                                                {
                                                                    item.email_id ?
                                                                    <h6 className="speakers-suggestions-list_h6 ">{item.email_id}</h6>
                                                                    :
                                                                    ""
                                                                }
                                                            </div>
                                                            <div className="media-right">
                                                                <img src="/assets/img/speaker_remove.svg" onClick={()=>removeUser(i)} className="media-object lightmode_image" alt="remove" title="remove" />
                                                                <img src="/assets/img/cancel_icon_dark.png" onClick={() => removeUser(i)} className="media-object darkmode_image"  alt="remove" title="remove" />
                                                            </div>
                                                        </div>)
                                                }
                                            </div>
                                        </div>
                                        :
                                        ""
                                    }

                                    {
                                        manual_event_speaker_array.length > 0 ?
                                        <div>
                                            <div className="speakers_of_events">
                                                <h4>Manually Added Team Members</h4>
                                                {
                                                    manual_event_speaker_array.map((item,i) => 
                                                        <div className="media">
                                                            <div className="media-left">
                                                                <img src={item.profile_image?image_base_url+item.profile_image:gender ==1?image_base_url+"default.png":image_base_url+"women3.png"} className="media-object" alt={item.full_name} title={item.full_name}  style={{width:"34px"}}/>
                                                            </div>
                                                            <div className="media-body align-self-center">
                                                                <h5 className="media-heading">{item.full_name} ({item.user_name})</h5>
                                                                <h6 className="speakers-suggestions-list_h6">{item.work_position} {item.work_position && item.company_name?" @ ":""} {item.company_name}</h6>
                                                                {
                                                                    item.email_id ?
                                                                    <h6 className="speakers-suggestions-list_h6 ">{item.email_id}</h6>
                                                                    :
                                                                    ""
                                                                }
                                                            </div>
                                                            <div className="media-right">
                                                                <img src="/assets/img/speaker_remove.svg" onClick={()=>removeManualUser(i)} className="media-object lightmode_image"  alt="remove" title="remove" />
                                                                <img src="/assets/img/cancel_icon_dark.png"    onClick={() =>  removeManualUser(i)}  className="media-object darkmode_image"  alt="remove" title="remove" />
                                                            </div>
                                                        </div>)
                                                }
                                            </div>
                                        </div>
                                        :
                                        ""
                                    }

                        <div className="review_upload_token mt-3">
                        <button className="dsaf button_transition" >
                            {loader ? (
                                <div className="loader"><span className="spinner-border spinner-border-sm "></span>Create</div>
                                ) : (
                                    <>Create</>
                                )}
                        </button> 
                        </div>
                    </div>
                    </div>

                <div className='col-lg-7 col-md-7 '>
                <div className='mb-4'>
                <h1>Team Members List</h1>
                 <p>Here you will get the listed Tokenomics</p>
                </div>
                  <div >
              
                    <div className="table-responsive">
                <table className="table">
                <thead>
                <tr>
                    <th >Sl No.</th>
                    <th >team members</th>
                    {/* <th >% Value</th>
                    <th >Total Supply</th> */}
                    <th >Action</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                        <td>1</td>
                    <td>erdfs</td>
                        <td>
                            <button type="submit" title="Edit" onClick={() => getFundingDetails(e._id)} className="tn btn-info btn-sm" name="disable_job"  >Edit</button>
                    </td> 
                    </tr>
                </tbody> 
            </table>
            <div>
        {/* {
        count > perPage ?
        <div className="pagination_div">
        <div className="pagination_element">
            {
            <ReactPaginate
                previousLabel={currentPage + 1 !== 1 ? "← Prev" : ""}
                nextLabel={currentPage+1 !== pageCount ? "Next →" : ""} 
                breakLabel={<span className="gap">...</span>}
                pageCount={pageCount}
                onPageChange={getFundingList}
                forcePage={currentPage}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"disabled"}
                activeClassName={"active"}
            />}
        </div>
        </div>
        :
        null
    } */}
        
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
        
    


        {/* {modal_data.title ? <Popupmodal name={modal_data} /> : null} */}

    </>
  )
}
export async function getServerSideProps({req, query}) 
{   
    const token_id = query.token_id
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    if(userAgent.user_token)
    {
      if(userAgent.user_email_status)
      {
        return { props: { userAgent: userAgent, config: config(userAgent.user_token), token_id:token_id}} 
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

