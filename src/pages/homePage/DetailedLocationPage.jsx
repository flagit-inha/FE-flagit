import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecord } from '../../services/recordsService';
import './RecordWritePage.css';          // 공용 스타일 (rw-*)
import './DetailedLocationPage.css';      // 상세 전용 스타일 (dlp-*)

function DetailedLocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let alive = true;
    (async()=>{
      setLoading(true);
      const r = await getRecord(id);
      if(alive){
        setRecord(r);
        setLoading(false);
      }
    })();
    return ()=>{ alive = false; };
  },[id]);

  const dateDot = useMemo(()=>{
    if(!record?.date) return '';
    return record.date.replace(/-/g,'.');
  },[record]);

  if(loading) return <div className="rw-container" style={{padding:32}}>불러오는 중...</div>;
  if(!record) return (
    <div className="rw-container" style={{padding:32}}>
      <h2 style={{margin:'0 0 12px'}}>기록 없음</h2>
      <button onClick={()=>navigate(-1)}>뒤로</button>
    </div>
  );

  const {
    place,
    activity,
    distance,
    duration,
    hashtags,
    mediaMode,
    note,
    imagesMeta,
    crew = []
  } = record;

  const noteBlock = [
    note?.trim() || '',
    (hashtags||'').trim()
  ].filter(Boolean).join('\n');

  return (
    <div className="rw-container dlp">
      <header className="dlp-header">
        <button
          type="button"
          className="dlp-back"
          aria-label="뒤로가기"
          onClick={()=>navigate(-1)}
        >〈</button>
      </header>

      <div className="dlp-scroll">
        <section className="dlp-top">
          <h1 className="dlp-place">{place || '장소 미지정'}</h1>
          <div className="dlp-meta-line">
            <span className="dlp-activity">{activity || '-'}</span>
            <span className="dlp-dot">|</span>
            <span className="dlp-date">{dateDot}</span>
          </div>
        </section>

        <section className="dlp-hero">
          {mediaMode === 'photo' && imagesMeta?.length
            ? <div className="dlp-hero-img">
                <div className="dlp-hero-fallback">사진 {imagesMeta.length}개</div>
              </div>
            : mediaMode === 'note'
              ? <div className="dlp-hero-note-fallback">기록 모드</div>
              : <div className="dlp-hero-empty">사진 없음</div>
          }
          <div className="dlp-stats-row">
            <div className="dlp-stat">{parseFloat(distance||0).toFixed(2)}km</div>
            <div className="dlp-stat">{duration || '00:00:00'}</div>
            <div className="dlp-stat">1st flag</div>
          </div>
        </section>

        <section className="dlp-crew">
          <h2 className="dlp-sec-title">나와 함께한 사람들</h2>
            <div className="dlp-crew-avatars">
              {crew.length
                ? crew.map((c,i)=>(
                    <div key={i} className="dlp-avatar" title={String(c)}>
                      <span className="dlp-avatar-text">{String(c).slice(0,2)}</span>
                    </div>
                  ))
                : [0,1,2].map(i=> <div key={i} className="dlp-avatar dlp-avatar-empty" />)
              }
            </div>
        </section>

        <hr className="dlp-separator" />

        <section className="dlp-note">
          <h2 className="dlp-sec-title">기록... 해시태그</h2>
          <div className="dlp-note-box">
            {noteBlock
              ? noteBlock.split('\n').map((line,i)=><p key={i} className="dlp-note-line">{line}</p>)
              : <p className="dlp-note-line dlp-note-empty">내용이 없습니다.</p>
            }
          </div>
        </section>

        <div style={{height:90}} />
      </div>

      <nav className="bottom-nav">
        <div className="nav-item">
          <img src="/img/route.svg" alt="route"/><span>route</span>
        </div>
        <div className="nav-item active">
          <img src="/img/home.svg" alt="home"/><span>home</span>
        </div>
        <div className="nav-item">
          <img src="/img/mycrew.svg" alt="mycrew"/><span>mycrew</span>
        </div>
        <div className="nav-item">
          <img src="/img/my.svg" alt="my"/><span>my</span>
        </div>
      </nav>
    </div>
  );
}

export default DetailedLocationPage;