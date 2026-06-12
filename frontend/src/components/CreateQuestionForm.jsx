import { useState, useEffect } from "react";
import "./CreateQuestionForm.css";

import { convertKeysToSnakeCase } from "../utils/stringUtils";

function CreateQuestionForm() {
  const [topics, setTopics] = useState([]);
  const [formData, setFormData] = useState({
    text: "",
    correctAnswer: "",
    answerType: "short",
    topicId: "",
    body: "",
    imageFile: null,
  });

  useEffect(() => {
    fetch("/api/topics")
      .then((res) => res.json())
      .then((data) => setTopics(data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({ ...prev, imageFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const snakeCaseData = convertKeysToSnakeCase({
      text: formData.text,
      correctAnswer: formData.correctAnswer,
      answerType: formData.answerType,
      topicId: formData.topicId,
      body: formData.body,
    });

    const formPayload = new FormData();
    Object.entries(snakeCaseData).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formPayload.append(key, value);
      }
    });

    if (formData.imageFile) {
      formPayload.append("image", formData.imageFile);
    }

    console.log(formPayload);

    fetch("/api/questions", {
      method: "POST",
      body: formPayload,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Question created successfully!");
        setFormData({
          text: "",
          correctAnswer: "",
          answerType: "short",
          topicId: "",
          body: "",
          imageFile: null,
        });
      })
      .catch((err) => alert("Error creating question"));
  };

  return (
    <div className="cq-container">
      <h2 className="cq-heading">Создать новый вопрос</h2>
      <form
        className="cq-form"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <label className="cq-label">Текст вопроса:</label>
        <textarea
          className="cq-input"
          name="text"
          value={formData.text}
          onChange={handleChange}
          required
        />

        <label className="cq-label">Содержание:</label>
        <textarea
          className="cq-input"
          name="body"
          value={formData.body}
          onChange={handleChange}
        />

        <label className="cq-label">Загрузить изображение:</label>
        <input
          className="cq-input"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <label className="cq-label">Правильный ответ:</label>
        <input
          className="cq-input"
          name="correctAnswer"
          value={formData.correctAnswer}
          onChange={handleChange}
          required
        />

        <label className="cq-label">Тип ответа:</label>
        <select
          className="cq-select"
          name="answerType"
          value={formData.answerType}
          onChange={handleChange}
        >
          <option value="short">Короткий</option>
          <option value="long">Развернутый</option>
        </select>

        <label className="cq-label">Тема:</label>
        <select
          className="cq-select"
          name="topicId"
          value={formData.topicId}
          onChange={handleChange}
          required
        >
          <option value="">Выберите тему</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>

        <button className="cq-button" type="submit">
          Создать вопрос
        </button>
      </form>
    </div>
  );
}

export default CreateQuestionForm;
