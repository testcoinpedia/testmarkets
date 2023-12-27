import { useState, useEffect, useRef } from "react";
// import AnimatedNumberTicker from "./ticker";

export default function Index({endValue})
{
  const [nextNumber, setNextNumber] = useState(endValue)
  const intervalRef = useRef();
  const prevNumber = useRef();


  const startInterval = () => {
    intervalRef.current =  getRandomNumber();

      setNextNumber((prev) => {
        // We need this to get the previous state value
        // Has to do with the fact that this is within a setInterval
        prevNumber.current = prev;
        return intervalRef.current;
      });
  };

  
  return (
    <>
    asd
    </>
  )
}