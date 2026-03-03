'use client';

/**
 * 하단 푸터. Nav 필요 시 활용.
 * @see docs/ROADMAP_DECISIONS.md - 2. FcstFooter
 */
export default function FcstFooter() {
  return (
    <footer
      className="absolute bottom-0 left-0 flex justify-center items-center w-full h-14 text-white/60 text-xs"
      aria-label="푸터"
    >
      <span>© 날씨 알리미</span>
    </footer>
  );
}