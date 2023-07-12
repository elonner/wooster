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
import { useParams, useNavigate } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { useState, useRef, useEffect } from 'react';
import descriptions from '../../descriptions';
import * as resultsApi from '../../utilities/results-api';
import * as usersServices from '../../utilities/users-service'

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


export default function Results({ user }) {
    const { id } = useParams();
    const [funName, setFunName] = useState('');
    const [code, setCode] = useState('');
    const [result, setResult] = useState({});
    const [resultId, setResultId] = useState(0);
    const [average, setAverage] = useState({});
    const [showAverage, setShowAverage] = useState(false);
    const [data, setData] = useState({});
    const [moreInfo, setMoreInfo] = useState(false);
    const [activeCat, setActiveCat] = useState('');

    const descriptionRef = useRef(null);
    const tableRef = useRef(null);
    const chartRef = useRef(null); // allows to see chart elements and options

    const navigate = useNavigate();

    useEffect(() => {
        async function getResult() {
            let res;
            id ? res = await resultsApi.getOne(id) : res = await resultsApi.getLatest(user._id);
            setResultId(res._id)
            setResult(res.scores);
            setCode(res.code);
            setFunName('Raging Baffoon');
        }
        async function getAverage() {
            const avg = await resultsApi.getAverage();
            setAverage(avg);
        }
        getResult();
        getAverage();
    }, []);

    // sets active category and data
    useEffect(() => {
        // testing
        const chart = chartRef.current;
        if (chart) {
            console.log('ChartJS', chart);
        }

        // logic for setting active category 
        let maxKey = '';
        let maxVal = 0;
        for (const [key, val] of Object.entries(result)) {
            if (val > maxVal) {
                maxVal = val;
                maxKey = key;
            }
        }

        if (!showAverage) {
            setData({
                labels: ['A', 'B', 'C', 'D', 'E'],
                datasets: [
                    {
                        data: getValues(result),
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
                        data: getValues(result),
                        backgroundColor: 'rgba(220, 172, 0, 0.5)',
                        borderColor: 'rgba(220, 172, 0, 1)',
                        borderWidth: 2,
                    }, {
                        label: '',
                        data: getValues(average),
                        backgroundColor: 'rgba(45, 107, 214, 0.35)',
                        borderColor: 'rgba(45, 107, 214, 0.8)',
                        borderWidth: 2,
                    }
                ],
            });
        }
        setActiveCat(maxKey);
    }, [result, showAverage])

    // styling for description
    useEffect(() => {
        if (moreInfo) {
            descriptionRef.current.style.position = 'absolute';
            descriptionRef.current.style.top = '0';
            descriptionRef.current.style.right = '0';
            descriptionRef.current.style.left = '0';
            descriptionRef.current.style.bottom = '0';
            descriptionRef.current.style.width = '100%';
            descriptionRef.current.style.height = `${tableRef.current?.clientHeight + 2}px`;
        } else {
            if (descriptionRef.current) {
                descriptionRef.current.style.position = 'initial';
                descriptionRef.current.style.top = 'initial';
                descriptionRef.current.style.right = 'initial';
                descriptionRef.current.style.left = 'initial';
                descriptionRef.current.style.bottom = 'initial';
                descriptionRef.current.style.width = '0px';
                descriptionRef.current.style.height = `${tableRef.current?.clientHeight + 2}px`;
            }
        }
    }, [result, moreInfo]);

    async function share() {
        console.log(result)
        try {
            await navigator.share({
                title: 'Wooster',
                text: 'Discover your sense of humor!',
                url: `https://wooster-comedy-e5cd863c8ed6.herokuapp.com/${resultId}` // Replace with the URL you want to share
            })
        } catch (err) {
            console.log(err);
        }
    }

    // returns array of score object values ensuring correct order
    function getValues(obj) {
        const vals = [];
        vals.push(obj['Low Brow']);
        vals.push(obj['Coincidental']);
        vals.push(obj['Critique']);
        vals.push(obj['Witty']);
        vals.push(obj['Alternative']);
        return vals;
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
                        <div ref={tableRef} className="table-container">
                            <table className="table">
                                <tbody>
                                    {Object.entries(result).sort((a, b) => b[1] - a[1]).map((cat, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td onClick={() => setActiveCat(cat[0])} className="left-col">{cat[0]}</td>
                                                <td>{cat[1].toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div onClick={() => setMoreInfo(!moreInfo)} ref={descriptionRef} className="description">
                            <h3 className='desc-title'>{activeCat}</h3>
                            <p className="desc-body">{descriptions[activeCat]}</p>
                            <i className={`fa-solid plus ${moreInfo ? "fa-minus" : "fa-plus"}`}></i>
                        </div>
                    </div>
                    {id ?
                        <div className="btn-container">
                            <button onClick={() => navigate('/survey')} className='sbmt-btn'>Take Quiz!</button>
                        </div>
                        :
                        <div className="btn-container">
                            <button onClick={share} className='sbmt-btn'>Share Your Results!</button>
                        </div>
                    }
                </>
                :
                <>
                    <p>fetching data</p>
                    <p>if this is taking too long click <span onClick={() => usersServices.logOut()}>here</span></p>
                </>
            }
        </div >
    );
}