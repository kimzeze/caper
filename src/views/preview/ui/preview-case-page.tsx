import type { ReactNode } from "react";
import Link from "next/link";

import type { PreviewCase, PreviewFamily } from "../model/types";

// 케이스 하나를 보는 틀. 한 줄에 돌아갈 곳과 지금 케이스, 아래에 확인할 것.
// 실제 화면은 children 으로 받아 틀 밖과 같은 폭에 그린다.
// 화면 전체를 보는 묶음(family.whole)은 첫 화면을 그대로 보도록 안내 줄을 맨 아래에 둔다.
export function PreviewCasePage({
  family,
  previewCase,
  children,
}: {
  family: PreviewFamily;
  previewCase: PreviewCase;
  children: ReactNode;
}) {
  const bar = (
    <div
      className={
        family.whole
          ? "measure-col border-t pt-[0.5rlh] pb-[1.5rlh]"
          : "measure-col pt-[1.5rlh]"
      }
    >
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
    </div>
  );

  return family.whole ? (
    <>
      {children}
      <footer>{bar}</footer>
    </>
  ) : (
    <>
      <header>{bar}</header>
      {children}
    </>
  );
}
