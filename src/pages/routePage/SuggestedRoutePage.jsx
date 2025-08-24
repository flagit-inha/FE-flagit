import { useNavigate, useLocation } from "react-router-dom";
import "./SuggestedRoutePage.css";

export default function SuggestedRoutePage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 🔹 LoadingPage에서 넘어온 값들
  const distanceKm = state?.distanceKm || 0;
  const route = state?.route || [];     // 좌표 배열
  const routeId = state?.routeId || null;

  // 거리 → 분 단위 환산 (러닝 기준: 1km ≈ 9분)
  const minutes = Math.max(10, Math.round(distanceKm * 9));

  // 지도 미리보기 이미지 (백에서 preview_url이 있으면 사용, 없으면 더미 이미지)
  const previewUrl = state?.preview_url || "/img/preview.svg";

  // 👉 "시작하기" 버튼 클릭 시 → RouteViewPage로 이동
  const onStart = () => {
    nav("/route-view", {
      state: {
        route,        // 좌표 배열
        routeId,      // id도 같이 넘김
        distanceKm,   // 목표 거리
      },
    });
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

        {/* 지도 미리보기 */}
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
