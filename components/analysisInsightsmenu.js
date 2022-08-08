/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Link from 'next/link'

export default function Details() 
{   
    
return (
     
         <div className="col-md-2">
          <div className="dex-side-menu">
            <h6 className="mt-2">Analysis Insights</h6>
            <Link href={"/analysis-insights/dex-volume/ethereum"}>
                <a className=" ">
                    <p className="">Dex Volume</p>
                </a>
            </Link>
            <Link href={"/analysis-insights/tvl"}>
                <a className=" ">
                    <p className="">Total Value Locked In</p>
                </a>
            </Link>
            {/* <p className="">Dex Users</p>
            <p className="">Other Metrics</p> */}

            {/* <h6 className="mt-4">DeFi Insights</h6>
            <p className="">Dex Volume</p>
            <p className="">Total Value Locked In</p>
            <p className="">Dex Users</p>
            <p className="">Other Metrics</p> */}

            <h6 className="mt-4">Chain Overview</h6>
            <Link href={"/analysis-insights/transactions/ethereum"}>
                <a className=" ">
                    <p className="">Transactions</p>
                </a>
            </Link>
            <Link href={"/analysis-insights/gas-used/ethereum"}>
                <a className=" ">
                    <p className="">GasUsed</p>
                </a>
            </Link>
          </div>
        </div>
    )
}         

  