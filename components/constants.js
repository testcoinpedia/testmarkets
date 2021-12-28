import JsCookie from "js-cookie"

//local links - API
//export const API_BASE_URL = 'http://192.168.1.100:3010/';

//Live links - API
// export const api_url = 'https://api.coinpedia.org/';
 export const API_BASE_URL ='https://markets-nodejs-api-l9lg8.ondigitalocean.app/';
 export const IMAGE_BASE_URL = 'https://image.coinpedia.org/app_uploads';
// export const API_DIGITALOCEAN_URL = 'https://markets-nodejs-api-l9lg8.ondigitalocean.app/'


// Live links
export const website_url = 'https://markets.coinpedia.org/'; 
export const app_coinpedia_url="https://app.coinpedia.org/"
export const coinpedia_url="https://coinpedia.org/"
export const market_coinpedia_url =  'https://markets.coinpedia.org/'; 
export const cookieDomainExtension = '.coinpedia.org';
export const logo =  '/assets/img/logo.png'
export const favicon =  '/assets/img/favicon.png'




// Local Links
// export const website_url = 'http://192.168.1.100:4500/'; 
// export const app_coinpedia_url="http://192.168.1.100:4400/"
// export const coinpedia_url="http://192.168.1.100:81/cpnews/"
// export const market_coinpedia_url = 'http://192.168.1.100:4500/';
// export const cookieDomainExtension = '192.168.1.100';
// export const logo =  '/assets/img/dummy-logo.png'
// export const favicon =  '/assets/img/dummy-favicon.png'



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



