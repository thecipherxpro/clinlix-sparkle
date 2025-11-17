import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { UntitledInput } from "@/components/ui/untitled-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Shield, ArrowLeft, Mail, Lock, User, ChevronRight, ChevronLeft, Check, UserCircle, Calendar, MapPin, Home, Building, Map, Globe } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import logoImage from "@/assets/logo-clinlix.png";
import { useI18n } from "@/contexts/I18nContext";
type Role = "customer" | "provider";
type AuthMode = "signin" | "signup" | "roleselect";
type SignupStep = 1 | 2 | 3;
const Auth = () => {
  const navigate = useNavigate();
  const {
    t
  } = useI18n();
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [signupStep, setSignupStep] = useState<SignupStep>(1);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
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
    residential_country: ""
  });
  const [validationErrors, setValidationErrors] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationErrors(prev => ({
        ...prev,
        email: "Enter a valid email."
      }));
      return false;
    }
    setValidationErrors(prev => ({
      ...prev,
      email: ""
    }));
    return true;
  };
  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setValidationErrors(prev => ({
        ...prev,
        password: "Password must be at least 8 characters."
      }));
      return false;
    }
    setValidationErrors(prev => ({
      ...prev,
      password: ""
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
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      });
      if (error) throw error;
      if (data.user) {
        const {
          data: profile
        } = await supabase.from("profiles").select("role").eq("id", data.user.id).single();
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
      const {
        error
      } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || t.auth.signInError);
    } finally {
      setLoading(false);
    }
  };
  const handleNextStep = () => {
    if (signupStep === 1) {
      if (!registerForm.firstName || !registerForm.lastName || !registerForm.email || !registerForm.password || !registerForm.confirmPassword) {
        toast.error(t.auth.allFieldsRequired);
        return;
      }
      if (!validateEmail(registerForm.email)) return;
      if (!validatePassword(registerForm.password)) return;
      if (registerForm.password !== registerForm.confirmPassword) {
        setValidationErrors(prev => ({
          ...prev,
          confirmPassword: "Passwords do not match."
        }));
        return;
      }
      setSignupStep(2);
    } else if (signupStep === 2) {
      if (!registerForm.gender || !registerForm.dateOfBirth) {
        toast.error(t.auth.allFieldsRequired);
        return;
      }
      const birthDate = new Date(registerForm.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
      if (age < 18) {
        toast.error("You must be at least 18 years old to register.");
        return;
      }
      setSignupStep(3);
    }
  };
  const handlePreviousStep = () => {
    if (signupStep > 1) {
      setSignupStep(signupStep - 1 as SignupStep);
    }
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.residential_country) {
      toast.error("Please select a country");
      return;
    }
    if (!registerForm.residential_street || !registerForm.residential_city || !registerForm.residential_province || !registerForm.residential_postal_code) {
      toast.error(t.auth.allFieldsRequired);
      return;
    }
    setLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      const {
        data,
        error
      } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      if (error) throw error;
      if (data.user) {
        const {
          error: profileError
        } = await supabase.from("profiles").update({
          first_name: registerForm.firstName,
          last_name: registerForm.lastName,
          gender: registerForm.gender as "male" | "female" | "other" | "prefer_not_to_say",
          date_of_birth: registerForm.dateOfBirth,
          residential_street: registerForm.residential_street,
          residential_apt_unit: registerForm.residential_apt_unit || null,
          residential_city: registerForm.residential_city,
          residential_province: registerForm.residential_province,
          residential_postal_code: registerForm.residential_postal_code,
          residential_country: registerForm.residential_country as "Portugal" | "Canada"
        }).eq("id", data.user.id);
        if (profileError) throw profileError;
        const {
          error: roleError
        } = await supabase.from("user_roles").insert({
          user_id: data.user.id,
          role: selectedRole!
        });
        if (roleError) throw roleError;
        toast.success("Account created successfully!");
        const redirectPath = selectedRole === "provider" ? "/provider/dashboard" : "/customer/dashboard";
        navigate(redirectPath);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };
  const portugueseDistricts = ["Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra", "Évora", "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre", "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu", "Açores", "Madeira"];
  const canadianProvinces = ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Northwest Territories", "Nova Scotia", "Nunavut", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan", "Yukon"];
  const renderRoleSelection = () => <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <button onClick={() => {
        setSelectedRole("customer");
        setAuthMode("signup");
        setSignupStep(1);
      }} className="group relative p-6 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1">I'm a Customer</h3>
              <p className="text-sm text-muted-foreground">
                Book cleaning services for your home or business
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
        </button>

        <button onClick={() => {
        setSelectedRole("provider");
        setAuthMode("signup");
        setSignupStep(1);
      }} className="group relative p-6 rounded-lg border-2 border-border bg-card hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold mb-1">I'm a Provider</h3>
              <p className="text-sm text-muted-foreground">
                Offer your cleaning services to customers
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
          </div>
        </button>
      </div>

      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <button onClick={() => setAuthMode("signin")} className="text-primary hover:underline font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>;
  const renderSignInForm = () => <form onSubmit={handleLogin} className="space-y-4">
      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">
            {t.auth.email}
          </Label>
          <UntitledInput id="email" type="email" icon={Mail} placeholder="Enter your email" value={loginForm.email} onChange={e => setLoginForm({
          ...loginForm,
          email: e.target.value
        })} error={!!validationErrors.email} size="md" />
          {validationErrors.email && <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-sm font-medium">
            {t.auth.password}
          </Label>
          <UntitledInput id="password" type="password" icon={Lock} placeholder="Enter your password" value={loginForm.password} onChange={e => setLoginForm({
          ...loginForm,
          password: e.target.value
        })} size="md" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" checked={rememberMe} onCheckedChange={checked => setRememberMe(checked as boolean)} />
          <label htmlFor="remember" className="leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 px-0 mx-[8px] text-sm font-semibold font-sans">
            Remember me
          </label>
        </div>
        <button type="button" className="text-sm text-primary hover:underline">
          {t.auth.forgotPassword}
        </button>
      </div>

      <Button type="submit" className="w-full h-11 rounded-lg" disabled={loading}>
        {loading ? "Signing in..." : t.auth.signIn}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <Button type="button" variant="outline" className="w-full h-11 rounded-lg" onClick={() => handleSocialLogin("google")} disabled={loading}>
        <FaGoogle className="mr-2 h-4 w-4" />
        Google
      </Button>

      <div className="text-center pt-2">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button onClick={() => setAuthMode("roleselect")} className="text-primary hover:underline font-medium">
            {t.auth.signUp}
          </button>
        </p>
      </div>
    </form>;
  const renderSignUpWizard = () => {
    const progress = signupStep / 3 * 100;
    return <div className="space-y-4">
        {/* Progress indicator */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Step {signupStep} of 3</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-300 ease-out" style={{
            width: `${progress}%`
          }} />
          </div>
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg">
          {selectedRole === "customer" ? <User className="w-4 h-4 text-primary" /> : <Shield className="w-4 h-4 text-primary" />}
          <span className="text-sm font-medium">
            Signing up as {selectedRole === "customer" ? "Customer" : "Provider"}
          </span>
          <button onClick={() => {
          setAuthMode("roleselect");
          setSelectedRole(null);
          setSignupStep(1);
        }} className="ml-auto text-xs text-primary hover:underline">
            Change
          </button>
        </div>

        <form onSubmit={signupStep === 3 ? handleRegister : e => e.preventDefault()} className="space-y-4">
          {signupStep === 1 && <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <UntitledInput id="firstName" icon={User} placeholder="John" value={registerForm.firstName} onChange={e => setRegisterForm({
                ...registerForm,
                firstName: e.target.value
              })} size="sm" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <UntitledInput id="lastName" icon={User} placeholder="Doe" value={registerForm.lastName} onChange={e => setRegisterForm({
                ...registerForm,
                lastName: e.target.value
              })} size="sm" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email-signup" className="text-sm font-medium">
                  {t.auth.email}
                </Label>
                <UntitledInput id="email-signup" type="email" icon={Mail} placeholder="Enter your email" value={registerForm.email} onChange={e => {
              setRegisterForm({
                ...registerForm,
                email: e.target.value
              });
              validateEmail(e.target.value);
            }} error={!!validationErrors.email} size="md" />
                {validationErrors.email && <p className="text-xs text-destructive mt-1">{validationErrors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password-signup" className="text-sm font-medium">
                  {t.auth.password}
                </Label>
                <UntitledInput id="password-signup" type="password" icon={Lock} placeholder="Create a password" value={registerForm.password} onChange={e => {
              setRegisterForm({
                ...registerForm,
                password: e.target.value
              });
              validatePassword(e.target.value);
            }} error={!!validationErrors.password} size="md" />
                {validationErrors.password && <p className="text-xs text-destructive mt-1">{validationErrors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  {t.auth.confirmPassword}
                </Label>
                <UntitledInput id="confirmPassword" type="password" icon={Lock} placeholder="Confirm your password" value={registerForm.confirmPassword} onChange={e => setRegisterForm({
              ...registerForm,
              confirmPassword: e.target.value
            })} error={!!validationErrors.confirmPassword} size="md" />
                {validationErrors.confirmPassword && <p className="text-xs text-destructive mt-1">{validationErrors.confirmPassword}</p>}
              </div>
            </div>}

          {signupStep === 2 && <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </Label>
                <Select value={registerForm.gender} onValueChange={value => setRegisterForm({
              ...registerForm,
              gender: value
            })}>
                  <SelectTrigger className="h-12 rounded-lg">
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

              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of Birth
                </Label>
                <UntitledInput id="dateOfBirth" type="date" icon={Calendar} value={registerForm.dateOfBirth} onChange={e => setRegisterForm({
              ...registerForm,
              dateOfBirth: e.target.value
            })} size="md" />
                <p className="text-xs text-muted-foreground mt-1">You must be at least 18 years old</p>
              </div>
            </div>}

          {signupStep === 3 && <div className="space-y-3">
              <div className="space-y-1.5">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Select value={registerForm.residential_country} onValueChange={value => {
              setRegisterForm({
                ...registerForm,
                residential_country: value,
                residential_street: "",
                residential_apt_unit: "",
                residential_city: "",
                residential_province: "",
                residential_postal_code: ""
              });
            }}>
                  <SelectTrigger className="h-12 rounded-lg">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Portugal">Portugal</SelectItem>
                    <SelectItem value="Canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {registerForm.residential_country && <>
                  <div className="space-y-1.5">
                    <Label htmlFor="street" className="text-sm font-medium">
                      {registerForm.residential_country === "Portugal" ? "Rua" : "Street Address"}
                    </Label>
                    <UntitledInput id="street" icon={Home} placeholder={registerForm.residential_country === "Portugal" ? "Rua da Liberdade" : "123 Main St"} value={registerForm.residential_street} onChange={e => setRegisterForm({
                ...registerForm,
                residential_street: e.target.value
              })} size="md" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="apt" className="text-sm font-medium">
                      {registerForm.residential_country === "Portugal" ? "Porta/Andar" : "Unit/Suite"} (Optional)
                    </Label>
                    <UntitledInput id="apt" icon={Building} placeholder={registerForm.residential_country === "Portugal" ? "3º Esq" : "Apt 4B"} value={registerForm.residential_apt_unit} onChange={e => setRegisterForm({
                ...registerForm,
                residential_apt_unit: e.target.value
              })} size="md" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="city" className="text-sm font-medium">
                      {registerForm.residential_country === "Portugal" ? "Localidade" : "City"}
                    </Label>
                    <UntitledInput id="city" icon={MapPin} placeholder={registerForm.residential_country === "Portugal" ? "Lisboa" : "Toronto"} value={registerForm.residential_city} onChange={e => setRegisterForm({
                ...registerForm,
                residential_city: e.target.value
              })} size="md" />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="province" className="text-sm font-medium">
                      {registerForm.residential_country === "Portugal" ? "Distrito" : "Province"}
                    </Label>
                    <Select value={registerForm.residential_province} onValueChange={value => setRegisterForm({
                ...registerForm,
                residential_province: value
              })}>
                      <SelectTrigger className="h-12 rounded-lg">
                        <SelectValue placeholder={`Select ${registerForm.residential_country === "Portugal" ? "distrito" : "province"}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {(registerForm.residential_country === "Portugal" ? portugueseDistricts : canadianProvinces).map(item => <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="postal" className="text-sm font-medium">
                      {registerForm.residential_country === "Portugal" ? "Código Postal" : "Postal Code"}
                    </Label>
                    <UntitledInput id="postal" icon={Map} placeholder={registerForm.residential_country === "Portugal" ? "1000-001" : "M5H 2N2"} value={registerForm.residential_postal_code} onChange={e => setRegisterForm({
                ...registerForm,
                residential_postal_code: e.target.value
              })} size="md" />
                  </div>
                </>}
            </div>}

          <div className="flex gap-2 pt-2">
            {signupStep > 1 && <Button type="button" variant="outline" onClick={handlePreviousStep} className="flex-1 h-11 rounded-lg">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>}
            {signupStep < 3 ? <Button type="button" onClick={handleNextStep} className="flex-1 h-11 rounded-lg">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button> : <Button type="submit" disabled={loading} className="flex-1 h-11 rounded-lg">
                {loading ? "Creating account..." : <>
                    <Check className="w-4 h-4 mr-1" />
                    Complete
                  </>}
              </Button>}
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <button onClick={() => setAuthMode("signin")} className="text-primary hover:underline font-medium">
              Sign in
            </button>
          </p>
        </div>
      </div>;
  };
  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-3 sm:p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-3">
            <img src={logoImage} alt="Clinlix Logo" className="h-10 sm:h-12" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight">
            {authMode === "roleselect" ? "Choose Your Path" : authMode === "signin" ? t.auth.signIn : t.auth.signUp}
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            {authMode === "roleselect" ? "Select how you'd like to use Clinlix" : authMode === "signin" ? "Welcome back! Sign in to continue" : "Create your account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          {authMode === "roleselect" ? renderRoleSelection() : authMode === "signin" ? renderSignInForm() : renderSignUpWizard()}
        </CardContent>
      </Card>
    </div>;
};
export default Auth;