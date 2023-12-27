/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Link from 'next/link'
import JsCookie from "js-cookie"
import LoginModal from './layouts/auth/loginModal'
import { useRouter } from 'next/navigation'
import { app_coinpedia_url, market_coinpedia_url, config } from './constants' 

export default function Details({active_tab, user_token}) 
{   
  
  const router = useRouter()
  const [tab_status_connections, set_tab_status_connections] = useState(active_tab ?active_tab:"") 
  const [tab_user_token, set_tab_user_token] = useState(user_token? user_token:"");
  const [login_modal_status, set_login_modal_status] = useState(false)
  const [request_config, set_request_config] = useState(config(user_token ? user_token : ""))
  const [login_for_type, set_login_for_type] = useState("")

  const getDataFromChild = async () => 
  {
    await set_login_modal_status(false)
    await set_tab_user_token(JsCookie.get("user_token"))
    await set_request_config(JsCookie.get("user_token"))
    if(login_for_type == 1)
    { 
      router.push('/watchlist')  
    }
    else
    {
      router.push('/token/update')  
    }
  }

  const login_props = {
    status: true,
    request_config: request_config,
    callback: getDataFromChild
  }

  //1:add to watchlist, 2:remove from watchlist
  const loginModalStatus = async (pass_value) => 
  {
    await set_login_for_type(pass_value)
    await set_login_modal_status(false)
    await set_login_modal_status(true)
  }
  
  
  
return (
    <div>
      <div className="categories categories_list_display">
        <div className="markets_list_quick_links">
          <div className='row'>
              <div className='col-md-10'>
              <ul>
                  {
                    user_token?
                    <li className="tabs_watchlist">
                      <Link href="/watchlist" className={"nav-item nav-link categories__item "+(tab_status_connections === 11 ? "active_category":"")}><img src="/assets/img/wishlist_star_selected.svg" alt="Watchlist"/> Watchlist</Link>
                    </li>
                    :
                    <li className="tabs_watchlist">
                      <a onClick={()=>loginModalStatus(1)}><img src="/assets/img/watchlist_filled.svg" alt="Watchlist" width={17} height={17} /> Watchlist</a>
                    </li>
                  }

                  <li>
                    <Link href={market_coinpedia_url+"portfolio"}  className={"nav-item nav-link categories__item "+(tab_status_connections === 12 ? "active_category":"")}> Portfolio</Link>
                  </li>


                  <li className="tabs_partition">

                  </li>

                  <li>
                    <Link  href={"/"} data-toggle="tab"  className={"nav-item nav-link categories__item "+(tab_status_connections === 1 ? "active_category":"")} onClick={()=>set_tab_status_connections(1)}>
                      Price Tracking
                    </Link>
                  </li>
                  {/* <li>
                    <Link href={"/analysis-insights/dex-volume/ethereum"}>
                      <a data-toggle="tab"   className={"nav-item nav-link categories__item "+(tab_status_connections === 2 ? "active_category":"")} onClick={()=>set_tab_status_connections(2)}>Analysis Insights</a>
                    </Link>
                  </li> */}
                  <li>
                    <Link href={"/gainers-and-losers/"} data-toggle="tab"  className={"nav-item nav-link categories__item "+(tab_status_connections === 2 ? "active_category":"")} onClick={()=>set_tab_status_connections(2)}>
                      Gainers & Losers
                    </Link>
                  </li>
                  
                  <li>
                    <Link href={"/stable-coins/"} data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 4 ? "active_category":"")} onClick={()=>set_tab_status_connections(4)}>
                    Stable Coins
                    </Link>
                  </li>   
                  <li>
                    <Link href={"/new/"} data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 5 ? "active_category":"")} onClick={()=>set_tab_status_connections(5)}>
                    New Coins
                    </Link>
                  </li> 
                  
                  <li>
                    <Link href={"/trending/"} data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 7 ? "active_category":"")} onClick={()=>set_tab_status_connections(7)}>
                      Trending
                    </Link>
                  </li> 
                  
                  <li>
                    <Link href={"/categories/"} data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 8 ? "active_category":"")} onClick={()=>set_tab_status_connections(8)}>
                      Categories
                    </Link>
                  </li> 

                   <li>
                    <Link href={"/category/bnb-chain/"} data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 9 ? "active_category":"")} onClick={()=>set_tab_status_connections(9)}>
                      BNB Chain
                    </Link>
                  </li>
                 
                 {/* <li>
                    <Link href={"/category/defi"} data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 10 ? "active_category":"")} onClick={()=>set_tab_status_connections(10)}>
                      Defi
                    </Link>
                  </li> */}
                     
                  </ul>
              </div>
              <div className='col-md-2'>
                  <li className='list-new-token text-right' style={{display:"block"}}>
                        {
                          user_token ?
                          <Link href={"/token/update/"}  className="nav-item nav-link  " >List&nbsp;new&nbsp;token</Link>
                          :
                          <a onClick={()=>loginModalStatus(2)}>List new token</a>
                        }
                      </li>
              </div>
          </div>
          
        </div>
      </div>
      <div className="coming_soon_modal">
        {/* <div className="modal" id="comingSoon">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
                <button type="button" className="close" data-dismiss="modal"><span><img src="/assets/img/close_icon.svg"  alt = " Close"  /></span></button>
              </div>
              <div className="modal-body">
                <p className="coming_soon_subtext">This feature will be available soon</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>

      {login_modal_status ? <LoginModal name={login_props} sendDataToParent={getDataFromChild} /> : null}
    </div>
  )
}         

  