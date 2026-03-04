import "./FooterInfo.css";

function useDisplayUrls() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const port = typeof window !== "undefined" ? window.location.port : "";
  const isDocker = port === "8080";
  const apiBase =
    isDocker ? `${origin}/api` : "http://localhost:3000";
  const appUrl = origin || "http://localhost:5173";
  return { apiBase, appUrl, isDocker };
}

export function FooterInfo() {
  const { apiBase, appUrl, isDocker } = useDisplayUrls();

  return (
    <footer className="footer-info">
      <div className="footer-info__row">
        <strong className="footer-info__label">App:</strong>{" "}
        <code className="footer-info__code">{appUrl}</code>
      </div>
      <div className="footer-info__row">
        <strong className="footer-info__label">API base:</strong>{" "}
        <code className="footer-info__code">{apiBase}</code>
      </div>
      {isDocker && (
        <div className="footer-info__row footer-info__hint">
          Ex.: <code className="footer-info__code">{apiBase}/counter</code>
        </div>
      )}
    </footer>
  );
}
