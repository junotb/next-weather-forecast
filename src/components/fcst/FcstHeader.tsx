'use client';

import { useState } from 'react';
import { Button, Input } from '@heroui/react';
import { Plus, MapPin, Trash2 } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { ModalIDs } from '@/constants/ModalIDs';
import { Modal } from '@/components/ui';
import { useFcstContext } from '@/contexts/FcstContext';
import { parseLocationInput } from '@/lib/parseLocation';

export default function FcstHeader() {
  const { openModal, closeModal } = useModal();
  const {
    locations,
    currentLocationIndex,
    setCurrentLocationIndex,
    addLocation,
    removeLocation,
  } = useFcstContext();

  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = async () => {
    setError(null);
    const parsed = parseLocationInput(inputValue);
    if (!parsed) {
      setError('nx, ny 형식으로 입력하세요 (예: 60, 127). nx: 1~149, ny: 1~253');
      return;
    }

    const exists = locations.some(
      (loc) => loc.nx === parsed.nx && loc.ny === parsed.ny
    );
    if (exists) {
      setError('이미 추가된 지역입니다.');
      return;
    }

    setIsAdding(true);
    try {
      await addLocation({
        nx: parsed.nx,
        ny: parsed.ny,
        name: locations.length === 0 ? '서울' : undefined,
      });
      setInputValue('');
      setError(null);
    } catch {
      setError('지역 추가에 실패했습니다.');
    } finally {
      setIsAdding(false);
    }
  };

  const currentLoc = locations[currentLocationIndex];

  return (
    <>
      <header className="absolute top-0 left-0 flex justify-between items-center px-4 py-3 w-full h-14 z-10">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-white text-xl font-bold truncate">
            {currentLoc?.name ?? `(${currentLoc?.nx ?? 60}, ${currentLoc?.ny ?? 127})`}
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

      <Modal id={ModalIDs.FCST_LOCATIONS} title="날씨 예보 지역 추가">
        <div className="flex flex-col gap-5 min-w-0">
          <div className="flex flex-col gap-3 min-w-0">
            <Input
              type="text"
              placeholder="60, 127"
              value={inputValue}
              onValueChange={setInputValue}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              label="격자 좌표 (nx, ny)"
              description="예: 60, 127 (서울) 또는 55, 127"
              isInvalid={!!error}
              errorMessage={error ?? undefined}
              classNames={{
                input: 'text-white placeholder:text-white/50',
                inputWrapper:
                  'bg-white/10 border-0 hover:bg-white/15 data-[hover=true]:bg-white/15 group-data-[focus=true]:bg-white/15 rounded-xl',
                label: 'text-white/90',
                description: 'text-white/70 text-xs',
                errorMessage: 'text-amber-200 text-xs',
              }}
              startContent={
                <MapPin className="size-5 text-white/70 shrink-0" />
              }
            />
            <Button
              color="primary"
              onPress={handleAdd}
              isLoading={isAdding}
              isDisabled={!inputValue.trim()}
              className="w-full py-2.5 rounded-xl font-medium bg-white/20 text-white hover:bg-white/30 active:bg-white/35 disabled:opacity-50 disabled:hover:bg-white/20 border-0 transition-colors"
            >
              추가
            </Button>
          </div>

          {locations.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-white/80 text-sm font-medium">
                저장된 지역 ({locations.length})
              </span>
              <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
                {locations.map((loc, index) => (
                  <li
                    key={`${loc.nx}-${loc.ny}`}
                    className="flex items-center justify-between gap-2 py-2.5 px-3 rounded-xl bg-white/5"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentLocationIndex(index);
                        closeModal(ModalIDs.FCST_LOCATIONS);
                      }}
                      className="flex-1 text-left text-white/90 hover:text-white min-w-0 truncate"
                    >
                      {loc.name ?? `(${loc.nx}, ${loc.ny})`}
                    </button>
                    {locations.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLocation(index)}
                        className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                        aria-label="지역 제거"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
