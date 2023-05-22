/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { app_coinpedia_url, market_coinpedia_url } from '../components/constants' 

export default function Details({active_tab, user_token}) 
{   
  console.log("active_tab", active_tab)
  const [tab_status_connections, set_tab_status_connections] = useState(active_tab ?active_tab:"") 
  
return (
    <div>
      <div className="categories categories_list_display">
            <div className="categories__container">
              <div className="row">
                <div className="markets_list_quick_links">
                  <ul>
                  {
                    user_token?
                    <li className="tabs_watchlist">
                      <Link href="/watchlist"><img src="/assets/img/watchlist_filled.svg" alt="Watchlist"/> Watchlist</Link>
                    </li>
                    :
                    <li className="tabs_watchlist">
                      <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url} onClick={()=> Logout()}><img src="/assets/img/watchlist_filled.svg" alt="Watchlist" width={17} height={17} /> Watchlist</Link>
                    </li>
                  }

                  <li className="tabs_partition">
                    <Link href={app_coinpedia_url}> Portfolio</Link>
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

                  <li>
                    <Link href={"/category/defi"} data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 10 ? "active_category":"")} onClick={()=>set_tab_status_connections(10)}>
                      Defi
                    </Link>
                  </li>
                      
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="coming_soon_modal">
            <div className="modal" id="comingSoon">
              <div className="modal-dialog modal-sm">
                <div className="modal-content">
                  <div className="modal-header">
                    <h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                  </div>
                  <div className="modal-body">
                    <p className="coming_soon_subtext">This feature will be available soon</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
       </div>
    )
}         

  