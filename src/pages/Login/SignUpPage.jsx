import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerLocal } from "./authLocal";
import "./SignUpPage.css";

export default function SignUpPage() {
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr(null);

    if (!name || !email || !pw || !pw2) return setErr("모든 항목을 입력하세요.");
    if (pw !== pw2) return setErr("비밀번호가 일치하지 않습니다.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("이메일 형식을 확인하세요.");

    setLoading(true);
    await new Promise(r => setTimeout(r, 250));
    try {
      await registerLocal({ name, email, password: pw });
      nav("/"); // 가입 후 홈으로
    } catch (e2) {
      setErr(e2.message || "가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <img src="/img/flagitlogo3.svg" alt="Flagit" className="logo" />
        <h1 className="title">가입하기</h1>

        <form onSubmit={onSubmit} className="form">
          <label className="field">
            <span className="label">사용할 닉네임</span>
            <input
              value={name}
              onChange={(e)=>setName(e.target.value)}
              placeholder="별라온 갓냥이"
              className="input"
            />
          </label>

          <label className="field">
            <span className="label linkish">이메일(아이디)</span>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input"
              autoComplete="email"
            />
          </label>

          <label className="field">
            <span className="label">비밀번호</span>
            <input
              type="password"
              value={pw}
              onChange={(e)=>setPw(e.target.value)}
              className="input"
              autoComplete="new-password"
            />
          </label>

          <label className="field">
            <span className="label">비밀번호 확인</span>
            <input
              type="password"
              value={pw2}
              onChange={(e)=>setPw2(e.target.value)}
              className="input"
              autoComplete="new-password"
            />
          </label>

          

          {err && <p className="error">{err}</p>}

          <button type="submit" disabled={loading} className="cta">
            {loading ? "가입 중..." : "가입하기"}
          </button>

          <div className='description'> 
                <h className='imi'>이미 계정이 있나요? </h>
                <a href="/login" className="loginLink">로그인하기</a> 
            </div>

         
        </form>
      </div>
    </div>
  );
}
