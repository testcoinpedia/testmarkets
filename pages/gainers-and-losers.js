import React, {useState} from 'react';  
import Link from 'next/link' 
import Head from 'next/head'; 
 
export default function Home() {  
  const [search_contract_address, set_search_contract_address] = useState("")   
  const [link, set_link] = useState("https://schema.org/")

  
  const get_domain = (abc)=>
  {
    // var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    // let url = ""
    // if(regexp.test(abc)){
    //   url = new URL(abc);
    // }
    // else{
    //   abc = "http://"+abc
    //   url = new URL(abc);
    // }

    // var arr = url.hostname.split(".");
    // if(arr[0] == "www" || arr[0] == "in"){
    //   return arr[1]
    // }
    // else{
    //   return arr[0]
    // }

    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    let url = ""

    {
      regexp.test(abc) 
      ? 
      url = new URL(abc) 
      : 
      abc = "http://"+abc
      url = new URL(abc);
    }
    

    var arr = url.hostname.split(".")
    
    return (arr[0] == "www" || arr[0] == "in") ? arr[1] :  arr[0]
    
  }

  const makeJobSchema=()=>{  
    return { 
        "@context":"http://schema.org/",
        "@type":"Organization",
        "name":"Coinpedia",
        "url":"https://markets.coinpedia.org",
        "logo":"https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png",
        "sameAs":["http://www.facebook.com/Coinpedia.org/","https://twitter.com/Coinpedianews", "http://in.linkedin.com/company/coinpedia", "http://t.me/CoinpediaMarket"]
      }  
}

  return(
    <>
      <Head>
        <title>Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap</title>
        <meta name='robots' content='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'/> 
        <meta name="description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="keywords" content="Cryptocurrency Market, cryptocurrency market sentiments, crypto market insights, cryptocurrency Market Analysis, NFT Price today, DeFi Token price, Top crypto gainers, top crypto loosers, Cryptocurrency market, Cryptocurrency Live market Price, NFT Live Chart, Cryptocurrency analysis tool." />

        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta property="og:url" content="https://markets.coinpedia.org/" />
        <meta property="og:site_name" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta property="og:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:secure_url" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />  
        
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@coinpedia" />
        <meta name="twitter:creator" content="@coinpedia" />
        <meta name="twitter:title" content="Cryptocurrency Market Insights - Live Price, Charts, Trading Volume and Market Cap" />
        <meta name="twitter:description" content="Get the cryptocurrency market sentiments and insights. Explore real-time price, market-cap, price-charts, historical data and more. Bitcoin, Altcoin, DeFi tokens and NFT tokens." />
        <meta name="twitter:image" content="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

        <link rel="shortcut icon" type="image/x-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>
        <link rel="apple-touch-icon" href="https://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png"/>

        <link rel="canonical" href='https://markets.coinpedia.org' />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(makeJobSchema()) }} /> 
      </Head>

        <div className="page">
      <div className="page__center best_and_worst">
          <div className="container">
          <div className="row market_insights">
              <div className="col-md-8">
                <h1 className="page_title">Cryptocurrency Market Insights</h1>
              </div>
              <div className="col-md-4">
                <div className="input-group search_filter">
                  <input value={search_contract_address} onChange={(e)=> set_search_contract_address(e.target.value)} type="text" placeholder="Search token here" className="form-control" placeholder="Search by contract address" />
                  <div className="input-group-prepend">
                  {
                    search_contract_address
                    ?
                    <span className="input-group-text"><a href={website_url+"token/"+search_contract_address}><img src="/assets/img/search-box.png" width="100%" height="100%" /></a></span>
                    :
                    <span className="input-group-text"><img src="/assets/img/search-box.png" width="100%" height="100%" /></span>
                  }                  
                  </div>
                </div> 
              </div>
            </div>
            
            <div className="categories categories_list_display">
              <div className="categories__container">
                
                <div className="markets_list_quick_links">
                  <Link href="/">
                    <a className="categories__item">
                      <div className="categories__text">All</div>
                    </a>
                  </Link> 

                  <Link href="/gainers-and-losers">
                    <a className="categories__item active_category">
                      <div className="categories__text">Gainers & Losers</div>
                    </a>
                  </Link>

                  <Link href="/stable-coins">
                    <a className="categories__item ">
                      <div className="categories__text">Stable Coins</div>
                    </a>
                  </Link>

                  <Link href="/trending-coins">
                    <a className="categories__item ">
                      <div className="categories__text">Trending Coins</div>
                    </a>
                  </Link>
                </div>

              </div>
            </div>
            
            <div className="prices transaction_table_block">
              <div className="prices__head">
                <div className="prices__title h5">Gainers and Losers</div> 
              </div>

              <div className="text-center">
                <h6>
                  {
                 
                    // http:// ,https://, https://www, http://www,
                      
   get_domain(link)
                          
                  }</h6>
              </div>
            </div>
          </div>
      </div>
    </div>
    </>
  )
}
