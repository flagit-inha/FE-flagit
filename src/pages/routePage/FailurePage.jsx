import { useLocation, useNavigate } from "react-router-dom";
import "./FailurePage.css";

export default function FailurePage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 넘어오면 교체할 수 있는 문구들
  const title = state?.title || "조건이 충족되지 않았어요.";
  const hint  = state?.hint  || "3명 이상 모이면 자동 인증됩니다";

  const onRetry = () => {
    // 이전 화면으로 (필요시 특정 경로로 바꿔도 됨)
    if (state?.retryTo) nav(state.retryTo);
    else nav(-1);
  };

  return (
    <div className="fail-screen">
      <div className="fail-card">
        {/* 뒤로가기 */}
        <button
          className="fail-back"
          aria-label="뒤로가기"
          onClick={() => nav(-1)}
        >
          ‹
        </button>

        <div className="fail-content">
          {/* 실패 아이콘 (이미지) */}
          <img
            className="fail-icon"
            src="/img/check_outline.svg"
            alt="실패 표시"
          />

          {/* 문구 */}
          <p className="fail-title">{title}</p>
          <p className="fail-hint">{hint}</p>

          {/* CTA
          <button className="fail-cta" onClick={onRetry}>
            다시 시도
          </button> */}
        </div>
      </div>
    </div>
  );
}
