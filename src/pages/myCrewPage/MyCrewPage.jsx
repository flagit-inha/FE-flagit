import React from 'react';
import './MyCrewPage.css'; 
function MyCrewPage() {
  return (
    <div>
      {/* 크루이미지 */}
      <img src="/img/crep.png" alt="mycrew" className="mycrew-icon" />


      {/* 크루프로필  */}
      <div className='crewProfile'>
        <img src="/img/profile.png" alt="profile" className="profile-image" /> 
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
        <button className='noticeButton'>공지</button>
        <button className='memberButton'>회원</button>
        <div></div>
        <button className='list'>공지사항</button>
      </div>

     
   
      

      {/* 하단네비게이션 바 */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item">
          <img src="/img/home.svg" alt="home" />
          <span>home</span>
        </div>
        <div className="nav-item">
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