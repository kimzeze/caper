import { clsx } from "clsx";
import Image from "next/image";
import Link from "next/link";

import {
  type Caper,
  CAPER_IMAGE_RATIO,
  CAPER_STATUS_LABEL,
  coverImage,
  formatSchedule,
  imageUrl,
  titleOneLine,
} from "@/entities/caper";

/** 격자의 카드 하나. 주소는 쓰는 쪽이 정한다(미리보기에서는 프로젝트 페이지 미리보기). */
export type GridCaper = { caper: Caper; href: string };

// 첫 화면에 보이는 카드 수(폰 두 줄 × 두 칸). 이 카드들의 표지는 늦추지 않고 바로 불러온다.
const ABOVE_FOLD = 4;

// 프로젝트 포스터 격자(카테고리 모아 보기 등). 폰 두 줄, 넓은 화면 세 줄.
// 카드 = 표지 4:5 + 제목(두 줄까지) + 날짜·상태. 사진이 없으면 같은 자리에 제목을 크게 넣은 글 포스터로 격자를 고르게 둔다.
export function CaperGrid({
  items,
  className,
}: {
  items: readonly GridCaper[];
  className?: string;
}) {
  return (
    <ul
      className={clsx(
        "grid grid-cols-2 gap-x-3 gap-y-[1rlh] sm:grid-cols-3",
        className,
      )}
    >
      {items.map(({ caper, href }, index) => (
        <li key={caper.id}>
          <CaperCard caper={caper} href={href} eager={index < ABOVE_FOLD} />
        </li>
      ))}
    </ul>
  );
}

// 카드 전체가 링크다. 링크 기본 꼴(밑줄, 호버 반전, 초점 때 초록 글자) 대신 초록 고리로 초점을 보이고, 올리면 제목에 밑줄.
// 표지와 글 포스터는 바로 아래 제목과 같은 말이라 화면 읽기가 건너뛴다.
function CaperCard({ caper, href, eager }: GridCaper & { eager: boolean }) {
  const cover = coverImage(caper);
  const meta = [
    caper.schedule && formatSchedule(caper.schedule),
    CAPER_STATUS_LABEL[caper.status],
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Link
      href={href}
      className="group block no-underline hover:bg-transparent hover:text-foreground focus-visible:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <div
        className="relative overflow-hidden bg-muted"
        style={{
          aspectRatio: `${CAPER_IMAGE_RATIO.width} / ${CAPER_IMAGE_RATIO.height}`,
        }}
      >
        {cover ? (
          <Image
            src={imageUrl(cover)}
            alt=""
            fill
            sizes="(min-width: 40rem) 15rem, 50vw"
            loading={eager ? "eager" : undefined}
            className="object-cover"
          />
        ) : (
          <p
            aria-hidden
            className="line-clamp-6 p-3 text-xl leading-tight font-bold whitespace-pre-line"
          >
            {caper.title}
          </p>
        )}
      </div>
      <p className="mt-[0.25rlh] line-clamp-2 font-bold group-hover:underline">
        {titleOneLine(caper.title)}
      </p>
      <p className="text-base text-muted-foreground tabular-nums">{meta}</p>
    </Link>
  );
}
