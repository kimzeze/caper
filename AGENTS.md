# Project Caper

평범한 계획에 영화 제목 같은 이름을 붙여 하나의 프로젝트로 만들고, 계획하고, 해
보고, 기록하는 서비스다. AI가 작업을 시작하기 전에 이 파일을 먼저 읽는다. 상세
절차는 `docs/development/` 에 있다.

## 제품

- 플랫폼이다. 사용자가 프로젝트를 만들고 포스터를 올리고, 링크로 crew를 모은다.
- 확장 순서: 모바일 웹 → iOS 앱(SwiftUI) → 데스크탑 웹. 안드로이드는 당분간
  없다.
- 디자인은 웹에서 먼저 보고 완성한 뒤 앱으로 옮긴다. 매거진 앱처럼 포스터와 큰
  제목이 중심이다.
- 프로젝트 항목: 사진(최대 10장, 첫 장이 표지), 카테고리(선택), 제목, 제목
  위치(사진 아래·표지 위), 슬로건, 부제, 날짜(선택, 시작·끝 시간), 설명,
  상태(기획·진행·완료), 모집 인원, 참여 확정 방식, crew. 시스템 번호는 붙이지
  않는다. 제목에 번호를 넣는 것은 사용자 자유다.
- 카테고리(`entities/category`): 만든 사람이 만들고 프로젝트를 하나에
  넣는다(velog 시리즈처럼). caper 는 `categoryId` 만 갖고 이름은 카테고리 쪽에만
  둔다(entity 끼리 import하지 않으니 id → 이름은 위쪽 층이 잇는다). 다른
  사람에게도 보인다: 제목 바로 위 한 줄, 표지 위 제목이면 표지 막 안에서 제목
  위. 편집기에서는 제목 위에서 내 카테고리를 고르거나(Select) 그 자리에서 새로
  만든다(이미 있는 이름이면 그것을 고른다). 내 카테고리는 DB 전이라 초안 store
  에 두고, 초안을 버려도 남는다.
- 카테고리 모아 보기(`views/category`): "카테고리" 한 줄 + 이름 + 프로젝트 수 →
  포스터 격자(`widgets/caper-grid`, 폰 두 줄·넓은 화면 세 줄, 새로 만든 것부터).
  카드는 표지 4:5(사진이 없으면 제목을 크게 넣은 글 포스터) + 제목 두 줄 + 날짜·
  상태이고 카드 전체가 링크다. 프로젝트 페이지의 카테고리 이름이 여기로 가는
  링크가 된다(`categoryHref`). 실제 주소는 DB를 붙일 때 정한다.
- 모집: 인원은 제한 없음 또는 2~100명(만든 사람 포함), 참여 확정은 바로 확정
  또는 승인 후 확정(`entities/caper/recruit.ts`). 화면에는 `진행 · 3/6명`, with
  아래 `3/6명 · 바로 확정`, 빈자리 칸, 다 차면 `마감` 으로 보인다. 완료한
  프로젝트는 모집 표시를 빼고 사람 수만 둔다.
- 참여하기(`features/join-caper`): 프로젝트 페이지 아래에 붙는 줄(sticky).
  참여하기 → with에 보일 이름(20자) → 바로 확정이면 참여 중(내 칸에 "나"), 승인
  후 확정이면 승인 기다림(신청 취소). 참여 중이면 나가기, 다 차면
  `인원이 다 찼습니다.` 만 쓴다. 만든 사람과 완료한 프로젝트에는 줄이 없다. 보는
  사람과의 관계는 `CaperViewer`(guest·pending·member·owner), 줄 상태는
  `joinState`. DB 전이라 `/preview/join` 에서 흉내(`useJoinSimulation`)로 눌러
  본다.
- 승인(`features/review-join-requests`): 참여 신청(`JoinRequest`)은 만든
  사람에게만 내려 주고 caper 데이터에는 넣지 않는다. with 구역 끝에
  `승인 기다림 n` 목록(승인·거절), 아래 줄에 `승인 기다림 n명` + 보기. 자리가 다
  차면 승인 버튼 대신 `자리가 다 찼습니다. 모집 인원을 늘리거나 거절합니다.`
  아래에 붙는 줄은 `shared/ui/bottom-bar` 를 같이 쓴다.
