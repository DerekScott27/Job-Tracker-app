const isProd = location.hostname === 'dancing-paletas-143806.netlify.app' || location.hostname.endsWith('netlify.app');

const API_BASE = isProd ? 'https://job-tracker-app-xy4e.onrender.com' : 'http://localhost:3001';

