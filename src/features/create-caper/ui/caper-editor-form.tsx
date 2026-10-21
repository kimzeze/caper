"use client";

import { type ReactNode, useId } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Controller,
  type FieldPath,
  useFormState,
  useWatch,
} from "react-hook-form";
import type { Control, UseFormRegister } from "react-hook-form";

import {
  CAPER_LIMITS,
  type CreateCaperFormValues,
  JOIN_POLICIES,
  JOIN_POLICY_LABEL,
} from "@/entities/caper";
import Button from "@/shared/ui/button";
import Checkbox from "@/shared/ui/checkbox";
import EditorText from "@/shared/ui/editor-text";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import { MarkdownEditorPlaceholder } from "@/shared/ui/markdown-editor";
import RadioGroup from "@/shared/ui/radio-group";
import ThemeToggle from "@/shared/ui/theme-toggle";

import { useCreateCaperForm } from "../hooks/use-create-caper-form";

// 설명 편집기(Tiptap)는 브라우저에서만 불러온다. 서버에서 미리 그리면 Tiptap 이 만들 때 부르는 Math.random()이
// Cache Components 의 prerender 검사에 걸리고, 첫 화면 묶음도 무거워진다. 불러오는 동안은 같은 크기 자리를 둔다.
const MarkdownEditor = dynamic(() => import("@/shared/ui/markdown-editor"), {
  ssr: false,
  loading: () => <MarkdownEditorPlaceholder />,
});

// 한도의 80%를 넘기면 글자 수를 보여 준다. 그 전에는 숫자가 글쓰기를 방해하지 않게 숨긴다.
const COUNTER_FROM = 0.8;

// 만들기 편집기(네이버 블로그 글쓰기처럼 완성 모습 그대로 쓰는 한 화면).
// 순서와 글자 크기는 프로젝트 페이지(CaperDetail)와 같다: 제목 32px 굵게 → 슬로건 굵게 → 부제 보조 색 → 날짜·시간 → 설명(마크다운 편집기)
// → with(모집 인원, 참여 확정).
// 헤더는 편집기라 화면 폭에 두고 아래 가는 선을 긋는다(design-system-a 패턴 "헤더"). 위에 고정한다.
// 맨 위 사진 자리(photos)는 쓰는 쪽이 넣는다(사진은 폼 밖 초안 store 와 IndexedDB 가 다룬다).
// 사진이 있으면(hasPhotos) 제목을 표지 위에 얹을지 고른다.
export function CaperEditorForm({
  defaultValues,
  onDraftChange,
  onCreate,
  photos,
  hasPhotos,
}: {
  defaultValues: CreateCaperFormValues;
  onDraftChange: (draft: CreateCaperFormValues) => void;
  onCreate: (values: CreateCaperFormValues) => void;
  photos: ReactNode;
  hasPhotos: boolean;
}) {
  const { form, submit } = useCreateCaperForm({
    defaultValues,
    onDraftChange,
    onCreate,
  });
  const { register, setFocus, control } = form;

  return (
    <form onSubmit={submit} noValidate>
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="measure-col flex min-h-control items-center justify-between gap-4 py-[0.25rlh]">
          <Link href="/" className="no-underline hover:underline">
            취소
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button type="submit" variant="primary">
              만들기
            </Button>
          </div>
        </div>
      </header>
      <div className="mt-[0.5rlh]">{photos}</div>
      <main className="measure-col mt-[1.5rlh] pb-[5rlh]">
        <h1 className="sr-only">새 프로젝트</h1>
        {hasPhotos && (
          <Controller
            name="titlePlacement"
            control={control}
            render={({ field }) => (
              <Checkbox
                checked={field.value === "over"}
                onCheckedChange={(checked) =>
                  field.onChange(checked ? "over" : "below")
                }
                className="mb-[1rlh]"
              >
                제목을 사진 위에
              </Checkbox>
            )}
          />
        )}
        <EditorField
          name="title"
          label="제목"
          limit={CAPER_LIMITS.title}
          control={control}
        >
          {(described) => (
            <EditorText
              {...register("title")}
              {...described}
              singleLine
              onEnter={() => setFocus("slogan")}
              placeholder="제목"
              aria-label="제목"
              className="text-[2rem] leading-[1.25] font-bold tracking-[-0.01em]"
            />
          )}
        </EditorField>
        <EditorField
          name="slogan"
          label="슬로건"
          limit={CAPER_LIMITS.slogan}
          control={control}
          className="mt-[0.5rlh]"
        >
          {(described) => (
            <EditorText
              {...register("slogan")}
              {...described}
              singleLine
              onEnter={() => setFocus("subtitle")}
              placeholder="슬로건 (선택)"
              aria-label="슬로건"
              className="font-bold"
            />
          )}
        </EditorField>
        <EditorField
          name="subtitle"
          label="부제"
          limit={CAPER_LIMITS.subtitle}
          control={control}
        >
          {(described) => (
            <EditorText
              {...register("subtitle")}
              {...described}
              singleLine
              onEnter={() => setFocus("description")}
              placeholder="부제 (선택)"
              aria-label="부제"
              className="text-muted-foreground"
            />
          )}
        </EditorField>
        <ScheduleFields control={control} register={register} />
        <EditorField
          name="description"
          label="설명"
          limit={CAPER_LIMITS.description}
          control={control}
          className="mt-[1.5rlh]"
        >
          {(described) => (
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  defaultValue={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  handleRef={field.ref}
                  {...described}
                  placeholder="설명 (선택). 마크다운으로도 쓸 수 있습니다."
                  aria-label="설명"
                />
              )}
            />
          )}
        </EditorField>
        <RecruitFields control={control} register={register} />
      </main>
    </form>
  );
}

