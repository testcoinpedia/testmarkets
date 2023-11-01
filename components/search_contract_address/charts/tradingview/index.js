import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.css'
import { widget, version } from '../../../../public/static/charting_library'
import { Datafeed } from './datafeed'
 

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
    const { symbol, network_row_id, contract_address } = reqData

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
			datafeed: Datafeed({ symbol, network_row_id, contract_address }),
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
		
		const tvWidget = new widget(widgetOptions)
        tvWidget.onChartReady(() => 
		{
			tvWidget.headerReady().then(() => {
			})
		})

    },[])


    return (
		<div ref={chartContainerRef} className={styles.TVChartContainer+" trading-view__container"} />
	)

}