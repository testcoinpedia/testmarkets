import React,{useEffect, useState} from 'react'
import ContentLoader from "react-content-loader";

export default function topArticleLoader(props)
{ 
    const [contents, setContent] = useState([])

    const getColumns=()=>  {
        var list = [];
        for (var i=0; i < props.col; i++) {
            list.push(
                <>
                <div key={i} className="media"  key={i+'test'} style={{marginBottom:"10px"}}>
                    <img className="mr-3" alt="" key={i+'test'} style={{marginBottom:"10px"}}/>
                    <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                            <rect x="0" y="0" rx="0" width="100%" height="100%" />
                    </ContentLoader>
                    <div className="media-body">
                    <h5 className="mt-0" key={i+'test'} style={{marginBottom:"10px"}}>
                        <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                            <rect x="0" y="0" rx="0" width="100%" height="100%" />
                        </ContentLoader>
                    </h5>
                    <p key={i+'test'} style={{marginBottom:"10px"}}>
                        <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="40px" >
                            <rect x="0" y="0" rx="0" width="100%" height="100%" />
                        </ContentLoader>
                    </p>
                    </div>
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
                getColumns()  
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