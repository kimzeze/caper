"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";

// 스크롤 진행 막대 — 문서를 세로로 얼마나 내렸는지 왼쪽부터 늘어나는 2px 잉크 막대(사진 위치 막대와 같은 꼴).
// 스크롤할 게 없으면 0 이라 보이지 않는다. 이미지가 늦게 와 문서 높이가 바뀌어도 다시 잰다.
// 막대는 스크롤 이벤트에서 직접 옮긴다(CSS 스크롤 애니메이션은 아직 Baseline Widely available 이 아니다).
// 꾸밈이라 화면 읽기가 건너뛴다. 위치는 쓰는 쪽이 정한다(className).
export default function ScrollProgress({ className }: { className?: string }) {
  const barRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = root.scrollHeight - root.clientHeight;
      const progress =
        max > 0 ? Math.min(Math.max(root.scrollTop / max, 0), 1) : 0;
      if (barRef.current !== null) {
        barRef.current.style.transform = `scaleX(${progress})`;
      }
    };
    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className={clsx("pointer-events-none h-0.5", className)}>
      <span
        ref={barRef}
        className="block h-full origin-left bg-foreground"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
