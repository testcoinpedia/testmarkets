import React , {useEffect,  useState} from 'react' 
import { graphqlApiKEY,url} from '../../../components/constants'
import { useRouter } from 'next/router'
import CategoriesTab from '../../../components/categoriesTabs'
import Search_Contract_Address from '../../../components/searchContractAddress'
import AnalysisInsightsMenu from '../../../components/analysisInsightsmenu'
import SmartContractExplorers from '../../../components/SmartContractExplorers'
import Head from 'next/head'
import cookie from "cookie"
import Highcharts from 'highcharts';
import { graphQlURL,fromNToDate } from '../../../components/tokenDetailsFunctions' 


export default function TokenDetails({network}) 
{ 
     
    const router = useRouter()
    const get_path = router.route
    const complete_url = url+get_path
   const newUrl = complete_url.slice(0, complete_url.lastIndexOf('['));
    console.log(newUrl)
  
    const [graph_data_date, set_graph_data_date]= useState(2)
    const [graphDate , set_graphDate] = useState(2) 
 
   

    useEffect(()=>
    {  
        getGasData(graph_data_date,network)  
    },[network])
    

    const getGraphData=async(value)=> 
    {   
      await set_graph_data_date("")
      await set_graph_data_date(value)
      getGasData(value,1)
    } 
      const getGasData=async(graph_data_date,network)=> 
      {    
        if(graph_data_date === "") 
          { 
            graph_data_date = graphDate;
          } 
          set_graphDate(graph_data_date)
          
          var from_n_to_date = fromNToDate(graph_data_date)
          let fromDate= from_n_to_date.fromDate
          let toDate= from_n_to_date.toDate 
          
          let query =`
                query {
                ethereum(network: `+network+`){
                transactions (options: {}, date: {since: "` + fromDate + `" , till: "` +toDate+`"}){
                    date {date}
                    count
                    gasValue(in: USD)
                    totalGasUsed: gas
                    totalGasUsedInUSD: gasValue (in: USD)
                }
                }
              }
                ` 
            
             
            
          
          const opts = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
                  "X-API-KEY": graphqlApiKEY
              },
              body: JSON.stringify({ query })
          }
  
          fetch(graphQlURL, opts) .then(res => res.json())
          .then(result => 
          { 
             console.log("gas_used",result)
              if (result.data.ethereum.transactions != null ) 
              { 
                  var prices= [];
                  var arr = result.data.ethereum.transactions; 
  
                  for (let index = 0; index < arr.length; index++) 
                  {
                      if (arr[index] !== undefined) 
                      {
                          var date = new Date(arr[index].date.date)
                          var val = []
                          val[0] = date.getTime()
                          val[1] = arr[index].totalGasUsed
              
              
                          prices.push(val)
                          console.log("prices",prices)
                      }
                  }  
                  Highcharts.chart('container', {
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: network.replace(/\b(\w)/g, s => s.toUpperCase()) +' Daily Gas Used Chart'
                    },
                    subtitle: {
                       
                      text:'Click and drag in the plot area to zoom in',
                      
                  },
                    xAxis: {
                        type: 'datetime'
                    },
                    yAxis: {
                        title: {
                            text: 'Total Gas Used per Day'
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                              formatter: function () 
                              {
                                  var point = this.points[0];
                                  return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a, %e %b %Y', this.x) + '<br>' +
                                  '<strong>Total Gas Used :</strong> ' + (Highcharts.numberFormat(point.y,0)) + 'Million';  
                              },
                          shared: true
                          },
                    plotOptions: {
                        area: {
                            fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, Highcharts.getOptions().colors[0]],
                                    [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                                ]
                            },
                            marker: {
                                radius: 2
                            },
                            lineWidth: 1,
                            states: {
                                hover: {
                                    lineWidth: 1
                                }
                            },
                            threshold: null
                        }
                    },
        
                    series: [{
                        type: 'area',
                        name: '',
                        data: prices
                    }]
                });
              
            
          // Highcharts.chart('container', 
          // {
          //     chart: {
          //         backgroundColor: 
          //         {
          //           stops: [
          //             [0, 'rgb(124, 181, 236)'],
          //             [1, 'rgb(124, 181, 236)']
          //         ]
          //         },
          //         fillColor:'#7CB5EC'
          //     },
          //     title: {
          //         text: ''
          //     },
          //     xAxis: {
          //         title: {
          //         text: ('')
          //         },
          //         type: 'datetime',
          //         lineColor: '#7CB5EC',
          //         dashStyle: 'Dash',
          //     },
          //     yAxis: {
          //         title: {
          //             text: ('Total Gas Used per Day')
          //         },
          //         dashStyle: 'Dash',
          //     },
          //     colors: ['#7CB5EC'],
          //     legend: {
          //         enabled: false
          //     },
          //     tooltip: {
          //         formatter: function () 
          //         {
          //             var point = this.points[0];
          //             return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a, %e %b %Y', this.x) + '<br>' +
          //             '<strong>Total Gas Used :</strong> '+ ('$ ') + (Highcharts.numberFormat(point.y,0)) + 'Million';  
          //         },
          //     shared: true
          //     },
          //     plotOptions: {
          //       area: 
          //         {
          //           fillColor: {
          //                 linearGradient: {
          //                     x1: 0,
          //                     y1: 0,
          //                     x2: 0,
          //                     y2: 1
          //                 },
          //                 stops: [
          //                   [0, 'rgb(124, 181, 236)'],
          //                   [1, 'rgb(124, 181, 236)']
          //               ]
          //             },
          //             marker: {
          //                 radius: 1
          //             },
          //             lineWidth: 3,
          //             states: {
          //                 hover: {
          //                     lineWidth: 3
          //                 }
          //             },
          //             threshold: null
          //         }
          //     },
      
          //     series: [{
          //         type: 'area',
          //         name: '',
          //         data: prices
          //     }]
          // })
        }
      
      })
      .catch(console.error);  
        
          
      }

