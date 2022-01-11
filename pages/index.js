import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
import ReactPaginate from 'react-paginate'; 
import Head from 'next/head';
import cookie from "cookie"
import Axios from 'axios'
import moment from 'moment'
import TableContentLoader from '../components/loaders/tableLoader'
import { API_BASE_URL, config, separator, website_url, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, graphqlApiKEY} from '../components/constants'; 
var $ = require( "jquery" );

export default function Home({resData, userAgent, config, user_token}) { 
  const [tokenslist,set_tokenslist] = useState(resData.message)
  const [total_tokens_count, set_total_tokens_count] = useState(resData.message.length)  
  const [current_page_token_list, set_current_page_token_list] = useState([]); 
  const [voting_ids, setvoting_ids] = useState(resData.voting_ids)
  const [err_searchBy, setErrsearchBy] = useState("")
  const [pageCount, setPageCount] = useState(Math.ceil(resData.message.length / 15))
  const [firstcount, setfirstcount] = useState(1)
  const [finalcount, setfinalcount] = useState(15)
  const [selectedPage, setSelectedPage] = useState(0) ;
  const [image_base_url] = useState(IMAGE_BASE_URL + '/tokens/')
  const [searchBy, setSearchBy] = useState("")   
  const [search_contract_address, set_search_contract_address] = useState("")    
  const [validSearchContract, setvalidContractAddress] = useState("")
  const [dataLoaderStatus, setDataLoaderStatus] = useState(true)
  const [voting_status, set_voting_status] = useState(false)
  const [filteredTokens, setFilteredTokens] = useState([])  
  const [searchTokens, setsearchTokens] = useState("")
  const [searchParam] = useState(["token_name"])
  const [current_url]= useState(website_url)
  const [handleModalVote, setHandleModalVote] = useState(false)
  const [total_votes, set_total_votes] = useState()
  const [token_id, set_Token_id] = useState("")
  const [vote_id, set_vote_id] = useState("")
  const [item, set_item] = useState("")
  const [voting_message, set_voting_message] = useState("")
   
  console.log(resData);
  
  // const [handleModalVote, setHandleModalVote] = useState(false)
 
  useEffect(()=>
  {  
    getTokensList(tokenslist , 0) 
    var $j = jQuery.noConflict();
    $j(document).ready(function() {
      $j('[data-toggle="tooltip"]').tooltip();
    })
  },[])
 
const handlePageClick = (e) => {  
  setSelectedPage(e.selected)
  const selectPage = e.selected; 
  Pages_Counts(selectPage , tokenslist.length)
  getTokensList(tokenslist , selectPage * 15)

}; 
//i_value, item

  const ModalVote=(token_id,status,_id,item)=> 
  { 
    console.log(item)   
    setHandleModalVote(!handleModalVote) 
    set_voting_status(status)
    set_Token_id(token_id)
    set_vote_id(_id)
    set_item(item)
    
  }

  const vote = (param) =>
  {
    
    ModalVote()
    if(param == 1)
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/save_voting_details/"+token_id, config)
      .then(res=>{ 
      console.log(res)
      if(res.data.status === true) 
      {
        
        var testList = tokenslist
        var testObj = testList[item]
        var test_total_votes = testObj.total_votes+1
        testObj['total_votes'] = test_total_votes
        testList[item] = testObj
        set_tokenslist(testList)
        voting_ids.push(vote_id)
        set_voting_message(res.data.message) 
        // getTokensList(tokenslist , selectedPage) 
      }
      })
    }
    else
    {
      Axios.get(API_BASE_URL+"markets/listing_tokens/remove_voting_details/"+token_id, config)
      .then(res=>{ 
      console.log(res)
      if(res.data.status === true) 
      {
        var testList = tokenslist
        var testObj = testList[item]
        var test_total_votes = 0
        test_total_votes = testObj.total_votes-1
        testObj['total_votes'] = test_total_votes
        testList[item] = testObj
        set_tokenslist(testList)
        voting_ids.splice(voting_ids.indexOf(vote_id), 1)
        set_voting_message(res.data.message)
        // getTokensList(tokenslist , selectedPage)
      }
    })
    }
  }
  const getSearchData=(searchValue) =>
  {  
    var curren=0
    setsearchTokens(searchValue)
    var filteredReferrals = null;
    if(searchValue != '')
    {  
      var tokenslistData = tokenslist
      var filteredTokens =  tokenslistData.filter((item) => {
        return searchParam.some((newItem) => {
          console.log(newItem)
            return (
                item[newItem]
                    .toString()
                    .toLowerCase()
                    .indexOf(searchValue) > -1
            )
        })
      })
      setFilteredTokens(filteredTokens)
      // console.log(filteredTokens)
      setPageCount(Math.ceil(filteredTokens.length / 15)) 
      getTokensList(filteredTokens, 0) 
      set_total_tokens_count(filteredTokens.length)
      Pages_Counts(curren , filteredTokens.length)
        
    }
    else
    {
      setFilteredTokens(tokenslist)
      setPageCount(Math.ceil(tokenslist.length / 15)) 
      getTokensList(tokenslist, 0) 
      set_total_tokens_count(tokenslist.length)
      Pages_Counts(curren , tokenslist.length)
    }
  }
  const resetFilter=() =>
   {
    setsearchTokens("")
    setFilteredTokens(tokenslist)
    setPageCount(Math.ceil(tokenslist.length / 15)) 
    getTokensList(tokenslist,0) 
    set_total_tokens_count(tokenslist.length)
   // document.getElementById("formID").reset() 
   }    

