import { Button } from "@/components/ui/button"

interface Contact {
  id: string
  name: string
  avatar: string
  status: "online" | "offline"
  lastPayment?: string
}

export default function ContactCard({ contact }: { contact: Contact }) {
  return (
    <div className="p-4 rounded-2xl bg-muted hover:bg-muted/80 transition space-y-3">
      <div className="flex items-center gap-3">
        <div className="relative">
          <span className="text-4xl">{contact.avatar}</span>
          {contact.status === "online" && (
            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-wechat-green border-2 border-background" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{contact.name}</h3>
          <p className="text-xs text-muted-foreground">{contact.status === "online" ? "Active now" : "Offline"}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs bg-transparent">
          📞 Call
        </Button>
        <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs bg-transparent">
          💳 Pay
        </Button>
      </div>
    </div>
  )
}
