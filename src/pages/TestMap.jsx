import { useEffect } from "react";

export default function TestMap() {
  useEffect(() => {
    const kakaoKey = import.meta.env.VITE_KAKAO_KEY;
    console.log("카카오 키:", kakaoKey);

    // 이미 로드된 경우 (중복 방지)
    if (window.kakao && window.kakao.maps) {
      console.log("✅ Kakao SDK 이미 로드됨");
      initMap();
      return;
    }

    // SDK 스크립트 추가
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
    script.async = true;
    script.onload = () => {
      console.log("✅ Kakao SDK 로드 완료");
      // autoload=false 옵션을 줬으므로 load() 안에서 지도 초기화
      window.kakao.maps.load(() => {
        console.log("✅ Kakao Maps 사용 가능");
        initMap();
      });
    };
    script.onerror = () => {
      console.error("❌ Kakao SDK 로드 실패");
    };
    document.head.appendChild(script);
  }, []);

  // 지도 초기화 함수
  const initMap = () => {
    const container = document.getElementById("map");
    if (!container) {
      console.error("❌ 지도 컨테이너를 찾을 수 없습니다.");
      return;
    }

    const options = {
      center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울시청 좌표
      level: 3, // 확대 레벨 (작을수록 확대)
    };

    new window.kakao.maps.Map(container, options);
  };

  return (
    <div>
      <h1>카카오 지도 테스트</h1>
      <div
        id="map"
        style={{ width: "100%", height: "400px", border: "1px solid black" }}
      ></div>
    </div>
  );
}
