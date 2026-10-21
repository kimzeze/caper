"use client";

import { useEffect, useId, useRef, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";

import { CAPER_IMAGE_RATIO } from "@/entities/caper";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Slider from "@/shared/ui/slider";
import Status from "@/shared/ui/status";

import { cropPhoto } from "../lib/crop-photo";

const ZOOM = { min: 1, max: 3 } as const;

// 고른 사진 하나를 4:5로 자르는 전체 화면(인스타그램처럼 끌어서 옮기고, 벌리거나 슬라이더로 확대).
// 여러 장을 고르면 차례로 연다(position/total). 완료는 1080×1350 JPEG를 넘기고, 취소(또는 Esc)는 남은 사진까지 그만둔다.
// 사진 주소(src, blob:)는 쓰는 쪽이 사진을 고를 때 만들고 거둔다(여기서 만들면 개발 모드 StrictMode의 effect 정리에 먼저 거둬진다).
// 키보드: 자르기 칸에 초점을 두면 방향키로 옮긴다(react-easy-crop), 확대는 슬라이더.
export function PhotoCropDialog({
  file,
  src,
  position,
  total,
  onDone,
  onCancel,
}: {
  file: File;
  src: string;
  position: number;
  total: number;
  onDone: (blob: Blob) => Promise<void> | void;
  onCancel: () => void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCancelRef = useRef(onCancel);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(ZOOM.min);
  const [area, setArea] = useState<Area | null>(null);
  // 완료는 사진을 다 불러오면 켠다. 사진이 처음부터 4:5면 자를 자리를 옮길 일이 없어
  // onCropComplete 가 오지 않으므로 그것을 기다리지 않는다(cropPhoto 가 가운데를 자른다).
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onCancelRef.current = onCancel;
  }, [onCancel]);

  // 열리면 이 화면에 초점을 두고(완료는 자를 자리를 잡기 전엔 꺼져 있어 초점을 받지 못한다),
  // Esc는 초점이 어디 있든 받는다.
  useEffect(() => {
    dialogRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancelRef.current();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // 자르는 동안 뒤 화면이 같이 스크롤되지 않게 막는다.
  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  const done = async () => {
    if (!loaded || busy) return;
    setBusy(true);
    setError(null);
    try {
      await onDone(await cropPhoto(file, area));
    } catch {
      setError("사진을 자르지 못했습니다. 다른 사진으로 해 보세요.");
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      ref={dialogRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex flex-col bg-background focus-visible:outline-none"
    >
      <header className="border-b">
        <div className="measure-col flex min-h-control items-center justify-between gap-4 py-[0.25rlh]">
          <Button onClick={onCancel}>취소</Button>
          <p id={titleId} className="font-bold">
            사진 자르기{" "}
            <span className="font-mono text-base font-normal">
              {position}/{total}
            </span>
          </p>
          <Button
            variant="primary"
            onClick={done}
            disabled={!loaded || busy}
            aria-busy={busy || undefined}
          >
            완료
          </Button>
        </div>
      </header>
      <div className="relative min-h-0 flex-1 bg-stone-950">
        <Cropper
          image={src}
          crop={crop}
          zoom={zoom}
          minZoom={ZOOM.min}
          maxZoom={ZOOM.max}
          aspect={CAPER_IMAGE_RATIO.width / CAPER_IMAGE_RATIO.height}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={(_, pixels) => setArea(pixels)}
          onMediaLoaded={() => setLoaded(true)}
          showGrid
          keyboardStep={10}
          mediaProps={{ alt: "자를 사진" }}
        />
      </div>
      <div className="measure-col py-[1rlh]">
        <Field label="확대" value={`${zoom.toFixed(1)}×`}>
          <Slider
            value={Math.round(zoom * 100)}
            onValueChange={(value) => setZoom(value / 100)}
            min={ZOOM.min * 100}
            max={ZOOM.max * 100}
          />
        </Field>
        {error && (
          <Status tone="error" className="mt-[0.5rlh] font-bold">
            {error}
          </Status>
        )}
      </div>
    </div>
  );
}
