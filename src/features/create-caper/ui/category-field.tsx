"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Control, Controller, useForm } from "react-hook-form";

import type { CreateCaperFormValues } from "@/entities/caper";
import {
  type Category,
  type CreateCategoryFormValues,
  createCategorySchema,
} from "@/entities/category";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";

// Select 는 빈 값을 고를 수 없어 "없음"을 따로 둔다. 폼 값은 빈 문자열이다.
const NONE = "none";

// 제목 위 카테고리 칸(프로젝트 페이지에서 카테고리가 보이는 자리). 내 카테고리 중 고르거나 그 자리에서 새로 만든다.
// 하나도 없으면 고르는 칸 없이 만들기 버튼만 둔다. 이미 있는 이름이면 새로 만들지 않고 그것을 고른다.
// 새 이름 칸을 닫으면(취소·만들기) 만들기 버튼으로 초점을 돌려준다.
export function CategoryField({
  control,
  categories,
  onCreateCategory,
  className,
}: {
  control: Control<CreateCaperFormValues>;
  categories: readonly Category[];
  onCreateCategory: (name: string) => Category;
  className?: string;
}) {
  const [creating, setCreating] = useState(false);
  const openRef = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);

  useEffect(() => {
    if (!creating && returnFocus.current) {
      returnFocus.current = false;
      openRef.current?.focus();
    }
  }, [creating]);

  const close = () => {
    returnFocus.current = true;
    setCreating(false);
  };

  return (
    <div className={className}>
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) =>
          creating ? (
            <NewCategoryName
              onCreate={(name) => {
                const category =
                  categories.find((value) => value.name === name) ??
                  onCreateCategory(name);
                field.onChange(category.id);
                close();
              }}
              onClose={close}
            />
          ) : (
            <div className="flex flex-wrap items-end gap-x-3 gap-y-[0.5rlh]">
              {categories.length > 0 && (
                <Field label="카테고리 (선택)">
                  <Select
                    compact
                    sans
                    value={field.value || NONE}
                    onValueChange={(value) =>
                      field.onChange(value === NONE ? "" : value)
                    }
                    options={[
                      { value: NONE, label: "없음" },
                      ...categories.map(({ id, name }) => ({
                        value: id,
                        label: name,
                      })),
                    ]}
                  />
                </Field>
              )}
              <Button ref={openRef} onClick={() => setCreating(true)}>
                {categories.length > 0 ? "새로 만들기" : "카테고리 만들기"}
              </Button>
            </div>
          )
        }
      />
    </div>
  );
}

// 새 카테고리 이름 칸. 편집기 전체가 <form> 이라 form 을 또 두지 않고, Enter 는 편집기의 만들기 대신 여기서 처리한다.
function NewCategoryName({
  onCreate,
  onClose,
}: {
  onCreate: (name: string) => void;
  onClose: () => void;
}) {
  const id = useId();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<CreateCategoryFormValues>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { name: "" },
  });
  const message = errors.name?.message;
  const create = handleSubmit(({ name }) => onCreate(name));

  useEffect(() => setFocus("name"), [setFocus]);

  const handleKey = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      void create();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    }
  };

  return (
    <div>
      <Field label="새 카테고리">
        <div className="flex gap-2">
          <Input
            width="fill"
            onKeyDown={handleKey}
            aria-invalid={message ? true : undefined}
            aria-describedby={message ? `${id}-error` : undefined}
            {...register("name")}
          />
          <Button onClick={onClose}>취소</Button>
          <Button aria-label="카테고리 만들기" onClick={() => void create()}>
            만들기
          </Button>
        </div>
      </Field>
      {message && (
        <p id={`${id}-error`} className="mt-[0.25rlh] font-bold">
          {message}
        </p>
      )}
    </div>
  );
}
