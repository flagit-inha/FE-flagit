import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./GeneratingQRPage.css";

export default function GeneratingQRPage() {
  const nav = useNavigate();
  const { state } = useLocation();

  // GroupVerificationPage에서 certification_id 전달받음
  const certification_id = state?.certification_id;
  const text = state?.text || "단체 인증 완료! QR 발급 중...";

  useEffect(() => {
    if (!certification_id) {
      alert("잘못된 접근입니다.");
      nav(-1);
      return;
    }

    const token = localStorage.getItem("token");

    let elapsed = 0; // 경과 시간 (초)
    const interval = setInterval(async () => {
      try {
        console.log(`⏳ 인증 상태 확인 중... (elapsed: ${elapsed}s)`);

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/certifications/status/${certification_id}/`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.ok) {
          throw new Error(`서버 응답 오류: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ 인증 상태 확인 응답:", data);

        if (data.status === "completed") {
          clearInterval(interval);
          nav("/qr", { state: data }); // 성공 → QR 페이지
        } else if (data.status === "failed" || data.status === "rejected") {
          clearInterval(interval);
          nav("/failure", { state: data }); // 실패 페이지
        }

        elapsed += 2; // 2초마다 호출
        if (elapsed >= 15) {
          clearInterval(interval);
          nav("/failure", {
            state: {
              title: "시간 초과",
              hint: "인증이 너무 오래 걸립니다. 다시 시도해주세요.",
              retryTo: "/store-list", // ✅ 다시 시도 → 가게 선택으로 보내기
            },
          });
        }
      } catch (err) {
        console.error("❌ 상태 확인 실패:", err);
        clearInterval(interval);
        nav("/failure", {
          state: {
            title: "서버 오류",
            hint: "상태 확인 중 문제가 발생했습니다.",
            retryTo: "/store-list",
          },
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [certification_id, nav]);

  return (
    <div className="qrgen-screen">
      <div className="qrgen-content">
        <img className="qrgen-icon" src="/img/check.svg" alt="확인 아이콘" />
        <p className="qrgen-text">{text}</p>
      </div>
    </div>
  );
}
