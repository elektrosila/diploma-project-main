import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Question from "../components/Question";
import "./TestPage.css";
import { useAuth } from "../contexts/AuthContext";

const secondsToHMS = (sec) => {
  const dateObj = new Date(sec * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();
  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
};

const Test = ({ variant }) => {
  const { id, questions } = variant;

  if (!questions || questions.length === 0) {
    return (
      <main className="no-questions">
        <h2>Вариант № {id}</h2>
        <p>На данный момент вопросы отсутствуют.</p>      
          <Link className="back-btn" to="/">
            Вернуться на главную
          </Link>
      </main>
    );
  }

  const { API, fetchStats } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(10800);
  const timeLeft = secondsToHMS(secondsLeft);

  const handleAnswerChange = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSubmitted(true);

    const totalQuestions = questions.length;
    let correctCount = 0;

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correctAnswer) {
        correctCount++;
      }
    });

    const isSuccessful = correctCount >= Math.ceil(totalQuestions / 2);

    const attemptData = {
      variant_id: id,
      total_questions: totalQuestions,
      correct_questions: correctCount,
      successful: isSuccessful,
    };

    try {
      await API.post("/attempts", attemptData);
      await fetchStats();
    } catch (error) {
      console.error("Failed to save attempt:", error);
    }
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsSubmitted(true);
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  return (
    <main>
      {!isSubmitted ? (
        <form className="main-form" onSubmit={handleSubmit}>
          <h2 className="name-variant">Вариант № {id}</h2>
          <div className="questions-container">
            <p>Осталось: {timeLeft}</p>
            {questions.map((question, index) => (
              <Question
                index={index + 1}
                key={question.id}
                question={question}
                isSubmitted={isSubmitted}
                userAnswer={answers[question.id] || ""}
                onAnswerChange={handleAnswerChange}
              />
            ))}
          </div>
          <button
            type="submit"
            disabled={isSubmitted}
            className="submit-button"
          >
            Завершить тест
          </button>
        </form>
      ) : (
        <div className="result-container">
          <h3>Результаты теста</h3>
          <table>
            <thead>
              <tr>
                <th>№</th>
                <th>Тип</th>
                <th>Ваш ответ</th>
                <th>Правильный ответ</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(({ id, answerType, correctAnswer }, index) => (
                <tr key={id}>
                  <td>{index + 1}</td>
                  <td>{answerType}</td>
                  <td
                    className={
                      answerType === "long"
                        ? ""
                        : (answers[id] === correctAnswer && "correct") ||
                          "wrong"
                    }
                  >
                    {answers[id]}
                  </td>
                  <td>{correctAnswer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link className="back-btn" to="/">
            Вернуться на главную
          </Link>
        </div>
      )}
    </main>
  );
};

export default Test;
