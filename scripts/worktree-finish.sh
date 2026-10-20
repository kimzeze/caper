#!/usr/bin/env bash

set -euo pipefail

DEFAULT_BASE_BRANCH="dev"

usage() {
  cat <<'EOF'
Usage:
  scripts/worktree-finish.sh --issue <number> [options]

Run this command from the Orca worktree that should be cleaned up.

Required:
  --issue <number>      GitHub issue number included in the feature branch.

Options:
  --base <branch>       PR base branch to verify and update locally. Default: dev
  --branch <branch>     Expected feature branch. Defaults to the current worktree branch.
  --pr <number>         PR number to verify. Defaults to looking up the PR by branch.
  --keep-remote-branch  Do not delete the merged remote feature branch.
  --keep-issue-open     Do not close the GitHub issue after cleanup.
  -h, --help            Show this help.

Example:
  scripts/worktree-finish.sh --issue 12 --branch feat/web/12-caper-list
EOF
}

die() {
  echo "error: $*" >&2
  exit 1
}

info() {
  echo "==> $*"
}

require_value() {
  local option="$1"
  local value="${2:-}"

  [[ -n "$value" ]] || die "${option} requires a value."
}

issue=""
base_branch="$DEFAULT_BASE_BRANCH"
branch=""
pr_number=""
keep_remote_branch="false"
keep_issue_open="false"
resolved_pr_number=""
pr_merge_result_oid=""
pr_source_oid=""
local_branch_status="not-found"
remote_branch_status="not-found"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --issue)
      require_value "$1" "${2:-}"
      issue="$2"
      shift 2
      ;;
    --base)
      require_value "$1" "${2:-}"
      base_branch="$2"
      shift 2
      ;;
    --branch)
      require_value "$1" "${2:-}"
      branch="$2"
      shift 2
      ;;
    --pr)
      require_value "$1" "${2:-}"
      pr_number="$2"
      shift 2
      ;;
    --keep-remote-branch)
      keep_remote_branch="true"
      shift
      ;;
    --keep-issue-open)
      keep_issue_open="true"
      shift
      ;;
    -h | --help)
      usage
      exit 0
      ;;
    *)
      die "unknown argument: $1"
      ;;
  esac
done

[[ "$issue" =~ ^[0-9]+$ ]] || die "--issue must be a number."
[[ "$base_branch" =~ ^[A-Za-z0-9._/-]+$ ]] || die "--base contains unsupported characters."
[[ -z "$pr_number" || "$pr_number" =~ ^[0-9]+$ ]] || die "--pr must be a number."

command -v git >/dev/null 2>&1 || die "git is required."
command -v gh >/dev/null 2>&1 || die "gh is required."

git rev-parse --is-inside-work-tree >/dev/null 2>&1 ||
  die "this script must be run inside the Orca worktree to clean up."

worktree_path="$(git rev-parse --show-toplevel)"
git_dir="$(git rev-parse --path-format=absolute --git-dir)"
common_git_dir="$(git rev-parse --path-format=absolute --git-common-dir)"
main_worktree_path="$(dirname "$common_git_dir")"

[[ "$git_dir" != "$common_git_dir" ]] ||
  die "refusing to run from the main checkout. Run this script from the Orca feature worktree."

git -C "$main_worktree_path" rev-parse --is-inside-work-tree >/dev/null 2>&1 ||
  die "could not resolve the main checkout from the current worktree."

repo_name="$(basename "$main_worktree_path")"
[[ "$repo_name" == "caper" ]] ||
  die "this script must be run inside a caper worktree."

main_branch="$(git -C "$main_worktree_path" branch --show-current)"
[[ "$main_branch" == "$base_branch" ]] ||
  die "main checkout must be on '${base_branch}'. Current branch: ${main_branch:-detached}."

if [[ -n "$(git -C "$main_worktree_path" status --porcelain --untracked-files=all)" ]]; then
  die "main checkout has uncommitted changes. Clean it before finishing the worktree."
fi

if [[ -n "$(git -C "$worktree_path" status --porcelain --untracked-files=all)" ]]; then
  die "current worktree has uncommitted changes: ${worktree_path}"
