import React from 'react';
import './MyCrewPage.css'; 
function MyCrewPage() {
  return (
    <div>
      <img src="/img/crep.png" alt="mycrew" className="mycrew-icon" />
      <div className='crewProfile'>
        <img src="/img/profile.png" alt="profile" className="profile-image" /> 
        
      </div>
  










      <div className="bottom-nav">
        <div className="nav-item active">
          <img src="/img/route.svg" alt="route" />
          <span>route</span>
        </div>
        <div className="nav-item">
          <img src="/img/home.svg" alt="home" />
          <span>home</span>
        </div>
        <div className="nav-item">
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

export default MyCrewPage;