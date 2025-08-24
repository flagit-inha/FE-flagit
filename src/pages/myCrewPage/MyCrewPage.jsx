
import React , { useState , useEffect}from 'react';
import { useParams  } from "react-router-dom";
import './MyCrewPage.css'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import WhiteBottomNav from '../../components/WhiteBottomNav'; // 하단 네비게이션 스타일

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function MyCrewPage() {
  const { crew_id } = useParams();
  const navigate = useNavigate();

  const [crew, setCrew] = useState(null); // crew 데이터 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [backgroundImage, setBackgroundImage] = useState(null); // 기본 이미지 경로
  const [profileImage, setProfileImage] = useState('/img/person1.svg'); // 기본 프로필 이미지 경로


  const [crewCount, setCrewCount] = useState(1);


  useEffect(() => {
    const fetchCrew = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/crews/${crew_id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCrew(response.data); // 크루 데이터 설정
      } catch (err) {
        console.error('크루 데이터를 가져오는 중 오류 발생:', err);
        setError('크루 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };


    const fetchCrewCount = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/crews/${crew_id}/members/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // crew_count만 상태에 저장
        setCrewCount(response.data.crew_count);
      } catch (err) {
        console.error('크루 데이터를 가져오는 중 오류 발생:', err);
        setError('크루 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    
    if (crew_id) {
      fetchCrew();
    } else {
      setError('유효하지 않은 크루 ID입니다.');
      setLoading(false);
    }
  }, [crew_id]);

  

  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!crew) {
    return <div>크루 데이터를 찾을 수 없습니다.</div>;
  }


  // 이미지 업로드 핸들러
  const handleBackgroundUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 업로드된 파일의 URL 생성
      setBackgroundImage(imageUrl); // 상태 업데이트
    }
  };
  

  // 프로필 이미지 업로드 핸들러
  const handleProfileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // 업로드된 파일의 URL 생성
      setProfileImage(imageUrl); // 상태 업데이트
    }
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
  const noticeList = crew.noticeList || [
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
        {/* 크루 배경 이미지 */}
        <div className="backgroundImageContainer">
        {backgroundImage ? (
          <img src={backgroundImage} alt="mycrew" className="mycrew-icon" />
        ) : (
          <div className="placeholder">
            <label htmlFor="backgroundUpload" className="upploadButton">
              +
            </label>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          id="backgroundUpload"
          style={{ display: 'none' }} // 파일 입력 필드를 숨김
          onChange={handleBackgroundUpload}
        />
      </div>


      {/* 크루 프로필 */}
      <div className="crewprodv">
        <div className="crewProfile1">
          <img src={profileImage} alt="crew profile" className="crew-profile-icon" />
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            style={{ display: 'none' }} // 파일 입력 필드를 숨김
            onChange={handleProfileUpload}
          />
        </div>
        <div className='penButton'>
          {/* 작은 수정 버튼 */} 
          <label htmlFor="profileUpload" className="small-circle-button">
            <img src="/img/pen.svg" alt="edit" className="edit-icon" />
          </label>
      </div>
        
      </div>




      {/* 크루이름 */}
      <div className='crewName'>
        <span className='crewNameText'>{crew.crewname || crew.nicknamed || "크루명 없음"}</span>
        <img src='/img/fxemoji_fire.svg' alt='crew' className='fireIcon' />
      </div>

    

      {/* 공지 회원 선택 바 */}
      <div className='notic-member1'> 
        <button className='noticeButton1'>공지</button>
        <button className='memberButton1' onClick={handleMemberClick}>회원</button>
        <span className='write1'  onClick={handleWriteClick}>+글추가</span>
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
      <WhiteBottomNav/>
      
      

    </div>
  );
}

export default MyCrewPage;