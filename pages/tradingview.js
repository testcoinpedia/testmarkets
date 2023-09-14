import React, {useEffect, useState, useRef} from 'react'
import dynamic from "next/dynamic"
import { API_BASE_URL, roundNumericValue, config, getShortWalletAddress, app_coinpedia_url, separator , market_coinpedia_url, graphqlApiKEY, count_live_price, Logout} from '../components/constants' 
import Axios from 'axios'
import moment from 'moment' 

const TVChartContainer = dynamic(
	() =>
		import('../components/tradingview_chart').then(mod => mod.TVChartContainer),
	{ ssr: false },
)
export default function Index() 
{	
	const [trade_history_list, set_trade_history_list] = useState([]) 

	useEffect(()=>
	{ 	
		//getTradeHistory()
	},[]) 

	const getTradeHistory = async () =>
	{
		const response = await Axios.get('http://localhost:3010/')
		if(response.data.status)
		{ 
			set_trade_history_list(response.data.message)
		}
	}

	return (
		<>
			<TVChartContainer reqData={{min:5.7, max:6.7, symbol:"UNI", token_row_id:22, liquidity_row_id:1525}}/>
			
			{/* <div className='container mt-2'>
				<div className="table-responsive">
						<table className="table">
							<thead>
								<tr>
									<th className="mobile_hide_view" style={{minWidth: '15px'}}>#</th>
									<th>tx type</th>
									<th>date_n_time</th>
									<th>Price USD</th>
									
									<th>token_amount</th>
									<th>token_price</th>
								</tr>
							</thead>
							<tbody>
								<>
								{
									trade_history_list.length > 0 ?
									trade_history_list.map((item, i) => 
									<tr key={i}>
											<td className="mobile_hide_view wishlist"> {i+1}
											</td>
											<td>
											{
											item.tx_type == 1 ? 
											<span className='red'>buy</span>
											:
											<span className='green'>sell</span>
											}
											</td>
											<td>{moment(item.date_n_time).format('YYYY-MM-DD hh:mm:ss')}</td>
											<td>${roundNumericValue((item.token_amount*item.token_price))} </td>
											<td>{roundNumericValue(item.token_amount)} UNI</td>
											<td>${roundNumericValue(item.token_price)}</td>
											
									</tr> 
									) 
									:
									<tr >
									<td className="text-lg-center text-md-left" colSpan="12">
										Sorry, No related data found.
									</td>
									</tr>
								}
								</>
							</tbody>
						</table>
						</div>
			</div> */}
		</>
	)
}
