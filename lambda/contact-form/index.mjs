/* global fetch, process, console, URLSearchParams */
/**
 * AWS Lambda function for contact form
 * Sends emails via Brevo (Sendinblue) API
 * Includes reCAPTCHA v3 verification
 */

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const RECAPTCHA_THRESHOLD = 0.5;

// Validation constants
const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 10000;
const MAX_COMPANY_LENGTH = 200;
const ALLOWED_PROJECT_TYPES = ['architecture', 'ia', 'cloud', 'web', 'autre'];

// CORS - allowed origins whitelist
const ALLOWED_ORIGINS = [
  'https://blackholeconsulting.io',
  'https://www.blackholeconsulting.io',
  'http://localhost:4321',
  'http://localhost:4322',
];

function buildCorsHeaders(origin) {
  const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    Vary: 'Origin',
  };
}

export const handler = async (event) => {
  const origin = event.headers?.origin || event.headers?.Origin || '';
  const corsHeaders = buildCorsHeaders(origin);
  // HTTP API v2 uses requestContext.http.method
  const httpMethod = event.requestContext?.http?.method || event.httpMethod;

  // Handle CORS preflight
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  // Only allow POST
  if (httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse form data
    const body = JSON.parse(event.body);
    const { name, email, company, 'project-type': projectType, message, recaptchaToken } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Validate field lengths
    if (
      name.length > MAX_NAME_LENGTH ||
      email.length > MAX_EMAIL_LENGTH ||
      message.length > MAX_MESSAGE_LENGTH
    ) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Field exceeds maximum allowed length' }),
      };
    }

    if (company && company.length > MAX_COMPANY_LENGTH) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Company name exceeds maximum allowed length' }),
      };
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Validate project type against whitelist
    if (projectType && !ALLOWED_PROJECT_TYPES.includes(projectType)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid project type' }),
      };
    }

    // Verify reCAPTCHA token (if secret key is configured and origin is not localhost)
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const isLocalhost = origin.startsWith('http://localhost:');
    if (recaptchaSecretKey && !isLocalhost) {
      const recaptchaResult = await verifyRecaptcha(recaptchaToken, recaptchaSecretKey);
      if (!recaptchaResult.success) {
        console.warn('reCAPTCHA verification failed:', recaptchaResult.error);
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'reCAPTCHA verification failed' }),
        };
      }
      console.log(`reCAPTCHA score: ${recaptchaResult.score}`);
    } else if (isLocalhost) {
      console.log('reCAPTCHA verification skipped (localhost origin)');
    } else {
      console.log('reCAPTCHA verification skipped (no secret key configured)');
    }

    // Project type labels
    const projectLabels = {
      architecture: 'Architecture & Conseil',
      ia: 'IA & GenAI',
      cloud: 'Cloud & DevOps',
      web: 'Développement Web',
      autre: 'Autre',
    };

    const projectLabel = projectLabels[projectType] || 'Non spécifié';

    // Build email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">Nouveau message de contact</h2>
        <hr style="border: 1px solid #e5e7eb;" />

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Nom</td>
            <td style="padding: 10px 0; color: #4b5563;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Email</td>
            <td style="padding: 10px 0; color: #4b5563;">
              <a href="mailto:${escapeHtml(email)}" style="color: #6366f1;">${escapeHtml(email)}</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Société</td>
            <td style="padding: 10px 0; color: #4b5563;">${escapeHtml(company) || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold; color: #374151;">Type de projet</td>
            <td style="padding: 10px 0; color: #4b5563;">${projectLabel}</td>
          </tr>
        </table>

        <h3 style="color: #374151; margin-top: 20px;">Message</h3>
        <div style="background: #f9fafb; padding: 15px; border-radius: 8px; color: #4b5563; white-space: pre-wrap;">${escapeHtml(message)}</div>

        <hr style="border: 1px solid #e5e7eb; margin-top: 30px;" />
        <p style="color: #9ca3af; font-size: 12px;">
          Message envoyé depuis le formulaire de contact de blackholeconsulting.io
        </p>
      </div>
    `;

    // Send via Brevo API
    const response = await fetch(BREVO_API_URL, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: 'Black Hole Consulting',
          email: 'noreply@blackholeconsulting.io',
        },
        to: [
          {
            email: 'cedric@blkhole.fr',
            name: 'Cédric',
          },
        ],
        replyTo: {
          email: email,
          name: name,
        },
        subject: `[Contact] ${name} - ${projectLabel}`,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Brevo API error:', errorData);
      throw new Error('Failed to send email');
    }

    // Send Telegram notification (non-blocking)
    await sendTelegramNotification(name, email, company, projectLabel, message);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Send Telegram notification (best-effort, does not block response)
async function sendTelegramNotification(name, email, company, projectLabel, message) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.log('Telegram notification skipped (not configured)');
    return;
  }

  const text =
    `\u{1F4E7} Nouveau contact\n\n` +
    `\u{1F464} Nom : ${name}\n` +
    `\u{1F4E9} Email : ${email}\n` +
    `\u{1F3E2} Société : ${company || '-'}\n` +
    `\u{1F4CB} Projet : ${projectLabel}\n\n` +
    `\u{1F4AC} Message :\n${message}`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.warn('Telegram API error:', err);
    } else {
      console.log('Telegram notification sent');
    }
  } catch (error) {
    console.warn('Telegram notification failed:', error.message);
  }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Verify reCAPTCHA v3 token
async function verifyRecaptcha(token, secretKey) {
  if (!token) {
    return { success: false, error: 'No token provided' };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secretKey);
    params.append('response', token);

    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    const data = await response.json();

    if (!data.success) {
      return { success: false, error: data['error-codes']?.join(', ') || 'Verification failed' };
    }

    // Check score threshold (reCAPTCHA v3 returns 0.0 - 1.0)
    if (data.score < RECAPTCHA_THRESHOLD) {
      return { success: false, error: `Score too low: ${data.score}`, score: data.score };
    }

    // Verify action matches
    if (data.action !== 'contact_form') {
      return { success: false, error: `Invalid action: ${data.action}` };
    }

    return { success: true, score: data.score };
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return { success: false, error: 'Verification request failed' };
  }
}
