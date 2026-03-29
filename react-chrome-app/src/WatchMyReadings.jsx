import React, { useEffect, useState } from "react";
import './colors.css';

export default function WatchMyReadings() {
    const [readings, setReadings] = useState([]);
    const [index, setIndex] = useState(1);
    const [readInterval, setReadInterval] = useState(15);
    const [percentage, setPercentage] = useState(0.8);
    const [alignment, setAlignment] = useState('right');
    const [width, setWidth] = useState(200);

    useEffect(() => {
        const interval = setInterval(() => {
            let value = document.getElementsByClassName("lpu38Pri")[0]?.innerText.replaceAll("₹", '').replaceAll(",", '');
            if (value !== null && value !== "" && value !== undefined) {

                //Read from 58 second and continue till 13 second for every minute and reset for each minute.
                if (readings.length === 0) {
                    setReadings([
                        ...readings,
                        { id: index, changeVal: parseFloat(value), changeTime: new Date(), alert: false, type: 'neutral' }
                    ]);
                }
                else {
                    let prevVal = readings[0].changeVal;
                    let lastVal = readings.at(-1).changeVal;
                    let changePercentFromMin = ((parseFloat(value) - prevVal) / prevVal) * 100;
                    let absChange = Math.abs(changePercentFromMin);
                    let isAlert = absChange > percentage;
                    let changePercentFromLast = ((parseFloat(value) - lastVal) / lastVal) * 100;
                    let type = absChange > percentage ? (changePercentFromMin > 0 ? 'increase' : 'decrease') : 'neutral';
                    if (readings.at(-1)?.changeTime.getSeconds() < 15 || readings.at(-1)?.changeTime.getSeconds() > 57) {
                        setReadings([
                            ...readings,
                            { id: index, changeVal: parseFloat(value), changeTime: new Date(), alert: isAlert, type: type }
                        ]);
                    }
                    if (['increase', 'decrease'].includes(readings.at(-1)?.type)) {
                        console.log(`Alert triggered at ${new Date().toLocaleTimeString()} with value ${value} and change percentage from min ${changePercentFromMin.toFixed(2)}% and change percentage from last ${changePercentFromLast.toFixed(2)}%`);
                        fetch("http://localhost:60986/api/values")
                            .then((res) => res.json())
                            .then((json) => {
                                alert(JSON.stringify(json))
                            });
                    }
                    if (readings.at(-1)?.changeTime.getSeconds() > 14 && readings.at(-1)?.changeTime.getSeconds() < 58) {
                        setReadings([]);
                    }
                }
                setIndex(index + 1);
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    const handleIntervalChange = (event) => {
        const value = event.target.value;
        setReadInterval(value);
    }

    const increaseWidth = () => {
        setWidth(prev => Math.min(prev + 5, 600));
    };

    const decreaseWidth = () => {
        setWidth(prev => Math.max(prev - 5, 250));
    };

    const handlePercentageChange = (event) => {
        const value = event.target.value;
        setPercentage(value);
    }

    return (
        <div className="extension-container" style={{ position: 'fixed', top: '10px', [alignment]: '10px', width: `${width}px`, background: 'white', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: '15px', zIndex: 10000, maxHeight: '100vh', overflowY: 'auto' }}>
            <div className="controls row pt-1 pb-1 border-bottom align-items-center">
                <div className="col">
                    <button onClick={() => setAlignment('left')}>Left</button>
                </div>
                <div className="col pr-0" style={{ 'text-align': 'end' }}>
                    <button onClick={() => setAlignment('right')}>Right</button>
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <label>Width: {width}px</label>
                </div>
                <div className="col" style={{ 'text-align': 'end' }}>
                    <div className="width-control">
                        <button onClick={decreaseWidth}>-</button>
                        <button onClick={increaseWidth}>+</button>
                    </div>
                </div>
            </div>
            <div className="inner-container">
                <div className="lpu38Pri valign-wrapper false displayBase"><span className="lpu38San">₹</span><span className="p-4">{readInterval}</span></div>
                <div className="mb-2"><input style={{ 'width': '100px' }} type="text" onChange={handleIntervalChange} value={readInterval} /></div>
                <div className="row">
                    <div className="col-12">
                        <div className="row pt-1 pb-1 border-bottom align-items-center">
                            <div className="col"><b>{percentage} %</b></div>
                            <div className="col"><input style={{ 'width': '100px' }} type="text" onChange={handlePercentageChange} value={percentage} /></div>
                        </div>
                        <div className="row">
                            <table className="table table-striped table-hover table-sm">
                                <thead>
                                    <tr>
                                        <th scope="col" className="p-2 col-2 align-middle">#</th>
                                        <th scope="col" className="p-2 col-4 align-middle">Value</th>
                                        <th scope="col" className="p-2 col-6 align-middle">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {readings.map((x, rowIndex) => (
                                        <tr className={x.type === 'increase' ? 'table-success' : x.type === 'decrease' ? 'table-danger' : 'table-secondary'}>
                                            <td scope="row" className="p-2 col-2 align-middle">{rowIndex + 1}</td>
                                            <td className="p-2 col-4 align-middle">{x.changeVal}</td>
                                            <td className="p-2 col-6 align-middle">{x.changeTime.toTimeString().replaceAll(' GMT+0530 (India Standard Time)', '')}</td>
                                        </tr>
                                    ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div >);
}