// 날짜와 시간 칸(선택). 폰에서는 기본 날짜·시간 고르기가 뜬다. 날짜만, 날짜와 시작만, 시작과 끝까지 넣을 수 있다.
// 오류는 칸 줄 아래 굵게 한 문장(앞 칸의 것부터).
function ScheduleFields({
  control,
  register,
}: {
  control: Control<CreateCaperFormValues>;
  register: UseFormRegister<CreateCaperFormValues>;
}) {
  const id = useId();
  const { errors } = useFormState({
    control,
    name: ["date", "startTime", "endTime"],
  });
  const message =
    errors.date?.message ??
    errors.startTime?.message ??
    errors.endTime?.message;
  const describedBy = message ? `${id}-error` : undefined;
  const marks = (name: "date" | "startTime" | "endTime") => ({
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": describedBy,
  });

  return (
    <div className="mt-[1rlh]">
      <div className="flex flex-wrap items-end gap-x-3 gap-y-[0.5rlh]">
        <Field label="날짜 (선택)">
          <Input type="date" {...register("date")} {...marks("date")} />
        </Field>
        <div className="flex items-end gap-2">
          <Field label="시작">
            <Input
              type="time"
              width={9}
              {...register("startTime")}
              {...marks("startTime")}
            />
          </Field>
          <span aria-hidden className="leading-(--spacing-control)">
            -
          </span>
          <Field label="끝">
            <Input
              type="time"
              width={9}
              {...register("endTime")}
              {...marks("endTime")}
            />
          </Field>
        </div>
      </div>
      {message && (
        <p id={`${id}-error`} className="mt-[0.25rlh] font-bold">
          {message}
        </p>
      )}
    </div>
  );
}

const CAPACITY_OPTIONS = [
  { value: "unlimited", label: "제한 없음" },
  { value: "limited", label: "인원 정하기" },
];

const JOIN_POLICY_OPTIONS = JOIN_POLICIES.map((policy) => ({
  value: policy,
  label: JOIN_POLICY_LABEL[policy],
}));

const JOIN_POLICY_HINT = {
  instant: "참여하기를 누르면 바로 with에 들어갑니다.",
  approval: "참여하기를 누른 사람을 내가 승인하면 with에 들어갑니다.",
} as const;

