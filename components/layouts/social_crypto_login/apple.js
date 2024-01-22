import React, {useState, useEffect} from 'react'
import AppleLogin from 'react-apple-login'
import JsCookie from "js-cookie" 
import { useRouter } from 'next/router'
import { useSelector,useDispatch } from 'react-redux'
import Popupmodal from '../../../components/popupmodal'
import {API_BASE_URL, cookieDomainExtension, config, googleClientId, setLoginData} from '../../../components/constants'
import Axios from 'axios'

export default function LoginWithApple({prev_url})
{   
    const router = useRouter()
    const dispatch = useDispatch()
    const [client_secret] = useState("")
    const [api_loader_status, set_api_loader_status] = useState(false)
    const [modal_data, Setmodal_data] = useState({icon:"", title:"", content:""}) 

    const checkUserLogin = async (data) =>
    {  
        // console.log("data", data)
        set_api_loader_status(false)
        await Setmodal_data({icon: "",title: "",content:""})
        if(!data.error)
        {   
            if(data.authorization)
            {
                set_api_loader_status(true)
                const id_token = data.authorization ? data.authorization.id_token : ""
                // console.log("data", data)
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
                    email_id: email_id
                }

                const res = await Axios.post(API_BASE_URL+'app/auth/user_login_with_apple', req_obj, config(id_token))
                // console.log(res.data)  
                if(res.data)
                {
                    if(res.data.status === true)
                    { 
                        setLoginData(res.data.message)
                        dispatch({type:'loginAccount', data:res.data.message})
                        if(prev_url)
                        {
                            router.push(prev_url) 
                        }
                        else
                        {
                            router.push('/')
                        }
                    }
                    else
                    {
                        Setmodal_data({icon:"", title:"Oops!", content:res.data.message.alert_message}) 
                    }
                }
            }
        }
    }


//     {
//     "authorization": {
//         "code": "c4ad817bb3b414d248e5c2a890e41100a.0.rruy._vfBpq8N4onKCUddNY9Qxw",
//         "id_token": "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoic2lnbi5jb2lucGVkaWEuc2VydmljZXMiLCJleHAiOjE2NzgyNzYxOTksImlhdCI6MTY3ODE4OTc5OSwic3ViIjoiMDAwMTQ4LmZiMjEyZTQ3MDMzMTQ5ZDA4ODU5NjlmM2EwNTBlMzRiLjEwMzkiLCJjX2hhc2giOiJnQ0Rrd1kteHFwLWpCU002dUZVWllRIiwiZW1haWwiOiJhbHJtZWhib29iQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF1dGhfdGltZSI6MTY3ODE4OTc5OSwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.Qg8Ps-8gyDcqEPRGhUA6ANqFelBbucNrIJa5BEZBjofT2D-h8SHPguuU9i00YdD4CRBhzkX8Gx55JcUgAZC0MBEYJ0exWMpoBRGsmeIG4O0F09GwsQyPZQ7ZJ_C7il6tnbyxJfsjvEvHXlikHoKKgOZUojoZZOyRonfD4rZEsMD52BCLCsYJLukF1THoGfTl81fa7-nND9xhcr5_tEmCWOCv9f2ez3kvShYRXHKHqCCmT5rdlL-I0OeTfljVDrt0P9tfAIArPirAcHtD5j8xKcrKi_PnSB1Z5DWSSOpzdhB_vZaClb3aAQaRuiGljurKBkefmiGbLqY8LnEnpXI4JQ",
//         "state": "12345"
//     },
//     "user": {
//         "name": {
//             "firstName": "Mehboob",
//             "lastName": "Bellary"
//         },
//         "email": "alrmehboob@gmail.com"
//     }
// }

//    authorization
// : 
// code
// : 
// "c4ad817bb3b414d248e5c2a890e41100a.0.rruy._vfBpq8N4onKCUddNY9Qxw"
// id_token
// : 
// "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ.eyJpc3MiOiJodHRwczovL2FwcGxlaWQuYXBwbGUuY29tIiwiYXVkIjoic2lnbi5jb2lucGVkaWEuc2VydmljZXMiLCJleHAiOjE2NzgyNzYxOTksImlhdCI6MTY3ODE4OTc5OSwic3ViIjoiMDAwMTQ4LmZiMjEyZTQ3MDMzMTQ5ZDA4ODU5NjlmM2EwNTBlMzRiLjEwMzkiLCJjX2hhc2giOiJnQ0Rrd1kteHFwLWpCU002dUZVWllRIiwiZW1haWwiOiJhbHJtZWhib29iQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjoidHJ1ZSIsImF1dGhfdGltZSI6MTY3ODE4OTc5OSwibm9uY2Vfc3VwcG9ydGVkIjp0cnVlfQ.Qg8Ps-8gyDcqEPRGhUA6ANqFelBbucNrIJa5BEZBjofT2D-h8SHPguuU9i00YdD4CRBhzkX8Gx55JcUgAZC0MBEYJ0exWMpoBRGsmeIG4O0F09GwsQyPZQ7ZJ_C7il6tnbyxJfsjvEvHXlikHoKKgOZUojoZZOyRonfD4rZEsMD52BCLCsYJLukF1THoGfTl81fa7-nND9xhcr5_tEmCWOCv9f2ez3kvShYRXHKHqCCmT5rdlL-I0OeTfljVDrt0P9tfAIArPirAcHtD5j8xKcrKi_PnSB1Z5DWSSOpzdhB_vZaClb3aAQaRuiGljurKBkefmiGbLqY8LnEnpXI4JQ"
// state
// : 
// "12345"
// [[Prototype]]
// : 
// Object
// user
// : 
// email
// : 
// "alrmehboob@gmail.com"
// name
// : 
// firstName
// : 
// "Mehboob"
// lastName
// : 
// "Bellary"

return( 
    <>
    <AppleLogin 
        clientId="sign.coinpedia.services" 
        redirectURI="https://app.coinpedia.org/login"
        responseType="form_post"
        responseMode="query"
        scope="name email"
        state="12345"
        callback={(data) => checkUserLogin(data)}
        usePopup={true}
        render={renderProps => ( 
            <div className="media apple-connect" onClick={renderProps.onClick}>
            <div className="media-left" style={{padding:"4px 5px 1px"}}>
                <img src="/assets/img/login-apple.svg" className="media-object" alt="Wallet Connect" style={{width:"28px"}}/>
            </div>
            <div className="media-body">
                <h4 className="media-heading text-center">Apple</h4>
            </div>
        </div>
        )}
    />
    { modal_data.title ?  <Popupmodal name={modal_data} /> : null }
    </>  
 ) 
}




