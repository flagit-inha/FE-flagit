import React from 'react';
import './MyCrewPage.css'; 
import { useNavigate } from 'react-router-dom';


function MyCrewPage() {
  const navigate = useNavigate();
  const handleFullMapClick = () => {
    navigate('/fullmap'); // 전체지도 페이지로 이동
  }
  const handleMemberClick = () => {
    navigate('/memberlist'); // 크루 회원 페이지로 이동
  };

  const handleWriteClick = () => {
    navigate('/create-notice');
  }

  const handleNoticeClick = () => {
    navigate('/notice-details'); // 공지사항 상세 페이지로 이동
  }

  const noticeList = [
    '크루 가입을 환영합니다! 크루 활동을 즐겨주세요.',
    '다음 주 모임은 오후 3시에 시작합니다.',
    '새로운 크루원을 모집합니다!',
    '이번 주말 등산 계획이 있습니다.',
    '크루 활동 사진을 공유해주세요!',
    '크루 활동에 대한 피드백을 주세요.',
    '크루 활동에 필요한 물품을 준비해주세요.',
    '다음 모임 장소는 중앙공원입니다.'
    
  ];

  return (
    <div>
      {/* 크루이미지 */}
      <img src="/img/crep.png" alt="mycrew" className="mycrew-icon" />


      {/* 크루프로필  */}
      <div className='crewProfile'>
        <img src="/img/Ellipse2.svg" className="profile-image" /> 
      </div>

      {/* 크루이름 */}
      <div className='crewName'>
        <span className='crewNameText'>빌려온 깃냥이 </span>
        <img src='/img/fxemoji_fire.svg' alt='crew' className='fireIcon' />
      </div>

      {/* 크루 총원 */}
      <div className='crewMemberCount'>
        <span className='memberCountText'>화이팅!!</span>
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
        <div className="nav-item" onClick={() => window.location.href = '/mycrew'}>
          <img src="/img/mycrew.svg" alt="mycrew" />
          
          <span>mycrew</span>
        </div>
        <div className="nav-item">
          <img src="/img/my.svg" alt="my" />
          <span>my</span>
        </div>
      </div>
    </div>
  );
}

export default MyCrewPage;