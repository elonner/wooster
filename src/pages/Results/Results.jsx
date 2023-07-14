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
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { useState, useRef, useEffect } from 'react';
import descriptions from '../../descriptions';
import * as usersApi from '../../utilities/users-api';
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
    // start new
    const [resultData, setResultData] = useState({
        scores: {},
        funName: '',
        code: '',
        id: 0,
        name: ''
    });
    const [comparison, setComparison] = useState({
        scores: null,
        firstName: ''
    });
    // end new
    //const [funName, setFunName] = useState(''); // ^^
    //const [code, setCode] = useState(''); // ^^
    //const [name, setName] = useState('you are'); // ^^
    //const [result, setResult] = useState({}); // ^^
    //const [resultId, setResultId] = useState(0); // ^^
    const [average, setAverage] = useState({});
    //const [toCompare, setToCompare] = useState(null); // ^
    const [showAverage, setShowAverage] = useState(false);
    const [showCompare, setShowCompare] = useState(false);
    //const [compName, setCompName] = useState(''); // ^^
    const [data, setData] = useState({});
    const [moreInfo, setMoreInfo] = useState(false);
    const [activeCat, setActiveCat] = useState('');
    const [showResultsLink, setShowResultsLink] = useState(false);
    const [navPage, setNavPage] = useState(false);

    const descriptionRef = useRef(null);
    const tableRef = useRef(null);
    const chartRef = useRef(null); // allows to see chart elements and options

    const { sentResultId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        async function getResult() {
            // upon recieved results
            let res;
            let nameTemp = 'you are';
            if (sentResultId) {
                res = await resultsApi.getOne(sentResultId);
                const user = await usersApi.getOne(res.user);
                //setName(`${user.first} is`); // v
                nameTemp = `${user.first} is`;
            } else {
                res = await resultsApi.getLatest(user._id);
                if (!res) {
                    handleNavigate('/survey');
                    return;
                }
            }

            // after survey completion
            if (location.state?.id) {
                const toComp = await resultsApi.getOne(location.state.id);
                const compUser = await usersApi.getOne(toComp.user);
                //setCompName(`${compUser.first}`); // v
                //setToCompare(toComp.scores); // v
                setComparison({
                    ...comparison,
                    scores: toComp.scores,
                    firstName: compUser.first
                });
            }

            // sent results to user with results
            if (sentResultId && user) {
                const toComp = await resultsApi.getLatest(user._id);
                //setCompName(`${compUser.first}`); // v
                //setToCompare(toComp.scores); // v
                if (toComp) {
                    setShowResultsLink(true);
                    setComparison({
                        ...comparison,
                        scores: toComp.scores,
                        firstName: 'my results'
                    });
                }
            }
            //setResultId(res._id); // v
            //setResult(res.scores); // v
            //setCode(res.code); // v
            //setFunName('Raging Baffoon'); // v
            setResultData({
                ...resultData,
                scores: res.scores,
                funName: 'Knee Slap Raging Baffoon',
                code: res.code,
                id: res._id,
                name: nameTemp
            });
        }
        async function getAverage() {
            const avg = await resultsApi.getAverage();
            setAverage(avg);
        }
        getResult();
        getAverage();
        setNavPage(false);
    }, [navPage]);

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
        //for (const [key, val] of Object.entries(result)) {
        for (const [key, val] of Object.entries(resultData.scores)) {
            if (val > maxVal) {
                maxVal = val;
                maxKey = key;
            }
        }

        const datasets = [
            {
                //data: getValues(result),
                data: getValues(resultData.scores),
                backgroundColor: 'rgba(220, 172, 0, 0.5)',
                borderColor: 'rgba(220, 172, 0, 1)',
                borderWidth: 2
            },
        ];
        if (showAverage) {
            datasets.push({
                label: '',
                data: getValues(average),
                backgroundColor: 'rgba(45, 107, 214, 0.35)',
                borderColor: 'rgba(45, 107, 214, 0.8)',
                borderWidth: 2
            });
        }
        if (showCompare) {
            datasets.push({
                label: '',
                //data: getValues(toCompare),
                data: getValues(comparison.scores),
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                borderColor: 'rgba(255, 50, 50, 0.7)',
                borderWidth: 2
            });
        }
        setData({
            labels: ['A', 'B', 'C', 'D', 'E'],
            datasets: datasets
        })
        setActiveCat(maxKey);
        //}, [result, showAverage, showCompare])
    }, [resultData, showAverage, showCompare])

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
        //}, [result, moreInfo]);
    }, [resultData, moreInfo]);

    async function share() {
        try {
            await navigator.share({
                title: 'Wooster',
                text: 'Check out my humor rating!',
                //url: `https://wooster-comedy-e5cd863c8ed6.herokuapp.com/results/${resultId}` // Replace with the URL you want to share
                url: `https://wooster-comedy-e5cd863c8ed6.herokuapp.com/results/${resultData.id}` // Replace with the URL you want to share
            })
        } catch (err) {
            console.log(err);
        }
    }

    function logOut() {
        usersServices.logOut();
        handleNavigate('/');
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

    function handleNavigate(path, options) {
        navigate(`${path}`, options);
        setNavPage(true);
    }

    return (
        <div className="results">
            {/* {data && funName && code ? */}
            {data && resultData.id ?
                <>
                    {sentResultId ? 
                        showResultsLink ? 
                            <p onClick={() => handleNavigate('/results')} className='switchLink my-results'>my results</p>
                            :
                            <br/>
                        : 
                        <i onClick={share} className="fa-solid fa-share-from-square fa-2x"></i>
                    }
                    {/* <p id="you-are">{`${name} a...`}</p>
                    <h1 id="fun-name">{funName}</h1>
                    <h5 id="code">{code}</h5> */}
                    <p id="you-are">{`${resultData.name} a...`}</p>
                    <h1 id="fun-name">{resultData.funName}</h1>
                    <h5 id="code">{resultData.code}</h5>
                    <label className='compare-label average'>
                        <input
                            onChange={() => setShowAverage(!showAverage)}
                            className='compare-input average'
                            type="checkbox"
                        />
                        show average
                    </label>
                    {/* {toCompare ? */}
                    {comparison.scores ?
                        <label className='compare-label user'>
                            <input
                                onChange={() => setShowCompare(!showCompare)}
                                className='compare-input user'
                                type="checkbox"
                            />
                            {/* {compName} */}
                            {comparison.firstName}
                        </label>
                        :
                        null
                    }
                    <div id="radar">
                        {console.log(data)}
                        <Radar data={data} options={options} ref={chartRef} />
                    </div>
                    <div className="info">
                        <div ref={tableRef} className="table-container">
                            <table className="table">
                                <tbody>
                                    {/* {Object.entries(result).sort((a, b) => b[1] - a[1]).map((cat, idx) => { */}
                                    {Object.entries(resultData.scores).sort((a, b) => b[1] - a[1]).map((cat, idx) => {
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
                    {sentResultId ?
                        <>
                            <p className="switchForms take-again"></p>
                            <div className="btn-container">
                                <button onClick={() => handleNavigate('/survey', { state: { id: sentResultId } })} className='sbmt-btn'>Take Quiz!</button>
                            </div>
                        </>
                        :
                        <>
                            <p className="switchForms take-again">Make a mistake?
                                &nbsp;
                                <span onClick={() => handleNavigate('/survey')} className='switchLink'>take again</span>
                            </p>
                            <div className="btn-container">
                                <button onClick={share} className='sbmt-btn'>Share Your Results!</button>
                            </div>
                        </>
                    }
                </>
                :
                <>
                    <p>fetching data</p>
                    <p>if this is taking too long click <span onClick={logOut}>here</span></p>
                </>
            }
        </div >
    );
}