import clsx from 'clsx';
import { PropsWithChildren } from 'react';

import { cn } from '@/app/lib/support/utils';

type NoteProps = PropsWithChildren & {
  title?: string;
  type?: 'note' | 'success' | 'warning' | 'danger';
};

export default function Note({
  children,
  title = 'Note',
  type = 'note',
}: NoteProps) {
  const noteClassNames = clsx({
    'dark:bg-neutral-900 bg-neutral-100': type == 'note',
    'dark:bg-green-950 bg-green-100 border-green-200 dark:border-green-900':
      type === 'success',
    'dark:bg-orange-950 bg-orange-100 border-orange-200 dark:border-orange-900':
      type === 'warning',
    'dark:bg-red-950 bg-red-100 border-red-200 dark:border-red-900':
      type === 'danger',
  });

  return (
    <div
      className={cn(
        'border rounded-md py-0.5 px-3.5 text-sm tracking-wide',
        noteClassNames,
      )}
    >
      <p className='font-semibold -mb-3'>{title}:</p>{' '}
      {children}
    </div>
  );
}
