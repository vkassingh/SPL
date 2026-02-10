import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    if (!type) {
      return NextResponse.json({ error: 'Report type required' }, { status: 400 })
    }

    let csv = ''

    if (type === 'teams') {
      const teams = await prisma.team.findMany({
        include: {
          createdBy: true,
          _count: { select: { players: true } }
        }
      })

      csv = 'Registration ID,Team Name,District,School/College,Status,Players Count,Contact Email,Contact Phone,Created At\n'
      teams.forEach(team => {
        csv += `${team.registrationId},"${team.name}","${team.district}","${team.schoolCollege}",${team.status},${team._count.players},"${team.createdBy.email || ''}","${team.createdBy.phone || ''}","${team.createdAt}"\n`
      })
    }

    else if (type === 'players') {
      const players = await prisma.player.findMany()

      csv = 'Name,Father Name,DOB,Phone,District,School/College,Role,Position,Type,Team Assigned,Created At\n'
      players.forEach(player => {
        csv += `"${player.name}","${player.fatherName || ''}","${player.dateOfBirth}","${player.phone}","${player.district}","${player.schoolCollege}","${player.role}","${player.position || ''}","${player.isIndividual ? 'Individual' : 'Team'}","${player.teamAssigned}","${player.createdAt}"\n`
      })
    }

    else if (type === 'payments') {
      const payments = await prisma.payment.findMany({
        include: { team: true }
      })

      csv = 'Transaction ID,Team Name,Amount,Status,Payment ID,Created At\n'
      payments.forEach(payment => {
        csv += `"${payment.transactionId || ''}","${payment.team?.name || 'N/A'}",${payment.amount},"${payment.status}","${payment.paymentId || ''}","${payment.createdAt}"\n`
      })
    }

    else if (type === 'individual') {
      const players = await prisma.player.findMany({
        where: { isIndividual: true, teamAssigned: false }
      })

      csv = 'Name,Father Name,Phone,District,School/College,Role,Position,Experience,Created At\n'
      players.forEach(player => {
        csv += `"${player.name}","${player.fatherName || ''}","${player.phone}","${player.district}","${player.schoolCollege}","${player.role}","${player.position || ''}","${player.experience || ''}","${player.createdAt}"\n`
      })
    }

    else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 })
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="SPL_${type}_report.csv"`
      }
    })
  } catch (error) {
    console.error('Report generation error:', error)
    return NextResponse.json({ error: 'Failed to generate report', details: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
  }
}
