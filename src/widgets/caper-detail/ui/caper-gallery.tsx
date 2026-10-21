import { clsx } from "clsx";
import Link from "next/link";

import { CAPER_IMAGE_RATIO, titleOneLine } from "@/entities/caper";
import CoverText, { type CoverPosition } from "@/shared/ui/cover-text";
import PhotoCarousel, { type CarouselPhoto } from "@/shared/ui/photo-carousel";

export type GalleryPhoto = Omit<CarouselPhoto, "alt">;

// 프로젝트 페이지 맨 위 사진 넘기기(shared/ui 의 PhotoCarousel). 사진 틀은 4:5(CAPER_IMAGE_RATIO)로 고정한다.
// 폰에서는 화면 끝까지 차고, 넓은 화면 한 단에서는 본문 폭(--measure)까지, 2단(lg)에서는 본문 칸(--article)을 채운다.
// 사진 주소(src)는 쓰는 쪽이 정한다: 저장된 caper 는 imageUrl, 만들기 미리보기는 브라우저의 임시 사진.
// coverTitle 이 있으면 표지(첫 장) 아래쪽에 제목을 얹는다. coverKicker(카테고리)는 그 제목 위 한 줄,
// coverKickerHref 가 있으면 카테고리 모아 보기로 가는 링크. 넓은 화면에서는 왼쪽 정보 표가 보여 주므로 감춘다.
// coverShade 를 끄면 어두운 막 없이 같은 자리에 둔다(작성자가 고른다).
export function CaperGallery({
  photos,
  title,
  coverTitle,
  coverKicker,
  coverKickerHref,
  coverShade = true,
  coverPosition,
}: {
  photos: readonly GalleryPhoto[];
  title: string;
  coverTitle?: string;
  coverKicker?: string;
  coverKickerHref?: string;
  coverShade?: boolean;
  /** 표지 위 제목 자리(0~1 비율). 없으면 기본(왼쪽 아래). */
  coverPosition?: CoverPosition;
}) {
  // 사진 대체 글과 묶음 이름은 한 줄로 읽는다(작성자가 바꾼 줄은 공백으로).
  const name = titleOneLine(title);

  return (
    <div className="mx-auto w-full max-w-(--measure) lg:max-w-none">
      <PhotoCarousel
        // 넓은 화면에서는 2단 본문 칸(--article)을 채운다.
        sizes="(min-width: 64rem) 48rem, (min-width: 45rem) 45rem, 100vw"
        photos={photos.map((photo, index) => ({
          ...photo,
          alt: `${name} 사진 ${index + 1}`,
        }))}
        label={`${name} 사진 ${photos.length}장`}
        aspectRatio={`${CAPER_IMAGE_RATIO.width} / ${CAPER_IMAGE_RATIO.height}`}
        cover={
          coverTitle === undefined ? undefined : (
            <CoverTitle
              title={coverTitle}
              kicker={coverKicker}
              kickerHref={coverKickerHref}
              shade={coverShade}
              position={coverPosition}
            />
          )
        }
      />
    </div>
  );
}

// 표지 위 제목(shared/ui/cover-text): 작성자가 옮긴 자리(position), 음영은 제목 높이의 어두운 띠.
// 넓은 화면은 제목을 글 머리에 두므로 표지 위 제목(막 포함)을 감춘다.
function CoverTitle({
  title,
  kicker,
  kickerHref,
  shade,
  position,
}: {
  title: string;
  kicker?: string;
  kickerHref?: string;
  shade: boolean;
  position?: CoverPosition;
}) {
  return (
    <CoverText position={position} shade={shade} className="lg:hidden">
      {kicker && (
        <p className="text-base text-stone-200">
          {kickerHref ? (
            <Link href={kickerHref} className="text-stone-200">
              {kicker}
            </Link>
          ) : (
            kicker
          )}
        </p>
      )}
      <h1
        className={clsx(
          "whitespace-pre-line text-stone-50",
          kicker && "mt-[0.25rlh]",
        )}
      >
        {title}
      </h1>
    </CoverText>
  );
}
