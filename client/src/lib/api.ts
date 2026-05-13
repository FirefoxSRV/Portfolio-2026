import emailjs from '@emailjs/browser';

const GITHUB_USERNAME = 'FirefoxSRV';
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

export async function sendContact(payload: { name: string; email: string; message: string }) {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    throw new Error('EmailJS env vars not configured');
  }

  const response = await emailjs.send(
    serviceId,
    templateId,
    {
      from_name: payload.name,
      from_email: payload.email,
      message: payload.message,
    },
    publicKey
  );

  return { ok: response.status === 200 };
}
