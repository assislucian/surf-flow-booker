import React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
  Img,
} from 'npm:@react-email/components@0.5.0'

interface AuthEmailProps {
  actionUrl: string
  subject: string
  greet: string
  instruction: string
  cta: string
  fallback: string
  ignore: string
}

export const AuthEmail = ({
  actionUrl,
  subject,
  greet,
  instruction,
  cta,
  fallback,
  ignore,
}: AuthEmailProps) => (
  <Html>
    <Head />
    <Preview>{subject}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={emoji}>🏄‍♂️</Text>
          <Heading style={h1}>Surfskate Hall</Heading>
          <Text style={subtitle}>{subject}</Text>
        </Section>
        
        <Section style={content}>
          <Text style={greeting}>{greet}</Text>
          <Text style={text}>{instruction}</Text>
          
          <Section style={buttonContainer}>
            <Button style={button} href={actionUrl}>
              {cta}
            </Button>
          </Section>
          
          <Text style={fallbackText}>{fallback}</Text>
          <Text style={linkText}>{actionUrl}</Text>
          <Text style={ignoreText}>{ignore}</Text>
        </Section>
        
        <Section style={footer}>
          <Text style={footerText}>Surfskate Hall • lifabrasil.com</Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default AuthEmail

const main = {
  backgroundColor: '#f8f9fa',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
}

const container = {
  maxWidth: '640px',
  margin: '0 auto',
  backgroundColor: '#ffffff',
  borderRadius: '14px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
  overflow: 'hidden',
}

const header = {
  background: 'linear-gradient(135deg, hsl(196,100%,28%) 0%, hsl(201,96%,40%) 100%)',
  padding: '32px',
  textAlign: 'center' as const,
  color: '#ffffff',
}

const emoji = {
  fontSize: '42px',
  margin: '0',
}

const h1 = {
  margin: '8px 0 0',
  fontSize: '24px',
  fontWeight: '700',
  color: '#ffffff',
}

const subtitle = {
  margin: '8px 0 0',
  opacity: '0.95',
  color: '#ffffff',
}

const content = {
  padding: '28px 28px 8px',
}

const greeting = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#1f2937',
  margin: '0 0 16px',
}

const text = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#1f2937',
  margin: '0 0 28px',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '28px 0',
}

const button = {
  backgroundColor: 'hsl(196,100%,28%)',
  background: 'linear-gradient(135deg, hsl(196,100%,28%) 0%, hsl(201,96%,40%) 100%)',
  color: '#ffffff',
  textDecoration: 'none',
  padding: '14px 24px',
  borderRadius: '999px',
  fontWeight: '600',
  display: 'inline-block',
}

const fallbackText = {
  color: '#6b7280',
  fontSize: '14px',
  margin: '24px 0 12px',
}

const linkText = {
  backgroundColor: '#f3f4f6',
  padding: '12px',
  borderRadius: '10px',
  wordBreak: 'break-all' as const,
  fontFamily: 'monospace',
  fontSize: '12px',
  color: '#374151',
  margin: '0 0 24px',
}

const ignoreText = {
  color: '#6b7280',
  fontSize: '12px',
  margin: '24px 0',
}

const footer = {
  padding: '16px 28px 28px',
  textAlign: 'center' as const,
}

const footerText = {
  color: '#9ca3af',
  fontSize: '12px',
  margin: '0',
}