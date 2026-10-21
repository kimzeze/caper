import { CAPER_IMAGE_RATIO } from "@/entities/caper";
import PhotoCarousel, { type CarouselPhoto } from "@/shared/ui/photo-carousel";

export type GalleryPhoto = Omit<CarouselPhoto, "alt">;

// 프로젝트 페이지 맨 위 사진 넘기기(shared/ui 의 PhotoCarousel). 사진 틀은 4:5(CAPER_IMAGE_RATIO)로 고정한다.
// 폰에서는 화면 끝까지 차고, 넓은 화면에서는 본문 폭(--measure)까지만 늘어난다(데스크탑 2단은 #7).
// 사진 주소(src)는 쓰는 쪽이 정한다: 저장된 caper 는 imageUrl, 만들기 미리보기는 브라우저의 임시 사진.
// coverTitle 이 있으면 표지(첫 장) 아래쪽에 어두운 막을 깔고 제목을 얹는다. coverKicker(카테고리)는 그 제목 위 한 줄.
export function CaperGallery({
  photos,
  title,
  coverTitle,
  coverKicker,
}: {
  photos: readonly GalleryPhoto[];
  title: string;
  coverTitle?: string;
  coverKicker?: string;
}) {
  return (
    <div className="mx-auto w-full max-w-(--measure)">
      <PhotoCarousel
        photos={photos.map((photo, index) => ({
          ...photo,
          alt: `${title} 사진 ${index + 1}`,
        }))}
        label={`${title} 사진 ${photos.length}장`}
        aspectRatio={`${CAPER_IMAGE_RATIO.width} / ${CAPER_IMAGE_RATIO.height}`}
        cover={
          coverTitle === undefined ? undefined : (
            <CoverTitle title={coverTitle} kicker={coverKicker} />
          )
        }
      />
    </div>
  );
}

// 사진 위 글자는 사진에 따라 안 읽힐 수 있어 아래쪽에만 어두운 막을 깐다. 글자는 모드와 상관없이 밝다.
function CoverTitle({ title, kicker }: { title: string; kicker?: string }) {
  return (
    <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-stone-950/75 via-stone-950/40 to-transparent pt-[3rlh] pb-[1.5rlh]">
      <div className="measure-col">
        {kicker && <p className="text-base text-stone-200">{kicker}</p>}
        <h1 className={kicker ? "mt-[0.25rlh] text-stone-50" : "text-stone-50"}>
          {title}
        </h1>
      </div>
    </div>
  );
}
