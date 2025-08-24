import React from 'react';
import './LandingPage.css';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
    const navigate = useNavigate();
    const handleStartClick = () => {
        navigate('/users/signup');
    };
    return (
        <div className='phone'>
            <img className='flagitLogo'src="/img/flagitLogo.svg" alt="logo" /> 
            <p>“flag, it 함께 꽂는 우리 기록 “</p>

            <button className='startButton' onClick={handleStartClick}>
                시작하기

            </button>
            <div className='description'> 
                <h6 className='imi'>이미 계정이 있나요? <a href="/login" className="loginLink">로그인하기</a>  </h6>
            </div>
          
        </div>



    );
}
export default LandingPage;