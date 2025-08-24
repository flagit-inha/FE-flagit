import { useLocation, useNavigate } from "react-router-dom";
import "./SuggestedRoutePage.css";

export default function SuggestedRoutePage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 백엔드에서 전달받은 값
  const distanceKm = state?.distanceKm || 4.5;
  const minutes = Math.max(10, Math.round(distanceKm * 9));

  // 미리보기 이미지 (없으면 더미 이미지)
  const previewUrl = state?.preview_url || "/img/preview.svg";

  const onStart = () => {
    // 실제 지도 화면(RouteViewPage)으로 이동
    nav("/route-view", { state });
  };

  return (
    <div className="sugroute-screen">
      <div className="sugroute-card">
        {/* 뒤로가기 */}
        <button
          className="sugroute-back"
          onClick={() => nav(-1)}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        {/* 제목 */}
        <div className="sugroute-head">
          <h1 className="sugroute-title">뛸 준비 되셨나요?</h1>
          <p className="sugroute-sub">Here is a route you might like.</p>
        </div>

        {/* 지도 미리보기 (썸네일 이미지) */}
        <div className="sugroute-map">
          <img src={previewUrl} alt="route preview" />
        </div>

        {/* 거리/시간 요약 */}
        <div className="sugroute-meta">
          <span className="sugroute-icon" aria-hidden>
            <img src={"/img/running.svg"} alt="running icon" />
          </span>
          <div className="sugroute-stats">
            <div className="sugroute-distance">
              {distanceKm.toFixed(1)} <span className="unit">km</span>
            </div>
            <div className="sugroute-time">{minutes} min</div>
          </div>
        </div>

        {/* 시작하기 버튼 */}
        <button className="sugroute-cta" onClick={onStart}>
          시작하기
        </button>
      </div>
    </div>
  );
}
