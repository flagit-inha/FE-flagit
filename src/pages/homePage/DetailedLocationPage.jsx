import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecord } from '../../services/recordsService';
import './RecordWritePage.css';
import './DetailedLocationPage.css';

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

  const dateDot = useMemo(()=> record?.date ? record.date.replace(/-/g,'.') : '', [record]);

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
    imagesData,
    crew = []
  } = record;

  const imageCount = (imagesData?.length ?? imagesMeta?.length ?? 0);
  const hasImages = imageCount > 0;
  const showNoteModeBadge = !hasImages && mediaMode === 'note';

  const noteBlock = [ note?.trim() || '', (hashtags||'').trim() ]
    .filter(Boolean)
    .join('\n');

  return (
    <div className="rw-container dlp">
      <header className="rw-header dlp-fixed-header">
        <div className="dlp-head-inner">
          <button
            type="button"
            className="rw-back-btn"
            aria-label="뒤로가기"
            onClick={()=>navigate(-1)}
          >〈</button>
          <div className="dlp-head-center">
            <h1 className="rw-page-title dlp-place-title">{place || '장소 미지정'}</h1>
            <div className="dlp-meta-line">
              <span className="dlp-activity">{activity || '-'}</span>
              <span className="dlp-dot">|</span>
              <span className="dlp-date">{dateDot}</span>
            </div>
          </div>
          <div className="dlp-head-spacer" />
        </div>
      </header>

      <div className="rw-scroll dlp-scroll">
        {/* HERO */}
        <div className="rw-block dlp-hero-block">
          <div className="dlp-hero-box">
            {hasImages ? (
              <span className="dlp-hero-msg">
                이미지가 업로드되었습니다{imageCount>1 ? ` (총 ${imageCount}장)` : ''}.
              </span>
            ) : showNoteModeBadge ? (
              <span className="dlp-hero-msg note">기록 모드</span>
            ) : (
              <span className="dlp-hero-msg empty">이미지가 없습니다.</span>
            )}
          </div>
          <div className="dlp-stats-row">
            <div className="dlp-stat">{parseFloat(distance||0).toFixed(2)}km</div>
            <div className="dlp-stat">{duration || '00:00:00'}</div>
            <div className="dlp-stat">1st flag</div>
          </div>
        </div>

        {/* 크루 */}
        <div className="rw-block dlp-crew-block">
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
        </div>

        {/* 구분선 */}
        <div className="rw-block dlp-separator-block">
          <hr className="dlp-separator" />
        </div>

        {/* 노트 / 해시태그 */}
        <div className="rw-block dlp-note-block">
          <h2 className="dlp-sec-title">기록... 해시태그</h2>
          <div className="dlp-note-box">
            {noteBlock
              ? noteBlock.split('\n').map((line,i)=>
                  <p key={i} className="dlp-note-line">{line}</p>
                )
              : <p className="dlp-note-line dlp-note-empty">내용이 없습니다.</p>
            }
          </div>
        </div>

        <div style={{height:100}} />
      </div>

      <nav className="bottom-nav">
        <div className="nav-item"><img src="/img/route.svg" alt="route"/><span>route</span></div>
        <div className="nav-item active"><img src="/img/home.svg" alt="home"/><span>home</span></div>
        <div className="nav-item"><img src="/img/mycrew.svg" alt="mycrew"/><span>mycrew</span></div>
        <div className="nav-item"><img src="/img/my.svg" alt="my"/><span>my</span></div>
      </nav>
    </div>
  );
}

export default DetailedLocationPage;