- 제목은 작성자가 읽기 좋게 줄을 바꿀 수 있다(세 줄까지,
  `entities/caper/title.ts`). 편집기에서 Enter 가 줄을 바꾸고(폰에 Shift+Enter
  가 없다), 세 줄이 차면 Enter 는 슬로건으로 간다. 저장 전에 빈 줄과 줄 앞뒤
  공백을 빼고(`normalizeTitle`), 화면은 바꾼 자리 그대로(`whitespace-pre-line`),
  사진 대체 글처럼 한 줄이어야 하는 곳은 `titleOneLine`.
- 날짜는 그 지역 벽시계 값 그대로 둔다(`date` YYYY-MM-DD, `start`·`end` HH:MM,
  UTC로 바꾸지 않는다). 하루짜리만 둔다. 보이는 형식은 `formatSchedule` 하나로
  만든다: `10월 24일(토) 10:00 - 12:00`, 연도는 쓰지 않는다.
- 사진 비율은 4:5 하나다(인스타그램 세로 사진과 같다). 올릴 때 이 비율로 자르고,
  스키마도 4:5만 받는다(`CAPER_IMAGE_RATIO`). 화면 틀도 폰·데스크탑 모두 4:5다.
- 프로젝트 페이지: 사진을 옆으로 넘긴다(폰은 화살표 없이 손가락으로, 마우스
  기기는 사진에 올리거나 키보드 초점이면 양옆 이전·다음 버튼, 처음과 끝에서
  멈춤, 사진 바로 밑에 위치 막대). 폰에서는 사진이 화면 폭을 채운다. 그 아래
  제목(24px, 데스크탑 30px), 슬로건, 부제, 날짜, 상태·사람 수, 설명, with(참석자
  프로필: 이름 첫 글자 네모 칸 + 이름, 만든 사람이 먼저) 순서다. 넓은 화면(lg,
  64rem 이상)은 eyesmag 글처럼 2단이다: 위에 헤더, 왼쪽 정보 표(14rem, 위아래
  2px 선 사이 카테고리 → 일정·상태·인원·만든 사람, 스크롤을 따라옴), 오른쪽 본문
  칸(최대 48rem)에 제목 → 사진 → 설명 → with. 바깥 폭은 최대 74rem(`wide-col`,
  화면 끝 여백 24→48px)이고 사이는 최소 64~160px, 남는 폭은 모두 사이로
  간다(`article-grid`, 1280px 에서 약 190px). 헤더·아래 줄·카테고리 모아 보기도
  같은 바깥 폭을 쓴다. 배치는 `widgets/caper-detail` 의 `CaperArticle` 하나이고
  프로젝트 페이지와 만들기 미리보기가 같이 쓴다.
- 링크 복사: 프로젝트 페이지 글 머리 오른쪽(제목·슬로건·부제 옆, 아래쪽 맞춤)에
  2px 네모 링크 버튼(`shared/ui/copy-link-button`). 누르면 지금 주소를 복사하고
  2초 동안 ✓, 화면 읽기에 "링크를 복사했습니다."를 알린다. `navigator.clipboard`
  가 없는 보안 아닌 연결(같은 와이파이 http 주소)은 예전 방식으로 복사한다.
  만들기 미리보기에는 없다(`CaperArticle` 의 `shareable`).
- 만들기(`/new`): 네이버 블로그 글쓰기처럼 완성 모습(프로젝트 페이지) 그대로 한
  화면에서 쓰는 편집기다. 테두리 없는 칸에 카테고리 → 제목 → 슬로건 → 부제 →
  날짜 → 설명 → with(모집 인원, 참여 확정)를 쓰고, 쓰는 대로 브라우저에 임시
  저장한다(`features/create-caper` 의 초안 store). 오른쪽 위 "만들기"를 누르면
  검사하고, DB 전이라 지금은 `/new/preview` 에서 미리 본다.
- 만들기 사진: 맨 위 4:5 자리에서 여러 장을 고르면 한 장씩 자르기
  화면(react-easy-crop, 1080×1350 JPEG)이 뜬다. 최대 10장, 지우기, 사진 아래
  썸네일 줄을 끌어서 순서 바꾸기(`@dnd-kit`: 폰은 길게 눌러, 마우스는 조금
  움직이면, 키보드는 스페이스·방향키, 첫 칸이 표지), 사진이 있으면 "제목을 사진
  위에"(켜면 "음영 넣기", 기본 켬. 끄면 밝은 사진에서 안 보일 수 있다고 알린다).
  자른 사진은 IndexedDB(`idb-keyval`), 순서와 크기는 초안 store 에 둔다. 사진
  넘기기는 `shared/ui/photo-carousel` 을 위젯과 편집기가 같이 쓴다.
