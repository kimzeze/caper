import assert from "node:assert/strict";
import test from "node:test";

import { validateBranchFlow } from "./check-branch-flow.mjs";

const allowedFlows = [
  ["dev", "feat/web/12-caper-list"],
  ["dev", "fix/db/13-crew-unique"],
  ["dev", "dependabot/github_actions/actions-checkout-7"],
  ["main", "dev"],
];

const blockedFlows = [
  ["dev", "main"],
  ["dev", "hotfix/web/14-poster-upload"],
  ["main", "feat/web/12-caper-list"],
  ["main", "hotfix/web/14-poster-upload"],
  ["stg", "dev"],
  ["", "feat/web/12-caper-list"],
  ["dev", ""],
];

test("정상 흐름을 허용한다", () => {
  for (const [baseBranch, headBranch] of allowedFlows) {
    assert.equal(
      validateBranchFlow(baseBranch, headBranch).allowed,
      true,
      `${headBranch} → ${baseBranch}`,
    );
  }
});

test("우회 및 미확정 Hotfix 흐름을 차단한다", () => {
  for (const [baseBranch, headBranch] of blockedFlows) {
    assert.equal(
      validateBranchFlow(baseBranch, headBranch).allowed,
      false,
      `${headBranch} → ${baseBranch}`,
    );
  }
});
