import { useNavigate, useLocation } from "react-router-dom";
import "./SuggestedRoutePage.css";

export default function SuggestedRoutePage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 👉 거리 값을 그대로 표시 (없으면 undefined로 두고 기본처리)
  const distanceKm = state?.distanceKm;  

  // 시간 계산 (거리 * 9분, 최소 10분 보장)
  const minutes = distanceKm ? Math.max(10, Math.round(distanceKm * 9)) : 10;

  // 미리보기 이미지 (없으면 더미 이미지)
  const previewUrl = state?.preview_url || "/img/preview.svg";

  const onStart = () => {
    nav("/route-view", { state });
  };

  return (
    <div className="sugroute-screen">
      <div className="sugroute-card">
        <button
          className="sugroute-back"
          onClick={() => nav(-1)}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <div className="sugroute-head">
          <h1 className="sugroute-title">뛸 준비 되셨나요?</h1>
          <p className="sugroute-sub">Here is a route you might like.</p>
        </div>

        <div className="sugroute-map">
          <img src={previewUrl} alt="route preview" />
        </div>

        <div className="sugroute-meta">
          <span className="sugroute-icon" aria-hidden>
            <img src={"/img/running.svg"} alt="running icon" />
          </span>
          <div className="sugroute-stats">
            <div className="sugroute-distance">
              {distanceKm ? distanceKm.toFixed(1) : "0.0"} <span className="unit">km</span>
            </div>
            <div className="sugroute-time">{minutes} min</div>
          </div>
        </div>

        <button className="sugroute-cta" onClick={onStart}>
          시작하기
        </button>
      </div>
    </div>
  );
}
