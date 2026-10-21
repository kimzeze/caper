"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import { CAPER_LIMITS, EMPTY_CREATE_CAPER_FORM } from "@/entities/caper";

import { useDraftPhotoUrls } from "../hooks/use-draft-photo-urls";
import { CROPPED_PHOTO } from "../lib/crop-photo";
import { deletePhotoBlob, savePhotoBlob } from "../lib/photo-blobs";
import {
  useDraftActions,
  useDraftPhotos,
  useLoadedDraft,
} from "../model/draft-store";
import { CaperEditorForm } from "./caper-editor-form";
import { EditorPhotos } from "./editor-photos";
import { PhotoCropDialog } from "./photo-crop-dialog";

// 편집기를 임시 저장과 잇는다. 초안을 불러오기 전에는 같은 자리에 빈 편집기를 보이지 않게 그려 두고
// (늦게 온 내용이 화면을 밀지 않게), 불러오면 그 초안으로 다시 그린다.
// 사진: 고른 사진을 한 장씩 자르기 화면에 띄우고(차례), 자른 사진은 IndexedDB에, 순서와 크기는 초안 store 에 둔다.
// 만들기: 아직 DB가 없어 저장하지 않고 미리보기로 간다(Supabase를 붙이면 실제로 만든다).
export function CreateCaperEditor() {
  const router = useRouter();
  const draft = useLoadedDraft();
  const photos = useDraftPhotos();
  const urls = useDraftPhotoUrls(photos);
  const { editDraft, addPhoto, removePhoto, arrangePhotos } = useDraftActions();

  // 자를 차례를 기다리는 사진들(첫 장을 지금 자른다). 화면 주소(blob:)는 고를 때 만들고 차례에서 빠질 때 거둔다.
  const [queue, setQueue] = useState<{ file: File; src: string }[]>([]);
  const [queueTotal, setQueueTotal] = useState(0);
  const [notice, setNotice] = useState<string | null>(null);

  const loaded = draft !== undefined && photos !== undefined;
  const photoCount = photos?.length ?? 0;

  const pickFiles = (files: File[]) => {
    const room = CAPER_LIMITS.images - photoCount;
    const taken = files.slice(0, Math.max(room, 0));
    setNotice(
      files.length > room
        ? `사진은 ${CAPER_LIMITS.images}장까지라 앞의 ${taken.length}장만 넣습니다.`
        : null,
    );
    setQueue(taken.map((file) => ({ file, src: URL.createObjectURL(file) })));
    setQueueTotal(taken.length);
  };

  const dropFromQueue = (count: number) =>
    setQueue((rest) => {
      for (const item of rest.slice(0, count)) URL.revokeObjectURL(item.src);
      return rest.slice(count);
    });

  const cropDone = async (blob: Blob) => {
    const id = crypto.randomUUID();
    await savePhotoBlob(id, blob);
    addPhoto({ id, ...CROPPED_PHOTO });
    dropFromQueue(1);
  };

  const remove = (id: string) => {
    removePhoto(id);
    void deletePhotoBlob(id);
  };

  const editorPhotos = (photos ?? []).flatMap((photo) => {
    const src = urls[photo.id];
    return src === undefined ? [] : [{ id: photo.id, src }];
  });
  const cropping = queue[0];

  return (
    <div className={clsx(!loaded && "invisible")}>
      <CaperEditorForm
        key={loaded ? "loaded" : "loading"}
        defaultValues={draft ?? EMPTY_CREATE_CAPER_FORM}
        onDraftChange={editDraft}
        onCreate={(values) => {
          editDraft(values);
          router.push("/new/preview");
        }}
        hasPhotos={photoCount > 0}
        photos={
          <EditorPhotos
            photos={editorPhotos}
            notice={notice}
            onPickFiles={pickFiles}
            onRemove={remove}
            onReorder={arrangePhotos}
          />
        }
      />
      {cropping !== undefined && (
        <PhotoCropDialog
          key={cropping.src}
          file={cropping.file}
          src={cropping.src}
          position={queueTotal - queue.length + 1}
          total={queueTotal}
          onDone={cropDone}
          onCancel={() => dropFromQueue(queue.length)}
        />
      )}
    </div>
  );
}
