import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Settings, LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SettingsDrawerProps {
  role: 'customer' | 'provider';
}

const SettingsDrawer = ({ role }: SettingsDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  const handleSettings = () => {
    setIsOpen(false);
    navigate(role === 'customer' ? '/customer/settings' : '/provider/settings');
  };

  return (
    <>
      {/* Settings Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="touch-target"
      >
        <Settings className="w-5 h-5" />
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-card rounded-t-3xl shadow-2xl z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '50vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8 pt-2 space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="touch-target"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Settings Button */}
          <Button
            onClick={handleSettings}
            className="w-full h-12 text-base bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
          >
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </Button>

          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full h-12 text-base border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default SettingsDrawer;
