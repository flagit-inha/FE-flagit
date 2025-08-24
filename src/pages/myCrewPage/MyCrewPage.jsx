import React , { useState }from 'react';
import './MyCrewPage.css'; 
import { useNavigate } from 'react-router-dom';
import WhiteBottomNav from '../../components/WhiteBottomNav'; // 하단 네비게이션 스타일


function MyCrewPage() {
  const navigate = useNavigate();

  const [backgroundImage, setBackgroundImage] = useState(null); // 기본 이미지 경로
  const [profileImage, setProfileImage] = useState('/img/person1.svg'); // 기본 프로필 이미지 경로


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
        <span className='crewNameText'>빌려온 깃냥이 </span>
        <img src='/img/fxemoji_fire.svg' alt='crew' className='fireIcon' />
      </div>

      {/* 크루 총원 */}
      <div className='crewMemberCount'>
        <span className='memberCountText'>화이팅!!</span>
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