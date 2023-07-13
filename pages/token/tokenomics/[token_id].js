
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

// import { Editor } from '@tinymce/tinymce-react';
 
export default function Create_token({config, token_id}) 
{ 
    const Multiselect = dynamic( () => import('multiselect-react-dropdown').then(module => module.Multiselect),
        {
        ssr: false
        }
    )
    const editorRef = useRef(null)
    const router = useRouter()
    const [wallet_address, setWalletAddress] = useState('')
    const [tokenomic_name, set_tokenomic_name] = useState('')
    const [Percentage_value, set_Percentage_value] = useState('')
    const [contract_address, setContractAddress] = useState([{network_type: "0", contract_address: ""}])
    const [live_price, setLivePrice] = useState("")
    const [market_cap, set_market_cap] = useState("") 
    const [err_contract_address, setErrContractAddress] = useState("")
    const [loader, set_loader] = useState("")
    const [modal_data, setModalData] = useState({ icon: "", title: "", content: "" })
    const [tokenomics_list, set_tokenomics_list ] = useState([])
    const [elements, set_elements] = useState([]);
        
    const [tokenomics_name, set_tokenomics_name ] = useState('')
    const [percentage_of_total_supply, set_percentage_of_total_supply ] = useState('')
    const [total_supply, set_total_supply ] = useState("")
    const [supply, set_supply ] = useState('')
    const [tokenomics_row_id, set_tokenomics_row_id] = useState(0)

    const [api_loader, set_api_loader] = useState(false)
    
    const [err_tokenomics_name, set_err_tokenomics_name ] = useState('')
    const [err_percentage_of_total_supply, set_err_percentage_of_total_supply ] = useState('')
    const [err_total_supply, set_err_total_supply ] = useState('')



    useEffect(() => {
      getTokenDetails();
      tokenomicList()
    }, []);


    const percentageSupply=(value)=>{
      set_percentage_of_total_supply(value)
      set_err_percentage_of_total_supply("")
      let formValid = true
      if(value<0 ||value>100)
      {
        set_err_percentage_of_total_supply('The percentage supply should be 1%-100%.')
        set_total_supply("")
          formValid = false
      }
      if(formValid){
    var sdf=supply/value
    set_total_supply(sdf.toFixed(2))
  }
    }

    const clearform = () =>
    {   
        set_tokenomics_name("")
        set_percentage_of_total_supply("")
        set_total_supply("")
        set_tokenomics_row_id("")
       
       
    }
    const createTokenomic = () =>
    { 
      let formValid = true
      setModalData({ icon: "", title: "", content: "" })
      set_err_tokenomics_name('')
      set_err_percentage_of_total_supply('') 
      set_err_total_supply('')
   
      if(tokenomics_name === '')
      {
        set_err_tokenomics_name('The tokenomic name field is required.')
        formValid = false
      }
      else if(tokenomics_name.length < 4)
      {
        set_err_tokenomics_name('The tokenomic name must be atleast 4 characters.')
        formValid = false
      } 
    
      if(percentage_of_total_supply === '')
      {
        set_err_percentage_of_total_supply('The percentage of total supply field is required.')
          formValid = false
      }
     
      if(total_supply === '')
      {
        set_err_total_supply('The total supply field is required.')
          formValid = false
      }
  
      set_loader(true)
      const reqObj = {
        token_row_id:token_id,
        tokenomics_row_id:tokenomics_row_id,
        tokenomics_name:tokenomics_name,
        percentage_of_total_supply:percentage_of_total_supply,
        total_supply: total_supply
      } 
     
      if(formValid)
      { 
        
        Axios.post(API_BASE_URL+"markets/users/manage_tokenomics/update_n_save_details", reqObj, config).then(response=> { 
          set_loader(false)
          if(response.data.status)
          { 
            setModalData({icon: "/assets/img/update-successful.png", title: "Thank you ", content: response.data.message.alert_message})
            clearform();
            tokenomicList()
          } 
          { 
    
            if(response.data.message.tokenomics_name)
            {
              set_err_tokenomics_name(response.data.message.tokenomics_name)   
            }
            
            if(response.data.message.percentage_of_total_supply)
            {
              set_err_percentage_of_total_supply(response.data.message.percentage_of_total_supply)
            } 
    
            if(response.data.message.total_supply)
            {  
              set_err_total_supply(response.data.message.total_supply)
            }
            
          }
        })
      }
      
    }  

    const getTokenDetails=()=>
  {
  
    Axios.get(API_BASE_URL+"markets/users/manage_crypto/individual_details/"+token_id, config)
    .then(response=>{
      if(response.data.status){ 
        // console.log(response.data) 
        set_supply(response.data.message.total_supply)
      }
  
    })
  }
  const btndelete = (row_id) => {
    let ele= <div className="remove_modal">
    <div className="modal" id="removeConnection">
        <div className="modal-dialog modal-sm">
        <div className="modal-content">
            <div className="modal-body">
            <button type="button" className="close"  data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" /></button>
            <div className="text-center">
            <div className=""><img src="/assets/img/cancel.png" className="prop_modal_img"/></div>
                <h4 className="">Delete Tockenomic!</h4>
                <p>Do you really want to delete this Tockenomic detail?</p>
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
      API_BASE_URL+"markets/users/manage_tokenomics/delete_tokenomics/"+row_id,
      config
    ).then((response) => {
      if (response.data.status === true) {
        setModalData({
          icon: "/assets/img/update-successful.png",
          title: "Thank You!",
          content: response.data.message.alert_message,})
        tokenomicList();
        clearform();
        set_tokenomics_row_id("");
      } else {
        setModalData({
          icon: "/assets/img/attendee_cross.png",
          title: "Oops!",
          content: response.data.message.alert_message,
        });
      }
    });
  };

  const tokenomicList = () => 
  {
    Axios.get(API_BASE_URL + "markets/users/manage_tokenomics/list/"+token_id, config).then(
      (response) => 
      {
        console.log(response);
        if(response.data.status) 
        {
          set_api_loader(false)
          set_tokenomics_list(response.data.message);
        }
      }
    );
  };

  const getTokenomic = (e) => {
    set_tokenomics_name(e.tokenomics_name)
    set_percentage_of_total_supply(e.percentage_of_total_supply)
    set_total_supply(e.total_supply)
    set_tokenomics_row_id(e._id)

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
        <title>Manage Tockenomics</title>
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
                <h1 className='page_main_heading'>Manage Tokenomics</h1>
                <Top_header active_tab={4} token_id={token_id}/>
                </div>
                  <div className=" token_steps">
                  <div className="row">
                    <div className="col-lg-5 col-md-5">
                    <div className='form_headings'>
                    <h5>{tokenomics_row_id?"Update":"Create"} Tokenomics</h5>
                    <p >{!tokenomics_row_id?"You can create tokenomics for your tokens.":"Edit tokenomic details for your tokens."}</p>
                    </div>
                    <div className='create_token_details'>
                        <div className="form-custom">
                            <label htmlFor="email">Tokenomics Name <span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                            <input type="text" className="form-control" placeholder="Tokenomics name"value={tokenomics_name} onChange={(e) => set_tokenomics_name(e.target.value)}/>
                            </div>
                            <div className="error">{err_tokenomics_name}</div>
                        </div>
                    <div className='row'>
                      <div className='col-md-6'>
                      <div className="form-custom">
                            <label htmlFor="email">Total Supply(%)<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                                <input type="number" className="form-control" placeholder="% Value" value={percentage_of_total_supply} onChange={(e) => percentageSupply(e.target.value)}/>
                            </div>
                            <div className="error">{err_percentage_of_total_supply}</div>
                        </div>
                      </div>
                      <div className='col-md-6'>
                      <div className="form-custom">
                            <label htmlFor="email">Total Supply </label>
                            <div className="form-group input_block_outline">
                                <input type="number" className="form-control" placeholder="Total Supply" value={total_supply}  readOnly/>
                            </div>
                            <div className="error">{err_total_supply}</div>

                        </div>
                      </div>
                    </div>
                      
                        <div className="review_upload_token mt-3">
                        <button className="dsaf button_transition"  onClick={() =>{createTokenomic()}}>
                            {loader ? (
                                <div className="loader"><span className="spinner-border spinner-border-sm "></span>{tokenomics_row_id?"Update":"Create"}</div>
                                ) : (
                                    <>{tokenomics_row_id?"Update":"Create"}</>
                                )}
                        </button> 
                        </div>
                    </div>
                    </div>

                <div className='col-lg-7 col-md-7 '>
                <div className='form_headings'>
                <h5>Tokenomics List ({tokenomics_list.length})</h5>
                 <p> Here you will find the listed tokenomics or you may choose to delete them.</p>
                </div>
                  <div className='market_page_data token_tables'>
              
                    <div className="table-responsive">
                <table className="table">
                <thead>
                <tr>
                    <th >Sl No.</th>
                    <th >Tokenomics Name</th>
                    <th >% Value</th>
                    <th >Total Supply</th>
                    <th >Action</th>
                </tr>
                </thead>
                <tbody>
                {
                  !api_loader?
                    tokenomics_list.length>0?
                    tokenomics_list.map((e, i) =>
                    <tr key={i}>
                        <td>{i+1}</td>
                        
                        <td>{e.tokenomics_name}</td>
                        
                        <td>{e.percentage_of_total_supply?e.percentage_of_total_supply+"%":"--"}</td>
                        <td>{e.total_supply?e.total_supply.toFixed(2):""}</td>
                        <td>
                        <button type="submit" title="Edit" onClick={() => getTokenomic(e)} className="tn btn-info btn-sm" name="disable_job"  >Edit</button>
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
export async function getServerSideProps({req, query}) 
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

