import React from 'react'

type StatusType = 'completed' | 'pending' | 'failed' | 'cancelled' | 'open' | 'investigating' | 'resolved' | 'closed' | 'verified' | 'rejected'

interface StatusBadgeProps {
  status: StatusType
  size?: 'sm' | 'md' | 'lg'
}

const statusConfig = {
  completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completed' },
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' },
  failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
  cancelled: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Cancelled' },
  open: { bg: 'bg-red-100', text: 'text-red-700', label: 'Open' },
  investigating: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Investigating' },
  resolved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Resolved' },
  closed: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Closed' },
  verified: { bg: 'bg-green-100', text: 'text-green-700', label: 'Verified' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status]
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-xs' : size === 'lg' ? 'px-3 py-2 text-base' : 'px-2 py-1 text-sm'

  return (
    <span className={`${config.bg} ${config.text} ${sizeClass} font-medium rounded inline-block`}>
      {config.label}
    </span>
  )
}
