import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    gender: "",
    dateOfBirth: "",
    residential_street: "",
    residential_apt_unit: "",
    residential_city: "",
    residential_province: "",
    residential_postal_code: "",
    residential_country: "Portugal",
  });
  
  const [signupStep, setSignupStep] = useState<1 | 2>(1);
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

    // Step 1: Basic Info + Password
    if (signupStep === 1) {
      if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
        toast.error(t.auth.allFieldsRequired);
        return;
      }

      if (!validateEmail(registerForm.email)) return;
      if (!validatePassword(registerForm.password)) return;

      if (registerForm.password !== registerForm.confirmPassword) {
        setValidationErrors((prev) => ({
          ...prev,
          confirmPassword: t.auth.passwordMismatch,
        }));
        return;
      }

      setSignupStep(2);
      return;
    }

    // Step 2: Demographics + Residential Address
    if (!registerForm.gender || !registerForm.dateOfBirth || 
        !registerForm.residential_street || !registerForm.residential_city || 
        !registerForm.residential_province || !registerForm.residential_postal_code) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate age (must be 18+)
    const dob = new Date(registerForm.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      toast.error("You must be at least 18 years old to register");
      return;
    }

    setLoading(true);

    try {
      const redirectUrl = `${window.location.origin}/`;
      const { data, error } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            first_name: registerForm.firstName,
            last_name: registerForm.lastName,
            role: selectedRole,
            gender: registerForm.gender,
            date_of_birth: registerForm.dateOfBirth,
            residential_street: registerForm.residential_street,
            residential_apt_unit: registerForm.residential_apt_unit,
            residential_city: registerForm.residential_city,
            residential_province: registerForm.residential_province,
            residential_postal_code: registerForm.residential_postal_code,
            residential_country: registerForm.residential_country,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.from("profiles").update({
            gender: registerForm.gender as "male" | "female" | "other" | "prefer_not_to_say",
          date_of_birth: registerForm.dateOfBirth,
          residential_street: registerForm.residential_street,
          residential_apt_unit: registerForm.residential_apt_unit,
          residential_city: registerForm.residential_city,
          residential_province: registerForm.residential_province,
          residential_postal_code: registerForm.residential_postal_code,
          residential_country: registerForm.residential_country,
        }).eq("id", data.user.id);

        toast.success(t.auth.signInSuccess);
        const redirectPath = selectedRole === "provider" ? "/provider/dashboard" : "/customer/dashboard";
        navigate(redirectPath);
      }
    } catch (error: any) {
      if (error.message.includes("already registered") || error.message.includes("User already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || t.auth.signInError);
      }
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
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "login" | "register")} className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="login">{t.auth.signIn}</TabsTrigger>
              <TabsTrigger value="register">{t.auth.signUp}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-5 mt-6">
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
            </TabsContent>

            <TabsContent value="register" className="space-y-5 mt-6">
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
                {signupStep === 1 ? (
                  <>
                    {/* Step 1: Basic Info + Password */}
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
                          {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                      {validationErrors.password && <p className="text-xs text-destructive">{validationErrors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password" className="text-sm font-medium">
                        {t.auth.confirmPassword}
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
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
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                        </button>
                      </div>
                      {validationErrors.confirmPassword && <p className="text-xs text-destructive">{validationErrors.confirmPassword}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 2: Demographics + Residential Address */}
                    <div className="space-y-2">
                      <Label htmlFor="gender" className="text-sm font-medium">
                        Gender *
                      </Label>
                      <Select
                        value={registerForm.gender}
                        onValueChange={(value) => setRegisterForm({ ...registerForm, gender: value })}
                      >
                        <SelectTrigger id="gender" className="h-12 rounded-[20px] bg-muted/50 border-0">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date-of-birth" className="text-sm font-medium">
                        Date of Birth * (Must be 18+)
                      </Label>
                      <Input
                        id="date-of-birth"
                        type="date"
                        value={registerForm.dateOfBirth}
                        onChange={(e) => setRegisterForm({ ...registerForm, dateOfBirth: e.target.value })}
                        max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                        disabled={loading}
                        className="h-12 rounded-[20px] bg-muted/50 border-0"
                      />
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium mb-3">Residential Address (for security purposes)</p>
                      
                      <div className="space-y-3">
                        <Input
                          placeholder="Street Address *"
                          value={registerForm.residential_street}
                          onChange={(e) => setRegisterForm({ ...registerForm, residential_street: e.target.value })}
                          disabled={loading}
                          className="h-12 rounded-[20px] bg-muted/50 border-0"
                        />

                        <Input
                          placeholder="Apartment/Unit (Optional)"
                          value={registerForm.residential_apt_unit}
                          onChange={(e) => setRegisterForm({ ...registerForm, residential_apt_unit: e.target.value })}
                          disabled={loading}
                          className="h-12 rounded-[20px] bg-muted/50 border-0"
                        />

                        <div className="grid grid-cols-2 gap-3">
                          <Input
                            placeholder="City *"
                            value={registerForm.residential_city}
                            onChange={(e) => setRegisterForm({ ...registerForm, residential_city: e.target.value })}
                            disabled={loading}
                            className="h-12 rounded-[20px] bg-muted/50 border-0"
                          />
                          <Input
                            placeholder="Postal Code *"
                            value={registerForm.residential_postal_code}
                            onChange={(e) => setRegisterForm({ ...registerForm, residential_postal_code: e.target.value })}
                            disabled={loading}
                            className="h-12 rounded-[20px] bg-muted/50 border-0"
                          />
                        </div>

                        <Input
                          placeholder="Province/State *"
                          value={registerForm.residential_province}
                          onChange={(e) => setRegisterForm({ ...registerForm, residential_province: e.target.value })}
                          disabled={loading}
                          className="h-12 rounded-[20px] bg-muted/50 border-0"
                        />

                        <Select
                          value={registerForm.residential_country}
                          onValueChange={(value) => setRegisterForm({ ...registerForm, residential_country: value })}
                        >
                          <SelectTrigger className="h-12 rounded-[20px] bg-muted/50 border-0">
                            <SelectValue placeholder="Country *" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Portugal">Portugal</SelectItem>
                            <SelectItem value="Spain">Spain</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United States">United States</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setSignupStep(1)}
                        className="flex-1 h-12 rounded-[20px]"
                        disabled={loading}
                      >
                        Back
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 rounded-[20px]"
                        disabled={loading}
                      >
                        {loading ? t.common.loading : "Create Account"}
                      </Button>
                    </div>
                  </>
                )}

                {signupStep === 1 && (
                  <Button
                    type="submit"
                    className="w-full h-12 rounded-[20px]"
                    disabled={loading}
                  >
                    {loading ? t.common.loading : "Continue"}
                  </Button>
                )}

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">{t.auth.alreadyHaveAccount} </span>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setActiveTab("login")}
                    className="h-auto p-0 font-semibold text-sm"
                  >
                    {t.auth.signIn}
                  </Button>
                </div>
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
export default Auth;
