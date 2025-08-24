import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './NoticeDetailsPage.css';
import WhiteBottomNav from '../../components/WhiteBottomNav'; // 하단 네비게이션 스타일
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function NoticeDetailsPage() {
  const navigate = useNavigate();
  const {  crew_id, notice_id } = useParams();
  console.log("crew_id:", crew_id, "notice_id:", notice_id);


  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


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

  useEffect(() => {
    const fetchNoticeDetail = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${apiBaseUrl}/notices/${crew_id}/${notice_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.status === 'success') {
          setNotice(response.data.notice);
          setParticipants(response.data.notice.reaction_summary.present); // 현재 참석 인원
        }
      } catch (err) {
        console.error('공지 상세 조회 오류:', err);
        setError('공지 상세를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (crew_id && notice_id) {
      fetchNoticeDetail();
      }
    }, [crew_id, notice_id]);  

    if (loading) return <div>불러오는 중...</div>;
    if (error) return <div>{error}</div>;
    if (!notice) return <div>공지 데이터를 찾을 수 없습니다.</div>;


  return (
    <div>

      {/* top바 */}
      <div className='to2p-bar'>
        <img 
          src="/img/bback.svg" 

          onClick={handleBackClick} 
          alt="뒤로가기" 
          className="myc1rew-icon" 
        />
      </div>

      {/* 공지사항 제목 */}
      <div className='titleNaame'>{notice.title}</div>

      {/* 글쓴이 + 글쓴시간 */}
      <div className='userr'>
        <img src="/img/Ellipse2.svg" className="profile-imae" alt="user profile" />
        <span className='userName'>{notice.crew || "작성자"}</span>
        <span className='date'>{notice.created_at}</span>
      </div>

      {/* 공지 내용 */}
      <div className='notice2Content'>
        <p>{notice.content}</p>



        {/* 투표 (참가 / 불참) */}
      <div className='voteSection'>
        <div className='voteTitle'>{notice.title} 투표</div>
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
     <WhiteBottomNav/>

    </div>
  );
}

export default NoticeDetailsPage;
