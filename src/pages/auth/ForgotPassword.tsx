import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Mail } from "lucide-react";
import logoImage from "@/assets/logo-clinlix.png";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;

      setEmailSent(true);
      toast.success("Password reset email sent! Check your inbox.");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,8%,97%)] to-[hsl(252,15%,98%)]">
      <Card className="w-full max-w-md rounded-[24px] shadow-[0_2px_8px_rgba(108,99,255,0.08)] border-0 animate-fade-in">
        <CardHeader className="space-y-3 pt-8 pb-6 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/auth')}
            className="absolute top-6 left-6 rounded-full touch-target"
            aria-label="Go back to login"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <img src={logoImage} alt="Clinlix Logo" className="mx-auto w-16 h-16 mb-2" />
          <CardTitle className="text-3xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {emailSent 
              ? "We've sent you a password reset link"
              : "Enter your email to receive a password reset link"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-6 pb-8">
          {emailSent ? (
            <div className="space-y-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
              </div>
              <Button
                onClick={() => navigate('/auth')}
                className="w-full h-[50px] rounded-[30px] bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="pl-10 h-12 rounded-[20px] bg-muted/50 border-0"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-[50px] rounded-[30px] bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Remember your password? </span>
                <Button
                  variant="link"
                  onClick={() => navigate('/auth')}
                  className="h-auto p-0 font-semibold text-sm"
                >
                  Back to Login
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPassword;
