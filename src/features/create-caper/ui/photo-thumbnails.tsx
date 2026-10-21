"use client";

import {
  type Announcements,
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { clsx } from "clsx";

import type { EditorPhoto } from "./editor-photos";

// 사진 순서 바꾸기 — 사진 아래 4:5 썸네일 줄. 누르면 그 장으로 넘기고(onSelect), 끌어서 순서를 바꾼다(onReorder, 첫 칸이 표지).
// 끌기: 폰은 길게 눌러(짧게 밀면 줄이 스크롤된다), 마우스는 조금 움직이면, 키보드는 스페이스로 들고 방향키로 옮기고
// 스페이스로 놓는다(Esc 취소). @dnd-kit 이 화면 읽기 프로그램에 한국어로 알린다.

const position = (photos: readonly EditorPhoto[], id: unknown) =>
  photos.findIndex((photo) => photo.id === id) + 1;

export function PhotoThumbnails({
  photos,
  current,
  onSelect,
  onReorder,
}: {
  photos: readonly EditorPhoto[];
  current: number;
  onSelect: (index: number) => void;
  onReorder: (ids: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const announcements: Announcements = {
    onDragStart: ({ active }) =>
      `${position(photos, active.id)}번째 사진을 들었습니다.`,
    onDragOver: ({ active, over }) =>
      over
        ? `${position(photos, active.id)}번째 사진을 ${position(photos, over.id)}번째 자리로 옮깁니다.`
        : "",
    onDragEnd: ({ over }) =>
      over ? `${position(photos, over.id)}번째 자리에 놓았습니다.` : "",
    onDragCancel: () => "옮기기를 그만뒀습니다.",
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (over === null || active.id === over.id) return;
    const ids = photos.map((photo) => photo.id);
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    onReorder(arrayMove(ids, from, to));
    onSelect(to);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onDragEnd}
      accessibility={{
        announcements,
        screenReaderInstructions: {
          draggable:
            "사진 순서를 바꾸려면 스페이스로 들고, 방향키로 옮기고, 스페이스로 놓습니다. Esc는 그만둡니다.",
        },
      }}
    >
      <SortableContext
        items={photos.map((photo) => photo.id)}
        strategy={horizontalListSortingStrategy}
      >
        <ol
          aria-label="사진 순서"
          className="flex [scrollbar-width:none] gap-2 overflow-x-auto py-[0.5rlh] [&::-webkit-scrollbar]:hidden"
        >
          {photos.map((photo, index) => (
            <Thumbnail
              key={photo.id}
              photo={photo}
              index={index}
              selected={index === current}
              onSelect={() => onSelect(index)}
            />
          ))}
        </ol>
      </SortableContext>
    </DndContext>
  );
}

function Thumbnail({
  photo,
  index,
  selected,
  onSelect,
}: {
  photo: EditorPhoto;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.id });

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      // 아이폰 사파리는 길게 누르면 사진 저장 메뉴를 띄우고 글자를 고른다. 길게 눌러 끌기와 부딪쳐 둘 다 끈다.
      className={clsx(
        "shrink-0 select-none [-webkit-touch-callout:none]",
        isDragging && "relative z-10",
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        onClick={onSelect}
        aria-label={`${index + 1}번째 사진${index === 0 ? ", 표지" : ""}${selected ? ", 지금 보는 사진" : ""}`}
        aria-current={selected || undefined}
        // 길게 눌러 끄는 동안 브라우저가 화면을 확대·스크롤하지 않게 한다(짧게 밀면 줄 스크롤은 그대로).
        className={clsx(
          "block w-14 touch-manipulation border-2 focus-border",
          selected ? "border-foreground" : "border-transparent",
          isDragging && "opacity-80",
        )}
      >
        {/* 썸네일은 화면 주소(blob:)라 Next 이미지 최적화를 거치지 않는 img 로 그린다. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt=""
          width={56}
          height={70}
          draggable={false}
          className="block aspect-[4/5] w-full object-cover select-none [-webkit-touch-callout:none]"
        />
      </button>
      {index === 0 && (
        <p aria-hidden className="text-center text-base text-muted-foreground">
          표지
        </p>
      )}
    </li>
  );
}
