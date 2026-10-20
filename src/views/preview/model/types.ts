/** 미리보기 케이스 하나. 고정 데이터 하나에 화면 상태 하나다. */
export type PreviewCase = {
  key: string;
  label: string;
  note: string;
};

/** 한 화면의 미리보기 묶음. 케이스는 `basePath/{key}` 에서 열린다. */
export type PreviewFamily = {
  key: string;
  label: string;
  description: string;
  basePath: string;
  /** 헤더부터 화면 전체를 그리는 묶음이면 true. 안내 줄을 맨 아래로 보낸다. */
  whole?: boolean;
  cases: readonly PreviewCase[];
};
