import React from 'react';

function MyCrewPage() {
  return (
    <div>마이크루 페이지

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