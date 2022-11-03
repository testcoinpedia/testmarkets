import React , {useEffect,  useState} from 'react' 
import {API_BASE_URL,convertvalue,config, IMAGE_BASE_URL} from '../../components/constants'
import CategoriesTab from '../../components/categoriesTabs'
import Search_Contract_Address from '../../components/searchContractAddress'
import AnalysisInsightsMenu from '../../components/analysisInsightsmenu'
import TableContentLoader from '../../components/loaders/tableLoader'
import ReactPaginate from 'react-paginate'
import Axios from 'axios'
import Head from 'next/head'
import cookie from "cookie"
import Highcharts from 'highcharts';
import moment from 'moment'
import Link from 'next/link' 
import Select from 'react-select'
import { useRouter } from 'next/router'
 
function TokenDetails(props) 
{ 
  const router = useRouter()
  const { active_category_tab } = router.query
  const [tab, set_tab]= useState(0)  
  const [tvl_chain_data, set_tvl_chain_data]= useState([])
  const [tvl_protocol_data, set_tvl_protocol_data]= useState([])
  const [gecko_chain_data] =useState(["ethereum","binancecoin","tron","solana"])
  const [currentPage, setCurrentPage] = useState(0)
  const [per_page_count, set_per_page_count] = useState(20)
  const [pageCount, setPageCount] = useState(0)
  const [sl_no, set_sl_no]=useState(0)
  const [firstcount, setfirstcount] = useState(1)
  const [finalcount, setfinalcount] = useState(per_page_count)
  const [count, setCount]=useState(0)
  const [chain, set_chain] = useState("")
  const [chains, set_chains] = useState(["Ethereum","Binance","Tron","Avalanche","Solana","Polygon","Cronos","Fantom","Arbitrum","Optimism"])
  const [search_title, set_search_title] = useState("")  
  const [loader_status, set_loader_status]=useState(false)  
  const [other_category_list, set_other_category_list] = useState([])
  const [category, set_category] = useState("")
  

  const getcurrentTVLChains = async() =>
  {
    const res_data =await  Axios.get("https://api.llama.fi/chains")
    console.log(res_data.data)
    //set_chains(res_data.data)
    let chainArray=[]
    for(let u of res_data.data)
      {
        if(gecko_chain_data.includes(u.gecko_id))
        {
          
          chainArray.push(u)
       }
     }
      set_tvl_chain_data(chainArray)
  }

 
const mainUniqueCategory = () =>
    {  
      const configreq=config("")
      // console.log(configreq)
      const reqConfig = {
      headers: configreq.headers,
    }
        Axios.get(API_BASE_URL+"markets/tvl_exchanges/most_used_categories",reqConfig).then(res=>
        { 
          console.log("res",res)
            if(res.data)
            {      
              otherUniqueCategory(res.data.message)
            } 
        })
    }

    const otherUniqueCategory = (res) =>
    {  
        var listData = res
        var list = []
        for(const i of listData)
        {
            list.push({value: parseInt(i), label: (i)})  
        }
        set_other_category_list(list)
    }

    const handleChange = (selectedOption) => 
        {  
            console.log(selectedOption)
            set_category(selectedOption.label)
        } 

    const getTVLProtocols = async(page) =>
      {
      
        let current_pages = 0 
        if(page.selected) 
        {
          current_pages = ((page.selected) * per_page_count) 
        }
        const configreq=config("")
        console.log(configreq)
        const reqConfig = {
          headers: configreq.headers,
          params: {
            chains: chain,
            search: search_title,
            category:category
            
          }
      }
    const res_data =await Axios.get(API_BASE_URL+"markets/tvl_exchanges/list/"+current_pages+'/'+per_page_count,reqConfig)
    console.log("res_data",res_data)
    if(res_data.data.status == true)
    {
      set_loader_status(true)
      set_tvl_protocol_data(res_data.data.message)
      setPageCount(Math.ceil(res_data.data.count/per_page_count))
      set_sl_no(current_pages)
      setCurrentPage(page.selected)
      setfirstcount(current_pages+1)
      setCount(res_data.data.count)
      const presentPage = page.selected+1
      const totalcompany = res_data.data.count
      var sadf = presentPage*per_page_count
      if((presentPage*per_page_count) > totalcompany)
      {
        sadf = totalcompany
      }
      const final_count=sadf
      setfinalcount(final_count)
      // dexTradesGraph()
    }
    
    
    
    
    
}



// const dexTradesGraph = async () =>
//     { 
      
//       let res_data = await Axios.get("https://api.llama.fi/charts/"+chain)
//       console.log(res_data)
//       var prices= [];
//       var arr = res_data.data 
//          for (let index = 0; index < arr.length; index++) 
//          {
//           if (arr[index] !== undefined)
//           {
//             if (arr[index] >600)
//             {
//                   var rate = 0 
//                   rate = arr[index]
//                   var val = []
//                   //console.log(new Date(1610323200*1000))
//                   if(rate.date)
//                   {
//                     val[0] =new Date(rate.date*1000)
//                     val[1] =rate.totalLiquidityUSD
//                     await prices.push(val)
//                     console.log(prices)

//                   }
//             }    
              
//           }
           
//             Highcharts.chart('container', {
//                 chart: {
//                     zoomType: 'x'
//                 },
//                 title: {
//                     text: ''
//                 },
//                 xAxis: {
//                     title: {
//                         text: ('Time')
//                         },
//                     type: 'datetime',
//                     lineColor: '#f7931a',
//                     dashStyle: 'Dash',
//                 },
//                 yAxis: {
//                     title: {
//                         text: ('USD Prices')
//                     },
//                     dashStyle: 'Dash',
//                 },
//                 colors: ['#f7931a'],
//                 legend: { enabled: false },
//                 tooltip: {
//                           formatter: function () {
//                               var point = this.points[0];
//                               return '<b>' + point.series.name + '</b><br>' + Highcharts.dateFormat('%a %e %b %Y, %H:%M:%S', this.x) + '<br>' +
//                               '<strong>Price :</strong> '+ ('$ ') + Highcharts.numberFormat(point.y, 10) + '';  
//                           },
//             shared: true
//                },
//                plotOptions: {
//                 area: {
//                     fillColor: {
//                         linearGradient: {
//                             x1: 0,
//                             y1: 0,
//                             x2: 0,
//                             y2: 1
//                         },
//                         stops: [
//                             [0, 'rgb(255 248 241 / 59%)'],
//                             [1, 'rgb(255 255 255 / 59%)']
//                         ]
//                     },
//                     marker: {
//                         radius: 1
//                     },
//                     lineWidth: 3,
//                     states: {
//                         hover: {
//                             lineWidth: 3
//                         }
//                     },
//                     threshold: null
//                 }
//             },
              
//                 series: [{
//                     type: 'area',
//                     name: '',
//                     data: prices
//                 }]
//              })
//         }
         
         
//     }

 
useEffect(()=>
{  
  getTVLProtocols({selected : 0})
  mainUniqueCategory()
},[per_page_count,chain,search_title,category]) 
 
  
useEffect(()=> 
{  
 // mostchains()
  getcurrentTVLChains()
 
},[])
  

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
        <div className="categories categories_list_display">
                <div className="categories__container">
                  <div className="row">
                    <div className="markets_list_quick_links">
                      <ul>
                        <li>
                            <a className={chain==""?"categories__item active_category":"categories__item"} onClick={()=>set_chain("")}>
                              <div className="categories__text">All Chains</div>
                            </a>
                            {
                            chains ? 
                            chains.map((e)=>
                            <>
                            <li ><a className={chain==e?"categories__item active_category":"categories__item"} onClick={()=>set_chain(e)}>{e}</a></li>
                            </>
                           
                            )
                            :
                            null
                            }
                            </li>
                            {/* <li >
                            <a className={chain=="Ethereum"?"categories__item active_category":"categories__item"} onClick={()=>set_chain("Ethereum")}>
                                <div className="categories__text">Ethereum</div>
                                </a>
                            </li> 
                            <li onClick={()=>set_chain("Binance")}>
                              <a className={tab==2?"categories__item active_category":"categories__item"} onClick={()=>set_chain("Binance")}>
                                <div className="categories__text">BSC</div>
                                </a>
                            </li> */}
                        
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row ">
              
              {
                  tvl_chain_data.map((e,i)=>
                  i < 6?
                  <div className="col-md-3 mt-4">
                  <div className="dex-section">
                      <p><span><img src={"/assets/img/Chains/"+e.gecko_id+".png"} style={{width: "30px", borderRadius:"50%", marginRight:"5px"}} alt="Network" /></span> {e.name} ({e.tokenSymbol}) </p>
                      <h6>{e.tvl ? "$ "+convertvalue(e.tvl): "$ 00"}</h6>
                      <br/>
                      <div className='col-md-12 p-0'>
                      <div className='col-md-8 p-0 text-left'>
                        <p>Source :  <a target={"_blank"} href="https://defillama.com/">DefiLlama</a></p>
                      </div>
                      <div className='col-md-6'>
                        
                      </div>
                    </div>
                  </div>
                </div>
                :
                null
              )
            }
              
          </div>
          <div className="row mt-4">
          <div className="col-md-12">
              <div className="dex-donot-pichart">
                <div className="row">
                  <div className="col-md-4">
                    <h6 className="mt-2">TVL Rankings ({count})</h6>
                  </div>
                    <div className="col-md-3">
                        <Select
                        onChange={handleChange}
                        options={other_category_list}
                        placeholder={category?category:'Select  Category'}
                        value={category}
                        /> 
                    </div>
                    <div className="col-md-3">
                      <div className="input-group search_filter  mb-3">
                        <input value={search_title} onChange={(e)=> set_search_title(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search Exchange" />
                          <div className="input-group-prepend ">
                            <span className="input-group-text" onClick={()=> tokensList({selected:0})}><img src="/assets/img/search_large.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                          </div>
                      </div> 
                    </div>
                    <div className="col-md-2">
                        <ul className="filter_rows">
                            <li>
                                <select className="show-num" onChange={(e)=>set_per_page_count(e.target.value)}>
                                <option value="" disabled>Show Rows</option>
                                <option value={100}>100</option>
                                <option value={50}>50</option>
                                <option value={20}>20</option>
                                </select>
                            </li>
                        </ul>
                    </div>
                </div>
                
                  <div className="market_page_data">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                            <thead>
                                <tr>
                                  <th className="mobile_hide_table_col" style={{width:"20px"}}>Sl no</th>
                                  <th className="">Name</th>
                                  <th >Category<br/><small>(Symbol)</small></th>
                                  <th>Chains</th>
                                  <th>24hr %</th>
                                  <th>7d %</th>
                                  <th className="table_token">TVL</th>
                                  <th>Mcap/TVL</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                            {
                            loader_status ?
                           <>
                           
                              {
                                tvl_protocol_data.length>0 ?
                                tvl_protocol_data.map((e, i) => 
                                    <tr key={i}>
                                      <td>{sl_no+i+1}</td>
                                      <td>
                                   
                                         <a>
                                          <div className="media">
                                            <div className="media-left">
                                            <img style={{width: "30px", borderRadius:"50%", marginRight:"5px"}} src={e.exchange_image}  onError={(e) => e.target.src = IMAGE_BASE_URL+'/tokens/default.png'} alt="Protocols"/>
                                            </div>
                                            <div className="media-body">
                                              <h4 className="media-heading"> {e.exchange_name} </h4>
                                            </div>
                                          </div> 
                                         </a>
                                   
                                        {/* <span>
                                          <img style={{width: "30px", borderRadius:"50%", marginRight:"5px"}} src={e.exchange_image} alt="Protocols"/>
                                          {e.exchange_name}
                                        </span> */}
                                        
                                      </td>
                                      <td >{e.category?e.category:"--"}<br/><small><span>({(e.symbol).toUpperCase()})</span></small>
                    
                                      </td>
                                      <td>{e.chains.map((item,idx)=>chain==""?
                                      idx<3?
                                      <img style={{width: "30px", borderRadius:"50%", marginRight:"5px"}} src={"/assets/img/Chains/"+item.toLowerCase()+".webp"}  onError={(e) => e.target.src = IMAGE_BASE_URL+'/tokens/default.png'} alt="Chain" title={item}/>
                                      :
                                      ""
                                      :
                                      item==chain?
                                      <img style={{width: "30px", borderRadius:"50%", marginRight:"5px"}} src={"/assets/img/Chains/"+item.toLowerCase()+".webp"} alt="Chain"  onError={(e) => e.target.src = IMAGE_BASE_URL+'/tokens/default.png'} title={item}/>
                                      :
                                      "")}{
                                        chain=="" && e.chains.length>3?
                                        "+" + e.chains.length
                                        :
                                        ""
                                      }
                                      </td>
                                      {/* <td>
                                          {
                                            e.chains ? 
                                            (e.chains).map((e,value) =>
                                            <>{e}{(((e.chains.length) -1) == value) ? null :", "}</>
                                            ) 
                                            : 
                                            "--"
                                          }
                                      </td> */}
                                      <td>
                                      {
                                         e.change_1d?
                                         e.change_1d>0?
                                        <h6 className="values_growth"><span className="green">{e.change_1d.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red">{e.change_1d.toFixed(2)+"%"}</span></h6>
                                        :
                                        "--"
                                        }</td>
                                      <td>{
                                        e.change_7d?e.change_7d>0?
                                        <h6 className="values_growth"><span className="green">{e.change_7d.toFixed(2)+"%"}</span></h6>
                                        :
                                        <h6 className="values_growth"><span className="red">{e.change_7d.toFixed(2)+"%"}</span></h6>
                                        :
                                        "--"}</td>
                                      <td className="market_list_price"><a>
                                      <span className="block_price">
                                      {
                                        chain=="" && e.tvl?
                                        convertvalue(e.tvl)
                                        :
                                        chain?
                                       (e.chain_tvls?convertvalue(e.chain_tvls[chain]):"--")
                                       :
                                        "--"
                                       }</span> 
                                        {e.tvl?e.updated_date_n_time ? moment(e.updated_date_n_time).fromNow():null:null}</a></td>
                                        <td>{e.mcap && e.tvl?(e.mcap/e.tvl).toFixed(5):"--"}</td>
                                      </tr>
                                )
                                :
                             <tr >
                               <td className="text-center" colSpan="4">
                                   Sorry, No related data found.
                               </td>
                             </tr>
                           }
                             </>
                             :
                             <TableContentLoader row="10" col="8" />  
                          }
                          </tbody>
                        </table>
                      </div>
                  </div> 
                  {
                    <div className="col-md-12">
                      <div className="pagination_block">
                        <div className="row">
                          <div className="col-lg-3 col-md-3  col-sm-3 col-12">
                              <p className="page_range">{firstcount}-{finalcount} of {pageCount} Pages</p>
                          </div>
                          {
                            count > per_page_count?
                          <div className="col-lg-9 col-md-9 col-sm-9 col-12">
                            <div className="pagination_div">
                              <div className="pagination_element">
                                <div className="pager__list pagination_element"> 
                                  <ReactPaginate 
                                    previousLabel={currentPage+1 !== 1 ? "←" : ""}
                                    nextLabel={currentPage+1 !== pageCount ? " →" : ""} 
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    forcePage={currentPage}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2} 
                                    onPageChange={getTVLProtocols}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"} />
                                </div> 
                              </div>
                            </div>
                          </div>
                          :
                          ""
                          }
                        </div>
                      </div>
                    </div>
                  
                 
                } 
              </div>
               
            </div>  
            </div>
        </div>
      </div>
      
      
         
              {/* <figure className="highcharts-figure">
                    <div
                      id="container"
                      style={{ height: 250, overflow: "hidden" }}
                      data-highcharts-chart={0}
                      role="region"
                      aria-label="Chart. Highcharts interactive chart."
                      aria-hidden="false"
                    >  
                    </div>
           </figure> */}
             
           {/* <p>Source: <a target={"_blank"} href="https://defillama.com/">DefiLlama</a><br/><a target={"_blank"} href="https://graphql.bitquery.io/ide">GraphQl Bitquery</a></p> */}
         
     
        </div> 
      </div>
    </div>
  </div>
  </div>
    </>
  )
} 

export async function getServerSideProps({ req }) {  
    const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
     
            return { props: {userAgent:userAgent}} 
            
} 
  
export default TokenDetails
