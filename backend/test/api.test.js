import assert from 'node:assert';
import test from 'node:test';
import app from '../src/app.js';

let server;
let baseUrl;

test.before(() => {
  return new Promise((resolve) => {
    // Start on ephemeral port for testing
    server = app.listen(0, () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      console.log(`[TEST SERVER] Running on ${baseUrl}`);
      resolve();
    });
  });
});

test.after(() => {
  return new Promise((resolve) => {
    server.close(() => {
      console.log('[TEST SERVER] Closed');
      resolve();
    });
  });
});

test('1. Health check returns healthy and verifies Supabase status', async () => {
  const res = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.status, 'healthy');
  assert.strictEqual(data.database.status, 'ok');
  assert.ok(data.database.latencyMs >= 0);
});

test('2. Contact form submission saves inquiry in Supabase database', async () => {
  const payload = {
    name: 'Rohan Sharma',
    email: 'rohan.artist.test@gmail.com',
    phone: '9876543210',
    message: 'Hello, I want to distribute my new Maithili album on 20+ platforms.',
  };

  const res = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  assert.strictEqual(res.status, 201);
  const data = await res.json();
  assert.strictEqual(data.success, true);
});

test('3. Authentication flow: Register, Login, Protected Profile with JWT', async () => {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const testEmail = `artist_test_${Date.now()}_${randomSuffix}@rkdigitalmedia.in`;
  const testPassword = 'StrongPassword123!';

  // Step A: Register
  const regRes = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Rakesh Verma',
      email: testEmail,
      phone: '7631350084',
      role: 'Independent Singer',
      password: testPassword,
    }),
  });

  assert.strictEqual(regRes.status, 201);
  const regData = await regRes.json();
  assert.strictEqual(regData.success, true);
  assert.ok(regData.user.artist_id);

  // Step B: Login
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  assert.strictEqual(loginRes.status, 200);
  const loginData = await loginRes.json();
  assert.strictEqual(loginData.success, true);
  assert.ok(loginData.session.access_token);

  const jwtToken = loginData.session.access_token;

  // Step C: Access Protected Profile
  const meRes = await fetch(`${baseUrl}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  assert.strictEqual(meRes.status, 200);
  const meData = await meRes.json();
  assert.strictEqual(meData.success, true);
  assert.strictEqual(meData.user.email, testEmail);

  // Step D: Create a Music Release under this user
  const trackRes = await fetch(`${baseUrl}/api/releases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    },
    body: JSON.stringify({
      title: 'Chhath Mahaparv Aarti',
      artist: 'Rakesh Verma',
      genre: 'Bhakti / Devotional',
      language: 'Bhojpuri / Maithili',
      platforms: ['Spotify', 'Apple Music', 'JioSaavn', 'Wynk'],
    }),
  });

  assert.strictEqual(trackRes.status, 201);
  const trackData = await trackRes.json();
  assert.strictEqual(trackData.success, true);
  assert.strictEqual(trackData.release.title, 'Chhath Mahaparv Aarti');
  assert.ok(trackData.release.track_id);
  assert.ok(trackData.release.isrc);

  // Step E: Get Releases for this user
  const getTracksRes = await fetch(`${baseUrl}/api/releases`, {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });

  assert.strictEqual(getTracksRes.status, 200);
  const getTracksData = await getTracksRes.json();
  assert.strictEqual(getTracksData.success, true);
  assert.strictEqual(getTracksData.count, 1);
  assert.strictEqual(getTracksData.releases[0].title, 'Chhath Mahaparv Aarti');
});

test('4. Security & Data Isolation: User A CANNOT see or access User B data', async () => {
  const ts = Date.now();
  // Create User A
  const emailA = `user_a_${ts}@rkdigital.in`;
  const emailB = `user_b_${ts}@rkdigital.in`;
  const pwd = 'SecurePassword123!';

  // Register User A
  const regA = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User A', email: emailA, password: pwd }),
  });
  const dataA = await regA.json();
  const tokenA = dataA.session.access_token;

  // Register User B
  const regB = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User B', email: emailB, password: pwd }),
  });
  const dataB = await regB.json();
  const tokenB = dataB.session.access_token;

  // User A creates a confidential track
  const trackA = await fetch(`${baseUrl}/api/releases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      title: 'Secret Album of User A',
      artist: 'User A',
      genre: 'Pop',
    }),
  });
  const trackDataA = await trackA.json();
  const trackIdA = trackDataA.release.id;

  // User B tries to view their releases -> MUST NOT CONTAIN User A's track
  const tracksBRes = await fetch(`${baseUrl}/api/releases`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  const tracksB = await tracksBRes.json();
  assert.strictEqual(tracksB.count, 0, 'User B must have 0 tracks, NOT seeing User A tracks');

  // User B tries to directly fetch User A's track by ID -> MUST BE 404 / Forbidden
  const directAccessRes = await fetch(`${baseUrl}/api/releases/${trackIdA}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  assert.strictEqual(
    directAccessRes.status,
    404,
    'User B must be rejected when attempting to access User A track'
  );
});
