import React , {useEffect,  useState} from 'react' 
import {API_BASE_URL, convertvalue, config, graphqlApiKEY} from '../../../components/constants'
import CategoriesTab from '../../../components/categoriesTabs'
import Search_Contract_Address from '../../../components/searchContractAddress'
import AnalysisInsightsMenu from '../../../components/analysisInsightsmenu'
import SmartContractExplorers from '../../../components/SmartContractExplorers'
import ReactPaginate from 'react-paginate'
import Axios from 'axios'
import Head from 'next/head'
import cookie from "cookie"
import Highcharts from 'highcharts';
import Link from 'next/link'
 
function TokenDetails() 
{ 


return (
    <> 
        <Head> 
            <title>Dex Trades</title> 
        </Head> 
        <div className="page new_markets_index min_height_page" >
            <div className="market-page">
                <div className="new_page_title_block">
                    <div className="container">
                        <div className="col-md-12">
                            <div className="row market_insights ">
                                <div className="col-md-6 col-lg-6">
                                    <h1 className="page_title">Cryptocurrency Market Insights</h1>
                                    <p>Check the latest Price before you buy.</p>
                                </div>
                                <div className="col-md-1 col-lg-2"></div>
                                <div className="col-md-5 col-lg-4">
                                    {
                                    <Search_Contract_Address /> 
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="market_details_insights">
                    <div className="container"> 
                        <div className="col-md-12">
                            {
                            <CategoriesTab active_tab={2}/> 
                            } 
                            <div className="row mb-4 mt-4">
                                {
                                    <AnalysisInsightsMenu /> 
                                }
               
                                <div className="col-md-10">
                                    <SmartContractExplorers/>
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


export default TokenDetails
