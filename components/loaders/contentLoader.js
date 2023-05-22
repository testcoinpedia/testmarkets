import React,{useEffect, useState} from 'react'
import ContentLoader from "react-content-loader"

export const TrendingLoader=  (param)=>
{   
    var loader = []
    for(var i=1; i<=param; i++)
    {   
        loader.push(
           <div >
                    <ContentLoader speed={1} backgroundColor="#f0f0f3" foregroundColor="#fff"  width="100%" height="150px">
                      <rect x="0" y="0" rx="0" width="25%" height="12px" />
                      <rect x="0" y="25" rx="0" width="7%" height="18px" />
                      <rect x="30" y="25" rx="0" width="40%" height="15px" />
                      <rect x="0" y="50" rx="0" width="7%" height="18px" />
                      <rect x="30" y="50" rx="0" width="50%" height="15px" />
                      <rect x="0" y="75" rx="0" width="7%" height="18px" />
                      <rect x="30" y="75" rx="0" width="40%" height="15px" />
                      <rect x="0" y="100" rx="0" width="7%" height="18px" />
                      <rect x="30" y="100" rx="0" width="40%" height="15px" />
                      <rect x="0" y="125" rx="0" width="7%" height="18px" />
                      <rect x="30" y="125" rx="0" width="40%" height="15px" />
                      <rect x="0" y="150" rx="0" width="7%" height="18px" />
                      <rect x="30" y="150" rx="0" width="40%" height="15px" />
                      <rect x="0" y="175" rx="0" width="7%" height="18px" />
                      <rect x="30" y="175" rx="0" width="40%" height="15px" />
                    </ContentLoader>
            </div>
         
        )
    }
    return loader
}