import { z } from "zod";

// 만든 사람이 자기 프로젝트를 묶는 카테고리(velog 시리즈처럼). 한 프로젝트는 카테고리 하나다(caper.categoryId).
// 이름은 caper 에 넣지 않고 여기 하나에 둔다(이름을 바꿔도 프로젝트는 그대로). DB에서는 categories 테이블.
// 다른 사람에게도 보인다(프로젝트 페이지 제목 위).

export const CATEGORY_NAME_MAX = 20;

export const categorySchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(CATEGORY_NAME_MAX),
});

export type Category = z.infer<typeof categorySchema>;
