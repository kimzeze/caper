import { clsx } from "clsx";

// 프로필 사진 자리 — 이름 첫 글자를 넣은 네모 칸(둥근 모서리 없음). 사진은 로그인이 붙으면 같은 칸에 넣는다.
// 이름은 옆에 따로 쓰므로 칸은 화면 읽기가 건너뛴다.
export default function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initial = [...name.trim()][0]?.toUpperCase() ?? "";
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "inline-flex size-10 shrink-0 items-center justify-center bg-muted font-bold select-none",
        className,
      )}
    >
      {initial}
    </span>
  );
}
