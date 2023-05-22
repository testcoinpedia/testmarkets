export default async function handler(req, res) 
{   
    const { symbol, intervals, count } = req.query
    const req_config = {
        "mode": 'no-cors',
        "method": 'get',
        "headers": {
            "Content-Type": "application/json"
        }
    }
   //e671363b-4b20-42d7-80fe-32fb2ee8a88b
   //3e314c7a-7a9c-40a7-8e37-8a83fed5bb18
    const tokenQuery = await fetch("https://pro-api.coinmarketcap.com/v3/cryptocurrency/quotes/historical?CMC_PRO_API_KEY=e671363b-4b20-42d7-80fe-32fb2ee8a88b&symbol="+symbol+"&count="+count+"&interval="+intervals, req_config)
    if(tokenQuery) 
    {    
        const tokenQueryRun = await tokenQuery.json()
        const capital_symbol = symbol.toUpperCase()
        const token_data = tokenQueryRun.data[capital_symbol]
       
        res.json({ status:true, message:token_data[0].quotes})
    }
    else
    {
        res.json({ status:false, message:{alert_message:'Sorry, Invalid supplied data passed.'} })
    }
}