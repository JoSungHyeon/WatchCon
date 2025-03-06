'use client'

import React, { useEffect } from 'react';
import { NICEPAY_CONFIG, getSignData, getEdiDate } from './nicepay'

interface NicepayFormProps {
  amount: string;
  goodsName: string;
  buyerName: string;
  buyerEmail: string;
  buyerTel: string;
  moid: string;
  username: string;
}

declare global {
  interface Window {
    goPay: (form: HTMLFormElement) => void;
    nicepaySubmit: () => void;
    nicepayClose: () => void;
  }
}

const NicepayForm: React.FC<NicepayFormProps> = ({
  amount,
  goodsName,
  buyerName,
  buyerEmail,
  buyerTel,
  moid,
  username, 
}) => {
  useEffect(() => {
    // Load Nicepay script
    const script = document.createElement('script');
    script.src = 'https://pg-web.nicepay.co.kr/v3/common/js/nicepay-pgweb.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const ediDate = getEdiDate();
  const hashString = getSignData(
    ediDate + 
    NICEPAY_CONFIG.merchantID + 
    amount + 
    NICEPAY_CONFIG.merchantKey
  );

  const handlePaymentStart = (e: React.MouseEvent) => {
    e.preventDefault();
    const form = document.querySelector('form[name="payForm"]') as HTMLFormElement;
    if (form && window.goPay) {
      window.goPay(form);
    }
  };

  // Define callback functions
  window.nicepaySubmit = () => {
    const form = document.querySelector('form[name="payForm"]') as HTMLFormElement;
    if (form) form.submit();
  };

  window.nicepayClose = () => {
    alert("결제가 취소 되었습니다");
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">결제</h2>
      <form
        name="payForm"
        method="post"
        action="/api/auth-req"
        acceptCharset="euc-kr"
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">상품명</label>
            <input
              type="text"
              value={goodsName}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">금액</label>
            <input
              type="text"
              value={amount}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">구매자 이름</label>
            <input
              type="text"
              value={buyerName}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">구매자 이메일</label>
            <input
              type="text"
              value={buyerEmail}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <input type="hidden" name="PayMethod" value="CARD" />
        <input type="hidden" name="GoodsName" value={goodsName} />
        <input type="hidden" name="Amt" value={amount} />
        {/* <input type="hidden" name="Amt" value="1004" /> */}
        <input type="hidden" name="MID" value={NICEPAY_CONFIG.merchantID} />
        <input type="hidden" name="Moid" value={moid} />
        <input type="hidden" name="BuyerName" value={buyerName} />
        <input type="hidden" name="BuyerEmail" value={buyerEmail} />
        <input type="hidden" name="BuyerTel" value={buyerTel} />
        <input type="hidden" name="ReturnURL" value={NICEPAY_CONFIG.returnURL} />
        <input type="hidden" name="NpLang" value="EN" />
        <input type="hidden" name="GoodsCl" value="1" />
        <input type="hidden" name="TransType" value="0" />
        <input type="hidden" name="CharSet" value="utf-8" />
        <input type="hidden" name="EdiDate" value={ediDate} />
        <input type="hidden" name="SignData" value={hashString} />

        <input type="hidden" name="UserNameParam" value={username} />
        <input type="hidden" name="UserEmailParam" value={buyerEmail} />

        <button
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handlePaymentStart}
        >
          결제하기
        </button>
      </form>
    </div>
  );
};

export default NicepayForm;