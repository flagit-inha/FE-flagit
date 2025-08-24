import React, { useEffect, useState } from 'react';
import './MyCrewPage.css'; 
import { useNavigate, useParams } from 'react-router-dom';

function MyCrewPage() {
  const navigate = useNavigate();
  const { crew_id } = useParams();
  const [crew, setCrew] = useState(null);

  useEffect(() => {
    // localStorage에 crew 정보가 있고 crew_id가 일치하면 사용
    const saved = JSON.parse(localStorage.getItem("mycrew") || "{}");
    if (saved.crew_id === crew_id) {
      setCrew(saved);
    } else {
      // 백엔드에서 crew_id로 크루 정보 조회 (예시)
      fetch(`${import.meta.env.VITE_API_BASE_URL}/crews/${crew_id}`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
        .then(res => res.json())
        .then(data => setCrew(data))
        .catch(() => setCrew(null));
    }
  }, [crew_id]);

  const handleFullMapClick = () => {
    navigate('/fullmap');
  };
  const handleMemberClick = () => {
    navigate('/memberlist');
  };
  const handleWriteClick = () => {
    navigate('/create-notice');
  };
  const handleNoticeClick = () => {
    navigate('/notice-details');
  };

  // 공지사항 예시 (실제 공지는 crew.noticeList 등으로 받아올 수 있음)
  const noticeList = crew?.noticeList || [
    '크루 가입을 환영합니다! 크루 활동을 즐겨주세요.',
    '다음 주 모임은 오후 3시에 시작합니다.',
    '새로운 크루원을 모집합니다!',
    '이번 주말 등산 계획이 있습니다.',
    '크루 활동 사진을 공유해주세요!',
    '크루 활동에 대한 피드백을 주세요.',
    '크루 활동에 필요한 물품을 준비해주세요.',
    '다음 모임 장소는 중앙공원입니다.'
  ];

  if (!crew) return <div>크루 정보를 불러오는 중...</div>;

  return (
    <div>
      {/* 크루이미지 */}
      <img src={crew.profile_image || "/img/crep.png"} alt="mycrew" className="mycrew-icon" />

      {/* 크루프로필 */}
      <div className='crewProfile'>
        <img src={crew.profile_image || "/img/Ellipse2.svg"} className="profile-image" alt="프로필" /> 
      </div>

      {/* 크루이름 */}
      <div className='crewName'>
        <span className='crewNameText'>{crew.crewname || crew.nicknamed || "크루명 없음"}</span>
        <img src='/img/fxemoji_fire.svg' alt='crew' className='fireIcon' />
      </div>

      {/* 크루 총원 */}
      <div className='crewMemberCount'>
        <span className='memberCountText'>
          {crew.member_count ? `멤버 ${crew.member_count}명` : "멤버 정보 없음"}
        </span>
      </div>

      {/* 공지 회원 선택 바 */}
      <div className='notic-member'> 
        <button className='noticeButton'>공지</button>
        <button className='memberButton' onClick={handleMemberClick}>회원</button>
        <span className='write'  onClick={handleWriteClick}>+글추가</span>
      </div>

      {/* 크루 공지사항 */}
      <div className='noticelist'>
        {noticeList.map((notice, index) => (
          <div key={index} className='noticeContent'>
            <div className='noticeContentText' onClick={handleNoticeClick}>{notice}</div>
          </div>
        ))}
      </div>

      {/* 하단네비게이션 바 */}
      <div className="bottom-nav">
        <div className="nav-item active" >
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item" onClick={handleFullMapClick} >
          <img src="/img/home.svg" alt="home" />
          <span>home</span>
        </div>
        <div className="nav-item" onClick={() => window.location.href = `/mycrew/${crew_id}`}>
          <img src="/img/mycrew.svg" alt="mycrew" />
          <span>mycrew</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/mypage')}>
          <img src="/img/my.svg" alt="my" />
          <span>my</span>
        </div>
      </div>
    </div>
  );
}

export default MyCrewPage;