- 설명은 마크다운 문자열로 저장한다(GFM, 5000자). 문단 사이는 0이라 Enter 한
  번은 바로 다음 줄이고, 띄우려면 빈 줄을 넣는다. 빈 줄(빈 문단)은 `&nbsp;`
  문단으로 저장해 어느 마크다운 보기에서도 남는다(`markdown-editor` 의
  `keepBlankParagraphs`). 쓰기는 `shared/ui/markdown-editor` (Tiptap 3: 서식
  버튼 + 마크다운 단축키, 기울임·밑줄·취소선 없음), 보기는
  `shared/ui/markdown`(react-markdown + remark-gfm, HTML은 그리지 않음, `#` 은
  소제목으로 낮춤). 둘 다 design-system-a `prose` 와
  `shared/styles/markdown.css` (체크리스트, 코드 블록, 목록 정렬)를 쓴다.
- 열람과 참여: 링크가 있으면 누구나 보고 참여한다. 로그인 없이 참여하면 Supabase
  익명 로그인으로 임시 계정을 만들고, 카카오나 Apple로 로그인하면 같은 계정에
  이어 붙어 저장 같은 기능이 늘어난다.
- 로그인: 카카오, Apple.

## 용어

- 코드·데이터·DB: `caper` (복수 `capers`).
- 화면 문장: "프로젝트". 브랜드: "Project Caper" 또는 "Caper".
- "작전"이라는 말은 쓰지 않는다.
- 참석자: 화면 제목은 "with", 코드·데이터는 `crew`. 문장 속에서는 "함께할 사람".

## 구조와 스택

```
src/          Next.js 앱(App Router). 모바일 웹부터, 나중에 데스크탑
supabase/     DB 마이그레이션·시드. 웹과 앱이 같이 따르는 약속
ios/          SwiftUI 앱(나중에)
docs/         개발 문서
scripts/      워크트리 정리, 브랜치 흐름 검사
```

- Next.js 16 App Router, React 19, TypeScript strict, Tailwind v4, pnpm.
  Turborepo 같은 모노레포 도구는 쓰지 않는다.
- Supabase: Postgres, Auth(카카오·Apple·익명), Storage(포스터).
- 배포: Vercel. `main` 은 production, `dev` 와 PR은 preview.
- 디자인: design-system-a. 토큰·기본 꼴·컴포넌트를 복사해 쓰고, 원본 출처는
  `NOTICE` 에 남긴다.

## 명령어

```bash
pnpm install
pnpm dev            # http://localhost:3100 (aptifit 개발 서버가 3000을 쓴다)
pnpm typecheck      # next typegen && tsc --noEmit
pnpm lint
pnpm format         # CI는 format:check
pnpm build
```

- 폰에서 보기: 같은 와이파이에서 `http://<맥 IP>:3100` (개발 서버가
  `192.168.*.*` 를 허용한다, `next.config.ts` 의 `allowedDevOrigins`).
- 커밋 전에 husky가 lint-staged(ESLint, Prettier, typecheck)를 부른다.
- PR 필수 검사: `quality`(CI), `lint`(PR 제목), `Branch Flow`.
- Next.js 16.4는 학습 데이터와 다를 수 있다. 코드를 쓰기 전에
  `node_modules/next/dist/docs/` 의 해당 문서를 읽는다(맨 아래 Next.js 블록).

### 나중에 AWS로 옮길 수 있게

- 스키마는 `supabase/migrations` 의 SQL로만 바꾼다. 대시보드에서 바꾸지 않는다.
- Supabase 호출은 `entities/*/api.ts` 에만 둔다. 화면과 위젯은 Supabase를 직접
  부르지 않는다.
