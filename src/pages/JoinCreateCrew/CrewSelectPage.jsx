import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./CrewSelectPage.css";

export default function CrewSelectPage() {
  const nav = useNavigate();
  const [showHintBox, setShowHintBox] = useState(false);

  return (
    <div className="crewsel-screen">
      <div className="crewsel-card">
        {/* 뒤로가기 */}
        <button
          className="crewsel-back"
          aria-label="뒤로가기"
          onClick={() => nav(-1)}
        >
          ‹
        </button>

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
            onClick={() => nav("/join-crew")}
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
