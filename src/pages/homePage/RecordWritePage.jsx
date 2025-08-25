import React, { useState, useEffect, useMemo, useRef } from 'react';
import './RecordWritePage.css';
import { useNavigate } from 'react-router-dom';
import WhiteBottomNav from '../../components/WhiteBottomNav';

function RecordWritePage() {
  // 상태 선언
  const [crewModalOpen, setCrewModalOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState([]);
  const [crewMembers, setCrewMembers] = useState([]);
  const [crewId, setCrewId] = useState('');
  const [placeId, setPlaceId] = useState('');
  const [place, setPlace] = useState('');
  const [locationOptions, setLocationOptions] = useState([]);
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [distance, setDistance] = useState('');
  const [files, setFiles] = useState([]);
  const [mediaMode, setMediaMode] = useState('photo');
  const [recordText, setRecordText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // 날짜 및 시간 선택 패널 관련 상태
  const [dateTimeOpen, setDateTimeOpen] = useState(false);
  const dateTimeDisplayRef = useRef(null);
  const dtPanelRef = useRef(null);
  const [panelRect, setPanelRect] = useState({top:0,left:0,width:0});

  // 내가 가입한 크루 id 가져오기
  useEffect(() => {
    const fetchMyCrewId = async () => {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiBaseUrl}/users/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.crew_info && data.crew_info.crew_id) {
          setCrewId(data.crew_info.crew_id);
        }
      }
    };
    fetchMyCrewId();
  }, []);

  // 크루원 목록 불러오기
  useEffect(() => {
    if (crewId) {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");
      fetch(`${apiBaseUrl}/crews/${crewId}/members/`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.ok ? res.json() : Promise.resolve({members: []}))
        .then(data => setCrewMembers(data.members || []));
    }
  }, [crewId]);

  // 장소 목록 불러오기
  const fetchLocations = async () => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const token = localStorage.getItem("token");
    const res = await fetch(`${apiBaseUrl}/users/location/`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) return;
    const data = await res.json();
    setLocationOptions(data);
  };

  // 날짜/시간 패널 위치 측정
  const measurePanel = ()=>{
    if(!dateTimeDisplayRef.current) return;
    const r = dateTimeDisplayRef.current.getBoundingClientRect();
    setPanelRect({ top:r.bottom+8, left:r.left, width:r.width });
  };
  useEffect(()=>{
    if(dateTimeOpen){
      measurePanel();
      const cb = ()=>measurePanel();
      window.addEventListener('resize', cb);
      window.addEventListener('scroll', cb, true);
      return ()=>{
        window.removeEventListener('resize', cb);
        window.removeEventListener('scroll', cb, true);
      };
    }
  },[dateTimeOpen]);

  // 패널 외부 클릭 시 닫기
  useEffect(()=>{
    if(!dateTimeOpen) return;
    const handler = e=>{
      if(
        dtPanelRef.current &&
        !dtPanelRef.current.contains(e.target) &&
        dateTimeDisplayRef.current &&
        !dateTimeDisplayRef.current.contains(e.target)
      ){
        setDateTimeOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return ()=>document.removeEventListener('mousedown', handler);
  },[dateTimeOpen]);

  // 시간 표시 포맷 함수
  const formatKTime = t => {
    if(!t) return '--:--';
    const [h,m] = t.split(':').map(Number);
    const period = h < 12 ? '오전':'오후';
    const h12 = (h % 12) === 0 ? 12 : (h % 12);
    return `${period} ${h12}:${String(m).padStart(2,'0')}`;
  };
  const dateDisplay = date.replace(/-/g,'.');

  // 거리 입력
  const onDistanceChange = e => {
    const val = e.target.value.replace(/[^\d.]/g,'');
    setDistance(val);
  };

  // 자동 소요시간 계산
  const computedDuration = useMemo(()=>{
    if(!timeStart || !timeEnd) return '';
    const [sh,sm] = timeStart.split(':').map(Number);
    const [eh,em] = timeEnd.split(':').map(Number);
    const start = sh*60+sm;
    const end = eh*60+em;
    if(end < start) return '';
    const diff = end - start;
    const h = String(Math.floor(diff/60)).padStart(2,'0');
    const m = String(diff % 60).padStart(2,'0');
    return `${h}:${m}:00`;
  },[timeStart,timeEnd]);
  
  function getDurationString(start, end) {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const startSec = sh * 3600 + sm * 60;
  const endSec = eh * 3600 + em * 60;
  let diff = endSec - startSec;
  if (diff < 0) return '';
  const h = String(Math.floor(diff / 3600)).padStart(2, '0');
  const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
  const s = String(diff % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

  // 이미지 선택/삭제
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
  const pickImages = e => {
    const arr = Array.from(e.target.files || []);
    const filtered = arr.filter(file => file.size <= MAX_FILE_SIZE);
    if (filtered.length < arr.length) {
      alert('이미지 파일은 2MB 이하만 업로드할 수 있습니다.');
    }
    setFiles(prev => [...prev, ...filtered].slice(0, 6));
  };
  const removeFile = i => setFiles(list => list.filter((_,idx)=>idx!==i));

  // 기록 저장
  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
      const token = localStorage.getItem("token");

      // crew_members만 JSON 배열로 보내고, 나머지는 FormData로 유지
      const formData = new FormData();
      formData.append('location_id', Number(placeId));
      formData.append('location_name', place);
      formData.append('activity_type', activity);
      formData.append('date', date);
      formData.append('distance_km', Number(distance));
      formData.append('time_record', getDurationString(timeStart, timeEnd));
      formData.append('description', recordText);

      // crew_members를 JSON 배열 문자열로 전송
      selectedCrew.map(Number).forEach(id => formData.append('crew_members', id));

      if (files.length > 0) {
        formData.append('group_photo', files[0]);
      }

      const res = await fetch(`${apiBaseUrl}/users/flag/`, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`
          // Content-Type은 FormData 사용 시 자동 처리
        },
        body: formData
      });
      if (!res.ok) throw new Error('저장 실패');
      alert('저장 완료!');
    } catch (e) {
      console.log({
        location_id: Number(placeId),
        location_name: place,
        activity_type: activity,
        date,
        distance_km: Number(distance),
        time_record: getDurationString(timeStart, timeEnd),
        crew_members: selectedCrew.map(Number),
        description: recordText,
        group_photo: files[0]
      });
      alert(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rw-container">
      <header className="rw-header">
        <button
          type="button"
          className="rw-back-btn"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
        >〈</button>
        <h1 className="rw-page-title">기록 작성</h1>
        <button type="button" className="rw-save-btn" onClick={submit} disabled={submitting}>
          {submitting ? '저장 중...' : '저장하기'}
        </button>
      </header>

      <div className="rw-scroll">
        {/* 장소 드롭다운 */}
        <div className="rw-block">
          <div style={{position:'relative', width:'100%'}}>
            <img src="/img/question.svg" alt="검색" className="rw-search-icon" style={{
              position: 'absolute', left: 28, top: '50%', transform: 'translateY(-50%)', zIndex: 2
            }} />
            <select
              id="rw-location-select"
              className="rw-location-select"
              style={{paddingLeft: 44}}
              value={placeId}
              onChange={e => {
                const selected = locationOptions.find(loc => String(loc.id) === e.target.value);
                setPlaceId(e.target.value);
                setPlace(selected ? selected.location_name : '');
                setDistance(selected ? selected.location_distance : '');
              }}
              onFocus={() => {
                if (!locationOptions.length) fetchLocations();
              }}
            >
              <option value="">장소를 선택하세요</option>
              {locationOptions.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.location_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 활동 종류 선택 */}
        <div className="rw-block">
          <select
            className="rw-activity-select"
            value={activity}
            onChange={e => setActivity(e.target.value)}
          >
            <option value="">운동 종류를 선택하세요</option>
            <option value="running">러닝</option>
            <option value="hiking">하이킹</option>
            <option value="riding">라이딩</option>
          </select>
        </div>

        {/* 날짜 + 시간 */}
        <div className="rw-block rw-datetime-block">
          <div
            ref={dateTimeDisplayRef}
            className={`rw-datetime-display ${dateTimeOpen?'open':''}`}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-expanded={dateTimeOpen}
            onClick={()=>setDateTimeOpen(o=>!o)}
            onKeyDown={e=>{
              if(e.key==='Enter' || e.key===' ') { e.preventDefault(); setDateTimeOpen(o=>!o); }
              if(e.key==='Escape') setDateTimeOpen(false);
            }}
          >
            <span className="rw-date-text">{dateDisplay}</span>
            <span className="rw-time-text">
              {formatKTime(timeStart)} - {formatKTime(timeEnd)}
            </span>
          </div>
        </div>

        {/* 날짜 및 시간 선택 패널 */}
        {dateTimeOpen && (
          <>
            <div className="rw-datetime-backdrop" />
            <div
              ref={dtPanelRef}
              className="rw-datetime-panel rw-datetime-panel-fixed"
              style={{top:panelRect.top, left:panelRect.left, width:panelRect.width}}
            >
              <label className="rw-dtp-row">
                <span className="rw-dtp-label">날짜</span>
                <input
                  type="date"
                  value={date}
                  onChange={e=>setDate(e.target.value)}
                />
              </label>
              <div className="rw-dtp-row rw-dtp-row-col">
                <span className="rw-dtp-label">시간</span>
                <div className="rw-time-edit-col">
                  <label className="rw-time-line">
                    <span className="rw-time-sub">시작</span>
                    <input
                      type="time"
                      value={timeStart}
                      onChange={e=>setTimeStart(e.target.value)}
                    />
                  </label>
                  <label className="rw-time-line">
                    <span className="rw-time-sub">종료</span>
                    <input
                      type="time"
                      value={timeEnd}
                      onChange={e=>setTimeEnd(e.target.value)}
                    />
                  </label>
                </div>
              </div>
              <div className="rw-dtp-actions">
                <button
                  type="button"
                  className="rw-btn-small"
                  onClick={()=>setDateTimeOpen(false)}
                >확인</button>
              </div>
            </div>
          </>
        )}

        {/* 기록 (거리 + 자동 소요시간) */}
        <div className="rw-block rw-stats">
          <div className="rw-field rw-field-record">
            <label className="rw-label rw-record-label">기록</label>
            <div className="rw-record-row">
              <div className="rw-distance-wrap">
                <input
                  className="rw-distance-input"
                  inputMode="decimal"
                  value={distance}
                  onChange={onDistanceChange}
                  placeholder="0"
                />
                <span className="rw-distance-unit">km</span>
              </div>
              <div
                className={`rw-auto-duration ${computedDuration ? 'filled':''}`}
                aria-label="자동 소요 시간"
                title="시작~종료 시간 차이"
              >
                {computedDuration || '00:00:00'}
              </div>
            </div>
          </div>
        </div>

        {/* 크루원 추가 버튼 */}
        <div className="rw-block">
          <label className="rw-label rw-crew-label">크루원</label>
          <button
            type="button"
            className="rw-select-row"
            onClick={() => setCrewModalOpen(true)}
          >
            <span className="rw-select-placeholder">
              {selectedCrew.length ? `선택된 크루원 ${selectedCrew.length}명` : '크루원 추가'}
            </span>
            <span className="rw-row-arrow">›</span>
          </button>
        </div>

        {/* 크루원 선택 모달 */}
        {crewModalOpen && (
          <div className="rw-modal-backdrop">
            <div className="rw-modal">
              <div className="rw-modal-title">크루원 선택</div>
              <div className="rw-modal-list">
                {crewMembers.map(member => (
                  <label key={member.user_id} className="rw-modal-item">
                    <input
                      type="checkbox"
                      checked={selectedCrew.includes(String(member.user_id))}
                      onChange={e => {
                        if (e.target.checked) {
                          setSelectedCrew([...selectedCrew, String(member.user_id)]);
                        } else {
                          setSelectedCrew(selectedCrew.filter(id => id !== String(member.user_id)));
                        }
                      }}
                    />
                    <span>{member.nickname}</span>
                  </label>
                ))}
              </div>
              <button
                type="button"
                className="rw-modal-confirm"
                onClick={() => setCrewModalOpen(false)}
              >확인</button>
            </div>
          </div>
        )}

        {/* 사진 / 기록 */}
        <div className="rw-block">
          <div className="rw-media-section">
            <div className="rw-subtitle">사진 / 기록</div>
            <div className="rw-media-toggle" role="tablist" aria-label="사진 또는 기록 선택">
              <button
                type="button"
                role="tab"
                aria-selected={mediaMode==='photo'}
                className={`rw-toggle-btn ${mediaMode==='photo'?'active':''}`}
                onClick={()=>setMediaMode('photo')}
              >사진</button>
              <button
                type="button"
                role="tab"
                aria-selected={mediaMode==='note'}
                className={`rw-toggle-btn ${mediaMode==='note'?'active':''}`}
                onClick={()=>setMediaMode('note')}
              >기록</button>
            </div>
            {mediaMode === 'photo' && (
              <div className="rw-media-box">
                <div className="rw-media-grid">
                  {files.map((f,i)=>(
                    <div className="rw-thumb" key={i}>
                      <img src={URL.createObjectURL(f)} alt="" />
                      <button
                        type="button"
                        className="rw-thumb-del"
                        aria-label="삭제"
                        onClick={()=>removeFile(i)}
                      >×</button>
                    </div>
                  ))}
                  {files.length < 6 && (
                    <label className="rw-add-thumb">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={pickImages}
                      />
                      +
                    </label>
                  )}
                </div>
              </div>
            )}
            {mediaMode === 'note' && (
              <div className="rw-note-box">
                <textarea
                  className="rw-record-textarea"
                  placeholder="기록을 작성하세요"
                  value={recordText}
                  onChange={e=>setRecordText(e.target.value)}
                  rows={6}
                />
              </div>
            )}
          </div>
        </div>
        <div className="rw-bottom-gap" />
      </div>
      <WhiteBottomNav />
    </div>
  );
}

export default RecordWritePage;