import { clsx } from "clsx";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// 마크다운 글을 design-system-a 글 스타일(prose)로 그린다. GFM(체크리스트, 표 등)을 읽는다.
// 사용자가 쓴 글이라 안의 HTML은 그리지 않고(skipHtml), 위험한 주소(javascript: 등)는 react-markdown 이 걸러 낸다.
// 화면 제목(h1)과 겹치지 않게 #은 소제목(h2)으로, ####부터는 h3으로 낮춘다.
const components: Components = {
  h1: ({ node, ...props }) => <h2 {...props} />,
  h4: ({ node, ...props }) => <h3 {...props} />,
  h5: ({ node, ...props }) => <h3 {...props} />,
  h6: ({ node, ...props }) => <h3 {...props} />,
  // 사용자가 넣은 링크라 검색 엔진에 추천하지 않는다.
  a: ({ node, ...props }) => <a {...props} rel="nofollow ugc" />,
};

export default function Markdown({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <div className={clsx("prose", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
        skipHtml
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
