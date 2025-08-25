import { useLocation, useNavigate } from "react-router-dom";
import "./FailurePage.css";

export default function FailurePage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 👉 서버나 이전 페이지에서 전달된 메시지 활용
  const title = state?.title || "조건이 충족되지 않았어요.";
  const hint = state?.hint || "3명 이상 모이면 자동 인증됩니다.";
  const retryTo = state?.retryTo || "/store-list"; // 기본 재시도 경로

  const onRetry = () => {
    nav(retryTo, { state: state?.store }); // 이전 가게 정보 유지 가능
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
          {/* 실패 아이콘 */}
          <img
            className="fail-icon"
            src="/img/check_outline.svg" // 👉 실패 전용 아이콘으로 교체 추천
            alt="실패 표시"
          />

          {/* 메시지 */}
          <p className="fail-title">{title}</p>
          <p className="fail-hint">{hint}</p>

          {/* CTA */}
          <button className="fail-cta" onClick={onRetry}>
            다시 시도
          </button>
        </div>
      </div>
    </div>
  );
}
