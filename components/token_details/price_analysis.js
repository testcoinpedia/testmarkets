import React , {useState, useEffect, useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'

export default function MyFunction()
{
  const [price_analysis, set_price_analysis] = useState([])

  
  // console.log("price_analysis",price_analysis)
  useEffect( () => 
  {
    priceAnalysis()

  }, [])

  const priceAnalysis = async () => {
    //Price Analysis 
        const price_analysis_res = await Axios.get("https://coinpedia.org/wp-json/wp/v2/posts/?_fields=id,title,featured_image_sizes,yoast_head_json.title,date&categories=34116&per_page=6")
        if (price_analysis_res.data) {
            set_price_analysis(price_analysis_res.data)
           
    }
}

    return (
      <div className='price_block'>
      <div className='row'>
        
          {price_analysis.map((e)=>
          <div className='col-md-6'>
        <div className='media'>
        <div className='media-left align-self-center'>
          <img src={e.featured_image_sizes.medium?e.featured_image_sizes.medium:"https://image.coinpedia.org/wp-content/uploads/2023/05/17161211/xrp-1-300x157.webp"}/>
        </div>
        <div className='media-body align-self-center'>
          <div className='price_desc'>
          <p> {e.date ? moment(e.date).fromNow():null} </p>
          <h4 dangerouslySetInnerHTML={{ __html: e.yoast_head_json?.title }}></h4>
          </div>                           
        </div>
      </div>
       </div>
      )}
       
      </div>
      </div>
      
  //       <div className='price_block'>
  // <div className='row'>
  //   <div className='col-md-6'>
  //   <div className='media'>
  //   <div className='media-left align-self-center'>
  //     <img src="https://image.coinpedia.org/wp-content/uploads/2023/05/15185546/Litecoin-1-300x157.webp" />
  //   </div>
  //   <div className='media-body align-self-center'>
  //     <div className='price_desc'>
  //     <p>6 Hrs Ago</p>
  //     <h4>Crypto Market News: Analyst Michael Van de Poppe’s Bullish Forecast for Altcoins and Bitcoin</h4>
  //     </div>                           
  //   </div>
  // </div>
  //   </div>

  //   <div className='col-md-6'>
  //   <div className='media'>
  //   <div className='media-left align-self-center'>
  //     <img src="https://image.coinpedia.org/wp-content/uploads/2023/05/13174712/Altseason-300x157.webp" />
  //   </div>
  //   <div className='media-body align-self-center'>
  //     <div className='price_desc'>
  //     <p>1 Day Ago</p>
  //     <h4>Crypto Market News: Analyst Michael Van de Poppe’s Bullish Forecast for Altcoins and Bitcoin</h4>
  //     </div>                           
  //   </div>
  // </div>
  //   </div>
  // </div>
  // </div>
    )
}