import React ,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreateNoticePage.css';

function CreateNoticePage() {
  const navigate = useNavigate();
  const [voteEnabled, setVoteEnabled] = useState(false); //  투표 기능 상태


  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };
  const handleFullMapClick = () => {
    navigate('/fullmap'); // 전체지도 페이지로 이동
  }

  return (
    <div>
      <div className='to2p-bar'>
        <img src="/img/bback.svg" onClick={handleBackClick} alt="mycrew" className="myc1rew-icon" />
        <div className='writeBstn' onClick={handleBackClick}>작성하기</div>
      </div>

      <div className='t1itle'>공지 작성</div>

      <div className='noticeName'>공지 제목</div>
      <input type="text" className='titleInput' placeholder='공지 제목을 입력하세요.' />
      <div className='noticeIN'>내용</div>
      <textarea className='contentInput' placeholder='공지 내용을 입력하세요.'></textarea>
    


        {/* 투표 기능 on/off 토글 */}
      <div className="voteToggleWrapper">
        <span className="voteLabel">투표 기능</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={voteEnabled}
            onChange={() => setVoteEnabled(!voteEnabled)}
          />
          <span className="slider round"></span>
        </label>
        <span className="voteState">{voteEnabled ? 'ON' : 'OFF'}</span>
      </div>


       {/* 하단네비게이션 바 */}
       <div className="bottom-nav">
        <div className="nav-item active">
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
        <div className="nav-item" onClick={() => navigate('/mypage')}>
          <img src="/img/my.svg" alt="my" />
          <span>my</span>
        </div>
      </div>
    </div>
  );
}

export default CreateNoticePage;
