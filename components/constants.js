import JsCookie from "js-cookie"

//local links - API
//  export const API_BASE_URL = 'http://192.168.1.100:3010/';

//Live links - API
// export const api_url = 'https://api.coinpedia.org/';
export const API_BASE_URL ='https://markets-nodejs-api-l9lg8.ondigitalocean.app/';
export const IMAGE_BASE_URL = 'https://image.coinpedia.org/app_uploads';
// export const API_DIGITALOCEAN_URL = 'https://markets-nodejs-api-l9lg8.ondigitalocean.app/'


// Live links
// export const website_url = 'https://markets.coinpedia.org/'; 
// export const app_coinpedia_url="https://app.coinpedia.org/"
// export const coinpedia_url="https://coinpedia.org/"
// export const market_coinpedia_url =  'https://markets.coinpedia.org/'; 
// export const cookieDomainExtension = '.coinpedia.org';
// export const logo =  '/assets/img/logo.png'
// export const favicon =  '/assets/img/favicon.png'


// Local Links
export const website_url = 'http://192.168.1.100:4500/'; 
export const app_coinpedia_url="http://192.168.1.100:4400/"
export const coinpedia_url="http://192.168.1.100:81/cpnews/"
export const market_coinpedia_url = 'http://192.168.1.100:4500/';
export const cookieDomainExtension = '192.168.1.100';
export const logo =  '/assets/img/dummy-logo.png'
export const favicon =  '/assets/img/dummy-favicon.png'



export const separator=(numb)=> {
  var str = numb.toString().split(".");
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return str.join(".");
}
 
export const x_api_key = "234ADSIUDG98669DKLDSFHDASDFLKHSDAFIUUUUS"
export const config=(user_token)=> 
{
  if(user_token)
  {
     return { headers :
      {
          "api_key" : "234ADSIUDG98669DKLDSFHDASDFLKHSDAFIUUUUS",
          "token" : user_token,
      }}
  }
  else
  {
    return { 
      headers : {
      "api_key" : "234ADSIUDG98669DKLDSFHDASDFLKHSDAFIUUUUS"
      }}
  }
}
export const graphqlApiKEY = "BQY1XNDUiyQLTCiyS2BbBOrOlAhhckt5"

export const strLenTrim=(title, length)=>
{
  return title.length > length ? (title).slice(0, length)+"..." : title
}

export const strTrim=(string)=>
{
    return string === null? "-":string
}

export const getDomainName = (link)=>
{
  if(link != ''){
    var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
    let url = ""
    {
      regexp.test(link) 
      ? 
      url = new URL(link) 
      : 
      link = "http://"+link
      url = new URL(link);
     
    }
    

    var arr = url.hostname.split(".")
    
    return (arr[0] == "www" || arr[0] == "in" || arr[1] == "medium") ? arr[1] :  arr[0]

  }
  else
  {
    return null
  }
  
}

export const createValidURL = (link)=>
{
  // if(link != '')
  // {
  //   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  //   let url = ""
  //   {
  //     regexp.test(link) 
  //     ? 
  //     url = new URL(link) 
  //     : 
  //     link = "http://"+link
  //     url = new URL(link);
     
  //   }
    
  //   if(url.href)
  //   {
  //     return url.href
  //   }
  //   else
  //   {
  //     link
  //   }
  // }
  // else
  // {
  //   return "#"
  // }
  if(link)
  {
    if(link.includes("https") || link.includes("http")){
      return link
    }
    else
    {
      return "https://"+link
    }
  }
  else
  {
    return false
  }
}

export const DomainName = (link)=>
{
  // if(link != '')
  // {
  //   var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/
  //   let url = ""
  //   {
  //     regexp.test(link) 
  //     ? 
  //     url = new URL(link) 
  //     : 
  //     link = "http://"+link
  //     url = new URL(link);
     
  //   }
    
  //   if(url.href)
  //   {
  //     return url.href
  //   }
  //   else
  //   {
  //     link
  //   }
  // }
  // else
  // {
  //   return "#"
  // }
  if(link)
  {
    if(link.includes("https://")  ){
      link = link.split("https://")
      return link
    }
    else if(link.includes("http://"))
    {
      link = link.split("http://")
      return link
     
    }
    else if(link.includes("www")){
      link = link.split("www.")
      return link
    }
    else{
      return link
    }
  }
  else
  {
    return false
  }
}
export const count_live_price=(live_price)=> 
{
  if (Math.abs(live_price) < 1.0) {
    var e = parseInt(live_price.toString().split('e-')[1]);
    if (e) {
      live_price *= Math.pow(10,e-1);
      live_price = '0.' + (new Array(e)).join('0') + live_price.toString().substring(2);
      return live_price
    }
  } else {
    var e = parseInt(live_price.toString().split('+')[1]);
    if (e > 20) {
        e -= 20;
        live_price /= Math.pow(10,e);
        live_price += (new Array(e+1)).join('0');
       
    }
    return parseFloat(live_price.toFixed(7))
  }
  return (parseFloat(live_price)).toFixed(7)
}

export const convertvalue=(labelValue)=> 
{
  return Math.abs(Number(labelValue)) >= 1.0e+9

  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+9*100)/100 + " B"

  : Math.abs(Number(labelValue)) >= 1.0e+6
  
  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+6*100)/100 + " M"

  : Math.abs(Number(labelValue)) >= 1.0e+3

  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+3*100)/100 + " K"

  : Math.abs(Number(labelValue)); 
} 

  export const Logout=()=> {
    JsCookie.remove('user_type', {domain:cookieDomainExtension})
    JsCookie.remove('user_email_status', {domain:cookieDomainExtension})
    JsCookie.remove('user_email_id', {domain:cookieDomainExtension})
    JsCookie.remove('user_profile_image', {domain:cookieDomainExtension})
    JsCookie.remove('user_token', {domain:cookieDomainExtension})
    JsCookie.remove('user_full_name', {domain:cookieDomainExtension})  
    JsCookie.remove('user_username', {domain:cookieDomainExtension})
    JsCookie.remove('user_wallet_address', {domain:cookieDomainExtension})
    JsCookie.remove('user_company_listed_status', {domain:cookieDomainExtension})
    return true
  }



