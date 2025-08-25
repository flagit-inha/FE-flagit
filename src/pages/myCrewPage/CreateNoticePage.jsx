import React ,{ useState ,useEffect  } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CreateNoticePage.css';
import WhiteBottomNav from '../../components/WhiteBottomNav'; // 하단 네비게이션 스타일
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

function CreateNoticePage() {
  const navigate = useNavigate()




  const [voteEnabled, setVoteEnabled] = useState(false); //  투표 기능 상태


  const [crew_id, setCrewId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchCrewInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${apiBaseUrl}/users/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("유저 정보:", response.data);
        setCrewId(response.data.crew_info.crew_id); // ✅ crew_id 저장
      } catch (err) {
        console.error('크루 정보 가져오기 실패:', err);
        setError('크루 정보를 불러올 수 없습니다.');
      }
    };

    fetchCrewInfo();
  }, []);


  const handleBackClick = () => {
    navigate(-1); // 이전 페이지로 이동
  };




  const handleCreateNotice = async () => {
    if (!title || !content) {
      setError('제목과 내용을 모두 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${apiBaseUrl}/notices/${crew_id}/`,
        {
          title,
          content,
          allow_votes: voteEnabled,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status === 'success') {
        alert('공지 생성 성공!');
        navigate(-1); // 이전 페이지로 이동
      } else {
        setError(response.data.message || '공지 생성에 실패했습니다.');
      }
    } catch (err) {
      console.error('공지 생성 오류:', err.response?.data || err);
      setError(err.response?.data?.message || '공지 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div>
      <div className='to2p-bar'>
        <img src="/img/bback.svg" onClick={handleBackClick} alt="mycrew" className="myc1rew-icon" />
        <div className='writeBstn' onClick={handleCreateNotice}>
          {loading ? '작성중...' : '작성하기'}
        </div>
      </div>

      <div className='t1itle'>공지 작성</div>

      <div className='noticeName'>공지 제목</div>
      <input 
        type="text" 
        className='titleInput'
        placeholder='공지 제목을 입력하세요.' 
        value={title}
        onChange={(e)=> setTitle(e.target.value)}/>


      <div className='noticeIN'>내용</div>
      <textarea
        className='contentInput'
        placeholder='공지 내용을 입력하세요.'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />    


        {/* 투표 기능 on/off 토글 */}
      <div className="voteToggleWrapper">
        <span className="voteLabel">투표 기능</span>
        <label className="switch">
          <input
            type="checkbox"
            checked={voteEnabled}
            onChange={() => setVoteEnabled(!voteEnabled)}
          />
          <span className="slider round"></span>
        </label>
        <span className="voteState">{voteEnabled ? 'ON' : 'OFF'}</span>
      </div>

      {error && <div className="errorMessage1">{error}</div>}


       {/* 하단네비게이션 바 */}
      <WhiteBottomNav/>
     
    </div>
  );
}

export default CreateNoticePage;
