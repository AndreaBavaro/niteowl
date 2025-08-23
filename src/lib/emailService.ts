// Email notification service for waitlist signups
// You can integrate this with services like Resend, SendGrid, or Nodemailer

interface WaitlistSignup {
  name: string;
  email: string;
  phone: string;
  referral_code: string;
  position: number;
  tier: string;
}

export async function sendWaitlistNotification(signup: WaitlistSignup) {
  // For now, we'll log to console. You can replace this with your preferred email service
  console.log(`
    🎉 NEW NITEFINDER WAITLIST SIGNUP 🎉
    ====================================
    Name: ${signup.name}
    Email: ${signup.email}
    Phone: ${signup.phone}
    Referral Code: ${signup.referral_code}
    Position: ${signup.position}
    Tier: ${signup.tier}
    Signup Time: ${new Date().toISOString()}
    ====================================
  `);

  // TODO: Implement actual email sending
  // Example with Resend:
  /*
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'notifications@nitefinder.com',
    to: ['admin@nitefinder.com'],
    subject: '🎉 New NiteFinder Waitlist Signup',
    html: `
      <h2>New Waitlist Signup</h2>
      <p><strong>Name:</strong> ${signup.name}</p>
      <p><strong>Email:</strong> ${signup.email}</p>
      <p><strong>Phone:</strong> ${signup.phone}</p>
      <p><strong>Position:</strong> ${signup.position}</p>
      <p><strong>Referral Code:</strong> ${signup.referral_code}</p>
      <p><strong>Tier:</strong> ${signup.tier}</p>
    `,
  });
  */
}

export async function sendWelcomeEmail(signup: WaitlistSignup) {
  // Welcome email to the new signup
  console.log(`Sending welcome email to ${signup.email}`);
  
  // TODO: Implement welcome email
  // This would send a personalized welcome email to the user with:
  // - Their position on the waitlist
  // - Their referral code
  // - Information about the tier system
  // - What to expect next
}
