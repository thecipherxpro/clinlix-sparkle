import { Link, Text } from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';
import { BaseLayout, button, text } from './base-layout.tsx';

interface InviteEmailProps {
  supabase_url: string;
  token_hash: string;
  redirect_to: string;
}

export const InviteEmail = ({
  supabase_url,
  token_hash,
  redirect_to,
}: InviteEmailProps) => (
  <BaseLayout preview="You've been invited to Clinlix" heading="You're Invited!">
    <Text style={text}>
      You've been invited to join Clinlix, the trusted platform for cleaning services. Click the button below to accept your invitation and set up your account:
    </Text>
    
    <Link
      href={`${supabase_url}/auth/v1/verify?token=${token_hash}&type=invite&redirect_to=${redirect_to}`}
      style={button}
    >
      Accept Invitation
    </Link>

    <Text style={{ ...text, color: '#666666', fontSize: '14px', marginTop: '24px' }}>
      This invitation link will expire in 24 hours. If you didn't expect this invitation, you can safely ignore this email.
    </Text>
  </BaseLayout>
);

export default InviteEmail;
