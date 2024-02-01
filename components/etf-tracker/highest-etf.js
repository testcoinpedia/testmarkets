import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Slider from 'react-slick';
import Axios from 'axios'  ;
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../constants'; 



export default function HighestEtf({ overview_list}) 
{
 
 
  const [highest_pecentage, set_highest_pecentage] = useState(""); 
  const { userData, active_currency } = useSelector(state => state)


  const  getMarketCapNVolume = async (pass_data) =>
  {   
    const pass_highest_pecentage = await highestPercentagChange(pass_data)
    // set_total_marketcap(pass_total_marketcap)
    // set_total_volume(pass_total_volume)
    set_highest_pecentage(pass_highest_pecentage)
  }

  const highestPercentagChange = (pass_data) =>
  { 
    
    return pass_data.reduce((maxETF, currentETF) => 
    { 
      if(currentETF.price_change)
      {
        return currentETF.price_change > (maxETF ? maxETF.price_change : -Infinity) ? currentETF : maxETF;
      }
        
    }, null)
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
                  <img src="/assets/img/money_raised.svg" alt="Highest PRice" className="market_overview_icon" /> 
                  Highest Price change in the Last 1 Hour
                  
                  {/* <span className='category'> {convertCurrency(totalVolume)}</span> */}
                    
                </h5>

                <table className="market_overview_table">
                {highest_pecentage && (
                  <tbody>
                        <tr>
                          <td>
                            <h6 className="media-heading token-name"> Ticker</h6>
                          </td>
                          <td>
                            <h6 className="media-heading token-name text-right"> {highest_pecentage.etf_symbol}</h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="media-heading token-name">Price</h6>
                          </td>
                          <td>
                            <h6 className="media-heading token-name text-right">{convertCurrency(highest_pecentage.price)}</h6>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="media-heading token-name">Price Change</h6>
                          </td>
                          <td>
                            {
                              highest_pecentage.price_change?highest_pecentage.price_change>0?
                              <h6 className="values_growth text-right"><span className="green"><img src="/assets/img/markets/high.png" alt="high price"/>{highest_pecentage.price_change.toFixed(2)}%</span></h6>
                              :
                              <h6 className="values_growth text-right"><span className="red"><img src="/assets/img/markets/low.png" alt="low price"/>{(highest_pecentage.price_change.toFixed(2)).replace('-', '')+"%"}</span></h6>
                              :
                              "--"
                            }
                          </td>
                        </tr>
                  </tbody>
                   )}
                </table>
                </div>
                </div>
           
           
            
               
                
                </div>
                </>
    )
}

