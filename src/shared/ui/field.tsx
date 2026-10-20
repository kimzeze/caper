"use client";

import { clsx } from "clsx";
import { createContext, type ReactNode, useContext, useId } from "react";

// 화면 안 컨트롤(라디오·슬라이더·입력 칸) 위에 붙는 짧은 라벨. 라벨은 보조색으로 조연이고,
// value 를 주면 라벨 뒤에 지금 값을 고정폭으로 둔다(슬라이더). 라벨 아래 6px 에 컨트롤.
// 안의 Input·Textarea·RadioGroup·Slider·Select 는 이 라벨을 이름으로 쓴다(aria-labelledby). 따로 aria-label 을 주지 않는다.
// 질문에 답하는 폼(설명이 붙는 칸)은 컴포넌트 문서의 '입력' 꼴을 쓴다.
const FieldLabel = createContext<string | undefined>(undefined);

/** Field 안이면 라벨의 id. 컨트롤이 aria-labelledby 로 쓴다. */
export const useFieldLabel = () => useContext(FieldLabel);

export default function Field({
  label,
  value,
  className,
  children,
}: {
  label: ReactNode;
  value?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <div className={clsx("flex flex-col gap-1.5", className)}>
      <span id={id} className="text-muted-foreground">
        {label}
        {value !== undefined && (
          <>
            {" "}
            <span className="font-mono text-foreground">{value}</span>
          </>
        )}
      </span>
      <FieldLabel.Provider value={id}>{children}</FieldLabel.Provider>
    </div>
  );
}