return (
    <> 
        <Head> 
            <title>Dex Trades</title> 
        </Head> 
        <div className="page new_markets_index min_height_page" >
            <div className="market-page">
                <div className="new_page_title_block">
                    <div className="container">
                        <div className="col-md-12">
                            <div className="row market_insights ">
                                <div className="col-md-6 col-lg-6">
                                    <h1 className="page_title">Cryptocurrency Market Insights</h1>
                                    <p>Check the latest Price before you buy.</p>
                                </div>
                                <div className="col-md-1 col-lg-2"></div>
                                <div className="col-md-5 col-lg-4">
                                    {
                                    <Search_Contract_Address /> 
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="market_details_insights">
                    <div className="container"> 
                        <div className="col-md-12">
                            {
                            <CategoriesTab active_tab={2}/> 
                            } 
                            <div className="row mb-4 mt-4">
                                {
                                    <AnalysisInsightsMenu /> 
                                }
                                <div className="col-md-10">
                                    <SmartContractExplorers active_network={network} complete_url={newUrl}/>
                                   
                                   
                                    <h6> Gas Used Chart</h6>
                                    <div className="row mt-4">
                                        <div className="col-md-6 col-sm-6 col-5"></div>
                                        <div className="col-md-6 col-sm-6 col-5">
                                        <ul className=" chart_tabs_ul nav nav-tabs">
                                            <li className="nav-item">
                                                <a className="nav-link active" data-toggle="tab" href="#one_day" onClick={()=> getGraphData(2)}>1 W</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" data-toggle="tab"  href="#one_week" onClick={()=> getGraphData(3)}>1 M</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" data-toggle="tab"  href="#one_month" onClick={()=> getGraphData(7)}>6 M</a>
                                            </li>
                                            <li className="nav-item">
                                                <a  className="nav-link " data-toggle="tab"  href="#one_year" onClick={()=> getGraphData(4)}>1 Y</a>
                                            </li>
                                            <li className="nav-item">
                                                <a  className="nav-link " data-toggle="tab"  href="#one_year" onClick={()=> getGraphData(5)}>2 Y</a>
                                            </li>
                                            <li className="nav-item">
                                                <a  className="nav-link " data-toggle="tab"  href="#one_year" onClick={()=> getGraphData(8)}>3 Y</a>
                                            </li>
                                        </ul>
                                        </div> 
                                    </div>      
                                    <div className="row mt-4">
                                        <div className="col-md-12">
                                            <div className="dex-donot-pichart">
                                                <figure className="highcharts-figure text-center">
                                                    <div
                                                        id="container"
                                                        style={{ height: 350, overflow: "hidden" }}
                                                        data-highcharts-chart={0}
                                                        role="region"
                                                        aria-label="Chart. Highcharts interactive chart."
                                                        aria-hidden="false"
                                                        >  
                                                    </div>
                                                </figure>
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
    </>
  )
} 


export async function getServerSideProps({ req, query }) 
{  
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
     
    return { props: {userAgent:userAgent, network:query.network}} 
            
} 


