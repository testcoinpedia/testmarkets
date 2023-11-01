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
        const price_analysis_res = await Axios.get("https://coinpedia.org/wp-json/wp/v2/posts/?_fields=id,title,featured_image_sizes,yoast_head_json.title,date,yoast_head_json.canonical&categories=34116&per_page=100")
        if (price_analysis_res.data) {
            set_price_analysis(price_analysis_res.data)
           
    }
}

    return (
      <div className='tokendetail_charts price_detail_blocks'>
      <div className='price_block'>
      <div className='row'>
      {
      price_analysis.map((e)=>
        e.featured_image_sizes.medium ?
          <div className='col-md-6'>
            <a href={e.yoast_head_json.canonical} title={e.yoast_head_json?.title} alt="price-analysis" target='_blank'>
              <div className='media'>
              <div className='media-left align-self-center'>
                <img alt={e.yoast_head_json?.title} src={e.featured_image_sizes.medium?e.featured_image_sizes.medium:""}/>
              </div>
              <div className='media-body align-self-center'>
                <div className='price_desc'>
                <p> {e.date ? moment(e.date).fromNow():null} </p>
                <h4 dangerouslySetInnerHTML={{ __html: e.yoast_head_json?.title }}></h4>
                </div>                           
              </div>
              </div>
            </a>
          </div>
          :
          ""
        )
      }
       
      </div>
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