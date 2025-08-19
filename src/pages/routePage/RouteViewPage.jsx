import { useNavigate } from "react-router-dom";
import "./RouteViewPage.css";

export default function RouteViewPage() {
  const nav = useNavigate();

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

        {/* 지도 미리보기 */}
        <div className="routeview-map">
          {/* 프리뷰 이미지 */}
          <img
            src="/img/routemap.svg"
            alt="route preview"
            className="map-preview"
          />
          {/* 나중에 지도 SDK 붙일 div */}
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
