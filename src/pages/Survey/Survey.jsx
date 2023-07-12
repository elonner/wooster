import { useState, useEffect, useRef } from "react";
import { useNavigate , useLocation} from "react-router-dom";
import sendRequest from "../../utilities/send-request";
import SecOneQues from "../../components/Questions/SecOneQues";
import SecTwoQues from "../../components/Questions/SecTwoQues";
import SecThreeQues from "../../components/Questions/SecThreeQues";
import { getUser } from "../../utilities/users-service";
import { newResult } from "../../utilities/results-api";
import './Survey.css';

export default function Survey() {
    const [section, setSection] = useState(1);
    const [survey, setSurvey] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const navigate = useNavigate();

    const location = useLocation();
    console.log(location);

    const formRef1 = useRef();
    const formRef2 = useRef();
    const formRef3 = useRef();

    useEffect(() => {
        async function getSurvey() {
            const surveyJson = await sendRequest('/api/survey');
            setSurvey(surveyJson);
        }
        getSurvey();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [section]);

    useEffect(() => {
        if (survey) {
            const initial = [];
            survey.sectionOne.forEach(prod => {
                initial.push(0);
            });
            setAnswers(initial);
        }
    }, [survey]);

    function handleAnswerChange(index, value) {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    }

    function nextPage(nextSection) {
        const currentFormRef = section === 1 ? formRef1 : section === 2 ? formRef2 : formRef3;

        if (currentFormRef.current.checkValidity() || nextSection < section) {
            setSection(nextSection);
        } else {
            currentFormRef.current.reportValidity();
        }
    }

    async function handleSubmit(e) {
        e.preventDefault(); // don't think i need this as button is not type submit
        const data = {user: getUser(), testVersion: survey.version, isPublic: !isPrivate, answers};
        const result = await newResult(data);
        location.state ? navigate("/results", {state: { id: location.state.id }})
                       : navigate("/results");
    }

    if (!survey) return 'fetching data';

    return (
        <div className="survey">
            {section === 1 && (
                <form className="section section-one" ref={formRef1}>
                    <h2 className="section-title">Shows & Movies</h2>
                    <p className="section-instructions">For each show or movie, please select the option that best describes how you feel.</p>
                    {survey.sectionOne.map(question => {
                        return (
                            <div className="question" key={question.index}>
                                <SecOneQues question={question} answers={answers} handleAnswerChange={handleAnswerChange} />
                            </div>
                        );
                    })}
                    <div className="btn-container">
                        <button type='button' onClick={() => nextPage(2)} className='sbmt-btn'>Next</button>
                    </div>
                </form>
            )}
            {section === 2 && (
                <form className="section section-two" ref={formRef2}>
                    <h2 className="section-title">Memes & Clips</h2>
                    <p className="section-instructions">For each meme or clip, please select how funny you think it is.</p>
                    {survey.sectionTwo.map(question => {
                        return (
                            <div className="question" key={question.index}>
                                <SecTwoQues question={question} answers={answers} handleAnswerChange={handleAnswerChange} />
                            </div>
                        );
                    })}
                    <div className="btn-container">
                        <button type='button' onClick={() => nextPage(1)} className='sbmt-btn prev'>Last</button>
                        <button type='button' onClick={() => nextPage(3)} className='sbmt-btn next'>Next</button>
                    </div>
                </form>
            )}
            {section === 3 && (
                <form className="section section-three" ref={formRef3}>
                    <h2 className="section-title">Situations</h2>
                    <p className="section-instructions">For each situation, please select the option closest to how you would expect to respond.</p>
                    {survey.sectionThree.map(question => {
                        return (
                            <div className="question" key={question.index}>
                                <SecThreeQues question={question} answers={answers} handleAnswerChange={handleAnswerChange} />
                            </div>
                        );
                    })}
                    <label className='private-input'>
                        <input onChange={() => setIsPrivate(!isPrivate)} type="checkbox" />
                        &nbsp; keep my results private
                    </label>
                    <div className="btn-container">
                        <button type='button' onClick={() => nextPage(2)} className='sbmt-btn prev'>Last</button>
                        <button type='button' onClick={handleSubmit} className='sbmt-btn next'>Submit</button>
                    </div>
                </form>
            )}
        </div>
    );
}