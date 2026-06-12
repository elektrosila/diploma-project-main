import { useState, useEffect } from "react";
import "./CreateVariantForm.css";

function CreateVariantForm() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [variantName, setVariantName] = useState("");

  useEffect(() => {
    fetchQuestions();
    fetchTopics();
  }, []);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedTopic]);

  const fetchQuestions = async () => {
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await fetch("/api/topics");
      const data = await res.json();
      setTopics(data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (selectedTopic !== "all") {
      filtered = filtered.filter((q) => q.topic.name === selectedTopic);
    }

    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter((q) =>
        q.text.toLowerCase().includes(lowerSearch)
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleQuestionSelect = (questionId) => {
    setSelectedQuestions((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!variantName.trim()) {
      alert("Please enter a variant name.");
      return;
    }
    if (selectedQuestions.length === 0) {
      alert("Please select at least one question.");
      return;
    }

    try {
      const response = await fetch("/api/variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: variantName,
          questionIds: selectedQuestions,
        }),
      });
      if (response.ok) {
        alert("Variant created successfully!");
        setVariantName("");
        setSelectedQuestions([]);
      } else {
        alert("Failed to create variant.");
      }
    } catch (error) {
      console.error("Error creating variant:", error);
    }
  };

  return (
    <div className="cv-container">
      <h2 className="cv-heading">Создать новый вариант</h2>
      <form className="cv-form" onSubmit={handleSubmit}>
        <label className="cv-label">Название варианта:</label>
        <input
          className="cv-input-text"
          type="text"
          value={variantName}
          onChange={(e) => setVariantName(e.target.value)}
          required
        />

        <label className="cv-label">Фильтровать по теме:</label>
        <select
          className="cv-select"
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
        >
          <option value="all">Все темы</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.name}>
              {topic.name}
            </option>
          ))}
        </select>

        <label className="cv-label">Поиск вопросов:</label>
        <input
          className="cv-input-text"
          type="text"
          placeholder="Искать по тексту вопроса..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="cv-questions-section">
          <h3 className="cv-questions-header">Выберите вопросы:</h3>
          {filteredQuestions.length === 0 ? (
            <p>Нет вопросов, соответствующих вашему поиску.</p>
          ) : (
            filteredQuestions.map((q) => (
              <div key={q.id} className="cv-question-item hover-container">
                <input
                  className="cv-checkbox"
                  type="checkbox"
                  id={`question-${q.id}`}
                  checked={selectedQuestions.includes(q.id)}
                  onChange={() => handleQuestionSelect(q.id)}
                />
                <label
                  htmlFor={`question-${q.id}`}
                  className="cv-question-label"
                >
                  {q.text} (Тема: {q.topic.name})
                </label>
                <div className="hover-info">
                  <p className="question-body">{q.body}</p>
                  {q.image && (
                    <img
                      src={q.image}
                      alt="Визуализация вопроса"
                      className="question-image"
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <button type="submit" className="cv-submit-button">
          Создать вариант
        </button>
      </form>
    </div>
  );
}

export default CreateVariantForm;
