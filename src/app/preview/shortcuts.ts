/** 홈에서 화면 미리보기로 바로 가는 버튼. 고정 데이터를 import 하지 않으려고 주소만 둔다. */
export type PreviewShortcut = { label: string; href: string };

// 케이스 key 를 바꾸면 여기도 고친다. 미리보기 묶음(preview-families)이 이 주소의 케이스가 있는지 검사해,
// 없으면 /preview 를 그릴 때(빌드) 실패한다.
export const PREVIEW_SHORTCUTS: readonly PreviewShortcut[] = [
  { label: "전체 목록", href: "/preview" },
  { label: "프로젝트 페이지", href: "/preview/caper-page/to-the-moon" },
  { label: "카테고리", href: "/preview/category-page/many" },
  { label: "참여하기", href: "/preview/join/instant" },
  { label: "승인하기", href: "/preview/join/owner-requests" },
  { label: "만들기 편집기", href: "/preview/new-caper/filled" },
  { label: "데이터 표", href: "/preview/capers/to-the-moon" },
];
