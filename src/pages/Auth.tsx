import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, Tab } from "@heroui/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Shield, ArrowLeft, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import { FaFacebook, FaGoogle, FaApple } from "react-icons/fa";
import logoImage from "@/assets/logo-clinlix.png";
import { useI18n } from "@/contexts/I18nContext";
type Role = "customer" | "provider";
const Auth = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [selectedRole, setSelectedRole] = useState<Role>("customer");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [registerForm, setRegisterForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationErrors((prev) => ({
        ...prev,
        email: "Enter a valid email.",
      }));
      return false;
    }
    setValidationErrors((prev) => ({
      ...prev,
      email: "",
    }));
    return true;
  };
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setValidationErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters.",
      }));
      return false;
    }
    setValidationErrors((prev) => ({
      ...prev,
      password: "",
    }));
    return true;
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error(t.auth.allFieldsRequired);
      return;
    }
    if (!validateEmail(loginForm.email)) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });
      if (error) throw error;
      if (data.user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
        const redirectPath = profile?.role === "provider" ? "/provider/dashboard" : "/customer/dashboard";
        toast.success(t.auth.signInSuccess);
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast.error(error.message || t.auth.signInError);
    } finally {
      setLoading(false);
    }
  };
  const handleSocialLogin = async (provider: "google" | "facebook" | "apple") => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || `Failed to login with ${provider}`);
    } finally {
      setLoading(false);
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password) {
      toast.error(t.auth.allFieldsRequired);
      return;
    }
    if (!validateEmail(registerForm.email)) return;
    if (!validatePassword(registerForm.password)) return;
    if (registerForm.password !== registerForm.confirmPassword) {
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords don't match.",
      }));
      return;
    }
    setValidationErrors((prev) => ({
      ...prev,
      confirmPassword: "",
    }));
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: registerForm.firstName,
            last_name: registerForm.lastName,
            role: selectedRole,
          },
        },
      });
      if (error) throw error;
      if (data.user) {
        toast.success(t.auth.accountCreated);
        const redirectPath = selectedRole === "provider" ? "/provider/dashboard" : "/customer/dashboard";
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };
  const handleForgotPassword = () => {
    navigate("/auth/forgot-password");
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-[hsl(240,8%,97%)] to-[hsl(252,15%,98%)]">
      <Card className="w-full max-w-md rounded-[24px] shadow-[0_2px_8px_rgba(108,99,255,0.08)] border-0 animate-fade-in">
        <CardHeader className="space-y-3 pt-8 pb-6 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="absolute top-6 left-6 rounded-full touch-target"
            aria-label="Go back to home page"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <img src={logoImage} alt="Clinlix Logo" className="mx-auto w-16 h-16 mb-2" />
          <CardTitle className="text-3xl font-bold text-center">Clinlix</CardTitle>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          <Tabs 
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as "login" | "register")}
            classNames={{
              tabList: "w-full bg-muted p-1 rounded-lg mb-6",
              tab: "h-12",
              cursor: "bg-background shadow-sm",
            }}
          >
            <Tab key="login" title={t.auth.signIn} />
            <Tab key="register" title={t.auth.signUp} />
          </Tabs>
          
          {activeTab === 'login' && (
            <div className="space-y-5 mt-6">
              <div className="text-center space-y-2 mb-6">
                <p className="text-sm text-muted-foreground">
                  Enter your email and password to securely access your account and manage your services.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="text-sm font-medium">
                    {t.auth.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="name@example.com"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          email: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="pl-10 h-12 rounded-[20px] bg-muted/50 border-0"
                    />
                  </div>
                  {validationErrors.email && <p className="text-xs text-destructive">{validationErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="text-sm font-medium">
                    {t.auth.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm({
                          ...loginForm,
                          password: e.target.value,
                        })
                      }
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
                  {validationErrors.password && <p className="text-xs text-destructive">{validationErrors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {t.common.yes}
                    </label>
                  </div>
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleForgotPassword}
                    className="h-auto p-0 text-sm font-medium"
                  >
                    {t.auth.forgotPassword}
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full h-[50px] rounded-[30px] bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? t.common.loading : t.auth.signIn}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">{t.auth.dontHaveAccount} </span>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("register")}
                  className="h-auto p-0 font-semibold text-sm"
                >
                  {t.auth.signUp}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t.auth.or}</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                className="w-full h-12 rounded-[20px] bg-white hover:bg-white/90 border border-border shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                aria-label="Sign in with Google"
              >
                <FaGoogle className="w-5 h-5 text-[#DB4437]" />
                <span className="font-medium text-foreground">{t.auth.continueWithGoogle}</span>
              </Button>
            </div>
          )}

          {activeTab === 'register' && (
            <div className="space-y-5 mt-6">
              <div className="text-center space-y-2 mb-6">
                <p className="text-sm text-muted-foreground">Sign up to book or manage cleaning services easily.</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4" role="group" aria-label="Select account type">
                <Button
                  type="button"
                  variant={selectedRole === "customer" ? "default" : "outline"}
                  onClick={() => setSelectedRole("customer")}
                  className="h-20 flex flex-col items-center justify-center gap-1 rounded-[16px] transition-all hover:scale-105"
                  aria-pressed={selectedRole === "customer"}
                  aria-label="Sign up as a customer"
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Customer</span>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "provider" ? "default" : "outline"}
                  onClick={() => setSelectedRole("provider")}
                  className="h-20 flex flex-col items-center justify-center gap-1 rounded-[16px] transition-all hover:scale-105"
                  aria-pressed={selectedRole === "provider"}
                  aria-label="Sign up as a service provider"
                >
                  <Shield className="w-5 h-5" />
                  <span className="font-medium">Provider</span>
                </Button>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="first-name" className="text-sm font-medium">
                      {t.auth.firstName}
                    </Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      value={registerForm.firstName}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          firstName: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="h-12 rounded-[20px] bg-muted/50 border-0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name" className="text-sm font-medium">
                      {t.auth.lastName}
                    </Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      value={registerForm.lastName}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          lastName: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="h-12 rounded-[20px] bg-muted/50 border-0"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email" className="text-sm font-medium">
                    {t.auth.email}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="name@example.com"
                      value={registerForm.email}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          email: e.target.value,
                        })
                      }
                      disabled={loading}
                      className="pl-10 h-12 rounded-[20px] bg-muted/50 border-0"
                    />
                  </div>
                  {validationErrors.email && <p className="text-xs text-destructive">{validationErrors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password" className="text-sm font-medium">
                    {t.auth.password}
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={registerForm.password}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          password: e.target.value,
                        })
                      }
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
                  {validationErrors.password && <p className="text-xs text-destructive">{validationErrors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={registerForm.confirmPassword}
                      onChange={(e) =>
                        setRegisterForm({
                          ...registerForm,
                          confirmPassword: e.target.value,
                        })
                      }
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
                  {validationErrors.confirmPassword && (
                    <p className="text-xs text-destructive">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-[50px] rounded-[30px] bg-gradient-to-r from-primary to-accent text-base font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </form>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <Button
                  variant="link"
                  onClick={() => setActiveTab("login")}
                  className="h-auto p-0 font-semibold text-sm"
                >
                  Log in
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or Continue With</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                className="w-full h-12 rounded-[20px] bg-white hover:bg-white/90 border border-border shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-3"
                aria-label="Sign in with Google"
              >
                <FaGoogle className="w-5 h-5 text-[#DB4437]" />
                <span className="font-medium text-foreground">Continue with Google</span>
              </Button>
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
};
export default Auth;
