# My Addresses Page Documentation

## Overview
The My Addresses page (`/customer/my-addresses`) allows customers to manage their service addresses. Each address is linked to a specific property type and cleaning package, which determines the pricing for bookings at that location.

---

## Page Purpose
- View all saved addresses with their associated cleaning packages
- Add new addresses with complete property details
- Edit existing addresses
- Delete addresses (with confirmation)
- Set a primary address for quick booking

---

## Address Management Flow

### 1. **Viewing Addresses**

When a customer visits the My Addresses page:

```
User Authentication Check → Fetch Profile → Fetch Addresses → Display Cards
```

**Data Fetched:**
- User profile (first_name, last_name, email, phone)
- All customer addresses with associated cleaning package details
- Available cleaning packages for package selection

**Display:**
- Each address shown in a `Card` component
- Primary address indicated with a badge
- Contact information displayed
- Associated cleaning package details shown
- Edit/Delete options in dropdown menu

### 2. **Adding a New Address**

**Trigger:** Click "Add New Address" button

**Form Opens:** Sheet/Drawer modal with address form

**Required Information:**

#### **Basic Contact Information**
- First Name
- Last Name
- Email
- Phone Number
- Address Label (e.g., "Home", "Office", "Vacation Home")

#### **Location Details**

**For Portugal:**
- Rua (Street)
- Porta/Andar (Door/Floor)
- Código Postal (Postal Code)
- Localidade (Locality)
- Distrito (District)

**For Canada:**
- Street Address
- Apartment/Unit Number
- City
- Province (Dropdown: Ontario, Quebec, British Columbia, etc.)
- Postal Code

#### **Property Classification**

**Property Type:** (Affects base package availability)
- Apartment
- House
- Commercial

**Layout Type:** (Determines bedroom count and package code)
- Studio (0 bedrooms) → Package Code: C1
- T1 (1 bedroom) → Package Code: C2
- T2 (2 bedrooms) → Package Code: C3
- T3 (3 bedrooms) → Package Code: C4
- T4 (4 bedrooms) → Package Code: C5
- T5+ (5+ bedrooms) → Package Code: C6

**Package Selection:**
- Automatically filtered based on property type and layout
- Displays available cleaning packages matching the bedroom count
- Shows included time and pricing

**Primary Address:**
- Checkbox to set as primary address
- Only one address can be primary at a time

### 3. **Address Submission Logic**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  // Prevent default form submission
  e.preventDefault();

  // If setting as primary, unset all other primary addresses
  if (formData.is_primary) {
    await supabase
      .from('customer_addresses')
      .update({ is_primary: false })
      .eq('customer_id', user.id);
  }

  // Insert or Update address
  if (editingId) {
    // Update existing address
    await supabase
      .from('customer_addresses')
      .update(addressData)
      .eq('id', editingId);
  } else {
    // Insert new address
    await supabase
      .from('customer_addresses')
      .insert([addressData]);
  }

  // Refresh address list
  // Close form
  // Show success message
};
```

### 4. **Editing an Address**

**Trigger:** Click "Edit" from address card menu

**Process:**
1. Populate form with existing address data
2. Allow modification of all fields
3. Submit updates to database
4. Refresh address list

### 5. **Deleting an Address**

**Trigger:** Click "Delete" from address card menu

**Process:**
1. Show confirmation dialog
2. If confirmed, delete from database
3. Refresh address list
4. Show success message

---

## Property Layout & Pricing Relationship

### How Layout Determines Pricing

The property layout (bedroom count) is the **primary factor** in determining the cleaning package and pricing:

```
Layout Type → Bedroom Count → Package Code → Base Price
```

#### **Layout to Package Code Mapping**

| Layout Type | Bedrooms | Package Code | Base Price (One-Time) | Base Price (Recurring) | Included Time |
|-------------|----------|--------------|----------------------|------------------------|---------------|
| Studio      | 0        | C1           | €35                  | €28                    | 1h30          |
| T1          | 1        | C2           | €50                  | €43                    | 2h15          |
| T2          | 2        | C3           | €70                  | €63                    | 3h00          |
| T3          | 3        | C4           | €90                  | €83                    | 3h45          |
| T4          | 4        | C5           | €110                 | €103                   | 4h30          |
| T5+         | 5+       | C6           | €130                 | €123                   | 5h15          |

### Why Layout Matters

1. **More Bedrooms = More Cleaning Area**
   - Larger properties require more time
   - More rooms mean more cleaning tasks
   - Included time scales with bedroom count

2. **Package Code Assignment**
   - Package code (C1-C6) is stored in the address
   - Package code links to cleaning_packages table
   - Ensures consistent pricing for that location

3. **Pricing Consistency**
   - Once an address is saved with a layout, all future bookings use that package
   - Prevents pricing confusion
   - Ensures accurate estimates

### Property Type Impact

While layout (bedrooms) is the primary pricing factor, property type provides additional context:

| Property Type | Characteristics | Layout Options |
|---------------|----------------|----------------|
| Apartment     | Multi-unit building | Studio, T1-T5+ |
| House         | Single-family home | T1-T5+ |
| Commercial    | Business property | Custom based on size |

**Note:** Currently, all property types use the same base pricing structure, but property type is stored for potential future differentiation (e.g., commercial cleaning rates).

---

## Database Structure

### customer_addresses Table

**Key Fields:**
```sql
- id (uuid, primary key)
- customer_id (uuid, references auth user)
- property_type (text: 'Apartment', 'House', 'Commercial')
- layout_type (text: 'Studio', 'T1', 'T2', 'T3', 'T4', 'T5+')
- package_code (text: 'C1', 'C2', 'C3', 'C4', 'C5', 'C6')
- is_primary (boolean, default: false)
- first_name, last_name, email, phone (contact info)
- country, currency (location settings)
- [country-specific address fields]
```

### Relationship to Cleaning Packages

```
customer_addresses.package_code → cleaning_packages.package_code
                                ↓
                    Determines pricing for bookings
