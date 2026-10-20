import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const PROTECTED_BRANCHES = new Set(["dev", "main"]);

export function validateBranchFlow(baseBranch, headBranch) {
  if (!baseBranch || !headBranch) {
    return {
      allowed: false,
      reason: "base branch와 head branch가 모두 필요합니다.",
    };
  }

  if (baseBranch === "dev") {
    if (PROTECTED_BRANCHES.has(headBranch)) {
      return {
        allowed: false,
        reason: `${headBranch} → dev 역방향 또는 보호 브랜치 간 PR은 허용하지 않습니다.`,
      };
    }

    if (headBranch.startsWith("hotfix/")) {
      return {
        allowed: false,
        reason: "Hotfix 흐름은 정책 확정 전까지 허용하지 않습니다.",
      };
    }

    return {
      allowed: true,
      reason: "일반 작업 브랜치 → dev 흐름입니다.",
    };
  }

  if (baseBranch === "main") {
    return headBranch === "dev"
      ? {
          allowed: true,
          reason: "dev → main 배포 흐름입니다.",
        }
      : {
          allowed: false,
          reason: "main에는 dev 브랜치만 올릴 수 있습니다.",
        };
  }

  return {
    allowed: false,
    reason: `${baseBranch} 브랜치는 보호 브랜치 흐름 대상이 아닙니다.`,
  };
}

function run() {
  const [baseBranchArgument, headBranchArgument] = process.argv.slice(2);
  const baseBranch = process.env.BASE_BRANCH ?? baseBranchArgument;
  const headBranch = process.env.HEAD_BRANCH ?? headBranchArgument;
  const result = validateBranchFlow(baseBranch, headBranch);
  const flow = `${headBranch || "(없음)"} → ${baseBranch || "(없음)"}`;

  if (!result.allowed) {
    console.error(`허용하지 않는 브랜치 흐름입니다: ${flow}`);
    console.error(result.reason);
    process.exitCode = 1;
    return;
  }

  console.log(`허용된 브랜치 흐름입니다: ${flow}`);
  console.log(result.reason);
}

const isDirectExecution =
  process.argv[1] !== undefined && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectExecution) {
  run();
}
