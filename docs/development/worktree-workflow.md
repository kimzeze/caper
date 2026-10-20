# Orca Worktree Workflow

모든 작업을 최신 `origin/dev` 기반의 Orca worktree에서 격리하고, 생성·setup·이슈
연결·정리를 한 흐름으로 관리한다. 사람이 따라 하는 절차이면서, AI가 "워크트리
만들어" 요청을 받았을 때 따르는 실행 규칙이다.

## 원칙

- 모든 변경은 GitHub 이슈로 추적한다.
- 메인 checkout(`~/project/caper`)은 `dev` 에 두고, 로컬 환경 파일 원본과
  worktree 정리용으로만 쓴다.
- 새 worktree는 Orca가 최신 `origin/dev` 에서 만든다. 경로는 Orca가 정한다
  (`~/project/.worktrees/caper/<task>`).
- 브랜치는 `<type>/<scope>/<issue-num>-<slug>` 전체 이름을 쓴다.
- setup 명령은 레포의 `orca.yaml` 하나로 정한다.
- `dev`, `main` 에 직접 커밋하거나 push하지 않는다.
- PR merge 때 브랜치 삭제 옵션을 쓰지 않는다. 정리 스크립트가 검증한 뒤 지운다.
- stash는 정상 흐름이 아니다. 임시 변경은 별도 이슈·worktree로 옮기거나 사용자
  확인 뒤 버린다.
- `.env.local` 은 setup이 복사하지만 커밋하지 않는다.

## AI 절차

1. 작업 scope와 type을 판단한다(예: 화면 작업이면 `design(web)` 또는
   `feat(web)`). 애매하면 코드 작업 전에 묻는다.
2. 관련 route, view·widget·feature·entity, Supabase 스키마, 문서 영향을 조사한다.
   범위가 크거나 불확실하면 분석 이슈부터 만든다.
3. GitHub 이슈를 만든다. 제목 `<type>(<scope>): <한글 제목>`, 본문 `문제/배경`,
   `검토한 대안`, `선택한 해결 방향`, `검증 기준`.
4. 이슈 번호로 전체 브랜치명을 만든다.
5. 이슈 번호, 전체 브랜치명, 기준 ref `origin/dev` 를 브리핑하고 합의받는다.
   합의 전에는 worktree를 만들지 않는다.
6. Orca로 worktree를 만들고 이슈를 연결한다.
7. setup 성공과 실제 branch·base·issue를 확인한다.
8. 작업 중 새 판단은 이슈와 PR에 남기고, 반복해서 볼 내용은 문서에 적는다.
9. 검증 가능한 의미 단위마다 커밋한다.
10. PR 전에 문서를 고쳐야 하는지 확인한다.
11. 브랜치를 push하고 `dev` 대상 PR을 만든다.
12. 검사 통과 뒤 브랜치 삭제 옵션 없이 merge한다.
13. 그 worktree에서 정리 스크립트를 실행한다.

## Orca CLI로 만들기

```bash
orca worktree create \
  --repo path:$HOME/project/caper \
  --name "<issue-num>-<slug>" \
  --base-branch origin/dev \
  --issue <issue-num> \
  --no-parent \
  --setup run \
  --json
```

`--name` 은 표시 이름이고 브랜치 이름을 정하지 않는다. 만든 직후 실제 브랜치를
확인하고, 합의한 이름과 다르면 코드를 고치기 전에 바꾼다.

```bash
orca worktree show --worktree "id:<repo-id>::<absolute-path>" --json
git -C "<absolute-path>" branch -m "<type>/<scope>/<issue-num>-<slug>"
orca worktree show --worktree "id:<repo-id>::<absolute-path>" --json
```

브랜치명이나 기준 ref가 틀렸으면 작업하지 않는다. 깨끗한 worktree를 지우고
합의한 값으로 다시 만든다.

## Orca 앱으로 만들기

1. caper 프로젝트에서 새 worktree를 연다.
2. 표시 이름과 agent를 고른다.
3. `고급(Advanced)` 에서 `브랜치 이름` 에 전체 브랜치명을 넣고, `브랜치 생성
   기준` 을 `origin/dev` 로 둔다.
4. `orca.yaml` setup을 실행하고 `setup 완료 후 agent 시작` 을 켠다.
5. GitHub 이슈 번호를 연결하고 만든다.
6. setup 성공과 branch·base·issue를 확인한다.

## setup (`orca.yaml`)

Orca가 주는 두 환경변수만 쓴다.

| 변수                 | 뜻                               |
| -------------------- | -------------------------------- |
| `ORCA_ROOT_PATH`     | Orca에 등록된 메인 checkout 경로 |
| `ORCA_WORKTREE_PATH` | 새로 만든 worktree 경로          |

1. 두 경로를 `cd -P`, `pwd -P` 로 실경로로 바꾸고, 같으면 멈춘다.
2. 메인 checkout의 `.env.local` 을 같은 자리로 복사한다.
3. `pnpm-lock.yaml` 이 있으면 `pnpm install --frozen-lockfile` 을 실행한다.

`node_modules/`, `.next/` 같은 생성물은 복사하지 않고 worktree마다 새로 만든다.
새 복사 대상을 더하면 `.gitignore` 도 같이 본다.

## PR과 merge

```bash
git push -u origin <branch>
gh pr create --base dev --head <branch>
gh pr merge <pr-number> --merge
```

PR 본문에 `closes #<issue-num>` 을 넣는다.

## 정리

PR이 `dev` 에 merge된 뒤, 정리할 worktree 안에서 실행한다.

```bash
scripts/worktree-finish.sh --issue <issue-num> --branch <branch>
```

`--branch` 를 빼면 현재 브랜치를 쓴다. 스크립트 순서:

1. 메인 checkout이 아닌 worktree인지, 메인 checkout이 `dev` 에 있고 둘 다
   깨끗한지 확인한다.
2. 브랜치가 보호 브랜치가 아니고 규칙과 이슈 번호에 맞는지 확인한다.
3. 그 브랜치의 PR이 `dev` 로 merge됐는지 확인하고 merge 결과 SHA를 읽는다.
4. 메인 checkout의 `dev` 를 `origin/dev` 로 fast-forward하고, merge 결과가
   들어 있는지 확인한다.
5. worktree를 지우고 `git worktree prune` 을 실행한다.
6. 안전하게 지울 수 있는 로컬 브랜치를 지운다.
7. 원격 브랜치 tip이 PR의 마지막 커밋과 같을 때만 `--force-with-lease` 로 지운다.
8. 이슈가 열려 있으면 정리 결과를 코멘트하고 닫는다.

옵션: `--base <branch>`(기본 dev), `--pr <number>`, `--keep-remote-branch`,
`--keep-issue-open`. merge 확인을 건너뛰는 옵션은 없다.

## 멈추는 경우

worktree를 만들 때:

- 이슈 생성과 합의가 끝나지 않았다.
- 브랜치명이나 기준 ref가 합의한 값과 다르다.
- `ORCA_ROOT_PATH`, `ORCA_WORKTREE_PATH` 가 없거나 실경로가 같다.
- `pnpm install --frozen-lockfile` 이 실패했다.

정리할 때:

- 메인 checkout에서 실행했다.
- 메인 checkout이 `dev` 가 아니거나 커밋하지 않은 변경이 있다.
- 현재 worktree에 커밋하지 않은 변경이 있다.
- 브랜치 규칙이나 `--issue` 번호가 맞지 않는다.
- PR이 merge되지 않았거나 base·head가 다르다.
- merge 결과가 `origin/dev` 에 없다.

원인을 고친 뒤 같은 명령을 다시 실행한다.
