import Link from "next/link";
import { API_ORIGIN } from "@/lib/api";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <strong>StructLab</strong>
          <p>Học cấu trúc dữ liệu bằng cách nhìn thấy từng bước.</p>
        </div>
        <div className="footer-links">
          <Link href="/visualizer">Mô phỏng</Link>
          <Link href="/practice">Luyện tập</Link>
          <a href={`${API_ORIGIN}/swagger-ui.html`} target="_blank" rel="noreferrer">
            API Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
