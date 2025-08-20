import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinCrewPage.css";

export default function JoinCrewPage() {
  const nav = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!teamName || !inviteCode) {
      alert("단체명과 초대코드를 입력해주세요.");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 250)); // TODO: 실제 API 연결
    setLoading(false);
    nav("/mycrew");
  };

  return (
    <div className="crewjoin-screen">
      <div className="crewjoin-card">
        <button
          className="crewjoin-back"
          aria-label="뒤로가기"
          onClick={() => nav(-1)}
        >
          ‹
        </button>

        <img
          src="/img/flagitlogo3.svg"
          alt="Flagit"
          className="crewjoin-logo"
        />

        <h1 className="crewjoin-title">모임 참여하기</h1>

        <form onSubmit={submit} className="crewjoin-form">
          {/* 단체명 */}
          <label className="crewjoin-field">
            <span className="crewjoin-label">단체명</span>
            <input
              className="crewjoin-input"
              placeholder="단체/모임 이름을 입력"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </label>

          {/* 초대코드 */}
          <label className="crewjoin-field">
            <span className="crewjoin-label crewjoin-label--link">초대코드입력</span>
            <input
              className="crewjoin-input"
              placeholder=""
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="crewjoin-cta"
            disabled={loading}
          >
            {loading ? "참여 중..." : "완료하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
