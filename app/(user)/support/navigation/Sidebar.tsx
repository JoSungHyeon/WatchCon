import { LuAlignLeft } from 'react-icons/lu';

import { Button } from '@/app/(user)/support/ui/button';
import { DialogTitle } from '@/app/(user)/support/ui/dialog';
import { ScrollArea } from '@/app/(user)/support/ui/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from '@/app/(user)/support/ui/sheet';
import { Logo } from './logo';
import { NavMenu } from './navbar';
import PageMenu from './pagemenu';

export function Sidebar() {
  return (
    <aside className='md:block sticky top-[120px] w-64 hidden sm:block'>
      <ScrollArea className='h-full'>
        <div className='py-4 pr-4'>
          <PageMenu />
        </div>
      </ScrollArea>
    </aside>
  );
}

export function SheetLeft() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='md:hidden flex'
        >
          <LuAlignLeft className='!size-6' />
        </Button>
      </SheetTrigger>
      <SheetContent
        className='flex flex-col gap-4 px-0'
        side='left'
      >
        <DialogTitle className='sr-only'>Menu</DialogTitle>
        <SheetHeader>
          <SheetClose className='px-5' asChild>
            <Logo />
          </SheetClose>
        </SheetHeader>
        <ScrollArea className='flex flex-col gap-4'>
          <div className='flex flex-col gap-2.5 mt-3 mx-0 px-5'>
            <NavMenu isSheet />
          </div>
          <div className='mx-0 px-5'>
            <PageMenu isSheet />
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
