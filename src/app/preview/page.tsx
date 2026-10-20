import { PreviewIndexPage } from "@/views/preview";

import { PREVIEW_FAMILIES } from "./preview-families";

export default function PreviewRoute() {
  return <PreviewIndexPage families={PREVIEW_FAMILIES} />;
}
