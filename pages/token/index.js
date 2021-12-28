import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
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
  
 
    useEffect(()=>
    {  
      getTokens() 
    },[])
         
    
    const getTokens=()=>
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/listed_tokens", config)
      .then(res => 
      {   
        if(res.data.status===true)
        { 
          set_loader_status(true)
          setfilteredTokens(res.data.message)
          set_token_list(res.data.message)
          set_token_counts(res.data.message.length)
          setPageCount(Math.ceil(res.data.message.length / perPage))
          getTokensCurrentList(res.data.message, 0)
        }
        else
        { 
          Logout()
          router.push(app_coinpedia_url+"login")
        }
      }) 
    }


    const handlePageClick = (page) => 
   { 
      const selectedPage = page.selected;
      const selectedoffset = selectedPage * perPage 
      setCurrentPage(selectedPage) 
     
      setPageCount(Math.ceil(filteredTokens.length / perPage))
      getTokensCurrentList(filteredTokens, selectedoffset)
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

   const resetFilter=() =>
   {
    setfilteredTokens(token_list)
    setPageCount(Math.ceil(token_list.length / perPage)) 
    getTokensCurrentList(token_list, 0) 
    set_token_counts(token_list.length)
    document.getElementById("formID").reset() 
   }

const getTokensCurrentList=(items, offset)=>
{  
  const token_list = items.slice(offset, offset + perPage) 
  console.log(token_list)
  const postData = token_list.map((e, i)=>
    <tr key={i}>
       <td>
          <div className="media">
            <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt="token" className="rounded-circle"  alt="Token img" />
            <div className="media-body">
              <h4>{e.token_name}</h4>
              <p>{e.symbol}</p>
            </div>
          </div>
        </td>
        {/* <td> ${e.token_max_supply ? convertvalue(parseFloat(e.token_max_supply).toFixed(2)) : "-"}</td>
        <td> ${e.circulating_supply ? convertvalue(parseFloat(e.circulating_supply).toFixed(2)) : "-"} {e.symbol}</td> */}
        <td> {e.total_max_supply ? convertvalue(parseFloat(e.total_max_supply).toFixed(2)) : "--"}</td>
        <td> {e.market_cap ? convertvalue(parseFloat(e.market_cap).toFixed(2)) : "--"}</td>
        <td>
          {
              e.launch_pad_type === "1"
              ?
              "ICO"
              :
              e.launch_pad_type === "2"
              ?
              "IDO"
              :
              e.launch_pad_type === "3"
              ?
              "IEO" 
                : 
              "-"
            } 
        </td>
        <td>{e.start_date?e.start_date:"--"}</td>
        <td>
          {
            parseInt(e.approval_status) === 0 ?
            <span className="table_status status_pending">Pending</span>
            :
            parseInt(e.approval_status) === 1 ?
            <span className="table_status status_approved">Approved</span>
            :
            parseInt(e.approval_status) === 2 ?
            <span className="table_status status_rejected">Rejected</span>
            :
            null
          }
        </td>
        <td className="referral_dropdown">
          <div className="dropdown" >
            <img src="/assets/img/table_dropdown_dots.png" data-toggle="dropdown" className="dropdown_dots" />
            <div className="dropdown-menu">
              <Link href={market_coinpedia_url + "token/edit/"+e.token_id}><a className="dropdown-item">
                <img src="/assets/img/table_dropdow_edit.png" className="dropdown_images" />Edit Token
              </a></Link>
              <Link href={market_coinpedia_url + "token/launchpad/"+e.token_id}><a className="dropdown-item">
                <img src="/assets/img/table_dropdow_edit.png" className="dropdown_images" />Edit Launchpad
              </a></Link>

               {
                 parseInt(e.approval_status) === 1 ?
                 <Link href={market_coinpedia_url + e.token_id}><a className="dropdown-item">
                    <img src="/assets/img/table_dropdown_view.png" className="dropdown_images" />View
                  </a></Link>
                 :
                 null
               }
            </div>
          </div>
        </td>       
    </tr>
  )  
  setCurrentPageArray(postData) 
}



    return ( 
      <div className="container">
        <div className="prices transaction_table_block">
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-8 col-lg-8 col-sm-6 col-6">
                <div className="prices__title h5"><h1>Tokens list ({token_counts})</h1>
                  <p className="token_form_sub_text">List of token displayed here</p>
                </div>
              </div>
              <div className="col-md-4 col-lg-4 col-sm-6 col-6">
                <div className="quick_block_links main_page_coin_filter create_token_btn"> 
                  <Link href="/token/create-new"><a><img src="/assets/img/create-token-icon.png" />Create Token</a></Link>
                </div>
              </div>
            </div>
          </div>


<div>
  <div className="col-md-12">
    <div className="row market_insights ">
      {/* <div className="col-md-5 col-lg-5"></div> */}
      <div className="col-md-8 col-lg-8"></div>
      <div className="col-md-4 col-lg-4">
          <form id="formID">
          <div className="input-group search_filter">
            <select className="form-control" onChange={(e)=> getSearchData(e.target.value)}>
              <option value="" >Select Type</option>
              <option value="1">Pending</option>
              <option value="2">Approved</option>
              <option value="3">Rejected</option>
            </select>
            <div className="input-group-prepend">
              <span className="input-group-text reset_filter" onClick={()=> resetFilter()}>
                <img src="/assets/img/reset.png" />
              </span>
            </div>
          </div>
          </form>
      </div>
    </div>
  </div>

  <div className="col-md-12 market_page_data token_list_table ">
  <div className="table-responsive">
  <table className="table table-borderless token-list-tbl">
    <thead>
          <tr>
              <th className="table_token_name">Token</th>
              <th className="table_token_max_supply">Max Supply</th>
              <th className="table_token_ciruclating_supply">Market Cap</th>
              <th className="table_token_launchpad_type">Launchpad Type</th>
              <th className="table_token_launchpad_date">Launchpad Date</th> 
              <th>Status</th> 
              <th className="token-list-last-column"  width="200px">Action</th> 
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
          <td className="text-center" colSpan="6">
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
</div>
        
  {
    filteredTokens.length > 10 ?
    <div className="pager__list pagination_element"> 
      <ReactPaginate
        previousLabel={currentPage+1 !== 1 ? "← Previous" : ""} 
        nextLabel={currentPage+1 !== pageCount ? "Next →" : ""} 
        breakLabel={<span className="gap">...</span>}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        forcePage={currentPage}
        containerClassName={"pagination"}
        previousLinkClassName={"previous_page"}
        nextLinkClassName={"next_page"}
        disabledClassName={"disabled"}
        activeClassName={"active"}
      />
  </div>
    :
    null 
  } 
        
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
