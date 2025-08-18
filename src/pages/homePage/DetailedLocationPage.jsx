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

  if(loading) return <div className="rw-container"><div style={{padding:32}}>불러오는 중...</div></div>;
  if(!record) return (
    <div className="rw-container">
      <header className="rw-header">
        <button type="button" className="rw-back-btn" onClick={()=>navigate(-1)}>〈</button>
        <h1 className="rw-page-title dlp-page-title">상세</h1>
      </header>
      <div className="rw-scroll" style={{padding:32}}>기록 없음</div>
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
    imageUrls,
    previewUrl,
    crew = [],
    flagOrder
  } = record;

  const heroSrc = imageUrls?.[0] || imagesData?.[0] || previewUrl || null;
  const imageCount = (imageUrls?.length ?? imagesData?.length ?? imagesMeta?.length ?? 0);
  const hasImages = !!heroSrc;
  const noteBlock = [note?.trim() || '', (hashtags||'').trim()].filter(Boolean).join('\n');

  const ordinal = n=>{
    if(!n || n < 1) return '1st flag';
    const s = ['th','st','nd','rd'];
    const v = n % 100;
    const tail = (v - 20) % 10;
    const idx = (v===11||v===12||v===13)?0:(tail>=1&&tail<=3?tail:0);
    return `${n}${s[idx]} flag`;
  };

  return (
    <div className="rw-container">
      {/* 헤더: 장소 + (바로 아래) 운동종류 | 날짜 */}
      <header className="rw-header dlp-header">
        <button
          type="button"
          className="rw-back-btn"
          aria-label="뒤로가기"
          onClick={()=>navigate(-1)}
        >〈</button>
        <div className="dlp-header-text">
          <h1 className="rw-page-title dlp-page-title">{place || '장소 미지정'}</h1>
          <div className="dlp-meta-line dlp-meta-in-header">
            <span className="dlp-activity">{activity || '-'}</span>
            <span className="dlp-dot">|</span>
            <span className="dlp-date">{dateDot}</span>
          </div>
        </div>
      </header>

      <div className="rw-scroll">
        {/* (이전) 활동/날짜 블록 제거됨 */}
        {/* 사진 */}
        <div className="rw-block dlp-hero-block">
          <div className="dlp-hero-wrapper">
            {hasImages ? (
              <>
                <img src={heroSrc} alt="" className="dlp-hero-img" />
                {imageCount > 1 && <div className="dlp-img-count">+{imageCount - 1}</div>}
              </>
            ) : (
              <div className="dlp-hero-fallback">{mediaMode==='note' ? '기록 모드 (이미지 없음)' : '이미지가 없습니다.'}</div>
            )}
          </div>
          <div className="dlp-stats-row">
            <div className="dlp-stat">{parseFloat(distance||0).toFixed(2)}km</div>
            <div className="dlp-stat">{duration || '00:00:00'}</div>
            <div className="dlp-stat">{ordinal(flagOrder || 1)}</div>
          </div>
        </div>
        {/* ...existing code... */}

        {/* 함께한 사람들 */}
        <div className="rw-block dlp-crew-block">
          <h2 className="dlp-sec-title">나와 함께한 사람들</h2>
          <div className="dlp-crew-avatars">
            {crew.length
              ? crew.map((c,i)=>(
                  <div key={i} className="dlp-avatar" title={String(c)}>
                    <span className="dlp-avatar-text">{String(c).slice(0,2)}</span>
                  </div>
                ))
              : [0,1,2].map(i=> <div key={i} className="dlp-avatar dlp-avatar-empty" />)}
          </div>
        </div>

        {/* 구분선 */}
        <div className="rw-block dlp-separator-block">
          <hr className="dlp-separator" />
        </div>

        {/* 기록 / 해시태그 */}
        <div className="rw-block dlp-note-block">
          <h2 className="dlp-sec-title">기록... 해시태그</h2>
            <div className="dlp-note-box">
              {noteBlock
                ? noteBlock.split('\n').map((line,i)=><p key={i} className="dlp-note-line">{line}</p>)
                : <p className="dlp-note-line dlp-note-empty">내용이 없습니다.</p>
              }
            </div>
        </div>

        <div style={{height:40}} />
      </div>

      {/* 하단바 (RecordWritePage 동일) */}
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