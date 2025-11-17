import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { banner } from "@/hooks/use-banner";
import { Lock, Eye, EyeOff } from "lucide-react";
import logoImage from "@/assets/logo-clinlix.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      banner.error("Invalid reset link");
      navigate('/auth/forgot-password');
    }
  }, [token, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || !confirmPassword) {
      banner.error("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      banner.error("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      banner.error("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('verify-reset-token', {
        body: { token, newPassword: password }
      });

      if (error) throw error;

      banner.success("Password updated successfully!");
      navigate('/auth');
    } catch (error: any) {
      banner.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,8%,97%)] to-[hsl(252,15%,98%)]">
      <Card className="w-full max-w-md rounded-[24px] shadow-[0_2px_8px_rgba(108,99,255,0.08)] border-0 animate-fade-in">
        <CardHeader className="space-y-3 pt-8 pb-6 px-6">
          <img src={logoImage} alt="Clinlix Logo" className="mx-auto w-16 h-16 mb-2" />
          <CardTitle className="text-3xl font-bold text-center">Create New Password</CardTitle>
          <CardDescription className="text-center">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10 pr-10 h-12 rounded-[20px] bg-muted/50 border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 touch-target rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm font-medium">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="pl-10 pr-10 h-12 rounded-[20px] bg-muted/50 border-0"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 touch-target rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-[50px] rounded-[30px] bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
