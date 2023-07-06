import './Results.css';
import {
    Chart,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { useState, useRef, useEffect } from 'react';

Chart.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

const options = {
    plugins: {
        legend: {
            display: false, // Hide the legend
        },
    },
    scales: {
        r: {
            ticks: {
                display: false, // Hide the radial scale labels
            },
            pointLabels: {
                font: {
                    size: 14
                }
            }
        }
    }
}


export default function Results() {
    const [funName, setFunName] = useState('');
    const [code, setCode] = useState('');
    const [result, setResult] = useState({});
    const [average, setAverage] = useState({});
    const [showAverage, setShowAverage] = useState(false);
    const [data, setData] = useState({});
    const [moreInfo, setMoreInfo] = useState(false);

    const descriptionRef = useRef(null);
    const chartRef = useRef(null); // allows to see chart elements and options

    useEffect(() => {
        setResult({
            'Low Brow': 0.10,
            'Coincidental': 0.30,
            'Critique': 0.55,
            'Witty': 0.025,
            'Alternative': 0.025
        });
        setAverage({
            'Low Brow': 0.2,
            'Coincidental': 0.2,
            'Critique': 0.2,
            'Witty': 0.2,
            'Alternative': 0.2
        });
        setFunName('Raging Baffoon');
        setCode('AB');
    }, []);

    useEffect(() => {
        // testing
        const chart = chartRef.current;
        if (chart) {
            console.log('ChartJS', chart);
        }

        if (!showAverage) {
            setData({
                labels: ['A', 'B', 'C', 'D', 'E'],
                datasets: [
                    {
                        data: Object.values(result),
                        backgroundColor: 'rgba(220, 172, 0, 0.5)',
                        borderColor: 'rgba(220, 172, 0, 1)',
                        borderWidth: 2,
                    },
                ],
            });
        } else {
            setData({
                labels: ['A', 'B', 'C', 'D', 'E'],
                datasets: [
                    {
                        data: Object.values(result),
                        backgroundColor: 'rgba(220, 172, 0, 0.5)',
                        borderColor: 'rgba(220, 172, 0, 1)',
                        borderWidth: 2,
                    }, {
                        label: '',
                        data: Object.values(average),
                        backgroundColor: 'rgba(45, 107, 214, 0.35)',
                        borderColor: 'rgba(45, 107, 214, 0.8)',
                        borderWidth: 2,
                    }
                ],
            });
        }
    }, [result, showAverage])

    useEffect(() => {
        if (moreInfo) {
            descriptionRef.current.style.position = 'absolute';
            descriptionRef.current.style.top = '0';
            descriptionRef.current.style.right = '0';
            descriptionRef.current.style.left = '0';
            descriptionRef.current.style.bottom = '0';
        } else {
            if (descriptionRef.current) {
                descriptionRef.current.style.position = 'initial';
                descriptionRef.current.style.top = 'initial';
                descriptionRef.current.style.right = 'initial';
                descriptionRef.current.style.left = 'initial';
                descriptionRef.current.style.bottom = 'initial';
            }
        }
    }, [moreInfo]);

    function share() {

    }

    return (
        <div className="results">
            {data && funName && code ?
                <>
                    <i onClick={share} className="fa-solid fa-share-from-square fa-2x"></i>
                    <p id="you-are">you are a...</p>
                    <h1 id="fun-name">{funName}</h1>
                    <h5 id="code">{code}</h5>
                    <label id='show-avg-label'>
                        <input onChange={() => setShowAverage(!showAverage)} id='show-avg-input' type="checkbox" />
                        show average
                    </label>
                    <div id="radar">
                        <Radar data={data} options={options} ref={chartRef} />
                    </div>
                    <div className="info">
                        <div className="table-container">
                            <table className="table">
                                <tbody>
                                    {Object.entries(result).sort((a, b) => b[1] - a[1]).map((cat, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td className="left-col">{cat[0]}</td>
                                                <td>{cat[1].toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div onClick={() => setMoreInfo(!moreInfo)} ref={descriptionRef} className="description">

                        </div>
                    </div>
                    <div className="btn-container">
                        <button onClick={share} className='share-btn'>Share Your Results!</button>
                    </div>
                </>
                :
                <p>fetching data</p>
            }
        </div >
    );
}