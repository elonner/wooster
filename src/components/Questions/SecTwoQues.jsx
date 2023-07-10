import { useState, useEffect } from "react";

export default function SecTwoQues({ question, answers, handleAnswerChange }) {
    const [selected, setSelected] = useState('');

    useEffect(() => {
        if (answers.length > question.index && answers[question.index]) setSelected(answers[question.index]);
    }, []);

    function handleOptionChange(e) {
        setSelected(Number(e.target.value));
        handleAnswerChange(question.index, Number(e.target.value));
    };

    const options = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
        <div className="question-container">
            <img src={question.media} alt="" />
            <div className="ten-choice">
                {options.map(opt => {
                    return (
                        <label key={opt}>
                            {opt}
                            <input
                                className="radio"
                                type="radio"
                                name={question.media}
                                value={opt}
                                checked={selected === opt}
                                onChange={handleOptionChange}
                                required
                            />
                        </label>
                    );
                })}
            </div>
        </div>
    );
}