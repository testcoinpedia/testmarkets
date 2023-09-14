import * as React from 'react';
import styles from './index.module.css';
import { widget, version } from '../../public/static/charting_library'
import { Datafeed } from './datafeed'
import moment from 'moment'
import Axios from 'axios' 

function getLanguageFromURL() 
{
	const regex = new RegExp('[\\?&]lang=([^&#]*)');
	const results = regex.exec(window.location.search);
	return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

export class TVChartContainer extends React.PureComponent 
{
	static defaultProps = {
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
	tvWidget = null

	constructor(props) 
	{
		super(props)
		this.ref = React.createRef()
	}
	

	async getTradeHistory()
	{	
		const reqData = this.props.reqData
		// var offset = new Date().getTimezoneOffset();
		console.log("offset", this.props.reqData);

		const widgetOptions = {
			symbol: reqData.symbol,
			timezone: 'Asia/Kolkata',
			// theme:"dark",
			// BEWARE: no trailing slash is expected in feed URL
			datafeed: Datafeed({symbol:reqData.symbol}),
			interval: this.props.interval,
			container: this.ref.current,
			library_path: this.props.libraryPath,
			locale: getLanguageFromURL() || 'en',
			disabled_features: ['show_trading_notifications_history', 'use_localstorage_for_settings', 'header_symbol_search','header_compare', 'header_saveload', 'go_to_date', 'add_to_watchlist'],
			enabled_features: ['chart_zoom'],
			chart_zoom:60,
			high_density_bars:false,
			charts_storage_url: this.props.chartsStorageUrl,
			charts_storage_api_version: this.props.chartsStorageApiVersion,
			client_id: this.props.clientId,
			supports_timescale_marks:true,
			// user_id: this.props.userId,
			force_overlay:true,
			fullscreen: this.props.fullscreen,
			autosize: this.props.autosize,
			studies_overrides: this.props.studiesOverrides,
		}
		
		console.log("widgetOptions", widgetOptions)

		const tvWidget = new widget(widgetOptions);
		this.tvWidget = tvWidget;

		tvWidget.onChartReady(() => 
		{
			tvWidget.headerReady().then(() => 
			{
				
				// button.setAttribute('title', 'Click to show a notification popup');
				
				// button.addEventListener('click', () => tvWidget.showNoticeDialog({
				// 	title: 'Notification',
				// 	body: 'TradingView Charting Library API works correctly',
				// 	callback: () => {
				// 		console.log('Noticed!');
				// 	},
				// }));
				const button = tvWidget.createButton()
				button.innerHTML = "Max : $"+reqData.max
				button.classList.add('btn-max')
				button.style.color = "#19b196"
				
				const button2 = tvWidget.createButton()
				button2.innerHTML = "Min : $"+reqData.min
				button2.style.color = "#F44336"
				button2.classList.add('btn-min')
			})
		})
		// try 
        // {
		// 	const response = await Axios.get('http://localhost:3010/')
		// 	if(response.data.status)
		// 	{ 
				
		// 	}
        // }
        // catch(err) 
        // { 
		// 	console.log("err", err)
        // }
	}

	componentDidMount() 
    {
		this.getTradeHistory()
	}

	componentWillUnmount() 
	{
		if (this.tvWidget !== null) {
			this.tvWidget.remove();
			this.tvWidget = null;
		}
	}

	render() {
		return (	
			<>
				<div ref={this.ref} className={styles.TVChartContainer} />


				
			</>
		);
	}
}