import React from 'react';
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

  return (
    <div>

      {/* top바 */}
      <div className='to2p-bar'>
        <img src="/img/<.svg" onClick={handleBackClick} alt="mycrew" className="myc1rew-icon" />
      </div>


      {/* 공지사항 제목 */}
      <div className='titleNaame'>공지사항이름</div>


      {/* 글쓴이+글쓴시간정보 */}
      <div className='userr'>
        <img src="/img/Ellips2.svg" className="profile-image" alt="user profile" />
        <span className='userName'>작성자 이름</span>
        <span className='date'>2023.10.01</span>
      </div>


      {/* 공지사항 내용 */}
      <div className='notice2Content'>
        <p>공지사항 내용이 여기에 들어갑니다. 이곳에 공지사항의 상세 내용을 작성해주세요.</p>
        <p>추가적인 정보나 공지사항에 대한 설명을 여기에 작성할 수 있습니다.</p>
      </div>



      {/* 투표기능 */}
      <div className='voteSection'>
        <div className='voteTitle'>투표하기</div>
        <div className='voteOptions'>
          <label className='voteOption'>
            <input type="radio" name="vote" value="option1" />
            <span>옵션 1</span>
          </label>
          <label className='voteOption'>
            <input type="radio" name="vote" value="option2" />
            <span>옵션 2</span>
          </label>
          <label className='voteOption'>
            <input type="radio" name="vote" value="option3" />
            <span>옵션 3</span>
          </label>
        </div>
        <button className='voteButton'>투표하기</button>
      </div>


      {/* 현재참여인원 */}
      <div className='participationCount'>
        <span className='countText'>현재 참여인원: 10명</span>
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

export default NoticeDetailsPage;