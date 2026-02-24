import React from 'react'
import { Transaction } from '@/types/database'
import { formatCurrency } from '@/lib/utils/format'
import { StatusBadge } from './status-badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface TransactionListProps {
  transactions: Transaction[]
  loading?: boolean
  onRowClick?: (transaction: Transaction) => void
}

export function TransactionList({ transactions, loading, onRowClick }: TransactionListProps) {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#006a4e] animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading transactions...</p>
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="p-12 text-center">
        <p className="text-gray-600 mb-2">No transactions found</p>
        <p className="text-sm text-gray-500">Your transactions will appear here</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="text-[#006a4e] font-semibold">ID</TableHead>
            <TableHead className="text-[#006a4e] font-semibold">Date</TableHead>
            <TableHead className="text-[#006a4e] font-semibold text-right">Amount</TableHead>
            <TableHead className="text-[#006a4e] font-semibold">Type</TableHead>
            <TableHead className="text-[#006a4e] font-semibold">Status</TableHead>
            <TableHead className="text-[#006a4e] font-semibold">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx) => (
            <TableRow
              key={tx.id}
              className="hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onRowClick?.(tx)}
            >
              <TableCell className="font-mono text-sm text-gray-700">{tx.id.slice(0, 8)}...</TableCell>
              <TableCell className="text-sm text-gray-600">
                {new Date(tx.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right font-semibold text-gray-800">
                {formatCurrency(tx.amount)}
              </TableCell>
              <TableCell className="text-sm capitalize text-gray-700">{tx.transaction_type}</TableCell>
              <TableCell>
                <StatusBadge status={tx.status} size="sm" />
              </TableCell>
              <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                {tx.description || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