- 포스터는 DB에 Storage 경로만 저장한다. 전체 URL을 저장하지 않는다.
- 로그인은 소셜(카카오·Apple)과 익명만 쓴다. 비밀번호 로그인은 만들지 않는다.
- Vercel 전용 기능(Blob, KV, Edge Config)을 쓰지 않는다.
- 권한 정책(RLS)은 Supabase Auth에 묶인다. 제약 조건·트리거처럼 Postgres만으로
  되는 규칙은 DB에 두고, RLS에만 있는 규칙은 문서에 적어 둔다.

## 앱 내부 구조 (FSD)

```
src/
├── app/        Next App Router. route, layout, route handler, Server Action 진입
├── views/      페이지 단위 조합 (FSD pages. Next의 pages 폴더와 겹쳐 views)
├── widgets/    화면 덩어리 조합
├── features/   사용자 동작 단위
├── entities/   도메인 모델, api.ts(Supabase 호출), schema.ts(Zod)
└── shared/     ui(design-system-a), lib, config
```

- import 방향은 `app → views → widgets → features → entities → shared` 한
  방향이다. 역방향 금지.
- entity끼리 import하지 않는다(type-only도). 조합은 widget에서 주입한다.
- slice는 `index.ts` 로 public API를 정한다. 내부 파일을 직접 import하지 않는다.
  `shared/ui` 는 파일 경로로 직접 import한다.
- 파일명은 kebab-case. 타입은 `import type`.
- route·page 파일은 얇게 두고 화면 조합은 `views` 에 맡긴다.
- 읽기는 서버 컴포넌트, 쓰기는 Server Action. TanStack Query는 클라이언트에서
  다시 불러와야 하는 곳에만 쓴다. `useEffect` 로 데이터를 불러오지 않는다.
- 입력 검증은 entity의 `schema.ts`(Zod) 하나로 하고, 서버에서도 같은 스키마로
  다시 검증한다.
- 비밀값은 커밋하지 않는다. 비밀값 이름에 `NEXT_PUBLIC_` 를 붙이지 않는다.
- 브라우저에서만 도는 무거운 컴포넌트(Tiptap 편집기 등)는 `next/dynamic` 의
  `ssr: false` 로 불러오고 같은 크기 자리를 먼저 그린다. 서버 prerender에서
  `Math.random()` 같은 값이 나오면 Cache Components 검사에 걸린다.

## 화면 미리보기 (`/preview`)

- 개발 서버와 Vercel preview 배포에서만 열고 production(`VERCEL_ENV` 가
  production이거나 없음)에서는 404다. 조건은 `shared/config/preview.ts` 하나다.
- 화면마다 상태별 케이스(빈 목록, 긴 제목, 사진 없음·한 장·여러 장·가로, 제목
  위치, 상태별, 로딩, 오류)를 고정 데이터로 그린다. DB 없이 실제 위젯을 import해
  그린다.
- 고정 데이터는 `@/entities/<name>/fixtures` 에 두고 스키마로 검사한다. 이
  진입점은 `app/preview` 에서만 import한다.
- 묶음 목록은 `src/app/preview/preview-families.ts`, 케이스 route는
  `src/app/preview/<묶음>/[case]/page.tsx`(`generateStaticParams`). 헤더부터
  화면 전체를 그리는 묶음은 `whole: true` 로 두어 미리보기 안내 줄을 맨 아래로
  보낸다(첫 화면을 그대로 보기 위해).
- `/preview` 는 `ensureStatic = "navigation"` 으로 전부 정적이다. 없는 케이스도
  404로 응답한다. 케이스 route는 개발용이라 `instant = false` 로 이동을 잠깐
  막는다(사용자 화면은 Suspense로 자리를 먼저 그린다).
- 화면이나 상태를 만들거나 바꾸면 같은 PR에서 미리보기 케이스도 고친다.
- 홈(`/`)은 실제 홈(프로젝트 목록) 전까지 개발용 바로 가기 버튼 묶음이다:
  만들기(새 프로젝트, 만들기 미리보기)와, 미리보기가 열리는 곳에서만 화면
  미리보기 바로 가기(`src/app/preview/shortcuts.ts`). 케이스 key 를 바꾸면 바로
  가기도 고친다. 가리키는 케이스가 없으면 미리보기 묶음을 만들 때 빌드가
  실패한다.
- 미리보기 전용 코드는 위젯의 별도 진입점(`@/widgets/<name>/preview`)으로만
  내보내고, 실제 route가 import하는 `index.ts` 에서는 내보내지 않는다.

