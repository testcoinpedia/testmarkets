import React , {useState, useEffect} from 'react'
import Link from 'next/link' 
import Axios from 'axios'
import moment from 'moment'
import { API_BASE_URL, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, count_live_price} from '../components/constants'; 
import { useRouter } from 'next/router'

export default function Details({config,user_token}) 
{   
    const [watchlist, set_watchlist] = useState([])
    const [api_loader_status, set_api_loader_status] = useState(false)
    const [image_base_url] = useState(IMAGE_BASE_URL + '/tokens/')
    const [voting_ids, setvoting_ids] = useState("")
    const [handleModalVote, setHandleModalVote] = useState(false)
    const [voting_status, set_voting_status] = useState(false)
    const [token_id, set_Token_id] = useState("")
    const [vote_id, set_vote_id] = useState("")
    const [item, set_item] = useState("")
    const [voting_message, set_voting_message] = useState("")
    useEffect(()=>
    {  
    getWatchlist()
    voteIds()
    }, [voting_ids])

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
    const voteIds = () =>
    {
        Axios.get(API_BASE_URL+"markets/tokens/voting_ids", config).then(res=>
        { 
        set_api_loader_status(true)
        if(res.data.status)
        {
          setvoting_ids(res.data.voting_ids)
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
    const ModalVote=(token_id,status,_id,item)=> 
    { 
      // console.log(item)   
      setHandleModalVote(!handleModalVote) 
      set_voting_status(status)
      set_Token_id(token_id)
      set_vote_id(_id)
      set_item(item)
    }

  const vote = (param) =>
  {
    
    if(param == 1)
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/save_voting_details/"+token_id, config)
      .then(res=>
      { 
        // console.log(res)
        if(res.data.status === true) 
        {
          
          var testList = watchlist
          var result = testList.filter(obj => {
            return obj._id === vote_id
          })
          var testObj = result ? result[0] : "" 
          // console.log("testObj",testObj)
          var test_total_votes = testObj.total_votes+1
          testObj['total_votes'] = test_total_votes
          testList[item] = testObj
          set_watchlist(testList)
          voting_ids.push(vote_id)
          set_voting_message(res.data.message.alert_message) 
          setHandleModalVote(!handleModalVote)
          getWatchlist()
          // console.log(voting_ids)
        }
      })
    }
    else
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/remove_voting_details/"+token_id, config)
      .then(res=>
      { 
        // console.log(res)
        if(res.data.status === true) 
        {
          var testList = watchlist
          var result = testList.filter(obj => {
            return obj._id === vote_id
          })
          var testObj = result ? result[0] : "" 
          var test_total_votes = 0
          test_total_votes = testObj.total_votes-1
          testObj['total_votes'] = test_total_votes
          testList[item] = testObj
          // console.log(testObj)
          set_watchlist(testList)
          voting_ids.splice(voting_ids.indexOf(vote_id), 1) 
          set_voting_message(res.data.message.alert_message)
          setHandleModalVote(!handleModalVote) 
          getWatchlist()
          // console.log(voting_ids)
        }
      })
    }
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
              <th className="table_circulating_supply mobile_hide_table_col">Votes</th>   
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
                          <h4 className="media-heading">{e.token_name} <span>{e.symbol?(e.symbol).toUpperCase():null}</span></h4>
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
                        e.contract_addresses?
                          e.contract_addresses.length > 0
                          ?
                            e.contract_addresses[0].network_type === "1" ? "ERC20" : "BEP20" 
                          // e.contract_addresses.map((ca)=>
                          //   parseInt(ca.network_type) === 1 ? "ERC20" : "BEP20" 
                          //)
                          :
                          null
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
                  <td  className="mobile_hide_table_col">
                                       {
                                       e.total_votes == 0 ?
                                       voting_ids.includes(e.token_row_id) ? <span className="vote_value">1</span> : "--"
                                       :
                                       <Link href={"/"+e.token_id}>
                                         <a>
                                           <span className="vote_value">{e.total_votes}</span>
                                         </a>
                                       </Link>
                                       }
                                     </td>
                                     
                                     
                                     <td  className="mobile_hide_table_col">
                                       {
                                         user_token ?
                                         <>
                                         {
                                           voting_ids.includes(e.token_row_id) ?
                                           <span className="market_list_price markets_voted"> <button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,true,e._id,i)} >Voted</button></span>
                                           :
                                           <span className="market_list_price"><button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,false,e._id,i)} className="vote_btn">Vote</button></span>
                                           }
                                         </>
                                         :
                                         <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a><span className="market_list_price"><button data-toggle="tooltip" className="vote_btn">Vote</button></span></a></Link>
                                       }
                                       </td> 
            </tr> 
            ) 
            :
            <tr >
              <td className="text-lg-center text-md-left" colSpan="7">
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
    <div className={"modal connect_wallet_error_block"+ (handleModalVote ? " collapse show" : "")}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal" onClick={()=>ModalVote()}><span><img src="/assets/img/close_icon.svg"  alt = " Close"  /></span></button>
                  {
                    voting_status == false ?
                    <h4> Do you want to support this token ? </h4>
                    :
                    <h4> Do not support this token ? </h4>
                  }
                  
                  <div className="vote_yes_no">
                    {/* className={voting_status == 1 ? "vote_yes" : "vote_no"} */}
                    {
                      voting_status == false ?
                      <>
                      <button onClick={()=>vote(1)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                      :
                      <>
                      <button onClick={()=>vote(0)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                    }
                    
                  </div>
                </div>
              </div> 
            </div>
          </div> 
    </div> 
    
    )
}         

  