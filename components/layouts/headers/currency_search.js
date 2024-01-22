import React, { useState, useEffect } from 'react'
import Axios from 'axios'
import Web3 from 'web3'
import JsCookie from "js-cookie"
import { createFilter } from "react-search-input"
import { useSelector, useDispatch } from 'react-redux'
import { API_BASE_URL, events_coinpedia_url, app_coinpedia_url, market_coinpedia_url, coinpedia_url, Logout, separator, logo, config, api_url, cookieDomainExtension, IMAGE_BASE_URL, roundNumericValue, convertvalue } from '../../constants'

export default function LoginPopupmodal({reqData}) 
{     
    // console.log("reqData", reqData)
    // console.log("currency_list", reqData.currency_list)
    
    const dispatch = useDispatch()
    const userData = useSelector(state => state.userData)

    const [showmodal, setShowModal] = useState(reqData.status)
    const [search_currency, set_search_currency] = useState("") 
    const [country_currencies, set_country_currencies] = useState(reqData.currency_list ? reqData.currency_list:[]) 
    const [country_currencies_filters_list, set_country_currencies_filters_list] = useState(reqData.currency_list ? reqData.currency_list:[]) 
    const [country_currency, set_country_currency] = useState({country_flag:"us.png",currency_code:"USD", currency_value:1, _id: 32, currency_name:"", currency_symbol:"$"}) 
    const [api_loader_status, set_api_loader_status] = useState(false) 
    const active_currency = useSelector(state => state.active_currency)
    useEffect(() => 
    {
      //getCountryCurriencies()
    }, [])

    // const getCountryCurriencies = async () => 
    // {
    //   const res = await Axios.get(API_BASE_URL + "markets/cryptocurrency/country_currencies", config(""))
    //   if(res.data) 
    //   {
    //     set_api_loader_status(true)
    //     set_country_currencies(res.data.message)
    //     set_country_currencies_filters_list(res.data.message)
    //     console.log("country_currencies", res)
    //   }
    // }
 

  const selectCurrency = async (pass_item) =>
  {
    setShowModal(false)
    set_country_currency(pass_item)
    const stringify_item = await JSON.stringify(pass_item)
    JsCookie.set('active_currency', stringify_item , { domain: cookieDomainExtension })

    dispatch({
      type: 'currencyConverter', data: pass_item
    })
  }

  const clearCurrencySearch = async (e) =>
  {
    await e.stopPropagation()
    await set_search_currency("")
    await set_country_currencies(country_currencies_filters_list);
  }



  const searchCurrency = (pass_value) => 
  {
      set_search_currency(pass_value)
      if(pass_value) 
      {
        var searched_list = country_currencies_filters_list.filter(
          createFilter(pass_value, ["currency_code", "currency_name"])
        )
        set_country_currencies(searched_list)
      }
      else 
      {
        set_country_currencies(country_currencies_filters_list);
      }
  }

  

  
    return (
        <div className="markets_modal currency_modal">
            <div className={'modal modal-create-acc'} style={showmodal ? { display: 'block' } : { display: 'none' }}>
                <div className="modal-dialog  modal-dialog-zoom event-login-popup">
                    <div className="modal-content modal_registration_success modal-create-acc">
                      <div className="modal-body">
                      <button type="button" className="close country_currencies" onClick={() => setShowModal(false)}>
                          <img src="/assets/img/pop-cancel.svg" alt="pop-cancel" title="pop-cancel" className="close-popup" />
                      </button>
                      <div className="">
                          <div className="">
                              <div className="create_account">
                                  <div className="login_account_body pb-0 Currency_popup">
                                      <h4 className="title">Select Currency</h4>
                                      <div  className="country-currency-menu">
                 
                                            <div className="input-group search_input">
                                            <input
                                              value={search_currency}
                                              onChange={(e) => searchCurrency(e.target.value)}
                                              type="text"
                                              className="form-control"
                                              placeholder="Search"
                                            />
                                            {search_currency && ( 
                                              <div className="input-group-append">
                                                <span className="input-group-text" onClick={(e) => clearCurrencySearch(e)}>
                                                  <img className="close-image" src="/assets/img/close.png" alt="search-box" />
                                                </span>
                                              </div>
                                            )}
                                          </div>

                                          {/* <p className='searchbox_titles'>Trending <img className='flame' src="/assets/img/treanding_flame.png" alt="trending" /></p> */}
                                            
                                          
                                          {/* className={(active_currency._id==item._id ? "selected":"")} */}
                                            {
                                                country_currencies.length ?
                                                <ul className="country-currency-ul">
                                                  {
                                                     country_currencies.map((item, i) =>
                                                     <li onClick={(e) => selectCurrency(item)} key={"currency"+i} className={(active_currency._id==item._id ? "selected":"")} > 
                                                       <div className="media">
                                                         <div className="media-left align-self-center">
                                                           <img className='curreny_flag_popup' src={"/assets/img/flags/"+item.country_flag}  alt="UserIcon" />
                                                         </div>
                                                         <div className="media-body ">
                                                           <h6>{item.currency_name}</h6>
                                                           <p>{item.currency_code} - {item.currency_symbol}</p>
                                                         </div>
                                                       </div>
                                                     </li>
                                                     )
                                                  }
                                                </ul>
                                                :
                                                <ul>
                                                  <li style={{padding:"10px 5px"}}>
                                                    No result found for - <strong>{search_currency}</strong>
                                                  </li>
                                                </ul>
                                            }
                                          
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
        
    )
}