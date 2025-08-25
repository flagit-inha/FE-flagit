import { useNavigate, useLocation } from "react-router-dom";
import "./QRPage.css";

export default function QRPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // ✅ GroupVerificationPage → QRPage로 넘어온 인증 정보
  const status = state?.status;
  const coupon = state?.coupon;

  const title = "QR 인증";
  const note = "이 QR은 발급 후 30분 동안만 유효합니다.";

  // ✅ QR 이미지 URL 안전 처리
  const qrSrc = coupon?.qr_code_image
    ? coupon.qr_code_image.startsWith("http")
      ? coupon.qr_code_image
      : `${import.meta.env.VITE_API_BASE_URL}${coupon.qr_code_image}`
    : null;

  return (
    <div className="qrpage-screen">
      <div className="qrpage-card">
        {/* 뒤로가기 */}
        <button
          className="qrpage-back"
          onClick={() => nav(-1)}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        {/* 제목 */}
        <h1 className="qrpage-title">{title}</h1>

        {/* QR 영역 */}
        <div className="qrpage-box">
          {status === "pending" && <p>인증 진행 중입니다... ⏳</p>}
          {status === "completed" && qrSrc && (
            <img className="qrpage-img" src={qrSrc} alt="QR code" />
          )}
          {!status && <p>잘못된 접근입니다.</p>}
        </div>

        {/* 안내 문구 */}
        {status === "completed" && <p className="qrpage-note">{note}</p>}
      </div>
    </div>
  );
}
