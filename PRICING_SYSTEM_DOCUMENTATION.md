# Clinlix Pricing System Documentation

## Overview
This document explains the complete pricing system for Clinlix cleaning services, including property layout packages, add-on services, and overtime charges.

---

## 1. Property Layout Package Pricing

### Package Structure
Cleaning packages are determined by the **property layout** (bedroom count) and stored in the `cleaning_packages` table.

### Package Tiers

| Package Code | Bedroom Count | Time Included | One-Time Price (EUR) | Recurring Price (EUR) |
|--------------|---------------|---------------|---------------------|---------------------|
| STUDIO       | 0 bedrooms    | 2-3 hours     | €50-80             | €40-65              |
| 1BR          | 1 bedroom     | 3-4 hours     | €80-120            | €65-95              |
| 2BR          | 2 bedrooms    | 4-5 hours     | €120-160           | €95-130             |
| 3BR          | 3 bedrooms    | 5-6 hours     | €160-200           | €130-165            |
| 4BR          | 4+ bedrooms   | 6-7 hours     | €200-250           | €165-210            |

### Package Determination Logic

1. **Property Layout Selection**
   - When a customer adds an address, they select the property layout type (bedroom count)
   - The system automatically assigns the corresponding `package_code` to the address
   - This package code is stored in `customer_addresses.package_code`

2. **Package Assignment**
   ```
   Layout Type (bedroom_count) → Package Code → Base Pricing
   ```

3. **Areas Included**
   All packages include standard cleaning areas:
   - Bathroom
   - Kitchen
   - Living room
   - Floors
   - Dusting
   - Surfaces

4. **Pricing Type Selection**
   - **One-Time Service**: Full price (`one_time_price`)
   - **Recurring Service**: Discounted price (`recurring_price`)
   - Recurring services typically offer 15-20% discount

### Database Schema
```sql
Table: cleaning_packages
- id (uuid): Primary key
- package_code (text): Unique identifier (STUDIO, 1BR, 2BR, etc.)
- package_name (text): Display name
- bedroom_count (integer): Number of bedrooms
- time_included (text): Estimated duration
- one_time_price (numeric): Single service price
- recurring_price (numeric): Subscription service price
- areas_included (text[]): List of included cleaning areas
```

---

## 2. Add-On Services Pricing

### Add-On Structure
Additional services that customers can add to their base package, stored in the `cleaning_addons` table.

### Available Add-Ons

| Type          | Name (EN)              | Name (PT)                    | Price (EUR) |
|---------------|------------------------|------------------------------|-------------|
| appliance     | Inside Fridge          | Interior do Frigorífico      | €15         |
| appliance     | Inside Oven            | Interior do Forno            | €15         |
| appliance     | Inside Cabinets        | Interior dos Armários        | €20         |
| laundry       | Laundry Wash & Fold    | Lavandaria e Dobrar          | €25         |
| deep          | Deep Carpet Clean      | Limpeza Profunda Carpetes    | €30         |
| organization  | Organization Service   | Serviço de Organização       | €35         |

### Add-On Logic

1. **Selection Process**
   - Customers can select multiple add-ons during booking
   - Each add-on has a fixed price regardless of property size
   - Add-on IDs are stored in `bookings.addon_ids` as an array

2. **Price Calculation**
   ```javascript
   Total Add-On Cost = SUM(price of each selected addon)
   ```

3. **Validation**
   - The `create-booking` edge function validates that all selected addon IDs exist
   - Prevents invalid or tampered pricing from client-side

4. **Multi-Language Support**
   - Add-ons have both English (`name_en`) and Portuguese (`name_pt`) names
   - Displayed based on user's language preference

### Database Schema
```sql
Table: cleaning_addons
- id (uuid): Primary key
- type (text): Category (appliance, laundry, deep, organization)
- name_en (text): English name
- name_pt (text): Portuguese name
- price (numeric): Fixed price in EUR
- created_at (timestamp): Record creation date
```

---

## 3. Overtime Pricing & Logic

### Overtime Structure
When a cleaning job exceeds the estimated time included in the package, overtime charges apply.

### Overtime Rules

| Increment   | Price (EUR) | Price (CAD) |
|-------------|-------------|-------------|
| 30 minutes  | €10         | $15         |

### Overtime Calculation Logic

1. **Time Tracking**
   - Provider starts job: `bookings.started_at` timestamp recorded
   - Provider completes job: `bookings.completed_at` timestamp recorded
   - System calculates: `actual_duration = completed_at - started_at`

2. **Overtime Determination**
   ```
   Expected Duration = Package time_included (e.g., "3-4 hours")
   Actual Duration = completed_at - started_at
   
   IF Actual Duration > Expected Duration:
     Overtime Minutes = Actual Duration - Expected Duration
   ```

3. **Overtime Charge Calculation**
   ```javascript
   // Stored in bookings.overtime_minutes
   overtime_charge = (overtime_minutes / 30) * 10.00 EUR
   
   // Example: 45 minutes overtime
   overtime_charge = (45 / 30) * 10 = €15
   ```

