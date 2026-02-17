'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Trophy } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/tournament-format', label: 'Tournament' },
    { href: '/eligibility', label: 'Rules' },
    { href: '/prizes', label: 'Prizes' },
    { href: '/schedule', label: 'Schedule' },
    { href: '/sponsors', label: 'Sponsors' },
    { href: '/news', label: 'News' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] max-w-7xl">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl px-6 py-4 shadow-2xl border border-gray-200/50">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl shadow-lg">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-bold text-gray-900">SPL</div>
              <div className="text-xs text-gray-600">Under-19</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <Link href="/register" className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:scale-105 transition-all">
              Register Now
            </Link>
            <Link href="/admin/login" className="text-gray-600 hover:text-primary-600 px-4 py-2 hover:bg-gray-100 rounded-lg text-sm font-medium transition-all">
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden bg-primary-100 p-2 rounded-lg hover:bg-primary-200 transition-all"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5 text-primary-700" /> : <Menu className="w-5 h-5 text-primary-700" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-2">
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
                <Link
                  href="/admin/login"
                  className="text-gray-600 hover:text-primary-600 text-sm font-medium text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}