import { isPreviewOpen } from "@/shared/config/preview";
import { HomePage } from "@/views/home";

import { PREVIEW_SHORTCUTS } from "./preview/shortcuts";

// 미리보기가 열리는 곳(개발 서버, Vercel preview)에서만 미리보기 바로 가기를 보인다(production 은 404 라서).
export default function HomeRoute() {
  return (
    <HomePage previewLinks={isPreviewOpen() ? PREVIEW_SHORTCUTS : undefined} />
  );
}
