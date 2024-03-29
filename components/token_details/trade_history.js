import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'  
import moment from 'moment'

import { useSelector, useDispatch } from 'react-redux'
import { API_BASE_URL, config, roundNumericValue, getShortWalletAddress, separator, graphqlApiKEY, app_coinpedia_url, IMAGE_BASE_URL } from '../constants'
import { tokenBasic, otherDetails, getVolume24h, getHighLow24h } from '../search_contract_address/live_price'
import { getLiquidityAddresses, getBalanceAddresses, tradeHistory } from './liquidity/queries'
import TableContentLoader from '../loaders/tableLoader'
import InfiniteScroll from "react-infinite-scroll-component";


export default function Exchange({reqData})
{   
   
    const {contracts_array, token_symbol, token_price} = reqData

    const [liquidity_pools, set_liquidity_pools] = useState([])
    const [token_basic, set_token_basic] = useState({})
    const [api_loader_status, set_api_loader_status] = useState(true)
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [contract_copy_status, set_contract_copy_status] = useState(false)
    const [has_more, set_has_more] = useState(true)
    const [trade_history_list, set_trade_history_list] = useState([])
    const [loader_status, set_loader_status] = useState(false)
    const [current_page, set_current_page] = useState(0)
    const [sort_type, set_sort_type] = useState(1)
    const [per_page] = useState(40)

    
    //console.log("reqData", reqData)
    
    const EndMessage = () => 
    {
        if(trade_history_list.length > per_page) {
          return (
            <div className="col-md-12">
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            </div>
          )
        } 
        else 
        {
          return <div></div>
        }
    }

    const SpinnerLoader = () => 
    {
        set_api_loader_status(true)
    }
    
    const active_currency = useSelector(state => state.active_currency)

    const convertCurrency = (token_price) =>
    {
      if(active_currency.currency_value)
      {
        return active_currency.currency_symbol+" "+roundNumericValue(token_price*(active_currency.currency_value))
      }
      else
      {
        return roundNumericValue(token_price)
      }
    }

    useEffect(() => 
    {   
        if(contracts_array[0])
        {
            //console.log("contracts_array", contracts_array[0])
            getTradeHistory(true)
        }
    }, [sort_type])
    
    const getTradeHistory = async (update_type) =>
    {   
        // console.log("update_type", update_type)
        if(has_more)
        {
            await set_api_loader_status(true)
            var present_current_page = current_page
            if(update_type != true)
            {
                var present_page_count = current_page + per_page
                await set_current_page(present_page_count)
            }
            else
            {   
                var present_current_page = 0
                await set_current_page(per_page)
            }
            
            const res_query = await tradeHistory({sort_type:sort_type, network_type:contracts_array[0].network_row_id, liquidity_address:contracts_array[0].contract_address, limit:per_page, offset:present_current_page ? current_page:0})
           // console.log("tradeHistory", res_query)
            if(res_query)
            {   
                await set_api_loader_status(false)
                
                if(res_query.status)
                {
                    if(res_query.message.length)
                    {   
                        if(!trade_history_list.length)
                        {
                            const start_n_end_time = await getNext24hrsTime(res_query.message[0].block.timestamp.time)
                        }
                        if(update_type != true)
                        {
                            await set_trade_history_list(trade_history_list.concat(res_query.message))
                        }
                        else
                        {   
                            await set_trade_history_list(res_query.message)
                        }
                    }
                    else
                    {
                        await set_has_more(false) 
                    }
                }
                else
                {   
                    await set_api_loader_status(false)
                    await set_has_more(false) 
                }
            }
        }
        else
        {
            await set_api_loader_status(false)
        }
    }

    const getNext24hrsTime = (pass_time) =>
    {
      const start_time = moment(pass_time).format('YYYY-MM-DDTHH:mm:ss')
      const next_day_time = new Date(new Date(start_time).getTime() + (24 * 60 * 60 * 1000))
      const end_time = moment(next_day_time).format('YYYY-MM-DDTHH:mm:ss')
      return { start_time, end_time }
      //console.log("nDate",)
    }

    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };

    const [isMobileView, setIsMobileView] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 767);
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [])

   
    
  return(
    <div className='market_page_data  trade-history '>
        {/* <h6>Trade History</h6> */}
        <div className='traders_tab_title'>
        <div className="row mb-2">
        <div className="col-md-7" >
            {/* <h6>Trade History List</h6> */}
        </div>
        <div className="col-md-5 trade_filter col-offset-8">
            <span>Sort By: &nbsp;</span>
       
        <div >
                <div className='dex_filter mb-3'>
            <div class="dropdown">
                <button className="dex_filter_button dropdown-toggle"  type="button" id="dropdownSortBy" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                {
                  sort_type == 1 ?
                  "Recent trades"
                  :
                  sort_type == 2 ?
                  "High amount"
                  :
                  sort_type == 3 ?
                  "Low amount"
                  :
                  sort_type == 4 ?
                  "Date and time"
                  :
                  ""
                } <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" class="dropdown_arrow_img" />
                </button>
                <div  className={`dropdown_block badge_dropdown_block dropdown-menu ${isOpen ? 'closed' : 'open'}`}
                    aria-labelledby="dropdownSortBy">
                <ul >
                    <li className="dropdown-item" value={1} onClick={(e)=>set_sort_type(1)}>Recent trades</li>
                    <li className="dropdown-item" value={2} onClick={(e)=>set_sort_type(2)}>High amount</li>
                    <li className="dropdown-item" value={3} onClick={(e)=>set_sort_type(3)}>Low amount</li>
                    <li className="dropdown-item" value={4} onClick={(e)=>set_sort_type(4)}>Date and time</li>
                </ul>
                </div>
                </div>
            {/* <select className="form-control" onChange={(e)=>set_sort_type(e.target.value)}>
                <option value={1} selected={sort_type == 1}>Recent trades</option>
                <option value={2} selected={sort_type == 2}>High amount </option>
                <option value={3} selected={sort_type == 3}>Low amount </option>
                <option value={4} selected={sort_type == 4}>Date and time </option>
            </select> */}
        </div>
        </div>
        </div>
        </div>
        </div>


      

{!isMobileView ? (
      <div id="scrollableDiv" className='trade-scroll' >
      <InfiniteScroll
                  dataLength={trade_history_list.length}
                  style={{ overflow: "unset" }}
                  next={getTradeHistory}
                  hasMore={has_more}
                  loader={<SpinnerLoader />}
                  endMessage={<EndMessage />}
                  scrollableTarget="scrollableDiv"
              >
                <div className="table-responsive">
                    <table className="table table-borderless">
                        <thead>
                            <tr>
                                {/* <th>#</th> */}
                                <th>Date&nbsp;&&nbsp;Time</th>
                                <th>Type</th>
                                <th>Price</th>
                                <th>Total</th>
                                <th className="mobile_hide">Amount {token_symbol} </th>
                                <th className="total_balance portfolio_mobile_right">Maker</th>
                                <th className="mobile_hide">Txns</th>
                            </tr>
                        </thead>
                        <tbody>
                            {   

                                trade_history_list.length ?
                                trade_history_list.map((innerItem, i) =>
                                   <>
                                    {
                                       (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                        roundNumericValue(innerItem.buyAmountUSD / innerItem.sellAmount) > 0 ?
                                        <tr>
                                                {/* <td>{1+i}</td> */}
                                                <td>
                                                    {moment(innerItem.block.timestamp.time).format('MMM D YYYY')}
                                                    <br/>
                                                    {moment(innerItem.block.timestamp.time).format('h:mma')}
                                                </td>
                                                <td>
                                                    {
                                                        (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                        <span className='green'>
                                                        Buy
                                                        </span>
                                                        :
                                                        <span className='red'>
                                                        Sell
                                                        </span>
                                                    } 
                                                </td>
                                                <td>
                                                    {
                                                        (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                        <>
                                                        {
                                                            convertCurrency(innerItem.buyAmountUSD / innerItem.sellAmount)
                                                        }
                                                        </>
                                                        :
                                                        <>
                                                        {
                                                            convertCurrency(innerItem.sellAmountUSD / innerItem.buyAmount)
                                                        }
                                                        </>
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                        <>
                                                        {
                                                            convertCurrency((innerItem.buyAmountUSD / innerItem.sellAmount)*innerItem.sellAmount)
                                                        }
                                                        </>
                                                        :
                                                        <>
                                                        {
                                                            convertCurrency((innerItem.sellAmountUSD / innerItem.buyAmount)*innerItem.buyAmount)
                                                        }
                                                        </>
                                                    } 
                                                </td>

                                                <td>
                                                    {
                                                        (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                        <span>
                                                        {separator((innerItem.sellAmount).toFixed(2))}
                                                        </span>
                                                        :
                                                        <span>
                                                        {separator((innerItem.buyAmount).toFixed(2))}
                                                        </span>
                                                    } 
                                                </td>
                                                
                                                <td><a className ="maker-link" href={(contracts_array[0].network_row_id == 6 ? "https://etherscan.io/address/":"https://bscscan.com/address/")+innerItem.transaction.txFrom.address}  target='_blank'>{getShortWalletAddress(innerItem.transaction.txFrom.address)}</a></td>
                                                <td><a href={(contracts_array[0]?.network_row_id == 6 ? "https://etherscan.io/tx/":"https://bscscan.com/tx/")+innerItem.transaction.hash} target='_blank' className="badge badge-secondary">Txn</a></td> 
                                            </tr>
                                            :
                                            ""
                                        :
                                        roundNumericValue(innerItem.sellAmountUSD / innerItem.buyAmount) > 0 ?
                                        <tr>
                                            {/* <td>{1+i}</td> */}
                                            <td>
                                                {moment(innerItem.block.timestamp.time).format('MMM D YYYY')}
                                                <br/>
                                                {moment(innerItem.block.timestamp.time).format('h:mma')}
                                            </td>

                                            <td>
                                                {
                                                    (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                    <span className='green'>
                                                    Buy
                                                    </span>
                                                    :
                                                    <span className='red'>
                                                    Sell
                                                    </span>
                                                } 
                                            </td>

                                            <td>
                                                {
                                                    (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                    <>
                                                    {
                                                        convertCurrency(innerItem.buyAmountUSD / innerItem.sellAmount)
                                                    }
                                                    </>
                                                    :
                                                    <>
                                                    {
                                                        convertCurrency(innerItem.sellAmountUSD / innerItem.buyAmount)
                                                    }
                                                    </>
                                                }
                                            </td>

                                            <td>
                                                {
                                                    (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                    <>
                                                    {
                                                        convertCurrency((innerItem.buyAmountUSD / innerItem.sellAmount)*innerItem.sellAmount)
                                                    }
                                                    </>
                                                    :
                                                    <>
                                                    {
                                                        convertCurrency((innerItem.sellAmountUSD / innerItem.buyAmount)*innerItem.buyAmount)
                                                    }
                                                    </>
                                                } 
                                            </td>

                                            <td>
                                                {
                                                    (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                    <span>
                                                    {separator((innerItem.sellAmount).toFixed(2))}
                                                    </span>
                                                    :
                                                    <span>
                                                    {separator((innerItem.buyAmount).toFixed(2))}
                                                    </span>
                                                } 
                                            </td>
                                            
                                            <td><a className ="maker-link" href={(contracts_array[0].network_row_id == 6 ? "https://etherscan.io/address/":"https://bscscan.com/address/")+innerItem.transaction.txFrom.address}  target='_blank'>{getShortWalletAddress(innerItem.transaction.txFrom.address)}</a></td>
                                            <td><a href={(contracts_array[0]?.network_row_id == 6 ? "https://etherscan.io/tx/":"https://bscscan.com/tx/")+innerItem.transaction.hash} target='_blank' className="badge badge-secondary">Txn</a></td> 
                                        </tr>
                                        :
                                        ""
                                    }
                                   </>
                                )
                                :
                                ""
                            }
                            
                            {
                                api_loader_status ?
                                <TableContentLoader row="5" col="6" /> 
                                :
                                !trade_history_list.length ?
                                <tr>
                                    <td colSpan={6} className='text-center'>No related data found.</td>
                                </tr>
                                :
                                ""
                            }
                        </tbody>
                    </table>
                </div>
                 </InfiniteScroll>  
                 </div>
 ) : (
    <>
     <div className='tables_mobile_view'>
    <div className='table_header_res'>
                                   <div className='row'>
                                       <div className='col-6 text-left'>
                                           <h5>Date & Type</h5>
                                       </div>
                                       <div className='col-6 text-right'>
                                       
                                       <h5>Price & TXCN</h5>
                                           </div>
                                           {/* <div className='col-4'>
                                           <h5>Volume %</h5>
                                           <h5>Trust Score</h5>
                                           </div> */}
                                   </div>
                                   </div>
                                   {   

trade_history_list.length ?
trade_history_list.map((innerItem, i) =>
<div className='table_header_res'>
                                   <div className='row'>
                    <div className='col-6 text-left'>
                        <h6 className='exchange_main_text'>{moment(innerItem.block.timestamp.time).format('MMM D YYYY')} {moment(innerItem.block.timestamp.time).format('h:mma')}</h6>
                        <h6>                            
                        {
                                                        (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                        <span className='green'>
                                                        Buy
                                                        </span>
                                                        :
                                                        <span className='red'>
                                                        Sell
                                                        </span>
                                                    } </h6>
                    </div>
                    <div className='col-6 text-right'>
                    <h6 className='exchange_main_text'>{
                                                        (innerItem.sellCurrency.address).toLowerCase() == (contracts_array[0].contract_address).toLowerCase()  ?
                                                        <>
                                                        {
                                                            convertCurrency(innerItem.buyAmountUSD / innerItem.sellAmount)
                                                        }
                                                        </>
                                                        :
                                                        <>
                                                        {
                                                            convertCurrency(innerItem.sellAmountUSD / innerItem.buyAmount)
                                                        }
                                                        </>
                                                    }</h6>
                    <h6>
                        <a className ="maker-link" href={(contracts_array[0].network_row_id == 6 ? "https://etherscan.io/address/":"https://bscscan.com/address/")+innerItem.transaction.txFrom.address} 
                         target='_blank'>
                        {getShortWalletAddress(innerItem.transaction.txFrom.address)}</a></h6>
                        </div>
                        
                </div>
                </div>
                 )
                 :
                 ""
             }

{
                                api_loader_status ?
                                <TableContentLoader row="5" col="6" /> 
                                :
                                !trade_history_list.length ?
                                <tr>
                                    <td colSpan={6} className='text-center'>No related data found.</td>
                                </tr>
                                :
                                ""
                            }
                                   </div>
                                  
    </>
 )}

               
        
    </div>            
   )
}
