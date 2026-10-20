import type { ReactNode } from "react";
import Link from "next/link";

import type { PreviewCase, PreviewFamily } from "../model/types";

// 케이스 하나를 보는 틀. 맨 위 한 줄에 돌아갈 곳과 지금 케이스, 아래에 확인할 것.
// 실제 화면은 children 으로 받아 틀 밖과 같은 폭에 그린다.
export function PreviewCasePage({
  family,
  previewCase,
  children,
}: {
  family: PreviewFamily;
  previewCase: PreviewCase;
  children: ReactNode;
}) {
  return (
    <>
      <header className="measure-col pt-[1.5rlh]">
        <p className="leading-snug">
          <Link href="/preview" className="text-muted-foreground">
            화면 미리보기
          </Link>
          <span aria-hidden className="text-muted-foreground">
            {" / "}
          </span>
          <span className="text-muted-foreground">{family.label}</span>
          <span aria-hidden className="text-muted-foreground">
            {" / "}
          </span>
          <span className="font-bold">{previewCase.label}</span>
        </p>
        <p className="text-base text-muted-foreground">{previewCase.note}</p>
      </header>
      {children}
    </>
  );
}
