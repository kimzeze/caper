"use client";

import { type RefObject, useId, useRef, useState } from "react";
import { Combobox } from "@base-ui/react/combobox";
import { clsx } from "clsx";
import { Check, ChevronDown, Plus } from "lucide-react";
import { type Control, Controller } from "react-hook-form";

import type { CreateCaperFormValues } from "@/entities/caper";
import {
  type Category,
  CATEGORY_NAME_MAX,
  createCategorySchema,
} from "@/entities/category";
import PickerPopup from "@/shared/ui/picker-popup";

// 제목 위 카테고리 칸(프로젝트 페이지에서 카테고리가 보이는 자리). 2px 잉크 상자 칸에 지금 고른 이름(없으면 "없음").
// 누르면 고르기 그릇(PickerPopup: 넓은 화면 팝오버, 폰 아래 시트)이 열리고, 안에서 찾고 고르거나 친 이름으로 바로 만든다.
// 펼침 목록(Select)은 찾기가 없고 목록 안에서 만들 수 없어, 카테고리가 늘면 끝까지 내려 찾아야 했다.
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
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const labelId = useId();
  const valueId = useId();

  return (
    <div className={className}>
      <Controller
        name="categoryId"
        control={control}
        render={({ field }) => {
          const current = categories.find(({ id }) => id === field.value);
          const pick = (id: string) => {
            field.onChange(id);
            setOpen(false);
          };
          return (
            <div className="flex flex-col items-start gap-1.5">
              <span id={labelId} className="text-muted-foreground">
                카테고리 (선택)
              </span>
              <button
                ref={triggerRef}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-labelledby={`${labelId} ${valueId}`}
                onClick={() => setOpen(true)}
                className="group inline-flex h-control max-w-full min-w-40 items-center justify-between gap-6 border-2 focus-border border-foreground bg-background press-down pr-3 pl-3.5 transition-colors hover:bg-foreground hover:text-background"
              >
                <span
                  id={valueId}
                  className={clsx(
                    "truncate",
                    !current &&
                      "text-muted-foreground group-hover:text-background",
                  )}
                >
                  {current?.name ?? "없음"}
                </span>
                <ChevronDown aria-hidden className="size-[1.25em] shrink-0" />
              </button>
              <PickerPopup
                open={open}
                onOpenChange={setOpen}
                anchor={triggerRef}
                title="카테고리"
                initialFocus={searchRef}
              >
                <CategoryChooser
                  categories={categories}
                  value={field.value}
                  searchRef={searchRef}
                  onPick={pick}
                  onCreate={(name) => {
                    const existing = categories.find((category) =>
                      sameName(category.name, name),
                    );
                    pick((existing ?? onCreateCategory(name)).id);
                  }}
                />
              </PickerPopup>
            </div>
          );
        }}
      />
    </div>
  );
}

type Option =
  | { key: string; kind: "none"; label: string }
  | { key: string; kind: "category"; label: string; id: string }
  | { key: string; kind: "create"; label: string; name: string };

const NONE: Option = { key: "none", kind: "none", label: "없음" };

const sameName = (a: string, b: string) =>
  a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();

// 고르기 그릇 안: 찾기 칸 + 목록(Combobox 를 팝업 없이 inline 으로).
// 맨 위 "없음", 그 아래 내 카테고리(친 글자가 들어간 것만), 고른 것에 ✓. 친 이름과 같은 카테고리가 없으면
// 맨 아래 "'…' 새로 만들기". 찾은 글이 있으면 첫 항목이 밝아져 Enter 로 바로 고른다. 찾기 칸은 이름 한도(20자)까지.
// 목록의 값은 늘 비워 둔다(value null). 지금 고른 것을 다시 골라도 바뀐 것으로 받아 그릇이 닫히게 하려는 것이다.
// 그래서 ✓ 와 화면 읽기용 "선택됨"은 직접 붙인다.
function CategoryChooser({
  categories,
  value,
  searchRef,
  onPick,
  onCreate,
}: {
  categories: readonly Category[];
  value: string;
  searchRef: RefObject<HTMLInputElement | null>;
  onPick: (id: string) => void;
  onCreate: (name: string) => void;
}) {
  const [query, setQuery] = useState("");
  const name = query.trim();
  const options: Option[] = categories.map((category) => ({
    key: category.id,
    kind: "category",
    label: category.name,
    id: category.id,
  }));
  const canCreate =
    createCategorySchema.safeParse({ name }).success &&
    !categories.some((category) => sameName(category.name, name));
  const items: Option[] = [
    NONE,
    ...options,
    ...(canCreate
      ? [
          {
            key: `create:${name}`,
            kind: "create" as const,
            label: `'${name}' 새로 만들기`,
            name,
          },
        ]
      : []),
  ];
  const selectedKey =
    options.find((option) => option.key === value)?.key ?? NONE.key;

  return (
    <Combobox.Root
      inline
      open
      items={items}
      value={null}
      isItemEqualToValue={(a: Option, b: Option) => a.key === b.key}
      itemToStringLabel={(option: Option) => option.label}
      // 새로 만들기 줄은 친 글자가 늘 들어 있어 거르지 않는다. 나머지는 이름에 친 글자가 있는지로 거른다.
      filter={(option: Option, search: string) =>
        option.kind === "create" ||
        option.label
          .toLocaleLowerCase()
          .includes(search.trim().toLocaleLowerCase())
      }
      inputValue={query}
      onInputValueChange={setQuery}
      autoHighlight={name !== ""}
      onValueChange={(option: Option | null) => {
        if (option === null) return;
        if (option.kind === "create") onCreate(option.name);
        else onPick(option.kind === "none" ? "" : option.id);
      }}
    >
      <Combobox.Input
        ref={searchRef}
        maxLength={CATEGORY_NAME_MAX}
        placeholder="찾거나 새 이름 쓰기"
        aria-label="카테고리 찾기"
        className="h-control w-full shrink-0 border-b-2 border-foreground bg-background px-3.5 outline-none placeholder:text-muted-foreground focus-visible:shadow-[inset_0_-2px_0_var(--color-accent)]"
      />
      {categories.length === 0 && name === "" && (
        <p className="px-3.5 py-[0.5rlh] text-base text-muted-foreground">
          아직 카테고리가 없습니다. 이름을 쓰면 새로 만듭니다.
        </p>
      )}
      <Combobox.List
        data-picker-list
        className="max-h-72 min-h-0 flex-1 overflow-y-auto overscroll-contain"
      >
        {(option: Option) => (
          <Combobox.Item
            key={option.key}
            value={option}
            className="flex min-h-control cursor-pointer items-center gap-3 px-3.5 outline-none select-none data-highlighted:bg-foreground data-highlighted:text-background data-highlighted:shadow-[inset_4px_0_0_var(--color-accent)]"
          >
            {option.kind === "create" && (
              <Plus aria-hidden className="size-[1.1em] shrink-0" />
            )}
            <span
              className={clsx(
                "min-w-0 flex-1 truncate",
                option.kind === "none" && "text-muted-foreground",
              )}
            >
              {option.label}
            </span>
            {option.key === selectedKey && (
              <>
                <Check aria-hidden className="size-[1.1em] shrink-0" />
                <span className="sr-only">선택됨</span>
              </>
            )}
          </Combobox.Item>
        )}
      </Combobox.List>
    </Combobox.Root>
  );
}
