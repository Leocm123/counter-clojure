import "./FooterInfo.css";

function useDisplayUrls() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const port = typeof window !== "undefined" ? window.location.port : "";
  // Docker: app em :8080, API em /api (mesma origem). Dev: front :5173, back :3000
  const backendUrl =
    port === "8080" ? `${origin}/api` : "http://localhost:3000";
  const frontendUrl = origin || "http://localhost:5173";
  return { backendUrl, frontendUrl };
}

export function FooterInfo() {
  const { backendUrl, frontendUrl } = useDisplayUrls();

  return (
    <footer className="footer-info">
      <div className="footer-info__row">
        <strong className="footer-info__label">Backend:</strong>{" "}
        <code className="footer-info__code">{backendUrl}</code>
      </div>
      <div className="footer-info__row">
        <strong className="footer-info__label">Frontend:</strong>{" "}
        <code className="footer-info__code">{frontendUrl}</code>
      </div>
    </footer>
  );
}
