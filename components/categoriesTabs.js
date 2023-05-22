/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Details({active_tab}) 
{   
  const router = useRouter()
  const {active_category } = router.query
  const [tab_status_connections, set_tab_status_connections] = useState(active_tab ? parseInt(active_tab) :active_category?parseInt(active_category):1) 
  
return (
    <div>
      <div className="categories categories_list_display">
            <div className="categories__container">
              <div className="row">
                <div className="markets_list_quick_links">
                  <ul>
                  <li>
                    <Link  href={"/"}>
                      <a data-toggle="tab"  className={"nav-item nav-link categories__item "+(tab_status_connections === 1 ? "active_category":"")} onClick={()=>set_tab_status_connections(1)}>Cryptocurrencies</a>
                    </Link>
                  </li>
                  {/* <li>
                    <Link href={"/analysis-insights/dex-volume/ethereum"}>
                      <a data-toggle="tab"   className={"nav-item nav-link categories__item "+(tab_status_connections === 2 ? "active_category":"")} onClick={()=>set_tab_status_connections(2)}>Analysis Insights</a>
                    </Link>
                  </li> */}
                  <li>
                    <Link href={"/gainers-and-losers/"}> 
                      <a data-toggle="tab"  className={"nav-item nav-link categories__item "+(tab_status_connections === 2 ? "active_category":"")} onClick={()=>set_tab_status_connections(2)}>Gainers & Losers</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={"/categories/"}>
                      <a data-toggle="tab" className={"nav-item nav-link categories__item "+(tab_status_connections === 3 ? "active_category":"")} onClick={()=>set_tab_status_connections(3)}>Categories</a>
                    </Link>
                  </li>   
                  <li data-toggle="modal" data-target="#comingSoon">
                    <a data-toggle="tab"  className={"nav-item nav-link categories__item "} >Stable Coins</a>
                  </li>
                  <li data-toggle="modal" data-target="#comingSoon">
                    <a data-toggle="tab"   className={"nav-item nav-link categories__item "} >Trending Coins</a>
                  </li>
                  <li data-toggle="modal" data-target="#comingSoon">
                    <a data-toggle="tab"   className={"nav-item nav-link categories__item "} >New Coins</a>
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

  