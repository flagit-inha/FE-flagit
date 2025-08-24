import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import "./RouteViewPage.css";

export default function RouteViewPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const route = state?.route || [];
  const distanceKm = state?.distanceKm || 0;
  const mapRef = useRef(null);

  useEffect(() => {
    if (!window.kakao || !route.length) return;
    const { kakao } = window;
    const container = mapRef.current;

    const options = {
      center: new kakao.maps.LatLng(route[0].lat, route[0].lng),
      level: 4,
    };
    const map = new kakao.maps.Map(container, options);

    const path = route.map((p) => new kakao.maps.LatLng(p.lat, p.lng));
    const polyline = new kakao.maps.Polyline({
      path,
      strokeWeight: 5,
      strokeColor: "#3cbea5",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    });
    polyline.setMap(map);

    const bounds = new kakao.maps.LatLngBounds();
    path.forEach((p) => bounds.extend(p));
    map.setBounds(bounds);
  }, [route]);

  const onShopClick = () => {
    nav("/store-list");
  };

  const onEndClick = () => {
    nav("/fullmap"); // ✅ 종료 버튼 누르면 FullMapPage로 이동
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
        <div className="routeview-map" ref={mapRef}>
          {/* 플로팅 버튼: 상점 */}
          <button className="fab-shop" onClick={onShopClick}>
            <img src="/img/shop.svg" alt="Shop" />
          </button>

          {/* 종료 버튼 */}
          <button className="fab-end" onClick={onEndClick}>
            종료
          </button>
        </div>
      </div>
    </div>
  );
}
