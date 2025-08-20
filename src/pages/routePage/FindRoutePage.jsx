import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./FindRoutePage.css";

export default function FindRoutePage() {
  const nav = useNavigate();
  const [start, setStart] = useState("");
  const [distance, setDistance] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    if (!start || !distance) return alert("시작 장소와 목표 거리를 입력하세요!");
    // 여기서 실제 경로 계산 API 호출 가능
    console.log("출발지:", start, "목표거리:", distance);
  };

  return (
    <div className="find-screen">
      <div className="find-card">
        {/* 뒤로가기 */}
        <button
          className="find-back"
          onClick={() => nav(-1)}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1 className="find-title">
          어디로 갈까요? <br /> 시작 장소와 목표거리를 <br /> 입력해보세요
        </h1>

        <form className="find-form" onSubmit={onSubmit}>
          <label className="find-field">
            <span className="find-label">시작 장소</span>
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="예: 올림픽 공원역"
              className="find-input"
            />
          </label>

          <label className="find-field">
            <span className="find-label">목표 거리</span>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="예: 5 (km)"
              className="find-input"
              min="0"
            />
          </label>

          <button type="submit" className="find-cta">
            GET ROUTE
          </button>
        </form>
      </div>
    </div>
  );
}
