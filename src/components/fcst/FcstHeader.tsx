'use client';

import React from 'react';
import { useModal } from '@/contexts/ModalContext';
import { ModalIDs } from '@/constants/ModalIDs';
import Modal from '@/components/Modal';
export default function FcstHeader() {
  const { openModal } = useModal();

  return (
    <>
      <header className="absolute top-0 left-0 flex justify-between items-center px-4 py-2 w-full h-16">
        <span className="text-white text-xl font-bold">Next Weather</span>
        <button
          onClick={() => openModal(ModalIDs.FCST_LOCATIONS)}
          className="size-12 text-white text-2xl">
          <i className="bi bi-plus text-white text-2xl"></i>
        </button>
      </header>

      <Modal id={ModalIDs.FCST_LOCATIONS} title="날씨 예보 지역 추가">
        <div>
          <input type="text" placeholder="지역 이름" />
          <button>추가</button>
        </div>
      </Modal>
    </>
  );
}