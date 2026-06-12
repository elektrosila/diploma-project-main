import './Footer.css';
import logoSrc from '../assets/logo.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-logo-container">
        <img src={logoSrc} alt="Логотип" className="footer-logo" />
      </div>
      <div className="footer-column project-column">
        <h3 className="footer-title">О проекте</h3>
        <p className="footer-text">
          Этот проект создан для подготовки к ОГЭ по русскому языку. Здесь вы найдёте конспекты,
          тесты и примеры заданий, которые помогут эффективно подготовиться к экзамену.
        </p>
      </div>
      <div className="footer-column dev-column">
        <h3 className="footer-title">Разработка</h3>
        <ul className="footer-list">
          <li><a href="https://github.com/elektrosila" target="_blank" rel="noopener noreferrer">Роман К.</a></li>
        </ul>
      </div>
      <div className="footer-column">
        <h3 className="footer-title">Источники</h3>
        <ul className="footer-list">
          <li><a href="https://rustutors.ru/" target="_blank" rel="noopener noreferrer">Рустьюторс</a></li>
          <li><a href="https://www.universalinternetlibrary.ru/book/46892/ogl.shtml?ysclid=m9mus68489801928238/" target="_blank" rel="noopener noreferrer">Электронная библиотека</a></li>
          <li><a href="https://go.11klasov.net/russian-language/" target="_blank" rel="noopener noreferrer">11 klasov</a></li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;