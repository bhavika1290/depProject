const fs = require('fs');

async function testApi() {
  try {
    const offRes = await fetch('http://localhost:5000/api/offerings/open');
    const offData = await offRes.json();
    const offeringId = offData.data[0]._id;
    const adminCycleId = offData.data[0].admissionCycleId?._id;

    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@example.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;

    const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
    let body = '';
    const append = (name, value) => {
      body += '--' + boundary + '\r\n';
      body += 'Content-Disposition: form-data; name=\"' + name + '\"\r\n\r\n';
      body += value + '\r\n';
    };

    append('offeringId', offeringId);
    if(adminCycleId) append('admissionCycleId', adminCycleId);
    append('generalApplicationDetails', JSON.stringify({ interdisciplinaryProgram: false }));
    append('qualifyingExams', JSON.stringify([]));
    append('experienceDetails', JSON.stringify([]));
    append('publications', JSON.stringify([]));
    append('paymentDetails', JSON.stringify({ amount: 500 }));
    append('declarationAccepted', 'true');

    body += '--' + boundary + '\r\n';
    body += 'Content-Disposition: form-data; name=\"transactionSlip\"; filename=\"dummy.pdf\"\r\n';
    body += 'Content-Type: application/pdf\r\n\r\n';
    body += 'dummy content\r\n';
    body += '--' + boundary + '--\r\n';

    const res = await fetch('http://localhost:5000/api/applications', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: body
    });

    const out = await res.json();
    console.log(res.status, out);
  } catch (err) {
    console.log('ERROR:', err.message);
  }
}
testApi();
