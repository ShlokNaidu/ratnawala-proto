const nodemailer = require('nodemailer');

/**
 * Lazy transporter — created on first use so missing env vars at
 * startup don't crash the whole server process.
 * If SMTP credentials aren't set, email silently no-ops.
 */
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  // Guard: if SMTP is not configured, return null — callers will no-op
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS ||
      SMTP_USER === 'your_gmail@gmail.com') {
    return null;
  }

  _transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: false,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  return _transporter;
}

/**
 * Send enquiry notification to admin.
 * Silently no-ops when SMTP is not configured.
 */
exports.sendEnquiryNotification = async (enquiry) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.info('[mailer] SMTP not configured — skipping enquiry notification');
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Ratnawala <noreply@ratnawala.com>',
    to: process.env.ADMIN_EMAIL,
    subject: `New Enquiry — ${enquiry.gemName || enquiry.gemSlug} — ${enquiry.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF6F0; border: 1px solid #C9A84C22;">
        <h2 style="color: #2C1A0E; border-bottom: 1px solid #C9A84C; padding-bottom: 12px;">
          New Gem Enquiry — Ratnawala
        </h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          ${[
            ['Customer', enquiry.name],
            ['Phone', enquiry.phone],
            ['Email', enquiry.email || '—'],
            ['Gemstone', `${enquiry.gemName} (${enquiry.gemSlug})`],
            ['Mine', enquiry.mine || '—'],
            ['Quality', enquiry.quality || '—'],
            ['Weight', enquiry.weight ? `${enquiry.weight} cts` : '—'],
            ['Budget', enquiry.budget ? `₹${enquiry.budget.toLocaleString('en-IN')}` : '—'],
            ['Purpose', enquiry.purpose],
          ].map(([k, v]) => `
            <tr style="border-bottom: 1px solid #F2EBE0;">
              <td style="padding: 10px 0; color: #8A7060; font-size: 13px; width: 35%;">${k}</td>
              <td style="padding: 10px 0; color: #2C1A0E; font-size: 14px;"><strong>${v}</strong></td>
            </tr>
          `).join('')}
        </table>
        ${enquiry.message ? `
          <div style="margin-top: 20px; padding: 16px; background: #F2EBE0; border-left: 3px solid #C9A84C;">
            <p style="color: #4A2F1A; margin: 0;">${enquiry.message}</p>
          </div>
        ` : ''}
        <p style="margin-top: 24px; color: #8A7060; font-size: 12px;">
          Received at ${new Date(enquiry.createdAt).toLocaleString('en-IN')} via Ratnawala website
        </p>
      </div>
    `,
  });
};

/**
 * Send confirmation email to customer.
 * Silently no-ops when SMTP not configured or customer has no email.
 */
exports.sendEnquiryConfirmation = async (enquiry) => {
  if (!enquiry.email) return;
  const transporter = getTransporter();
  if (!transporter) return;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'Ratnawala <noreply@ratnawala.com>',
    to: enquiry.email,
    subject: `Enquiry Received — Ratnawala`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #FAF6F0;">
        <h2 style="color: #2C1A0E;">Dear ${enquiry.name},</h2>
        <p style="color: #4A2F1A; line-height: 1.8;">
          We have received your enquiry for <strong>${enquiry.gemName}</strong>.
          Our expert gemologist team will review your requirements and contact you within 24 hours on
          <strong>${enquiry.phone}</strong>.
        </p>
        <p style="color: #8A7060; font-size: 13px; margin-top: 24px;">
          — Team Ratnawala · Est. 2019 · Indore
        </p>
      </div>
    `,
  });
};
