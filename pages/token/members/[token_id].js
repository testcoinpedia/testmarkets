
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { API_BASE_URL, x_api_key, app_coinpedia_url, coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, config, graphqlApiKEY, separator } from '../../../components/constants';
import Select from 'react-select'
import Popupmodal from '../../../components/popupmodal'
import Top_header from '../../../components/manage_token/top_header'


// import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

// import { Editor } from '@tinymce/tinymce-react';

export default function Create_token({ config, token_id }) {
    const Multiselect = dynamic(() => import('multiselect-react-dropdown').then(module => module.Multiselect),
        {
            ssr: false
        }
    )
    const editorRef = useRef(null)
    const router = useRouter()
    const [user_name, set_user_name] = useState("")

    const [wallet_address, setWalletAddress] = useState('')
    const [contract_address, setContractAddress] = useState([{ network_type: "0", contract_address: "" }])
    const [live_price, setLivePrice] = useState("")

    // const [team_member, set_team_member] = useState("") 
    const [loader, set_loader] = useState("")
    const [add_manually_status, set_add_manually_status] = useState(false)
    const [gender, setgender] = useState(1)
    const [suggested_users, set_suggested_users] = useState([])
    const [suggested_user_status, set_suggested_user_status] = useState(false)
    const [image_base_url] = useState(IMAGE_BASE_URL + "/profile/")
    const [team_member, set_team_member] = useState([])
    const [team_member_array, set_team_member_array] = useState([])
    const [manual_team_member_array, set_manual_team_member_array] = useState([])
    const [unique_email_array, set_unique_email_array] = useState([])
    const [speakers, set_speakers] = useState([])
    const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
    const [team_member_row_id, set_team_member_row_id] = useState('')
    const [team_member_list, set_team_member_list] = useState([])
    const [api_loader, set_api_loader] = useState(false)
    const [input_status, set_input_status] = useState(false)
    const [manual_input_status, set_manual_input_status] = useState(false)
    const [member_id, set_member_id] = useState('')
    const [elements, set_elements] = useState([]);
    const [approval_status, set_approval_status] = useState("")

    // console.log("team_member", team_member)
    const [add_manual_full_name, set_add_manual_full_name] = useState('')
    const [add_manual_email_id, set_add_manual_email_id] = useState('')
    const [add_manual_designation, set_add_manual_designation] = useState('')
    const [add_manual_company_name, set_add_manual_company_name] = useState('')
    const [err_add_manual_full_name, set_err_add_manual_full_name] = useState('')
    const [err_add_manual_email_id, set_err_add_manual_email_id] = useState('')
    const [err_add_manual_designation, set_err_add_manual_designation] = useState('')
    const [err_add_manual_company_name, set_err_add_manual_company_name] = useState("");
    const [err_user_name, set_err_user_name] = useState("")
    const [err_team_member, set_err_team_member] = useState("")

    // markets/users/manage_team_members/list/:token_row_id
    

    //markets/users/manage_team_members/list/delete_member/:member_row_id
        
    // markets/users/manage_team_members/add_member
    // member_id
    // token_row_id

    // manual member
    // markets/users/manage_team_members/add_manual_member
    // gender
    // token_row_id
    // full_name
    // email_id
    // work_position
    // company_name
    
    
    
    
    useEffect(() => {
        teammemberList()
        getTokenDetails()
    }, [token_id])

    const getTokenDetails=()=>
    {
    
      Axios.get(API_BASE_URL+"markets/users/manage_crypto/individual_details/"+token_id, config)
      .then(response=>{
        if(response.data.status){ 
          // console.log(response.data) 
          // set_supply(response.data.message.total_supply)
          set_approval_status((response.data.message.approval_status) ? parseInt(response.data.message.approval_status):0)
        }
      })
    }


    const SuggestedListUser = (e) => {

        set_user_name("")
        set_user_name(e.target.value)
        if (!add_manually_status) {

            set_add_manual_full_name(e.target.value)

        }
        set_err_user_name("")
        if (e.target.value) {
            Axios.get(API_BASE_URL + "static/user_suggestions/" + e.target.value, config).then((response) => {
                if (response.data.status === true) {

                    set_suggested_user_status(true)
                    set_suggested_users(response.data.message)
                }
                else {
                    set_suggested_users([])
                }
            })
        }
        else {
            set_suggested_user_status(false)
        }
    }
    const closeAddSpeaker = () => {
        set_user_name("")
        set_add_manually_status(false)
        set_input_status(false)
        set_manual_input_status(false)
    }

    const addSpeakerManually = () => {

        let formIsValid = true
          setModalData({ icon: "", title: "", content: "" })
        set_err_add_manual_full_name("")
        set_err_add_manual_email_id("")
        set_err_add_manual_designation("")
        set_err_add_manual_company_name("")

        if (!add_manual_full_name) {
            formIsValid = false
            set_err_add_manual_full_name("The Full Name field is required.")
        }
        else if (add_manual_full_name.length < 4) {
            formIsValid = false
            set_err_add_manual_full_name("The Full Name field must be at least 4 characters in length.")
        }
        else if (add_manual_full_name.length > 100) {
            formIsValid = false
            set_err_add_manual_full_name("The Full Name field must be less than 100 characters in length.")
        }

        if (!add_manual_email_id) {
            formIsValid = false
            set_err_add_manual_email_id("The Email Id field is required.")
        }
        else if (!add_manual_email_id.includes('@')) {
            formIsValid = false
            set_err_add_manual_email_id("Invalid Email Id format.")
        }
        else if (!add_manual_email_id.includes('.')) {
            formIsValid = false
            set_err_add_manual_email_id("Invalid Email Id format.")
        }
        else if ((/\s/g).test(add_manual_email_id)) {
            formIsValid = false
            set_err_add_manual_email_id('The Email id field must not contain whitespace.')
        }

        if (add_manual_company_name) {
            if (add_manual_company_name.length < 4) {
                formIsValid = false
                set_err_add_manual_company_name("The Company name field must be atleast 4 characters.")
            }
        }
        if (add_manual_designation) {
            if (add_manual_designation.length < 2) {
                set_err_add_manual_designation("The Designation field must be atleast 2 characters.")
                formIsValid = false
            }
        }
        if (unique_email_array.includes(add_manual_email_id.toLowerCase())) {
            formIsValid = false
            set_err_add_manual_email_id("The Email Id is already added in the list.")
        }

        if (!formIsValid) {
            return true
        }

        var reqObj = {
            email_id: add_manual_email_id,
            gender:gender,
            token_row_id:token_id,
            full_name:add_manual_full_name,
            work_position:add_manual_designation,
            company_name:add_manual_company_name,
        }

        Axios.post(API_BASE_URL + "markets/users/manage_team_members/add_manual_member/", reqObj, config).then(res => {
            if (res.data.status) {
               
                setModalData({ icon: "/assets/img/update-successful.png", title: "Thank you ", content: res.data.message.alert_message })
                set_add_manual_email_id("")
                set_add_manual_full_name("")
                set_add_manual_company_name("")
                set_add_manual_designation("")
                set_user_name("")
                set_input_status(false)
                set_add_manually_status(false)
                set_manual_input_status(false)
                teammemberList()
            }
            else {
                if (res.data.message.email_id) {
                    set_err_add_manual_email_id(res.data.message.email_id)
                }
            }
        })

    }

    const removeUser = (index) => {
        set_team_member_array(team_member_array.filter((s, sindex) => index !== sindex))
        set_team_member(team_member.filter((s, sindex) => index !== sindex))
        set_input_status(false)
    }
    const removeManualUser = (index) => {
        set_manual_team_member_array(manual_team_member_array.filter((s, sindex) => index !== sindex))
        set_input_status(false)
    }


    const openAddManuallyPopup = () => {
        set_add_manually_status(true)
        set_input_status(true)
        set_err_add_manual_full_name("")
        set_err_add_manual_email_id("")
        set_err_add_manual_designation("")
        set_err_add_manual_company_name("")
        set_manual_input_status(true)
    }
    const validUserName = (speaker) => {
        set_user_name("")
        set_user_name(speaker.user_name)
        set_speakers(speaker)
        set_member_id(speaker._id)
        set_suggested_user_status(false)
        let formIsValid = true
        set_err_user_name("")
        if (!user_name) {
            formIsValid = false
            set_err_user_name("The team member field is required.")
        }
        if (team_member.includes(speaker.user_name)) {
            formIsValid = false
            set_err_user_name("The team member is already added in the list.")
        }

        if (!formIsValid) {
            return
        }
        Axios.get(API_BASE_URL + "static/check_username/" + speaker.user_name, config).then((response) => {
            // console.log("cvcvfgds",response)
            if (response.data.status === true) {
                set_team_member_array(prevState => [...prevState, speaker])
                set_user_name("")
                team_member.push(speaker.user_name)
                set_input_status(true)
            }
            else {
                set_err_user_name(response.data.message.alert_message)
            }
        })
    }

    const createMember = () => {
        let formValid = true
        setModalData({ icon: "", title: "", content: "" })
        set_err_team_member('')
        // set_err_user_name('')

        if (team_member_array.length == 0 && manual_team_member_array.length == 0) {
            set_err_team_member('The team member field is required.')
            formValid = false
        }

        if (!formValid) {
            return
        }


        set_loader(true)
        const reqObj = {
            token_row_id: token_id,
            member_id: member_id,
           

        }

        Axios.post(API_BASE_URL + "markets/users/manage_team_members/add_member/", reqObj, config).then(response => {
            set_loader(false)
            if (response.data.status) {
                setModalData({ icon: "/assets/img/update-successful.png", title: "Thank you ", content: response.data.message.alert_message })
                set_input_status(false)
                set_team_member_array([])
                 teammemberList();

            }
            {
             
            }
        })

    }


    const teammemberList = () => {
        Axios.get(API_BASE_URL + "markets/users/manage_team_members/list/" + token_id, config).then(
            (response) => {
                // console.log("dfgf", response);
                if (response.data.status) {
                    set_api_loader(false)
                    set_team_member_list(response.data.message);
                }
            }
        );
    };

const btndelete = (row_id) => {
    let ele= <div className="remove_modal">
    <div className="modal" id="removeConnection">
        <div className="modal-dialog modal-sm">
        <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close"  data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt = "Close" /></button>
            <div className="text-center">
            <div className=""><img src="/assets/img/cancel.png" className="prop_modal_img"/></div>
                <h4 className="">Delete Team Member!</h4>
                <p>Do you really want to delete this team member?</p>
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
        API_BASE_URL+"markets/users/manage_team_members/delete_member/"+row_id,
        config
    ).then((response) => {
        if (response.data.status === true) {
        setModalData({
            icon: "/assets/img/update-successful.png",
            title: "Thank You!",
            content: response.data.message.alert_message,})
            teammemberList();
        // clearForm();
        // set_edit_launchpad_row_id("");
        } else {
        setModalData({
            icon: "/assets/img/cancel.png",
            title: "Oops!",
            content: response.data.message.alert_message,
        });
        }
    });
    };

    const makeJobSchema = () => {
        return {
            "@context": "http://schema.org/",
            "@type": "Organization",
            "name": "Manage Team Details",
            "url": market_coinpedia_url+"token/members/"+token_id+ "/",
            "logo": "https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
            "sameAs": ["http://www.facebook.com/Coinpedia.org/", "https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        }
    }


    return (
        <>
            <Head>
                <title>Manage Team Details | CoinPedia Markets</title>
                <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' />
                <meta name="description" content="Add new team members, edit or remove your listed token on coinpedia markets." />
                <meta name="keywords" content="Manage team details, token listing, coinpedia markets, how to add team details on  coinpedia." />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Manage Team Details | CoinPedia Markets" />
                <meta property="og:description" content="Add new team members, edit or remove your listed token on coinpedia markets." />
                <meta property="og:url" content={market_coinpedia_url+"token/members/"+token_id+ "/"} />
                <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
                <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
                <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
                <meta property="og:image:width" content="400" />
                <meta property="og:image:height" content="400" />
                <meta property="og:image:type" content="image/png" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@coinpedia" />
                <meta name="twitter:creator" content="@coinpedia" />
                <meta name="twitter:title" content="Manage Team Details | CoinPedia Markets" />
                <meta name="twitter:description" content="Add new team members, edit or remove your listed token on coinpedia markets." />
                <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
                <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
                <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
                <link rel="canonical" href={market_coinpedia_url+"token/members/"+token_id+ "/"} />
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} />
            </Head>
            <div className="page">
                <div className="create_airdrop create_launchpad">
                    <div className="container">
                        <div className="for_padding">
                            <div>
                                <div className="token_form">
                                    <div className='market_token_tabs'>
                                        <h1 className='page_main_heading'>Manage Team Details</h1>
                                        <p>Create, Edit, or Remove team details of your token from here.</p>
                                        <Top_header active_tab={5} token_id={token_id} approval_status={approval_status}/>
                                    </div>
                                    <div className=" token_steps">
                                        <div className="row">
                                            <div className="col-lg-4 col-md-4">
                                                <div className="row">
                                                    <div className="col-md-10 col-9">
                                                        <div className='form_headings'>
                                                            <h5>Add Team Member {manual_input_status ? "Manually" : ""}</h5>
                                                            <p >Add the details of your team members.</p>
                                                        </div>
                                                    </div>
                                                    {manual_input_status ?
                                                    <div className="col-md-2 col-3">
                                                        <button type="button" onClick={() => closeAddSpeaker()} className="close"><img src="https://events.coinpedia.org/assets/img/pop-cancel.svg" alt="Close" title="Close" /></button>
                                                    </div>
                                                    :""}
                                                </div>
                                                <div className='create_token_details add_team_member'>
                                                    {!input_status ?
                                                        <>
                                                            <div className="form-custom">
                                                                <label htmlFor="email">Team Member <span className="label_star">*</span></label>

                                                                <div className="form-group input_block_outline">
                                                                    <input type="text" className="form-control" placeholder="User name" value={user_name} autoFocus="" onChange={(e) => SuggestedListUser(e)} />
                                                                </div>
                                                                <div className="error">{err_team_member}</div>
                                                            </div>
                                                        </>
                                                        : null
                                                    }
                                                    {
                                                        add_manually_status ?
                                                            <>
                                                                <div className="manual_add_speakers">
                                                                   
                                                                    <div className="form-custom">
                                                                        <label htmlFor="email">Full Name<span className="label_star">*</span></label>
                                                                        <div className="form-group input_block_outline">
                                                                            <div className="input-group">
                                                                                <div className="input-group-append country_select" >
                                                                                    <select name="cars" id="cars" className="input-group-text text-left" onChange={(e) => setgender(e.target.value)}>
                                                                                        <option value="1">M</option>
                                                                                        <option value="2">F</option>
                                                                                    </select>
                                                                                </div>
                                                                                <input type="text" className="form-control" autoComplete='off' value={add_manual_full_name} onChange={(e) => set_add_manual_full_name(e.target.value)} id="email" placeholder="Full Name" />
                                                                            </div>
                                                                        </div>
                                                                        {err_add_manual_full_name && <div className="error">{err_add_manual_full_name}</div>}
                                                                    </div>
                                                                    <div className="form-custom">
                                                                        <label htmlFor="email">Email ID<span className="label_star">*</span></label>
                                                                        <div className="form-group input_block_outline">
                                                                            <input type="email" className="form-control" autoComplete='off' value={add_manual_email_id} onChange={(e) => set_add_manual_email_id(e.target.value)} id="pwd" placeholder="Email ID" />
                                                                        </div>
                                                                        {err_add_manual_email_id && <div className="error">{err_add_manual_email_id}</div>}
                                                                    </div>
                                                                    <div className="form-custom">
                                                                        <label htmlFor="email">Company</label>
                                                                        <div className="form-group input_block_outline">
                                                                            <input type="text" className="form-control" autoComplete='off' value={add_manual_company_name} onChange={(e) => set_add_manual_company_name(e.target.value)} id="pwd" placeholder="Company" />
                                                                        </div>
                                                                        {err_add_manual_company_name && <div className="error">{err_add_manual_company_name}</div>}
                                                                    </div>
                                                                    <div className="form-custom">
                                                                        <label htmlFor="email">Designation</label>
                                                                        <div className="form-group input_block_outline">
                                                                            <input type="text" className="form-control" autoComplete='off' value={add_manual_designation} onChange={(e) => set_add_manual_designation(e.target.value)} id="pwd" placeholder="Designation" />
                                                                        </div>
                                                                        {err_add_manual_designation && <div className="error">{err_add_manual_designation}</div>}
                                                                    </div>
                                                                    <div className="review_upload_token mt-3">
                                                                        <button type="submit" className="dsaf button_transition" onClick={() => addSpeakerManually()}> Add Member Manually</button>
                                                                    </div>
                                                                </div></>
                                                            :
                                                            ""
                                                    }

                                                    {
                                                        !add_manually_status ?
                                                            suggested_user_status && user_name ?
                                                                suggested_users.length > 0
                                                                    ?
                                                                    <ul className="employees-list">
                                                                        {
                                                                            suggested_users.map((e, i) =>
                                                                                <li key={i} className="employee-suggestions-list" >
                                                                                    <div className="media">
                                                                                        <div className="media-left">
                                                                                            <img src={e.profile_image ? image_base_url + e.profile_image : image_base_url + "default.png"} className="media-object" alt={e.full_name} title={e.full_name} style={{ width: "34px" }} />
                                                                                        </div>
                                                                                        <div className="media-body align-self-center create_events_speakers" onClick={() => validUserName(e)}>
                                                                                            <h5 className="media-heading">{e.full_name} <span>@{e.user_name}</span></h5>
                                                                                            {
                                                                                                e.work_position && e.company_name ?
                                                                                                    <h6>{e.work_position.replace(/\&amp;/g, 'and')} at {e.company_name}</h6>
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
                                                                                            <button type="button" onClick={() => validUserName(e)}>+ Add</button>
                                                                                        </div>
                                                                                    </div>

                                                                                </li>

                                                                            )

                                                                        }
                                                                        <li key="22222" className="employee-suggestions-list">
                                                                            <button type="button" className="color-link" onClick={() => openAddManuallyPopup()}>Add Manually</button>
                                                                        </li>
                                                                    </ul>
                                                                    :
                                                                    <>
                                                                        {
                                                                            !add_manually_status ?
                                                                                <ul className="employees-list">
                                                                                    <li key="22222" className="employee-suggestions-list">
                                                                                        Oops, No user found for -  {user_name}  <button type="button" className="color-link" onClick={() => openAddManuallyPopup()}>Add Manually</button>
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
                                                        team_member_array.length > 0 ?
                                                            <div>
                                                                <div className="speakers_of_events">
                                                                    {
                                                                        team_member_array.map((item, i) =>
                                                                            <div className="media">
                                                                                <div className="media-left">
                                                                                    <img src={item.profile_image ? image_base_url + item.profile_image : image_base_url + "default.png"} className="media-object" alt={item.full_name} title={item.full_name} style={{ width: "34px" }} />
                                                                                </div>
                                                                                <div className="media-body align-self-center">
                                                                                    <h5 className="media-heading">{item.full_name} <span>{item.user_name?(item.user_name):""}</span></h5>
                                                                                    <h6 className="speakers-suggestions-list_h6">{item.work_position ? item.work_position.replace(/\&amp;/g, 'and'):""} {item.work_position && item.company_name ? " @ " : ""} {item.company_name}</h6>
                                                                                    {
                                                                                        item.email_id ?
                                                                                            <h6 className="speakers-suggestions-list_h6 ">{item.email_id}</h6>
                                                                                            :
                                                                                            ""
                                                                                    }
                                                                                </div>
                                                                                <div className="media-right">
                                                                                    <img src="https://events.coinpedia.org/assets/img/cancel_icon_dark.png" onClick={() => removeUser(i)} className="media-object lightmode_image" alt="remove" title="remove" />
                                                                                    <img src="https://events.coinpedia.org/assets/img/cancel_icon_dark.png" onClick={() => removeUser(i)} className="media-object darkmode_image" alt="remove" title="remove" />
                                                                                </div>
                                                                            </div>)
                                                                    }
                                                                </div>
                                                            </div>
                                                            :
                                                            ""
                                                    }

                                                   
                                                    {!manual_input_status ?
                                                        <div className="review_upload_token mt-3">
                                                            <button className="dsaf button_transition" onClick={() => createMember()}>
                                                                {loader ? (
                                                                    <div className="loader"><span className="spinner-border spinner-border-sm " ></span> Add Member</div>
                                                                ) : (
                                                                    <> Add Member</>
                                                                )}
                                                            </button>
                                                        </div>
                                                        : null}
                                                </div>
                                            </div>
                                            <div className="col-lg-1 col-md-1">
                                            </div>
                                            <div className='col-lg-7 col-md-7 '>
                                                <div className='form_headings'>
                                                    <h5>Team Members List ({team_member_list.length})</h5>
                                                    <p>Here you will find the listed team members.</p>
                                                </div>

                                                <div className='market_page_data token_tables'>
                                                    <div className="table-responsive">
                                                        <table className="table">
                                                            <thead>
                                                                <tr>
                                                                    <th className="mobile_fixed_first" style={{ minWidth: '35px' }}>#</th>
                                                                    <th>
                                                                        Name
                                                                    </th>
                                                                    <th>Email ID
                                                                    </th>
                                                                    <th>Register Status</th>
                                                                    <th >Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {
                                                                !api_loader?
                                                                team_member_list.length>0?
                                                                team_member_list.map((e, i) =>
                                                                    <tr key={i}>
                                                                        <td>{i+1}</td>
                                                                        <td><div className='media'>
                                                                            <div className='media-left align-self-center'> <img src={e.profile_image ? image_base_url + e.profile_image : image_base_url + "default.png"} className="media-object"
                                                                         alt={e.full_name} title={e.full_name} style={{ width: "34px" }} />
                                                                          </div>
                                                                            <div className='media-body align-self-center m-0'>
                                                                                <h4 className='media-heading'>{e.full_name}</h4>
                                                                                <p>{e.work_position?<>{e.work_position.replace(/\&amp;/g, 'and')}</>:""} {e.work_position & e.company_name ? "@":""} <span>{e.company_name}</span></p>
                                                                            </div>
                                                                        </div></td>
                                                                        
                                                                        <td>{e.email_id?e.email_id: "-"}</td>
                                                                        <td>{e.member_type==1?"Registered":"Manual"}</td>
                                                                        <td>
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
                                                                {/* <tr>
                                                                    <td>1</td>
                                                                    <td>
                                                                        <div className='media'>
                                                                            <div className='media-left align-self-center'>
                                                                                <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/18876.png" />
                                                                            </div>
                                                                            <div className='media-body align-self-center m-0'>
                                                                                <h4 className='media-heading'>Nissa Shaikh</h4>
                                                                                <p>Developer <span >Ultimez Technology</span></p>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <a>ultimeznissa@gmail.com</a>
                                                                        <p>15 mins ago</p>
                                                                    </td>
                                                                    <td>Registered</td>
                                                                    <td>
                                                                        <button type="submit" title="delete" className="tn btn-danger btn-sm ml-1" name="delete" data-toggle="modal" data-target="#removeConnection" >Delete</button>
                                                                    </td>
                                                                </tr> */}
                                                            </tbody>
                                                        </table>
                                                        <div>
                                                           
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
            {modal_data.title ? <Popupmodal name={modal_data} /> : null}
            {elements}
        </>
    )
}
export async function getServerSideProps({ req, query }) {
    const token_id = query.token_id
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    if (userAgent.user_token) {
        if (userAgent.user_email_status) {
            return { props: { userAgent: userAgent, config: config(userAgent.user_token), token_id: token_id } }
        }
        else {
            return {
                redirect: {
                    destination: app_coinpedia_url + 'verify-email',
                    permanent: false,
                }
            }
        }
    }
    else {
        return {
            redirect: {
                destination: app_coinpedia_url + 'login',
                permanent: false,
            }
        }
    }
}

