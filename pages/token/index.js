import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
import Head from 'next/head'
import ReactPaginate from 'react-paginate';  
import { API_BASE_URL, convertvalue, app_coinpedia_url, market_coinpedia_url ,coinpedia_url,config,IMAGE_BASE_URL,graphqlApiKEY} from '../../components/constants'; 
import TableContentLoader from '../../components/loaders/tableLoader'
import Axios from 'axios';
import moment from 'moment' 
import cookie from 'cookie'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; 

export default function WalletTokensList({userAgent, config}) 
 {
  
  const [rejectreason, setRejectReason] = useState("")
  const [loader_status, set_loader_status]= useState(false)
  const [image_base_url]=useState(IMAGE_BASE_URL+"/markets/cryptocurrencies/")
  const [pageCount, setPageCount] = useState(0)
  const [perPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageArray, setCurrentPageArray] = useState([])

  const [token_list, set_token_list] = useState([])
  const [token_counts, set_token_counts] = useState(0)

  const [filteredTokens, setfilteredTokens] = useState([])  
  const [searchTokens, setsearchTokens] = useState("")
  const [searchParam] = useState(["token_name", "symbol","token_id"])
  const [searchApprovalStatusParam] = useState(["approval_status"])
  const [watchlist, set_watchlist] = useState([])
  const [sl_no, set_sl_no]=useState(0)
 
    useEffect(()=>
    { 
      getTokens() 
    },[])
         
    const getTokens= async ()=>
    {
      const res = await Axios.get(API_BASE_URL+"markets/users/manage_crypto/list", config)
      if(res.data.status)
      {
          console.log(res.data.watchlist)
          await set_watchlist(res.data.watchlist)
          await set_loader_status(true)

          await setfilteredTokens(res.data.message)
          await set_token_list(res.data.message)
          await set_token_counts(res.data.message.length)
          await setPageCount(Math.ceil(res.data.message.length / perPage))
          await getTokensCurrentList(res.data.message, 0)
          
      }
        
    }

    const handlePageClick =  (page) => 
   { 
      let currentPage = 0
      
      const selectedPage = page.selected;
      const selectedoffset = selectedPage * perPage 
      set_sl_no(selectedPage * perPage)
      setCurrentPage(page.selectedPage) 
      setPageCount(Math.ceil(filteredTokens.length / perPage))
      const token_list = filteredTokens.slice(selectedoffset, selectedoffset + perPage) 
      setCurrentPageArray(token_list) 
      // getTokensCurrentList(filteredTokens, selectedoffset)
     
      // console.log(selectedPage * perPage)
   }   
   
   const getSearchData=(searchValue, type) =>
   {  
      if(token_list.length)
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
   }

const getTokensCurrentList=(items, offset)=>
{  
  const token_list = items.slice(offset, offset + perPage) 
  setCurrentPageArray(token_list) 
}



    return ( 
      <>
      <Head>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <title>List Of Your Assets | CoinPedia Markets </title>
        <meta name="description" content="This is your one-page to manage all your listed or pending coins/tokens on Coinpedia markets." />
        <meta name="keywords" content="List token, List token on coinpedia markets, list token, token listing, listing on coinmarketcap, token listing." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="List Of Your Assets | CoinPedia Markets" />
        <meta property="og:description" content="This is your one-page to manage all your listed or pending coins/tokens on Coinpedia markets." />
        <meta property="og:url" content={market_coinpedia_url+"token/"} />
        <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="List Of Your Assets | CoinPedia Markets" />
        <meta name="twitter:description" content="This is your one-page to manage all your listed or pending coins/tokens on Coinpedia markets." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 
        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="canonical" href={market_coinpedia_url+"token/"} />
        {/* <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} />  */}
      </Head>
      <div className="container token-list-pd-rm">
        <div className="prices transaction_table_block token-pg-height">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-6 col-lg-8 col-sm-7 col-12">
                <div className="prices__title h5"><h1>My Coins/Tokens ({token_counts})</h1>
                  <p className="token_form_sub_text">List of your coins/tokens listed on Coinpedia markets</p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4 col-sm-5 col-12">                
                <div className="manage_token_filter_create_token manage_token_select">
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
                 
                  <div className="quick_block_links main_page_coin_filter create_token_btn"> 
                    <Link href="/token/update">List new token</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>


       
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
                          {/* <th></th> */}
                          <th>#</th>
                          <th>Updated On</th>
                          <th className="manage_token_name">Details</th>
                          <th>Total Supply</th>
                          <th>Status</th> 
                          <th className="manage_token_action">Action</th> 
                      </tr> 
                </thead>
                
                <tbody>
                {
                  loader_status 
                  ?
                  currentPageArray.length > 0 ?
                  currentPageArray.map((e, i)=>
                   <tr key={i}>
                        <td>{sl_no+i+1}</td>
                        <td> 
                          { 
                              e.updated_on ?
                              <>{moment(e.updated_on ).format('MMM D YYYY h:mma')}</> 
                              :
                              "-"
                          }
                        </td>
                        <td>
                          <div className="media">
                            <div className='media-left align-self-center'>
                            <img src={image_base_url+(e.token_image ? e.token_image : image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt="token" className="rounded-circle"  />
                            </div>
                            <div className="media-body  align-self-center">
                              <h4 className="media-heading">
                                {
                                  e.approval_status == 1 && e.active_status == 1 ?
                                  <Link href={'/'+e.token_id}>
                                  {e.token_name} <small>({e.symbol})</small>
                                  </Link>
                                  :
                                  <>
                                  {e.token_name} <small>({e.symbol})</small>
                                  </>
                                }
                              </h4>
                              <p>{
                            e.list_type ==1  ?
                            <>
                            Coin</>
                            :
                            <>
                            Token
                            </>
                          }</p>
                            </div>
                          </div>
                        </td>
                        {/* <td> ${e.token_max_supply ? convertvalue(parseFloat(e.token_max_supply).toFixed(2)) : "-"}</td>
                        <td> ${e.circulating_supply ? convertvalue(parseFloat(e.circulating_supply).toFixed(2)) : "-"} {e.symbol}</td> */}
                        <td> 
                          {e.total_supply ? 
                          <>
                          {parseFloat(e.total_supply).toFixed(0) } <span>{e.symbol}</span>
                          </>
                        : "-"}
                        </td>
                        
                        
                        <td className="comp_establish_date">
                          {
                            parseInt(e.active_status) === 0 ?
                            <>
                            <span className="badge_rejected">Disabled</span>
                            <OverlayTrigger
                                overlay={(props) => (
                                  <Tooltip {...props} className="custom_pophover ">
                                      <p className="rejected_reason"><b>Reason:</b> {e.disable_reason}</p>
                                  </Tooltip>
                                )}
                                placement="bottom"
                              ><span className='info_col ml-2' ><img src="/assets/img/info.png" alt="Info" /></span>
                              </OverlayTrigger>
                            </>
                            :
                            <>
                            {
                                parseInt(e.approval_status) === 0 ?
                                <span className="badge_pending">Pending</span>
                                :
                                parseInt(e.approval_status) === 1 ?
                                <span className="badge_approved">Approved</span>
                                :
                                parseInt(e.approval_status) === 2 ?
                                <>
                                <span className="badge_rejected">Rejected</span>
                                  <OverlayTrigger
                                    overlay={(props) => (
                                      <Tooltip {...props} className="custom_pophover ">
                                          <p className="rejected_reason"><b>Rejected On:</b> {moment(e.rejected_on).utc().format("ll")} </p>
                                          <p className="rejected_reason"><b>Reason:</b> {e.rejected_reason}</p>
                                      </Tooltip>
                                    )}
                                    placement="bottom"
                                  ><span className='info_col ml-2' ><img src="/assets/img/info.png" alt="Info" /></span>
                                  </OverlayTrigger>
                                </>
                                :
                                null
                              }
                            </>
                          }
                          
                        </td>

                        
                
                        <td>
                            {
                                e.active_status == 1 ?
                                <Link href={market_coinpedia_url + "token/update?token_id="+e._id}>
                                  <span className="manage_tokens_edit">Manage Details</span>
                                </Link>
                                :
                                ""
                            }
                            {/* {
                              parseInt(e.approval_status) === 0 ?
                              <>
                               <span className="manage_tokens_edit_disbale">Edit Launchpad</span>
                               <span className="manage_tokens_edit_disbale">View</span>
                              </>
                              :
                              parseInt(e.approval_status) === 1 && parseInt(e.active_status) === 1 ?
                              <>
                               <Link href={market_coinpedia_url+"token/launchpads/"+e.token_id}>
                                 <span className="manage_tokens_edit">Edit Launchpad</span>
                              </Link>
                              </>
                              :
                              null
                            } */}
                       </td> 
                    </tr>
                  ) 
                  :
                  <tr key="1">
                      <td className="text-center" colSpan="7">
                          Sorry, No related data found.
                      </td>
                    </tr>
                  :
                  <TableContentLoader row="10" col="7" />
                  }
                </tbody>
              </table>
              </div>
            </div> 
        
          {
            filteredTokens.length > perPage 
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
  
      </>
    )
} 

export async function getServerSideProps({req}) 
{
  const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
  var user_token = userAgent.user_token 
  if(userAgent.user_token)
  {
      if(userAgent.user_email_status)
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
}
