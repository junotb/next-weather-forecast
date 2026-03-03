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

export default function Modal({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  const { modals, closeModal } = useModal();
  const isOpen = !!modals[id];

  const glassContentStyle = {
    background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,64,175,0.95) 100%)',
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
      <ModalContent className="p-0 overflow-hidden">
        {() => (
          <div
            className="rounded-2xl border-0"
            style={{
              ...glassContentStyle,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
          >
            <div className="flex flex-col px-5 pt-4">
              <ModalHeader className="flex flex-row items-center justify-between gap-3 px-0 pt-0 min-h-0 shrink-0 pb-4">
                <span className="text-white text-xl font-bold truncate min-w-0">{title}</span>
                <button
                  type="button"
                  onClick={() => closeModal(id)}
                  className="rounded-full p-1.5 text-white/90 hover:bg-white/15 hover:text-white transition-colors shrink-0"
                  aria-label="닫기"
                >
                  <X className="size-5" />
                </button>
              </ModalHeader>
              <ModalBody className="text-white px-0 pb-0 pt-0 overflow-visible">{children}</ModalBody>
            </div>
            <ModalFooter className="px-4 pb-4 pt-3">
              <button
                type="button"
                onClick={() => closeModal(id)}
                className="w-full py-2.5 px-4 rounded-xl text-white/90 text-sm font-medium bg-white/10 hover:bg-white/15 active:bg-white/20 transition-colors"
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
