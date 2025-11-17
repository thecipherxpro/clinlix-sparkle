import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface ResidentialAddressFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const ResidentialAddressFields = ({ form, disabled = false }: ResidentialAddressFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="residential_street"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address *</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} placeholder="123 Main Street" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="residential_apt_unit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Apartment/Unit (Optional)</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} placeholder="Apt 4B" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="residential_city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City *</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} placeholder="Lisbon" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="residential_postal_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postal Code *</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} placeholder="1000-001" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="residential_province"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Province/State *</FormLabel>
            <FormControl>
              <Input {...field} disabled={disabled} placeholder="Lisboa" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="residential_country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "Portugal"}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
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
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
