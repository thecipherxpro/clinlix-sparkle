import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22';
import * as React from 'npm:react@18.3.1';

interface BaseLayoutProps {
  preview: string;
  heading: string;
  children: React.ReactNode;
}

export const BaseLayout = ({ preview, heading, children }: BaseLayoutProps) => (
  <Html>
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Clinlix Logo */}
        <Section style={logoSection}>
          <Img
            src={`${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/avatars/clinlix-logo.png`}
            width="150"
            height="auto"
            alt="Clinlix"
            style={logo}
          />
        </Section>

        <Heading style={h1}>{heading}</Heading>
        
        {children}

        <Text style={footer}>
          <Link
            href={Deno.env.get('SITE_URL') || 'https://clinlix.com'}
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Clinlix
          </Link>
          {' '}— Your trusted cleaning service platform
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '40px 20px',
  borderRadius: '8px',
  maxWidth: '600px',
};

const logoSection = {
  textAlign: 'center' as const,
  marginBottom: '32px',
};

const logo = {
  margin: '0 auto',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '28px',
  fontWeight: '700',
  margin: '32px 0 24px',
  padding: '0',
  textAlign: 'center' as const,
};

export const link = {
  color: '#6C63FF',
  fontSize: '14px',
  textDecoration: 'underline',
};

export const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

export const footer = {
  color: '#898989',
  fontSize: '12px',
  lineHeight: '20px',
  marginTop: '32px',
  textAlign: 'center' as const,
};

export const code = {
  display: 'inline-block',
  padding: '16px',
  width: '100%',
  backgroundColor: '#f4f4f4',
  borderRadius: '8px',
  border: '1px solid #e1e4e8',
  color: '#333',
  fontSize: '18px',
  fontWeight: '600',
  letterSpacing: '2px',
  textAlign: 'center' as const,
  fontFamily: 'monospace',
};

export const button = {
  backgroundColor: '#6C63FF',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 20px',
  margin: '24px 0',
};