4. **Rounding Rules**
   - Overtime is calculated in 30-minute increments
   - Partial increments are rounded up
   - Example: 31 minutes = 1 full increment = €10

5. **Currency Handling**
   - EUR for Portugal and Europe
   - CAD for Canada
   - Currency is set based on customer's address country

### Database Schema
```sql
Table: overtime_rules
- id (uuid): Primary key
- increment_minutes (integer): Time increment (default: 30)
- price_eur (numeric): Price per increment in EUR (default: 10)
- price_cad (numeric): Price per increment in CAD (default: 15)

Table: bookings (overtime-related fields)
- started_at (timestamp): Job start time
- completed_at (timestamp): Job completion time
- overtime_minutes (integer): Total overtime in minutes
- total_estimate (numeric): Initial price estimate
- total_final (numeric): Final price including overtime
```

---

## 4. Complete Booking Price Calculation

### Total Price Formula
```
Total Booking Price = Base Package Price + Add-On Total + Overtime Charges
```

### Calculation Flow

1. **Initial Estimate** (at booking creation)
   ```javascript
   base_price = recurring_service ? package.recurring_price : package.one_time_price
   addon_total = SUM(selected_addons.price)
   total_estimate = base_price + addon_total
   ```

2. **Final Total** (after job completion)
   ```javascript
   overtime_charge = (overtime_minutes / 30) * 10.00
   total_final = total_estimate + overtime_charge
   ```

### Example Calculation

**Scenario**: 2-bedroom apartment, one-time service, with inside oven cleaning, 45 minutes overtime

```
Base Package (2BR, one-time):     €140.00
Add-on (Inside Oven):             €15.00
--------------------------------
Initial Estimate:                 €155.00

Overtime (45 minutes):            €15.00
--------------------------------
Final Total:                      €170.00
```

### Server-Side Price Validation

**CRITICAL SECURITY**: All pricing is calculated server-side in the `create-booking` edge function to prevent client-side price manipulation.

```javascript
// Edge function validates:
1. User owns the selected address
2. Selected package matches address configuration
3. Provider is available on selected date
4. All addon IDs are valid
5. Calculates prices from database, not client input
```

---

## 5. Provider Earnings Calculation

### Commission Structure
```
Provider Earnings = Total Final Price - Platform Fee (15%)
```

### Breakdown
```
Total Earned = base_amount + addon_amount + overtime_amount
Platform Fee = Total Earned × 0.15
Payout Due = Total Earned - Platform Fee
```

### Wallet Entry Creation
When a job is marked as `completed`, a wallet entry is automatically created via the `create_provider_wallet_entry()` database trigger.

### Database Schema
```sql
Table: provider_wallet
- provider_id (uuid): Provider reference
- booking_id (uuid): Associated booking
- base_amount (numeric): Package base price
- addon_amount (numeric): Total from add-ons
- overtime_amount (numeric): Overtime charges
- total_earned (numeric): Sum of all amounts
- platform_fee (numeric): 15% commission
- payout_due (numeric): Amount owed to provider
- status (text): 'pending', 'paid', 'processing'
```

---

## 6. Business Rules Summary

### Package Pricing Rules
- ✅ One package per address based on bedroom count
- ✅ Package tier cannot be changed without updating address layout
- ✅ Recurring services always cost less than one-time services
- ✅ Package includes standard areas; extras require add-ons

### Add-On Rules
- ✅ Customers can select multiple add-ons per booking
- ✅ Add-on prices are fixed regardless of property size
- ✅ Add-ons are optional and customizable per booking

### Overtime Rules
- ✅ Overtime only applies after job completion
- ✅ Calculated in 30-minute increments
- ✅ Rate is €10 per 30-minute increment (EUR pricing)
- ✅ Automatically added to final total

### Security Rules
- ✅ All price calculations happen server-side
- ✅ Client cannot manipulate pricing
- ✅ Database validates all relationships and amounts
- ✅ RLS policies ensure users only see their own data

---

## 7. Integration Points

### Booking Flow
1. Customer selects address → System loads associated package
2. Customer selects add-ons → Total estimate calculated
3. Booking created with `total_estimate`
4. Job completed → Overtime calculated → `total_final` updated
5. Provider wallet entry created automatically

### Key Edge Functions
- `create-booking`: Validates and creates bookings with server-side pricing
- `update-job-status`: Handles status transitions and overtime calculation

### Key Database Triggers
- `create_provider_wallet_entry()`: Auto-creates earnings record on completion
- `validate_booking_timestamps()`: Ensures logical time progression

---

## 8. Future Considerations

### Potential Enhancements
- Dynamic pricing based on location/demand
- Seasonal pricing adjustments
- Volume discounts for recurring customers
- Commercial property pricing tiers
- Real-time price estimation API

### Scalability Notes
- Current system supports EUR and CAD currencies
- Easy to add new package tiers by bedroom count
- Add-on system is extensible for new service types
- Overtime rules are configurable via database

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-05  
**Maintained By**: Clinlix Development Team
