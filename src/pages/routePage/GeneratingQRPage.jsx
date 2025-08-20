import "./GeneratingQRPage.css";


export default function GeneratingQRPage() {
  return (
    <div className="qr-screen">
      <div className="qr-content">
        <img src={"/img/check.svg"} alt="체크" className="qr-icon" />
        <p className="qr-text">단체 인증 완료! QR 발급 중...</p>
      </div>
    </div>
  );
}
