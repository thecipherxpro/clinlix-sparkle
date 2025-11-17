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
      {/* Country Selection - First */}
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
                <SelectItem value="Canada">Canada</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Portugal Address Fields */}
      {selectedCountry === "Portugal" && (
        <>
          <FormField
            control={form.control}
            name="residential_street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rua (Street) *</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="Rua da Liberdade" />
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
                <FormLabel>Porta/Andar (Door/Floor)</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="3º Esq" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="residential_postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      disabled={disabled} 
                      placeholder="1000-001"
                      maxLength={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="residential_city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Localidade (Locality) *</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={disabled} placeholder="Lisboa" />
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
                <FormLabel>Distrito (District) *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={disabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PORTUGUESE_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {/* Canada Address Fields */}
      {selectedCountry === "Canada" && (
        <>
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
                <FormLabel>Unit/Suite</FormLabel>
                <FormControl>
                  <Input {...field} disabled={disabled} placeholder="Unit 4B" />
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
                    <Input {...field} disabled={disabled} placeholder="Toronto" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="residential_province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={disabled}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CANADIAN_PROVINCES.map((province) => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="residential_postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    disabled={disabled} 
                    placeholder="A1A 1A1"
                    maxLength={7}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
};
