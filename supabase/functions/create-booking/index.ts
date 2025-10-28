import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface BookingRequest {
  customerId: string;
  providerId: string;
  addressId: string;
  packageId: string;
  addonIds: string[];
  requestedDate: string;
  requestedTime: string;
  recurringService: boolean;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    // Verify user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const bookingData: BookingRequest = await req.json();

    console.log('Creating booking for user:', user.id);

    // Validate user is the customer
    if (bookingData.customerId !== user.id) {
      throw new Error('Cannot create booking for another user');
    }

    // Fetch address with package to calculate server-side price
    const { data: address, error: addressError } = await supabase
      .from('customer_addresses')
      .select('*, cleaning_packages(*)')
      .eq('id', bookingData.addressId)
      .eq('customer_id', user.id)
      .single();

    if (addressError || !address) {
      throw new Error('Invalid address or address does not belong to user');
    }

    // Validate provider exists and is available on the requested date
    const { data: availability, error: availError } = await supabase
      .from('provider_availability')
      .select('*')
      .eq('provider_id', bookingData.providerId)
      .eq('date', bookingData.requestedDate)
      .single();

    if (availError || !availability) {
      throw new Error('Provider is not available on the selected date');
    }

    // Calculate price server-side (secure)
    const basePrice = bookingData.recurringService 
      ? parseFloat(address.cleaning_packages.recurring_price)
      : parseFloat(address.cleaning_packages.one_time_price);

    // Validate and calculate addon prices
    let addonTotal = 0;
    if (bookingData.addonIds && bookingData.addonIds.length > 0) {
      const { data: addons, error: addonError } = await supabase
        .from('cleaning_addons')
        .select('id, price')
        .in('id', bookingData.addonIds);

      if (addonError) {
        throw new Error('Invalid addon selection');
      }

      // Ensure all requested addons exist
      if (addons.length !== bookingData.addonIds.length) {
        throw new Error('One or more addons are invalid');
      }

      addonTotal = addons.reduce((sum, addon) => sum + parseFloat(addon.price), 0);
    }

    const totalEstimate = basePrice + addonTotal;

    console.log('Calculated total:', totalEstimate);

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        customer_id: bookingData.customerId,
        provider_id: bookingData.providerId,
        address_id: bookingData.addressId,
        package_id: bookingData.packageId,
        addon_ids: bookingData.addonIds,
        requested_date: bookingData.requestedDate,
        requested_time: bookingData.requestedTime,
        total_estimate: totalEstimate,
        status: 'pending',
        payment_status: 'pending',
        job_status: 'pending'
      }])
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      throw new Error('Failed to create booking');
    }

    console.log('Booking created successfully:', booking.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        booking,
        totalEstimate 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error: any) {
    console.error('Error in create-booking:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to create booking' }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
