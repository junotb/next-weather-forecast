'use client';

import { useEffect } from 'react';
import { Alert, Button } from '@heroui/react';
import { toUserFriendlyMessage } from '@/lib/errorMessage';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const friendlyMessage = toUserFriendlyMessage(error);

  return (
    <main className="flex flex-col justify-center items-center gap-6 size-full bg-sky-200">
      <Alert
        title="문제가 발생했습니다"
        description={friendlyMessage}
        color="danger"
        className="max-w-md bg-white/20"
        classNames={{
          title: 'text-white font-bold',
          description: 'text-white/90',
        }}
      />
      <Button color="primary" variant="bordered" onPress={reset} className="border-white text-white">
        다시 시도
      </Button>
    </main>
  );
}
