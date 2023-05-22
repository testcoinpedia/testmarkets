import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';
import Chart from '../components/lightWeightChart'



export default function Demo() {

    const chartContainerRef = useRef()


    useEffect(() => {

        const initialData = [
            { time:  1556877600 , value: 19103293.0 },
            { time:  1556877700 , value: 21737523.0 },
            { time:  1556877800 , value: 29328713.0 },
            { time:  1556877900 , value: 37435638.0 },
            { time:  1556878000 , value: 25269995.0 },
            { time:  1556878100 , value: 24973311.0 },
            { time:  1556878200 , value: 22103692.0 },
            { time:  1556878300 , value: 25231199.0 },
            { time:  1556878400 , value: 24214427.0 },
            { time:  1683714840 , value: 22533201.0 },
            // { time: "2018-11-02", value: 14734412.0 },
            // { time: "2018-11-05", value: 12733842.0 },
            // { time: "2018-11-06", value: 12371207.0 },
            // { time: "2018-11-07", value: 14891287.0 },
            // { time: "2018-11-08", value: 12482392.0 },
            // { time: "2018-11-09", value: 17365762.0 },
            // { time: "2018-11-12", value: 13236769.0 },
            // { time: "2018-11-13", value: 13047907.0 },
            // { time: "2018-11-14", value: 18288710.0 },
            // { time: "2018-11-15", value: 17147123.0 },
            // { time: "2018-11-16", value: 19470986.0 },
            // { time: "2018-11-19", value: 18405731.0 },
            // { time: "2018-11-20", value: 22028957.0 },
            // { time: "2018-11-21", value: 18482233.0 },
            // { time: "2018-11-23", value: 7009050.0 },
            // { time: "2018-11-26", value: 12308876.0 },
            // { time: "2018-11-27", value: 14118867.0 },
            // { time: "2018-11-28", value: 18662989.0 },
            // { time: "2018-11-29", value: 14763658.0 },
            // { time: "2018-11-30", value: 31142818.0 },
            // { time: "2018-12-03", value: 27795428.0 },
            // { time: "2018-12-04", value: 21727411.0 },
            // { time: "2018-12-06", value: 26880429.0 },
            // { time: "2018-12-07", value: 16948126.0 },
            // { time: "2018-12-10", value: 16603356.0 },
            // { time: "2018-12-11", value: 14991438.0 },
            // { time: "2018-12-12", value: 18892182.0 },
            // { time: "2018-12-13", value: 15454706.0 },
            // { time: "2018-12-14", value: 13960870.0 },
            // { time: "2018-12-17", value: 18902523.0 },
            // { time: "2018-12-18", value: 18895777.0 },
            // { time: "2018-12-19", value: 20968473.0 },
            // { time: "2018-12-20", value: 26897008.0 },
            // { time: "2018-12-21", value: 55413082.0 },
            // { time: "2018-12-24", value: 15077207.0 },
            // { time: "2018-12-26", value: 17970539.0 },
            // { time: "2018-12-27", value: 17530977.0 },
            // { time: "2018-12-28", value: 14771641.0 },
            // { time: "2018-12-31", value: 15331758.0 },
            // { time: "2019-01-02", value: 13969691.0 },
            // { time: "2019-01-03", value: 19245411.0 },
            // { time: "2019-01-04", value: 17035848.0 },
            // { time: "2019-01-07", value: 16348982.0 },
            // { time: "2019-01-08", value: 21425008.0 },
            // { time: "2019-01-09", value: 18136000.0 },
            // { time: "2019-01-10", value: 14259910.0 },
            // { time: "2019-01-11", value: 15801548.0 },
            // { time: "2019-01-14", value: 11342293.0 },
            // { time: "2019-01-15", value: 10074386.0 },
            // { time: "2019-01-16", value: 13411691.0 },
            // { time: "2019-01-17", value: 15223854.0 },
            // { time: "2019-01-18", value: 16802516.0 },
            // { time: "2019-01-22", value: 18284771.0 },
        ];

        console.log("initialData",initialData)
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: "white" },
            },
            width: 1000,
            height: 400,
        })

        chart.applyOptions({
            leftPriceScale: {
                visible: true,
                // borderVisible: false,
            },
            rightPriceScale: {
                visible: false,
            },

            // hide the grid lines
            grid: {
                vertLines: {
                    visible: false,
                },

            },
            timeScale: {
            timeVisible: true,
            secondsVisible: false,
            },
        })

        const baselineSeries = chart.addBaselineSeries({
            baseValue: { type: 'price', price: 22533201 },
            topLineColor: 'rgba( 38, 166, 154, 1)', topFillColor1: 'rgba( 38, 166, 154, 0.68)',
            topFillColor2: 'rgba( 38, 166, 154, 0.05)', bottomLineColor: 'rgba( 239, 83, 80, 1)',
            bottomFillColor1: 'rgba( 239, 83, 80, 0.05)', bottomFillColor2: 'rgba( 239, 83, 80, 0.68)'
        });
        baselineSeries.setData(initialData)
        chart.timeScale().fitContent();

        chart.priceScale("left").applyOptions({
            borderColor: '#ccc4c4 ',

        });

        chart.timeScale().applyOptions({
            borderColor: '#ccc4c4',
        });

        window.addEventListener('resize', () => {
            chart.resize(window.innerWidth, window.innerHeight);
        });


        console.log("chartContainerRef", chart)
        const toolTipWidth = 80;
        const toolTipHeight = 80;
        const toolTipMargin = 15;

        // Create and style the tooltip html element
        const toolTip = document.createElement('div');
        toolTip.style = `width: 206px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
        toolTip.style.background = `white`;
        toolTip.style.color = 'black';
        toolTip.style.borderColor = 'white';
        chartContainerRef.current.appendChild(toolTip);

        // update tooltip
        chart.subscribeCrosshairMove(param => {
            if (
                param.point === undefined ||
                !param.time ||
                param.point.x < 0 ||
                param.point.x > chartContainerRef.current.clientWidth ||
                param.point.y < 0 ||
                param.point.y > chartContainerRef.current.clientHeight
            ) {
                toolTip.style.display = 'none';
            } else {
                // time will be in the same format that we supplied to setData.
                // thus it will be YYYY-MM-DD
                const dateStr = param.time;
                toolTip.style.display = 'block';
                const data = param.seriesData.get(baselineSeries);
                const price = data.value !== undefined ? data.value : data.close;
                toolTip.innerHTML = `<div style="color: ${'rgba( 38, 166, 154, 1)'}">ABC Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
            ${Math.round(100 * price) / 100}
            </div><div style="color: ${'black'}">
            ${dateStr}
            </div>`;

                const y = param.point.y;
                let left = param.point.x + toolTipMargin;
                if (left > chartContainerRef.current.clientWidth - toolTipWidth) {
                    left = param.point.x - toolTipMargin - toolTipWidth;
                }

                let top = y + toolTipMargin;
                if (top > chartContainerRef.current.clientHeight - toolTipHeight) {
                    top = y - toolTipHeight - toolTipMargin;
                }
                toolTip.style.left = left + 'px';
                toolTip.style.top = top + 'px';
            }
        });
        return () => [chart.remove()]


    }, [])
    return (
        <>
            <div ref={chartContainerRef}>

            </div>
            {/* <Chart  /> */}
        </>

    );

}