import { Link, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseLayout, button, code, link, text } from './base-layout.tsx';

interface MagicLinkEmailProps {
  supabase_url: string;
  email_action_type: string;
  redirect_to: string;
  token_hash: string;
  token: string;
}

export const MagicLinkEmail = ({
  token,
  supabase_url,
  email_action_type,
  redirect_to,
  token_hash,
}: MagicLinkEmailProps) => (
  <BaseLayout preview="Log in to Clinlix" heading="Welcome Back!">
    <Text style={text}>
      Click the button below to securely log in to your Clinlix account:
    </Text>
    
    <Link
      href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`}
      style={button}
    >
      Log In to Clinlix
    </Link>

    <Text style={{ ...text, marginTop: '24px' }}>
      Or, copy and paste this temporary login code:
    </Text>
    
    <code style={code}>{token}</code>

    <Text style={{ ...text, color: '#666666', fontSize: '14px', marginTop: '24px' }}>
      This link will expire in 1 hour. If you didn't request this login link, you can safely ignore this email.
    </Text>
  </BaseLayout>
);

export default MagicLinkEmail;
