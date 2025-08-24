import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreListPage.css";

export default function StoreListPage() {
  const nav = useNavigate();
  const goBack = () => nav(-1);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 사용자 현재 위치 받아오기
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        try {
          const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/stores/nearby`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: latitude,
              lng: longitude,
            }),
          });

          if (!res.ok) throw new Error("가게 조회 실패");
          const data = await res.json();

          console.log("✅ 근처 가게 목록:", data);

          setStores(data.stores || []);
        } catch (err) {
          console.error(err);
          alert("가게 목록을 불러오는 중 오류가 발생했습니다!");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("위치 접근 실패:", err);
        alert("위치를 가져올 수 없습니다. 위치 권한을 허용해주세요!");
        setLoading(false);
      }
    );
  }, []);

  const goStore = (store) => {
    // TODO: 상세 페이지 연결
    alert(`${store.name} 상세로 이동 예정!`);
  };

  return (
    <div className="store-screen">
      <div className="store-card">
        {/* 뒤로가기 */}
        <button className="store-back" onClick={goBack} aria-label="뒤로가기">
          ‹
        </button>

        {/* 헤드 */}
        <header className="store-head">
          <h1 className="store-title">
            근처 단체 할인 가게들을
            <br />
            확인해보고
            <br />
            할인받아보세요
          </h1>
          <img
            className="store-illu"
            src="/img/map1.svg"
            alt="지도 일러스트"
          />
        </header>

        {/* 리스트 */}
        <div className="store-list">
          {loading ? (
            <p>가게 정보를 불러오는 중...</p>
          ) : stores.length > 0 ? (
            stores.map((s) => (
              <button
                key={s.store_id}
                className="store-item"
                onClick={() => goStore(s)}
                aria-label={`${s.name} 보기`}
              >
                <span className="store-name">{s.name}</span>
                <span className="store-distance">{s.distance.toFixed(1)} m</span>
                <span className="store-chevron">›</span>
              </button>
            ))
          ) : (
            <p>근처에 등록된 가게가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
