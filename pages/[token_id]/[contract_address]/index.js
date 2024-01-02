import React, { useEffect, useState } from 'react'
import { IMAGE_BASE_URL, smallExponentialPrice, API_BASE_URL,config,graphql_headers, graphqlApiURL, separator, graphqlApiKEY, speedoMeterValues, market_coinpedia_url, roundNumericValue,  indicator_time_series} from '../../../components/constants'
import { tokenBasic, otherDetails, getVolume24h, getHighLow24h, getNetworkId } from '../../../components/search_contract_address/live_price'
import Search_token from '../../../components/search_token'
import { ethers } from 'ethers'
import Web3 from 'web3'
import Head from 'next/head'
import Axios from 'axios'
import { useSelector, useDispatch } from "react-redux";
import moment from 'moment'
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), { ssr: false });
import dynamic from "next/dynamic";
import Link from 'next/link'
import News from '../../../components/token_details/news'
import Events from '../../../components/token_details/events'
import Dex_overview from '../../../components/search_contract_address/dex_overview'
import Liquidity_pools_list from '../../../components/search_contract_address/liquidity_pools_list'
import Trade_history from '../../../components/search_contract_address/trade_history'
import Price_analysis from '../../../components/token_details/price_analysis'
import Price_prediction from '../../../components/token_details/price_prediction'
import TradingView from '../../../components/search_contract_address/charts/tradingview/dex_pairs'
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
// import SideBarExchangeDetails from "../../components/sideBarExchangeBlock"
// import Search_Contract_Address from '../../components/searchContractAddress'
import ReactPaginate from 'react-paginate'
import Price_chart from '../../../components/search_contract_address/charts/price'
import { bitgquery_graph_ranges } from '../../../components/token_details/custom_functions' 

const DynamicChartComponent = dynamic(() => import('react-apexcharts'), { ssr: false });


let inputProps = {
  className: 'market-details-date-search my_input',
  placeholder: 'From date',
  readOnly: true
}

let inputProps2 = {
  className: 'market-details-date-search my_input',
  placeholder: 'To date',
  readOnly: true
}

export default function TokenDetails({network_id, address, tokenData, token_id,}) 
{
   console.log("tokenData", tokenData)
   console.log("network_id", network_id)

   
  let sma_buy_count = 0
  let sma_sell_count = 0
  let sma_neutral_count = 0

  let ema_buy_count = 0
  let ema_sell_count = 0
  let ema_neutral_count = 0
  
  // post.smartContract.currency.symbol
  const [percentage_change_24h, set_percentage_change_24h] = useState(false)
  const [contract_copy_status, set_contract_copy_status] = useState("")
  const [share_modal_status, set_share_modal_status] = useState(false)
  const [image_base_url] = useState(
    IMAGE_BASE_URL + "/markets/cryptocurrencies/"
  );
  
  const [exchangelistnew, set_exchange_list_new] = useState([])
  const [live_price, set_live_price] = useState(tokenData.live_price ? tokenData.live_price:"")
  const [contract_24h_volume, set_contract_24h_volume] = useState(0)
  const [tokentransactions, set_tokentransactions] = useState([])
  
  const [graphDate, set_graphDate] = useState(1)
  const [market_cap, set_market_cap] = useState(0)
  const [total_supply, set_total_supply] = useState(tokenData.token_supply ? tokenData.token_supply:"")
  const [connected_address, set_connected_address] = useState("")
  const [wallet_data, setWalletData] = useState([]);
  const [walletspageCount, setWalletsPageCount] = useState(0)
  const [volatility, set_volatility] = useState("")

  const [handleModalConnections, setHandleModalConnections] = useState(false)
  const [handleModalMainNetworks, setHandleModalMainNetworks] = useState(false)

  const [contract_address, setContractAddress] = useState("")

  const [customDate, setCustomDate] = useState(false)
  const [customstartdate, setCustomstartdate] = useState("")
  const [customenddate, setCustomenddate] = useState("")
  const [liquidity, set_liquidity] = useState(0)
  const [cal_liquidity, set_cal_liquidity] = useState(0)

  const [connectedtokenlist, set_connectedtokenlist] = useState([])
  const [walletTokenUsdBal, set_walletTokenUsdBal] = useState(0)
  const [loadmore, set_loadmore] = useState(false)

  const [main_tab, set_main_tab] = useState("")

  const [selectedTokenModal, setSelectedTokenModal] = useState(false)
  const [selectedwallettype, setSelectedWalletType] = useState(0)
  const [searchBy, setSearchBy] = useState("0")

  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0)
  const [graph_date_type, set_graph_date_type] = useState(3)

  const [high_24h, set_high_24h] = useState(0)
  const [low_24h, set_low_24h] = useState(0)
  const [open_24h, set_open_24h] = useState(0)
  const [close_24h, set_close_24h] = useState(0)
  


  const [converter_pair_currencies, set_converter_pair_currencies] = useState([])
  const [token_converter_value, set_token_converter_value] = useState("")
  const [usd_converter_value, set_usd_converter_value] = useState("")
  const [converter_pair_currency, set_converter_pair_currency] = useState(1)

 
  const [total_sma_buy, set_total_sma_buy] = useState(0)
  const [total_sma_sell, set_total_sma_sell] = useState(0)
  const [total_sma_neutral, set_total_sma_neutral] = useState(0)
  const [oscillator_buy, set_oscillator_buy] = useState(0)
  const [oscillator_sell, set_oscillator_sell] = useState(0)
  const [oscillator_neutral, set_oscillator_neutral] = useState(0) 

  const [summary_buy, set_summary_buy] = useState(0)
  const [summary_sell, set_summary_sell] = useState(0)
  const [summary_neutral, set_summary_neutral] = useState(0) 

  const [oscillator_speed_meter_name, set_oscillator_speed_meter_name] = useState("")
  const [oscillator_speedo_meter, set_oscillator_speedo_meter] = useState(0)
  const [summary_speed_meter_name, set_summary_speed_meter_name] = useState("") 
  const [summary_speedo_meter, set_summary_speedo_meter] = useState(0)

 
  const [sma_speedo_meter, set_sma_speedo_meter] = useState(0)
  const [sma_speed_meter_name, set_sma_speed_meter_name] = useState("")
  
  const [total_ema_buy, set_total_ema_buy] = useState(0)
  const [total_ema_sell, set_total_ema_sell] = useState(0)
  const [total_ema_neutral, set_total_ema_neutral] = useState(0)

 
  const [green_days, set_green_days] = useState(0)
  const [close_price_of_fifty, set_close_price_of_fifty] = useState(0)
  const [close_price_of_two_hundred, set_close_price_of_two_hundred] = useState(0)


  
  const [sma_list, set_sma_list] = useState([]);
  const [moving_averages_crossovers, set_moving_averages_crossovers] = useState([]);
  const [macd_line, set_macd_line] = useState([]);
  const [stochastic_values, set_stochastic_values] = useState([]);
  const [hull_moving_average, set_hull_moving_average] = useState([]);
  const [average_true_range, set_average_true_range] = useState([]);
  const [roc, set_roc] = useState([]);
  const [cci , set_cci] = useState([]);
  const [vwma , set_vwma] = useState([]);
  const [bull_bear_power , set_bull_bear_power] = useState([]);
  const [williams_percent_range , set_williams_percent_range] = useState([]);
  const [bollinger_bands , set_bollinger_bands] = useState([]);
  const [money_flow_index , set_money_flow_index] = useState([]);
  const [rsi_value , set_rsi_value] = useState([]);
  const [ma_crossovers_bullish, set_ma_crossovers_bullish] = useState("")
  const [ma_crossovers_bearish, set_ma_crossovers_bearish] = useState("")
  const [interval_type, set_interval_type] = useState(6)
  const [converter_object, set_converter_object] = useState("")
  

  const bullishCount = sma_list.filter(item => live_price > item.sma_value ).length;
  const bearishCount = sma_list.filter(item => live_price < item.sma_value ).length;

  const ema_bullish_count = sma_list.filter(item => live_price > item.ema_value ).length;
  const ema_bearish_count = sma_list.filter(item => live_price < item.ema_value ).length;
  const total = sma_list.length;  
  

  const oscillators = 30;

  const summary = 50;

  const averages = 70;

  const percentage = (green_days / 30) * 100;
 


  const [ringColor, setRingColor] = useState('#E0E3EB');
  const customNeedlePath = `<svg width="200" height="245" viewBox="0 0 200 245" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M6.57365 2.90619L9.82805 0.0395701L172.112 202.59L157.504 214.277L6.57365 2.90619Z" fill="#141822"/>
  <circle cx="173.43" cy="222.086" r="22.3987" fill="#141822"/>
  </svg>`; // Custom SVG path for needle

  const dexPairGraph = async (pass_object) => {
    //console.log("adsfasdff")
    await set_dex_pair_details(false);
    await set_dex_pair_object({});
    await set_dex_pair_object(pass_object);
  };

  const active_currency = useSelector((state) => state.active_currency);

  const convertCurrency = (token_price) => {
    if (token_price > 0.00001) {
      if (active_currency.currency_value) {
        return (
          active_currency.currency_symbol +
          " " +
          roundNumericValue(token_price * active_currency.currency_value)
        );
      } else {
        return roundNumericValue(token_price);
      }
    } else {
      if (active_currency.currency_value) {
        return (
          <>
            {active_currency.currency_symbol}{" "}
            {smallExponentialPrice(token_price)}
          </>
        );
      } else {
        return <>{smallExponentialPrice(token_price)}</>;
      }
    }
  };

  
  const updateContractDetails = async ({volume_24h}) => 
  {
    var reqObj = {
      contract_address : address,
      token_name: tokenData.name,
      symbol: tokenData.symbol,
      network_row_id : tokenData.network_row_id,
      price: tokenData.live_price,
      total_supply: tokenData.total_supply,
      volume_24h : volume_24h
    }

    const res = await Axios.post(API_BASE_URL+"markets/search_contract_address/update_details", reqObj, config(""))
    if(res.data)
    {
      console.log("data", res.data)
    } 
  }
  
  useEffect(() => 
  {
    tokenOtherDetails(6)
    getTokenDetails()
  }, [address])

 const getTokenDetails = async () =>
 {  
    await set_main_tab("")
    await set_main_tab(1)
    //await getexchangedata(address)
    var volume_24h = 0
    const response2 = await getVolume24h(tokenData.contract_type, address)
    if(response2.status)
    {
      if(response2.message.volume_24h)
      {
        set_contract_24h_volume(response2.message.volume_24h)
        volume_24h = await response2.message.volume_24h
      }
    }

    await updateContractDetails({volume_24h})


    //getMarketCap(address)
    //await getTokenTransactions(address)

    const response3 = await getHighLow24h(tokenData.contract_type, address)
    if(response3.status)
    {
      set_high_24h(response3.message.high)
      set_low_24h(response3.message.low)
      set_open_24h(response3.message.open)
      set_close_24h(response3.message.close)

      console.log("asdf", response3)
    }

    if(tokenData.live_price)
    {
      set_live_price(tokenData.live_price)
      set_total_supply(tokenData.total_supply)
      const response = await otherDetails(tokenData.contract_type, address)
      if(response.status)
      {
        if(response.message.price_24h && tokenData.live_price)
        {
          set_percentage_change_24h((((tokenData.live_price - response.message.price_24h)/tokenData.live_price)* 100).toFixed(2))
        }
      }
    }
    else
    {
      const getData = await tokenBasic(address)
      if(getData)
      {
        if(getData.live_price)
        {
          set_live_price(getData.live_price)
          set_total_supply(getData.total_supply)

          const response = await otherDetails(tokenData.contract_type, address)
          if(response.status)
          {
            if(response.message.price_24h && getData.live_price)
            {
              set_percentage_change_24h((((getData.live_price - response.message.price_24h)/getData.live_price)* 100).toFixed(2))
            }
          }
        }
      }
    }
 }


 const [chartData, setChartData] = useState({
  series: [100, 100, 50],
  options: {
    chart: {
      height: '100%',
      type: 'radialBar',
      width: 4,
    },
    plotOptions: {
      radialBar: {
        dataLabels: {
          name: {
            fontSize: '14px',
            // color: '#FF007A',
          },
          value: {
            fontSize: '11px',
            color: '#000',
          },
          
          // total: {
          //   show: true,
          //   label: 'Total',
          //   formatter: function (w) {
          //     return 249; 
          //   },
          // },
        },
      },
    },
    colors: ['#FF007A', '#FF007A', '#FF007A'],
    labels: ['Max Supply', 'Total Supply', 'Circulating Supply'],
  },
});




const [circulating_supply, set_circulating_supply] = useState(
  data.circulating_supply ? data.circulating_supply : ""
);

const [percentage_change_7d, set_percentage_change_7d] = useState(
  data.percent_change_7d ? data.percent_change_7d : 0
);

const [ath_price, set_ath_price] = useState(
  data.ath_price ? data.ath_price : ""
);
const [ath_price_date, set_ath_price_date] = useState(
  data.ath_price_date ? data.ath_price_date : ""
);
const [atl_price, set_atl_price] = useState(
  data.atl_price ? data.atl_price : ""
);
const [atl_price_date, set_atl_price_date] = useState(
  data.atl_price_date ? data.atl_price_date : ""
);


const [dex_circulating_supply, set_dex_circulating_supply] = useState(0)
const [count_liquidity_pools, set_count_liquidity_pools] = useState(0)

const [fetch_data_type, set_fetch_data_type] = useState(data.fetch_data_type ? data.fetch_data_type : 0)
const [modal_data, setModalData] = useState({icon: "", title: "",content: ""})

