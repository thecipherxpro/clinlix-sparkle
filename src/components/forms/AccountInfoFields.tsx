import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AccountInfoFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

export const AccountInfoFields = ({ form, disabled = false }: AccountInfoFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">First Name *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={disabled} 
                  placeholder="John" 
                  className="h-11 text-base"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium">Last Name *</FormLabel>
              <FormControl>
                <Input 
                  {...field} 
                  disabled={disabled} 
                  placeholder="Doe" 
                  className="h-11 text-base"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Email *</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="email" 
                disabled={true} 
                placeholder="john@example.com" 
                className="h-11 text-base bg-muted"
              />
            </FormControl>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Phone (Optional)</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                type="tel" 
                disabled={disabled} 
                placeholder="+351 912 345 678" 
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
