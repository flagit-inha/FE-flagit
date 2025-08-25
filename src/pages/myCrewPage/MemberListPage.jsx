import React , { useState , useEffect }from 'react';
import './MemberListPage.css'; 
import { useNavigate, useParams } from 'react-router-dom';
import WhiteBottomNav from '../../components/WhiteBottomNav'; // 하단 네비게이션 스타일
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function MemberListPage() {
  const navigate = useNavigate();
  const { crew_id } = useParams();
  

  const [backgroundImage, setBackgroundImage] = useState(null); // 기본 이미지 경로
  const [profileImage, setProfileImage] = useState(null); // 기본 프로필 이미지 경로
  const [crewCount, setCrewCount] = useState(0);
  const [error, setError] = useState(null);
  const [crewName, setCrewName] = useState(''); // 크루명 상태
  const [memberList, setMemberList] = useState([]); // 멤버 리스트 상태

  


  const handleMyCrewClick = () => {
    navigate(`/mycrew/${crew_id}`); //기본 크루페이지이동
  };


  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/crews/${crew_id}/members/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('크루 데이터:', response.data);
        setBackgroundImage(response.data.crew_image); // 배경 이미지 설정
        setProfileImage(response.data.crew_logo); 
        setCrewCount(response.data.crew_count);
        setMemberList(response.data.members); // 멤버 리스트 설정
        setCrewName(response.data.crewname); // 크루명 설정
      

         // 서버에서 반환된 배경 이미지 URL 설정
      } catch (err) {
        console.error('크루 배경 이미지 가져오기 오류:', err);
        setError('크루 배경 이미지를 불러올 수 없습니다.');
      }
    };

    if (crew_id) {
      fetchBackgroundImage();

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

  // 초기 멤버 리스트 데이터
  

  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);



  const [selectedSortOption, setSelectedSortOption] = useState('정렬 옵션');


  // 최신가입순 정렬 함수
  const handleSortByJoinDate = () => {
    const sortedList = [...memberList].sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at));
    setMemberList(sortedList);
    setSelectedSortOption('최신가입순');
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  // 가나다순 정렬 함수
  const handleSortByName = () => {
    const sortedList = [...memberList].sort((a, b) => a.nickname.localeCompare(b.name, 'ko'));
    setMemberList(sortedList);
    setSelectedSortOption('가나다순');
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  // 뱃지순 정렬 함수
  const handleSortByBadge = () => {
    const sortedList = [...memberList].sort((a, b) => {
      const badgeA = a.badge?.badge_name || '';
      const badgeB = b.badge?.badge_name || '';
      return badgeA.localeCompare(badgeB, 'ko'); // 뱃지 이름을 기준으로 정렬
    });
    setMemberList(sortedList);
    setSelectedSortOption('뱃지순');
    setIsDropdownOpen(false); // 드롭다운 닫기
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

      {/* 크루프로필  */}
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
        <span className='crewNameText'>{crewName || '크루명 없음'} </span>
        <img src='/img/fxemoji_fire.svg' alt='crew' className='fireIcon' />
      </div>

      {/* 크루 총원 */}
      <div className='crewMemberCount'>
        <span className='memberCountText'>총원:{crewCount}명</span>
      </div>

      <div className="notic-member2">
  <button className="noticeButton2" onClick={handleMyCrewClick}>공지</button>
  <button className="memberButton2">회원</button>

  <div className="dropdownContainer">
    <button
      className="dropdownButton"
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
    >
      {selectedSortOption}
      <img src="/img/dropdown.svg" alt="dropdown arrow" className="dropdownArrow" />
    </button>
    {isDropdownOpen && (
      <div className={`dropdownMenu ${isDropdownOpen ? 'active' : ''}`}>
        <button onClick={handleSortByJoinDate}>최신가입순</button>
        <button onClick={handleSortByName}>가나다순</button>
        <button onClick={handleSortByBadge}>뱃지순</button>
      </div>
    )}
  </div>
</div>
      
      {/* 멤버 리스트 */}
      <div className='memberlist'>
        {memberList.map((member) => (
          <div key={member.user_id} className='memberbox'>
            <img
              src={member.profile_image || '/img/person1.svg'}
              alt={member.nickname}
              className='profilePic'
            />
            <span className='memberName'>{member.nickname}</span>
            <span className='bb'>{member.badge?.badge_name || '뱃지 없음'}</span>
          </div>
        ))}
      </div>
     
   
      

      {/* 하단네비게이션 바 */}
        <WhiteBottomNav/>
    </div>
  );
}

export default MemberListPage;