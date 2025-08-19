import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoadingPage.css";

export default function LoadingPage() {
  const nav = useNavigate();

  // 점 3개의 기준 x 오프셋(가운데 정렬 기준)
  const bases = useMemo(() => [-35, 0, 35], []);
  const [dots, setDots] = useState(
    bases.map((bx) => ({ x: bx, y: 0 }))
  );

  useEffect(() => {
    const tick = () => {
      // 각 점을 기준 위치 주변에서 랜덤으로 살짝 흔들기
      setDots((prev) =>
        prev.map((d, i) => {
          const jx = bases[i] + (Math.random() * 16 - 8);   // ±8px
          // const jy = (Math.random() * 12 - 6);               // ±6px
          return { x: jx, y: 0 };
        })
      );
    };
    tick(); // 최초 한 번
    const id = setInterval(tick, 700 + Math.random() * 400); // 0.7~1.1s 간격
    return () => clearInterval(id);
  }, [bases]);

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
      </div>
    </div>
  );
}