## UI

- design-system-a 규칙을 따른다(skill `design-system-a`, 정본
  `~/project/design-system-a`). 무채색 stone과 강조색 초록 하나, Pretendard,
  각진 모서리, 그림자 없음, rlh 간격.
- 디자인 시스템에 없는 패턴(포스터 그리드, 표지 같은 것)은 caper에서 같은
  규칙으로 만들고, 디자인 시스템에도 더할지 사용자에게 묻는다. 지금까지
  caper에서 만든 것: 사진 위 제목(아래쪽 어두운 막, 작성자가 끌 수 있음), 사진
  넘기기와 위치 막대, 편집기 칸 (`EditorText`, 초점이면 아래 초록 줄), 버튼 모양
  링크(`ButtonLink`), 마크다운 편집기의 서식 버튼 줄과 체크리스트 칸, 사진
  자르기 화면, 편집기 사진 자리, with 프로필 칸(`shared/ui/avatar`, 이름 첫 글자
  네모)과 빈자리 칸, 아래에 붙는 참여 줄, 포스터 격자 카드(사진 없으면 글
  포스터), 넓은 화면 2단(왼쪽 정보 표, `wide-col`·`article-grid`).
- 390px부터 만들고 1280px을 확인한다. 라이트·다크 둘 다 본다.
- 브라우저 확인은 ego-browser 스킬(ego lite)로 한다.
- 글자는 mangrove 매거진 글에 맞춘다(design-system-a 원본도 같다): 본문
  16px·행간 1.66·자간 -0.02em(폰·데스크탑 같음), 보조 글씨 14px, 제목 h1
  24px(데스크탑 30px)·행간 1.3·자간 -0.04em, h2 20px, h3 16px 굵게. 간격 단위
  rlh 는 본문 줄 높이(26.6px)다. 고정폭 글자는 자간을 좁히지 않는다.
- 로고는 헤더의 소문자 `caper` 를 Urbanist 400(`font-logo`, 36px, 자간
  -0.01em)으로 쓴다. 그 한 벌만 잘라 둔 정적
  파일(`src/app/fonts/Urbanist-Regular.woff2`, 12KB)을 `next/font/local` 로
  싣는다. 이 글꼴은 로고에만 쓰고 본문·제목은 Pretendard 그대로다. 고른 과정과
  후보 비교는 `docs/design/logo.md`. 헤더는 스크롤해도 위에 붙고(높이
  `--site-header`), 폰에서만 아래에 아주 연한 선(옅은 바탕색), 아래 끝에 화면 폭
  전체 스크롤 진행 막대(`shared/ui/scroll-progress`, 2px 잉크)가 있다. 위에 붙는
  정보 표·페이지 안 이동은 `--site-header` 만큼 비킨다.
- 라이트 모드 바탕은 흰색(`#ffffff`)이다(design-system-a 원본도 같다). 다크는
  stone-950 그대로.
- 고정폭 글꼴에 한글을 넣지 않는다. Select 값이 한글이면 `sans` 를 준다.
- 화면 문장은 합니다체. 버튼은 동사 하나. 줄표(—)를 쓰지 않고, 영어 뒤 조사는
  붙여 쓴다. 코드 주석과 개발 문서는 한다체로 쓴다.

## BP 기반 진행

- 설계 판단이 필요한 작업과 리뷰 코멘트는 대안을 두 개 이상 적고 BP 관점의
  추천안을 낸다. 사용자 판단이 필요하면 clarify한 뒤 구현한다.
- 작업 전에 해당 스킬을 읽는다.

| 작업                              | 스킬                                  |
| --------------------------------- | ------------------------------------- |
| Next.js route, 데이터, 메타데이터 | `next-best-practices`                 |
| React 컴포넌트, 성능              | `vercel-react-best-practices`         |
| 폴더 위치, import 경계            | `feature-sliced-design`               |
| DB, Auth, Storage, RLS            | `supabase`                            |
| 화면 만들기                       | `design-system-a`                     |
| 화면 점검(접근성, UX)             | `web-design-guidelines`               |
| 브라우저 확인                     | `ego-browser`                         |
| iOS 앱(나중에)                    | `swiftui-pro`, `swiftui-expert-skill` |

## 작업 흐름

