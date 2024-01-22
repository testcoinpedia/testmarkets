import React, { useState } from 'react'
import Axios from 'axios'
import Web3 from 'web3'
import JsCookie from "js-cookie"
import OtpInput from 'react-otp-input'
// import TelegramLoginButton from 'react-telegram-login';
import Countdown from 'react-countdown'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'
import { GoogleLogin } from 'react-google-login'
import AppleLogin from 'react-apple-login'
import Popupmodal from '../../popupmodal'
import { setLoginData, country_list, MAIN_API_BASE_URL, cookieDomainExtension, market_coinpedia_url,config, app_coinpedia_url, coinpedia_url, googleClientId } from '../../constants'

export default function LoginPopupmodal(props) 
{
    const router = useRouter()
    const dispatch = useDispatch()
    const [login_id, setLoginID] = useState("")
    const [login_loader_status, set_login_loader_status] = useState(false)
    const [register_loader_status, set_register_loader_status] = useState(false)
    const [login_status, set_login_status] = useState("")
    const [showmodal, setShowModal] = useState(props.name.status)
    const [err_login_id, setErrLoginID] = useState("")
    const [countryList, set_countryList] = useState(country_list)
    const [searchParam] = useState(["country_name"])
    const [country_list_status, set_country_list_status] = useState(false)
    const [country_search_value, set_country_search_value] = useState("")
    const [page_type, set_page_type] = useState(props.name.un_registered_guest_email_id ? 2:0) //0:login, 1: verify OTP, 2:confirm details, 3: confirm popup
    const [keep_me_login_status, set_keep_me_login_status] = useState(false)

    // OTP Page
    const [registered_status, set_registered_status] = useState(false)
    const [otp_number, setOtpNumber] = useState('')
    const [err_otp_number, setErrOtpNumber] = useState('')
    const [loader, set_loader] = useState(false)
    const [verify_end_n_time, set_verify_end_n_time] = useState("")
    let date = Date.now() + verify_end_n_time
    const [expirationDate, set_expirationDate] = useState(date)
   
    // Confirm Details Page
    const [gender, setgender] = useState("1")
    const [temp_token, set_temp_token] = useState("")
    const [full_name, setfull_name] = useState((JsCookie.get('temp_full_name')) ? userAgent.temp_full_name :props.name.un_registered_guest_full_name ? props.name.un_registered_guest_full_name: "")
    const [register_type, set_register_type] = useState(props.name.un_registered_guest_email_id ? 1:0)
    const [email_id, setEmailId] = useState(props.name.un_registered_guest_email_id ? props.name.un_registered_guest_email_id:"")
    const [temp_facebook_email] = useState((JsCookie.get('temp_facebook_email')) ? JsCookie.get('temp_facebook_email') : "")
    const [temp_wallet_address, set_temp_wallet_address] = useState("")
    const [mobile_number, set_mobile_number] = useState("")
    
    const [referral_id, setReferralId] = useState("")
   
    const [err_full_name, setErrfullName] = useState("")
    const [err_email_id, setErrEmailId] = useState("")
    const [err_mobile_number, set_err_mobile_number] = useState("")
    const [err_wallet_address, setErrWalletAddress] = useState("")
    const [err_referral_id, setErrRefferalId] = useState("")
   
    const [country_data, set_country_data] = useState({ country_id: "101", country_code: "+91", country_flag: "in.png" })
    const [user_token, set_user_token] = useState("")
    const [err_telegram_number, set_err_telegram_number] = useState("")
    const [login_data, set_login_data] = useState([])
    const [modal_data, set_modal_data] = useState({icon:"", title:"", content:""}) 

    const [gmail_loader_status, set_gmail_loader_status] = useState(false)
    const [apple_loader_status, set_apple_loader_status] = useState(false)
    const [current_page_url] = useState(market_coinpedia_url+((router.asPath).substring(1)))

    let sendData = {}

    const checkAppleLogin = async (data) =>
    {  
        // console.log("data", data)
        
        set_apple_loader_status(true)
        await set_modal_data({icon: "",title: "",content:""})
        if(!data.error)
        {   
            if(data.authorization)
            {
              
                const id_token = data.authorization ? data.authorization.id_token : ""
                console.log("data", data)
                var full_name = ""
                var email_id = ""
                if(data.user)
                {
                    var firstName = data.user.firstName ? data.user.firstName : ""
                    var lastName = data.user.lastName ? data.user.lastName : ""
                    full_name = firstName+" "+lastName
                    email_id = data.user.email ? data.user.email : ""
                }

                const req_obj = {
                    full_name : full_name,
                    email_id: email_id,
                    domain_row_id:2,
                    page:current_page_url
                }

                const res = await Axios.post(MAIN_API_BASE_URL+'app/auth/user_login_with_apple', req_obj, config(id_token))
                // console.log(res.data)  
                if(res.data)
                {   
                    set_apple_loader_status(false)
                    setShowModal(false)
                    if(res.data.status === true)
                    { 
                        setLoginData(res.data.message)
                        dispatch({type:'loginAccount', data:res.data.message})
                        
                        
                        sendData["login_data"] = res.data.message
                        props.name.callback(sendData)
                    }
                    else
                    {
                        set_modal_data({icon:"", title:"Oops!", content:res.data.message.alert_message}) 
                    }
                }
            }
        }
    }

    const onGmailLoginSuccess=(response)=>
    {   
        // console.log("gmail", response)
        set_gmail_loader_status(true)
        const reqObj = {
            email_id : response.profileObj.email,
            full_name: response.profileObj.name,
            google_id: response.profileObj.googleId,
            user_name: response.profileObj.givenName,
            domain_row_id:2,
            page:current_page_url

        }
        
        Axios.post(MAIN_API_BASE_URL+'app/auth/user_login_with_gmail', reqObj, config("")).then(res => 
        {  
            set_gmail_loader_status(false)
            // console.log(res.data)  
            setShowModal(false)  
            if(res.data.status === true)
            {   
                setLoginData(res.data.message)
                dispatch({type:'loginAccount', data:res.data.message})

               
                sendData["login_data"] = res.data.message
                props.name.callback(sendData)
            }
            else
            {
                set_modal_data({ icon: '/assets/img/close_error.png', title: "OOPS!", content: res.data.message.alert_message})
            }
            
        })
    }

    const onGmailFailureSuccess=(res)=>
    {
    //    console.log("login failed;", res)
    }

    

    const LoginStatus = (login) => 
    {
        setLoginID(login)
        let formIsValid = true
        if (!login) {
            set_login_status("")
            formIsValid = false
        }
        if (!formIsValid) {
            return
        }
        if (!(/^[a-zA-Z]+$/).test(login)) {
            set_login_status(2)
        }
        if (!(/^\d+$/).test(login)) {
            set_login_status(1)
        }
    }

    const setCountryData = (param) => 
    {
        set_country_list_status(false)
        set_country_data({ country_id: param.country_id, country_code: param.country_code, country_flag: param.country_flag })
    }

    const submitLoginIn = (e) => 
    {
        e.preventDefault()
        setErrWalletAddress("")
        setErrLoginID("")
        set_err_telegram_number("")
        let formIsValid = true
        if(!login_id) 
        {
            formIsValid = false
            setErrLoginID("The Email ID field is required.")
        }
        else if(!login_id.includes('@')) 
        {
            formIsValid = false
            setErrLoginID("The Email ID field must contain a valid email")
        }

        if(!formIsValid) 
        {
            return
        }
        let keep_me_status = 1
        if (keep_me_login_status) {
            keep_me_status = 2
        }
        
       
        set_login_loader_status(true)
        const login_data = {
            email_id: login_id,
            keepme_status:keep_me_status,
           
            domain_row_id:2,
            page:current_page_url

        }

        Axios.post(MAIN_API_BASE_URL + 'app/auth/login_with_email', login_data, config("")).then(response => 
        {
            set_login_loader_status(false)
            if(response.data.status==true) 
            {
                if(response.data.message.registered_status) 
                {
                    set_registered_status(true)
                    JsCookie.set('temp_token', response.data.message.token, { domain: cookieDomainExtension })
                    JsCookie.set("temp_email_id", login_id, { domain: cookieDomainExtension })
                    JsCookie.set('verify_end_n_time', Date.now() + 600000, { domain: cookieDomainExtension })
                    JsCookie.set('register_type', 1, { domain: cookieDomainExtension })
                    set_temp_token(response.data.message.token)
                    setEmailId(login_id)

                    const abc = Date.now() + 600000
                    const def = abc - Date.now()
                    set_verify_end_n_time(def)
                    let date_counter = Date.now() + def
                    set_expirationDate(date_counter)

                    set_register_type(1)
                    set_page_type(1)
                }
                else 
                {
                    set_registered_status(false)
                    // JsCookie.set('register_type', 1, {domain:cookieDomainExtension}) 
                    JsCookie.set("temp_email_id", login_id, { domain: cookieDomainExtension })
                    setEmailId(login_id)
                    set_register_type(1)
                    set_page_type(2)
                }
            }
            else 
            {
                if (response.data.message.email_id) 
                {
                    setErrLoginID(response.data.message.email_id)
                }
                if(response.data.message.alert_message)
                {
                    setErrLoginID(response.data.message.alert_message+" (email: info@coinpedia.org)")
                }
            }
        })
    }

    

    const handleChange = (pass_otp_number) => {
        if (pass_otp_number.length <= 6) {
            setOtpNumber(pass_otp_number)
        }

        if (pass_otp_number.length == 6) {
            submitVerifyEmail(pass_otp_number)
        }
    }

    const renderer = ({ minutes, seconds, completed }) => {
        if (completed) {
            return (
                <>
                    <span onClick={() => reSendOTP()}>Resend OTP</span>
                </>
            )
        }
        else {
            return (
                <>
                    The code is valid for {minutes}:{seconds}
                </>
            )
        }
    }
   
    const submitVerifyEmail = (pass_otp_number) => 
    {
        setErrOtpNumber("")
        set_loader(true)
        // console.log(pass_otp_number)
        let formIsValid = true
        if (pass_otp_number === '') {
            setErrOtpNumber('The OTP Number field is required.')
            formIsValid = false
        }
        else if (pass_otp_number.length < 6) {
            setErrOtpNumber("The OTP Number field is invalid.")
            formIsValid = false
        }

        if (!formIsValid) {
            return true
        }

        var reqObj = {
            otp_number: pass_otp_number,
            domain_row_id:2,
            page:current_page_url
        }

        Axios.post(MAIN_API_BASE_URL + "app/auth/verify_otp_via_email", reqObj, config(temp_token)).then(async (res) => 
        {
            set_loader(false)
            // console.log("login_data", res.data)
            if(res.data.status) 
            {
                setLoginData(res.data.message)
                if(registered_status) 
                {
                    dispatch({ type:'loginAccount', data: res.data.message})

                    sendData["login_data"] = res.data.message
                    setShowModal(false)
                    props.name.callback(sendData)
                }
                else {
                    dispatch({ type:'loginAccount', data: res.data.message })
                    set_user_token(res.data.message.token)
                    set_login_data(res.data.message)
                    set_page_type(3)
                }
            }
            else 
            {
                setErrOtpNumber(res.data.message.otp_number)
                if (res.data.message.alert_message) {
                    setErrOtpNumber(res.data.message.alert_message)
                }
            }
        })
    }

    const reSendOTP = () => {
        let keep_me_status = 1
        if (keep_me_login_status) {
            keep_me_status = 2
        }
        const login_data = {
            email_id: email_id,
            keepme_status:keep_me_status,
        
            domain_row_id:2,
            page:current_page_url


        }
        Axios.post(MAIN_API_BASE_URL + "app/auth/login_with_email", login_data, config("")).then(res => {
            // console.log(res)
            if (res.data.status) {
                JsCookie.set('verify_end_n_time', Date.now() + 600000)
                JsCookie.set('temp_token', res.data.message.token)
                JsCookie.set("temp_email_id", email_id.toLowerCase())
                set_temp_token(res.data.message.token)
                // set_verify_end_n_time(JsCookie.get('verify_end_n_time'))
                // let abc = Date.now() + 600000
                // set_expirationDate(abc)

                set_expirationDate("")
                set_verify_end_n_time("")
                set_expirationDate(Date.now() + 600000)
                set_verify_end_n_time(Date.now() + 600000)

                setErrOtpNumber(res.data.message.alert_message)
                setEmailId(email_id.toLowerCase())
            }
            else {
                setErrOtpNumber(res.data.message.otp_number)
            }
        })
    }

    const clearPreLoginAccount = () => 
    {
        setOtpNumber("")
        JsCookie.remove('temp_user_name', { domain: cookieDomainExtension })
        JsCookie.remove('temp_wallet_address', { domain: cookieDomainExtension })
        JsCookie.remove('temp_token', { domain: cookieDomainExtension })
        JsCookie.remove('temp_email_id', { domain: cookieDomainExtension })
        JsCookie.remove('verify_end_n_time', { domain: cookieDomainExtension })
        JsCookie.remove('register_type', { domain: cookieDomainExtension })
        set_page_type(0)
        setErrOtpNumber("")
    }

    const createNewAccount = (e) => 
    {
        var v_register_type = parseInt(register_type)

        e.preventDefault()
        let formIsValid = true
        setErrfullName('')
        setErrEmailId('')
        setErrRefferalId('')
        set_err_mobile_number('')
        setErrWalletAddress("")
        

        if (!gender) 
        {
            formIsValid = false
            setErrfullName("The Gender field is required.")
        }
        else if(!full_name) 
        {
            formIsValid = false
            setErrfullName("The Full Name field is required.")
        }
        else if(full_name.length < 4)
        {
            formIsValid = false
            setErrfullName("The Full Name field must be at least 4 characters.")
        }
       

        const email_array = [1, 3, 5, 6]
        if(email_array.includes(v_register_type)) 
        {
            if(!email_id) 
            {
                setErrEmailId("The Email ID field is required.")
                formIsValid = false
            }
        }

        if(email_id) 
        {
            if(!email_id.includes('@')) 
            {
                setErrEmailId("The Email ID field must be valid email address.")
                formIsValid = false
            }
        }

        if(mobile_number) 
        {
            if (mobile_number.length < 5) {
                set_err_mobile_number("The Mobile Number field must be at least 5 numbers in length.")
                formIsValid = false;
            }
            else if (mobile_number.length > 20) {
                set_err_mobile_number("The Mobile Number field must be less than 20 numbers in length.")
                formIsValid = false;
            }
        }

        if (!formIsValid) {
            return
        }
        set_register_loader_status(true)

        var request_register_type = register_type
        if (request_register_type == 6) {
            request_register_type = 1
        }
        
        const reqObj = {
            full_name:full_name,
            email_id:email_id,
            mobile_number:mobile_number,
            wallet_address:temp_wallet_address,
            referral_id:referral_id,
            country_row_id:parseInt(country_data.country_id),
            gender:parseInt(gender)
        }

        Axios.post(MAIN_API_BASE_URL + 'app/auth/create_account', reqObj, config("")).then(res => 
        {   
            set_register_loader_status(false)

            // console.log(res.data.message)
            if (res.data.status) 
            {
                JsCookie.remove('invite_id', { domain: cookieDomainExtension })
                JsCookie.set('temp_token', res.data.message.token, { domain: cookieDomainExtension })
                JsCookie.set("temp_user_name", res.data.message.user_name, { domain: cookieDomainExtension })
                JsCookie.set('verify_end_n_time', Date.now() + 600000, { domain: cookieDomainExtension })
                set_temp_token(res.data.message.token)
                // set_verify_end_n_time(Date.now() + 600000)

                const abc = Date.now() + 600000
                const def = abc - Date.now()
                set_verify_end_n_time(def)
                let date_counter = Date.now() + def
                set_expirationDate(date_counter)
                set_page_type(1)
            }
            else 
            {
                if(res.data.message.email_id) 
                {
                    setErrEmailId(res.data.message.email_id)
                }
                if (res.data.message.mobile_number) {
                    set_err_mobile_number(res.data.message.mobile_number)
                }
                if (res.data.message.wallet_address) {
                    setErrWalletAddress(res.data.message.wallet_address)
                    set_temp_wallet_address("")
                }
                // if (res.data.message.user_name) {
                //     setErrUserName(res.data.message.user_name)
                // }
                if (res.data.message.referral_id) {
                    setErrRefferalId(res.data.message.referral_id)
                }
                // if (res.data.message.company_name) {
                //     setErrCompanyName(res.data.message.company_name)
                // }
                // if (res.data.message.designation) {
                //     setErrDesignation(res.data.message.designation)
                // }
                if (res.data.message.country_row_id) {
                    set_err_mobile_number(res.data.message.country_row_id)
                }
            }
        })
    }

   
    const getSearchData = (searchValue) => {
        set_country_search_value((searchValue).toLowerCase())
        if (searchValue != '') {
            var filteredCompanies = country_list.filter((item) => {
                return searchParam.some((newItem) => {
                    return (
                        item[newItem]
                            .toString()
                            .toLowerCase()
                            .indexOf(searchValue) > -1
                    )
                })
            })
            set_countryList(filteredCompanies)
        }
        else {
            set_countryList(country_list)
        }
    }
    const connectToWallet = async (type) => 
    {
        set_err_telegram_number("")
        setErrWalletAddress("")

        var checkNetworks = ["private", "main"]
        if(window.ethereum) 
        {
            window.ethereum.enable().then(function (res) 
            {
                let web3 = new Web3(Web3.givenProvider || state.givenProvider)
                web3.eth.net.getNetworkType().then(function (networkName) {
                    if (checkNetworks.includes(networkName)) {
                        web3.eth.requestAccounts().then(function (accounts) {
                            var first_address = accounts[0]
                            if ((typeof first_address != 'undefined')) {
                                checkUserWalletAddress(first_address, type)
                                // props.name.callback("name")
                                // console.log("name", )
                            }
                            return true
                        })
                    }
                    else 
                    {
                        setErrWalletAddress("Please connect to the Main or BNB wallet.")
                    }
                })
            })
        }
        else 
        {
            setErrWalletAddress("Please use MetaMask or any other supported network.")
        }
    }

    function show_lock_properties(lock) {
        console.log(`The lock name is: ${lock.name}`);
        console.log(`The lock mode is: ${lock.mode}`);
      }


    const checkUserWalletAddress = (connectedaddress, type) => 
    {
        setErrWalletAddress("")
        var reqObj = {
            wallet_address: connectedaddress,
           
            domain_row_id:2,
            page:current_page_url
        }
        Axios.post(MAIN_API_BASE_URL + 'app/auth/login_using_wallet_address', reqObj, config("")).then(async (res) => {
            if(res.data.status == true) 
            {
                if(type == 0) 
                {
                    if (res.data.registered_status == true) 
                    {
                        setLoginData(res.data.message)
                        set_page_type(3)
                    }
                    else 
                    {
                        JsCookie.set("temp_wallet_address", connectedaddress, { domain: cookieDomainExtension })
                        set_temp_wallet_address(connectedaddress)
                    }
                }
                else 
                {
                    if(res.data.message.registered_status) 
                    {
                        if(res.data.message.email_verify_status) 
                        {
                            setLoginData(res.data.message)
                            dispatch({ type: 'loginAccount', data: res.data.message })
                            sendData["login_data"] = res.data.message
                            setShowModal(false)
                            props.name.callback(sendData)
                        }
                        else 
                        {
                            JsCookie.set('temp_token', res.data.message.token, { domain: cookieDomainExtension })
                            JsCookie.set("temp_email_id", res.data.message.email_id, { domain: cookieDomainExtension })
                            JsCookie.set('verify_end_n_time', Date.now() + 600000, { domain: cookieDomainExtension })
                            JsCookie.set('register_type', 1, { domain: cookieDomainExtension })
                            set_temp_token(res.data.message.token)
                            // router.push("/verify-email")
                            set_register_type(1)
                            set_page_type(1)
                            setEmailId(res.data.message.email_id)

                            const abc = Date.now() + 600000
                            const def = abc - Date.now()
                            set_verify_end_n_time(def)
                            let date_counter = Date.now() + def
                            set_expirationDate(date_counter)
                        }
                    }
                    else 
                    {
                        JsCookie.set('register_type', 6, { domain: cookieDomainExtension })
                        JsCookie.set("temp_wallet_address", connectedaddress, { domain: cookieDomainExtension })
                        // router.push({pathname : "/confirm-details"})
                        set_register_type(6)
                        set_temp_wallet_address(connectedaddress)
                        set_page_type(2)
                    }
                }

            }
            else {
                setErrWalletAddress(res.data.message.alert_message)
                // setModalData({ icon: "/assets/img/close_error.png", title: "Oops", content: res.data.message.alert_message })
            }
        })

    }

    const onComplete = async (type) => 
    {
        setShowModal(false)
        if(type == 1) 
        {
            // sendData["login_data"] = login_data
            sendData["login_data"] = login_data
            // setShowModal(false)
            props.name.callback(sendData)
        }
        else
        {
            router.push(app_coinpedia_url + "profile")
        }
    }

    return (
        <div className="markets_modal">
            <div className={'modal ' + (page_type == 1 ? ' otpmodal' : page_type == 2 ? ' modal-create-acc' : page_type == 3 ? 'registered-acc': page_type == 4 ? 'telegram_modal' : '')} style={showmodal ? { display: 'block' } : { display: 'none' }}>
                <div className="modal-dialog  modal-dialog-zoom event-login-popup">
                    <div className="modal-content modal_registration_success modal-create-acc">
                        {
                            page_type == 0 ?
                                <div className="modal-body">
                                    {/* <button type="button" className="close" onClick={() => setShowModal(false)}>
                                        <img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="pop-cancel" title="pop-cancel" className="close-popup" />
                                    </button> */}
                                     <button type="button" className="close" onClick={() => setShowModal(false)}>
                                        <img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="pop-cancel" className="close-popup" title="pop-cancel" /></button>
                                     <img src="https://image.coinpedia.org/wp-content/uploads/2023/04/18142420/toggle_menu.svg" title="Toggle Menu" alt="Toggle Menu"></img>
                                    <div className="">
                                        <div className="col-md-11 mx-auto">
                                            <div className="create_account">
                                                <div className="login_account_body pb-0">
                                                    <h4>Manage Your Portfolio And Watchlist Markets On Coinpedia.</h4>
                                                    {
                                                        err_wallet_address ?
                                                        <div className="alert alert-warning mt-2">
                                                            {err_wallet_address}
                                                        </div>
                                                        :
                                                        ""
                                                    }
                                                   
                                                
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" placeholder="Enter Your Email ID" id="mail" name="email" value={login_id} onChange={(e) => LoginStatus((e.target.value).toLowerCase())} />
                                                        <div className="input-group-append">
                                                            <span className="input-group-text">
                                                            <img src="/assets/img/login-email.svg" alt="email" width="20" title="email" />
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="error">{err_login_id}</div>

                                                    <div className='button_logged_in'>
                                                        <label className="switch">
                                                            <input type="checkbox"   onClick={() => set_keep_me_login_status(!keep_me_login_status)} checked={keep_me_login_status}/>
                                                            <span className="slider"></span>
                                                        </label> <span className='text_content'>Keep me logged in</span>
                                                    </div>

                                                    <div className='button_wallet'>
                                                    {
                                                        login_loader_status ?
                                                        <button type="submit" style={{opacity:"0.5"}} className="button_transition"><div className="loader"><span className="spinner-border spinner-border-sm "></span> Explore</div></button>
                                                        :
                                                        <button type="submit" className="button_transition" onClick={(e) => submitLoginIn(e)}>Explore</button>
                                                    }
                                                    </div>
                                                    
                                                    

                                                    {/* <p>Build Strong Network with Quality People...</p> */}

                                                    <div className="login_with_social">
                                                        <h5 className="hr-border"><span>Or Continue With</span></h5>

                                                        <div className='social_media_icons_hover'>
                                                            <div class='social-links'>
                                                                <div class='social-btn flex-center' id="metamask_icon" onClick={() => connectToWallet(1)}>
                                                                    <img src="/assets/img/meta_login_icon.svg" alt="Metamask" title="Metamask" />
                                                                    <span>Metamask</span>
                                                                </div>

                                                               

                                                                    {/* <img src="/assets/img/google_login_icon.svg" alt="Google" title="Google" />
                                                                <span>Google</span> */}
                                                                    {/* </div> */}

                                                                   

                                                                    <GoogleLogin
                                                                        clientId={googleClientId}
                                                                        icon={false}
                                                                        onSuccess={onGmailLoginSuccess}
                                                                        onFailure={onGmailFailureSuccess}
                                                                        cookiePolicy={'single_host_origin'}
                                                                        scope={"email"}
                                                                        plugin_name={"App Working Login with Gmail"}
                                                                        render={renderProps => (
                                                                            
                                                                            <>
                                                                             <div class='social-btn flex-center' id="google_icon">
                                                                                <img src="/assets/img/google_login_icon.svg" alt="Google" title="Google" onClick={renderProps.onClick} />
                                                                                <span onClick={renderProps.onClick} >Google</span></div></>
                                                                        )}
                                                                    >

                                                                        

                                                                    </GoogleLogin>
                                                                <div class='social-btn flex-center' id="apple_icon">

                                                                <AppleLogin 
                                                                clientId="sign.coinpedia.services" 
                                                                redirectURI="https://markets.coinpedia.org"
                                                                responseType="form_post"
                                                                responseMode="query"
                                                                scope="name email"
                                                                state="12345"
                                                                callback={(data) => checkAppleLogin(data)}
                                                                usePopup={true}
                                                                render={renderProps => ( 
                                                                    <>
                                                                    <img src="/assets/img/apple_login_icon.svg" alt="Apple" title="Apple"  onClick={renderProps.onClick}/>
                                                                    <span onClick={renderProps.onClick}>Apple</span>
                                                                    </>
                                                                )}
                                                            />
                                                                  
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="row" style={{display:"none"}}>

                                                            <div className="col-md-12 col-12">
                                                                {/* <Metamask ref_link={"/events/"+props.name.event_url} wallet_type={1}/> */}
                                                                <div className="media metamask-color" onClick={() => connectToWallet(1)}  >
                                                                    <div className="media-left">
                                                                        <img src="/assets/img/login-metamask.svg" className="media-object" alt="Metamask" title="Metamask" />
                                                                    </div>
                                                                    <div className="media-body">
                                                                        <h4 className="media-heading">Metamask</h4>
                                                                    </div>
                                                                </div>
                                                            </div>
{/* 
                                                            <div className="col-md-12 col-12" >
                                                                <div className="media walletconnect" onClick={() => connectToWallet(2)}>
                                                                    <div className="media-left">
                                                                        <img src="/assets/img/login-wallet-connect.svg" className="media-object" alt="Wallet Connect" title="Wallet Connect" />
                                                                    </div>
                                                                    <div className="media-body">
                                                                        <h4 className="media-heading">Wallet Connect</h4>
                                                                    </div>
                                                                </div>
                                                            </div> */}

                                                            <div className="col-md-6 col-6">
                                                                <div className='gmail-section'>
                                                                    <GoogleLogin
                                                                        className="gmail-login-div "
                                                                        clientId={googleClientId}
                                                                        tag={"div"}
                                                                        icon={false}
                                                                        onSuccess={onGmailLoginSuccess}
                                                                        onFailure={onGmailFailureSuccess}
                                                                        cookiePolicy={'single_host_origin'}
                                                                        scope={"email"}
                                                                        plugin_name={"App Working Login with Gmail"}
                                                                    >
                                                                    <div className={"media google-color "+(gmail_loader_status ? " loader-opacity":"")}>
                                                                        <div className="media-left">
                                                                            <img src="/assets/img/login-google.svg" className="media-object" alt="telegram and email" />
                                                                        </div>
                                                                        <div className="media-body">
                                                                            {
                                                                                gmail_loader_status ? 
                                                                                <h4 className="media-heading text-center"  style={{opacity:"0.5"}}><div className="spinner-border spinner-border-sm "></div> Google</h4>
                                                                                :
                                                                                <h4 className="media-heading text-center">Google</h4>
                                                                            }
                                                                            
                                                                        </div>
                                                                    </div>
                                                            
                                                                    </GoogleLogin>
                                                                </div>
                                                            </div>
                                                            

                                                            <div className="col-md-6 col-6" >
                                                            {/* <AppleLogin 
                                                                clientId="sign.coinpedia.services" 
                                                                redirectURI="https://markets.coinpedia.org"
                                                                responseType="form_post"
                                                                responseMode="query"
                                                                scope="name email"
                                                                state="12345"
                                                                callback={(data) => checkAppleLogin(data)}
                                                                usePopup={true}
                                                                render={renderProps => ( 
                                                                    <div className={"media apple-connect "+(apple_loader_status ? " loader-opacity":"")} onClick={renderProps.onClick}>
                                                                    <div className="media-left" style={{padding:"4px 5px 1px"}}>
                                                                        <img src="/assets/img/login-apple.svg" className="media-object" alt="Wallet Connect" style={{width:"28px"}}/>
                                                                    </div>
                                                                    <div className="media-body">
                                                                        {
                                                                            apple_loader_status ?
                                                                            <h4 className="media-heading text-center"  style={{opacity:"0.5"}}><div className="loader"><span className="spinner-border spinner-border-sm "></span> Apple</div></h4>
                                                                            :
                                                                            <h4 className="media-heading text-center">Apple</h4>
                                                                        }
                                                                        
                                                                    </div>
                                                                </div>
                                                                )}
                                                            /> */}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                page_type == 1 ?
                                    <div className="modal-body">
                                        <div className="">
                                            <div className="">
                                                <div className="">
                                                    <div className="create_account text-center">
                                                        <button type="button" className="close" onClick={() => setShowModal(false)}>
                                                            <img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="pop-cancel" className="close-popup" title="pop-cancel" /></button>
                                                        <div className="login_account_body pb-0">
                                                            <h4 className="title mb-2">Verify your email </h4>
                                                            <p>A code has been sent to <strong>{email_id}</strong>. Enter it below to verify your email.
                                                                {
                                                                    verify_end_n_time ?
                                                                        <Countdown date={expirationDate} renderer={renderer} />
                                                                        :
                                                                        ""
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className="otp_section">
                                                            <div>
                                                                <div>
                                                                    <div className="manual_login otp_verify_block">
                                                                        <div className="form-group">
                                                                            <div className='label-otp'>Enter OTP </div>
                                                                            <OtpInput
                                                                                isInputNum={true}
                                                                                value={otp_number}
                                                                                onChange={handleChange}
                                                                                numInputs={6}
                                                                                renderSeparator={<span></span>}
                                                                                renderInput={(props) => <input {...props} />}
                                                                            />
                                                                        </div>
                                                                        {err_otp_number && <div className="text-center err_message">{err_otp_number}</div>}

                                                                        <div className='col-md-8 mx-auto'>
                                                                        <div className="button_wallet">
                                                                            {
                                                                                otp_number.length == 6 ?
                                                                                    <button className=" button_transition mt-0" type="button" onClick={() => { submitVerifyEmail(otp_number) }}>
                                                                                        {
                                                                                            loader ?
                                                                                                <>
                                                                                                    <span style={{ width: "1rem", height: "1rem" }} className="spinner-border spinner-border-sm mr-1"></span> Verifying
                                                                                                </>
                                                                                                :
                                                                                                <>Verify </>
                                                                                        }
                                                                                    </button>
                                                                                    :
                                                                                    <button className="button_transition mt-0" style={{ opacity: "0.5" }} type="button">
                                                                                        Verify
                                                                                    </button>
                                                                            }
                                                                            <div className="verify-otp-go-back" onClick={() => clearPreLoginAccount()} >Go back</div>
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
                                    :
                                    page_type == 2 ?
                                    <div className="modal-body">
                                    <button type="button" className="close" onClick={() => setShowModal(false)}>
                                        <img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="pop-cancel" className="close-popup" title="pop-cancel" />
                                        <img src="/assets/img/darkmode/pop-cancel.svg" className='darkmode_image' alt="Cancel" title="Cancel" /></button>
                                    <div className="login_account_body pb-0">
                                        <h4>Create CoinPedia Account </h4>
                                        <p>A Platform to over 1 million + Crypto and Blockchain enthusiasts in the world.</p>
                                    </div>
                                    <div className="manual_login">
                                        <form className="form-horizontal" action="" method="post" id="myform">
                                            <div className="">
                                                <div className="row">
                                                    <div className="col-md-12 auth_second_step">
                                                        {
                                                            register_type == 1 ?
                                                                <div className="row">
                                                                    <div className="col-md-12">
                                                                        <div className="media email_connected connected_social_block">
                                                                            <div className="media-body">
                                                                                <input autoComplete="off" type="text" className="form-control" value={email_id} />
                                                                            </div>
                                                                            <div className="media-right">
                                                                                <img src="/assets/img/login-email.svg" alt="Email" title="Email" />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                :
                                                                register_type == 6 ?
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="media metamast_connected connected_social_block">
                                                                                <div className="media-body">
                                                                                    <input autoComplete="off" type="text" className="form-control" value={temp_wallet_address} />
                                                                                </div>
                                                                                <div className="media-right">
                                                                                    <img src="/assets/img/login-metamask.svg" alt="Metamask" title="Metamask" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    register_type == 2 ?
                                                                        <div className="row">
                                                                            <div className="col-md-12">
                                                                                <div className="media email_connected connected_social_block">
                                                                                    <div className="media-body">
                                                                                        <input autoComplete="off" type="text" className="form-control" value={mobile_number} />
                                                                                    </div>
                                                                                    <div className="media-right">
                                                                                        <img src="/assets/img/login-telegram.svg" alt="Telegram" title="Telegram" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        :
                                                                        ""
                                                        }
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                            <h6 className="field_label">Full Name<span>*</span></h6>
                                                                <div className=" form-custom">
                                                                    <div className="form-group input_block_outline">
                                                                        <div className="input-group">
                                                                            <div className="input-group-append">
                                                                                <select className="input-group-text text-left form-control" onChange={(e) => setgender(e.target.value)}>
                                                                                    <option value="1">Male</option>
                                                                                    <option value="2">Female</option>
                                                                                    <option value="3">Other</option>

                                                                                </select>
                                                                            </div>
                                                                            <input autoComplete="off" type="text" placeholder="Type your Full Names" className="form-control" value={full_name} onChange={(e) => setfull_name((e.target.value))} />
                                                                        </div>
                                                                        {err_full_name && <div className="error">{err_full_name}</div>}
                                                                    </div>
                                                                    
                                                                </div>
                                                            </div>
                                                            {/* <div className="col-md-12">
                                                                <div className="default_form_group">
                                                                    <div className="form-group">
                                                                        <input autoComplete="off" type="text" className="form-control" placeholder="Type your Username*" value={user_name} onChange={(e) => setUserName((e.target.value).toLowerCase())} />
                                                                        {err_user_name && <div className="error">{err_user_name}</div>}
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                            {
                                                                register_type != 1 ?
                                                                    <>
                                                                        {
                                                                            temp_facebook_email ?
                                                                                <div className="col-md-12">
                                                                                    <h6 className="field_label">Email ID<span>*</span></h6>
                                                                                    <div className="default_form_group">
                                                                                        <div className="form-group">
                                                                                            <input autoComplete="off" type="text" className="form-control" placeholder="Enter your Email ID*" value={temp_facebook_email} readOnly="true" />

                                                                                        </div>
                                                                                        {err_email_id && <div className="error">{err_email_id}</div>}
                                                                                    </div>
                                                                                </div>
                                                                                :
                                                                                <div className="col-md-12">
                                                                                    <div className="default_form_group">
                                                                                        <div className="form-group">
                                                                                            <input autoComplete="off" type="text" className="form-control" placeholder="Enter your Email ID" value={email_id} onChange={(e) => setEmailId((e.target.value).toLowerCase())} />

                                                                                        </div>
                                                                                        {err_email_id && <div className="error">{err_email_id}</div>}
                                                                                    </div>
                                                                                </div>
                                                                        }

                                                                    </>
                                                                    :
                                                                    ""
                                                            }
                                                            {
                                                                register_type != 6 ?
                                                                    <>
                                                                        <div className="col-md-12">
                                                                            {
                                                                                !temp_wallet_address ?
                                                                                <>
                                                                                  <h6 className="field_label">Connect Wallet</h6>
                                                                                    <div className="default_form_group">
                                                                                        <div className="form-group connect_wallet_block">
                                                                                            <p onClick={() => connectToWallet(0)}>Click here to connect Wallet</p>
                                                                                        </div>
                                                                                        {err_wallet_address && <div className="error">{err_wallet_address}</div>}
                                                                                    </div>
                                                                                    </>
                                                                                    :
                                                                                    <>
                                                                                        <label htmlFor="username">Connected Wallet Address</label>
                                                                                        <div className="default_form_group">
                                                                                            <div className="form-group">

                                                                                                <input id="user_name" type="text" className="form-control" placeholder="0x12...123" value={temp_wallet_address} autoFocus="" readOnly />
                                                                                            </div>
                                                                                            {err_wallet_address && <div className="error">{err_wallet_address}</div>}
                                                                                        </div>
                                                                                    </>

                                                                            }
                                                                            
                                                                        </div>
                                                                    </>
                                                                    :
                                                                    ""
                                                            }
                                                            {
                                                                register_type != 2 ?
                                                                    <div className="col-md-12">
                                                                        <h6 className="field_label">Mobile No</h6>
                                                                        <div className="form-custom event_organiser_mobile_number mb-2">
                                                                            <div className="form-group input_block_outline">
                                                                                <div className="input-group">
                                                                                    <div className="input-group-append country_select" onClick={() => set_country_list_status(true)}>
                                                                                        <span className="input-group-text" >
                                                                                            <img src={"/assets/img/flags/" + country_data.country_flag} className="country_image" alt="India" title="India" /> {country_data.country_code}
                                                                                            <img src="/assets/img/down-arrow.svg" className="country_caret_down " alt="drop down" title="drop down" />
                                                                                            <img src="/assets/img/darkmode/down-arrow.svg" className="country_caret_down darkmode_image" alt="drop down" title="drop down" />
                                                                                        </span>
                                                                                    </div>
                                                                                    <input autoComplete="off" type="number" className="form-control" placeholder="Type your Mobile Number" value={mobile_number} onChange={(e) => set_mobile_number((e.target.value).toLowerCase())} />
                                                                                </div>
                                                                                {err_mobile_number && <div className="error">{err_mobile_number}</div>}
                                                                            </div>
                                                                            
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    ""
                                                            }
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12">
                                                            <h6 className="field_label">Referral ID</h6>
                                                                <div className="form-custom event_organiser_mobile_number mb-2">
                                                                    <div className="form-group input_block_outline">
                                                                    <div className="input-group">
                                                                        <input type="text" autocomplete="off" className="form-control" placeholder="Any invitee Id ?" value={referral_id} onChange={(e) => setReferralId((e.target.value).toLowerCase())} />

                                                                    </div>
                                                                    {err_referral_id && <div className="error">{err_referral_id}</div>}
                                                                    </div>
                                                                   
                                                                </div>
                                                            </div>
                                                            {/* <div className="col-md-12">
                                                                <div className="default_form_group">
                                                                    <div className="form-group">
                                                                        <input type="text" autocomplete="off" className="form-control" placeholder="Working at?" value={company_name} onChange={(e) => setCompanyName((e.target.value).toLowerCase())} />
                                                                        {err_company_name && <div className="error">{err_company_name}</div>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col-md-12">
                                                                <div className="default_form_group">
                                                                    <div className="form-group">
                                                                        <input type="text" autocomplete="off" className="form-control" placeholder="Working as?" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                                                                        {err_designation && <div className="error">{err_designation}</div>}
                                                                    </div>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-md-12 mt-3">
                                                                <button type="button" name="register" onClick={(e) => createNewAccount(e)} className=" button_transition ">Create Account</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    <div className="account_body_footer">
                                        <p>By creating account with us, you clarify you have read and accepted the <a href={coinpedia_url + "privacy-policy/"} target="_blank"><span className='blue_links'>Privacy policy</span></a> and <a href={coinpedia_url + "terms-and-conditions/"}><span className='blue_links'>Terms & Conditions </span></a></p>
                                    </div>
                                </div>
                                        :
                                        page_type == 3 ?
                                        <div className="modal-content create_event_modal_box">
                                            <div  className="modal-body login_account_body" >
                                            <div className="ticket_updated_popup_img text-center" > 
                                                <img style={{width:'100px'}} src="/assets/img/thumbsup_green.png"/>
                                            </div>
                                                
                                            <h4 className="title mb-3">Registration Successful&nbsp;! </h4>
                                            <p>Hello <b>{full_name}</b>, you have successfully registered and created an account on Coinpedia. You can now Manage your portfolio effortlessly. Explore crypto tokens, dive into details, and add to your watchlist for timely updates. Happy investing!"</p>
                                            
                                            <div>
                                                <div className="row mt-3">
                                                <div className="col-md-6"><button className="close_button_indi cancel_transition" onClick={() => onComplete(1)}>Continue in Markets</button></div>
                                                <div className="col-md-6"><button className="complete_button button_transition" onClick={() => onComplete(2)}>Complete Your Profile</button></div>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        :
                                        null
                        }

                    </div>

                    <div className="country_list_modal">
                        <div className="modal" style={country_list_status ? { display: 'block' } : { display: 'none' }}>
                            <div className="modal-dialog  modal-dialog-zoom md-content modal-sm">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h4 className="modal-title">Select area code</h4>
                                        <button type="button" className="close close_popup_img" onClick={() => set_country_list_status(false)}><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg"  /></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="input-group">
                                            <input type="text" className="form-control" value={country_search_value} placeholder="Search" onChange={(e) => getSearchData((e.target.value).toLowerCase())} />
                                            <span className="input-group-text"><img src="/assets/img/new_search.png" alt="search" title="search" /></span>
                                        </div>

                                        <div className="all_country_list">
                                            <ul>
                                                {
                                                    countryList.length > 0 ?
                                                      countryList.map((e) =>
                                                        <li onClick={() => setCountryData(e)}><img src={"/assets/img/flags/" + e.country_flag} alt="flags" title="flags" />{e.country_name} <span>{e.country_code}</span></li>
                                                      )
                                                      :
                                                      <li>No related data found for - <b>{country_search_value}</b></li>
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            { modal_data.title ?  <Popupmodal name={modal_data} /> : null } 

        </div>
        
    )
}