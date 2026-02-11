import { NextRequest, NextResponse } from 'next/server';
import { createEasebuzzPayment, generateEasebuzzHash } from '@/lib/easebuzz';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { registrationId, amount, email, phone, name, registrationType, teamId, playerId } = await request.json();

    const paymentData = createEasebuzzPayment(
      registrationId,
      amount,
      email,
      phone,
      name,
      registrationType
    );

    await prisma.payment.create({
      data: {
        amount,
        transactionId: paymentData.txnid,
        status: 'PENDING',
        teamId: teamId || null
      }
    });

    const hash = generateEasebuzzHash(paymentData);

    const easebuzzData = {
      key: process.env.EASEBUZZ_KEY,
      txnid: paymentData.txnid,
      amount: paymentData.amount,
      productinfo: paymentData.productinfo,
      firstname: paymentData.firstname,
      email: paymentData.email,
      phone: paymentData.phone,
      surl: paymentData.surl,
      furl: paymentData.furl,
      udf1: paymentData.udf1,
      udf2: paymentData.udf2,
      udf3: '',
      udf4: '',
      udf5: '',
      hash,
    };

    const isProduction = true;
    const apiUrl = isProduction 
      ? 'https://pay.easebuzz.in/payment/initiateLink'
      : 'https://testpay.easebuzz.in/payment/initiateLink';

    // Get access key from Easebuzz
    const formBody = Object.keys(easebuzzData)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(easebuzzData[key as keyof typeof easebuzzData] || ''))
      .join('&');

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: formBody
    });

    const result = await apiResponse.json();

    if (result.status === 1) {
      const paymentUrl = isProduction
        ? `https://pay.easebuzz.in/pay/${result.data}`
        : `https://testpay.easebuzz.in/pay/${result.data}`;

      return NextResponse.json({
        success: true,
        paymentUrl
      });
    }

    throw new Error('Failed to get access key');
  } catch (error) {
    console.error('Payment initiation error:', error);
    return NextResponse.json(
      { error: 'Payment initiation failed' },
      { status: 500 }
    );
  }
}