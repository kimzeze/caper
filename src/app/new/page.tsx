import type { Metadata } from "next";

import { NewCaperPage } from "@/views/new-caper";

export const metadata: Metadata = {
  title: "새 프로젝트",
  robots: { index: false },
};

export default function NewCaperRoute() {
  return <NewCaperPage />;
}
