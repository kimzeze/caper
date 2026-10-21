import type { PreviewCase } from "@/views/preview";

/** 글자색 비교 케이스. tokens 는 덮어쓸 디자인 토큰이다(비면 지금 색 그대로). */
export const PALETTE_CASES: readonly (PreviewCase & {
  tokens: Readonly<Record<string, string>>;
})[] = [
  {
    key: "stone",
    label: "지금 색 (stone)",
    note: "바탕 #fafaf9 · 글자 #1c1917 · 보조 #78716c (따뜻한 회색, design-system-a)",
    tokens: {},
  },
  {
    key: "neutral",
    label: "참고 색 (neutral)",
    note: "바탕 #ffffff · 글자 #0a0a0a · 보조 #737373 (차가운 회색, liankim.kr 참고. 보조는 대비 4.5:1을 넘게 #a4a4a4 대신)",
    tokens: {
      "--color-background": "#ffffff",
      "--color-foreground": "#0a0a0a",
      "--color-muted": "#e5e5e5",
      "--color-muted-foreground": "#737373",
      "--color-border": "#d4d4d4",
    },
  },
];

export function findPaletteCase(key: string) {
  return PALETTE_CASES.find((previewCase) => previewCase.key === key);
}
