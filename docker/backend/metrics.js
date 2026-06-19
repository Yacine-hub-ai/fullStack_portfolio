/**
 * metrics.js
 * ─────────────────────────────────────────────────────────────────
 * Configuration Prometheus pour l'API Portfolio.
 * Expose :
 *   - Métriques Node.js par défaut (heap, GC, event loop, …)
 *   - http_requests_total        : compteur par méthode/route/status
 *   - http_request_duration_ms   : histogramme de latence par route
 * ─────────────────────────────────────────────────────────────────
 */
import client from 'prom-client'

// ── Registre global ───────────────────────────────────────────
const register = new client.Registry()

// Métriques Node.js par défaut (heap, event loop lag, GC, fd…)
client.collectDefaultMetrics({
  register,
  prefix: 'portfolio_',   // préfixe pour distinguer les métriques de l'app
  labels: { app: 'portfolio-backend' },
})

// ── Compteur de requêtes HTTP ─────────────────────────────────
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Nombre total de requêtes HTTP reçues',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
})

// ── Histogramme de latence HTTP ───────────────────────────────
const httpRequestDurationMs = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Durée des requêtes HTTP en millisecondes',
  labelNames: ['method', 'route', 'status'],
  // Buckets adaptés à une API REST (en ms)
  buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000],
  registers: [register],
})

// ── Gauge : requêtes en cours ─────────────────────────────────
const httpRequestsInFlight = new client.Gauge({
  name: 'http_requests_in_flight',
  help: 'Nombre de requêtes HTTP en cours de traitement',
  labelNames: ['method'],
  registers: [register],
})

/**
 * Normalise une route Express pour éviter la cardinalité infinie.
 * Ex : /api/projets/6639ab12 → /api/projets/:id
 */
function normalizeRoute(req) {
  // Utilise la route Express si disponible (après le routeur)
  if (req.route) {
    const base = req.baseUrl || ''
    return base + req.route.path
  }
  // Fallback : remplacer les IDs MongoDB (ObjectId 24 hex) par :id
  return req.path.replace(/\/[a-f0-9]{24}/g, '/:id')
}

/**
 * Middleware Express qui mesure et enregistre les métriques HTTP.
 * À monter AVANT les routes : app.use(createMetricsMiddleware())
 */
function createMetricsMiddleware() {
  return (req, res, next) => {
    // Exclure /metrics lui-même pour éviter les métriques récursives
    if (req.path === '/metrics') return next()

    const startTime = Date.now()
    httpRequestsInFlight.inc({ method: req.method })

    // Capturer les métriques à la fin de la réponse
    res.on('finish', () => {
      const duration = Date.now() - startTime
      const route    = normalizeRoute(req)
      const labels   = { method: req.method, route, status: res.statusCode }

      httpRequestsTotal.inc(labels)
      httpRequestDurationMs.observe(labels, duration)
      httpRequestsInFlight.dec({ method: req.method })
    })

    next()
  }
}

/**
 * Handler Express pour GET /metrics
 * Retourne les métriques au format texte Prometheus (OpenMetrics).
 */
async function metricsHandler(req, res) {
  try {
    res.set('Content-Type', register.contentType)
    res.end(await register.metrics())
  } catch (err) {
    res.status(500).end(err.message)
  }
}

export { register, createMetricsMiddleware, metricsHandler }
