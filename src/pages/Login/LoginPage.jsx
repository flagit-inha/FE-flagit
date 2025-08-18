import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginLocal } from "./authLocal";
import "./LoginPage.css";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!email || !pw) return setErr("이메일/비밀번호를 입력하세요.");

    setLoading(true);
    await new Promise((r) => setTimeout(r, 250)); // 모킹 딜레이
    const me = loginLocal(email, pw);
    setLoading(false);

    if (!me) return setErr("이메일 또는 비밀번호가 올바르지 않습니다.");
    nav("/"); // 성공 후 이동 경로
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <img src="/img/flagitlogo3.svg" alt="Flagit" className="login-logo" />
        <h1 className="login-title">로그인</h1>

        <form onSubmit={onSubmit} className="login-form">
          <label className="login-field">
            <span className="login-label">아이디 (이메일)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="login-input"
              autoComplete="email"
            />
          </label>

          <label className="login-field">
            <span className="login-label login-linkish">비밀번호</span>
            <input
              type={showPw ? "text" : "password"}
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className="login-input"
              autoComplete="current-password"
            />
            <label className="login-checkbox-row">
              <input
                type="checkbox"
                checked={showPw}
                onChange={(e) => setShowPw(e.target.checked)}
              />
              <span>비밀번호 보기</span>
            </label>
          </label>

          {err && <p className="login-error">{err}</p>}

          <button type="submit" disabled={loading} className="login-cta">
            {loading ? "로그인 중..." : "로그인하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
