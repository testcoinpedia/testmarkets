import React, { useState, useEffect, useRef } from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"
import moment from 'moment'
import Link from 'next/link'

export default function MyFunction({token_id, active_tab, approval_status}) 
{     
   //  console.log("approval_status", approval_status)
    const [tab_token_id, set_tab_token_id] = useState(token_id ? token_id:"")

    return (
        <>
         {
            approval_status === 0 ?
            <div class="alert alert-info d-inline-block mt-2">
            <strong>Imp Note:</strong> Admin approval is required after submission
            </div>
            :
            approval_status === 1 ?
            <div className='token_details_tabs_row'>
                  <ul className="nav nav-tabs">
                     <li className="nav-item">
                        <Link href={"/token/update?token_id="+token_id} className={"nav-link "+(active_tab == 1 ? "active":"")} ><span>Token Details</span></Link>
                     </li>

                     <li className="nav-item">
                              <Link href={"/token/tokenomics/"+tab_token_id} className={"nav-link "+(active_tab == 4 ? "active":"")} ><span>Tokenomics</span></Link>
                     </li>
                     <li className="nav-item">
                        <Link href={"/token/launchpads/"+tab_token_id} className={"nav-link "+(active_tab == 2 ? "active":"")}  ><span>Launchpads</span></Link>
                     </li>

                     <li className="nav-item">
                        <Link href={"/token/airdrops/"+tab_token_id} className={"nav-link "+(active_tab == 3 ? "active":"")} ><span>Airdrops</span></Link>
                     </li>

                     
                     <li className="nav-item">
                        <Link href={"/token/members/"+tab_token_id} className={"nav-link "+(active_tab == 5 ? "active":"")} ><span>Team Members</span></Link>
                     </li>
                  </ul>
            </div>
            :
            ""
         }

       
        </>
    )
}