import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./RouteViewPage.css";

export default function RouteViewPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // 🔹 SuggestedRoutePage에서 넘어온 값
  const route = state?.route || [];        // 경로 좌표 배열
  const distanceKm = state?.distanceKm || 0;
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !route.length) return;
    const { kakao } = window;
    const container = mapRef.current;

    // ✅ 경로 시작점 기준으로 지도 생성
    const options = {
      center: new kakao.maps.LatLng(route[0].lat, route[0].lng),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);

    // ✅ 좌표 배열 → Polyline 그리기
    const path = route.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    const polyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#3cbea5",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

    // ✅ 지도 화면을 경로 전체로 맞추기
    const bounds = new kakao.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.setBounds(bounds);

    // ✅ 경로의 시작/끝에 마커 표시
    if (path.length > 0) {
      new kakao.maps.Marker({ position: path[0] }).setMap(map); // 시작점
      new kakao.maps.Marker({ position: path[path.length - 1] }).setMap(map); // 끝점
    }
  }, [route]);

  const onShopClick = () => {
    nav("/store-list");
  };

  const onEndClick = () => {
    nav("/fullmap"); // 종료 버튼 누르면 전체 지도 페이지로 이동
  };

  return (
    <div className="routeview-screen">
      <div className="routeview-card">
        {/* 뒤로가기 */}
        <button
          className="routeview-back"
          onClick={() => nav(-1)}
          aria-label="뒤로가기"
        >
          ‹
        </button>

        {/* 지도 */}
        <div className="routeview-map" ref={mapRef}></div>

        {/* 종료 버튼 */}
        <button className="fab-end" onClick={onEndClick}>
          종료
        </button>

        {/* 플로팅 버튼: 상점 */}
        <button className="fab-shop" onClick={onShopClick}>
          <img src="/img/shop.svg" alt="Shop" />
        </button>
      </div>
    </div>
  );
}
