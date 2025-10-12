# Custom Email Templates Setup for Clinlix

This edge function sends custom branded emails with Clinlix logo for all authentication events (signup, password reset, magic link, invitations).

## Setup Instructions

### 1. Upload Clinlix Logo to Storage

First, upload your logo to the `avatars` bucket:
1. Go to Backend → Storage → avatars bucket
2. Upload `public/clinlix-logo.png` to the root of the bucket
3. Make sure the file is publicly accessible

### 2. Configure Resend API Key

1. Sign up at [resend.com](https://resend.com) if you don't have an account
2. Verify your email domain at [resend.com/domains](https://resend.com/domains)
3. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
4. Add the `RESEND_API_KEY` secret in Backend → Secrets

### 3. Generate Webhook Secret

Generate a secure random string for the webhook secret:
```bash
openssl rand -hex 32
```

Add this as `SEND_EMAIL_HOOK_SECRET` in Backend → Secrets

### 4. Add SITE_URL Secret

Add your production URL as `SITE_URL` in Backend → Secrets:
- For preview: Your Lovable preview URL
- For production: Your custom domain

### 5. Configure Auth Hook

In the Backend → Auth settings:
1. Go to "Hooks" section
2. Enable "Send Email Hook"
3. Set the endpoint to: `https://ctyulavksyguogudczpi.supabase.co/functions/v1/send-auth-email`
4. Add the `SEND_EMAIL_HOOK_SECRET` value

### 6. Update Sender Email (Optional)

In `supabase/functions/send-auth-email/index.ts`, update line 63:
```typescript
from: 'Clinlix <noreply@yourdomain.com>', // Change to your verified domain
```

## Email Templates Included

- **Magic Link**: Secure one-time login links
- **Email Confirmation**: New user signup verification
- **Password Reset**: Secure password recovery
- **Invite**: Team member invitations

All templates include:
- Clinlix branding and logo
- Consistent design matching your app
- Clear call-to-action buttons
- Security information
- Mobile-responsive layout

## Testing

After setup, test each email type:
1. Sign up with a new email → Confirmation email
2. Request password reset → Password reset email
3. Use magic link login → Magic link email
4. Invite a user (if applicable) → Invite email

## Troubleshooting

- **Logo not showing**: Ensure the logo is uploaded to the correct path in Storage and is publicly accessible
- **Emails not sending**: Check that RESEND_API_KEY is correct and domain is verified
- **Hook not working**: Verify SEND_EMAIL_HOOK_SECRET matches in both places
- **Wrong redirect URL**: Ensure SITE_URL is set correctly
