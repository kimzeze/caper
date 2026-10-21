import { clsx } from "clsx";
import type { ReactNode } from "react";

import {
  type Caper,
  CAPER_STATUS_LABEL,
  formatHeadcount,
  formatRecruit,
  formatSchedule,
  recruitState,
  scheduleDateTime,
  seatsLeft,
} from "@/entities/caper";
import Avatar from "@/shared/ui/avatar";
import Markdown from "@/shared/ui/markdown";

// 글 몸: 날짜 → 상태·사람 수 → 설명 → with(인원 줄, crew 프로필, 빈자리).
// 날짜와 상태 줄은 넓은 화면에서 왼쪽 정보 표(CaperInfo)가 보여 주므로 감춘다(lg:hidden).
// 보는 사람이 crew 면(myCrewId) 내 칸에 "나"를 붙인다.
export function CaperBody({
  caper,
  myCrewId,
  withFooter,
  className,
}: {
  caper: Caper;
  myCrewId?: string;
  /** with 구역 끝에 붙일 것(만든 사람의 승인 목록 등). */
  withFooter?: ReactNode;
  className?: string;
}) {
  const owners = caper.crew.filter((member) => member.role === "owner");
  const members = caper.crew.filter((member) => member.role === "member");
  // 끝난 프로젝트는 모집 이야기를 빼고 모인 사람 수만 둔다.
  const recruit = recruitState(caper);
  const headcount =
    recruit === "closed" ? `${caper.crew.length}명` : formatHeadcount(caper);

  return (
    <div className={clsx("pb-[5rlh]", className)}>
      <div className="lg:hidden">
        {caper.schedule && (
          <p className="mt-[0.5rlh] tabular-nums">
            <time dateTime={scheduleDateTime(caper.schedule)}>
              {formatSchedule(caper.schedule)}
            </time>
          </p>
        )}
        <p
          className={clsx(
            "text-base text-muted-foreground",
            !caper.schedule && "mt-[0.5rlh]",
          )}
        >
          {CAPER_STATUS_LABEL[caper.status]} · {headcount}
        </p>
      </div>
      {caper.description && (
        <Markdown className="mt-[1.5rlh]">{caper.description}</Markdown>
      )}
      <section className="mt-[2rlh]">
        <h2>with</h2>
        {recruit !== "closed" && (
          <p className="text-base text-muted-foreground">
            {formatRecruit(caper)}
          </p>
        )}
        <ul className="mt-[0.5rlh] grid grid-cols-2 gap-x-4 gap-y-[0.5rlh] sm:grid-cols-3">
          {[...owners, ...members].map((member) => (
            <li key={member.id} className="flex min-w-0 items-center gap-3">
              <Avatar name={member.name} />
              <div className="min-w-0">
                <p className="truncate">{member.name}</p>
                {(member.role === "owner" || member.id === myCrewId) && (
                  <p className="text-base text-muted-foreground">
                    {[
                      member.role === "owner" && "만든 사람",
                      member.id === myCrewId && "나",
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>
            </li>
          ))}
          {recruit === "open" && caper.capacity !== undefined && (
            <li className="flex min-w-0 items-center gap-3 text-muted-foreground">
              <span aria-hidden="true" className="size-10 shrink-0 border" />
              빈자리 {seatsLeft(caper)}
            </li>
          )}
        </ul>
        {withFooter}
      </section>
    </div>
  );
}
