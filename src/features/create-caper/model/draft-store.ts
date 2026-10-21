"use client";

import { useEffect, useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  type CreateCaperFormValues,
  EMPTY_CREATE_CAPER_FORM,
} from "@/entities/caper";

// 만들기 편집기의 초안. 쓰는 대로 localStorage에 남겨, 새로고침하거나 사진첩에 다녀와도 이어서 쓴다.
// 편집기와 미리보기 화면이 같은 초안을 본다(클라이언트 전역 상태라 Zustand).
// store 는 밖으로 내보내지 않고 hook 만 내보낸다.

type DraftState = {
  draft: CreateCaperFormValues;
  actions: {
    editDraft: (draft: CreateCaperFormValues) => void;
    discardDraft: () => void;
  };
};

const draftStore = create<DraftState>()(
  persist(
    (set) => ({
      draft: EMPTY_CREATE_CAPER_FORM,
      actions: {
        editDraft: (draft) => set({ draft }),
        discardDraft: () => set({ draft: EMPTY_CREATE_CAPER_FORM }),
      },
    }),
    {
      name: "caper-draft",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }),
      // 서버 렌더(빈 초안)와 첫 화면이 같도록, 브라우저에 붙은 뒤에 불러온다(useLoadedDraft).
      skipHydration: true,
      // 예전에 저장한 초안에 없는 항목은 빈 값으로 채운다.
      merge: (persisted, current) => ({
        ...current,
        draft: {
          ...EMPTY_CREATE_CAPER_FORM,
          ...(persisted as Partial<Pick<DraftState, "draft">> | undefined)
            ?.draft,
        },
      }),
    },
  ),
);

const subscribeHydration = (onChange: () => void) =>
  draftStore.persist.onFinishHydration(onChange);
const isHydrated = () => draftStore.persist.hasHydrated();
const isHydratedOnServer = () => false;

/** 임시 저장한 초안. 불러오기 전(서버 렌더, 붙기 직전)에는 undefined 다. */
export function useLoadedDraft(): CreateCaperFormValues | undefined {
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    isHydrated,
    isHydratedOnServer,
  );
  const draft = draftStore((state) => state.draft);

  useEffect(() => {
    if (!draftStore.persist.hasHydrated()) void draftStore.persist.rehydrate();
  }, []);

  return hydrated ? draft : undefined;
}

export const useDraftActions = () => draftStore((state) => state.actions);
