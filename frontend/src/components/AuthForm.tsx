"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Eye, EyeOff, LoaderCircle, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const { login, register } = useAuth();
  const isRegister = mode === "register";
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (isRegister && password !== confirmPassword) {
      setError("Mật khẩu xác nhận chưa khớp.");
      return;
    }
    setSubmitting(true);
    try {
      if (isRegister) {
        await register({ displayName, email, password });
      } else {
        await login({ email, password });
      }
      router.push("/dashboard");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail("demo@structlab.vn");
    setPassword("Demo123!");
    setError("");
  };

  return (
    <section className="auth-page">
      <div className="auth-decoration auth-decoration-one" />
      <div className="auth-decoration auth-decoration-two" />
      <div className="container auth-grid">
        <div className="auth-pitch">
          <div className="eyebrow"><Sparkles size={16} /> Học thông minh hơn mỗi ngày</div>
          <h1>{isRegister ? "Tạo không gian học của riêng bạn." : "Chào mừng bạn quay lại StructLab."}</h1>
          <p>
            {isRegister
              ? "Lưu bài đã hoàn thành, theo dõi độ chính xác và nhận gợi ý chủ đề cần ôn lại."
              : "Tiếp tục lộ trình, hoàn thành thử thách và giữ vững chuỗi trả lời chính xác."}
          </p>
          <ul className="auth-benefits">
            <li><CheckCircle2 size={19} /> Tiến độ đồng bộ theo tài khoản</li>
            <li><CheckCircle2 size={19} /> Dashboard phân tích từng chủ đề</li>
            <li><CheckCircle2 size={19} /> Hoàn toàn miễn phí cho việc học</li>
          </ul>
        </div>

        <div className="auth-card">
          <div className="auth-card-heading">
            <span>{isRegister ? "Bắt đầu miễn phí" : "Đăng nhập"}</span>
            <h2>{isRegister ? "Tạo tài khoản" : "Tiếp tục học"}</h2>
            <p>
              {isRegister ? "Đã có tài khoản? " : "Chưa có tài khoản? "}
              <Link href={isRegister ? "/login" : "/register"}>
                {isRegister ? "Đăng nhập" : "Đăng ký ngay"}
              </Link>
            </p>
          </div>

          {!isRegister && (
            <button type="button" className="demo-login" onClick={fillDemo}>
              <span className="demo-avatar">D</span>
              <span><strong>Dùng tài khoản demo</strong><small>Điền sẵn email và mật khẩu</small></span>
              <ArrowRight size={18} />
            </button>
          )}

          {!isRegister && <div className="form-divider"><span>hoặc đăng nhập bằng email</span></div>}

          <form className="auth-form" onSubmit={submit}>
            {isRegister && (
              <label>
                Họ và tên
                <input
                  type="text"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="Nguyễn Bảo Châu"
                  minLength={2}
                  maxLength={80}
                  required
                />
              </label>
            )}
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ban@example.com"
                required
              />
            </label>
            <label>
              Mật khẩu
              <span className="password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={isRegister ? "Tối thiểu 8 ký tự" : "Nhập mật khẩu"}
                  minLength={isRegister ? 8 : undefined}
                  required
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </span>
            </label>
            {isRegister && (
              <label>
                Xác nhận mật khẩu
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  minLength={8}
                  required
                />
              </label>
            )}

            {error && <div className="form-error" role="alert">{error}</div>}

            <button className="button button-primary button-large auth-submit" type="submit" disabled={submitting}>
              {submitting ? <LoaderCircle className="spin" size={19} /> : null}
              {submitting ? "Đang xử lý..." : isRegister ? "Tạo tài khoản" : "Đăng nhập"}
              {!submitting && <ArrowRight size={19} />}
            </button>
          </form>

          {isRegister && (
            <p className="terms-note">Bằng việc đăng ký, bạn đồng ý sử dụng nền tảng cho mục đích học tập.</p>
          )}
        </div>
      </div>
    </section>
  );
}
