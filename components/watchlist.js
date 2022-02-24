import React , {useState, useEffect} from 'react'
import Link from 'next/link' 
import Axios from 'axios'
import moment from 'moment'
import { API_BASE_URL, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, count_live_price} from '../components/constants'; 
import { useRouter } from 'next/router'

export default function Details({config}) 
{   
    const [watchlist, set_watchlist] = useState([])
    const [api_loader_status, set_api_loader_status] = useState(false)
    const [image_base_url] = useState(IMAGE_BASE_URL + '/tokens/')

    useEffect(()=>
    {  
    getWatchlist()
    }, [])

    const getWatchlist = () =>
    {
        Axios.get(API_BASE_URL+"markets/token_watchlist/list/", config).then(res=>
        { 
        set_api_loader_status(true)
        if(res.data.status)
        {
            set_watchlist(res.data.message)
        }
        })
    }


    const removeFromWatchlist = (param_token_id) =>
    {
        Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config).then(res=>
        {
        if(res.data.status)
        {
            getWatchlist()
        }
        })
    }
     
return (
    <div className="market_page_data">
    <div className="table-responsive">
      <table className="table table-borderless">
        <thead>
            <tr>
              <th className="" style={{minWidth: '34px'}}></th>
              <th className="">#</th>
              <th className="">Name</th>
              <th className="table_token">Live Price</th>
              <th className="table_token">Token Type</th>
              <th className="table_max_supply">Max Supply</th> 
              <th className="mobile_hide table_circulating_supply">Market Cap</th>  
            </tr>
        </thead>
        <tbody>
          {
            api_loader_status ?
            <>
            {
            watchlist.length > 0
            ?
            watchlist.map((e, i) => 
            <tr key={i}>
                  <td>
                  <span onClick={()=>removeFromWatchlist(e.token_row_id)} ><img src="/assets/img/wishlist_star_selected.svg" /></span>
                  </td>
                  
                  <td>
                    {i+1}
                  </td>
                  <td>
                    <Link href={"/"+e.token_id}>
                      <a>
                      <div className="media">
                        <div className="media-left">
                          <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt={e.token_name} width="100%" height="100%" className="media-object" />
                        </div>
                        <div className="media-body">
                          <h4 className="media-heading">{e.token_name} <span>{e.symbol.toUpperCase()}</span></h4>
                        </div>
                      </div> 
                      </a>
                    </Link>
                  </td> 
                  {/* <td>{e.price === null? "-":"$"+ Number(e.price).toFixed(2)}</td> */}
                  {/* <td>
                    <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span>
                  </td> */}

                  <td className="market_list_price"> 
                    <Link href={"/"+e.token_id}>
                      <a>
                      <span className="block_price">{e.price?"$":null}{e.price?count_live_price(e.price):"-"}</span>
                        {/* <span className="block_price">{e.price?"$":null}{e.price?parseFloat((e.price).toFixed(9)):"-"}</span> */}
                        <br/>
                        {e.price_updated_on ? moment(e.price_updated_on).fromNow():null} 
                      </a>
                      </Link>
                  </td>
                  <td> 
                    <Link href={"/"+e.token_id}>
                      <a>
                      {
                          e.contract_addresses.length > 0
                          ?
                            e.contract_addresses[0].network_type === "1" ? "ERC20" : "BEP20" 
                          // e.contract_addresses.map((ca)=>
                          //   parseInt(ca.network_type) === 1 ? "ERC20" : "BEP20" 
                          //)
                          :
                          null
                        } 
                      </a>

                      </Link>
                  </td>
                  <td>
                    <Link href={"/"+e.token_id}>
                      <a>
                        {e.total_max_supply ? separator(e.total_max_supply) : "-"} 
                      </a>
                    </Link>
                  </td>

                  <td className="mobile_hide">
                    <Link href={"/"+e.token_id}><a>
                      {e.market_cap ?separator(e.market_cap.toFixed(2)) : "-"}
                    </a></Link>
                  </td>  
            </tr> 
            ) 
            :
            <tr >
              <td className="text-center" colSpan="7">
                  Sorry, No related data found.
              </td>
            </tr>
          }
            </>
            :
            ""
          } 
        </tbody>
      </table>
    </div>
    </div> 
    )
}         

  