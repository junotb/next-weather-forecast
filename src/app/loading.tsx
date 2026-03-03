'use client';

import { Spinner } from '@heroui/react';

export default function Loading() {
  return (
    <main
      className="flex justify-center items-center size-full bg-sky-200"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col gap-4 justify-center items-center">
        <Spinner size="lg" color="white" aria-hidden />
        <span className="text-white text-lg" id="loading-message">
          날씨 정보 불러오는 중...
        </span>
      </div>
    </main>
  );
}
