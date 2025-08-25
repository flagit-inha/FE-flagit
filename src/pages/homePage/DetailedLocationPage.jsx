import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getRecord, deleteRecord } from '../../services/recordsService';
import WhiteBottomNav from '../../components/WhiteBottomNav';
import './RecordWritePage.css';
import './DetailedLocationPage.css';

function DetailedLocationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const stateImagesData = location.state?.imagesData || [];

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if(!id) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await getRecord(id);
        if(!cancelled) setRecord(data);
      } catch(e){
        console.error('record load fail', e);
      } finally {
        if(!cancelled) setLoading(false);
      }
    })();
    return ()=> { cancelled = true; };
  }, [id]);

  // 데이터 매핑: 백엔드 필드명에 맞게 값 추출
  const placeName = record?.activity_location?.location_name || record?.activity_location?.name || record?.location?.name || record?.place || '장소 미지정';
  const distanceValue = record?.distance_km ?? record?.activity_location?.location_distance ?? record?.distance ?? 0;
  const activityValue = record?.activity_type ?? record?.activity ?? '-';
  const dateValue = record?.date ?? (record?.activity_location?.visited_at ? record.activity_location.visited_at.split('T')[0] : '');
  const durationValue = record?.time_record ?? record?.duration ?? '00:00:00';
  const descriptionValue = record?.description ?? record?.activity_location?.description ?? record?.note ?? '';
  const crew = record?.crew_members ?? record?.crew ?? [];
  const imageUrls = record?.imageUrls ?? [];
  const previewUrl = record?.previewUrl ?? '';
  const groupPhotoUrl = record?.group_photo ?? '';
  const imagesMeta = record?.imagesMeta ?? [];
  const imagesData = record?.imagesData ?? [];
  const images = record?.images ?? [];
  const flagOrder = record?.flagOrder ?? '';
  const mediaMode = record?.mediaMode ?? '';
  const hashtags = record?.hashtags ?? '';

  const dateDot = useMemo(() => dateValue ? dateValue.replace(/-/g,'.') : '', [dateValue]);
  const noteBlock = [descriptionValue?.trim() || '', (hashtags||'').trim()].filter(Boolean).join('\n');

  // 등록된 이미지만 모두 보여주기
  const imagesToShow = [];
  if (groupPhotoUrl) imagesToShow.push(groupPhotoUrl);
  if (Array.isArray(imageUrls)) imagesToShow.push(...imageUrls);
  if (previewUrl) imagesToShow.push(previewUrl);

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

  const onDelete = async ()=>{
    if(deleting) return;
    setDeleting(true);
    try {
      await deleteRecord(id);
      navigate(`/fullmap/${record.user.id}`);
    } finally {
      setDeleting(false);
    }
  };

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

  return (
    <div className="rw-container">
      <header className="rw-header dlp-header">
        <button type="button" className="rw-back-btn" onClick={()=>navigate(-1)}>〈</button>
        <div className="dlp-header-text">
          <h1 className="rw-page-title dlp-page-title">
            {placeName}
          </h1>
          <div className="dlp-meta-line dlp-meta-in-header">
            <span className="dlp-activity">{activityValue}</span>
            <span className="dlp-dot">|</span>
            <span className="dlp-date">{dateDot}</span>
          </div>
        </div>
        <button
          type="button"
          className="dlp-del-btn"
          onClick={onDelete}
          aria-label="기록 삭제"
          disabled={deleting}
          style={deleting ? {opacity:.5, cursor:'default'}:{}}
        >{deleting ? '삭제중...' : '삭제'}</button>
      </header>

      <div className="rw-scroll">
        <div className="rw-block dlp-hero-block">
          <div className="dlp-hero-wrapper">
            {imagesToShow.length > 0 ? (
              imagesToShow.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`기록 이미지 ${idx + 1}`}
                  className="dlp-hero-img"
                  style={{ marginBottom: 8 }}
                />
              ))
            ) : (
              <div className="dlp-hero-fallback">
                이미지가 없습니다.
              </div>
            )}
          </div>
          <div className="dlp-stats-row">
            <div className="dlp-stat">{parseFloat(distanceValue||0).toFixed(2)}km</div>
            <div className="dlp-stat">{durationValue}</div>
            <div className="dlp-stat">{ordinal(flagOrder)}</div>
          </div>
        </div>

        <div className="rw-block dlp-crew-block">
          <h2 className="dlp-sec-title">나와 함께한 사람들</h2>
          <div className="dlp-crew-avatars">
            {crew.length
              ? crew.map((c, i) => (
                  <div key={i} className="dlp-avatar" title={c.nickname || String(c)}>
                    {c.profile_image ? (
                      <img
                        src={c.profile_image}
                        alt={c.nickname || '프로필'}
                        className="dlp-avatar-img"
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          objectFit: 'cover',
                          background: '#eee'
                        }}
                      />
                    ) : (
                      <span className="dlp-avatar-text">
                        {(c.nickname || String(c)).slice(0, 2)}
                      </span>
                    )}
                  </div>
                ))
              : [0, 1, 2].map(i => (
                  <div key={i} className="dlp-avatar dlp-avatar-empty" />
                ))
            }
          </div>
        </div>

        <div className="rw-block dlp-separator-block">
          <hr className="dlp-separator" />
        </div>

        <div className="rw-block dlp-note-block">
          <h2 className="dlp-sec-title">기록…</h2>
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

      <WhiteBottomNav />
    </div>
  );
}

export default DetailedLocationPage;