const Pages_Counts = (page_selected, length_value) => 
{
   const presentPage = page_selected+1
   const first_count=(presentPage-1)*15+1
   const totalcompany = length_value
   var sadf = presentPage*15
   if((presentPage*15) > totalcompany)
   {
    sadf = totalcompany
   }
   const final_count=sadf
   setfirstcount(first_count)
   setfinalcount(final_count)
}
const getTokenData =(type, address)=>{ 

  setErrsearchBy("")

  let formValid=true 
  if(searchBy=="")
  {
    setErrsearchBy("Please Select Network Type")
    formValid=false
  }

  if(search_contract_address == "")
  {
    setErrsearchBy("Please Enter Contract Address")
    formValid=false
  }
   
  let network_type = ""
  
  if(type === "1"){ 
    network_type = "ethereum"
  }
  else if(type === "2"){ 
    network_type = "bsc"
  }
  else{
    return null
  }
  
  getTokenDetails(network_type, address)

}
const getTokenDetails = (network_type, address) =>{  

  // let network_type = ""

  // if(type === "1"){ 
  //   network_type = "ethereum"
  // }
  // else if(type === "2"){ 
  //   network_type = "bsc"
  // }
  // else{
  //   return null
  // }

  const query = `
              query
              { 
                ethereum(network: `+network_type+`) {
                  address(address: {is: "`+address+`"}){

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

  const url = "https://graphql.bitquery.io/";
  const opts = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY":graphqlApiKEY
    },
    body: JSON.stringify({
      query
    })
  }; 
  fetch(url, opts)
    .then(res => res.json())
    .then(result => {  
      if(result.data.ethereum) 
        if(result.data.ethereum.address[0].smartContract){
        if (result.data.ethereum.address[0].smartContract.currency) { 
          setvalidContractAddress("")
          CheckContractAddress(address)
        } 
        else { 
          setvalidContractAddress("Invalid contract address or network type.")
        
          
        } 
      }
      else{
        setvalidContractAddress("Invalid contract address or network type.")
        
      }
      else{
        setvalidContractAddress("Invalid contract address or network type.")
        
      }
    })
    .catch(console.error);

}
const CheckContractAddress =(address)=>{
  // for(const i of listData)
  //   {
  //     list.push({value: i.country_id, label: i.country_name})  
  //   }
    
  setvalidContractAddress("")
  var status=true
//   tokenslist.map((e)=>
//   {
//     e.contract_addresses.map((item)=>
//     {
//       if(address==item.contract_address)
//       {
//         status=false
//         window.location.replace(website_url+e.token_id)
//       }
//    })
//  })
for(const i of tokenslist)
    {
      if(i.contract_addresses.length>0  ){
      if(address==i.contract_addresses[0].contract_address) {
        status=false
         window.location.replace(website_url+i.token_id)
         break
      }
      }
    }
 if(!status){
   return
 }
  let query = "";

  if(searchBy === "1"){
    query = `
    query
    { 
      ethereum(network: ethereum) {
        address(address: {is: "`+address+`"}){

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
  }
  else{
    query = `
    query
    { 
      ethereum(network: bsc) {
        address(address: {is: "`+address+`"}){

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
  }

 
  const url = "https://graphql.bitquery.io/";
  const opts = {
  method: "POST",
  headers: {
  "Content-Type": "application/json",
  "X-API-KEY": "BQYAxReidkpahNsBUrHdRYfjUs5Ng7lD"
  },
  body: JSON.stringify({
    query: query, 
  })
  };
 
 return fetch(url, opts)
  .then(res => res.json())
  .then(result => {  
    if(result.data.ethereum !== null)
    {
      if(result.data.ethereum.address[0].smartContract){
        if(result.data.ethereum.address[0].smartContract.currency){
        if(searchBy === "1"){
          window.location.replace(website_url+'eth/'+address)
          // router.push('/eth/'+address)
        }
        else{
          window.location.replace(website_url+'bsc/'+address)
          // router.push('/bsc/'+address)
        } 
          
        }
        else{
          setvalidContractAddress("Contract address or network type is invalid.")
        }
      }
      else{
        setvalidContractAddress("Contract address or network type is invalid.")
      }
    } 
    else{
      setvalidContractAddress("Contract address or network type is invalid.")
    } 
  }) 

}
   

  const getTokensList=(tokenslist, offset)=>
  {  
    
    let slice = tokenslist.slice(offset, offset + 15) 
    set_current_page_token_list(slice)
    console.log(current_page_token_list)
  }  
 
  const makeJobSchema=()=>{  
    return { 
        "@context":"http://schema.org/",
        "@type":"Table",
        "name":"Coinpedia",
        "url":website_url,
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
} 

  return(
    <>
      <Head>
        <title>Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market cap, price charts, historical data and More. Bitcoin, Altcoin, DeFi tokens and NFT tokens. " />
        <meta name="keywords" content="Cryptocurrency Market , cryptocurrency market sentiments ,Crypto market insights , Cryptocurrency Market Analysis , NFT Price today, Defi token Price ,  Top crypto gainers, top crypto losers , Cryptocurrency market, Cryptocurrency Live  market Price, NFT Live Chart , Cryptocurrency analysis tool." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market cap, price charts, historical data and More. Bitcoin, Altcoin, DeFi tokens and NFT tokens. " />
        <meta property="og:url" content={website_url} />
        <meta property="og:site_name" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap" />
        <meta property="og:image" itemprop="thumbnailUrl" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="730" />
        <meta property="og:image:height" content="411" />  
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and MaketCap" />
        <meta name="twitter:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market cap, price charts, historical data and More. Bitcoin, Altcoin, DeFi tokens and NFT tokens. " />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 
        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="canonical" href={website_url} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>
    <div className="page new_markets_index min_height_page">
      <div className="market-page">


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-6 col-lg-6">
                  <h1 className="page_title">Cryptocurrency Market Insights</h1>
                  <p>Companies with tech innovation into finance and technology, Globally.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-5 col-lg-4">
                  <div className="input-group search_filter">
                    <input value={search_contract_address} onChange={(e)=> set_search_contract_address(e.target.value)} type="text" placeholder="Search token here" className="form-control search-input-box" placeholder="Search by contract address" />
                   
                    <div className="input-group-prepend markets_index">
                      {/* <select  className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}>*/}
                        <select  className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}> 
                      <option value="0">Type</option>
                        <option value="1">ETH</option>
                        <option value="2">BSC</option>
                      </select>
                    </div>
                    <div className="input-group-prepend ">
                    <span className="input-group-text" onClick={()=> getTokenData(searchBy, search_contract_address)}><img src="/assets/img/search-box.png" alt="search-box"  width="100%" height="100%"/></span>                 
                    </div>
                  </div> 
                  <div className="error">  {err_searchBy}</div>
                    {validSearchContract && <div className="error">{validSearchContract}</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* ................ */}
        
          <div className="container">
            <div className="col-md-12">
              <div className="categories categories_list_display">
                <div className="categories__container">
                  <div className="markets_list_quick_links">
                    <ul>
                      <li>
                        <Link href="/">
                          <a className="categories__item active_category">
                            <div className="categories__text">All</div>
                          </a>
                        </Link> 
                      </li>
                      <li data-toggle="modal" data-target="#comingSoon">
                       
                          <a className="categories__item">
                            <div className="categories__text">Gainers & Losers</div>
                          </a>
                       
                      </li>
                      <li data-toggle="modal" data-target="#comingSoon">
                        {/* <Link href="#"> */}
                          <a className="categories__item ">
                            <div className="categories__text">Stable Coins</div>
                          </a>
                        {/* </Link> */}
                      </li>
                      <li data-toggle="modal" data-target="#comingSoon">
                        {/* <Link href="#"> */}
                          <a className="categories__item ">
                            <div className="categories__text">Trending Coins</div>
                          </a>
                        {/* </Link> */}
                      </li>
                      <li data-toggle="modal" data-target="#comingSoon">
                        {/* <Link href="#"> */}
                          <a className="categories__item ">
                            <div className="categories__text">NFT Marketplace</div>
                          </a>
                        {/* </Link> */}
                      </li>
                    </ul>
                   
                  </div>
                </div>
              </div>

              <div className="">
              <div className="row">
                <div className="col-lg-4 col-sm-6 col-12">
                  <p className="companies_found">{total_tokens_count} Tokens Found</p>
                </div>
              </div>
              </div>

              <div className="prices transaction_table_block">
                <div className="market_page_data">
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <thead>
                          <tr>
                            <th className="table_index_token">Token</th>
                            {/* <th className="table_live_price">Live price </th> */}
                            {/* <th className="table_price_change">24h %</th> */}
                            <th className="table_token">Live Price</th>
                            <th className="table_token">Token type</th>
                            <th className="table_max_supply">Total max supply</th> 
                            <th className="mobile_hide table_circulating_supply">Market Cap</th>  
                            <th className="table_circulating_supply">Votes</th>  
                            <th className="table_circulating_supply">Vote</th>  
                           
                          </tr>
                      </thead>
                      <tbody>
                        {
                          current_page_token_list.length > 0
                          ?
                          current_page_token_list.map((e, i) => 
                          <tr key={i}>
                                      <td>
                                        <Link href={"/"+e.token_id}>
                                          <a>
                                          <div className="media">
                                            <div className="media-left">
                                              <img src={image_base_url+(e.token_image ? e.token_image : "default.png")} alt={e.token_name} width="100%" height="100%" className="media-object" />
                                            </div>
                                            <div className="media-body">
                                              <h4 className="media-heading">{e.token_name}</h4>
                                              <p>{e.symbol.toUpperCase()}</p>
                                            </div>
                                          </div> 
                                          </a>
                                        </Link>
                                      </td> 
                                      {/* <td>{e.price === null? "-":"$"+ Number(e.price).toFixed(2)}</td> */}
                                      {/* <td>
                                        <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span>
                                      </td> */}
                
                                      <td className="market_list_price"> 
                                        <Link href={"/"+e.token_id}>
                                          <a>
                                          
                                            <span className="block_price">{e.price?"$":null}{e.price?parseFloat((e.price).toFixed(7)):"-"}</span>
                                            <br/>
                                            {e.price_updated_on ? moment(e.price_updated_on).fromNow():null} 
                                          </a>
                                          </Link>
                                      </td>
                                      <td className="market_list_price"> 
                                        <Link href={"/"+e.token_id}>
                                          <a>
                                          {
                                              e.contract_addresses.length > 0
                                              ?
                                               e.contract_addresses[0].network_type === "1" ? "ERC20" : "BEP20" 
                                              // e.contract_addresses.map((ca)=>
                                              //   parseInt(ca.network_type) === 1 ? "ERC20" : "BEP20" 
                                              //)
                                              :
                                              null
                                            } 
                                          </a>
                
                                          </Link>
                                      </td>
                                      <td className="market_list_price">
                                        <Link href={"/"+e.token_id}>
                                          <a>
                                            {e.total_max_supply ? separator(e.total_max_supply) : "-"} 
                                          </a>
                                        </Link>
                                      </td>
                
                                      <td className="market_list_price mobile_hide">
                                        <Link href={"/"+e.token_id}><a>
                                          {e.market_cap ?separator(e.market_cap.toFixed(2)) : "-"}
                                        </a></Link>
                                      </td>  
                                     
                                       <td className="market_list_price">
                                       {
                                        e.total_votes == 0 ?
                                        voting_ids.includes(e._id) ? <span className="vote_value">1</span> : "--"
                                        :
                                        <Link href={"/"+e.token_id}>
                                          <a>
                                            <span className="vote_value">{e.total_votes}</span>
                                          </a>
                                        </Link>
                                        }
                                      </td>
                                     
                                      
                                      <td className="market_list_price">
                                        {
                                          user_token ?
                                          <>
                                          {
                                            voting_ids.includes(e._id) ?
                                            <span className="market_list_price"> <button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,true,e._id,i)} >Voted</button></span>
                                            :
                                            <span className="market_list_price"><button data-toggle="tooltip" onClick={()=>ModalVote(e.token_id,false,e._id,i)} >Vote</button></span>
                                           }
                                          </>
                                          :
                                          <Link href={app_coinpedia_url+"login?prev_url="+market_coinpedia_url}><a><span className="market_list_price"><button data-toggle="tooltip">Vote</button></span></a></Link>
                                        }
                                        </td> 
                                </tr> 
                          ) 
                          :
                          <tr >
                            <td className="text-center" colSpan="4">
                                Sorry, No related data found.
                            </td>
                          </tr>
                        }
                      </tbody>
                    </table>
                  </div>
                </div> 

                  {
                   
                    total_tokens_count > 15
                    ? 
                    <div className="col-md-12">
                      <div className="pagination_block">
                        <div className="row">
                          <div className="col-lg-3 col-md-3  col-sm-3 col-4">
                              <p className="page_range">{firstcount}-{finalcount} of {pageCount} Pages</p>
                          </div>
                          <div className="col-lg-9 col-md-9 col-sm-9 col-8">
                            <div className="pagination_div">
                              <div className="pagination_element">
                                <div className="pager__list pagination_element"> 
                                  <ReactPaginate 
                                    previousLabel={selectedPage+1 !== 1 ? "Previous" : ""}
                                    nextLabel={selectedPage+1 !== pageCount ? "Next" : ""}
                                    breakLabel={"..."}
                                    breakClassName={"break-me"}
                                    forcePage={selectedPage}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2} 
                                    onPageChange={handlePageClick}
                                    containerClassName={"pagination"}
                                    subContainerClassName={"pages pagination"}
                                    activeClassName={"active"} />
                                </div> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  :
                  null
                } 




                  {/* {
                    alltokens > 10
                    ? 
                    <div className="pager__list pagination_element"> 
                      <ReactPaginate 
                        previousLabel={selectedPage+1 !== 1 ? "Previous" : ""}
                        nextLabel={selectedPage+1 !== pageCount ? "Next" : ""}
                        breakLabel={"..."}
                        breakClassName={"break-me"}
                        forcePage={selectedPage}
                        pageCount={pageCount}
                        marginPagesDisplayed={2} 
                        onPageChange={handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                    </div> 
                    :
                    null
                  }  */}
              </div>
            </div>
          </div>
      </div>
      <div className={"modal connect_wallet_error_block"+ (handleModalVote ? " collapse show" : "")}>
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="close" data-dismiss="modal" onClick={()=>ModalVote()}>&times;</button>
                  {
                    voting_status == false ?
                    <h4> Do you want to support this token ? </h4>
                    :
                    <h4> Do not support this token ? </h4>
                  }
                  
                  <div className="vote_yes_no">
                    {/* className={voting_status == 1 ? "vote_yes" : "vote_no"} */}
                    {
                      voting_status == false ?
                      <>
                      <button onClick={()=>vote(1)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                      :
                      <>
                      <button onClick={()=>vote(0)}>Confirm</button>  
                      <button onClick={()=>ModalVote()}>Cancel</button>
                      </>
                    }
                    
                  </div>
                </div>
              </div> 
            </div>
          </div> 
      <div className="coming_soon_modal">
        <div className="modal" id="comingSoon">
          <div className="modal-dialog modal-sm">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title coming_soon_title">Coming Soon !!</h4>
                <button type="button" className="close" data-dismiss="modal">&times;</button>
              </div>
              <div className="modal-body">
                <p className="coming_soon_subtext">This feature will be available soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export async function getServerSideProps({query, req}) 
{ 
   const userAgent = cookie.parse(req ? req.headers.cookie || "" : document.cookie)
   var user_token = ''
   if(userAgent.user_token)
   {
     user_token = userAgent.user_token
   }
   
   const link = await fetch(API_BASE_URL+"markets/tokens/list", config(user_token))
   const result = await link.json()
   if(result.status)
    {  
      return { props: {resData:result, userAgent:userAgent, config:config(user_token), user_token:user_token}}
    }
    else
    {
      return { props: {resData: [], user_token:user_token}}
    }
}
