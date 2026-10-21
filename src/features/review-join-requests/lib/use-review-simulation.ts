"use client";

import { useState } from "react";

import type { Caper, JoinRequest } from "@/entities/caper";

import type { ReviewActions } from "../ui/join-requests";

// 미리보기 안에서 만든 사람이 신청을 승인·거절해 보게 하는 흉내. 저장하지 않는다.
// 승인하면 그 사람을 crew 로 옮긴다. caper 상태는 쓰는 쪽이 갖는다.
export function useReviewSimulation(
  [caper, setCaper]: readonly [Caper, (caper: Caper) => void],
  initialRequests: readonly JoinRequest[],
): { requests: readonly JoinRequest[] } & ReviewActions {
  const [requests, setRequests] = useState(initialRequests);
  const remove = (request: JoinRequest) =>
    setRequests(requests.filter(({ id }) => id !== request.id));

  return {
    requests,
    onApprove: (request) => {
      setCaper({
        ...caper,
        crew: [
          ...caper.crew,
          { id: request.id, name: request.name, role: "member" },
        ],
      });
      remove(request);
    },
    onReject: remove,
  };
}
