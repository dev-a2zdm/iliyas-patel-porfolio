import http from 'http';
import app from './index.js';

async function runTests() {
  console.log('--- Starting Backend Integration & Validation Tests ---');

  // Let's create an HTTP server instance using the Express app on an ephemeral port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server listening on port ${port}`);

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ FAIL: ${name} ->`, err.message);
      failed++;
    }
  }

  // Test 1: GET /api/health
  await test('GET /api/health returns health status object', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data = await res.json();
    if (!data.service || data.service !== 'portfolio-backend-api') {
      throw new Error(`Unexpected response: ${JSON.stringify(data)}`);
    }
  });

  // Test 2: 404 handler
  await test('GET /api/nonexistent returns 404 with JSON error', async () => {
    const res = await fetch(`${baseUrl}/api/nonexistent`);
    if (res.status !== 404) {
      throw new Error(`Expected 404, got ${res.status}`);
    }
    const data = await res.json();
    if (data.success !== false) {
      throw new Error(`Expected success: false, got ${JSON.stringify(data)}`);
    }
  });

  // Test 3: POST /api/contact with empty body
  await test('POST /api/contact with empty payload fails validation (400)', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    if (res.status !== 400) {
      throw new Error(`Expected 400, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.errors || !data.errors.name || !data.errors.email || !data.errors.subject) {
      throw new Error(`Expected name, email, and subject errors, got ${JSON.stringify(data.errors)}`);
    }
  });

  // Test 4: POST /api/contact with invalid email
  await test('POST /api/contact with invalid email fails validation (400)', async () => {
    const res = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'John Doe',
        email: 'invalid-email-string',
        subject: 'SEO Project Inquiry',
        message: 'Hello Iliyas',
      }),
    });
    if (res.status !== 400) {
      throw new Error(`Expected 400, got ${res.status}`);
    }
    const data = await res.json();
    if (!data.errors || !data.errors.email) {
      throw new Error(`Expected email error, got ${JSON.stringify(data.errors)}`);
    }
  });

  // Test 5: POST /api/contact input sanitization
  await test('Input sanitization properly escapes HTML entities', async () => {
    const { validateContactInput } = await import('./validators/contactValidator.js');
    const result = validateContactInput({
      name: '<script>alert("hack")</script> Iliyas',
      email: 'Iliyas@Example.Com',
      subject: '<b>Audit Request</b>',
      message: 'Testing & verifying "quotes" and tags <img src=x onerror=alert(1)>',
    });

    if (!result.isValid) {
      throw new Error(`Validation unexpectedly failed: ${JSON.stringify(result.errors)}`);
    }
    if (result.sanitizedData.name.includes('<script>')) {
      throw new Error('Name was not escaped');
    }
    if (result.sanitizedData.email !== 'iliyas@example.com') {
      throw new Error(`Email was not normalized: ${result.sanitizedData.email}`);
    }
    if (result.sanitizedData.subject.includes('<b>')) {
      throw new Error('Subject was not escaped');
    }
  });

  server.closeAllConnections?.();
  await new Promise((resolve) => server.close(resolve));
  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
