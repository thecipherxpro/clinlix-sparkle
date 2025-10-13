import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.75.0';
import { Resend } from 'https://esm.sh/resend@4.0.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const resendApiKey = Deno.env.get('RESEND_API_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

function generateSecureToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Password reset requested for:', email);

    // Find user in profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, first_name, email')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (profileError) {
      console.error('Error finding profile:', profileError);
      // Don't reveal error for security
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!profile) {
      // Don't reveal if user exists for security
      console.log('User not found, but returning success for security');
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('User found, generating token for:', profile.id);

    // Generate secure token
    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in database
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: profile.id,
        token,
        expires_at: expiresAt.toISOString(),
      });

    if (tokenError) {
      console.error('Error storing token:', tokenError);
      throw new Error('Failed to generate reset token');
    }

    // Create reset URL
    const resetUrl = `${req.headers.get('origin')}/auth/reset-password?token=${token}`;

    // Send email via Resend
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <title>Reset Your Clinlix Password</title>
        <style>
          body { margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #6C63FF 0%, #5A52D5 100%); padding: 40px 60px; text-align: center; }
          .logo { max-width: 180px; height: auto; }
          .content { padding: 60px 60px 40px; }
          .title { margin: 0 0 24px; font-size: 28px; font-weight: 700; color: #1a1a1a; line-height: 1.3; }
          .text { margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a5568; }
          .button-container { padding: 20px 0; text-align: center; }
          .button { display: inline-block; background: linear-gradient(135deg, #6C63FF 0%, #5A52D5 100%); color: #ffffff; text-decoration: none; padding: 16px 48px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(108, 99, 255, 0.4); }
          .footer { background-color: #f7fafc; padding: 40px 60px; border-top: 1px solid #e2e8f0; text-align: center; }
          .footer-text { margin: 0 0 8px; font-size: 14px; color: #718096; }
          .footer-link { margin: 0; font-size: 12px; color: #a0aec0; word-break: break-all; }
          .footer-link a { color: #6C63FF; }
        </style>
      </head>
      <body>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 0;">
          <tr>
            <td align="center">
              <div class="container">
                <div class="header">
                  <img src="https://ctyulavksyguogudczpi.supabase.co/storage/v1/object/public/avatars/clinlix-logo-text.png" alt="Clinlix" class="logo" />
                </div>
                
                <div class="content">
                  <h1 class="title">Reset Your Password</h1>
                  <p class="text">Hi ${profile?.first_name || 'there'},</p>
                  <p class="text">We received a request to reset your password. Click the button below to create a new password:</p>
                  
                  <div class="button-container">
                    <a href="${resetUrl}" class="button">Reset Password</a>
                  </div>
                  
                  <p class="text" style="font-size: 14px; color: #718096;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                  
                  <p class="text" style="font-size: 14px; color: #718096;">
                    This link will expire in 1 hour for security reasons.
                  </p>
                </div>
                
                <div class="footer">
                  <p class="footer-text">
                    © 2025 Clinlix. Professional Cleaning Services.
                  </p>
                  <p class="footer-link">
                    If the button doesn't work, copy and paste this link:<br/>
                    <a href="${resetUrl}">${resetUrl}</a>
                  </p>
                </div>
              </div>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const { error: emailError } = await resend.emails.send({
      from: 'Clinlix <support@clinlix.com>',
      to: [email],
      subject: 'Reset Your Clinlix Password',
      html,
    });

    if (emailError) {
      console.error('Resend error:', emailError);
      throw new Error('Failed to send email');
    }

    console.log('Password reset email sent successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error in request-password-reset:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process request' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
