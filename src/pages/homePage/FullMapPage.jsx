import React from 'react';
import './FullMapPage.css';

function FullMapPage() {
  return (
    <div className="fullmap-container">
      <div className="fullmap-content">
        <div className="fullmap-header">
          <h1>홍길동님의 기록</h1>
        </div>
        {/* 구름 이미지 삽입 */}
        <img src="/img/cloud.svg" alt="구름" className="cloud cloud-top" />
        <img src="/img/cloud.svg" alt="구름" className="cloud cloud-middle" />
        <img src="/img/cloud.svg" alt="구름" className="cloud cloud-bottom" />

        <div className="map-area">
          {/* 지도 SVG 삽입 */}
          <object 
            type="image/svg+xml" 
            data="/img/main_map.svg" 
            className="main-map-svg"
            aria-label="메인 지도"
          >
            대체 텍스트: 지도를 불러오는 중입니다.
          </object>
        </div>
        <div className="map-footer">
          <div className="footer-text">
            내 누적 기록: 13개
          </div>
          <button className="add-button">+</button>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="bottom-nav">
        <div className="nav-item">
          <img src="/img/route-icon.svg" alt="경로" />
          <span>경로</span>
        </div>
        <div className="nav-item">
          <img src="/img/home-icon.svg" alt="홈" />
          <span>홈</span>
        </div>
        <div className="nav-item">
          <img src="/img/mycrew-icon.svg" alt="내 크루" />
          <span>내 크루</span>
        </div>
        <div className="nav-item">
          <img src="/img/my-icon.svg" alt="내 정보" />
          <span>내 정보</span>
        </div>
      </div>
    </div>
  );
}

export default FullMapPage;