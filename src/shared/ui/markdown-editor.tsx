"use client";

import { useEffect } from "react";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import {
  type Editor,
  EditorContent,
  useEditor,
  useEditorState,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading2,
  Heading3,
  Link2,
  List,
  ListChecks,
  ListOrdered,
  Minus,
  Quote,
} from "lucide-react";

import IconButton from "./icon-button";

// 편집기는 블록 뒤에 늘 빈 문단을 하나 둔다(구분선 뒤에도 이어 쓰게). 그 빈 문단이 마크다운 끝에
// "&nbsp;"로 남지 않게 잘라 낸다. 글 중간의 빈 줄은 쓴 사람이 둔 것이라 그대로 둔다.
function trimTrailingEmpty(markdown: string): string {
  return markdown.replace(/(?:\s*&nbsp;)+\s*$/u, "").trimEnd();
}

// 글 중간의 빈 문단을 Tiptap 은 빈 줄을 더 두는 것으로 내보내는데(문단 사이 \n\n 에 빈 문단마다 \n\n 더),
// 보통 마크다운(보기의 react-markdown, 나중의 앱)은 빈 줄을 하나로 합쳐 띄운 줄이 사라진다.
// 빈 문단마다 &nbsp; 문단으로 바꿔 어디서 그려도 한 줄 띄움이 남게 한다. 코드 블록(```) 안은 건드리지 않는다.
function keepBlankParagraphs(markdown: string): string {
  return markdown
    .split(/(^```[\s\S]*?^```)/m)
    .map((part, index) =>
      index % 2 === 1
        ? part
        : part.replace(/\n{3,}/g, (run) => {
            const empty = Math.max(1, Math.round((run.length - 2) / 2));
            return `\n\n${"&nbsp;\n\n".repeat(empty)}`;
          }),
    )
    .join("");
}

/** 편집기를 바깥(React Hook Form의 오류 초점 등)에서 다룰 손잡이. */
export type MarkdownEditorHandle = { focus: () => void };

// 마크다운 편집기 — 보이는 대로 쓰고(서식 버튼), 마크다운을 아는 사람은 기호(`## `, `- `, `1. `, `[ ] `, `> `,
// `**굵게**`, `---`)를 치면 그 자리에서 바뀐다(Tiptap 3). 값은 마크다운 문자열로 주고받는다.
// 서식은 굵게, 소제목 2단계, 목록, 번호, 체크리스트, 인용, 링크, 구분선. 기울임·밑줄·취소선은 끈다
// (design-system-a: 강조는 굵게 하나). 글 모양은 보기(shared/ui/markdown)와 같은 prose 다.
// 테두리 없는 편집기 칸이라, 초점이면 아래에 2px 초록 줄(EditorText 와 같다).
export default function MarkdownEditor({
  defaultValue,
  onChange,
  onBlur,
  handleRef,
  placeholder,
  "aria-label": ariaLabel,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: {
  defaultValue: string;
  onChange: (markdown: string) => void;
  onBlur?: () => void;
  handleRef?: (handle: MarkdownEditorHandle | null) => void;
  placeholder?: string;
  "aria-label": string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}) {
  const editor = useEditor({
    // 서버 렌더에서는 만들지 않는다(Next.js 하이드레이션 어긋남 방지).
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        italic: false,
        underline: false,
        strike: false,
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder }),
      Markdown.configure({ markedOptions: { gfm: true } }),
    ],
    content: defaultValue,
    contentType: "markdown",
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": ariaLabel,
        class: "prose prose-compact min-h-[5rlh] focus-visible:outline-none",
      },
    },
    onUpdate: ({ editor: current }) =>
      onChange(keepBlankParagraphs(trimTrailingEmpty(current.getMarkdown()))),
    onBlur: () => onBlur?.(),
  });

  // 오류 표시(aria-invalid·aria-describedby)는 편집기를 만든 뒤에도 바뀌므로 따로 넣는다.
  useEffect(() => {
    if (editor === null) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          role: "textbox",
          "aria-multiline": "true",
          "aria-label": ariaLabel,
          ...(ariaInvalid ? { "aria-invalid": "true" } : {}),
          ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
          class: "prose prose-compact min-h-[5rlh] focus-visible:outline-none",
        },
      },
    });
  }, [editor, ariaLabel, ariaInvalid, ariaDescribedBy]);

  useEffect(() => {
    if (editor === null || handleRef === undefined) return;
    handleRef({ focus: () => editor.commands.focus("end") });
    return () => handleRef(null);
  }, [editor, handleRef]);

  return (
    <div className="border-b-2 border-transparent focus-within:border-accent">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} className="mt-[0.5rlh]" />
    </div>
  );
}