fi

detected_branch="$(git -C "$worktree_path" branch --show-current)"
[[ -n "$detected_branch" ]] || die "could not detect the current worktree branch."

if [[ -z "$branch" ]]; then
  branch="$detected_branch"
elif [[ "$branch" != "$detected_branch" ]]; then
  die "expected branch '${branch}', but the current worktree is on '${detected_branch}'."
fi

case "$branch" in
  dev | main | master | "$base_branch")
    die "refusing to remove protected branch worktree: ${branch}"
    ;;
esac

branch_pattern='^(feat|fix|refactor|style|design|chore|docs|test)/(root|web|db|docs|ios)/([0-9]+)-[a-z0-9]+(-[a-z0-9]+)*$'
[[ "$branch" =~ $branch_pattern ]] ||
  die "branch must match <type>/<scope>/<issue-number>-<slug>: ${branch}"

branch_issue="${BASH_REMATCH[3]}"
[[ "$branch_issue" == "$issue" ]] ||
  die "branch issue #${branch_issue} does not match --issue #${issue}."

issue_state="$(gh issue view "$issue" --json state --jq '.state')"

info "Verifying merged PR"
if [[ -n "$pr_number" ]]; then
  pr_query="$pr_number"
else
  pr_query="$branch"
fi

pr_info="$(
  gh pr view "$pr_query" \
    --json number,state,mergedAt,baseRefName,headRefName \
    --jq '[.number, .state, (.mergedAt // ""), .baseRefName, .headRefName] | @tsv'
)"

IFS=$'\t' read -r resolved_pr_number pr_state pr_merged_at pr_base pr_head <<<"$pr_info"

[[ "$pr_state" == "MERGED" ]] || die "PR #${resolved_pr_number} is not merged."
[[ -n "$pr_merged_at" ]] || die "PR #${resolved_pr_number} has no mergedAt value."
[[ "$pr_base" == "$base_branch" ]] ||
  die "PR #${resolved_pr_number} base is '${pr_base}', expected '${base_branch}'."
[[ "$pr_head" == "$branch" ]] ||
  die "PR #${resolved_pr_number} head is '${pr_head}', expected '${branch}'."

if ! pr_commit_info="$(
  gh api "repos/{owner}/{repo}/pulls/${resolved_pr_number}" \
    --jq '[.merge_commit_sha // "", .head.sha // ""] | @tsv' 2>/dev/null
)"; then
  die "could not read commit evidence for PR #${resolved_pr_number}."
fi

IFS=$'\t' read -r pr_merge_result_oid pr_source_oid <<<"$pr_commit_info"

[[ "$pr_merge_result_oid" =~ ^[0-9a-f]{40,64}$ ]] ||
  die "PR #${resolved_pr_number} has no valid merge-result commit."

if [[ ! "$pr_source_oid" =~ ^[0-9a-f]{40,64}$ ]]; then
  pr_source_oid=""
  echo "warning: could not verify the source head commit for PR #${resolved_pr_number}." >&2
  echo "warning: the remote feature branch will be preserved if it still exists." >&2
fi

info "Synchronizing ${base_branch} in the main checkout"
git -C "$main_worktree_path" fetch --prune origin "$base_branch"
git -C "$main_worktree_path" show-ref --verify --quiet "refs/remotes/origin/${base_branch}" ||
  die "origin/${base_branch} does not exist."
git -C "$main_worktree_path" merge --ff-only "refs/remotes/origin/${base_branch}"

git -C "$main_worktree_path" merge-base \
  --is-ancestor "$pr_merge_result_oid" "refs/remotes/origin/${base_branch}" ||
  die "PR #${resolved_pr_number} merge result is not contained in origin/${base_branch}."

info "Removing current worktree"
cd "$main_worktree_path"
git worktree remove "$worktree_path"
git worktree prune

if git show-ref --verify --quiet "refs/heads/${branch}"; then
  if git branch -d "$branch" >/dev/null 2>&1; then
    info "Deleted local branch ${branch}"
    local_branch_status="deleted"
  else
    echo "warning: local branch '${branch}' was not deleted because Git does not consider it merged." >&2
    echo "warning: review it manually before deleting." >&2
    local_branch_status="failed"
  fi
