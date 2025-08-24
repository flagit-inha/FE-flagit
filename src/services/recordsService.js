const PREFIX = 'record:';
const META_VERSION = 1;
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

/* ===== Utilities ===== */
function genId() {
  return (crypto.randomUUID && crypto.randomUUID()) || Date.now().toString();
}

function serialize(record) {
  const { images, ...rest } = record;
  return JSON.stringify({
    ...rest,
    _v: META_VERSION,
    imagesMeta: images?.map(f => ({ name: f.name, size: f.size, type: f.type })) || []
  });
}

function deserialize(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* 스토리지 스캔 (key 목록) */
function eachStored(callback) {
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) callback(k);
  }
}

/* ===== Internal: flagOrder 재구성 =====
   createdAt 오름차순으로 1부터 부여 (누락/불일치 시만 저장) */
function rebuildFlagOrdersIfNeeded(records) {
  const need = records.some(r => !r.flagOrder || typeof r.flagOrder !== 'number');
  if (!need) return records;
  const asc = [...records].sort((a, b) => a.createdAt - b.createdAt);
  asc.forEach((r, idx) => {
    if (r.flagOrder !== idx + 1) {
      r.flagOrder = idx + 1;
      localStorage.setItem(PREFIX + r.id, serialize(r));
    }
  });
  return records;
}

/* ===== CRUD ===== */
export async function createRecord(formData) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBaseUrl}/users/flag/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
      // Content-Type은 지정하지 않음!
    },
    body: formData
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.log(errorText);
    throw new Error('기록 저장 실패');
  }
  return await res.json();
}

export async function getRecord(id) {
  const raw = localStorage.getItem(PREFIX + id);
  if (!raw) return null;
  const rec = deserialize(raw);
  if (!rec) return null;

  // flagOrder 누락 시 전체 재구성
  if (!rec.flagOrder) {
    await listRecords(); // 재구성 트리거
    const reread = localStorage.getItem(PREFIX + id);
    return reread ? deserialize(reread) : rec;
  }
  return rec;
}

export async function listRecords() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");
  const res = await fetch(`${apiBaseUrl}/users/flag/`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  return await res.json();
}

/* 선택적 업데이트 (필요 시 사용) */
export async function updateRecord(id, patch) {
  const rec = await getRecord(id);
  if (!rec) return null;
  const updated = { ...rec, ...patch, updatedAt: Date.now() };
  localStorage.setItem(PREFIX + id, serialize(updated));
  return updated;
}

export async function deleteRecord(id) {
  localStorage.removeItem(PREFIX + id);
  // 삭제 후 flagOrder 재정렬
  const remain = [];
  eachStored(k => {
    const raw = localStorage.getItem(k);
    const rec = deserialize(raw);
    if (rec) remain.push(rec);
  });
  // createdAt 오름차순으로 1..N
  remain.sort((a,b)=>a.createdAt - b.createdAt)
        .forEach((r, idx) => {
          if (r.flagOrder !== idx + 1) {
            r.flagOrder = idx + 1;
            localStorage.setItem(PREFIX + r.id, serialize(r));
          }
        });
}

/* 전체 삭제 (개발용) */
export async function clearAllRecords() {
  const toDel = [];
  eachStored(k => toDel.push(k));
  toDel.forEach(k => localStorage.removeItem(k));
}