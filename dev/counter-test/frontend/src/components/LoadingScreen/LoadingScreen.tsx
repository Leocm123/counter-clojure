import "./LoadingScreen.css";

export function LoadingScreen() {
  return (
    <div className="loading-screen min-h-screen w-screen flex items-center justify-center">
      <div className="loading-screen__content flex flex-col items-center text-center">
        <div className="loading-screen__icon">⏳</div>
        <div className="loading-screen__text font-medium">Carregando...</div>
      </div>
    </div>
  );
}
