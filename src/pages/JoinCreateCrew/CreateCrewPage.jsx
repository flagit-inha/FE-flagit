import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCrewPage.css";

export default function CreateCrewPage() {
  const nav = useNavigate();
  const [teamName, setTeamName] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [teamType, setTeamType] = useState("등산 모임");
  const [code, setCode] = useState("");

  const genCode = () => {
    // 대문자+숫자 10자
    const c = Array.from({ length: 10 }, () =>
      "ABCDEFGHJKLMNPQRSTUWVXYZ23456789"[Math.floor(Math.random() * 33)]
    ).join("");
    setCode(c);
  };

  const copyCode = async () => {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      alert("초대코드 복사 완료!");
    } catch {
      alert("복사 실패, 수동으로 복사하세요.");
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!teamName || !teamType || !code) return alert("모든 항목을 채워주세요.");
    // TODO: 생성 로직 연결
    nav("/mycrew");
  };

  return (
    <div className="crewcreate-screen">
      <div className="crewcreate-card">
        <button className="crewcreate-back" onClick={() => nav(-1)} aria-label="뒤로가기">‹</button>

        <img src="/img/flagitlogo3.svg" alt="Flagit" className="crewcreate-logo" />
        <h1 className="crewcreate-title">모임 생성하기</h1>

        <form onSubmit={submit} className="crewcreate-form">
          {/* 단체명 */}
          <label className="crewcreate-field">
            <span className="crewcreate-label">단체명</span>
            <input
              className="crewcreate-input"
              placeholder="단체/모임 이름을 입력"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </label>

          {/* 단체 유형 선택 */}
          <div className="crewcreate-field">
            <span className="crewcreate-label crewcreate-label--link">단체 유형 선택</span>
            <div className="crewcreate-inputwrap">
              <input
                className="crewcreate-input"
                readOnly
                value={teamType}
                placeholder="유형을 선택하세요"
              />
              <button
                type="button"
                className="crewcreate-chip"
                onClick={() => setTypeOpen((v) => !v)}
                aria-expanded={typeOpen}
              >
                {teamType} ▾
              </button>
              {typeOpen && (
                <ul className="crewcreate-select">
                  {["등산 모임", "러닝 크루", "자전거"].map((t) => (
                    <li key={t} onClick={() => { setTeamType(t); setTypeOpen(false); }}>
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* 코드 생성 */}
          <div className="crewcreate-field">
            <input
              className="crewcreate-input"
              placeholder="버튼 눌러 코드 생성"
              readOnly
            />
            <button type="button" className="crewcreate-chip" onClick={genCode}>코드 생성</button>
          </div>

          {/* 코드 표시 + 복사 */}
          <div className="crewcreate-field">
            <input className="crewcreate-input" readOnly value={code} placeholder="초대코드" />
            <button type="button" className="crewcreate-chip" onClick={copyCode}>코드 복사</button>
          </div>

          <p className="crewcreate-help">* 추후 마이페이지에서 코드 복사가 가능합니다</p>

          <button className="crewcreate-cta" type="submit">완료하기</button>
        </form>
      </div>
    </div>
  );
}
