import { useNavigate } from "react-router-dom";
import "./GroupVerificationPage.css";

export default function GroupVerificationPage() {
  const nav = useNavigate();

  return (
    <div className="gver-screen">
      <div className="gver-card">
        {/* 뒤로가기 */}
        <button
          className="gver-back"
          aria-label="뒤로가기"
          onClick={() => nav(-1)}
        >
          ‹
        </button>

        {/* 헤더 */}
        <h1 className="gver-title">단체 인증</h1>
        <p className="gver-desc">
          가게 근처에서 단체 인증을 완료하고
          <br />
          할인쿠폰을 발급받으세요
        </p>

        {/* 일러스트 (이미지는 public/img 안에 두고 경로만 맞춰줘) */}
        <img
          className="gver-illu"
          src="/img/map_person.svg"
          alt="단체 인증 일러스트"
        />

        {/* CTA */}
        <button className="gver-cta" onClick={() => nav("/qr")}>
          인증하기
        </button>
      </div>
    </div>
  );
}
