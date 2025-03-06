import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  LuChevronDown,
  LuChevronRight,
} from 'react-icons/lu';

import { Paths } from '@/app/lib/support/pageroutes';
import { cn } from '@/app/lib/support/utils';
import { Button } from '../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible';
import { SheetClose } from '../ui/sheet';
import Anchor from './anchor';

function isRoute(
  item: Paths,
): item is Extract<Paths, { title: string; href: string }> {
  return 'title' in item && 'href' in item;
}

const getActiveLang = () => {
  const lang = localStorage.getItem('i18nextLng');
  return lang || 'ko'; // 기본값으로 'ko' 설정
};

export default function SubLink(
  props: Paths & { level: number; isSheet: boolean },
) {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (
      isRoute(props) &&
      props.href &&
      path !== props.href &&
      path.includes(props.href)
    ) {
      setIsOpen(true);
    }
  }, [path, props]);

  if (!isRoute(props)) {
    return null;
  }

  const { title, href, items, noLink, level, isSheet } =
    props;

  const activeLang = getActiveLang();
  const Comp = (
    <Anchor
      activeClassName='text-primary text-sm font-medium'
      href={
        href.includes(activeLang)
          ? href
          : `/${activeLang}${href.startsWith('/') ? href : `/${href}`}`
      }
    >
      {title}
    </Anchor>
  );

  const titleOrLink = !noLink ? (
    isSheet ? (
      <SheetClose asChild>{Comp}</SheetClose>
    ) : (
      Comp
    )
  ) : (
    <h2 className='font-medium text-primary sm:text-sm'>
      {title}
    </h2>
  );

  if (!items) {
    return (
      <div className='flex flex-col text-sm'>
        {titleOrLink}
      </div>
    );
  }

  return (
    <div className='flex flex-col w-full gap-1'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className='flex items-center gp-2 text-sm mr-3'>
          {titleOrLink}
          <CollapsibleTrigger asChild>
            <Button
              className='ml-auto h-6 w-6'
              variant='link'
              size='icon'
            >
              {!isOpen ? (
                <LuChevronRight className='h-[0.9rem] w-[0.9rem]' />
              ) : (
                <LuChevronDown className='h-[0.9rem] w-[0.9rem]' />
              )}
              <span className='sr-only'>Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className='CollapsibleContent'>
          <div
            className={cn(
              'mt-2.5 flex flex-col items-start gap-3 pl-4 text-sm border-l text-neutral-800 dark:text-neutral-300/85',
              level > 0 && 'ml-1 pl-4 border-l',
            )}
          >
            {items?.map((innerLink) => {
              if (!isRoute(innerLink)) {
                return null;
              }

              const modifiedItems = {
                ...innerLink,
                href: `${href}${innerLink.href}`,
                level: level + 1,
                isSheet,
              };

              return (
                <SubLink
                  key={modifiedItems.href}
                  {...modifiedItems}
                />
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
