/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import moment from 'moment'
import dynamic from 'next/dynamic' 
import { USDFormatValue, roundNumericValue, getNetworkImageNameByID, getNetworkNameByID, getValueShortForm, setActiveNetworksArray, getShortAddress,fetchAPIQuery,makeJobSchema,graphqlBasicTokenData,graphqlPricingTokenData, getSevenDaysValues} from '../../../components/config/helper'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })


export default function TokenDetail({token}) 
{   
    const [line_graph_values, set_line_graph_values] = useState([])
    const [line_graph_days, set_line_graph_days] = useState([])

   
    

    useEffect( async ()=>
    {
      const past7Days = [...Array(8).keys()].map(index => {
            const date = new Date();
              date.setDate(date.getDate() - index)
              return moment(date).format("DD MMM")
          })
      const last_seven_days = past7Days.reverse()
      set_line_graph_days(last_seven_days)
      if(token.sparkline_in_7d)
      {
         set_line_graph_values(await getSevenDaysValues(token.sparkline_in_7d, token.balance))
      }
      
    },[])

    const line_chart_series = [{
        name: "Asset Worth",
        data: line_graph_values
    }]
  
    const line_chart_options = {
        chart: {
          height: 350,
          // type: 'area',
          zoom: {
            enabled: false
          }
        },
        fill: {
          type: 'gradient',
        },
        colors: ['#ffc134'],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        yaxis: {
          labels: {
            formatter: function (y) {
              return "$"+roundNumericValue(y);
            }
          }
        },
        // title: {
        //   text: 'Product Trends by Month',
        //   align: 'left'
        // },
        grid: {
          row: {
            // colors: ['#f3f3f3', 'transparent'], 
            opacity: 0.5
          },
        },
        xaxis: {
          categories: line_graph_days,
        }
      }

    return(
    <>
      {/* <h6>Portfolio</h6> */}

        <div className="media">
          <div className="media-left">
            <img title={token.name} src={token.image} onError={(e)=>{e.target.onerror = null; e.target.src=(token.network == 56 ? "/assets/img/portfolio/bsc.svg":token.network == 250 ? "/assets/img/portfolio/ftm.svg":token.network == 137 ? "/assets/img/portfolio/polygon.svg":token.network == 43114 ? "/assets/img/portfolio/avax.svg":"/assets/img/portfolio/eth.svg")}}  className="media-object" />
          </div>
          <div className="media-body">
            <h4 className="media-heading">{token.symbol}</h4>
            <p>{token.name}</p>
          </div>
        </div>

        {/* <p className='mb-3'>
          <img className="rounded-circle" title={token.name} src={token.image} 
            onError={(e)=>{e.target.onerror = null; e.target.src=(token.network == 56 ? "/assets/img/portfolio/bsc.svg":token.network == 250 ? "/assets/img/portfolio/ftm.svg":token.network == 137 ?
                      "/assets/img/portfolio/polygon.svg":token.network == 43114 ? "/assets/img/portfolio/avax.svg":"/assets/img/portfolio/eth.svg")}} alt="Token"   style={{width:"35px"}}/>
          <span style={{fontSize:"21px"}}> {token.symbol} </span><span>{token.name}</span>
        </p> */}
        <div className="token-details-balance">
          <p>Your Token Balance</p>
          <h5>{(token.price) ? 
          <>
            { USDFormatValue(token.price*token.balance, 1) } 
            
            {
                token.change_24h ? 
                <>
                    {
                    token.change_24h > 0 ?
                    <span className="growth_up">
                      <span>
                        <img src="/assets/img/growth_up.svg" />
                         &nbsp;{USDFormatValue(((token.price*token.balance*token.change_24h)/100), 1)} </span>
                    </span>
                    :
                    <span className="growth_down">
                      <span>
                        <img src="/assets/img/growth_down.svg" />
                        &nbsp;{(((token.price*token.balance*token.change_24h)/100).toFixed(2)).replace('-', "-$")}  </span>
                    </span>
                    }
                </>
                :
                "-"
              }
            </> 
            : 
            "-"
          }
          </h5>
          
          <h6>
            { USDFormatValue(token.balance, 0)} {token.symbol}
            
          </h6>
          
        </div>

        <table className='table token-details-table'>
          <tbody>
            <tr>
              <td><label className='token-type-name'>Live Price</label></td>
              <td className='token-value-details'>{USDFormatValue(token.price, 1)}&nbsp;
                {
                  token.change_24h ? 
                  <>
                      {
                      token.change_24h > 0 ?
                      <span className='green'>{(token.change_24h).toFixed(2)+" %"}</span>
                      :
                      <span className='red'>{(token.change_24h).toFixed(2)+" %"}</span>
                      }
                  </>
                  :
                  "-"
                }
              </td>
            </tr>


            <tr>
              <td><label className='token-type-name'>N/w</label></td>
              <td className='token-value-details'>
                <img className="rounded-circle" src={"/assets/img/portfolio/"+getNetworkImageNameByID(token.network)} alt="Token" title={getNetworkNameByID(token.network)} style={{width:"24px"}}/>
              </td>
            </tr>

            <tr>
              <td><label className='token-type-name'>Circulating supply</label></td>
              <td className='token-value-details'> {(token.circulating_supply) ? getValueShortForm(token.circulating_supply) : "-"} {token.symbol}</td>
            </tr>

            <tr>
              <td><label className='token-type-name'>All-time High</label></td>
              <td className='token-value-details'> {(token.ath) ? USDFormatValue(token.ath, 1) : "-"} </td>
            </tr>

            <tr>
              <td><label className='token-type-name'>All-time Low</label></td>
              <td className='token-value-details'> {(token.atl) ? USDFormatValue(token.atl, 1) : "-"} </td>
            </tr>

            <tr>
              <td><label className='token-type-name'>Market Cap</label></td>
              <td className='token-value-details'> {(token.circulating_supply) ? getValueShortForm(token.price*token.circulating_supply) : "-"} {token.symbol}</td>
            </tr>
    
    
          </tbody>
        </table>
  

       <div>
          <p>{token.name} Asset Worth</p>
          <div>
          <ReactApexChart options={line_chart_options} series={line_chart_series} type="area"  height={250} />
          </div>
      </div>
        </>
   )
}