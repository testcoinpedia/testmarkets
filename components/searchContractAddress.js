/* eslint-disable */
import React , {useState, useEffect, useRef} from 'react'
import Axios from 'axios'
import {API_BASE_URL, graphqlApiKEY, market_coinpedia_url, config, createValidURL, IMAGE_BASE_URL, website_url} from '../components/constants'
import { useRouter } from 'next/router'
import Popupmodal from '../components/popupmodal'
import Link from 'next/link'
import JsCookie from "js-cookie" 

export default function Details() 
{   
    const router = useRouter()
    const [searchBy, setSearchBy] = useState("") 
    const [search_contract_address, set_search_contract_address] = useState("")    
    const [validSearchContract, setvalidContractAddress] = useState("")
    const [err_searchBy, setErrsearchBy] = useState("")
    const [search_container_status, set_search_container_status] = useState(false)
    const [image_base_url] = useState(IMAGE_BASE_URL + '/tokens/')
    const [trending_list, set_trending_list] = useState([])
    const [result_showing_type, set_result_showing_type] = useState(1)
    //1:trending & recent searched, 2:Show all tokens, 3:Show all category
    
    const [searched_call_status, set_searched_call_status] = useState(false)
    const [searched_tokens_list, set_searched_tokens_list] = useState([])
    const [searched_categories_list, set_searched_categories_list] = useState([])

    var data = []
    if(JsCookie.get("category_search_tokens"))
    {
        data = JSON.parse(JsCookie.get("category_search_tokens"))
    }
    const [recent_search_list, set_recent_search_list] = useState(data)
    
    const [categories_list, set_categories_list] = useState([])
    const [see_all_trending, set_see_all_trending] = useState(false)
    const [see_all_categories, set_see_all_categories] = useState(false)

    const category_search_modal = useRef()
    useEffect(() => {
        let handler = (e) => {
            if (!category_search_modal?.current?.contains(e.target)) {
                set_search_container_status(false)
            }
        }
        document.addEventListener("mousedown", handler)
  
        return () => {
            document.removeEventListener("mousedown", handler)
        }
    }, [])

    const clearform = () =>
    {
        set_search_contract_address("")
        setSearchBy("")
    }
    const getTokenData = async ()=>
    { 
        // setvalidContractAddress("")
        // setErrsearchBy("")

        // let formValid=true
        // if((!search_contract_address) && (!parseInt(searchBy))) 
        // {
        //   setErrsearchBy("Please Enter Contract address and Select Network type")
        //   formValid=false
        // }
        // else if(!parseInt(searchBy))
        // {
        //   setErrsearchBy("Please Select Network type")
        //   formValid=false
        // }
        // else if(!search_contract_address)
        // {
        //   setErrsearchBy("Please Enter Contract Address")
        //   formValid=false
        // }
         
        // if(!formValid)
        // {
        //   return
        // }
        // let network_type = ""
        
        // if(parseInt(searchBy) === 1)
        // { 
        //   network_type = "ethereum"
        // }
        // else 
        // { 
        //   network_type = "bsc"
        // }

        // const query = `
        //             query
        //             { 
        //               ethereum(network: `+network_type+`) {
        //                 address(address: {is: "`+search_contract_address+`"}){
      
        //                   annotation
        //                   address
      
        //                   smartContract {
        //                     contractType
        //                     currency{
        //                       symbol
        //                       name
        //                       decimals
        //                       tokenType
        //                     }
        //                   }
        //                   balance
        //                 }
        //               } 
        //           }
        //       ` ;
      
        // const opts = {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "X-API-KEY":graphqlApiKEY
        //     },
        //     body: JSON.stringify({ query })
        // }
        // const res = await fetch("https://graphql.bitquery.io/", opts)
        // const result = await res.json()
        // // console.log("result", result)
        // if(result.data.ethereum)
        // {
        //     if(result.data.ethereum.address[0].smartContract)
        //     {
        //         const apiRes = await Axios.get(API_BASE_URL+"markets/tokens/check_contract_address/"+search_contract_address, config(""))
        //         if(apiRes.data.status)
        //         {
        //             await router.push(website_url+apiRes.data.message.token_id)
        //             clearform()
        //         }
        //         else
        //         {
        //             if(result.data.ethereum.address[0].smartContract.currency)
        //             {
        //                 if(parseInt(searchBy) === 1)
        //                 { 
        //                     window.location.href = website_url+'eth/'+search_contract_address 
        //                 }
        //                 else 
        //                 { 
        //                     window.location.href = website_url+'bsc/'+search_contract_address
        //                 }
        //             }
        //         }
        //     }
        //     else
        //     {
        //         setErrsearchBy("Invalid Contract Address or Network Type.")
        //     }
        // }
        // else
        // {
        //      setErrsearchBy("Invalid Contract Address or Network Type.")
        // }
    }

    useEffect(()=>
    {  
        trendingCoins()
    }, [])

    const trendingCoins=async ()=>
    {
        const res = await Axios.get(API_BASE_URL+"markets/tokens/trending_assets/", config(""))
        if(res.data)
        {
            if(res.data.status === true)
            { 
                set_see_all_trending(false)
                set_trending_list(res.data.message)
            } 
        }
    }

    const getSearchedResults = async (param)=>
    {   
        set_search_contract_address(param)
        if(param.length > 0)
        {   
            set_searched_call_status(true)
            set_result_showing_type(2)
            const res = await Axios.get(API_BASE_URL+"markets/tokens/search_assets/"+param, config(""))
            if(res.data.status === true)
            {   
                set_searched_call_status(false)
                set_searched_tokens_list(res.data.message.coins)
                set_searched_categories_list(res.data.message.category)
            }
            else
            {
                set_searched_call_status(false)
            } 
        }
        else
        {
            set_result_showing_type(1)
        }
    }

    const searchByCategoryTokens = async (param)=>
    {
        var old_tokens = []
        var old_conv = []

        if(JsCookie.get("category_search_tokens"))
        {
            old_tokens = JsCookie.get("category_search_tokens")
            old_conv = JSON.parse(old_tokens)
        }

        const check_token = (old_conv).find(list_data => list_data.token_id === param.token_id)
        if(!check_token)
        {
            (old_conv).push(param)
            recent_search_list.push(param)
        }

        const stringify_tokens = JSON.stringify(old_conv)
        JsCookie.set("category_search_tokens",stringify_tokens)
        // router.push(market_coinpedia_url+param.token_id)

        window.location=market_coinpedia_url+param.token_id
    }

return (
    <div>
         {/* <div className="input-group-prepend markets_index">
                <select  className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}> 
                    <option value="0">Type</option>
                    <option value="1">ETH</option>
                    <option value="2">BSC</option>
                </select>
            </div> */}
            {
                !search_container_status ?
                <>
                <div className="input-group search_filter new_design_serach">
                    <input onClick={()=>set_search_container_status(true)} type="text" className="form-control search-input-box" placeholder="Search Coin or Address" />
                    <div className="input-group-prepend ">
                        <span className="input-group-text" onClick={()=>set_search_container_status(true)} ><img src="/assets/img/markets/search.svg" alt="search-box"  width="100%" height="100%"/></span>                 
                    </div>
                </div> 
                <div className="error">  {err_searchBy}</div>
                {validSearchContract && <div className="error">{validSearchContract}</div>}
                </> 
                :
                null
            }

            
            
            
            {
                search_container_status ?    
                <div className="search_section" ref={category_search_modal}>
                    <div className="input-group search_input" >
                        <div className="input-group-prepend ">
                            <span className="input-group-text" ><img className="search-image" src="/assets/img/markets/search.svg" alt="search-box" /></span>                 
                        </div>
                        <input value={search_contract_address} onChange={(e)=> getSearchedResults(e.target.value)} type="text" className="form-control search-input-box" placeholder="Search coin, contract address or exchange" />
                        <div className="input-group-prepend ">
                            <span className="input-group-text" onClick={()=>set_search_container_status(false)} ><img className="close-image"  src="/assets/img/close.png" alt="search-box" /></span>                 
                        </div>
                    </div>
                    
                    <div className="search-result">
                    {
                        result_showing_type === 1 ?
                        <>
                            {
                                (trending_list && trending_list.length > 0) ?
                                <div>
                                    <p>Trending</p>
                                    <ul className="search-tokens">
                                    {
                                        trending_list.slice(0,6).map((e,i) =>
                                            <li onClick={()=>searchByCategoryTokens(e)}>
                                                {/* <Link> */}
                                                    <a>
                                                        <div className="media">
                                                            <div className="media-left">
                                                                <img className="media-object token-img" src={image_base_url+"/"+e.token_image} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                                            </div>
                                                            <div className="media-body">
                                                                <p className="media-heading">{e.symbol} <span>{e.token_name}</span></p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                {/* </Link> */}
                                            </li>
                                        )
                                    }
                                    </ul>
                                </div>    
                                :
                                ""
                            }

                            {
                                recent_search_list && recent_search_list.length > 0 ?
                                <>
                                <p className="mt-4">Recent searches</p>
                                <div>
                                    {
                                        recent_search_list.map((e,i) =>
                                            <div className='recent-searches'>
                                                <img className="media-object token-img" src={image_base_url+"/"+e.token_image} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                                <div className="coin-name">{e.token_name}</div>
                                                <div className="coin-symbol">{e.symbol}</div>
                                            </div>
                                        )
                                    }
                                    
                                </div>
                                </>
                                :
                                null
                            }
                            
                        </>
                        :
                        result_showing_type === 2 ?
                        <>
                        {
                            (searched_tokens_list && searched_tokens_list.length > 0) ?
                            <div>
                                <p>Searched Coins</p>
                                <ul className="search-tokens">
                                {
                                    searched_tokens_list.slice(0,6).map((e,i) =>
                                        <li onClick={()=>searchByCategoryTokens(e)}>
                                            {/* <Link> */}
                                                <a>
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <img className="media-object token-img" src={image_base_url+"/"+e.token_image} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                                        </div>
                                                        <div className="media-body">
                                                            <p className="media-heading">{e.symbol} <span>{e.token_name}</span></p>
                                                        </div>
                                                    </div>
                                                </a>
                                            {/* </Link> */}
                                        </li>
                                    )
                                }
                                </ul>
                                {
                                    searched_tokens_list.length > 6 ?
                                    <h6 className="search-see-more" onClick={()=>set_result_showing_type(3)}>See all {searched_tokens_list.length - 6} results</h6>
                                    :
                                    ""
                                }
                            </div>    
                            :
                            ""
                        }

                        {
                            (searched_categories_list && searched_categories_list.length > 0) ?
                            <div>
                                <p>Searched Category</p>
                                <ul className="search-tokens">
                                {
                                    searched_categories_list.slice(0,6).map((e,i) =>
                                    <li><Link href={market_coinpedia_url+"category/"+e.business_id}><a>
                                        <div className="media">
                                            <div className="media-body">
                                                <p className="media-heading">{e.business_name}</p>
                                            </div>
                                        </div>
                                    </a></Link></li>
                                    )
                                }
                                </ul>
                                {
                                    searched_categories_list.length > 6 ?
                                    <h6 className="search-see-more" onClick={()=>set_result_showing_type(4)}>See all {searched_categories_list.length - 6} results</h6>
                                    :
                                    ""
                                }
                            </div>    
                            :
                            ""
                        }
                        </>
                        :
                        result_showing_type === 3 ?
                        <>
                        {
                            (searched_tokens_list && searched_tokens_list.length > 0) ?
                            <div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <p>Searched Coins</p>
                                    </div>
                                    <div className='col-6 text-right' >
                                        <a onClick={()=>set_result_showing_type(2)}>Back</a>
                                    </div>
                                </div>
                                <ul className="search-tokens">
                                {
                                    searched_tokens_list.map((e,i) =>
                                        <li onClick={()=>searchByCategoryTokens(e)}>
                                            {/* <Link href={market_coinpedia_url+e.token_id}> */}
                                                <a>
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <img className="media-object token-img" src={image_base_url+"/"+e.token_image} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                                        </div>
                                                        <div className="media-body">
                                                            <p className="media-heading">{e.symbol} <span>{e.token_name}</span></p>
                                                        </div>
                                                    </div>
                                                </a>
                                            {/* </Link> */}
                                        </li>
                                    )
                                }
                                </ul>
                            </div>    
                            :
                            ""
                        }
                        </>
                        :
                        result_showing_type === 4 ?
                        <>
                        {
                            (searched_categories_list && searched_categories_list.length > 0) ?
                            <div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <p>Searched Category</p>
                                    </div>
                                    <div className='col-6 text-right' >
                                        <a onClick={()=>set_result_showing_type(2)}>Back</a>
                                    </div>
                                </div>
                                
                                <ul className="search-tokens">
                                {
                                    searched_categories_list.map((e,i) =>
                                    <li><Link href={market_coinpedia_url+"category/"+e.business_id}><a>
                                        <div className="media">
                                            <div className="media-body">
                                                <p className="media-heading">{e.business_name}</p>
                                            </div>
                                        </div>
                                    </a></Link></li>
                                    )
                                }
                                </ul>
                            </div>    
                            :
                            ""
                        }
                        </>
                        :
                        ""
                    }
                    
                    
                    {/* {
                        ((trending_list)&&(trending_list.length > 0)&&(!see_all_categories)) ?
                        <>
                            <div>
                            <p>Trending</p>
                            <ul>
                                {
                                    see_all_trending ?
                                    trending_list.map((e,i) =>
                                    <Link href={website_url+e.token_id}>
                                        <a>
                                            <li>
                                                <div className="media">
                                                    <div className="media-left">
                                                        <img className="media-object token-img" src={image_base_url+"/"+e.token_image} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                                    </div>
                                                    <div className="media-body">
                                                        <p className="media-heading">{e.symbol} <span>{e.token_name}</span></p>
                                                    </div>
                                                </div>
                                            </li>
                                        </a>
                                    </Link>
                                    )
                                    :
                                    <>
                                    {
                                        trending_list.slice(0,6).map((e,i) =>
                                        <Link href={website_url+e.token_id}>
                                            <a>
                                                <li>
                                                    <div className="media">
                                                        <div className="media-left">
                                                            <img className="media-object token-img" src={image_base_url+"/"+e.token_image} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                                        </div>
                                                        <div className="media-body">
                                                            <p className="media-heading">{e.symbol} <span>{e.token_name}</span></p>
                                                        </div>
                                                    </div>
                                                </li>
                                            </a>
                                        </Link>
                                        )
                                    }
                                    {
                                        trending_count > 6 ?
                                        <a onClick={()=>set_see_all_trending(true)}>See all {trending_count - 6} results</a>
                                        :
                                        null
                                    }
                                    
                                    </>
                                }
                            </ul>
                            </div>
                        </>
                        :
                        null
                    }
                    
                    {
                        ((categories_list)&&(categories_list.length > 0)&&(!see_all_trending)) ?
                        <>
                            <div className="mt-4">
                                <p>Category</p>
                                <ul>
                                {
                                    (see_all_categories) ?
                                    categories_list.map((e,i) =>
                                    <li>
                                        <div className="media">
                                            <div className="media-left">
                                                <img className="media-object token-img" src={image_base_url+"/default.png"} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                            </div>
                                            <div className="media-body">
                                                <p className="media-heading">{e.business_name}</p>
                                            </div>
                                        </div>
                                    </li>
                                    )
                                    :
                                    <>
                                    {
                                        categories_list.slice(0,6).map((e,i) =>
                                        <li>
                                            <div className="media">
                                                <div className="media-left">
                                                    <img className="media-object token-img" src={image_base_url+"/default.png"} onError={(e) =>e.target.src = "/assets/img/default_token.png"} alt={"test"} />
                                                </div>
                                                <div className="media-body">
                                                    <p className="media-heading">{e.business_name}</p>
                                                </div>
                                            </div>
                                        </li>
                                        )
                                    }
                                    {
                                        categories_count > 6 ?
                                        <a onClick={()=>set_see_all_categories(true)}>See all {categories_count - 6} results</a>
                                        :
                                        null
                                    }
                                    
                                    </>
                                }
                            </ul>
                            </div>
                        </>
                        :
                        null
                    } */}
                            

                        
                    </div>
                </div>
                :
                ""
            } 
            </div>
    )
}         

  