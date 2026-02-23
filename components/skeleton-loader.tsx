"use client"

export function ChatBubbleSkeleton() {
  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      </div>
    </div>
  )
}

export function MessageListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <ChatBubbleSkeleton key={i} />
      ))}
    </div>
  )
}

export function TransactionSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-xl animate-pulse">
      <div className="w-10 h-10 rounded-full bg-muted-foreground/20" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
        <div className="h-3 bg-muted-foreground/20 rounded w-1/2" />
      </div>
      <div className="h-4 bg-muted-foreground/20 rounded w-16" />
    </div>
  )
}

export function WalletSkeleton() {
  return (
    <div className="space-y-4 p-4">
      <div className="h-40 bg-muted rounded-3xl animate-pulse" />
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-2xl animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <TransactionSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
