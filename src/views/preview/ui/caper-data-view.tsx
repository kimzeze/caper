import Image from "next/image";

import {
  type Caper,
  CAPER_STATUS_LABEL,
  coverImage,
  formatHeadcount,
  formatSchedule,
  imageUrl,
  isTitleOverCover,
  JOIN_POLICY_LABEL,
} from "@/entities/caper";
import type { Category } from "@/entities/category";

// 고정폭에 한글 낱말(오전·오후)이 들어가지 않게 숫자로만 쓴다: 2026. 10. 18. 18:00
const DATE_FORMAT = new Intl.DateTimeFormat("ko-KR", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Seoul",
});

// caper 데이터를 화면 순서(표지 → 카테고리 → 제목 → 슬로건 → 부제 → 날짜 → 상태 → 설명 → with)대로 그대로 보여 준다.
// 디자인 전 단계의 확인용이고, 실제 프로젝트 페이지는 위젯으로 따로 만든다(패턴 "답 요약"의 이름·값 줄).
export function CaperDataView({
  caper,
  category,
}: {
  caper: Caper;
  category?: Category;
}) {
  const owner = caper.crew.filter((member) => member.role === "owner");
  const members = caper.crew.filter((member) => member.role === "member");
  const cover = coverImage(caper);
  const rows: { name: string; value?: string; mono?: boolean }[] = [
    { name: "카테고리", value: category?.name },
    { name: "제목", value: caper.title },
    {
      name: "제목 위치",
      value: isTitleOverCover(caper)
        ? caper.coverShade
          ? "사진 위(음영)"
          : "사진 위(음영 없음)"
        : caper.titlePlacement === "over"
          ? "아래(사진 위를 골랐지만 사진이 없음)"
          : "아래",
    },
    { name: "슬로건", value: caper.slogan },
    { name: "부제", value: caper.subtitle },
    {
      name: "날짜",
      value: caper.schedule ? formatSchedule(caper.schedule) : undefined,
    },
    { name: "상태", value: CAPER_STATUS_LABEL[caper.status] },
    { name: "설명", value: caper.description },
    { name: "사진", value: `${caper.images.length}장` },
    {
      name: "모집 인원",
      value:
        caper.capacity === undefined
          ? `제한 없음(${formatHeadcount(caper)})`
          : formatHeadcount(caper),
    },
    { name: "참여 확정", value: JOIN_POLICY_LABEL[caper.joinPolicy] },
    {
      name: "with",
      value: [
        ...owner.map((member) => `${member.name}(만든 사람)`),
        ...members.map((member) => member.name),
      ].join(", "),
    },
    {
      name: "만든 시각",
      value: DATE_FORMAT.format(new Date(caper.createdAt)),
      mono: true,
    },
    { name: "id", value: caper.id, mono: true },
  ];

  return (
    <main className="measure-col mt-[1.5rlh] pb-[5rlh]">
      {cover ? (
        <Image
          src={imageUrl(cover)}
          alt={`${caper.title} 표지`}
          width={cover.width}
          height={cover.height}
          sizes="(max-width: 40rem) 50vw, 15rem"
          className="h-auto w-1/2 max-w-60"
          loading="eager"
        />
      ) : (
        <p className="text-muted-foreground">사진 없음</p>
      )}
      <dl className="mt-[1rlh] border-t">
        {rows.map((row) => (
          <div
            key={row.name}
            className="flex flex-wrap items-baseline gap-x-4 border-b py-[0.25rlh]"
          >
            <dt className="w-28 font-bold">{row.name}</dt>
            <dd
              className={
                row.value === undefined
                  ? "flex-1 text-muted-foreground"
                  : row.mono
                    ? "flex-1 font-mono text-base"
                    : "flex-1 whitespace-pre-line"
              }
            >
              {row.value ?? "비어 있음"}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
