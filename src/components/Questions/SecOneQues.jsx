import { useState, useEffect } from "react";

export default function SecOneQues({ question, answers, handleAnswerChange }) {
    const [selected, setSelected] = useState(0);

    useEffect(() => {
        if (answers[question.index]) setSelected(answers[question.index]);
    }, []);

    function handleOptionChange(e) {
        setSelected(Number(e.target.value));
        handleAnswerChange(question.index, Number(e.target.value));
    };

    return (
        <div className="question-container">
            <h3>{question.prod}</h3>
            <label>
                <input
                    className="radio"
                    type="radio"
                    name={question.prod}
                    value={0}
                    checked={selected === 0}
                    onChange={handleOptionChange}
                />
                &nbsp; Haven't seen/No opinion
            </label>
            <label>
                <input
                    className="radio"
                    type="radio"
                    name={question.prod}
                    value={1}
                    checked={selected === 1}
                    onChange={handleOptionChange}
                />
                &nbsp; Hate
            </label>
            <label>
                <input
                    className="radio"
                    type="radio"
                    name={question.prod}
                    value={2}
                    checked={selected === 2}
                    onChange={handleOptionChange}
                />
                &nbsp; Dislike
            </label>
            <label>
                <input
                    className="radio"
                    type="radio"
                    name={question.prod}
                    value={3}
                    checked={selected === 3}
                    onChange={handleOptionChange}
                />
                &nbsp; Like
            </label>
            <label>
                <input
                    className="radio"
                    type="radio"
                    name={question.prod}
                    value={4}
                    checked={selected === 4}
                    onChange={handleOptionChange}
                />
                &nbsp; Love
            </label>
        </div>
    );
}