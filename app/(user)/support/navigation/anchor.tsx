'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ComponentProps } from 'react';

import { cn } from '@/app/lib/support/utils';

type AnchorProps = ComponentProps<typeof Link> & {
  absolute?: boolean;
  activeClassName?: string;
  disabled?: boolean;
  lang?: 'ko' | 'en';
};

export default function Anchor({
  absolute,
  className = '',
  activeClassName = '',
  disabled,
  lang = 'ko',
  children,
  ...props
}: AnchorProps) {
  const path = usePathname();
  let isMatch = absolute
    ? props.href.toString().split('/').slice(1)[0] ===
      path.split('/').slice(1)[0]
    : path === props.href.toString();

  if (
    typeof props.href === 'string' &&
    props.href.startsWith('http')
  ) {
    isMatch = false;
  }

  if (disabled)
    return (
      <div className={cn(className, 'cursor-not-allowed')}>
        {children}
      </div>
    );

  return (
    <Link
      className={cn(className, isMatch && activeClassName)}
      {...props}
    >
      {children}
    </Link>
  );
}
