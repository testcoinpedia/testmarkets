
import React, { useState, useEffect,useCallback, useRef } from 'react';  
import Axios from 'axios'
// import Link from 'next/link' 
import Web3 from 'web3' 
import { ethers } from 'ethers'
import { useRouter } from 'next/router' 
import Head from 'next/head'
import JsCookie from "js-cookie" 
import cookie from 'cookie'
import dynamic from 'next/dynamic'
import moment from "moment"
import { useSelector, useDispatch } from 'react-redux'
// import "react-datetime/css/react-datetime.css"
import {API_BASE_URL, x_api_key, app_coinpedia_url, coinpedia_url,  market_coinpedia_url,config,graphqlApiKEY,separator, roundNumericValue} from '../../../components/constants'; 
import Select from 'react-select'
import Popupmodal from '../../../components/popupmodal'
import Top_header from '../../../components/manage_token/top_header' 
import { Tooltip, OverlayTrigger } from 'react-bootstrap'; 
 
// import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
// import 'react-image-crop/dist/ReactCrop.css';

import { Editor } from '@tinymce/tinymce-react';
 
export default function Create_token({config,token_id}) 
{ 
    const Multiselect = dynamic( () => import('multiselect-react-dropdown').then(module => module.Multiselect),
        {
        ssr: false
        }
    )
    const editorRef = useRef(null)
    const router = useRouter()
    const [wallet_address, setWalletAddress] = useState('')
    const [contract_address, setContractAddress] = useState([{network_type: "0", contract_address: ""}])
    const [live_price, setLivePrice] = useState("")
    const [market_cap, set_market_cap] = useState("") 
    const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })

    const [err_contract_address, setErrContractAddress] = useState("")
    const [loader, set_loader] = useState("")
    const [title, set_title] = useState("")
    const [participating_users, set_participating_users] = useState("")
    const [winner_price, set_winner_price] = useState("")
    const [start_date, set_start_date] = useState("")
    const [end_date, set_end_date] = useState("")
    const [participate_link, set_participate_link] = useState("")
    const [description, set_description] = useState("")
    const [how_to_participate, set_how_to_participate] = useState("")
    const [airdrop_list, set_airdrop_list] = useState([])
    const [api_loader, set_api_loader] = useState(false)
    const [elements, set_elements] = useState([]);
    const [approval_status, set_approval_status] = useState("")

    const [err_title, set_err_title] = useState("")
    const [err_participating_users, set_err_participating_users] = useState("")
    const [err_winner_price, set_err_winner_price] = useState("")
    const [err_start_date, set_err_start_date] = useState("")
    const [err_end_date, set_err_end_date] = useState("")
    const [err_participate_link, set_err_participate_link] = useState("")
    const [err_description, set_err_description] = useState("")
    const [err_how_to_participate, set_err_how_to_participate] = useState("")

    const [airdrop_row_id, set_airdrop_row_id] = useState(0)

    const active_currency = useSelector(state => state.active_currency)

    // console.log("token_id",token_id)
    // API_BASE_URL+"markets/users/manage_airdrops/list

    useEffect(() => {
      airdropList();
      getTokenDetails()
    }, []);


    const getTokenDetails=()=>
    {
    
      Axios.get(API_BASE_URL+"markets/users/manage_crypto/individual_details/"+token_id, config)
      .then(response=>{
        if(response.data.status){ 
          // console.log(response.data) 
          // set_supply(response.data.message.total_supply)
          set_approval_status((response.data.message.approval_status) ? parseInt(response.data.message.approval_status):0)
        }
      })
    }


    const clearform = () =>
    {   
        set_title("")
        set_participating_users("")
        set_winner_price("")
        set_start_date("")
        set_end_date("")
        set_participate_link("")
        set_description("")
        set_how_to_participate("")
        set_airdrop_row_id("")
       
    }

    
    const createAirdrop = () =>
    { 
      let formValid = true
      setModalData({ icon: "", title: "", content: "" })
      set_err_title('')
      set_err_participating_users('') 
      set_err_winner_price('')
      set_err_start_date('')
      set_err_end_date('')
      set_err_participate_link('')
      set_err_description('') 
      set_err_how_to_participate('')
   
      if(title === '')
      {
        set_err_title('The title field is required.')
        formValid = false
      }
      else if(title.length < 4)
      {
        set_err_title('The title must be atleast 4 characters.')
        formValid = false
      } 
     
  
      if(!participating_users)
      {
        set_err_participating_users('The Participating Users field is required.')
        formValid = false
      }
      
      
      if(winner_price === '')
      {
        set_err_winner_price('The winner price field is required.')
        formValid = false
      }
      else if(winner_price < 0)
      {
        set_err_winner_price('The winner price field must be contain greater than 0.')
      }
    
  
      
      if(start_date === '')
      {
        set_err_start_date('The start date field is required.')
          formValid = false
      }
      if(end_date === '')
      {
        set_err_end_date('The end date field is required.')
          formValid = false
      }
      if (start_date > end_date) {
        formValid = false;
        set_err_end_date("Please select valid End date .");
      }
  
      if(participate_link){
        if(/\s/g.test(participate_link))
        {
          set_err_participate_link('The participate link field should not contain whitespace.')
          formValid = false
        }
      }
     
    
      // else if(token_description.length > 5000)
      // {
      //     setErrTokenDescription('The description must be less than 5000 characters in length.')
      //     formValid = false
      // } 
      if(description === '')
      {
        set_err_description('The description field is required.')
        formValid = false
      }
      else if(description.length<4)
      {
        set_err_description('The description field should be atleast 4 characters in length.')
        formValid = false
      }
      // if(how_to_participate === '')
      // {
      //   set_err_how_to_participate('The participate field is required.')
      //   formValid = false
      // }
      // else if(how_to_participate.length<4)
      // {
      //   set_err_how_to_participate('The participate field should be atleast 4 characters in length.')
      //   formValid = false
      // }
      

      if(!formValid)
      {
        return
      }
      set_loader(true)
      const reqObj = {
        token_row_id:token_id,
        airdrop_row_id:airdrop_row_id,
        title: title,
        participating_users: participating_users, 
        winner_price: winner_price,
        start_date:start_date ? moment(start_date).format("YYYY-MM-DD"):"",
        end_date:end_date ? moment(end_date).format("YYYY-MM-DD"):"",
        participate_link: participate_link,
        description: description,
        how_to_participate: how_to_participate,
        
      } 

      Axios.post(API_BASE_URL+"markets/users/manage_airdrops/update_n_save_details/", reqObj, config)
      .then(response=> 
      { 
        set_loader(false)
        if(response.data.status)
        { 
          clearform()
          setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: response.data.message.alert_message})
          airdropList();
        } 
        else
        { 
  
          if(response.data.message.title)
          {
            set_err_title(response.data.message.title)   
          }
          
          if(response.data.message.participating_users)
          {
            set_err_participating_users(response.data.message.participating_users)
          } 
  
          if(response.data.message.winner_price)
          {  
            set_err_winner_price(response.data.message.winner_price)
          }
          
          if(response.data.message.start_date)
          {  
            set_err_start_date(response.data.message.start_date)
          }
          
          if(response.data.message.end_date)
          {  
            _(response.data.message.end_date)
          }
          
          if(response.data.message.participate_link)
          {  
            set_err_participate_link(response.data.message.participate_link)
          }  
          if(response.data.message.description)
          {
            set_err_description(response.data.message.description)
          } 
          if(response.data.message.how_to_participate)
          {
            set_err_how_to_participate(response.data.message.how_to_participate)
          } 
        }
      })
      
      
    }  
    const airdropList = () => 
    {
      Axios.get(API_BASE_URL + "markets/users/manage_airdrops/list/"+token_id, config).then(
        (response) => 
        {
          // console.log(response);
          if(response.data.status) 
          {
            set_api_loader(false)
            set_airdrop_list(response.data.message);
          }
        }
      );
    };
    const getAirdrop = (e) => {
      
   
          set_title(e.title)
          set_participating_users(e.participating_users)
          set_winner_price(e.winner_price)
          set_start_date(moment(e.start_date).utc().format("YYYY-MM-DD"))
          set_end_date(moment(e.end_date).utc().format("YYYY-MM-DD"))
          set_participate_link(e.participate_link)
          set_description(e.description)
          set_how_to_participate(e.how_to_participate)
          set_airdrop_row_id(e._id)
    
    };
    
    const btndelete = (row_id) => {
      let ele= <div className="remove_modal">
      <div className="modal" id="removeConnection">
          <div className="modal-dialog modal-sm">
          <div className="modal-content">
              <div className="modal-body">
              <button type="button" className="close"  data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="Close"/></button>
              <div className="text-center">
              <div className=""><img src="/assets/img/cancel.png" alt="Cancel"className="prop_modal_img"/></div>
                  <h4 className="">Delete Airdrop!</h4>
                  <p>Do you really want to delete this Airdrop detail?</p>
              </div>  
              </div>
              <div className="modal-footer">
              <button type="button" className="tn btn-danger btn-sm" onClick={() => Delete(row_id)} data-dismiss="modal"> Delete </button>
              </div>
          </div>
          </div>
      </div> 
      </div>
      set_elements(ele);
    };
  
    const Delete = (row_id) => {
      setModalData({ icon: "", title: "", content: "" });
  
      Axios.get(
        API_BASE_URL+"markets/users/manage_airdrops/delete_airdrop/"+row_id,
        config
      ).then((response) => {
        if (response.data.status === true) {
          setModalData({
            icon: "/assets/img/update-successful.png",
            title: "Thank You!",
            content: "Airdrop Deleted Successfully",})
          airdropList();
          clearform();
          set_airdrop_row_id("");
        } else {
          setModalData({
            icon: "/assets/img/attendee_cross.png",
            title: "Oops!",
            content: response.data.message.alert_message,
          });
        }
      });
    };
    const makeJobSchema=()=> 
    {  
      return { 
          "@context":"http://schema.org/",
          "@type":"Organization",
          "name":"Manage Your Airdrops",
          "url":market_coinpedia_url+"token/airdrops/"+token_id+ "/",
          "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
          "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        }  
    } 

    const convertCurrency = (token_price) =>
    {
      if(token_price)
      {
        if(active_currency.currency_value)
        {
          return active_currency.currency_symbol+" "+roundNumericValue(token_price*active_currency.currency_value)
        }
        else
        {
          return roundNumericValue(token_price)
        }
      }
      else
      {
        return '-'
      }
    }


  return(
    <>
      <Head>
        <title>Manage Your Airdrops | CoinPedia Markets</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Create a new airdrop or edit an existing one from your tokens list of Active, upcoming or completed airdrops list of coinpedia markets." />
        <meta name="keywords" content={"Airdrop, crypto airdrops "+moment().format('MMMM YYYY')+" airdrops, crypto airdrop, crypto airdrops, best crypto airdrops, latest airdrops, latest crypto airdrop, NFT airdrops."} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Manage Your Airdrops | CoinPedia Markets" />
        <meta property="og:description" content="Create a new airdrop or edit an existing one from your tokens list of Active, upcoming or completed airdrops list of coinpedia markets." />
        <meta property="og:url" content={market_coinpedia_url+"token/airdrops/"+token_id+ "/"} />
        <meta property="og:site_name" content="Coinpedia Cryptocurrency Markets" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Manage Your Airdrops | CoinPedia Markets" />
        <meta name="twitter:description" content="Create a new airdrop or edit an existing one from your tokens list of Active, upcoming or completed airdrops list of coinpedia markets." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 
        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="canonical" href={market_coinpedia_url+"token/airdrops/"+token_id+ "/"} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
      <div className="page">
        <div className="create_airdrop create_launchpad">
          <div className="container">
            <div className="for_padding">
              <div> 
                <div className="token_form">

                <div className='market_token_tabs'>
                <h1 className='page_main_heading'>Manage Airdrops On CoinPedia</h1>
                <p>Create, Edit, or Remove airdrops of your token from here.</p>
                <Top_header active_tab={3} token_id={token_id} approval_status={approval_status}/>
                    {/* <div className="row">
                        <div className="col-lg-3 col-md-4">
                        </div>  
                        <div className="col-lg-6 col-md-6">
                           
                        </div>
                    </div> */}
                </div>
                  <div className=" token_steps">
                  <div className="row">
                    <div className="col-lg-5 col-md-5 ">
                    <div className='form_headings'>

                    {
                        !airdrop_row_id ?
                        <>
                          <h5>Add Airdrop Details</h5>
                          <p>You can create airdrops for your tokens.</p>
                        </>
                        :
                        <>
                          <h5>
                            Update Airdrop Details
                            <span style={{float:"right"}} className='text-right pull-right' onClick={()=>clearform()}><button className='btn btn-primary btn-sm'>Go Back</button></span>
                          </h5>
                          <p>Edit airdrop details for your tokens.</p>
                        </>
                      }
                    </div>
                      <div className='create_token_details'>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                            <div className="form-custom">
                            <label htmlFor="email">Title <span className="label_star">*</span></label>
                              <div className="form-group input_block_outline">
                                <input type="text" className="form-control" placeholder="Airdrop title" value={title} onChange={(e) => set_title(e.target.value)}/>
                            </div>
                            <div className="error">{err_title}</div>

                          </div>
                        </div>

                        <div className="col-lg-6 col-md-6">
                          <div className="form-custom">
                              <label htmlFor="email">Participating Users <span className="label_star">*</span></label>
                              <div className="form-group input_block_outline">
                                <input type="text" min="0" className="form-control" placeholder="Number of Participating Users" value={participating_users} onChange={(e) => set_participating_users(e.target.value)}/>
                              </div>
                            <div className="error">{err_participating_users}</div>

                          </div>
                        </div>
                    </div>


                      <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-custom">
                              <label htmlFor="email">Winner amount ($) <span className="label_star">*</span></label>
                                <div className="form-group input_block_outline">
                                  <input type="number" min="0" className="form-control" placeholder="Winner amount $" value={winner_price} onChange={(e) => set_winner_price(e.target.value)}/>
                              </div>
                            <div className="error">{err_winner_price}</div>

                            </div>
                          </div>

                          <div className="col-lg-6 col-md-6">
                            <div className="form-custom">
                              <label htmlFor="email">Participate Link </label>
                              <div className="form-group input_block_outline">
                                <input type="text" className="form-control" placeholder="Participate Link"  value={ participate_link} onChange={(e) => set_participate_link(e.target.value)}/>
                              </div>
                              <div className="error">{err_participate_link}</div>

                            </div>
                          </div>
                      </div>
                              
                             

                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <label htmlFor="email">Start date <span className="label_star">*</span></label>
                          <div className="form-custom">
                            <div className="form-group input_block_outline">
                              <input type="date" className="form-control" placeholder="Total Supply"value={start_date} onChange={(e) => set_start_date(e.target.value)}/>
                            </div>
                            <div className="error">{err_start_date}</div>


                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <label htmlFor="email">End date <span className="label_star">*</span></label>
                          <div className="form-custom">
                            <div className="form-group input_block_outline">
                              <input type="date" className="form-control" placeholder="Total Supply" value={end_date} onChange={(e) => set_end_date(e.target.value)}/>
                            </div>
                            <div className="error">{err_end_date}</div>

                          </div>
                        </div>

                      </div>
                          <div className="form-custom">
                              <label htmlFor="email">Airdrop description <span className="label_star">*</span></label>
                                <div className="form-group input_block_outline">
                                  <textarea  className="form-control" rows={6} placeholder="Airdrop description" value={description} onChange={(e) => set_description(e.target.value)}/>
                                </div>
                            <div className="error">{err_description}</div>

                          </div>
                      
                      <div className="form-custom">
                          <label htmlFor="email">How to participate in airdrops </label>
                            <div className="form-group input_block_outline">
                            <Editor 
                            apiKey="s6mr8bfc8y6a2ok76intx4ifoxt3ald11z2o8f23c98lpxnk" 
                            onEditorChange={(e)=>set_how_to_participate(e)}
                            value={how_to_participate} 
                                  onInit={(evt, editor) => {editorRef.current = editor}}
                               
                                  init={{
                                    height: 220,
                                    menubar: false,
                                    plugins: [
                                      'advlist autolink lists link image charmap print preview anchor',
                                      'searchreplace visualblocks code fullscreen',
                                      'insertdatetime media table paste code help wordcount'
                                    ],
                                    toolbar: 'undo redo | formatselect | ' +
                                    'bold italic backcolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat | help'
                                  
                                  }}
                                />
                            </div>
                            <div className="error">{err_how_to_participate}</div>

                      </div>
                              <div className="review_upload_token mt-3">
                                <button className="dsaf button_transition"  onClick={() =>{createAirdrop()}} >
                                 {loader ? (
                                      <div className="loader"><span className="spinner-border spinner-border-sm "></span>{airdrop_row_id?"Update":"Create"}</div>
                                      ) : (
                                          <>{airdrop_row_id?"Update":"Create"}</>
                                      )}
                                </button> 
                      </div>
                    </div> 
                  </div>

                <div className='col-lg-7 col-md-7 '>
                <div className='mb-4'>
                <div className='form_headings'>
                        <h1>Airdrops List ({airdrop_list.length})</h1>
                        <p>Here you will get the listed Airdrops</p>
                    </div>
                </div>
                <div className='market_page_data'>
                  <div className='table-responsive '>
                <table className="table  ">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Amount/Participates</th>
                    <th>Start-End</th>
                    <th>Status</th>
                    <th >Action</th>
                </tr>
                </thead>
                <tbody>
                {
                  !api_loader?
                    airdrop_list.length>0?
                    airdrop_list.map((e, i) =>
                    <tr key={i}>
                        <td>{i+1}</td>
                        <td>
                          {
                            e.participate_link ?
                            <a href={participate_link} title={e.title} target='_blank'>{e.title}</a>
                            :
                            e.title
                          }
                        </td>
                        <td>
                          {
                            e.winner_price && e.participating_users ?
                            <>
                              {convertCurrency(e.winner_price)}/
                              
                              {e.participating_users} Users
                            </>
                            :
                            e.winner_price ?
                            <>
                              {convertCurrency(e.winner_price)}
                            </>
                            :
                            ""
                          }
                        </td>
                        <td>
                          {
                            e.start_date ? 
                            moment(e.start_date).utc().format("ll")
                            :
                            "-"
                          }
                          <br/>
                          {
                            e.end_date? 
                            moment(e.end_date).utc().format("ll")
                            : 
                            "-"
                          }
                        </td>
                        <td>
                          {
                            e.approval_status == 0 ?
                            <span className="badge_pending">
                            Pending
                            </span>
                            :
                            e.approval_status == 1 ?
                            <span className="badge_approved">
                            Approved
                            </span>
                            :
                            e.approval_status == 2 ?
                            <>
                              <span className="badge_rejected">
                                Rejected 
                                
                              </span>
                              <OverlayTrigger
                                // delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                  <Tooltip {...props} className="custom_pophover">
                                     <p className="rejected_reason"><b>Rejected On:</b> {moment(e.rejected_on).utc().format("ll")} </p>
                                      <p className="rejected_reason"><b>Reason:</b> {e.rejected_reason}</p>
                                  </Tooltip>
                                )}
                                placement="bottom"
                              ><span className='info_col ml-2' ><img src="/assets/img/info.png" alt="Info" /></span>
                              </OverlayTrigger>
                            </>
                            :
                            ""
                          }
                        </td>
                        <td>
                        <button type="submit" title="Edit" onClick={() => getAirdrop(e)} className="tn btn-primary btn-sm" name="disable_job"  >Edit</button>
                        <button type="submit" title="delete" onClick={() => btndelete(e._id)} className="tn btn-danger btn-sm ml-1" name="delete" data-toggle="modal" data-target="#removeConnection" >Delete</button>
                        </td> 
                    </tr>
                    )
                    :
                    <tr>
                        <td colSpan="6"  className="text-lg-center text-md-left">No Records Found</td>
                    </tr>
                    :
                    ""
                }
              
                </tbody> 
            </table>
            <div>
        {/* {
        count > perPage ?
        <div className="pagination_div">
        <div className="pagination_element">
            {
            <ReactPaginate
                previousLabel={currentPage + 1 !== 1 ? "← Prev" : ""}
                nextLabel={currentPage+1 !== pageCount ? "Next →" : ""} 
                breakLabel={<span className="gap">...</span>}
                pageCount={pageCount}
                onPageChange={getFundingList}
                forcePage={currentPage}
                containerClassName={"pagination"}
                previousLinkClassName={"pagination__link"}
                nextLinkClassName={"pagination__link"}
                disabledClassName={"disabled"}
                activeClassName={"active"}
            />}
        </div>
        </div>
        :
        null
    } */}
        </div>
        </div>
        </div>
                </div>
            </div>
        </div>
        </div>
                </div>
                </div>
                </div>
              </div>
            </div>
         
        
    


        {modal_data.title ? <Popupmodal name={modal_data} /> : null}
        {elements}
    </>
  )
}
export async function getServerSideProps({req,query}) 
{

    const token_id = query.token_id

     const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
    if(userAgent.user_token)
    {
      if(userAgent.user_email_status)
      {
        return { props: { userAgent: userAgent, config: config(userAgent.user_token), token_id:token_id}} 
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

