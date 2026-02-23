import "./ErrorMessage.css";

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message">
      <p className="error-message__text">⚠️ {message}</p>
    </div>
  );
}
