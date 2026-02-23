import "./FooterInfo.css";

const BACKEND_URL = "http://localhost:3000";
const FRONTEND_URL = "http://localhost:5173";

export function FooterInfo() {
  return (
    <footer className="footer-info">
      <div className="footer-info__row">
        <strong className="footer-info__label">Backend:</strong>{" "}
        <code className="footer-info__code">
          {BACKEND_URL}
        </code>
      </div>
      <div className="footer-info__row">
        <strong className="footer-info__label">Frontend:</strong>{" "}
        <code className="footer-info__code">
          {FRONTEND_URL}
        </code>
      </div>
    </footer>
  );
}
