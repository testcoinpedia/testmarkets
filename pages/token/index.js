import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
import Head from 'next/head'
import ReactPaginate from 'react-paginate';  
import {x_api_key, API_BASE_URL, convertvalue, Logout, app_coinpedia_url, market_coinpedia_url ,config,IMAGE_BASE_URL,graphqlApiKEY} from '../../components/constants'; 
import TableContentLoader from '../../components/loaders/tableLoader'
import Web3 from 'web3'
import moment from 'moment'
import Axios from 'axios';
import JsCookie from 'js-cookie'; 
import cookie from 'cookie'
import { useRouter } from 'next/router'


export default function WalletTokensList({userAgent, config}) 
 {
  const router = useRouter()
  const [rejectreason, setRejectReason] = useState("")
  const [loader_status, set_loader_status]= useState(false)
  const [image_base_url]=useState(IMAGE_BASE_URL+"/tokens/")
  const [pageCount, setPageCount] = useState(0)
  const [perPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageArray, setCurrentPageArray] = useState([])

  const [token_list, set_token_list] = useState([])
  const [token_counts, set_token_counts] = useState(0)

  const [filteredTokens, setfilteredTokens] = useState([])  
  const [searchTokens, setsearchTokens] = useState("")
  const [searchApprovalStatus, setSearchApprovalStatus] = useState("")
  const [searchParam] = useState(["token_name", "symbol","token_id"])
  const [searchApprovalStatusParam] = useState(["approval_status"])
  const [watchlist, set_watchlist] = useState([])
  const [tokenStatus,set_tokenStatus] = useState("")
  const [sl_no, set_sl_no]=useState(0)
 
    useEffect(()=>
    {  
      
      
      getTokens() 
      // handlePageClick({selected : 0})
    },[watchlist])
         
    const getTokens=()=>
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/listed_tokens", config)
      .then(res => 
      {   
        if(res.data.status===true)
        { 
          // console.log(res.data)
          set_loader_status(true)
          setfilteredTokens(res.data.message)
          set_token_list(res.data.message)
          set_token_counts(res.data.message.length)
          setPageCount(Math.ceil(res.data.message.length / perPage))
          getTokensCurrentList(res.data.message, 0)
          set_watchlist(res.data.watchlist)
          set_tokenStatus(res.data.tokenStatus)
          
          
        }
        else
        { 
          Logout()
          router.push(app_coinpedia_url+"login")
        }
      }) 
    }
    
  
    const addToWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/add_to_watchlist/"+param_token_id, config)
    .then(res=>
    { 
      // console.log("add", res.data)
      if(res.data.status)
      {
        var sdawatchlist = watchlist
        set_watchlist([])
        sdawatchlist.push(param_token_id)
        set_watchlist(sdawatchlist)
        // console.log("watchlist", watchlist)
        
      }
    })
  }
  
  const removeFromWatchlist = (param_token_id) =>
  {
    Axios.get(API_BASE_URL+"markets/token_watchlist/remove_from_watchlist/"+param_token_id, config)
    .then(res=>
    {
      // console.log("remove", res.data)
      if(res.data.status)
      {
        var sdawatchlist = watchlist
        set_watchlist([])
        sdawatchlist.splice(sdawatchlist.indexOf(param_token_id), 1)
        set_watchlist(sdawatchlist)
        // console.log("watchlist", watchlist)
      
      }
    })
  }


    const handlePageClick =  (page) => 
   { 
      let currentPage = 0
      
      const selectedPage = page.selected;
      const selectedoffset = selectedPage * perPage 
      set_sl_no(selectedPage * perPage)
      setCurrentPage(page.selectedPage) 
      setPageCount(Math.ceil(filteredTokens.length / perPage))
      getTokensCurrentList(filteredTokens, selectedoffset)
     
      // console.log(selectedPage * perPage)
   }   
   
   const getSearchData=(searchValue, type) =>
   {  
        setsearchTokens((searchValue-1)) 
        if(parseInt(searchValue) > 0)
        {  
          var token_listData = token_list
          var fi_tokens =  token_listData.filter((item) => searchApprovalStatusParam.some((newItem) => 
          item[newItem].toString().toLowerCase().indexOf((searchValue-1)) > -1 ))
          
          setfilteredTokens(fi_tokens)
          // console.log(fi_tokens)
          setPageCount(Math.ceil(fi_tokens.length / perPage)) 
          getTokensCurrentList(fi_tokens, 0) 
          set_token_counts(fi_tokens.length)
        }
        else
        {
          setfilteredTokens(token_list)
          setPageCount(Math.ceil(token_list.length / perPage)) 
          getTokensCurrentList(token_list, 0) 
          set_token_counts(token_list.length)
        }
   }