const tokenConverter = async (pass_value, pass_type, pass_pair_value, pass_converter_object) => 
{
  console.log("tokenConverter",pass_pair_value)
  console.log("tokenConverter1",pass_value)
  await set_converter_object(pass_converter_object)
  await set_converter_pair_currency(pass_pair_value)
  if(pass_value > 0) 
  {
    if(pass_type == 1) 
    {
      await set_token_converter_value(pass_value)
      if(((live_price*pass_value)/pass_pair_value) >= 0.1) 
      {
        await set_usd_converter_value(((live_price * pass_value)/ pass_pair_value).toFixed(2))
      }
      else 
      {
        await set_usd_converter_value(roundNumericValue((live_price * pass_value)/ pass_pair_value))
      }
    }
    else 
    {
      await set_usd_converter_value(pass_value)
      if(((pass_value*pass_pair_value) / live_price) >= 0.1) 
      {
        await set_token_converter_value(((pass_value*pass_pair_value) / live_price).toFixed(2))
      }
      else 
      {
        await set_token_converter_value(roundNumericValue((pass_value*pass_pair_value) / live_price))
      }
    }
  }
  else {
    await set_token_converter_value("")
    await set_usd_converter_value("")
  }

}
const tokenOtherDetails = async (pass_type) => 
  {
    await set_interval_type("")
    await set_interval_type(pass_type)
    const response = await Axios.get(API_BASE_URL +"markets/search_contract_address/other_details/" + address+"?interval_type="+pass_type+"&network_row_id="+network_id,config(""));
    if(response.data) 
    {
      console.log("asdf", response.data)
      if(pass_type == 6)  
      {
        set_green_days(response.data.message.green_days)
        set_close_price_of_fifty(response.data.message.close_price_of_fifty)
        set_close_price_of_two_hundred(response.data.message.close_price_of_two_hundred)
      }
      
     
      if(response.data.message.converter_currencies) 
      {
        set_converter_pair_currencies(response.data.message.converter_currencies);
        set_converter_object(response.data.message.converter_currencies[0])
        if(response.data.message.moving_averages_crossovers)
        {
          if(response.data.message.moving_averages_crossovers.data)
          {
            set_moving_averages_crossovers(response.data.message.moving_averages_crossovers.data)
            set_ma_crossovers_bullish(response.data.message.moving_averages_crossovers.total_bullish)
            set_ma_crossovers_bearish(response.data.message.moving_averages_crossovers.total_bearish)
          }
        }
        
        var sma_array = []
        var temp_total_sma_buy = 0
        var temp_total_sma_sell = 0
        var temp_total_sma_neutral = 0

        var temp_total_ema_buy = 0
        var temp_total_ema_sell = 0
        var temp_total_ema_neutral = 0
        
        if(response.data.message.moving_averages)
        {
          if(response.data.message.moving_averages.length > 0)
          {
            for(let run of response.data.message.moving_averages)
            {
              var new_sma_object = {}
              new_sma_object['day_number'] = run.day_number
              new_sma_object['sma_value'] = run.sma_value
              new_sma_object['ema_value'] = run.ema_value

              if(live_price > run.sma_value) 
              {
                temp_total_sma_buy++;
                new_sma_object['sma_status'] = 1
              } 
              else if (live_price < run.sma_value) 
              {
                temp_total_sma_sell++;
                new_sma_object['sma_status'] = 2
              } 
              else 
              {
                temp_total_sma_neutral++;
                new_sma_object['sma_status'] = 3
              }

              if(live_price > run.ema_value) 
              {
                temp_total_ema_buy++;
                new_sma_object['ema_status'] = 1
              } 
              else if (live_price < run.ema_value) 
              {
                temp_total_ema_sell++;
                new_sma_object['ema_status'] = 2
              } 
              else 
              {
                temp_total_ema_neutral++;
                new_sma_object['ema_status'] = 3
              }

              await sma_array.push(new_sma_object)
            }
          }
        } 
        

        // temp_total_sma_buy = 4
        // temp_total_sma_sell = 3
        // temp_total_sma_neutral = 0
        const { speed_meter_name, speed_percentage } = await speedoMeterValues({total_sma_buy:temp_total_sma_buy, 
                                                          total_sma_sell:temp_total_sma_sell, 
                                                          total_sma_neutral:temp_total_sma_neutral
                                                        })
        await set_sma_speed_meter_name(speed_meter_name)
        await set_sma_speedo_meter(speed_percentage)
        

        
        await set_sma_list(sma_array)
        await set_total_sma_buy(temp_total_sma_buy)
        await set_total_sma_sell(temp_total_sma_sell)
        await set_total_sma_neutral(temp_total_sma_neutral)
        await set_total_ema_buy(temp_total_ema_buy)
        await set_total_ema_sell(temp_total_ema_sell)
        await set_total_ema_neutral(temp_total_ema_neutral)
       
        var temp_oscillator_buy = 0
        var temp_oscillator_sell = 0
        var temp_oscillator_neutral = 0
        set_macd_line(response.data.message.macd_line)
        response.data.message.macd_line < 0 ? temp_oscillator_sell++ : response.data.message.macd_line > 0 ? temp_oscillator_buy++ : temp_oscillator_neutral++
        
        set_stochastic_values(response.data.message.stochastic_values)
        if(response.data.message.stochastic_values)
        {
          response.data.message.stochastic_values.slow <= 45 ?  temp_oscillator_buy++ :  response.data.message.stochastic_values.slow >= 55 ? temp_oscillator_sell++ : temp_oscillator_neutral++
        }
        
                                                        
        set_roc(response.data.message.roc)
        response.data.message.roc < 0 ? temp_oscillator_sell++ : response.data.message.roc > 0 ? temp_oscillator_buy++ : temp_oscillator_neutral++
       
        set_cci(response.data.message.cci) 
        response.data.message.cci > 50? temp_oscillator_buy++ : response.data.message.cci < -50 ? temp_oscillator_sell++ : temp_oscillator_neutral++


        set_money_flow_index(response.data.message.money_flow_index)
        response.data.message.money_flow_index <= 20 ? temp_oscillator_buy++ : response.data.message.money_flow_index > 80 ? temp_oscillator_sell++ : temp_oscillator_neutral++
       
        set_williams_percent_range(response.data.message.williams_percent_range)
        response.data.message.williams_percent_range > -50 ? temp_oscillator_buy++ : response.data.message.williams_percent_range < -60? temp_oscillator_sell++ : temp_oscillator_neutral++
                                                        
        set_bull_bear_power(response.data.message.bull_bear_power)
        response.data.message.bull_bear_power < 0 ? temp_oscillator_sell++ : response.data.message.bull_bear_power > 0 ? temp_oscillator_buy++ : temp_oscillator_neutral++                                                
        
        set_bollinger_bands(response.data.message.bollinger_bands)
        if(response.data.message.bollinger_bands)
        {
          live_price >= response.data.message.bollinger_bands.upper_band ? temp_oscillator_sell++ : live_price <= response.data.message.bollinger_bands.lower_band ? temp_oscillator_buy++ : temp_oscillator_neutral++  
        }
        

        set_rsi_value(response.data.message.rsi_value)
        response.data.message.rsi_value < 30 ? temp_oscillator_sell++ : response.data.message.rsi_value > 70 ? temp_oscillator_buy++ : temp_oscillator_neutral++
                                                        


        set_hull_moving_average (response.data.message.hull_moving_average);
        set_average_true_range(response.data.message.average_true_range);
        
        
        set_vwma(response.data.message.vwma)
        
        
        
        set_volatility(response.data.message.volatility_30d)
        // response.data.message.volatility_30d >= 5 && volatility < 10 ? temp_oscillator_sell++ :
        // (response.data.message.volatility_30d >= 1 && volatility < 2 ? temp_oscillator_buy++ :
        // (response.data.message.volatility_30d >= 2 && volatility < 5 ? temp_oscillator_neutral++ : null));
        
        // console.log("temp_oscillator_buy", temp_oscillator_buy)
        // console.log("temp_oscillator_sell", temp_oscillator_sell)
        // console.log("temp_oscillator_neutral", temp_oscillator_neutral)
        
        await set_oscillator_buy(temp_oscillator_buy)
        await set_oscillator_sell(temp_oscillator_sell)
        await set_oscillator_neutral(temp_oscillator_neutral)

        const oscillator_speedo_meter_values = await speedoMeterValues({total_sma_buy:temp_oscillator_buy, 
          total_sma_sell:temp_oscillator_sell, 
          total_sma_neutral:temp_oscillator_neutral
        })
        await set_oscillator_speed_meter_name(oscillator_speedo_meter_values.speed_meter_name)
        await set_oscillator_speedo_meter(oscillator_speedo_meter_values.speed_percentage)

        var temp_summary_buy = await temp_oscillator_buy+temp_total_sma_buy
        var temp_summary_sell = await temp_oscillator_sell+temp_total_sma_sell
        var temp_summary_neutral = await temp_oscillator_neutral+temp_total_sma_neutral

        await set_summary_buy(temp_summary_buy)
        await set_summary_sell(temp_summary_sell)
        await set_summary_neutral(temp_summary_neutral)

        const summary_speedo_meter_values = await speedoMeterValues({
          total_sma_buy : temp_oscillator_buy, 
          total_sma_sell : temp_oscillator_sell, 
          total_sma_neutral : temp_oscillator_neutral
        })

        await set_summary_speed_meter_name(summary_speedo_meter_values.speed_meter_name)
        await set_summary_speedo_meter(summary_speedo_meter_values.speed_percentage)


        await set_sma_speed_meter_name(speed_meter_name)
        await set_sma_speedo_meter(speed_percentage)

      }
    }
  };

//converter_currencies


// liquidity 



const totalLiquidity = async () =>
{
  const pairAbi = ["function totalSupply() view returns (uint256)"]
  let web3 = new Web3(Web3.givenProvider)
  var pair = '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc'
  const contract = new web3.eth.Contract(pairAbi, address)
  console("contract", contract)

  // reserves = contract.functions.getReserves().call()
  // reserve_usdc = reserves[0]
  // total_supply = contract.functions.totalSupply().call()

  // var lp_address = '0x76E2E2D4d655b83545D4c50D9521F5bc63bC5329' 
  // lp_balance = contract.functions.balanceOf(lp_address).call()
  // lp_usdc = reserve_usdc * lp_balance / total_supply   
  // usdc_decimals = 6
  // lp_usdc_adjusted = lp_usdc / 10 ** usdc_decimals
}

const getMarketCap = async (id, decval, usd_price) => 
{
 
  //    if (tokenType.indexOf('ERC') >= 0 ) {
  //      mainnetUrl = 'https://bsc-dataseed.binance.org/'
  //    } else {
  //      mainnetUrl = 'https://mainnet.infura.io/v3/5fd436e2291c47fe9b20a17372ad8057'
  //    }

  // const tokenAbi = ["function totalSupply() view returns (uint256)"];
  // const tokenContract = new ethers.Contract(id, tokenAbi, provider);
  // const supply = await tokenContract.totalSupply() / (10 ** decval);
  // set_market_cap(supply * usd_price)


  if(id !== '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' || id !== '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984')
  {
      const pairAbi = ["function getPair(address first, address second) view returns (address)"]
      const pairContract = new ethers.Contract("0x1f9840a85d5af5bf1d1762f925bdaddc4201f984", pairAbi, provider);
      const pairAddr = await pairContract.getPair(id, '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');

      const liqAbi = ["function getReserves() view returns (uint112, uint112, uint32)", "function token0() view returns (address)"];
      const liqContract = new ethers.Contract(pairAddr, liqAbi, provider);
      const reserve = await liqContract.getReserves();
      console.log("reserve", reserve)
      const token0 = await liqContract.token0();
      console.log("token0", token0)
      // const liquidity = ((token0.toLowerCase() === id.toLowerCase()) ? reserve[0] : reserve[1]) / (10 ** decval) * usd_price * 2;
      // console.log("liquidity", liquidity)
  }

}

const [isOpen, setIsOpen] = useState(false);

