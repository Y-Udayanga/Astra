(async () => {
  const res = await fetch('http://localhost:5173/api/payhere-hash', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 100, orderId: 'ORD-TEST-123' })
  });
  const text = await res.text();
  console.log('status', res.status, 'body', text);
})();
