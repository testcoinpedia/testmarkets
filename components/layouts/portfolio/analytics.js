/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import Link from 'next/link' 
import moment from 'moment'
import dynamic from 'next/dynamic' 
import { roundNumericValue } from '../../../components/config/helper'
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function AnalyticsFun({data}) 
{   options2
     console.log("Analytics", data)
    const [network] = useState(data.networks)
    const [tokens_balance] = useState(data.tokens_balance)
    const [addresses] =useState(data.addresses)
    const [token_allocation_values] =useState(data.token_allocation_values?data.token_allocation_values:[])
    const [token_allocation_names] =useState(data.token_allocation_names?data.token_allocation_names:[])
    const [pi_chart_values] =useState(data.pi_chart_values)
    const [balance_list] =useState(data.tokens_list ? data.tokens_list:[])
    const [pi_chart_names] =useState(data.pi_chart_names)
    const [loader_status, set_loader_status]=useState(false)
    const [pi_chart_colors]= useState(['#647fe6', '#ffc107', '#6f42c1', '#00bcd4'])
    const [token_allocation_colors]= useState(['#0088FE', '#00C49F', '#FFBB28', '#4b51cb', '#CF61B0','#909090','#5D69B1','#24796C','#E88310','#2F8AC4','#764E9F','#ED645A','#CC3A8E','#C1C1C1','#66C5CC','#F89C74','#DCB0F2','#87C55F','#9EB9F3','#FE88B1','#8BE0A4','#B497E7',
  '#D3B484','#B3B3B3','#E10B64','#E92828','#78B4A4','#604F00','#0060E9','#FF7DE3','#20c997','#6f42c1'])

  const [line_graph_days, set_line_graph_days] = useState([])
  const [line_graph_values, set_line_graph_values] = useState([])
  const [profit_loss_values, set_profit_loss_values] = useState([])
  const [profile_loss_graph_days, set_profile_loss_graph_days] = useState([])
  
  // console.log(line_graph_values)
  
  const line_chart_series = [{
      name: "Asset Worth",
      data: line_graph_values
  }]

  const profit_loss_series = [{
      name: "Daily Profits and Loss",
      data: profit_loss_values
  }]

  const profit_loss_options = {
    chart: {
      type: 'bar',
      height: 350
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      type: 'gradient',
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [{
            from: 0,
            to: 1000,
            color: '#3ac5b8'
          }, {
            from: -1000,
            to: 0,
            color: '#df6060'
          }]
        }
      }
    },
    yaxis: {
      labels: {
        formatter: function (y) {
          return "$"+roundNumericValue(y);
        }
      }
    },
    xaxis: {
      categories: profile_loss_graph_days,
    }
  }



  
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
    
      
    const getSevenDaysValues = async (sparkline_data) =>
    {
        var graph_values = []
        var loop_values = [0, 23, 47, 71, 95, 119, 143, 167]
        for(let l of loop_values)
        {
          console.log(l)
            if(sparkline_data.price)
            {
              if(sparkline_data.price[l])
              {
                  await graph_values.push(sparkline_data.price[l])
              }
              
              
            }
            // console.log("l", sparkline_data.price[l])
        }

        // var sum_of_array = []
        // for(let i = 0; i < 7; i++) 
        // {   
            
        // }

        console.log("graph_values", graph_values)
        // console.log("sparkline_data", sparkline_data)


        return graph_values
    }
    
    const getDaysList = async () =>
    {
        console.log("called")
        const past7Days = [...Array(8).keys()].map(index => {
            const date = new Date();
            date.setDate(date.getDate() - index)
            return moment(date).format("DD MMM")
        })
        const last_seven_days = past7Days.reverse()
        set_line_graph_days(last_seven_days)

        const past7Days1 = [...Array(8).keys()].map(index => {
            const date1 = new Date();
            date1.setDate(date1.getDate() - index)
            return moment(date1).format("DD MMM")
        })
        const profile_loss_last_seven_day = past7Days1.reverse()
        set_profile_loss_graph_days(profile_loss_last_seven_day)

        var initial_array = []
        if(balance_list)
        {
            for(let i of balance_list)
            {   
               await initial_array.push({
                    price : i.price,
                    balance : i.balance,
                    sparkline_in_7d : await getSevenDaysValues(i.sparkline_in_7d)
               })
            }
            
        }

        var sum_array = []
        for(let i=0; i<8; i++)
        {
          if(i == 7)
          {
            await sum_array.push(tokens_balance)
          }
          else
          {
            var sumOne = 0
            for(let j=0; j<initial_array.length; j++)
            {
                sumOne += await (initial_array[j].sparkline_in_7d[i] && initial_array[j].balance) ? initial_array[j].sparkline_in_7d[i]*initial_array[j].balance:0
            }
            await sum_array.push(parseFloat(sumOne.toFixed(2)))
          }
        }
        await set_line_graph_values(sum_array)

        const last_value = sum_array[0] ? sum_array[0]:0
        
        var profit_loss_array = []
        for(let m of sum_array)
        {
          var test_value = parseFloat((m-last_value).toFixed(2))
          await profit_loss_array.push(test_value)
          // if(test_value)
          // {
           
          // }
        }
        await set_profit_loss_values(profit_loss_array)
        // console.log("profit_loss_values",profit_loss_array)
    }

    useEffect(()=>
    {  
        getDaysList()
        // if((network == 1) || (network == 2))
        // {
        //   ethTxnsList()
        // }
        // else if(network == 3) 
        // {
        //   bnbTxnsList()
        // }
        
    }, [tokens_balance])

    const walletTxnsList = async()=>
    {   
// network
// wallet_address
// token_allocation_values
// token_allocation_names
// pi_chart_values
// pi_chart_names
// loader_status
    }

    
   
    var options = {
        series: pi_chart_values,
        labels: pi_chart_names,
        chart: {
        type: 'donut',
      },
      colors: pi_chart_colors,
      fill: {
        type: 'gradient',
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 400
          },
          legend: {
            position: 'bottom'
          }
        },
        breakpoint: 400,
        options: {
          chart: {
            width: 350
          },
          legend: {
            position: 'bottom'
          }
        },
        breakpoint: 350,
        options: {
          chart: {
            width: 300
          },
          legend: {
            position: 'bottom'
          }
        },
        breakpoint: 300,
        options: {
          chart: {
            width: 270
          },
          legend: {
            position: 'bottom'
          }
        }
      }]
    }
  
    var options2 = {
      series: token_allocation_values,
      labels: token_allocation_names,
      chart: {
      type: 'donut',
    },
    colors: token_allocation_colors,
    fill: {
      type: 'gradient',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 400
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 400,
      options: {
        chart: {
          width: 350
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 350,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      },
      breakpoint: 300,
      options: {
        chart: {
          width: 270
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

    return(
        <>
        <div className='row'>
          <div className="col-md-12 col-xl-12 col-lg-12">
          </div>
        </div>
          <div className="row">
            <div className="col-md-8">
              <div className="line-chart-asset-worth charts_subtitle dex-donot-pichart">
                <h6 >Asset Worth</h6>
                <p>Last 7 days approximate assets value based on present token holdings</p>
                <ReactApexChart options={line_chart_options} series={line_chart_series} type="area" height={350} />
              </div>

              <div className="line-chart-asset-worth charts_subtitle dex-donot-pichart">
                <h6 >Daily Profits and Loss</h6>
                <p>Daily profit and loss based on current token holdings</p>
                <ReactApexChart options={profit_loss_options} series={profit_loss_series} type="bar" height={350} />
              </div>
            </div>
            <div className="col-md-4">
              {
                tokens_balance ?
                  <div className="dex-donot-pichart charts_subtitle">
                    <h6 >Chain Allocation</h6>
                    <p>Diversify crypto portfolio by allocating across different blockchains. </p>
                    
                    <div className="donot-pi-chart-section" id="chart">
                      <ReactApexChart options={options} series={pi_chart_values} type="donut" />
                    </div>
                  </div>    
                  :
                  ""
                }

              {
                tokens_balance ?
                <div className="dex-donot-pichart charts_subtitle">
                  <h6 >Token Allocation</h6>
                  <p>Minimize risk through diversified asset allocation in investment portfolio.</p>
                  <div className="donot-pi-chart-section" id="chart">
                    <ReactApexChart options={options2} series={token_allocation_values} type="donut" />
                  </div>
                </div>
                :
                ""
              }
            </div>
          </div>
        
        </>
   )
}