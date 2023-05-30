import React, {useState, useEffect} from 'react'
import Web3 from 'web3'  
import { useRouter } from 'next/router'
import { useSelector,useDispatch } from 'react-redux'
import {API_BASE_URL, cookieDomainExtension, config,setLoginData} from '../../../components/constants'
import JsCookie from "js-cookie" 
import Popupmodal from '../../../components/popupmodal'
import Axios from 'axios'



export default function LoginWithMetaMask({ref_link, wallet_type})
{  
    
     
    const router = useRouter()
    const dispatch = useDispatch()
    const [walletAddress, setWalletAddress] = useState()
    const [modal_data, Setmodal_data] = useState({icon:"", title:"", content:""})  
 
   const connectToWallet= async ()=>
    { 
        await Setmodal_data({icon: "",title: "",content:""})
        var checkNetworks = ["private", "main"]
       
         if(window.ethereum)
        {   
            window.ethereum.enable().then(function(res) { 
            let web3 = new Web3(Web3.givenProvider || state.givenProvider)
            web3.eth.net.getNetworkType().then(function(networkName) 
            {       
                if(checkNetworks.includes(networkName))
                { 
                    web3.eth.requestAccounts().then(function(accounts)
                    {   
                        var first_address = accounts[0]   
                        if((typeof first_address != 'undefined'))
                        {   
                            checkUserWalletAddress(first_address)
                            return true
                        }
                        return true
                    })
                }
                else
                {
                    Setmodal_data({icon: "/assets/img/close_error.png",title:"Connection Error",content:'Please connect to Main or BNB wallet.'}) 
                }  
            })
            })
        } 
        else
        {
            
            Setmodal_data({icon:"/assets/img/close_error.png", title:"Connection Error", content:'You are connected to an unsupported network.'})
        }
    }


    const checkUserWalletAddress = (connectedaddress) => 
    {
        Setmodal_data({icon: "", title: "", content:""})
        Axios.post(API_BASE_URL+'app/auth/login_using_wallet_address', { wallet_address : connectedaddress}, config(""))
        .then(res => {  
            //  console.log(res.data)
            if(res.data.status == true)
            {
                if(res.data.message.registered_status)
                {
                    if(res.data.message.email_verify_status)
                    {
                        setLoginData(res.data.message)
                        dispatch({type:'loginAccount', data:res.data.message})
                        if(ref_link)
                        {
                            router.push(ref_link)
                        }
                        else
                        {
                            router.push({pathname : "/"})
                        }
                    }
                    else
                    {
                        JsCookie.set('temp_token', res.data.message.token, {domain:cookieDomainExtension})
                        JsCookie.set("temp_email_id", res.data.message.email_id, {domain:cookieDomainExtension})
                        JsCookie.set('verify_end_n_time', Date.now() + 600000, {domain:cookieDomainExtension})
                        JsCookie.set('register_type', 1, {domain:cookieDomainExtension})
                        router.push("/verify-email")
                    } 
                }
                else
                {
                    JsCookie.set('register_type',2,{domain:cookieDomainExtension})
                    JsCookie.set("temp_wallet_address", connectedaddress,{domain:cookieDomainExtension})
                    router.push({pathname : "/confirm-details"})
                }
            }
            else
            {
                Setmodal_data({icon: "/assets/img/close_error.png", title: "Oops!", content:res.data.message.alert_message}) 
            } 
        })
    }
 
    

return(            
        <>
        {
            wallet_type == 1 ?
            <div className="media metamask-color"  onClick={()=> connectToWallet()}  >
                <div className="media-left">
                    <img src="/assets/img/login-metamask.svg" className="media-object" alt="Metamask" />
                </div>
                <div className="media-body">
                    <h4 className="media-heading text-center">Metamask</h4>
                </div>
            </div> 
            :
            wallet_type == 2 ?
            <div className="media walletconnect" onClick={()=>connectToWallet()}>
                <div className="media-left">
                    <img src="/assets/img/login-wallet-connect.svg" className="media-object" alt="Wallet Connect" />
                </div>
                <div className="media-body">
                    <h4 className="media-heading">Wallet Connect</h4>
                </div>
            </div>
            :
            ""
        }
           

           
            { modal_data.title ?  <Popupmodal name={modal_data} /> : null }
        </>
    ) 
}




