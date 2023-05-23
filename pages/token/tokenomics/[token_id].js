
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
        

    const [tokenomics_name, set_tokenomics_name ] = useState('')
    const [percentage_of_total_supply, set_percentage_of_total_supply ] = useState('')
    const [total_supply, set_total_supply ] = useState('')

    
    const [err_tokenomics_name, set_err_tokenomics_name ] = useState('')
    const [err_percentage_of_total_supply, set_err_percentage_of_total_supply ] = useState('')
    const [err_total_supply, set_err_total_supply ] = useState('')


    useEffect(() => {
      getTokenDetails();
    }, []);

    const createTokenomic = () =>
    { 
      let formValid = true
      setModalData({ icon: "", title: "", content: "" })
      // if(wallet_address === '')
      // {
      //   formValid = false
      //   setErrWalletConnection(true)
      // }
      set_err_tokenomics_name('')
      set_err_percentage_of_total_supply('') 
      set_err_total_supply('')
     
   
      if(tokenomics_name === '')
      {
        set_err_tokenomics_name('The tokenomics name field is required.')
        formValid = false
      }
      else if(tokenomics_name.length < 4)
      {
        set_err_tokenomics_name('The tokenomics name must be atleast 4 characters.')
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
        tokenomics_name:tokenomics_name,
        percentage_of_total_supply:percentage_of_total_supply,
        total_supply: total_supply,
        
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
  
    Axios.get(API_BASE_URL+"markets/listing_tokens/individual_details/"+token_id, config)
    .then(response=>{
      if(response.data.status){ 
      
        console.log(response.data) 
       
        set_total_supply(response.data.message.total_max_supply)
       
        // set_category_row_id(response.data.message.category_row_id)
        // set_category_name(response.data.message.category_name)
      
      }
      // else
      // {
      //   router.push("/token")
      // }
    })
  }
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
                <h1 className='page_main_heading'>Manage Tokenomics</h1>
                <Top_header active_tab={4} token_id={token_id}/>
                    {/* <div className="row">
                        <div className="col-lg-3 col-md-4">
                        </div>  
                        <div className="col-lg-6 col-md-6">
                           
                        </div>
                    </div> */}
                </div>

                  <div className=" token_steps">
                  <div className="row">
                    <div className="col-lg-5 col-md-5">
                    <div className='form_headings'>
                    <h5>Create Tokenomics</h5>
                    <p >Enter all these fields to create tokenomics</p>
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
                            <label htmlFor="email">Total Supply Percentage<span className="label_star">*</span></label>
                            <div className="form-group input_block_outline">
                                <input type="number" className="form-control" placeholder="% Value" value={percentage_of_total_supply} onChange={(e) => set_percentage_of_total_supply(e.target.value)}/>
                            </div>
                            <div className="error">{err_percentage_of_total_supply}</div>

                        </div>
                      </div>
                      <div className='col-md-6'>
                      <div className="form-custom">
                            <label htmlFor="email">Total Supply </label>
                            <div className="form-group input_block_outline">
                                <input type="text" className="form-control" placeholder="Total Supply" value={total_supply} onChange={(e) => set_total_supply(e.target.value)} readOnly/>
                            </div>
                            <div className="error">{err_total_supply}</div>

                        </div>
                      </div>
                    </div>
                       

                        

                    

                        <div className="review_upload_token mt-3">
                        <button className="dsaf button_transition"  onClick={() =>{createTokenomic()}}>
                            {loader ? (
                                <div className="loader"><span className="spinner-border spinner-border-sm "></span>Create</div>
                                ) : (
                                    <>Create</>
                                )}
                        </button> 
                        </div>
                    </div>
                    </div>

                <div className='col-lg-7 col-md-7 '>
                <div className='form_headings'>
                <h5>Tokenomics List</h5>
                 <p>Here you will get the listed Tokenomics</p>
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
                <tr>
                        <td>1</td>
                    <td>erdfs</td>
                    <td>erdfs</td>
                    <td>erdfs</td>
                        <td>
                            <button type="submit" title="Edit" onClick={() => getFundingDetails(e._id)} className="tn btn-info btn-sm" name="disable_job"  >Edit</button>
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
        </div>
        
    


        {modal_data.title ? <Popupmodal name={modal_data} /> : null}

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

