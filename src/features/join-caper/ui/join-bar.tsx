"use client";

import { type KeyboardEvent, useEffect, useId, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  type Caper,
  type CaperViewer,
  type JoinCaperFormValues,
  joinCaperSchema,
  joinState,
  seatsLeft,
} from "@/entities/caper";
import BottomBar from "@/shared/ui/bottom-bar";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";

export type JoinActions = {
  onJoin: (name: string) => void;
  onCancel: () => void;
  onLeave: () => void;
};

// 프로젝트 페이지 아래에 붙는 참여 줄(BottomBar).
// 참여하기를 누르면 같은 줄에서 with 에 보일 이름을 쓴다. 만든 사람과 끝난 프로젝트에는 줄이 없다.
// 상태 문장은 바뀌면 화면 읽기가 읽어 준다(role="status").
export function JoinBar({
  caper,
  viewer,
  onJoin,
  onCancel,
  onLeave,
}: { caper: Caper; viewer: CaperViewer } & JoinActions) {
  const state = joinState(caper, viewer);
  const [naming, setNaming] = useState(false);
  const actionRef = useRef<HTMLButtonElement>(null);
  // 이름 칸을 닫으면(취소·참여) 줄의 버튼으로 초점을 돌려준다.
  const returnFocus = useRef(false);

  useEffect(() => {
    if (!naming && returnFocus.current) {
      returnFocus.current = false;
      actionRef.current?.focus();
    }
  }, [naming]);

  if (state === "hidden") return null;

  const closeNaming = () => {
    returnFocus.current = true;
    setNaming(false);
  };

  const seats = seatsLeft(caper);
  const approval = caper.joinPolicy === "approval";
  const message = {
    open: [
      seats !== undefined && `빈자리 ${seats}`,
      approval ? "승인 후 확정" : "바로 확정",
    ]
      .filter(Boolean)
      .join(" · "),
    full: "인원이 다 찼습니다.",
    pending: "승인을 기다리고 있습니다.",
    member: "참여 중입니다.",
  }[state];
  const action = {
    open: { label: "참여하기", run: () => setNaming(true), primary: true },
    full: undefined,
    pending: { label: "신청 취소", run: onCancel, primary: false },
    member: { label: "나가기", run: onLeave, primary: false },
  }[state];

  return (
    <BottomBar>
      {naming && state === "open" ? (
        <JoinNameForm
          approval={approval}
          onSubmit={(name) => {
            onJoin(name);
            closeNaming();
          }}
          onClose={closeNaming}
        />
      ) : (
        <div className="flex min-h-control items-center justify-between gap-4">
          <p role="status" className="text-base text-muted-foreground">
            {message}
          </p>
          {action && (
            <Button
              ref={actionRef}
              variant={action.primary ? "primary" : "default"}
              onClick={action.run}
            >
              {action.label}
            </Button>
          )}
        </div>
      )}
    </BottomBar>
  );
}

// 참여하기를 누른 뒤의 이름 칸. Esc 나 취소로 닫는다.
function JoinNameForm({
  approval,
  onSubmit,
  onClose,
}: {
  approval: boolean;
  onSubmit: (name: string) => void;
  onClose: () => void;
}) {
  const id = useId();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<JoinCaperFormValues>({
    resolver: zodResolver(joinCaperSchema),
    defaultValues: { name: "" },
  });
  const message = errors.name?.message;

  useEffect(() => setFocus("name"), [setFocus]);

  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key === "Escape") onClose();
  };

  return (
    <form
      onSubmit={handleSubmit(({ name }) => onSubmit(name))}
      onKeyDown={closeOnEscape}
      noValidate
    >
      <Field label="with에 보일 이름">
        <div className="flex gap-2">
          <Input
            width="fill"
            autoComplete="nickname"
            aria-invalid={message ? true : undefined}
            aria-describedby={`${id}-hint${message ? ` ${id}-error` : ""}`}
            {...register("name")}
          />
          <Button onClick={onClose}>취소</Button>
          <Button type="submit" variant="primary">
            참여하기
          </Button>
        </div>
      </Field>
      {message && (
        <p id={`${id}-error`} className="mt-[0.25rlh] font-bold">
          {message}
        </p>
      )}
      <p
        id={`${id}-hint`}
        className="mt-[0.25rlh] text-base text-muted-foreground"
      >
        {approval
          ? "만든 사람이 승인하면 with에 들어갑니다."
          : "누르면 바로 with에 들어갑니다."}
      </p>
    </form>
  );
}
