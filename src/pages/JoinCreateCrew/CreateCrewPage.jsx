import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCrewPage.css";

export default function CreateCrewPage() {
  const nav = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [dept, setDept] = useState("");
  const [code, setCode] = useState("");

  const genCode = () => {
    // 간단 코드 생성 (대문자+숫자 10자리)
    const c = Array.from({ length: 10 }, () =>
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 32)]
    ).join("");
    setCode(c);
  };

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      alert("초대코드 복사 완료!");
    } catch {
      alert("복사 실패. 수동으로 복사하세요.");
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!teamName || !dept || !code) {
      alert("단체명/단체 구분/코드를 모두 입력하세요.");
      return;
    }
    // TODO: 저장 로직(백엔드 붙을 때)
    alert(`크루 생성 완료!\n단체명: ${teamName}\n구분: ${dept}\n코드: ${code}`);
    nav("/"); // 홈으로
  };

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <button className="back-btn" onClick={() => nav(-1)} aria-label="뒤로가기">‹</button>

        <img src="/img/flagit%20logo.svg" alt="Flagit" className="logo" />
        <h1 className="title">모임 생성하기</h1>

        <form onSubmit={onSubmit} className="form">
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
            <span className="label">단체 구분 선택</span>
            <div className="row">
              <select
                className="select"
                value={dept}
                onChange={(e)=>setDept(e.target.value)}
              >
                <option value="">선택하세요</option>
                <option value="학교">학교</option>
                <option value="동호회">동호회</option>
                <option value="회사">회사</option>
                <option value="기타">기타</option>
              </select>
              <button type="button" className="chip" onClick={() => alert("구분 도움말")}>
                안내
              </button>
            </div>
          </label>

          <label className="field">
            <span className="label">버튼을 눌러서 코드 생성해주세요</span>
            <div className="row">
              <input className="input" value={code} readOnly placeholder="코드 생성 후 표시" />
              <button type="button" className="chip" onClick={genCode}>코드 생성</button>
              <button type="button" className="chip" onClick={copyCode}>코드 복사</button>
            </div>
            <p className="hint">코드는 대문자/숫자 조합 10자리예요. 나중에 참여자가 입력합니다.</p>
          </label>

          <button className="cta" type="submit">완료하기</button>
        </form>
      </div>
    </div>
  );
}
