"use client";

import { useRouter } from "next/navigation";
import { clsx } from "clsx";

import { EMPTY_CREATE_CAPER_FORM } from "@/entities/caper";

import { useDraftActions, useLoadedDraft } from "../model/draft-store";
import { CaperEditorForm } from "./caper-editor-form";

// 편집기를 임시 저장과 잇는다. 초안을 불러오기 전에는 같은 자리에 빈 편집기를 보이지 않게 그려 두고
// (늦게 온 내용이 화면을 밀지 않게), 불러오면 그 초안으로 다시 그린다.
// 만들기: 아직 DB가 없어 저장하지 않고 미리보기로 간다(Supabase를 붙이면 실제로 만든다).
export function CreateCaperEditor() {
  const router = useRouter();
  const draft = useLoadedDraft();
  const { editDraft } = useDraftActions();

  return (
    <div className={clsx(draft === undefined && "invisible")}>
      <CaperEditorForm
        key={draft === undefined ? "loading" : "loaded"}
        defaultValues={draft ?? EMPTY_CREATE_CAPER_FORM}
        onDraftChange={editDraft}
        onCreate={(values) => {
          editDraft(values);
          router.push("/new/preview");
        }}
      />
    </div>
  );
}
