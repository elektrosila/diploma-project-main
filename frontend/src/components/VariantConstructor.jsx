import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVariant } from "../contexts/VariantContext";
import "./VariantConstructor.css";
import fakeData from "../data/data.js";

const initialTopicQuestionCount = Object.fromEntries(
  fakeData.topics.map((topic) => [topic.id, 0])
);

const LABELS = {
  variant: "\u0412\u0430\u0440\u0438\u0430\u043d\u0442",
  quantity: "\u041a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u043e",
  topic: "\u0422\u0435\u043c\u0430",
  short: "\u041a\u0440\u0430\u0442\u043a\u0438\u0439 \u043e\u0442\u0432\u0435\u0442",
  long: "\u0420\u0430\u0437\u0432\u0435\u0440\u043d\u0443\u0442\u044b\u0439 \u043e\u0442\u0432\u0435\u0442",
  submit:
    "\u0421\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432\u0430\u0440\u0438\u0430\u043d\u0442",
};

const VariantConstructor = () => {
  const topics = fakeData.topics;
  const questions = fakeData.questions;
  const [topicQuestionCount, setTopicQuestionCount] = useState(
    initialTopicQuestionCount
  );
  const [shortQuestionsActive, setShortQuestionsActive] = useState(false);
  const [longQuestionsActive, setLongQuestionsActive] = useState(false);
  const { handleCustomVariant } = useVariant();
  const navigate = useNavigate();

  const shortQTopics = topics.filter(
    (topic) => topic.questionsType === "short"
  );
  const longQTopics = topics.filter((topic) => topic.questionsType === "long");

  const handleChange = (id, e) => {
    const questionCount = Math.max(0, Number(e.target.value));
    if (!Number.isNaN(questionCount)) {
      setTopicQuestionCount((prev) => ({ ...prev, [id]: questionCount }));
    }
  };

  const handleInc = (id) =>
    setTopicQuestionCount((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const handleDec = (id) =>
    setTopicQuestionCount((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));

  const toggleQuestions = (selectedTopics, setActive, active) => {
    if (active) {
      setTopicQuestionCount((prev) => {
        const updatedCounts = { ...prev };
        selectedTopics.forEach(({ id }) => {
          updatedCounts[id] = 0;
        });
        return updatedCounts;
      });
      setActive(false);
      return;
    }

    setTopicQuestionCount((prev) => {
      const updatedCounts = { ...prev };
      selectedTopics.forEach(({ id }) => {
        updatedCounts[id] = (updatedCounts[id] || 0) + 1;
      });
      return updatedCounts;
    });
    setActive(true);
  };

  const handleShortToggle = () => {
    toggleQuestions(shortQTopics, setShortQuestionsActive, shortQuestionsActive);
  };

  const handleLongToggle = () => {
    toggleQuestions(longQTopics, setLongQuestionsActive, longQuestionsActive);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedQuestions = [];

    Object.entries(topicQuestionCount).forEach(([selectedTopicId, count]) => {
      const filteredQuestions = questions.filter(
        (question) => question.topic.id === Number(selectedTopicId)
      );

      const shuffled = [...filteredQuestions].sort(() => Math.random() - 0.5);
      const questionsToSelect = shuffled.slice(
        0,
        Math.min(count, shuffled.length)
      );
      selectedQuestions.push(...questionsToSelect);
    });

    if (!selectedQuestions.length) {
      return;
    }

    await handleCustomVariant({
      id: Date.now(),
      name: `${LABELS.variant} ${new Date().toLocaleTimeString()}`,
      questions: selectedQuestions,
    });
    navigate("/test/custom");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="constructor">
        <div className="constructor-topicList">
          <div className="constructor-head">
            <h3>{LABELS.quantity}</h3>
            <h3>{LABELS.topic}</h3>
          </div>

          <div className="brief-label">{LABELS.short}</div>
          <div className="constructor-body">
            <ul>
              {shortQTopics.map(({ id, name }) => (
                <li className="li-constructor" key={id}>
                  <div className="counter">
                    <button type="button" onClick={() => handleDec(id)}>
                      -
                    </button>
                    <input
                      className="counter-input"
                      type="tel"
                      value={topicQuestionCount[id] || 0}
                      onChange={(e) => handleChange(id, e)}
                    />
                    <button type="button" onClick={() => handleInc(id)}>
                      +
                    </button>
                  </div>
                  <div className="constructor-topicDescr">{name}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="li-divider">{LABELS.long}</div>
          <div className="constructor-body">
            <ul>
              {longQTopics.map(({ id, name }) => (
                <li className="li-constructor" key={id}>
                  <div className="counter">
                    <button type="button" onClick={() => handleDec(id)}>
                      -
                    </button>
                    <input
                      className="counter-input"
                      type="tel"
                      value={topicQuestionCount[id] || 0}
                      onChange={(e) => handleChange(id, e)}
                    />
                    <button type="button" onClick={() => handleInc(id)}>
                      +
                    </button>
                  </div>
                  <div className="constructor-topicDescr">{name}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="constructor-buttons">
          <div className="button-frame">
            <button className="submit" type="submit">
              {LABELS.submit}
            </button>
            <div className="answer-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={shortQuestionsActive}
                  onChange={handleShortToggle}
                />
                {LABELS.short}
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={longQuestionsActive}
                  onChange={handleLongToggle}
                />
                {LABELS.long}
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default VariantConstructor;
