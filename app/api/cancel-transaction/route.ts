import { NextResponse } from 'next/server';
import iconv from 'iconv-lite';

export async function POST(request: Request) {
  try {
    const {
      TID,
      Moid,
      CancelAmt,
      PartialCancelCode,
      MID,
      EdiDate,
      SignData
    } = await request.json();

    console.log("Request body:");
    console.log({
      TID,
      Moid,
      CancelAmt,
      PartialCancelCode,
      MID,
      EdiDate,
      SignData
    });

    const cancelURL = "https://pg-api.nicepay.co.kr/webapi/cancel_process.jsp";

    const cancelResponse = await fetch(cancelURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        TID,
        Moid,
        CancelAmt,
        PartialCancelCode,
        MID,
        EdiDate,
        SignData,
        CancelMsg: 'User requested cancellation'
      })
    });

    // Đọc dữ liệu trả về dưới dạng buffer để chuyển đổi encoding
    const cancelBuffer = await cancelResponse.arrayBuffer();
    const decodedResponse = iconv.decode(Buffer.from(cancelBuffer), 'euc-kr');

    // Parse JSON từ chuỗi sau khi decode
    const cancelResult = JSON.parse(decodedResponse);

    if (cancelResult.ResultCode === '2001') {
      return NextResponse.json({
        success: true,
        message: 'Hủy giao dịch thành công'
      });
    } else {
      return NextResponse.json({
        success: false,
        message: cancelResult.ResultMsg || 'Hủy giao dịch thất bại'
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Cancel transaction error:', error);
    return NextResponse.json({
      success: false,
      message: 'Lỗi hệ thống khi hủy giao dịch'
    }, { status: 500 });
  }
}
