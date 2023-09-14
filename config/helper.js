


export  const roundNumericValue=(value) =>
{
  var return_value = 0
  
  if(value)
  {
    if(parseFloat(value) >= 0.1)
    {
      return_value = parseFloat((parseFloat(value)).toFixed(2))
    }
    else if((parseFloat(value) < 0.1) && (parseFloat(value) >= 0.01))
    {
      return_value = (parseFloat(value)).toFixed(3)
    }
    else if((parseFloat(value) < 0.01) && (parseFloat(value) >= 0.001))
    {
      return_value = (parseFloat(value)).toFixed(4)
    }
    else if((parseFloat(value) < 0.001) && (parseFloat(value) > 0.0001))
    {
      return_value = (parseFloat(value)).toFixed(5)
    }
    else if((parseFloat(value) < 0.0001) && (parseFloat(value) > 0.00001))
    {
      return_value = (parseFloat(value)).toFixed(6)
    }
    else if((parseFloat(value) < 0.00001) && (parseFloat(value) > 0.000001))
    {
      return_value = (parseFloat(value)).toFixed(7)
    }
    else if((parseFloat(value) < 0.000001) && (parseFloat(value) > 0.0000001))
    {
      return_value = (parseFloat(value)).toFixed(8)
    }
    else if((parseFloat(value) < 0.0000001) && (parseFloat(value) > 0.00000001))
    {
      return_value = (parseFloat(value)).toFixed(9)
    }
    else if((parseFloat(value) < 0.00000001) && (parseFloat(value) > 0.000000001))
    {
      return_value = (parseFloat(value)).toFixed(11)
    }
    else if((parseFloat(value) < 0.000000001) && (parseFloat(value) > 0.0000000001))
    {
      return_value = (parseFloat(value)).toFixed(12)
    }
    else
    {
      return_value = ((parseFloat(value)).toFixed(13))
    }
  }
  else
  {
    return_value = 0
  }
  return return_value
}
 
//type 1:USD
export const USDFormatValue=(value, type)=>
{
  if(parseFloat(value))
  {
    if(type == 1)
    {
      return (roundNumericValue(value)).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      })
    }
    else
    {
      return new Intl.NumberFormat().format(roundNumericValue(value))
    }
  }
  else
  {
    return ""
  }
  
  
}

export const getLaunchpadType = (launchpad_type) =>
{
  var newArray = launchpads_types_list.filter(function (el) {
    return el._id == launchpad_type
  })
  return newArray[0]?.type_name
}

export const launchpads_types_list = [
  {
    _id:1,
    type_name:"ICO"
  },
  {
    _id:2,
    type_name:"IDO"
  },
  {
    _id:3,
    type_name:"IEO"
  },
  {
    _id:4,
    type_name:"IGO"
  },
  {
    _id:5,
    type_name:"Presale"
  },
  {
    _id:6,
    type_name:"Private Sale"
  },
  {
    _id:7,
    type_name:"Seed Sale"
  }
]