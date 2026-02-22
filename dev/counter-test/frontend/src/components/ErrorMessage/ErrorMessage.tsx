import "./ErrorMessage.css";

type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-message rounded-xl p-4 mb-5">
      <p className="error-message__text text-sm font-medium">⚠️ {message}</p>
    </div>
  );
}
