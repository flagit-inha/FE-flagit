import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LevelListPage.css';

function LevelListPage() {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  }
  const badges = [
    { icon: "🐣", title: "입문자", desc: "가입 후 막 활동을 시작하는 멤버 !" },
    { icon: "🏃‍♂️", title: "초보 탐험가", desc: "활동 2회를 만족하면 자동으로 등업합니다." },
    { icon: "🚴", title: "거리 정복자", desc: "누적 거리 50km를 만족하면 자동으로 등업합니다." },
    { icon: "⛰️", title: "로드 위의 전사", desc: "누적 거리 100km를 만족하면 자동으로 등업합니다." },
    { icon: "🌌", title: "끝없는 트랙터", desc: "누적 거리 300km를 만족하면 자동으로 등업합니다." },
    { icon: "🔥", title: "신의 경지", desc: "활동 30회를 만족하면 자동으로 등업합니다." },
    { icon: "🏆", title: "MVP 활동러", desc: "크루 활동 참여율 1위" },
    { icon: "👑", title: "길잡이", desc: "크루 회장" },
  ];

  return (
    <div className="badgePage-container">
      {/* 상단바 */}
      <div className="badgePage-header">
        <img src="/img/back.svg" alt="뒤로가기" className="back-icon" onClick={handleBackClick}/>
        <img src="/img/star.svg" alt="star 아이콘" className="starr-icon" />
      </div>

      {/* 뱃지 리스트 */}
      <div className="badge-list">
        {badges.map((badge, index) => (
          <div key={index} className="badge-item">
            <div className="badge-title">
              <span className="badge-icon">{badge.icon}</span>
              <span className="badge-name">{badge.title}</span>
            </div>
            <div className="badge-desc">{badge.desc}</div>
            {index !== badges.length - 1 && <hr />}
          </div>
        ))}
      </div>

      {/* 하단네비게이션 바 */}
      <div className="bottom-nav">
        <div className="nav-item active" >
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/fullmap')} >
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

export default LevelListPage;