```

When creating a booking:
1. User selects an address
2. System fetches cleaning package via package_code
3. Base price is retrieved from cleaning_packages
4. Add-ons and overtime are added
5. Total estimate is calculated

---

## User Experience Flow

### First-Time Address Addition

```
1. Click "Add New Address"
2. Fill contact information
3. Select country (form adapts)
4. Enter location details
5. Choose property type
6. Select layout type (bedroom count)
7. System shows available packages
8. Select cleaning package
9. Optionally set as primary
10. Submit → Address saved with package_code
```

### Subsequent Bookings

```
1. Select saved address
2. System automatically knows:
   - Property layout
   - Package code
   - Base pricing
3. Customer adds date/time
4. Customer selects add-ons
5. System calculates total
6. Booking created with accurate pricing
```

---

## Technical Implementation Details

### Form Validation

**Required Fields:**
- First Name, Last Name, Email, Phone
- Address Label
- Country
- Country-specific address fields
- Property Type
- Layout Type
- Package Code (auto-selected based on layout)

### Data Persistence

**On Save:**
```typescript
{
  customer_id: auth.uid(),
  property_type: "Apartment",
  layout_type: "T2",
  package_code: "C3", // Auto-determined from T2
  currency: "EUR",
  country: "Portugal",
  // ... other fields
}
```

### Primary Address Logic

- Only one address can be primary
- Setting new primary automatically unsets previous
- Primary address used as default in booking flow

### Country-Specific Fields

**Portugal:**
- `rua`, `porta_andar`, `codigo_postal`, `localidade`, `distrito`

**Canada:**
- `street`, `apt_unit`, `city`, `province`, `postal_code`

Form dynamically shows/hides fields based on selected country.

---

## Integration with Booking Flow

### Address Selection Impact

When a customer books a cleaning service:

1. **Address Selection** → Determines package_code
2. **Package Code** → Retrieves base price from cleaning_packages
3. **Base Price** → Starting point for total calculation
4. **Add-ons Selected** → Added to base price
5. **Overtime Estimated** → Added if service exceeds included time
6. **Final Total** → `base_price + addons + overtime`

### Example Booking Calculation

**Address Details:**
- Property: Apartment
- Layout: T2 (2 bedrooms)
- Package Code: C3

**Pricing Calculation:**
```
Base Price (C3, One-Time): €70
Included Time: 3h00

Add-ons Selected:
- Balcony: €15
- Inside Cupboards (2 rooms): €40 (€20 × 2)

Subtotal: €70 + €15 + €40 = €125

Overtime: None (within 3h00)

TOTAL ESTIMATE: €125
```

---

## Key Business Rules

1. **One Package Per Address**
   - Each saved address has exactly one cleaning package
   - Package determined by layout (bedroom count)
   - Ensures pricing consistency

2. **Layout Cannot Change Package Tier**
   - A T2 address always uses C3 package
   - Changing layout requires updating package_code

3. **Primary Address Default**
   - Primary address shown first in booking flow
   - Simplifies repeat bookings
   - Customer can override and choose different address

4. **Currency Auto-Set**
   - Portugal → EUR
   - Canada → CAD
   - Prices displayed in appropriate currency

5. **Address Reusability**
   - Saved addresses can be used for multiple bookings
   - No need to re-enter property details
   - Maintains historical pricing consistency

---

## Security & Access Control

**Row-Level Security (RLS) Policies:**

- **View:** Users can only view their own addresses
- **Insert:** Users can only create addresses for themselves
- **Update:** Users can only update their own addresses
- **Delete:** Users can only delete their own addresses
- **Provider Access:** Providers can view addresses for jobs assigned to them

---

## Future Considerations

### Potential Enhancements

1. **Commercial Property Pricing**
   - Different rate structure for commercial properties
   - Square footage-based pricing

2. **Address Validation**
   - API integration for address verification
   - Google Maps integration for location accuracy

3. **Multiple Packages Per Address**
   - Allow different cleaning levels (basic, deep, premium)
   - User selects package during booking

4. **Area-Based Pricing**
   - Different rates for different districts/regions
   - Dynamic pricing based on location

---

## Summary

The My Addresses page is central to the Clinlix platform's pricing model:

- **Property layout (bedroom count)** determines the cleaning package tier
- **Package code** links addresses to specific pricing in the database
- **Saved addresses** ensure consistent, predictable pricing for repeat customers
- **Layout-to-package mapping** scales pricing fairly based on property size

This design ensures transparency, consistency, and fairness in pricing while simplifying the booking experience for customers.
