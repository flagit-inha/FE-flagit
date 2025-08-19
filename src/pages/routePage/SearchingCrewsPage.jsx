import { useNavigate } from "react-router-dom";
import "./SearchingCrewsPage.css";

export default function SearchingCrewsPage() {
  const nav = useNavigate();

  return (
    <div className="search-screen">
      <div className="search-card">
        <button
          className="search-back"
          aria-label="뒤로가기"
          onClick={() => nav(-1)}
        >
          ‹
        </button>

        {/* 돋보기 아이콘 (이미지 파일 경로만 맞춰줘) */}
        <img
          src="/img/question.svg"
          alt="검색 돋보기"
          className="search-icon"
        />

        <p className="search-text">주변 크루 탐색 중...</p>
      </div>
    </div>
  );
}
