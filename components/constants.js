import JsCookie from "js-cookie"

// Live links
// export const coinpedia_url="https://coinpedia.org/"
// export const app_coinpedia_url="https://app.coinpedia.org/"
// export const market_coinpedia_url = 'https://markets.coinpedia.org/' 
// export const events_coinpedia_url = 'https://events.coinpedia.org/'
// export const cookieDomainExtension = '.coinpedia.org'
// export const logo =  '/assets/img/logo.png'
// export const favicon =  '/assets/img/favicon.png'
// export const graphqlApiKEY = "BQYI963iirpgew04eXmID1hhCF3jozik"
// export const portfolio_graphql_api_key = "BQYI963iirpgew04eXmID1hhCF3jozik"

//Test links
export const coinpedia_url="https://maintest.coinpedia.org/"
export const app_coinpedia_url = 'https://testapp.coinpedia.org/'
export const market_coinpedia_url = 'https://testmarkets.coinpedia.org/'
export const events_coinpedia_url = 'https://testevents.coinpedia.org/'
export const cookieDomainExtension = '.coinpedia.org'
export const logo = '/assets/img/logo.png'
export const favicon = '/assets/img/favicon.png'
export const graphqlApiKEY = "BQYI963iirpgew04eXmID1hhCF3jozik"
export const portfolio_graphql_api_key = "BQYI963iirpgew04eXmID1hhCF3jozik"

// Local Links
// export const coinpedia_url="http://192.168.1.100:81/cpnews/"
// export const app_coinpedia_url="http://192.168.1.100:4400/"
// export const market_coinpedia_url = 'http://192.168.1.100:4500/' 
// export const events_coinpedia_url = 'http://192.168.1.100:4300/' 
// export const cookieDomainExtension = '192.168.1.100'
// export const logo =  '/assets/img/dummy-logo.png'
// export const favicon =  '/assets/img/dummy-favicon.png'
// export const graphqlApiKEY = "BQYI963iirpgew04eXmID1hhCF3jozik"
// export const portfolio_graphql_api_key = "BQYI963iirpgew04eXmID1hhCF3jozik"


// BQY1XNDUiyQLTCiyS2BbBOrOlAhhckt5
//API local links
// export const API_BASE_URL = 'http://192.168.1.100:3500/'
// export const MAIN_API_BASE_URL = 'http://192.168.1.100:3010/'

//API TEST links
// export const API_BASE_URL = 'https://hammerhead-app-4vdn3.ondigitalocean.app/'
// export const MAIN_API_BASE_URL = 'https://shark-app-q5yj6.ondigitalocean.app/'

// //API live links
export const API_BASE_URL = 'https://hammerhead-app-4vdn3.ondigitalocean.app/'
export const MAIN_API_BASE_URL = 'https://markets-nodejs-api-l9lg8.ondigitalocean.app/'