const toggleDropdown = () => {
  setIsOpen(!isOpen);
};

  var yesterday = moment()
  function valid(current) {
    return current.isBefore(yesterday)
  }

  const copyContract = (data, type) => {
    set_contract_copy_status(type)

    var copyText = document.createElement("input")
    copyText.value = data
    document.body.appendChild(copyText)
    copyText.select()
    document.execCommand("Copy")
    copyText.remove()
    // setTimeout(3000)
    setTimeout(() => set_contract_copy_status(""), 3000)
  }


  const valid2 = (current) => {
    return current.isBefore(yesterday)
  }
  const getTotalMaxSupply = (id, decimal) => 
  {
    // https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=0x57d90b64a1a57749b0f932f1a3395792e12e7055&apikey=YourApiKeyToken
    Axios.get("https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=" + id + "&apikey=E9DBMPJU7N6FK7ZZDK86YR2EZ4K4YTHZJ1")
      .then(response => {
        if (response.status) {
          console.log(response)
         // settoken_max_supply(response.data.result / 10 ** decimal)
        }
      })
  }
  const getexchangedata = async (id) => {
    const dateSince = ((new Date(Date.now() - 24 * 60 * 60 * 1000)).toISOString())

    var network_id = "ethereum"
    if(tokenData.contract_type == 2)
    {
      network_id = "bsc"
    }
    const query = `
    query {
      ethereum(network: `+ network_id +`) {
        dexTrades(
          quoteCurrency: {is: "`+ id + `"}
          options: {desc: ["tradeAmount","trades"] limit: 100}
          date: {after: "`+ dateSince + `"}
        ) {
          poolToken: smartContract {
            address {
              address
            }
          }
          exchange {
            fullName
          }
          pair:baseCurrency {
            symbol
            address
            name
          }
          trades: count
          tradeAmount(in: USD)
        }
      }
    }
        ` ;

    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };

    
    var calculated_liquidity = 0
    var mul_liquidity = 0
    const resultArray = new Array()
    var response1 = 0
    var pair_two_value_in_Usd = 0
    var pair_one_value_in_usd = 0
    const res = await fetch(url, opts)
    const result = await res.json()
    if (result.data.ethereum) 
    {
      var request_API_Status = false
      if (result.data.ethereum.dexTrades) 
      {
        console.log("exchanges result", result.data.ethereum.dexTrades)
       
        for(let item of result.data.ethereum.dexTrades)
        {
          var createObj = {}
          createObj['exchange_name'] = item.exchange.fullName
          createObj['pair_one_name'] = item.pair.name
          createObj['exchange_address'] = item.poolToken.address.address
          createObj['pair_one_token_address'] = item.pair.address
          createObj['trades'] = item.trades
          createObj['tradeAmount'] = item.tradeAmount
          calculated_liquidity += await item.tradeAmount ? parseFloat(item.tradeAmount):0
          mul_liquidity += await (item.tradeAmount ? parseFloat(item.tradeAmount):1)*(item.trades ? parseFloat(item.trades):1)
          
          await resultArray.push(createObj)
        }
        await set_liquidity(calculated_liquidity)
        await set_cal_liquidity(mul_liquidity)
        set_exchange_list_new(resultArray)
        
        // result.data.ethereum.dexTrades.map(async (item, i) => 
        // {
        //   response1 = await getexchangevalue(item.poolToken.address.address)
        //   if(response1) 
        //   {
        //     response1.map(async (e) => {
        //       if (item.pair.address == e.currency.address) {
        //         createObj['pair_one_value'] = e.value
        //         var res = await livePrice(item.pair.address)
        //         console.log(item.pair.name, res)
        //         createObj['pair_one_live_price'] = res
        //         pair_one_value_in_usd = e.value * res

        //       }
              
        //       if (id.toLowerCase() == e.currency.address) {
        //         createObj['pair_two_value'] = e.value
        //         //var res =await livePrice(id)
        //         // console.log("symbol", res)
        //         // pair_two_value_in_Usd = e.value*res
        //         // createObj['pair_two_live_price']=res
        //         console.log(pair_two_value_in_Usd)
        //       }
        //       createObj['liquidity_in_pool'] = pair_one_value_in_usd
        //     })
        //   }
        // })



      }

    }
  }


  const livePrice = async (id) => 
  {
    const dateSince = ((new Date()).toISOString())
    const query = `
        query
        {
        ethereum(network:ethereum ) {
            dexTrades(
            date: {since: "` + dateSince + `"}
            any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
            options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
            ) {
            baseCurrency {
                symbol
            }
            block {
                height
            }
            transaction {
                index
            }
        
            quoteCurrency {
                symbol
            }
            quote: quotePrice
            }
        }
        }
    `
    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };
    const res = await fetch(url, opts)
    const result = await res.json()

    if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {
      console.log(result.data.ethereum.dexTrades)

      if (id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
        return result.data.ethereum.dexTrades[0].quote
      }
      else {
        if (result.data.ethereum.dexTrades.length == 1) {
          return result.data.ethereum.dexTrades[0].quote
        }
        else if (result.data.ethereum.dexTrades.length == 2) {
          return result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote
        }
        else {
          return 0
        }
      }
    }
  }


  const livePriceB = async (id) => {
    const dateSince = ((new Date()).toISOString())
    const query = `
    query
    {
      ethereum(network: bsc) {
        dexTrades(
          date: {since: "` + dateSince + `"}
          any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
          options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
        ) {
          baseCurrency {
            symbol
          }
          block {
            height
          }
          transaction {
            index
          }
    
          quoteCurrency {
            symbol
          }
          quote: quotePrice
        }
      }
    }
` ;
    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };
    const res = await fetch(url, opts)
    const result = await res.json()

    if (result.data.ethereum != null && result.data.ethereum.dexTrades != null) {
      console.log(result.data.ethereum.dexTrades)

      if (id === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c") {
        return result.data.ethereum.dexTrades[0].quote
      }
      else {
        if (result.data.ethereum.dexTrades.length == 1) {
          return result.data.ethereum.dexTrades[0].quote
        }
        else if (result.data.ethereum.dexTrades.length == 2) {
          return result.data.ethereum.dexTrades[0].quote * result.data.ethereum.dexTrades[1].quote
        }
        else {
          return 0
        }
      }
    }

  }

  
  const getexchangevalue = async (pool_token_address) => {
    const query = `
      query {
        ethereum(network: ethereum) {
        address(address: {is: "`+ pool_token_address + `"}) {
        balances {
        value
        currency {
        address
        symbol
        tokenType
        }
        }
        }
        }
        }
          ` ;

    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };

    const res = await fetch(url, opts)
    const result = await res.json()
    if (result.data.ethereum) {
      if (result.data.ethereum.address) {

        if (result.data.ethereum.address[0].balances) {
          return result.data.ethereum.address[0].balances
        }
      }
    }



    

  }
  const getTokenTransactions = (id) => {
    const dateSince = ((new Date(Date.now() - 900*24 * 60 * 60 * 1000)).toISOString())
    const query = `
                query
                {
                  ethereum(network: bsc) {
                    dexTrades(
                      any: [{baseCurrency: {is: `+ '"' + id + '"' + `}}]
                      date: {since: `+ '"' + dateSince + '"' + ` }
                      options: {desc: ["tradeIndex", "block.timestamp.time"], limitBy: {each: "baseCurrency.symbol", limit: 10}}
                    ) {
                      exchange {
                        name
                      }
                      baseCurrency {
                        symbol
                        address
                      }
                      transaction {
                        hash
                      }
                      block {
                        timestamp {
                          time(format: "%Y-%m-%d %H:%M:%S")
                        }
                        height
                      }
                      tradeIndex
                      buyAmount: baseAmount
                      buyAmountInUsd: baseAmount
                      quoteCurrency {
                        symbol
                        address
                      }
                      sellAmountInUsd: quoteAmount
                      tradeAmountInUsd: tradeAmount(in: USD)          
                    }
                  }
                }
          ` ;

    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        console.log("txns", result.data.ethereum)
        if (result.data.ethereum != null) 
        {
          
          set_tokentransactions(result.data.ethereum.dexTrades)
        }
      })
      .catch(console.error);
  }


  const getTokenexchange = (id, pageoffset) => {
    const query = `
          query{
            ethereum(network: ethereum){
              dexTrades(options:{desc: "amount"},
                date: {since: null till: null }
                baseCurrency: {is: "`+ id + `"}
                ) {

                  exchange {
                    fullName
                  }

                  trades: count
                  takers: count(uniq: takers)
                  makers: count(uniq: makers)

                  amount: baseAmount
                  baseCurrency{symbol}
              }
            }
          }
          ` ;

    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum != null) {
          const slice = result.data.ethereum.dexTrades.slice(pageoffset, pageoffset + 10)
          const postData = slice.map((e, i) => {
            return <tr key={i}>
              <td>{e.exchange.fullName}</td>
              <td>{separator(e.trades)}</td>
              <td>{separator(e.takers)}</td>
              <td>{separator(e.makers)}</td>
              <td>{separator(e.amount.toFixed(2))}</td>
            </tr>
          })
          setData(postData)
          setPageCount(result.data.ethereum.dexTrades.length / 10)
        }
      })
      .catch(console.error);
  }


  const handlePageClick = (e) => {
    setSelectedPage(e.selected)
    getTokenexchange(contract_address, (e.selected * 10))
  };

  const getTokendetails = (id, usd_price) => 
  {
    const query = `
                query
                { 
                  ethereum(network: ethereum) {
                    address(address: {is: "`+ id + `"}){

                      annotation
                      address

                      smartContract {
                        contractType
                        currency{
                          symbol
                          name
                          decimals
                          tokenType
                        }
                      }
                      balance
                    }
                  } 
              }
          ` ;

    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };
    fetch(url, opts)
      .then(res => res.json())
      .then(result => {
        if (result.data.ethereum === null) {
          setContractAddress("")
        }
        else {
          getTotalMaxSupply(id, result.data.ethereum.address[0].smartContract.currency.decimals)
          getMarketCap(window.location.pathname.substring(5), result.data.ethereum.address[0].smartContract.currency.decimals, usd_price)

        }
      })
      .catch(console.error);
  }

 


  

  const getGraphData = async (datetime, id) => 
  {


    if(datetime === "") 
    {
      datetime = graphDate;
    }
    set_graphDate(datetime)

    var symbolName = ""
    let from_date = ""
    let to_date = ""

    symbolName = tokenData.symbol ? tokenData.symbol : "-"

    from_date = new Date();
    from_date = from_date.setDate(from_date.getDate() - 1);
    from_date = Date.parse((new Date(from_date)).toString()) / 1000;
    to_date = Date.parse((new Date()).toString()) / 1000;

    if (datetime === 1) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 1);
      from_date = Date.parse((new Date(from_date)).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 2) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 7);
      from_date = Date.parse(new Date(from_date).toString()) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 3) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 31);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 4) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 365);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 5) {
      from_date = new Date();
      from_date = from_date.setDate(from_date.getDate() - 730);
      from_date = Date.parse((new Date(from_date).toString())) / 1000;
      to_date = Date.parse((new Date()).toString()) / 1000;
    }
    else if (datetime === 6) {
      setCustomDate(!customDate)
      from_date = Date.parse(customstartdate)
      to_date = Date.parse(customenddate)

      from_date = from_date / 1000
      to_date = to_date / 1000
    }

    const dateSince = new Date(from_date * 1000);
    const fromDate = dateSince.toISOString();
    const dateTill = new Date(to_date * 1000);
    const toDate = dateTill.toISOString();

    let query = ""

    if (id === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
      query = `
          query
          {
            ethereum(network: ethereum) {
              dexTrades(
                exchangeName : {is: ""}
                date: {after: "` + fromDate + `" , till: "` + toDate + `"}
                any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
                options: {asc: "timeInterval.hour"}
              ) {
                timeInterval {
                  hour(count: 3)
                }
                baseCurrency {
                  symbol
                }        
                quoteCurrency {
                  symbol
                }
                quote: quotePrice
                buyAmount: baseAmount
                sellAmount: quoteAmount
                tradeAmountInUsd: tradeAmount(in: USD)
              }
            }
          }
        `
    }
    else {
      query = `
        query
        {
          ethereum(network: ethereum) {
            dexTrades(
              exchangeName : {is: ""}
              date: {after: "` + fromDate + `" , till: "` + toDate + `"}
              any: [{baseCurrency: {is: "`+ id + `"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}]
              options: {asc: "timeInterval.hour"}
            ) {
              timeInterval {
                hour(count: 3)
              }
              baseCurrency {
                symbol
              }        
              quoteCurrency {
                symbol
              }
              quote: quotePrice
              buyAmount: baseAmount
              sellAmount: quoteAmount
              tradeAmountInUsd: tradeAmount(in: USD)
            }
          }
        }
      `
    }

    const opts = {
        method: "POST",
        headers : graphql_headers,
        body: JSON.stringify({query})
    }

    const res = await fetch(graphqlApiURL, opts)
    const result = await res.json()
    if(result)
    {
      if(result.data.ethereum != null && result.data.ethereum.dexTrades != null) 
      {
        const res_array = await setGraphData(result.data.ethereum.dexTrades, tokenData.contract_type)
        console.log(res_array)
      }
    }
  }

  const getDetails = async () =>
  {
    const get_live_price = await getLivePrice(address)
    console.log("Address ", get_live_price)
  }

  const setGraphData = async (pass_data, contract_type) =>
  {
    var result = []
    for(let i of pass_data)
    { 
      
      var rate = 0
      if(contract_type == 1) 
      {
        rate = i.tradeAmountInUsd / i.buyAmount;
      } 
      else 
      {
        rate = i.quote
      }

      var create_obj = {}
      var date = new Date(i.timeInterval.hour)
      create_obj['time'] = date.getTime()
      create_obj['value'] = rate

      await result.push(create_obj)

    }

    return { result:result }
  }



  const getTokensList = (wallet_address, networktype) => 
  {

    let query = ""

    if(networktype === "ethereum") 
    {
      query = `
      query{
          ethereum(network: ethereum) {
            address(address: {is: "`+ wallet_address + `"}) {
              balances(height: {gteq: 100}) {
                currency {
                  address
                  name
                  symbol
                }
                value
              }
            }
          }
        }
        ` ;
    }
    else 
    {
      query = `
      query{
        ethereum(network: bsc) {
        address(address: {is: "`+ wallet_address + `"}) {
          address
          balances(height: {lteq: 10814942}) {
            currency {
              symbol
              address
              name
              decimals
              }
              value
            }
          }             
        }
      }
        ` ;
    }

    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };

    if (networktype === "ethereum") 
    {

      let balance = 0

      fetch(url, opts)
        .then(res => res.json())
        .then(result => {

          result.data.ethereum.address[0].balances.map((item) => {
            if (item.currency.address === "-") {
              item.currency.address = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
            }

            var dateSince = ((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString())
            query = `
                      query
                      {
                        ethereum(network: ethereum) {
                          dexTrades(
                            date: {since: "` + dateSince + `"}
                            any: [{baseCurrency: {is: "`+ item.currency.address + `"}, quoteCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}}, {baseCurrency: {is: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}, quoteCurrency: {is: "0xdac17f958d2ee523a2206206994597c13d831ec7"}}]
                            options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
                          ) {
                            baseCurrency {
                              symbol
                            }
                            block {
                              height
                            }
                            transaction {
                              index
                            }
                      
                            quoteCurrency {
                              symbol
                            }
                            quote: quotePrice
                          }
                        }
                      }
                  ` ;

            const tokenBalOpts = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-API-KEY": graphqlApiKEY
              },
              body: JSON.stringify({
                query
              })
            };

            fetch(url, tokenBalOpts)
              .then(tokenBalRes => tokenBalRes.json())
              .then(tokenBalResult => {
                if (item.currency.address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2") {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote;
                } else {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote * tokenBalResult.data.ethereum.dexTrades[1].quote;
                  balance = (balance + item.quotePrice * item.value)
                }
                set_connectedtokenlist(result.data.ethereum.address[0].balances)
                set_walletTokenUsdBal(balance)

              })
              .catch(console.error);
            return null;
          })


        })
        .catch(console.error);

    }
    else {

      let balance = 0

      fetch(url, opts)
        .then(res => res.json())
        .then(result => {
          result.data.ethereum.address[0].balances.map((item) => {
            if (item.currency.address === "-") {
              item.currency.address = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
            }

            var dateSince = ((new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).toISOString())
            query = `
                                  query
                                  {
                                    ethereum(network: bsc) {
                                      dexTrades(
                                        date: {since: "` + dateSince + `"}
                                        any: [{baseCurrency: {is: `+ '"' + item.currency.address + '"' + `}, quoteCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}}, {baseCurrency: {is: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"}, quoteCurrency: {is: "0xe9e7cea3dedca5984780bafc599bd69add087d56"}}]
                                        options: {desc: ["block.height"], limitBy: {each: "baseCurrency.symbol", limit: 1}}
                                      ) {
                                        baseCurrency {
                                          symbol
                                        }
                                        block {
                                          height
                                        }
                                        transaction {
                                          index
                                        }
                                  
                                        quoteCurrency {
                                          symbol
                                        }
                                        quote: quotePrice
                                      }
                                    }
                                  }
                            ` ;

            const tokenBalOpts = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "X-API-KEY": graphqlApiKEY
              },
              body: JSON.stringify({
                query
              })
            };

            fetch(url, tokenBalOpts)
              .then(tokenBalRes => tokenBalRes.json())
              .then(tokenBalResult => {
                if (item.currency.address === "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c") {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote;
                } else {
                  item.quotePrice = tokenBalResult.data.ethereum.dexTrades[0].quote * tokenBalResult.data.ethereum.dexTrades[1].quote;
                  balance = (balance + item.quotePrice * item.value)
                }
                set_connectedtokenlist(result.data.ethereum.address[0].balances)
                set_walletTokenUsdBal(balance)

              })
              .catch(console.error);
            return null;
          })

        })
        .catch(console.error);
    }

  }


  const getWalletDetails = (id, networktype, wallettype) => {
    const query = `
                query
                {
                  ethereum(network: `+ networktype + `) {
                    inbound: transfers(
                      options: {desc: "block.timestamp.time", asc: "currency.symbol", limit: 10}
                      date: {since: null, till: null},
                      amount: {gt: 0},
                      receiver: {is: `+ '"' + id + '"' + `}
                    ) {
                      block {
                        timestamp {
                          time(format: "%Y-%m-%d %H:%M:%S")
                        }
                        height
                      }
                      address: sender {
                        address
                        annotation
                      }
                      currency {
                        address
                        symbol
                      }
                      gasValue
                      amount
                      amountInUSD: amount(in: USD)
                      transaction {
                        hash
                        gasPrice
                      }
                      external
                    }
                    outbound: transfers(
                      options: {desc: "block.timestamp.time", asc: "currency.symbol", limit: 10}
                      date: {since: null, till: null},
                      amount: {gt: 0}
                      sender: {is: `+ '"' + id + '"' + `}
                    ) {
                      block {
                        timestamp {
                          time(format: "%Y-%m-%d %H:%M:%S")
                        }
                        height
                      }
                      address: receiver {
                        address
                        annotation
                      }
                      currency {
                        address
                        symbol
                      }
                      amount
                      amountInUSD: amount(in: USD)
                      transaction {
                        hash
                        gasPrice
                      }
                      gasValue
                      external
                    }
                  }
                }
          ` ;
    const url = "https://graphql.bitquery.io/";
    const opts = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": graphqlApiKEY
      },
      body: JSON.stringify({
        query
      })
    };

    fetch(url, opts)
      .then(res => res.json())
      .then(result => {

        let get_inbond_list = []
        let get_outbond_list = []

        if (result.data.ethereum.inbound) {
          result.data.ethereum.inbound.map((e, i) => {
            return get_inbond_list[i] = { e, type: 1 }
          })
        }

        if (result.data.ethereum.outbound) {
          result.data.ethereum.outbound.map((e, i) => {
            return get_outbond_list[i] = { e, type: 2 }
          })
        }

        var all_data = get_inbond_list.concat(get_outbond_list)

        if (all_data.length > 0) {
          all_data = all_data.sort((a, b) => (new Date(b.e.block.timestamp.time).getTime()) - (new Date(a.e.block.timestamp.time).getTime()))

          const slice = all_data.slice(0, 0 + 10)
          const postData = slice.map((e, i) => {
            return <tr key={i}>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{moment(e.e.block.timestamp.time).format("ll")}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{e.type == 1 ? <div>IN</div> : <div>OUT</div>}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{e.e.currency.symbol}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{separator(parseFloat((e.e.amount).toFixed(6)))}</a></td>
              <td><a href={(wallettype === 1 ? "https://etherscan.io/tx/" : "https://bscscan.com/tx/") + e.e.transaction.hash} target="_blank">{separator(parseFloat((e.e.amountInUSD).toFixed(6)))}</a></td>
            </tr>
          })
          setWalletData(postData)
          setWalletsPageCount(all_data.length / 10)
        }
      })
      .catch(console.error);
  }


  const getTokenAddress = (address, type, connecttionType) => {
    localStorage.setItem("walletconnectedtype", "1")
    setSelectedWalletType(connecttionType)
    set_connected_address(address)
    setSelectedTokenModal(false)

    if (type === 1) {
      window.location.reload()
    }
  }

  const getBEPAccountDetails = (type) => {
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "private") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 2)
              getTokensList(first_address, "bsc")
              getWalletDetails(first_address, "bsc", 2)
            }
            return true
          })
        }
      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "private") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 2)
              getTokensList(first_address, "bsc")
              getWalletDetails(first_address, "bsc", 2)
            }
            return true
          })
        }
      })
    }
  }


  const getETHAccountDetails = (type) => {
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "main") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 1)
              getTokensList(first_address, "ethereum")
              getWalletDetails(first_address, "ethereum", 1)
            }
            return true
          })
        }
      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "main") {
          web3.eth.getAccounts().then(function (accounts) {
            var first_address = accounts[0]
            if ((typeof first_address != 'undefined')) {
              getTokenAddress(first_address, type, 1)
              getTokensList(first_address, "ethereum")
              getWalletDetails(first_address, "ethereum", 1)
            }
            return true
          })
        }
      })
    }
  }

  const connectToEthWallet = () => {
    setSelectedWalletType(1)
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "main") {
          try {
            window.ethereum.enable().then(function (res) {
              getETHAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else if (networkName === "private") {
          try {
            window.ethereum.enable().then(function (res) {
              getBEPAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else {
          handleModalMainNetwork()
        }

      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      try {
        web3.eth.net.getNetworkType().then(function (networkName) {
          if (networkName === "main") {
            try {
              window.ethereum.enable().then(function (res) {
                getETHAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else if (networkName === "private") {
            try {
              window.ethereum.enable().then(function (res) {
                getBEPAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else {
            handleModalMainNetwork()
          }
        })
      }
      catch (error) {
        // console.log('ethereum error, ', error)
      }
    }
    else {
      handleModalConnection()
    }
  }

  const [copy_status, set_copy_status] = useState(0)

  const myReferrlaLink = () => {
    set_copy_status(1)

    var copyText = document.getElementById("referral-link");
    copyText.select();
    document.execCommand("Copy");
    // var tooltip = document.getElementById("myTooltip");
    // tooltip.innerHTML = "Copied";
    setTimeout(() => set_copy_status(0), 2000)
  };

  const handleChange = (isBNB) => {
    // set_checked(isBNB)
    // set_isBNB(isBNB)
    // getGraphData("", isBNB, contract_address)
  }


  const connectToWallet = () => {
    setSelectedWalletType(2)
    if (window.web3) {
      let web3 = new Web3(Web3.givenProvider)
      web3.eth.net.getNetworkType().then(function (networkName) {
        if (networkName === "private") {
          try {
            window.ethereum.enable().then(function (res) {
              getBEPAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else if (networkName === "main") {
          try {
            window.ethereum.enable().then(function (res) {
              getETHAccountDetails(1)
            })
          }
          catch (e) {
            handleModalConnection();
          }
        }
        else {
          handleModalMainNetwork()
        }

      })
    }
    else if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      try {
        web3.eth.net.getNetworkType().then(function (networkName) {
          if (networkName === "private") {
            try {
              window.ethereum.enable().then(function (res) {
                getBEPAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else if (networkName === "main") {
            try {
              window.ethereum.enable().then(function (res) {
                getETHAccountDetails(1)
              })
            }
            catch (e) {
              handleModalConnection();
            }
          }
          else {
            handleModalMainNetwork()
          }
        })
      }
      catch (error) {
        // console.log('ethereum error, ', error)
      }
    }
    else {
      handleModalConnection()
    }
  }


  const handleModalConnection = () => {
    setHandleModalMainNetworks(false)
    setHandleModalConnections(!handleModalConnections)
  }

  const handleModalMainNetwork = () => {
    setHandleModalConnections(false)
    setHandleModalMainNetworks(!handleModalMainNetworks)
  }


  // const CheckContractAddress =(address)=>{

  //   setvalidContractAddress("")
  //   let query = "";

  //   if(searchBy === "0"){
  //     query = `
  //     query
  //     { 
  //       ethereum(network: ethereum) {
  //         address(address: {is: "`+address+`"}){

  //           annotation
  //           address

  //           smartContract {
  //             contractType
  //             currency{
  //               symbol
  //               name
  //               decimals
  //               tokenType
  //             }
  //           }
  //           balance
  //         }
  //       } 
  //   }
  //   ` ;
  //   }
  //   else{
  //     query = `
  //     query
  //     { 
  //       ethereum(network: bsc) {
  //         address(address: {is: "`+address+`"}){

  //           annotation
  //           address

  //           smartContract {
  //             contractType
  //             currency{
  //               symbol
  //               name
  //               decimals
  //               tokenType
  //             }
  //           }
  //           balance
  //         }
  //       } 
  //   }
  //   ` ;
  //   }


  //   const url = "https://graphql.bitquery.io/";
  //   const opts = {
  //   method: "POST",
  //   headers: {
  //   "Content-Type": "application/json",
  //   "X-API-KEY": graphqlApiKEY
  //   },
  //   body: JSON.stringify({
  //     query: query, 
  //   })
  //   };

  //  return fetch(url, opts)
  //   .then(res => res.json())
  //   .then(result => {  
  //     if(result.data.ethereum !== null){
  //       if(result.data.ethereum.address[0].smartContract){
  //         if(result.data.ethereum.address[0].smartContract.currency){ 
  //           if(searchBy === "0"){
  //             window.location.replace(market_coinpedia_url+'eth/'+address) 
  //           }
  //           else{
  //             window.location.replace(market_coinpedia_url+'bsc/'+address) 
  //           } 
  //         }
  //         else{
  //           setvalidContractAddress("Contract address or network type is invalid.")
  //         }
  //       }
  //       else{
  //         setvalidContractAddress("Contract address or network type is invalid.")
  //       }
  //     } 
  //     else{
  //       setvalidContractAddress("Contract address or network type is invalid.")
  //     } 
  //   }) 

  // }

  const plotGraph = async (pass_date_type) =>
  {
    await set_graph_date_type("")
    await set_graph_date_type(pass_date_type)
  }

  const setMainTab = async (pass_type) =>
  {
    await set_main_tab("")
    await set_main_tab(pass_type)
  }

  

  return (
    <>
     <Head>
      <title>{tokenData.name} | {tokenData.symbol ? tokenData.symbol.toUpperCase() : "-"} Live Price, Chart & News | Coinpedia Markets</title>
    </Head>

            <div className="markets_header_token">
            <div className="container">
              <div className="market_individual_header">
                <div className="">
                <div className="row">
                      <div className="col-lg-8 col-xl-8 col-md-8">
                        <div className="breadcrumbs">
                          <div className="breadcrumb-individual primary"><Link href="/">Cryptocurrencies</Link></div>
                          <div className="breadcrumb-individual breadcrumb-arrow"> <img src="/assets/img/breadcrumb-arrow.svg" /> </div>
                          <div className="breadcrumb-individual secondary ">{tokenData.name}</div>

                        </div>
                      </div>
                      <div className="col-lg-4 col-xl-4 col-md-4">
                        <div className="search_token_address">
                          <Search_token />
                        </div>
                      </div>
                    </div>
                <div className="row">
                    <div className="col-lg-6 col-xl-6 col-md-12 order-md-1 order-2">
                        <div className="token_main_details">
                            <div className="media">
                              <div className="media-left align-self-center">
                                <img src={"/assets/img/"+(tokenData.contract_type == 1 ? "default.png": "binance.svg")} className="token_img" alt={tokenData.contract_type == 1 ? "Ethereum": "BSC"} width="100%" height="100%" />
                              </div>

                              <div className="media-body align-self-center">
                                  <h1 className="media-heading">
                                  {tokenData.name}
                                  <span>{tokenData.symbol ? tokenData.symbol.toUpperCase() : "-"}</span>
                                  </h1>

                                  <h5 title={live_price}>
                                        {live_price > 0 ? convertCurrency(live_price): "NA"}
                                        {live_price > 0 ?
                                        <span className="timings_price">&nbsp;24h</span>
                                        :""}
                                        <span className="timings_price">
                                            
                                            <span className="values_growth">
                                                {
                                                percentage_change_24h ?
                                                percentage_change_24h > 0 ?
                                                    <span className="green"> <img src="/assets/img/value_up.svg" alt="value up"/> {percentage_change_24h}%</span>
                                                    :
                                                    <span className="red"><img src="/assets/img/value_down.svg" alt="value down"/> {percentage_change_24h}% </span>

                                                    :
                                                    null
                                                }
                                            </span>
                                        </span>
                                        </h5>


                                  <p>{tokenData.contract_type == 1 ? "Ethereum (ERC20)": "BNB Smart Chain (BEP20)"} : {(address).slice(0, 8) + "..." + (address).slice(address.length - 8, address.length)}  <img onClick={() => { copyContract(address, 'ETH') }} src="/assets/img/copy.png" alt="copy" className="copy_link" style={{width:"14px"}} height="100%" />   
                                      {
                                          contract_copy_status === 'ETH' ?
                                          <>Copied</>
                                          :
                                          null
                                      }
                                  </p>
                               
                              </div>
                            </div>
                            <ul className="token_share_vote">
                                  {data.cp_rank ? <li>#{data.cp_rank} Rank</li> : ""}
                        {/* <li style={{ cursor: "pointer" }}>
                        <a href="https://app.coinpedia.org/login?prev_url=https://markets.coinpedia.org/tether">
                            <img src="/assets/img/coin_vote.svg" /> 1
                        </a>
                        </li> */}
                        <li onClick={() => set_share_modal_status(true)} className='px-1' style={{ cursor: "pointer" }}><img src="/assets/img/coin_share.svg" alt="Share"/></li>
                        {/* <li>
                         <Link href={app_coinpedia_url + "login?prev_url=" + market_coinpedia_url + "address/"+address} >
                          <img src="/assets/img/watchlist_outline.svg"  style={{width:"18px"}} alt="watchlist" />
                          </Link>
                        </li> */}
                    </ul>
                        </div>
                    </div>
                   
                    
                </div>
                <div className="row token_header_cols">
                    <div className="col-lg-3 col-xl-3 col-md-12 pr-0">
                  
                    </div>

                     {/* <div className="token_list_values">
                                    <h4>Crypto Market Cap</h4>
                                    <h5>{market_cap?"$":null}{market_cap ? separator(market_cap.toFixed(4)): "NA"}</h5>
                                  </div>
                                  <div className="token_list_values">
                                    <h4>24H Volume / Market Cap</h4>
                                    <h5>{contract_24h_volume?"$":null}{contract_24h_volume ? separator(contract_24h_volume.toFixed(4)): "NA"}</h5>
                                  </div> */}
                    <div className="col-lg-9 col-xl-9 col-md-12">
                    <div className="token_list_data token_list_data_individual">
                      <ul>
                       
                        <li>
                        <div className="token_list_values">
                            <h4>
                            24h Volume
                            </h4>
                            <h5>                            
                                 {contract_24h_volume?"$":null}{contract_24h_volume ? separator(contract_24h_volume.toFixed(4)): "NA"}                            
                            </h5>
                           
                            {/* <OverlayTrigger
                              delay={{ hide: 450, show: 300 }}
                                overlay={(props) => (
                                  <Tooltip {...props} className="custom_pophover">
                                    <p>The 24-hour volume, also known as trading volume or trading activity, refers to the total amount of a specific coin/token that has been bought and sold within a 24-hour period. It represents the total number of coins/tokens traded during that time frame.</p>
                                  </Tooltip>
                                )}
                                placement="bottom"
                              ><span className='info_col' ><img src="/assets/img/info.png"  alt="info"/></span>
                            </OverlayTrigger> */}
                            <span className="values_growth" />
                        </div>  
                        </li>
                        <li>
                        <div className="token_list_values">
                                    <h4>Open 24h</h4>
                                    <h5>${parseFloat(open_24h) ? (parseFloat(open_24h)).toFixed(4):"NA" }</h5>
                                  </div>
                          </li>
                          <li>
                          <div className="token_list_values">
                                    <h4>Close 24h</h4>
                                    <h5>${parseFloat(close_24h) ? (parseFloat(close_24h)).toFixed(4):"NA" }</h5>
                                  </div>
                          </li>
                      </ul>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>

    <div className="page">
    <div className="market_token_details">
        
  


          <div className="container">
          

            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <div className="coin_details">
                    <div className="row">
                    <div className="col-lg-6 col-xl-4 col-md-6 order-md-1 order-2">
                    <div className="row">
                          <div className="col-md-5 col-lg-5 col-xl-6 col-6">
                            <div className="token_details_circular_graph">
                              <div class="media">
                                <img src="/assets/img/circulating_supply.svg" alt="Circulating Supply" className="dots" />
                                <div class="media-body">
                                  <h4 className="quick_title"><span></span> Max Supply 
                                    <OverlayTrigger
                                      delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip
                                          {...props}
                                          className="custom_pophover"
                                        >
                                          <p>
                                            The maximum supply, refers to the
                                            maximum number of coins or tokens
                                            that can ever exist for a specific
                                            cryptocurrency. It represents an
                                            upper limit or cap on the total
                                            supply that will ever be reached.
                                            The max supply defines the
                                            absolute ceiling for the number of
                                            coins that can be created or
                                            minted.
                                          </p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    >
                                      <span> 
                                        <img src="/assets/img/information_token.svg" alt="Information" />
                                      </span>
                                    </OverlayTrigger>
                                  </h4>                              
                                  <h5 className="quick_values">
                                    {data.max_supply
                                      ? separator(data.max_supply.toFixed(2))
                                      : "NA"}
                                  </h5>
                                </div>
                              </div>
                            </div>

                            <div className="token_details_circular_graph">
                              <div class="media">
                                <img src="/assets/img/total_supply.svg" alt="Total Supply" className="dots" />
                                <div class="media-body">
                                  <h4 className="quick_title"><span></span> Total Supply 
                                  <OverlayTrigger
                                    delay={{ hide: 450, show: 300 }}
                                    overlay={(props) => (
                                      <Tooltip
                                        {...props}
                                        className="custom_pophover"
                                      >
                                        <p>
                                          The total supply refers to the
                                          current and total number of coins
                                          or tokens that have been created
                                          and are available in the
                                          cryptocurrency's ecosystem. It
                                          includes both the circulating
                                          supply (coins in circulation) and
                                          any locked, reserved, or unissued
                                          coins. The total supply represents
                                          the maximum number of coins that
                                          can be found within the
                                          cryptocurrency's network.
                                        </p>
                                      </Tooltip>
                                    )}
                                    placement="bottom"
                                  >
                                    <span> <img src="/assets/img/information_token.svg" alt="Information" /></span>
                                  </OverlayTrigger>
                                  </h4>                              
                                  <h5 className="quick_values">
                                    {total_supply
                                      ? separator(total_supply.toFixed(2))
                                      : "NA"}
                                  </h5>

                                 
                                </div>
                              </div>
                            </div>

                            <div className="token_details_circular_graph">
                              <div class="media">
                                <img src="/assets/img/max_supply.svg" alt="Circulating Supply " className="dots" />
                                <div class="media-body">
                                  <h4 className="quick_title"><span></span> Circulating Supply
                                    <OverlayTrigger
                                      delay={{ hide: 450, show: 300 }}
                                      overlay={(props) => (
                                        <Tooltip
                                          {...props}
                                          className="custom_pophover"
                                        >
                                          <p>
                                            Circulating supply refers to the total
                                            number of coins/tokens that are currently
                                            in circulation and available to the
                                            public. It represents the portion of the
                                            total supply of a cryptocurrency that is
                                            actively being traded or held by
                                            investors.
                                          </p>
                                        </Tooltip>
                                      )}
                                      placement="bottom"
                                    >
                                    <span> <img src="/assets/img/information_token.svg" alt="Information" /></span>
                                  </OverlayTrigger>
                                  </h4>                              
                                  <h5 className="quick_values">
                                    {circulating_supply ? (
                                      <>
                                        {separator(circulating_supply) +
                                          " " +
                                          symbol.toUpperCase()}&nbsp;
                                      </>
                                    ) : (
                                      "NA"
                                    )}

                                    {circulating_supply && data.max_supply ? (
                                      <span>
                                        (
                                        {(
                                          (circulating_supply / data.max_supply) *
                                          100
                                        ).toFixed(2)}
                                        %)
                                      </span>
                                    ) : (
                                      ""
                                    )}
                                  </h5>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-7 col-lg-7 col-xl-6 col-6">
                            <div id="chart" className="quick_values_graph">
                              <DynamicChartComponent
                                options={chartData.options}
                                series={chartData.series}
                                type="radialBar"
                                height={205}
                              />
                            </div>
                          </div>
                        </div>
                    <div>
                         
                        </div>
                                      

                    </div>

                    <div className="col-lg-6 col-xl-4 col-md-6 order-md-2 order-1">
                        <div className="speedometer_summary">
                          <h5 className='sub_title_main'>Indicator Sentiment:</h5>
                          <div className="row">
                            <div className="col-md-12">
                              <p className="analysis_strong_sell">Strong<br/>Sell</p>
                              <p className="analysis_sell">Sell</p>
                              <p className="analysis_neutral">Neutral</p>
                              <p className="analysis_buy">Buy</p>
                              <p className="analysis_strong_buy">Strong<br/>Buy</p> 
                            </div>
                          </div>
                          <div className="speedometer-container">
                            <div>
                              {(summary_speedo_meter >= 60 )? (
                                <img
                                  className="speedometer-image"
                                  src="/assets/img/speedometer_green.svg"
                                  alt="Speedometer"
                                />
                              ) : 
                              (summary_speedo_meter <= 40) ?
                              (
                                <img
                                  className="speedometer-image"
                                  src="/assets/img/speedometer_red.svg"
                                  alt="Red Speedometer"
                                />
                              )
                            :
                            <img
                            className="speedometer-image"
                            src="/assets/img/speedometer_yellow.svg"
                            alt="Red Speedometer"
                          />
                            }
                          </div>


                          <ReactSpeedometer
                            currentValueText={summary_speed_meter_name}
                            textColor={'#000'}
                            value={summary_speedo_meter}
                            minValue={0}
                            width={250}
                            height={180}
                            maxValue={100}
                            needleColor="#131721"
                            startColor={ringColor}
                            segments={5}
                            endColor="red"
                            needleHeightRatio={0.7}
                            segmentWidth={15}
                            segmentLength={10}
                            ringWidth={8}
                            segmentColors={[
                                '#FF5656',
                                '#FF8888',
                                '#FEE114',
                                '#84BD32',
                                '#30AD43'
                            ]}
                            customSegmentLabels={[
                              {
                                text: ' ',
                                position: 'OUTSIDE'
                              },
                              {
                                text: ' ',
                                position: 'OUTSIDE'
                              },
                              {
                                text: ' ',
                                position: 'OUTSIDE'
                              },
                              {
                                text: ' ',
                                position: 'OUTSIDE'
                              },
                              {
                                text: '   ',
                                position: 'OUTSIDE'
                              },
                            ]}
                            needleTransition
                            needleTransitionDuration={500}
                            needleTransitionEasing="easeElastic"
                            needleTransitionDelay={0}
                            customNeedle={customNeedlePath}
                          />
                          </div>
                          <h6><span>Full analysis <img src="/assets/img/blue-right.svg" /></span></h6>
                        </div>
                        <div className="token_list_content">
                          <div className="row">
                            <div className="col-md-4 col-5">
                              <h4 className="quick_title">Market Cap</h4>
                            </div>
                            <div className="col-md-8 col-7">
                              <h5 className="quick_values">
                              {
                                circulating_supply > 0 ? (
                                <>
                                  {convertCurrency(
                                    circulating_supply * live_price
                                  )}
                                </>
                                ) : (
                                  "NA"
                                )
                              }
                              </h5>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-4 col-5">
                                    <h4 className="quick_title">High 24h</h4>
                                    </div>
                                    <div className='col-md-8 col-7'>

                                    
                                    <h5 className="quick_values">${high_24h ?(parseFloat(high_24h)).toFixed(4):"NA"}</h5>
                                  </div>
                                  </div>
                                  <div className="row">
                            <div className="col-md-4 col-5">
                                    <h4 className="quick_title">Low 24h</h4>
                                    </div>
                                    <div className='col-md-8 col-7'>
                                    <h5 className="quick_values">${low_24h ? (parseFloat(low_24h)).toFixed(4):"NA"}</h5>
                                  </div>
                                </div>
                          {/* {ath_price ? (
                          <div className="row">
                            <div className="col-md-4">
                            <h4 className="quick_title">All Time Low</h4>
                            </div>
                            <div className="col-md-8">
                              <h5 className="quick_values">
                              {
                                convertCurrency(atl_price)} &nbsp;{" "}
                                <span className="values_growth">
                                  <span className="green">
                                  <img
                                        src="/assets/img/markets/high.png"
                                        alt="High price"
                                      />

                                    {(
                                      ((live_price - atl_price) /
                                        atl_price) *
                                      100
                                    ).toFixed(2)}
                                    %
                                  </span>
                                </span>
                              </h5>
                            </div>
                          </div>):""} */}
                          
                          {/* {ath_price ? (
                          <div className="row">
                            <div className="col-md-4">
                            <h4 className="quick_title">All Time High</h4>
                            </div>
                            <div className="col-md-8">
                              <h5 className="quick_values">
                              {convertCurrency(ath_price)} &nbsp;{" "}
                              <span className="values_growth">
                                <span className="red">
                                <img
                                        src="/assets/img/markets/low.png"
                                        alt="High price"
                                      />
                                  {(
                                    ((live_price - ath_price) /
                                      ath_price) *
                                    100
                                  ).toFixed(2)}
                                  %
                                </span>
                              </span>
                              </h5>
                            </div>
                          </div>):""} */}

                          <div className="row">
                            <div className="col-md-4 col-5">
                            <h4 className="quick_title">Green Days</h4>
                            </div>
                            <div className="col-md-8 col-7">
                              <h5 className="quick_values">
                              {
                                green_days ? 
                                <>
                                {green_days} / 30 {!isNaN(percentage) ? <>({percentage.toFixed(2)}%)</>:""}
                                </>
                                :
                                "NA"
                              }
                              </h5>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 col-5">
                            <h4 className="quick_title">50-Day SMA</h4>
                            </div>
                            <div className="col-md-8 col-7">
                              <h5 className="quick_values">
                              {close_price_of_fifty ? (
                                <>
                                  {convertCurrency(close_price_of_fifty)}
                                </>
                              ) : (
                                "NA"
                              )}
                              </h5>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-4 col-5">
                              <h4 className="quick_title">200-Day SMA</h4>
                            </div>
                            <div className="col-md-8 col-7">
                              <h5 className="quick_values">
                              {close_price_of_two_hundred ? (
                                <>
                                  {convertCurrency(close_price_of_two_hundred)}
                                </>
                              ) : (
                                "NA"
                              )}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>

                      

                      <div className="col-lg-6 col-xl-4 col-md-6 order-md-3 order-3">
                      <Dex_overview reqData={{ contract_address: address, contract_type:tokenData.contract_type, token_symbol: tokenData.symbol, volume: 1232 }} />
                      <div className='row'>
                            <div className='col-12'>
                              <h5 className="sub_title_main mt-2">{tokenData.symbol} to {converter_object.currency_name} Converter</h5>
                              <div className="usd_converter">
                                <img className="interchamge_icon" src="/assets/img/interchange_icon.svg" alt="Exchange" />

                              <div className="input-group">
                                <div className="input-group-prepend converter-label">
                                  <span className="input-group-text"><img src={"/assets/img/"+(tokenData.contract_type == 1 ? "default.png": "binance.svg")} alt="UNI" /> &nbsp;{tokenData.symbol}</span>
                                </div>
                                <input type="number" value={token_converter_value} onChange={(e) => tokenConverter(e.target.value, 1, converter_pair_currency, converter_object)} step="0.000001" min="0.000001" className="form-control converter-input" placeholder="0" />
                               
                              </div>
                              <div className="input-group">
                              <div className="input-group-prepend converter-label">
                                  <span className="input-group-text converter-second-span">
                                  <div className="dropdown">
                                      <button className="convertor_dropdown dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        {
                                          converter_object ?
                                          <>
                                          {
                                            converter_object.currency_type == 1 ?
                                            <img src={"/assets/img/flags/"+converter_object.currency_image} alt="Currency Image" className="converter-currency-image" />
                                            :
                                            converter_object.currency_type == 2 ?
                                            <img src={image_base_url+converter_object.currency_image} alt="Currency Image" className="converter-currency-image" />
                                            :
                                            converter_object.currency_type == 3 ?
                                            <img src={"/assets/img/flags/"+converter_object.currency_image} alt="Currency Image" className="converter-currency-image" />
                                            :
                                            ""
                                          } {converter_object.currency_name}
                                          </>
                                          :
                                          ""
                                        }
                                        
                                      </button>
                                      <div className={`convertor_dropdown_block dropdown-menu ${isOpen ? 'closed' : 'open'}`} aria-labelledby="volumeDropdown">
                                        {
                                            converter_pair_currencies.map((item, i) =>
                                              item.currency_name != data.symbol ? 
                                              <a key={i} className={`dropdown-item ${converter_pair_currency === item.currency_value ? 'active' : ''}`} onClick={()=>tokenConverter(token_converter_value, 1, item.currency_value , item)}>
                                                <span>
                                                  {
                                                    item.currency_type == 1 ?
                                                    <img src={"/assets/img/flags/"+item.currency_image} alt="Currency Image" className="converter-currency-image" />
                                                    :
                                                    item.currency_type == 2 ?
                                                    <img src={image_base_url+item.currency_image} alt="Currency Image" className="converter-currency-image" />
                                                    :
                                                    item.currency_type == 3 ?
                                                    <img src={"/assets/img/flags/"+item.currency_image} alt="Currency Image" className="converter-currency-image" />
                                                    :
                                                    ""
                                                  } {item.currency_name}
                                                </span>
                                              </a>
                                              : 
                                              ""
                                            )
                                        }     
                                      </div>
                                    </div>
                                  </span>
                                </div>
                                <input type="number" value={usd_converter_value} onChange={(e) => tokenConverter(e.target.value, 2, converter_pair_currency)} step="0.000001" min="0.000001" className="form-control converter-input" placeholder="0" />
                              </div>
                               {/* <Community_scrore reqData={{token_row_id:data._id, my_voting_status:data.voting_status ? data.voting_status:0, total_voting_count:data.total_voting_count, positive_voting_counts:data.positive_voting_counts, parent_user_token:user_token, request_config}}/>  */}
                              
                            </div>
                          </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="market_token_tabs ">
                <div className="row">
                  <div className="col-md-12 col-sm-12 col-12 col-lg-12 col-xl-8" >
                    <div className='token_details_tabs_row'>
                      <ul className="nav nav-tabs ">
                        <li className="nav-item">
                          <a data-toggle="tab" onClick={()=>setMainTab(1)} className={"nav-link "+(main_tab == 1? " active":"")} ><span>Charts</span></a>
                        </li>
                        <li className="nav-item" >
                          <a className={"nav-link "+(main_tab == 11 ? "active":"")} onClick={()=>set_main_tab(11)}>Analysis</a>
                        </li>
                        <li className="nav-item" >
                          <a className={"nav-link " + (main_tab == 9 ? "active" : "")} onClick={() => set_main_tab(9)}>Liquidity Pools</a>
                        </li>
                        <li className="nav-item" >
                          <a className={"nav-link " + (main_tab == 10 ? "active" : "")} onClick={() => set_main_tab(10)}>Trade History</a>
                        </li>

                      

                         {/* <li className="nav-item">
                          <a data-toggle="tab" onClick={()=>set_main_tab(2)} className={"nav-link "+(main_tab == 2 ? " active":"")} ><span>Exchange</span></a>
                        </li> */}

                        {/* <li className="nav-item">
                          <a data-toggle="tab" onClick={()=>set_main_tab(3)} className={"nav-link "+(main_tab == 3 ? " active":"")} ><span>Transactions</span></a>
                        </li> */}

                        <li className="nav-item" >
                           <a className={"nav-link "+(main_tab == 7 ? "active":"")} onClick={()=>set_main_tab(4)}>Price Analysis</a>
                        </li>
                        <li className="nav-item" >
                          <a className={"nav-link "+(main_tab == 8 ? "active":"")} onClick={()=>set_main_tab(5)}>Prediction</a>
                        </li>
                       
                        
                      </ul>            
                    </div>
                   
              <div className="tab-content">
                <div className={"tab-pane fade "+(main_tab == 1 ? " show active":"")}>
                
                  <div className="tokendetail_charts" style={{minHeight:"456px", marginBottom:"30px"}}>
                      {/* <div className="row">
                          <div className="col-md-6 col-12">
                              <div className="charts_date_tab float-left charts_price_tabs">
                              <ul className="nav nav-tabs">
                                  <li className="nav-item">
                                  <a className="nav-link active" data-toggle="tab">
                                      <span>Price</span>
                                  </a>
                                  </li>
                              </ul>
                              </div>
                          </div>
                          
                          <div className="col-md-6 col-12">
                              <div className="charts_date_tab date_chart_interval">
                                <ul className="nav nav-tabs">
                                  {
                                    bitgquery_graph_ranges.length > 0 ?
                                      bitgquery_graph_ranges.map((item) =>
                                      <li className="nav-item" key={0} onClick={()=>plotGraph(item._id)}>
                                        <a className={"nav-link "+(item._id == graph_date_type ? " active":"")}>
                                            <span>{item.range_name}</span>
                                        </a>
                                      </li> 
                                      )
                                    :
                                    ""
                                  }
                                </ul>
                              </div>
                          </div>
                      </div>   */}
                                  
                        {
                          main_tab==1 ?
                            graph_date_type ?
                            <>
                            <div className='charts_price_tabs'>
                            <TradingView reqData={{symbol:(tokenData.symbol?(tokenData.symbol).toLowerCase():"ETH"), network_row_id: tokenData.network_row_id, contract_address: address }} />
                            {/* <Price_chart reqData={{address:address, contract_type:tokenData.contract_type, graph_date_type:graph_date_type}}/> */}
                            
                            <br/>
                            </div>
                            </>
                            :
                            ""
                          :
                          ""
                        }          
                  </div>          
                </div>

                <div className={"tab-pane fade "+(main_tab == 2 ? " show active":"")}>
                <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Exchange</th>
                          <th>Pairs</th>
                          <th>Trades Count</th>
                          <th>Amount</th>
                          {/* 
                          <th>Liquidity in Pool</th>
                          <th>Takers</th>
                          <th>Makers</th>
                          */}
                          

                        </tr>
                      </thead>
                      {

                        <tbody>
                          {
                            exchangelistnew.map((e, i) => {
                              return <tr key={i}>
                                <td title={e.exchange_address}>{e.exchange_name}</td>
                                <td title={e.pair_one_token_address}>{e.pair_one_name ? e.pair_one_name:e.exchange_name}  <span  style={{fontSize:"14px",fontWeight: "500", color:"#938f8f"}}>/ {tokenData.symbol ? tokenData.symbol.toUpperCase() : ""}</span>

                                  {
                                    (e.pair_one_value && e.pair_two_value) ?
                                    <span className="pooledvalue">
                                      ({e.pair_one_value ? separator(e.pair_one_value.toFixed(3)) : "0.00"}) /
                                      ({e.pair_two_value ? separator(e.pair_two_value.toFixed(3)) : "0.00"})
                                  </span>
                                    :
                                    ""
                                  }
                                 </td>
                                {/* <td>
                                  <>
                                  {
                                    e.liquidity_in_pool ?
                                    <>
                                    ${separator(e.liquidity_in_pool + (e.pair_two_value * live_price))} 
                                    </>
                                    :
                                    "-"
                                  }
                                  </>
                                  
                                </td> */}
                                <td>{e.trades}</td>
                                <td>${(parseFloat(e.tradeAmount)).toFixed(2)}</td>
                                {/* <td>--</td> */}
                                {/* <td>--</td>
                                <td>--</td> */}
                              </tr>
                            })


                          }
                        </tbody>



                      }
                    </table>
                    {/* {
                      exchangelistnew.length > 10
                        ?
                        <div className="pager__list pagination_element">
                          <ReactPaginate
                            previousLabel={selectedPage + 1 !== 1 ? "Previous" : ""}
                            nextLabel={selectedPage + 1 !== pageCount ? "Next" : ""}
                            breakLabel={"..."}
                            breakClassName={"break-me"}
                            forcePage={selectedPage}
                            pageCount={pageCount}
                            marginPagesDisplayed={2}
                            onPageChange={handlePageClick}
                            containerClassName={"pagination"}
                            subContainerClassName={"pages pagination"}
                            activeClassName={"active"} />
                        </div>
                        :
                        null
                    } */}
                  </div>
                </div>

                <div className={"tab-pane fade "+(main_tab == 3 ? " show active":"")}>
                    c
                </div>


                <div id="priceanalysis" className={"tab-pane fade "+(main_tab == 4 ? "show active":"")}>
                    <Price_analysis/> 
                </div>

                <div id="priceprediction" className={"tab-pane fade "+(main_tab == 5 ? "show active":"")}>
                    <Price_prediction/>
                </div>

   
          {/* Technical analysis code starts here */}

          <div id="technical_analysis" className={"tab-pane fade " + (main_tab == 11 ? "show active" : "")}>

               <div className='row'>
                <div className='col-md-6'>

                </div>
                <div className='col-md-6'>
                <div className="charts_date_tab date_chart_interval">
                                  <div className='dex_filter mb-3'>
            <div class="dropdown">
                <button className="dex_filter_button dropdown-toggle" value={1} onChange={(e)=>indicatorSourceType(e.target.value)} type="button" id="dropdownSortBy" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                5 Minutes <img src="/assets/img/features_dropdown.svg" alt="Features Dropdown" class="dropdown_arrow_img" />
                </button>
                <div  className={`dropdown_block badge_dropdown_block dropdown-menu ${isOpen ? 'closed' : 'open'}`}
                    aria-labelledby="dropdownSortBy">
                                     <ul>
                  {indicator_time_series.length ?
                    indicator_time_series.map((item, i) =>
                      item.search_bitquery == true ?
                      <li className="dropdown-item" onClick={() => tokenOtherDetails(item.interval_type)}>
                        {item.interval_time}
                      </li>
                      :
                      ""
                    )
                    :
                    ""
                  }
                </ul>
                                      </div></div></div>
                                  </div>
                  </div>
               </div>


              
              <div className="row">
                <div className="col-md-4">
                  <div className="text-center small_guage">
                    <h3 className="heading">Oscillator</h3>
                    <div className="row">
                                            <div className="col-md-12">
                                              <p className="analysis_tab_secondary_strong_sell">Strong<br/>Sell</p>
                                              <p className="analysis_tab_secondary_sell">Sell</p>
                                              <p className="analysis_tab_secondary_neutral">Neutral</p>
                                              <p className="analysis_tab_secondary_buy">Buy</p>
                                              <p className="analysis_tab_secondary_strong_buy">Strong<br/>Buy</p> 
                                            </div>
                                          </div>
                                            <div>
                                              {(oscillator_speedo_meter >= 60 )? (
                                                <img
                                                  className="analysis_tab_secondary_strong_buy_speedometer_image"
                                                  src="/assets/img/speedometer_green.svg"
                                                  alt="Speedometer"
                                                />
                                              ) : 
                                              (oscillator_speedo_meter <= 40) ?
                                              (
                                                <img
                                                  className="analysis_tab_secondary_strong_buy_speedometer_image"
                                                  src="/assets/img/speedometer_red.svg"
                                                  alt="Red Speedometer"
                                                />
                                              )
                                            :
                                            <img
                                            className="analysis_tab_secondary_strong_buy_speedometer_image"
                                            src="/assets/img/speedometer_yellow.svg"
                                            alt="Red Speedometer"
                                          />
                                            }
                                            </div>
                                          <ReactSpeedometer
                                            currentValueText={oscillator_speed_meter_name}
                                            textColor={'#000'}
                                            value={oscillator_speedo_meter}
                                            minValue={0}
                                            maxValue={100}
                                            needleColor="#131721"
                                            startColor={ringColor}
                                            segments={5}
                                            width={200}
                                            height={150}
                                            endColor="red"
                                            needleHeightRatio={0.6}
                                            segmentWidth={15}
                                            segmentLength={10}
                                            ringWidth={8}
                                            segmentColors={[
                                              '#FF5656',
                                              '#FF8888',
                                              '#FEE114',
                                              '#84BD32',
                                              '#30AD43'
                                            ]}
                                            customSegmentLabels={[
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                            ]}
                                            needleTransition
                                            needleTransitionDuration={500}
                                            needleTransitionEasing="easeElastic"
                                            needleTransitionDelay={0}
                                            customNeedle={customNeedlePath}
                                          />
                  </div>
                  <div className="row">
                    <div className="col-md-1">&nbsp;</div>
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-4 col-4">
                          <div className="overview_analysis">
                            <h5>Sell</h5>
                            <h4>{oscillator_sell}</h4>
                          </div>
                        </div>
                        <div className="col-md-4 col-4">
                          <div className="overview_analysis">
                            <h5>Neutral</h5>
                            <h4>{oscillator_neutral}</h4>
                          </div>
                        </div>
                        <div className="col-md-4 col-4">
                          <div className="overview_analysis">
                            <h5>Buy</h5>
                            <h4>{oscillator_buy}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                   <div className="col-md-4">
                                        <div className="text-center analysis_summary">
                                          <h3 className="heading">Summary</h3>
                                          <div className="row">
                                            <div className="col-md-12">
                                              <p className="analysis_tab_primary_strong_sell">Strong<br/>Sell</p>
                                              <p className="analysis_tab_primary_sell">Sell</p>
                                              <p className="analysis_tab_primary_neutral">Neutral</p>
                                              <p className="analysis_tab_primary_buy">Buy</p>
                                              <p className="analysis_tab_primary_strong_buy">Strong<br/>Buy</p> 
                                            </div>
                                          </div>

                                            <div>
                                              {(summary_speedo_meter >= 60 )? (
                                                <img
                                                  className="analysis_tab_primary_strong_buy_speedometer_image"
                                                  src="/assets/img/speedometer_green.svg"
                                                  alt="Speedometer"
                                                />
                                              ) : 
                                              (summary_speedo_meter <= 40) ?
                                              (
                                                <img
                                                  className="analysis_tab_primary_strong_buy_speedometer_image"
                                                  src="/assets/img/speedometer_red.svg"
                                                  alt="Red Speedometer"
                                                />
                                              )
                                            :
                                            <img
                                            className="analysis_tab_primary_strong_buy_speedometer_image"
                                            src="/assets/img/speedometer_yellow.svg"
                                            alt="Red Speedometer"
                                          />
                                            }
                                            </div>
                                          <ReactSpeedometer
                                            currentValueText={summary_speed_meter_name}
                                            textColor={'#000'}
                                            value={summary_speedo_meter}
                                            minValue={0}
                                            width={250}
                                            height={180}
                                            maxValue={100}
                                            needleColor="#131721"
                                            startColor={ringColor}
                                            segments={5}
                                            endColor="red"
                                            needleHeightRatio={0.7}
                                            segmentWidth={15}
                                            segmentLength={10}
                                            ringWidth={8}
                                            segmentColors={[
                                              '#FF5656',
                                              '#FF8888',
                                              '#FEE114',
                                              '#84BD32',
                                              '#30AD43'
                                            ]}
                                            customSegmentLabels={[
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                            ]}
                                            needleTransition
                                            needleTransitionDuration={500}
                                            needleTransitionEasing="easeElastic"
                                            needleTransitionDelay={0}
                                            customNeedle={customNeedlePath}
                                          />
                                        </div>
                                        <div className="row">
                                          <div className="col-md-1">&nbsp;</div>
                                          <div className="col-md-10">
                                            <div className="row">
                                              <div className="col-md-4 col-4">
                                                <div className="overview_analysis">
                                                  <h5>Sell</h5>
                                                  <h4>{summary_sell}</h4>
                                                </div>
                                              </div>
                                              <div className="col-md-4 col-4">
                                                <div className="overview_analysis">
                                                  <h5>Neutral</h5>
                                                  <h4>{summary_neutral}</h4>
                                                </div>
                                              </div>
                                              <div className="col-md-4 col-4">
                                                <div className="overview_analysis">
                                                  <h5>Buy</h5>
                                                  <h4>{summary_buy}</h4>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                    <div className="col-md-4">
                                      <div className="text-center small_guage">
                                        <h3 className="heading">Moving Average</h3>
                                        <div className="row">
                                            <div className="col-md-12">
                                              <p className="analysis_tab_secondary_strong_sell">Strong<br/>Sell</p>
                                              <p className="analysis_tab_secondary_sell">Sell</p>
                                              <p className="analysis_tab_secondary_neutral">Neutral</p>
                                              <p className="analysis_tab_secondary_buy">Buy</p>
                                              <p className="analysis_tab_secondary_strong_buy">Strong<br/>Buy</p> 
                                            </div>
                                          </div>
                                          <div>
                                                {(sma_speedo_meter >= 60 )? (
                                                  <img
                                                    className="analysis_tab_secondary_strong_buy_speedometer_image"
                                                    src="/assets/img/speedometer_green.svg"
                                                    alt="Speedometer"
                                                  />
                                                ) : 
                                                (sma_speedo_meter <= 40) ?
                                                (
                                                  <img
                                                    className="analysis_tab_secondary_strong_buy_speedometer_image"
                                                    src="/assets/img/speedometer_red.svg"
                                                    alt="Red Speedometer"
                                                  />
                                                )
                                              :
                                              <img
                                              className="analysis_tab_secondary_strong_buy_speedometer_image"
                                              src="/assets/img/speedometer_yellow.svg"
                                              alt="Red Speedometer"
                                            />
                                              }
                                              </div>
                                          <ReactSpeedometer
                                            currentValueText={sma_speed_meter_name}
                                            textColor={'#000'}
                                            width={200}
                                            height={150}
                                            value={sma_speedo_meter}
                                            minValue={0}
                                            maxValue={100}
                                            needleColor="#131721"
                                            startColor={ringColor}
                                            segments={5}
                                            endColor="red"
                                            needleHeightRatio={0.6}
                                            segmentWidth={15}
                                            segmentLength={10}
                                            ringWidth={8}
                                            segmentColors={[
                                              '#FF5656',
                                              '#FF8888',
                                              '#FEE114',
                                              '#84BD32',
                                              '#30AD43'
                                            ]
                                            }
                                            customSegmentLabels={[
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                              {
                                                text: '',
                                                position: 'OUTSIDE'
                                              },
                                            ]}
                                            needleTransition
                                            needleTransitionDuration={500}
                                            needleTransitionEasing="easeElastic"
                                            needleTransitionDelay={0}
                                            customNeedle={customNeedlePath}
                                          />
                  </div>

                  <div className="row">
                    <div className="col-md-1">&nbsp;</div>
                    <div className="col-md-10">
                      <div className="row">
                        <div className="col-md-4 col-4">
                          <div className="overview_analysis">
                            <h5>Sell</h5>
                            <h4>{total_sma_sell}</h4>
                          </div>
                        </div>
                        <div className="col-md-4 col-4">
                          <div className="overview_analysis">
                            <h5>Neutral</h5>
                            <h4>{total_sma_neutral}</h4>
                          </div>
                        </div>
                        <div className="col-md-4 col-4">
                          <div className="overview_analysis">
                            <h5>Buy</h5>
                            <h4>{total_sma_buy}</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
           
              <div className="row ">
              {moving_averages_crossovers && sma_list.length > 0 && (
                              
                               
                                  <div className="col-md-6 ">
                                    <div className="analysis_values">
                                    <h4 className="" style={{background: total_sma_buy > total_sma_sell ? 'linear-gradient(180deg, rgb(112 241 192) 0%, #fff 100%)' : 'linear-gradient(180deg, #ff7c8e 0%, #fff 90%)'}}>Technical Indicators
                                    <span className={oscillator_buy > oscillator_sell ? 'summary_bullish active' : 'summary_bearish active'}>
                                            {oscillator_buy > oscillator_sell ? 'Strong Buy' : 'Strong Sell'}
                                          </span>
                                    </h4>
                                    <div className="technical_anaylysis_table simple_analysis">
                                          <table className="table">
                                          <thead>
                                            <tr className="inner_table_average">
                                              <th >
                                                <p className="">Name</p>
                                              </th>
                                              <th >
                                                <p className="">Value</p>
                                              </th>
                                              <th>
                                                <p className="">Action</p>
                                              </th>
                                            </tr>
                                          </thead>
                                        
                                          <tbody>
                                            
                                            <tr>
                                              <td>Volatility</td>
                                              <td>{volatility} %</td>
                                              <td>
                                              {
                                                volatility ? (
                                                <>
                                                    {
                                                        volatility < 1  ? 
                                                        <span className="bearish sell">Very Low</span>
                                                        : 
                                                        volatility >= 1 && volatility < 2 ? 
                                                        <span className="bearish sell">Low</span>
                                                        :
                                                        volatility >= 2 && volatility < 5 ? 
                                                        <span className="neutral">Neutral</span>
                                                        :
                                                        volatility >= 5 && volatility < 10 ? 
                                                        <span className="bullish buy">High</span>
                                                        : 
                                                        volatility >= 10 && volatility < 20 ?
                                                        <span className="bullish buy">Very High</span>
                                                        : 
                                                        <span className="bullish buy">Extremely High</span>
                                                    }
                                                </>
                                              ) : (
                                                "NA"
                                              )}
                                                {/* <span className="bearish">Sell</span> */}
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>RSI</td>
                                              <td>{rsi_value}</td>
                                              <td>
                                                <span className={`${
                                                  rsi_value < 30 ? 'bearish sell' : rsi_value > 70 ? 'bullish buy' : 'neutral'
                                                }`}>
                                                {rsi_value < 30 ? 'Sell' : rsi_value > 70 ? 'Buy' : 'Neutral'}
                                                </span>
                                              </td>
                                            </tr>
                                          

                            
                                            <tr>
                                                <td>MACD (12,26) </td>
                                                <td>{roundNumericValue(macd_line)}</td>
                                                <td>
                                                    <span className={`${
                                                    macd_line < 0 ? 'bearish sell' : macd_line > 0 ? 'bullish buy' : 'neutral'
                                                    }`}>
                                                    {macd_line < 0 ? 'Sell' : macd_line > 0 ? 'Buy' : 'Neutral'}
                                                    </span>
                                                </td>
                                            </tr>
                                           
                                            <tr>
                                              <td>Stochastic (20,3) &nbsp;
                                            <OverlayTrigger
                                              delay={{ hide: 450, show: 300 }}
                                              overlay={(props) => (
                                                <Tooltip
                                                  {...props}
                                                  className="custom_pophover"
                                                >
                                                  <p>
                                                  20 Indicates the Number of periods
                                                  &
                                                  3 Indicates the Last 3 values of 20 % k SMA Value
                                                  </p>
                                                </Tooltip>
                                              )}
                                              placement="bottom"
                                            >
                                              <span className="info_col">
                                                <img
                                                  src="/assets/img/info.png"
                                                  alt="Info"
                                                />
                                              </span>
                                            </OverlayTrigger>
                                            </td>
                                            <td>{roundNumericValue(stochastic_values.slow)}</td>
                                            <td>
                                                {
                                                  stochastic_values.slow <= 45 ? 
                                                  <span className="bullish buy">Buy</span>
                                                  : 
                                                  stochastic_values.slow >= 55 ? 
                                                  <span className="bearish sell">Sell</span>
                                                  : 
                                                  <span className="neutral">Neutral</span>
                                                }
                                            </td>
                                        </tr>

                                            <tr>
                                              <td>ATR (14)</td>
                                              <td>{roundNumericValue(average_true_range)}</td>
                                              <td>
                                                {/* <span className="bearish">Sell</span> */}
                                              </td>
                                            </tr>
                                            {/* <tr>
                                              <td>ADX (14)</td>
                                              <td>74.20</td>
                                              <td><span className="bearish">Sell</span></td>
                                              
                                            </tr> */}
                                           
                                            <tr>
                                              <td>ROC</td>
                                              <td>{roundNumericValue(roc)}</td>
                                              <td>
                                                {
                                                  roc < 0 ?
                                                  <span className="bearish sell">Sell</span>
                                                  :
                                                  roc > 0 ?
                                                  <span className="bullish buy">Buy</span>
                                                  :
                                                  <span className="neutral">Neutral</span>
                                                } 
                                            </td>
                                            </tr>
                                            
                                            <tr>
                                              <td>CCI (20)</td>
                                              <td>{roundNumericValue(cci)}</td>  
                                              <td>
                                                {
                                                  cci > 50?
                                                  <span className="bullish buy">Buy</span>
                                                  :
                                                  cci < -50?
                                                  <span className="bearish sell">Sell</span>
                                                  :
                                                  <span className="neutral">Neutral</span>
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>MFI</td>
                                              <td>{roundNumericValue(money_flow_index)}</td>
                                              <td>
                                                {
                                                  money_flow_index <= 20?
                                                  <span className="bullish buy">Buy</span>
                                                  :
                                                  money_flow_index > 80?
                                                  <span className="bearish sell">Sell</span>
                                                  :
                                                  <span className="neutral">Neutral</span>
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>WPR (14)</td>
                                              <td>{roundNumericValue(williams_percent_range)}</td>
                                              <td>
                                                {
                                                  williams_percent_range > -50?
                                                  <span className="bullish buy">Buy</span>
                                                  :
                                                  williams_percent_range < -60?
                                                  <span className="bearish sell">Sell</span>
                                                  :
                                                  <span className="neutral">Neutral</span>
                                                }
                                              </td>
                                            </tr>
                                            <tr>
                                                <td>Bull Bear Power</td>
                                                <td>{roundNumericValue(bull_bear_power)}</td>
                                                <td>
                                                  <span className={`${
                                                    bull_bear_power < 0 ? 'bearish sell' : bull_bear_power > 0 ? 'bullish buy' : 'neutral'
                                                  }`}>
                                                    {bull_bear_power < 0 ? 'Sell' : bull_bear_power > 0 ? 'Buy' : 'Neutral'}
                                                  </span>
                                                </td>
                                              </tr>

                                            <tr className="bollinger_bands_space">
                                              <td><br/> Bollinger Bands</td>
                                              <td>
                                                SMA20: {roundNumericValue(bollinger_bands.sma20)}
                                                <br/>UB: {roundNumericValue(bollinger_bands.upper_band)}  
                                                <br/>LB: {roundNumericValue(bollinger_bands.lower_band)}
                                              </td>
                                              <td>
                                                <br/>
                                                <span className={`${
                                                live_price >= bollinger_bands.upper_band ? 'bearish sell' :
                                                live_price <= bollinger_bands.lower_band ? 'bullish buy' :
                                                'neutral'
                                            }`}>
                                                {live_price >= bollinger_bands.upper_band ? 'Sell' :
                                                live_price <= bollinger_bands.lower_band ? 'Buy' :
                                                'Neutral'}
                                            </span>
                                              </td>
                                            </tr>

                                          </tbody>
                                        </table>
                                        <p className="total_buy_sell_neutral"><span>Buy: {oscillator_buy}</span> <span>Sell: {oscillator_sell}</span> <span>Neutral: {oscillator_neutral}</span></p>

                                      </div>
                                      
                                    </div>
                                 
                                <div className="analysis_values">
                                <h4 className="" style={{background: 'linear-gradient(180deg, rgb(112 241 192) 0%, #fff 100%)'}}>
                                  Moving Averages Crossovers
                                  <span className={'summary_bullish active'}>
                                                                      Strong Buy
                                                                    </span>
                                                                    </h4>     
                                
                                        
                                    <div className="technical_anaylysis_table simple_analysis">
                                      <table className="table">
                                    <thead>
                                      <tr className="inner_table_average">
                                        <th colspan="0">
                                          <p className="">Period</p>
                                        </th>
                                        <th colspan="0">
                                          <p className="">Moving Average Crossover</p>
                                        </th>
                                        <th colspan="0">
                                          <p className="">Indication</p>
                                        </th>
                                      </tr>
                                    </thead>
                                  
                                    <tbody>
                                    {moving_averages_crossovers.length > 0 ? moving_averages_crossovers.map((item, i) => (
                                    <tr key={i}>
                                        <td> {item.term}</td>
                                        <td>
                                          <span className="">
                                            {item.start_sma_day} & {item.end_sma_day} DMA Crossover
                                          </span>
                                        </td>
                                        <td>
                                          <span  className={`Capital_Singnal ${
                                              item.signal_description === 'bearish'
                                                ? 'bearish'
                                                : item.signal_description === 'bullish'
                                                ? 'bullish'
                                                : item.signal_description === 'neutral'
                                                ? 'neutral'
                                                : ''
                                            }`}>  
                                            {item.signal_description}
                                          </span>
                                        </td>
                                      </tr>
                                      )):
                                      <tr>
                                        <td>No Data Found</td>
                                      </tr>
                                      
                                      }
                                    </tbody>
                                  </table>
                                  <p className="total_buy_sell_neutral"><span>Bullish: {ma_crossovers_bullish}</span> <span>Bearish: {ma_crossovers_bearish}</span> </p>
                                </div>
                                </div>
                              </div>
                                 
                                 
                                )}

              {/* <div className='row'>
             
                <div className="col-md-6">
  <div className="analysis_values">
        <h4 className="" style={{background: total_sma_buy > total_sma_sell ? 'linear-gradient(180deg, rgb(112 241 192) 0%, #fff 100%)' : 'linear-gradient(180deg, #ff7c8e 0%, #fff 90%)'}}>Exponential Moving Averages (EMA)
        <span className={total_sma_buy > total_sma_sell ? 'summary_bullish active' : 'summary_bearish active'}>
                                            {total_sma_buy > total_sma_sell ? 'Strong Buy' : 'Strong Sell'}
                                          </span>
        </h4>

        <div className="technical_anaylysis_table simple_analysis">
                                          <table className="table">
            <thead>
              <tr className="inner_table_average">
                <th>
                  <p className="">Period</p>
                </th>
                <th>
                  <p className="">Value</p>
                </th>
                <th>
                  <p className="">Action</p>
                </th>
              </tr>
            </thead>

            <tbody>
             


              
            </tbody>
          </table>

          
          <p className="total_buy_sell_neutral">
            <span>Buy: {total_ema_buy}</span> <span>Sell: {total_ema_sell}</span> <span>Neutral: {total_ema_neutral}</span>
          </p>
        </div>
        </div>
  </div>
              </div> */}


  <div className="col-md-6">
                <div className="analysis_values">
                      <h4 className=""  
                      style={{background: oscillator_buy > oscillator_sell ? 'linear-gradient(180deg, rgb(112 241 192) 0%, #fff 100%)' : 'linear-gradient(180deg, #ff7c8e 0%, #fff 90%)'}}>
                        Moving Averages
                      <span className={oscillator_buy > oscillator_sell ? 'summary_bullish active' : 'summary_bearish active'}>
                                            {oscillator_buy > oscillator_sell ? 'Strong Buy' : 'Strong Sell'}
                                          </span>
                      </h4>
                     

                  <div className="technical_anaylysis_table simple_analysis">
                                          <table className="table">
                          <thead>
                            <tr className="inner_table_average">
                              <th>
                                <p className="">Period</p>
                              </th>
                              
                              <th>
                                <p className="">Value</p>
                              </th>
                              <th>
                                <p className="">Action</p>
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            {sma_list.length > 0 ? (
                              sma_list.map((item, i) => 
                              {
                                if(live_price > item.sma_value) 
                                {
                                  sma_buy_count++;
                                } else if (live_price < item.sma_value) {
                                  sma_sell_count++;
                                } else {
                                  sma_neutral_count++;
                                }
                                
                                return (
                                  <tr key={i}>
                                    <td> SMA {item.day_number}</td>
                                    <td>
                                      <span>
                                        {roundNumericValue(item.sma_value)}
                                      </span>
                                    </td>
                                    <td>
                                        {
                                          live_price > item.sma_value ? 
                                          <span className="bullish">Buy</span>
                                          : 
                                          live_price < item.sma_value ? 
                                          <span className="bearish">Sell</span>
                                          : 
                                          <span className="neutral">Neutral</span>
                                        }
                                    </td>

                                    
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td>No Data Found</td>
                              </tr>
                            )}


                            {sma_list.length > 0 ? (
                                sma_list.map((item, i) => {
                                  if(live_price > item.ema_value) 
                                  {
                                    ema_buy_count++;
                                  } else if (live_price < item.ema_value ) 
                                  {
                                    ema_sell_count++;
                                  }
                                  else 
                                  {
                                    ema_neutral_count++;
                                  }

                                  return (
                                    <tr key={i}>
                                      <td> EMA {item.day_number}</td>
                                      <td>
                                        <span>
                                        {roundNumericValue(item.ema_value)}
                                        </span>
                                      </td>
                                      <td>
                                          {
                                            live_price > item.ema_value ? 
                                            <span className="bullish">Buy</span>
                                            : 
                                            live_price < item.ema_value ? 
                                            <span className="bearish">Sell</span>
                                            : 
                                            <span className="neutral">Neutral</span>
                                          }
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td>No Data Found</td>
                                </tr>
                              )}
                          </tbody>
                        </table>
                        <p className="total_buy_sell_neutral">
                          <span>Buy: {total_sma_buy}</span> <span>Sell: {total_sma_sell}</span> <span>Neutral: {total_sma_neutral}</span>
                        </p>
                        {/* <h3 className="summary_total">
                          Summary: <span className={total_sma_buy > total_sma_sell ? 'summary_bullish active' : 'summary_bearish active'}>
                            {total_sma_buy > total_sma_sell ? 'Strong Buy' : 'Strong Sell'}
                          </span>
                        </h3> */}
                      </div>
                      </div>
                
    <div className="analysis_values">
      <h4 className="">Other Moving Averages</h4> 
      <div className="technical_anaylysis_table simple_analysis">
                                          <table className="table">
        <thead>
          <tr className="inner_table_average">
            <th colspan="0">
              <p className="">Period</p>
            </th>
            <th colspan="0">
              <p className="">Value</p>
            </th>
            <th colspan="0">
              <p className="">Action</p>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>HMA(9)</td>
            <td>{roundNumericValue(hull_moving_average)}</td>
            <td>
                {
                  live_price > hull_moving_average ? 
                  <span className="bullish">Buy</span>
                  : 
                  live_price < hull_moving_average ? 
                  <span className="bearish">Sell</span>
                  : 
                  <span className="neutral">Neutral</span>
                }
            </td>
          </tr>
          <tr>
            <td>VWMA(20)</td>
            <td>{roundNumericValue(vwma)}</td>
            <td>
              {
                live_price > vwma ? 
                <span className="bullish">Buy</span>
                : 
                live_price < vwma ? 
                <span className="bearish">Sell</span>
                : 
                <span className="neutral">Neutral</span>
              }
            </td>
          </tr>
        </tbody>
        </table>
        </div>
    </div>  
  </div>

  </div>

                

  </div>
                        
          {/* Technical analysis code ends here */}




                <div id="LiquidityPoollist" className={"tab-pane fade " + (main_tab == 9 ? "show active" : "")}>
                  <Liquidity_pools_list reqData={{ fetch_data_type: data.fetch_data_type ? data.fetch_data_type : 1, network_row_id: tokenData.network_row_id, network_name: tokenData.name, token_image: tokenData.contract_type == 1 ? "ethereum.svg" : "binance.svg", contracts_address: address, token_symbol: tokenData.symbol, token_price: tokenData.live_price }} crypto_type={1} />
                </div>


                <div id="tradehistory" className={"tab-pane fade " + (main_tab == 10 ? "show active" : "")}>
                  <Trade_history reqData={{ network_row_id: tokenData.network_row_id, contracts_address: address, token_symbol: tokenData.symbol, token_price: live_price }} />
                </div>
              </div>              

         </div>

                  <div className="col-md-12 col-sm-12 col-12 col-lg-12 col-xl-4">
                      <div className='token_details_tabs_row '>
                        <ul className="nav nav-tabs token_events_tabs">
                            <li className="nav-item" >
                              <a className="nav-link active" data-toggle="tab" href="#news"><span>News</span></a>
                            </li>

                            <li className="nav-item">                            
                              <a className="nav-link " data-toggle="tab" href="#events" ><span>Events</span></a>
                            </li>
                        </ul>
                      </div>
                      <div className="tab-content">
                          <div id="news" className="tab-pane fade show in active ">
                            <News/>
                          </div>

                          <div id="events" className="tab-pane fade in">
                            <Events/>
                          </div>
                      </div>
                    </div>

                </div>
              </div>
            </div>

            <div className="token_details_tabs mt-5">
           
            


              <div className="tab-content">
                
                <div id="home" className="tab-pane fade">
                  
                </div>

                {/* <tbody>
                      {
                        exchangelistnew.map((e, i) => {
                          return <tr key={i}>
                            <td>{e.exchange.fullName}</td>
                            <td>{constant.separator(e.trades)}</td>
                            <td>{constant.separator(e.takers)}</td>
                            <td>{constant.separator(e.makers)}</td>
                            <td>{constant.separator(e.amount.toFixed(2))}</td>
                          </tr>
                        } )
                      }
                      </tbody> */}
                <div id="menu1" className="tab-pane fade in">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                        <tr>
                          <th>Traded</th>
                          <th>Time</th>
                          <th className="market_trades_count">Token Price</th>
                          <th>Value</th>
                          <th>DEX</th>
                        </tr>
                      </thead>
                      {
                        tokentransactions
                          ?
                          <tbody>
                            {
                              tokentransactions.map((e, i) => {
                                return <tr key={i}>
                                  <td>{separator(Number.parseFloat((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd).toFixed(2))} {(e.baseCurrency.symbol === "WBNB") ? e.quoteCurrency.symbol : e.baseCurrency.symbol}</td>
                                  <td>{moment(e.block.timestamp.time).format("ll")}</td>
                                  <td>{separator(Number.parseFloat((e.tradeAmountInUsd / ((e.baseCurrency.symbol === "WBNB") ? e.sellAmountInUsd : e.buyAmountInUsd)).toString()).toFixed(7))} USD</td>
                                  <td>{separator(Number.parseFloat(e.tradeAmountInUsd).toFixed(4))} USD</td>
                                  <td><a rel="noreferrer" href={"https://bscscan.com/tx/" + e.transaction.hash} target="_blank">{e.exchange.name ? e.exchange.name : "-"}</a></td>
                                </tr>
                              }
                              )
                            }
                          </tbody>
                          :
                          null
                      }
                    </table>
                  </div>
                </div>

              </div>
            </div>

            <div className="col-lg-5 col-sm-6 col-4">
              <div >
                {/* <div className="sidebar_wallet">  
                  <div className="claim_reward_sidebar">
                    <h2>400 UNI</h2>
                    <h4>UNI has arrived</h4>
                    <p>Thanks for being part the Uniswap community</p>
                    <button>Claim your reward</button>
                  </div> */}

                <div className={"modal connect_wallet_error_block" + (handleModalConnections ? " collapse show" : "")}>
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => handleModalConnection()}>&times;</button>
                        <h4>Connection Error</h4>
                        <p>Please connect to wallet.</p>
                      </div>
                    </div>
                  </div>
                </div>


                <div className={"modal connect_wallet_error_block" + (selectedTokenModal ? " collapse show" : "")}>
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => setSelectedTokenModal(false)}>&times;</button>

                        <p>Connect to network</p>
                        <div className="row">

                          <div className="col-md-6 col-6">
                            <img className="wallet-buttons" onClick={() => connectToEthWallet()} src="/assets/img/ETH.svg" />
                            {
                              selectedwallettype === 1
                                ?
                                <img className="wallet-buttons selected-token-img" src="/assets/img/checked.png" />
                                :
                                null
                            }
                            <p onClick={() => connectToEthWallet()}>Ethereum</p>
                          </div>

                          <div className="col-md-6 col-6">
                            <img className="wallet-buttons" onClick={() => connectToWallet()} src="/assets/img/binance.svg" />
                            {
                              selectedwallettype === 2
                                ?
                                <img className="wallet-buttons selected-token-img" src="/assets/img/checked.png" />
                                :
                                null
                            }
                            <p onClick={() => connectToWallet()}>BNB</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <div className={"modal connect_wallet_error_block" + (handleModalMainNetworks ? " collapse show" : "")}>
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal" onClick={() => handleModalMainNetwork()}>&times;</button>
                        <h4>Connection Error</h4>
                        <p>You are connected to an unsupported network.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal connect_wallet_error_block" id="myModal">
                  <div className="modal-dialog modal-sm">
                    <div className="modal-content">

                      <div className="modal-body">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4>Coming Soon!</h4>
                      </div>

                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>





      <div
        className={"modal share_popup_token  " + (share_modal_status ? " modal_show" : " ")}
        id="market_share_page"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body">
            <button
                type="button"
                className="close"
                data-dismiss="modal"
                onClick={() => set_share_modal_status(false)}
              >
                <span>
                  <img src="/assets/img/close_popup.svg" alt="Close" />
                </span>
              </button>
              <h4>Share it with your friends!</h4>
              <div className="share_token_img">
              <img src={"/assets/img/"+(tokenData.contract_type == 1 ? "default.png": "binance.svg")}  alt={tokenData.contract_type == 1 ? "Ethereum": "BSC"} width="100%" height="100%" />

              </div>
              <h1 className="token_name_share">{tokenData.name} - <span> {tokenData.symbol ? tokenData.symbol.toUpperCase() : "-"}</span> : {live_price > 0 ? convertCurrency(live_price): "NA"}</h1>
              <div className="share_input_url">
              <div className="input-group">
              <input type="text" id="referral-link" className="form-control" defaultValue={market_coinpedia_url + "address/"+address} readOnly />
                    <div className="input-group-prepend">
                    {
                      copy_status == 0 ?
                        <span
                          className="input-group-text"
                          id="myTooltip"
                          onClick={() => myReferrlaLink()}
                        >
                          <img
                            src="/assets/img/copy_icon_url.svg"
                            alt="Copy"
                            className="copy_link ml-2"
                            width="100%"
                            height="100%"
                          />
                        </span>
                        :
                        <span
                          className="input-group-text"
                          id="myTooltip"
                          onClick={() => myReferrlaLink()}
                        >
                         Copied!
                        </span>
                    }
                    </div>
                  </div>
                  
              </div>
              <h6>Or share it with</h6>
              <div className="share_social_img">
                <ul>
                  <li>
                  <a
                      rel="nofollow"
                      href={"https://www.facebook.com/sharer/sharer.php?u=" + market_coinpedia_url + "address/"+address} target="_blank"
                    >
                      <span>
                      <img
                        src="/assets/img/facebook_img.svg"
                        alt="Facebook"
                        width="100%"
                        height="100%"
                      />
                      </span>
                    </a>
                  </li>
                  <li>
                  <a
                      rel="nofollow"
                      href={"https://www.linkedin.com/shareArticle?mini=true&url=" + market_coinpedia_url + "address/"+address}
                      target="_blank"
                    >
                      <img
                        src="/assets/img/linkedin_img.svg"
                        alt="Linkedin"
                        width="100%"
                        height="100%"
                      />
                    </a>
                  </li>
                  <li>
                  <a
                      rel="nofollow"
                      href={"http://twitter.com/share?url=" + market_coinpedia_url + "address/"+address+"&text="+ data.token_name}
                      target="_blank"
                    >
                      <img
                        src="/assets/img/twitter_img.svg"
                        alt="Twitter"
                        width="100%"
                        height="100%"
                      />
                    </a>
                  </li>
                  <li>
                  <a
                      rel="nofollow"
                      href={"https://wa.me/?text=" + market_coinpedia_url + "address/"+address}
                      target="_blank"
                    >
                      <img
                        src="/assets/img/whatsapp_img.svg"
                        width="100%"
                        height="100%"
                        alt="Whatsapp"
                      />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          
           
          </div>
        </div>
      </div>






      {/* <div className={"modal " + (share_modal_status ? " modal_show" : " ")} id="market_share_page">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Share</h4>
              <button type="button" className="close" data-dismiss="modal" onClick={() => set_share_modal_status(false)}><span><img src="/assets/img/close_icon.svg" /></span></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-1" />
                <div className="col-md-10">
                  <div className="input-group">
                    <input type="text" id="referral-link" className="form-control" defaultValue={market_coinpedia_url + "address/"+address} readOnly />
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="myTooltip" onClick={() => myReferrlaLink()}>
                        <img src="/assets/img/copy-file.png" className="copy_link ml-2" width="100%" height="100%" />
                      </span>
                    </div>
                  </div>
                  <h6>Share with </h6>
                  <p className="share_social">
                    <a rel="nofollow" href={"https://www.facebook.com/sharer/sharer.php?u=" + market_coinpedia_url + "address/"+address} target="_blank"><img src="/assets/img/facebook.png" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"https://www.linkedin.com/shareArticle?mini=true&url=" + market_coinpedia_url + "address/"+address} target="_blank"><img src="/assets/img/linkedin.png" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"http://twitter.com/share?url=" + market_coinpedia_url + "address/"+address+"&text="+ data.token_name} target="_blank" ><img src="/assets/img/twitter.png" width="100%" height="100%" /></a>
                    <a rel="nofollow" href={"https://wa.me/?text=" + market_coinpedia_url + "address/"+address} target="_blank"><img src="/assets/img/whatsapp.png" width="100%" height="100%" /></a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

    </>
  )
}

export async function getServerSideProps({ query }) 
{
  const token_address = query.contract_address
  const network_name = query.token_id
  const network_id = await getNetworkId(network_name)
  const getData = await tokenBasic(token_address, network_id)
    return { props: { post: {}, address: token_address, network_id:network_id, tokenData:getData.message} }
  // if(network_id)
  // {
    
  // }
  // else
  // {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/error"
  //     }
  //   }
  // }
} 
  

  // if(getData.status)
  // {
    
  // }
  // else
  // {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: "/error"
  //     }
  //   }
  // }
 
  // const query1 = `
  //   query
  //   { 
  //     ethereum(network: ethereum) {
  //       address(address: {is: "`+ token_address + `"}){

  //         annotation
  //         address

  //         smartContract {
  //           contractType
  //           currency{
  //             symbol
  //             name
  //             decimals
  //             tokenType
  //           }
  //         }
  //         balance
  //       }
  //     } 
  // }
  // ` ;

  // const url = "https://graphql.bitquery.io/";
  // const opts = {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "X-API-KEY": graphqlApiKEY
  //   },
  //   body: JSON.stringify({
  //     query: query1,
  //   })
  // };

  // return fetch(url, opts)
  //   .then(res => res.json())
  //   .then(result => {
  //     if (result.data.ethereum !== null) 
  //     {
  //       if(result.data.ethereum)
  //       {
  //           if(result.data.ethereum.address[0].smartContract) 
  //           {
  //           if (result.data.ethereum.address[0].smartContract.currency) 
  //           {
                
  //           }
  //           else {
  //               return {
  //               redirect: {
  //                   permanent: false,
  //                   destination: "/Error"
  //               }
  //               }
  //           }
  //           }
  //           else {
  //           return {
  //               redirect: {
  //               permanent: false,
  //               destination: "/Error"
  //               }
  //           }
  //           }
  //       }
  //     }
  //     else {
  //       return {
  //         redirect: {
  //           permanent: false,
  //           destination: "/Error"
  //         }
  //       }
  //     }
  //   })