// with 구역(프로젝트 페이지 맨 아래와 같은 자리). 모집 인원을 정하면 숫자 칸이 옆에 나온다.
// 인원은 만든 사람을 넣은 전체 수다.
function RecruitFields({
  control,
  register,
}: {
  control: Control<CreateCaperFormValues>;
  register: UseFormRegister<CreateCaperFormValues>;
}) {
  const id = useId();
  const capacityMode = useWatch({ control, name: "capacityMode" });
  const joinPolicy = useWatch({ control, name: "joinPolicy" });
  const { errors } = useFormState({ control, name: "capacity" });
  const message = errors.capacity?.message;
  const limited = capacityMode === "limited";

  return (
    <section className="mt-[2rlh]">
      <h2>with</h2>
      <div className="mt-[0.5rlh] flex flex-wrap items-end gap-x-3 gap-y-[0.5rlh]">
        <Field label="모집 인원">
          <Controller
            name="capacityMode"
            control={control}
            // 제한 없음으로 바꾸면 인원 칸 오류도 다시 본다(만들기를 누른 뒤부터).
            rules={{ deps: "capacity" }}
            render={({ field }) => (
              <RadioGroup
                options={CAPACITY_OPTIONS}
                value={field.value}
                onValueChange={field.onChange}
              />
            )}
          />
        </Field>
        {limited && (
          <div className="flex items-center gap-2">
            <Input
              inputMode="numeric"
              pattern="[0-9]*"
              width={4}
              aria-label="모집 인원(명)"
              aria-invalid={message ? true : undefined}
              aria-describedby={`${id}-hint${message ? ` ${id}-error` : ""}`}
              {...register("capacity")}
            />
            <span aria-hidden>명</span>
          </div>
        )}
      </div>
      {limited && (
        <p
          id={`${id}-hint`}
          className="mt-[0.25rlh] text-base text-muted-foreground"
        >
          만든 사람을 넣은 인원입니다.
        </p>
      )}
      {message && (
        <p id={`${id}-error`} className="mt-[0.25rlh] font-bold">
          {message}
        </p>
      )}
      <Field label="참여 확정" className="mt-[1rlh]">
        <Controller
          name="joinPolicy"
          control={control}
          render={({ field }) => (
            <RadioGroup
              options={JOIN_POLICY_OPTIONS}
              value={field.value}
              onValueChange={field.onChange}
            />
          )}
        />
      </Field>
      <p className="mt-[0.25rlh] text-base text-muted-foreground">
        {JOIN_POLICY_HINT[joinPolicy]}
      </p>
    </section>
  );
}

type Described = {
  "aria-invalid"?: true;
  "aria-describedby"?: string;
};

// 칸 하나와 그 아래 글자 수·오류. 오류는 굵게 한 문장(design-system-a: 무엇을 하라는지).
function EditorField({
  name,
  label,
  limit,
  control,
  className,
  children,
}: {
  name: FieldPath<CreateCaperFormValues>;
  label: string;
  limit: number;
  control: Control<CreateCaperFormValues>;
  className?: string;
  children: (described: Described) => React.ReactElement;
}) {
  const id = useId();
  const value = useWatch({ control, name });
  const { errors } = useFormState({ control, name });
  const message = errors[name]?.message;
  const length = value.trim().length;
  const showCounter = length >= limit * COUNTER_FROM;

  const describedBy = [message && `${id}-error`, showCounter && `${id}-count`]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={className}>
      {children({
        "aria-invalid": message ? true : undefined,
        "aria-describedby": describedBy || undefined,
      })}
      {(message || showCounter) && (
        <div className="flex items-baseline justify-between gap-4">
          <p id={`${id}-error`} className="font-bold">
            {message}
          </p>
          {showCounter && (
            <p
              id={`${id}-count`}
              aria-label={`${label} ${length}자, 최대 ${limit}자`}
              className={
                length > limit
                  ? "font-mono text-base font-bold"
                  : "font-mono text-base text-muted-foreground"
              }
            >
              {length}/{limit}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
