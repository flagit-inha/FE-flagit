import React from 'react';
import './FullMapPage.css';

function FullMapPage() {
  return (
    <div className="fullmap-container">
      <div className="fullmap-content">
        <div className="fullmap-header">
          <h1>홍길동님의 기록</h1>
        </div>

        <div className="map-area">
          <div className="geo-wrapper">
            <div className="geo-canvas">
              {/* 메인 지도 (object 대신 img로 안정화) */}
              <img
                src="/img/main_map.svg"
                alt="대한민국 지도"
                className="geo-main"
                draggable="false"
              />

              {/* 독도 / 제주 */}
              <img src="/img/dokdo.svg" alt="독도" className="geo-dokdo" draggable="false" />
              <img src="/img/jeju.svg" alt="제주도" className="geo-jeju" draggable="false" />

              {/* 구름 */}
              <img src="/img/cloud.svg" alt="" className="cloud cloud-top" />
              <img src="/img/cloud.svg" alt="" className="cloud cloud-middle" />
              <img src="/img/cloud.svg" alt="" className="cloud cloud-bottom" />
            </div>
          </div>

          <div className="map-footer">
            <div className="footer-text">내 누적 기록: 13개</div>
            <button className="add-button" aria-label="기록 추가">+</button>
          </div>
        </div>
      </div>

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