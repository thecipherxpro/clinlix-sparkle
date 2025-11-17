import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Shield, ArrowLeft, Mail, Lock, Eye, EyeOff, User, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import logoImage from "@/assets/logo-clinlix.png";
import { useI18n } from "@/contexts/I18nContext";

type Role = "customer" | "provider";
type AuthMode = "signin" | "signup";
type SignupStep = 1 | 2 | 3;

const Auth = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
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

  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationErrors((prev) => ({ ...prev, email: "Enter a valid email." }));
      return false;
    }
    setValidationErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setValidationErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters." }));
      return false;
    }
    setValidationErrors((prev) => ({ ...prev, password: "" }));
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
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.user.id)
          .single();

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

  const handleSocialLogin = async (provider: "google") => {
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
      toast.error(error.message || "Social login failed");
      setLoading(false);
    }
  };

  const handleSignupStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!validateEmail(registerForm.email)) return;
    if (!validatePassword(registerForm.password)) return;

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    setSignupStep(2);
  };

  const handleSignupStep2 = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerForm.gender || !registerForm.dateOfBirth) {
      toast.error("Please select gender and date of birth");
      return;
    }

    // Validate age (18+)
    const dob = new Date(registerForm.dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    if (age < 18) {
      toast.error("You must be at least 18 years old");
      return;
    }

    setSignupStep(3);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerForm.residential_street || !registerForm.residential_city || !registerForm.residential_province || !registerForm.residential_postal_code) {
      toast.error("Please fill in all address fields");
      return;
    }

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
      if (error.message.includes("already registered")) {
        toast.error("This email is already registered. Please sign in instead.");
      } else {
        toast.error(error.message || t.auth.signInError);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderProgressIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
              signupStep > step
                ? "bg-primary text-primary-foreground"
                : signupStep === step
                ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {signupStep > step ? <Check className="w-4 h-4" /> : step}
          </div>
          {step < 3 && (
            <div
              className={`w-12 h-1 mx-1 rounded ${
                signupStep > step ? "bg-primary" : "bg-muted"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );

  // Sign In View
  if (authMode === "signin") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
        <Card className="w-full max-w-md rounded-3xl shadow-lg border-0">
          <CardHeader className="space-y-3 pt-8 pb-6 px-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
              className="absolute top-6 left-6 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <img src={logoImage} alt="Clinlix Logo" className="mx-auto w-16 h-16 mb-2" />
            <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center">
              Sign in to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="name@example.com"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    disabled={loading}
                    className="pl-10 h-12 rounded-2xl"
                  />
                </div>
                {validationErrors.email && (
                  <p className="text-xs text-destructive">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    disabled={loading}
                    className="pl-10 pr-10 h-12 rounded-2xl"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm cursor-pointer">
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => navigate("/auth/forgot-password")}
                  className="h-auto p-0 text-sm"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 rounded-2xl"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="text-center text-sm mt-4">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button
                variant="link"
                onClick={() => {
                  setAuthMode("signup");
                  setSignupStep(1);
                }}
                className="h-auto p-0 font-semibold"
              >
                Sign Up
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              variant="outline"
              className="w-full h-12 rounded-2xl"
            >
              <FaGoogle className="w-5 h-5 mr-2 text-[#DB4437]" />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Sign Up View
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <Card className="w-full max-w-md rounded-3xl shadow-lg border-0">
        <CardHeader className="space-y-3 pt-8 pb-6 px-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (signupStep === 1) {
                setAuthMode("signin");
              } else {
                setSignupStep((prev) => (prev - 1) as SignupStep);
              }
            }}
            className="absolute top-6 left-6 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <img src={logoImage} alt="Clinlix Logo" className="mx-auto w-16 h-16 mb-2" />
          <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            {signupStep === 1 && "Let's get started with your account"}
            {signupStep === 2 && "Tell us about yourself"}
            {signupStep === 3 && "Where do you live?"}
          </CardDescription>
        </CardHeader>

        <CardContent className="px-6 pb-8">
          {renderProgressIndicator()}

          {signupStep === 1 && (
            <>
              <div className="mb-6">
                <Label className="text-sm font-medium mb-3 block">I want to...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant={selectedRole === "customer" ? "default" : "outline"}
                    onClick={() => setSelectedRole("customer")}
                    className="h-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Book Services</span>
                  </Button>
                  <Button
                    type="button"
                    variant={selectedRole === "provider" ? "default" : "outline"}
                    onClick={() => setSelectedRole("provider")}
                    className="h-20 flex flex-col items-center justify-center gap-2 rounded-2xl"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">Provide Services</span>
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSignupStep1} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name *</Label>
                    <Input
                      id="first-name"
                      placeholder="John"
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      disabled={loading}
                      className="h-12 rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name *</Label>
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                      disabled={loading}
                      className="h-12 rounded-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    disabled={loading}
                    className="h-12 rounded-2xl"
                  />
                  {validationErrors.email && (
                    <p className="text-xs text-destructive">{validationErrors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 characters"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      disabled={loading}
                      className="pr-10 h-12 rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-xs text-destructive">{validationErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                      disabled={loading}
                      className="pr-10 h-12 rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-2xl" disabled={loading}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </form>
            </>
          )}

          {signupStep === 2 && (
            <form onSubmit={handleSignupStep2} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select
                  value={registerForm.gender}
                  onValueChange={(value) => setRegisterForm({ ...registerForm, gender: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="gender" className="h-12 rounded-2xl">
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
                <Label htmlFor="date-of-birth">Date of Birth * (18+ only)</Label>
                <Input
                  id="date-of-birth"
                  type="date"
                  value={registerForm.dateOfBirth}
                  onChange={(e) => setRegisterForm({ ...registerForm, dateOfBirth: e.target.value })}
                  max={new Date(new Date().setFullYear(new Date().getFullYear() - 18))
                    .toISOString()
                    .split("T")[0]}
                  disabled={loading}
                  className="h-12 rounded-2xl"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSignupStep(1)}
                  className="w-full h-12 rounded-2xl"
                  disabled={loading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="w-full h-12 rounded-2xl" disabled={loading}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>
          )}

          {signupStep === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                This address is for security purposes only and separate from service addresses.
              </p>

              <div className="space-y-2">
                <Label htmlFor="street">Street Address *</Label>
                <Input
                  id="street"
                  placeholder="123 Main Street"
                  value={registerForm.residential_street}
                  onChange={(e) => setRegisterForm({ ...registerForm, residential_street: e.target.value })}
                  disabled={loading}
                  className="h-12 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apt">Apartment/Unit (Optional)</Label>
                <Input
                  id="apt"
                  placeholder="Apt 4B"
                  value={registerForm.residential_apt_unit}
                  onChange={(e) => setRegisterForm({ ...registerForm, residential_apt_unit: e.target.value })}
                  disabled={loading}
                  className="h-12 rounded-2xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    placeholder="Lisbon"
                    value={registerForm.residential_city}
                    onChange={(e) => setRegisterForm({ ...registerForm, residential_city: e.target.value })}
                    disabled={loading}
                    className="h-12 rounded-2xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal">Postal Code *</Label>
                  <Input
                    id="postal"
                    placeholder="1000-001"
                    value={registerForm.residential_postal_code}
                    onChange={(e) => setRegisterForm({ ...registerForm, residential_postal_code: e.target.value })}
                    disabled={loading}
                    className="h-12 rounded-2xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="province">Province/State *</Label>
                <Input
                  id="province"
                  placeholder="Lisboa"
                  value={registerForm.residential_province}
                  onChange={(e) => setRegisterForm({ ...registerForm, residential_province: e.target.value })}
                  disabled={loading}
                  className="h-12 rounded-2xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select
                  value={registerForm.residential_country}
                  onValueChange={(value) => setRegisterForm({ ...registerForm, residential_country: value })}
                  disabled={loading}
                >
                  <SelectTrigger id="country" className="h-12 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Spain">Spain</SelectItem>
                    <SelectItem value="France">France</SelectItem>
                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                    <SelectItem value="United States">United States</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSignupStep(2)}
                  className="w-full h-12 rounded-2xl"
                  disabled={loading}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button type="submit" className="w-full h-12 rounded-2xl" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </div>
            </form>
          )}

          <div className="text-center text-sm mt-4">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button
              variant="link"
              onClick={() => setAuthMode("signin")}
              className="h-auto p-0 font-semibold"
            >
              Sign In
            </Button>
          </div>

          {signupStep === 1 && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button
                type="button"
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                variant="outline"
                className="w-full h-12 rounded-2xl"
              >
                <FaGoogle className="w-5 h-5 mr-2 text-[#DB4437]" />
                Continue with Google
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
