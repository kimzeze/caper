import { clsx } from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  type Caper,
  CAPER_STATUS_LABEL,
  formatRecruit,
  formatScheduleParts,
  scheduleDateTime,
} from "@/entities/caper";

// 넓은 화면 왼쪽 정보 표(eyesmag 글의 왼쪽 칸, design-system-a "답 요약" 꼴): 위아래 2px 선 사이에
// 첫 칸 카테고리(굵게, 모아 보기 링크) → 일정·상태·인원·만든 사람을 1px 선으로 나눈다. 쓰는 쪽이 sticky 로 붙인다.
// 칸이 좁아 일정은 날짜와 시간을 두 줄로 쓴다.
export function CaperInfo({
  caper,
  categoryName,
  categoryHref,
  className,
}: {
  caper: Caper;
  categoryName?: string;
  categoryHref?: string;
  className?: string;
}) {
  const schedule = caper.schedule && formatScheduleParts(caper.schedule);
  const owners = caper.crew
    .filter((member) => member.role === "owner")
    .map((member) => member.name)
    .join(", ");

  return (
    <div className={clsx("border-y-2 border-foreground", className)}>
      {categoryName && (
        <p className="border-b py-[0.5rlh] font-bold">
          {categoryHref ? (
            <Link href={categoryHref}>{categoryName}</Link>
          ) : (
            categoryName
          )}
        </p>
      )}
      <dl className="text-base">
        {caper.schedule && schedule && (
          <Row name="일정">
            <time
              dateTime={scheduleDateTime(caper.schedule)}
              className="tabular-nums"
            >
              {schedule.day}
              {schedule.time && (
                <>
                  <br />
                  {schedule.time}
                </>
              )}
            </time>
          </Row>
        )}
        <Row name="상태">{CAPER_STATUS_LABEL[caper.status]}</Row>
        <Row name="인원">{formatRecruit(caper)}</Row>
        <Row name="만든 사람">{owners}</Row>
      </dl>
    </div>
  );
}

function Row({ name, children }: { name: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 border-b py-[0.5rlh] last:border-b-0">
      <dt className="w-16 shrink-0 text-muted-foreground">{name}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
