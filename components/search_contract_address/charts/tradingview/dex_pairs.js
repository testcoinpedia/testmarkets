import React from 'react'

import dynamic from "next/dynamic"

const TVChartContainer = dynamic(
	() =>
		import('./index').then(mod => mod.TVChartContainer),
	{ ssr: false },
)

export default function TradingViewWidget({reqData}) 
{
  return (
    <div className='dex-trading-view-chart'>
       <TVChartContainer reqData={reqData}/> 
    </div>
  )
}
