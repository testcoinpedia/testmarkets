


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