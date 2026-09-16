const GITHUB_USERNAME = 'FirefoxSRV';
const CONTACT_TO = 'shreyasvisweshwaran@gmail.com';
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

function getCached(key: string) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() });
}

export async function getGitHubStats() {
  const cached = getCached('github_stats');
  if (cached) return cached;

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}`),
      fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`),
    ]);

    if (!userRes.ok || !reposRes.ok) {
      throw new Error('github_unreachable');
    }

    const user = await userRes.json();
    const repos = await reposRes.json();

    // Compute total stars
    const total_stars = repos.reduce((sum: number, repo: any) => sum + (repo.stargazers_count || 0), 0);

    // Compute top languages
    const langCounts: { [key: string]: number } = {};
    repos.forEach((repo: any) => {
      if (repo.language) {
        langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
      }
    });
    const top_languages = Object.entries(langCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    // Get 6 most recent repos
    const recent = repos.slice(0, 6).map((repo: any) => ({
      name: repo.name,
      description: repo.description,
      url: repo.html_url,
      stars: repo.stargazers_count,
      forks: repo.forks_count,
      language: repo.language,
      updated_at: repo.updated_at,
    }));

    const result = {
      username: user.login,
      name: user.name,
      avatar: user.avatar_url,
      bio: user.bio,
      public_repos: user.public_repos,
      followers: user.followers,
      following: user.following,
      total_stars,
      top_languages,
      recent,
    };

    setCache('github_stats', result);
    return result;
  } catch (error) {
    throw error;
  }
}

export const CONTACT_SUBJECT = 'Someone messaged you on your personal website';

// FormSubmit forwards straight to CONTACT_TO — no account, no API key, no backend
// (this site is static on GitHub Pages). The very first submission makes FormSubmit
// email CONTACT_TO an activation link; nothing forwards until that link is clicked.
const CONTACT_ENDPOINT = `https://formsubmit.co/ajax/${CONTACT_TO}`;

export type SendResult = { ok: true } | { ok: false; reason: 'failed'; detail?: string };

/** Pre-filled mailto so a visitor can still deliver the message if the form service is down. */
export function contactMailto(payload: { name: string; email: string; message: string }) {
  const body = [
    payload.message,
    '',
    `From: ${payload.name}`,
    `Reply to: ${payload.email}`,
  ].join('\n');
  return `mailto:${CONTACT_TO}?subject=${encodeURIComponent(CONTACT_SUBJECT)}&body=${encodeURIComponent(body)}`;
}

export async function sendContact(payload: {
  name: string;
  email: string;
  message: string;
}): Promise<SendResult> {
  try {
    const res = await fetch(CONTACT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        _subject: CONTACT_SUBJECT,
        _template: 'box',
        _captcha: 'false',
        // Replies go to the visitor, not to the inbox that received it.
        _replyto: payload.email,
        name: payload.name,
        email: payload.email,
        message: payload.message,
      }),
    });

    const data = (await res.json().catch(() => null)) as
      | { success?: boolean | string; message?: string }
      | null;

    if (res.ok && String(data?.success) === 'true') return { ok: true };
    return { ok: false, reason: 'failed', detail: data?.message ?? `status ${res.status}` };
  } catch (error) {
    return {
      ok: false,
      reason: 'failed',
      detail: error instanceof Error ? error.message : 'network error',
    };
  }
}
