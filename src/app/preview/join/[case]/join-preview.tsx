"use client";

import type { Caper, CaperViewer } from "@/entities/caper";
import { useJoinSimulation } from "@/features/join-caper/preview";
import { CaperPage } from "@/views/caper";

// 참여 줄을 눌러 보는 프로젝트 페이지. 상태는 이 화면 안에서만 바뀐다.
export function JoinPreview({
  caper,
  viewer,
}: {
  caper: Caper;
  viewer: CaperViewer;
}) {
  const simulation = useJoinSimulation(caper, viewer);
  return <CaperPage caper={simulation.caper} join={simulation.join} />;
}
