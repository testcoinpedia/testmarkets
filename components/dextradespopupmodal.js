import React,{useState,useEffect} from 'react';  
import JsCookie from "js-cookie"

export default function Popupmodal({dex_row_id})
{ 
    // console.log("dex_row_id",dex_row_id)

    // console.log(dex_row_id)
    const [selected_dex_data, set_selected_dex_data] = useState({})
    const [title, set_title] = useState("")
    const [sub_title, set_sub_title] = useState("")
    const [description, set_description] = useState("")
    const [modal_data, set_modal_data] = useState({title: "", sub_title: "",description:""})
    const [showmodal, setShowModal] = useState(true) 
    const dex_data = [
        {
            title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
            sub_title :"DEX 24 hours volume. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
        {
            title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
            sub_title :"DEX 7 days volume. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
        {
            title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
            sub_title :"DEX 24 hours change % volume. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
        {
            title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
            sub_title :"DEX 7 days change % volume. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
        {
            title : "Volume of addresses that traded, maker and taker, trailing last 7 days and 24 hours.",
            sub_title :"Ranked 🥇DEX by volume. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        }, 
        {
            // title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
            sub_title :"24H Market share 🍰DEX by volume 🏦. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
        {
            title : "Count of  addresses that traded, maker and taker, trailing last 7 days and 24 hours.",
            sub_title :"Ranked 🥇DEX by number of traders. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
        {
            title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
            sub_title :"DEX 12 Months volume. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
        {
            title : "A decentralized exchange (DEX) is a cryptocurrency exchange which operates in a decentralized way, without a central authority.",
            sub_title :"DEX 30 days volume. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        },
       
        {
            title : "Count of unique addresses that traded, maker and taker, trailing Today",
            sub_title :"Number of traders. Refresh the page to keep yourself updated.",
            description : "All queries refresh automatically when viewed.",
        }
        
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

         if(parseInt(dex_row_id) === 8)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }

         if(parseInt(dex_row_id) === 9)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }
        if(parseInt(dex_row_id) === 10)
        {
            set_selected_dex_data(dex_data[dex_row_id-1])
        }
    }

    // const modalClose = () => 
    // {
    //    setShowModal(!showmodal)
    // }

    return( 
        
        <div className="popup_modal_for_all modal" style={ showmodal ? { display: 'block' } : { display: 'none' }} id="myModal">
           <div className="modal-dialog modal-md">
               <div className="modal-content">
               <div className="modal-body">
                    <div className='col-md-12'>
                        <div className='row'>
                            <div className='col-md-10 p-0'>
                                <h5 ><b>Result status</b></h5>
                            </div>
                            <div className='col-md-2'>
                                {/* <h5 className='mt-4'><img src='/assets/img/info.png' style={{width:"24px", cursor:"pointer"}}/></h5> */}
                            </div>
                        </div>
                    </div>
                    <hr className='mt-3'></hr>
                   <h5>{selected_dex_data.title ? <h5>{selected_dex_data.title}</h5> : null}</h5>
                   {selected_dex_data.sub_title ? <h5>{selected_dex_data.sub_title}</h5> : null}
                   <br></br>
                   <p>{selected_dex_data.description ? <p className="invalidcredential">- {selected_dex_data.description}</p>  : null}</p>
                   <button type="button" className="btn btn-secondary" onClick={()=> setShowModal(!showmodal)} data-dismiss="modal">Close</button>
               </div>
            </div>
         </div>
        </div>
   )
}