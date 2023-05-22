
export default async function handler(req, res) 
{   
    const { symbol } = req.query
    const req_config = {
        "mode": 'no-cors',
        "method": 'get',
        "headers": {
            "Content-Type": "application/json"
        }
    }
    //e671363b-4b20-42d7-80fe-32fb2ee8a88b
    //3e314c7a-7a9c-40a7-8e37-8a83fed5bb18
    const tokenQuery = await fetch("https://pro-api.coinmarketcap.com/v2/cryptocurrency/market-pairs/latest?slug=bitcoin&CMC_PRO_API_KEY=3e314c7a-7a9c-40a7-8e37-8a83fed5bb18", req_config)
    if(tokenQuery) 
    {    
        const tokenQueryRun = await tokenQuery.json()
       
        res.json({ status:true, message:tokenQueryRun})
    }
    else
    {
        res.json({ status:false, message:{alert_message:'Sorry, Invalid supplied data passed.'} })
    }
}