fi

if [[ "$keep_remote_branch" == "true" ]]; then
  remote_branch_status="kept"
else
  remote_branch_info=""
  if ! remote_branch_info="$(git ls-remote --heads origin "refs/heads/${branch}")"; then
    echo "warning: could not read the remote tip for '${branch}'." >&2
    echo "warning: preserving the remote branch; manual review is required." >&2
    remote_branch_status="preserved-unverified"
  elif [[ -z "$remote_branch_info" ]]; then
    remote_branch_status="not-found"
  else
    IFS=$'\t' read -r remote_branch_oid remote_branch_ref <<<"$remote_branch_info"

    if [[ "$remote_branch_ref" != "refs/heads/${branch}" || ! "$remote_branch_oid" =~ ^[0-9a-f]{40,64}$ ]]; then
      echo "warning: received unexpected remote branch data for '${branch}'." >&2
      echo "warning: preserving the remote branch; manual review is required." >&2
      remote_branch_status="preserved-unverified"
    elif [[ -z "$pr_source_oid" ]]; then
      echo "warning: preserving remote branch '${branch}' because PR source commit evidence is unavailable." >&2
      echo "warning: manual review is required before deleting it." >&2
      remote_branch_status="preserved-unverified"
    elif [[ "$remote_branch_oid" != "$pr_source_oid" ]]; then
      echo "warning: preserving remote branch '${branch}' because its tip differs from the merged PR source commit." >&2
      echo "warning: remote tip ${remote_branch_oid}; PR source ${pr_source_oid}. Manual review is required." >&2
      remote_branch_status="preserved-advanced"
    else
      info "Deleting remote branch ${branch} at verified PR source ${pr_source_oid}"
      if git push \
        --force-with-lease="refs/heads/${branch}:${pr_source_oid}" \
        origin ":refs/heads/${branch}" >/dev/null; then
        git fetch --prune origin >/dev/null 2>&1 || true
        remote_branch_status="deleted"
      else
        echo "warning: failed to delete remote branch '${branch}' at the verified tip." >&2
        echo "warning: preserving it for manual review." >&2
        remote_branch_status="failed"
      fi
    fi
  fi
fi

if [[ "$keep_issue_open" != "true" && "$issue_state" == "OPEN" ]]; then
  info "Closing issue #${issue}"
  issue_comment="PR #${resolved_pr_number}이 ${base_branch}에 머지되었습니다.

정리:
- Orca worktree ${worktree_path} 제거
- 로컬 ${base_branch} 최신화"

  case "$local_branch_status" in
    deleted)
      issue_comment="${issue_comment}
- 로컬 브랜치 ${branch} 삭제"
      ;;
    failed)
      issue_comment="${issue_comment}
- 로컬 브랜치 ${branch} 삭제 실패: 수동 확인 필요"
      ;;
  esac

  case "$remote_branch_status" in
    deleted)
      issue_comment="${issue_comment}
- 원격 브랜치 ${branch} 삭제"
      ;;
    failed)
      issue_comment="${issue_comment}
- 원격 브랜치 ${branch} 삭제 실패: 수동 확인 필요"
      ;;
    preserved-advanced)
      issue_comment="${issue_comment}
- 원격 브랜치 ${branch} 보존: 현재 tip이 PR 마지막 source commit과 다름, 수동 확인 필요"
      ;;
    preserved-unverified)
      issue_comment="${issue_comment}
- 원격 브랜치 ${branch} 보존: PR source commit 또는 원격 tip 검증 불가, 수동 확인 필요"
      ;;
    kept)
      issue_comment="${issue_comment}
- 원격 브랜치 ${branch} 보존"
      ;;
  esac

  if ! gh issue close "$issue" --comment "$issue_comment" >/dev/null; then
    echo "warning: failed to close issue #${issue}. Close it manually if appropriate." >&2
  fi
fi

cat <<EOF

Finished worktree cleanup.

Removed:
  ${worktree_path}

Updated:
  ${base_branch}
EOF
