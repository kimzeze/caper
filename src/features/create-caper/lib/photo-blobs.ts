import { createStore, del, get, set, type UseStore } from "idb-keyval";

// 만들기 초안의 자른 사진(Blob)을 브라우저 IndexedDB에 둔다. localStorage는 용량이 작고 문자열만 받는다.
// 순서와 크기는 초안 store(localStorage)가 들고, 여기에는 id로 사진만 둔다. 실제 업로드는 Supabase 연결 이슈에서.
// 스토어는 처음 쓸 때 연다(서버 렌더에서는 IndexedDB가 없다).
let store: UseStore | undefined;
const photoStore = () => (store ??= createStore("caper", "draft-photos"));

export const savePhotoBlob = (id: string, blob: Blob) =>
  set(id, blob, photoStore());

export const loadPhotoBlob = (id: string) => get<Blob>(id, photoStore());

export const deletePhotoBlob = (id: string) => del(id, photoStore());
