'use client';

import { Button } from '@heroui/react';
import { MapPin, Loader2 } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { ModalIDs } from '@/constants/ModalIDs';

interface FcstEmptyStateProps {
  isLoading?: boolean;
}

export default function FcstEmptyState({ isLoading = false }: FcstEmptyStateProps) {
  const { openModal } = useModal();

  if (isLoading) {
    return (
      <section
        aria-label="예보 로딩 중"
        className="flex flex-col justify-center items-center gap-4 py-16"
      >
        <Loader2 className="size-12 text-white animate-spin" aria-hidden />
        <p className="text-white/90 text-center">날씨 정보를 불러오는 중입니다...</p>
      </section>
    );
  }

  return (
    <section
      aria-label="지역 선택 안내"
      className="flex flex-col justify-center items-center gap-6 py-16 px-4"
    >
      <MapPin className="size-16 text-white/80" aria-hidden />
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-white text-xl font-bold">지역을 추가해 날씨를 확인해보세요</h2>
        <p className="text-white/90">
          현재 위치로 설정하거나 지도에서 검색해 지역을 추가할 수 있습니다.
        </p>
      </div>
      <Button
        color="primary"
        size="lg"
        onPress={() => openModal(ModalIDs.FCST_LOCATIONS)}
        startContent={<MapPin className="size-5" />}
        className="bg-white/20 text-white border border-white/40 hover:bg-white/30"
      >
        지역 추가
      </Button>
    </section>
  );
}
