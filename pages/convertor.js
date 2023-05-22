import Head from 'next/head'
import { API_BASE_URL, roundNumericValue, config, separator, app_coinpedia_url, IMAGE_BASE_URL, market_coinpedia_url, strLenTrim, count_live_price, Logout} from '../components/constants' 

export default function Convertor()
{

    return ( 
        <>
            <Head>
                <title>Cryptocurrency Market Live Insights | Coinpedia </title>
                <meta name="description" content="Coinpedia's Market bring you with a list of top cryptocurrencies with real timeprices, including percentage change, charts, history, volume and more."/>
                <meta name="keywords" content="crypto market, crypto market tracker, Crypto tracker live, Cryptocurrency market, crypto market insights , Live crypto insights, crypto price alerts, Live crypto alerts." />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Cryptocurrency Market Live Insights | Coinpedia" />
                <meta property="og:description" content="Coinpedia company listing page offers quick view of all listed companies of Fintech, Blockchain and Finance category. Get Exchages, Wallets, Coins, Tools, Trading forms and more. " />
                <meta property="og:url" content={market_coinpedia_url} />
                <meta property="og:site_name" content="List of Fintech Companies | CoinPedia Pro Account. " />
                <meta property="og:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
                <meta property="og:image:secure_url" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" />
                <meta property="og:image:width" content="400" />
                <meta property="og:image:height" content="400" />

                <meta name="twitter:card" content="summary" />
                <meta name="twitter:site" content="@coinpedia" />
                <meta name="twitter:creator" content="@coinpedia" />
                <meta name="twitter:title" content="Cryptocurrency Market Live Insights | Coinpedia" />
                <meta name="twitter:description" content="Here's a list of the leading fintech companies in the country across the various sub-sectors.We are extending and updating the list regularly." />
                <meta name="twitter:image" content="http://image.coinpedia.org/wp-content/uploads/2020/08/19142249/cp-logo.png" /> 

                <link rel="canonical" href={market_coinpedia_url}/>
            </Head>

            <div className="page new_markets_index min_height_page markets_new_design">
                <div className="market-page">
                    {/* ........... */}
                    <div className="new_page_title_block">
                        <div className="container">
                            <div className="col-md-12">
                                <div className="convertor_block">
                                    <h1><span>BTC</span> to <span>USD</span> Convertor</h1>
                                    <div className="row">
                                        <div className="col-md-10 mx-auto">
                                            <div className="row">
                                                <div className="col-md-5">
                                                    <div className="convertor_individual_block">
                                                        <div class="media">
                                                            <div class="media-left">
                                                                <img src="https://s2.coinmarketcap.com/static/img/coins/64x64/1.png" class="media-object" />
                                                            </div>
                                                            <div class="media-body">
                                                                <p>BTC</p>
                                                                <h4 class="media-heading">Bitcoin</h4>
                                                            </div>
                                                            <div class="media-right">
                                                                <input pattern="/^-?d+.?d*$/" placeholder="0" class="" value="1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-md-2">

                                                </div>
                                                <div className="col-md-5">
                                                    <div className="convertor_individual_block">
                                                        <div class="media">
                                                            <div class="media-left">
                                                                <img src="/assets/img/usd.svg" class="media-object" />
                                                            </div>
                                                            <div class="media-body">
                                                                <p>USD</p>
                                                                <h4 class="media-heading">US Dollar</h4>
                                                            </div>
                                                            <div class="media-right">
                                                                <input pattern="/^-?d+.?d*$/" placeholder="0" class="" value="2700000000" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}