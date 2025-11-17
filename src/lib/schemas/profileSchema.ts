import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50, "First name too long"),
  last_name: z.string().min(1, "Last name is required").max(50, "Last name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"], {
    required_error: "Please select a gender"
  }),
  date_of_birth: z.string().min(1, "Date of birth is required").refine((date) => {
    const dob = new Date(date);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    return age >= 18 && age <= 100;
  }, "You must be at least 18 years old"),
  residential_street: z.string().min(1, "Street address is required"),
  residential_apt_unit: z.string().optional(),
  residential_city: z.string().min(1, "City is required"),
  residential_province: z.string().min(1, "Province/State is required"),
  residential_postal_code: z.string().min(1, "Postal code is required"),
  residential_country: z.string().min(1, "Country is required"),
  language: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
});

export const signupSchema = profileSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
