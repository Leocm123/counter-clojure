import "./CounterDisplay.css";

type CounterDisplayProps = {
  value: number;
  pulseKey: number;
};

export function CounterDisplay({ value, pulseKey }: CounterDisplayProps) {
  return (
    <div className="counter-display">
      <div key={pulseKey} className="counter-display__value">
        {value}
      </div>
    </div>
  );
}
