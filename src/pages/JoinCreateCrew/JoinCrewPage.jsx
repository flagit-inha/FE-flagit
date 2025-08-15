import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinCrewPage.css";

export default function JoinCrewPage() {
  const nav = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!teamName || !inviteCode) {
      alert("단체명과 초대코드를 입력하세요.");
      return;
    }
    // TODO: 실제 검증은 백엔드 연결 시 구현
    alert(`참여 요청 전송!\n단체명: ${teamName}\n코드: ${inviteCode}`);
    nav("/"); // 성공 가정
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로가기">‹</button>

        <img src="/img/flagit%20logo.svg" alt="Flagit" className="logo" />
        <h1 className="title">모임 참여하기</h1>

        <form className="form" onSubmit={onSubmit}>
          <label className="field">
            <span className="label">단체명</span>
            <input
              className="input"
              value={teamName}
              onChange={(e)=>setTeamName(e.target.value)}
              placeholder="예) 플래깃 러닝크루"
            />
          </label>

          <label className="field">
            <span className="label blue">초대코드입력</span>
            <input
              className="input"
              value={inviteCode}
              onChange={(e)=>setInviteCode(e.target.value.toUpperCase())}
              placeholder="예) RW0DKNSLQB"
            />
          </label>

          <button className="cta-blue" type="submit">참여하기</button>
        </form>
      </div>
    </div>
  );
}
