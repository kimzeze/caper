# Workflow

이슈, 브랜치, PR, 배포 흐름. 모든 코드와 문서 변경은 이 흐름을 따른다.

## 1. 브랜치 흐름

```
feature → (PR) → dev → (PR) → main
```

| 브랜치      | 역할                                                           |
| ----------- | -------------------------------------------------------------- |
| `main`      | production. Vercel production 배포. 항상 배포 가능한 상태      |
| `dev`       | 통합 개발. 모든 작업 브랜치가 먼저 모인다. Vercel preview 배포 |
| 작업 브랜치 | `<type>/<scope>/<issue-num>-<slug>`                            |

`dev`, `main` 은 branch protection으로 보호한다. 직접 push, force push, 삭제가
막혀 있고 PR로만 바뀐다. 작업 브랜치는 PR merge 뒤 지운다. `Branch Flow` 검사는
작업 브랜치 → `dev`, `dev` → `main` 두 조합만 허용한다. hotfix 흐름은 정하지
않았으므로 `hotfix/*` 브랜치와 `main` 직행을 허용하지 않는다.

## 2. 작업 흐름 (작업 브랜치 → dev)

```
이슈 생성 → worktree 생성 → 작업 + 커밋 → PR → 검사 → merge → worktree 정리
```

작업은 메인 checkout에서 브랜치를 바꾸지 않고
[Orca Worktree Workflow](./worktree-workflow.md) 에 따라 이슈 단위 Orca
worktree에서 한다. 메인 checkout은 `dev` 에 두고 로컬 환경 파일 원본과
정리용으로만 쓴다.

AI가 "OO 작업 워크트리 만들어" 요청을 받으면 다음 순서를 따른다.

1. 작업 scope와 type을 판단한다. 애매하면 먼저 묻는다.
2. GitHub 이슈를 만든다.
3. 이슈 번호, 전체 브랜치명, 기준 ref `origin/dev` 를 브리핑하고 합의받는다.
4. 합의 후 Orca로 worktree를 만들고 이슈를 연결한다.
5. 실제 branch·base·issue와 setup 성공을 확인한 뒤 worktree 안에서 작업, 검증,
   커밋, PR을 한다.
6. PR merge 뒤 그 worktree에서 `scripts/worktree-finish.sh` 를 실행한다.

### 이슈

- 제목: `<type>(<scope>): <한글 제목>`, 명사형으로 끝낸다. 예:
  `feat(web): 프로젝트 목록 화면 추가`, `chore(root): Vercel 배포 연결`
- 본문: `문제/배경`, `검토한 대안`, `선택한 해결 방향`, `검증 기준`.
- 작업 범위를 먼저 조사한다. 작고 명확하면 구현 이슈 하나로 가고, 크거나
  불확실하면 분석 이슈를 만들어 하위 구현 이슈 후보와 사용자에게 물을 것을
  정리한다.
- 작업 중 새 버그나 설계 판단이 나오면 같은 이슈에 `추가 발견`, `판단`,
  `해결 방식` 을 덧붙인다.

### 브랜치

```
<type>/<scope>/<issue-num>-<short-slug>
```

- type: `feat | fix | refactor | style | design | chore | docs | test`
- scope: `root | web | db | docs | ios`
- slug: kebab-case, 3~5단어
- 예: `feat/web/12-caper-list`, `feat/db/15-caper-schema`, `chore/root/8-vercel`

### 커밋

[Commit Guide](./commit-guide.md)를 따른다. 하나의 커밋에 하나의 목적, WIP 금지,
서명 금지.

### PR

- base는 `dev`.
- 제목은 커밋과 같은 형식.
- 본문 첫 줄에 `closes #<이슈번호>`. 문제, 검토한 대안, 선택한 해결 방식, 검증
  방법을 쓴다. 리뷰 중 추가로 고친 것도 본문에 남긴다.
- UI 변경은 스크린샷(390px, 필요하면 1280px)을 붙인다.
- 상세: [PR Guide](./pr-guide.md).

### merge

- 검사(PR 제목, 브랜치 흐름, CI)가 통과한 뒤 merge한다. 혼자 작업하므로
  self-merge한다.
- `gh pr merge <n> --merge`. `--delete-branch` 는 쓰지 않는다. 브랜치는 정리
  스크립트가 검증한 뒤 지운다.

## 3. 리뷰 코멘트 반영

PR 리뷰나 리뷰 봇 코멘트는 바로 코드에 반영하지 않는다. 판단할 여지가 없는
변경(아래 예외)만 바로 고치고, 인증·권한·데이터 계약·상태 관리·공통 컴포넌트처럼
설계 판단이 들어가는 변경은 다음 순서를 따른다.

1. `버그 / 보안 / 설계 의견 / 나중에 처리 / 오탐` 으로 나눈다.
2. 실제로 재현되는 문제인지 코드와 문서로 확인한다.
3. 대안을 두 개 이상 적고 장단점을 쓴다.
4. BP 관점의 추천안을 낸다.
5. 사용자 판단이 필요하면 clarify한 뒤 구현한다.
6. 반영하면 이슈와 PR에 `리뷰 내용`, `검토한 대안`, `선택한 해결 방식`,
   `검증 결과` 를 남긴다.

바로 고쳐도 되는 것:

- 오타, import 정렬, 포맷 누락
- 명백한 타입 오류나 lint 오류
- CI 로그가 정확히 가리킨 의존성 보안 패치
- 이슈·PR에서 이미 합의한 범위 안의 단순 누락

## 4. 배포 (dev → main)

`dev` 에 모인 변경을 production으로 올린다.

```bash
gh pr create --base main --head dev \
  --title "release(root): dev → main 배포 (yyyy-mm-dd)" \
  --body "포함된 이슈와 PR 목록"
```

- 본문에 포함된 이슈·PR을 정리한다.
- 검사 통과와 dev preview 확인 뒤 merge한다(`--merge`).
- merge 뒤 production 주소에서 바뀐 화면을 한 번 확인한다.
