import React, {useState, useEffect} from 'react'
import Web3 from 'web3'  
import { useRouter } from 'next/router'
import { useSelector,useDispatch } from 'react-redux'
import {API_BASE_URL, cookieDomainExtension, config, googleClientId, setLoginData} from '../../constants'
import JsCookie from "js-cookie" 
import { GoogleLogin } from 'react-google-login'
import Axios from 'axios'

export default function LoginWithGmail({prev_url})
{   
    const router = useRouter()
    const dispatch = useDispatch()
    const [clientId] = useState(googleClientId)
    const [modal_data, set_modal_data] = useState({icon:"", title:"", content:""})  
   
    const onLoginSuccess=(response)=>
    {   
        // console.log("gmail", response)
        
        const reqObj = {
            email_id : response.profileObj.email,
            full_name: response.profileObj.name,
            google_id: response.profileObj.googleId,
            user_name: response.profileObj.givenName
        }
        
        Axios.post(API_BASE_URL+'app/auth/user_login_with_gmail', reqObj, config("")).then(res => 
        {  
            // console.log(res.data)    
            if(res.data.status === true)
            {   
                setLoginData(res.data.message)
                dispatch({type:'loginAccount', data:res.data.message})
                router.push('/')
          }
          else
          {
            set_modal_data({ icon: '/assets/img/close_error.png', title: "OOPS!", content: res.data.message.alert_message})
          }
            
        })
    }

    const onFailureSuccess=(res)=>
    {
    //    console.log("login failed;", res)
    }
    

return( 
    <>
        <div className='gmail-section'>
        <GoogleLogin
            className="gmail-login-div "
            clientId={clientId}
            tag={"div"}
            icon={false}
            onSuccess={onLoginSuccess}
            onFailure={onFailureSuccess}
            cookiePolicy={'single_host_origin'}
            scope={"email"}
            plugin_name={"App Working Login with Gmail"}
        >
        <div className="media google-color">
            <div className="media-left">
                <img src="/assets/img/login-google.svg" className="media-object" alt="telegram and email" />
            </div>
            <div className="media-body">
                <h4 className="media-heading text-center">Google</h4>
            </div>
        </div>
   
        </GoogleLogin>
        </div>
    </>  
 ) 
}




