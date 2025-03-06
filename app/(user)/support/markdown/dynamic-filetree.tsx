'use client';

import dynamic from 'next/dynamic';

export const FileTree = dynamic(
  () => import('./filetree'),
  {
    ssr: false,
  },
);
