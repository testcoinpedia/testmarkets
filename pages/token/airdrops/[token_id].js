
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
// import "react-datetime/css/react-datetime.css"
import {API_BASE_URL, x_api_key, app_coinpedia_url, coinpedia_url,  market_coinpedia_url,config,graphqlApiKEY,separator} from '../../../components/constants'; 
import Select from 'react-select'
import Popupmodal from '../../../components/popupmodal'
import Top_header from '../../../components/manage_token/top_header' 
  
 
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
    const [sub_title, set_sub_title] = useState("")
    const [winner_price, set_winner_price] = useState("")
    const [start_date, set_start_date] = useState("")
    const [end_date, set_end_date] = useState("")
    const [participate_link, set_participate_link] = useState("")
    const [description, set_description] = useState("")
    const [how_to_participate, set_how_to_participate] = useState("")

    const [err_title, set_err_title] = useState("")
    const [err_sub_title, set_err_sub_title] = useState("")
    const [err_winner_price, set_err_winner_price] = useState("")
    const [err_start_date, set_err_start_date] = useState("")
    const [err_end_date, set_err_end_date] = useState("")
    const [err_participate_link, set_err_participate_link] = useState("")
    const [err_description, set_err_description] = useState("")
    const [err_how_to_participate, set_err_how_to_participate] = useState("")

    const [edit_airdrop_row_id, set_edit_airdrop_row_id] = useState('')

    const createAirdrop = () =>
    { 
      let formValid = true
      setModalData({ icon: "", title: "", content: "" })
      // if(wallet_address === '')
      // {
      //   formValid = false
      //   setErrWalletConnection(true)
      // }
      set_err_title('')
      set_err_sub_title('') 
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
     
   

  
      if(sub_title === '')
      {
        set_err_sub_title('The sub title field is required.')
          formValid = false
      }
      
      
  
      if(winner_price === '')
      {
        set_err_winner_price('The winner price field is required.')
          formValid = false
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
  
      if(participate_link === '')
      {
        set_err_participate_link('The participate link field is required.')
        formValid = false
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
      if(how_to_participate === '')
      {
        set_err_how_to_participate('The participate field is required.')
        formValid = false
      }
      else if(how_to_participate.length<4)
      {
        set_err_how_to_participate('The participate field should be atleast 4 characters in length.')
        formValid = false
      }
      set_loader(true)
      const reqObj = {
        token_id:token_id,
        edit_airdrop_row_id:edit_airdrop_row_id,
        title: title,
        sub_title: sub_title, 
        winner_price: winner_price,
        start_date: start_date,
        end_date: end_date,
        participate_link: participate_link,
        description: description,
        how_to_participate: how_to_participate,
        
      } 
     
      if(formValid)
      { 
        
        Axios.post(API_BASE_URL+"markets/listing_tokens/update_token_details/", reqObj, config).then(response=> { 
          set_loader(false)
          // console.log(response)
          if(response.data.status)
          { 
           
            // console.log(response.data)
            setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: response.data.message.alert_message})
          } 
          { 
    
            if(response.data.message.title)
            {
              set_err_title(response.data.message.title)   
            }
            
            if(response.data.message.sub_title)
            {
              set_err_sub_title(response.data.message.sub_title)
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
      
    }  
    const getAirdrop = (ticket_row_id) => {
      // Axios.get(
      //   API_BASE_URL + "app/ticket/view_ticket/" + ticket_row_id,
      //   config
      // ).then((response) => {
      //   if (response.data.status === true) {
      //     set_title(response.data.message.title)
      //     set_sub_title(response.data.message.sub_title)
      //     set_winner_price(response.data.message.winner_price)
      //     set_start_date(response.data.message.start_date)
      //     set_end_date(response.data.message.end_date)
      //     set_participate_link(response.data.message.participate_link)
      //     set_description(response.data.message.description)
      //     set_how_to_participate(response.data.message.how_to_participate)
      //     set_edit_airdrop_row_id(response.data.message._id)
      //   } else {
      //     set_success_message_modal({
      //       icon: "/assets/img/attendee_cross.png",
      //       title: "Oops!",
      //       content: response.data.message.alert_message,
      //     });
      //   }
      // });
    };
    
    const makeJobSchema=()=> 
    {  
      return { 
          "@context":"http://schema.org/",
          "@type":"Organization",
          "name":"Coinpedia",
          "url":"https://markets.coinpedia.org",
          "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
          "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
        }  
    } 


  return(
    <>
      <Head>
        <title>Create New Token</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="keywords" content="Cryptocurrency Market, cryptocurrency market sentiments, crypto market insights, cryptocurrency Market Analysis, NFT Price today, DeFi Token price, Top crypto gainers, top crypto loosers, Cryptocurrency market, Cryptocurrency Live market Price, NFT Live Chart, Cryptocurrency analysis tool." />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta property="og:url" content={market_coinpedia_url} />
        <meta property="og:site_name" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta name="twitter:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 
        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="canonical" href={market_coinpedia_url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
      <div className="page">
        <div className="create_airdrop create_launchpad">
          <div className="container">
            <div className="for_padding">
              <div> 
                <div className="token_form">

                <div className='market_token_tabs'>
                <h4>Manage Airdrops</h4>
                <Top_header active_tab={3} token_id={token_id}/>
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
                    <h1>{edit_airdrop_row_id?"Update":"Create"} Airdrop</h1>
                    {edit_airdrop_row_id?"":<p>Enter all these fields to create Airdrop</p>}
                      <div className='create_token_details'>
                      <div className="row">
                        <div className="col-lg-12 col-md-12">
                            <div className="form-custom">
                            <label htmlFor="email">Title <span className="label_star">*</span></label>
                              <div className="form-group input_block_outline">
                                <input type="text" className="form-control" placeholder="Airdrop title" value={title} onChange={(e) => set_title(e.target.value)}/>
                            </div>
                            <div className="error">{err_title}</div>

                          </div>
                        </div>

                        <div className="col-lg-12 col-md-12">
                          <div className="form-custom">
                              <label htmlFor="email">Sub title <span className="label_star">*</span></label>
                              <div className="form-group input_block_outline">
                                <input type="text" className="form-control" placeholder="Airdrop subtitle" value={sub_title} onChange={(e) => set_sub_title(e.target.value)}/>
                              </div>
                            <div className="error">{err_sub_title}</div>

                          </div>
                        </div>
                    </div>


                      <div className="row">
                          <div className="col-lg-6 col-md-6">
                            <div className="form-custom">
                              <label htmlFor="email">Winner amount <span className="label_star">*</span></label>
                                <div className="form-group input_block_outline">
                                  <input type="text" className="form-control" placeholder="Winner amount" value={winner_price} onChange={(e) => set_winner_price(e.target.value)}/>
                              </div>
                            <div className="error">{err_winner_price}</div>

                            </div>
                          </div>

                          <div className="col-lg-6 col-md-6">
                            <div className="form-custom">
                              <label htmlFor="email">Participate Link <span className="label_star">*</span></label>
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
                                  <textarea  className="form-control" placeholder="Airdrop description" value={description} onChange={(e) => set_description(e.target.value)}/>
                                </div>
                            <div className="error">{err_description}</div>

                          </div>
                      
                      <div className="form-custom">
                          <label htmlFor="email">How to participate in airdrops <span className="label_star">*</span></label>
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
                                      <div className="loader"><span className="spinner-border spinner-border-sm "></span>{edit_airdrop_row_id?"Update":"Create"}</div>
                                      ) : (
                                          <>{edit_airdrop_row_id?"Update":"Create"}</>
                                      )}
                                </button> 
                      </div>
                    </div> 
                  </div>

                <div className='col-lg-7 col-md-7 '>
                <div className='mb-4'>
                    {/* <div className="funding_details"> */}
                        <h1>Airdrops List</h1>
                        <p>Here you will get the listed Airdrops</p>
                    {/* </div> */}
                </div>
                  <div className='table-responsive '>
                <table className="table  ">
                <thead>
                <tr>
                    <th >Sl No.</th>
                    <th >Airdrop title<br></br>(subtitle)</th>
                    <th >Amount</th>
                    <th >Date</th>
                    <th >Airdrop Link</th>
                    <th >Action</th>
                </tr>
                </thead>
                <tbody>
                {/* {
                    funding_list.length>0?
                    funding_list.map((e, i) =>
                    <tr key={i}>
                       
                    </tr>
                    )
                    :
                    <tr>
                        <td colSpan="6"  className="text-lg-center text-md-left">No Records Found</td>
                    </tr>
                    
                } */}
                <tr>
                <td>1</td>
                <td>erdfs</td>
                <td>erdfs</td>
                <td>erdfs</td>
                <td>erdfs</td>
                 <td>
                        <button type="submit" title="Edit" onClick={() => getAirdrop(e._id)} className="tn btn-info btn-sm" name="disable_job"  >Edit</button>
                        </td> 
                        </tr>
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
         
        
    


        {/* {modal_data.title ? <Popupmodal name={modal_data} /> : null} */}

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

