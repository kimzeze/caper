import { caperSchema } from "./schema";
import type { Caper, CaperImage } from "./types";

// 화면 미리보기(/preview)와 디자인에 쓰는 고정 데이터. app/preview 에서만 import한다(index.ts 로 내보내지 않는다).
// 만들 때 스키마로 검사해서, 규칙에 어긋난 데이터는 빌드에서 바로 실패한다.

export type CaperFixture = {
  /** 미리보기 주소에 쓰는 케이스 이름 */
  key: string;
  /** 미리보기 목록에 보이는 이름 */
  label: string;
  /** 이 케이스로 확인하려는 것 */
  note: string;
  caper: Caper;
};

// 샘플 사진은 사용자가 준 우주왕복선 발사 사진 한 장을 4:5로 여러 구도로 자른 것이다.
const LAUNCH: CaperImage = {
  path: "preview/to-the-moon.jpg",
  width: 1200,
  height: 1500,
};
const LAUNCH_NOSE: CaperImage = {
  path: "preview/to-the-moon-nose.jpg",
  width: 800,
  height: 1000,
};
const LAUNCH_ORBITER: CaperImage = {
  path: "preview/to-the-moon-orbiter.jpg",
  width: 800,
  height: 1000,
};
const LAUNCH_FLAME: CaperImage = {
  path: "preview/to-the-moon-flame.jpg",
  width: 800,
  height: 1000,
};

const TO_THE_MOON: Caper = {
  id: "to-the-moon",
  title: "To the Moon",
  titlePlacement: "below",
  slogan: "10, 9, 8… 우리는 하늘로 간다",
  subtitle: "친구랑 물로켓 만들기",
  description: [
    "페트병 두 개와 자전거 펌프로 물로켓을 만든다. 목표는 **운동장 끝 담장을 넘기는 것**.",
    "## 준비물",
    [
      "- [x] 2L 페트병 두 개",
      "- [ ] 자전거 펌프",
      "- [ ] 고무마개, 절연 테이프",
      "- [ ] 날개로 쓸 하드보드지",
    ].join("\n"),
    "## 일정",
    [
      "1. 금요일 저녁: 몸통과 날개 만들기",
      "2. 토요일 오전 10시: 한강공원 잔디밭에서 첫 발사",
    ].join("\n"),
    "> 비가 오면 일요일로 미룬다.",
  ].join("\n\n"),
  schedule: { date: "2026-10-24", start: "10:00", end: "12:00" },
  images: [LAUNCH, LAUNCH_NOSE, LAUNCH_ORBITER, LAUNCH_FLAME],
  status: "active",
  crew: [
    { id: "dohyeon", name: "도현", role: "owner" },
    { id: "minsu", name: "민수", role: "member" },
    { id: "jia", name: "지아", role: "member" },
  ],
  createdAt: "2026-10-18T09:00:00.000Z",
};

const fixture = (value: CaperFixture): CaperFixture => ({
  ...value,
  caper: caperSchema.parse(value.caper),
});

const BIG_CREW_NAMES = [
  "민수",
  "지아",
  "서준",
  "하린",
  "도윤",
  "예린",
  "시우",
  "유나",
  "건우",
  "채원",
  "알렉산드라",
];

export const CAPER_FIXTURES: readonly CaperFixture[] = [
  fixture({
    key: "to-the-moon",
    label: "To the Moon",
    note: "사진 4장, 모든 항목, 제목 아래, 진행",
    caper: TO_THE_MOON,
  }),
  fixture({
    key: "title-over",
    label: "제목을 사진 위에",
    note: "To the Moon과 같은 내용, 제목을 표지 위에 얹음",
    caper: { ...TO_THE_MOON, titlePlacement: "over" },
  }),
  fixture({
    key: "no-image",
    label: "사진 없음",
    note: "사진·슬로건 없음, 날짜만, 제목 위를 골랐지만 아래로, 기획, crew 1명",
    caper: {
      id: "first-kimchi",
      title: "첫 번째 김장",
      titlePlacement: "over",
      subtitle: "엄마랑 김장 담그기",
      description:
        "올해는 처음으로 배추 절이는 것부터 같이 한다. 몇 포기를 할지는 아직 정하지 않았다.",
      schedule: { date: "2026-11-14" },
      images: [],
      status: "planning",
      crew: [{ id: "dohyeon", name: "도현", role: "owner" }],
      createdAt: "2026-10-19T12:30:00.000Z",
    },
  }),
  fixture({
    key: "one-image",
    label: "사진 한 장",
    note: "사진 1장(위치 막대 없음), 시작 시간만, 설명 없음, 완료",
    caper: {
      id: "liftoff",
      title: "Liftoff",
      titlePlacement: "below",
      slogan: "마지막 발사를 처음부터 끝까지",
      subtitle: "우주왕복선 발사 영상 보면서 밤새기",
      schedule: { date: "2026-09-05", start: "23:00" },
      images: [LAUNCH_FLAME],
      status: "done",
      crew: [
        { id: "dohyeon", name: "도현", role: "owner" },
        { id: "seojun", name: "서준", role: "member" },
      ],
      createdAt: "2026-09-02T14:00:00.000Z",
    },
  }),
  fixture({
    key: "long-text",
    label: "긴 글",
    note: "제목·슬로건·부제가 한도에 가깝고 설명이 긴 것, 제목 위(가장 빡빡한 경우)",
    caper: {
      id: "slow-summer-ride",
      title:
        "우리 동네 골목 끝까지 자전거로 가 보는 아주 느리고 긴 여름날의 탐험",
      titlePlacement: "over",
      slogan:
        "지도에도 없는 길을 찾아서, 해가 질 때까지 페달을 멈추지 않는다. 돌아올 길은 그때 가서 생각한다",
      subtitle:
        "동네 친구 다섯 명이랑 자전거 타고 한강 끝까지 가 보기, 중간에 떡볶이랑 순대도 꼭 먹고 오기",
      description: Array.from(
        { length: 6 },
        (_, index) =>
          `${index + 1}일째. 아침 일곱 시에 편의점 앞에서 모여 물과 김밥을 산다. 지도 앱은 끄고 갈림길마다 가위바위보로 방향을 정한다. 길을 잃으면 그 동네에서 가장 오래된 가게를 찾아 들어가 길을 묻고, 들은 이야기를 이 글에 적는다.`,
      ).join("\n\n"),
      images: [LAUNCH_FLAME, LAUNCH],
      status: "planning",
      crew: [
        { id: "dohyeon", name: "도현", role: "owner" },
        { id: "hareen", name: "하린", role: "member" },
      ],
      createdAt: "2026-07-21T06:00:00.000Z",
    },
  }),
  fixture({
    key: "big-crew",
    label: "crew 많음",
    note: "crew 12명, 이름이 긴 사람 포함",
    caper: {
      id: "eleven",
      title: "Eleven",
      titlePlacement: "below",
      slogan: "열한 명이 모이면 소풍도 큰일이 된다",
      subtitle: "반 친구들이랑 가을 소풍",
      images: [LAUNCH_NOSE, LAUNCH_FLAME],
      status: "active",
      crew: [
        { id: "dohyeon", name: "도현", role: "owner" },
        ...BIG_CREW_NAMES.map((name, index) => ({
          id: `crew-${index + 1}`,
          name,
          role: "member" as const,
        })),
      ],
      createdAt: "2026-10-10T08:00:00.000Z",
    },
  }),
];

export function findCaperFixture(key: string): CaperFixture | undefined {
  return CAPER_FIXTURES.find((value) => value.key === key);
}
