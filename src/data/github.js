const cache = new Map()
const BASE = 'https://api.github.com/repos/olavoshew'

async function safeFetch(url) {
  const res = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' }
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}: ${url}`)
  return res
}

async function fetchCommitCount(repo) {
  try {
    const res = await safeFetch(`${BASE}/${repo}/commits?per_page=1`)
    const link = res.headers.get('Link') || ''
    const match = link.match(/[?&]page=(\d+)>;\s*rel="last"/)
    if (match) return parseInt(match[1], 10)
    const data = await res.json()
    return Array.isArray(data) ? data.length : null
  } catch {
    return null
  }
}

export async function getProjectMeta(repo) {
  if (cache.has(repo)) return cache.get(repo)

  const result = { lastUpdated: null, commits: null }

  try {
    const [repoRes, commits] = await Promise.all([
      safeFetch(`${BASE}/${repo}`),
      fetchCommitCount(repo)
    ])

    const data = await repoRes.json()
    result.lastUpdated = data.pushed_at || data.updated_at || null
    result.commits = commits
  } catch {
    // return empty result, caller falls back to hardcoded values
  }

  cache.set(repo, result)
  return result
}
