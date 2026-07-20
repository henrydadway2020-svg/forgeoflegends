// Todas las lecturas públicas se hacen contra raw.githubusercontent.com (sin token,
// sin límite de CORS). Las escrituras (solo desde /admin) usan la API de contenidos
// de GitHub y requieren un Personal Access Token con permiso "repo" (o "contents: write"
// si es un fine-grained token). El token nunca se guarda: vive solo en memoria de la
// sesión del navegador (sessionStorage) mientras el admin tiene la pestaña abierta.

export function rawUrl(owner, repo, branch, path) {
  // Se agrega un parámetro de cache-busting para evitar el cacheo agresivo de
  // raw.githubusercontent.com (~5 min de CDN).
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}?t=${Date.now()}`
}

export async function fetchJSON(owner, repo, branch, path, { fallback = null } = {}) {
  try {
    const res = await fetch(rawUrl(owner, repo, branch, path))
    if (!res.ok) throw new Error(`No se pudo leer ${path} (HTTP ${res.status})`)
    return await res.json()
  } catch (err) {
    console.warn(`[github] usando datos locales para ${path}:`, err.message)
    return fallback
  }
}

async function getFileSha(owner, repo, path, branch, token) {
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
    { headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' } }
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`No se pudo obtener el sha de ${path} (HTTP ${res.status})`)
  const data = await res.json()
  return data.sha
}

function toBase64Unicode(str) {
  return btoa(unescape(encodeURIComponent(str)))
}

export async function writeJSON({ owner, repo, branch, token, path, data, message }) {
  if (!token) throw new Error('Falta el GitHub Token para guardar cambios.')
  const sha = await getFileSha(owner, repo, path, branch, token)
  const content = toBase64Unicode(JSON.stringify(data, null, 2))
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: message || `Actualizar ${path}`,
      content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  })
  if (!res.ok) {
    const body = await res.text()
    throw new Error(`No se pudo guardar ${path} (HTTP ${res.status}): ${body}`)
  }
  return res.json()
}
