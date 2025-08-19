import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getRecord } from '../../services/recordsService';
import './RecordWritePage.css';
import './DetailedLocationPage.css';

function DetailedLocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateImagesData = location.state?.imagesData || [];

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let alive = true;
    (async()=>{
      try {
        setLoading(true);
        const r = await getRecord(id);
        if(alive){
          if(!r.imagesData && stateImagesData.length){
            r.imagesData = stateImagesData;
          }
          setRecord(r);
        }
      } finally {
        if(alive) setLoading(false);
      }
    })();
    return ()=>{ alive = false; };
  },[id, stateImagesData]);

  const dateDot = useMemo(()=> record?.date ? record.date.replace(/-/g,'.') : '', [record]);

  if(loading){
    return (
      <div className="rw-container">
        <header className="rw-header dlp-header">
          <button type="button" className="rw-back-btn" onClick={()=>navigate(-1)}>〈</button>
          <div className="dlp-header-text">
            <h1 className="rw-page-title dlp-page-title">불러오는 중…</h1>
          </div>
        </header>
        <div className="rw-scroll" style={{padding:'40px 24px'}}>로딩...</div>
      </div>
    );
  }
  if(!record){
    return (
      <div className="rw-container">
        <header className="rw-header dlp-header">
          <button type="button" className="rw-back-btn" onClick={()=>navigate(-1)}>〈</button>
          <div className="dlp-header-text">
            <h1 className="rw-page-title dlp-page-title">기록 없음</h1>
          </div>
        </header>
        <div className="rw-scroll" style={{padding:'40px 24px'}}>데이터가 없습니다.</div>
      </div>
    );
  }

  const {
    place,
    activity,
    distance,
    duration,
    hashtags,
    mediaMode,
    note,
    imagesMeta = [],
    imagesData = [],
    imageUrls = [],
    previewUrl,
    crew = [],
    flagOrder,
    images = []
  } = record;

  // 실제 이미지 표시용(우선 URL 이 있는 경우만)
  const heroSrc = imageUrls[0] || previewUrl || null;

  // 개수 판단(원본 이미지를 실제로 로드하지 않아도 '등록 완료' 메시지 표시)
  const imageCount =
    imageUrls.length ||
    imagesMeta.length ||
    images.length ||
    imagesData.length ||
    (previewUrl ? 1 : 0);

  const hasDisplayableImage = !!heroSrc;     // 실제 보여줄 이미지가 있는지
  const hasAnyImage = imageCount > 0;        // 메타/데이터 상 등록된 이미지가 있는지

  const noteBlock = [note?.trim() || '', (hashtags||'').trim()].filter(Boolean).join('\n');

  const ordinal = (nRaw)=>{
    let n = Number(nRaw);
    if(!n || n < 1) n = 1;
    const k = n % 100;
    if(k >=11 && k <=13) return `${n}th flag`;
    switch (n % 10){
      case 1: return `${n}st flag`;
      case 2: return `${n}nd flag`;
      case 3: return `${n}rd flag`;
      default: return `${n}th flag`;
    }
  };

  return (
    <div className="rw-container">
      <header className="rw-header dlp-header">
        <button type="button" className="rw-back-btn" onClick={()=>navigate(-1)}>〈</button>
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
        <div className="rw-block dlp-hero-block">
          <div className="dlp-hero-wrapper">
            {hasDisplayableImage ? (
              <>
                <img src={heroSrc} alt="" className="dlp-hero-img" />
                {imageCount > 1 && <div className="dlp-img-count">+{imageCount - 1}</div>}
              </>
            ) : hasAnyImage ? (
              <div className="dlp-hero-fallback dlp-hero-fallback-done">
                이미지 {imageCount}장 등록 완료
              </div>
            ) : (
              <div className="dlp-hero-fallback">
                {mediaMode === 'note' ? '기록 모드 (이미지 없음)' : '이미지가 없습니다.'}
              </div>
            )}
          </div>
          <div className="dlp-stats-row">
            <div className="dlp-stat">{parseFloat(distance||0).toFixed(2)}km</div>
            <div className="dlp-stat">{duration || '00:00:00'}</div>
            <div className="dlp-stat">{ordinal(flagOrder)}</div>
          </div>
        </div>

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

        <div className="rw-block dlp-separator-block">
          <hr className="dlp-separator" />
        </div>

        <div className="rw-block dlp-note-block">
          <h2 className="dlp-sec-title">기록… 해시태그</h2>
          <div className="dlp-note-box">
            {noteBlock
              ? noteBlock.split('\n').map((line,i)=>
                <p key={i} className="dlp-note-line">{line}</p>
              )
              : <p className="dlp-note-line dlp-note-empty">내용이 없습니다.</p>
            }
          </div>
        </div>
        <div style={{height:40}} />
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