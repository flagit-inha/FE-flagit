import { useNavigate, useLocation } from "react-router-dom";
import "./QRPage.css";

export default function QRPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 나중에 서버/로컬에서 받은 QR 이미지 URL을 state로 넘겨줄 수 있어요.
  // 없으면 기본 더미 이미지 사용
  const qrSrc = state?.qrUrl || "/img/qr.svg";
  const title = state?.title || "QR 인증";
  const note  = state?.note  || "이 큐알은 30분 동안만 유효합니다";

  return (
    <div className="qrpage-screen">
      <div className="qrpage-card">
        <button className="qrpage-back" onClick={() => nav(-1)} aria-label="뒤로가기">‹</button>

        <h1 className="qrpage-title">{title}</h1>

        <div className="qrpage-box">
          {/* 지금은 이미지, 추후 캔버스/생성 QR로 교체 가능 */}
          <img className="qrpage-img" src={qrSrc} alt="QR code" />
        </div>

        <p className="qrpage-note">{note}</p>
      </div>
    </div>
  );
}
