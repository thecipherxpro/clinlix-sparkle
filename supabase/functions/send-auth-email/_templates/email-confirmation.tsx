import { Link, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseLayout, button, text } from './base-layout.tsx';

interface EmailConfirmationProps {
  supabase_url: string;
  token_hash: string;
  redirect_to: string;
}

export const EmailConfirmation = ({
  supabase_url,
  token_hash,
  redirect_to,
}: EmailConfirmationProps) => (
  <BaseLayout preview="Confirm your Clinlix account" heading="Confirm Your Email">
    <Text style={text}>
      Thank you for signing up with Clinlix! Please confirm your email address to get started with our cleaning services.
    </Text>
    
    <Link
      href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=signup&redirect_to=${redirect_to}`}
      style={button}
    >
      Confirm Email Address
    </Link>

    <Text style={{ ...text, color: '#666666', fontSize: '14px', marginTop: '24px' }}>
      If you didn't create a Clinlix account, you can safely ignore this email.
    </Text>
  </BaseLayout>
);

export default EmailConfirmation;
