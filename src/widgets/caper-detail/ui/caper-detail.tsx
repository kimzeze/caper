import { clsx } from "clsx";

import { type Caper, CAPER_STATUS_LABEL } from "@/entities/caper";
import Markdown from "@/shared/ui/markdown";

// 사진 아래 내용: 제목 → 슬로건 → 부제 → 상태·crew 수 → 설명 → crew.
// 제목을 표지 위에 얹었으면 showTitle 을 끄고 여기서는 그리지 않는다.
export function CaperDetail({
  caper,
  showTitle,
  className,
}: {
  caper: Caper;
  showTitle: boolean;
  className?: string;
}) {
  const owners = caper.crew.filter((member) => member.role === "owner");
  const members = caper.crew.filter((member) => member.role === "member");

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
      <p className="mt-[0.5rlh] text-base text-muted-foreground">
        {CAPER_STATUS_LABEL[caper.status]} · crew {caper.crew.length}명
      </p>
      {caper.description && (
        <Markdown className="mt-[1.5rlh]">{caper.description}</Markdown>
      )}
      <section className="mt-[2rlh]">
        <h2>crew</h2>
        <ul className="mt-[0.5rlh] flex flex-wrap gap-x-4 gap-y-[0.25rlh]">
          {[...owners, ...members].map((member) => (
            <li key={member.id}>
              {member.name}
              {member.role === "owner" && (
                <span className="text-base text-muted-foreground">
                  {" "}
                  만든 사람
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
