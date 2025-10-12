import { Link, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseLayout, button, text } from './base-layout.tsx';

interface PasswordResetProps {
  supabase_url: string;
  token_hash: string;
  redirect_to: string;
}

export const PasswordReset = ({
  supabase_url,
  token_hash,
  redirect_to,
}: PasswordResetProps) => (
  <BaseLayout preview="Reset your Clinlix password" heading="Reset Your Password">
    <Text style={text}>
      We received a request to reset your Clinlix account password. Click the button below to create a new password:
    </Text>
    
    <Link
      href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=recovery&redirect_to=${redirect_to}`}
      style={button}
    >
      Reset Password
    </Link>

    <Text style={{ ...text, color: '#666666', fontSize: '14px', marginTop: '24px' }}>
      This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    </Text>
  </BaseLayout>
);

export default PasswordReset;
