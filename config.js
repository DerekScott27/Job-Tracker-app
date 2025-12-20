const isProd = location.hostname.endsWith('https://dancing-paletas-143806.netlify.app/');

const API_BASE = isProd ? 'postgresql://postgres_user:66XnTYhiG4gDD7FWMIFPvhPvmRcsDJG6@dpg-d52ru8emcj7s73as7ce0-a.oregon-postgres.render.com/job_tracker_db_9r1l' : 'http://localhost:3001';

