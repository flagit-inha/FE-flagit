import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateCrewPage.css";

export default function CreateCrewPage() {
  const nav = useNavigate();
  const [crewname, setTeamName] = useState("");
  const [typeOpen, setTypeOpen] = useState(false);
  const [crew_type, setTeamType] = useState("등산 모임");
  const [code, setCode] = useState("");
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

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

  const typeMap = {
    "등산 모임": "hiking",
    "러닝 크루": "running",
    "자전거 동호회": "cycling"
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!crewname || !crew_type || !code) return alert("모든 항목을 채워주세요.");

    try {
      const token = localStorage.getItem("token");
      console.log("토큰값:", token);
      const payload = {
        crewname: crewname, // 필드명 변경
        crew_type: typeMap[crew_type], // 영문 코드로 변환
        invitecode: code
      };
      console.log("보내는 데이터:", payload);

      const res = await fetch(`${apiBaseUrl}/crews/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      console.log("응답 데이터:", data);
      if (!res.ok) {
        // 이미 생성한 크루가 있을 때 에러 메시지 처리
        if (data.detail && data.detail.includes("이미 생성한 크루")) {
          alert("이미 생성한 크루가 있습니다");
        } else {
          alert(data.message || data.detail || "크루 생성 실패");
        }
        return;
      }
      nav(`/fullmap/${data.crew_id}`);
    } catch (err) {
      alert("서버 연결 오류");
    }
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
              value={crewname}
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
                value={crew_type}
                placeholder="유형을 선택하세요"
              />
              <button
                type="button"
                className="crewcreate-chip"
                onClick={() => setTypeOpen((v) => !v)}
                aria-expanded={typeOpen}
              >
                {crew_type} ▾
              </button>
              {typeOpen && (
                <ul className="crewcreate-select">
                  {["등산 모임", "러닝 크루", "자전거 동호회"].map((t) => (
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
