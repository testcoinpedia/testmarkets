/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Link from 'next/link'
import Axios from 'axios'
import moment from "moment"
import { useRouter } from 'next/navigation'
import { API_BASE_URL, app_coinpedia_url, market_coinpedia_url, config } from '../constants' 

export default function Details({active_tab, overview_counts}) 
{   
  const [tab_status, set_tab_status] = useState(active_tab ? active_tab:1) 
//   const [overview_counts, set_overview_counts] = useState({}) 
  console.log("active_tab1", active_tab)
    
  useEffect(() => 
  {
   // getOverviewCounts()
  } , [])

//   const getOverviewCounts = async () => 
//   {
//         const res = await Axios.get(API_BASE_URL+"markets/launchpads/overview", config(""))
//         if(res.data.status) 
//         {   
//             set_overview_counts(res.data.message) 
//         }
//   }


  

return (
    <div>
        <div className="container-fluid p-0">
            <div className=''>
                <div className='container header_ico_calendar'>
                    <div className='ico_canlendar_headings'>
                        {
                            tab_status == 2 ?
                            <>
                                <h1>Upcoming Crypto Airdrops</h1>
                                <h2>Find a list of upcoming, new crypto, and NFT airdrops</h2>
                            </>
                            :
                            tab_status == 3 ?
                            <>
                                <h1>Completed Crypto Airdrops</h1>
                                <h2>Find a list of completed crypto and NFT airdrops</h2>
                            </>
                            :
                            <>
                                <h1>Crypto Airdrops, {moment().format('MMMM YYYY')}</h1>
                                <h2>Find a list of Verified, latest, crypto, and NFT airdrops.</h2>
                            </>
                        }
                    </div>

                    

                    <div className='ico_calendar_tabs'>
                        <ul className="">
                            <li  className="nav-item"><a className=" nav-link " data-toggle="tab" href="#published">
                                {
                                    overview_counts.total_airdrops ?
                                    <h4>{overview_counts.total_airdrops}</h4>
                                    :
                                    <h4>0</h4>
                                }
                                <p>Total Published</p>
                                </a></li>
                            <li  className="nav-item"><a className={"nav-link "+(tab_status == 1 ? " active":"")} >
                                {
                                    overview_counts.active_airdrops ?
                                    <h4>{overview_counts.active_airdrops}</h4>
                                    :
                                    <h4>0</h4>
                                }
                                <p>Active</p>
                                </a></li>
                            <li className="nav-item"><a className={"nav-link "+(tab_status == 2 ? " active":"")} >
                                {
                                    overview_counts.upcoming_airdrops ?
                                    <h4>{overview_counts.upcoming_airdrops}</h4>
                                    :
                                    <h4>0</h4>
                                }
                                <p>Upcoming</p>
                                </a></li>
                            <li className="nav-item"><a className={"nav-link "+(tab_status == 3 ? " active":"")}>
                                {
                                    overview_counts.ended_airdrops ?
                                    <h4>{overview_counts.ended_airdrops}</h4>
                                    :
                                    <h4>0</h4>
                                }
                                <p>Ended</p>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
       </div>

        <div className="tab-content">
            <div id="published" className="tab-pane fade show in active">
                <div className='active_icos'>
                    <div className='active_icos_tabs'>
                        <ul className="nav-pills text-center">
                            <li className="nav-item">
                                <Link href={"/airdrops/"} className={"nav-link "+(tab_status == 1 ? " active":"")} >
                                Active Airdrops
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href={"/airdrops/upcoming"} className={"nav-link "+(tab_status == 2 ? " active":"")}>
                                Upcoming Airdrops 
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href={"/airdrops/ended"} className={"nav-link "+(tab_status == 3 ? " active":"")} >
                                Ended Airdrops
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}         

  