import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./GeneratingQRPage.css";

export default function GeneratingQRPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 표시 문구 (필요시 호출할 때 state로 대체 가능)
  const text = state?.text || "단체 인증 완료! QR 발급 중...";

  // 필요하면 자동 이동 (원하면 주석 해제해서 사용)
  // useEffect(() => {
  //   const t = setTimeout(() => nav("/qr", { state }), 1500);
  //   return () => clearTimeout(t);
  // }, [nav, state]);

  return (
    <div className="qrgen-screen">
      <div className="qrgen-content">
        <img
          className="qrgen-icon"
          src="/img/check.svg"
          alt="확인 아이콘"
        />
        <p className="qrgen-text">{text}</p>
      </div>
    </div>
  );
}