export const separator=(numb)=> {
  var str = numb.toString().split(".")
  str[0] = str[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return str.join(".")
}
export const IMAGE_BASE_URL = 'https://image.coinpedia.org/app_uploads'
 
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

export const googleClientId = "120903672784-tgvt3apka33k6jj3s5c0htg84g23ej07.apps.googleusercontent.com"

// export const graphqlApiKEY = "BQYXSU6x0V4fdfipsg3myrytbKPXFme7"

// export const graphqlApiKEY = "BQYDhJL0RXOU29HIwyFK2M5Bb5OOy3pp"

// old BQY1XNDUiyQLTCiyS2BbBOrOlAhhckt5

export const graphqlApiURL = "https://graphql.bitquery.io/"
export const graphql_headers =  {
    "Content-Type": "application/json",
    "X-API-KEY": graphqlApiKEY
}

export const bsc_api_key = "91A35Z47AZD3IG1USZ8TX1P4827QB584ZK"
export const ethereum_api_key = "7REYTSUWQA7EWSF41YJPEZ3HC2W7PG3N2S"
// export const graphqlApiKEY = "BQYXSU6x0V4fdfipsg3myrytbKPXFme7"

export const strLenTrim=(title, length)=>
{
  return title.length > length ? (title).slice(0, length)+".." : title
}

export const strTrim=(string)=>
{
    return string === null? "-":string
}


export const smallExponentialPrice=(pass_value)=>
{   
  
    const number = ((roundNumericValue(pass_value)).toString()).split('.')
    if(number.length === 2) 
    {
      const integerPart = number[0]
      const decimalPart = number[1]
      const zeroCount = decimalPart.match(/^0+/)
      
      if(zeroCount && zeroCount[0].length > 4)
      {
        return (
          <>
            {integerPart}.0<sub className='zeroCount'>{zeroCount[0].length}</sub>{decimalPart.replace(/^0+/, '')}
          </>
        )
      }
    }
    return pass_value
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

export const speedoMeterValues = async ({total_sma_buy, total_sma_sell, total_sma_neutral}) =>
{
  var speed_meter_name = "Neutral"
  var speed_percentage = 0
  if(total_sma_buy || total_sma_sell)
  {
      if(total_sma_sell > total_sma_buy)
      {
        const temp_total_sma_value = await parseFloat(((total_sma_sell/(total_sma_buy+total_sma_sell))*100).toFixed(2))
        if(temp_total_sma_value > 80)
        {
          speed_meter_name = "Strong Sell"
          speed_percentage = 100-temp_total_sma_value
        }
        else if(temp_total_sma_value > 60)
        {
          speed_meter_name = "Sell"  
          speed_percentage = 100-temp_total_sma_value
        }
        else
        {
          speed_percentage = 100-temp_total_sma_value
        }

        return { speed_meter_name, speed_percentage }
      }
      else
      {
        const temp_total_sma_value = await parseFloat(((total_sma_buy/(total_sma_buy+total_sma_sell))*100).toFixed(2))

        if(temp_total_sma_value > 80)
        {
          speed_meter_name = "Strong Buy"
          speed_percentage = temp_total_sma_value
        }
        else if(temp_total_sma_value > 60)
        {
          speed_meter_name = "Buy"  
          speed_percentage = temp_total_sma_value
        }
        else
        {
          speed_percentage = temp_total_sma_value
        }
        return { speed_meter_name, speed_percentage }
      }
    }
    else
    {
      return { speed_meter_name, speed_percentage }
    }
}


export const apexChartData = async (listData, tokenomics_percentage_value) =>
{
  var series = []
  var labels = []

  for(let i of listData)
  {
    await labels.push(i.tokenomics_name ? (i.tokenomics_name).substring(0, 13):"")
    await series.push(i.percentage_of_total_supply ? parseFloat(i.percentage_of_total_supply):0)
  }

  if(tokenomics_percentage_value < 100)
  {
    await labels.push("Other")
    await series.push(parseFloat((100-parseFloat(tokenomics_percentage_value)).toFixed(2)))
  }

  // console.log("tokenomics_percentage_value", tokenomics_percentage_value)
  // console.log("series", series)
  // console.log("labels", labels)
  return await {series, labels}
}

export const volume_time_list = [
  {
    _id:1,
    name:"1h"
  },
  {
    _id:2,
    name:"6h"
  },
  {
    _id:3,
    name:"12h"
  },
  {
    _id:4,
    name:"24h"
  },
  {
    _id:5,
    name:"7d"
  }
]


export const roundNumericValue=(value) =>
{ 
  if(value)
  {
    if(value > 0)
    {
        if(parseFloat(value) >= 1000000)
        {
          return separator((parseFloat(value)).toFixed(0))
        }
        else if(parseFloat(value) >= 0.1)
        {
          return separator((parseFloat(value)).toFixed(2))
        }
        else if((parseFloat(value) < 0.1) && (parseFloat(value) >= 0.01))
        {
          return (parseFloat(value)).toFixed(5)
        }
        else if((parseFloat(value) < 0.01) && (parseFloat(value) >= 0.001))
        {
          return (parseFloat(value)).toFixed(6)
        }
        else if((parseFloat(value) < 0.001) && (parseFloat(value) > 0.0001))
        {
          return (parseFloat(value)).toFixed(6)
        }
        else if((parseFloat(value) < 0.0001) && (parseFloat(value) > 0.00001))
        {
          return (parseFloat(value)).toFixed(8)
        }
        else if((parseFloat(value) < 0.00001) && (parseFloat(value) > 0.000001))
        {
          return (parseFloat(value)).toFixed(9)
        }
        else if((parseFloat(value) < 0.000001) && (parseFloat(value) > 0.0000001))
        {
          return ((parseFloat(value)).toFixed(10))
        }
        else if((parseFloat(value) < 0.0000001) && (parseFloat(value) > 0.00000001))
        {
          return (parseFloat(value)).toFixed(11)
        }
        else if((parseFloat(value) < 0.00000001) && (parseFloat(value) > 0.000000001))
        {
          return (parseFloat(value)).toFixed(12)
        }
        else if((parseFloat(value) < 0.000000001) && (parseFloat(value) > 0.0000000001))
        {
          return (parseFloat(value)).toFixed(12)
        }
        else
        {
          return ((parseFloat(value)).toFixed(13))
        }
    }
    else
    { 
      if(parseFloat(value) <= -0.1)
      {
        return ((parseFloat(value)).toFixed(2))
      }
      else if((parseFloat(value) > -0.1) && (parseFloat(value) <= -0.01))
      {
        return (parseFloat(value)).toFixed(3)
      }
      else if((parseFloat(value) > -0.01) && (parseFloat(value) <= -0.001))
      {
        return (parseFloat(value)).toFixed(6)
      }
      else if((parseFloat(value) > -0.001) && (parseFloat(value) <= -0.0001))
      {
        return (parseFloat(value)).toFixed(6)
      }
      else if((parseFloat(value) > -0.0001) && (parseFloat(value) <= -0.00001))
      {
        return (parseFloat(value)).toFixed(6)
      }
      else if((parseFloat(value) > -0.00001) && (parseFloat(value) <= -0.000001))
      {
        return (parseFloat(value)).toFixed(7)
      }
      else if((parseFloat(value) > -0.000001) && (parseFloat(value) <= -0.0000001))
      {
        return (parseFloat(value)).toFixed(8)
      }
      else if((parseFloat(value) > -0.0000001) && (parseFloat(value) <= -0.00000001))
      {
        return (parseFloat(value)).toFixed(9)
      }
      else
      {
        return ((parseFloat(value)).toFixed(13))
      }
    }
  }
  else
  {
    return "-"
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
    return parseFloat((parseFloat(live_price)).toFixed(7))
  }
  return (parseFloat(live_price)).toFixed(7)
}

export const convertvalue=(labelValue)=> 
{
  return  Math.abs(Number(labelValue)) >= 1.0e+12

  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+12*100)/100 + " T"

  : Math.abs(Number(labelValue)) >= 1.0e+9

  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+9*100)/100 + " B"

  : Math.abs(Number(labelValue)) >= 1.0e+6
  
  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+6*100)/100 + " M"

  : Math.abs(Number(labelValue)) >= 1.0e+3

  ? Math.trunc(Math.abs(Number(labelValue)) / 1.0e+3*100)/100 + " K"

  : Math.abs(Number(labelValue)) >= 1

  ? labelValue.toFixed(2)
  
  : Math.abs(Number(labelValue)) 
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

  export const reduxData = {
    login:"loginAccount",
    logout:"logoutAccount",
    converter:"currencyConverter",
  }
  

  
