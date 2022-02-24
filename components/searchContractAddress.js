/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Axios from 'axios'
import {API_BASE_URL,graphqlApiKEY, website_url,config,createValidURL, IMAGE_BASE_URL} from '../components/constants'
import { useRouter } from 'next/router'
import Popupmodal from '../components/popupmodal'


export default function Details() 
{   
    const router = useRouter()
    const [searchBy, setSearchBy] = useState("") 
    const [search_contract_address, set_search_contract_address] = useState("")    
    const [validSearchContract, setvalidContractAddress] = useState("")
    const [err_searchBy, setErrsearchBy] = useState("")
    
    
    const getTokenData = async ()=>
    { 
        setvalidContractAddress("")
        setErrsearchBy("")

        let formValid=true 
        if(!parseInt(searchBy))
        {
          setErrsearchBy("Please Select Network Type")
          formValid=false
        }
        else if(!search_contract_address)
        {
          setErrsearchBy("Please Enter Contract Address")
          formValid=false
        }
         
        if(!formValid)
        {
          return
        }
        let network_type = ""
        
        if(parseInt(searchBy) === 1)
        { 
          network_type = "ethereum"
        }
        else 
        { 
          network_type = "bsc"
        }

        const query = `
                    query
                    { 
                      ethereum(network: `+network_type+`) {
                        address(address: {is: "`+search_contract_address+`"}){
      
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
      
       
        const opts = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-KEY":graphqlApiKEY
          },
          body: JSON.stringify({
            query
          })
        }
        const res = await fetch("https://graphql.bitquery.io/", opts)
        const result = await res.json()
        console.log("result", result)
        if(result.data.ethereum)
        {
          if(result.data.ethereum.address[0].smartContract)
          {
            const apiRes = await Axios.get(API_BASE_URL+"markets/tokens/check_contract_address/"+search_contract_address, config(""))
            if(apiRes.data.status)
            {
                await router.push(website_url+apiRes.data.message.token_id)
                console.log("API success", apiRes.data.message) 
            }
            else
            {
                if(result.data.ethereum.address[0].smartContract.currency){
                if(parseInt(searchBy) === 1)
                { 
                    // console.log("ethereum",ethereum)
                     window.location.href = website_url+'eth/'+search_contract_address
                    //router.push(website_url+'eth/'+search_contract_address)
                    
                }
                else 
                { 
                    // console.log("bsc",ethereum)
                     window.location.href = website_url+'bsc/'+search_contract_address
                    // await router.push(website_url+'bsc/'+search_contract_address)
                }
            }
            }
          }
          else
          {
            setErrsearchBy("Invalid Contract Address or Network Type.")
          }
        }
        else
        {
          setErrsearchBy("Invalid Contract Address or Network Type.")
        }
        
       
      
      }

return (
       <div>
           <div className="input-group search_filter">
                    <div className="input-group-prepend markets_index">
                        <select  className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}> 
                      <option value="0">Type</option>
                        <option value="1">ETH</option>
                        <option value="2">BSC</option>
                      </select>
                    </div>
                    <input value={search_contract_address} onChange={(e)=> set_search_contract_address(e.target.value)} type="text" placeholder="Search token here" className="form-control search-input-box" placeholder="Search by contract address" />
                   <div className="input-group-prepend ">
                    <span className="input-group-text" onClick={()=> getTokenData()}><img src="/assets/img/search-box.png" alt="search-box"  width="100%" height="100%"/></span>                 
                    </div>
                  </div> 
                  <div className="error">  {err_searchBy}</div>
                    {validSearchContract && <div className="error">{validSearchContract}</div>}
       </div>
    )
}         

  