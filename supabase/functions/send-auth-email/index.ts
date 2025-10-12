import React from 'npm:react@18.3.1';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@4.0.0';
import { renderAsync } from 'npm:@react-email/components@0.0.22';
import { MagicLinkEmail } from './_templates/magic-link.tsx';
import { EmailConfirmation } from './_templates/email-confirmation.tsx';
import { PasswordReset } from './_templates/password-reset.tsx';
import { InviteEmail } from './_templates/invite.tsx';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);
const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
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

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const siteUrl = redirect_to || Deno.env.get('SITE_URL') || supabaseUrl;

    // Determine which template to use based on email_action_type
    let emailComponent;
    let subject = '';

    switch (email_action_type) {
      case 'magiclink':
        emailComponent = React.createElement(MagicLinkEmail, {
          supabase_url: supabaseUrl,
          token,
          token_hash,
          redirect_to: siteUrl,
          email_action_type,
        });
        subject = 'Log in to Clinlix';
        break;

      case 'signup':
        emailComponent = React.createElement(EmailConfirmation, {
          supabase_url: supabaseUrl,
          token_hash,
          redirect_to: siteUrl,
        });
        subject = 'Confirm your Clinlix account';
        break;

      case 'recovery':
        emailComponent = React.createElement(PasswordReset, {
          supabase_url: supabaseUrl,
          token_hash,
          redirect_to: siteUrl,
        });
        subject = 'Reset your Clinlix password';
        break;

      case 'invite':
        emailComponent = React.createElement(InviteEmail, {
          supabase_url: supabaseUrl,
          token_hash,
          redirect_to: siteUrl,
        });
        subject = "You've been invited to Clinlix";
        break;

      default:
        // Fallback to magic link template
        emailComponent = React.createElement(MagicLinkEmail, {
          supabase_url: supabaseUrl,
          token,
          token_hash,
          redirect_to: siteUrl,
          email_action_type,
        });
        subject = 'Clinlix Authentication';
    }

    const html = await renderAsync(emailComponent);

    const { error } = await resend.emails.send({
      from: 'Clinlix <onboarding@resend.dev>', // Change to your verified domain
      to: [user.email],
      subject,
      html,
    });

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({
        error: {
          message: error.message,
        },
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
