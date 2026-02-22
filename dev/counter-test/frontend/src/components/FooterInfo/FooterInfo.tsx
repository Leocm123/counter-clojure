import "./FooterInfo.css";

const BACKEND_URL = "http://localhost:3000";
const FRONTEND_URL = "http://localhost:5173";

export function FooterInfo() {
  return (
    <footer className="footer-info rounded-xl p-4 space-y-2">
      <div className="footer-info__row">
        <strong className="footer-info__label">Backend:</strong>{" "}
        <code className="footer-info__code rounded-md px-2 py-0.5 text-xs border">
          {BACKEND_URL}
        </code>
      </div>
      <div className="footer-info__row">
        <strong className="footer-info__label">Frontend:</strong>{" "}
        <code className="footer-info__code rounded-md px-2 py-0.5 text-xs border">
          {FRONTEND_URL}
        </code>
      </div>
    </footer>
  );
}
