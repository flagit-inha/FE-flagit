import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

export default function SignUpPage() {
  const nav = useNavigate();
  const [nickname, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [password_check, setPw2] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!nickname || !email || !password || !password_check) return setErr("모든 항목을 입력하세요.");
    if (password !== password_check) return setErr("비밀번호가 일치하지 않습니다.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("이메일 형식을 확인하세요.");

    setLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/users/signup/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, email, password, password_check })
      });
      const data = await res.json();
      setLoading(false);

      if (!res.ok) return setErr(data.message || "가입에 실패했습니다.");
      nav("/crew-select"); // 가입 성공 시 모임 찾기 페이지으로 이동
    } catch (e2) {
      setLoading(false);
      setErr("서버 연결 오류");
    }
  };

  return (
    <div className="signup-screen">
      <div className="signup-card">
        <img src="/img/flagitlogo3.svg" alt="Flagit" className="signup-logo" />
        <h1 className="signup-title">가입하기</h1>

        <form onSubmit={onSubmit} className="signup-form">
          <label className="signup-field">
            <span className="signup-label">사용할 닉네임</span>
            <input
              value={nickname}
              onChange={(e) => setName(e.target.value)}
              placeholder="빌려온 깃냥이"
              className="signup-input"
            />
          </label>

          <label className="signup-field">
            <span className="signup-label">이메일(아이디)</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="signup-input"
              autoComplete="email"
            />
          </label>

          <label className="signup-field">
            <span className="signup-label">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPw(e.target.value)}
              className="signup-input"
              autoComplete="new-password"
            />
          </label>

          <label className="signup-field">
            <span className="signup-label">비밀번호 확인</span>
            <input
              type="password"
              value={password_check}
              onChange={(e) => setPw2(e.target.value)}
              className="signup-input"
              autoComplete="new-password"
            />
          </label>

          {err && <p className="signup-error">{err}</p>}

          <button type="submit" disabled={loading} className="signup-cta">
            {loading ? "가입 중..." : "가입하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
