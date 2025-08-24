import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FindRoutePage.css";

export default function FindRoutePage() {
  const nav = useNavigate();
  const [start, setStart] = useState(""); // 시작 장소 (주소/지명)
  const [distance, setDistance] = useState(""); // 목표 거리 (km)
  const [kakaoLoaded, setKakaoLoaded] = useState(false);

  // 1. 카카오 SDK 동적 로드
  useEffect(() => {
    if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
      setKakaoLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_KEY
    }&autoload=false&libraries=services`; // 🔑 services 꼭 포함
    script.async = true;
    script.onload = () => {
      window.kakao.maps.load(() => {
        console.log("✅ Kakao Maps SDK Loaded with services");
        setKakaoLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  // 2. 제출 처리
  const onSubmit = (e) => {
    e.preventDefault();
    if (!start || !distance) {
      return alert("시작 장소와 목표 거리를 입력하세요!");
    }

    if (!window.kakao || !window.kakao.maps || !window.kakao.maps.services) {
      alert("카카오 지도 SDK가 아직 로드되지 않았습니다!");
      return;
    }

    // 주소 → 좌표 변환
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.addressSearch(start, async (result, status) => {
      if (status !== window.kakao.maps.services.Status.OK) {
        alert("주소를 찾을 수 없습니다!");
        return;
      }

      const lat = parseFloat(result[0].y);
      const lng = parseFloat(result[0].x);

      try {
        // 백엔드 경로 추천 API 호출
        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/routes/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              start_lat: lat,
              start_lng: lng,
              target_distance: parseFloat(distance), // km 단위
            }),
          }
        );

        if (!res.ok) throw new Error("경로 추천 실패");
        const data = await res.json();
        console.log("✅ 경로 추천 응답:", data);

        // 추천 경로 페이지로 이동 (응답 데이터 state로 전달)
        nav("/suggested-route", { state: data.data });
      } catch (err) {
        console.error(err);
        alert("경로 요청 중 오류 발생!");
      }
    });
  };

  return (
    <div className="find-screen">
      <div className="find-card">
        {/* 뒤로가기 */}
        <button
          className="find-back"
          onClick={() => nav(-1)}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        <h1 className="find-title">
          어디로 갈까요? <br /> 시작 장소와 목표거리를 <br /> 입력해보세요
        </h1>

        <form className="find-form" onSubmit={onSubmit}>
          <label className="find-field">
            <span className="find-label">시작 장소</span>
            <input
              type="text"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              placeholder="예: 올림픽 공원역"
              className="find-input"
            />
          </label>

          <label className="find-field">
            <span className="find-label">목표 거리 (km)</span>
            <input
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              placeholder="예: 5"
              className="find-input"
              min="0"
            />
          </label>

          <button type="submit" className="find-cta" disabled={!kakaoLoaded}>
            {kakaoLoaded ? "GET ROUTE" : "지도 로딩중..."}
          </button>
        </form>
      </div>
    </div>
  );
}
