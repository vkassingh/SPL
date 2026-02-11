import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { txnid, status, amount, firstname, email, phone, productinfo, hash, udf1, udf2 } = data

    // Verify Easebuzz hash
    const salt = process.env.EASEBUZZ_SALT!
    const hashString = `${salt}|${status}|||||||||||${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${process.env.EASEBUZZ_KEY}`
    const generatedHash = crypto.createHash('sha512').update(hashString).digest('hex')

    if (generatedHash === hash && status === 'success') {
      await prisma.payment.updateMany({
        where: { transactionId: txnid },
        data: { 
          status: 'SUCCESS',
          paymentId: txnid
        }
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}