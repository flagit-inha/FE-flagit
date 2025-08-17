import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FullMapPage.css';

function FullMapPage({ userName = '홍길동' }) {
  const line1 = `${userName}님의`;
  const line2 = '기록';
  const ariaTitle = `${line1} ${line2}`;
  const navigate = useNavigate();

  const goWrite = () => {
    navigate('/record-write');
  };

  return (
    <div className="fullmap-container">
      <div className="top-bar">
        <img src="/img/flagit2.svg" alt="Flagit 로고" className="app-logo" draggable="false" />
        <h1 className="top-title" aria-label={ariaTitle}>
          <span className="title-line1">{line1}</span>
          <span className="title-line2">{line2}</span>
        </h1>
      </div>

      <div className="fullmap-content">
        <div className="map-area">
          <div className="geo-wrapper">
            <div className="geo-canvas">
              <img src="/img/main_map.svg" alt="대한민국 지도" className="geo-main" draggable="false" />
              <img src="/img/dokdo.svg" alt="독도" className="geo-dokdo" draggable="false" />
              <img src="/img/jeju.svg" alt="제주도" className="geo-jeju" draggable="false" />
              <img src="/img/cloud.svg" alt="" className="cloud cloud-top" />
              <img src="/img/cloud.svg" alt="" className="cloud cloud-middle" />
              <img src="/img/cloud.svg" alt="" className="cloud cloud-bottom" />
            </div>
          </div>
        </div>
      </div>

      <div className="map-footer">
        <div className="footer-flag">
          <img src="/img/running2.svg" alt="" className="footer-flag-icon" draggable="false" />
          <div className="footer-flag-text">내 누적 깃발</div>
        </div>
        <button
          type="button"
          className="add-button"
          aria-label="기록 추가"
          onClick={goWrite}
        >
          <img src="/img/plus.svg" alt="" aria-hidden="true" className="add-button-icon" draggable="false" />
        </button>
      </div>

      <div className="bottom-nav">
        <div className="nav-item active">
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item">
          <img src="/img/home.svg" alt="home" />
          <span>home</span>
        </div>
        <div className="nav-item">
          <img src="/img/mycrew.svg" alt="mycrew" />
          <span>mycrew</span>
        </div>
        <div className="nav-item">
          <img src="/img/my.svg" alt="my" />
          <span>my</span>
        </div>
      </div>
    </div>
  );
}
export default FullMapPage;