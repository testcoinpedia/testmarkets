import React, { useState, useRef, useEffect } from 'react'
import Axios from 'axios'  
import dynamic from 'next/dynamic'
// import ReactApexChart from 'react-apexcharts'
// import moment from 'moment'
import { API_BASE_URL, config, graphql_headers, getShortWalletAddress, separator, roundNumericValue, app_coinpedia_url, IMAGE_BASE_URL } from '../../components/constants'
// import { tokenBasic, otherDetails, getVolume24h, getHighLow24h } from '../../search_contract_address/live_price'
import { getLiquidityAddresses, getBalanceAddresses, tradeHistory } from '../token_details/liquidity/queries'
import TableContentLoader from '../loaders/tableLoader'

export default function Exchange({reqData})
{   
    const { network_row_id,contracts_address, token_image,  token_name,token_symbol, token_price, fetch_data_type} = reqData
    const [liquidity_pools, set_liquidity_pools] = useState([])
    const [token_basic, set_token_basic] = useState({})
    const [loader_status, set_loader_status] = useState(true)
    const [image_base_url] = useState(IMAGE_BASE_URL+'/markets/cryptocurrencies/')
    const [contract_copy_status, set_contract_copy_status] = useState(false)
    const [total_balance_in_token, set_total_balance_in_token] = useState(0)
    const [total_addresses, set_total_addresses] = useState(0)
    const [trade_history_list, set_trade_history_list] = useState([])
    const [series_values, set_series_values]=useState([])
    const [labels_values, set_labels_values]=useState([])
    const[positiveValue,setPositiveValue]=useState(0);
    const[negativeValue,setNegativeValue]=useState(0);

 
    const [token_allocation_colors, set_token_allocation_colors]= useState(['#0088FE', '#00C49F', '#FFBB28', '#4b51cb', '#CF61B0','#909090','#5D69B1','#24796C','#E88310','#2F8AC4','#764E9F','#ED645A','#CC3A8E','#C1C1C1','#66C5CC','#F89C74','#DCB0F2','#87C55F','#9EB9F3','#FE88B1','#8BE0A4','#B497E7',
    '#D3B484','#B3B3B3','#E10B64','#E92828','#78B4A4','#604F00','#0060E9','#FF7DE3','#20c997','#6f42c1'])
    console.log("reqData", reqData)
    const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

var value = {
    
    series: series_values,
    labels: labels_values,
    options: {
        chart: {
           
            type: 'donut',
        },
        fill: {
            type: 'gradient',
        }
    }
}

const arrangePiChartData = async ({list_data, grand_liquidity_value}) =>
{   
    var labels = []
    var series = []
    //pair_token_address
    
    var m = 0
    var total_percentage_value = 0
    for(let run of list_data)
    { 
        if(m < 9)
        {      
            const percentage_value = parseFloat(((run.total_liqudity/grand_liquidity_value)*100).toFixed(2))
            total_percentage_value += percentage_value
            await labels.push(run.pair_token_symbol+"-"+getShortWalletAddress(run.liquidity_address, 4))
            await series.push(percentage_value)
        }
        m++ 
    }
    if(total_percentage_value < 100)
    {
        await labels.push("Other pools")
        await series.push(parseFloat((100-parseFloat(total_percentage_value)).toFixed(2)))
    }

    return await {series, labels}
}

const copyContract = (data) => 
{
    set_contract_copy_status(data)
    var copyText = document.createElement("input")
    copyText.value = data
    document.body.appendChild(copyText)
    copyText.select()
    document.execCommand("Copy")
    copyText.remove()
    setTimeout(() => set_contract_copy_status(""), 3000)
}


useEffect(() => 
{   
   getLiquidityDetails()
//    progressbar()
   
}, [])


const getLiquidityDetails = async () =>
{   
    var total_liquidity_value = 0
    var total_balance_in_token_var = 0
    // var total_addresses = 0
    var grand_liquidity_value = 0
    
    
    if(contracts_address)
    {   
        var i=0
        var final_result =[]
        var live_price_object = { pair_token_balance:0, pair_token_price:0, token_balance:0, percent_change_24h:0 }
         
            if(contracts_address.includes(network_row_id))
            {
                
              
                    
                 

            
                const response = await getLiquidityAddresses(network_row_id,contracts_address)
                console.log("get liquidity addresses", response)
               
                if(response.status)
                {   
                    var balances_result = []
                    const first_response = await getBalanceAddresses(response.message)
                    if(first_response.status)
                    {
                        balances_result = first_response.message
                    }
                    const price_list = await priceList(response.message.token_symbols, response.message.token_addresses)
                    
                    for(let run of response.message.liquidity_list)
                    {   
                        const filter_data = await balances_result.filter(function (el) { return el.address == run.liquidity_address})
                        var pair_token_balance = 0
                        var token_balance = 0
                        if(filter_data[0])
                        {   
                            if(filter_data[0].balances)
                            {
                                const addr_balance_array = await filter_data[0].balances.filter(function (el) { return el.currency.address == contracts_address.toLowerCase()})
                                if(addr_balance_array[0])
                                {
                                    token_balance = addr_balance_array[0]?.value
                                }
                                

                                const pair_balance_array = await filter_data[0].balances.filter(function (el) { return el.currency.address == (run.pair_token_address).toLowerCase()})
                                pair_token_balance = pair_balance_array[0]?.value
                            }
                        }
                        var pair_token_price = 0
                        var pair_token_image = ""
                        var percent_change_24h = 0
                        const price_array = await price_list.filter(function (el) { return (el.symbol.toUpperCase()) == (run.pair_token_symbol).toUpperCase()})
                        if(price_array[0])
                        {
                            pair_token_price = price_array[0]?.price
                            pair_token_image = price_array[0]?.token_image
                            percent_change_24h = price_array[0]?.percent_change_24h
                        }
                        
                        total_balance_in_token_var += await token_balance
                        total_liquidity_value +=pair_token_balance+token_balance
                        
                        if(i === 0)
                        {
                            live_price_object = await { pair_token_balance, pair_token_price, token_balance, percent_change_24h }
                            // calLivePriceValue({pair_token_balance, pair_token_price, token_balance, percent_change_24h})
                        }
                        
                        var network_link = ""
                        
                        if(network_row_id == 2)
                        {
                            network_link = "https://bscscan.com/address/"
                          
                        }
                        else if(network_row_id == 14)
                        {
                            network_link = "https://polygonscan.com/address/"
                        }
                        else 
                        {
                            network_link = "https://etherscan.io/address/"
                        }

                        

                        var total_liqudity = 0
                        if(pair_token_image)
                        {
                            if(token_price)
                            {
                                total_liqudity = (((pair_token_balance && pair_token_price ? pair_token_balance*pair_token_price:0)+(token_balance && token_price ? token_price*token_balance:0)).toFixed(2))
                            }
                            else
                            {
                                total_liqudity = (((pair_token_balance && pair_token_price ? pair_token_balance*pair_token_price:0)+(pair_token_balance && pair_token_price ? pair_token_balance*pair_token_price:0)).toFixed(2))
                            }
                        }
                        
                        if((token_balance >= 1) && (pair_token_balance >= 1) && run.pair_token_symbol)
                        {
                            grand_liquidity_value = parseFloat(grand_liquidity_value)+parseFloat(total_liqudity)

                            await final_result.push({
                                network_row_id:network_row_id,
                                network_link: network_link,
                                // network_name:network_name,
                                // network_image:network_image,
                                exchange_name : run.exchange_name,
                                liquidity_address : run.liquidity_address,
                                pair_token_address : run.pair_token_address,
                                pair_token_name : run.pair_token_name,
                                pair_token_symbol : run.pair_token_symbol,
                                trade_amount : run.trade_amount,
                                trades : run.trades,
                                pair_token_balance: pair_token_balance,
                                pair_token_price: pair_token_price,
                                token_price:token_price,
                                token_symbol:token_symbol,
                                token_name:token_name,
                                pair_token_image:pair_token_image,
                                token_balance: token_balance,
                                total_liqudity:total_liqudity
                            })
                            i++
                        }
                    }
                   console.log("final_result", final_result)
                   
                }
                else
                {
                    set_loader_status(false)
                }
            
            }
        
       
        await set_total_balance_in_token(total_balance_in_token_var)
        
        await set_loader_status(false) 

        const asdfasf = await final_result.sort(function (x, y) {
            return y.total_liqudity - x.total_liqudity;
        })
        
        await set_liquidity_pools(final_result)
        console.log("grand_liquidity_value", grand_liquidity_value)
        const {series, labels} = await arrangePiChartData({list_data:final_result, grand_liquidity_value})
        await set_series_values(series)
        await set_labels_values(labels)

       


        // await reqData.callback({
        //     price : live_price_object.token_balance ? (live_price_object.pair_token_balance*live_price_object.pair_token_price)/live_price_object.token_balance:0,
        //     percent_change_24h : live_price_object.percent_change_24h ? live_price_object.percent_change_24h:0,
        //     total_balance_in_token : total_balance_in_token_var, 
        //     count_liquidity_pools : final_result.length
        // })
        await updateInBackend(final_result)
    }
    else
    {
        set_loader_status(false)
    }
}

const calLivePriceValue = async ({pair_token_balance, pair_token_price, token_balance, percent_change_24h}) =>
{   
    if(fetch_data_type == 2)
    {
        
        reqData.callback({
            price : (pair_token_balance*pair_token_price)/token_balance,
            percent_change_24h :percent_change_24h
        })
    }
    // else if(fetch_data_type==1){
    //     await reqData.callback({
    //         price : live_price_object.token_balance ? (live_price_object.pair_token_balance*live_price_object.pair_token_price)/live_price_object.token_balance:0,
    //         percent_change_24h : live_price_object.percent_change_24h ? live_price_object.percent_change_24h:0,
    //         total_balance_in_token : total_balance_in_token_var, 
    //         count_liquidity_pools : final_result.length
    //     })
    // }
   
}

const priceList = async (token_symbols, token_addresses) =>
{
    var prices_array = []
    // var prices_array_using_addresses = []
    const prices_res = await Axios.post(API_BASE_URL + "markets/cryptocurrency/get_prices_by_symbols/", {token_symbols, token_addresses}, config())
    if(prices_res.data.status) 
    {
        prices_array = await prices_res.data.message

        console.log("prices_res", prices_res)
    }
    return prices_array
}

const updateInBackend = async (pass_data) =>
{
   const response = await Axios.post("/api/liquidity/addresses/", { addresses:pass_data})
   console.log("response", response)
}


// const progressbar=(total,positiveCount)=>{
//     total=5;
//     positiveCount=4;
//     const positiveValue=(positiveCount/total*100)
//     const negativeValue=(100-positiveValue)

//     console.log("positiveValue",positiveValue,"%" +"negativeValue",negativeValue,"%")
// }



return(
<>

{/* 
    <div className='container'>
        <div className="progress">
  <div className="progress-bar  bg-success" role="progressbar" aria-valuenow="0"aria-valuemin="0" aria-valuemax="100"
 style={{width:`${positiveValue}%`}} >{positiveValue.toFixed(0)}%</div>
</div>
<div className="progress">
  <div className="progress-bar bg-danger" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"
 style={{width:`${negativeValue}%`}} >{negativeValue.toFixed(0)}%</div>
</div>

    </div> */}

{/* <div className='row ml-1 mb-4'>
 <div className='col-md-4'>
    <p>Pools Addresses: </p>
    <h6></h6>
</div>
<div className='col-md-4'>
    <p>{token_name} Total Balance: </p>
    <h6>
        {
            total_balance_in_token ?
            <>
            {roundNumericValue((total_balance_in_token))} {token_symbol}
            </>
            :
            "-"
        }
    </h6>
</div>


<div className='col-md-4'>
    <p>Dex Market Cap</p>
<h6>
    {
        total_balance_in_token && token_price ?
        "$"+roundNumericValue((total_balance_in_token*token_price))
        :
        "-"
    }
</h6>
</div> 
</div> */}
{   
    !loader_status ?
        liquidity_pools.length ?
        <div className='row'>
            <div className='col-md-5 mt-5'>
            
                <h6>Dex top {token_name} liquidity distribution pie chart. </h6>
                <p>How much top liquidity pools is available on decentralized exchanges(DEXes) for the selected paired token.</p>
            </div>
            <div className='col-md-7'>
            <div className='pools-pair-chart pt-0 pb-0'>
                    
                    {
                        series_values.length && labels_values.length ?
                        <ReactApexChart options={value} series={series_values} type="donut" />
                    
                        // <ReactApexChart options={value} series={series_values} type="donut" />
                        :
                        ""
                    }
                    </div>
            </div>
        </div>
        :
        ""
    :
    ""
}


<h6 className='mt-2'>Liquidity Pools list {liquidity_pools.length? <>({liquidity_pools.length})</>:""}</h6>
 <div className='market_page_data exchange_table'>
        <div className='table-responsive'>
        <table className='table table-borderless'>
            <thead>
                <tr>
                    {/* <th style={{minWidth: '35px'}}>#</th> */}
                    <th>Pairs</th>
                    <th>Liquidity Balance</th>
                    <th>Exchange</th>
                    {/* <th>Network</th> */}
                    <th>Total Liquidity</th>
                </tr>
            </thead>
            <tbody>
                {
                    !loader_status ?
                    liquidity_pools.length ?
                    liquidity_pools.map((item, i) => 
                    <tr>
                        {/* <tr>
                          {
                            1+i
                          }  
                        </tr> */}
                           <td>
                        <div className="media mb-2">
                            <div className="media-left mr-0">
                                <img className="media-object" style={{width:"25px"}} src={( token_image ? image_base_url+token_image:image_base_url+"ethereum.svg")} onError={(e) =>e.target.src = "/assets/img/ethereum.svg"} />
                            </div>
                            <div className="media-body">
                                <h4>{item.token_symbol}</h4>
                            </div>
                        </div>
                      
                        <div className="media">
                            <div className="media-left mr-0">
                            <img className="media-object" style={{width:"25px"}} src={(item.pair_token_image ? image_base_url+item.pair_token_image: image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} />
                            </div>
                            <div className="media-body">
                                <h4>{item.pair_token_symbol} </h4>
                            </div>
                        </div>
                          {/* */}
                        {/* <small>{getShortWalletAddress(address)}</small> */}
                        {/* <small>{getShortWalletAddress(item.pair_token_address)}</small> */}
                        
                           
                            {/* {item.token_name} */}
                        </td>
                        <td>
                            {item.token_balance? separator((item.token_balance).toFixed(2)):0}
                            <br/>
                            {item.pair_token_balance ? separator((item.pair_token_balance).toFixed(2)):0}
                        </td>
                         <td className='mobile_fixed_first'>
                                {
                                    item.network_link ?
                                    <>
                                    <h4 className="media-heading"><a rel="nofollow" href={item.network_link+item.liquidity_address} target="_blank">{item.exchange_name}</a></h4>
                                    <p><a style={{borderBottom: "1px solid"}} rel="nofollow" href={item.network_link+item.liquidity_address} target="_blank">{getShortWalletAddress(item.liquidity_address)} </a></p>
                                    </>
                                    :
                                    <>
                                    <h4 className="media-heading">{item.exchange_name}</h4>
                                    <p>{getShortWalletAddress(item.liquidity_address)}</p>
                                    </>
                                }
                        </td>
                        {/* <td>
                        <img style={{width:"20px"}} src={(item.network_image ? image_base_url+item.network_image : image_base_url+"default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.network_name} className="media-object" /> <span className='mt-1'>{
                                item.network_name == "BNB Smart Chain (BEP20)" ?
                                "BSC"
                                :
                                item.network_name
                            
                            }</span>
                        
                       
                        </td> */}
                        
                       
                     
                      
                        <td>
                            {
                                item.pair_token_image ? 
                                <>
                                {
                                    item.token_price ?
                                    <>
                                    $ {separator(((item.pair_token_balance && item.pair_token_price ? item.pair_token_balance*item.pair_token_price:0)+(item.token_balance && item.token_price ? item.token_price*item.token_balance:0)).toFixed(2))
                                    }
                                    </>
                                    :
                                    <>
                                    $ {
                                    separator(((item.pair_token_balance && item.pair_token_price ? item.pair_token_balance*item.pair_token_price:0)+(item.pair_token_balance && item.pair_token_price ? item.pair_token_balance*item.pair_token_price:0)).toFixed(2))
                                    }
                                    </>
                                }
                                </>
                                :
                                "-"
                            }
                        </td>
                        
                    </tr>
                    )
                    :
                    <tr>
                        <td colSpan={5} className='text-center'>No related data found.</td>
                    </tr>
                    :
                    <TableContentLoader row="10" col="5" />         
                }
                
            </tbody>
        </table>  
        </div>
        </div>  

  {/* <div className=''>
  <div className="accordion" id="assetview">

  {
    liquidity_pools.length ?
    liquidity_pools.map((item, i) =>
    <div className="card">
            <div className="card-header liquidity-pools" id={"headingOne"+i} data-toggle="collapse" data-target={`#collapseOne`+i} aria-expanded="false" aria-controls={`collapseOne`+i}>
                <div className="row">
                    <div className="col-md-5 col-5">
                        <div className="media mb-2">
                            <div className="media-left mr-0">
                                <img className="media-object token-image" src={( token_image ? image_base_url+token_image:image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} />
                            </div>
                            <div className="media-body">
                                <h4><>{item.token_symbol}</> <span className='pooled-span'>Pooled</span> -  {item.token_balance? separator((item.token_balance).toFixed(2)):0}</h4>
                            </div>
                        </div>
                        
                        <div className="media">
                            <div className="media-left mr-0">
                            <img className="media-object token-image" src={(item.pair_token_image ? image_base_url+item.pair_token_image: image_base_url+"default.svg")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} />
                            </div>
                            <div className="media-body">
                                <h4><>{item.pair_token_symbol}</> <span  className='pooled-span'>Pooled</span> - {item.pair_token_balance ? separator((item.pair_token_balance).toFixed(2)):0} 
                                </h4>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-3 col-3">
                        {
                            item.network_link ?
                            <>
                            <h3 className='exchange-h3'><a rel="nofollow" href={item.network_link+item.liquidity_address} target="_blank">{item.exchange_name}</a></h3>
                            <p><a  rel="nofollow" href={item.network_link+item.liquidity_address} target="_blank"><img style={{width:"16px"}} src={(item.network_image ? image_base_url+item.network_image : image_base_url+"default.png")} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={item.network_name} className="network-img media-object" /> <span style={{borderBottom: "1px solid"}}>{getShortWalletAddress(item.liquidity_address)} </span>
                            </a></p>
                            </>
                            :
                            <>
                            <h3 className='exchange-h3'>{item.exchange_name}</h3>
                            <p>{getShortWalletAddress(item.liquidity_address)}
                            &nbsp;  ({
                                item.network_name == "BNB Smart Chain (BEP20)" ?
                                "BSC"
                                :
                                item.network_name
                            
                            })
                            </p>
                            </>
                        }
                   </div>    
                    <div className="col-md-4 col-4">
                        <div className="media">
                        <div className="media-body mt-2">
                        <p >Total Liquidity</p>
                        <h6 className='liquidity-price'>
                             {
                                item.token_price ?
                                <>
                                $ {separator(((item.pair_token_balance && item.pair_token_price ? item.pair_token_balance*item.pair_token_price:0)+(item.token_balance && item.token_price ? item.token_price*item.token_balance:0)).toFixed(2))
                                }
                                </>
                                :
                                <>
                                $ {
                                separator(((item.pair_token_balance && item.pair_token_price ? item.pair_token_balance*item.pair_token_price:0)+(item.pair_token_balance && item.pair_token_price ? item.pair_token_balance*item.pair_token_price:0)).toFixed(2))
                                }
                                </>
                            }
                        </h6>
                        </div>

                        <div className="media-right mr-2 mt-2">
                            <span onClick={()=>getTradeHistory(item.network_row_id, item.liquidity_address)}>
                             <img src="/assets/img/filter_dropdown_white.svg"  alt="Filter" className="accordion_arrow collapsed" />
                            </span>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id={`collapseOne`+i} className="collapse" aria-labelledby={"headingOne"+i} data-parent="#assetview">
            <div className="card-body portfolio_card">
            <h6>Trade History</h6>
            <div className="profile_page_table">
                <div className="table-responsive">
                    <table className="table table-striped">
                    <thead>
                        <tr>
                            <th className="">#</th>
                            <th className="">Date</th>
                            <th className="mobile_hide">Amount in {token_symbol} </th>
                            <th className="">Price USD</th>
                            <th className="total_balance portfolio_mobile_right">Maker</th>
                            <th className="mobile_hide">Txns</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            trade_history_list.length ?
                            trade_history_list.map((innerItem, i) =>
                                <tr>
                                    <td>{1+i}</td>
                                    <td>{moment(innerItem.block.timestamp.time).format('lll')}</td>
                                    <td>{(innerItem.amount).toFixed(2)}</td>
                                    <td>$ {(separator((innerItem.amount*token_price).toFixed(2)))}</td>
                                    <td><a href={(item.network_row_id == 6 ? "https://etherscan.io/address/":"https://bscscan.com/address/")+innerItem.transaction.txFrom.address}  target='_blank'>{getShortWalletAddress(innerItem.transaction.txFrom.address)}</a></td>
                                    <td><a href={(item.network_row_id == 6 ? "https://etherscan.io/tx/":"https://bscscan.com/tx/")+innerItem.transaction.hash} target='_blank' className="badge badge-primary">View Txn</a></td> 
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
        </div>
        </div>
    )
    :
    ""
    }
</div>
</div>   */}
</>            
)
}
