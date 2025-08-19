import { useLocation, useNavigate } from "react-router-dom";
import "./SuggestedRoutePage.css";

export default function SuggestedRoutePage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 이전 페이지(FindRoutePage)에서 넘어온 값
  const distanceKm = Number(state?.distance) || 4.5; // km
  // 간단한 예상 시간(분) — 러닝 9min/km 가정, 최소 10분
  const minutes = Math.max(10, Math.round(distanceKm * 9));

  // 미리보기용 이미지(나중에 지도 스냅샷/캡쳐 url로 교체 가능)
  const preview = state?.routePreviewUrl || "/img/route_preview_dummy.png";

  const onStart = () => {
    // TODO: 실제 러닝/네비 화면으로 이동
    nav("/route-view", { state: { distanceKm } });
  };

  return (
    <div className="sugroute-screen">
      <div className="sugroute-card">
        <button className="sugroute-back" onClick={() => nav(-1)} aria-label="뒤로가기">
          ‹
        </button>

        <div className="sugroute-head">
          <h1 className="sugroute-title">뛸 준비 되셨나요?</h1>
          <p className="sugroute-sub">Here is a route you might like.</p>
        </div>

        {/* 지도 미리보기(플레이스홀더) */}
        <div className="sugroute-map">
          {/* 이미지 프리뷰 */}
          <img src={"/img/preview.svg"} alt="route preview" />
          {/* 나중에 지도 연동 시, 이 div 안에 Map 컴포넌트 삽입 */}
        </div>

        {/* 거리/시간 요약 */}
        <div className="sugroute-meta">
          <span className="sugroute-icon" aria-hidden><img src={"/img/running.svg"} alt="route preview" /></span>
          <div className="sugroute-stats">
            <div className="sugroute-distance">
              {distanceKm.toFixed(1)} <span className="unit">km</span>
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
