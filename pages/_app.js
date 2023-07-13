// import '../styles/globals.css' 
import Head from 'next/head';
import App from 'next/app';
import Topmenu from '../components/Topmenu'
import Footer from '../components/Footer'
import {favicon} from '../components/constants'


class MyApp extends App{ 

  componentDidMount(){    
    document.body.classList.add('home', 'page-template-default', 'page', 'template-slider', 'color-custom', 'style-default', 'layout-full-width', 'no-content-padding', 'header-classic', 'sticky-header', 'sticky-tb-color', 'ab-show','subheader-both-center', 'menu-link-color', 'menuo-right', 'mobile-tb-hide', 'mobile-side-slide', 'mobile-mini-mr-ll');
  }
 
  render(){
    
  const {Component, pageProps} = this.props; 

    return ( 
      <>
        <Head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"/>
          <meta name="google-site-verification" content="f5cgDtTg3LajIuIprZ7HotIsYpT4ydHO4zSvpaBiWsc" />
          
          <link rel="shortcut icon" type="image/x-icon" href={favicon}/>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
          <link href="https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800;900&display=swap" rel="stylesheet"></link>
          
          <link rel="stylesheet" href="/assets/css/bootstrap.min.css" crossOrigin="anonymous"/>
          <link rel="stylesheet" media="all" href="/assets/css/market.css" />
          <link rel="stylesheet" media="all" href="/assets/css/header.css" />
          <link rel="stylesheet" media="all" href="/assets/css/footer.css" />

          <link rel="preconnect" href="https://fonts.googleapis.com"></link>
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
          <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet"></link>

          <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap" rel="stylesheet" />          
          
          <link rel="stylesheet" media="all" href="/assets/css/darktheme.css" />
          
          <script async="" src="https://www.googletagmanager.com/gtag/js?id=UA-100404206-1"></script>
          {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-4R54LKN7PN"/>
          <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-4R54LKN7PN');
            `,
          }}
        /> */}
        
      
          
        <script src="https://kit.fontawesome.com/215157a960.js" crossOrigin="anonymous"></script>
          <script src="/assets/js/jquery.min.js"></script>
          <script src="/assets/js/popper.min.js" crossOrigin="anonymous"></script>
          <script src="/assets/js/bootstrap.min.js" crossOrigin="anonymous"></script>
          <script src="/static/datafeeds/udf/dist/bundle.js" />
        </Head>
        <Topmenu />
          <Component {...pageProps} />
        
          
          <Footer /> 
          
      </> 
      )
  }
}


export default MyApp;

