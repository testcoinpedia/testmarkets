/* eslint-disable */
import React , {useState, useEffect} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Details({active_network,complete_url}) 
{   
  const router = useRouter()
  const [active_tab, set_active_tab] = useState(active_network ? active_network : "")
 
  console.log(active_network)
  useEffect(()=>{

  },[active_tab])
  return (
    <div className="markets_list_quick_links">
        {/* <h6>Smart Contract Platform Explorers</h6> */}
        <ul>
            <li>
                <Link href={complete_url+"ethereum"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "ethereum" ? " active_category" : "")} onClick={()=>set_active_tab("ethereum")}>Ethereum</a>
                </Link>
            </li>
            <li>
                <Link href={complete_url+"bsc"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "bsc" ? " active_category" : "")} onClick={()=>set_active_tab("bsc")}>BSC</a>
                </Link>
            </li>
            <li>
                <Link href={complete_url+"matic"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "matic"? " active_category" : "")} onClick={()=>set_active_tab("matic")}>Matic(Polygon) </a>
                </Link>
            </li>
            <li>
                <Link href={complete_url+"tron"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "tron" ? " active_category" : "")} onClick={()=>set_active_tab("tron")}>Tron </a>
                </Link>
            </li>
            {/* <li>
                <Link href={complete_url+"avalanche"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "avalanche" ? " active_category" : "")} onClick={()=>set_active_tab("avalanche")}>Avalanche </a>
                </Link>
            </li>  */}
            <li>
                <Link href={complete_url+"solana"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "solana"? " active_category" : "")} onClick={()=>set_active_tab("solana")}>Solana </a>
                </Link>
            </li>
            {/* <li>
                <Link href={ethclassic"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "ethclassic" ? " active_category" : "")} onClick={()=>set_active_tab("ethclassic")}>Ethereum Classic</a>
                </Link>
            </li>
            <li>
                <Link href={ethclassic_reorg"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "ethclassic_reorg" ? " active_category" : "")} onClick={()=>set_active_tab("ethclassic_reorg")}>Ethereum Classic no reorg</a>
                </Link>
            </li> */}
            {/* <li>
                <Link href={complete_url+"algorand"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "algorand" ? " active_category" : "")} onClick={()=>set_active_tab("algorand")}>Algorand </a>
                </Link>
            </li>
            
            <li>
                <Link href={complete_url+"celo_rc1"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "celo_rc1" ? " active_category" : "")} onClick={()=>set_active_tab("celo_rc1")}>Celo </a>
                </Link>
            </li>
            <li>
                <Link href={complete_url+"conflux_hydra"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "conflux_hydra" ? " active_category" : "")} onClick={()=>set_active_tab("conflux_hydra")}>Conflux Hydra</a>
                </Link>
            </li>
            <li>
                <Link href={complete_url+"/eos"}>
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "eos" ? " active_category" : "")} onClick={()=>set_active_tab("eos")}>EOS </a>
                </Link>
            </li>
            <li>
                <Link href={complete_url+"velas"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "velas" ? " active_category" : "")} onClick={()=>set_active_tab("velas")}>Velas </a>
                </Link>
            </li>    
            <li>
                <Link href={complete_url+"klaytn"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "klaytn" ? " active_category" : "")} onClick={()=>set_active_tab("klaytn")}>Klaytn </a>
                </Link>
            </li>    
            <li>
                <Link href={complete_url+"elrond"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "elrond" ? " active_category" : "")} onClick={()=>set_active_tab("elrond")}>Elrond </a>
                </Link>
            </li>    
               
            <li>
                <Link href={complete_url+"fantom"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "fantom" ? " active_category" : "")} onClick={()=>set_active_tab("fantom")}>Fantom </a>
                </Link>
            </li>    
            <li>
                <Link href={complete_url+"moonbeam"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "moonbeam" ? " active_category" : "")} onClick={()=>set_active_tab("moonbeam")}>Moonbeam </a>
                </Link>
            </li>    
            <li>
                <Link href={complete_url+"flow"}> 
                <a data-toggle="tab"  className={"nav-item nav-link categories__item "+ (active_tab == "flow" ? " active_category" : "")} onClick={()=>set_active_tab("flow")}>Flow </a>
                </Link>
            </li>       */}
        </ul>
    </div>
    )
}         

  