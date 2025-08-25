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
  const [leaderNickname, setLeaderNickname] = useState(null); // 작성자 닉네임
  const [leaderProfileImage, setLeaderProfileImage] = useState(null); // 작성자 프로필 이미지

  
  // 참여 인원 상태
  const [participants, setParticipants] = useState(0); // 기본값 8명
  const [voted, setVoted] = useState(null); // "참가" or "불참"
  

  const [reactionSummary, setReactionSummary] = useState({ present: 0, absent: 0 }); // 요약 데이터
  const [reactions, setReactions] = useState([]); // 상세 데이터

  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };

   
  
  //반응 보내기
   const sendReaction = async (reactionType) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${apiBaseUrl}/notices/${notice_id}/reactions/`,
        { reaction: reactionType }, // 요청 본문에 reaction 전달
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      console.log("반응 저장 성공:", response.data);
      return response.data.reaction; // 서버 응답 데이터 반환
    } catch (err) {
      console.error("반응 저장 중 오류 발생:", err);
      setError("참가/불참 반응을 저장하는 중 오류가 발생했습니다.");
      return null;
    }
  };

    // 참가 버튼 클릭
    const handleParticipate = async () => {
      if (voted !== "참가") {
        const reaction = await sendReaction("present"); // 서버에 참가 요청
        if (reaction) {
          setParticipants((prev) => prev + 1); // 참가 인원 증가
          setVoted("참가"); // 상태 업데이트
        }
      }
    };

    // 불참 버튼 클릭
    const handleNotParticipate = async () => {
      if (voted === "참가") {
        const reaction = await sendReaction("absent"); // 서버에 불참 요청
        if (reaction) {
          setParticipants((prev) => prev - 1); // 참가 인원 감소
          setVoted("불참"); // 상태 업데이트
        }
      } else if (voted !== "불참") {
        const reaction = await sendReaction("absent"); // 서버에 불참 요청
        if (reaction) {
          setVoted("불참"); // 상태 업데이트
        }
      }
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
        console.log("API 응답:", response.data);

        if (response.data.status === 'success') {
          setNotice(response.data.notice);
          setLeaderNickname(response.data.data.leader_nickname); // 작성자 닉네임 저장
          setLeaderProfileImage(response.data.data.leader_profile_image); // 작성자 프로필 이미지 저장
          
          
          // 참가 인원 카운트 (reaction이 "present"인 경우만)
          const presentCount = response.data.notice.reactions.filter(
            (reaction) => reaction.reaction === "present"
          ).length;
          setParticipants(presentCount); // 참가 인원 저장
          

          // reaction_summary와 reactions 상태 저장
          setReactionSummary(response.data.notice.reaction_summary);
          setReactions(response.data.notice.reactions);

          console.log("Reaction Summary:", response.data.notice.reaction_summary);
          console.log("Reactions:", response.data.notice.reactions);
  

         // 현재 사용자의 반응 확인
         const userReaction = response.data.data.user_reaction; // 서버에서 반환된 user_reaction 사용
         console.log("현재 사용자의 반응:", userReaction);

         if (userReaction) {
          // userReaction 값이 "present" 또는 "absent"인지 확인
          setVoted(userReaction === "present" ? "참가" : "불참");
          console.log("voted 상태 설정:", userReaction === "present" ? "참가" : "불참");
        }
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

     {/* 작성자 정보 */}
      <div className='userr'>
        <img 
          src={leaderProfileImage || '/img/default-profile.png'} 
          className="profile-imae" 
          alt="작성자 프로필" 
        />
        <span className='userName'>{leaderNickname || "작성자"}</span>
        <span className='date'>{notice.created_at}</span>
      </div>



      {/* 공지 내용 */}
      <div className='notice2Content'>
        <p>{notice.content}</p>

        {/* 투표 (참가 / 불참) */}
        {notice.allow_votes && ( // allow_votes가 true일 때만 렌더링
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
        )}
        {notice.allow_votes && (
          <div className='participationCount'>
            현재 참여 인원 : <span className="countText">{participants}명</span>
          </div>
          )}

        
      </div>

            


      {/* 하단네비게이션 바 */}
     <WhiteBottomNav/>

    </div>
  );
}

export default NoticeDetailsPage;
