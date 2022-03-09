import Axios from 'axios' 

export const live_price_coingecko = async (token_id) =>
{
    var resObj = {}
    const res = await Axios.get("https://api.coingecko.com/api/v3/coins/"+token_id)
    if(res.data)
    {
        resObj['name'] = res.data.name
        resObj['id'] = res.data.id
        resObj['live_price'] = res.data.market_data.current_price.usd
        resObj['market_cap'] = res.data.market_data.market_cap.usd
        // resObj['total_supply'] = res.data.market_data.total_supply
        resObj['token_max_supply'] = res.data.market_data.max_supply
        resObj['circulating_supply'] = res.data.market_data.circulating_supply
        resObj['price_change_24h'] = res.data.market_data.price_change_percentage_24h
        
        resObj['market_cap_rank'] = res.data.market_cap_rank
        resObj['total_volume'] = res.data.market_data.total_volume.usd
        
        resObj['mcap_to_tvl_ratio'] = ((res.data.market_data.total_volume.usd)/ (res.data.market_data.market_cap.usd)).toFixed(3)
        

        var exchange_list = res.data.tickers
        var myArr = []
        for(var i of exchange_list)
        {
            var createObj = {}
            createObj['exchange_name'] = i.market.name
            createObj['pair_one_name'] = i.base
            createObj['pair_two_name'] = i.target
            createObj['price'] = i.last
            createObj['volume_percentage'] = i.bid_ask_spread_percentage
            createObj['volume'] = i.volume
            createObj['trust_score'] = i.trust_score
            
            await myArr.push(createObj) 
        }
        resObj['exchanges'] = myArr

        // return res.data
    }
    return resObj
}