/** 편집기를 불러오는 동안 같은 자리를 잡아 두는 빈 상자(서식 버튼 두 줄 + 글 칸). */
export function MarkdownEditorPlaceholder() {
  return (
    <div aria-hidden className="border-b-2 border-transparent">
      <div className="h-[calc(var(--spacing-control)*2)]" />
      <div className="mt-[0.5rlh] min-h-[5rlh]" />
    </div>
  );
}

// 서식 버튼 줄. 켜진 서식은 aria-pressed 로 버튼에 표시한다(아이콘이 초록으로 찬다).
function Toolbar({ editor }: { editor: Editor | null }) {
  const active = useEditorState({
    editor,
    selector: ({ editor: current }) =>
      current === null
        ? null
        : {
            bold: current.isActive("bold"),
            h2: current.isActive("heading", { level: 2 }),
            h3: current.isActive("heading", { level: 3 }),
            bulletList: current.isActive("bulletList"),
            orderedList: current.isActive("orderedList"),
            taskList: current.isActive("taskList"),
            blockquote: current.isActive("blockquote"),
            link: current.isActive("link"),
          },
  });

  const run = (command: (chain: ReturnType<Editor["chain"]>) => void) => {
    if (editor === null) return;
    const chain = editor.chain().focus();
    command(chain);
  };

  const toggleLink = () => {
    if (editor === null) return;
    if (editor.isActive("link")) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    // 링크 주소 묻기는 디자인 이슈에서 화면 안 입력으로 바꾼다.
    const href = window.prompt("링크 주소");
    if (!href) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
  };

  const buttons = [
    {
      label: "굵게",
      Icon: Bold,
      pressed: active?.bold,
      onClick: () => run((chain) => chain.toggleBold().run()),
    },
    {
      label: "소제목",
      Icon: Heading2,
      pressed: active?.h2,
      onClick: () => run((chain) => chain.toggleHeading({ level: 2 }).run()),
    },
    {
      label: "작은 소제목",
      Icon: Heading3,
      pressed: active?.h3,
      onClick: () => run((chain) => chain.toggleHeading({ level: 3 }).run()),
    },
    {
      label: "글머리 목록",
      Icon: List,
      pressed: active?.bulletList,
      onClick: () => run((chain) => chain.toggleBulletList().run()),
    },
    {
      label: "번호 목록",
      Icon: ListOrdered,
      pressed: active?.orderedList,
      onClick: () => run((chain) => chain.toggleOrderedList().run()),
    },
    {
      label: "체크리스트",
      Icon: ListChecks,
      pressed: active?.taskList,
      onClick: () => run((chain) => chain.toggleTaskList().run()),
    },
    {
      label: "인용",
      Icon: Quote,
      pressed: active?.blockquote,
      onClick: () => run((chain) => chain.toggleBlockquote().run()),
    },
    {
      label: "링크",
      Icon: Link2,
      pressed: active?.link,
      onClick: toggleLink,
    },
    {
      label: "구분선",
      Icon: Minus,
      pressed: undefined,
      onClick: () => run((chain) => chain.setHorizontalRule().run()),
    },
  ];

  return (
    <div
      role="toolbar"
      aria-label="설명 서식"
      className="-ml-2 flex flex-wrap items-center"
    >
      {buttons.map(({ label, Icon, pressed, onClick }) => (
        <IconButton
          key={label}
          aria-label={label}
          title={label}
          aria-pressed={pressed}
          disabled={editor === null}
          onClick={onClick}
        >
          <Icon aria-hidden />
        </IconButton>
      ))}
    </div>
  );
}
