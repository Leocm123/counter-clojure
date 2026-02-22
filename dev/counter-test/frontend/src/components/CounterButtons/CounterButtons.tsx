import "./CounterButtons.css";

type CounterButtonsProps = {
  loading: boolean;
  onIncrement: () => void;
  onReset: () => void;
};

export function CounterButtons({
  loading,
  onIncrement,
  onReset,
}: CounterButtonsProps) {
  return (
    <div className="counter-buttons">
      <button
        type="button"
        className="counter-buttons__increment"
        disabled={loading}
        onClick={onIncrement}
      >
        {loading ? "⏳ Carregando..." : "➕ Incrementar"}
      </button>
      <button
        type="button"
        className="counter-buttons__reset"
        disabled={loading}
        onClick={onReset}
      >
        🔄 Resetar
      </button>
    </div>
  );
}
