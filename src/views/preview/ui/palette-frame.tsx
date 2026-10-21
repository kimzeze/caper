import type { CSSProperties, ReactNode } from "react";

// 글자색 비교용 틀. 안의 화면만 디자인 토큰(--color-*)을 덮어 다른 색으로 그리고, 라이트로 고정한다
// (토큰이 light-dark() 라 color-scheme 을 light 로 두면 다크 모드에서도 라이트 값이 나온다).
// 개발용 미리보기에서만 쓴다. 실제 색은 design-system-a theme.css 가 정한다.
export function PaletteFrame({
  tokens,
  children,
}: {
  tokens: Readonly<Record<string, string>>;
  children: ReactNode;
}) {
  return (
    <div
      style={{ colorScheme: "light", ...tokens } as CSSProperties}
      className="min-h-svh bg-background text-foreground"
    >
      {children}
    </div>
  );
}
