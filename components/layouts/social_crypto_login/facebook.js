import React, { Component } from 'react'
import FacebookLoginBtn from 'react-facebook-login';
import Router from 'next/router'
import {API_BASE_URL,config,cookieDomainExtension,setLoginData} from '../../../components/constants'
import Axios from 'axios'
import JsCookie from "js-cookie" 
import Popupmodal from '../../../components/popupmodal'
export default class LoginFacebook extends Component 
{ 
    constructor(props) 
    {
      super(props)
      // console.log(props)
      this.state = {
        auth:false,
        prev_url:props.prev_url,
        name:'',
        picture:'',
        modal_data: {icon: "", title: "", content: ""}
      }
    }

   
      
    componentClicked = () => 
    {
      // console.log("Facebook");
    }

    componentDidMount()
    {
      // console.log('sadf')
      
    }

   checkFacebookLoginUser = (fb_res) => 
    {
      this.setState({ modal_data: {title: "", image_name: "", description: ""} })
        // console.log(fb_res)
        const reqObj = {
            email_id : fb_res.email,
            facebook_id: fb_res.id,
            full_name: fb_res.name,
            profile_image: (fb_res.picture) ? fb_res.picture.data.url : ""
        }

        Axios.post(API_BASE_URL+'app/auth/login_with_facebook', reqObj, config("")).then(res => 
        {  
            // console.log(res.data)    
            if(res.data.status === true)
            { 
              if(res.data.message.registered_status)
              {
                setLoginData(res.data.message)
                JsCookie.set('register_type', 4, {domain:cookieDomainExtension}) 
                
                if(this.state.prev_url)
                {
                  Router.push(this.state.prev_url)
                }
                else
                {
                  Router.push('/')
                }

              }
              else
              {
                JsCookie.set('register_type', 4, {domain:cookieDomainExtension}) 
                JsCookie.set("temp_facebook_email",fb_res.email,{domain:cookieDomainExtension})
                JsCookie.set("temp_full_name",fb_res.name,{domain:cookieDomainExtension})
                JsCookie.set("temp_facebook_id",fb_res.id,{domain:cookieDomainExtension})
               
                if(this.state.prev_url)
                {
                  Router.push('/confirm-details?prev_url='+this.state.prev_url)
                }
                else
                {
                  Router.push('/confirm-details')
                }
                
              }
            }
            else
            {
              this.setState({ modal_data: { icon: '/assets/img/close_error.png', title: "OOPS!", content: res.data.message.alert_message}})
            }
        })
    }

    render()
    {
      return (
         <>
              <div className="media facebook-color">
                  <div className="media-left">
                    <FacebookLoginBtn
                      appId="740970320365730"
                      cssClass="default_icon_facebook"
                      autoLoad={false}
                      fields="name,email,picture"
                      onClick={this.componentClicked}
                      callback={this.responseFacebook} 
                      textButton="Facebook"
                      tag="span"
                      image="fa-facebook"
                      />
                      <img src="/assets/img/login-facebook.svg" className="media-object" alt="telegram and email" />
                  </div>
                  <div className="media-body">
                    <FacebookLoginBtn
                      appId="740970320365730"
                      cssClass="media-heading"
                      autoLoad={false}
                      fields="name,email,picture"
                      onClick={this.componentClicked}
                      callback={this.checkFacebookLoginUser} 
                      textButton="Facebook"
                      tag="h4"
                      />
                  </div>
              </div>
              { this.state.modal_data.title ? <Popupmodal name={this.state.modal_data} /> : null }
            </>
          )
      }
}
   

