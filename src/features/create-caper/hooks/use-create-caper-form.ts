import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  type CreateCaperFormValues,
  createCaperSchema,
  EMPTY_CREATE_CAPER_FORM,
} from "@/entities/caper";

// 만들기 편집기 폼. 쓰는 대로 onDraftChange 로 넘기고(임시 저장), 만들기를 누르면 검사한 값을 onCreate 로 넘긴다.
// 오류는 만들기를 누른 뒤에 보이고, 그다음부터는 쓰는 대로 다시 검사한다.
export function useCreateCaperForm({
  defaultValues,
  onDraftChange,
  onCreate,
}: {
  defaultValues: CreateCaperFormValues;
  onDraftChange: (draft: CreateCaperFormValues) => void;
  onCreate: (values: CreateCaperFormValues) => void;
}) {
  const form = useForm<CreateCaperFormValues>({
    resolver: zodResolver(createCaperSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(
    () =>
      form.subscribe({
        formState: { values: true },
        callback: ({ values }) =>
          onDraftChange({ ...EMPTY_CREATE_CAPER_FORM, ...values }),
      }),
    [form, onDraftChange],
  );

  const submit = form.handleSubmit(onCreate);

  return { form, submit };
}
