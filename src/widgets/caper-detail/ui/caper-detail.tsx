import { clsx } from "clsx";

import {
  type Caper,
  CAPER_STATUS_LABEL,
  formatHeadcount,
  formatSchedule,
  JOIN_POLICY_LABEL,
  recruitState,
  scheduleDateTime,
  seatsLeft,
} from "@/entities/caper";
import Avatar from "@/shared/ui/avatar";
import Markdown from "@/shared/ui/markdown";

// 사진 아래 내용: 제목 → 슬로건 → 부제 → 날짜 → 상태·사람 수 → 설명 → with(모집 줄, crew 프로필, 빈자리).
// 제목을 표지 위에 얹었으면 showTitle 을 끄고 여기서는 그리지 않는다. 보는 사람이 crew 면(myCrewId) 내 칸에 "나"를 붙인다.
export function CaperDetail({
  caper,
  showTitle,
  myCrewId,
  className,
}: {
  caper: Caper;
  showTitle: boolean;
  myCrewId?: string;
  className?: string;
}) {
  const owners = caper.crew.filter((member) => member.role === "owner");
  const members = caper.crew.filter((member) => member.role === "member");
  // 끝난 프로젝트는 모집 이야기를 빼고 모인 사람 수만 둔다.
  const recruit = recruitState(caper);
  const headcount =
    recruit === "closed" ? `${caper.crew.length}명` : formatHeadcount(caper);

  return (
    <div className={clsx("measure-col pb-[5rlh]", className)}>
      {showTitle && <h1>{caper.title}</h1>}
      {caper.slogan && (
        <p className={clsx("font-bold", showTitle && "mt-[0.5rlh]")}>
          {caper.slogan}
        </p>
      )}
      {caper.subtitle && (
        <p
          className={clsx(
            "text-muted-foreground",
            showTitle && !caper.slogan && "mt-[0.5rlh]",
          )}
        >
          {caper.subtitle}
        </p>
      )}
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
      {caper.description && (
        <Markdown className="mt-[1.5rlh]">{caper.description}</Markdown>
      )}
      <section className="mt-[2rlh]">
        <h2>with</h2>
        {recruit !== "closed" && (
          <p className="text-base text-muted-foreground">
            {[
              headcount,
              ...(recruit === "full"
                ? ["마감"]
                : [
                    caper.capacity === undefined && "인원 제한 없음",
                    JOIN_POLICY_LABEL[caper.joinPolicy],
                  ]),
            ]
              .filter(Boolean)
              .join(" · ")}
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
      </section>
    </div>
  );
}
