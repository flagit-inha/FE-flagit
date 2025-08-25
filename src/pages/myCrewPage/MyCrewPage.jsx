
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
  const [profileImage, setProfileImage] = useState(null); // 기본 프로필 이미지 경로


  const [crewCount, setCrewCount] = useState(1);
  const [notices, setNotices] = useState([]); // 공지 상태
  const [noticeIds, setNoticeIds] = useState([]); // 공지 ID만 저장하는 상태

    // 이미지 업로드 핸들러






  useEffect(() => {
    const fetchCrew = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/crews/${crew_id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("크루 데이터:", response.data); // 서버 응답 확인
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
        setBackgroundImage(response.data.crew_image); // 배경 이미지 설정
        setProfileImage(response.data.crew_logo); // 로고 이미지 설정
      } catch (err) {
        console.error('크루 데이터를 가져오는 중 오류 발생:', err);
        setError('크루 데이터를 불러올 수 없습니다.');
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };


    //
    //크루별 공지목록조회하기
    const fetchNotices = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/notices/${crew_id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
    
        console.log("공지 데이터:", response.data); // API 응답 확인

        if (response.data.status === "success") {
          setNotices(response.data.notices); // 배열 그대로 저장
          const ids = response.data.notices.map((notice) => notice.id); // 공지 ID만 추출
          setNoticeIds(ids); // 공지 ID 상태 업데이트
          
        }
      } catch (err) {
        console.error('공지 데이터를 가져오는 중 오류 발생:', err);
        setError('공지 데이터를 불러올 수 없습니다.');
      }
      finally {
        setLoading(false);
      }
    };

    
    if (crew_id) {
      fetchCrew();
      fetchCrewCount();
      fetchNotices(); 

    } else {
      setError('유효하지 않은 크루 ID입니다.');
      setLoading(false);

    }
  }, [crew_id]);

  
  //크루 배경 업로드
  const handleBackgroundUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("crew_image", file); // 서버에서 기대하는 필드 이름에 맞게 설정
  
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${apiBaseUrl}/crews/images/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // 파일 업로드를 위한 헤더
          },
        });
  
        console.log("배경 업로드 성공:", response.data);
        setBackgroundImage(response.data.crew_image); // 서버에서 반환된 이미지 URL로 상태 업데이트
      } catch (err) {
        console.error("배경 이미지 업로드 중 오류 발생:", err);
        setError("배경 이미지 업로드에 실패했습니다.");
      }
    }
  };


  //크루 로고 업로드 
  const handleCrewLogoUpload = async (event) => {
    console.log("handleCrewLogoUpload 호출됨");
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("파일 크기는 5MB를 초과할 수 없습니다.");
        return;
      }
 
      const formData = new FormData();
      formData.append("crew_logo", file); // 서버에서 기대하는 필드 이름에 맞게 설정
  
      try {
        const token = localStorage.getItem('token'); // 인증 토큰 가져오기
        const response = await axios.post(`${apiBaseUrl}/crews/images/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // 파일 업로드를 위한 헤더
          },
        });
  
        console.log("크루 로고 업로드 성공:", response.data);
        setProfileImage(response.data.crew_logo); // 서버에서 반환된 crew_logo URL로 상태 업데이트
      } catch (err) {
        if (err.response) {
          console.error("서버 응답:", err.response.data); // 서버 응답 확인
        }
        setError("크루 로고 업로드에 실패했습니다.");
      }
    }
  };



  if (loading) {
    return <div>데이터를 불러오는 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!crew) {
    return <div>크루 데이터를 찾을 수 없습니다.</div>;
  }



  
 

  const handleMemberClick = () => {
    navigate(`/memberlist/${crew_id}`);
  };
  const handleWriteClick = () => {
    navigate('/create-notice');
  };
  const handleNoticeClick = (notice_id) => {
    console.log("handleNoticeClick:", notice_id, crew_id);
    navigate(`/notice-details/${crew_id}/${notice_id}`);
  };


  


  return (
    <div>
        
       {/* 크루 배경 이미지 */} 
       <div className="backgroundImageContainer" onClick={() => document.getElementById('backgroundUpload').click()}>
          {console.log("렌더링 중 backgroundImage 상태:", backgroundImage)}
          {backgroundImage ? (
            <img src={backgroundImage} alt="mycrew" className="mycrew-icon" />
          ) : (
            <div className="placeholder">
              <label htmlFor="backgroundUpload" className="upploadButton">+</label>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            id="backgroundUpload"
            style={{ display: 'none' }} // 파일 입력 필드를 숨김
            onChange={handleBackgroundUpload} // 파일 선택 시 업로드 함수 호출
          />
        </div>


      {/* 크루 로고 */}
      <div className="crewprodv">
        <div className="crewProfile1">
          <img src={profileImage || "/img/person1.svg"}  alt="crew profile" className="crew-profile-icon" />
          <input
            type="file"
            accept="image/*"
            id="profileUpload"
            style={{ display: 'none' }} // 파일 입력 필드를 숨김
            onChange={handleCrewLogoUpload}
          />
        </div>
            {/* 작은 수정 버튼 */} 
        <div className='penButton'>
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
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div key={notice.id} className='noticeContent'>
              <div 
                className='noticeContentText' 
                onClick={() => handleNoticeClick(notice.id)} // notice.id가 반드시 존재해야 함
              >
                {notice.title}
  

              </div>
            </div>
          ))
        ) : (
          <div className='no-notices'>아무 글이 없습니다.</div>
        )}
      </div>
      
      {/* 하단네비게이션 바 */}
      <WhiteBottomNav/>
      
      

    </div>
  );
}

export default MyCrewPage;
