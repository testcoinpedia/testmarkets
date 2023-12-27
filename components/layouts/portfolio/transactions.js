/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import moment from 'moment'
import {transactionLoader} from '../../../components/loaders/contentLoader'
import { roundNumericValue, getZeroAppendValues } from '../../../components/config/helper'
import {getShortWalletAddress} from '../../../components/constants'
import All_transactions from './all_transactions'
import TransactionDetail from './transaction_detail'

export default function TransactionFun({networks, addresses}) 
{   
    // console.log("token",token)
    const [toggle,set_toggle] =useState(true) // true = recent , false = all
    const [txns_list,set_txns_list] =useState([])
    const [loader_status, set_loader_status]=useState(false)
    const [eth_api_url] =useState("https://api.etherscan.io/api?module=account&action=")
    const [eth_api_key] =useState("SHWDKJ6CQ59Y29RIX11WVWVUGI1MPI569G")
    
    const [bnb_api_url] =useState("https://api.bscscan.com/api?module=account&action=")
    const [bnb_api_key] =useState("27SGZ45YV2YJAEXNSMD3H758VSAY1FBQ6X")
    
    const [fantom_api_url] =useState("https://api.ftmscan.com/api?module=account&action=")
    const [fantom_api_key] =useState("ZQPMZEAMIGZ37A14B5MABSBCQZCPED3YKY")

    const [polygon_api_url] =useState("https://api.polygonscan.com/api?module=account&action=")
    const [polygon_api_key] =useState("BKWA3IQ26ZXAREG8CVV57BSYHNW8DRQ5KB")

    const [avalanche_api_url] =useState("https://api.snowtrace.io/api?module=account&action=")
    const [avalanche_api_key] =useState("5VAEBSQY4KIH2RP66QNE4R6DWRMR1RDH9J")
    const [transaction_details_modal_status, set_transaction_details_modal_status] =useState(false)
    const [transaction_detail, set_transaction_detail] =useState("")
    
    console.log("txns_list",txns_list)

   useEffect(()=>
   {  
        bnbTxnsList()

    },[networks])

    const getTokenDetail= async (e)=>
    {
        console.log("transactions", e)
        await set_transaction_detail("")
        await set_transaction_details_modal_status(true)
        await set_transaction_detail(e)
    }

    const bnbTxnsList =async()=>
    {   

        // const bal_req = await Promise.all([
        //     fetch(bnb_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+bnb_api_key+"&page=1&offset=5"),
        //     fetch(bnb_api_url+"tokentx&address="+addresses[0]+"&sort=desc&apikey="+bnb_api_key+"&page=1&offset=5"),
        //     fetch(eth_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+eth_api_key+"&page=1&offset=5"),
        //     fetch(eth_api_url+"tokentx&address="+addresses[0]+"&page=1&offset=5&sort=desc&apikey="+eth_api_key),
        //     fetch(fantom_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+fantom_api_key+"&page=1&offset=5"),
        //     fetch(fantom_api_url+"tokentx&address="+addresses[0]+"&sort=desc&apikey="+fantom_api_key+"&page=1&offset=5"),
        //     fetch(polygon_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+polygon_api_key+"&page=1&offset=5"),
        //     fetch(polygon_api_url+"tokentx&address="+addresses[0]+"&sort=desc&apikey="+polygon_api_key+"&page=1&offset=5"),
        // ])
        // const bal_res = await Promise.all(bal_req.map(r => r.json()))
        // let i=0
        // for(let run of bal_res)
        // {

        // }
        // console.log("bal_res", bal_res)
        // return 
        var result = []
        var res1 = ""
        var res2 = ""
        var res3 = ""
        var res4 = ""

        var res5 = ""
        var res6 = ""
        var res7 = ""
        var res8 = ""
        var res9 = ""
        var res10 = ""
        if(networks.includes(56) && (addresses.length > 0))
        {
            console.log("asdf", networks)
            res1 = await Axios.get(bnb_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+bnb_api_key+"&page=1&offset=5")
            res2 = await Axios.get(bnb_api_url+"tokentx&address="+addresses[0]+"&sort=desc&apikey="+bnb_api_key+"&page=1&offset=5")
            
            if(res1)
            {   
                for(let i of res1.data.result)
                {   
                    if(parseFloat(i.value))
                    {
                        await result.push({
                            hash : i.hash,
                            timeStamp : i.timeStamp,
                            tokenDecimal : i.tokenDecimal,
                            value : i.value,
                            from : i.from,
                            to : i.to,
                            gas : i.gas,
                            gasPrice : i.gasPrice,
                            txnType : 3
                        })
                    }
                }
            }

            // bnb tokens list
            if(res2)
            {   
                for(let i of res2.data.result)
                {
                    await result.push({
                        hash : i.hash,
                        timeStamp : i.timeStamp,
                        tokenDecimal : i.tokenDecimal,
                        value : i.value,
                        from : i.from,
                        to : i.to,
                        gas : i.gas,
                        gasPrice : i.gasPrice,
                        tokenSymbol : i.tokenSymbol,
                        txnType : 4
                    })
                }
            }
            
        }
       // https://api.etherscan.io/api?module=account&action=tokentx&address=0x6a08e5c9c11c345313d3071cab8329966084d4a3&page=1&offset=5&sort=desc&apikey=SHWDKJ6CQ59Y29RIX11WVWVUGI1MPI569G
        
        if(networks.includes(1) && (addresses.length > 0))
        {
            res3 = await Axios.get(eth_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+eth_api_key+"&page=1&offset=5")
            res4 = await Axios.get(eth_api_url+"tokentx&address="+addresses[0]+"&page=1&offset=5&sort=desc&apikey="+eth_api_key)
    
            if(res3)
            {   
                for(let i of res3.data.result)
                {   
                    if(parseFloat(i.value))
                    {
                        await result.push({
                            hash : i.hash,
                            timeStamp : i.timeStamp,
                            tokenDecimal : i.tokenDecimal,
                            value : i.value,
                            from : i.from,
                            to : i.to,
                            gas : i.gas,
                            gasPrice : i.gasPrice,
                            txnType : 1
                        })
                    }
                }
            }
     
            // eth tokens list
            if(res4)
            {   
                for(let i of res4.data.result)
                {
                    await result.push({
                        hash : i.hash,
                        timeStamp : i.timeStamp,
                        tokenDecimal : i.tokenDecimal,
                        value : i.value,
                        from : i.from,
                        to : i.to,
                        gas : i.gas,
                        gasPrice : i.gasPrice,
                        tokenSymbol : i.tokenSymbol,
                        txnType : 2
                    })
                }
            }
        }

        if(networks.includes(250) && (addresses.length > 0))
        {
            res5 = await Axios.get(fantom_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+fantom_api_key+"&page=1&offset=5")
            res6 = await Axios.get(fantom_api_url+"tokentx&address="+addresses[0]+"&sort=desc&apikey="+fantom_api_key+"&page=1&offset=5")
            console.log("res5",res6.data.result)
            
            if(res5)
            {   
                for(let i of res5.data.result)
                {   
                    if(parseFloat(i.value))
                    {
                        await result.push({
                            hash : i.hash,
                            timeStamp : i.timeStamp,
                            tokenDecimal : 18,
                            value : i.value,
                            from : i.from,
                            to : i.to,
                            gas : i.gas,
                            gasPrice : i.gasPrice,
                            txnType : 5
                        })
                    }
                }
            }

            if(res6)
            {   
                for(let i of res6.data.result)
                {
                    await result.push({
                        hash : i.hash,
                        timeStamp : i.timeStamp,
                        tokenDecimal : 18,
                        value : i.value,
                        from : i.from,
                        to : i.to,
                        gas : i.gas,
                        gasPrice : i.gasPrice,
                        tokenSymbol : i.tokenSymbol,
                        txnType : 6
                    })
                }
            }
            
        }

        if(networks.includes(137) && (addresses.length > 0))
        {
            console.log("asdf", networks)
            res7 = await Axios.get(polygon_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+polygon_api_key+"&page=1&offset=5")
            res8 = await Axios.get(polygon_api_url+"tokentx&address="+addresses[0]+"&sort=desc&apikey="+polygon_api_key+"&page=1&offset=5")
            
            if(res7)
            {   
                for(let i of res7.data.result)
                {   
                    if(parseFloat(i.value))
                    {
                        await result.push({
                            hash : i.hash,
                            timeStamp : i.timeStamp,
                            tokenDecimal : i.tokenDecimal,
                            value : i.value,
                            from : i.from,
                            to : i.to,
                            gas : i.gas,
                            gasPrice : i.gasPrice,
                            txnType : 7
                        })
                    }
                }
            }

            // bnb tokens list
            if(res8)
            {   
                for(let i of res8.data.result)
                {
                    await result.push({
                        hash : i.hash,
                        timeStamp : i.timeStamp,
                        tokenDecimal : i.tokenDecimal,
                        value : i.value,
                        from : i.from,
                        to : i.to,
                        gas : i.gas,
                        gasPrice : i.gasPrice,
                        tokenSymbol : i.tokenSymbol,
                        txnType : 8
                    })
                }
            }
        }

        // if(networks.includes(43114) && (addresses.length > 0))
        // {
        //     res9 = await Axios.get(avalanche_api_url+"txlist&address="+addresses[0]+"&startblock=0&endblock=99999999&sort=desc&apikey="+avalanche_api_key+"&page=1&offset=5")
        //     res10 = await Axios.get(avalanche_api_url+"tokentx&address="+addresses[0]+"&sort=desc&apikey="+avalanche_api_key+"&page=1&offset=5")
            
        //     if(res9)
        //     {   
        //         for(let i of res9.data.result)
        //         {   
        //             if(parseFloat(i.value))
        //             {
        //                 await result.push({
        //                     hash : i.hash,
        //                     timeStamp : i.timeStamp,
        //                     value : i.value,
        //                     from : i.from,
        //                     to : i.to,
        //                     gas : i.gas,
        //                     gasPrice : i.gasPrice,
        //                     txnType : 9
        //                 })
        //             }
        //         }
        //     }

        //     // bnb tokens list
        //     if(res10)
        //     {   
        //         for(let i of res10.data.result)
        //         {
        //             await result.push({
        //                 hash : i.hash,
        //                 timeStamp : i.timeStamp,
        //                 value : i.value,
        //                 from : i.from,
        //                 to : i.to,
        //                 gas : i.gas,
        //                 gasPrice : i.gasPrice,
        //                 tokenSymbol : i.tokenSymbol,
        //                 txnType : 10
        //             })
        //         }
        //     }
        // }

        await result.sort(function (a, b) {
            return b.timeStamp - a.timeStamp
        })
        await set_loader_status(true) 
        await set_txns_list(result)
    }
  

    return(
        <>
       
         
        <div className="companies_list">
            <div className="padding_div_for_web">
                <div className="row">
                    <div className="col-md-8 col-xl-8 col-lg-8 col-6">
                        {
                            addresses.length > 0 ?
                                <h6 className='portfolio-sub-title active_wallet_address_display ml-4'> Active Wallet Address: <span>{getShortWalletAddress(addresses[0])}</span></h6>
                            :
                                ""
                        }
                    </div>
                    <div className="col-md-4 col-xl-4 col-lg-4 col-6">
                        <div className="dropdown asset_view_dropdown">
                            <button className="dropdown-toggle" type="button" data-toggle="dropdown">
                                {
                                    toggle == true ?
                                    <>
                                    Recent
                                    </>
                                    :
                                    <>All</>
                                }
                                <img src="/assets/img/filter_dropdown.svg" /> 
                            </button>
                            <ul className="dropdown-menu">
                                <li onClick={()=>set_toggle(true)} > <img src="/assets/img/recent_transaction.svg" width="18px" alt="Recent"/> &nbsp; Recent </li>
                                <li  onClick={()=>set_toggle(false)} > <img src="/assets/img/all_transaction.svg" width="18px" alt="All"/>  &nbsp; All </li>
                            </ul>
                        </div>
                    </div>
                </div>
                {
                        toggle == true ?
                <div className='new_page_table profile_page_table '>
                    

                  
                    
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th className="mobile_hide">Sl.No</th>
                                    <th className="date-th">Date</th>
                                    <th className="txn_hash">Hash & Value</th>
                                    <th className="mobile_hide">Type</th>
                                    {/* <th>Value</th> */}
                                    <th className="mobile_hide">Fees</th>
                                    <th className='transfer_col'>Transfer</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                    {
                                    loader_status ?
                                    <>
                                        {
                                        txns_list.length>0?
                                        <>
                                        {
                                        txns_list.map((e, i)=>
                                        <tr>
                                        <td className="mobile_hide">{++i}</td>
                                        <td className='txn-date'>
                                        {moment(e.timeStamp*1000).format("DD MMM YYYY")}
                                        <br/>
                                        {moment(e.timeStamp*1000).format("h:mma")}
                                        <br/>    
                                        {/* {getZeroAppendValues(e.tokenDecimal)} */}
                                        </td>
                                        <td className='hash_value'>

                                        <div className="media">
                                            {
                                                (e.txnType == 1) || (e.txnType == 2) ?
                                                <>
                                                <img className="txn-netwok" src="/assets/img/portfolio/eth.svg" alt="Token" title="Token" />        
                                                </>
                                                :
                                                (e.txnType == 3) || (e.txnType == 4) ?
                                                <>
                                                <img className="txn-netwok" src="/assets/img/portfolio/bsc.svg" alt="Token" title="Token" /> 
                                                </>
                                                    :
                                                (e.txnType == 5) || (e.txnType == 6) ?
                                                <>
                                                <img className="txn-netwok" src="/assets/img/portfolio/ftm.svg" alt="Token" title="Token" />
                                                </>
                                                :
                                                (e.txnType == 7) || (e.txnType == 8) ?
                                                <>
                                                <img className="txn-netwok" src="/assets/img/portfolio/polygon.svg" alt="Token" title="Token" />
                                                </>
                                                :
                                                <>
                                                </>
                                            }

                                                
                                            <div className="media-body align-self-center">
                                                <h5 className="mt-0">
                                                    <a className="txn-hash-link" 
                                                    href={(
                                                        (e.txnType == 1) || (e.txnType == 2) ? 
                                                        "https://etherscan.io/tx/"
                                                        :
                                                        (e.txnType == 3) || (e.txnType == 4) ? 
                                                        "https://bscscan.com/tx/"
                                                        :
                                                        (e.txnType == 5) || (e.txnType == 6) ? 
                                                        "https://ftmscan.com/tx/"
                                                        :
                                                        (e.txnType == 7) || (e.txnType == 8) ? 
                                                        "https://polygonscan.com/tx/"
                                                        :
                                                        ""
                                                        )+e.hash
                                                        } 
                                                    target="_blank">
                                                    {getShortWalletAddress(e.hash)}
                                                    </a>
                                                </h5>
                                                <p className='txn-value'> {parseFloat((e.value/getZeroAppendValues(e.tokenDecimal)).toFixed(4))}&nbsp;
                                            {
                                                e.txnType == 1 ?
                                                <>
                                                ETH              
                                                </>
                                                :
                                                e.txnType == 2 ?
                                                <>
                                                {e.tokenSymbol}
                                                </>
                                                :
                                                e.txnType == 3 ?
                                                <>
                                                BNB
                                                </>
                                                :
                                                e.txnType == 4 ?
                                                <>
                                                {e.tokenSymbol}
                                                </>
                                                :
                                                e.txnType == 5 ?
                                                <>
                                                MATIC
                                                </>
                                                :
                                                e.txnType == 6 ?
                                                <>
                                                {e.tokenSymbol}
                                                </>
                                                :
                                                e.txnType == 7 ?
                                                <>
                                                FTM
                                                </>
                                                :
                                                e.txnType == 8 ?
                                                <>
                                                {e.tokenSymbol}
                                                </>
                                                :
                                                <>
                                                </>
                                            }
                                            </p>
                                            </div>
                                        </div>

                                           
                                               
                                        </td>
                                        <td className="txns-network-type mobile_hide">
                                            {
                                                (e.txnType == 1) || (e.txnType == 2) ?
                                                <>
                                                 {e.txnType == 1 ? "ETH":"ERC-20"}       
                                                </>
                                                :
                                                (e.txnType == 3) || (e.txnType == 4) ?
                                                <>
                                                 {e.txnType == 3 ? "BNB":"BEP-20"}
                                                </>
                                                 :
                                                (e.txnType == 5) || (e.txnType == 6) ?
                                                <>
                                                 {e.txnType == 3 ? "FTM":"ERC-20"}
                                                </>
                                                :
                                                (e.txnType == 7) || (e.txnType == 8) ?
                                                <>
                                                {e.txnType == 3 ? "Matic":"ERC-20"}
                                                </>
                                                :
                                                <>
                                                </>
                                            }
                                        </td>  

                                    
                                        <td className="txns-network-type mobile_hide">
                                        {roundNumericValue(e.gas*e.gasPrice/1000000000000000000)}
                                        </td>
                                        <td className='transfer_col'>
                                            <div className='media'>
                                        <div className="media-body" >
                                        {
                                            e.from == e.to ?
                                            <div className='txn-self-span'>Self</div>
                                            :
                                            e.from == addresses[0] ?
                                            
                                            <div className='txn-out-span'>Out</div>
                                            
                                            :
                                            e.to == addresses[0] ?
                                            <div className='txn-in-span'>In</div>
                                            :
                                            ""
                                        }
                                        </div>
                                        <div className='media-right align-self-center'>
                                        <img src="/assets/img/view-arrow.png" alt="info" className='info_icon_trans' onClick={()=>getTokenDetail(e)} />
                                        </div>
                                        </div>
                                            
                                        </td>
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
                :
                <>
               
                
                <All_transactions networks={networks} addresses={addresses}/>
                </>

            }
            </div>
        </div>


        <div className="remove_wallet_modal token-details-popup">
            <div className={"modal "+(transaction_details_modal_status ? " modal-show":"")} style={transaction_details_modal_status?{display:'block'}:{display:"none"}}>
                <div className="modal-dialog " >
                    <div className="modal-content">
                        <div className="modal-body">
                            <div className='transaction_detail_modal'><h4>Transaction Details<span><button type="button" className="close close_wallet" onClick={()=> set_transaction_details_modal_status(false)} data-dismiss="modal"><img src="https://image.coinpedia.org/wp-content/uploads/2023/03/17184522/close_icon.svg" alt="close" /></button></span></h4></div>
                            {
                                transaction_detail ?
                                <TransactionDetail transaction={transaction_detail} />
                                :
                                ""
                            }
                            
                        </div>
                    </div>
                </div>
            </div> 
        </div>
        </>
   )
}