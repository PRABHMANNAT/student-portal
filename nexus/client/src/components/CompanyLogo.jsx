import { useMemo, useState } from 'react';

const KNOWN_COMPANY_DOMAINS = {
  arc: 'arc.net',
  figma: 'figma.com',
  github: 'github.com',
  linear: 'linear.app',
  loom: 'loom.com',
  notion: 'notion.so',
  planetscale: 'planetscale.com',
  railway: 'railway.app',
  raycast: 'raycast.com',
  retool: 'retool.com',
  stripe: 'stripe.com',
  supabase: 'supabase.com',
  vercel: 'vercel.com'
};

function normalizeDomain(value = '') {
  if (!value) return '';

  try {
    return new URL(value).hostname.replace(/^www\./, '');
  } catch {
    return String(value)
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .split('/')[0]
      .trim();
  }
}

function getInitials(name = 'Company') {
  const words = name.trim().split(/\s+/).filter(Boolean);
  const initials = words.length > 1 ? `${words[0][0]}${words[1][0]}` : words[0]?.slice(0, 2);
  return (initials || 'CO').toUpperCase();
}

function findCompanyDomain({ company, domain, url, links }) {
  if (domain) return normalizeDomain(domain);

  const nameKey = String(company || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  if (KNOWN_COMPANY_DOMAINS[nameKey]) return KNOWN_COMPANY_DOMAINS[nameKey];

  const companyLink = (links || []).find((link) => /company|about|team|site|overview/i.test(link.kind || link.title || ''));
  const sourceUrl = companyLink?.url || url;
  if (sourceUrl) {
    const nextDomain = normalizeDomain(sourceUrl);
    if (nextDomain) return nextDomain;
  }

  return '';
}

export default function CompanyLogo({ company, domain, url, links, size = 'md', className = '' }) {
  const name = company || 'Company';
  const resolvedDomain = useMemo(
    () => findCompanyDomain({ company: name, domain, url, links }),
    [name, domain, url, links]
  );
  const [failed, setFailed] = useState(false);
  const logoUrl = resolvedDomain ? `https://logo.clearbit.com/${resolvedDomain}` : '';

  return (
    <span
      className={`company-logo company-logo-${size} ${failed || !logoUrl ? 'is-fallback' : ''} ${className}`.trim()}
      aria-label={`${name} logo`}
      title={`${name} logo`}
    >
      {logoUrl && !failed ? (
        <img src={logoUrl} alt="" loading="lazy" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        <span className="company-logo-fallback" aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </span>
  );
}
