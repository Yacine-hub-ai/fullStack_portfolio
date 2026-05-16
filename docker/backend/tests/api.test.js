/**
 * Tests API — portfolio-backend
 * Ces tests s'exécutent contre l'API démarrée (dans le container Docker).
 * Ils vérifient les endpoints sans dépendance directe à Mongoose.
 *
 * Usage : NODE_ENV=test API_URL=http://localhost:3001 node --test tests/api.test.js
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'

const BASE = process.env.API_URL || 'http://localhost:3001'

describe('GET /', () => {
  it('répond avec HTTP 200 et succes: true', async () => {
    const res = await fetch(`${BASE}/`)
    const body = await res.json()
    assert.equal(res.status, 200)
    assert.equal(body.succes, true)
    assert.equal(body.message, 'API Portfolio opérationnelle')
  })
})

describe('GET /api/projets', () => {
  it('répond avec HTTP 200 et un tableau data', async () => {
    const res = await fetch(`${BASE}/api/projets`)
    const body = await res.json()
    assert.equal(res.status, 200)
    assert.equal(body.succes, true)
    assert.ok(Array.isArray(body.data))
  })
})

describe('GET /route-inexistante', () => {
  it('répond avec HTTP 404 et succes: false', async () => {
    const res = await fetch(`${BASE}/route-inexistante`)
    const body = await res.json()
    assert.equal(res.status, 404)
    assert.equal(body.succes, false)
  })
})

describe('POST /api/projets', () => {
  it('répond avec HTTP 400 si libelle ou description manquant', async () => {
    const res = await fetch(`${BASE}/api/projets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ libelle: 'Test sans description' })
    })
    const body = await res.json()
    assert.equal(res.status, 400)
    assert.equal(body.succes, false)
  })
})
