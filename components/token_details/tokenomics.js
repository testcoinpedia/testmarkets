import React , {useState, useEffect, useRef} from 'react'
import dynamic from 'next/dynamic' 
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })
import {  roundNumericValue, apexChartData } from '../constants'


export default function  MyFunction({tokenomics_list, total_supply, tokenomics_percentage_value})
{
  
  const [series_values, set_series_values]=useState([])
  const [labels_values, set_labels_values]=useState([])

  const [token_allocation_colors, set_token_allocation_colors]= useState(['#0088FE', '#00C49F', '#FFBB28', '#4b51cb', '#CF61B0','#909090','#5D69B1','#24796C','#E88310','#2F8AC4','#764E9F','#ED645A','#CC3A8E','#C1C1C1','#66C5CC','#F89C74','#DCB0F2','#87C55F','#9EB9F3','#FE88B1','#8BE0A4','#B497E7',
  '#D3B484','#B3B3B3','#E10B64','#E92828','#78B4A4','#604F00','#0060E9','#FF7DE3','#20c997','#6f42c1'])

  useEffect(() => 
  {
    const asyncFn = async () => {
      const {series, labels} = await apexChartData(tokenomics_list, tokenomics_percentage_value)
      await set_series_values(series)
      await set_labels_values(labels)
    }
    asyncFn()
  }, [])


  // console.log("series", series_values)
  // console.log("labels", labels_values)
  var value = {
    options: {},
    series: series_values,
    labels: labels_values,

    chart: {
      type: 'donut',
    },
    
    fill: {
      type: 'gradient',
    }
  }

  
    return (

      // <h5 className='text-center'>Coming Soon</h5>

        <div className='tokendetail_charts'>
        {/* <h5>Spool DAO Token Tokenomics</h5> */}
        <div className='row'>
          <div className='col-md-6'>
            <h6 className='mb-3'>List of Tokenomics with Total Supply</h6>
          <div className='tokenomic_table table-responsive'>
          <table className="table table-bordered">
             
              <tbody>
                <tr>
                  <td>Total Supply</td>
                  <td>100%</td>
                  <td>{total_supply ? (roundNumericValue(total_supply)).replace("$", ""):0}</td>
                </tr>

                {
                  tokenomics_list.length ?
                  tokenomics_list.map((item, i) =>
                  <tr>
                    <td style={{textTransform:"capitalize"}}>{item.tokenomics_name}</td>
                    <td>{item.percentage_of_total_supply}%</td>
                    <td>{(roundNumericValue((item.percentage_of_total_supply*total_supply)/100)).replace("$", "")}</td>
                  </tr> 
                  )
                  :
                  ""
                }
              </tbody>
            </table>
          </div>
          </div>
          <div className='col-md-6'>
          <div className='tokenomic_graph'>
            <h6>Tokenomics </h6>
            <p>Tokenomics refers to the economic and financial aspects of a cryptocurrency</p>
            {
              series_values.length && labels_values.length ?
              <ReactApexChart options={value} series={series_values} type="donut" />
              :
              ""
            }
           
            <p>Token distribution refers to the process of allocating or disseminating tokens within a blockchain or cryptocurrency network.</p>
          </div>
          </div>
        </div>
        </div>
    )
}