import { useModal } from '@/contexts/ModalContext';
import { ReactNode } from 'react';

export default function Modal({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { modals, closeModal } = useModal();

  if (!modals[id]) return null;

  return (
    <div className="absolute inset-0 bg-gray-200/50 flex justify-center items-center">
      <div className="bg-linear-to-b from-sky-200 to-sky-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl">{title}</h2>
        <div className="my-4">{children}</div>
        <button onClick={() => closeModal(id)}>닫기</button>
      </div>
    </div>
  );
}