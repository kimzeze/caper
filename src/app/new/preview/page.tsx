import type { Metadata } from "next";

import { NewCaperPreviewPage } from "@/views/new-caper";

export const metadata: Metadata = {
  title: "미리보기",
  robots: { index: false },
};

export default function NewCaperPreviewRoute() {
  return <NewCaperPreviewPage />;
}
