const PREFIX = 'record:';

function genId() {
  return (crypto.randomUUID && crypto.randomUUID()) || Date.now().toString();
}

// File 배열은 직렬화 불가 → 메타정보만 저장
function serialize(record) {
  const { images, ...rest } = record;
  return JSON.stringify({
    ...rest,
    imagesMeta: images?.map(f => ({ name: f.name, size: f.size, type: f.type })) || []
  });
}

export async function createRecord(data) {
  const id = genId();
  const record = { id, createdAt: Date.now(), ...data };
  localStorage.setItem(PREFIX + id, serialize(record));
  return record;
}

export async function getRecord(id) {
  const raw = localStorage.getItem(PREFIX + id);
  if(!raw) return null;
  return JSON.parse(raw);
}

export async function listRecords() {
  const arr = [];
  for (let i=0;i<localStorage.length;i++){
    const k = localStorage.key(i);
    if(k && k.startsWith(PREFIX)){
      try { arr.push(JSON.parse(localStorage.getItem(k))); } catch {}
    }
  }
  return arr.sort((a,b)=>b.createdAt - a.createdAt);
}