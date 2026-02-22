import { Header } from "../Header/Header";
import { CounterDisplay } from "../CounterDisplay/CounterDisplay";
import { CounterButtons } from "../CounterButtons/CounterButtons";
import { ErrorMessage } from "../ErrorMessage/ErrorMessage";
import { FooterInfo } from "../FooterInfo/FooterInfo";
import "./CounterCard.css";

type CounterCardProps = {
  value: number;
  pulseKey: number;
  loading: boolean;
  error: string;
  isConnected: boolean;
  onIncrement: () => void;
  onReset: () => void;
};

export function CounterCard({
  value,
  pulseKey,
  loading,
  error,
  isConnected,
  onIncrement,
  onReset,
}: CounterCardProps) {
  return (
    <div className="counter-card">
      <Header isConnected={isConnected} />
      <CounterDisplay value={value} pulseKey={pulseKey} />
      <CounterButtons
        loading={loading}
        onIncrement={onIncrement}
        onReset={onReset}
      />
      {error && <ErrorMessage message={error} />}
      <FooterInfo />
    </div>
  );
}
