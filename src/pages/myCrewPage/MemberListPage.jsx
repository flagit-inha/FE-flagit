import React , { useState }from 'react';
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



  // 초기 멤버 리스트 데이터
  const initialMemberList = [
    { id: 1, name: '홍길동', profilePic: '/img/Ellipse2.svg', status: '🐣 입문자', joinedAt: '2023-08-01' },
    { id: 2, name: '김철수', profilePic: '/img/Ellipse2.svg', status: '🐥 초보자', joinedAt: '2023-08-05' },
    { id: 3, name: '이영희', profilePic: '/img/Ellipse2.svg', status: '🦉 숙련자', joinedAt: '2023-08-03' },
    { id: 4, name: '박민수', profilePic: '/img/Ellipse2.svg', status: '🐣 입문자', joinedAt: '2023-08-02' },
    { id: 5, name: '홍수진', profilePic: '/img/Ellipse2.svg', status: '🦉 숙련자', joinedAt: '2023-08-04' },
  ];

  // 멤버 리스트 상태 관리
  const [memberList, setMemberList] = useState(initialMemberList);

  // 드롭다운 상태 관리
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  const [selectedSortOption, setSelectedSortOption] = useState('정렬 옵션');


  // 최신가입순 정렬 함수
  const handleSortByRecent = () => {
    const sortedList = [...memberList].sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
    setMemberList(sortedList);
    setSelectedSortOption('최신가입순');
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  // 가나다순 정렬 함수
  const handleSortByName = () => {
    const sortedList = [...memberList].sort((a, b) => a.name.localeCompare(b.name, 'ko'));
    setMemberList(sortedList);
    setSelectedSortOption('가나다순');
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  // 뱃지순 정렬 함수
  const handleSortByBadge = () => {
    const badgeOrder = ['🐣 입문자', '🐥 초보자', '🦉 숙련자']; // 뱃지별 우선순위
    const sortedList = [...memberList].sort((a, b) => badgeOrder.indexOf(a.status) - badgeOrder.indexOf(b.status));
    setMemberList(sortedList);
    setSelectedSortOption('뱃지순');
    setIsDropdownOpen(false); // 드롭다운 닫기
  };
  
  
  return (
    <div>
      {/* 크루이미지 */}
      <img src="/img/crep.png" alt="mycrew" className="mycrew-icon" />


      {/* 크루프로필  */}
      <div className='crewProfile'>
        <img src="/img/Ellipse2.svg" className="profqile-image" /> 
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

      <div className="notic-member">
  <button className="noticeButton1" onClick={handleMyCrewClick}>공지</button>
  <button className="memberButton1">회원</button>

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
        <button onClick={handleSortByRecent}>최신가입순</button>
        <button onClick={handleSortByName}>가나다순</button>
        <button onClick={handleSortByBadge}>뱃지순</button>
      </div>
    )}
  </div>
</div>
      {/* 멤버 리스트 */}
      <div className='memberlist'>
        {memberList.map((member) => (
          <div key={member.id} className='memberbox'>
            <img src={member.profilePic} alt={member.name} className='profilePic' />
            <span className='memberName'>{member.name}</span>
            <span className='bb'>{member.status}</span>
          </div>
        ))}
      </div>
     
   
      

      {/* 하단네비게이션 바 */}
      <div className="bottom-nav">
        <div className="nav-item active">
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item" onClick={handleFullMapClick}>
          <img src="/img/home.svg" alt="home" />
          <span>home</span>
        </div>
        <div className="nav-item" onClick={() => window.location.href = '/mycrew'}>
          <img src="/img/mycrew.svg" alt="mycrew" />
          
          <span>mycrew</span>
        </div>
        <div className="nav-item" onClick={() => window.location.href = '/mypage'}>
          <img src="/img/my.svg" alt="my" />
          <span>my</span>
        </div>
      </div>
    </div>
  );
}

export default MemberListPage;