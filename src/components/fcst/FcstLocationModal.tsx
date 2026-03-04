'use client';

import { useState } from 'react';
import { Button, Input } from '@heroui/react';
import { MapPin, Trash2 } from 'lucide-react';
import { useModal } from '@/contexts/ModalContext';
import { ModalIDs } from '@/constants/ModalIDs';
import { Modal } from '@/components/ui';
import { useFcstContext } from '@/contexts/FcstContext';
import { parseLocationInput } from '@/lib/parseLocation';
import { WEATHER_PALETTE, getWeatherType, getTimeOfDay } from '@/constants/weatherPalette';

export default function FcstLocationModal() {
  const { closeModal } = useModal();
  const {
    locations,
    currentLocationIndex,
    setCurrentLocationIndex,
    addLocation,
    removeLocation,
    fcstData,
    currentFcst,
  } = useFcstContext();

  const hasFcstData = fcstData.length > 0 && currentFcst?.fcstData?.length > 0;
  const fcstValues = (category: string) =>
    currentFcst?.fcstData?.find((d) => d.category === category)?.value ?? '0';
  const sky = fcstValues('SKY');
  const pty = fcstValues('PTY');
  const weatherType = hasFcstData ? getWeatherType(sky, pty) : 'clear';
  const timeOfDay = getTimeOfDay();
  const palette = hasFcstData
    ? WEATHER_PALETTE[timeOfDay][weatherType]
    : WEATHER_PALETTE[timeOfDay].clear;

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

  return (
    <Modal id={ModalIDs.FCST_LOCATIONS} title="날씨 예보 지역 추가" palette={palette}>
      <div className="flex flex-col gap-5 min-w-0">
        <div
          className="flex flex-col gap-3 min-w-0"
          style={{ color: palette.text }}
        >
          <div
            className="rounded-xl overflow-hidden flex flex-col gap-1 pb-3"
            style={{ background: palette.card }}
          >
            <label className="text-sm font-medium px-3 pt-3" style={{ color: palette.text }}>
              격자 좌표 (nx, ny)
            </label>
            <div className="flex items-center gap-2 px-3">
              <MapPin
                className="size-5 shrink-0 opacity-70"
                style={{ color: palette.text }}
                aria-hidden
              />
              <Input
                type="text"
                placeholder="60, 127"
                value={inputValue}
                onValueChange={setInputValue}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                isInvalid={!!error}
                errorMessage={error ?? undefined}
                classNames={{
                  input: 'placeholder:opacity-50',
                  inputWrapper: 'border-0 rounded-xl bg-transparent shadow-none flex-1 min-w-0',
                  errorMessage: 'text-amber-200 text-xs',
                }}
                style={{ color: palette.text }}
              />
            </div>
            <p className="text-xs px-3" style={{ color: palette.textMuted }}>
              예: 60, 127 (서울) 또는 55, 127
            </p>
          </div>
          <Button
            color="primary"
            onPress={handleAdd}
            isLoading={isAdding}
            isDisabled={!inputValue.trim()}
            className="w-full py-2.5 rounded-xl font-medium border-0 transition-colors"
            style={{
              background: palette.primary,
              color: palette.primaryForeground,
            }}
          >
            추가
          </Button>
        </div>

        {locations.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium" style={{ color: palette.textMuted }}>
              저장된 지역 ({locations.length})
            </span>
            <ul className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
              {locations.map((loc, index) => (
                <li
                  key={`${loc.nx}-${loc.ny}`}
                  className="flex items-center justify-between gap-2 py-2.5 px-3 rounded-xl"
                  style={{ background: palette.card }}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentLocationIndex(index);
                      closeModal(ModalIDs.FCST_LOCATIONS);
                    }}
                    className="flex-1 text-left min-w-0 truncate hover:opacity-100 opacity-90 transition-opacity"
                    style={{ color: palette.text }}
                  >
                    {loc.name ?? `(${loc.nx}, ${loc.ny})`}
                  </button>
                  {locations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeLocation(index)}
                      className="p-1.5 rounded-full opacity-70 hover:opacity-100 hover:bg-white/10 transition-all shrink-0"
                      style={{ color: palette.text }}
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
  );
}
