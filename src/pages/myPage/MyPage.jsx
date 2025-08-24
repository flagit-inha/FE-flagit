import React , { useEffect, useState }  from 'react';
import { useNavigate } from 'react-router-dom';
import './MyPage.css';
import WhiteBottomNav from '../../components/WhiteBottomNav'; // 하단 네비게이션 스타일
import axios from 'axios';

function MyPage() {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const [loading, setLoading] = useState(true); // 로딩 상태
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보
  const [crewInfo, setCrewInfo] = useState(null); // 크루 정보
  const [badgeName, setBadgeName] = useState(''); // 배지 이름 상태
  const [selectedBadge, setSelectedBadge] = useState(''); // 선택된 배지 상태


  const [selectedFile, setSelectedFile] = useState(null); // 선택된 파일 상태
  const [previewUrl, setPreviewUrl] = useState(null); 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("token");
  
        // 사용자 정보 가져오기
        const userResponse = await axios.get(`${apiBaseUrl}/users/`, {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰 사용
          },
        });
  
        console.log('사용자 정보:', userResponse.data);
        setUserInfo(userResponse.data.user);
        setCrewInfo(userResponse.data.crew_info);



         // 배지 정보 가져오기
         const badgeResponse = await axios.get(`${apiBaseUrl}/users/badge/`, {
          headers: {
            Authorization: `Bearer ${token}`, // JWT 토큰 사용
          },
        });

        console.log('배지 정보:', badgeResponse.data);
        setBadgeName(badgeResponse.data.badgeㄴ); // 배지 이름 상태 업데이트




      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };
  
    fetchUserInfo();
  }, []);

  // 파일 선택 핸들러
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    console.log('선택된 파일:', file);

    if (file) {
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };


   // 데이터 로딩 중 처리
  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  // 사용자 정보가 없을 경우 처리
  if (!userInfo) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
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
        <div
          className="profile-image"
          onClick={() => document.getElementById('fileInput').click()} // 클릭 시 파일 선택 창 열기
        >
          {previewUrl ? (
            <img src={previewUrl} alt="미리보기" className="profile-preview" />
          ) : (
            '+'
          )}
        </div>
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }} // 파일 선택 창 숨기기
          onChange={handleFileChange}
        />



        <div className="profile-name">{userInfo.nickname}</div>
        <div className="profile-badge">
          <img src='../img/star.svg' onClick={() => navigate('/level-list')} className='BB'></img> {badgeName || '배지 없음'}
        </div>
      </div>
      {/* 그룹 */}
      <div className="crew-section">
        <div className="crew-box" >
        <img src="/img/person.svg" alt="사람모양" className="person-icon" />
          <span className="crew-name">{crewInfo.crewname}</span>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-section">
        <div className="stat-card">
          <img src="/img/navigate.svg" alt="네비게이트모양" className="navigate-icon" />
          <div className="stat-number">{userInfo.activities_count || 0}회</div>
          <div className="stat-label">누적 활동 횟수</div>
        </div>
        <div className="stat-card">
        <img src="/img/marker.svg" alt="marker" className="marker-icon" />
        <div className="stat-number">{userInfo.total_distance || 0}Km</div>
        <div className="stat-label">누적 거리</div>
        </div>
        <div className="stat-card">
        <img src="/img/percent.svg" alt="%" className="percent-icon" />
        <div className="stat-number">{userInfo.discounts_count || 0}회</div>
        <div className="stat-label">누적 할인 횟수</div>
        </div>
      </div>

              {/* 초대코드 */}
      <div className="invite-section">
        <div className="invite-label">마이크루 초대코드</div>
        <div className="invite-code">
          <span>{crewInfo?.invitecode || '코드 없음'}</span>
          <img
            src="/img/ccopy.svg"
            alt="copy"
            className="copy-icon"
            onClick={() => {
              navigator.clipboard.writeText(crewInfo?.invitecode || '');
              alert('초대 코드가 복사되었습니다!');
            }}
          />
        </div>
      </div>


       {/* 하단네비게이션 바 */}
       <WhiteBottomNav />

    </div>
  );
}

export default MyPage;
