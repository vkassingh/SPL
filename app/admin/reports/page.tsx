'use client'

import { useState } from 'react'
import { Download, FileText, Users, CreditCard } from 'lucide-react'

export default function AdminReports() {
  const [loading, setLoading] = useState<string | null>(null)

  const downloadReport = async (type: string) => {
    setLoading(type)
    try {
      const response = await fetch(`/api/admin/reports?type=${type}`)
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Download failed')
      }
      
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `SPL_${type}_${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
      alert(`Failed to download report: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(null)
    }
  }

  const reports = [
    {
      id: 'teams',
      title: 'Teams Report',
      description: 'Export all team registrations with details',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 'players',
      title: 'Players Report',
      description: 'Export all player registrations with documents',
      icon: Users,
      color: 'green'
    },
    {
      id: 'payments',
      title: 'Payments Report',
      description: 'Export all payment transactions',
      icon: CreditCard,
      color: 'purple'
    },
    {
      id: 'individual',
      title: 'Individual Players',
      description: 'Export unassigned individual players',
      icon: Users,
      color: 'orange'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary-600">Reports & Export</h1>
        <p className="text-gray-600">Download tournament data in CSV format</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {reports.map(report => (
          <div key={report.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-lg bg-${report.color}-100`}>
                  <report.icon className={`w-6 h-6 text-${report.color}-600`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{report.title}</h3>
                  <p className="text-sm text-gray-600">{report.description}</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => downloadReport(report.id)}
              disabled={loading === report.id}
              className="mt-4 w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{loading === report.id ? 'Downloading...' : 'Download CSV'}</span>
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold mb-4">Report Information</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Reports are generated in CSV format for easy import into Excel</li>
          <li>• All data is exported based on current database records</li>
          <li>• Player reports include document URLs for verification</li>
          <li>• Payment reports show transaction status and amounts</li>
        </ul>
      </div>
    </div>
  )
}
