import { NextResponse } from 'next/server';
import { NICEPAY_CONFIG, getSignData, getEdiDate } from '../../components/layout/nicepay';
const baseURL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const authResultCode = formData.get('AuthResultCode') as string;
    const authResultMsg = formData.get('AuthResultMsg') as string;
    const txTid = formData.get('TxTid') as string;
    const authToken = formData.get('AuthToken') as string;
    const payMethod = formData.get('PayMethod') as string;
    const mid = formData.get('MID') as string;
    const moid = formData.get('Moid') as string;
    const amt = formData.get('Amt') as string;
    const reqReserved = formData.get('ReqReserved') as string;
    const nextAppURL = formData.get('NextAppURL') as string;
    const netCancelURL = formData.get('NetCancelURL') as string;

    // Get user data
    const username = formData.get('UserNameParam') as string;
    const email = formData.get('UserEmailParam') as string;

    const ediDate = getEdiDate();
    const signData = getSignData(authToken + mid + amt + ediDate + NICEPAY_CONFIG.merchantKey);

    // Check if authorization is successful
    if (authResultCode !== '0000') {
      return NextResponse.json({
        success: false,
        message: authResultMsg || 'Authorization failed'
      }, { status: 400 });
    }

    // Send payment request to the next app
    const paymentResponse = await fetch(nextAppURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0',
      },
      body: new URLSearchParams({
        TID: txTid,
        AuthToken: authToken,
        Amt: amt,
        MID: mid,
        SignData: signData,
        EdiDate: ediDate,
      })
    });

    if (!paymentResponse.ok) {
      // Cancel the payment if the next app fails
      await fetch(netCancelURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          TID: txTid,
          MID: mid,
          Amt: amt,
          EdiDate: ediDate,
          SignData: signData,
        })
      });

      return NextResponse.json({
        success: false,
        message: 'Payment failed'
      }, { status: 500 });
    }

    const paymentResult = await paymentResponse.json();

    try {
        // const createAccountResponse = await fetch('http://localhost:8082/api/create-account', {
        // user/create-account
        const createAccountResponse = await fetch(`${baseURL}/purchase/v3`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            moid: moid,
            tid: txTid,
            buyerName: username,
            buyerEmail: email,
            license_type: 1,
            purchase_mode: 0,
            payment_result: paymentResult,
          })
        });
  
        if (!createAccountResponse.ok) {
          console.error('Failed to create account:', await createAccountResponse.text());
          return NextResponse.redirect(new URL('/license/error', request.url));
        }
  
        const accountResult = await createAccountResponse.json();
        
        // Redirect to success page  with account info
        return NextResponse.redirect(
          // new URL(`/license/success?tid=${txTid}&username=${username}`, request.url)
          new URL(`/license/success`, request.url)
        );

      } catch (error) {
        console.error('Account creation error:', error);
        return NextResponse.redirect(new URL('/license/error', request.url));
      }
    }
    catch (error) {
        console.error('Payment processing error:', error);
        return NextResponse.json({
        success: false,
        message: 'Internal server error'
        }, { status: 500 });
    }
}
