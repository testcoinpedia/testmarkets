// TradingViewWidget.jsx

import React, { useEffect, useRef } from 'react';

let tvScriptLoadingPromise;

export default function TradingViewWidget({reqData}) 
{
  const onLoadScriptRef = useRef();
  const {tradingview_id} = reqData

  useEffect(() => 
  {
      onLoadScriptRef.current = createWidget
      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script')
          script.id = 'tradingview-widget-loading-script'
          script.src = 'https://s3.tradingview.com/tv.js'
          script.type = 'text/javascript'
          script.onload = resolve
          document.head.appendChild(script)
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() 
      {
        if(document.getElementById('technical-analysis-chart-demo') && 'TradingView' in window) 
        {
          new window.TradingView.widget({
            container_id: "technical-analysis-chart-demo",
            width: "100%",
            height: "470px",
            autosize: true,
            symbol: tradingview_id,
            interval: "D",
            timezone: "exchange",
            theme: "light",
            style: "1",
            toolbar_bg: "#f1f3f6",
            withdateranges: true,
            hide_side_toolbar: false,
            allow_symbol_change: true,
            save_image: false,
            show_popup_button: true,
            popup_width: "1000",
            popup_height: "650",
            locale: "en"
          });
        }
      }
    },
    []
  )

  return (
    <div className='tradingview-widget-container'>
      <div id='technical-analysis-chart-demo' style={{height:"470px"}}/>
    </div>
  )
}