export const setLoginData=(message) => 
{
  if(message.keepme_status==2){
    var expire_time = new Date(new Date().getTime()+ 30 * 24 * 60 * 60 * 1000)

  }
  else{
    var expire_time = new Date(new Date().getTime() + 180 * 60 * 1000)

  }
    // var expire_time = new Date(new Date().getTime() + 180 * 60 * 1000)
    // console.log(expire_time)
    JsCookie.set('user_token', message.token, { expires:expire_time, domain: cookieDomainExtension })
    JsCookie.set("user_email_status", true,{ expires:expire_time, domain: cookieDomainExtension })
    JsCookie.set("user_approval_status", message.approval_status,{ expires:expire_time, domain: cookieDomainExtension })
    JsCookie.set("user_email_id", message.email_id,{ expires:expire_time, domain: cookieDomainExtension })
    JsCookie.set("user_profile_image", message.profile_image,{ expires:expire_time, domain: cookieDomainExtension })  
    if(message.user_name)
    {
        JsCookie.set("user_username", message.user_name,{ expires:expire_time, domain: cookieDomainExtension })  
    }
    JsCookie.set("user_full_name", message.full_name,{ expires:expire_time, domain: cookieDomainExtension })
    JsCookie.set("user_wallet_address", message.wallet_address,{ expires:expire_time, domain: cookieDomainExtension })
    JsCookie.set("user_company_listed_status", message.company_listed_status,{ expires:expire_time, domain: cookieDomainExtension })
    
    //JsCookie.set('register_type', {domain:cookieDomainExtension})
    JsCookie.remove('temp_email_id', {domain:cookieDomainExtension})
    JsCookie.remove('verify_end_n_time', {domain:cookieDomainExtension})
    JsCookie.remove('temp_token', {domain:cookieDomainExtension})
    JsCookie.remove("temp_full_name",{domain:cookieDomainExtension})
    JsCookie.remove("temp_facebook_id",{domain:cookieDomainExtension})
    JsCookie.remove("temp_wallet_address",{domain:cookieDomainExtension})
    JsCookie.remove("temp_user_name", {domain:cookieDomainExtension})
    JsCookie.remove("temp_google_id",{domain:cookieDomainExtension})
    JsCookie.remove('country_data',{domain:cookieDomainExtension})
    return true
}

  export const getShortWalletAddress=(wallet_address, pass_length)=>
  { 
      if(pass_length)
      {
        var res1 = wallet_address.substr(0, pass_length)
        var res2 = wallet_address.substr(wallet_address.length - pass_length)
        return res1+'...'+res2
      }
      else
      {
        var res1 = wallet_address.substr(0, 4)
        var res2 = wallet_address.substr(wallet_address.length - 4)
        return res1+'...'+res2
      }
      
  }

  export const getURLWebsiteName=(pass_value)=> 
  {
    let url = ""
    if(pass_value) 
    {
      if((/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/).test(pass_value)) 
      {
        url = new URL(pass_value)
      }
      else 
      {
        url = new URL("http://" + pass_value)
      }
      const hostname = url.hostname
      const myArray = hostname.split(".")
      if(myArray.length == 2)
      {
        return myArray[0] == 't' ? 'Telegram': myArray[0]
      }
      else if(myArray.length == 3)
      {
        return myArray[1] == 't' ? 'Telegram': myArray[1]
      }
      else 
      {
        return url.hostname == 't' ? 'Telegram': url.hostname
      }
    }
    else
    {
      return ""
    }
    
  }

 
  export const event_image_size = "300000"
  
  export const live_price_url = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum%2Chex%2Cbinance-coin%2Ctether&per_page=100&page=1&sparkline=false'


  export const country_list = [
    {
    country_id: "1",
    sortname: "AF",
    country_code: "+93",
    country_name: "Afghanistan",
    country_flag: "af.png",
    currency_code: "AFN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "2",
    sortname: "AL",
    country_code: "+355",
    country_name: "Albania",
    country_flag: "al.png",
    currency_code: "ALL",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "3",
    sortname: "DZ",
    country_code: "+213",
    country_name: "Algeria",
    country_flag: "dz.png",
    currency_code: "DZD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "4",
    sortname: "AS",
    country_code: "+1",
    country_name: "American Samoa",
    country_flag: "as.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "5",
    sortname: "AD",
    country_code: "+376",
    country_name: "Andorra",
    country_flag: "ad.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "6",
    sortname: "AO",
    country_code: "+244",
    country_name: "Angola",
    country_flag: "ao.png",
    currency_code: "AOA",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "7",
    sortname: "AI",
    country_code: "+1",
    country_name: "Anguilla",
    country_flag: "al.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "8",
    sortname: "AQ",
    country_code: "+672",
    country_name: "Antarctica",
    country_flag: "aq.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "9",
    sortname: "AG",
    country_code: "+1",
    country_name: "Antigua And Barbuda",
    country_flag: "ag.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "10",
    sortname: "AR",
    country_code: "+54",
    country_name: "Argentina",
    country_flag: "ar.png",
    currency_code: "ARS",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "11",
    sortname: "AM",
    country_code: "+374",
    country_name: "Armenia",
    country_flag: "am.png",
    currency_code: "AMD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "12",
    sortname: "AW",
    country_code: "+297",
    country_name: "Aruba",
    country_flag: "aw.png",
    currency_code: "AWG",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "13",
    sortname: "AU",
    country_code: "+61",
    country_name: "Australia",
    country_flag: "au.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "14",
    sortname: "AT",
    country_code: "+43",
    country_name: "Austria",
    country_flag: "at.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "15",
    sortname: "AZ",
    country_code: "+994",
    country_name: "Azerbaijan",
    country_flag: "az.png",
    currency_code: "AZN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "16",
    sortname: "BS",
    country_code: "+1",
    country_name: "Bahamas The",
    country_flag: "bs.png",
    currency_code: "BSD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "17",
    sortname: "BH",
    country_code: "+97",
    country_name: "Bahrain",
    country_flag: "bh.png",
    currency_code: "BHD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "18",
    sortname: "BD",
    country_code: "+880",
    country_name: "Bangladesh",
    country_flag: "bd.png",
    currency_code: "BDT",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "19",
    sortname: "BB",
    country_code: "+1",
    country_name: "Barbados",
    country_flag: "bb.png",
    currency_code: "BBD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "20",
    sortname: "BY",
    country_code: "+375",
    country_name: "Belarus",
    country_flag: "by.png",
    currency_code: "BYR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "21",
    sortname: "BE",
    country_code: "+32",
    country_name: "Belgium",
    country_flag: "be.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "22",
    sortname: "BZ",
    country_code: "+501",
    country_name: "Belize",
    country_flag: "bz.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "23",
    sortname: "BJ",
    country_code: "+229",
    country_name: "Benin",
    country_flag: "bj.png",
    currency_code: "XOF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "24",
    sortname: "BM",
    country_code: "+1",
    country_name: "Bermuda",
    country_flag: "bm.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "25",
    sortname: "BT",
    country_code: "+975",
    country_name: "Bhutan",
    country_flag: "bt.png",
    currency_code: "BTN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "26",
    sortname: "BO",
    country_code: "+591",
    country_name: "Bolivia",
    country_flag: "bo.png",
    currency_code: "BOB",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "27",
    sortname: "BA",
    country_code: "+387",
    country_name: "Bosnia and Herzegovina",
    country_flag: "ba.png",
    currency_code: "BAM",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "28",
    sortname: "BW",
    country_code: "+267",
    country_name: "Botswana",
    country_flag: "bw.png",
    currency_code: "BWP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "29",
    sortname: "BV",
    country_code: "+55",
    country_name: "Bouvet Island",
    country_flag: "bv.png",
    currency_code: "NOK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "30",
    sortname: "BR",
    country_code: "+55",
    country_name: "Brazil",
    country_flag: "br.png",
    currency_code: "BRL",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "31",
    sortname: "IO",
    country_code: "+246",
    country_name: "British Indian Ocean Territory",
    country_flag: "io.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "32",
    sortname: "BN",
    country_code: "+673",
    country_name: "Brunei",
    country_flag: "bn.png",
    currency_code: "BND",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "33",
    sortname: "BG",
    country_code: "+359",
    country_name: "Bulgaria",
    country_flag: "bg.png",
    currency_code: "BGN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "34",
    sortname: "BF",
    country_code: "+226",
    country_name: "Burkina Faso",
    country_flag: "bf.png",
    currency_code: "XOF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "35",
    sortname: "BI",
    country_code: "+257",
    country_name: "Burundi",
    country_flag: "bi.png",
    currency_code: "BIF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "36",
    sortname: "KH",
    country_code: "+855",
    country_name: "Cambodia",
    country_flag: "kh.png",
    currency_code: "KHR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "37",
    sortname: "CM",
    country_code: "+237",
    country_name: "Cameroon",
    country_flag: "cm.png",
    currency_code: "XAF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "38",
    sortname: "CA",
    country_code: "+1",
    country_name: "Canada",
    country_flag: "ca.png",
    currency_code: "CAD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "39",
    sortname: "CV",
    country_code: "+238",
    country_name: "Cape Verde",
    country_flag: "cv.png",
    currency_code: "CVE",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "40",
    sortname: "KY",
    country_code: "+1",
    country_name: "Cayman Islands",
    country_flag: "ky.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "41",
    sortname: "CF",
    country_code: "+236",
    country_name: "Central African Republic",
    country_flag: "cf.png",
    currency_code: "XAF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "42",
    sortname: "TD",
    country_code: "+235",
    country_name: "Chad",
    country_flag: "td.png",
    currency_code: "XAF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "43",
    sortname: "CL",
    country_code: "+56",
    country_name: "Chile",
    country_flag: "cl.png",
    currency_code: "CLP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "44",
    sortname: "CN",
    country_code: "+86",
    country_name: "China",
    country_flag: "cn.png",
    currency_code: "CNY",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "45",
    sortname: "CX",
    country_code: "+61",
    country_name: "Christmas Island",
    country_flag: "cx.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "46",
    sortname: "CC",
    country_code: "+891",
    country_name: "Cocos (Keeling) Islands",
    country_flag: "cc.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "47",
    sortname: "CO",
    country_code: "+57",
    country_name: "Colombia",
    country_flag: "co.png",
    currency_code: "COP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "48",
    sortname: "KM",
    country_code: "+269",
    country_name: "Comoros",
    country_flag: "km.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "49",
    sortname: "CG",
    country_code: "+242",
    country_name: "Congo",
    country_flag: "cg.png",
    currency_code: "XAF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "50",
    sortname: "CD",
    country_code: "+242",
    country_name: "Congo The Democratic Republic Of The",
    country_flag: "cd.png",
    currency_code: "CDF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "51",
    sortname: "CK",
    country_code: "+682",
    country_name: "Cook Islands",
    country_flag: "ck.png",
    currency_code: "NZD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "52",
    sortname: "CR",
    country_code: "+506",
    country_name: "Costa Rica",
    country_flag: "cr.png",
    currency_code: "CRC",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "53",
    sortname: "CI",
    country_code: "+225",
    country_name: "Cote D'Ivoire (Ivory Coast)",
    country_flag: "cl.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "54",
    sortname: "HR",
    country_code: "+385",
    country_name: "Croatia (Hrvatska)",
    country_flag: "hr.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "55",
    sortname: "CU",
    country_code: "+53",
    country_name: "Cuba",
    country_flag: "cu.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "56",
    sortname: "CY",
    country_code: "+357",
    country_name: "Cyprus",
    country_flag: "cy.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "57",
    sortname: "CZ",
    country_code: "+420",
    country_name: "Czech Republic",
    country_flag: "cz.png",
    currency_code: "CZK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "58",
    sortname: "DK",
    country_code: "+45",
    country_name: "Denmark",
    country_flag: "dk.png",
    currency_code: "DKK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "59",
    sortname: "DJ",
    country_code: "+253",
    country_name: "Djibouti",
    country_flag: "dj.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "60",
    sortname: "DM",
    country_code: "+1",
    country_name: "Dominica",
    country_flag: "dm.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "61",
    sortname: "DO",
    country_code: "+1",
    country_name: "Dominican Republic",
    country_flag: "do.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "62",
    sortname: "TP",
    country_code: "+670",
    country_name: "East Timor",
    country_flag: "tp.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "63",
    sortname: "EC",
    country_code: "+593",
    country_name: "Ecuador",
    country_flag: "ec.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "64",
    sortname: "EG",
    country_code: "+20",
    country_name: "Egypt",
    country_flag: "eg.png",
    currency_code: "EGP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "65",
    sortname: "SV",
    country_code: "+503",
    country_name: "El Salvador",
    country_flag: "sv.png",
    currency_code: "SVC",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "66",
    sortname: "GQ",
    country_code: "+240",
    country_name: "Equatorial Guinea",
    country_flag: "gq.png",
    currency_code: "XAF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "67",
    sortname: "ER",
    country_code: "+291",
    country_name: "Eritrea",
    country_flag: "er.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "68",
    sortname: "EE",
    country_code: "+372",
    country_name: "Estonia",
    country_flag: "ee.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "69",
    sortname: "ET",
    country_code: "+251",
    country_name: "Ethiopia",
    country_flag: "et.png",
    currency_code: "ETB",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "70",
    sortname: "XA",
    country_code: "+672",
    country_name: "External Territories of Australia",
    country_flag: "xa.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "71",
    sortname: "FK",
    country_code: "+500",
    country_name: "Falkland Islands",
    country_flag: "fk.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "72",
    sortname: "FO",
    country_code: "+298",
    country_name: "Faroe Islands",
    country_flag: "fo.png",
    currency_code: "DKK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "73",
    sortname: "FJ",
    country_code: "+679",
    country_name: "Fiji Islands",
    country_flag: "fj.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "74",
    sortname: "FI",
    country_code: "+358",
    country_name: "Finland",
    country_flag: "fi.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "75",
    sortname: "FR",
    country_code: "+33",
    country_name: "France",
    country_flag: "fr.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "76",
    sortname: "GF",
    country_code: "+594",
    country_name: "French Guiana",
    country_flag: "gf.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "77",
    sortname: "PF",
    country_code: "+689",
    country_name: "French Polynesia",
    country_flag: "pf.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "78",
    sortname: "TF",
    country_code: "+262",
    country_name: "French Southern Territories",
    country_flag: "tf.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "79",
    sortname: "GA",
    country_code: "+24",
    country_name: "Gabon",
    country_flag: "ga.png",
    currency_code: "XAF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "80",
    sortname: "GM",
    country_code: "+220",
    country_name: "Gambia The",
    country_flag: "gm.png",
    currency_code: "GMD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "81",
    sortname: "GE",
    country_code: "+995",
    country_name: "Georgia",
    country_flag: "ge.png",
    currency_code: "GEL",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "82",
    sortname: "DE",
    country_code: "+49",
    country_name: "Germany",
    country_flag: "de.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "83",
    sortname: "GH",
    country_code: "+233",
    country_name: "Ghana",
    country_flag: "gh.png",
    currency_code: "GHS",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "84",
    sortname: "GI",
    country_code: "+350",
    country_name: "Gibraltar",
    country_flag: "gi.png",
    currency_code: "GIP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "85",
    sortname: "GR",
    country_code: "+30",
    country_name: "Greece",
    country_flag: "gr.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "86",
    sortname: "GL",
    country_code: "+299",
    country_name: "Greenland",
    country_flag: "gl.png",
    currency_code: "DKK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "87",
    sortname: "GD",
    country_code: "+1",
    country_name: "Grenada",
    country_flag: "gd.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "88",
    sortname: "GP",
    country_code: "+590",
    country_name: "Guadeloupe",
    country_flag: "gp.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "89",
    sortname: "GU",
    country_code: "+1",
    country_name: "Guam",
    country_flag: "gu.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "90",
    sortname: "GT",
    country_code: "+502",
    country_name: "Guatemala",
    country_flag: "gt.png",
    currency_code: "QTQ",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "91",
    sortname: "XU",
    country_code: "+44-1481",
    country_name: "Guernsey and Alderney",
    country_flag: "xu.png",
    currency_code: "GGP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "92",
    sortname: "GN",
    country_code: "+224",
    country_name: "Guinea",
    country_flag: "gn.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "93",
    sortname: "GW",
    country_code: "+245",
    country_name: "Guinea-Bissau",
    country_flag: "gw.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "94",
    sortname: "GY",
    country_code: "+592",
    country_name: "Guyana",
    country_flag: "gu.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "95",
    sortname: "HT",
    country_code: "+509",
    country_name: "Haiti",
    country_flag: "ht.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "96",
    sortname: "HM",
    country_code: "+0",
    country_name: "Heard and McDonald Islands",
    country_flag: "hm.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "97",
    sortname: "HN",
    country_code: "+504",
    country_name: "Honduras",
    country_flag: "hn.png",
    currency_code: "HNL",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "98",
    sortname: "HK",
    country_code: "+852",
    country_name: "Hong Kong S.A.R.",
    country_flag: "hk.png",
    currency_code: "HKD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "99",
    sortname: "HU",
    country_code: "+36",
    country_name: "Hungary",
    country_flag: "hu.png",
    currency_code: "HUF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "100",
    sortname: "IS",
    country_code: "+354",
    country_name: "Iceland",
    country_flag: "is.png",
    currency_code: "ISK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "101",
    sortname: "IN",
    country_code: "+91",
    country_name: "India",
    country_flag: "in.png",
    currency_code: "INR",
    currency_image: "rupee.svg",
    currency_min_value: "71.00",
    currency_max_value: "74.00",
    active_status: "1",
    },
    {
    country_id: "102",
    sortname: "ID",
    country_code: "+62",
    country_name: "Indonesia",
    country_flag: "id.png",
    currency_code: "IDR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "103",
    sortname: "IR",
    country_code: "+98",
    country_name: "Iran",
    country_flag: "ir.png",
    currency_code: "IRR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "104",
    sortname: "IQ",
    country_code: "+964",
    country_name: "Iraq",
    country_flag: "iq.png",
    currency_code: "IQD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "105",
    sortname: "IE",
    country_code: "+353",
    country_name: "Ireland",
    country_flag: "ie.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "106",
    sortname: "IL",
    country_code: "+972",
    country_name: "Israel",
    country_flag: "il.png",
    currency_code: "ILS",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "107",
    sortname: "IT",
    country_code: "+39",
    country_name: "Italy",
    country_flag: "it.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "108",
    sortname: "JM",
    country_code: "+1",
    country_name: "Jamaica",
    country_flag: "jm.png",
    currency_code: "JMD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "109",
    sortname: "JP",
    country_code: "+81",
    country_name: "Japan",
    country_flag: "jp.png",
    currency_code: "JPY",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "110",
    sortname: "XJ",
    country_code: "+44",
    country_name: "Jersey",
    country_flag: "xj.png",
    currency_code: "GBP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "111",
    sortname: "JO",
    country_code: "+962",
    country_name: "Jordan",
    country_flag: "jo.png",
    currency_code: "JOD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "112",
    sortname: "KZ",
    country_code: "+7",
    country_name: "Kazakhstan",
    country_flag: "kz.png",
    currency_code: "KZT",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "113",
    sortname: "KE",
    country_code: "+254",
    country_name: "Kenya",
    country_flag: "ke.png",
    currency_code: "KES",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "114",
    sortname: "KI",
    country_code: "+686",
    country_name: "Kiribati",
    country_flag: "ki.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "115",
    sortname: "KP",
    country_code: "+850",
    country_name: "Korea North",
    country_flag: "kp.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "116",
    sortname: "KR",
    country_code: "+82",
    country_name: "Korea South",
    country_flag: "kr.png",
    currency_code: "KRW",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "117",
    sortname: "KW",
    country_code: "+965",
    country_name: "Kuwait",
    country_flag: "kw.png",
    currency_code: "KWD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "118",
    sortname: "KG",
    country_code: "+996",
    country_name: "Kyrgyzstan",
    country_flag: "kg.png",
    currency_code: "KGS",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "119",
    sortname: "LA",
    country_code: "+856",
    country_name: "Laos",
    country_flag: "la.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "120",
    sortname: "LV",
    country_code: "+371",
    country_name: "Latvia",
    country_flag: "lv.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "121",
    sortname: "LB",
    country_code: "+961",
    country_name: "Lebanon",
    country_flag: "lb.png",
    currency_code: "LBP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "122",
    sortname: "LS",
    country_code: "+266",
    country_name: "Lesotho",
    country_flag: "ls.png",
    currency_code: "LSL",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "123",
    sortname: "LR",
    country_code: "+231",
    country_name: "Liberia",
    country_flag: "lr.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "124",
    sortname: "LY",
    country_code: "+218",
    country_name: "Libya",
    country_flag: "ly.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "125",
    sortname: "LI",
    country_code: "+423",
    country_name: "Liechtenstein",
    country_flag: "li.png",
    currency_code: "CHF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "126",
    sortname: "LT",
    country_code: "+370",
    country_name: "Lithuania",
    country_flag: "lt.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "127",
    sortname: "LU",
    country_code: "+352",
    country_name: "Luxembourg",
    country_flag: "lu.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "128",
    sortname: "MO",
    country_code: "+853",
    country_name: "Macau S.A.R.",
    country_flag: "mo.png",
    currency_code: "MOP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "129",
    sortname: "MK",
    country_code: "+389",
    country_name: "Macedonia",
    country_flag: "mk.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "130",
    sortname: "MG",
    country_code: "+261",
    country_name: "Madagascar",
    country_flag: "mg.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "131",
    sortname: "MW",
    country_code: "+265",
    country_name: "Malawi",
    country_flag: "mw.png",
    currency_code: "MWK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "132",
    sortname: "MY",
    country_code: "+60",
    country_name: "Malaysia",
    country_flag: "my.png",
    currency_code: "MYR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "133",
    sortname: "MV",
    country_code: "+960",
    country_name: "Maldives",
    country_flag: "mv.png",
    currency_code: "MVR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "134",
    sortname: "ML",
    country_code: "+223",
    country_name: "Mali",
    country_flag: "ml.png",
    currency_code: "XOF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "135",
    sortname: "MT",
    country_code: "+356",
    country_name: "Malta",
    country_flag: "mt.png",
    currency_code: "EUR",
    currency_image: "eur.svg",
    currency_min_value: "0.88",
    currency_max_value: "0.92",
    active_status: "1",
    },
    {
    country_id: "136",
    sortname: "XM",
    country_code: "+44",
    country_name: "Man (Isle of)",
    country_flag: "xm.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "137",
    sortname: "MH",
    country_code: "+692",
    country_name: "Marshall Islands",
    country_flag: "mh.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "138",
    sortname: "MQ",
    country_code: "+596",
    country_name: "Martinique",
    country_flag: "mq.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "139",
    sortname: "MR",
    country_code: "+222",
    country_name: "Mauritania",
    country_flag: "mr.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "140",
    sortname: "MU",
    country_code: "+230",
    country_name: "Mauritius",
    country_flag: "mu.png",
    currency_code: "MUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "141",
    sortname: "YT",
    country_code: "+262",
    country_name: "Mayotte",
    country_flag: "yt.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "142",
    sortname: "MX",
    country_code: "+52",
    country_name: "Mexico",
    country_flag: "mx.png",
    currency_code: "MXN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "143",
    sortname: "FM",
    country_code: "+691",
    country_name: "Micronesia",
    country_flag: "fm.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "144",
    sortname: "MD",
    country_code: "+373",
    country_name: "Moldova",
    country_flag: "md.png",
    currency_code: "MDL",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "145",
    sortname: "MC",
    country_code: "+377",
    country_name: "Monaco",
    country_flag: "mc.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "146",
    sortname: "MN",
    country_code: "+976",
    country_name: "Mongolia",
    country_flag: "mn.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "147",
    sortname: "MS",
    country_code: "+1",
    country_name: "Montserrat",
    country_flag: "ms.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "148",
    sortname: "MA",
    country_code: "+212",
    country_name: "Morocco",
    country_flag: "ma.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "149",
    sortname: "MZ",
    country_code: "+258",
    country_name: "Mozambique",
    country_flag: "mz.png",
    currency_code: "MZN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "150",
    sortname: "MM",
    country_code: "+95",
    country_name: "Myanmar",
    country_flag: "mm.png",
    currency_code: "MMK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "151",
    sortname: "NA",
    country_code: "+264",
    country_name: "Namibia",
    country_flag: "na.png",
    currency_code: "NAD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "152",
    sortname: "NR",
    country_code: "+674",
    country_name: "Nauru",
    country_flag: "nr.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "153",
    sortname: "NP",
    country_code: "+977",
    country_name: "Nepal",
    country_flag: "np.png",
    currency_code: "NPR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "154",
    sortname: "AN",
    country_code: "+599",
    country_name: "Netherlands Antilles",
    country_flag: "an.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "155",
    sortname: "NL",
    country_code: "+31",
    country_name: "Netherlands The",
    country_flag: "nl.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "156",
    sortname: "NC",
    country_code: "+687",
    country_name: "New Caledonia",
    country_flag: "nc.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "157",
    sortname: "NZ",
    country_code: "+64",
    country_name: "New Zealand",
    country_flag: "nz.png",
    currency_code: "NZD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "158",
    sortname: "NI",
    country_code: "+505",
    country_name: "Nicaragua",
    country_flag: "ni.png",
    currency_code: "NIO",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "159",
    sortname: "NE",
    country_code: "+227",
    country_name: "Niger",
    country_flag: "ne.png",
    currency_code: "XOF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "160",
    sortname: "NG",
    country_code: "+234",
    country_name: "Nigeria",
    country_flag: "ng.png",
    currency_code: "NGN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "161",
    sortname: "NU",
    country_code: "+683",
    country_name: "Niue",
    country_flag: "nu.png",
    currency_code: "NZD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "162",
    sortname: "NF",
    country_code: "+672",
    country_name: "Norfolk Island",
    country_flag: "nf.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "163",
    sortname: "MP",
    country_code: "+1-670",
    country_name: "Northern Mariana Islands",
    country_flag: "mp.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "164",
    sortname: "NO",
    country_code: "+47",
    country_name: "Norway",
    country_flag: "no.png",
    currency_code: "NOK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "165",
    sortname: "OM",
    country_code: "+968",
    country_name: "Oman",
    country_flag: "om.png",
    currency_code: "OMR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "166",
    sortname: "PK",
    country_code: "+92",
    country_name: "Pakistan",
    country_flag: "pk.png",
    currency_code: "PKR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "167",
    sortname: "PW",
    country_code: "+680",
    country_name: "Palau",
    country_flag: "pw.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "168",
    sortname: "PS",
    country_code: "+970",
    country_name: "Palestinian Territory Occupied",
    country_flag: "ps.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "169",
    sortname: "PA",
    country_code: "+507",
    country_name: "Panama",
    country_flag: "pa.png",
    currency_code: "PAB",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "170",
    sortname: "PG",
    country_code: "+675",
    country_name: "Papua new Guinea",
    country_flag: "pg.png",
    currency_code: "PGK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "171",
    sortname: "PY",
    country_code: "+595",
    country_name: "Paraguay",
    country_flag: "py.png",
    currency_code: "PYG",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "172",
    sortname: "PE",
    country_code: "+51",
    country_name: "Peru",
    country_flag: "pe.png",
    currency_code: "PEN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "173",
    sortname: "PH",
    country_code: "+63",
    country_name: "Philippines",
    country_flag: "ph.png",
    currency_code: "PHP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "174",
    sortname: "PN",
    country_code: "+64",
    country_name: "Pitcairn Island",
    country_flag: "pn.png",
    currency_code: "NZD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "175",
    sortname: "PL",
    country_code: "+48",
    country_name: "Poland",
    country_flag: "pl.png",
    currency_code: "PLN",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "176",
    sortname: "PT",
    country_code: "+351",
    country_name: "Portugal",
    country_flag: "pt.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "177",
    sortname: "PR",
    country_code: "+1",
    country_name: "Puerto Rico",
    country_flag: "pr.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "178",
    sortname: "QA",
    country_code: "+974",
    country_name: "Qatar",
    country_flag: "qa.png",
    currency_code: "QAR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "179",
    sortname: "RE",
    country_code: "+262",
    country_name: "Reunion",
    country_flag: "re.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "180",
    sortname: "RO",
    country_code: "+40",
    country_name: "Romania",
    country_flag: "ro.png",
    currency_code: "RON",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "181",
    sortname: "RU",
    country_code: "+7",
    country_name: "Russia",
    country_flag: "ru.png",
    currency_code: "RUB",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "182",
    sortname: "RW",
    country_code: "+250",
    country_name: "Rwanda",
    country_flag: "rw.png",
    currency_code: "RWF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "183",
    sortname: "SH",
    country_code: "+290",
    country_name: "Saint Helena",
    country_flag: "sh.png",
    currency_code: "SHP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "184",
    sortname: "KN",
    country_code: "+1 869",
    country_name: "Saint Kitts And Nevis",
    country_flag: "kn.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "185",
    sortname: "LC",
    country_code: "+1 758",
    country_name: "Saint Lucia",
    country_flag: "lc.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "186",
    sortname: "PM",
    country_code: "+508",
    country_name: "Saint Pierre and Miquelon",
    country_flag: "pm.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "187",
    sortname: "VC",
    country_code: "+1",
    country_name: "Saint Vincent And The Grenadines",
    country_flag: "vc.png",
    currency_code: "XCD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "188",
    sortname: "WS",
    country_code: "+1",
    country_name: "Samoa",
    country_flag: "ws.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "189",
    sortname: "SM",
    country_code: "+378",
    country_name: "San Marino",
    country_flag: "sm.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "190",
    sortname: "ST",
    country_code: "+239",
    country_name: "Sao Tome and Principe",
    country_flag: "st.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "191",
    sortname: "SA",
    country_code: "+966",
    country_name: "Saudi Arabia",
    country_flag: "sa.png",
    currency_code: "SAR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "192",
    sortname: "SN",
    country_code: "+221",
    country_name: "Senegal",
    country_flag: "sn.png",
    currency_code: "XOF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "193",
    sortname: "RS",
    country_code: "+381",
    country_name: "Serbia",
    country_flag: "rs.png",
    currency_code: "RSD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "194",
    sortname: "SC",
    country_code: "+248",
    country_name: "Seychelles",
    country_flag: "sc.png",
    currency_code: "SCR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "195",
    sortname: "SL",
    country_code: "+232",
    country_name: "Sierra Leone",
    country_flag: "sl.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "196",
    sortname: "SG",
    country_code: "+65",
    country_name: "Singapore",
    country_flag: "sg.png",
    currency_code: "SGD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "197",
    sortname: "SK",
    country_code: "+421",
    country_name: "Slovakia",
    country_flag: "sk.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "198",
    sortname: "SI",
    country_code: "+386",
    country_name: "Slovenia",
    country_flag: "sl.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "199",
    sortname: "XG",
    country_code: "+44",
    country_name: "Smaller Territories of the UK",
    country_flag: "xg.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "200",
    sortname: "SB",
    country_code: "+677",
    country_name: "Solomon Islands",
    country_flag: "sb.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "201",
    sortname: "SO",
    country_code: "+252",
    country_name: "Somalia",
    country_flag: "so.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "202",
    sortname: "ZA",
    country_code: "+27",
    country_name: "South Africa",
    country_flag: "za.png",
    currency_code: "ZAR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "203",
    sortname: "GS",
    country_code: "+995",
    country_name: "South Georgia",
    country_flag: "gs.png",
    currency_code: "GBP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "204",
    sortname: "SS",
    country_code: "+211",
    country_name: "South Sudan",
    country_flag: "ss.png",
    currency_code: "SSP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "205",
    sortname: "ES",
    country_code: "+34",
    country_name: "Spain",
    country_flag: "es.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "206",
    sortname: "LK",
    country_code: "+94",
    country_name: "Sri Lanka",
    country_flag: "lk.png",
    currency_code: "LKR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "207",
    sortname: "SD",
    country_code: "+249",
    country_name: "Sudan",
    country_flag: "sd.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "208",
    sortname: "SR",
    country_code: "+597",
    country_name: "Suriname",
    country_flag: "sr.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "209",
    sortname: "SJ",
    country_code: "+47",
    country_name: "Svalbard And Jan Mayen Islands",
    country_flag: "sj.png",
    currency_code: "NOK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "210",
    sortname: "SZ",
    country_code: "+268",
    country_name: "Swaziland",
    country_flag: "sz.png",
    currency_code: "SZL",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "211",
    sortname: "SE",
    country_code: "+46",
    country_name: "Sweden",
    country_flag: "se.png",
    currency_code: "SEK",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "212",
    sortname: "CH",
    country_code: "+268",
    country_name: "Switzerland",
    country_flag: "ch.png",
    currency_code: "CHF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "213",
    sortname: "SY",
    country_code: "+46",
    country_name: "Syria",
    country_flag: "sy.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "214",
    sortname: "TW",
    country_code: "+886",
    country_name: "Taiwan",
    country_flag: "tw.png",
    currency_code: "TWD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "215",
    sortname: "TJ",
    country_code: "+992",
    country_name: "Tajikistan",
    country_flag: "tj.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "216",
    sortname: "TZ",
    country_code: "+255",
    country_name: "Tanzania",
    country_flag: "tz.png",
    currency_code: "TZS",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "217",
    sortname: "TH",
    country_code: "+66",
    country_name: "Thailand",
    country_flag: "th.png",
    currency_code: "THB",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "218",
    sortname: "TG",
    country_code: "+228",
    country_name: "Togo",
    country_flag: "tg.png",
    currency_code: "XOF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "219",
    sortname: "TK",
    country_code: "+690",
    country_name: "Tokelau",
    country_flag: "tk.png",
    currency_code: "NZD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "220",
    sortname: "TO",
    country_code: "+676",
    country_name: "Tonga",
    country_flag: "to.png",
    currency_code: "TOP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "221",
    sortname: "TT",
    country_code: "+1",
    country_name: "Trinidad And Tobago",
    country_flag: "tt.png",
    currency_code: "TTD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "222",
    sortname: "TN",
    country_code: "+216",
    country_name: "Tunisia",
    country_flag: "tn.png",
    currency_code: "TND",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "223",
    sortname: "TR",
    country_code: "+90",
    country_name: "Turkey",
    country_flag: "tr.png",
    currency_code: "TRY",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "224",
    sortname: "TM",
    country_code: "+993",
    country_name: "Turkmenistan",
    country_flag: "tm.png",
    currency_code: "TMT",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "225",
    sortname: "TC",
    country_code: "+1",
    country_name: "Turks And Caicos Islands",
    country_flag: "tc.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "226",
    sortname: "TV",
    country_code: "+688",
    country_name: "Tuvalu",
    country_flag: "tv.png",
    currency_code: "AUD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "227",
    sortname: "UG",
    country_code: "+256",
    country_name: "Uganda",
    country_flag: "ug.png",
    currency_code: "UGX",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "228",
    sortname: "UA",
    country_code: "+380",
    country_name: "Ukraine",
    country_flag: "ua.png",
    currency_code: "UAH",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "229",
    sortname: "AE",
    country_code: "+971",
    country_name: "United Arab Emirates",
    country_flag: "ae.png",
    currency_code: "AED",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "230",
    sortname: "GB",
    country_code: "+44",
    country_name: "United Kingdom",
    country_flag: "gb.png",
    currency_code: "GBP",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "231",
    sortname: "US",
    country_code: "+1",
    country_name: "United States",
    country_flag: "us.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "232",
    sortname: "UM",
    country_code: "+1",
    country_name: "United States Minor Outlying Islands",
    country_flag: "um.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "233",
    sortname: "UY",
    country_code: "+598",
    country_name: "Uruguay",
    country_flag: "uy.png",
    currency_code: "UYU",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "234",
    sortname: "UZ",
    country_code: "+998",
    country_name: "Uzbekistan",
    country_flag: "uz.png",
    currency_code: "UZS",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "235",
    sortname: "VU",
    country_code: "+678",
    country_name: "Vanuatu",
    country_flag: "vu.png",
    currency_code: "VUV",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "236",
    sortname: "VA",
    country_code: "+39",
    country_name: "Vatican City State (Holy See)",
    country_flag: "va.png",
    currency_code: "EUR",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "237",
    sortname: "VE",
    country_code: "+58",
    country_name: "Venezuela",
    country_flag: "ve.png",
    currency_code: "VEF",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "238",
    sortname: "VN",
    country_code: "+84",
    country_name: "Vietnam",
    country_flag: "vn.png",
    currency_code: "VND",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "239",
    sortname: "VG",
    country_code: "+1",
    country_name: "Virgin Islands (British)",
    country_flag: "vg.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "240",
    sortname: "VI",
    country_code: "+1",
    country_name: "Virgin Islands (US)",
    country_flag: "vi.png",
    currency_code: "USD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "241",
    sortname: "WF",
    country_code: "+681",
    country_name: "Wallis And Futuna Islands",
    country_flag: "wf.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "242",
    sortname: "EH",
    country_code: "+212",
    country_name: "Western Sahara",
    country_flag: "eh.png",
    currency_code: "MAD",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "243",
    sortname: "YE",
    country_code: "+967",
    country_name: "Yemen",
    country_flag: "ye.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "244",
    sortname: "YU",
    country_code: "+38",
    country_name: "Yugoslavia",
    country_flag: "yu.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "245",
    sortname: "ZM",
    country_code: "+260",
    country_name: "Zambia",
    country_flag: "zm.png",
    currency_code: "ZMW",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
    {
    country_id: "246",
    sortname: "ZW",
    country_code: "+263",
    country_name: "Zimbabwe",
    country_flag: "zw.png",
    currency_code: "",
    currency_image: "",
    currency_min_value: "0.00",
    currency_max_value: "0.00",
    active_status: "0",
    },
  ]
  