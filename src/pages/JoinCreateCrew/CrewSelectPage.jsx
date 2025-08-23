import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./CrewSelectPage.css";

export default function CrewSelectPage() {
  const nav = useNavigate();
  const [showHintBox, setShowHintBox] = useState(false);

  // 로그인 체크: 토큰 없으면 로그인 페이지로 이동
 useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      nav("/users/login");
      return null;
    }
  }, [nav]);

  return (
    <div className="crewsel-screen">
      <div className="crewsel-card">
        <img
          src="/img/flagitlogo3.svg"
          alt="Flagit"
          className="crewsel-logo"
        />

        <h1 className="crewsel-title">모임 등록!</h1>

        <div className="crewsel-actions">
          <button
            className="crewsel-btn crewsel-btn--primary"
            onClick={() => nav("/crews")}
          >
            나는 크루를 생성해요 (초대코드 생성)
          </button>

          <button
            className="crewsel-btn crewsel-btn--secondary"
            onClick={() => nav("/crews/join")}
          >
            나는 크루가 이미 있어요 (초대코드 보유)
          </button>
          {/* 안내 토글 */}
          <p
            className="crewsel-hint clickable"
            onClick={() => setShowHintBox(!showHintBox)}
          >
            ⓘ 아직 크루가 소속되어있지 않나요
          </p>

          {showHintBox && (
            <div className="crewsel-hintbox">
              카카오톡 오픈채팅이나 네이버카페 등에서 <br />
              함께할 크루를 찾아보세요!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
