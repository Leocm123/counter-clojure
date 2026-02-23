import "./LoadingScreen.css";

export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loading-screen__content">
        <div className="loading-screen__icon">⏳</div>
        <div className="loading-screen__text">Carregando...</div>
      </div>
    </div>
  );
}
