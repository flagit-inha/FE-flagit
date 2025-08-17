import React from 'react';
import './MemberListPage.css'; 
import { useNavigate } from 'react-router-dom';

function MemberListPage() {
  const navigate = useNavigate();

  const handleFullMapClick = () => {
    navigate('/fullmap'); // 전체지도 페이지로 이동
  }

  const handleMyCrewClick = () => {
    navigate('/mycrew'); //기본 크루페이지이동
  };
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
        <span className='memberCountText'>총원: 50명</span>
      </div>

      <div className='notic-member'>
        <button className='noticeButton1' onClick={handleMyCrewClick}>공지</button>
        <button className='memberButton1'>회원</button>
        <div></div>
        <button className='list'>공지사항</button>
      </div>

     
   
      

      {/* 하단네비게이션 바 */}
      <div className="bottom-nav">
        <div className="nav-item active" onClick={handleFullMapClick}>
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item">
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

export default MemberListPage;