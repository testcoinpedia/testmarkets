import React,{useEffect, useState} from 'react'
import ContentLoader from "react-content-loader";

export default function tableLoader(props)
{ 
    const [contents, setContent] = useState([])

    const getColumns=()=>  {
        var list = [];
        for (var i=0; i < props.col; i++) {
            list.push(
                <td key={i+'test'} className={i > 4 ? "hide_in_mobile":""}>
                    <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                        <rect x="0" y="0" rx="0" width="100%" height="100%" />
                    </ContentLoader>
                </td>
            )
        }

        return list
    }

    const Getrows = () =>
    {
        var list = [];
        for(var i=0; i < props.row; i++) 
        {
            list.push(
                <tr key={i} >{getColumns()}</tr>    
            
            
            // <div className="data__item">
            //     <div className="data__row dashboard_data_row">
            //         <div className="data__cell data__cell_lg">
            //             <div className="data__main dashboard_data_main">
            //                 {Getrows()}
            //             </div>
            //         </div>
            //     </div>
            // </div>
            )
        }
        setContent(list)
    }

    useEffect(()=>{
        Getrows()
    },[])
    
    return(
        <>
        { contents }
        </>

    )
} 