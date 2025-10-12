interface EmailTemplateProps {
  supabase_url: string;
  token?: string;
  token_hash: string;
  redirect_to: string;
  email_action_type: string;
}

const getBaseTemplate = (heading: string, content: string) => {
  const logoUrl = `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/avatars/clinlix-logo.png`;
  const siteUrl = Deno.env.get('SITE_URL') || 'https://clinlix.com';

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="margin: 0; padding: 0; background-color: #f6f9fc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f9fc; padding: 40px 20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; max-width: 600px;">
            <tr>
              <td style="padding: 40px 20px;">
                <!-- Logo -->
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom: 32px;">
                      <img src="${logoUrl}" alt="Clinlix" width="150" style="display: block; margin: 0 auto;">
                    </td>
                  </tr>
                </table>
                
                <!-- Heading -->
                <h1 style="color: #1a1a1a; font-size: 28px; font-weight: 700; margin: 32px 0 24px; padding: 0; text-align: center;">
                  ${heading}
                </h1>
                
                <!-- Content -->
                ${content}
                
                <!-- Footer -->
                <p style="color: #898989; font-size: 12px; line-height: 20px; margin-top: 32px; text-align: center;">
                  <a href="${siteUrl}" style="color: #898989; text-decoration: underline;">Clinlix</a> — Your trusted cleaning service platform
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};

const buttonStyle = 'background-color: #6C63FF; border-radius: 8px; color: #fff; font-size: 16px; font-weight: 600; text-decoration: none; text-align: center; display: block; padding: 14px 20px; margin: 24px 0;';
const textStyle = 'color: #333333; font-size: 16px; line-height: 24px; margin: 16px 0;';
const codeStyle = 'display: inline-block; padding: 16px; width: calc(100% - 34px); background-color: #f4f4f4; border-radius: 8px; border: 1px solid #e1e4e8; color: #333; font-size: 18px; font-weight: 600; letter-spacing: 2px; text-align: center; font-family: monospace; margin: 16px 0;';

export function getEmailTemplate(
  email_action_type: string,
  props: EmailTemplateProps
): { html: string; subject: string } {
  const { supabase_url, token, token_hash, redirect_to, email_action_type: actionType } = props;

  switch (email_action_type) {
    case 'magiclink': {
      const content = `
        <p style="${textStyle}">
          Click the button below to securely log in to your Clinlix account:
        </p>
        <a href="${supabase_url}/auth/v1/verify?token=${token_hash}&type=${actionType}&redirect_to=${redirect_to}" style="${buttonStyle}">
          Log In to Clinlix
        </a>
        <p style="${textStyle}">
          Or, copy and paste this temporary login code:
        </p>
        <code style="${codeStyle}">${token}</code>
        <p style="${textStyle}color: #666666; font-size: 14px; margin-top: 24px;">
          This link will expire in 1 hour. If you didn't request this login link, you can safely ignore this email.
        </p>
      `;
      return {
        html: getBaseTemplate('Welcome Back!', content),
        subject: 'Log in to Clinlix',
      };
    }

    case 'signup': {
      const content = `
        <p style="${textStyle}">
          Thank you for signing up with Clinlix! Please confirm your email address to get started with our cleaning services.
        </p>
        <a href="${supabase_url}/auth/v1/verify?token=${token_hash}&type=signup&redirect_to=${redirect_to}" style="${buttonStyle}">
          Confirm Email Address
        </a>
        <p style="${textStyle}color: #666666; font-size: 14px; margin-top: 24px;">
          If you didn't create a Clinlix account, you can safely ignore this email.
        </p>
      `;
      return {
        html: getBaseTemplate('Confirm Your Email', content),
        subject: 'Confirm your Clinlix account',
      };
    }

    case 'recovery': {
      const content = `
        <p style="${textStyle}">
          We received a request to reset your Clinlix account password. Click the button below to create a new password:
        </p>
        <a href="${supabase_url}/auth/v1/verify?token=${token_hash}&type=recovery&redirect_to=${redirect_to}" style="${buttonStyle}">
          Reset Password
        </a>
        <p style="${textStyle}color: #666666; font-size: 14px; margin-top: 24px;">
          This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
        </p>
      `;
      return {
        html: getBaseTemplate('Reset Your Password', content),
        subject: 'Reset your Clinlix password',
      };
    }

    case 'invite': {
      const content = `
        <p style="${textStyle}">
          You've been invited to join Clinlix, the trusted platform for cleaning services. Click the button below to accept your invitation and set up your account:
        </p>
        <a href="${supabase_url}/auth/v1/verify?token=${token_hash}&type=invite&redirect_to=${redirect_to}" style="${buttonStyle}">
          Accept Invitation
        </a>
        <p style="${textStyle}color: #666666; font-size: 14px; margin-top: 24px;">
          This invitation link will expire in 24 hours. If you didn't expect this invitation, you can safely ignore this email.
        </p>
      `;
      return {
        html: getBaseTemplate("You're Invited!", content),
        subject: "You've been invited to Clinlix",
      };
    }

    default: {
      // Fallback to magic link
      const content = `
        <p style="${textStyle}">
          Click the button below to securely access your Clinlix account:
        </p>
        <a href="${supabase_url}/auth/v1/verify?token=${token_hash}&type=${actionType}&redirect_to=${redirect_to}" style="${buttonStyle}">
          Access Clinlix
        </a>
        <p style="${textStyle}color: #666666; font-size: 14px; margin-top: 24px;">
          If you didn't request this, you can safely ignore this email.
        </p>
      `;
      return {
        html: getBaseTemplate('Clinlix Authentication', content),
        subject: 'Clinlix Authentication',
      };
    }
  }
}
