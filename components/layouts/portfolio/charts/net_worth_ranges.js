import React , {useState, useEffect,useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'
import dynamic from 'next/dynamic';
import { useSelector, useDispatch } from 'react-redux'
import { createChart, ColorType } from 'lightweight-charts'
import { roundNumericValue, separator } from '../../../constants' 
import Net_worth from './net_worth' 

export default function Tokenchart({reqData}) 
{   
    // console.log("reqData", reqData)
    const chartContainerRef = useRef("")
    const [worth_chart_type, set_worth_chart_type] = useState(1)
    const [show_message_status, set_show_message_status] = useState(false)
    const [is_mobile_view, set_is_mobile_view] = useState(false)
    const [line_graph_values, set_line_graph_values] = useState([])
    const [line_graph_base_price, set_line_graph_base_price] = useState(0)
    const active_currency = useSelector(state => state.active_currency)
    const { net_worth_status, net_worth_price, change_24h, line_graph_values_1d, line_graph_base_price_1d, line_graph_values_7d, line_graph_base_price_7d } = reqData
    
    const convertCurrency = (token_price) =>
    {
      if(active_currency.currency_value)
      {
        return active_currency.currency_symbol+" "+roundNumericValue(token_price*(active_currency.currency_value))
      }
      else
      {
        return "$ "+roundNumericValue(token_price)
      }
    }

    useEffect(() => 
    {  
        setChartWorth(1)
    }, [])
    
    const setChartWorth = async (pass_type) =>
    {   
        await set_worth_chart_type(0)
        await set_line_graph_values([])
        if(pass_type == 1)
        {
            await set_line_graph_values(line_graph_values_1d)
            await set_line_graph_base_price(line_graph_base_price_1d)
        }
        else
        {
            await set_line_graph_values(line_graph_values_7d)
            await set_line_graph_base_price(line_graph_base_price_7d)
        }
        await set_worth_chart_type(pass_type)
    }

    // function toTimeZone(time) {
    //     var format = 'YYYY/MM/DD HH:mm:ss ZZ';
    //     return moment(time).format(format);
    // }

    return (
        <>
        <div className='row'>
            {
                net_worth_status ?
                <div className='col-6 col-md-6 col-sm-6'>
                    <h6 className='portfolio-sub-title mb-4'>
                    <span className="net_worth_title">Net Worth:</span>
                    <span className="net_worth_value">
                        { net_worth_price ? convertCurrency(net_worth_price, 1) : 0.00}
                        {
                        change_24h > 0 ?
                            <span className="portfolio_growth growth_up">

                            <img src="/assets/img/growth_up.svg" alt="Growth Up" /> +{change_24h}%

                            </span>
                            :
                            change_24h < 0 ?
                            <span className="portfolio_growth growth_down">
                                <img src="/assets/img/growth_down.svg" alt="Growth Down" /> {change_24h}%

                            </span>
                            :
                            ""
                        }
                    </span>
                    {
        net_worth_price>0?
    <div>
        

      {worth_chart_type === 1 ? (
      
        <small className=''>
            
            Last 1 Day net worth based on present token holdings.</small>
      ) : worth_chart_type === 2 ? (
        <small className=''>Last 1 Week net worth based on present token holdings.</small>
      ) : null}

 
    </div>
   
        :
        ""
}
                    </h6>
                   
                    {/* <p className='net_worth_title'>Last 1day and 1 Week net worth based on present token holdings</p> */}
                </div>
                
                :
                <div className='col-6 col-md-6 col-sm-6'>
                    
                </div>
            }
            
            
            
            <div className='col-6'>
                <div className="asset_view_tab">
                    {
                        net_worth_price>0?
                        <div>
                            <ul className="nav nav-tabs">
                    
                    <li className="nav-item" key={"asd"}>
                    <a className={"nav-link " + (worth_chart_type == 1 ? "active" : "")} onClick={() => setChartWorth(1)}>
                        <span>1 Day</span>
                    </a>
                    </li>
                    <li className="nav-item" key={"adsf"}>
                    <a className={"nav-link " + (worth_chart_type == 2 ? "active" : "")} onClick={() => setChartWorth(2)}>
                        <span>1 Week</span>
                    </a>
                    </li>
                </ul>
                            </div>
                            :
                            ""
                    }
                
             </div>
            </div>
          
        </div>
        {
        net_worth_price>0?
    <div>
        {/* <div className='row px-3'>
        <div>
      {worth_chart_type === 1 ? (
      
        <p className='net_worth_title'>
            
            Last 1 Day net worth based on present token holdings.</p>
      ) : worth_chart_type === 2 ? (
        <p className='net_worth_title'>Last 1 Week net worth based on present token holdings.</p>
      ) : null}

    </div>
    </div> */}
        </div>
        :
        ""
}

            {
                worth_chart_type && line_graph_values.length && net_worth_price?
                <Net_worth
                    reqData={{
                        line_graph_values,
                        line_graph_base_price
                    }}
                />
                :
                <div className='text-center py-5 my-5'>
    <h6 >Chart is empty </h6>
    <p>No data available to display.</p>
  </div>
            }
           
        </>
    );

}