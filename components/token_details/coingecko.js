import Axios from 'axios' 


export const coingeckoId = async (token_id) =>
{
    var resObj = {}
    const abc = await Axios.get("https://api.coingecko.com/api/v3/coins/"+token_id)
    if(abc.data)
    {
        // resObj['name'] = abc.data.name
        // resObj['id'] = abc.data.id
        // resObj['exchanges'] = abc.data.tickers
        // resObj['usd_price'] = abc.data.market_data.current_price.usd
        // resObj['market_cap'] = abc.data.market_data.market_cap.usd
        // resObj['total_supply'] = abc.data.market_data.total_supply
        // resObj['max_supply'] = abc.data.market_data.max_supply
        // resObj['circulating_supply'] = abc.data.market_data.circulating_supply
        // resObj['price_change_percentage_24h'] = abc.data.market_data.price_change_percentage_24h
        
        return abc.data
    }
    // return resObj
}