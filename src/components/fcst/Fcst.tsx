import FcstHeader from '@/components/fcst/FcstHeader';
import FcstContent from '@/components/fcst/FcstContent';
import FcstFooter from '@/components/fcst/FcstFooter';
import FcstProvider from '@/contexts/FcstContext';
import { ModalProvider } from '@/contexts/ModalContext';

export default function Fcst() {
  return (
    <FcstProvider>
      <ModalProvider>
        <div className="relative min-h-dvh w-full">
          <FcstHeader />
          <FcstContent />
          <FcstFooter />
        </div>
      </ModalProvider>
    </FcstProvider>
  );
}