import React , {useEffect,  useState} from 'react' 
import {API_BASE_URL, convertvalue, config, graphqlApiKEY,website_url,separator} from '../../../components/constants'
import CategoriesTab from '../../../components/categoriesTabs'
import Search_Contract_Address from '../../../components/searchContractAddress'
import AnalysisInsightsMenu from '../../../components/analysisInsightsmenu'
import SmartContractExplorers from '../../../components/SmartContractExplorers'
import ReactPaginate from 'react-paginate'
import Axios from 'axios'
import Head from 'next/head'
import cookie from "cookie"
import Highcharts from 'highcharts';
import Link from 'next/link'
import JsCookie from "js-cookie"  
import moment from 'moment' 
import { fromNToDate } from '../../../components/tokenDetailsFunctions' 
import { useRouter } from 'next/router'


function TokenDetails({network}) 
{ 
    const router = useRouter()
    const get_path = router.route
    const complete_url = website_url+get_path
    const newUrl = complete_url.slice(0, complete_url.lastIndexOf('['));
    console.log(newUrl)
    const [total_transaction_count, set_total_transaction_count] = useState("")
    const [today_transaction_count, set_today_transaction_count] = useState("")
    const [d7_transaction_count, set_d7_transaction_count] = useState("")
    const [present_date, set_present_date] = useState("")
    const [d7_date, set_d7_date] = useState("")
    const [graph_data_date, set_graph_data_date]= useState(4)
    const [light_dark_mode, set_light_dark_mode] = useState(JsCookie.get('light_dark_mode')) 

    useEffect(()=>
    {  
        getTransactions(network)
        todaysTransaction(network,1)
        todaysTransaction(network,2)
        
    },[network])

    useEffect(()=>
    {  
        getGraphData(network, graph_data_date)
        if(JsCookie.get('light_dark_mode') === "dark")
        { 
            set_light_dark_mode("dark")
        }
    },[light_dark_mode, graph_data_date, network])
    

    const getTransactions = async (network_type)=>
    { 
        let query = ''
       
        if(network_type == "tron")
        {
            query = `query {
            tron(network: tron) {
                    transactions {
                    count
                    }
                }
            }`
        }
        else if(network_type == "solana")
        {
            query = `query {
            solana(network: solana) {
                    transactions {
                        count
                    }
                }
            }`
        }
        else
        {
            query = `
                query
                {
                    ethereum(network: `+network_type+`) {
                        transactions {
                            count
                        }
                    }
                }
            ` ;
        }
      
        const opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY":graphqlApiKEY
            },
            body: JSON.stringify({ query })
        }
        const res = await fetch("https://graphql.bitquery.io/", opts)
        const result = await res.json()
        if(result.data.ethereum)
        {
            set_total_transaction_count(result.data.ethereum.transactions[0].count)
        }
        else if(result.data.tron)
        {
            set_total_transaction_count(result.data.tron.transactions[0].count)
        }
        else if(result.data.solana)
        {
            set_total_transaction_count(result.data.solana.transactions[0].count)
        }
        else
        {
            const abc = (result.errors[0].message).split(":")
            const def = abc[1].split(".")
            set_total_transaction_count((def[0]).trim())
        }
    }

    const todaysTransaction = async (network_type, type)=>
    { 
        var present_date = ((new Date()).toISOString())
        set_present_date(present_date)
        var from_date = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())
        if(type == 2)
        {
            from_date = ((new Date(Date.now() - 7*24 * 60 * 60 * 1000)).toISOString())
            set_d7_date(from_date)
        }

        
        var query = ''
        if(network_type == "tron")
        {
            query = `query {
            tron(network: tron) {
                    transactions(options: {asc: "date.date"}, date: {since: "`+from_date+`", till: "`+present_date+`"}) 
                    {
                        date 
                        {
                            date(format:"%Y-%m-%d")
                        }
                        count: count
                    }
                }
            }`
        }
        else if(network_type == "solana")
        {
            query = `query {
            solana(network: solana) {
                transactions(options: {asc: "date.date"}, date: {since: "`+from_date+`", till: "`+present_date+`"}) 
                {
                    date 
                    {
                        date(format:"%Y-%m-%d")
                    }
                    count: count
                }
                }
            }`
        }
        else
        {
            query = `
            query
            {
                ethereum(network: `+network_type+`) 
                {
                    transactions(options: {asc: "date.date"}, date: {since: "`+from_date+`", till: "`+present_date+`"}) 
                    {
                        date 
                        {
                            date(format:"%Y-%m-%d")
                        }
                        count: count
                    }
                }
            }
        ` ;
        }
      
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY":graphqlApiKEY
          },
          body: JSON.stringify({
            query
          })
        }
        const res = await fetch("https://graphql.bitquery.io/", opts)
        const result = await res.json()
        if(result.data.ethereum)
        {
            if(type == 1)
            {
                set_today_transaction_count(result.data.ethereum.transactions[1].count)
            }
            else if(type == 2)
            {
                set_d7_transaction_count(result.data.ethereum.transactions[0].count)
            }
        }
        else if(result.data.tron)
        {
            if(type == 1)
            {
                set_today_transaction_count(result.data.tron.transactions[1].count)
            }
            else if(type == 2)
            {
                set_d7_transaction_count(result.data.tron.transactions[0].count)
            }
        }
        else if(result.data.solana)
        {
            if(type == 1)
            {
                set_today_transaction_count(result.data.solana.transactions[1].count)
            }
            else if(type == 2)
            {
                set_d7_transaction_count(result.data.solana.transactions[0].count)
            }
        }
    }

    const getGraphData= async(network_type, datetime)=> 
    {  
        var from_n_to_date = fromNToDate(datetime)
        let fromDate= from_n_to_date.fromDate
        let toDate= from_n_to_date.toDate 

        var query = ''
        if(network_type == "tron")
        {
            query = `
            query 
            {
                tron(network: tron) 
                {
                    transactions(options: {asc: "date.date"}, date: {since: "`+fromDate+`", till: "`+toDate+`"}) 
                    {
                        date { date(format: "%Y-%m-%d") }
                        count: count
                    }
                }
            }`
        }
        else if(network_type == "solana")
        {
            query = `
            query 
            {
                solana(network: solana) 
                {
                    transactions(options: {asc: "date.date"}, date: {since: "`+fromDate+`", till: "`+toDate+`"}) 
                    {
                        date { date(format: "%Y-%m-%d") }
                        count: count
                    }
                }
            }`
        }
        else
        {
            query = `
            query 
            {
                ethereum(network: `+network_type+`) 
                {
                    transactions(options: {asc: "date.date"}, date: {since: "`+fromDate+`", till: "`+toDate+`"}) 
                    {
                        date { date(format: "%Y-%m-%d") }
                        count: count
                    }
                }
            }`
        } 
     
    
        
        const opts = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-KEY": graphqlApiKEY
            },
            body: JSON.stringify({ query })
        }

        const res = await fetch("https://graphql.bitquery.io/", opts)
        const result = await res.json()
        {  
            if(result.data.ethereum) 
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
                        val[1] = arr[index].count
            
                        prices.push(val)
                    }
                }
            }
            else if(result.data.tron) 
            { 
                var prices= [];
                var arr = result.data.tron.transactions; 
                for (let index = 0; index < arr.length; index++) 
                {
                    if (arr[index] !== undefined) 
                    {
                        var date = new Date(arr[index].date.date)
                        var val = []
                        val[0] = date.getTime()
                        val[1] = arr[index].count
            
                        prices.push(val)
                    }
                }
            }
            else if(result.data.solana) 
            { 
                var prices= [];
                var arr = result.data.solana.transactions; 
                for (let index = 0; index < arr.length; index++) 
                {
                    if (arr[index] !== undefined) 
                    {
                        var date = new Date(arr[index].date.date)
                        var val = []
                        val[0] = date.getTime()
                        val[1] = arr[index].count
            
                        prices.push(val)
                    }
                }
            }

            if(light_dark_mode=="dark")
            {
                Highcharts.chart('container', 
                {
                    chart: {
                        backgroundColor: 
                        {
                            stops: [
                                [0, 'rgb(23, 23, 26)'],
                                [1, 'rgb(23, 23, 26)']
                            ]
                        },
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                        title: {
                        text: ('Date')
                        },
                        type: 'datetime',
                        lineColor: '#f7931a',
                        dashStyle: 'Dash',
                    },
                    yAxis: {
                        title: {
                            text: ('Transaction count')
                        },
                        dashStyle: 'Dash',
                    },
                    colors: ['#f7931a'],
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                        formatter: function () 
                        {
                            var point = this.points[0];
                            return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
                            '<strong>Transaction Count :</strong> '+ ('$ ') + Highcharts.numberFormat(point.y, 10) + '';  
                        },
                    shared: true
                    },
                    plotOptions: {
                    area: 
                        {
                        fillColor: {
                                linearGradient: {
                                    x1: 0,
                                    y1: 0,
                                    x2: 0,
                                    y2: 1
                                },
                                stops: [
                                    [0, 'rgb(23 23 26 / 1%)'],
                                    [1, 'rgb(23 23 26 / 1%)']
                                ]
                            },
                            marker: {
                                radius: 1
                            },
                            lineWidth: 3,
                            states: {
                                hover: {
                                    lineWidth: 3
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
            }
            else
            {
                Highcharts.chart('container', {
                    chart: {
                        zoomType: 'x'
                    },
                    title: {
                        text: ''
                    },
                    xAxis: {
                      title: {
                          text: ('Date')
                          },
                        type: 'datetime',
                        lineColor: '#f7931a',
                        dashStyle: 'Dash',
                    },
                    yAxis: {
                        title: {
                            text: ('Transaction Count')
                        },
                        dashStyle: 'Dash',
                    },
                    colors: ['#f7931a'],
                    legend: {
                        enabled: false
                    },
                    tooltip: {
                            formatter: function () {
                            var point = this.points[0];
                            return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
                            '<strong>Transaction Count :</strong> '+ ('$ ') + Highcharts.numberFormat(point.y, 10) + '';  
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
                                  [0, 'rgb(255 248 241 / 1%)'],
                                  [1, 'rgb(255 255 255 / 1%)']
                                ]
                            },
                            marker: {
                                radius: 1
                            },
                            lineWidth: 3,
                            states: {
                                hover: {
                                    lineWidth: 3
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
            }
            
        }
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
                                    <div className="row ">
                                        <div className="col-md-6">
                                            <div className="dex-section">
                                                <div className="row ">
                                                    <div className="col-md-6">
                                                        <p>Total Transactions </p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                                                    </div>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <div style={{fontSize:"35px"}}>{separator(total_transaction_count)}</div>
                                                    <p style={{fontSize:"18px"}}>Transactions of <span className="text-capitalize" >{network}</span></p>
                                                    <br/>
                                                </div>
                                                
                                                <div className='col-md-12 pull-right text-right'>
                                                {/* <button onClick={() => change(1)}> */}
                                                    <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                                                {/* </button> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="dex-section">
                                                <div className="row ">
                                                    <div className="col-md-6">
                                                        <p>Today's Transactions</p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                                                    </div>
                                                </div>
                                                <div className="text-center mt-2">
                                                    <div style={{fontSize:"35px"}}>{separator(today_transaction_count)}</div>
                                                    <p style={{fontSize:"18px"}}>Transactions on {moment().format('ll')}</p>
                                                    <br/>
                                                </div>
                                                
                                                <div className='col-md-12 pull-right text-right'>
                                                {/* <button onClick={() => change(1)}> */}
                                                    <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                                                {/* </button> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row  mt-4">
                                        <div className="col-md-6">
                                            <div className="dex-section">
                                                <div className="row ">
                                                    <div className="col-md-6">
                                                        <p>Last week Transactions </p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <p style={{ float:"right"}}>Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                                                    </div>
                                                </div>

                                                <div className="text-center mt-2">
                                                    <div style={{fontSize:"35px"}}>{separator(d7_transaction_count)}</div>
                                                    <p style={{fontSize:"18px"}}>Transactions on {moment(d7_date).format('ll')}</p>
                                                    <br/>
                                                </div>

                                                <div className='col-md-12 pull-right text-right'>
                                                    {/* <button onClick={() => change(3)}> */}
                                                        <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
                                                    {/* </button> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                        
                                    <div className="row mt-4">
                                    <div className="col-md-6"></div>
                                        <div className="col-md-6">
                                            <ul className=" chart_tabs_ul nav nav-tabs">
                                                <li className="nav-item">
                                                    <a className="nav-link "  href="#one_day" onClick={()=> set_graph_data_date(1)}>1 D</a>
                                                </li>
                                                <li className="nav-item" >
                                                    <a className="nav-link " href="#one_week" onClick={()=> set_graph_data_date(2)}>1 W</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link " href="#one_month" onClick={()=> set_graph_data_date(3)}>1 M</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link " href="#six_month" onClick={()=> set_graph_data_date(7)}>6 M</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link " href="#one_year" onClick={()=> set_graph_data_date(4)}>1 Y</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link " href="#two_year" onClick={()=> set_graph_data_date(5)}>2 Y</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link " href="#three_year" onClick={()=> set_graph_data_date(8)}>3 Y</a>
                                                </li>
                                                <li className="nav-item">
                                                    <a className="nav-link " href="#five_year" onClick={()=> set_graph_data_date(9)}>5 Y</a>
                                                </li>
                                            </ul>
                                        </div>
                                        
                                    </div>     

                                    <div className="dex-donot-pichart">
                                        <h6 className="mb-3">Transaction Count Analysis</h6>
                                        <div className="table-responsive">
                                            <figure className="highcharts-figure">
                                                <div
                                                    id="container"
                                                    style={{ height: 250, overflow: "hidden" }}
                                                    data-highcharts-chart={0}
                                                    role="region"
                                                    aria-label="Chart. Highcharts interactive chart."
                                                    aria-hidden="false"
                                                >  
                                                </div>
                                            </figure>
                                        </div>
                                        <div className="row mt-4 ">
                                            <div className="col-md-6">
                                                <p >Source: <a target={"_blank"} href="https://graphql.bitquery.io/ide">Bitquery</a></p>
                                            </div>
                                            <div className='col-md-6 pull-right text-right'>
                                                <img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/>
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

export default TokenDetails