const getTokensCurrentList=(items, offset)=>
{  
  const token_list = items.slice(offset, offset + perPage) 
  // console.log(token_list)
  const postData = token_list.map((e, i)=>{
    var my_sl = sl_no
    return <tr key={i}>
        <td>
        {
           
            <>
            {/* {
               e.approval_status == 1 && e.active_status == 1 && watchlist.includes(e._id) ?
              <span onClick={()=>removeFromWatchlist(e._id)} ><img src="/assets/img/wishlist_star_selected.svg" /></span>
               :
               e.approval_status == 1 && e.active_status == 1 ?
               <span onClick={()=>addToWatchlist(e._id)} ><img src="/assets/img/wishlist_star.svg" /></span>
               :
               ""
              } */}
               {
                   watchlist.includes(e._id) ?
                   <span onClick={()=>removeFromWatchlist(e._id)} ><img src="/assets/img/wishlist_star_selected.svg" alt="Watchlist" /></span>
                   :
                   e.approval_status == 1 && e.active_status == 1 ?
                   <span onClick={()=>addToWatchlist(e._id)} ><img src="/assets/img/wishlist_star.svg" alt="Watchlist"/></span>
                   :
                   ""
                   
                   }
              </>
          }
        </td>
      
        <td>{offset+i+1}</td>
        <td>
          <div className="media">
            <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt="token" className="rounded-circle"  />
            <div className="media-body">
              <h4 class="media-heading">{e.token_name} <span>{e.symbol}</span></h4>
            </div>
          </div>
        </td>
        {/* <td> ${e.token_max_supply ? convertvalue(parseFloat(e.token_max_supply).toFixed(2)) : "-"}</td>
        <td> ${e.circulating_supply ? convertvalue(parseFloat(e.circulating_supply).toFixed(2)) : "-"} {e.symbol}</td> */}
        <td> {e.total_max_supply ? convertvalue(parseFloat(e.total_max_supply).toFixed(2)) : "-"}</td>
        <td> {e.market_cap ? convertvalue(parseFloat(e.market_cap).toFixed(2)) : "-"}</td>
        <td>
            {
              e.contract_addresses?
              e.contract_addresses.length > 0 
              ?
                e.contract_addresses.map((ntwrk,i)=>
                {
                  if(parseInt(ntwrk.network_type)=== 1)
                  {
                      return <>{i>0 ? "," : null} ETH</>
                  }
                  else if(parseInt(ntwrk.network_type) === 2)
                  {
                    return <>{i>0 ? "," : null} BSC</>
                  }
                  
                }
                )
              :
              "-"
              :
              "-"
            } 
        </td>
        <td className="comp_establish_date">
          {
            parseInt(e.approval_status) === 0 ?
            <div style={{color: '#f1b50a'}}>Pending</div>
            :
            parseInt(e.approval_status) === 1 ?
            <div style={{color: '#339e00'}}>Approved</div>
            :
            parseInt(e.approval_status) === 2 ?
            <div style={{color: '#fb2c10'}}>Rejected</div>
            :
            null
          }
           {
              parseInt(e.active_status) === 0 ?
              "Disable"
              :
              "Enable"
           }
        </td>

        <td>
            {
                parseInt(e.approval_status) !== 2 ?
                <Link href={market_coinpedia_url + "token/edit/"+e.token_id}>
                  <a><span className="manage_tokens_edit">Edit Token</span></a>
                </Link>
                :
                ""
            }
            {
              parseInt(e.approval_status) === 0 ?
              <>
               <span className="manage_tokens_edit_disbale">Edit Launchpad</span>
               <span className="manage_tokens_edit_disbale">View</span>
              </>
              :
              parseInt(e.approval_status) === 1 && parseInt(e.active_status) === 1 ?
              <>
               {/* <Link > */}
                  <a href={market_coinpedia_url+"token/launchpads/"+e.token_id}><span className="manage_tokens_edit">Edit Launchpad</span></a>
              {/* </Link> */}

              <Link href={market_coinpedia_url + e.token_id}>
                <a><span className="manage_tokens_edit">View</span></a>
              </Link>
              </>
              :
              null
            }
       </td> 

       
              
    </tr>
  })  
  setCurrentPageArray(postData) 
}



    return ( 
      <>
      <Head>
        <title>Manage Your Tokens</title>
      </Head>
      <div className="container token-list-pd-rm">
        <div className="prices transaction_table_block token-pg-height">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-7 col-12">
                <div className="prices__title h5"><h1>Manage your Tokens ({token_counts})</h1>
                  <p className="token_form_sub_text">List of token displayed here</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-6 col-sm-5 col-12">
                <ul className="manage_token_filter_create_token">
                  <li>
                    <form id="formID">
                      <div className="input-group search_filter">
                        <select className="form-control" onChange={(e)=> getSearchData(e.target.value)}>
                          <option value="" >Select Type</option>
                          <option value="1">Pending</option>
                          <option value="2">Approved</option>
                          <option value="3">Rejected</option>
                        </select>
                        {/* <div className="input-group-prepend">
                          <span className="input-group-text reset_filter" onClick={()=> resetFilter()}>
                            <img src="/assets/img/reset.png" />
                          </span>
                        </div> */}
                      </div>
                    </form>
                  </li>
                  <li>
                    <div className="quick_block_links main_page_coin_filter create_token_btn"> 
                      <Link href="/token/create-new"><a><img src="/assets/img/create-token.svg" />Create Token</a></Link>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>


          <div>
            <div className="col-md-12">
              <div className="row market_insights ">
                {/* <div className="col-md-5 col-lg-5"></div> */}
                <div className="col-md-8 col-lg-8"></div>
                <div className="col-md-4 col-lg-4">
                    
                </div>
              </div>
            </div>

            <div className="col-md-12 market_page_data token_list_table ">
              <div className="table-responsive">
              <table className="table table-borderless">
                <thead>
                      <tr>
                          <th></th>
                          <th>#</th>
                          <th className="manage_token_name">Token</th>
                          <th>Max Supply</th>
                          <th>Market Cap</th>
                          <th>Token Type</th>
                          <th>Status</th> 
                          <th className="manage_token_action">Actions</th> 
                      </tr> 
                </thead>
                <tbody>
                {
                  loader_status 
                  ?
                  currentPageArray.length > 0 ?
                  currentPageArray
                  :
                  <tr key="1">
                      <td className="text-center" colSpan="7">
                          Sorry, No related data found.
                      </td>
                    </tr>
                  :
                  <TableContentLoader row="10" col="8" />
                  }
                </tbody>
              </table>
              </div>
            </div> 
        
          {
            filteredTokens.length > 10 
            ?
            <div className="pager__list pagination_element"> 
              <ReactPaginate
                previousLabel={currentPage + 1 !== 1 ? "← " : ""}
                nextLabel={currentPage+1 !== pageCount ? " →" : ""} 
                breakLabel={<span className="gap">...</span>}
                pageCount={pageCount}
                marginPagesDisplayed={2} 
                onPageChange={handlePageClick}
                forcePage={currentPage}
                
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"disabled"}
                activeClassName={"active"}
                />
            
            </div>
            :
            null 
          } 
        </div>
        </div>

        <div className={"modal connect_wallet_error_block"+ (rejectreason ? " collapse show" : "")}> 
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal"  onClick={()=>setRejectReason("")}>&times;</button>
                  <h4>Rejected Reason</h4>
                  <p>{rejectreason}</p>
                </div>
              </div> 
          </div>
        </div> 
      </div>
      </>
    )
} 

export async function getServerSideProps({req}) 
{
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  var user_token = userAgent.user_token 
 

  if(userAgent.user_token)
  {
    
      if(userAgent.user_email_status==1)
      {
          return { props: { userAgent: userAgent, config: config(user_token)}} 
      }
      else
      {
          return {
            
              redirect: {
              destination: app_coinpedia_url+'verify-email',
              permanent: false,
              }
          }
      }
  }
  else
  {
      return {
          redirect: {
          destination: app_coinpedia_url+'login',
          permanent: false,
          }
      }
  }

  // if (!userAgent.user_token) 
  // {
  //   return {
  //       redirect: {
  //           destination: app_coinpedia_url+'login',
  //           permanent: false,
  //       }
  //   }
  // }
  // else 
  // {
  //   if(parseInt(userAgent.user_email_status) == 1)
  //   {
  //       var config = {
  //           headers: {
  //               "X-API-KEY": x_api_key,
  //               "token": userAgent.user_token
  //           }
  //       }

  //       return { props: { userAgent: userAgent, config: config } }
  //   }
  //   else
  //   {
  //       return {
  //           redirect: {
  //               destination: '/verify-email',
  //               permanent: false,
  //           }
  //       }
  //   }
  // }
}
