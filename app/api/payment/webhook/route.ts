import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()

    if (data.status === 'success') {
      await prisma.payment.updateMany({
        where: { transactionId: data.txnid },
        data: {
          status: 'SUCCESS',
          paymentId: data.easepayid
        }
      })
    } else if (data.status === 'failure') {
      await prisma.payment.updateMany({
        where: { transactionId: data.txnid },
        data: { status: 'FAILED' }
      })
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
