import "./Header.css";

type HeaderProps = {
  isConnected: boolean;
};

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="header">
      <h1 className="header__title">🍀 Contador</h1>
      <div
        className={`header__status header__status--${isConnected ? "connected" : "disconnected"}`}
      >
        <div className="header__status-dot" />
        {isConnected ? "Conectado" : "Desconectado"}
      </div>
    </header>
  );
}
