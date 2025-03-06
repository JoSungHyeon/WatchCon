'use client';

import Introduction from '@/app/components/user/product/Introduction';
import Service from '@/app/components/user/product/Service';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

export default function LoginPage() {
  return (
    <>
      <Header />
      <Introduction />
      <Service />
      <Footer />
    </>
  );
}
