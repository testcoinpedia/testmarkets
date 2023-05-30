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

export const tokenLoader=(param)=>
{   
    var loader = []
    for(var i=1; i<=param; i++)
    {   
        loader.push(
          <tr>
              <td>
                <ContentLoader  width="100%" height="40px">
                  <rect x="0" y="0" rx="0" width="20%" height="30px" />
                </ContentLoader>
              </td> 
              <td>
                <ContentLoader width="100%" height="40px">
                <rect x="0" y="0" rx="25" width="40px" height="38px" /> 
                <rect x="45" y="0" rx="0" width="60%" height="30px" />
                </ContentLoader>
              </td>
              <td>
                <ContentLoader  width="100%" height="40px">
                <rect x="20" y="0" rx="25" width="30px" height="30px" />
                </ContentLoader>
              </td>
              <td>
                <ContentLoader  width="100%" height="40px">
                <rect x="0" y="0" rx="0" width="80%" height="15px" />
                <rect x="0" y="20" rx="0" width="100%" height="15px" />
                </ContentLoader>
              </td>
              <td>
                <ContentLoader width="100%" height="40px">
                <rect x="0" y="0" rx="0" width="60%" height="15px" />
                <rect x="0" y="20" rx="0" width="80%" height="15px" />
                </ContentLoader>
              </td>
              <td>
                <ContentLoader  width="100%" height="40px">
                  <rect x="0" y="0" rx="0" width="60%" height="30px" />
                </ContentLoader>
              </td> 
              
            </tr>
        )
    }
    return loader
}
export const transactionLoader=(param)=>
{   
    var loader = []
    for(var i=1; i<=param; i++)
    {   
        loader.push(
          <tr>
              <td className="mobile_hide txn_num">
                <ContentLoader  width="100%" height="35px">
                  <rect x="0" y="0" rx="0" width="15%" height="25px" />
                </ContentLoader>
              </td> 
              <td>
                <ContentLoader width="100%" height="50px">
                <rect x="0" y="30" rx="0" width="100%" height="10px" /> 
                <rect x="0" y="10" rx="0" width="100%" height="10px" />
                
                </ContentLoader>
              </td>
              {/* <td>
                <ContentLoader  width="100%" height="10px">
                <rect x="0" y="0" rx="0" width="60%" height="10px" />
                </ContentLoader>                           
              </td> */}
              <td>
                <ContentLoader width="100%" height="50px">
                <rect x="0" y="10" rx="25" width="25px" height="25px" /> 
                <rect x="30" y="30" rx="0" width="100%" height="10px" /> 
                <rect x="30" y="10" rx="0" width="100%" height="10px" />
                </ContentLoader>
              </td>
              <td className="mobile_hide">
              <ContentLoader  width="100%" height="35px">
                  <rect x="0" y="10" rx="0" width="60%" height="10px" />
                </ContentLoader>
              </td> 

              <td className="mobile_hide">
              <ContentLoader  width="100%" height="35px">
                  <rect x="0" y="10" rx="0" width="60%" height="10px" />
                </ContentLoader>
              </td>
             
              <td >
              <ContentLoader  width="100%" height="35px">
                  <rect x="0" y="0" rx="5" width="35%" height="30px" />
                  <rect x="50" y="0" rx="25" width="25px" height="25px" />
                </ContentLoader>
              
              </td> 
              
            </tr>
        )
    }
    return loader
}