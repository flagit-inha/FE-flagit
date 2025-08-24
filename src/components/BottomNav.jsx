import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BottomNav.css';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

const NAV_ITEMS = [
  { key:'route',  label:'route',  icon:'/img/route.svg',  path:'/find-route' },
  { key:'home',   label:'home',   icon:'/img/home.svg',   path:'/fullmap' },
  { key:'mycrew', label:'mycrew', icon:'/img/mycrew.svg', path:null },
  { key:'my',     label:'my',     icon:'/img/my.svg',     path:'/mypage' }
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
            onClick={()=> navigate(path)}
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