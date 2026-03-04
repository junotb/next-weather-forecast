'use client';

import { Plus } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { ModalIDs } from '@/constants/ModalIDs';
import { useFcstContext } from '@/contexts/FcstContext';
import FcstLocationModal from '@/components/fcst/FcstLocationModal';

export default function FcstHeader() {
  const { openModal } = useModal();
  const { locations, currentLocationIndex, isFcstLoading, isContentReady } = useFcstContext();

  const isLoading = isFcstLoading || !isContentReady;
  const currentLoc = locations[currentLocationIndex];

  return (
    <>
      <header className="absolute top-0 left-0 flex justify-between items-center px-4 py-3 w-full h-14 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white text-xl font-bold truncate">
            {isLoading
              ? ' '
              : currentLoc?.name ?? `(${currentLoc?.nx ?? 60}, ${currentLoc?.ny ?? 127})`}
          </span>
        </div>
        <button
          type="button"
          onClick={() => openModal(ModalIDs.FCST_LOCATIONS)}
          className="flex items-center justify-center size-10 rounded-full text-white hover:bg-white/15 active:bg-white/25 transition-colors shrink-0"
          aria-label="지역 추가"
        >
          <Plus className="size-6" />
        </button>
      </header>
      <FcstLocationModal />
    </>
  );
}
