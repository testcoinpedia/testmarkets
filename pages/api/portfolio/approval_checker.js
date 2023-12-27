import { OKLINK_API_KEY } from '../../../components/constants' 


export default async function handler(req, res) 
{   
    const limit = 100
    const { wallet_address, page, network, protocolType } = req.query
    const req_config = {
        "mode": 'no-cors',
        "method": 'get',
        "headers": {
            "Content-Type": "application/json",
            "Ok-Access-Key" : OKLINK_API_KEY
        }
    }
    
    const tokenQuery = await fetch('https://www.oklink.com/api/v5/tracker/contractscanner/address-authorized-list?chainShortName='+network+'&protocolType='+protocolType+'&address='+wallet_address+'&limit='+limit, req_config)
    if(tokenQuery) 
    {    
        const tokenQueryRun = await tokenQuery.json()
        if(tokenQueryRun.data)
        {   
            if(tokenQueryRun.data.authorizedList)
            {
                res.json({ status:true, message:tokenQueryRun.data.authorizedList, counts:(parseInt(tokenQueryRun.data.totalPage)*limit)})
            }
            else
            {
                res.json({ status:true, message:[], counts:0})
            }
        }
        else
        {
            res.json({ status:true, message:[], counts:0})
        }
    }
    else
    {
        res.json({ status:false, message:{alert_message:'Sorry, Invalid supplied data passed.'} })
    }
}