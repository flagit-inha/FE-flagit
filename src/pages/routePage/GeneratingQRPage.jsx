import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./GeneratingQRPage.css";

export default function GeneratingQRPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const certification_id = state?.certification_id;
  const text = state?.text || "단체 인증 완료! QR 발급 중...";

  useEffect(() => {
    if (!certification_id) {
      alert("잘못된 접근입니다.");
      nav(-1);
      return;
    }

    // ... (기존 상태 확인 로직)
  }, [certification_id, nav]);

  return (
    <div className="qrgen-screen">
      <div className="qrgen-content">
        {/* ✅ 뒤로가기 버튼 */}
        <button
          className="qrgen-back"
          aria-label="뒤로가기"
          onClick={() => nav(-1)}
        >
          ‹
        </button>

        <img className="qrgen-icon" src="/img/check.svg" alt="확인 아이콘" />
        <p className="qrgen-text">{text}</p>
      </div>
    </div>
  );
}
