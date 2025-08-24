import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchingCrewsPage.css";

export default function SearchingCrewsPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const certification_id = state?.certification_id;

  useEffect(() => {
    if (!certification_id) {
      alert("잘못된 접근입니다.");
      nav(-1);
      return;
    }

    // 2.5초 후 자동으로 GeneratingQRPage로 이동
    const timer = setTimeout(() => {
      nav("/generating-qr", { state: { certification_id } });
    }, 2500);

    return () => clearTimeout(timer);
  }, [certification_id, nav]);

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

        {/* 돋보기 아이콘 (이미지 경로 확인해서 public/img에 넣어두면 됨) */}
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
