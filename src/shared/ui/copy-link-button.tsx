"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link as LinkIcon } from "lucide-react";

import Button from "./button";

// 지금 주소 복사 — 2px 테두리 네모 버튼(44px, Button square). 누르면 주소를 복사하고 아이콘이 2초 동안 ✓ 로 바뀐다.
// 결과는 화면 읽기가 읽어 준다(role="status"). 복사하지 못하면 그 문장은 눈에도 보인다.
// navigator.clipboard 는 보안 연결(https·localhost)에서만 있어, 없거나 막히면 예전 방식(글을 골라 copy)으로 한 번 더 한다.
export default function CopyLinkButton({ className }: { className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const copied = await writeText(window.location.href);
    setState(copied ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 2000);
  };

  const Icon = state === "copied" ? Check : LinkIcon;
  return (
    <div className={className}>
      <Button square aria-label="링크 복사" onClick={copy}>
        <Icon aria-hidden className="size-[1.25em]" />
      </Button>
      <p
        role="status"
        className={
          state === "failed"
            ? "mt-[0.25rlh] text-base text-muted-foreground"
            : "sr-only"
        }
      >
        {state === "copied" && "링크를 복사했습니다."}
        {state === "failed" &&
          "링크를 복사하지 못했습니다. 주소창에서 복사합니다."}
      </p>
    </div>
  );
}

async function writeText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard !== undefined) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // 권한이 막혔으면 아래 예전 방식으로 한 번 더 한다.
  }
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.append(area);
  area.select();
  area.setSelectionRange(0, text.length);
  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    area.remove();
  }
}
