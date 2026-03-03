/**
 * 낮/밤 × 날씨 유형별 색상 팔레트
 * @see docs/ROADMAP_DECISIONS.md
 */

export type TimeOfDay = 'day' | 'night';
export type WeatherType =
  | 'clear'
  | 'cloudy'
  | 'overcast'
  | 'rain'
  | 'snow'
  | 'shower';

export interface WeatherPalette {
  /** 메인 배경 그라데이션 (from → to) */
  gradient: { from: string; to: string };
  /** 카드 배경 */
  card: string;
  /** 주 텍스트 */
  text: string;
  /** 보조 텍스트 */
  textMuted: string;
  /** Primary 액센트 (버튼, 링크) */
  primary: string;
  /** Primary 전경 (버튼 위 텍스트) */
  primaryForeground: string;
}

export const WEATHER_PALETTE: Record<
  TimeOfDay,
  Record<WeatherType, WeatherPalette>
> = {
  day: {
    clear: {
      gradient: { from: '#38bdf8', to: '#7dd3fc' }, // sky-400 → sky-300
      card: 'rgba(255,255,255,0.25)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.9)',
      primary: '#0ea5e9',
      primaryForeground: '#ffffff',
    },
    cloudy: {
      gradient: { from: '#94a3b8', to: '#cbd5e1' }, // slate-400 → slate-300
      card: 'rgba(255,255,255,0.2)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.85)',
      primary: '#64748b',
      primaryForeground: '#ffffff',
    },
    overcast: {
      gradient: { from: '#64748b', to: '#94a3b8' }, // slate-500 → slate-400
      card: 'rgba(255,255,255,0.15)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.8)',
      primary: '#475569',
      primaryForeground: '#ffffff',
    },
    rain: {
      gradient: { from: '#0f766e', to: '#2dd4bf' }, // teal-700 → teal-400
      card: 'rgba(255,255,255,0.2)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.85)',
      primary: '#14b8a6',
      primaryForeground: '#ffffff',
    },
    snow: {
      gradient: { from: '#e0e7ff', to: '#f5f3ff' }, // indigo-100 → violet-50
      card: 'rgba(99,102,241,0.15)',
      text: '#312e81',
      textMuted: '#4c1d95',
      primary: '#6366f1',
      primaryForeground: '#ffffff',
    },
    shower: {
      gradient: { from: '#4c1d95', to: '#7c3aed' }, // violet-800 → violet-500
      card: 'rgba(255,255,255,0.2)',
      text: '#ffffff',
      textMuted: 'rgba(255,255,255,0.85)',
      primary: '#8b5cf6',
      primaryForeground: '#ffffff',
    },
  },
  night: {
    clear: {
      gradient: { from: '#0f172a', to: '#1e40af' }, // slate-900 → blue-700 (대비 강화)
      card: 'rgba(255,255,255,0.1)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.8)',
      primary: '#38bdf8',
      primaryForeground: '#0f172a',
    },
    cloudy: {
      gradient: { from: '#1e293b', to: '#64748b' }, // slate-800 → slate-500 (대비 강화)
      card: 'rgba(255,255,255,0.08)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.75)',
      primary: '#94a3b8',
      primaryForeground: '#0f172a',
    },
    overcast: {
      gradient: { from: '#1e293b', to: '#334155' }, // slate-800 → slate-700
      card: 'rgba(255,255,255,0.06)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.7)',
      primary: '#64748b',
      primaryForeground: '#ffffff',
    },
    rain: {
      gradient: { from: '#134e4a', to: '#0f766e' }, // teal-900 → teal-700
      card: 'rgba(255,255,255,0.1)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.8)',
      primary: '#2dd4bf',
      primaryForeground: '#134e4a',
    },
    snow: {
      gradient: { from: '#312e81', to: '#4c1d95' }, // violet-900 → violet-800
      card: 'rgba(255,255,255,0.1)',
      text: '#e0e7ff',
      textMuted: 'rgba(224,231,255,0.8)',
      primary: '#a5b4fc',
      primaryForeground: '#312e81',
    },
    shower: {
      gradient: { from: '#3b0764', to: '#6b21a8' }, // purple-900 → purple-700
      card: 'rgba(255,255,255,0.08)',
      text: '#f8fafc',
      textMuted: 'rgba(248,250,252,0.8)',
      primary: '#a78bfa',
      primaryForeground: '#3b0764',
    },
  },
};

/**
 * SKY(1~4) + PTY(0~4) → WeatherType 매핑
 */
export function getWeatherType(sky: string, pty: string): WeatherType {
  if (pty !== '0') {
    if (pty === '1') return 'rain';
    if (pty === '2') return 'rain';
    if (pty === '3') return 'snow';
    if (pty === '4') return 'shower';
  }
  if (sky === '1') return 'clear';
  if (sky === '2' || sky === '3') return 'cloudy';
  if (sky === '4') return 'overcast';
  return 'clear';
}

/**
 * 현재 시각 기준 낮/밤 (6~18시 = 낮)
 */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();
  return hour >= 6 && hour < 18 ? 'day' : 'night';
}
