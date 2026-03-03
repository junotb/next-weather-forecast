/**
 * 지역 입력 파싱 (nx, ny 격자 좌표)
 * @see docs/ROADMAP_DECISIONS.md 0.5 - NX=149, NY=253
 */
export function parseLocationInput(input: string): { nx: number; ny: number } | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = trimmed.split(/[,，\s]+/).map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return null;

  const nx = parseInt(parts[0], 10);
  const ny = parseInt(parts[1], 10);

  if (isNaN(nx) || isNaN(ny)) return null;
  if (nx < 1 || nx > 149) return null;
  if (ny < 1 || ny > 253) return null;

  return { nx, ny };
}
