import React, {useState, useEffect} from 'react'
import { useLinkedIn } from 'react-linkedin-login-oauth2';



export default function LoginWithGmail({})
{   
    // const { linkedInLogin } = useLinkedIn({
    //     clientId: '77hnhkcmgcob6e',
    //     ClientSecret: 'oC8ZjJdY0JtidwNX',
    //     redirectUri: `http://192.168.1.100:4400/login/`,
    //     scope:'r_liteprofile,r_emailaddress', // for Next.js, you can use `${typeof window === 'object' && window.location.origin}/linkedin`
    //     onSuccess: (code) => {
           
    //     },
    //     onError: (error) => {
    //       console.log(error);
    //     },
    //   });
    
   

return( 
    <>
        
        <div className="media google-color" >
            <div className="media-left">
                <img src="/assets/img/login-google.svg" className="media-object" alt="telegram and email" />
            </div>
            <div className="media-body">
                {/* <a href="https://www.linkedin.com/oauth/v2/authorization?response_type=code&state=987654321&scope=r_liteprofile%20r_emailaddress&client_id=77hnhkcmgcob6e&client_secret=oC8ZjJdY0JtidwNX&redirect_uri=http%3A%2F%2F192.168.1.100%3A4400%2Flogin%2F">  */}
                    <h4 className="media-heading">Linkedin</h4>
                {/* </a> */}
            </div>
        </div>
   
        
    </>  
 ) 
}




