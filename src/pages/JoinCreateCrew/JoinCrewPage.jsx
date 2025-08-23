import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./JoinCrewPage.css";

export default function JoinCrewPage() {
  const nav = useNavigate();
  const [crewname, setTeamName] = useState("");
  const [invitecode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const submit = async (e) => {
    e.preventDefault();
    if (!crewname || !invitecode) {
      alert("단체명과 초대코드를 입력해주세요.");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      console.log({ crewname, invitecode }); // 값 확인
      const res = await fetch(`${apiBaseUrl}/crews/join/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ crewname, invitecode })
      });
      const data = await res.json();
      console.log(data); // 응답 확인
      setLoading(false);

      if (res.ok) {
        nav("/mycrew");
      } else {
        alert(data.message || "단체명과 초대코드가 일치하지 않습니다.");
      }
    } catch (err) {
      setLoading(false);
      alert("서버 연결 오류");
    }
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
              value={crewname}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </label>

          {/* 초대코드 */}
          <label className="crewjoin-field">
            <span className="crewjoin-label crewjoin-label--link">초대코드입력</span>
            <input
              className="crewjoin-input"
              placeholder=""
              value={invitecode}
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
