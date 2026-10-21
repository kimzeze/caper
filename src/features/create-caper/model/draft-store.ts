"use client";

import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  CAPER_LIMITS,
  type CreateCaperFormValues,
  EMPTY_CREATE_CAPER_FORM,
} from "@/entities/caper";

// 만들기 편집기의 초안. 쓰는 대로 localStorage에 남겨, 새로고침하거나 사진첩에 다녀와도 이어서 쓴다.
// 편집기와 미리보기 화면이 같은 초안을 본다(클라이언트 전역 상태라 Zustand).
// 사진은 순서와 크기만 여기에 두고, 자른 사진(Blob)은 IndexedDB(lib/photo-blobs)에 둔다.
// store 는 밖으로 내보내지 않고 hook 만 내보낸다.

/** 초안 사진 하나. 사진 자체는 같은 id로 IndexedDB에 있다. 첫 장이 표지다. */
export type DraftPhoto = { id: string; width: number; height: number };

type DraftState = {
  draft: CreateCaperFormValues;
  photos: DraftPhoto[];
  actions: {
    editDraft: (draft: CreateCaperFormValues) => void;
    addPhoto: (photo: DraftPhoto) => void;
    removePhoto: (id: string) => void;
    /** 사진을 offset 칸 옮긴다(-1 앞으로, 1 뒤로). 끝을 넘으면 그대로 둔다. */
    movePhoto: (id: string, offset: number) => void;
    discardDraft: () => void;
  };
};

type Persisted = Partial<Pick<DraftState, "draft" | "photos">>;

const draftStore = create<DraftState>()(
  persist(
    (set) => ({
      draft: EMPTY_CREATE_CAPER_FORM,
      photos: [],
      actions: {
        editDraft: (draft) => set({ draft }),
        addPhoto: (photo) =>
          set((state) =>
            state.photos.length >= CAPER_LIMITS.images
              ? state
              : { photos: [...state.photos, photo] },
          ),
        removePhoto: (id) =>
          set((state) => ({
            photos: state.photos.filter((photo) => photo.id !== id),
          })),
        movePhoto: (id, offset) =>
          set((state) => {
            const from = state.photos.findIndex((photo) => photo.id === id);
            const to = from + offset;
            if (from < 0 || to < 0 || to >= state.photos.length) return state;
            const photos = [...state.photos];
            const [moved] = photos.splice(from, 1);
            photos.splice(to, 0, moved);
            return { photos };
          }),
        discardDraft: () => set({ draft: EMPTY_CREATE_CAPER_FORM, photos: [] }),
      },
    }),
    {
      name: "caper-draft",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft, photos: state.photos }),
      // 서버 렌더(빈 초안)와 첫 화면이 같도록, 브라우저에 붙은 뒤에 불러온다(useDraftHydrated).
      skipHydration: true,
      // 예전 판(1: 사진·제목 위치 없음)으로 저장한 초안도 받는다. 없는 항목은 빈 값으로 채운다.
      migrate: (persisted) => persisted as Persisted,
      merge: (persisted, current) => ({
        ...current,
        draft: {
          ...EMPTY_CREATE_CAPER_FORM,
          ...(persisted as Persisted | undefined)?.draft,
        },
        photos: (persisted as Persisted | undefined)?.photos ?? [],
      }),
    },
  ),
);

const subscribeHydration = (onChange: () => void) =>
  draftStore.persist.onFinishHydration(onChange);
const isHydrated = () => draftStore.persist.hasHydrated();
const isHydratedOnServer = () => false;

/** 임시 저장을 불러왔는지. 브라우저에 붙은 뒤 한 번 불러온다. */
function useDraftHydrated(): boolean {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    isHydrated,
    isHydratedOnServer,
  );

  useEffect(() => {
    if (!draftStore.persist.hasHydrated()) void draftStore.persist.rehydrate();
  }, []);

  return hydrated;
}

/** 임시 저장한 초안(글 항목). 불러오기 전(서버 렌더, 붙기 직전)에는 undefined 다. */
export function useLoadedDraft(): CreateCaperFormValues | undefined {
  const hydrated = useDraftHydrated();
  const draft = draftStore((state) => state.draft);
  return hydrated ? draft : undefined;
}

/** 임시 저장한 초안 사진(순서대로). 불러오기 전에는 undefined 다. */
export function useDraftPhotos(): DraftPhoto[] | undefined {
  const hydrated = useDraftHydrated();
  const photos = draftStore((state) => state.photos);
  return hydrated ? photos : undefined;
}

export const useDraftActions = () => draftStore((state) => state.actions);
