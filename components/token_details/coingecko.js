import Axios from 'axios' 
import {  count_live_price} from '../constants'

export const live_price_coingecko = async (token_id) =>
{
    var resObj = {}
   await Axios.get("https://api.coingecko.com/api/v3/coins/"+token_id).then(res=>{
    if(res.data)
    
        // console.log("coingecko",res.data)
        resObj['name'] = res.data.name
        resObj['id'] = res.data.id
        resObj['live_price'] = res.data.market_data.current_price.usd
        resObj['market_cap'] = res.data.market_data.market_cap.usd
        resObj['total_supply'] = res.data.market_data.total_supply
        resObj['token_max_supply'] = res.data.market_data.max_supply
        resObj['circulating_supply'] = res.data.market_data.circulating_supply
        resObj['price_change_24h'] = res.data.market_data.price_change_percentage_24h
        resObj['market_cap_rank'] = res.data.market_cap_rank
        resObj['total_volume'] = res.data.market_data.total_volume.usd
        resObj['mcap_to_tvl_ratio'] = ((res.data.market_data.total_volume.usd)/ (res.data.market_data.market_cap.usd)).toFixed(3)
        resObj['market_cap_change_percentage_24h'] = res.data.market_data.market_cap_change_percentage_24h
        resObj['fully_diluted_valuation'] = res.data.market_data.fully_diluted_valuation.usd
        resObj['low_24h'] = res.data.market_data.low_24h.usd
        resObj['high_24h'] = res.data.market_data.high_24h.usd
        resObj['categories'] = res.data.categories
        resObj['ath'] = res.data.market_data.ath.usd
        resObj['atl'] = res.data.market_data.atl.usd
        resObj['ath_change_percentage'] = res.data.market_data.ath_change_percentage.usd
        resObj['atl_change_percentage'] = res.data.market_data.atl_change_percentage.usd

        var exchange_list = res.data.tickers
        var myArr = []
        for(var i of exchange_list)
        {
            var createObj = {}
            createObj['exchange_name'] = i.market.name
            createObj['pair_one_name'] = i.base
            if((i.base).length > 6)
            {
                createObj['pair_one_name'] = (i.base).slice(0,4)+"..."+(i.base).slice((i.base).length - 4 , (i.base).length)
            }
            createObj['pair_two_name'] = i.target

            if((i.target).length > 6)
            {
                createObj['pair_two_name'] = (i.target).slice(0,4)+"..."+(i.target).slice((i.target).length - 4 , (i.target).length)
            }

            createObj['price'] = count_live_price(i.last)
            createObj['volume_percentage'] = i.bid_ask_spread_percentage
            createObj['volume'] = i.volume
            createObj['last_traded_at'] = i.last_traded_at
            createObj['trust_score'] = i.trust_score
            
             myArr.push(createObj) 
        }
        resObj['exchanges'] = myArr

        // return res.data
    
})
// .catch(console.error)
    
        
    return resObj
}