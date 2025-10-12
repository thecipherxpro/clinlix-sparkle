import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { Resend } from 'https://esm.sh/resend@4.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string)
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

const getPasswordResetTemplate = (token: string, tokenHash: string, redirectTo: string, supabaseUrl: string) => {
  const resetLink = `${supabaseUrl}/auth/v1/verify?token=${tokenHash}&type=recovery&redirect_to=${redirectTo}`
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
              <img src="https://ctyulavksyguogudczpi.supabase.co/storage/v1/object/public/avatars/clinlix-logo.png" alt="Clinlix" style="height: 40px; margin-bottom: 20px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">Reset Your Password</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 24px;">
                We received a request to reset your password. Click the button below to create a new password:
              </p>
              
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 30px 0;">
                <tr>
                  <td style="border-radius: 6px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                    <a href="${resetLink}" target="_blank" style="display: inline-block; padding: 14px 40px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
              
              <p style="margin: 30px 0 10px; color: #666666; font-size: 14px; line-height: 20px;">
                Or copy and paste this link into your browser:
              </p>
              <p style="margin: 0 0 30px; color: #667eea; font-size: 14px; line-height: 20px; word-break: break-all;">
                ${resetLink}
              </p>
              
              <div style="padding: 20px; background-color: #f8f9fa; border-radius: 6px; border-left: 4px solid #667eea;">
                <p style="margin: 0; color: #666666; font-size: 14px; line-height: 20px;">
                  <strong style="color: #333333;">Security Tip:</strong> If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                </p>
              </div>
              
              <p style="margin: 30px 0 0; color: #999999; font-size: 12px; line-height: 18px;">
                This link will expire in 1 hour for security reasons.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; text-align: center;">
              <p style="margin: 0 0 10px; color: #666666; font-size: 14px;">
                <strong>Clinlix</strong> - Your Healthcare Service Platform
              </p>
              <p style="margin: 0; color: #999999; font-size: 12px;">
                © ${new Date().getFullYear()} Clinlix. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('not allowed', { status: 400 })
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers)
  const wh = new Webhook(hookSecret)
  
  try {
    const {
      user,
      email_data: { token, token_hash, redirect_to, email_action_type },
    } = wh.verify(payload, headers) as {
      user: {
        email: string
      }
      email_data: {
        token: string
        token_hash: string
        redirect_to: string
        email_action_type: string
      }
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    
    let html = ''
    let subject = ''
    
    if (email_action_type === 'recovery') {
      html = getPasswordResetTemplate(token, token_hash, redirect_to, supabaseUrl)
      subject = 'Reset Your Clinlix Password'
    } else {
      // For other types, use a simple default template
      html = `
        <h1>Clinlix Notification</h1>
        <p>Please click the link to verify your action:</p>
        <a href="${supabaseUrl}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}">Verify</a>
      `
      subject = 'Verify Your Email'
    }

    const { error } = await resend.emails.send({
      from: 'Clinlix <onboarding@resend.dev>',
      to: [user.email],
      subject,
      html,
    })
    
    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Email send error:', error)
    return new Response(
      JSON.stringify({
        error: {
          http_code: (error as any).code,
          message: (error as any).message,
        },
      }),
      {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  return new Response(JSON.stringify({}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
