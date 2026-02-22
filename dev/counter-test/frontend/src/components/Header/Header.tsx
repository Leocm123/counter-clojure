import "./Header.css";

type HeaderProps = {
  isConnected: boolean;
};

export function Header({ isConnected }: HeaderProps) {
  return (
    <header className="header flex items-center justify-between mb-8">
      <h1 className="header__title text-3xl font-bold">🍀 Contador</h1>
      <div
        className={`header__status header__status--${isConnected ? "connected" : "disconnected"} flex items-center gap-2 text-sm font-medium`}
      >
        <div className="header__status-dot w-2 h-2 rounded-full" />
        {isConnected ? "Conectado" : "Desconectado"}
      </div>
    </header>
  );
}
