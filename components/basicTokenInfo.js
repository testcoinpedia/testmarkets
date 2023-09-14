import React,{useState,useEffect} from 'react';  
import JsCookie from "js-cookie"

export default function Popupmodal({dex_row_id})
{ 
    console.log("dex_row_id",dex_row_id)

    console.log(dex_row_id)
    const [selected_dex_data, set_selected_dex_data] = useState({})
    const [title, set_title] = useState("")
    const [sub_title, set_sub_title] = useState("")
    const [description, set_description] = useState("")
    const [modal_data, set_modal_data] = useState({heading:"",title: "", sub_title: "",description:""})
    const [showmodal, setShowModal] = useState(true) 
    const dex_data = [
        {
            heading:"Market Cap",
            title : "The total market value of a cryptocurrency's circulating supply.",
            sub_title :"It is analogous to the free-float capitalization in the stock market.",
            description : " Market Cap = Current Price x Circulating Supply.",
        },
        {
            heading:"",
            title : "The market cap if the max supply was in circulation.",
            sub_title :"Fully-diluted market cap (FDMC) = price x max supply.",
            description : "  If max supply is null, FDMC = price x total supply. if max supply and total supply are infinite or not available, fully-diluted market cap shows - -." ,
        },
        {
            heading:"Circulating Supply",
            title : "The amount of coins that are circulating in the market and are in public hands. ",
            sub_title :"It is analogous to the flowing shares in the stock market.",
        },
        {
            heading:"Maximum Supply ",
            title : "The maximum amount of coins that will ever exist in the lifetime of the cryptocurrency. ",
            sub_title :"It is analogous to the fully diluted shares in the stock market.",
            description : "If this data has not been submitted by the project or verified by the CMC team, max supply shows - -.",
        }, 
        {
            heading:"Volume",
            title : "A measure of how much of a cryptocurrency was traded in the last 24 hours.",
            sub_title :"",
        },
        {
            heading:"",
            title : "In the context of cryptocurrency, liquidity refers to the ease and speed with which a particular digital asset can be bought or sold on a cryptocurrency exchange without affecting its price significantly.",
            sub_title :"A cryptocurrency with high liquidity is one that can be quickly and easily bought or sold on an exchange at a price close to the current market price, without significant slippage or price impact.",
            description :"",
        },
        // {
        //     // title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
        //     sub_title :"A measure of how much of a cryptocurrency was traded in the last 24 hours.",

        // },
        // {
        //     title : "Count of  addresses that traded, maker and taker, trailing last 7 days and 24 hours.",
        //     sub_title :"Ranked 🥇DEX by number of traders. Refresh the page to keep yourself updated.",
        //     description : "All queries refresh automatically when viewed.",
        // },
        // {
        //     title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
        //     sub_title :"DEX 12 Months volume. Refresh the page to keep yourself updated.",
        //     description : "All queries refresh automatically when viewed.",
        // },
        // {
        //     title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
        //     sub_title :"DEX 30 days volume. Refresh the page to keep yourself updated.",
        //     description : "All queries refresh automatically when viewed.",
        // },
       
        // {
        //     title : "Count of unique addresses that traded, maker and taker, trailing Today",
        //     sub_title :"Number of traders. Refresh the page to keep yourself updated.",
        //     description : "All queries refresh automatically when viewed.",
        // }
        
    ]
    useEffect(() => { 
        popUpData()
    }, [])


    const popUpData = () => 
    {
        if(parseInt(dex_row_id) === 1)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

        if(parseInt(dex_row_id) === 2)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

        if(parseInt(dex_row_id) === 3)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

        if(parseInt(dex_row_id) === 4)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

        if(parseInt(dex_row_id) === 5)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

        if(parseInt(dex_row_id) === 6)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

        if(parseInt(dex_row_id) === 7)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

        //  if(parseInt(dex_row_id) === 8)
        // {
        //     set_selected_dex_data(dex_data[dex_row_id-1])
        // }

        //  if(parseInt(dex_row_id) === 9)
        // {
        //     set_selected_dex_data(dex_data[dex_row_id-1])
        // }
        // if(parseInt(dex_row_id) === 10)
        // {
        //     set_selected_dex_data(dex_data[dex_row_id-1])
        // }
    }

    // const modalClose = () => 
    // {
    //    setShowModal(!showmodal)
    // }

    return( 
        
        <div className="popup_modal_for_all modal" style={ showmodal ? { display: 'block' } : { display: 'none' }} id="myModal">
           <div className="modal-dialog modal-md">
               <div className="modal-content">
               <div class="modal-header">
                <h4 class="modal-title">{selected_dex_data.heading?selected_dex_data.heading:""}</h4>
                <button type="button" className="close" data-dismiss="modal" onClick={()=> setShowModal(!showmodal)}><span><img src="/assets/img/close_icon.svg" alt = " Close" /></span></button>
                </div>               
               <div className="modal-body">
                   <div>{selected_dex_data.title ? <h5>{selected_dex_data.title}</h5> : null}</div>
                   {selected_dex_data.sub_title ? <h5 className='mt-2'>{selected_dex_data.sub_title}</h5> : null}
                   <p className='mt-2'>{selected_dex_data.description ? <p className="invalidcredential">- {selected_dex_data.description}</p>  : null}</p>
                   {/* <hr className='mt-3'></hr> */}
                   
               </div>
            </div>
         </div>
        </div>
   )
}