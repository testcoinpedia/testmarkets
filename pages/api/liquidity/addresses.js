import { API_BASE_URL, config } from '../../../components/constants' 
import Axios from 'axios'

export default async function handler(req, res) 
{       
    const req_config = {
        mode: 'no-cors',
        method: 'POST',
        body: JSON.stringify({
            token_id:req.body.token_id, 
            addresses:req.body.addresses
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            "api_key" : "234ADSIUDG98669DKLDSFHDASDFLKHSDAFIUUUUS"
         }
    }

    const tokenQuery = await fetch(API_BASE_URL+"markets/tokens/update_liquidity_address", req_config)
    if(tokenQuery) 
    {    
        const tokenQueryRun = await tokenQuery.json()
        res.json({res:req.body.token_id, asdf:tokenQueryRun})
    }
    else
    {
        res.json({ status:false, message:{alert_message:'Sorry, Invalid supplied data passed.'} })
    }
}