// 커밋 전 검사(husky pre-commit). staged 파일만 고치고, 타입은 프로젝트 전체를 본다.
const typecheck = () => "pnpm typecheck";

export default {
  "*.{ts,tsx}": ["eslint --fix", "prettier --write", typecheck],
  "*.{js,mjs}": ["eslint --fix", "prettier --write"],
  "*.{css,json,md,yml,yaml}": "prettier --write",
};
