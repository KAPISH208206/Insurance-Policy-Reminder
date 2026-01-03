
// Uses native fetch (Node 18+)
console.log('Checking Backend Health...');

try {
    const res = await fetch('http://localhost:5000/api/health');
    if (res.ok) {
        const data = await res.json();
        console.log('✅ Health Check Passed:', data);
    } else {
        console.log('❌ Health Check Failed:', res.status, res.statusText);
    }
} catch (err) {
    console.error('❌ Network Error:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
}
