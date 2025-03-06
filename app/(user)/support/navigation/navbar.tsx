import { LuArrowUpRight } from 'react-icons/lu';
import { Navigations } from '../settings/navigation';
import { SheetClose } from '../ui/sheet';
import Anchor from './anchor';
import { Logo } from './logo';
import { SheetLeft } from './Sidebar';
import React from 'react';

export function Navbar() {
  return (
    <nav className='sticky top-0 z-50 w-full h-16 border-b backdrop-filter backdrop-blur-xl bg-opacity-5 md:px-4 px-2'>
      <div className='mx-auto flex h-full items-center justify-between p-1 sm:p-3 md:gap-2'>
        <div className='flex items-center gap-5'>
          <SheetLeft />
          <div className='flex items-center gap-6'>
            <div className='hidden md:flex'>
              <Logo />
            </div>
            <div className='hidden md:flex items-center gap-5 text-sm font-medium text-muted-foreground'>
              <NavMenu />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {Navigations().map((item) => {
        const Comp = (
          <Anchor
            activeClassName='font-bold text-primary'
            absolute
            className='flex items-center gap-1 text-sm'
            href={item.href}
            target={
              'external' in item ? '_blank' : undefined
            }
            rel={
              'external' in item
                ? 'noopener noreferrer'
                : undefined
            }
          >
            {item.title}{' '}
            {'external' in item && (
              <LuArrowUpRight
                className='w-3 h-3 align-super'
                strokeWidth={3}
              />
            )}
          </Anchor>
        );
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          <React.Fragment key={item.title + item.href}>
            {Comp}
          </React.Fragment>
        );
      })}
    </>
  );
}
