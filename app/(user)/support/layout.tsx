'use client';

// import '@/app/components/user/support/style/Layout.module.css';
import Header from '@/app/components/layout/Header';
import { Sidebar } from './navigation/Sidebar';

export default function Documents({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='min-h-screen'>
      <Header />
      <div className='flex mt-[70px] sm:mt-[120px] px-4 lg:px-8'>
        <Sidebar />
        <main className='flex-1 ml-0 sm:ml-8'>
          {children}
        </main>
      </div>
    </div>
  );
}