상세: `docs/development/workflow.md`, `docs/development/worktree-workflow.md`.

- 브랜치는 `feature → dev → main` 두 단계다. `dev`, `main` 은 보호 브랜치라 직접
  커밋·push하지 않는다.
- 모든 작업은 GitHub 이슈로 추적한다. 이슈 본문에 `문제/배경`, `검토한 대안`,
  `선택한 해결 방향`, `검증 기준` 을 쓴다.
- 일반 작업은 Orca worktree에서 한다. 메인 checkout에서 브랜치를 바꾸지 않는다.
  - 사용자가 "OO 워크트리 만들어"라고 하면 이슈를 먼저 만들고, 이슈 번호·전체
    브랜치명·기준 ref `origin/dev` 를 브리핑해 합의받은 뒤 만든다.
  - 브랜치: `<type>/<scope>/<issue-num>-<slug>` (예: `feat/web/12-caper-list`).
  - setup은 `orca.yaml` 이 한다. 만든 뒤 실제 branch·base·issue를 확인하기
    전에는 코드를 고치지 않는다.
  - 임시 변경을 stash로 숨기지 않는다. 별도 이슈·worktree로 옮기거나 사용자 확인
    후 버린다.
- PR은 `dev` 로, 본문 첫 줄에 `closes #N`. 문제, 검토한 대안, 선택한 방식을
  쓴다.
- merge는 `gh pr merge <n> --merge` 로 한다(`--delete-branch` 금지). 그다음
  worktree에서 `scripts/worktree-finish.sh --issue <n> --branch <branch>` 를
  실행한다.
- 배포는 `dev → main` PR: `release(root): dev → main 배포 (yyyy-mm-dd)`.
- 리뷰 코멘트는 바로 반영하지 않는다. 오타·포맷·명백한 타입 오류가 아니면
  `버그 / 보안 / 설계 의견 / 나중에 처리 / 오탐` 으로 나누고, 대안과 추천안을
  설명한 뒤 정한다.

## 커밋 규칙

상세: `docs/development/commit-guide.md`.

```text
<타입>(<스코프>): <한글 제목>
```

- 이슈·커밋·PR 제목은 명사형으로 끝낸다(`추가`, `수정`, `정리`). `추가한다`,
  `수정합니다` 같은 서술형은 쓰지 않는다.
- 서명 금지: `Co-Authored-By`, `Signed-off-by`, 생성 도구 문구를 넣지 않는다. PR
  본문도 같다.
- 검증된 의미 단위마다 커밋한다. 커밋 전에 변경 항목을 나열하고 되돌릴 수 있는
  단위로 나눈다. WIP 커밋, 여러 목적 섞기, 포맷과 로직 섞기 금지.
- 화면 구조·여백·크기·문구 배치를 맞추는 변경은 `design`, 코드 포맷만 바꾸면
  `style`.

| 스코프 | 대상                            |
| ------ | ------------------------------- |
| `root` | 루트 설정, CI, 스크립트, 의존성 |
| `web`  | `src/` Next.js 앱               |
| `db`   | `supabase/` 스키마, 정책, 시드  |
| `docs` | `docs/`, README                 |
| `ios`  | `ios/` SwiftUI 앱(나중에)       |

타입: `feat`, `fix`, `refactor`, `style`, `design`, `chore`, `docs`, `test`,
`release`.

## 메타 룰

새 규칙이나 결정이 생기면 바로 문서에 적는다. PR을 만들기 전에 문서를 고쳐야
하는지 확인한다.

| 종류                       | 위치                                    |
| -------------------------- | --------------------------------------- |
| AI가 매번 알아야 하는 규칙 | `AGENTS.md`                             |
| 브랜치·이슈·PR 흐름        | `docs/development/workflow.md`          |
| Orca worktree 절차         | `docs/development/worktree-workflow.md` |
| 커밋 규칙                  | `docs/development/commit-guide.md`      |
| PR 작성·리뷰               | `docs/development/pr-guide.md`          |
| 디자인 결정(로고 글꼴 등)  | `docs/design/`                          |

<!-- next dev 가 이 블록을 다시 써 넣는다. 그 모양 그대로 두도록 Prettier에서 뺀다. -->
<!-- prettier-ignore-start -->
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
<!-- prettier-ignore-end -->
