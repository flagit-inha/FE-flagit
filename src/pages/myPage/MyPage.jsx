import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';

function MyPage() {
  const navigate = useNavigate();

  const handleCopyCode = () => {
    const inviteCode = "dj32fsx9"; // 복사할 초대 코드
    navigator.clipboard.writeText(inviteCode)
      .then(() => {
        alert("초대 코드가 복사되었습니다!"); // 복사 성공 시 알림
      })
      .catch(() => {
        alert("복사에 실패했습니다. 다시 시도해주세요."); // 복사 실패 시 알림
      });
  };

  return (
    <div className="myPage-container">

      {/* 상단바 */}
      <div className="myPage-header">
        <span></span>
        <span className="logout" onClick={()=>navigate('/landing')}>로그아웃</span>
      </div>

      {/* 프로필 */}
      <div className="profile-section">
        <div className="profile-image"></div>
        <div className="profile-name">홍길동</div>
        <div className="profile-badge">
          <img src='img/star.svg' onClick={()=>navigate('/level-list')} className='BB'></img> 러닝 마니아🔥</div>
        <div className="profile-message">오늘의 땀방울이 내일의 나를 만든다.</div>
      </div>

      {/* 그룹 */}
      <div className="crew-section">
        <div className="crew-box" >
        <img src="/img/person.svg" alt="사람모양" className="person-icon" />
          <span className="crew-name">빌려온 깃냥이</span>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-section">
        <div className="stat-card">
          <img src="/img/navigate.svg" alt="네비게이트모양" className="navigate-icon" />
          <div className="stat-number">7회</div>
          <div className="stat-label">누적 활동 횟수</div>
        </div>
        <div className="stat-card">
        <img src="/img/marker.svg" alt="marker" className="marker-icon" />
        <div className="stat-number">40Km</div>
          <div className="stat-label">누적 거리</div>
        </div>
        <div className="stat-card">
        <img src="/img/percent.svg" alt="%" className="percent-icon" />

          <div className="stat-number">11회</div>
          <div className="stat-label">누적 할인 횟수</div>
        </div>
      </div>

      {/* 초대코드 */}
      <div className="invite-section">
        <div className="invite-label">마이크루 초대코드</div>
        <div className="invite-code">
          <span>dj32fsx9</span>
          <img src="/img/ccopy.svg" alt="copy" className="copy-icon" onClick={handleCopyCode} />
        </div>
      </div>

       {/* 하단네비게이션 바 */}
       <div className="bottom-nav">
        <div className="nav-item active" >
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/fullmap')} >
          <img src="/img/home.svg" alt="home" />
          <span>home</span>
        </div>
        <div className="nav-item" onClick={() => window.location.href = '/mycrew'}>
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

export default MyPage;
