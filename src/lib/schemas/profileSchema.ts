import { z } from "zod";

const PORTUGAL_POSTAL_CODE_REGEX = /^\d{4}-\d{3}$/;
const CANADA_POSTAL_CODE_REGEX = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;

const baseProfileSchema = z.object({
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
  residential_city: z.string().min(1, "City/Locality is required"),
  residential_province: z.string().min(1, "Province/District is required"),
  residential_postal_code: z.string().min(1, "Postal code is required"),
  residential_country: z.enum(["Portugal", "Canada"], {
    required_error: "Please select a country"
  }),
  language: z.string().optional(),
  country: z.string().optional(),
  currency: z.string().optional(),
});

export const profileSchema = baseProfileSchema.refine((data) => {
  // Validate Portugal postal code format
  if (data.residential_country === "Portugal") {
    return PORTUGAL_POSTAL_CODE_REGEX.test(data.residential_postal_code);
  }
  // Validate Canada postal code format
  if (data.residential_country === "Canada") {
    return CANADA_POSTAL_CODE_REGEX.test(data.residential_postal_code);
  }
  return true;
}, {
  message: "Invalid postal code format for selected country",
  path: ["residential_postal_code"]
});

export const signupSchema = baseProfileSchema.extend({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}).refine((data) => {
  // Validate Portugal postal code format
  if (data.residential_country === "Portugal") {
    return PORTUGAL_POSTAL_CODE_REGEX.test(data.residential_postal_code);
  }
  // Validate Canada postal code format
  if (data.residential_country === "Canada") {
    return CANADA_POSTAL_CODE_REGEX.test(data.residential_postal_code);
  }
  return true;
}, {
  message: "Invalid postal code format for selected country",
  path: ["residential_postal_code"]
});

export type ProfileFormData = z.infer<typeof profileSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
