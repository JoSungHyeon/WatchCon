'use client'

import { useSearchParams } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  // const tid = searchParams.get('tid');
  // const username = searchParams.get('username');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">결제가 성공했습니다!</h1>
      <div className="mb-4 text-gray-600">
        {/* <p>거래 코드: {tid}</p> */}
        {/* <p>사용자 이름: {username}</p> */}
        <p>귀하의 이메일을 확인하여 WatchCon 서비스를 이용해 주시기 바랍니다.</p>
      </div>
      <a 
        href="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        홈페이지로 돌아가기
      </a>
    </div>
  );
}
