import React , {useState, useEffect} from 'react'
import Link from 'next/link' 
import Head from 'next/head' 
import Axios from 'axios'
import JsCookie from 'js-cookie'
import moment from 'moment'
import Web3 from 'web3'  
import { useRouter } from 'next/router'
import InfiniteScroll from "react-infinite-scroll-component";
import { USDFormatValue, protocol_types, getNetworkByID,getEvmNetwork, nftByWalletAddress, evmConfig, setActiveNetworksArray, getShortAddress,fetchAPIQuery,makeJobSchema,graphqlBasicTokenData,graphqlPricingTokenData, cryptoNetworksList} from '../../config/helper'
import { arrayColumn, roundNumericValue, API_BASE_URL, graphqlApiURL, strLenTrim, separator, currency_object,config,count_live_price,validBalance, getShortWalletAddress, market_coinpedia_url} from '../../constants' 
import {transactionLoader} from '../../loaders/contentLoader'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';



export default function FeedFunction({networks, addresses}) 
{ 
    const [showTooltip1, setShowTooltip1] = useState(false);
    const [showTooltip2, setShowTooltip2] = useState(false);
    const [showTooltip3, setShowTooltip3] = useState(false);

    const tooltip1 = <Tooltip arrowOffsetTop={20} id="button-tooltip">Copied!</Tooltip>;
    const tooltip2 = <Tooltip id="button-tooltip">Copied!</Tooltip>;
    const tooltip3 = <Tooltip id="button-tooltip">Copied!</Tooltip>;  
    console.log("networks", networks)
    console.log("addresses", addresses)
    const [approvals_list, set_approvals_list] = useState([])
    const [loader_status, set_loader_status] = useState(true)
    const [copy_hash_address, set_copy_hash_address]=useState("")
    const [protocol_type, set_protocol_type]=useState(protocol_types[0])
    const [token_details_modal_status, set_token_details_modal_status] = useState(false)
    const [token_detail, set_token_detail] = useState("")
    const [tokens_grand_total, set_tokens_grand_total] = useState(0)

    const protocolType = (pass_protocol_type) =>
    {  
     
        
        console.log("pass_protocol_type",pass_protocol_type)
        set_protocol_type(pass_protocol_type)
        getTokenApprovals(pass_protocol_type)
    }

    useEffect(() => 
    {
        getTokenApprovals(protocol_type)
    }, [])



    const getTokenDetail = async (e) => {
        console.log("e",e)
        await set_token_detail("")
        await set_token_details_modal_status(true)
        await set_token_detail(e)


        //  const response = await getTokenInOutDetails(e)
        //  console.log("response", response)
      }
    
    //https://www.oklink.com/docs/en/#on-chain-tools-tracker-token-authorized-list
    const getTokenApprovals = async (pass_protocol_type) =>
    {       
        const network_id = pass_protocol_type.network_id
        const protocolType = pass_protocol_type.protocolType

        set_loader_status(true) 
        var final_result = []
        var token_addresses_array = []
        var token_symbol_array = []
        if(addresses.length)
        {   
            for(let run of addresses)
            {
                const res = await Axios.get('/api/portfolio/approval_checker/?wallet_address='+run+"&network="+network_id+"&protocolType="+protocolType)
                console.log("res",res)
                if(res.data.status)
                {
                    const authorizedList = await res.data.message ? res.data.message:[]
                    await authorizedList.forEach(function(e){
                        e["wallet_address"] = run
                    });
                    console.log("authorizedList", authorizedList)
                    
                    final_result = await [...final_result,...authorizedList]
                  
                }
                console.log("final_result", final_result)
            }
            set_loader_status(false) 

            if(final_result.length)
            {
              await final_result.sort(function(a,b)
              {
                return new Date(parseInt(b.approvedTime)) - new Date(parseInt(a.approvedTime))
              })
              
              

              const spenders_names = await spendersNames(final_result)
             
              const cal_result = []
              for(let run of final_result)
              {
                var arrayWithoutD = await spenders_names.filter(function (el) 
                {
                    return (el.contract_address).toLowerCase() == (run.approvedContractAddress).toLowerCase()
                })
                var contract_name = ""
                if(arrayWithoutD[0])
                {
                    contract_name = await arrayWithoutD[0].contract_name 
                }

                console.log("asdf", arrayWithoutD)
                await cal_result.push({
                    address: run.address,
                    approvedAmount: run.approvedAmount,
                    approvedContractAddress: run.approvedContractAddress,
                    approvedTime: run.approvedTime,
                    approvedTxId: run.approvedTxId,
                    protocolType: run.protocolType,
                    symbol: run.symbol,
                    tokenContractAddress: run.tokenContractAddress,
                    tokenId: run.tokenId,
                    type: run.type,
                    wallet_address: run.wallet_address,
                    contract_name: contract_name
                })
              }

              await set_approvals_list(cal_result)
              console.log("cal_result", cal_result)

            }
            else
            {
                await set_approvals_list([])
            }
                
            
            
            // const price_list = await priceList(final_result)
            // console.log("price_list", price_list)
            // if(final_result.length)
            // {
            //     for()
            //     {

            //     }
            // }
            
            
        }
        else
        {
            await set_approvals_list([])
        }
    }

    const spendersNames = async (pass_addresses) =>
    {   
        const addresses = await arrayColumn(pass_addresses, 'approvedContractAddress')
        const res = await Axios.post(API_BASE_URL + "markets/portfolio/approval_spenders", {addresses:addresses}, config(""))
        if(res.data.status) 
        {
            console.log("res",res)
            return await res.data.message
        }
        else
        {
            return []
        }
    }
    

    const priceList = async (final_result) =>
    {
        const token_addresses = await arrayColumn(final_result, 'tokenContractAddress')
        var prices_array = []
        var token_symbols = [] //await arrayColumn(final_result, 'symbol')
        const prices_res = await Axios.post(API_BASE_URL + "markets/cryptocurrency/get_prices_by_symbols", {token_symbols, token_addresses}, config(""))
        if(prices_res.data.status) 
        {
            prices_array = await prices_res.data.message
        }
        return prices_array
    }
    const copyAddress=(pass_address, param)=>
    {
      if(parseInt(param) === 1)
      {
        setShowTooltip1(true)
      }
      else if(parseInt(param) === 2)
      {
        setShowTooltip2(true)
      }
      else
      {
        setShowTooltip3(true)
      }

      var copyText = document.createElement("input")
      copyText.value = pass_address
      document.body.appendChild(copyText)
      copyText.select()
      document.execCommand("Copy")
      copyText.remove()
      if(parseInt(param) === 1)
      {
        setTimeout(() => setShowTooltip1(false), 3000)
      }
      else if(parseInt(param) === 2)
      {
        setTimeout(() => setShowTooltip2(false), 3000)
      }
      else
      {
        setTimeout(() => setShowTooltip3(false), 3000)
      }
    }
    
    return(
        <div className='crypto-assets'>
        <div className='row'>
            <div className="col-6">
            <h6 className='portfolio-sub-title mt-2'>
            Token Approvals {approvals_list.length ? <>({approvals_list.length})</>:""}
            </h6>
            </div>
            <div className="col-6">
                <div className="dropdown asset_view_dropdown approval-select">
                    <button className="dropdown-toggle" type="button" data-toggle="dropdown">
                    <img className="network-image" src={`/assets/img/portfolio/${protocol_type.network_image}`} alt={protocol_type.network_name} title={protocol_type.network_name} /> {protocol_type.type_name}
                        <img src="/assets/img/filter_dropdown.svg" /> 
                    </button>
                    <ul className="dropdown-menu">
                        {
                            protocol_types.length ? 
                            protocol_types.map((item, i) =>
                            <li onClick={()=>protocolType(item)} >
                                <img className="network-image"  src={`/assets/img/portfolio/${item.network_image}`} alt={item.network_name} title={item.network_name} /> {item.type_name}
                            </li>
                            )
                            :
                            ""
                        }
                    </ul>
                </div>
           </div>
        </div>
        {/* protocolType */}

        <div className='new_page_table profile_page_table '>
        <div className="table-responsive">
            <table className="table">
                <thead>
                    <tr>
                    <th className="mobile_hide">Sl.No</th>
                   
                    <th className="date-th">Date & Time</th>
                    <th className="date-th mobile_hide">Wallet</th>
                    <th className="mobile_hide">Approvals Spender</th>
                  
                    <th className='transfer_col'>Allowance</th>
                    <th className="txn_hash ">Txn Hash</th>
                    </tr>
                </thead>
                    <tbody>
                    {
                    !loader_status ?
                    <>
                        {
                        approvals_list.length>0?
                        <>
                        {
                        approvals_list.map((e, i)=>
                        <tr>
                        <td className="mobile_hide">{++i}</td>
                        
                        <td className='txn-date'>
                            {moment(parseInt(e.approvedTime)).format("DD MMM YYYY")}
                            <br/>
                            {moment(parseInt(e.approvedTime)).format("h:mma")}
                        </td>
                        <td className='hash_value mobile_hide'>
                            {getShortWalletAddress(e.wallet_address)}
                        </td>
                        <td className='hash_value mobile_hide'>
                            {
                                e.contract_name ?
                                <div style={{width:"125px", textTransform:"capitalize", wordBreak:"break-all"}}>
                                {e.contract_name}
                                </div>
                                :
                                <>
                               {getShortWalletAddress(e.approvedContractAddress)}
                                </>
                            }
                        </td>
                        {/* <td className='hash_value'>{e.symbol}</td> */}
                    
                        <td className="txns-network-type ">
                            {
                                e.approvedAmount == 'unlimited' ?

                                <div className="media-body align-self-center"style={{textTransform:"capitalize"}}>{e.approvedAmount}</div>
                                :
                                roundNumericValue(e.approvedAmount)
                            } {e.symbol}
                            
                        </td>
                        <td className='transfer_col'>
                            <a target="_blank" href={protocol_type.network_url+e.approvedTxId} style={{color:"#2196F3"}}>{getShortWalletAddress(e.approvedTxId)}</a>
                         </td>
                         <td>
                         <img src="/assets/img/view-arrow.png" alt="info" className="info_icon_trans" onClick={() => getTokenDetail(e)} />
                        </td>
                        {/* <td className='transfer_col'>
                        </td> */}
                       
                        </tr>
                        )
                        
                        }
                        </>
                        :
                        <tr key="1">
                            <td className="text-center" colSpan="6">
                                Sorry, No related data found.
                            </td>
                        </tr>
                        }
                        </>
                    :
                    (transactionLoader(10))
                    }
                        
                </tbody>
            </table>
        </div>
            </div>
       
       <div className="remove_wallet_modal token-details-popup">
            <div className={"modal "+(token_details_modal_status ? " modal-show":"")} style={token_details_modal_status?{display:'block'}:{display:"none"}}>
                <div className="modal-dialog " >
                    <div className="modal-content portfolio_tokens_value">
                        <div className="modal-body">
                            <div className='transaction_detail_modal'><h4>Tokens Approvals Details
                                <span>
                                    <button type="button" className="close close_wallet" onClick={()=> set_token_details_modal_status(false)} data-dismiss="modal">
                                        <img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="close" />
                                        </button>
                                        </span>
                                        </h4>
                                        </div>
                            {
                               <table className='table token-details-table'>
                                {
                                    token_detail?
                                    <tbody>
                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Wallet Address</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            <OverlayTrigger
                  placement="bottom"
                  delay={{ show: 200, hide: 200 }}
                  overlay={tooltip1}
                  arrowOffsetTop={20}
                  show={showTooltip1}>
                  <span onClick={()=>copyAddress(token_detail.wallet_address, 1)}  >
                        <img src="/assets/img/copy_img.svg" alt = "Copy" className='ml-2' style={{width:"auto"}}/>
                        </span>
                  </OverlayTrigger> &nbsp;
                                            {getShortWalletAddress(token_detail.wallet_address)}
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr>
                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Contract Name</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            {
                                token_detail.contract_name ?
                                <div style={{width:"125px", textTransform:"capitalize", wordBreak:"break-all"}}>
                                {token_detail.contract_name}
                                </div>
                                :
                                <>
                               {getShortWalletAddress(token_detail.approvedContractAddress)}
                                </>
                            }
                                          
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr>
                                    <tr>
                                    {token_detail.symbol?
                                    <div className='row'>
                                    <div className='col-6 col-md-6'>
                                    <td><label className='token-type-name '>Symbol</label></td>
                                    
                                    </div>
                                    <div className='col-6 col-md-6'>
                                    <td className='token-value-details'>
                                    {token_detail.symbol}
                                        </td>
                                    </div>
                                </div>
                                    :
                                    ""
                                    }
                                        {/* <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Symbol</label></td>
                                            
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            {token_detail.symbol}
                                                </td>
                                            </div>
                                        </div> */}
                                
                                    </tr>
                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Protocol Type</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                                
                                            {token_detail.protocolType}
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr>
                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Token Contract Address </label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            <OverlayTrigger
                                       placement="bottom"
                                       delay={{ show: 200, hide: 200 }}
                                        overlay={tooltip2}
                                         arrowOffsetTop={20}
                                        show={showTooltip2}>
                                    <span onClick={()=>copyAddress(token_detail.tokenContractAddress, 2)}  >
                        <img src="/assets/img/copy_img.svg" alt = "Copy" className='ml-2' style={{width:"auto"}}/>
                        </span>
                  </OverlayTrigger> &nbsp;
                                            {getShortWalletAddress(token_detail.tokenContractAddress)}
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr>
                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Approved Transaction Id</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            <OverlayTrigger
                                       placement="bottom"
                                       delay={{ show: 200, hide: 200 }}
                                        overlay={tooltip3}
                                         arrowOffsetTop={20}
                                        show={showTooltip3}>
                                    <span onClick={()=>copyAddress(token_detail. approvedTxId, 3)}  >
                        <img src="/assets/img/copy_img.svg" alt = "Copy" className='ml-2' style={{width:"auto"}}/>
                        </span>
                  </OverlayTrigger> &nbsp;
                                            {getShortWalletAddress(token_detail.approvedTxId)}
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr>

                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Approved Amount</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            {/* {
                                token_detail.approvedAmount == 'unlimited' ?

                                <div className="media-body align-self-center"style={{textTransform:"capitalize"}}>{token_detail.approvedAmount}{token_detail.symbol}</div>
                                :
                                roundNumericValue(token_detail.approvedAmount)
                            }  */}
                                         
                                         {
                                token_detail.approvedAmount == 'unlimited' ?

                                <div className="media-body align-self-center"style={{textTransform:"capitalize"}}>{token_detail.approvedAmount}</div>
                                :
                                roundNumericValue(token_detail.approvedAmount)
                            } {token_detail.symbol}
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr>
                                    
                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Approved Date & Time</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            {moment(parseInt(token_detail.approvedTime)).format("DD MMM YYYY")}
                            <br/>
                            {moment(parseInt(token_detail.approvedTime)).format("h:mma")}
                                                </td>
                                            </div>
                                        </div>

                                    </tr>
                            

                                    {/* <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Token Id</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            {token_detail.tokenId}
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr> */}
                                    <tr>
                                        <div className='row'>
                                            <div className='col-6 col-md-6'>
                                            <td><label className='token-type-name '>Type</label></td>
                                            </div>
                                            <div className='col-6 col-md-6'>
                                            <td className='token-value-details'>
                                            {token_detail.type}
                                                </td>
                                            </div>
                                        </div>
                                
                                    </tr>
                                    

                                   
                                
                                  </tbody>
                                  :
                                  ""
                                  
                                }
                            
                             </table> 
                            }
                            
                        </div>
                    </div>
                </div>
            </div> 
        </div>
     
          
            
        </div>
    )    
}