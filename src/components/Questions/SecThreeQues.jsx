import { useState, useEffect } from "react";

export default function SecThreeQues({ question, answers, handleAnswerChange }) {
    const [selected, setSelected] = useState('');

    useEffect(() => {
        if (answers.length > question.index && answers[question.index]) setSelected(answers[question.index]);
    }, []);

    function handleOptionChange(e) {
        setSelected(Number(e.target.value));
        handleAnswerChange(question.index, Number(e.target.value));
    };

    return (
        <div className="question-container">
            <p className="situation">{question.situation}</p>
            {question.responses.map((res, idx) => {
                return (
                    <label key={idx}>
                        <input
                            className="radio"
                            type="radio"
                            name={question.situation}
                            value={idx}
                            checked={selected === idx}
                            onChange={handleOptionChange}
                            required
                        />
                        &nbsp; {res.response}
                    </label>
                );
            })}
        </div>
    );
}