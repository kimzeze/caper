import { clsx } from "clsx";
import type { ReactNode } from "react";

// 데모·도구 아래 지금 일어난 일을 한 줄로 알리는 글. 바뀌면 화면 읽기가 읽어 준다(aria-live).
// 보조색이 기본이고, 오류는 본문색으로 올린다(상태 색은 없다).
export default function Status({
  tone = "default",
  className,
  children,
}: {
  tone?: "default" | "error";
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      aria-live="polite"
      className={clsx(
        "m-0",
        tone === "default" && "text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
