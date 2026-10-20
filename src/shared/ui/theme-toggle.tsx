"use client";

import { Moon, Sun, SunMoon } from "lucide-react";
import { useSyncExternalStore } from "react";
import IconButton from "./icon-button";
import {
  cycleTheme,
  readTheme,
  subscribeTheme,
  THEME_LABEL,
  type Theme,
} from "./theme-store";

const ICON = { auto: SunMoon, light: Sun, dark: Moon } as const;

// 서버 렌더와 하이드레이션은 auto 로 그리고, 붙은 뒤 쿠키 값으로 다시 그린다.
const serverTheme = (): Theme => "auto";

// 라이트/다크 버튼. 아이콘은 지금 상태(자동·라이트·다크)를 보여 주고, 누르면 다음으로 넘긴다.
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeTheme, readTheme, serverTheme);
  const Icon = ICON[theme];
  return (
    <IconButton
      aria-label={THEME_LABEL[theme]}
      title={THEME_LABEL[theme]}
      onClick={(e) => cycleTheme(theme, e.currentTarget)}
    >
      <Icon aria-hidden />
    </IconButton>
  );
}
