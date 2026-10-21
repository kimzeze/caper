import { clsx } from "clsx";
import type { ComponentProps } from "react";
import Link from "next/link";

import { buttonClass, type ButtonVariant } from "./button-class";

// 버튼 모양 링크 — 누르면 다른 화면으로 간다(새 프로젝트 같은 주요 동작). 생김새는 Button 과 같다.
// 링크 기본 꼴(밑줄, 초점 때 초록 글자)은 버튼 모양에서 끈다.
export default function ButtonLink({
  variant,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      className={buttonClass({
        variant,
        className: clsx(
          "no-underline focus-visible:text-foreground",
          className,
        ),
      })}
      {...props}
    />
  );
}
