import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const NAV_ITEMS = [
  { key: 'route', label: 'route', icon: '/img/route.svg', path: '/find-route' },
  { key: 'home', label: 'home', icon: '/img/home.svg', path: '/fullmap' },
  { key: 'mycrew', label: 'mycrew', icon: '/img/mycrew.svg', path: '/mycrew' },
  { key: 'my', label: 'my', icon: '/img/my.svg', path: '/mypage' },
];

function guessActive(pathname){
  if(pathname.startsWith('/find-route')) return 'route';
  if(pathname.startsWith('/fullmap')) return 'home';
  if(pathname.startsWith('/mycrew')) return 'mycrew';
  if(pathname.startsWith('/mypage') || pathname.startsWith('/my')) return 'my';
  return '';
}

const BottomNav = ({ active }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const activeKey = active || guessActive(pathname);

   const [currentCrewId, setCurrentCrewId] = useState(null); // 현재 크루 ID 상태
    const [currentUserId, setCurrentUserId] = useState(null); // 현재 사용자 ID 상태
  

    useEffect(() => {
      const fetchCurrentCrewId = async () => {
        try {
  
          const token = localStorage.getItem('token'); // 토큰 가져오기
          const response = await axios.get(`${apiBaseUrl}/crews/current/`, {
            headers: {
              Authorization: `Bearer ${token}`, // 인증 헤더 추가
            },
          });
  
          console.log('현재 크루 ID:', response.data.crew_id);
          console.log('현재 사용자 ID:', response.data.user_id);
  
          setCurrentCrewId(response.data.crew_id); // 현재 크루 ID 상태 업데이트
          setCurrentUserId(response.data.user_id); // 현재 사용자 ID 상태 업데이트
  
        } catch (error) {
          console.error('현재 크루 ID를 가져오는 중 오류 발생:', error);
        }
      
      };
  
      fetchCurrentCrewId();
    }, []);
  
  const crew = JSON.parse(localStorage.getItem("mycrew") || "{}");
  const mycrewPath = crew.crew_id ? `/mycrew/${crew.crew_id}` : '/mycrew';

  return (
    <nav className="bottom-nav" aria-label="하단 네비게이션">
      {NAV_ITEMS.map(item => {
        const isActive = item.key === activeKey;
        const path = item.key === 'mycrew' ? mycrewPath : item.path;
        return (
          <button
            key={item.key}
            type="button"
            className={`nav-item${isActive ? ' active' : ''}`}
            onClick={() => {
              if (item.key === 'mycrew') {
                if (currentCrewId) {
                  navigate(`/mycrew/${currentCrewId}`);
                } else {
                  alert('현재 크루 정보를 불러오는 중입니다.');
                }
              } else if (item.key === 'home') {
                if (currentUserId) {
                  navigate(`/fullmap/${currentUserId}`);
                } else {
                  alert('현재 사용자 정보를 불러오는 중입니다.');
                }
              } else {
                navigate(item.path);
              }
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <img src={item.icon} alt={item.label} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;