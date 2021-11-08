import React , {useState, useEffect} from 'react';  
import Link from 'next/link' 
import ReactPaginate from 'react-paginate'; 
import Head from 'next/head';

import TableContentLoader from '../components/loaders/tableLoader'
import { API_BASE_URL, config, separator, website_url} from '../components/constants'; 

var $ = require( "jquery" );

export default function Home(props) {   
  const [data, setData] = useState([]); 
  const [pageCount] = useState(Math.ceil(props.post.length / 15))
  const [firstcount, setfirstcount] = useState(1)
  const [finalcount, setfinalcount] = useState(10)
  const [selectedPage, setSelectedPage] = useState(0) ;
  const [image_base_url] = useState(API_BASE_URL + 'uploads/tokens/')
  const [tokenslist] = useState(props.post)
  const [alltokens] = useState(props.post.length) 
  const [searchBy, setSearchBy] = useState("0")   
  const [search_contract_address, set_search_contract_address] = useState("")    
  const [validSearchContract, setvalidContractAddress] = useState("")
  const [dataLoaderStatus, setDataLoaderStatus] = useState(true)
  console.log('asdf', tokenslist);
  
 
  useEffect(()=>{  
    getTokensList(0) 
    var $j = jQuery.noConflict();
    $j(document).ready(function() {
      $j('[data-toggle="tooltip"]').tooltip();
    });
  },[])
 
const handlePageClick = (e) => {  
  setSelectedPage(e.selected)
  const selectPage = e.selected; 
  Pages_Counts(selectPage , tokenslist.length)
  getTokensList(selectPage * 10)
};  
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
const CheckContractAddress =(address)=>{
  setvalidContractAddress("")

  let query = "";

  if(searchBy === "0"){
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
    if(result.data.ethereum !== null){
      if(result.data.ethereum.address[0].smartContract){
        if(result.data.ethereum.address[0].smartContract.currency){
          if(searchBy === "0"){
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
   
  const getTokensList=(offset)=>{   
    setDataLoaderStatus(false)
    let slice = tokenslist.slice(offset, offset + 10)  
    const postData = slice.map((e, i) => {
        return  <tr key={i}>
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
                      <td>{e.price === null? "-":Number(e.price).toFixed(2)}</td>
                      {/* <td>
                        <span className="twenty_high"><img src="/assets/img/green-up.png" />2.79%</span>
                      </td> */}

                      <td className="market_list_price"> 
                      <Link href={"/"+e.token_id}><a>
                        {
                          e.network_types.length > 0
                          ?
                          e.network_types[0] === "1" ? "ERC20" : "BEP20" 
                          :
                          null
                        } </a></Link>
                      </td>
                      <td className="market_list_price">
                        <Link href={"/"+e.token_id}>
                          <a>
                            {e.token_max_supply ? separator(e.token_max_supply) : "-"}
                          </a>
                        </Link>
                      </td>

                      <td className="market_list_price mobile_hide">
                        <Link href={"/"+e.token_id}><a>
                          {e.circulating_supply ?separator(e.circulating_supply) : "-"}
                        </a></Link>
                      </td>  
                </tr> 
    })  

    setData(postData) 

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
    <div className="page new_markets_index">
      <div className="market-page">


        {/* ........... */}
        <div className="new_page_title_block">
          <div className="container">
            <div className="col-md-12">
              <div className="row market_insights ">
                <div className="col-md-7 col-lg-6">
                  <h1 className="page_title">Cryptocurrency Market Insights</h1>
                  <p>Companies with tech innovation into finance and technology, Globally companies with tech innovations into finance and technology, Globally.</p>
                </div>
                <div className="col-md-1 col-lg-2"></div>
                <div className="col-md-4 col-lg-4">
                  <div className="input-group search_filter">
                    <input value={search_contract_address} onChange={(e)=> set_search_contract_address(e.target.value)} type="text" placeholder="Search token here" className="form-control search-input-box" placeholder="Search by contract address" />
                    <div className="input-group-prepend">
                      <select className="form-control" value={searchBy} onChange={(e)=> setSearchBy(e.target.value)}>
                        <option value="0">ETH</option>
                        <option value="1">BSC</option>
                      </select>
                    </div>
                    <div className="input-group-prepend">
                    {
                      search_contract_address
                      ?
                      <span className="input-group-text" onClick={()=> CheckContractAddress(search_contract_address)}><img src="/assets/img/search-box.png" alt="search-box"  width="100%" height="100%"/></span>
                      :
                      <span className="input-group-text"><img src="/assets/img/search-box.png" alt="search-box" width="100%" height="100%" /></span>
                    }                  
                    </div>
                  </div> 
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
                    <Link href="/">
                      <a className="categories__item active_category">
                        <div className="categories__text">All</div>
                      </a>
                    </Link> 

                    <Link href="#">
                      <a className="categories__item">
                        <div data-toggle="tooltip" title="Coming Soon!" className="categories__text">Gainers & Losers</div>
                      </a>
                    </Link>

                    <Link href="#">
                      <a className="categories__item ">
                        <div data-toggle="tooltip" title="Coming Soon!" className="categories__text">Stable Coins</div>
                      </a>
                    </Link>

                    <Link href="#">
                      <a className="categories__item ">
                        <div data-toggle="tooltip" title="Coming Soon!" className="categories__text">Trending Coins</div>
                      </a>
                    </Link>

                    <Link href="#">
                      <a className="categories__item ">
                        <div data-toggle="tooltip" title="Coming Soon!" className="categories__text">NFT Marketplace</div>
                      </a>
                    </Link>
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
                            <th className="table_live_price">Live price </th>
                            {/* <th className="table_price_change">24h %</th> */}
                            <th className="table_token">Token type</th>
                            <th className="table_max_supply">Total max supply</th> 
                            <th className="mobile_hide table_circulating_supply">Circulating Supply</th>  
                          </tr>
                      </thead>
                      <tbody>
                        {/* {
                            data.length > 0
                            ?
                            data
                            :
                            <>
                            {
                             dataLoaderStatus === false ?
                              <tr >
                               <td className="text-center" colSpan="5">
                                   Sorry, No related data found.
                               </td>
                              </tr>
                              :
                              <TableContentLoader row="10" col="5" />
                            }
                            </>
                          }  */}

                        {
                          dataLoaderStatus === false ?
                          data.length > 0
                          ?
                          data
                          :
                          <tr >
                            <td className="text-center" colSpan="5">
                                Sorry, No related data found.
                            </td>
                          </tr>
                          :
                          <TableContentLoader row="10" col="5" />
                        }
                      </tbody>
                    </table>
                    </div>
                  </div> 

                  {
                    alltokens > 10
                    ? 
                  <div className="col-md-12">
                    <div className="pagination_block">
                      <div className="row">
                        <div className="col-lg-3 col-md-3  col-sm-3 col-6">
                            <p className="page_range">{firstcount}-{finalcount} of {pageCount} Pages</p>
                        </div>
                        <div className="col-lg-9 col-md-9 col-sm-9 col-6">
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
    </div>
    </>
  )
}
 

export async function getServerSideProps({query }) { 

  return await fetch(API_BASE_URL+"listing_tokens/tokens_list", config)
              .then(res => res.json())
              .then(result => { 

                if(result.status){  
                  
                  return { props: {post: result.message}}
                }
                else
                {
                  return { props: {post: [], imgurl: ""}}
                } 

              }) 

}
