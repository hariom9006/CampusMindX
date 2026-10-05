import http from 'node:http';

async function request(path, method, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
        ...headers
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseBody);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== CAMPUSMIND X AUTHENTICATION TEST SUITE ===');

  const testEmail = `student_${Date.now()}@university.edu`;
  const password = 'StrongPassword123!';

  // 1. Registration
  console.log('\n[TEST 1] Registering real student user...');
  const regRes = await request('/api/auth/register', 'POST', {
    name: 'Hariom Anand',
    email: testEmail,
    password: password,
    role: 'student'
  });
  console.log('Status:', regRes.status);
  console.log('Success:', regRes.body.success, '| User:', regRes.body.user?.name, '| Role:', regRes.body.user?.role);
  if (!regRes.body.token) throw new Error('Registration failed to return token');

  // 2. Duplicate Email Check
  console.log('\n[TEST 2] Testing duplicate email registration rejection...');
  const dupRes = await request('/api/auth/register', 'POST', {
    name: 'Duplicate Hariom',
    email: testEmail,
    password: password,
    role: 'student'
  });
  console.log('Status:', dupRes.status);
  console.log('Error message:', dupRes.body.message);
  if (dupRes.status !== 400 && dupRes.status !== 409) throw new Error('Duplicate email not properly rejected');

  // 3. Admin Registration Prevention
  console.log('\n[TEST 3] Testing public admin registration rejection...');
  const adminRes = await request('/api/auth/register', 'POST', {
    name: 'Fake Admin',
    email: `admin_${Date.now()}@university.edu`,
    password: password,
    role: 'admin'
  });
  console.log('Status:', adminRes.status);
  console.log('Message:', adminRes.body.message);
  if (adminRes.status !== 403) throw new Error('Admin registration was not blocked');

  // 4. Invalid Password Login
  console.log('\n[TEST 4] Testing login with incorrect password...');
  const badLoginRes = await request('/api/auth/login', 'POST', {
    email: testEmail,
    password: 'WrongPassword999!'
  });
  console.log('Status:', badLoginRes.status);
  console.log('Message:', badLoginRes.body.message);
  if (badLoginRes.status !== 401 || badLoginRes.body.message !== 'Invalid email or password.') {
    throw new Error('Expected 401 with generic "Invalid email or password."');
  }

  // 5. Valid Credentials Login
  console.log('\n[TEST 5] Testing login with valid credentials...');
  const goodLoginRes = await request('/api/auth/login', 'POST', {
    email: testEmail,
    password: password
  });
  console.log('Status:', goodLoginRes.status);
  console.log('User Name:', goodLoginRes.body.user?.name);
  console.log('User Role:', goodLoginRes.body.user?.role);
  console.log('Token received:', goodLoginRes.body.token ? 'YES (Valid JWT)' : 'NO');
  if (!goodLoginRes.body.token) throw new Error('Login failed to return token');

  const token = goodLoginRes.body.token;

  // 6. Accessing Protected Route /api/auth/me
  console.log('\n[TEST 6] Accessing protected /api/auth/me route with Bearer token...');
  const meRes = await request('/api/auth/me', 'GET', null, {
    'Authorization': `Bearer ${token}`
  });
  console.log('Status:', meRes.status);
  console.log('Authenticated User:', meRes.body.user?.name, 'Email:', meRes.body.user?.email);
  if (meRes.status !== 200 || meRes.body.user?.email !== testEmail) {
    throw new Error('Failed to retrieve authenticated user profile');
  }

  // 7. Profile Update
  console.log('\n[TEST 7] Updating authenticated user profile...');
  const updateRes = await request('/api/auth/profile', 'PUT', {
    name: 'Hariom Anand (Updated)'
  }, {
    'Authorization': `Bearer ${token}`
  });
  console.log('Status:', updateRes.status);
  console.log('Updated Name:', updateRes.body.user?.name);
  if (updateRes.body.user?.name !== 'Hariom Anand (Updated)') {
    throw new Error('Profile update failed');
  }

  console.log('\n ALL BACKEND AUTHENTICATION API TESTS PASSED SUCCESSFULLY! \n');
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
