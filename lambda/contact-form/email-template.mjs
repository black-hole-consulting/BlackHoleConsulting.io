/**
 * Email templates for the contact form.
 * - buildEmailHtml: Outlook-friendly HTML email (table layout, inline CSS, dark-mode aware)
 * - buildEmailText: plain-text fallback synchronised with the HTML version
 *
 * Inputs are assumed to be raw user content; the HTML builder escapes them.
 */

const BRAND = {
  name: 'Black Hole Consulting',
  domain: 'blackholeconsulting.io',
  url: 'https://blackholeconsulting.io',
  location: 'Tours, France',
  accent: '#6366f1',
  accentDeep: '#4f46e5',
  gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
};

const PROJECT_LABELS = {
  architecture: 'Architecture & Conseil',
  ia: 'IA & GenAI',
  cloud: 'Cloud & DevOps',
  web: 'Développement Web',
  autre: 'Autre',
};

const PROJECT_TAG_COLORS = {
  architecture: { bg: '#eef2ff', text: '#4338ca', border: '#c7d2fe' },
  ia: { bg: '#fdf4ff', text: '#a21caf', border: '#f5d0fe' },
  cloud: { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
  web: { bg: '#ecfdf5', text: '#047857', border: '#a7f3d0' },
  autre: { bg: '#f3f4f6', text: '#374151', border: '#e5e7eb' },
};

function escapeHtml(text) {
  if (text === undefined || text === null) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return String(text).replace(/[&<>"']/g, (m) => map[m]);
}

function formatTimestamp(date = new Date()) {
  const formatter = new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
    timeZone: 'Europe/Paris',
  });
  return formatter.format(date);
}

function projectLabelFor(projectType) {
  return PROJECT_LABELS[projectType] || 'Non spécifié';
}

function projectTagColors(projectType) {
  return PROJECT_TAG_COLORS[projectType] || PROJECT_TAG_COLORS.autre;
}

/**
 * Build the subject line. Includes the company when available so the inbox
 * preview reveals priority at a glance.
 */
export function buildSubject({ name, company, projectType }) {
  const label = projectLabelFor(projectType);
  const who = company ? `${name} (${company})` : name;
  return `[Contact] ${who} · ${label}`;
}

/**
 * Build the preheader (preview text). Hidden in body but rendered by mail
 * clients in the inbox list.
 */
function buildPreheader({ projectType, company, message }) {
  const label = projectLabelFor(projectType);
  const where = company || 'Indépendant';
  const snippet = String(message || '')
    .replace(/\s+/g, ' ')
    .slice(0, 90);
  return `${label} • ${where} • ${snippet}…`;
}

export function buildEmailText(data) {
  const {
    name,
    email,
    company,
    projectType,
    message,
    recaptchaScore,
    receivedAt = new Date(),
  } = data;
  const lines = [
    'Nouveau message de contact',
    '==========================',
    '',
    `De : ${name} <${email}>`,
  ];
  if (company) lines.push(`Société : ${company}`);
  lines.push(`Type de projet : ${projectLabelFor(projectType)}`);
  lines.push(`Reçu le : ${formatTimestamp(receivedAt)} (Europe/Paris)`);
  if (typeof recaptchaScore === 'number') {
    lines.push(`Score reCAPTCHA : ${recaptchaScore.toFixed(2)} / 1.00`);
  }
  lines.push('', '---', '', String(message || '').trim(), '', '---', '');
  lines.push(`Répondre : mailto:${email}`);
  lines.push('Réserver un appel : https://calendly.com/cedric-blkhole/30min');
  lines.push('');
  lines.push(`${BRAND.name} · ${BRAND.location} · ${BRAND.url}`);
  return lines.join('\n');
}

export function buildEmailHtml(data) {
  const {
    name,
    email,
    company,
    projectType,
    message,
    recaptchaScore,
    receivedAt = new Date(),
  } = data;

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    company: company ? escapeHtml(company) : '',
    message: escapeHtml(message).replace(/\n/g, '<br />'),
  };
  const projectLabel = escapeHtml(projectLabelFor(projectType));
  const tag = projectTagColors(projectType);
  const preheader = escapeHtml(buildPreheader(data));
  const timestamp = escapeHtml(formatTimestamp(receivedAt));
  const replyHref = `mailto:${safe.email}?subject=${encodeURIComponent(
    `Re: ${projectLabelFor(projectType)}`
  )}`;
  const calendlyHref = 'https://calendly.com/cedric-blkhole/30min';
  const scoreLine =
    typeof recaptchaScore === 'number'
      ? `<span style="color:#9ca3af;font-size:11px;">Score anti-spam : <strong style="color:#374151;">${recaptchaScore.toFixed(
          2
        )}</strong> / 1.00</span>`
      : '';

  return `<!DOCTYPE html>
<html lang="fr" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>${projectLabel} – ${safe.name}</title>
  <style>
    @media (prefers-color-scheme: dark) {
      .bg-page { background-color: #0a0a0b !important; }
      .bg-card { background-color: #141416 !important; }
      .bg-muted { background-color: #1c1c1f !important; }
      .text-primary { color: #fafafa !important; }
      .text-secondary { color: #a1a1aa !important; }
      .text-muted { color: #71717a !important; }
      .border-soft { border-color: #27272a !important; }
      .row-divider { border-color: #27272a !important; }
    }
    @media (max-width: 480px) {
      .container-table { width: 100% !important; }
      .px-mobile { padding-left: 20px !important; padding-right: 20px !important; }
      .stack-btn { display: block !important; width: 100% !important; margin-bottom: 8px !important; }
    }
  </style>
</head>
<body class="bg-page" style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#18181b;-webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f4f5;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg-page" style="background-color:#f4f4f5;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container-table bg-card" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header gradient -->
          <tr>
            <td style="background:${BRAND.gradient};padding:28px 32px;" class="px-mobile">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="color:rgba(255,255,255,0.85);font-size:11px;letter-spacing:0.12em;text-transform:uppercase;font-weight:600;">
                    ${escapeHtml(BRAND.name)} · Formulaire de contact
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:8px;color:#ffffff;font-size:22px;font-weight:600;line-height:1.3;">
                    Nouveau message reçu
                  </td>
                </tr>
                <tr>
                  <td style="padding-top:6px;color:rgba(255,255,255,0.85);font-size:13px;">
                    ${timestamp} (Europe/Paris)
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Identity card -->
          <tr>
            <td class="px-mobile" style="padding:28px 32px 8px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-size:18px;font-weight:600;color:#18181b;" class="text-primary">
                    ${safe.name}
                  </td>
                  <td align="right" style="vertical-align:top;">
                    <span style="display:inline-block;padding:4px 10px;font-size:11px;font-weight:600;border-radius:9999px;background-color:${tag.bg};color:${tag.text};border:1px solid ${tag.border};">
                      ${projectLabel}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding-top:4px;font-size:14px;color:#52525b;" class="text-secondary">
                    <a href="mailto:${safe.email}" style="color:${BRAND.accent};text-decoration:none;">${safe.email}</a>${
                      safe.company ? ` · ${safe.company}` : ''
                    }
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTAs -->
          <tr>
            <td class="px-mobile" style="padding:16px 32px 8px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="stack-btn" style="padding-right:8px;">
                    <a href="${replyHref}" style="display:inline-block;padding:10px 18px;background:${BRAND.gradient};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:8px;">
                      Répondre par email
                    </a>
                  </td>
                  <td class="stack-btn">
                    <a href="${calendlyHref}" style="display:inline-block;padding:10px 18px;background:#ffffff;color:${BRAND.accentDeep};font-size:14px;font-weight:600;text-decoration:none;border:1px solid ${BRAND.accent};border-radius:8px;">
                      Réserver un appel
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td class="px-mobile" style="padding:24px 32px 0 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid #e5e7eb;line-height:1px;font-size:1px;" class="row-divider">&nbsp;</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td class="px-mobile" style="padding:20px 32px 8px 32px;">
              <div style="font-size:11px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#71717a;" class="text-muted">
                Message
              </div>
              <div class="bg-muted" style="margin-top:10px;padding:18px 20px;background-color:#f9fafb;border-left:3px solid ${BRAND.accent};border-radius:6px;font-size:15px;line-height:1.6;color:#27272a;white-space:pre-wrap;" >
                ${safe.message || '<em style="color:#9ca3af;">Aucun contenu</em>'}
              </div>
            </td>
          </tr>

          <!-- Technical footer -->
          <tr>
            <td class="px-mobile" style="padding:24px 32px 28px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid #e5e7eb;padding-top:14px;font-size:11px;color:#9ca3af;" class="row-divider text-muted">
                    ${scoreLine}
                    ${scoreLine ? '<br />' : ''}
                    Email envoyé via le formulaire de contact de
                    <a href="${BRAND.url}" style="color:#9ca3af;text-decoration:underline;">${escapeHtml(BRAND.domain)}</a>.
                    Pour répondre directement à ${safe.name}, utilisez le bouton ci-dessus
                    ou répondez à cet email (Reply-To configuré).
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <!-- Brand footer outside the card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="container-table" style="width:600px;max-width:600px;">
          <tr>
            <td align="center" style="padding:18px 16px;font-size:11px;color:#9ca3af;" class="text-muted">
              ${escapeHtml(BRAND.name)} · ${escapeHtml(BRAND.location)} ·
              <a href="${BRAND.url}" style="color:#9ca3af;text-decoration:underline;">${escapeHtml(BRAND.domain)}</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const __test__ = { escapeHtml, projectLabelFor };
