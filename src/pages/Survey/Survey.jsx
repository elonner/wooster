import { useState } from "react";
import questions from '../../questions';
import { useNavigate } from "react-router-dom";

export default function Survey({ setHasResults }) {
    const [section, setSection] = useState(1);
    const navigate = useNavigate();


    function nextPage(section) {
        if (true) {
            if (section === 4) {
                setHasResults(true)
                navigate('/results');
            } else {
                setSection(section)
            }
        } else {
            alert('Please answer all questions.');
        }
    }

    return (
        <>
            {section === 1 && (
                <div className="section-one">
                    <button onClick={() => nextPage(2)}>Next</button>
                </div>
            )}
            {section === 2 && (
                <div className="section-two">
                    <button onClick={() => nextPage(3)}>Next</button>
                    <button onClick={() => nextPage(1)}>Previous</button>
                </div>
            )}
            {section === 3 && (
                <div className="section-three">
                    <button onClick={() => nextPage(4)}>Submit</button>
                    <button onClick={() => nextPage(2)}>Previous</button>
                </div>
            )}
        </>
    );
}