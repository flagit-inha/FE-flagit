import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './FullMapPage.css';
import { listRecords } from '../../services/recordsService';
import BottomNav from '../../components/BottomNav';

const GEO_BOUNDS = {
  latMin: 33.0,
  latMax: 38.5,
  lngMin: 125.5,
  lngMax: 129.7
};

const ACTIVITY_ICON = {
  running: '/img/flag_running.svg',
  riding: '/img/flag_riding.svg',
  hiking: '/img/flag_hiking.svg'
};
const ACTIVITY_LABEL = {
  running: '러닝',
  riding: '라이딩',
  hiking: '하이킹'
};

function project(lat, lng) {
  const { latMin, latMax, lngMin, lngMax } = GEO_BOUNDS;
  if (typeof lat!=='number' || typeof lng!=='number' || !isFinite(lat) || !isFinite(lng)) return null;
  const clampedLat = Math.min(Math.max(lat, latMin), latMax);
  const clampedLng = Math.min(Math.max(lng, lngMin), lngMax);
  const xRatio = (clampedLng - lngMin) / (lngMax - lngMin);
  const yRatio = 1 - (clampedLat - latMin) / (latMax - latMin);
  return { left: xRatio * 100, top: yRatio * 100 };
}

function FullMapPage({ userName='홍길동' }) {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let alive = true;
    (async()=>{
      try {
        setLoading(true);
        const list = await listRecords();
        if(alive) setRecords(list);
      } finally {
        if(alive) setLoading(false);
      }
    })();
    return ()=>{ alive = false; };
  },[]);

  const projectedFlags = useMemo(()=> {
    return records
      .filter(r=> typeof r.latitude==='number' && typeof r.longitude==='number')
      .map(r=>{
        const p = project(r.latitude, r.longitude);
        if(!p) return null;
        const placeName = (r.place && r.place.trim()) ? r.place.trim() : '장소 미지정';
        return {
          id: r.id,
          place: placeName,
          activity: r.activity || 'running',
          date: r.date || '',
          ...p
        };
      })
      .filter(Boolean);
  },[records]);

  const coordCount = projectedFlags.length;
  const openRecord = id => navigate(`/location/${id}`);
  const goWrite = ()=> navigate('/record-write');

  const line1 = `${userName}님의`;
  const line2 = '기록';

  return (
    <div className="fullmap-container">
      <div className="top-bar">
        <img src="/img/flagit_logo2.svg" alt="Flagit 로고" className="app-logo" draggable="false" />
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

              <div className="map-flags" aria-hidden={loading}>
                {projectedFlags.map(f=>{
                  const icon = ACTIVITY_ICON[f.activity] || ACTIVITY_ICON.running;
                  const actLabel = ACTIVITY_LABEL[f.activity] || '러닝';
                  const dateText = f.date ? f.date.replace(/-/g,'.') : '';
                  return (
                    <div key={f.id} className="map-flag" style={{left:`${f.left}%`, top:`${f.top}%`}}>
                      <img src={icon} alt="" className="flag-icon" />
                      <div className="flag-card">
                        <div className="flag-place" title={f.place}>{f.place}</div>
                        <div className="flag-meta">
                          {actLabel}{dateText && <span className="flag-date">{dateText}</span>}
                        </div>
                        <button
                          type="button"
                          className="flag-view-btn"
                          onClick={()=>openRecord(f.id)}
                          aria-label={`${actLabel} 기록 상세 보기`}
                        >사진보기</button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="map-footer">
        <div className="footer-flag">
          <img src="/img/running2.svg" alt="" className="footer-flag-icon" draggable="false" />
          <div className="footer-flag-text">
            {loading ? '로딩 중' : `내 누적 깃발 ${coordCount}개`}
          </div>
        </div>
        <button type="button" className="add-button" aria-label="기록 추가" onClick={goWrite}>
          <img src="/img/plus.svg" alt="" aria-hidden="true" className="add-button-icon" draggable="false" />
        </button>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

export default FullMapPage;