import { sendVerificationRequestParams } from 'next-auth/providers/email';
import nodemailer from 'nodemailer';

export async function sendVerificationRequest(params: sendVerificationRequestParams) {
  const { identifier, url, provider } = params;

  const { host } = new URL(url);
  
  // For development, log the email link
  if (process.env.NODE_ENV === 'development') {
    console.log('Email verification link:', url);
  }

  const transport = nodemailer.createTransport({
    host: provider.server,
    port: provider.port,
    auth: {
      user: provider.auth.user,
      pass: provider.auth.pass,
    },
  });

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to ${host}`,
    text: `Sign in to ${host}\n${url}\n\nThis link will expire in 24 hours.`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>Sign in to BuzzMarket</h2>
        <p>Click the link below to sign in:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background: #0066cc; color: white; text-decoration: none; border-radius: 5px;">Sign In</a>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;">${url}</p>
        <p style="color: #666; font-size: 12px;">This link will expire in 24 hours.</p>
      </div>
    `,
  });

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
  }
}
