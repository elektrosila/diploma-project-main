import "./MainPage.css";
import { Link } from "react-router-dom";
import VariantConstructor from "../components/VariantConstructor";

const LABELS = {
  trainingVariants:
    "\u0422\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u043e\u0447\u043d\u044b\u0435 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u044b",
  variant: "\u0412\u0430\u0440\u0438\u0430\u043d\u0442",
  constructor:
    "\u041a\u043e\u043d\u0441\u0442\u0440\u0443\u043a\u0442\u043e\u0440 \u0432\u0430\u0440\u0438\u0430\u043d\u0442\u043e\u0432",
  description:
    "\u0427\u0442\u043e\u0431\u044b \u0446\u0435\u043b\u0435\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u043d\u043e \u0442\u0440\u0435\u043d\u0438\u0440\u043e\u0432\u0430\u0442\u044c\u0441\u044f \u043f\u043e \u043e\u0442\u0434\u0435\u043b\u044c\u043d\u044b\u043c \u0442\u0435\u043c\u0430\u043c, \u0432\u044b \u043c\u043e\u0436\u0435\u0442\u0435 \u0441\u043e\u0441\u0442\u0430\u0432\u0438\u0442\u044c \u0432\u0430\u0440\u0438\u0430\u043d\u0442 \u0438\u0437 \u043d\u0443\u0436\u043d\u043e\u0433\u043e \u043a\u043e\u043b\u0438\u0447\u0435\u0441\u0442\u0432\u0430 \u0437\u0430\u0434\u0430\u043d\u0438\u0439 \u043f\u043e \u043a\u043e\u043d\u043a\u0440\u0435\u0442\u043d\u044b\u043c \u0440\u0430\u0437\u0434\u0435\u043b\u0430\u043c \u043a\u0430\u0442\u0430\u043b\u043e\u0433\u0430.",
  uploadQuestion:
    "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0432\u043e\u043f\u0440\u043e\u0441",
  uploadVariant:
    "\u0417\u0430\u0433\u0440\u0443\u0437\u0438\u0442\u044c \u0432\u0430\u0440\u0438\u0430\u043d\u0442",
};

const Main = ({ variantsList }) => (
  <main className="main">
    <section className="section-tren">
      <h2>{LABELS.trainingVariants}</h2>
      <ul className="variants-list">
        <span className="corner-bl" />
        <span className="corner-br" />
        {variantsList.slice(0, 10).map(({ id }) => (
          <li className="li-test" key={id}>
            <Link to={`/test/${id}`}>{`${LABELS.variant} ${id}`}</Link>
          </li>
        ))}
      </ul>
    </section>
    <h2>{LABELS.constructor}</h2>
    <div className="descr-wrapper">
      <p className="descr">{LABELS.description}</p>
    </div>
    <VariantConstructor />
    <div className="btns-container">
      <button className="btn">
        <Link className="link" to="/createQuestion">
          {LABELS.uploadQuestion}
        </Link>
      </button>
      <button className="btn">
        <Link className="link" to="/createVariant">
          {LABELS.uploadVariant}
        </Link>
      </button>
    </div>
  </main>
);

export default Main;
