import Link from "next/link";

import type { PreviewFamily } from "../model/types";

// 미리보기 목록. 묶음마다 제목과 설명, 그 아래 케이스 링크와 확인할 것 한 줄(패턴 "목록").
export function PreviewIndexPage({
  families,
}: {
  families: readonly PreviewFamily[];
}) {
  return (
    <main className="measure-col pt-[1.5rlh] pb-[5rlh]">
      <header className="border-b pb-[0.5rlh]">
        <p className="font-mono text-base text-muted-foreground">preview</p>
        <h1>화면 미리보기</h1>
        <p className="mt-[0.25rlh] text-muted-foreground">
          고정 데이터로 화면마다 상태별 모습을 봅니다. 개발 서버와 PR 미리보기
          배포에서만 열립니다.
        </p>
      </header>
      {families.map((family) => (
        <section key={family.key} className="mt-[2rlh]">
          <h2>{family.label}</h2>
          <p className="mt-[0.25rlh] text-muted-foreground">
            {family.description}
          </p>
          <ul className="mt-[1rlh]">
            {family.cases.map((previewCase, index) => (
              <li
                key={previewCase.key}
                className={index > 0 ? "mt-[0.5rlh]" : undefined}
              >
                <Link href={`${family.basePath}/${previewCase.key}`}>
                  {previewCase.label}
                </Link>
                <p className="text-base text-muted-foreground">
                  {previewCase.note}
                </p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </main>
  );
}
