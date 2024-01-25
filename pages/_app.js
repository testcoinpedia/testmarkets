// import '../styles/globals.css' 
import Head from 'next/head';
import App from 'next/app';
import Topmenu from '../components/Topmenu'
import Footer from '../components/Footer'
import { Provider } from "react-redux";
import {favicon} from '../components/constants'
import rootReducer from '../components/redux/store'
import { useRouter } from 'next/router';
import { useEffect,useState } from 'react';

function MyApp({ Component, pageProps }) 


{
    return ( 
      <>
        <Head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"/>
          <meta name="google-site-verification" content="f5cgDtTg3LajIuIprZ7HotIsYpT4ydHO4zSvpaBiWsc" />
          
          <link rel="shortcut icon" type="image/x-icon" href={favicon}/>
          
          <link rel="stylesheet" href="/assets/css/bootstrap.min.css" crossOrigin="anonymous"/>
          <link rel="stylesheet" media="all" href="/assets/css/market.css" />
          <link rel="stylesheet" media="all" href="/assets/css/header.css" />
          <link rel="stylesheet" media="all" href="/assets/css/footer.css" />
          <link
            rel="stylesheet"
            type="text/css"
            href="/assets/css/slick.min.css"
            print="Media"
          />

          <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet"></link>

          <link rel="stylesheet" media="all" href="/assets/css/darktheme.css" />
          
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-RE1GG3FGQW"></script>
          <script
                    dangerouslySetInnerHTML={{
                      __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-RE1GG3FGQW');
            `,
          }}
          />
       
       <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "i17ihm5vtw");
          `,
        }}
        ></script>

{/* <script type="text/javascript">
              {`
               var _paq = window._paq = window._paq || [];
               _paq.push(["setCookieDomain", "*.coinpedia.org"]);
               _paq.push(['trackPageView']);
               _paq.push(['enableLinkTracking']);
               (function() {
                 var u="https://coinpedia-news.matomo.cloud/";
                 _paq.push(['setTrackerUrl', u+'matomo.php']);
                 _paq.push(['setSiteId', '1']);
                 var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                 g.async=true; g.src='//cdn.matomo.cloud/coinpedia-news.matomo.cloud/matomo.js'; s.parentNode.insertBefore(g,s);
               })();
              `}
            </script> */}

        </Head>
        <Provider store={rootReducer}> 
            
        <Topmenu />
        <Component {...pageProps}/>
          <Footer /> 
         </Provider>
         <script src="https://kit.fontawesome.com/215157a960.js" crossOrigin="anonymous"></script>
          <script src="/assets/js/jquery.min.js"></script>
          <script src="/assets/js/popper.min.js" crossOrigin="anonymous"></script>
          <script src="/assets/js/bootstrap.min.js" crossOrigin="anonymous"></script>
          <script src="/static/datafeeds/udf/dist/bundle.js" />
      </> 
);
  
}

export default MyApp;
