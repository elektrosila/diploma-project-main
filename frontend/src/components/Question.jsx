import "./Question.css";

const Question = ({
  index,
  question,
  isSubmitted,
  userAnswer,
  onAnswerChange,
}) => {
  return (
    <div className="question-card">
      <h3 className="question-title">Вопрос № {index}</h3>
      <div className="question-text">{question.text}</div>
      {question.body && <div className="question-body">{question.body}</div>}
      {question.image && (
        <img
          src={`/images/${question.image}`}
          style={{ width: "300px", height: "auto" }}
        />
      )}
      <div className="question-input">
        Ответ:
        {question.answerType === "short" ? (
          <input
            className="input-pose"
            type="text"
            name={question.id}
            value={userAnswer}
            disabled={isSubmitted}
            onChange={(e) => onAnswerChange(question.id, e.target.value)}
          />
        ) : (
          <div className="textarea-container">
            <p>
              Решения заданий с развернутым ответом не проверяются
              автоматически.
            </p>
            <textarea
              className="textarea-style"
              name={question.id}
              disabled={isSubmitted}
              value={userAnswer}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
              rows={15}
              cols={100}
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};

export default Question;
