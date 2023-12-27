import React,{useEffect, useState} from 'react'
import ContentLoader from "react-content-loader";

export default function tableLoader(props)
{ 
    const [contents, setContent] = useState([])

    const getColumns=()=>  {
        var list = [];
        for (var i=0; i < props.col; i++) {
            list.push(
                <div className="col-md-3 mb-2" key={i+'test'} >
                    <div className='nft-section nft-section-loader'>
                        <div className='nft-media-loader'>
                            <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="300px" >
                                <rect x="0" y="0" rx="0" width="100%" height="100%" />
                            </ContentLoader>
                        </div>
                       <div style={{margin:"10px"}}>
                       <div className="row ">
                            <div className='col-5'>
                            <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="25px" >
                                <rect x="0" y="0" rx="10px" width="100%" height="100%" />
                            </ContentLoader>
                            </div> 
                            <div className='col-2'>
                            </div> 
                            <div className='col-5 '>
                            <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="25px" >
                                <rect x="0" y="0" rx="10px" width="100%" height="100%" />
                            </ContentLoader>
                            </div>   
                        
                        </div>

                        <div >
                           <div className='mt-2'>
                           <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="30px" >
                                    <rect x="0" y="0" rx="10px" width="100%" height="100%" />
                                </ContentLoader>
                           </div>

                            <button className='btn btn-primary btn-block mt-2 nft-btn' style={{opacity:"0.5"}}>View More <img src="/assets/img/next.png" class="nft-next-image  "></img></button>
                            
                        </div>
                       </div>
                       
                    </div>
                </div>
            )
        }

        return list
    }

    const Getrows = () =>
    {
        var list = [];
        for(var i=0; i < props.row; i++) 
        {
            list.push(getColumns())
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