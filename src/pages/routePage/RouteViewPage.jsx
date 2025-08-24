import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./RouteViewPage.css";

export default function RouteViewPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // SuggestedRoutePage에서 넘겨받은 데이터
  const route = state?.route_path || [];
  const distanceKm = state?.distanceKm || 0;

  useEffect(() => {
    if (!window.kakao || !route.length) return;

    const container = document.getElementById("map");
    const options = {
      center: new window.kakao.maps.LatLng(route[0].lat, route[0].lng),
      level: 4,
    };
    const map = new window.kakao.maps.Map(container, options);

    // 경로 좌표 변환
    const path = route.map((p) => new window.kakao.maps.LatLng(p.lat, p.lng));

    // 폴리라인 추가
    const polyline = new window.kakao.maps.Polyline({
      path,
      strokeWeight: 6,
      strokeColor: "#3b82f6",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

    // 출발점 마커
    new window.kakao.maps.Marker({
      position: path[0],
      map,
      title: "출발",
    });

    // 도착점 마커
    new window.kakao.maps.Marker({
      position: path[path.length - 1],
      map,
      title: "도착",
    });

    // 경유지 마커들
    path.slice(1, -1).forEach((pos, idx) => {
      new window.kakao.maps.Marker({
        position: pos,
        map,
        title: `경유지 ${idx + 1}`,
      });
    });

    // 지도 범위 자동 설정
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.setBounds(bounds);
  }, [route]);

  const onShopClick = () => {
    nav("/store-list");
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

        {/* 지도 영역 */}
        <div className="routeview-map">
          <div className="map-canvas" id="map"></div>

          {/* 플로팅 버튼 */}
          <button className="fab-shop" onClick={onShopClick}>
            <img src="/img/shop.svg" alt="Shop" />
          </button>
        </div>
      </div>
    </div>
  );
}
