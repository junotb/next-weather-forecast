import React from 'react';
import FcstHeader from '@/components/fcst/FcstHeader';
import FcstContent from '@/components/fcst/FcstContent';
import FcstFooter from '@/components/fcst/FcstFooter';
import FcstProvider from '@/contexts/FcstContext';

export default function Header() {
  return (
    <FcstProvider>
      <FcstHeader />
      <FcstContent />
      <FcstFooter />
    </FcstProvider>
  );
}