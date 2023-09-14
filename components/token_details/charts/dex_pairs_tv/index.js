import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { widget, version } from '../../../../public/static/charting_library'
import { Datafeed } from './datafeed'
import { tradeHistoryForTV } from '../../liquidity/queries'
import { API_BASE_URL, config } from '../../../constants'
import moment from 'moment'
import Axios from 'axios' 

function getLanguageFromURL() 
{
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

const configurationData = {
    supported_resolutions: ['1', '3','5', '10','15', '30', '60','1D', '1W', '1M']
}

export const TVChartContainer = ({reqData}) =>
{   
    const [count, set_count] = useState(0)
    const { symbol, liquidity_row_id, min, max, token_row_id, network_row_id, liquidity_address, contracts_array, pair_token_symbol } = reqData
    const [per_page_count, set_per_page_count] = useState(1000)
    const [page_offset, set_page_offset] = useState(0)
    const [data_add_status, set_data_add_status] = useState(true)
    const [resolution_value, set_resolution_value] = useState(30)

   // console.log("offset", reqData)

    const chartContainerRef = useRef()
    const defaultProps = {
		symbol: 'UNI',
		interval: '30M',
		// datafeedUrl: 'https://demo_feed.tradingview.com',
		libraryPath: '/static/charting_library/',
		chartsStorageUrl: 'https://saveload.tradingview.com',
		chartsStorageApiVersion: '1.1',
		clientId: 'tradingview.com',
		// userId: 'Neha',
		fullscreen: false,
		autosize: true,
		studiesOverrides: {},
	}

    useEffect(() => 
    {
        const widgetOptions = {
			symbol: symbol,
			minmov: 1,
			timezone: 'Asia/Kolkata',
			// theme:"dark",
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: Datafeed({symbol, liquidity_row_id, network_row_id, liquidity_address, contracts_array, pair_token_symbol}),
			interval: defaultProps.interval,
            container: chartContainerRef.current,
			library_path: defaultProps.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['widget_logo', 'show_trading_notifications_history', 'timeframes_toolbar', 'use_localstorage_for_settings', 'header_symbol_search','header_compare', 'header_saveload', 'go_to_date', 'add_to_watchlist'],
			enabled_features: ['chart_zoom'],
			chart_zoom:60,
			pricescale: 10000000,
			has_intraday: true,
			high_density_bars:false,
			charts_storage_url: defaultProps.chartsStorageUrl,
			charts_storage_api_version: defaultProps.chartsStorageApiVersion,
			client_id: defaultProps.clientId,
			supports_timescale_marks:true,
			force_overlay:true,
			fullscreen: defaultProps.fullscreen,
			// autoScale:'On',
			autosize: defaultProps.autosize,
			studies_overrides: defaultProps.studiesOverrides,
		}
		
		
		//console.log("widgetOptions", widgetOptions)

		const tvWidget = new widget(widgetOptions);
		
		  

        tvWidget.onChartReady(() => {
			// tvWidget.applyOverrides({ autoScale: true});
			

			tvWidget.headerReady().then(() => {
				//

				// tvWidget.priceScale('right').applyOptions({
				// 	autoScale: true,
				//   });

				// const button = tvWidget.createButton();
				// button.setAttribute('title', 'Click to show a notification popup');
				// button.classList.add('apply-common-tooltip');
				// button.addEventListener('click', () => tvWidget.showNoticeDialog({
				// 	title: 'Notification',
				// 	body: 'TradingView Charting Library API works correctly',
				// 	callback: () => {
				// 		console.log('Noticed!');
				// 	},
				// }));

				

				// const button = tvWidget.createButton()
				// button.innerHTML = "Max : $"+max
				// button.classList.add('btn-max')
				// button.style.color = "#19b196"
				
				// const button2 = tvWidget.createButton()
				// button2.innerHTML = "Min : $"+min
				// button2.style.color = "#F44336"
				// button2.classList.add('btn-min')

			});
		});

        // return () => {
		// 	tvWidget.remove();
		// };

    },[])


    return (
		<div ref={chartContainerRef} className={styles.TVChartContainer+" trading-view__container"} />
	)

}