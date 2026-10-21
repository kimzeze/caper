import { clsx } from "clsx";

export type ButtonVariant = "default" | "primary";

// 버튼 모양 클래스. Button(클라이언트)과 ButtonLink(서버에서도 그린다)가 같이 쓴다.
// "use client" 파일에서 내보낸 함수는 서버 컴포넌트에서 부를 수 없어 따로 둔다.
export function buttonClass({
  variant = "default",
  square,
  multiline,
  className,
}: {
  variant?: ButtonVariant;
  square?: boolean;
  multiline?: boolean;
  className?: string;
}) {
  return clsx(
    "inline-flex items-center justify-center gap-2 border-2 focus-border press-down transition-colors",
    square ? "min-w-control px-2" : "px-5",
    multiline
      ? "min-h-control py-2 leading-snug"
      : "h-control leading-none whitespace-nowrap",
    "disabled:cursor-not-allowed disabled:border-border disabled:bg-background disabled:text-muted-foreground",
    variant === "primary"
      ? "border-accent bg-background hover:bg-accent hover:text-on-accent focus-visible:border-foreground focus-visible:shadow-[inset_0_0_0_1px_var(--color-foreground)]"
      : "border-foreground bg-background hover:bg-foreground hover:text-background",
    className,
  );
}
