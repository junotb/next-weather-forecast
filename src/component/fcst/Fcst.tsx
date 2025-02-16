'use client';

import React from 'react';
import FcstHeader from '@/component/fcst/FcstHeader';
import FcstContent from '@/component/fcst/FcstContent';
import FcstFooter from '@/component/fcst/FcstFooter';

export default function Header() {
  return (
    <>
      <FcstHeader />
      <FcstContent />
      <FcstFooter />
    </>
  );
}