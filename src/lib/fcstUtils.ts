/**
 * 기상청 API base_time/date 및 캐시 TTL 유틸
 * @see docs/ROADMAP_DECISIONS.md 0.3
 */

/**
 * KST 기준 base_time 및 base_date 산출
 * API 제공 시각: 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10 (KST)
 */
export function getBaseTimeAndDate(
  kstNow: Date
): { base_date: string; base_time: string } {
  const formatDate = (d: Date) =>
    `${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;

  const hour = kstNow.getUTCHours();
  const minute = kstNow.getUTCMinutes();

  const slots: { afterHour: number; afterMin: number; base: string }[] = [
    { afterHour: 2, afterMin: 10, base: '0200' },
    { afterHour: 5, afterMin: 10, base: '0500' },
    { afterHour: 8, afterMin: 10, base: '0800' },
    { afterHour: 11, afterMin: 10, base: '1100' },
    { afterHour: 14, afterMin: 10, base: '1400' },
    { afterHour: 17, afterMin: 10, base: '1700' },
    { afterHour: 20, afterMin: 10, base: '2000' },
    { afterHour: 23, afterMin: 10, base: '2300' },
  ];

  for (let i = slots.length - 1; i >= 0; i--) {
    const { afterHour, afterMin, base } = slots[i];
    if (hour > afterHour || (hour === afterHour && minute >= afterMin)) {
      return { base_date: formatDate(kstNow), base_time: base };
    }
  }

  const prev = new Date(kstNow);
  prev.setUTCDate(prev.getUTCDate() - 1);
  return { base_date: formatDate(prev), base_time: '2300' };
}

/**
 * 다음 API 갱신 시각 (캐시 만료 시각)
 */
export function getNextApiUpdateTime(kstNow: Date): Date {
  const updates = [2, 5, 8, 11, 14, 17, 20, 23];
  const hour = kstNow.getUTCHours();
  const minute = kstNow.getUTCMinutes();

  for (const h of updates) {
    if (hour < h || (hour === h && minute < 10)) {
      const next = new Date(kstNow);
      next.setUTCHours(h, 10, 0, 0);
      return next;
    }
  }
  const next = new Date(kstNow);
  next.setUTCDate(next.getUTCDate() + 1);
  next.setUTCHours(2, 10, 0, 0);
  return next;
}
