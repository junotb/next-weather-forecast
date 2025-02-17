import React from 'react';
import FcstHeader from '@/component/fcst/FcstHeader';
import FcstContent from '@/component/fcst/FcstContent';
import FcstFooter from '@/component/fcst/FcstFooter';
import FcstProvider from '@/context/FcstContext';

export default function Header() {
  return (
    <FcstProvider>
      <FcstHeader />
      <FcstContent />
      <FcstFooter />
    </FcstProvider>
  );
}