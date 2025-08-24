import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoadingPage.css";

export default function LoadingPage() {
  const nav = useNavigate();
  const location = useLocation();
  const { start_location, target_distance } = location.state || {}; // FindRoutePage에서 받은 값

  // 점 3개의 기준 x 오프셋
  const bases = useMemo(() => [-35, 0, 35], []);
  const [dots, setDots] = useState(bases.map((bx) => ({ x: bx, y: 0 })));

  // 점 애니메이션 효과
  useEffect(() => {
    const tick = () => {
      setDots((prev) =>
        prev.map((d, i) => {
          const jx = bases[i] + (Math.random() * 16 - 8);
          return { x: jx, y: 0 };
        })
      );
    };
    tick();
    const id = setInterval(tick, 700 + Math.random() * 400);
    return () => clearInterval(id);
  }, [bases]);

  // 🚀 API 요청 → 끝나면 SuggestedRoutePage로 이동
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // 로그인 시 저장해둔 토큰 꺼내오기
        const token = localStorage.getItem("access_token"); // ✅ 로그인 시 저장된 access_token

        console.log("📌 저장된 토큰:", token);
        console.log("📌 요청 헤더:", {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        });
        

        if (!token) {
          alert("로그인이 필요합니다.");
          nav("/login");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/routes/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Bearer 붙여서 전송
          },
          body: JSON.stringify({
            start_location,
            target_distance: parseFloat(target_distance),
          }),
        });

        console.log("📡 응답 상태 코드:", res.status);

        if (!res.ok) {
          throw new Error("경로 추천 실패");
        }

        const data = await res.json();
        console.log("✅ 경로 추천 응답:", data);

        // 성공 시 SuggestedRoutePage로 이동
        nav("/suggested-route", { state: data.data });
      } catch (err) {
        console.error(err);
        alert("경로 요청 중 오류 발생!");
        nav(-1); // 이전 페이지로 돌려보내기
      }
    };

    if (start_location && target_distance) {
      fetchRoute();
    } else {
      alert("잘못된 접근입니다.");
      nav(-1);
    }
  }, [start_location, target_distance, nav]);

  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="loading-dots">
          {dots.map((d, idx) => (
            <span
              key={idx}
              className="loading-dot"
              style={{
                transform: `translate(${d.x}px, ${d.y}px)`,
                transition: "transform 0.6s ease-in-out",
              }}
            />
          ))}
        </div>
        <p className="loading-text">경로를 불러오는 중...</p>
      </div>
    </div>
  );
}
