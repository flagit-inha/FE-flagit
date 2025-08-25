import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StoreListPage.css";

export default function StoreListPage() {
  const nav = useNavigate();
  const goBack = () => nav(-1);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const token = localStorage.getItem("token");

        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/stores/nearby?lat=${latitude}&lng=${longitude}`,
            {
              headers: token ? { Authorization: `Bearer ${token}` } : {},
            }
          );

          if (!res.ok) throw new Error("가게 조회 실패");
          const data = await res.json();

          console.log("✅ 근처 가게 목록:", data);

          if (data.stores && data.stores.length > 0) {
            setStores(data.stores);
          } else {
            setErrorMsg("근처에 등록된 가게가 없습니다.");
          }
        } catch (err) {
          console.error(err);
          setErrorMsg("가게 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error("위치 접근 실패:", err);
        setErrorMsg("위치를 가져올 수 없습니다. 위치 권한을 허용해주세요!");
        setLoading(false);
      }
    );
  }, []);

  const goStore = (store) => {
    // ✅ GroupVerificationPage로 store 정보(state) 전달
    nav("/group-verification", { state: { store_id: store.store_id, name: store.name } });
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
          <img className="store-illu" src="/img/map1.svg" alt="지도 일러스트" />
        </header>

        {/* 리스트 */}
        <div className="store-list">
          {loading ? (
            <p>가게 정보를 불러오는 중...</p>
          ) : errorMsg ? (
            <p>{errorMsg}</p>
          ) : (
            stores.map((s) => (
              <button
                key={s.store_id}
                className="store-item"
                onClick={() => goStore(s)}
                aria-label={`${s.name} 보기`}
              >
                <span className="store-name">{s.name || "이름 없음"}</span>
                <span className="store-distance">
                  {s.distance >= 1000
                    ? `${(s.distance / 1000).toFixed(1)} km`
                    : `${s.distance.toFixed(0)} m`}
                </span>
                <span className="store-chevron">›</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
