import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

function unproject(leftPercent, topPercent) {
  const { latMin, latMax, lngMin, lngMax } = GEO_BOUNDS;
  const lng = lngMin + (lngMax - lngMin) * (leftPercent / 100);
  const lat = latMin + (latMax - latMin) * (1 - topPercent / 100);
  return { lat, lng };
}

function FullMapPage() {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const myUserId = localStorage.getItem("user_id");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // 깃발 선택 모드
  const [flags, setFlags ] = useState([]);
  const [selectingFlag, setSelectingFlag] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState(null);

  useEffect(()=>{
    if (user_id !== myUserId) {
      alert("본인 기록만 볼 수 있습니다.");
      navigate(`/fullmap/${myUserId}`);
      return;
    }
    let alive = true;
    (async()=>{
      try {
        setLoading(true);
        const list = await listRecords();
        if (alive) setRecords(Array.isArray(list) ? list : []);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return ()=>{ alive = false; };
  },[user_id, myUserId, navigate]);

  // 기록의 flag_lat, flag_lng를 사용해서 지도에 깃발 표시
  const projectedFlags = useMemo(()=> {
    return records
      .filter(r=> typeof r.flag_lat==='number' && typeof r.flag_lng==='number')
      .map(r=>{
        const p = project(r.flag_lat, r.flag_lng);
        if(!p) return null;
        // 장소명 추출 로직 수정
        const placeName =
          r.activity_location?.location_name ||
          r.activity_location?.name ||
          r.location_name ||
          r.location?.name ||
          '장소 미지정';
        return {
          id: r.id,
          place: placeName,
          activity: r.activity_type || 'running',
          date: r.date || '',
          ...p
        };
      })
      .filter(Boolean);
  },[records]);

  const coordCount = projectedFlags.length;
  const openRecord = id => navigate(`/location/${id}`);

  // +버튼 클릭 시 지도에서 위치 선택 모드 진입
  const startFlagSelect = () => {
    setSelectingFlag(true);
    setSelectedFlag(null);
  };

  // 지도 클릭 시 좌표 계산
  const handleMapClick = (e) => {
    if (!selectingFlag) return;
    const mapArea = e.currentTarget;
    const rect = mapArea.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const leftPercent = (x / rect.width) * 100;
    const topPercent = (y / rect.height) * 100;
    setSelectedFlag({ left: leftPercent, top: topPercent });
  };

  // 깃발 위치 확정 후 기록 작성 페이지로 이동
  const confirmFlag = () => {
    if (!selectedFlag) return;
    const { lat, lng } = unproject(selectedFlag.left, selectedFlag.top);
    navigate(`/record-write?flag_lat=${lat}&flag_lng=${lng}`);
    setSelectingFlag(false);
    setSelectedFlag(null);
  };

  // 선택 취소
  const cancelFlag = () => {
    setSelectingFlag(false);
    setSelectedFlag(null);
  };

  useEffect(() => {
    const fetchFlags = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/users/flag/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setFlags(data);
      }
    };
    fetchFlags();
  }, []);

  const nickname = localStorage.getItem("nickname") || "사용자";
  const line1 = `${nickname}님의`;
  const line2 = '기록';
  const ariaTitle = `${line1} ${line2}`;

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
        <div className="map-area" onClick={handleMapClick} style={{cursor: selectingFlag ? 'crosshair' : 'default'}}>
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
                      <img src={icon} alt="" className="flag-icon" draggable="false" />
                      <div className="flag-card">
                        <div className="flag-place" title={f.place}>{f.place}</div>
                        <div className="flag-meta">
                          <span>{actLabel}</span>
                          {dateText && <span className="flag-date">{dateText}</span>}
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
                {/* 선택 중인 깃발 미리보기 */}
                {selectingFlag && selectedFlag && (
                  <div className="map-flag new-flag" style={{left:`${selectedFlag.left}%`, top:`${selectedFlag.top}%`}}>
                    <img src="/img/flag_running.svg" alt="새 깃발" className="flag-icon" draggable="false" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* 깃발 선택 안내 및 확인/취소 버튼 */}
        {selectingFlag && (
          <div className="flag-select-bar">
            <span>
              {selectedFlag
                ? '깃발을 꽂으시겠습니까?'
                : '클릭해서 깃발을 꽂으세요.'}
            </span>
            <div className="flag-select-actions">
              <button type="button" className="flag-confirm-btn" disabled={!selectedFlag} onClick={confirmFlag}>확인</button>
              <button type="button" className="flag-cancel-btn" onClick={cancelFlag}>취소</button>
            </div>
          </div>
        )}
      </div>

      <div className="map-footer">
        <div className="footer-flag">
          <img src="/img/running2.svg" alt="" className="footer-flag-icon" draggable="false" />
          <div className="footer-flag-text">
            {loading ? '로딩 중' : `내 누적 깃발 ${coordCount}개`}
          </div>
        </div>
        <button
          type="button"
          className="add-button"
          aria-label="기록 추가"
          onClick={startFlagSelect}
        >
          <img src="/img/plus.svg" alt="" aria-hidden="true" className="add-button-icon" draggable="false" />
        </button>
      </div>
      <BottomNav active="home" />
    </div>
  );
}

export default FullMapPage;