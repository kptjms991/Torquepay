'use client'

import { Menu, Bell, Settings } from 'lucide-react'
import { useState } from 'react'

export function AppHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#006a4e] to-[#004a37]">
              <span className="text-lg font-bold text-white">T</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-neutral-900">TorquePay</h1>
              <p className="text-xs text-neutral-500">Bangladesh</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e]">
              Remit
            </a>
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e]">
              Pay
            </a>
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e]">
              Education
            </a>
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e]">
              Security
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 hover:bg-neutral-100">
              <Bell className="h-5 w-5 text-neutral-600" />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#f42a41]"></span>
            </button>
            <button className="rounded-lg p-2 hover:bg-neutral-100">
              <Settings className="h-5 w-5 text-neutral-600" />
            </button>
            <button
              className="md:hidden rounded-lg p-2 hover:bg-neutral-100"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5 text-neutral-600" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4 md:hidden">
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e] py-2">
              Remit
            </a>
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e] py-2">
              Pay
            </a>
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e] py-2">
              Education
            </a>
            <a href="#" className="text-sm font-medium text-neutral-600 hover:text-[#006a4e] py-2">
              Security
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
