import { useNavigate } from "react-router-dom";
import "./StoreListPage.css";

const MOCK_STORES = [
  { id: 1, name: "왕초보나용이" },
  { id: 2, name: "러너스 카페" },
  { id: 3, name: "마라톤 샵" },
  { id: 4, name: "비타민 스토어" },
  { id: 5, name: "러닝화 아울렛" },
  { id: 6, name: "피트니스 스낵바" },
  { id: 7, name: "마라톤 샵" },
  { id: 8, name: "비타민 스토어" },
  { id: 9, name: "러닝화 아울렛" },
  { id: 10, name: "피트니스 스낵바" },
];

export default function StoreListPage() {
  const nav = useNavigate();
  const goBack = () => nav(-1);

  const goStore = (store) => {
    // TODO: 상세 페이지 준비되면 여기로 연결
    // nav(`/store/${store.id}`);
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
            src="/img/map1.svg" /* public/img/spot_illu.png */
            alt=""
          />
        </header>

        {/* 리스트 */}
        <div className="store-list">
          {MOCK_STORES.map((s) => (
            <button
              key={s.id}
              className="store-item"
              onClick={() => goStore(s)}
              aria-label={`${s.name} 보기`}
            >
              <span className="store-name">{s.name}</span>
              <span className="store-chevron">›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
