import ButtonLink from "@/shared/ui/button-link";
import { SiteHeader } from "@/widgets/site-header";

type HomeLink = { label: string; href: string };

const CREATE_LINKS: readonly HomeLink[] = [
  { label: "새 프로젝트", href: "/new" },
  { label: "만들기 미리보기", href: "/new/preview" },
];

// 첫 화면 자리. 프로젝트 목록(실제 홈)을 만들기 전까지는 개발할 때 자주 가는 화면으로 바로 가는 버튼 묶음이다.
// 미리보기 바로 가기(previewLinks)는 미리보기가 열리는 곳에서만 쓰는 쪽이 넘긴다. 주요(초록) 버튼은 새 프로젝트 하나.
export function HomePage({
  previewLinks,
}: {
  previewLinks?: readonly HomeLink[];
}) {
  return (
    <>
      <SiteHeader />
      <main className="measure-col mt-[2rlh] pb-[5rlh] lg:wide-col">
        <h1 className="sr-only">Caper</h1>
        <LinkGroup title="만들기" links={CREATE_LINKS} primary="/new" />
        {previewLinks && (
          <LinkGroup
            title="화면 미리보기"
            links={previewLinks}
            className="mt-[1.5rlh]"
          />
        )}
      </main>
    </>
  );
}

function LinkGroup({
  title,
  links,
  primary,
  className,
}: {
  title: string;
  links: readonly HomeLink[];
  primary?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="text-base font-normal text-muted-foreground">{title}</h2>
      <ul className="mt-[0.5rlh] flex flex-wrap gap-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            <ButtonLink
              href={href}
              variant={href === primary ? "primary" : "default"}
            >
              {label}
            </ButtonLink>
          </li>
        ))}
      </ul>
    </section>
  );
}
