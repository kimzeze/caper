"use client";

import { useState } from "react";

import type { Caper, CaperViewer, JoinRequest } from "@/entities/caper";
import type { Category } from "@/entities/category";
import { useJoinSimulation } from "@/features/join-caper/preview";
import { useReviewSimulation } from "@/features/review-join-requests/preview";
import { CaperPage } from "@/views/caper";

// 참여 줄과 승인 목록을 눌러 보는 프로젝트 페이지. 상태는 이 화면 안에서만 바뀐다.
// requests 가 있으면 만든 사람이 보는 화면이다.
export function JoinPreview({
  caper,
  category,
  viewer,
  requests,
}: {
  caper: Caper;
  category?: Category;
  viewer: CaperViewer;
  requests?: readonly JoinRequest[];
}) {
  const caperState = useState(caper);
  const join = useJoinSimulation(caperState, viewer);
  const review = useReviewSimulation(caperState, requests ?? []);

  return (
    <CaperPage
      caper={caperState[0]}
      category={category}
      join={join}
      review={requests ? review : undefined}
    />
  );
}
