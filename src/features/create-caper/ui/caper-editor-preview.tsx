"use client";

import type { CreateCaperFormValues } from "@/entities/caper";

import { CaperEditorForm } from "./caper-editor-form";

const ignore = () => {};

// 화면 미리보기(/preview)용 편집기. 임시 저장과 잇지 않아 사용자 초안을 건드리지 않는다.
// 만들기를 누르면 검사(오류 표시)까지만 하고 아무 데도 가지 않는다.
export function CaperEditorPreview({
  defaultValues,
}: {
  defaultValues: CreateCaperFormValues;
}) {
  return (
    <CaperEditorForm
      defaultValues={defaultValues}
      onDraftChange={ignore}
      onCreate={ignore}
    />
  );
}
