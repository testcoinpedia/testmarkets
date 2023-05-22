import React , {useState, useEffect, useRef} from 'react'
import Axios from 'axios'
import JsCookie from "js-cookie"   
import moment from 'moment'

export default function MyFunction()
{

  const [price_prediction, set_price_prediction] = useState([])

  
  // console.log("price_prediction",price_prediction)
  useEffect( () => 
  {
    priceAnalysis()

  }, [])

  const priceAnalysis = async () => {
    //Price Analysis 
        const price_prediction_res = await Axios.get("https://coinpedia.org/wp-json/wp/v2/posts/?_fields=id,title,featured_image_sizes,yoast_head_json.title,date&categories=34126&per_page=6")
        if (price_prediction_res.data) {
            set_price_prediction(price_prediction_res.data)
           
    }
}

    return (
        <div className='price_block'>
<div className='row'>
{price_prediction.map((e)=>
          <div className='col-md-6'>
        <div className='media'>
        <div className='media-left align-self-center'>
          <img src={e.featured_image_sizes.medium}/>
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

  {/* <div className='col-md-6'>
  <div className='media'>
  <div className='media-left align-self-center'>
    <img src="https://image.coinpedia.org/wp-content/uploads/2023/05/13174712/Altseason-300x157.webp" />
  </div>
  <div className='media-body align-self-center'>
    <div className='price_desc'>
    <p>1 Day Ago</p>
    <h4>Crypto Market News: Analyst Michael Van de Poppe’s Bullish Forecast for Altcoins and Bitcoin</h4>
    </div>                           
  </div>
</div>
  </div> */}
</div>
</div>
    )
}