import React , {useState, useEffect} from 'react'
import Link from 'next/link' 
import Head from 'next/head' 
import Axios from 'axios'
import JsCookie from 'js-cookie'
import Web3 from 'web3'  
import ContentLoader from "react-content-loader";
import { useRouter } from 'next/router'
import InfiniteScroll from "react-infinite-scroll-component";
import Nft_loader from '../../loaders/nft_loader'
import { USDFormatValue, getEvmNetwork, nftByWalletAddress, evmConfig, setActiveNetworksArray, getShortAddress,fetchAPIQuery,makeJobSchema,graphqlBasicTokenData,graphqlPricingTokenData, cryptoNetworksList} from '../../config/helper'
import { cookieDomainExtension, roundNumericValue, app_coinpedia_url, API_BASE_URL, graphqlApiURL, strLenTrim, separator, currency_object,config,count_live_price,validBalance, getShortWalletAddress, market_coinpedia_url} from '../../constants' 


export default function NFTDetails({networks, addresses}) 
{
    const [nft_list, set_nft_list] = useState([])
    const [nft_limit] = useState(12)
    const [nft_offset, set_nft_offset] = useState(0)
    const [per_page] = useState(12)
    const [nft_nw_completed_data_status, set_nft_nw_completed_data_status] = useState({ eth : false, bsc : false})
    const [data_loader_status, set_data_loader_status] = useState(true)
    const [nft_has_more, set_nft_has_more] = useState(true)
    const [nft_modal_status, set_nft_modal_status] = useState(false)
    const [nft_details, set_nft_details] = useState({})
    const [nft_other_details, set_nft_other_details] = useState({})
    const [nft_ids, set_nft_ids] = useState([])
    const [my_data_list, set_my_data_list] = useState([])
    const [has_more, set_has_more] = useState(true)
    const [current_page, set_current_page] = useState(0)
    const [sort_type, set_sort_type] = useState(1)
    const [my_data_status, set_my_data_status] = useState(1)
    
    useEffect(() => 
    {
       getNFTHistory(true)
       // fetchNames()
    }, [])


    const updateUsersNfts = async (pass_data) =>
    {       
        if(JsCookie.get('user_token'))
        {   
            const response = await Axios.post(API_BASE_URL + 'markets/portfolio/users_nfts', { assets: pass_data }, config(JsCookie.get('user_token')))
            // console.log("updateUsersNFTs", response)
        }
    }
   
    const getNFTHistory = async (update_type) =>
    {   
    //   console.log("update_type", update_type)
      const data_list = []
      const data_list_ids = nft_ids
      let list_concat_type = false
      if(nft_has_more)
      {
          await set_data_loader_status(true)
          var present_current_page = nft_offset
          if(update_type != true)
          {
              var present_page_count = nft_offset + nft_limit
              await set_nft_offset(present_page_count)
          }
          else
          {   
              var present_current_page = 0
              await set_nft_offset(nft_limit)
          }

          if(networks.length) 
          {
            for(let network_id of networks) 
            {
                const { network, network_image, network_name} = getEvmNetwork(network_id)
                if(network) 
                { 
                //   console.log(network, nft_nw_completed_data_status[network])
                  if(!nft_nw_completed_data_status[network])
                  {
                    const query = nftByWalletAddress({ wallet_addresses: addresses, network: network,  limit:nft_limit, offset:present_current_page ? nft_offset:0})
                    const config = evmConfig(query)
                    const response = await Axios(config)
                    // console.log("responsenft", response)
                    if(response.data) 
                    {
                      if(response.data.data.EVM) 
                      {
                        if(response.data.data.EVM.BalanceUpdates[0]) 
                        {
                          for(let run of response.data.data.EVM.BalanceUpdates) 
                          {
                            if(!data_list_ids.includes(run.BalanceUpdate.Id))
                            { 
                                var URI_segment = ""
                                if(run.BalanceUpdate.URI) 
                                {
                                    if((run.BalanceUpdate.URI).includes("ipfs://")) 
                                    {
                                        URI_segment = await (run.BalanceUpdate.URI).replace("ipfs://", "https://ipfs.io/ipfs/")
                                        if (URI_segment.includes("{id}")) {
                                        URI_segment = await (URI_segment).replace("{id}", run.BalanceUpdate.Id)
                                        }
                                    }
                                }

                                await data_list.push({
                                    URI : run.BalanceUpdate.URI,
                                    URI_segment : URI_segment,
                                    wallet_address: run.BalanceUpdate.Address,
                                    nft_id: run.BalanceUpdate.Id,
                                    name: run.Currency.Name,
                                    nft_image: "",
                                    uri_details: {},
                                    protocol_name: run.Currency.ProtocolName,
                                    nft_address: run.Currency.SmartContract,
                                    symbol: run.Currency.Symbol,
                                    network_id: network_id,
                                    network_name: network_name,
                                    network_image:network_image
                
                                })
                                await data_list_ids.push(run.BalanceUpdate.Id)
                            }
                          }
                          
                          
                          // if(list_concat_type)
                          // {
                          //     console.log('updating', update_type)
                              
                          // }
                          // else
                          // {   
                          //   console.log('first', update_type)
                          //   await set_nft_list(data_list)
                          //   list_concat_type = await true
                          // }
                          
                          
                        }
                        else
                        {
                         await set_data_loader_status(false)
                          if(network == 'eth')
                          { 
                            await set_nft_nw_completed_data_status({ eth : true, bsc : nft_nw_completed_data_status.bsc})
                            if(nft_nw_completed_data_status.bsc)
                            {
                              await set_nft_has_more(false) 
                            }
                          }
                          else if(network == 'bsc')
                          {
                            await set_nft_nw_completed_data_status({ eth : nft_nw_completed_data_status.eth, bsc : true})
                            if(nft_nw_completed_data_status.eth)
                            {
                              await set_nft_has_more(false) 
                            }
                          }
                        }
                      }
                    }
                  }
                }
            }

            // console.log("nft_list", nft_list)
        // console.log("data_list", data_list)
        // , limit:nft_limit, offset:present_current_page ? nft_offset:0
        const set_images_response = await setNftImages({data:data_list})
        const updated_data = await nft_list.concat(set_images_response)
        await set_nft_list(updated_data)
        await set_data_loader_status(false)
        await set_nft_ids(data_list_ids)
        await updateUsersNfts(set_images_response)
        // console.log("nft_ids", data_list_ids)
          }
      }
      else
      {
          await set_data_loader_status(false)
      }
  }

  
    const setNftImages = async ({data}) =>
    {   
        //, limit, offset
        const data_list = []
        let i=0
        if(data.length)
        {
            for(let run of data)
            {   
                var nft_image = ""
                var nft_name = await run.name
                var uri_details = {}
                if(run.URI_segment)
                {   
                    const uri_json_data = await getURIString(run.URI_segment)
                    if(uri_json_data.image)
                    {
                        nft_image = await correctIpfs(uri_json_data.image)
                        if(nft_image) 
                        {
                            if((nft_image).includes("ipfs://")) 
                            {
                                nft_image = await nft_image.replace("ipfs://", "https://ipfs.io/ipfs/")
                            }
                        }
                        uri_details = await uri_json_data
                        if(uri_json_data.name)
                        {
                            nft_name = await uri_json_data.name
                        }
                        
                    }
                }
                else if(run.URI)
                {   
                    const uri_json_data = await getURIString(run.URI)
                    // console.log("asdf", uri_json_data)
                    if(uri_json_data.image)
                    {
                        nft_image = await uri_json_data.image
                        uri_details = await uri_json_data
                        if(uri_json_data.name)
                        {
                            nft_name = await uri_json_data.name
                        }
                    }
                }

                if(!nft_image)
                {
                    nft_image = await "/assets/img/nft-default.png"
                }
                

                await data_list.push({
                    nft_id : run.nft_id,
                    URI : run.URI,
                    URI_segment : run.URI_segment,
                    name : nft_name,
                    nft_image:nft_image,
                    wallet_address:run.wallet_address,
                    network_name:run.network_name,
                    uri_details : uri_details,
                    protocol_name : run.protocol_name,
                    nft_address : run.nft_address,
                    symbol : run.symbol,
                    network_id : run.network_id,
                    network_name: run.network_name,
                    network_image:run.network_image
                })
                
                // if((i > offset) && (i < (offset+limit)))
                // {
                    
                // }
                // else
                // {
                //     await data_list.push(run)
                // }
                // i++
            }
           
           return await data_list
            // await set_my_data_list(data_list)
        }
        return data_list
    }


    // const fetchNames = async () => 
    // {   
    //     console.log("executed")
    //     var files = [
    //         "https://elementals-metadata.azuki.com/elemental/12013",
    //         "https://metadata.matr1x.io/metadata/kuku/6146",
    //         "https://ipfs.io/ipfs/QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4/8421"
    //     ]

    //     // const responses = await Promise.all(
    //     //     ids.map(async id => {
    //     //         const res = await fetch(
    //     //             `https://jsonplaceholder.typicode.com/posts/${id}`
    //     //         ); // Send request for each id
    //     //     })
    //     // );

    //     var promises = []
    //     files.forEach(function(url) 
    //     {
    //         promises.push(
    //             fetch(url).then(function(result) 
    //             {
    //                 // dispatch a success
    //                 return result;
    //             })
    //             .catch(function(err) {
    //                 // dispatch a failure and throw error
    //                 throw err;
    //             })
    //         )
    //     })

    //     Promise.all(promises).then(function(values) {
    //         console.log(values)
    //     });

    //     // const res = await Promise.all([
    //     //     fetch().catch(function (err) {
    //     //         return {
    //     //           error: err
    //     //         }
    //     //     }),
    //     //     fetch().catch(function (err) {
    //     //         return {
    //     //           error: err
    //     //         }
    //     //     }),
    //     //     fetch().catch(function (err) {
    //     //         return {
    //     //           error: err
    //     //         }
    //     //     })
    //     // ])

    //     // const data = res.map((res) => res);
    //     // console.log("asdf all aii", data);
    //     // try 
    //     // {
           
    //     // } catch 
    //     // {
    //     //     console.log("Promise failed")
    //     // }
    // }

    const singleDetails = async (data) =>
    {
        // console.log("data",data)
        set_nft_modal_status(true)
        set_nft_details(data)
        await set_nft_other_details({})
        if(!data.nft_image)
        {
            // console.log("!nftimage")
            if(data.URI)
            {  
                // console.log("passed")
                // console.log("data",data.URI)
                try 
                { 
                    const res = await Axios.get(data.URI)
                  
                    // console.log("res",res)
                    if(res.data)
                    {   
                        // console.log("resdata")
                       
                         await set_nft_other_details(res.data)

                    }

                }
                catch(err)
                {
                //    console.log("err",err) 
                }
            }
            
        }
    }
    
    // const getNFTList = async () =>
    // {   
    //     const data_list = []
    //     const data_list_ids = []
    //     await set_data_loader_status(true)
    //     if(networks.length)
    //     {
    //         for(let network_id of networks)
    //         {
    //             const {network, network_image, network_name} = getEvmNetwork(network_id)
    //             if(network)
    //             {
    //                 const query = nftByWalletAddress({wallet_addresses:addresses, network:network})
    //                 const config = evmConfig(query)
    //                 const response = await Axios(config)
    //                 if(response.data)
    //                 {   
    //                     if(response.data.data.EVM)
    //                     {
    //                         if(response.data.data.EVM.BalanceUpdates)
    //                         {
    //                             for(let run of response.data.data.EVM.BalanceUpdates)
    //                             {
    //                                 if(!data_list_ids.includes(run.BalanceUpdate.Id))
    //                                 {   
    //                                     var URI_segment =""
    //                                     if(run.BalanceUpdate.URI)
    //                                     {   
    //                                         if((run.BalanceUpdate.URI).includes("ipfs://"))
    //                                         {   
    //                                             URI_segment = await (run.BalanceUpdate.URI).replace("ipfs://", "https://ipfs.io/ipfs/")
    //                                             if(URI_segment.includes("{id}"))
    //                                             {
    //                                                 URI_segment = await (URI_segment).replace("{id}", run.BalanceUpdate.Id)
    //                                             }
                                                
    //                                         }
    //                                     }
    //                                     await data_list.push({
    //                                         Id : run.BalanceUpdate.Id,
    //                                         URI : run.BalanceUpdate.URI,
    //                                         URI_segment : URI_segment,
    //                                         Name : run.Currency.Name,
    //                                         nft_image:"",
    //                                         uri_details:{},
    //                                         ProtocolName : run.Currency.ProtocolName,
    //                                         SmartContract : run.Currency.SmartContract,
    //                                         Symbol : run.Currency.Symbol,
    //                                         network_name: network_name,
    //                                         network_image:network_image
    //                                     })
    //                                     await data_list_ids.push(run.BalanceUpdate.Id)
    //                                 }
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
           
    //         if(data_list.length > per_page)
    //         {   
    //             await set_nft_list(data_list)
    //             const dataset_with_images = await datasetWithImages(data_list.slice(0, per_page))
    //             await set_my_data_list(dataset_with_images)
    //             await set_data_loader_status(false)
    //         }
    //         else
    //         {
    //             await set_nft_list(data_list)
               
    //             const dataset_with_images = await datasetWithImages(data_list)
    //             await set_my_data_list(dataset_with_images)
    //             await set_data_loader_status(false)
    //         }
    //     }
    //     else
    //     {   
    //         await set_data_loader_status(false)
    //         set_nft_list([])
    //     }
    // }

    // const datasetWithImages = async (pass_data) =>
    // {   
    //     const data_list = []
    //     if(pass_data.length)
    //     {
    //         for(let run of pass_data)
    //         {
    //             var nft_image = ""
    //             var uri_details = {}
    //             if(run.URI_segment)
    //             {   
    //                 const uri_json_data = await getURIString(run.URI_segment)
    //                 if(uri_json_data.image)
    //                 {
    //                     nft_image = await correctIpfs(uri_json_data.image)
    //                     uri_details = await uri_json_data
    //                 }
    //             }
    //             else
    //             {   
    //                 const uri_json_data = await getURIString(run.URI)
    //                 if(uri_json_data.image)
    //                 {
    //                     nft_image = await uri_json_data.image
    //                     uri_details = await uri_json_data
    //                 }
    //             }

    //             await data_list.push({
    //                 Id : run.Id,
    //                 URI : run.URI,
    //                 URI_segment : run.URI_segment,
    //                 Name : run.Name,
    //                 nft_image:nft_image,
    //                 network_name:run.network_name,
    //                 uri_details : uri_details,
    //                 ProtocolName : run.ProtocolName,
    //                 SmartContract : run.SmartContract,
    //                 Symbol : run.Symbol,
    //                 network_image:run.network_image
    //             })
    //         }
    //         return await data_list
    //        // await set_my_data_list(data_list)
    //     }
    //     return data_list
    // }

   const correctIpfs =  (uri_string) =>
   {
        if(uri_string.includes("ipfs://"))
        {
            return uri_string.replace("ipfs://", "https://ipfs.io/ipfs/")
        }
        else
        {
            return uri_string
        }
   }

    const getURIString =  async(url) => {
        try 
        {
            const api_call = await fetch(url);
            return await api_call.json();
        }
        catch(err)
        {
          return {}
        }
    }


    const EndMessage = () => 
    {
        if(nft_list.length > per_page) {
          return (
            <div className="col-md-12">
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            </div>
          )
        } 
        else 
        {
          return <div></div>
        }
    }

    const SpinnerLoader = () => 
    {
        set_my_data_status(true)
    }
    
    
    const myDataList = async (update_type) =>
    {
        await set_data_loader_status(true)
        // console.log("hitting")
        if(has_more)
        {
            console.log("hitting 2")
            await set_my_data_status(true)
            var present_current_page = current_page+ per_page
            await set_current_page(present_current_page)

            const start = present_current_page 
            const end = start+per_page
            // console.log("start", start)
            // console.log("end", end)
            // console.log("nft_list", nft_list)
            const res_query = await nft_list.slice(start, end)
            
            // console.log("tradeHistory", res_query)
            if(res_query.length)
            {   
                //await set_my_data_status(false)
                if(res_query.length)
                {   
                    const dataset_with_images = await datasetWithImages(res_query)
                    await set_my_data_list(my_data_list.concat(dataset_with_images))
                    await set_data_loader_status(false)
                    if(per_page > res_query.length)
                    {
                        await set_has_more(false) 
                    } 
                }
                else
                {
                    //await set_my_data_status(false)
                    await set_data_loader_status(false)
                    await set_has_more(false) 
                }
            }
        }
        else
        {
            //await set_my_data_status(false)
            await set_data_loader_status(false)
        }
    }
    

    return(
        <div className="nft_assets">
            <h6 className="portfolio-sub-title ml-4 mb-4">
                <span className="net_worth_value">NFT's List </span>
                {/* { nft_list.length ? <>({nft_list.length})</>:"" } */}
            </h6>

            <div id="scrollableDiv" className='nft-content' >
            <InfiniteScroll
                    dataLength={nft_list.length}
                    style={{ overflow: "unset" }}
                    next={getNFTHistory}
                    hasMore={nft_has_more}
                    loader={<SpinnerLoader />}
                    endMessage={<EndMessage />}
                    scrollableTarget="scrollableDiv"
                >
                
                <div className="row mr-2 ml-2 mb-4">
                {
                    nft_list.length ?
                    
                    
                        nft_list.map((item, i)=>
                        <div className="col-md-3 mb-3">
                            <div className='nft-section'>
                                <div className=''>
                                    {
                                        item.network_image ?
                                        <img src={"/assets/img/portfolio/"+item.network_image} className="nft-network" />
                                        :
                                        ""
                                    }
                                </div>
                                <span className='nft-type'>{(item.protocol_name).replace("erc", "erc-")}</span>
                                <div className='nft-details'>
                                    {
                                        item.nft_image ?
                                        <div className='nft-media' style={{backgroundSize:"cover", backgroundRepeat:"no-repeat", backgroundImage: `url(${(item.nft_image ? item.nft_image:"/assets/img/nft-default.png")})`}} >
                                        </div>
                                        :
                                        <div className='nft-media' style={{background:" #efefef"}}>
                                            
                                        </div>
                                    }
                                   
                                    <h6 className='mb-2'>{strLenTrim(item.symbol, 18)} <span className='nft-span'>#{strLenTrim(item.nft_id, 10)}</span></h6>
                                    <p>{strLenTrim(item.name, 35)}</p>

                                    <div className="btn-section">
                                    <button className='btn btn-primary btn-block mt-2 nft-btn' onClick={()=>singleDetails(item)}>View More <img src="/assets/img/next.png" class="nft-next-image  "></img></button>
                                    </div> 
                                </div>
                            </div>
                        </div>
                        )
                    :
                    ""
                }
           
                {
                    data_loader_status ?
                    <Nft_loader row="2" col="4" /> 
                    :
                    !nft_list.length ?
                    <div className="col-md-3 mb-3">
                        {/* <img src="/assets/img/portfolio/nft_default.svg" className='rounded'/> */}
                        <h6>No related data found.</h6>
                    </div>
                    :
                    ""
                }
                </div>
                </InfiniteScroll>
            </div> 
            
<div className='remove_wallet_modal token-details-popup'>
            <div className=" modal" style={ nft_modal_status ? { display: 'block' } : { display: 'none' }} id="myModal">
                <div className="modal-dialog ">
                    <div className="modal-content ">
                        <div className="modal-body portfolio-token-view-body">
                            <button type="button" className="close" onClick={()=> set_nft_modal_status(!nft_modal_status)} data-dismiss="modal"><span><img src="/assets/img/close_icon.svg"  alt = " Close"  /></span></button>
                            <h6 className='mb-2'>NFT Details</h6>
                            <div className='row'>
                                <div className='col-md-4 col-12'>
                                    {
                                        nft_details.nft_image ?
                                        <img src={nft_details.nft_image} className="nft-image mb-3" onError={(e) =>e.target.src = "/assets/img/nft-default.png"}  />
                                        :
                                        nft_other_details.image ?
                                        <img src={nft_other_details.image} className="nft-image mb-3" onError={(e) =>e.target.src = "/assets/img/nft-default.png"}  />
                                        :
                                        <img src="/assets/img/nft-default.png" className="nft-image mb-3" onError={(e) =>e.target.src = "/assets/img/nft-default.png"}  />
                                    }
                                </div>
                                <div className="col-md-8 col-12">
                                    {
                                        nft_details.nft_id ?
                                        <>
                                           {
                                            nft_details.uri_details.name ?
                                            <p className='mb-1' style={{ wordWrap: "break-word"}}><b>NFT Name :</b> {nft_details.uri_details.name}</p>
                                            :
                                            <p className='mb-1' style={{ wordWrap: "break-word"}}><b>NFT Name :</b> {nft_details.name}</p>
                                           }
                                           
                                           
                                            <p className='mb-1'><b>NFT Symbol :</b> {nft_details.symbol}</p>
                                            <p className='mb-1' style={{ wordWrap: "break-word"}}><b>NFT ID : </b>#{nft_details.nft_id}</p>
                                            <p className='mb-1' ><b>Network Name : </b>{nft_details.network_name}</p>

                                            {
                                                nft_other_details.artist ?
                                                <p className='mb-1'><b>Artist : </b>{nft_other_details.artist}</p>
                                                :
                                                ""
                                            }
                                           
                                            {
                                               nft_details.uri_details.external_url ?
                                               <p className='mb-1'><b>Website URL :</b> <a style={{color:"#2a9ffd", wordWrap: "break-word"}} href={nft_details.uri_details.external_url} target='_blank'>{nft_details.uri_details.external_url}</a></p>
                                               :
                                               nft_other_details.external_url ?
                                               <p className='mb-1'><b>Website URL :</b> <a style={{color:"#2a9ffd", wordWrap: "break-word"}} href={nft_other_details.external_url} target='_blank'>{nft_other_details.external_url}</a></p>
                                               :
                                               ""
                                            }
                                           
                                            {
                                                nft_details.uri_details.description?
                                                <p className='mb-1'style={{ wordWrap: "break-word"}}><b>Description :</b> {nft_details.uri_details.description} {nft_other_details.description}</p>

                                            
                                            :
                                            nft_other_details.description?
                                            <p className='mb-1'style={{ wordWrap: "break-word"}}><b>Description :</b> {nft_details.uri_details.description} {nft_other_details.description}</p>
                                            :
                                            ""
                                            } 
                                            <p></p>
                                             
                                        </>
                                        :
                                        ""
                                    }       
                                </div>  
                               
                            </div>
                        </div>
                    </div>
            </div>
          </div>
          </div>
        </div>
    )    
}