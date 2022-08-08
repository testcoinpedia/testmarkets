import React ,{useState} from 'react'
import dynamic from 'next/dynamic'

  
  export default function charts (){
     
    const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });
    
      const [series]=useState([44, 55, 41, 17, 15])
      var options = {
          series: series,
          labels: ["Apple", "Mango", "Banana", "Papaya", "Orange"],
          chart: {
          type: 'donut',
        },
        colors: ['#546E7A', '#E91E63'],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
        };
  
  
      return (
         
            <div className="row">
                <div className='col-md-6'>
                    <div id="chart">
                        <ReactApexChart options={options} series={series} type="donut" />
                    </div>
                </div>
            </div>
            
          
               
             
         
              
      )
      }
