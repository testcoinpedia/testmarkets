import React, { useEffect, useRef, useState } from 'react'
import { API_BASE_URL, config, graphql_headers, getShortWalletAddress, separator, roundNumericValue, app_coinpedia_url, IMAGE_BASE_URL } from '../../../constants'
import Axios from 'axios'
import dynamic from "next/dynamic"

const TVChartContainer = dynamic(
	() =>
		import('./index').then(mod => mod.TVChartContainer),
	{ ssr: false },
)

export default function TradingViewWidget({reqData}) 
{
  const {symbol, dex_pair_object, contracts_array } = reqData
  // console.log("asdfreqData", reqData)
  const [currentPage, setCurrentPage] = useState(0)
  const [per_page_count, set_per_page_count] = useState(1000)
  const [count, set_count]=useState(0)
  const [trade_history, set_trade_history]=useState([])

  return (
    <div className='dex-trading-view-chart'>
       <TVChartContainer reqData={{min:5.7, max:6.7, symbol:symbol, contracts_array, token_row_id:22, pair_token_symbol:dex_pair_object.pair_token_symbol, liquidity_address:dex_pair_object.liquidity_address, network_row_id:dex_pair_object.network_row_id, liquidity_row_id:dex_pair_object._id}}/> 
    </div>
  )
}
