import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecordWritePage.css';
import { createRecord } from '../../services/recordsService';
import BottomNav from '../../components/BottomNav';

function RecordWritePage() {
  const navigate = useNavigate();

  const [place, setPlace] = useState('');
  const [activity, setActivity] = useState('');
  const [activityOpen, setActivityOpen] = useState(false);

  const [date, setDate] = useState(new Date().toISOString().slice(0,10));
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [dateTimeOpen, setDateTimeOpen] = useState(false);

  const [distance, setDistance] = useState('');
  const [crew, setCrew] = useState([]);

  const [hashtags, setHashtags] = useState('');
  const [files, setFiles] = useState([]);

  const [mediaMode, setMediaMode] = useState('photo');
  const [recordText, setRecordText] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const activities = [
    { key:'running', label:'러닝' },
    { key:'hiking',  label:'하이킹' },
    { key:'riding',  label:'라이딩' },
  ];

  const activityWrapperRef = useRef(null);
  useEffect(()=>{
    if(!activityOpen) return;
    const handler = e=>{
      if(activityWrapperRef.current && !activityWrapperRef.current.contains(e.target)){
        setActivityOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return ()=>document.removeEventListener('mousedown', handler);
  },[activityOpen]);

  const toggleActivityOpen = ()=>setActivityOpen(o=>!o);
  const chooseActivity = key => { setActivity(key); setActivityOpen(false); };
  const activityLabel = activity ? activities.find(a=>a.key===activity)?.label : '운동 종류를 선택하세요';

  const formatKTime = t => {
    if(!t) return '--:--';
    const [h,m] = t.split(':').map(Number);
    const period = h < 12 ? '오전':'오후';
    const h12 = (h % 12) === 0 ? 12 : (h % 12);
    return `${period} ${h12}:${String(m).padStart(2,'0')}`;
  };
  const dateDisplay = date.replace(/-/g,'.');

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

  const dateTimeDisplayRef = useRef(null);
  const dtPanelRef = useRef(null);
  const [panelRect, setPanelRect] = useState({top:0,left:0,width:0});
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

  const pickImages = e=>{
    const arr = Array.from(e.target.files||[]);
    setFiles(prev=>[...prev,...arr].slice(0,6));
  };
  const removeFile = i => setFiles(list=>list.filter((_,idx)=>idx!==i));

  const onDistanceChange = e=>{
    const val = e.target.value.replace(/[^\d.]/g,'');
    setDistance(val);
  };

  const handleHashtagChange = e=>{
    let v = e.target.value;
    const parts = v.split(/(\s+)/);
    v = parts.map(p=>{
      if(p === '' || /^\s+$/.test(p)) return p;
      if(p === '#') return p;
      return p.startsWith('#') ? p : '#'+p;
    }).join('');
    setHashtags(v);
  };

  // 장소 이름을 좌표로 변환 (요구사항: 올림픽공원 / 태백산 / 땅끝마을 외는 제주도)
  const resolveCoords = (raw='')=>{
    const name = raw.trim();
    if(!name) return { lat:33.4996, lng:126.5312, canonical:'제주도' };
    if(name.includes('올림픽공원')) return { lat:36.4163, lng:127.2215, canonical:'올림픽공원' };
    if(name.includes('태백산')) return { lat:36.1009, lng:128.5153, canonical:'태백산' };
    if(name.includes('땅끝마을')) return { lat:34.0980, lng:127.5233, canonical:'땅끝마을' };
    return { lat:33.4996, lng:126.5312, canonical:'제주도' };
  };

  const submit = async ()=>{
    if(submitting) return;
    setSubmitting(true);
    try {
      const coord = resolveCoords(place);
      const record = await createRecord({
        place,
        placeCanonical: coord.canonical,
        latitude: coord.lat,
        longitude: coord.lng,
        activity,
        date,
        timeStart,
        timeEnd,
        distance: distance || '0',
        duration: computedDuration || '00:00:00',
        crew,
        hashtags: hashtags.trim(),
        mediaMode,
        images: files,
        note: recordText
      });
      navigate(`/location/${record.id}`);
    } catch(e){
      alert('저장 실패: ' + (e.message || e));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rw-container">
      <header className="rw-header">
        <button type="button" className="rw-back-btn" aria-label="뒤로가기" onClick={()=>navigate(-1)}>〈</button>
        <h1 className="rw-page-title">기록 작성</h1>
        <button type="button" className="rw-save-btn" onClick={submit} disabled={submitting}>
          {submitting ? '저장 중...' : '저장하기'}
        </button>
      </header>

      <div className="rw-scroll">
        {/* 장소 검색 */}
        <div className="rw-block">
          <div className="rw-search-bar">
            <img src="/img/question.svg" alt="검색" className="rw-search-icon" />
            <input
              type="text"
              placeholder="장소를 검색하세요"
              value={place}
              onChange={e=>setPlace(e.target.value)}
            />
          </div>
        </div>

        {/* 활동 선택 */}
        <div className="rw-block rw-activity-block" ref={activityWrapperRef}>
          <div
            className={`rw-activity-selector ${activityOpen?'open':''} ${!activity?'placeholder':''}`}
            role="button"
            tabIndex={0}
            aria-haspopup="listbox"
            aria-expanded={activityOpen}
            onClick={toggleActivityOpen}
            onKeyDown={e=>{
              if(e.key==='Enter' || e.key===' ') { e.preventDefault(); toggleActivityOpen(); }
              if(e.key==='Escape') setActivityOpen(false);
            }}
          >
            <span className="rw-activity-text">{activityLabel}</span>
            <span className="rw-activity-arrow">›</span>
          </div>
          {activityOpen && (
            <div className="rw-activity-dropdown" role="listbox">
              {activities.map(a=>(
                <button
                  key={a.key}
                  type="button"
                  role="option"
                  aria-selected={activity===a.key}
                  className={`rw-activity-option ${activity===a.key?'selected':''}`}
                  onClick={()=>chooseActivity(a.key)}
                >
                  {a.label}
                  {activity===a.key && <span className="rw-activity-check">✓</span>}
                </button>
              ))}
            </div>
          )}
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

        {/* 크루원 선택 */}
        <div className="rw-block">
          <label className="rw-label rw-crew-label">크루원</label>
          <button
            type="button"
            className="rw-select-row"
            onClick={()=>alert('크루원 선택 모달 구현 예정')}
          >
            <span className="rw-select-placeholder">
              {crew.length ? `선택된 크루원 ${crew.length}명` : '크루원 추가'}
            </span>
            <span className="rw-row-arrow">›</span>
          </button>
        </div>

        {/* 사진 / 태그 / 기록 (토글) */}
        <div className="rw-block">
          <div className="rw-media-section">
            <div className="rw-subtitle">사진 / 태그 / 기록</div>

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

            <input
              className="rw-hashtag-input"
              placeholder="# 해시태그를 입력해보세요"
              value={hashtags}
              onChange={handleHashtagChange}
            />
          </div>
        </div>

        <div className="rw-bottom-gap" />
      </div>

      <BottomNav active="home" />

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
    </div>
  );
}

export default RecordWritePage;