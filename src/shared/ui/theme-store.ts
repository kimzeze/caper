// 라이트/다크 테마. 같은 도메인의 서비스가 같은 값을 쓰도록 쿠키(theme)에 둔다.
// 쿠키는 포트를 가리지 않아 로컬에선 앱끼리 같이 바뀐다. 하위 도메인 여럿이 나눠 쓰려면 COOKIE_DOMAIN 에 상위 도메인을 적는다.
// "auto" 는 쿠키를 지워 OS 설정(color-scheme: light dark)에 맡긴다. 화면 쪽 CSS 는 theme.css 의 :root[data-theme].
// design-system-a(packages/ui/src/themeStore.ts)에서 옮겼다. caper에는 예전 블로그의 localStorage 값이 없어 그 이전 처리를 뺐고,
// 테마 버튼이 useSyncExternalStore 로 읽도록 구독(subscribeTheme)을 더했다.
export type Theme = "auto" | "light" | "dark";
export const THEMES: readonly Theme[] = ["auto", "light", "dark"];
export const THEME_LABEL: Record<Theme, string> = {
  auto: "테마: 시스템 설정",
  light: "테마: 라이트",
  dark: "테마: 다크",
};

/** 페인트 전에 <head> 에서 돌릴 한 줄. */
export const THEME_INIT = `(function(){try{var m=document.cookie.match(/(?:^|; )theme=(light|dark)/);if(m)document.documentElement.dataset.theme=m[1]}catch(e){}})()`;

// 예: ".example.com". 비우면 지금 호스트에만 둔다.
const COOKIE_DOMAIN: string = "";
const domain = () =>
  COOKIE_DOMAIN && location.hostname.endsWith(COOKIE_DOMAIN.slice(1))
    ? `; domain=${COOKIE_DOMAIN}`
    : "";

export function readTheme(): Theme {
  const m = document.cookie.match(/(?:^|; )theme=(light|dark)/);
  return m ? (m[1] as Theme) : "auto";
}

// 쿠키가 바뀌면 구독자(테마 버튼)에게 알린다.
const listeners = new Set<() => void>();
export function subscribeTheme(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function writeTheme(t: Theme) {
  // Cookie Store API 는 Firefox 에 없어 document.cookie 로 쓴다.
  document.cookie =
    t === "auto"
      ? `theme=; path=/; max-age=0${domain()}`
      : `theme=${t}; path=/; max-age=31536000; samesite=lax${domain()}`;
  for (const listener of listeners) listener();
}

export function applyTheme(t: Theme) {
  if (t === "auto") delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = t;
}

const resolve = (t: Theme) =>
  t === "auto"
    ? matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
    : t;
// x(t) = 1 − (1 + ωt)·e^(−ωt), ω·1 ≈ 9.23 이라 t=1 에서 99.9% 에 닿는다(튕김 없는 스프링).
const SPRING =
  "linear(0.000, 0.034, 0.114, 0.215, 0.321, 0.423, 0.516, 0.599, 0.671, 0.732, 0.783, 0.825, 0.860, 0.888, 0.911, 0.930, 0.944, 0.956, 0.966, 0.973, 0.979, 0.983, 0.987, 0.990, 0.992, 0.994, 0.995, 0.996, 0.997, 0.998, 0.998, 0.999, 1)";

/** 다음 테마로 넘긴다. 실제로 보이는 스킴이 바뀔 때만 버튼 중심에서 원이 퍼지며 바뀐다. 버튼 모양은 subscribeTheme 로 갱신된다. */
export function cycleTheme(current: Theme, origin: HTMLElement): Theme {
  const next: Theme =
    THEMES[(THEMES.indexOf(current) + 1) % THEMES.length] ?? "auto";
  const commit = () => {
    applyTheme(next);
    writeTheme(next);
  };
  // 안 바뀌는 전환(OS 라이트에서 자동→라이트)까지 돌리면 화면 변화 없이 입력만 막힌다. 미지원·움직임 줄이기는 즉시.
  if (
    resolve(next) === resolve(current) ||
    !document.startViewTransition ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    commit();
    return next;
  }
  const { left, top, width, height } = origin.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const r = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  );
  // 전환 중엔 화면이 스냅샷이라 연달아 누른 클릭이 문서로 간다. 그동안만 선택을 끈다.
  const root = document.documentElement;
  root.style.userSelect = "none";
  const transition = document.startViewTransition(commit);
  transition.finished.finally(() => {
    root.style.userSelect = "";
    getSelection()?.removeAllRanges();
  });
  transition.ready.then(() => {
    root.animate(
      {
        clipPath: [
          `circle(0 at ${x}px ${y}px)`,
          `circle(${r}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 500,
        easing: SPRING,
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
  return next;
}
