import { z } from "zod";

// 언제 하는지. 그 지역 벽시계 날짜·시각을 그대로 둔다(UTC로 바꾸지 않는다). "토요일 10시"가 보는 기기의
// 시간대에 따라 흔들리지 않게 하려는 것이다. DB에서는 date + time 열로 옮긴다. 지금은 하루짜리만 둔다.
const time = z.iso.time({ precision: -1 }); // HH:MM

export const caperScheduleSchema = z
  .object({
    date: z.iso.date(), // YYYY-MM-DD
    start: time.optional(),
    end: time.optional(),
  })
  .refine(
    ({ start, end }) =>
      end === undefined || (start !== undefined && end > start),
    { message: "끝나는 시간은 시작 시간보다 늦어야 합니다.", path: ["end"] },
  );

export type CaperSchedule = z.infer<typeof caperScheduleSchema>;

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// 그레고리력 요일(0 일요일). Date 를 쓰지 않고 셈으로만 구해 시간대와 상관없다.
function weekdayOf(year: number, month: number, day: number): number {
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  const y = month < 3 ? year - 1 : year;
  return (
    (y +
      Math.floor(y / 4) -
      Math.floor(y / 100) +
      Math.floor(y / 400) +
      offsets[month - 1] +
      day) %
    7
  );
}

/**
 * 화면에 보일 날짜와 시간: "10월 24일(토) 10:00 - 12:00". 시작만 있으면 "10월 24일(토) 10:00", 날짜만이면
 * "10월 24일(토)". 연도는 쓰지 않는다(지난해 기록이 보이면 그때 붙인다).
 */
export function formatSchedule({ date, start, end }: CaperSchedule): string {
  const [year, month, day] = date.split("-").map(Number);
  const dayText = `${month}월 ${day}일(${WEEKDAYS[weekdayOf(year, month, day)]})`;
  if (start === undefined) return dayText;
  return end === undefined
    ? `${dayText} ${start}`
    : `${dayText} ${start} - ${end}`;
}

/** <time dateTime> 값. 시작이 있으면 그 시각까지. */
export function scheduleDateTime({ date, start }: CaperSchedule): string {
  return start === undefined ? date : `${date}T${start}`;
}
