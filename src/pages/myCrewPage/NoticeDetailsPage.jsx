import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './NoticeDetailsPage.css';

function NoticeDetailsPage() {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  const handleFullMapClick = () => {
    navigate('/fullmap'); // 전체지도 페이지로 이동
  }

  // 참여 인원 상태
  const [participants, setParticipants] = useState(0); // 기본값 8명
  const [voted, setVoted] = useState(null); // "참가" or "불참"

  // 참가 버튼 클릭
  const handleParticipate = () => {
    if (voted !== "참가") {
      setParticipants(prev => prev + 1);
      setVoted("참가");
    }
  };

  // 불참 버튼 클릭
  const handleNotParticipate = () => {
    if (voted === "참가") {
      setParticipants(prev => prev - 1); // 참가 취소
    }
    setVoted("불참");
  };

  return (
    <div>

      {/* top바 */}
      <div className='to2p-bar'>
        <img 
          src="/img/<.svg" 
          onClick={handleBackClick} 
          alt="뒤로가기" 
          className="myc1rew-icon" 
        />
      </div>

      {/* 공지사항 제목 */}
      <div className='titleNaame'>8월 정기모임</div>

      {/* 글쓴이 + 글쓴시간 */}
      <div className='userr'>
        <img src="/img/Ellipse2.svg" className="profile-imae" alt="user profile" />
        <span className='userName'>왕초보나용이</span>
        <span className='date'>2025.07.23 13:44</span>
      </div>

      {/* 공지 내용 */}
      <div className='notice2Content'>
        <p>안녕하세요~ 빌려온 깃냥이 회장 홍길동입니다! 🐾</p>
        <p>무더운 여름이 조금씩 물러가는 8월, 함께 시원한 바람 맞으며 북한산을 걸어볼까요? 🌿</p>
        <br />
        <p>📅 날짜: 8월 17일(토)</p>
        <p>📍 장소: 북한산 둘레길</p>
        <p>⏰ 시간: 오전 9시 집합</p>
        <p>🎒 준비물: 편한 복장, 물, 간식</p>
        <br />
        <p>등산 후에는 뒷풀이도 준비되어 있으니, 마음 편히 오셔서 즐기다 가세요!</p>
        <p>참여를 원하시면 ‘참가’ 버튼을 눌러주세요 🙌</p>
        <p>불참하실 경우 ‘불참’ 버튼을 눌러주세요 🙅‍♂️</p>
        
        <p>많은 참여 부탁드려요! 🐱</p>



        {/* 투표 (참가 / 불참) */}
      <div className='voteSection'>
        <div className='voteTitle'>8월 정기 모임 투표</div>
        <div className='voteOptions'>
          <button 
            className={`voteOptionBtn participate ${voted === "참가" ? "active" : ""}`} 
            onClick={handleParticipate}
          >
            참가
          </button>
          <button 
            className={`voteOptionBtn not ${voted === "불참" ? "active" : ""}`} 
            onClick={handleNotParticipate}
          >
            불참
          </button>
        </div>
      </div>

      {/* 현재 참여 인원 */}
      <div className='participationCount'>
        현재 참여 인원 : <span className="countText">{participants}명</span>
      </div>

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

export default NoticeDetailsPage;
