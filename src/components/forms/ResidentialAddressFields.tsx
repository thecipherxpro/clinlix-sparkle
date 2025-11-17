import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ResidentialAddressFieldsProps {
  values: {
    residential_street?: string;
    residential_apt_unit?: string;
    residential_city?: string;
    residential_province?: string;
    residential_postal_code?: string;
    residential_country?: string;
  };
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
  disabled?: boolean;
}

export const ResidentialAddressFields = ({ 
  values, 
  onChange, 
  errors = {}, 
  disabled = false 
}: ResidentialAddressFieldsProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="residential_street" className="text-sm font-medium">
          Street Address *
        </Label>
        <Input
          id="residential_street"
          value={values.residential_street || ""}
          onChange={(e) => onChange("residential_street", e.target.value)}
          placeholder="123 Main Street"
          disabled={disabled}
          className={errors.residential_street ? "border-destructive" : ""}
        />
        {errors.residential_street && (
          <p className="text-xs text-destructive">{errors.residential_street}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="residential_apt_unit" className="text-sm font-medium">
          Apartment/Unit (Optional)
        </Label>
        <Input
          id="residential_apt_unit"
          value={values.residential_apt_unit || ""}
          onChange={(e) => onChange("residential_apt_unit", e.target.value)}
          placeholder="Apt 4B"
          disabled={disabled}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="residential_city" className="text-sm font-medium">
            City *
          </Label>
          <Input
            id="residential_city"
            value={values.residential_city || ""}
            onChange={(e) => onChange("residential_city", e.target.value)}
            placeholder="Lisbon"
            disabled={disabled}
            className={errors.residential_city ? "border-destructive" : ""}
          />
          {errors.residential_city && (
            <p className="text-xs text-destructive">{errors.residential_city}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="residential_postal_code" className="text-sm font-medium">
            Postal Code *
          </Label>
          <Input
            id="residential_postal_code"
            value={values.residential_postal_code || ""}
            onChange={(e) => onChange("residential_postal_code", e.target.value)}
            placeholder="1000-001"
            disabled={disabled}
            className={errors.residential_postal_code ? "border-destructive" : ""}
          />
          {errors.residential_postal_code && (
            <p className="text-xs text-destructive">{errors.residential_postal_code}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="residential_province" className="text-sm font-medium">
          Province/State *
        </Label>
        <Input
          id="residential_province"
          value={values.residential_province || ""}
          onChange={(e) => onChange("residential_province", e.target.value)}
          placeholder="Lisboa"
          disabled={disabled}
          className={errors.residential_province ? "border-destructive" : ""}
        />
        {errors.residential_province && (
          <p className="text-xs text-destructive">{errors.residential_province}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="residential_country" className="text-sm font-medium">
          Country *
        </Label>
        <Select
          value={values.residential_country || "Portugal"}
          onValueChange={(value) => onChange("residential_country", value)}
          disabled={disabled}
        >
          <SelectTrigger id="residential_country" className={errors.residential_country ? "border-destructive" : ""}>
            <SelectValue placeholder="Select country" />
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
        {errors.residential_country && (
          <p className="text-xs text-destructive">{errors.residential_country}</p>
        )}
      </div>
    </div>
  );
};
