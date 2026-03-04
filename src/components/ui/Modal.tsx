'use client';

import {
  Modal as HeroUIModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { useModal } from '@/contexts/ModalContext';
import { ReactNode } from 'react';
import { X } from 'lucide-react';
import type { WeatherPalette } from '@/constants/weatherPalette';
import { LOADING_PALETTE } from '@/constants/weatherPalette';

const DEFAULT_MODAL_GRADIENT = `linear-gradient(135deg, ${LOADING_PALETTE.gradient.from}, ${LOADING_PALETTE.gradient.to})`;

export default function Modal({
  id,
  title,
  children,
  palette,
}: {
  id: string;
  title: string;
  children: ReactNode;
  /** 색상 팔레트 (미지정 시 모노톤) */
  palette?: Pick<WeatherPalette, 'gradient' | 'card' | 'text' | 'textMuted' | 'primary' | 'primaryForeground'>;
}) {
  const { modals, closeModal } = useModal();
  const isOpen = !!modals[id];

  const background = palette
    ? `linear-gradient(135deg, ${palette.gradient.from}, ${palette.gradient.to})`
    : DEFAULT_MODAL_GRADIENT;

  const textColor = palette?.text ?? '#ffffff';
  const cardBg = palette?.card ?? 'rgba(255,255,255,0.1)';

  const glassContentStyle = {
    background,
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
  } as React.CSSProperties;

  return (
    <HeroUIModal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) closeModal(id);
      }}
      placement="center"
      backdrop="blur"
      classNames={{
        base: 'border-0 shadow-2xl bg-transparent [&>div]:!bg-transparent',
        backdrop: 'bg-black/60',
        header: 'border-0 pb-3',
        body: 'py-4',
        footer: 'border-0 pt-3',
      }}
    >
      <ModalContent className="p-0 overflow-hidden mx-4">
        {() => (
          <div
            className="rounded-2xl border-0"
            style={{
              ...glassContentStyle,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex flex-col px-5 pt-4" style={{ color: textColor }}>
              <ModalHeader className="flex flex-row items-center justify-between gap-3 px-0 pt-0 min-h-0 shrink-0 pb-4">
                <span className="text-xl font-bold truncate min-w-0">{title}</span>
                <button
                  type="button"
                  onClick={() => closeModal(id)}
                  className="rounded-full p-1.5 opacity-90 hover:opacity-100 hover:bg-white/15 transition-colors shrink-0"
                  style={{ color: textColor }}
                  aria-label="닫기"
                >
                  <X className="size-5" />
                </button>
              </ModalHeader>
              <ModalBody className="px-0 pb-0 pt-0 overflow-visible">{children}</ModalBody>
            </div>
            <ModalFooter className="px-4 pb-4 pt-3">
              <button
                type="button"
                onClick={() => closeModal(id)}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-medium transition-colors hover:opacity-90"
                style={{ color: textColor, background: cardBg }}
              >
                닫기
              </button>
            </ModalFooter>
          </div>
        )}
      </ModalContent>
    </HeroUIModal>
  );
}
