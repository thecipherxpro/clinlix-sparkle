import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'https://esm.sh/resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string;

const getEmailTemplate = (
  type: string,
  token: string,
  tokenHash: string,
  redirectTo: string,
  supabaseUrl: string
) => {
  const confirmationUrl = `${supabaseUrl}/auth/v1/verify?token=${tokenHash}&type=${type}&redirect_to=${redirectTo}`;
  
  const baseStyles = `
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
  `;

  let subject = '';
  let title = '';
  let message = '';

  switch (type) {
    case 'signup':
      subject = 'Welcome to Clinlix - Confirm Your Email';
      title = 'Confirm Your Email';
      message = 'Thank you for signing up with Clinlix! Please confirm your email address by clicking the button below:';
      break;
    case 'magiclink':
      subject = 'Your Clinlix Login Link';
      title = 'Sign In to Clinlix';
      message = 'Click the button below to securely sign in to your Clinlix account:';
      break;
    case 'recovery':
      subject = 'Reset Your Clinlix Password';
      title = 'Reset Your Password';
      message = 'We received a request to reset your password. Click the button below to create a new password:';
      break;
    case 'invite':
      subject = 'You\'ve Been Invited to Clinlix';
      title = 'You\'ve Been Invited';
      message = 'You\'ve been invited to join Clinlix. Click the button below to accept your invitation:';
      break;
    default:
      subject = 'Clinlix Email Verification';
      title = 'Email Verification';
      message = 'Please verify your email address by clicking the button below:';
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>${subject}</title>
      <style>${baseStyles}</style>
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
                <h1 class="title">${title}</h1>
                <p class="text">${message}</p>
                
                <div class="button-container">
                  <a href="${confirmationUrl}" class="button">
                    ${type === 'recovery' ? 'Reset Password' : type === 'signup' ? 'Confirm Email' : 'Sign In'}
                  </a>
                </div>
                
                ${type === 'recovery' ? `
                  <p class="text" style="font-size: 14px; color: #718096;">
                    If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                  </p>
                ` : ''}
                
                <p class="text" style="font-size: 14px; color: #718096;">
                  This link will expire in 24 hours for security reasons.
                </p>
              </div>
              
              <div class="footer">
                <p class="footer-text">
                  © 2025 Clinlix. Professional Cleaning Services.
                </p>
                <p class="footer-link">
                  If the button doesn't work, copy and paste this link:<br/>
                  <a href="${confirmationUrl}">${confirmationUrl}</a>
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return { subject, html };
};

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 400 });
  }

  try {
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers);
    const wh = new Webhook(hookSecret);
    
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string;
      };
      email_data: {
        token: string;
        token_hash: string;
        redirect_to: string;
        email_action_type: string;
      };
    };

    console.log(`Sending ${email_action_type} email to ${user.email}`);

    const { subject, html } = getEmailTemplate(
      email_action_type,
      token,
      token_hash,
      redirect_to,
      Deno.env.get('SUPABASE_URL') ?? ''
    );

    const { error } = await resend.emails.send({
      from: 'Clinlix <onboarding@resend.dev>',
      to: [user.email],
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      throw error;
    }

    console.log(`Email sent successfully to ${user.email}`);

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in send-auth-email function:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message || 'Failed to send email',
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
