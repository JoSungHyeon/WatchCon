'use client'

import React, { useState } from 'react';
import { NICEPAY_CONFIG, getSignData, getEdiDate } from './nicepay';

interface NicepayCancelProps {
  tid: string;
  moid: string;
  amount: string;
  onClose?: () => void; 
}

const NicepayCancel: React.FC<NicepayCancelProps> = ({ tid, moid, amount }) => {
  const [cancelType, setCancelType] = useState<'0' | '1'>('0');
  const [cancelAmount, setCancelAmount] = useState(amount);
  const [cancelMessage, setCancelMessage] = useState('');

  const handleCancel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const ediDate = getEdiDate();
      const signData = getSignData(
        NICEPAY_CONFIG.merchantID + 
        cancelAmount + 
        ediDate + 
        NICEPAY_CONFIG.merchantKey
      );

      const response = await fetch('/api/cancel-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          TID: tid,
          Moid: moid,
          CancelAmt: cancelAmount,
          PartialCancelCode: cancelType,
          MID: NICEPAY_CONFIG.merchantID,
          EdiDate: ediDate,
          SignData: signData
        })
      });

      const result = await response.json();

      if (response.ok) {
        setCancelMessage('거래 취소 성공');
      } else {
        setCancelMessage(result.message || '거래 취소 실패');
      }
    } catch (error) {
      setCancelMessage('거래 취소 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">거래 취소</h2>
      <form onSubmit={handleCancel}>
        <div className="mb-4">
          <label className="block mb-2">거래 번호 (TID)</label>
          <input 
            type="text" 
            value={tid} 
            readOnly 
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">취소 유형</label>
          <div>
            <label className="mr-4">
              <input 
                type="radio" 
                value="0" 
                checked={cancelType === '0'}
                onChange={() => setCancelType('0')}
              /> 
              전체 취소
            </label>
            <label>
              <input 
                type="radio" 
                value="1" 
                checked={cancelType === '1'}
                onChange={() => setCancelType('1')}
              /> 
              부분 취소
            </label>
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">취소 금액</label>
          <input 
            type="number" 
            value={cancelAmount}
            onChange={(e) => setCancelAmount(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button 
          type="submit" 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          취소 확인
        </button>
        {cancelMessage && (
          <p className={`mt-4 ${cancelMessage.includes('성공') ? 'text-green-600' : 'text-red-600'}`}>
            {cancelMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default NicepayCancel;
