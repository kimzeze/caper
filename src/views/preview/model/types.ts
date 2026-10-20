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
  cases: readonly PreviewCase[];
};
