import { clsx } from "clsx";

// 동적(React) 표 래퍼 — 마크다운 표(mdx/Table.astro)와 같은 .md-table 를 달아 동일하게
// 보이게 한다. 셀은 데모가 native <thead>/<tbody>/<tr>/<th>/<td> 로 쓰고, 스타일은
// prose.css 의 .md-table th/td 셀렉터가 입힌다(마크다운·데모 공용).
// density="compact": 데모 안의 작은 표. 내용 폭으로 줄이고 줄 간격을 좁힌다.
// wide: 본문에 바로 놓인 표가 본문 폭을 넘으면 화면 폭까지 넓혀 가운데에 둔다(좁으면 본문 왼쪽에 그대로).
// 본문 칸 기준으로 계산하니 데모 상자 안의 표에는 쓰지 않는다.
export function Table({
  className,
  density,
  wide,
  ...props
}: React.ComponentProps<"table"> & { density?: "compact"; wide?: boolean }) {
  const table = (
    <table
      className={clsx(
        "md-table",
        density === "compact" ? "md-table-compact" : "w-full",
        className,
      )}
      {...props}
    />
  );
  return (
    <div className={clsx("md-table-wrap", wide && "md-table-wide")}>
      {wide ? <div>{table}</div> : table}
    </div>
  );
}
