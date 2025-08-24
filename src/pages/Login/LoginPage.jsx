import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);
    if (!email || !pw) return setErr("이메일/비밀번호를 입력하세요.");

    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setErr(data.message || "이메일 또는 비밀번호가 올바르지 않습니다.");

      // 토큰 저장 (백엔드에서 token 필드로 응답해야 함)
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("mycrew");
      localStorage.removeItem("user_id");
      
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
        if (data.refresh) localStorage.setItem("refresh_token", data.refresh);
      } else {
        return setErr("로그인 응답에 토큰이 없습니다.");
      }

      nav("/fullmap");// 로그인 성공 시 전체 지도 페이지로 이동
    } catch (e) {
      setLoading(false);
      setErr("서버 연결 오류");
    }
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
