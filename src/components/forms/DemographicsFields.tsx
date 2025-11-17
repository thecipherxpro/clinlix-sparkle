import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";

interface DemographicsFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const DemographicsFields = ({ form, disabled = false }: DemographicsFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Gender *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background z-50">
                <SelectItem value="male" className="text-base py-3">Male</SelectItem>
                <SelectItem value="female" className="text-base py-3">Female</SelectItem>
                <SelectItem value="other" className="text-base py-3">Other</SelectItem>
                <SelectItem value="prefer_not_to_say" className="text-base py-3">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="date_of_birth"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Date of Birth *</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="date" 
                disabled={disabled}
                max={new Date().toISOString().split('T')[0]}
                className="h-11 text-base"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />
    </div>
  );
};
