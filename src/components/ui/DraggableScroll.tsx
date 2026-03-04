'use client';

import React, { useRef, useState, useEffect, MouseEvent, ReactNode } from 'react';

const SCROLL_ANIMATION_MS = 600;

interface DraggableScrollProps {
  children: ReactNode;
  className?: string;
  'aria-label'?: string;
  /** 초기 로드 및 새로고침 시 이 인덱스의 자식으로 스크롤 */
  scrollToIndex?: number;
  /** 데이터 갱신 시 스크롤 트리거 (예: fcstData 변경 시 전달) */
  scrollTriggerKey?: string;
  /** 현재 시간으로 스크롤 완료 시 호출 */
  onScrollToIndexComplete?: () => void;
}

const DraggableScroll: React.FC<DraggableScrollProps> = ({
  children,
  className,
  'aria-label': ariaLabel,
  scrollToIndex = 0,
  scrollTriggerKey,
  onScrollToIndexComplete,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || scrollToIndex < 0) return;
    const el = containerRef.current.children[scrollToIndex] as HTMLElement | undefined;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      const t = setTimeout(() => {
        onScrollToIndexComplete?.();
      }, SCROLL_ANIMATION_MS);
      return () => clearTimeout(t);
    }
  }, [scrollToIndex, scrollTriggerKey, onScrollToIndexComplete]);

  const handleMouseDown = (e: MouseEvent) => {
    if (!containerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // 스크롤 속도 조절
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
      className={`overflow-x-auto cursor-grab select-none overscroll-x-contain ${isDragging ? 'cursor-grabbing' : ''} ${className || ''}`}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
    </div>
  );
};

export default DraggableScroll;
