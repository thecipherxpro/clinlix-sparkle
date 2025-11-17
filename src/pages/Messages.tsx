import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ChatDrawer } from "@/components/chat/ChatDrawer";
import { useI18n } from "@/contexts/I18nContext";

interface Conversation {
  bookingId: string;
  otherPartyId: string;
  otherPartyName: string;
  otherPartyAvatar?: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  bookingStatus: string;
}

const Messages = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChat, setSelectedChat] = useState<{
    bookingId: string;
    name: string;
    avatar?: string;
  } | null>(null);
  const [userRole, setUserRole] = useState<string>("");

  useEffect(() => {
    fetchConversations();
    setupRealtimeSubscription();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setUserRole(profile?.role || "");

      // Fetch bookings with messages
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          customer_id,
          provider_id,
          profiles!bookings_customer_id_fkey(first_name, last_name, avatar_url),
          provider_profiles(full_name, photo_url)
        `)
        .or(`customer_id.eq.${user.id},provider_id.in.(select id from provider_profiles where user_id.eq.${user.id})`)
        .not("provider_id", "is", null)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      // Fetch messages for each booking
      const conversationsData = await Promise.all(
        (bookings || []).map(async (booking: any) => {
          const { data: messages } = await supabase
            .from("messages")
            .select("*")
            .eq("booking_id", booking.id)
            .order("created_at", { ascending: false })
            .limit(1);

          const { count: unreadCount } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("booking_id", booking.id)
            .eq("read_status", false)
            .neq("sender_id", user.id);

          const isCustomer = booking.customer_id === user.id;
          const otherParty = isCustomer
            ? booking.provider_profiles
            : booking.profiles;

          return {
            bookingId: booking.id,
            otherPartyId: isCustomer ? booking.provider_id : booking.customer_id,
            otherPartyName: isCustomer
              ? otherParty?.full_name
              : `${otherParty?.first_name} ${otherParty?.last_name}`,
            otherPartyAvatar: isCustomer
              ? otherParty?.photo_url
              : otherParty?.avatar_url,
            lastMessage: messages?.[0]?.content,
            lastMessageTime: messages?.[0]?.created_at,
            unreadCount: unreadCount || 0,
            bookingStatus: booking.status,
          };
        })
      );

      setConversations(conversationsData);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel("messages-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return (
    <div className="min-h-screen bg-background pb-mobile-nav">
      <div className="mobile-container pt-6">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <p className="text-sm text-muted-foreground">
              {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex gap-3">
                  <div className="h-12 w-12 rounded-full bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-3 bg-muted rounded w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <Card className="p-8 text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Messages from your bookings will appear here
            </p>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <Card
                  key={conv.bookingId}
                  className="p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() =>
                    setSelectedChat({
                      bookingId: conv.bookingId,
                      name: conv.otherPartyName,
                      avatar: conv.otherPartyAvatar,
                    })
                  }
                >
                  <div className="flex gap-3">
                    <Avatar
                      src={conv.otherPartyAvatar}
                      alt={conv.otherPartyName}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {conv.otherPartyName}
                        </h3>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default" className="ml-auto shrink-0">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {conv.lastMessage || "No messages yet"}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {conv.bookingStatus}
                        </Badge>
                        {conv.lastMessageTime && (
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(conv.lastMessageTime), "MMM d, h:mm a")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>

      {selectedChat && (
        <ChatDrawer
          open={!!selectedChat}
          onClose={() => setSelectedChat(null)}
          bookingId={selectedChat.bookingId}
          otherPartyName={selectedChat.name}
          otherPartyAvatar={selectedChat.avatar}
        />
      )}
    </div>
  );
};

export default Messages;
