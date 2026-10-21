"use client";

import { useState } from "react";

import type { Caper, CaperViewer } from "@/entities/caper";

import type { JoinActions } from "../ui/join-bar";

// 미리보기 안에서 참여 흐름을 눌러 보게 하는 흉내. 저장하지 않고 이 화면의 상태만 바꾼다.
// DB 가 붙으면 같은 일을 Server Action 이 하고, 화면은 서버가 준 caper·viewer 를 다시 그린다.
const ME = "preview-me";

export function useJoinSimulation(
  initialCaper: Caper,
  initialViewer: CaperViewer,
): { caper: Caper; join: { viewer: CaperViewer } & JoinActions } {
  const [caper, setCaper] = useState(initialCaper);
  const [viewer, setViewer] = useState(initialViewer);

  return {
    caper,
    join: {
      viewer,
      onJoin: (name) => {
        if (caper.joinPolicy === "approval") {
          setViewer({ role: "pending" });
          return;
        }
        setCaper({
          ...caper,
          crew: [...caper.crew, { id: ME, name, role: "member" }],
        });
        setViewer({ role: "member", crewId: ME });
      },
      onCancel: () => setViewer({ role: "guest" }),
      onLeave: () => {
        if (viewer.role !== "member") return;
        setCaper({
          ...caper,
          crew: caper.crew.filter((member) => member.id !== viewer.crewId),
        });
        setViewer({ role: "guest" });
      },
    },
  };
}
