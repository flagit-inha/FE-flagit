import React , { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import WhiteBottomNav from '../../components/WhiteBottomNav'; // 하단 네비게이션 스타일

function MyPage() {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [crewInfo, setCrewInfo] = useState(null); // 크루 정보

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

  useEffect(() => {
    // 사용자 정보 API 호출
    axios.get('/users/') // 백엔드 API 엔드포인트
      .then((response) => {
        console.log('사용자 정보:', response.data); // 사용자 정보 콘솔 출력
        setUserInfo(response.data); // 사용자 정보 상태 업데이트
        setCrewInfo(response.data.crew_info); // 크루 정보 상태 업데이트
      })
      .catch((error) => {
        console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      });
  
    // 크루 정보 API 호출
    axios.get('/crews/{crew_id}/') // 백엔드 API 엔드포인트
      .then((response) => {
        console.log('크루 정보:', response.data); // 크루 정보 콘솔 출력
        setCrewInfo(response.data); // 크루 정보 상태 업데이트
      })
      .catch((error) => {
        console.error('크루 정보를 가져오는 중 오류 발생:', error);
      });
  }, []); // 컴포넌트가 마운트될 때 한 번 실행
  
  
    // 데이터 로딩 중 처리
    if (!userInfo || !crewInfo) {
      return <div>데이터를 불러오는 중...</div>;
    }
  

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
        <div className="profile-name">{userInfo.nickname}</div>
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
       <WhiteBottomNav />

    </div>
  );
}

export default MyPage;
