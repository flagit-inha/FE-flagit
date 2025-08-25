import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OpeningPage.css';

function OpeningPage() {
    const navigate = useNavigate();
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/landing');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className='phone'>
            <img className='flagitLogo' src="/img/flagitLogo.svg" alt="logo" />
            <p>“flag, it 함께 꽂는 우리 기록 “</p>
        </div>
    );
}

export default OpeningPage;