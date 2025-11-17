import { useEffect, useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, X } from "lucide-react";
import { banner } from "@/hooks/use-banner";
import { format } from "date-fns";
import { Avatar } from "@/components/base/avatar/avatar";

interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  read_status: boolean;
  created_at: string;
}

interface ChatDrawerProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
  otherPartyName: string;
  otherPartyAvatar?: string;
}

export const ChatDrawer = ({ open, onClose, bookingId, otherPartyName, otherPartyAvatar }: ChatDrawerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      fetchMessages();
      setupRealtimeSubscription();
      getCurrentUser();
    }
  }, [open, bookingId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) setCurrentUserId(user.id);
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("booking_id", bookingId)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      const unreadMessages = data?.filter(m => m.sender_id !== currentUserId && !m.read_status) || [];
      if (unreadMessages.length > 0) {
        await supabase
          .from("messages")
          .update({ read_status: true })
          .in("id", unreadMessages.map(m => m.id));
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      banner.error("Failed to load messages");
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel(`messages:${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          
          // Show toast notification if message is from other party
          if (newMsg.sender_id !== currentUserId && currentUserId) {
            banner.info(`💬 New message from ${otherPartyName}`);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("messages").insert({
        booking_id: bookingId,
        sender_id: user.id,
        content: newMessage.trim(),
      });

      if (error) throw error;
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      banner.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar
                src={otherPartyAvatar}
                alt={otherPartyName}
                fallback={otherPartyName.charAt(0)}
                size="sm"
              />
              <SheetTitle className="text-base">{otherPartyName}</SheetTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea ref={scrollRef} className="flex-1 px-4 py-4">
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <span className={`text-xs mt-1 block ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      {format(new Date(message.created_at), "HH:mm")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1"
              disabled={loading}
            />
            <Button
              onClick={sendMessage}
              disabled={loading || !newMessage.trim()}
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
