
export default function PaymentErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-red-600">오류가 발생했습니다!</h1>
      <p className="text-gray-600">결제를 완료할 수 없거나 계정을 생성할 수 없습니다.</p>
      <a 
        href="/"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        다시 해 보다
      </a>
    </div>
  );
}