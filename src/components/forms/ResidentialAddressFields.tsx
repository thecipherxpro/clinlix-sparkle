import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { useState, useEffect } from "react";

interface ResidentialAddressFieldsProps {
  form: UseFormReturn<any>;
  disabled?: boolean;
}

const CANADIAN_PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
];

const PORTUGUESE_DISTRICTS = [
  "Aveiro", "Beja", "Braga", "Bragança", "Castelo Branco", "Coimbra",
  "Évora", "Faro", "Guarda", "Leiria", "Lisboa", "Portalegre",
  "Porto", "Santarém", "Setúbal", "Viana do Castelo", "Vila Real", "Viseu",
  "Açores", "Madeira"
];

export const ResidentialAddressFields = ({ form, disabled = false }: ResidentialAddressFieldsProps) => {
  const [selectedCountry, setSelectedCountry] = useState<string>(
    form.getValues("residential_country") || "Portugal"
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "residential_country") {
        setSelectedCountry(value.residential_country);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="space-y-4">
      {/* Country Selection */}
      <FormField
        control={form.control}
        name="residential_country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium">Country *</FormLabel>
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value || "Portugal"}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="h-11 text-base">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background z-50">
                <SelectItem value="Portugal" className="text-base py-3">Portugal</SelectItem>
                <SelectItem value="Canada" className="text-base py-3">Canada</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage className="text-xs" />
          </FormItem>
        )}
      />

      {/* Portugal Fields */}
      {selectedCountry === "Portugal" && (
        <>
          <FormField
            control={form.control}
            name="residential_street"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Rua (Street) *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="Rua da Liberdade" className="h-11 text-base" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="residential_apt_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Porta/Andar (Door/Floor)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="3º Esq" className="h-11 text-base" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="residential_postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Código Postal *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="1000-001" className="h-11 text-base" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="residential_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Localidade (City) *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="Lisboa" className="h-11 text-base" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="residential_province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Distrito (District) *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background z-50 max-h-[300px]">
                    {PORTUGUESE_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district} className="text-base py-3">
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </>
      )}

      {/* Canada Fields */}
      {selectedCountry === "Canada" && (
        <>
          <FormField
            control={form.control}
            name="residential_street"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Street Address *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="123 Main Street" className="h-11 text-base" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="residential_apt_unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Apt/Unit</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="Apt 4B" className="h-11 text-base" />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <FormField
              control={form.control}
              name="residential_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">City *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="Toronto" className="h-11 text-base" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="residential_postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Postal Code *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="M5H 2N2" className="h-11 text-base" />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="residential_province"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Province *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 text-base">
                      <SelectValue placeholder="Select province" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="bg-background z-50 max-h-[300px]">
                    {CANADIAN_PROVINCES.map((province) => (
                      <SelectItem key={province.value} value={province.value} className="text-base py-3">
                        {province.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};
