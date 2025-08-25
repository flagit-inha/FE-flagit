import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import "./GroupVerificationPage.css";

export default function GroupVerificationPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const { store_id, name } = state || {}; // StoreListPage에서 넘어온 값

  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!store_id) {
      alert("잘못된 접근입니다.");
      nav(-1);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/certifications/${store_id}/`, // ✅ 슬래시 꼭 붙이기!
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            // ✅ 테스트용 삼송빵집2 좌표
            lat: 37.48477874012599,
            lng: 127.03219573504444,
          }),
        }
      );

      // ✅ JSON 파싱 시 HTML 방지 (res.ok 체크 먼저)
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("서버에서 올바른 JSON이 오지 않았습니다: " + text);
      }

      console.log("✅ 단체 인증 응답:", data);

      if (res.ok) {
        // 👉 인증 성공 후 SearchingCrewsPage로 이동
        nav("/searching-crews", { state: data.certification });
      } else {
        alert(data.message || "인증 실패!");
      }
    } catch (err) {
      console.error(err);
      alert("인증 요청 중 오류 발생!");
    } finally {
      setLoading(false);
    }
  };

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
          선택한 가게 <strong>{name}</strong> 근처에서 단체 인증을 완료하고
          <br />
          할인쿠폰을 발급받으세요
        </p>

        {/* 일러스트 */}
        <img
          className="gver-illu"
          src="/img/map_person.svg"
          alt="단체 인증 일러스트"
        />

        {/* CTA */}
        <button className="gver-cta" onClick={handleVerify} disabled={loading}>
          {loading ? "인증 중..." : "인증하기"}
        </button>
      </div>
    </div>
  );
}
