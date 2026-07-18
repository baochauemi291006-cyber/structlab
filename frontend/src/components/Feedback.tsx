import { AlertCircle, LoaderCircle } from "lucide-react";

export function PageLoader({ label = "Đang tải dữ liệu..." }: { label?: string }) {
  return (
    <div className="page-state" role="status">
      <LoaderCircle className="spin" size={28} />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="page-state error-state" role="alert">
      <AlertCircle size={30} />
      <h2>Chưa thể tải nội dung</h2>
      <p>{message}</p>
      {onRetry && (
        <button className="button button-secondary" type="button" onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}
