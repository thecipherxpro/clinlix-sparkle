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

    // Create reset URL and logo URL
    const origin = req.headers.get('origin') || 'https://clinlix.com';
    const resetUrl = `${origin}/auth/reset-password?token=${token}`;
    const logoUrl = `${origin}/images/logo-clinlix-email.png`;

    // Send email via Resend
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
        <title>Reset Your Clinlix Password</title>
        <style>
          /* Reset styles */
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif;
            background-color: #f4f7fa;
            line-height: 1.6;
          }
          
          /* Container */
          .email-wrapper { 
            width: 100%; 
            background-color: #f4f7fa; 
            padding: 20px 0;
          }
          .email-container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
          }
          
          /* Header with logo */
          .email-header { 
            background-color: #ffffff;
            padding: 40px 30px 30px;
            border-bottom: 3px solid #4a90a4;
          }
          .logo-img { 
            max-width: 200px; 
            height: auto; 
            display: block;
          }
          
          /* Content area */
          .email-body { 
            padding: 40px 30px;
            text-align: left;
          }
          
          .greeting { 
            font-size: 18px; 
            font-weight: 600; 
            color: #1a2332;
            margin: 0 0 20px;
          }
          
          .message-text { 
            font-size: 16px; 
            line-height: 1.7; 
            color: #4a5568;
            margin: 0 0 16px;
          }
          
          /* Button */
          .button-wrapper { 
            margin: 32px 0;
          }
          .reset-button { 
            display: inline-block;
            background-color: #4a90a4;
            color: #ffffff !important;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 6px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            transition: background-color 0.3s ease;
          }
          .reset-button:hover {
            background-color: #3d7a8a;
          }
          
          /* Security info */
          .security-info {
            background-color: #f8f9fa;
            border-left: 4px solid #4a90a4;
            padding: 16px 20px;
            margin: 24px 0;
          }
          .security-info p {
            font-size: 14px;
            color: #4a5568;
            margin: 0 0 8px;
            line-height: 1.6;
          }
          .security-info p:last-child {
            margin: 0;
          }
          
          /* Footer */
          .email-footer { 
            background-color: #f8f9fa;
            padding: 30px;
            text-align: left;
            border-top: 1px solid #e2e8f0;
          }
          .footer-text { 
            font-size: 13px; 
            color: #718096;
            margin: 0 0 12px;
            line-height: 1.6;
          }
          .footer-link { 
            font-size: 12px; 
            color: #4a90a4;
            word-wrap: break-word;
            text-decoration: none;
          }
          .footer-link:hover {
            text-decoration: underline;
          }
          .company-info {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
          }
          
          /* Mobile responsive */
          @media only screen and (max-width: 600px) {
            .email-wrapper { padding: 10px 0 !important; }
            .email-header { padding: 30px 20px 20px !important; }
            .email-body { padding: 30px 20px !important; }
            .email-footer { padding: 20px !important; }
            .logo-img { max-width: 160px !important; }
            .greeting { font-size: 16px !important; }
            .message-text { font-size: 15px !important; }
            .reset-button { 
              display: block;
              width: 100%;
              padding: 14px 20px !important;
              font-size: 15px !important;
            }
            .security-info { padding: 14px 16px !important; }
          }
          
          /* Dark mode support */
          @media (prefers-color-scheme: dark) {
            .email-container { background-color: #ffffff !important; }
            .email-header { background-color: #ffffff !important; }
            .email-body { background-color: #ffffff !important; }
            .email-footer { background-color: #f8f9fa !important; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <div class="email-container">
            <!-- Header with Logo -->
            <div class="email-header">
              <img src="${logoUrl}" alt="Clinlix Logo" class="logo-img" />
            </div>
            
            <!-- Main Content -->
            <div class="email-body">
              <p class="greeting">Hi ${profile?.first_name || 'there'},</p>
              
              <p class="message-text">
                We received a request to reset your Clinlix account password. If you made this request, click the button below to create a new password:
              </p>
              
              <div class="button-wrapper">
                <a href="${resetUrl}" class="reset-button">Reset My Password</a>
              </div>
              
              <div class="security-info">
                <p><strong>Important Security Information:</strong></p>
                <p>• This password reset link will expire in 1 hour</p>
                <p>• If you didn't request this reset, please ignore this email</p>
                <p>• Your password will remain unchanged unless you click the link above</p>
              </div>
              
              <p class="message-text">
                If you have any questions or concerns about your account security, please contact our support team immediately.
              </p>
            </div>
            
            <!-- Footer -->
            <div class="email-footer">
              <p class="footer-text">
                <strong>Having trouble with the button?</strong><br/>
                Copy and paste this link into your browser:
              </p>
              <p class="footer-text">
                <a href="${resetUrl}" class="footer-link">${resetUrl}</a>
              </p>
              
              <div class="company-info">
                <p class="footer-text">
                  <strong>Clinlix</strong><br/>
                  Professional Healthcare Cleaning Services<br/>
                  © 2025 Clinlix. All rights reserved.
                </p>
                <p class="footer-text">
                  This is an automated security email. Please do not reply to this message.
                </p>
              </div>
            </div>
          </div>
        </div>
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
