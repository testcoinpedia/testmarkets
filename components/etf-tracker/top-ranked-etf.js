import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Slider from 'react-slick';
import Axios from 'axios'  ;
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../constants'; 



export default function TopRankedEtf({ overview_list}) 
{
 
  const [total_marketcap, set_total_marketcap] = useState(0);
  const [total_volume, set_total_volume] = useState(0);
  const [highest_pecentage, set_highest_pecentage] = useState("");
  const [loader_status, set_loader_status] = useState(true)
  const { userData, active_currency } = useSelector(state => state)


  const  getMarketCapNVolume = async (pass_data) =>
  {   
    const pass_total_marketcap = await pass_data.reduce((total, etf) => total + (etf.market_cap || 0), 0);
    const pass_total_volume = await pass_data.reduce((total, etf) => total + (etf.volume * etf.price || 0), 0);
    set_total_marketcap(pass_total_marketcap)
    set_total_volume(pass_total_volume)
  }

  


  useEffect(() =>  
  { 
    getMarketCapNVolume(overview_list)
  }, [])



  const convertCurrency = (token_price) => {
      if (token_price) {
          if (active_currency.currency_value) {
              return active_currency.currency_symbol + " " + roundNumericValue(token_price * active_currency.currency_value);
          } else {
              return roundNumericValue(token_price);
          }
      } else {
          return '-';
      }
  }


    return(   
<>
          <div className='overview_etf_trackers'>
        <div className='markets_overview_mobile etf_overview_box'>
            <div className='market-overview'>
                <h5 className='overview-title'>
                  <img src="/assets/img/etf_top_ranked.svg" alt="Top Ranked" className="market_overview_icon" /> 
                  Top Ranked ETFs by Volume
                    
                </h5>

                <table className="market_overview_table">
                <tbody>
                  {
                       overview_list.length > 0
                       ?
                       overview_list.slice(0, 3).map((e, i) => 
                       <tr key={i}>
                          <td>
                            
                                <h6 className="media-heading token-name">{e.etf_name} </h6>
                              
                          </td>
                          <td>
                            
                              <h6 className="media-heading token-name text-right">{e.volume_usd ? convertCurrency(e.volume_usd): "-"}</h6>
                            
                          </td>
                        </tr>
                        ) 
                        :
                       ""
                      }
                    </tbody>
                </table>
              </div>
              </div>
              </div>
                </>
    )
}

