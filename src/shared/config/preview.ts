type Env = Readonly<Record<string, string | undefined>>;

/**
 * 화면 미리보기(/preview)를 열어도 되는지. 개발 서버와 Vercel의 preview·development 배포에서만 연다.
 * Vercel 밖의 빌드(로컬 next start, CI)는 VERCEL_ENV 가 없어 닫힌다. 값이 빠져서 production이 열리는 일이 없게
 * 열 조건만 적는다.
 */
export function isPreviewOpen(env: Env = process.env): boolean {
  if (env.NODE_ENV === "development") return true;

  const deployment = env.VERCEL_ENV?.trim();
  return deployment === "preview" || deployment === "development";
}
