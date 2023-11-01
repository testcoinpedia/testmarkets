import { useState, useEffect } from 'react';
import dynamic from "next/dynamic";
const ReactSpeedometer = dynamic(() => import('react-d3-speedometer'), { ssr: false });


const Speedometer = () => {
  const speedValue = 30;
  const [ringColor, setRingColor] = useState('#E0E3EB');

  useEffect(() => {
    if (speedValue < 30) {
      setRingColor('#B44075');
    } else if (speedValue < 50) {
      setRingColor('#B44075');
    } else if (speedValue < 70) {
      setRingColor('#B44075');
    } else if (speedValue < 90) {
      setRingColor('#E0E3EB');
    } else {
      setRingColor('#E0E3EB');
    }
  }, [speedValue]);

  const customNeedlePath = `M 0 -20 L 20 0 L 0 20 L -20 0 Z`; // Custom SVG path for needle

  return (
    <div style={{ textAlign: 'center' }}>
      <div className='Speedometer row'>
      <div className='left'>
      <h2>Oscillators</h2>
      <ReactSpeedometer
        currentValueText="Neutral"
        textColor={'#000'}
        value={speedValue}
        minValue={0}
        maxValue={100}
        needleColor="#131721"
        startColor={ringColor}
        segments={5}
        endColor="red"
        needleHeightRatio={0.7}
        segmentWidth={15}
        segmentLength={10}
        ringWidth={10}
        segmentColors={[
          '#C13D6A',
          '#C13D6A',
          '#C13D6A',
          '#E0E3EB',
          '#E0E3EB',
        ]}
        customSegmentLabels={[
          {
            text: 'Strong sell',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Sell',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Neutral',
            position: 'OUTSIDE',
            color: '#000',
          },
          {
            text: 'Buy',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Strong Buy',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
        ]}
        needleTransition
        needleTransitionDuration={500}
        needleTransitionEasing="easeElastic"
        needleTransitionDelay={0}
        customNeedle={customNeedlePath}
      />
      {/* <div className='Speedometer1'> 
      <h4>Sell </h4>
      <h4>Neutral</h4>
      <h4>Buy</h4>
      </div>
      <div className=''> 
      <h4>1 </h4>
      <h4>9</h4>
      <h4>6</h4>
      </div> */}
     
      </div>
      <div className='mid'>
      <h2>Summary</h2>
      <ReactSpeedometer
        currentValueText="Sell"
        textColor={'#DC3F52'}
        value={speedValue}
        minValue={0}
        maxValue={100}
        needleColor="#131721"
        startColor={ringColor}
        segments={5}
        endColor="red"
        needleHeightRatio={0.7}
        segmentWidth={15}
        segmentLength={10}
        ringWidth={10}
        segmentColors={[
          '#C13D6A',
          '#C13D6A',
          '#C13D6A',
          '#E0E3EB',
          '#E0E3EB',
        ]}
        customSegmentLabels={[
          {
            text: 'Strong sell',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Sell',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Neutral',
            position: 'OUTSIDE',
            color: '#000',
          },
          {
            text: 'Buy',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Strong Buy',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
        ]}
        needleTransition
        needleTransitionDuration={500}
        needleTransitionEasing="easeElastic"
        needleTransitionDelay={0}
        customNeedle={customNeedlePath}
      />
      </div>
      <div className='right'>
      <h2>Moving Average</h2>
      <ReactSpeedometer
        currentValueText="Strong Sell"
        textColor={'#DC3F52'}
        value={speedValue}
        minValue={0}
        maxValue={100}
        needleColor="#131721"
        startColor={ringColor}
        segments={5}
        endColor="red"
        needleHeightRatio={0.7}
        segmentWidth={15}
        segmentLength={10}
        ringWidth={10}
        segmentColors={[
          '#C13D6A',
          '#C13D6A',
          '#C13D6A',
          '#E0E3EB',
          '#E0E3EB',
        ]}
        customSegmentLabels={[
          {
            text: 'Strong sell',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Sell',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Neutral',
            position: 'OUTSIDE',
            color: '#000',
          },
          {
            text: 'Buy',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
          {
            text: 'Strong Buy',
            position: 'OUTSIDE',
            color: '#E0E3EB',
          },
        ]}
        needleTransition
        needleTransitionDuration={500}
        needleTransitionEasing="easeElastic"
        needleTransitionDelay={0}
        customNeedle={customNeedlePath}
      />
      </div>
      </div>
     
    </div>
  );
};

export default Speedometer;