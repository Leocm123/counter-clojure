import { useCounter } from "./hooks/useCounter";
import { LoadingScreen } from "./components/LoadingScreen/LoadingScreen";
import { CounterCard } from "./components/CounterCard/CounterCard";
import "./App.css";

export default function App() {
  const {
    value,
    loading,
    initialLoading,
    error,
    pulseKey,
    isConnected,
    increment,
    reset,
  } = useCounter();

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="app">
      <CounterCard
        value={value}
        pulseKey={pulseKey}
        loading={loading}
        error={error}
        isConnected={isConnected}
        onIncrement={increment}
        onReset={reset}
      />
    </div>
  );
}
