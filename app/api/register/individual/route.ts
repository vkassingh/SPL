import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { nanoid } from 'nanoid'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const registrationId = `SPL${nanoid(8).toUpperCase()}`
    
    const user = await prisma.user.create({
      data: {
        email: data.email || `player_${nanoid(8)}@spl.com`,
        password: 'temp',
        role: 'PUBLIC',
        name: data.name,
        phone: data.phone,
        district: data.district
      }
    })

    const player = await prisma.player.create({
      data: {
        name: data.name,
        fatherName: data.fatherName,
        dateOfBirth: new Date(data.dateOfBirth),
        phone: data.phone,
        alternatePhone: data.alternatePhone,
        aadhaarNo: data.aadhaarNo || nanoid(12),
        schoolCollege: data.schoolCollege,
        district: data.district,
        role: data.role,
        position: data.position,
        experience: data.experience,
        isIndividual: true,
        teamAssigned: false,
        createdById: user.id
      }
    })

    return NextResponse.json({ 
      success: true, 
      playerId: player.id,
      userId: user.id,
      registrationId,
      paymentRequired: true,
      amount: 1000,
      email: data.email,
      phone: data.phone,
      name: data.name
    })
  } catch (error) {
    console.error('Individual registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}