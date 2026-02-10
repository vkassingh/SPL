import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const verifyEasebuzzSignature = (data: any): boolean => {
  const salt = process.env.EASEBUZZ_SALT!;
  const hashString = `${salt}|${data.status}|||||||||||${data.udf5 || ''}|${data.udf4 || ''}|${data.udf3 || ''}|${data.udf2 || ''}|${data.udf1 || ''}|${data.email}|${data.firstname}|${data.productinfo}|${data.amount}|${data.txnid}|${process.env.EASEBUZZ_KEY}`;
  const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  return hash === data.hash;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });

    if (!verifyEasebuzzSignature(data)) {
      console.error('Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    if (data.status === 'success') {
      await prisma.payment.updateMany({
        where: { transactionId: data.txnid },
        data: {
          status: 'SUCCESS',
          paymentId: data.easepayid
        }
      });
    } else if (data.status === 'failure' || data.status === 'userCancelled') {
      await prisma.payment.updateMany({
        where: { transactionId: data.txnid },
        data: { status: 'FAILED' }
      });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 });
  }
}
