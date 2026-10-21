import { CAPER_IMAGE_RATIO } from "@/entities/caper";

/** 자른 사진 크기. 4:5(인스타그램 세로 사진과 같은 1080×1350). */
export const CROPPED_PHOTO = {
  width: CAPER_IMAGE_RATIO.width * 270,
  height: CAPER_IMAGE_RATIO.height * 270,
} as const;

export type CropArea = { x: number; y: number; width: number; height: number };

/** 사진 가운데의 가장 큰 4:5 영역. */
function centeredArea(width: number, height: number): CropArea {
  const ratio = CAPER_IMAGE_RATIO.width / CAPER_IMAGE_RATIO.height;
  if (width / height > ratio) {
    const cropWidth = height * ratio;
    return { x: (width - cropWidth) / 2, y: 0, width: cropWidth, height };
  }
  const cropHeight = width / ratio;
  return { x: 0, y: (height - cropHeight) / 2, width, height: cropHeight };
}

/**
 * 고른 사진에서 area(원본 픽셀 기준, react-easy-crop 의 croppedAreaPixels)를 잘라 1080×1350 JPEG로 만든다.
 * area 가 없으면(사진이 처음부터 4:5라 자를 자리를 옮긴 적이 없으면) 가운데의 가장 큰 4:5를 자른다.
 * 사진의 회전 정보(EXIF)는 브라우저가 화면과 같게 바로 세운다(createImageBitmap 의 기본값).
 */
export async function cropPhoto(
  file: Blob,
  area: CropArea | null,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const source = area ?? centeredArea(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");
  canvas.width = CROPPED_PHOTO.width;
  canvas.height = CROPPED_PHOTO.height;
  const context = canvas.getContext("2d");
  if (context === null) throw new Error("캔버스를 쓸 수 없습니다.");
  context.imageSmoothingQuality = "high";
  context.drawImage(
    bitmap,
    source.x,
    source.y,
    source.width,
    source.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  bitmap.close();

  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("사진을 만들지 못했습니다.")),
      "image/jpeg",
      0.85,
    ),
  );
}
