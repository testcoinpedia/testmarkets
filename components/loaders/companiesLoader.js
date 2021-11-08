import React,{useEffect, useState} from 'react'
import ContentLoader from "react-content-loader";

export default function companiesLoader(props)
{ 
    const [contents, setContent] = useState([])

    const getColumns=()=>  {
        var list = [];
        for (var i=0; i < props.col; i++) {
            list.push(
                <>
                <div className="col-7 col-md-5 col-sm-7 col-xs-7" key={i+'test'} style={{marginBottom:"10px"}}>
                    <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                    <rect x="0" y="0" rx="0" width="100%" height="100%" />
                    </ContentLoader>
                </div>
                <div className="col-3 col-md-2 founded_on" key={i+'test'} style={{marginBottom:"10px"}}>
                    <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                        <rect x="0" y="0" rx="0" width="100%" height="100%" />
                    </ContentLoader>
                </div>
                <div className="col-5 col-md-3 col-sm-5 col-xs-5 category_display" key={i+'test'} style={{marginBottom:"10px"}}>
                    <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                        <rect x="0" y="0" rx="0" width="100%" height="100%" />
                    </ContentLoader>
                </div>
                <div className="col-md-2 view_company" key={i+'test'} style={{marginBottom:"10px"}}>
                    <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                        <rect x="0" y="0" rx="0" width="100%" height="100%" />
                    </ContentLoader>
                </div>
                </>
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
                <div key={i} className="row">{getColumns()}</div>   
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