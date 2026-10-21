"use client";

import { useRef, useState } from "react";

import { type Caper, type JoinRequest, recruitState } from "@/entities/caper";
import Avatar from "@/shared/ui/avatar";
import Button from "@/shared/ui/button";

import { JOIN_REQUESTS_ID } from "../config";

export type ReviewActions = {
  onApprove: (request: JoinRequest) => void;
  onReject: (request: JoinRequest) => void;
};

// 만든 사람에게만 보이는 참여 신청 목록(with 구역 끝). 승인하면 with 에 들어가고, 거절하면 목록에서만 빠진다.
// 누른 결과는 한 줄로 알리고(role="status") 초점은 목록 제목으로 옮긴다(누른 줄이 사라지므로).
// 자리가 다 찼으면 승인 버튼을 빼고 그 이유를 쓴다.
export function JoinRequests({
  caper,
  requests,
  onApprove,
  onReject,
}: { caper: Caper; requests: readonly JoinRequest[] } & ReviewActions) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [notice, setNotice] = useState("");
  const full = recruitState(caper) === "full";

  if (requests.length === 0 && !notice) return null;

  const review = (request: JoinRequest, approve: boolean) => {
    if (approve) onApprove(request);
    else onReject(request);
    setNotice(
      approve
        ? `${request.name} 님을 with에 넣었습니다.`
        : `${request.name} 님의 신청을 거절했습니다.`,
    );
    headingRef.current?.focus();
  };

  return (
    <section id={JOIN_REQUESTS_ID} className="mt-[1.5rlh] scroll-mt-[1rlh]">
      <h3 ref={headingRef} tabIndex={-1} className="outline-none">
        승인 기다림 {requests.length}
      </h3>
      <p role="status" className="text-base text-muted-foreground">
        {notice}
      </p>
      {requests.length === 0 ? (
        <p className="text-base text-muted-foreground">
          기다리는 신청이 없습니다.
        </p>
      ) : (
        full && (
          <p className="text-base">
            자리가 다 찼습니다. 모집 인원을 늘리거나 거절합니다.
          </p>
        )
      )}
      <ul className="mt-[0.5rlh] flex flex-col gap-y-[0.5rlh]">
        {requests.map((request) => (
          <li key={request.id} className="flex items-center gap-3">
            <Avatar name={request.name} />
            <p className="min-w-0 flex-1 truncate">{request.name}</p>
            {!full && (
              <Button
                aria-label={`${request.name} 승인`}
                onClick={() => review(request, true)}
              >
                승인
              </Button>
            )}
            <Button
              aria-label={`${request.name} 거절`}
              onClick={() => review(request, false)}
            >
              거절
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
