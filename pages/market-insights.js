
import React , {useState, useEffect} from 'react';   
import Head from 'next/head';
import "react-datetime/css/react-datetime.css"
import dynamic from 'next/dynamic'; 
const Multiselect = dynamic(
    () => import('multiselect-react-dropdown').then(module => module.Multiselect),
    {
        ssr: false
    }
)

let inputProps = {
  className: 'my_input', 
  readOnly:true
}

let inputProps2 = {
  className: 'my_input',
  readOnly:true
} 
 
var object =  {
  launch_pad_type :"", 
  title: "",
  startDate : "",
  end_date: "",
  tokens_sold: "",
  price: "",
  soft_cap: "", 
  where_to_buy_title: "",
  where_to_buy_link: "", 
  percentage_total_supply: "",
  accept_payment_type: [],
  access_type: "",
  how_to_participate: "",
  err_launch_pad_type :"" 
} 

export default function CreateLauchPad() {   

  useEffect(()=>
  { 
  
  },[])
 
  return(
    <>
        <Head>
            <title>Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap</title>
            <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
            <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
            <meta name="keywords" content="Cryptocurrency Market, cryptocurrency market sentiments, crypto market insights, cryptocurrency Market Analysis, NFT Price today, DeFi Token price, Top crypto gainers, top crypto loosers, Cryptocurrency market, Cryptocurrency Live market Price, NFT Live Chart, Cryptocurrency analysis tool." />

            <meta property="og:locale" content="en_US" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
            <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
            <meta property="og:url" content=""/>
            <meta property="og:site_name" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
            <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
            <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
            <meta property="og:image:width" content="400" />
            <meta property="og:image:height" content="400" />  
            
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content="@coinpedia" />
            <meta name="twitter:creator" content="@coinpedia" />
            <meta name="twitter:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
            <meta name="twitter:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
            <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

            <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
            <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        </Head>
        <div className="page">
            <div className="container">
                <div id="market">
                    <div className="row">
                        <div className="col-md-4">
                            <h4>Market Sentiment (Poll)</h4>
                            <div className="market_insights market_centiment">
                                <h3>What is today market centiment?</h3>
                                <ul>
                                    <li>
                                        <div className="market_bull">
                                        <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27130408/bull.svg" />
                                        </div>
                                    </li>
                                    <li>
                                        <p>OR</p>
                                    </li>
                                    <li>
                                        <div className="market_bull">
                                        <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27130406/bear.svg" />
                                        </div>
                                    </li>
                                </ul>
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="progress">
                                            <div className="progress-bar bg-success" style={{width: '70%'}}>
                                            <span>70%</span>
                                            </div>
                                            <div className="progress-bar bg-warning" style={{width: '30%'}}>
                                            <span>30%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h4>Total Crypto Market Cap</h4>
                            <div className="market_insights market_cap">
                            <div className="row">
                                <div className="col-md-6" style={{paddingRight: '5px'}}>
                                    <h5>Market Cap</h5>
                                    <div className="cap_vol">
                                        <h4>$ 98,516,158,286</h4>
                                        <h6><span className="green"><i className="fa fa-caret-up" /> 2.87%</span></h6>
                                    </div>
                                </div>
                                <div className="col-md-6" style={{paddingLeft: '5px'}}>
                                    <h5>Trading Volume</h5>
                                    <div className="cap_vol">
                                        <h4>$ 98,516,158,286</h4>
                                        <h6><span className="red"><i className="fa fa-caret-down" /> 2.87%</span></h6>
                                    </div>
                                </div>
                            </div>
                            <h5 className="dominance">Dominance BTC: <span>55%</span> ETH: <span>55%</span></h5>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h4>NFT's Volume</h4>
                            <div className="market_insights nft_volume">
                                <h4>Total NFT's Volume</h4>
                                <div className="row">
                                    <div className="col-md-6" style={{borderRight: '1px solid #ddd'}}>
                                        <h5>Art and Collectives</h5>
                                        <h6>$ 882.57 M</h6>
                                    </div>
                                    <div className="col-md-6">
                                        <h5>Gaming</h5>
                                        <h6>$ 163.57 M</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <h4>Total Value Locked</h4>
                            <div className="market_insights market_total_locked">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="network_value_block">
                                            <h6>TVL(All Networks)</h6>
                                            <h5>245.56B</h5>
                                        </div>
                                        <div className="network_value_percentage">
                                            <h4>24H Change</h4>
                                            <h4><span>13%</span></h4>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182334/aave.png" /> AAVE</h4>
                                                </td>
                                                <td>
                                                    <h5><span className="green">14%</span></h5>
                                                </td>
                                                <td><h5><span className="green">$ 15.58B</span></h5></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182336/crv.png" /> CRV</h4>
                                                </td>
                                                <td>
                                                    <h5><span className="green">14%</span></h5>
                                                </td>
                                                <td><h5><span className="green">$ 15.58B</span></h5></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182329/mkr.png" /> MKR</h4>
                                                </td>
                                                <td>
                                                    <h5><span className="green">14%</span></h5>
                                                </td>
                                                <td><h5><span className="green">$ 15.58B</span></h5></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182330/wbtc.png" /> WBTC</h4>
                                                </td>
                                                <td>
                                                    <h5><span className="green">14%</span></h5>
                                                </td>
                                                <td><h5><span className="green">$ 15.58B</span></h5></td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182333/cvx.png" /> CVX</h4>
                                                </td>
                                                <td>
                                                    <h5><span className="green">14%</span></h5>
                                                </td>
                                                <td><h5><span className="green">$ 15.58B</span></h5></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h4>Exchange Volume</h4>
                            <div className="market_insights market_total_locked">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="network_value_block">
                                            <h6>Total Exchange Volume</h6>
                                            <h5>$ 987 B</h5>
                                        </div>
                                        <div className="network_value_percentage">
                                            <h4>Spot market share.</h4>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182334/aave.png" /> AAVE</h4>
                                                </td>
                                                <td>
                                                    <h5><span>$ 39.90B</span></h5>
                                                </td>
                                                <td>
                                                    <h5><span className="green">61.68%</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182336/crv.png" /> CRV</h4>
                                                </td>
                                                <td>
                                                    <h5><span>$ 39.90B</span></h5>
                                                </td>
                                                <td>
                                                    <h5><span className="green">61.68%</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182329/mkr.png" /> MKR</h4>
                                                </td>
                                                <td>
                                                    <h5><span>$ 39.90B</span></h5>
                                                </td>
                                                <td>
                                                    <h5><span className="green">61.68%</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182330/wbtc.png" /> WBTC</h4>
                                                </td>
                                                <td>
                                                    <h5><span>$ 39.90B</span></h5>
                                                </td>
                                                <td>
                                                    <h5><span className="green">61.68%</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182333/cvx.png" /> CVX</h4>
                                                </td>
                                                <td>
                                                    <h5><span>$ 39.90B</span></h5>
                                                </td>
                                                <td>
                                                    <h5><span className="green">61.68%</span></h5>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h4>Stable Coins Supply</h4>
                            <div className="market_insights market_total_locked">
                                <div className="row">
                                    <div className="col-md-5">
                                        <div className="network_value_block">
                                            <h6>Total Supply</h6>
                                            <h5>$ 245.56B</h5>
                                        </div>
                                        <div className="network_value_percentage">
                                            <h4>All Stable Coins</h4>
                                            <h4><span>57</span></h4>
                                        </div>
                                    </div>
                                    <div className="col-md-7">
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182334/aave.png" /> AAVE</h4>
                                                </td>
                                                <td>
                                                    <h5><span>98,745,698,589</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182336/crv.png" /> CRV</h4>
                                                </td>
                                                <td>
                                                    <h5><span>98,745,698,589</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182329/mkr.png" /> MKR</h4>
                                                </td>
                                                <td>
                                                    <h5><span>98,745,698,589</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182330/wbtc.png" /> WBTC</h4>
                                                </td>
                                                <td>
                                                    <h5><span>98,745,698,589</span></h5>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <h4><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/27182333/cvx.png" /> CVX</h4>
                                                </td>
                                                <td>
                                                    <h5><span>98,745,698,589</span></h5>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <h4>Options Bitcoin Data</h4>
                            <div className="market_insights market_cap">
                                <div className="row">
                                    <div className="col-md-6" style={{paddingRight: '5px'}}>
                                    <h5>Volume</h5>
                                    <div className="cap_vol">
                                        <h4>$14.68 B</h4>
                                        <h6><span className="green">Debit <i className="fa fa-caret-up" /> 2.87%</span></h6>
                                    </div>
                                </div>
                                <div className="col-md-6" style={{paddingLeft: '5px'}}>
                                    <h5>Open Interest</h5>
                                    <div className="cap_vol">
                                        <h4>$26.85 B</h4>
                                        <h6><span className="green">Debit <i className="fa fa-caret-up" /> 2.87%</span></h6>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <h4>Futures Bitcoin Data</h4>
                            <div className="market_insights future_bitcoin_data">
                                <div className="row">
                                    <div className="col-md-4 bitcoin_volume">
                                        <h4>Bitcoin Volume</h4>
                                        <h5>Spot market sha</h5>
                                        <h6>$1.62 Tr</h6>
                                    </div>
                                    <div className="col-md-4 open_interest">
                                        <h4>Open Interest</h4>
                                        <h5>Spot market sha</h5>
                                        <h6>$1.62 Tr</h6>
                                    </div>
                                    <div className="col-md-4 liquidation">
                                        <h4>Liqudation</h4>
                                        <div className="row">
                                            <div className="col-md-6" style={{paddingLeft: '5px', paddingRight: '5px'}}>
                                                <h5>Short</h5>
                                                <h6 className="red">-10.87 M</h6>
                                            </div>
                                            <div className="col-md-6" style={{paddingLeft: '5px', paddingRight: '5px'}}>
                                                <h5>Long</h5>
                                                <h6 className="green">66 M</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <h4>Ethereum Fee Burn</h4>
                            <div className="market_insights market_eth_fee_burn">
                                <div className="row">
                                    <div className="col-md-7">
                                        <h5><span>Fee Burn</span></h5>
                                        <h4>638,275,154.85 ETH</h4>
                                    </div>
                                    <div className="col-md-5" style={{paddingLeft: 0}}>
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                            <a className="nav-link active" data-toggle="tab" href="#eth1h">1H</a>
                                            </li>
                                            <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#eth24h">24H</a>
                                            </li>
                                            <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#eth1w">1W</a>
                                            </li>
                                            <li className="nav-item">
                                            <a className="nav-link" data-toggle="tab" href="#ethall">ALL</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="tab-content">
                                    <div className="tab-pane container fade show active" id="eth1h">
                                        <div className="row">
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane container fade" id="eth24h">
                                        <div className="row">
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane container fade" id="eth1w">
                                        <div className="row">
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane container fade" id="ethall">
                                        <div className="row">
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                            <div className="col-md-4">
                                            <h5><span>Burn Rate</span></h5>
                                            <h6>5.35 ETH/min</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <h4>Gas Fees Comparision</h4>
                            <div className="market_insights market_gas_value">
                                <table className="table">
                                    <thead>
                                        <tr>
                                        <th>Network</th>
                                        <th>Slow</th>
                                        <th>Standard</th>
                                        <th>Fast</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                        <td>
                                            <h4>Ethereum</h4>
                                            <h5>(ETH)</h5>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <h4>Binance</h4>
                                            <h5>(BSC)</h5>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        </tr>
                                        <tr>
                                        <td>
                                            <h4>Tron</h4>
                                            <h5>(TRX)</h5>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        <td className="gas_value">
                                            <h5><img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29112025/gas_fee.png" /> 88 Gwei</h5>
                                            <h6>~195 Sec</h6>
                                        </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <h4>Number of active addresses</h4>
                            <div className="market_insights market_eth_fee_burn active_addresses">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="media">
                                            <img className="mr-3" src="https://image.coinpedia.org/wp-content/uploads/2021/10/29164011/btc.png" alt="btc" />
                                            <div className="media-body">
                                            <h5 className="mt-0">Bitcoin</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5" style={{paddingLeft: 0}}>
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                                <a className="nav-link active" data-toggle="tab" href="#fee1d">1D</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" data-toggle="tab" href="#fee1w">1W</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link " data-toggle="tab" href="#fee1m">1M</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            
                                <div className="tab-content">
                                    <div className="tab-pane container fade active show" id="fee1d">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h5>Active Address<span>701,621</span></h5>
                                                <h5>Price<span>701,621</span></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171916/graph.png" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane container fade" id="fee1w">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h5>Active Address<span>701,621</span></h5>
                                                <h5>Price<span>701,621</span></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171916/graph.png" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane container fade" id="fee1m">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h5>Active Address<span>701,621</span></h5>
                                                <h5>Price<span>701,621</span></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171916/graph.png" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="view_all_coins"><a href="#">View all Coins</a></p>
                                    </div>
                                    <div className="col-md-6">
                                        <img className="glass-node" src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171919/glassnode.png" />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-md-4">
                            <h4>Balances addresses</h4>
                            <div className="market_insights market_eth_fee_burn active_addresses">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="media">
                                            <img className="mr-3" src="https://image.coinpedia.org/wp-content/uploads/2021/10/29164011/btc.png" alt="btc" />
                                            <div className="media-body">
                                            <h5 className="mt-0">Bitcoin</h5>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5" style={{paddingLeft: 0}}>
                                        <ul className="nav nav-tabs">
                                            <li className="nav-item">
                                                <a className="nav-link active" data-toggle="tab" href="#active1">0.01&gt;</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link" data-toggle="tab" href="#active9">0.9&gt;</a>
                                            </li>
                                            <li className="nav-item">
                                                <a className="nav-link " data-toggle="tab" href="#active15">1.5&gt;</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="tab-content">
                                    <div className="tab-pane container fade active show" id="active1">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h5>Active Address <span>701,621</span></h5>
                                                <h5>Balance <span>1,621 BTC</span></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171916/graph.png" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane container fade" id="active9">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h5>Active Address <span>701,621</span></h5>
                                                <h5>Balance <span>1,621 BTC</span></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171916/graph.png" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane container fade" id="active15">
                                        <div className="row">
                                            <div className="col-md-7">
                                                <h5>Active Address <span>701,621</span></h5>
                                                <h5>Balance <span>1,621 BTC</span></h5>
                                            </div>
                                            <div className="col-md-5">
                                                <img src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171916/graph.png" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <p className="view_all_coins"><a href="#">View all Coins</a></p>
                                    </div>
                                    <div className="col-md-6">
                                        <img className="glass-node" src="https://image.coinpedia.org/wp-content/uploads/2021/10/29171919/glassnode.png" />
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
