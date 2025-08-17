import { useNavigate } from "react-router-dom";
import "./CrewSelectPage.css";

export default function CrewSelectPage() {
  const nav = useNavigate();

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로가기">‹</button>

        <img
          src="/img/flagit%20logo.svg"
          alt="Flagit"
          className="logo"
        />
        <h1 className="title">모임 등록!</h1>

        <div className="v-gap" />

        <button className="btn btn-green" onClick={() => nav("/crew/create")}>
          나는 크루를 생성해볼래 (크리에이터 생성)
        </button>

        <button className="btn btn-blue" onClick={() => nav("/crew/join")}>
          나는 크루가 이미 있어요 (참여자로 들어가기)
        </button>

        <div className="notice">
          <span className="icon">ⓘ</span>
          이미 크루가 있으시면 ‘참여하기’에서 코드로 합류하세요
        </div>
      </div>
    </div>
  );
}
